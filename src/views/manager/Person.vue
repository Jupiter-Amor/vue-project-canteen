<template>
  <div class="person-container">
    <div class="profile-card">
      <div class="profile-header">
        <h2>个人信息</h2>
        <p class="subtitle">Management Personal Profile</p>
      </div>

      <el-form :model="data.user" label-width="100px" class="profile-form">
        <el-form-item label="头像">
          <el-upload :show-file-list="false" class="avatar-uploader" @change="(file) => handleFileUpload(file)">
            <img v-if="data.user.avatar" :src="data.user.avatar" class="avatar" />
            <div v-else class="avatar-placeholder">
              <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
              <p>上传头像</p>
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="账号">
          <el-input disabled v-model="data.user.username" placeholder="账号（不可修改）" autocomplete="off" class="disabled-input" />
        </el-form-item>

        <el-form-item label="名称" required>
          <el-input v-model="data.user.name" placeholder="请输入您的名称" autocomplete="off" />
        </el-form-item>

        <el-form-item label="性别" v-if="data.user.role === 'USER'">
          <el-radio-group v-model="data.user.sex">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="手机" v-if="data.user.role === 'USER'">
          <el-input v-model="data.user.phone" placeholder="请输入您的手机号码" autocomplete="off" />
        </el-form-item>

        <el-form-item label="余额" v-if="data.user.role === 'USER'">
          <span class="balance-display">￥{{ parseFloat(data.user.account || 0).toFixed(2) }}</span>
        </el-form-item>

        <el-form-item class="save-button-wrapper">
          <el-button type="primary" @click="save" size="large" class="save-button">保存信息</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import {reactive} from "vue"
import request from "@/utils/request";
import {ElMessage} from "element-plus";
import { Plus } from '@element-plus/icons-vue'

const data = reactive({
  user: JSON.parse(localStorage.getItem('canteen-user') || '{}')
})

// 从服务器获取最新的用户信息（包括余额）
if (data.user && data.user.id) {
  const apiUrl = data.user.role === 'ADMIN' ? '/admin/selectById/' : '/user/selectById/'
  request.get(apiUrl + data.user.id).then(res => {
    if (res.code === '200' && res.data) {
      // 更新整个用户对象，确保余额等信息是最新的
      Object.assign(data.user, res.data)
      // 更新 localStorage 中的用户信息
      localStorage.setItem('canteen-user', JSON.stringify(data.user))
    }
  }).catch(err => {
    console.error('获取用户信息失败:', err)
  })
}

const handleFileUpload = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    data.user.avatar = e.target.result
  }
  reader.readAsDataURL(file.raw || file)
}

const emit = defineEmits(["updateUser"])

const save = () => {
  // API 已经保护了余额字段，所以可以直接更新
  if (data.user.role === 'ADMIN') {
    request.post('/admin/update', data.user).then(res => {
      if (res.code === '200') {
        // 更新成功后，重新获取最新信息（包括余额）
        const apiUrl = '/admin/selectById/'
        request.get(apiUrl + data.user.id).then(refreshRes => {
          if (refreshRes.code === '200' && refreshRes.data) {
            Object.assign(data.user, refreshRes.data)
            localStorage.setItem('canteen-user', JSON.stringify(data.user))
            emit('updateUser')
            ElMessage.success('更新成功')
          }
        })
      } else {
        ElMessage.error(res.msg)
      }
    })
  } else {
    request.post('/user/update', data.user).then(res => {
      if (res.code === '200') {
        // 更新成功后，重新获取最新信息（包括余额）
        const apiUrl = '/user/selectById/'
        request.get(apiUrl + data.user.id).then(refreshRes => {
          if (refreshRes.code === '200' && refreshRes.data) {
            Object.assign(data.user, refreshRes.data)
            localStorage.setItem('canteen-user', JSON.stringify(data.user))
            emit('updateUser')
            ElMessage.success('更新成功')
          }
        })
      } else {
        ElMessage.error(res.msg)
      }
    })
  }
}
</script>

<style scoped>
.person-container {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.profile-card {
  background: white;
  border: 1px solid #e8ecf1;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 500px;
}

.profile-header {
  text-align: center;
  margin-bottom: 32px;
  border-bottom: 2px solid #f0f1f5;
  padding-bottom: 20px;
}

.profile-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
}

.subtitle {
  margin: 0;
  color: #95a5a6;
  font-size: 12px;
  letter-spacing: 1px;
}

.profile-form {
  padding-right: 0;
}

:deep(.profile-form .el-form-item__label) {
  color: #2c3e50;
  font-weight: 500;
}

:deep(.profile-form .el-input__wrapper) {
  background-color: #f8f9fb;
  border: 1px solid #e8ecf1;
  transition: all 0.3s ease;
}

:deep(.profile-form .el-input__wrapper:hover) {
  border-color: #cbd5e0;
}

:deep(.profile-form .el-input__wrapper.is-focus) {
  border-color: #5b7dd5;
  box-shadow: 0 0 0 2px rgba(91, 125, 213, 0.1);
}

.disabled-input {
  opacity: 0.8;
}

.avatar-uploader {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

:deep(.avatar-uploader .el-upload) {
  width: 120px;
  height: 120px;
  border: 2px dashed #e8ecf1;
  border-radius: 10px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fb;
}

:deep(.avatar-uploader .el-upload:hover) {
  border-color: #5b7dd5;
  background-color: rgba(91, 125, 213, 0.05);
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: cover;
  border-radius: 8px;
}

.avatar-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #95a5a6;
}

.avatar-uploader-icon {
  font-size: 32px;
  color: #5b7dd5;
  margin-bottom: 8px;
}

.avatar-placeholder p {
  margin: 0;
  font-size: 12px;
  color: #95a5a6;
}

.balance-display {
  font-size: 18px;
  font-weight: 600;
  color: #e74c3c;
  padding: 8px 12px;
  background-color: rgba(231, 76, 60, 0.05);
  border-radius: 6px;
  border: 1px solid rgba(231, 76, 60, 0.2);
  display: inline-block;
}

.save-button-wrapper {
  margin-top: 32px !important;
}

.save-button {
  width: 100%;
  letter-spacing: 0.5px;
  font-weight: 500;
}
</style>