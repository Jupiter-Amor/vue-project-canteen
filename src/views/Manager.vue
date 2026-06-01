<template>
  <div class="manager-container">
    <div class="manager-header">
      <div class="header-left">
        <img src="@/assets/imgs/logo.png" alt="logo" class="logo">
        <div class="system-title">
          <h1>餐饮管理系统</h1>
          <p>Catering Management System</p>
        </div>
      </div>
      <div class="header-right">
        <div class="user-info">
          <img :src="data.user?.avatar || defaultAvatar" alt="avatar" class="avatar">
          <div class="user-detail">
            <span class="user-name">{{ data.user?.name }}</span>
            <span class="user-role">{{ data.user?.role === 'ADMIN' ? '管理员' : '顾客' }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="manager-main">
      <div class="manager-sidebar">
        <el-menu
            router
            class="sidebar-menu"
            :default-active="$route.path"
            :default-openeds="['/home-page/home', '2']"
        >
          <el-menu-item index="/home-page/home">
            <el-icon><HomeFilled /></el-icon>
            <span>系统首页</span>
          </el-menu-item>
          <el-menu-item v-if="data.user.role === 'USER'" index="order" @click="handleOrderClick">
            <el-icon><Dish /></el-icon>
            <span>我的点餐</span>
          </el-menu-item>
          <el-menu-item index="/home-page/orderManager">
            <el-icon><List /></el-icon>
            <span>订单管理</span>
          </el-menu-item>

          <el-sub-menu index="2" v-if="data.user.role === 'ADMIN'">
            <template #title>
              <el-icon><User /></el-icon>
              <span>信息管理</span>
            </template>
            <el-menu-item index="/home-page/tables">
              <el-icon><Dish /></el-icon>
              <span>餐桌信息</span>
            </el-menu-item>
            <el-menu-item index="/home-page/foods">
              <el-icon><Bowl /></el-icon>
              <span>餐品信息</span>
            </el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="3" v-if="data.user.role === 'ADMIN'">
            <template #title>
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/home-page/admin">
              <el-icon><UserFilled /></el-icon>
              <span>管理员信息</span>
            </el-menu-item>
            <el-menu-item index="/home-page/user">
              <el-icon><UserFilled /></el-icon>
              <span>顾客信息</span>
            </el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/home-page/person">
            <el-icon><User /></el-icon>
            <span>个人资料</span>
          </el-menu-item>
          <el-menu-item index="login" @click="logout">
            <el-icon><SwitchButton /></el-icon>
            <span>退出系统</span>
          </el-menu-item>
        </el-menu>
      </div>

      <div class="manager-content">
        <router-view @updateUser="updateUser" />
      </div>

      <el-dialog v-model="data.noTableDialogShow" title="温馨提示" width="400" :show-close="false" align-center>
        <div class="dialog-content">
          <el-icon style="font-size: 48px; color: #f39c12; margin-bottom: 16px">
            <WarningFilled />
          </el-icon>
          <p style="margin: 12px 0; color: #2c3e50; font-size: 15px">您还未选择餐桌</p>
          <p style="margin: 12px 0; color: #7f8c8d; font-size: 13px">请先选择餐桌再进行点餐</p>
        </div>
        <template #footer>
          <el-button type="primary" @click="data.noTableDialogShow = false">明白了</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import {reactive} from "vue";
import { useRoute, useRouter } from 'vue-router'
import {User, UserFilled, WarningFilled, HomeFilled, Dish, List, Bowl} from "@element-plus/icons-vue";
import request from "@/utils/request";
const $route = useRoute()
const $router = useRouter()
const defaultAvatar = new URL('../assets/imgs/avatar.png', import.meta.url).href

const data = reactive({
  user: JSON.parse(localStorage.getItem('canteen-user') || '{}'),
  noTableDialogShow: false
})

const logout = () => {
  localStorage.removeItem('canteen-user')
  $router.push('/')
}

const updateUser = () => {
  data.user = JSON.parse(localStorage.getItem('canteen-user') || '{}')
}

const handleOrderClick = () => {
  // 检查是否选择了餐桌
  request.get('/tables/selectByUserId/' + data.user.id).then(res => {
    const table = res.data || {}
    if (!table.no) {
      data.noTableDialogShow = true
    } else {
      $router.push('/home-page/order')
    }
  })
}
</script>

<style scoped>
.manager-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;
}

/* 顶部头部 */
.manager-header {
  height: 72px;
  background: white;
  border-bottom: 1px solid #e8ecf1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  width: 40px;
  height: 40px;
}

.system-title h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.system-title p {
  margin: 0;
  font-size: 11px;
  color: #95a5a6;
  letter-spacing: 0.5px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.user-info:hover {
  background-color: #f8f9fb;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e8ecf1;
  object-fit: cover;
}

.user-detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
}

.user-role {
  font-size: 12px;
  color: #95a5a6;
}

/* 主体布局 */
.manager-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.manager-sidebar {
  width: 220px;
  background: white;
  border-right: 1px solid #e8ecf1;
  overflow-y: auto;
}

.sidebar-menu {
  border: none !important;
}

.manager-content {
  flex: 1;
  overflow: auto;
  padding: 20px 24px;
}

/* Element Plus 菜单样式覆盖 */
:deep(.sidebar-menu .el-menu-item) {
  color: #576574;
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
  margin: 4px 0;
}

:deep(.sidebar-menu .el-menu-item:hover) {
  background-color: #f8f9fb !important;
  color: #5b7dd5;
  border-left-color: #5b7dd5;
}

:deep(.sidebar-menu .el-menu-item.is-active) {
  background-color: #f0f3ff !important;
  color: #5b7dd5 !important;
  border-left-color: #5b7dd5 !important;
  font-weight: 500;
}

:deep(.sidebar-menu .el-sub-menu__title) {
  color: #576574;
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
  margin: 4px 0;
}

:deep(.sidebar-menu .el-sub-menu__title:hover) {
  background-color: #f8f9fb !important;
  color: #5b7dd5;
  border-left-color: #5b7dd5;
}

:deep(.sidebar-menu .el-sub-menu.is-active > .el-sub-menu__title) {
  color: #5b7dd5 !important;
  border-left-color: #5b7dd5 !important;
}

:deep(.el-table th) {
  background-color: #f8f9fb;
  color: #2c3e50;
  font-weight: 500;
  border-bottom: 1px solid #e8ecf1;
}

:deep(.el-table td) {
  border-bottom-color: #e8ecf1;
}

.dialog-content {
  text-align: center;
  padding: 12px 0;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #e8ecf1;
}
</style>