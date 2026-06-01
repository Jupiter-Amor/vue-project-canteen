<template>
  <div class="welcome-container">
    <!-- 顶部导航栏 -->
    <nav class="navbar">
      <div class="navbar-content">
        <div class="navbar-left">
          <img src="@/assets/imgs/logo.png" alt="logo" class="navbar-logo">
          <h1 class="navbar-title">在线点餐系统</h1>
        </div>
        <div class="navbar-right">
          <el-button type="primary" text @click="goToLogin">登录</el-button>
          <el-button type="primary" @click="goToRegister">注册</el-button>
        </div>
      </div>
    </nav>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 横幅区 -->
      <div class="banner">
        <div class="banner-text">
          <h2>欢迎来到我们的餐厅</h2>
          <p>轻松点餐，享受美食</p>
          <el-button type="primary" size="large" @click="goToLogin">开始点餐</el-button>
        </div>
        <img src="@/assets/imgs/餐饮.png" alt="banner" class="banner-img">
      </div>

      <!-- 公告区 -->
      <div class="notice-section">
        <div class="notice-card">
          <h3>📢 最新公告</h3>
          <p>欢迎使用我们的在线点餐系统，选择您喜爱的餐品，享受便捷用餐体验</p>
        </div>
      </div>

      <!-- 使用指南 -->
      <div class="guide-section">
        <h2>如何使用</h2>
        <div class="guide-steps">
          <div class="step">
            <div class="step-number">1</div>
            <h3>登录/注册</h3>
            <p>使用账号登录或注册新账号</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>选择餐桌</h3>
            <p>从可用餐桌中选择您的就餐位置</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>浏览菜单</h3>
            <p>浏览所有可用的餐品并选择您的喜爱</p>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <h3>确认订单</h3>
            <p>确认订单详情并提交下单</p>
          </div>
        </div>
      </div>

      <!-- 联系信息 -->
      <div class="contact-section">
        <h2>联系我们</h2>
        <div class="contact-info">
          <p>📍 地址：服务区</p>
          <p>📞 电话：欢迎咨询</p>
          <p>⏰ 营业时间：周一至周日 10:00-22:00</p>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <p>&copy; 2025 在线点餐系统 | 所有权利保留</p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.welcome-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
}

/* 导航栏 */
.navbar {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.navbar-logo {
  width: 40px;
  height: 40px;
}

.navbar-title {
  font-size: 24px;
  font-weight: bold;
  color: #1450aa;
  margin: 0;
}

.navbar-right {
  display: flex;
  gap: 10px;
}

/* 主内容区 */
.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

/* 横幅区 */
.banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 60px 40px;
  margin: 30px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  gap: 40px;
}

.banner-text h2 {
  font-size: 36px;
  margin: 0 0 15px 0;
  font-weight: bold;
}

.banner-text p {
  font-size: 18px;
  margin: 0 0 30px 0;
  opacity: 0.9;
}

.banner-img {
  width: 300px;
  height: 300px;
  object-fit: contain;
  flex-shrink: 0;
}

/* 公告区 */
.notice-section {
  margin: 30px 0;
}

.notice-card {
  background-color: #fef6e4;
  border-left: 4px solid #f59e0b;
  padding: 20px;
  border-radius: 6px;
}

.notice-card h3 {
  margin: 0 0 10px 0;
  color: #d97706;
  font-size: 16px;
}

.notice-card p {
  margin: 0;
  color: #666;
}

/* 使用指南 */
.guide-section {
  margin: 50px 0;
}

.guide-section h2 {
  font-size: 28px;
  color: #1450aa;
  margin-bottom: 30px;
}

.guide-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.step {
  background: white;
  padding: 30px 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.step:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  font-size: 24px;
  font-weight: bold;
  margin: 0 auto 15px;
}

.step h3 {
  color: #1450aa;
  margin: 0 0 10px 0;
  font-size: 18px;
}

.step p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

/* 联系信息 */
.contact-section {
  margin: 50px 0;
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.contact-section h2 {
  font-size: 28px;
  color: #1450aa;
  margin: 0 0 20px 0;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.contact-info p {
  color: #666;
  margin: 0;
  font-size: 16px;
}

/* 页脚 */
.footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 30px 20px;
  margin-top: 50px;
}

.footer p {
  margin: 0;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .banner {
    flex-direction: column;
    padding: 40px 20px;
  }

  .banner-img {
    width: 200px;
    height: 200px;
  }

  .banner-text h2 {
    font-size: 24px;
  }

  .banner-text p {
    font-size: 16px;
  }

  .guide-section h2,
  .contact-section h2 {
    font-size: 22px;
  }

  .guide-steps {
    grid-template-columns: repeat(2, 1fr);
  }

  .navbar-title {
    font-size: 18px;
  }

  .contact-info {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .navbar-content {
    flex-direction: column;
    height: auto;
    gap: 10px;
    padding: 10px 20px;
  }

  .banner {
    padding: 20px;
    gap: 20px;
  }

  .banner-text h2 {
    font-size: 20px;
  }

  .guide-steps {
    grid-template-columns: 1fr;
  }

  .contact-section {
    padding: 20px;
  }
}
</style>
