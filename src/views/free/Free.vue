<template>
  <div class="free-page">
    <div class="page-header">
      <h1>免费小说</h1>
      <p>精选免费优质小说，畅快阅读</p>
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

    <div class="free-grid">
      <router-link 
        v-for="novel in filteredNovels" 
        :key="novel.id" 
        :to="`/detail/${novel.id}`"
        class="novel-card"
      >
        <div class="cover-wrap">
          <img v-lazy="novel.cover" :alt="novel.title" class="novel-cover" />
          <span class="free-badge">免费</span>
        </div>
        <div class="novel-info">
          <h3 class="novel-title">{{ novel.title }}</h3>
          <p class="novel-author">{{ novel.author }}</p>
          <div class="novel-tags">
            <span v-for="(tag, index) in novel.tags" :key="index" class="tag">{{ tag }}</span>
          </div>
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
  { name: '都市', key: '都市' },
  { name: '仙侠', key: '仙侠' },
  { name: '玄幻', key: '玄幻' },
  { name: '言情', key: '言情' },
  { name: '悬疑', key: '悬疑' }
]

const freeNovels = ref([
  { id: 14, title: '重生之都市修仙', author: '十里剑神', category: '都市', cover: 'https://picsum.photos/300/400?random=60', tags: ['都市', '重生', '修仙'], rating: 8.8 },
  { id: 15, title: '极品全能学生', author: '花都大少', category: '都市', cover: 'https://picsum.photos/300/400?random=61', tags: ['都市', '爽文', '全能'], rating: 8.5 },
  { id: 16, title: '最强弃少', author: '鹅是老五', category: '都市', cover: 'https://picsum.photos/300/400?random=62', tags: ['都市', '修仙', '爽文'], rating: 8.7 },
  { id: 17, title: '医道特种兵', author: '青衫取醉', category: '都市', cover: 'https://picsum.photos/300/400?random=63', tags: ['都市', '特种兵', '医术'], rating: 8.6 },
  { id: 18, title: '超级兵王', author: '步千帆', category: '都市', cover: 'https://picsum.photos/300/400?random=64', tags: ['都市', '兵王', '热血'], rating: 8.9 },
  { id: 19, title: '校花的贴身高手', author: '鱼人二代', category: '都市', cover: 'https://picsum.photos/300/400?random=65', tags: ['都市', '校花', '修仙'], rating: 8.4 },
  { id: 10, title: '仙逆', author: '耳根', category: '仙侠', cover: 'https://picsum.photos/300/400?random=46', tags: ['仙侠', '玄幻', '修炼'], rating: 8.9 },
  { id: 32, title: '求魔', author: '耳根', category: '仙侠', cover: 'https://picsum.photos/300/400?random=41', tags: ['玄幻', '仙侠', '修真'], rating: 9.2 },
  { id: 33, title: '我欲封天', author: '耳根', category: '仙侠', cover: 'https://picsum.photos/300/400?random=42', tags: ['仙侠', '玄幻', '修炼'], rating: 9.1 },
  { id: 1, title: '斗破苍穹', author: '天蚕土豆', category: '玄幻', cover: 'https://picsum.photos/300/400?random=10', tags: ['玄幻', '斗气', '成长'], rating: 9.2 },
  { id: 2, title: '完美世界', author: '辰东', category: '玄幻', cover: 'https://picsum.photos/300/400?random=16', tags: ['玄幻', '异界', '成长'], rating: 9.3 },
  { id: 3, title: '遮天', author: '辰东', category: '仙侠', cover: 'https://picsum.photos/300/400?random=30', tags: ['仙侠', '玄幻', '宇宙'], rating: 9.1 },
  { id: 5, title: '武动乾坤', author: '天蚕土豆', category: '玄幻', cover: 'https://picsum.photos/300/400?random=32', tags: ['玄幻', '修炼', '成长'], rating: 8.8 },
  { id: 6, title: '星辰变', author: '我吃西红柿', category: '玄幻', cover: 'https://picsum.photos/300/400?random=15', tags: ['玄幻', '修真', '成长'], rating: 8.7 },
  { id: 91, title: '鬼吹灯', author: '天下霸唱', category: '悬疑', cover: 'https://picsum.photos/300/400?random=43', tags: ['悬疑', '探险', '盗墓'], rating: 9.2 },
  { id: 92, title: '盗墓笔记', author: '南派三叔', category: '悬疑', cover: 'https://picsum.photos/300/400?random=44', tags: ['悬疑', '探险', '盗墓'], rating: 9.1 },
  { id: 107, title: '三生三世十里桃花', author: '唐七公子', category: '言情', cover: 'https://picsum.photos/300/400?random=45', tags: ['言情', '仙侠', '爱情'], rating: 9.2 },
  { id: 110, title: '知否？知否？应是绿肥红瘦', author: '关心则乱', category: '言情', cover: 'https://picsum.photos/300/400?random=119', tags: ['言情', '古代', '宅斗'], rating: 9.0 }
])

const filteredNovels = computed(() => {
  if (activeFilter.value === 0) {
    return freeNovels.value
  }
  const category = filterTabs[activeFilter.value].key
  return freeNovels.value.filter(novel => novel.category === category)
})
</script>

<style scoped>
.free-page {
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
  background: #FF9800;
  color: #fff;
}

.free-grid {
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

.free-badge {
  position: absolute;
  top: 0;
  left: 0;
  background: #FF9800;
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

.novel-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.tag {
  font-size: 11px;
  color: #666;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
}

.novel-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #ff9800;
}

@media (max-width: 768px) {
  .free-grid {
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
  .free-grid {
    grid-template-columns: 1fr;
  }
}
</style>