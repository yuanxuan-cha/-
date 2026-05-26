<template>
  <!-- 登录页面组件 -->
  <div class="login-page">
    <div class="login-container">
      <!-- 页面标题 -->
      <div class="login-header">
        <h2>登录半页故事</h2>
        <p>欢迎回来，开始您的阅读之旅</p>
      </div>

      <!-- 登录表单 -->
      <form @submit.prevent="onSubmit" class="login-form">
        <div class="form-group">
          <label>用户名</label>
          <input 
            v-model="formData.username" 
            type="text" 
            placeholder="请输入用户名"
            required
          />
          <span v-if="errors.username" class="error">{{ errors.username }}</span>
        </div>

        <div class="form-group">
          <label>密码</label>
          <input 
            v-model="formData.password" 
            type="password" 
            placeholder="请输入密码"
            required
          />
          <span v-if="errors.password" class="error">{{ errors.password }}</span>
        </div>

        <div class="form-options">
          <label class="checkbox-label">
            <input type="checkbox" v-model="rememberMe" />
            <span>记住我</span>
          </label>
          <a href="#" class="forgot-link">忘记密码？</a>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </div>

        <div class="register-tip">
          还没有账号？
          <router-link to="/register" class="register-link">立即注册</router-link>
        </div>
      </form>

      <div class="social-login">
        <p>其他登录方式</p>
        <div class="social-icons">
          <span class="social-icon">💬</span>
          <span class="social-icon">📱</span>
          <span class="social-icon">🐧</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 登录页面逻辑
 * 功能：处理用户登录、表单验证、错误提示
 */
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

// 路由实例
const router = useRouter()
// 加载状态
const loading = ref(false)
// 记住我状态
const rememberMe = ref(false)

// 表单数据
const formData = reactive({
  username: '',
  password: ''
})

// 错误信息
const errors = reactive({
  username: '',
  password: ''
})

/**
 * 表单提交处理函数
 * 验证表单数据并执行登录操作
 */
const onSubmit = async () => {
  errors.username = ''
  errors.password = ''

  if (!formData.username) {
    errors.username = '请输入用户名'
    return
  }
  if (!formData.password) {
    errors.password = '请输入密码'
    return
  }

  loading.value = true
  
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.username === formData.username && u.password === formData.password)
    
    if (user) {
      localStorage.setItem('user', JSON.stringify({ username: formData.username }))
      alert('登录成功')
      router.push('/')
    } else {
      errors.password = '用户名或密码错误'
    }
  } catch (error) {
    alert('登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ===================================
   登录页面整体布局
   =================================== */

.login-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: var(--bg-white);
}

/* 登录表单容器 */
.login-container {
  width: 100%;
  max-width: 420px;
  background: var(--bg-white);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* 页面标题区域 */
.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h2 {
  font-size: 28px;
  color: var(--text-color);
  margin: 0 0 8px;
}

.login-header p {
  font-size: 14px;
  color: var(--text-light);
  margin: 0;
}

/* 表单样式 */
.login-form {
  margin-top: 24px;
}

/* 表单分组 */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: var(--text-color);
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: var(--transition);
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: var(--primary-color);
}

.form-group input::placeholder {
  color: #ccc;
}

/* 错误提示 */
.error {
  display: block;
  color: var(--primary-color);
  font-size: 12px;
  margin-top: 4px;
}

/* 表单选项区域 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
}

.checkbox-label input {
  width: 16px;
  height: 16px;
}

.forgot-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
}

/* 提交按钮 */
.form-actions {
  margin-top: 24px;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: var(--primary-color);
  color: var(--bg-white);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: var(--transition);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 注册提示 */
.register-tip {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: var(--text-secondary);
}

.register-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

/* 社交登录区域 */
.social-login {
  margin-top: 40px;
  text-align: center;
}

.social-login p {
  font-size: 14px;
  color: var(--text-light);
  margin: 0 0 16px;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 32px;
}

.social-icon {
  font-size: 32px;
  cursor: pointer;
  transition: var(--transition);
}

.social-icon:hover {
  transform: scale(1.1);
}

/* ===================================
   响应式设计 - 平板端
   =================================== */
@media (max-width: 768px) {
  .login-container {
    padding: 32px 24px;
    margin: 0 16px;
  }

  .login-header h2 {
    font-size: 24px;
  }
}

/* ===================================
   响应式设计 - 小屏移动端
   =================================== */
@media (max-width: 480px) {
  .login-page {
    padding: 20px 12px;
  }

  .login-container {
    padding: 24px 16px;
  }

  .login-header h2 {
    font-size: 22px;
  }

  .btn-primary {
    font-size: 14px;
    padding: 12px;
  }
}
</style>
