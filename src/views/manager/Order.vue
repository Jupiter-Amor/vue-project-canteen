<template>
  <div class="order-container">
    <div class="order-header-card">
      <div v-if="data.table.no">
        <div class="order-header-content">
          <div class="order-header-info">
            <h2 style="margin: 0; color: #2c3e50">餐桌 {{ data.table.no }}</h2>
            <p style="margin: 4px 0 0 0; color: #95a5a6; font-size: 14px">开始点餐</p>
          </div>
          <div class="order-header-actions">
            <el-button type="primary" plain @click="showOrderList" class="action-btn">查看已点餐品</el-button>
            <el-button type="danger" @click="removeOrder" class="action-btn">退桌</el-button>
          </div>
        </div>
      </div>
      <div v-else class="no-table-prompt">
        <el-icon style="font-size: 32px; color: #5b7dd5; margin-bottom: 8px">
          <Warning />
        </el-icon>
        <p style="margin: 0; color: #2c3e50; font-weight: 500">您还未选择餐桌</p>
        <p style="margin: 4px 0 0 0; color: #95a5a6; font-size: 14px">请先 <a href="/home-page/home" style="color: #5b7dd5; font-weight: 500">选择餐桌</a> 再点餐</p>
      </div>
    </div>

    <!-- 展示餐品 -->
    <div class="foods-grid">
      <div class="food-card" v-for="item in data.foodsList" :key="item.id">
        <div class="food-image-wrapper">
          <img :src="item.img" alt="" class="food-image">
          <div class="food-price-badge">￥{{ item.price }}</div>
        </div>
        <div class="food-info">
          <h3 class="food-name">{{ item.name }}</h3>
          <div class="food-description">
            <el-tooltip :content="item.descr" placement="bottom" effect="light" v-if="item.descr.length >= 20">
              <div class="food-descr-text">{{ item.descr }}</div>
            </el-tooltip>
            <div v-else class="food-descr-text">{{ item.descr }}</div>
          </div>
          <div class="food-actions">
            <el-input-number :min="1" v-model="item.num" size="small" class="quantity-input"></el-input-number>
            <el-button type="primary" @click="addOrder(item)" size="small" class="add-btn">加入</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单清单对话框 -->
    <el-dialog v-model="data.dialogShow" title="订单详情" width="700" class="order-dialog">
      <el-table :data="data.orderList" stripe class="order-table">
        <el-table-column label="菜品图片" width="80" align="center">
          <template #default="scope">
            <el-image style="width: 60px; height: 60px" :src="scope.row.img" :preview-src-list="[scope.row.img]" preview-teleported fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="菜品名称" />
        <el-table-column prop="price" label="单价" width="80" align="right" :formatter="(row) => '￥' + row.price" />
        <el-table-column label="数量" width="120" align="center">
          <template #default="scope">
            <div class="quantity-controls">
              <el-button size="small" type="text" @click="decreaseQuantity(scope.row)">-</el-button>
              <span class="quantity-display">{{ scope.row.num }}</span>
              <el-button size="small" type="text" @click="increaseQuantity(scope.row)">+</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="小计" width="100" align="right" :formatter="(row) => '￥' + (row.price * row.num).toFixed(2)" />
      </el-table>
      <div class="order-total-section">
        <span class="total-label">订单总额：</span>
        <span class="total-amount">￥{{ data.orderTotal.toFixed(2) }}</span>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.dialogShow = false">关闭</el-button>
          <el-button type="primary" @click="save">确认下单</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 无餐桌警告对话框 -->
    <el-dialog v-model="data.noTableDialogShow" title="提示" width="400" :show-close="false" align-center class="warning-dialog">
      <div class="warning-content">
        <el-icon class="warning-icon">
          <WarningFilled />
        </el-icon>
        <p class="warning-title">您尚未选择餐桌</p>
        <p class="warning-message">请先选择餐桌再点餐</p>
      </div>
      <template #footer>
        <el-button type="primary" @click="data.noTableDialogShow = false">
          <a href="/home-page/home" style="color: white; text-decoration: none">选择餐桌</a>
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {reactive, onMounted, onActivated} from "vue";
import request from "@/utils/request";
import {ElMessage} from "element-plus";
import { WarningFilled, Warning } from "@element-plus/icons-vue";

const data = reactive({
  table: {},
  user: JSON.parse(localStorage.getItem('canteen-user') || '{}'),
  foodsList: [],
  dialogShow: false,
  noTableDialogShow: false,
  orderList: [],
  total: 0,
  orderTotal: 0
})

// 更新订单总价
const updateOrderTotal = () => {
  data.total = data.orderList.map(item => item.num).reduce((acc, cur) => acc + cur, 0)
  data.orderTotal = 0
  data.orderList.forEach(item => {
    data.orderTotal += item.price * item.num
  })
}

// 增加数量
const increaseQuantity = (item) => {
  item.num += 1
  updateOrderTotal()
}

// 减少数量
const decreaseQuantity = (item) => {
  if (item.num > 1) {
    item.num -= 1
    updateOrderTotal()
  } else {
    const index = data.orderList.findIndex(o => o.id === item.id)
    if (index > -1) {
      data.orderList.splice(index, 1)
      updateOrderTotal()
      ElMessage.info('已移除该菜品')
    }
  }
}

