<template>
  <div class="recommend-page">
    <div class="page-header">
      <h1>编辑推荐</h1>
      <p>精选优质小说，不容错过</p>
    </div>

    <div class="recommend-container">
      <section class="recommend-section" v-for="recommend in recommends" :key="recommend.id">
        <div class="section-header">
          <h2>{{ recommend.name }}</h2>
          <span class="more">更多 →</span>
        </div>

        <div class="recommend-banner">
          <img v-lazy="recommend.cover" :alt="recommend.name" />
        </div>

        <div class="novel-carousel">
          <div class="novel-scroll">
            <router-link 
              v-for="novel in recommend.novels" 
              :key="novel.id" 
              :to="`/detail/${novel.id}`"
              class="novel-card"
            >
              <img v-lazy="novel.cover" :alt="novel.title" class="novel-cover" />
              <div class="novel-info">
                <h3 class="novel-title">{{ novel.title }}</h3>
                <p class="novel-author">{{ novel.author }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </section>

      <section class="all-novels">
        <div class="section-header">
          <h2>全部推荐</h2>
          <router-link to="/category" class="more-link">
            查看更多 →
          </router-link>
        </div>

        <div class="all-novel-grid">
          <router-link 
            v-for="novel in allNovels" 
            :key="novel.id" 
            :to="`/detail/${novel.id}`"
            class="novel-card"
          >
            <img v-lazy="novel.cover" :alt="novel.title" class="novel-cover" />
            <div class="novel-info">
              <h3 class="novel-title">{{ novel.title }}</h3>
              <p class="novel-author">{{ novel.author }}</p>
              <div class="novel-rating">
                <span v-for="i in 5" :key="i" class="star">
                  {{ i <= Math.floor(novel.rating) ? '★' : '☆' }}
                </span>
                <span>{{ novel.rating }}</span>
              </div>
            </div>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const recommends = ref([
  {
    id: 1,
    type: 'editor',
    name: '编辑推荐',
    cover: 'https://picsum.photos/1200/400?random=20',
    novels: [
      { id: 1, title: '斗破苍穹', author: '天蚕土豆', cover: 'https://picsum.photos/300/400?random=30' },
      { id: 3, title: '三体', author: '刘慈欣', cover: 'https://picsum.photos/300/400?random=31' },
      { id: 8, title: '雪中悍刀行', author: '烽火戏诸侯', cover: 'https://picsum.photos/300/400?random=32' }
    ]
  },
  {
    id: 2,
    type: 'hot',
    name: '热门书单',
    cover: 'https://picsum.photos/1200/400?random=21',
    novels: [
      { id: 7, title: '完美世界', author: '辰东', cover: 'https://picsum.photos/300/400?random=33' },
      { id: 5, title: '赘婿', author: '愤怒的香蕉', cover: 'https://picsum.photos/300/400?random=34' },
      { id: 4, title: '凡人修仙传', author: '忘语', cover: 'https://picsum.photos/300/400?random=35' }
    ]
  }
])

const allNovels = ref([
  { id: 1, title: '斗破苍穹', author: '天蚕土豆', cover: 'https://picsum.photos/300/400?random=10', rating: 9.2 },
  { id: 7, title: '完美世界', author: '辰东', cover: 'https://picsum.photos/300/400?random=16', rating: 9.3 },
  { id: 4, title: '凡人修仙传', author: '忘语', cover: 'https://picsum.photos/300/400?random=13', rating: 9.0 },
  { id: 5, title: '赘婿', author: '愤怒的香蕉', cover: 'https://picsum.photos/300/400?random=14', rating: 8.9 },
  { id: 8, title: '雪中悍刀行', author: '烽火戏诸侯', cover: 'https://picsum.photos/300/400?random=17', rating: 9.4 },
  { id: 3, title: '三体', author: '刘慈欣', cover: 'https://picsum.photos/300/400?random=12', rating: 9.5 },
  { id: 2, title: '庆余年', author: '猫腻', cover: 'https://picsum.photos/300/400?random=11', rating: 9.1 },
  { id: 6, title: '星辰变', author: '我吃西红柿', cover: 'https://picsum.photos/300/400?random=15', rating: 8.8 }
])
</script>

<style scoped>
.recommend-page {
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

.recommend-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.recommend-section,
.all-novels {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 20px;
  color: #333;
  margin: 0;
}

.more {
  color: #ed424b;
  font-size: 14px;
  cursor: pointer;
}

.more-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ed424b;
  text-decoration: none;
  font-size: 14px;
}

.recommend-banner {
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
}

.recommend-banner img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.novel-carousel {
  overflow-x: auto;
  margin: 0 -20px;
  padding: 0 20px;
}

.novel-scroll {
  display: flex;
  gap: 16px;
  padding-bottom: 10px;
}

.novel-card {
  flex-shrink: 0;
  width: 140px;
  background: #f8f8f8;
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
}

.novel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.novel-cover {
  width: 100%;
  height: 186px;
  object-fit: cover;
}

.novel-info {
  padding: 12px;
}

.novel-title {
  font-size: 14px;
  margin: 0 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.novel-author {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.novel-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 12px;
  color: #ff9800;
}

.all-novel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
}

.all-novel-grid .novel-card {
  width: 100%;
}

.all-novel-grid .novel-cover {
  height: 213px;
}

@media (max-width: 768px) {
  .recommend-banner img {
    height: 150px;
  }

  .novel-card {
    width: 120px;
  }

  .novel-cover {
    height: 160px;
  }

  .all-novel-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .all-novel-grid .novel-cover {
    height: 180px;
  }
}
</style>
