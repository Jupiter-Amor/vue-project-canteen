<template>
  <div class="order-manager-container">
    <!-- 搜索卡片 -->
    <div class="search-card">
      <div class="search-content">
        <el-input 
          prefix-icon="Search" 
          class="search-input"
          placeholder="查询订单" 
          v-model="data.userName"
          clearable
        />
        <div class="search-actions">
          <el-button type="primary" @click="load" class="action-btn">查询</el-button>
          <el-button plain @click="reset" class="action-btn">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 订单表格卡片 -->
    <div class="table-card">
      <el-table :data="data.tableData" stripe class="order-table">
        <el-table-column prop="id" label="序号" width="70" align="center"/>
        <el-table-column prop="orderNo" label="订单编号" min-width="120"/>
        <el-table-column prop="content" label="菜单内容" min-width="180" show-overflow-tooltip/>
        <el-table-column prop="total" label="订单总价" width="100" align="right">
          <template #default="scope">
            <span class="price-text">￥{{ scope.row.total.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名称" width="100"/>
        <el-table-column prop="createTime" label="下单时间" width="160" align="center"/>
        <el-table-column prop="servingTime" label="出餐时间" width="160" align="center"/>
        <el-table-column prop="settleTime" label="结算时间" width="160" align="center"/>
        <el-table-column prop="status" label="订单状态" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status === '待出餐'" type="info">{{ scope.row.status }}</el-tag>
            <el-tag v-if="scope.row.status === '待结算'" type="warning">{{ scope.row.status }}</el-tag>
            <el-tag v-if="scope.row.status === '已完成'" type="success">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="scope">
            <el-button 
              v-if="data.user.role === 'USER' && scope.row.status === '待结算'" 
              type="primary" 
              size="small"
              @click="done(scope.row)"
              class="action-btn-small"
            >结算</el-button>
            <el-button 
              v-if="data.user.role === 'ADMIN' && scope.row.status === '待出餐'" 
              type="primary" 
              size="small"
              @click="handleEdit(scope.row)"
              class="action-btn-small"
            >编辑</el-button>
            <el-button 
              v-if="data.user.role === 'ADMIN'" 
              type="danger" 
              size="small"
              @click="del(scope.row.id)"
              class="action-btn-small"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页卡片 -->
    <div class="pagination-card" v-if="data.total">
      <el-pagination 
        background 
        layout="total, prev, pager, next, jumper" 
        @current-change="load" 
        :page-size="data.pageSize" 
        v-model:current-page="data.pageNum" 
        :total="data.total"
        class="pagination-style"
      />
    </div>

    <!-- 编辑对话框 -->
    <el-dialog v-model="data.formVisible" title="编辑订单" width="450px" class="order-dialog" destroy-on-close>
      <el-form :model="data.form" label-width="100px" class="order-form">
        <el-form-item label="订单编号">
          <span>{{ data.form.orderNo }}</span>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select style="width: 100%" v-model="data.form.status" class="status-select">
            <el-option label="待出餐" value="待出餐"></el-option>
            <el-option label="待结算" value="待结算"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.formVisible = false">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {reactive} from "vue"
import request from "@/utils/request";
import {ElMessage, ElMessageBox} from "element-plus";

const data = reactive({
  user: JSON.parse(localStorage.getItem('canteen-user') || '{}'),
  tableData: [],
  total: 0,
  pageNum: 1,
  pageSize: 5,
  formVisible: false,
  form: {},
  userName: '',
})

const done = (row) => {
  // 结算时执行以下操作：
  // 1. 扣除用户余额
  // 2. 更新订单状态为已完成
  // 3. 释放餐桌
  let form = JSON.parse(JSON.stringify(row))
  form.status = '已完成'
  form.settleTime = new Date().toLocaleString()
  
  request.post('/orders/settle', form).then(res => {
    if (res.code === '200') {
      ElMessage.success('结算成功')
      load()
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const load = () => {
  request.get('/orders/selectPage', {
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      userName: data.userName,
      userId: data.user.role === 'USER' ? data.user.id : null
    }
  }).then(res => {
    data.tableData = res.data?.list || []
    data.total = res.data.total
  })
}

load()

const reset = () => {
  data.userName = null
  load()
}

const save = () => {
  // 当订单状态改为"待结算"时，记录出餐时间
  if (data.form.status === '待结算' && !data.form.servingTime) {
    data.form.servingTime = new Date().toLocaleString()
  }
  
  request.request({
    method: data.form.id ? 'PUT' : 'POST',
    url: data.form.id ? '/orders/update' : '/orders/add',
    data: data.form
  }).then(res => {
    if (res.code === '200') {
      ElMessage.success('操作成功')
      data.formVisible = false
      load()
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const handleEdit = (row) => {
  data.form = JSON.parse(JSON.stringify(row))
  data.formVisible = true
}

const del = (id) => {
  ElMessageBox.confirm('删除后数据无法恢复，您确认删除吗？', '确认删除', { type: 'warning' }).then(res => {
    request.delete('/orders/delete/' + id).then(res => {
      if (res.code === '200') {
        ElMessage.success('操作成功')
        load()
      } else {
        ElMessage.error(res.msg)
      }
    })
  }).catch(err => {
    console.log(err)
  })
}
</script>

<style scoped>
.order-manager-container {
  padding: 16px;
}

.search-card {
  background: white;
  border: 1px solid #e8ecf1;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-content {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  flex: 1;
  min-width: 250px;
}

:deep(.search-input .el-input__wrapper) {
  background-color: #f8f9fb;
  border: 1px solid #e8ecf1;
  transition: all 0.3s ease;
}

:deep(.search-input .el-input__wrapper:hover) {
  border-color: #cbd5e0;
}

:deep(.search-input .el-input__wrapper.is-focus) {
  border-color: #5b7dd5;
  box-shadow: 0 0 0 2px rgba(91, 125, 213, 0.1);
}

.search-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  letter-spacing: 0.5px;
}

.table-card {
  background: white;
  border: 1px solid #e8ecf1;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.order-table {
  width: 100%;
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
  padding: 12px 0;
}

:deep(.order-table tbody tr:hover > td) {
  background-color: #f8f9fb;
}

.price-text {
  color: #e74c3c;
  font-weight: 600;
}

.action-btn-small {
  font-size: 12px;
}

.pagination-card {
  background: white;
  border: 1px solid #e8ecf1;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
}

.pagination-style {
  display: flex;
  justify-content: center;
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

.order-form {
  padding-right: 20px;
}

:deep(.order-form .el-form-item__label) {
  color: #2c3e50;
  font-weight: 500;
}

.status-select {
  width: 100%;
}

:deep(.status-select .el-input__wrapper) {
  background-color: #f8f9fb;
  border: 1px solid #e8ecf1;
}

:deep(.status-select .el-input__wrapper.is-focus) {
  border-color: #5b7dd5;
  box-shadow: 0 0 0 2px rgba(91, 125, 213, 0.1);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>