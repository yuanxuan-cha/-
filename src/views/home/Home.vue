<template>
  <!-- 
    首页组件
    功能：展示网站主要内容，包含轮播图、热门推荐、排行榜、分类等
    布局：排行榜(左) + 主体内容 + 最新更新(右)
  -->
  <div class="home">
    <div class="main-content">
      <!-- 左侧排行榜 -->
      <div class="left-sidebar">
        <div class="rank-box">
          <div class="section-header">
            <h2 class="section-title">排行榜</h2>
            <router-link to="/rank" class="more-link">更多</router-link>
          </div>
          <div class="rank-tabs">
            <span 
              v-for="(tab, index) in rankTabs" 
              :key="index"
              class="rank-tab"
              :class="{ active: activeRankTab === index }"
              @click="activeRankTab = index"
            >{{ tab.name }}</span>
          </div>
          <div class="rank-list">
            <router-link 
              v-for="(item, index) in getRankList()" 
              :key="item.id"
              :to="`/detail/${item.id}`"
              class="rank-item"
            >
              <span class="rank-num" :class="{ top: index < 3 }">{{ index + 1 }}</span>
              <div class="rank-info">
                <span class="rank-title">{{ item.title }}</span>
                <span class="rank-author">{{ item.author }}</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- 中间主体区域 -->
      <div class="center-section">
        <!-- 轮播图区域 -->
        <div class="banner-section" @mouseenter="pauseBanner" @mouseleave="resumeBanner">
          <div class="banner-swipe">
            <div 
              class="swipe-track" 
              :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
            >
              <div 
                v-for="banner in banners" 
                :key="banner.id" 
                class="swipe-item"
              >
                <router-link :to="banner.link">
                  <img v-lazy="banner.image" :alt="banner.title" class="banner-image" />
                  <div class="banner-title">{{ banner.title }}</div>
                </router-link>
              </div>
            </div>
          </div>
          <!-- 左右箭头 -->
          <button class="swipe-arrow left" @click="prevSlide">
            <span class="arrow-icon">‹</span>
          </button>
          <button class="swipe-arrow right" @click="nextSlide">
            <span class="arrow-icon">›</span>
          </button>
          <!-- 指示器 -->
          <div class="swipe-indicators">
            <span 
              v-for="(_, index) in banners" 
              :key="index" 
              class="indicator"
              :class="{ active: index === currentIndex }"
              @click="currentIndex = index"
            ></span>
          </div>
        </div>

        <!-- 热门推荐 -->
        <section class="hot-section">
          <div class="section-header">
            <div class="header-left">
              <h2 class="section-title">热门推荐</h2>
              <div class="section-tabs">
                <span 
                  v-for="(tab, index) in hotTabs" 
                  :key="index"
                  class="tab-item"
                  :class="{ active: activeHotTab === index }"
                  @click="activeHotTab = index"
                >{{ tab }}</span>
              </div>
            </div>
            <div class="header-right">
              <button class="refresh-btn" @click="refreshHotNovels" :class="{ refreshing: isRefreshing }">
                <span class="refresh-icon">{{ isRefreshing ? '🔄' : '🔄' }}</span>
                <span class="refresh-text">换一批</span>
              </button>
              <router-link to="/recommend" class="more-link">更多</router-link>
            </div>
          </div>
          <div class="hot-novels">
            <div class="novel-card" v-for="novel in currentHotNovels" :key="novel.id">
              <router-link :to="`/detail/${novel.id}`" class="novel-cover-link">
                <img v-lazy="novel.cover" :alt="novel.title" class="novel-cover" />
                <span v-if="novel.tag" class="novel-tag">{{ novel.tag }}</span>
              </router-link>
              <div class="novel-info">
                <router-link :to="`/detail/${novel.id}`" class="novel-title">{{ novel.title }}</router-link>
                <p class="novel-author">{{ novel.author }}</p>
                <p class="novel-desc">{{ novel.description }}</p>
                <p class="novel-update" v-if="novel.latestChapter">最新: {{ novel.latestChapter }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 分类专区 -->
        <section class="category-section">
          <div class="section-header">
            <h2 class="section-title">分类专区</h2>
            <router-link to="/category" class="more-link">更多</router-link>
          </div>
          <div class="category-grid">
            <router-link 
              v-for="category in categories" 
              :key="category.id" 
              :to="`/category?type=${category.name}`"
              class="category-item"
            >
              <div class="category-icon">{{ category.icon }}</div>
              <div class="category-name">{{ category.name }}</div>
              <div class="category-count">{{ category.count }}本</div>
            </router-link>
          </div>
        </section>

        <!-- 完本推荐 -->
        <section class="complete-section">
          <div class="section-header">
            <h2 class="section-title">完本小说</h2>
            <router-link to="/complete" class="more-link">更多</router-link>
          </div>
          <div class="complete-grid">
            <router-link 
              v-for="novel in completeNovels" 
              :key="novel.id" 
              :to="`/detail/${novel.id}`"
              class="complete-item"
            >
              <div class="complete-cover-wrap">
                <img v-lazy="novel.cover" :alt="novel.title" class="complete-cover" />
                <span class="complete-badge">完本</span>
              </div>
              <div class="complete-info">
                <h4 class="complete-title">{{ novel.title }}</h4>
                <p class="complete-author">{{ novel.author }}</p>
                <p class="complete-word-count">{{ novel.wordCount }}字</p>
              </div>
            </router-link>
          </div>
        </section>

        <!-- 免费小说 -->
        <section class="free-section">
          <div class="section-header">
            <h2 class="section-title">免费小说</h2>
            <router-link to="/free" class="more-link">更多</router-link>
          </div>
          <div class="free-grid">
            <router-link 
              v-for="novel in freeNovels" 
              :key="novel.id" 
              :to="`/detail/${novel.id}`"
              class="free-item"
            >
              <div class="free-cover-wrap">
                <img v-lazy="novel.cover" :alt="novel.title" class="free-cover" />
                <span class="free-badge">免费</span>
              </div>
              <div class="free-info">
                <h4 class="free-title">{{ novel.title }}</h4>
                <p class="free-author">{{ novel.author }}</p>
                <p class="free-tags">{{ novel.tags.join(' · ') }}</p>
              </div>
            </router-link>
          </div>
        </section>

        <!-- 编辑推荐 -->
        <section class="recommend-section">
          <div class="section-header">
            <h2 class="section-title">编辑推荐</h2>
          </div>
          <div class="recommend-grid">
            <router-link 
              v-for="novel in recommendNovels" 
              :key="novel.id" 
              :to="`/detail/${novel.id}`"
              class="recommend-item"
            >
              <div class="recommend-cover-wrap">
                <img v-lazy="novel.cover" :alt="novel.title" class="recommend-cover" />
              </div>
              <div class="recommend-info">
                <h4 class="recommend-title">{{ novel.title }}</h4>
                <p class="recommend-author">{{ novel.author }}</p>
                <p class="recommend-desc">{{ novel.description }}</p>
              </div>
            </router-link>
          </div>
        </section>
      </div>

      <!-- 右侧最新更新 -->
      <div class="right-sidebar">
        <div class="update-box">
          <div class="section-header">
            <h2 class="section-title">最新更新</h2>
          </div>
          <div class="update-list">
            <router-link 
              v-for="item in updateList" 
              :key="item.id"
              :to="`/detail/${item.id}`"
              class="update-item"
            >
              <div class="update-info">
                <span class="update-title">{{ item.title }}</span>
                <span class="update-chapter">{{ item.latestChapter }}</span>
              </div>
              <span class="update-time">{{ item.updateTime }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 首页组件逻辑
 * 功能：管理首页数据、轮播图切换、排行榜切换
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 当前轮播图索引
const currentIndex = ref(0)
// 当前排行榜Tab索引
const activeRankTab = ref(0)
// 当前热门Tab索引
const activeHotTab = ref(0)
// 轮播图定时器
let timer = null
// 轮播图是否暂停
const isPaused = ref(false)

// 轮播图数据
const banners = ref([
  { id: 1, image: 'https://picsum.photos/728/300?random=1', title: '玄幻小说推荐', link: '/detail/1' },
  { id: 2, image: 'https://picsum.photos/728/300?random=2', title: '都市小说精选', link: '/detail/11' },
  { id: 3, image: 'https://picsum.photos/728/300?random=3', title: '科幻小说排行', link: '/detail/21' }
])

// 热门Tab
const hotTabs = ['全部', '玄幻', '都市', '仙侠']

// 所有小说数据（用于随机选取）
const allNovels = ref([
  { id: 1, title: '斗破苍穹', author: '天蚕土豆', category: '玄幻', cover: 'https://picsum.photos/120/160?random=10', description: '这里是属于斗气的世界，没有花俏艳丽的魔法，有的，仅仅是繁衍到巅峰的斗气！', tag: '热门', latestChapter: '第1648章 大结局' },
  { id: 2, title: '完美世界', author: '辰东', category: '玄幻', cover: 'https://picsum.photos/120/160?random=16', description: '一粒尘可填海，一根草斩尽日月星辰，弹指间天翻地覆。', tag: '新书', latestChapter: '第2014章 完美终章' },
  { id: 3, title: '遮天', author: '辰东', category: '仙侠', cover: 'https://picsum.photos/120/160?random=30', description: '冰冷与黑暗并存的宇宙深处，九具庞大的龙尸拉着一口青铜古棺。', tag: '热门', latestChapter: '第1880章 终章' },
  { id: 4, title: '大主宰', author: '天蚕土豆', category: '玄幻', cover: 'https://picsum.photos/120/160?random=31', description: '大千世界，位面交汇，万族林立，群雄荟萃，一位位来自下位面的天之至尊。', tag: '新书', latestChapter: '第1551章 大主宰' },
  { id: 5, title: '武动乾坤', author: '天蚕土豆', category: '玄幻', cover: 'https://picsum.photos/120/160?random=32', description: '大炎王朝天都郡炎城青阳镇，一个落魄的林氏子弟林动在山洞间偶然捡到一块神秘石符。', latestChapter: '第1307章 结束，也是开始' },
  { id: 6, title: '星辰变', author: '我吃西红柿', category: '玄幻', cover: 'https://picsum.photos/120/160?random=15', description: '一名孩童，天生无法修炼内功。', latestChapter: '第987章 星辰变' },
  { id: 7, title: '盘龙', author: '我吃西红柿', category: '玄幻', cover: 'https://picsum.photos/120/160?random=47', description: '大陆上传说中的四大终极强者之一的大地领域强者林雷·巴鲁克。', latestChapter: '第867章 完本' },
  { id: 8, title: '神墓', author: '辰东', category: '玄幻', cover: 'https://picsum.photos/120/160?random=48', description: '神死了，魔灭了，我还活着...为什么？', latestChapter: '第1086章 结局' },
  { id: 9, title: '雪中悍刀行', author: '烽火戏诸侯', category: '武侠', cover: 'https://picsum.photos/120/160?random=17', description: '道门真人飞天入地，千里取人首级。', latestChapter: '第1234章 武道' },
  { id: 10, title: '仙逆', author: '耳根', category: '仙侠', cover: 'https://picsum.photos/120/160?random=46', description: '顺为凡，逆则仙，仙逆顺为凡，逆则仙。', latestChapter: '第2088章 完结' },
  { id: 11, title: '赘婿', author: '愤怒的香蕉', category: '都市', cover: 'https://picsum.photos/120/160?random=14', description: '一个受够了勾心斗角的金融界巨头回到了古代。', latestChapter: '第1189章 风云' },
  { id: 12, title: '庆余年', author: '猫腻', category: '历史', cover: 'https://picsum.photos/120/160?random=42', description: '积善之家，必有余庆，留余庆，留余庆，忽遇恩人。', tag: '热门', latestChapter: '第856章 结局' },
  { id: 13, title: '全职高手', author: '蝴蝶蓝', category: '游戏', cover: 'https://picsum.photos/120/160?random=41', description: '网游荣耀中被誉为教科书级别的顶尖高手叶修，被俱乐部驱逐后重新归来。', latestChapter: '第1728章 世界冠军' },
  { id: 21, title: '三体', author: '刘慈欣', category: '科幻', cover: 'https://picsum.photos/120/160?random=40', description: '地球人类文明和三体文明之间的信息交流、生死搏杀。', tag: '经典', latestChapter: '第456章 终章' },
  { id: 31, title: '凡人修仙传', author: '忘语', category: '仙侠', cover: 'https://picsum.photos/120/160?random=13', description: '一个普通的山村穷小子，偶然之下，跨入到一个江湖小门派。', tag: '推荐', latestChapter: '第2448章 仙界篇' },
  { id: 91, title: '鬼吹灯', author: '天下霸唱', category: '悬疑', cover: 'https://picsum.photos/120/160?random=43', description: '胡八一上山下乡来到东北地区，在一个叫做岗岗营子的村庄插队落户。', latestChapter: '第220章 完本' },
  { id: 92, title: '盗墓笔记', author: '南派三叔', category: '悬疑', cover: 'https://picsum.photos/120/160?random=44', description: '五十年前，一群长沙土夫子挖到了一件战国古墓。', tag: '经典', latestChapter: '第240章 终章' },
  { id: 107, title: '三生三世十里桃花', author: '唐七公子', category: '言情', cover: 'https://picsum.photos/120/160?random=45', description: '三生三世的爱情传奇。', tag: '新书', latestChapter: '第58章 结局' },
  { id: 53, title: '回到明朝当王爷', author: '月关', category: '历史', cover: 'https://picsum.photos/120/160?random=49', description: '一个现代人杨凌，穿越到明朝正德年间，成为王爷。', tag: '热门', latestChapter: '第1200章 完本' },
  { id: 54, title: '极品家丁', author: '禹岩', category: '历史', cover: 'https://picsum.photos/120/160?random=50', description: '一个现代人穿越到明朝，成为林三，如何在古代风生水起。', latestChapter: '第1800章 结局' }
])

// 当前显示的热门小说
const displayedHotNovels = ref([...allNovels.value.slice(0, 9)])

// 刷新状态
const isRefreshing = ref(false)

// 计算当前显示的热门小说
const currentHotNovels = computed(() => {
  if (activeHotTab.value === 0) {
    return displayedHotNovels.value
  }
  const category = hotTabs[activeHotTab.value]
  return displayedHotNovels.value.filter(novel => novel.category === category)
})

// 刷新热门推荐 - 随机选取9本小说
const refreshHotNovels = () => {
  isRefreshing.value = true
  
  const shuffled = [...allNovels.value].sort(() => Math.random() - 0.5)
  displayedHotNovels.value = shuffled.slice(0, 9)
  
  setTimeout(() => {
    isRefreshing.value = false
  }, 500)
}

// 分类数据
const categories = ref([
  { id: 1, name: '玄幻', icon: '⚔️', count: 123456 },
  { id: 2, name: '都市', icon: '🏙️', count: 98765 },
  { id: 3, name: '科幻', icon: '🚀', count: 45678 },
  { id: 4, name: '武侠', icon: '🥋', count: 34567 },
  { id: 5, name: '仙侠', icon: '🧙', count: 56789 },
  { id: 6, name: '历史', icon: '📜', count: 23456 },
  { id: 7, name: '军事', icon: '🎖️', count: 12345 },
  { id: 8, name: '游戏', icon: '🎮', count: 28901 },
  { id: 9, name: '竞技', icon: '⚽', count: 8765 },
  { id: 10, name: '悬疑', icon: '🔍', count: 19876 },
  { id: 11, name: '言情', icon: '💕', count: 67890 },
  { id: 12, name: '短篇小说', icon: '📖', count: 15678 }
])

// 推荐小说数据
const recommendNovels = ref([
  { id: 1, title: '斗破苍穹', author: '天蚕土豆', cover: 'https://picsum.photos/140/200?random=20', description: '这里是属于斗气的世界，没有花俏艳丽的魔法，有的，仅仅是繁衍到巅峰的斗气！' },
  { id: 2, title: '完美世界', author: '辰东', cover: 'https://picsum.photos/140/200?random=24', description: '一粒尘可填海，一根草斩尽日月星辰，弹指间天翻地覆。' },
  { id: 3, title: '遮天', author: '辰东', cover: 'https://picsum.photos/140/200?random=40', description: '冰冷与黑暗并存的宇宙深处，九具庞大的龙尸拉着一口青铜古棺。' },
  { id: 4, title: '大主宰', author: '天蚕土豆', cover: 'https://picsum.photos/140/200?random=41', description: '大千世界，位面交汇，万族林立，群雄荟萃，一位位来自下位面的天之至尊。' },
  { id: 5, title: '武动乾坤', author: '天蚕土豆', cover: 'https://picsum.photos/140/200?random=42', description: '大炎王朝天都郡炎城青阳镇，一个落魄的林氏子弟林动在山洞间偶然捡到一块神秘石符。' },
  { id: 11, title: '赘婿', author: '愤怒的香蕉', cover: 'https://picsum.photos/140/200?random=25', description: '一个受够了勾心斗角的金融界巨头回到了古代。' },
  { id: 12, title: '庆余年', author: '猫腻', cover: 'https://picsum.photos/140/200?random=21', description: '积善之家，必有余庆，留余庆，留余庆，忽遇恩人。' },
  { id: 13, title: '全职高手', author: '蝴蝶蓝', cover: 'https://picsum.photos/140/200?random=43', description: '网游荣耀中被誉为教科书级别的顶尖高手叶修，被俱乐部驱逐后重新归来。' },
  { id: 21, title: '三体', author: '刘慈欣', cover: 'https://picsum.photos/140/200?random=22', description: '地球人类文明和三体文明之间的信息交流、生死搏杀。' },
  { id: 31, title: '凡人修仙传', author: '忘语', cover: 'https://picsum.photos/140/200?random=23', description: '一个普通的山村穷小子，偶然之下，跨入到一个江湖小门派。' },
  { id: 91, title: '鬼吹灯', author: '天下霸唱', cover: 'https://picsum.photos/140/200?random=44', description: '胡八一上山下乡来到东北地区，在一个叫做岗岗营子的村庄插队落户。' },
  { id: 92, title: '盗墓笔记', author: '南派三叔', cover: 'https://picsum.photos/140/200?random=45', description: '五十年前，一群长沙土夫子挖到了一件战国古墓，从此开启了一段惊心动魄的冒险。' }
])

// 完本小说数据
const completeNovels = ref([
  { id: 1, title: '斗破苍穹', author: '天蚕土豆', cover: 'https://picsum.photos/140/200?random=50', wordCount: '538万' },
  { id: 31, title: '凡人修仙传', author: '忘语', cover: 'https://picsum.photos/140/200?random=51', wordCount: '770万' },
  { id: 6, title: '星辰变', author: '我吃西红柿', cover: 'https://picsum.photos/140/200?random=52', wordCount: '280万' },
  { id: 3, title: '遮天', author: '辰东', cover: 'https://picsum.photos/140/200?random=53', wordCount: '630万' },
  { id: 5, title: '武动乾坤', author: '天蚕土豆', cover: 'https://picsum.photos/140/200?random=54', wordCount: '380万' },
  { id: 13, title: '全职高手', author: '蝴蝶蓝', cover: 'https://picsum.photos/140/200?random=55', wordCount: '530万' },
  { id: 91, title: '鬼吹灯', author: '天下霸唱', cover: 'https://picsum.photos/140/200?random=56', wordCount: '220万' },
  { id: 92, title: '盗墓笔记', author: '南派三叔', cover: 'https://picsum.photos/140/200?random=57', wordCount: '240万' }
])

// 免费小说数据
const freeNovels = ref([
  { id: 14, title: '重生之都市修仙', author: '十里剑神', cover: 'https://picsum.photos/140/200?random=60', tags: ['都市', '重生', '修仙'] },
  { id: 15, title: '极品全能学生', author: '花都大少', cover: 'https://picsum.photos/140/200?random=61', tags: ['都市', '爽文', '全能'] },
  { id: 16, title: '最强弃少', author: '鹅是老五', cover: 'https://picsum.photos/140/200?random=62', tags: ['都市', '修仙', '爽文'] },
  { id: 17, title: '医道特种兵', author: '青衫取醉', cover: 'https://picsum.photos/140/200?random=63', tags: ['都市', '特种兵', '医术'] },
  { id: 18, title: '超级兵王', author: '步千帆', cover: 'https://picsum.photos/140/200?random=64', tags: ['都市', '兵王', '热血'] },
  { id: 19, title: '校花的贴身高手', author: '鱼人二代', cover: 'https://picsum.photos/140/200?random=65', tags: ['都市', '校花', '修仙'] },
  { id: 10, title: '仙逆', author: '耳根', cover: 'https://picsum.photos/140/200?random=66', tags: ['仙侠', '玄幻', '修炼'] },
  { id: 32, title: '求魔', author: '耳根', cover: 'https://picsum.photos/140/200?random=67', tags: ['玄幻', '仙侠', '修真'] }
])

// 排行榜Tab
const rankTabs = ref([
  { name: '点击榜', key: 'click' },
  { name: '推荐榜', key: 'recommend' },
  { name: '月票榜', key: 'ticket' }
])

// 排行榜数据
const rankData = [
  [
    { id: 1, title: '斗破苍穹', author: '天蚕土豆' },
    { id: 2, title: '完美世界', author: '辰东' },
    { id: 31, title: '凡人修仙传', author: '忘语' },
    { id: 11, title: '赘婿', author: '愤怒的香蕉' },
    { id: 6, title: '星辰变', author: '我吃西红柿' },
    { id: 9, title: '雪中悍刀行', author: '烽火戏诸侯' },
    { id: 12, title: '庆余年', author: '猫腻' },
    { id: 21, title: '三体', author: '刘慈欣' },
    { id: 3, title: '遮天', author: '辰东' },
    { id: 4, title: '大主宰', author: '天蚕土豆' }
  ],
  [
    { id: 9, title: '雪中悍刀行', author: '烽火戏诸侯' },
    { id: 21, title: '三体', author: '刘慈欣' },
    { id: 2, title: '完美世界', author: '辰东' },
    { id: 12, title: '庆余年', author: '猫腻' },
    { id: 1, title: '斗破苍穹', author: '天蚕土豆' },
    { id: 31, title: '凡人修仙传', author: '忘语' },
    { id: 11, title: '赘婿', author: '愤怒的香蕉' },
    { id: 6, title: '星辰变', author: '我吃西红柿' },
    { id: 13, title: '全职高手', author: '蝴蝶蓝' },
    { id: 91, title: '鬼吹灯', author: '天下霸唱' }
  ],
  [
    { id: 2, title: '完美世界', author: '辰东' },
    { id: 11, title: '赘婿', author: '愤怒的香蕉' },
    { id: 1, title: '斗破苍穹', author: '天蚕土豆' },
    { id: 31, title: '凡人修仙传', author: '忘语' },
    { id: 9, title: '雪中悍刀行', author: '烽火戏诸侯' },
    { id: 6, title: '星辰变', author: '我吃西红柿' },
    { id: 21, title: '三体', author: '刘慈欣' },
    { id: 12, title: '庆余年', author: '猫腻' },
    { id: 92, title: '盗墓笔记', author: '南派三叔' },
    { id: 5, title: '武动乾坤', author: '天蚕土豆' }
  ]
]

// 最新更新数据
const updateList = ref([
  { id: 1, title: '斗破苍穹', latestChapter: '第1648章 大结局', updateTime: '10分钟前' },
  { id: 2, title: '完美世界', latestChapter: '第2014章 完美终章', updateTime: '30分钟前' },
  { id: 31, title: '凡人修仙传', latestChapter: '第2448章 仙界篇', updateTime: '1小时前' },
  { id: 11, title: '赘婿', latestChapter: '第1189章 风云', updateTime: '2小时前' },
  { id: 6, title: '星辰变', latestChapter: '第987章 星辰变', updateTime: '3小时前' },
  { id: 3, title: '遮天', latestChapter: '第1880章 终章', updateTime: '4小时前' },
  { id: 4, title: '大主宰', latestChapter: '第1551章 大主宰', updateTime: '5小时前' },
  { id: 13, title: '全职高手', latestChapter: '第1728章 世界冠军', updateTime: '6小时前' }
])

// 获取当前排行榜列表
const getRankList = () => {
  return rankData[activeRankTab.value]
}

// 上一张轮播图
const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + banners.value.length) % banners.value.length
}

