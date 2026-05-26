<template>
  <!-- 注册页面组件 -->
  <div class="register-page">
    <div class="register-container">
      <!-- 页面标题 -->
      <div class="register-header">
        <h2>注册半页故事</h2>
        <p>加入我们，开启阅读之旅</p>
      </div>

      <!-- 注册表单 -->
      <form @submit.prevent="onSubmit" class="register-form">
        <div class="form-group">
          <label>用户名</label>
          <input 
            v-model="formData.username" 
            type="text" 
            placeholder="请输入用户名（3-20位）"
            required
          />
          <span v-if="errors.username" class="error">{{ errors.username }}</span>
        </div>

        <div class="form-group">
          <label>邮箱</label>
          <input 
            v-model="formData.email" 
            type="email" 
            placeholder="请输入邮箱"
            required
          />
          <span v-if="errors.email" class="error">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label>密码</label>
          <input 
            v-model="formData.password" 
            type="password" 
            placeholder="请输入密码（6位以上）"
            required
          />
          <span v-if="errors.password" class="error">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label>确认密码</label>
          <input 
            v-model="formData.confirmPassword" 
            type="password" 
            placeholder="请再次输入密码"
            required
          />
          <span v-if="errors.confirmPassword" class="error">{{ errors.confirmPassword }}</span>
        </div>

        <div class="form-options">
          <label class="checkbox-label">
            <input type="checkbox" v-model="agreeTerms" required />
            <span>我已阅读并同意</span>
          </label>
          <a href="#" class="terms-link">《用户协议》和《隐私政策》</a>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="loading || !agreeTerms">
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </div>

        <div class="login-tip">
          已有账号？
          <router-link to="/login" class="login-link">立即登录</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
/**
 * 注册页面逻辑
 * 功能：处理用户注册、表单验证、错误提示
 */
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

// 路由实例
const router = useRouter()
// 加载状态
const loading = ref(false)
// 同意用户协议状态
const agreeTerms = ref(false)

// 表单数据
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 错误信息
const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

/**
 * 邮箱格式验证
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否为有效邮箱格式
 */
const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  return re.test(email)
}

const onSubmit = async () => {
  errors.username = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  if (!formData.username) {
    errors.username = '请输入用户名'
    return
  }
  if (formData.username.length < 3 || formData.username.length > 20) {
    errors.username = '用户名长度必须在3-20位之间'
    return
  }

  if (!formData.email) {
    errors.email = '请输入邮箱'
    return
  }
  if (!validateEmail(formData.email)) {
    errors.email = '邮箱格式不正确'
    return
  }

  if (!formData.password) {
    errors.password = '请输入密码'
    return
  }
  if (formData.password.length < 6) {
    errors.password = '密码至少6位'
    return
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = '请确认密码'
    return
  }
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = '两次密码不一致'
    return
  }

  loading.value = true
  
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    if (users.find(u => u.username === formData.username)) {
      errors.username = '用户名已存在'
    } else {
      users.push({ 
        username: formData.username, 
        password: formData.password, 
        email: formData.email 
      })
      localStorage.setItem('users', JSON.stringify(users))
      alert('注册成功')
      router.push('/login')
    }
  } catch (error) {
    alert('注册失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ===================================
   注册页面整体布局
   =================================== */

.register-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: var(--bg-white);
}

/* 注册表单容器 */
.register-container {
  width: 100%;
  max-width: 420px;
  background: var(--bg-white);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* 页面标题区域 */
.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-header h2 {
  font-size: 28px;
  color: var(--text-color);
  margin: 0 0 8px;
}

.register-header p {
  font-size: 14px;
  color: var(--text-light);
  margin: 0;
}

/* 表单样式 */
.register-form {
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
  padding: 8px 0;
  font-size: 14px;
  line-height: 1.6;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input {
  margin-top: 4px;
}

.terms-link {
  color: var(--primary-color);
  text-decoration: none;
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

/* 登录提示 */
.login-tip {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: var(--text-secondary);
}

.login-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

/* ===================================
   响应式设计 - 平板端
   =================================== */
@media (max-width: 768px) {
  .register-container {
    padding: 32px 24px;
    margin: 0 16px;
  }

  .register-header h2 {
    font-size: 24px;
  }
}

/* ===================================
   响应式设计 - 小屏移动端
   =================================== */
@media (max-width: 480px) {
  .register-page {
    padding: 20px 12px;
  }

  .register-container {
    padding: 24px 16px;
  }

  .register-header h2 {
    font-size: 22px;
  }

  .btn-primary {
    font-size: 14px;
    padding: 12px;
  }
}
</style>
