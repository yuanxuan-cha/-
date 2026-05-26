<template>
  <div class="search-page">
    <div class="search-header">
      <div class="search-container">
        <div class="search-box-wrapper">
          <input 
            type="text" 
            class="search-input" 
            v-model="keyword"
            placeholder="搜索小说、作者"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">搜索</button>
        </div>
        
        <div class="hot-search">
          <span class="hot-label">热门搜索：</span>
          <button 
            v-for="tag in hotTags" 
            :key="tag"
            class="hot-tag"
            @click="searchByTag(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </div>

    <div class="search-content">
      <div class="container">
        <div v-if="isLoading" class="loading-state">
          <div class="loading-icon">🔍</div>
          <p>搜索中...</p>
        </div>

        <div v-else>
          <div v-if="hasSearched" class="result-stats">
            <span>搜索 "<strong>{{ keyword }}</strong>" 共找到 {{ searchResults.length }} 条结果</span>
          </div>

          <div v-if="hasSearched && searchResults.length > 0" class="result-list">
            <div 
              v-for="novel in searchResults" 
              :key="novel.id"
              class="result-item"
              @click="goToDetail(novel.id)"
            >
              <img :src="novel.cover" :alt="novel.title" class="result-cover" />
              <div class="result-info">
                <h3 class="result-title">{{ novel.title }}</h3>
                <p class="result-author">作者：{{ novel.author }}</p>
                <p class="result-desc">{{ novel.description }}</p>
                <div class="result-tags">
                  <span class="tag">{{ novel.category }}</span>
                  <span class="tag">{{ novel.status }}</span>
                  <span class="tag">{{ novel.wordCount || (novel.chapters ? novel.chapters + '章' : '') }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="hasSearched && searchResults.length === 0" class="empty-state">
            <div class="empty-icon">🔍</div>
            <p class="empty-text">未找到相关小说</p>
            <p class="empty-hint">试试其他关键词或浏览热门搜索</p>
          </div>

          <div v-if="!hasSearched" class="default-state">
            <div class="default-icon">📚</div>
            <h2 class="default-title">开始搜索</h2>
            <p class="default-text">输入小说名或作者名，找到您喜欢的作品</p>
            
            <div class="quick-search">
              <h3 class="quick-title">热门小说</h3>
              <div class="novel-grid">
                <div 
                  v-for="novel in fallbackNovels" 
                  :key="novel.id"
                  class="novel-item"
                  @click="goToDetail(novel.id)"
                >
                  <img :src="novel.cover" :alt="novel.title" class="novel-cover" />
                  <p class="novel-title">{{ novel.title }}</p>
                  <p class="novel-author">{{ novel.author }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const keyword = ref('')
const hasSearched = ref(false)
const searchResults = ref([])
const isLoading = ref(false)

const hotTags = ['斗破苍穹', '斗罗大陆', '凡人修仙传', '遮天', '完美世界', '雪中悍刀行']

const fallbackNovels = [
  { id: 1, title: '斗破苍穹', author: '天蚕土豆', cover: 'https://picsum.photos/300/400?random=10', category: '玄幻', description: '这里是属于斗气的世界，没有花俏艳丽的魔法，有的，仅仅是繁衍到巅峰的斗气！', status: '完结', wordCount: '530万' },
  { id: 2, title: '庆余年', author: '猫腻', cover: 'https://picsum.photos/300/400?random=11', category: '历史', description: '积善之家，必有余庆，留余庆，留余庆，忽遇恩人；幸娘亲，幸娘亲，积得阴功。', status: '完结', wordCount: '300万' },
  { id: 3, title: '三体', author: '刘慈欣', cover: 'https://picsum.photos/300/400?random=12', category: '科幻', description: '地球人类文明和三体文明之间的信息交流、生死搏杀及两个文明在宇宙中的兴衰历程。', status: '完结', wordCount: '120万' },
  { id: 4, title: '凡人修仙传', author: '忘语', cover: 'https://picsum.photos/300/400?random=13', category: '仙侠', description: '一个普通的山村穷小子，偶然之下，跨入到一个江湖小门派，成了一名记名弟子。', status: '完结', wordCount: '770万' },
  { id: 5, title: '赘婿', author: '愤怒的香蕉', cover: 'https://picsum.photos/300/400?random=14', category: '历史', description: '一个受够了勾心斗角、生死拼搏的金融界巨头回到了古代，进入一商贾之家最没地位的赘婿身体。', status: '连载中', wordCount: '580万' },
  { id: 6, title: '星辰变', author: '我吃西红柿', cover: 'https://picsum.photos/300/400?random=15', category: '玄幻', description: '一名孩童，天生无法修炼内功。为了得到父亲的重视，这个孩童毅然选择了那条痛苦修炼之路。', status: '完结', wordCount: '280万' },
  { id: 7, title: '完美世界', author: '辰东', cover: 'https://picsum.photos/300/400?random=16', category: '玄幻', description: '一粒尘可填海，一根草斩尽日月星辰，弹指间天翻地覆。群雄并起，万族林立，诸圣争霸。', status: '完结', wordCount: '650万' },
  { id: 8, title: '雪中悍刀行', author: '烽火戏诸侯', cover: 'https://picsum.photos/300/400?random=17', category: '武侠', description: '道门真人飞天入地，千里取人首级；佛家菩萨低眉嗔怒，搬山填海。', status: '完结', wordCount: '460万' }
]

const searchLocalNovels = (keyword) => {
  const lowerKeyword = keyword.toLowerCase()
  return fallbackNovels.filter(novel => {
    return (
      novel.title.toLowerCase().includes(lowerKeyword) ||
      novel.author.toLowerCase().includes(lowerKeyword) ||
      novel.category.toLowerCase().includes(lowerKeyword) ||
      novel.description.toLowerCase().includes(lowerKeyword)
    )
  })
}

const handleSearch = () => {
  if (!keyword.value.trim()) {
    return
  }
  hasSearched.value = true
  isLoading.value = true
  
  setTimeout(() => {
    searchResults.value = searchLocalNovels(keyword.value)
    isLoading.value = false
  }, 300)
}

const searchByTag = (tag) => {
  keyword.value = tag
  handleSearch()
}

const goToDetail = (id) => {
  router.push(`/detail/${id}`)
}

onMounted(() => {
  if (route.query.q) {
    keyword.value = decodeURIComponent(route.query.q)
    hasSearched.value = true
    isLoading.value = true
    
    setTimeout(() => {
      searchResults.value = searchLocalNovels(keyword.value)
      isLoading.value = false
    }, 300)
  }
})
</script>

<style scoped>
.search-page {
  min-height: calc(100vh - 200px);
  background: var(--bg-gray);
}

.search-header {
  background: var(--primary-color);
  padding: 30px 20px;
}

.search-container {
  max-width: 800px;
  margin: 0 auto;
}

.search-box-wrapper {
  display: flex;
  background: var(--bg-white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 1;
  padding: 16px 20px;
  border: none;
  outline: none;
  font-size: 16px;
}

.search-btn {
  background: var(--primary-color);
  color: var(--bg-white);
  border: none;
  padding: 16px 40px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: var(--transition);
}

.search-btn:hover {
  background: var(--primary-hover);
}

.hot-search {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.hot-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.hot-tag {
  background: rgba(255, 255, 255, 0.2);
  color: var(--bg-white);
  border: none;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition);
}

.hot-tag:hover {
  background: rgba(255, 255, 255, 0.3);
}

.search-content {
  padding: 30px 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
}

.loading-icon {
  font-size: 48px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.result-stats {
  margin-bottom: 20px;
  padding: 12px 16px;
  background: var(--bg-white);
  border-radius: var(--border-radius);
  font-size: 14px;
  color: var(--text-secondary);
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-item {
  display: flex;
  gap: 20px;
  background: var(--bg-white);
  border-radius: var(--border-radius);
  padding: 20px;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.result-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.result-cover {
  width: 120px;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.result-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.result-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--text-color);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-author {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.result-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-tags {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.tag {
  background: #f0f0f0;
  color: var(--text-secondary);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  background: var(--bg-white);
  border-radius: var(--border-radius);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 18px;
  color: var(--text-color);
  margin: 0 0 8px 0;
}

.empty-hint {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.default-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

.default-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.default-title {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-color);
  margin: 0 0 8px 0;
}

.default-text {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0 0 30px 0;
}

.quick-search {
  width: 100%;
}

.quick-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--text-color);
  margin: 0 0 20px 0;
  text-align: center;
}

.novel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

.novel-item {
  background: var(--bg-white);
  border-radius: var(--border-radius);
  padding: 12px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.novel-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.novel-cover {
  width: 100%;
  max-width: 120px;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}

.novel-title {
  font-size: 14px;
  font-weight: bold;
  color: var(--text-color);
  margin: 0 0 4px 0;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.novel-author {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
  text-align: center;
}

@media (max-width: 768px) {
  .search-header {
    padding: 20px 12px;
  }
  
  .search-input {
    padding: 14px 16px;
    font-size: 14px;
  }
  
  .search-btn {
    padding: 14px 24px;
    font-size: 14px;
  }
  
  .hot-search {
    gap: 8px;
  }
  
  .hot-tag {
    padding: 4px 12px;
    font-size: 13px;
  }
  
  .search-content {
    padding: 20px 12px;
  }
  
  .result-item {
    flex-direction: column;
    align-items: center;
  }
  
  .result-cover {
    width: 100%;
    max-width: 200px;
    height: auto;
  }
  
  .result-info {
    width: 100%;
  }
  
  .novel-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .novel-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .default-icon {
    font-size: 60px;
  }
  
  .default-title {
    font-size: 20px;
  }
}
</style>