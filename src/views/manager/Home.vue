<template>
  <div class="home-container">
    <div class="welcome-card">
      <div class="welcome-text">
        <span class="welcome-label">欢迎您，</span>
        <span class="welcome-name">{{ user.name }}</span>
        <span class="welcome-wish">祝您用餐愉快！</span>
      </div>
    </div>

    <div class="tables-section">
      <h2 class="section-title">餐厅餐桌</h2>
      <div class="tables-grid">
        <div v-for="item in data.tables" :key="item.id" class="table-card">
          <div class="table-image">
            <img src="@/assets/imgs/餐饮.png" alt="table">
          </div>
          <div class="table-info">
            <h3 class="table-name">{{ item.no }}</h3>
            <p class="table-capacity">{{ item.unit }}可用餐</p>
            <div class="table-status">
              <span v-if="item.free === '是'" class="status-free">
                <span class="status-dot"></span>空闲
              </span>
              <span v-else class="status-occupied">
                <span class="status-dot"></span>占用
              </span>
            </div>
            <div v-if="item.free === '是' && user.role === 'USER'" class="table-action">
              <el-button type="primary" @click="addOrder(item)" size="small">开始点餐</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {reactive} from "vue";
import request from "@/utils/request";
import router from "@/router";
import {ElMessage} from "element-plus";

const user = JSON.parse(localStorage.getItem('canteen-user') || '{}')

const data = reactive({
  tables: []
})

const loadTables = () => {
  request.get('/tables/selectAll').then(res => {
    data.tables = res.data || []
  })
}
loadTables()

// 订餐  修改餐桌的状态
const addOrder = (item) => {
  item.userId = user.id
  request.post('/tables/addOrder', item).then(res => {
    if (res.code === '200') {
      ElMessage.success('选择餐桌成功')
      // 使用 nextTick 确保数据更新完成后再跳转
      setTimeout(() => {
        router.push('/home-page/order')
      }, 100)
    } else {
      ElMessage.error(res.msg)
    }
  }).catch(err => {
    ElMessage.error('选择餐桌失败，请重试')
    console.error(err)
  })
}

</script>

<style scoped>
.home-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 28px 32px;
  border-radius: 12px;
  margin-bottom: 28px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.welcome-text {
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.welcome-label {
  opacity: 0.9;
}

.welcome-name {
  font-weight: 600;
  margin: 0 4px;
}

.welcome-wish {
  opacity: 0.85;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e8ecf1;
}

.tables-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.table-card {
  background: white;
  border: 1px solid #e8ecf1;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.table-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e0;
}

.table-image {
  margin-bottom: 12px;
}

.table-image img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.table-info {
  width: 100%;
}

.table-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.table-capacity {
  margin: 6px 0 10px 0;
  font-size: 12px;
  color: #95a5a6;
}

.table-status {
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
}

.status-free {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #27ae60;
  font-size: 13px;
  font-weight: 500;
}

.status-occupied {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #e74c3c;
  font-size: 13px;
  font-weight: 500;
}

.status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}

.table-action {
  width: 100%;
}
</style>