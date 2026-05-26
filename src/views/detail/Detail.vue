<template>
  <div class="detail-page">
    <div class="novel-header">
      <div class="header-bg" :style="{ backgroundImage: `url(${novel.cover})` }"></div>
      <div class="header-content">
        <img v-lazy="novel.cover" :alt="novel.title" class="novel-cover" />
        <div class="novel-info">
          <h1 class="novel-title">{{ novel.title }}</h1>
          <p class="novel-author">{{ novel.author }}</p>
          <div class="novel-meta">
            <span class="category-tag">{{ novel.category }}</span>
            <span :class="['status-tag', novel.status === '完结' ? 'completed' : 'ongoing']">
              {{ novel.status }}
            </span>
          </div>
          <div class="novel-stats">
            <div class="stat-item">
              <span class="stat-value">{{ formatNumber(novel.views) }}</span>
              <span class="stat-label">阅读</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ novel.chapters }}</span>
              <span class="stat-label">章节</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ novel.rating }}</span>
              <span class="stat-label">评分</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="novel-actions">
      <button class="btn-primary" @click="startReading">
        开始阅读
      </button>
      <div class="action-icons">
        <span 
          class="action-icon" 
          :class="{ active: isFavorite }"
          @click="toggleFavorite"
        >
          {{ isFavorite ? '❤️' : '🤍' }}
        </span>
        <span class="action-icon" @click="shareNovel">🔗</span>
        <span class="action-icon" @click="downloadNovel">⬇️</span>
      </div>
    </div>

    <div class="detail-tabs">
      <div class="tabs-header">
        <div 
          v-for="(tab, index) in tabs" 
          :key="index" 
          class="tab-item"
          :class="{ active: activeTab === index }"
          @click="activeTab = index"
        >
          {{ tab.name }}
        </div>
      </div>

      <div class="tab-content">
        <div v-if="activeTab === 0" class="description-section">
          <h3>作品简介</h3>
          <p class="description">{{ novel.description }}</p>
        </div>

        <div v-else-if="activeTab === 1" class="chapter-section">
          <div class="chapter-header">
            <span>共 {{ chapters.length }} 章</span>
            <span class="sort-btn" @click="sortChapters">↕ 顺序</span>
          </div>
          <ul class="chapter-list">
            <li 
              v-for="(chapter, index) in chapters" 
              :key="index"
              class="chapter-item"
              @click="readChapter(chapter)"
            >
              <span class="chapter-title">{{ chapter.title }}</span>
              <span class="chapter-words">{{ chapter.words }}字</span>
            </li>
          </ul>
        </div>

        <div v-else-if="activeTab === 2" class="comment-section">
          <div class="empty">
            <p>暂无评论</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { formatNumber } from '@/utils'
import { novelsData } from '@/data/novels'

const route = useRoute()
const activeTab = ref(0)
const isFavorite = ref(false)
const novelId = computed(() => route.params.id)

const tabs = [
  { name: '简介', key: 'description' },
  { name: '目录', key: 'chapters' },
  { name: '评论', key: 'comments' }
]

const novel = ref({
  id: '',
  title: '加载中...',
  author: '',
  cover: '',
  category: '',
  description: '',
  views: 0,
  rating: 0,
  chapters: 0,
  status: ''
})

const chapters = ref([])

const loadMockData = () => {
  const currentId = Number(novelId.value)
  const novelData = novelsData[currentId]
  
  if (novelData) {
    novel.value = { ...novelData, id: String(currentId) }
  } else {
    novel.value = {
      id: String(currentId),
      title: `小说 ${currentId}`,
      author: '未知作者',
      category: '其他',
      cover: `https://picsum.photos/300/400?random=${currentId}`,
      views: Math.floor(Math.random() * 100000) + 10000,
      rating: (Math.random() * 2 + 7).toFixed(1),
      chapters: Math.floor(Math.random() * 500) + 50,
      status: Math.random() > 0.7 ? '完结' : '连载中',
      description: '该小说详情正在完善中...'
    }
  }
  generateChapters()
}

const generateChapters = () => {
  chapters.value = []
  for (let i = 1; i <= Math.min(novel.value.chapters, 50); i++) {
    chapters.value.push({
      title: `第${i}章 ${getChapterTitle(i)}`,
      words: Math.floor(Math.random() * 3000) + 2000
    })
  }
}

