<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-header">
        <div class="logo-wrapper">
          <img src="@/assets/imgs/logo.png" alt="logo" class="logo">
        </div>
        <h1>餐饮管理系统</h1>
        <p>Catering Management System</p>
      </div>

      <div class="login-box">
        <h2 style="text-align: center; margin-bottom: 32px; color: #2c3e50; font-size: 20px; font-weight: 500">
          欢迎登录
        </h2>

        <el-form :model="data.form" ref="formRef" :rules="data.rules">
          <el-form-item prop="username">
            <el-input 
              :prefix-icon="User" 
              size="large" 
              v-model="data.form.username" 
              placeholder="请输入账号"
              class="login-input"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              :prefix-icon="Lock" 
              size="large" 
              v-model="data.form.password" 
              placeholder="请输入密码" 
              show-password
              class="login-input"
            />
          </el-form-item>
          <el-form-item>
            <el-button 
              size="large" 
              type="primary" 
              style="width: 100%; font-weight: 500; letter-spacing: 0.5px;" 
              @click="login">
              登 录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="register-link" style="text-align: center; margin-top: 20px; color: #7f8c8d; font-size: 14px">
          还没有账号？<a href="/register" style="color: #5b7dd5; font-weight: 500">立即注册</a>
        </div>
      </div>

      <div class="login-footer">
        <p>© 2025 餐饮管理系统 All Rights Reserved</p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { reactive, ref } from "vue";
  import { User, Lock } from "@element-plus/icons-vue";
  import request from "@/utils/request";
  import {ElMessage} from "element-plus";
  import router from "@/router";

  const data = reactive({
    form: { role: 'USER' },
    rules: {
      username: [
        { required: true, message: '请输入账号', trigger: 'blur' },
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
      ],
    }
  })

  const formRef = ref()

  const login = () => {
    formRef.value.validate((valid => {
      if (valid) {
        request.post('/login', data.form).then(res => {
          if (res.code === '200') {
            ElMessage.success("登录成功")
            router.push('/home-page/home')
            localStorage.setItem('canteen-user', JSON.stringify(res.data))
          } else {
            ElMessage.error(res.msg)
          }
        })
      }
    })).catch(error => {
      console.error(error)
    })
  }

</script>

<style scoped>
.login-container {
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.login-container::before {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  top: -100px;
  left: -50px;
  pointer-events: none;
}

.login-container::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 50%;
  bottom: -80px;
  right: -80px;
  pointer-events: none;
}

.login-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.logo-wrapper {
  margin-bottom: 20px;
}

.logo {
  width: 60px;
  height: 60px;
  filter: brightness(1.2);
}

.login-header h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.login-header p {
  margin: 8px 0 0 0;
  font-size: 14px;
  opacity: 0.9;
  letter-spacing: 1px;
}

.login-box {
  background: white;
  padding: 40px 36px;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
}

.login-input {
  --el-input-border-color: #e8ecf1;
}

:deep(.login-input .el-input__wrapper) {
  background-color: #f8f9fb;
  border: 1px solid #e8ecf1;
  transition: all 0.3s ease;
}

:deep(.login-input .el-input__wrapper:hover) {
  border-color: #cbd5e0;
  background-color: #f5f7fa;
}

:deep(.login-input .el-input__wrapper.is-focus) {
  border-color: #5b7dd5;
  background-color: #ffffff;
  box-shadow: 0 0 0 2px rgba(91, 125, 213, 0.1);
}

.login-footer {
  margin-top: 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
}

.login-footer p {
  margin: 0;
}
</style>