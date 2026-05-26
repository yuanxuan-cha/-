<template>
  <!-- 头部组件 - 包含顶部栏、主Logo区、导航菜单 -->
  <header class="header">
    
    <!-- 顶部栏 - 站点信息和用户入口 -->
    <div class="header-top">
      <div class="header-top-content">
        <div class="top-links">
          <!-- 站点名称 -->
          <span class="site-name">半页故事</span>
          <!-- 分站链接 -->
          <a href="#" class="sub-site">繁体字</a>
        </div>
        <div class="top-actions">
          <!-- 未登录状态显示登录注册链接 -->
          <router-link v-if="!isLoggedIn" to="/login" class="top-link">登录</router-link>
          <span v-if="!isLoggedIn" class="divider">|</span>
          <router-link v-if="!isLoggedIn" to="/register" class="top-link">注册</router-link>
          <!-- 已登录状态显示书架和个人信息 -->
          <router-link v-if="isLoggedIn" to="/bookshelf" class="top-link">我的书架</router-link>
          <span v-if="isLoggedIn" class="divider">|</span>
          <span v-if="isLoggedIn" class="user-info">{{ username }}</span>
          <span v-if="isLoggedIn" class="divider">|</span>
          <button v-if="isLoggedIn" @click="logout" class="logout-btn">退出</button>
        </div>
      </div>
    </div>

    <!-- 主Logo和搜索区 -->
    <div class="header-main">
      <div class="header-main-content">
        <!-- Logo区域 -->
        <router-link to="/" class="logo">
          <span class="logo-text">半页故事</span>
        </router-link>
        
        <!-- 搜索框 -->
        <div class="search-box">
          <input 
            type="text" 
            class="search-input" 
            placeholder="搜索小说、作者"
            v-model="searchKeyword"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">搜索</button>
        </div>
        
        <!-- 用户快捷操作 -->
        <div class="user-actions">
          <router-link to="/bookshelf" class="action-icon">
            <span>📖</span>
            <span class="action-text">书架</span>
          </router-link>
        </div>

        <!-- 移动端菜单按钮 -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <span v-if="!mobileMenuOpen">☰</span>
          <span v-else>✕</span>
        </button>
      </div>
    </div>

    <!-- 导航菜单 - PC端显示 -->
    <div class="header-nav" :class="{ 'mobile-open': mobileMenuOpen }">
      <div class="nav-content">
        <router-link to="/" class="nav-item">首页</router-link>
        
        <!-- 分类下拉菜单 -->
        <div class="category-dropdown" :class="{ 'mobile-open': categoryDropdownOpen }">
          <span class="nav-item" @click="toggleCategoryDropdown">全部作品 ▼</span>
          <div class="dropdown-menu">
            <a href="#">玄幻</a>
            <a href="#">奇幻</a>
            <a href="#">武侠</a>
            <a href="#">仙侠</a>
            <a href="#">都市</a>
            <a href="#">历史</a>
            <a href="#">军事</a>
            <a href="#">游戏</a>
            <a href="#">竞技</a>
            <a href="#">科幻</a>
            <a href="#">悬疑</a>
            <a href="#">短篇小说</a>
          </div>
        </div>
        
        <router-link to="/category" class="nav-item">分类</router-link>
        <router-link to="/rank" class="nav-item">排行榜</router-link>
        <router-link to="/recommend" class="nav-item">推荐</router-link>
        <router-link to="/complete" class="nav-item">完本</router-link>
        <router-link to="/free" class="nav-item">免费</router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
/**
 * Header 组件
 * 功能：网站头部导航，包含Logo、搜索框、导航菜单
 * 作者：24计科10班
 * 日期：2026年
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 用户登录状态
const isLoggedIn = ref(false)
const username = ref('')
const searchKeyword = ref('')

// 移动端菜单展开状态
const mobileMenuOpen = ref(false)
// 移动端分类下拉菜单展开状态
const categoryDropdownOpen = ref(false)

/**
 * 切换移动端菜单显示/隐藏
 */
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

/**
 * 切换移动端分类下拉菜单显示/隐藏
 */
const toggleCategoryDropdown = () => {
  categoryDropdownOpen.value = !categoryDropdownOpen.value
}

