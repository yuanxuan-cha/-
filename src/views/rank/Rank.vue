<template>
  <div class="rank-page">
    <div class="page-header">
      <h1>小说排行榜</h1>
      <p>最受欢迎的小说都在这里</p>
    </div>

    <div class="rank-container">
      <div class="tabs-header">
        <div 
          v-for="(rank, index) in ranks" 
          :key="rank.id" 
          class="tab-item"
          :class="{ active: activeTab === index }"
          @click="activeTab = index"
        >
          {{ rank.name }}
        </div>
      </div>

      <div class="tab-content">
        <div class="rank-list">
          <div 
            v-for="(novel, index) in currentRankNovels" 
            :key="novel.id" 
            class="rank-item"
          >
            <div class="rank-number" :class="{ 'top-1': index === 0, 'top-2': index === 1, 'top-3': index === 2 }">
              {{ index + 1 }}
            </div>
            <router-link :to="`/detail/${novel.id}`" class="rank-content">
              <div class="rank-info">
                <h3 class="rank-title">{{ novel.title }}</h3>
                <p class="rank-author">{{ novel.author }}</p>
                <p class="rank-stat">
                  🔥 {{ formatNumber(novel[statKey]) }} {{ statLabel }}
                </p>
              </div>
              <span class="rank-arrow">→</span>
            </router-link>
          </div>

          <div v-if="currentRankNovels.length === 0" class="empty">
            <p>暂无数据</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatNumber } from '@/utils'

const activeTab = ref(0)

const ranks = ref([
  {
    id: 1,
    type: 'click',
    name: '点击榜',
    statKey: 'views',
    statLabel: '阅读',
    novels: [
      { id: 1, title: '斗破苍穹', author: '天蚕土豆', views: 125678 },
      { id: 7, title: '完美世界', author: '辰东', views: 178901 },
      { id: 4, title: '凡人修仙传', author: '忘语', views: 156789 },
      { id: 5, title: '赘婿', author: '愤怒的香蕉', views: 145678 },
      { id: 6, title: '星辰变', author: '我吃西红柿', views: 134567 },
      { id: 8, title: '雪中悍刀行', author: '烽火戏诸侯', views: 123456 }
    ]
  },
  {
    id: 2,
    type: 'ticket',
    name: '月票榜',
    statKey: 'tickets',
    statLabel: '月票',
    novels: [
      { id: 7, title: '完美世界', author: '辰东', tickets: 25678 },
      { id: 5, title: '赘婿', author: '愤怒的香蕉', tickets: 23456 },
      { id: 1, title: '斗破苍穹', author: '天蚕土豆', tickets: 21345 },
      { id: 4, title: '凡人修仙传', author: '忘语', tickets: 19876 },
      { id: 8, title: '雪中悍刀行', author: '烽火戏诸侯', tickets: 17654 }
    ]
  },
  {
    id: 3,
    type: 'recommend',
    name: '推荐榜',
    statKey: 'recommends',
    statLabel: '推荐',
    novels: [
      { id: 8, title: '雪中悍刀行', author: '烽火戏诸侯', recommends: 45678 },
      { id: 3, title: '三体', author: '刘慈欣', recommends: 43210 },
      { id: 7, title: '完美世界', author: '辰东', recommends: 38765 },
      { id: 2, title: '庆余年', author: '猫腻', recommends: 35678 },
      { id: 1, title: '斗破苍穹', author: '天蚕土豆', recommends: 32543 }
    ]
  }
])

const currentRank = computed(() => ranks.value[activeTab.value] || ranks.value[0])
const currentRankNovels = computed(() => currentRank.value.novels || [])
const statKey = computed(() => currentRank.value.statKey || 'views')
const statLabel = computed(() => currentRank.value.statLabel || '阅读')
</script>

<style scoped>
.rank-page {
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

.rank-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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

.rank-list {
  min-height: 400px;
}

.rank-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  background: #f8f8f8;
  border-radius: 8px;
  transition: all 0.3s;
}

.rank-item:hover {
  background: #f0f0f0;
  transform: translateX(4px);
}

.rank-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ddd;
  color: #666;
  font-weight: bold;
  font-size: 18px;
  border-radius: 50%;
  margin-right: 16px;
  flex-shrink: 0;
}

.rank-number.top-1 {
  background: linear-gradient(135deg, #ffd700, #ffb347);
  color: #fff;
}

.rank-number.top-2 {
  background: linear-gradient(135deg, #c0c0c0, #a8a8a8);
  color: #fff;
}

.rank-number.top-3 {
  background: linear-gradient(135deg, #cd7f32, #b8860b);
  color: #fff;
}

.rank-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  color: inherit;
}

.rank-info {
  flex: 1;
}

.rank-title {
  font-size: 16px;
  margin: 0 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-author {
  font-size: 12px;
  color: #999;
  margin: 0 0 4px;
}

.rank-stat {
  font-size: 12px;
  color: #ed424b;
  margin: 0;
}

.rank-arrow {
  color: #ccc;
  flex-shrink: 0;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

@media (max-width: 768px) {
  .rank-item {
    padding: 12px;
  }

  .rank-number {
    width: 32px;
    height: 32px;
    font-size: 16px;
    margin-right: 12px;
  }

  .rank-title {
    font-size: 14px;
  }
}
</style>
