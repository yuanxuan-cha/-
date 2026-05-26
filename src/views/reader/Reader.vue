<template>
  <div class="reader" @click="toggleMenu" :style="{ background: bgColor }">
    <div class="reader-header" :class="{ 'show': showHeader }">
      <div class="header-content">
        <button class="btn-back" @click.stop="goBack">← 返回</button>
        <div class="header-info">
          <h2 class="novel-title">{{ novel?.title }}</h2>
          <p class="chapter-title">{{ currentChapter?.title }}</p>
        </div>
        <button class="btn-menu" @click.stop="showChapterList = !showChapterList">目录</button>
      </div>
    </div>

    <div class="reader-content">
      <div class="chapter-content">
        <h1 class="chapter-title-text">{{ currentChapter?.title }}</h1>
        <div class="content-text" v-html="chapterContent" :style="{ fontSize: fontSize + 'px' }"></div>
      </div>
    </div>

    <div class="reader-footer" :class="{ 'show': showHeader }">
      <div class="footer-content">
        <button class="btn-prev" @click.stop="prevChapter">上一章</button>
        <div class="progress-info">
          <span>{{ currentIndex + 1 }} / {{ chapters.length }}</span>
          <input type="range" :value="currentIndex" :max="chapters.length - 1" @input="goToChapter" class="progress-bar" />
        </div>
        <button class="btn-next" @click.stop="nextChapter">下一章</button>
      </div>
    </div>

    <div class="chapter-list-modal" v-if="showChapterList" @click="showChapterList = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>章节列表</h3>
          <button class="btn-close" @click="showChapterList = false">×</button>
        </div>
        <div class="modal-body">
          <div 
            v-for="(chapter, index) in chapters" 
            :key="chapter.id" 
            class="chapter-item"
            :class="{ 'active': index === currentIndex }"
            @click="selectChapter(index)"
          >
            {{ chapter.title }}
          </div>
        </div>
      </div>
    </div>

    <div class="settings-panel" v-if="showSettings" @click.stop>
      <div class="settings-content">
        <h3>阅读设置</h3>
        <div class="setting-item">
          <span>字体大小</span>
          <input type="range" v-model="fontSize" min="14" max="28" />
          <span>{{ fontSize }}px</span>
        </div>
        <div class="setting-item">
          <span>背景颜色</span>
          <div class="color-options">
            <button v-for="color in bgColors" :key="color" :style="{ background: color }" @click="bgColor = color"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getNovelById } from '@/data/novels'

const route = useRoute()
const router = useRouter()

const novelId = ref(route.params.novelId)
const currentIndex = ref(0)
const showHeader = ref(true)
const showChapterList = ref(false)
const showSettings = ref(false)
const fontSize = ref(18)
const bgColor = ref('#f5f0e8')

const bgColors = ['#f5f0e8', '#e8e4d9', '#c8c4b8', '#2c2c2c', '#3d3d3d']

const novel = computed(() => getNovelById(novelId.value))

const chapters = computed(() => {
  const chapterList = []
  const total = novel.value?.chapters || 50
  for (let i = 1; i <= total; i++) {
    chapterList.push({
      id: i,
      title: `第${i}章 ${generateChapterTitle(i)}`
    })
  }
  return chapterList
})

const currentChapter = computed(() => chapters.value[currentIndex.value])

const chapterContent = computed(() => {
  if (!currentChapter.value) return ''
  return generateChapterContent(currentChapter.value.title)
})

const generateChapterTitle = (num) => {
  const titles = [
    '初入江湖', '奇遇连连', '神秘传承', '风云再起', '秘境探险',
    '强者对决', '惊天秘密', '新的征程', '巅峰之战', '传奇落幕',
    '缘起', '成长', '历练', '突破', '名扬',
    '危机', '机遇', '蜕变', '崛起', '称霸',
    '征途', '挑战', '荣耀', '传奇', '神话'
  ]
  const index = (num - 1) % titles.length
  return titles[index]
}

const generateChapterContent = (title) => {
  const paragraphs = []
  for (let i = 0; i < 8; i++) {
    paragraphs.push(`<p>${title}，这是第${i + 1}段内容。在这片广袤的大陆上，强者如云，天才辈出。少年手持长剑，目光坚定地望向远方，他知道，前方的道路充满挑战，但他无所畏惧。修炼之路，道阻且长，唯有坚持不懈，方能达到巅峰。星辰变幻，岁月流转，不变的是那颗追求极致的心。</p>`)
  }
  return paragraphs.join('')
}

const goBack = () => {
  router.push(`/detail/${novelId.value}`)
}