// 下一张轮播图
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % banners.value.length
}

// 鼠标进入时暂停轮播
const pauseBanner = () => {
  isPaused.value = true
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// 鼠标离开时恢复轮播
const resumeBanner = () => {
  isPaused.value = false
  startBanner()
}

// 启动轮播定时器
const startBanner = () => {
  if (!timer && !isPaused.value) {
    timer = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % banners.value.length
    }, 4000)
  }
}

onMounted(() => {
  startBanner()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped>
/* ===================================
   首页整体布局
   =================================== */

.home {
  background: var(--bg-color);
  min-height: 100vh;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.left-sidebar {
  width: 220px;
  flex-shrink: 0;
}

.center-section {
  flex: 1;
  min-width: 0;
}

.right-sidebar {
  width: 240px;
  flex-shrink: 0;
}

.left-sidebar .rank-box,
.right-sidebar .update-box {
  background: var(--bg-white);
  padding: 16px;
  border-radius: 4px;
}

.left-sidebar .rank-list,
.right-sidebar .update-list {
  max-height: 600px;
  overflow-y: auto;
}

.left-sidebar .rank-list::-webkit-scrollbar,
.right-sidebar .update-list::-webkit-scrollbar {
  width: 4px;
}

.left-sidebar .rank-list::-webkit-scrollbar-thumb,
.right-sidebar .update-list::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 2px;
}

/* ===================================
   轮播图区域
   =================================== */

.banner-section {
  margin-bottom: 20px;
  position: relative;
}

.banner-swipe {
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  height: 300px;
}

.swipe-track {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease;
}

.swipe-item {
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  position: relative;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: #fff;
  font-size: 16px;
}

.swipe-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 60px;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  z-index: 10;
}

.swipe-arrow:hover {
  background: rgba(0, 0, 0, 0.5);
}

.swipe-arrow.left {
  left: 0;
  border-radius: 0 4px 4px 0;
}

.swipe-arrow.right {
  right: 0;
  border-radius: 4px 0 0 4px;
}

.arrow-icon {
  font-size: 36px;
  line-height: 1;
  font-weight: bold;
}

.swipe-indicators {
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s;
}

.indicator.active {
  width: 24px;
  border-radius: 5px;
  background: var(--primary-color);
}

/* ===================================
   区域标题通用样式
   =================================== */

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--primary-color);
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  color: var(--text-color);
  margin: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.section-tabs {
  display: flex;
  gap: 20px;
}