const loadTable = () => {
  request.get('/tables/selectByUserId/' + data.user.id).then(res => {
    const table = res.data || {}
    data.table = table
    // 如果加载后仍然没有餐桌信息，可能是时序问题，延迟后重试一次
    // 这主要处理从 Home 页面跳转过来时，后端数据可能还未完全更新的情况
    if (!table.no) {
      setTimeout(() => {
        request.get('/tables/selectByUserId/' + data.user.id).then(res => {
          data.table = res.data || {}
        }).catch(err => {
          console.error('加载餐桌信息失败:', err)
        })
      }, 500)
    }
  }).catch(err => {
    console.error('加载餐桌信息失败:', err)
  })
}

// 组件挂载时加载餐桌信息
onMounted(() => {
  loadTable()
})

// 组件激活时重新加载餐桌信息（处理从其他页面跳转过来的情况）
onActivated(() => {
  loadTable()
})

const removeOrder = () => {
  request.post('/tables/removeOrder', data.table).then(res => {
    if (res.code === '200') {
      ElMessage.success('退桌成功')
      loadTable()
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const loadFoods = () => {
  request.get('/foods/selectAll').then(res => {
    data.foodsList = res.data || []
    data.foodsList.forEach(item => item.num = 1)
  })
}
loadFoods()

const showOrderList = () => {
  if (!data.table.no) {
    data.noTableDialogShow = true
    return
  }
  data.dialogShow = true
}

// 点餐的逻辑
const addOrder = (foods) => {
  if (!data.table.no) {
    data.noTableDialogShow = true
    return
  }
  
  let f = data.orderList.find(item => item.id === foods.id)
  if (f) {
    f.num += foods.num
  } else {
    let foods1 = JSON.parse(JSON.stringify(foods))
    data.orderList.push(foods1)
  }
  updateOrderTotal()
  ElMessage.success('点餐成功')
}

// 下单逻辑
const save = () => {
  if (data.orderList.length === 0) {
    ElMessage.warning('请选择餐品')
    return
  }
  let content = ''
  data.orderList.forEach(item => {
    content += item.name + 'x' + item.num + '，'
  })
  content = content.substring(0 , content.length - 1)
  let orderData = { content: content, total: data.orderTotal, userId: data.user.id, tableId: data.table.id, status: '待出餐'}
  request.post('/orders/add', orderData).then(res => {
    if (res.code === '200') {  // 下单成功
      ElMessage.success('下单成功，请等待出餐')
      data.dialogShow = false
      data.orderList = []
      data.total = 0
      data.orderTotal = 0
      // 刷新餐桌状态
      loadTable()
    } else {
      ElMessage.error(res.msg)
    }
  })
}
</script>

<style scoped>
.order-container {
  padding: 16px;
}

.order-header-card {
  background: white;
  border: 1px solid #e8ecf1;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.order-header-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.order-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-header-info {
  flex: 1;
}

.order-header-info h2 {
  font-size: 24px;
  font-weight: 600;
}

.order-header-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  letter-spacing: 0.5px;
}

.no-table-prompt {
  text-align: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.foods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 0 16px 16px 16px;
}

.food-card {
  background: white;
  border: 1px solid #e8ecf1;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.food-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border-color: #5b7dd5;
}

.food-image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: #f5f7fa;
}

.food-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.food-card:hover .food-image {
  transform: scale(1.05);
}

.food-price-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
}

.food-info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.food-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.food-description {
  flex: 1;
  margin-bottom: 12px;
}

.food-descr-text {
  font-size: 12px;
  color: #95a5a6;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.food-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.quantity-input {
  flex: 1;
}

.add-btn {
  flex-shrink: 0;
}

.order-dialog {
  --el-dialog-border-radius: 12px;
}

:deep(.order-dialog .el-dialog__header) {
  border-bottom: 1px solid #e8ecf1;
  padding: 20px 20px 16px;
}

:deep(.order-dialog .el-dialog__body) {
  padding: 20px;
}

.order-table {
  margin-bottom: 20px;
}

:deep(.order-table .el-table__header-wrapper) {
  background-color: #f8f9fb;
}

:deep(.order-table .el-table__header th) {
  background-color: #f8f9fb;
  color: #2c3e50;
  font-weight: 500;
  border-color: #e8ecf1;
}

:deep(.order-table .el-table__body td) {
  border-color: #e8ecf1;
}

:deep(.order-table tbody tr:hover > td) {
  background-color: #f8f9fb;
}

.order-total-section {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16px;
  background-color: #f8f9fb;
  border-radius: 8px;
  border: 1px solid #e8ecf1;
}

.total-label {
  color: #2c3e50;
  font-weight: 500;
  margin-right: 12px;
}

.total-amount {
  color: #e74c3c;
  font-size: 20px;
  font-weight: 600;
}

.warning-dialog {
  --el-dialog-border-radius: 12px;
}

.warning-content {
  text-align: center;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.warning-icon {
  font-size: 48px;
  color: #e74c3c;
  margin-bottom: 16px;
}

.warning-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
}

.warning-message {
  margin: 0;
  font-size: 14px;
  color: #95a5a6;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.quantity-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.quantity-display {
  min-width: 30px;
  text-align: center;
  font-weight: 500;
  color: #2c3e50;
}

:deep(.quantity-controls .el-button) {
  color: #5b7dd5;
  font-size: 16px;
  padding: 0 6px;
  height: auto;
  margin: 0;
}

:deep(.quantity-controls .el-button:hover) {
  color: #667eea;
}
</style>