const prevChapter = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    saveProgress()
    router.push(`/reader/${novelId.value}/${currentIndex.value + 1}`)
  }
}

const nextChapter = () => {
  if (currentIndex.value < chapters.value.length - 1) {
    currentIndex.value++
    saveProgress()
    router.push(`/reader/${novelId.value}/${currentIndex.value + 1}`)
  }
}

const goToChapter = (event) => {
  currentIndex.value = Number(event.target.value)
  saveProgress()
  router.push(`/reader/${novelId.value}/${currentIndex.value + 1}`)
}

const selectChapter = (index) => {
  currentIndex.value = index
  showChapterList.value = false
  saveProgress()
  router.push(`/reader/${novelId.value}/${currentIndex.value + 1}`)
}

const saveProgress = () => {
  const progress = JSON.parse(localStorage.getItem('readingProgress') || '{}')
  progress[novelId.value] = {
    chapterId: currentIndex.value + 1,
    time: Date.now()
  }
  localStorage.setItem('readingProgress', JSON.stringify(progress))
}

let timer = null
const toggleMenu = () => {
  if (timer) clearTimeout(timer)
  showHeader.value = !showHeader.value
  timer = setTimeout(() => {
    showHeader.value = false
  }, 3000)
}

onMounted(() => {
  const chapterId = Number(route.params.chapterId)
  if (chapterId && chapterId > 0 && chapterId <= chapters.value.length) {
    currentIndex.value = chapterId - 1
  }
  
  const savedProgress = JSON.parse(localStorage.getItem('readingProgress') || '{}')
  if (savedProgress[novelId.value]) {
    const savedChapterId = savedProgress[novelId.value].chapterId
    if (!route.params.chapterId) {
      currentIndex.value = savedChapterId - 1
    }
  }
})

watch(() => route.params, (newParams) => {
  novelId.value = newParams.novelId
  const chapterId = Number(newParams.chapterId)
  if (chapterId && chapterId > 0 && chapterId <= chapters.value.length) {
    currentIndex.value = chapterId - 1
  }
}, { immediate: true })
</script>

<style scoped>
.reader {
  min-height: 100vh;
  background: #f5f0e8;
  position: relative;
  overflow: hidden;
  transition: background 0.3s;
}

.reader-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  padding: 16px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  transform: translateY(-100%);
  transition: transform 0.3s;
}

.reader-header.show {
  transform: translateY(0);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 800px;
  margin: 0 auto;
}

.btn-back, .btn-menu {
  padding: 8px 16px;
  background: #ed424b;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.header-info {
  text-align: center;
}

.novel-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 0 4px 0;
}

.chapter-title {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.reader-content {
  padding: 80px 20px 100px;
  max-width: 800px;
  margin: 0 auto;
}

.chapter-content {
  background: #fff;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.chapter-title-text {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin: 0 0 30px 0;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.content-text {
  font-size: 18px;
  line-height: 2;
  color: #333;
}

.content-text p {
  margin: 0 0 20px 0;
  text-indent: 2em;
}

.reader-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  padding: 16px 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  transform: translateY(100%);
  transition: transform 0.3s;
}

.reader-footer.show {
  transform: translateY(0);
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 800px;
  margin: 0 auto;
}

.btn-prev, .btn-next {
  padding: 8px 24px;
  background: #ed424b;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.progress-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  margin: 0 20px;
}

.progress-info span {
  font-size: 14px;
  color: #666;
}

.progress-bar {
  width: 100%;
  max-width: 300px;
  height: 6px;
  cursor: pointer;
}

.chapter-list-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #fff;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  border-radius: 8px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.btn-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.chapter-item {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background 0.2s;
}

.chapter-item:hover {
  background: #f9f9f9;
}

.chapter-item.active {
  background: #ffeaea;
  color: #ed424b;
}

.settings-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 300;
}

.settings-content h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  text-align: center;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.setting-item span {
  font-size: 14px;
  color: #666;
  min-width: 80px;
}

.color-options {
  display: flex;
  gap: 12px;
}

.color-options button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #fff;
  cursor: pointer;
  box-shadow: 0 0 0 2px #e5e5e5;
}

@media (max-width: 768px) {
  .reader-content {
    padding: 60px 15px 80px;
  }
  
  .chapter-content {
    padding: 20px;
  }
  
  .chapter-title-text {
    font-size: 20px;
  }
  
  .content-text {
    font-size: 16px;
  }
  
  .btn-prev, .btn-next {
    padding: 6px 16px;
    font-size: 12px;
  }
}
</style>