/**
 * 执行搜索
 */
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchKeyword.value.trim())}`)
  }
}

/**
 * 退出登录
 * 清除用户信息并跳转到首页
 */
const logout = () => {
  localStorage.removeItem('user')
  isLoggedIn.value = false
  username.value = ''
  window.location.href = '/'
}

/**
 * 组件挂载时检查用户登录状态
 * 从 localStorage 中读取用户信息
 */
onMounted(() => {
  const user = localStorage.getItem('user')
  if (user) {
    isLoggedIn.value = true
    username.value = JSON.parse(user).username
  }
})
</script>

<style scoped>
/* ===================================
   头部整体样式
   =================================== */

.header {
  background: var(--bg-white);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* ===================================
   顶部栏样式
   =================================== */

.header-top {
  background: #f8f8f8;
  border-bottom: 1px solid var(--border-color);
}

.header-top-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px;
  font-size: 12px;
}

.top-links {
  display: flex;
  gap: 16px;
  align-items: center;
}

.site-name {
  color: var(--primary-color);
  font-weight: bold;
}

.sub-site {
  color: var(--text-secondary);
  text-decoration: none;
  transition: var(--transition);
}

.sub-site:hover {
  color: var(--primary-color);
}

.top-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.top-link {
  color: var(--text-color);
  text-decoration: none;
  transition: var(--transition);
}

.top-link:hover {
  color: var(--primary-color);
}

.divider {
  color: #ddd;
}

.user-info {
  color: var(--text-color);
}

.logout-btn {
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 12px;
  cursor: pointer;
  padding: 0;
  transition: var(--transition);
}

.logout-btn:hover {
  color: var(--primary-color);
}

/* ===================================
   主Logo和搜索区样式
   =================================== */

.header-main {
  background: var(--bg-white);
}

.header-main-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  gap: 20px;
}

.logo {
  text-decoration: none;
  flex-shrink: 0;
}

.logo-text {
  font-size: 32px;
  font-weight: bold;
  color: var(--primary-color);
  letter-spacing: 2px;
}

/* 搜索框样式 */
.search-box {
  display: flex;
  flex: 1;
  max-width: 480px;
  border: 2px solid var(--primary-color);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  outline: none;
  font-size: 14px;
  min-width: 0;
}

.search-input:focus {
  background: #f9f9f9;
}

.search-btn {
  background: var(--primary-color);
  color: var(--bg-white);
  border: none;
  padding: 12px 32px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: var(--transition);
  flex-shrink: 0;
}

.search-btn:hover {
  background: var(--primary-hover);
}

/* 用户快捷操作 */
.user-actions {
  display: flex;
  gap: 20px;
  flex-shrink: 0;
}

.action-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 12px;
  transition: var(--transition);
}

.action-icon:hover {
  color: var(--primary-color);
}

.action-icon span:first-child {
  font-size: 24px;
  margin-bottom: 4px;
}

/* 移动端菜单按钮 - 默认隐藏 */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-color);
  padding: 8px;
  cursor: pointer;
}

/* ===================================
   导航菜单样式
   =================================== */

.header-nav {
  background: var(--primary-color);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 0;
  padding: 0 20px;
}

.nav-item {
  color: var(--bg-white);
  text-decoration: none;
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 500;
  transition: var(--transition);
  display: block;
  white-space: nowrap;
}

.nav-item:hover {
  background: var(--primary-hover);
}

.nav-item.router-link-active {
  background: var(--primary-hover);
}

/* 分类下拉菜单 */
.category-dropdown {
  position: relative;
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--bg-white);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 12px 0;
  min-width: 180px;
  z-index: 1001;
  border-radius: var(--border-radius);
}

.category-dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-menu a {
  display: block;
  padding: 10px 20px;
  color: var(--text-color);
  text-decoration: none;
  font-size: 14px;
  transition: var(--transition);
}

.dropdown-menu a:hover {
  background: #f5f5f5;
  color: var(--primary-color);
}

/* ===================================
   响应式设计 - 平板端
   =================================== */
@media (max-width: 1024px) {
  .logo-text {
    font-size: 28px;
  }
  
  .search-box {
    max-width: 350px;
  }
  
  .nav-item {
    padding: 12px 16px;
    font-size: 14px;
  }
}

/* ===================================
   响应式设计 - 移动端
   =================================== */
@media (max-width: 768px) {
  .header-top-content {
    padding: 8px 12px;
    font-size: 11px;
  }
  
  .top-links {
    gap: 12px;
  }
  
  .header-main-content {
    padding: 12px;
    gap: 12px;
  }
  
  .logo-text {
    font-size: 20px;
  }
  
  .search-box {
    max-width: 180px;
  }
  
  .search-btn {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .user-actions {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .header-nav {
    display: none;
  }
  
  .header-nav.mobile-open {
    display: block;
  }
  
  .nav-content {
    flex-direction: column;
    padding: 0;
  }
  
  .nav-item {
    padding: 12px 20px;
    font-size: 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .dropdown-menu {
    position: static;
    box-shadow: none;
    background: rgba(0, 0, 0, 0.1);
  }
  
  .dropdown-menu a {
    padding: 8px 20px;
    color: var(--bg-white);
  }
  
  .dropdown-menu a:hover {
    background: rgba(0, 0, 0, 0.1);
    color: var(--bg-white);
  }
  
  .category-dropdown:hover .dropdown-menu {
    display: none;
  }
  
  .category-dropdown.mobile-open .dropdown-menu {
    display: block;
  }
}

/* ===================================
   响应式设计 - 小屏移动端
   =================================== */
@media (max-width: 480px) {
  .logo-text {
    font-size: 18px;
  }
  
  .search-box {
    max-width: 140px;
  }
  
  .search-input {
    padding: 10px 12px;
    font-size: 13px;
  }
  
  .search-btn {
    padding: 10px 12px;
    font-size: 12px;
  }
}
</style>