const getChapterTitle = (index) => {
  const titles = [
    '重生', '觉醒', '崛起', '突破', '修炼', '试炼', '传承', '秘境', '遗迹', '神兵',
    '炼丹', '阵法', '契约', '血脉', '天赋', '机缘', '磨难', '蜕变', '巅峰', '无敌'
  ]
  return titles[index % titles.length]
}

const startReading = () => {
  alert('开始阅读第1章')
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  let favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
  const currentId = String(novelId.value)
  
  if (isFavorite.value) {
    if (!favorites.includes(currentId)) {
      favorites.push(currentId)
    }
    alert('已添加收藏')
  } else {
    favorites = favorites.filter(id => id !== currentId)
    alert('已取消收藏')
  }
  
  localStorage.setItem('favorites', JSON.stringify(favorites))
}

const shareNovel = () => {
  alert('分享链接已复制')
}

const downloadNovel = () => {
  alert('下载功能开发中')
}

const sortChapters = () => {
  chapters.value.reverse()
  alert('已翻转顺序')
}

const readChapter = (chapter) => {
  alert(`正在阅读：${chapter.title}`)
}

const loadData = () => {
  loadMockData()
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
  const currentId = String(novelId.value)
  isFavorite.value = favorites.includes(currentId)
}

onMounted(() => {
  loadData()
})

watch(novelId, () => {
  loadData()
})
</script>

<style scoped>
.detail-page {
  background: #f5f5f5;
  min-height: calc(100vh - 200px);
}

.novel-header {
  position: relative;
  padding: 60px 20px 30px;
  background: #333;
  color: #fff;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  filter: blur(20px);
  opacity: 0.3;
}

.header-content {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
}

.novel-cover {
  width: 140px;
  height: 186px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  object-fit: cover;
  flex-shrink: 0;
}

.novel-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.novel-title {
  font-size: 24px;
  margin: 0 0 8px;
  font-weight: bold;
}

.novel-author {
  font-size: 14px;
  margin: 0 0 12px;
  opacity: 0.8;
}

.novel-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.category-tag {
  font-size: 12px;
  color: #fff;
  background: #ed424b;
  padding: 4px 12px;
  border-radius: 4px;
}

.status-tag {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 4px;
}

.status-tag.completed {
  background: #52c41a;
}

.status-tag.ongoing {
  background: #faad14;
}

.novel-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: bold;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

.novel-actions {
  background: #fff;
  padding: 16px 20px;
  display: flex;
  gap: 16px;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.btn-primary {
  flex: 1;
  padding: 14px;
  background: #ed424b;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #d63640;
}

.action-icons {
  display: flex;
  gap: 20px;
}

.action-icon {
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.3s;
}

.action-icon:hover {
  transform: scale(1.1);
}

.action-icon.active {
  animation: pulse 0.5s ease;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.detail-tabs {
  margin-top: 12px;
  background: #fff;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid #e5e5e5;
}

.tab-item {
  flex: 1;
  padding: 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  text-align: center;
  position: relative;
  transition: color 0.3s;
}

.tab-item:hover {
  color: #ed424b;
}

.tab-item.active {
  color: #ed424b;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #ed424b;
}

.tab-content {
  padding: 20px;
}

.description-section {
  background: #fff;
}

.description-section h3 {
  font-size: 18px;
  margin: 0 0 12px;
}

.description {
  font-size: 14px;
  line-height: 1.8;
  color: #666;
  text-indent: 2em;
  margin: 0;
}

.chapter-section {
  background: #fff;
}

.chapter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0 16px;
  border-bottom: 1px solid #e5e5e5;
}

.chapter-header span {
  font-size: 14px;
  color: #666;
}

.sort-btn {
  color: #ed424b;
  cursor: pointer;
}

.chapter-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.chapter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
}

.chapter-item:hover {
  background: #f8f8f8;
}

.chapter-title {
  font-size: 14px;
  color: #333;
}

.chapter-words {
  font-size: 12px;
  color: #999;
}

.comment-section {
  background: #fff;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .novel-cover {
    width: 120px;
    height: 160px;
  }

  .novel-title {
    font-size: 20px;
  }

  .novel-stats {
    justify-content: center;
  }

  .novel-actions {
    flex-direction: column;
  }

  .btn-primary {
    width: 100%;
  }

  .action-icons {
    margin-top: 12px;
  }
}
</style>