.tab-item {
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.3s;
}

.tab-item:hover,
.tab-item.active {
  color: var(--primary-color);
}

.more-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.more-link:hover {
  color: var(--primary-color);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: 1px solid var(--border-color);
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-secondary);
  transition: all 0.3s;
}

.refresh-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: rgba(237, 66, 75, 0.05);
}

.refresh-btn.refreshing {
  animation: spin 0.5s linear infinite;
}

.refresh-icon {
  font-size: 14px;
}

.refresh-text {
  font-size: 13px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ===================================
   热门推荐区域
   =================================== */

.hot-section {
  background: var(--bg-white);
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.hot-section:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.hot-novels {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.novel-card {
  display: flex;
  gap: 16px;
  padding: 12px;
  border-radius: 4px;
  transition: background 0.3s;
}

.novel-card:hover {
  background: var(--bg-color);
}

.novel-cover-link {
  position: relative;
  flex-shrink: 0;
}

.novel-cover {
  width: 100px;
  height: 140px;
  object-fit: cover;
  border-radius: 2px;
}

.novel-tag {
  position: absolute;
  top: 0;
  left: 0;
  background: var(--primary-color);
  color: var(--bg-white);
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 0 0 2px 0;
}

.novel-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding-top: 4px;
}

.novel-title {
  font-size: 15px;
  font-weight: bold;
  color: var(--text-color);
  text-decoration: none;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s;
}

.novel-title:hover {
  color: var(--primary-color);
}

.novel-author {
  font-size: 13px;
  color: var(--text-light);
  margin: 0 0 8px 0;
}

.novel-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0 0 8px 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.novel-update {
  font-size: 12px;
  color: var(--primary-color);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===================================
   排行榜区域
   =================================== */

.rank-box {
  background: var(--bg-white);
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.rank-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 12px;
}

.rank-tab {
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.rank-tab:hover,
.rank-tab.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  padding: 4px 0;
  transition: background 0.3s;
  border-radius: 2px;
}

.rank-item:hover {
  background: var(--bg-color);
}

.rank-num {
  width: 22px;
  height: 22px;
  background: #e5e5e5;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  flex-shrink: 0;
}

.rank-num.top {
  background: var(--primary-color);
  color: var(--bg-white);
}

.rank-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.rank-title {
  font-size: 14px;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.rank-author {
  font-size: 12px;
  color: var(--text-light);
  margin-top: 2px;
}

/* ===================================
   最新更新区域
   =================================== */

.update-box {
  background: var(--bg-white);
  padding: 20px;
  border-radius: 4px;
}

.update-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.update-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  color: inherit;
  padding: 8px 0;
  transition: background 0.3s;
  border-radius: 2px;
}

.update-item:hover {
  background: var(--bg-color);
}

.update-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.update-title {
  font-size: 14px;
  color: var(--text-color);
  font-weight: 500;
}

.update-chapter {
  font-size: 12px;
  color: var(--primary-color);
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.update-time {
  font-size: 12px;
  color: var(--text-light);
  flex-shrink: 0;
  margin-left: 12px;
}

/* ===================================
   分类区域
   =================================== */

.category-section {
  background: var(--bg-white);
  margin-bottom: 20px;
}

.category-section .section-header {
  margin-bottom: 0;
  padding: 16px 20px 12px;
  border-bottom: 2px solid var(--primary-color);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  padding: 20px;
  gap: 1px;
  background: #f0f0f0;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 12px;
  text-decoration: none;
  color: var(--text-color);
  font-size: 14px;
  transition: all 0.3s;
  background: var(--bg-white);
  min-height: 100px;
}

.category-item:hover {
  background: var(--bg-color);
  color: var(--primary-color);
}

.category-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.category-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.category-count {
  color: var(--text-light);
  font-size: 12px;
}

/* ===================================
   完本小说区域
   =================================== */

.complete-section {
  background: var(--bg-white);
  margin-bottom: 20px;
}

.complete-section .section-header {
  margin-bottom: 0;
  padding: 16px 20px 12px;
  border-bottom: 2px solid #4CAF50;
}

.complete-section .section-title {
  color: #4CAF50;
}

.complete-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 20px;
  gap: 20px;
}

.complete-item {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s;
}

.complete-item:hover {
  transform: translateY(-4px);
}

.complete-cover-wrap {
  position: relative;
  margin-bottom: 12px;
}

.complete-cover {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  border-radius: 2px;
}

.complete-badge {
  position: absolute;
  top: 0;
  left: 0;
  background: #4CAF50;
  color: var(--bg-white);
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 0 0 2px 0;
}

.complete-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.complete-title {
  font-size: 14px;
  font-weight: bold;
  color: var(--text-color);
  margin: 0 0 6px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s;
}

.complete-item:hover .complete-title {
  color: #4CAF50;
}

.complete-author {
  font-size: 12px;
  color: var(--text-light);
  margin: 0 0 4px 0;
}

.complete-word-count {
  font-size: 11px;
  color: var(--text-light);
  margin: 0;
}

/* ===================================
   免费小说区域
   =================================== */

.free-section {
  background: var(--bg-white);
  margin-bottom: 20px;
}

.free-section .section-header {
  margin-bottom: 0;
  padding: 16px 20px 12px;
  border-bottom: 2px solid #FF9800;
}

.free-section .section-title {
  color: #FF9800;
}

.free-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 20px;
  gap: 20px;
}

.free-item {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s;
}

.free-item:hover {
  transform: translateY(-4px);
}

.free-cover-wrap {
  position: relative;
  margin-bottom: 12px;
}

.free-cover {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  border-radius: 2px;
}

.free-badge {
  position: absolute;
  top: 0;
  left: 0;
  background: #FF9800;
  color: var(--bg-white);
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 0 0 2px 0;
}

.free-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.free-title {
  font-size: 14px;
  font-weight: bold;
  color: var(--text-color);
  margin: 0 0 6px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s;
}

.free-item:hover .free-title {
  color: #FF9800;
}

.free-author {
  font-size: 12px;
  color: var(--text-light);
  margin: 0 0 4px 0;
}

.free-tags {
  font-size: 11px;
  color: var(--text-light);
  margin: 0;
}

/* ===================================
   推荐区域
   =================================== */

.recommend-section {
  background: var(--bg-white);
  margin-bottom: 40px;
}

.recommend-section .section-header {
  margin-bottom: 0;
  padding: 16px 20px 12px;
  border-bottom: 2px solid var(--primary-color);
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 20px;
  gap: 20px;
}

.recommend-item {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s;
}

.recommend-item:hover {
  transform: translateY(-4px);
}

.recommend-cover-wrap {
  position: relative;
  margin-bottom: 12px;
}

.recommend-cover {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  border-radius: 2px;
}

.recommend-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.recommend-title {
  font-size: 14px;
  font-weight: bold;
  color: var(--text-color);
  margin: 0 0 6px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s;
}

.recommend-item:hover .recommend-title {
  color: var(--primary-color);
}

.recommend-author {
  font-size: 12px;
  color: var(--text-light);
  margin: 0 0 8px 0;
}

.recommend-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===================================
   响应式设计 - 平板端
   =================================== */

@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }
  
  .left-sidebar,
  .right-sidebar {
    width: 100%;
  }
  
  .left-sidebar .rank-list,
  .right-sidebar .update-list {
    max-height: 400px;
  }
  
  .hot-novels {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .category-grid {
    grid-template-columns: repeat(4, 1fr);
    padding: 16px;
  }
  
  .complete-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .free-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .recommend-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ===================================
   响应式设计 - 移动端
   =================================== */

@media (max-width: 768px) {
  .main-content {
    padding: 12px;
  }
  
  .banner-swipe {
    height: 200px;
  }
  
  .swipe-arrow {
    width: 32px;
    height: 48px;
  }
  
  .arrow-icon {
    font-size: 28px;
  }
  
  .hot-novels {
    grid-template-columns: 1fr;
  }
  
  .category-grid {
    grid-template-columns: repeat(3, 1fr);
    padding: 12px;
  }
  
  .category-item {
    padding: 16px 8px;
    min-height: 90px;
  }
  
  .complete-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .free-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .recommend-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* ===================================
   响应式设计 - 小屏移动端
   =================================== */

@media (max-width: 480px) {
  .banner-swipe {
    height: 160px;
  }
  
  .banner-title {
    font-size: 14px;
    padding: 12px;
  }
  
  .swipe-arrow {
    width: 28px;
    height: 40px;
  }
  
  .arrow-icon {
    font-size: 24px;
  }
  
  .category-grid {
    grid-template-columns: repeat(3, 1fr);
    padding: 8px;
  }
  
  .category-item {
    padding: 12px 6px;
    min-height: 80px;
  }
  
  .category-icon {
    font-size: 28px;
  }
  
  .category-name {
    font-size: 13px;
  }
  
  .category-count {
    font-size: 11px;
  }
  
  .complete-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .free-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .recommend-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
