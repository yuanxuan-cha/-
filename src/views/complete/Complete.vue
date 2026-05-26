<template>
  <div class="complete-page">
    <div class="page-header">
      <h1>完本小说</h1>
      <p>精选已完结优质小说</p>
    </div>

    <div class="filter-bar">
      <div class="filter-tabs">
        <span 
          v-for="(tab, index) in filterTabs" 
          :key="index"
          class="filter-tab"
          :class="{ active: activeFilter === index }"
          @click="activeFilter = index"
        >{{ tab.name }}</span>
      </div>
    </div>

    <div class="complete-grid">
      <router-link 
        v-for="novel in filteredNovels" 
        :key="novel.id" 
        :to="`/detail/${novel.id}`"
        class="novel-card"
      >
        <div class="cover-wrap">
          <img v-lazy="novel.cover" :alt="novel.title" class="novel-cover" />
          <span class="complete-badge">完本</span>
        </div>
        <div class="novel-info">
          <h3 class="novel-title">{{ novel.title }}</h3>
          <p class="novel-author">{{ novel.author }}</p>
          <p class="novel-word-count">{{ novel.wordCount }}</p>
          <div class="novel-rating">
            <span v-for="i in 5" :key="i" class="star">
              {{ i <= Math.floor(novel.rating) ? '★' : '☆' }}
            </span>
            <span>{{ novel.rating }}</span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeFilter = ref(0)

const filterTabs = [
  { name: '全部', key: 'all' },
  { name: '玄幻', key: '玄幻' },
  { name: '仙侠', key: '仙侠' },
  { name: '都市', key: '都市' },
  { name: '悬疑', key: '悬疑' },
  { name: '历史', key: '历史' }
]

const completeNovels = ref([
  { id: 1, title: '斗破苍穹', author: '天蚕土豆', category: '玄幻', cover: 'https://picsum.photos/300/400?random=10', wordCount: '538万', rating: 9.2 },
  { id: 2, title: '完美世界', author: '辰东', category: '玄幻', cover: 'https://picsum.photos/300/400?random=16', wordCount: '630万', rating: 9.3 },
  { id: 3, title: '遮天', author: '辰东', category: '仙侠', cover: 'https://picsum.photos/300/400?random=30', wordCount: '630万', rating: 9.1 },
  { id: 4, title: '大主宰', author: '天蚕土豆', category: '玄幻', cover: 'https://picsum.photos/300/400?random=31', wordCount: '480万', rating: 8.9 },
  { id: 5, title: '武动乾坤', author: '天蚕土豆', category: '玄幻', cover: 'https://picsum.photos/300/400?random=32', wordCount: '380万', rating: 8.8 },
  { id: 6, title: '星辰变', author: '我吃西红柿', category: '玄幻', cover: 'https://picsum.photos/300/400?random=15', wordCount: '280万', rating: 8.7 },
  { id: 7, title: '盘龙', author: '我吃西红柿', category: '玄幻', cover: 'https://picsum.photos/300/400?random=47', wordCount: '320万', rating: 8.6 },
  { id: 8, title: '神墓', author: '辰东', category: '玄幻', cover: 'https://picsum.photos/300/400?random=48', wordCount: '380万', rating: 9.0 },
  { id: 9, title: '雪中悍刀行', author: '烽火戏诸侯', category: '武侠', cover: 'https://picsum.photos/300/400?random=17', wordCount: '460万', rating: 9.4 },
  { id: 10, title: '仙逆', author: '耳根', category: '仙侠', cover: 'https://picsum.photos/300/400?random=46', wordCount: '650万', rating: 8.9 },
  { id: 12, title: '庆余年', author: '猫腻', category: '历史', cover: 'https://picsum.photos/300/400?random=42', wordCount: '300万', rating: 9.1 },
  { id: 13, title: '全职高手', author: '蝴蝶蓝', category: '游戏', cover: 'https://picsum.photos/300/400?random=41', wordCount: '530万', rating: 9.3 },
  { id: 21, title: '三体', author: '刘慈欣', category: '科幻', cover: 'https://picsum.photos/300/400?random=40', wordCount: '100万', rating: 9.5 },
  { id: 31, title: '凡人修仙传', author: '忘语', category: '仙侠', cover: 'https://picsum.photos/300/400?random=13', wordCount: '770万', rating: 9.0 },
  { id: 91, title: '鬼吹灯', author: '天下霸唱', category: '悬疑', cover: 'https://picsum.photos/300/400?random=43', wordCount: '220万', rating: 9.2 },
  { id: 92, title: '盗墓笔记', author: '南派三叔', category: '悬疑', cover: 'https://picsum.photos/300/400?random=44', wordCount: '240万', rating: 9.1 },
  { id: 53, title: '回到明朝当王爷', author: '月关', category: '历史', cover: 'https://picsum.photos/300/400?random=49', wordCount: '450万', rating: 8.9 },
  { id: 54, title: '极品家丁', author: '禹岩', category: '历史', cover: 'https://picsum.photos/300/400?random=50', wordCount: '600万', rating: 8.8 }
])

const filteredNovels = computed(() => {
  if (activeFilter.value === 0) {
    return completeNovels.value
  }
  const category = filterTabs[activeFilter.value].key
  return completeNovels.value.filter(novel => novel.category === category)
})
</script>

<style scoped>
.complete-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  color: #333;
  margin: 0 0 8px;
}

.page-header p {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.filter-bar {
  background: #fff;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filter-tabs {
  display: flex;
  gap: 20px;
}

.filter-tab {
  font-size: 14px;
  color: #666;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s;
}

.filter-tab:hover {
  background: #f5f5f5;
}

.filter-tab.active {
  background: #ed424b;
  color: #fff;
}

.complete-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.novel-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.novel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.cover-wrap {
  position: relative;
}

.novel-cover {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.complete-badge {
  position: absolute;
  top: 0;
  left: 0;
  background: #4CAF50;
  color: #fff;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 0 0 4px 0;
}

.novel-info {
  padding: 16px;
}

.novel-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.novel-author {
  font-size: 13px;
  color: #999;
  margin: 0 0 8px;
}

.novel-word-count {
  font-size: 12px;
  color: #666;
  margin: 0 0 8px;
}

.novel-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #ff9800;
}

@media (max-width: 768px) {
  .complete-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .novel-cover {
    height: 200px;
  }

  .filter-tabs {
    flex-wrap: wrap;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .complete-grid {
    grid-template-columns: 1fr;
  }
}
</style>