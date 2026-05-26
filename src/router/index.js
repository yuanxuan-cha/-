import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home/Home.vue'
import Login from '@/views/login/Login.vue'
import Register from '@/views/register/Register.vue'
import Category from '@/views/category/Category.vue'
import Rank from '@/views/rank/Rank.vue'
import Recommend from '@/views/recommend/Recommend.vue'
import Complete from '@/views/complete/Complete.vue'
import Free from '@/views/free/Free.vue'
import Detail from '@/views/detail/Detail.vue'
import Bookshelf from '@/views/bookshelf/Bookshelf.vue'
import Reader from '@/views/reader/Reader.vue'
import Search from '@/views/search/Search.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { title: '注册' }
  },
  {
    path: '/category',
    name: 'Category',
    component: Category,
    meta: { title: '分类' }
  },
  {
    path: '/rank',
    name: 'Rank',
    component: Rank,
    meta: { title: '排行榜' }
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: Recommend,
    meta: { title: '推荐' }
  },
  {
    path: '/complete',
    name: 'Complete',
    component: Complete,
    meta: { title: '完本' }
  },
  {
    path: '/free',
    name: 'Free',
    component: Free,
    meta: { title: '免费' }
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: Detail,
    meta: { title: '小说详情' }
  },
  {
    path: '/bookshelf',
    name: 'Bookshelf',
    component: Bookshelf,
    meta: { title: '我的书架' }
  },
  {
    path: '/reader/:novelId/:chapterId',
    name: 'Reader',
    component: Reader,
    meta: { title: '阅读' }
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    meta: { title: '搜索' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 半页故事` : '半页故事'
  next()
})

export default router
