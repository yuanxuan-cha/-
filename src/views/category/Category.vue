<template>
  <div class="category-page">
    <div class="page-header">
      <h1>小说分类</h1>
      <p>发现您喜欢的小说类型</p>
    </div>

    <div class="category-container">
      <div class="tabs-header">
        <div 
          v-for="(category, index) in categories" 
          :key="category.id" 
          class="tab-item"
          :class="{ active: activeTab === index }"
          @click="activeTab = index"
        >
          {{ category.name }}
        </div>
      </div>

      <div class="tab-content">
        <div class="novel-list">
          <div class="novel-grid">
            <router-link 
              v-for="novel in filteredNovels" 
              :key="novel.id" 
              :to="`/detail/${novel.id}`"
              class="novel-card"
            >
              <img v-lazy="novel.cover" :alt="novel.title" class="novel-cover" />
              <div class="novel-info">
                <h3 class="novel-title">{{ novel.title }}</h3>
                <p class="novel-author">{{ novel.author }}</p>
                <p class="novel-desc">{{ novel.description }}</p>
                <div class="novel-meta">
                  <span class="category-tag">{{ novel.category }}</span>
                  <span class="novel-views">{{ formatNumber(novel.views) }} 阅读</span>
                  <div class="rating">
                    <span v-for="i in 5" :key="i" class="star">
                      {{ i <= Math.floor(novel.rating) ? '★' : '☆' }}
                    </span>
                  </div>
                </div>
              </div>
            </router-link>
          </div>

          <div v-if="filteredNovels.length === 0" class="empty">
            <p>暂无小说</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { formatNumber } from '@/utils'

const route = useRoute()
const activeTab = ref(0)
const categories = ref([
  { id: 1, name: '玄幻' },
  { id: 2, name: '都市' },
  { id: 3, name: '科幻' },
  { id: 4, name: '仙侠' },
  { id: 5, name: '武侠' },
  { id: 6, name: '历史' },
  { id: 7, name: '军事' },
  { id: 8, name: '游戏' },
  { id: 9, name: '竞技' },
  { id: 10, name: '悬疑' },
  { id: 11, name: '言情' },
  { id: 12, name: '短篇' }
])

const novels = ref([
  // 玄幻类
  { id: 1, title: '斗破苍穹', author: '天蚕土豆', category: '玄幻', cover: 'https://picsum.photos/300/400?random=10', views: 125678, rating: 9.2, description: '这里是属于斗气的世界，没有花俏艳丽的魔法，有的，仅仅是繁衍到巅峰的斗气！' },
  { id: 2, title: '完美世界', author: '辰东', category: '玄幻', cover: 'https://picsum.photos/300/400?random=11', views: 178901, rating: 9.3, description: '一粒尘可填海，一根草斩尽日月星辰，弹指间天翻地覆。' },
  { id: 3, title: '遮天', author: '辰东', category: '玄幻', cover: 'https://picsum.photos/300/400?random=12', views: 165432, rating: 9.1, description: '冰冷与黑暗并存的宇宙深处，九具庞大的龙尸拉着一口青铜古棺。' },
  { id: 4, title: '大主宰', author: '天蚕土豆', category: '玄幻', cover: 'https://picsum.photos/300/400?random=13', views: 145678, rating: 8.9, description: '大千世界，位面交汇，万族林立，群雄荟萃，一位位来自下位面的天之至尊。' },
  { id: 5, title: '武动乾坤', author: '天蚕土豆', category: '玄幻', cover: 'https://picsum.photos/300/400?random=14', views: 134567, rating: 8.8, description: '大炎王朝天都郡炎城青阳镇，一个落魄的林氏子弟林动在山洞间偶然捡到一块神秘石符。' },
  { id: 6, title: '星辰变', author: '我吃西红柿', category: '玄幻', cover: 'https://picsum.photos/300/400?random=15', views: 123456, rating: 8.7, description: '一名孩童，天生无法修炼内功。' },
  { id: 7, title: '盘龙', author: '我吃西红柿', category: '玄幻', cover: 'https://picsum.photos/300/400?random=16', views: 112345, rating: 8.6, description: '大陆上传说中的四大终极强者之一的大地领域强者林雷·巴鲁克。' },
  { id: 8, title: '神墓', author: '辰东', category: '玄幻', cover: 'https://picsum.photos/300/400?random=17', views: 156789, rating: 9.0, description: '神死了，魔灭了，我还活着...为什么？为何让我从远古神墓中复出？' },
  { id: 9, title: '雪中悍刀行', author: '烽火戏诸侯', category: '玄幻', cover: 'https://picsum.photos/300/400?random=18', views: 167890, rating: 9.4, description: '道门真人飞天入地，千里取人首级。' },
  { id: 10, title: '仙逆', author: '耳根', category: '玄幻', cover: 'https://picsum.photos/300/400?random=19', views: 134567, rating: 8.9, description: '顺为凡，逆则仙，仙逆顺为凡，逆则仙。' },
  
  // 都市类
  { id: 11, title: '赘婿', author: '愤怒的香蕉', category: '都市', cover: 'https://picsum.photos/300/400?random=20', views: 145678, rating: 8.9, description: '一个受够了勾心斗角的金融界巨头回到了古代。' },
  { id: 12, title: '庆余年', author: '猫腻', category: '都市', cover: 'https://picsum.photos/300/400?random=21', views: 98765, rating: 9.1, description: '积善之家，必有余庆，留余庆，留余庆，忽遇恩人。' },
  { id: 13, title: '全职高手', author: '蝴蝶蓝', category: '都市', cover: 'https://picsum.photos/300/400?random=22', views: 176543, rating: 9.3, description: '网游荣耀中被誉为教科书级别的顶尖高手叶修，被俱乐部驱逐后重新归来。' },
  { id: 14, title: '重生之都市修仙', author: '十里剑神', category: '都市', cover: 'https://picsum.photos/300/400?random=23', views: 198765, rating: 8.8, description: '一代渡劫期高手在都市修仙重生。' },
  { id: 15, title: '极品全能学生', author: '花都大少', category: '都市', cover: 'https://picsum.photos/300/400?random=24', views: 156789, rating: 8.5, description: '一场意外，让叶天拥有了透视能力。' },
  { id: 16, title: '最强弃少', author: '鹅是老五', category: '都市', cover: 'https://picsum.photos/300/400?random=25', views: 167890, rating: 8.7, description: '叶默和洛影本来只是普通的朋友，几年后，他们相恋。' },
  { id: 17, title: '医道特种兵', author: '青衫取醉', category: '都市', cover: 'https://picsum.photos/300/400?random=26', views: 145678, rating: 8.6, description: '特种兵回归都市，医道救人，兵道杀人。' },
  { id: 18, title: '超级兵王', author: '步千帆', category: '都市', cover: 'https://picsum.photos/300/400?random=27', views: 187654, rating: 8.9, description: '他是超级兵王，也是让各势力闻风丧胆的兵王。' },
  { id: 19, title: '校花的贴身高手', author: '鱼人二代', category: '都市', cover: 'https://picsum.photos/300/400?random=28', views: 234567, rating: 8.4, description: '修真高手回归都市，修仙泡校花，校园都市两不误。' },
  { id: 20, title: '都市奇门医圣', author: '一念', category: '都市', cover: 'https://picsum.photos/300/400?random=29', views: 198765, rating: 8.8, description: '赘婿偶得医圣传承，都市行医，都市修仙，都市成神。' },
  
  // 科幻类
  { id: 21, title: '三体', author: '刘慈欣', category: '科幻', cover: 'https://picsum.photos/300/400?random=30', views: 87654, rating: 9.5, description: '地球人类文明和三体文明之间的信息交流、生死搏杀。' },
  { id: 22, title: '流浪地球', author: '刘慈欣', category: '科幻', cover: 'https://picsum.photos/300/400?random=31', views: 76543, rating: 9.2, description: '太阳即将毁灭，人类在地球表面建造出巨大的推进器。' },
  { id: 23, title: '乡村教师', author: '刘慈欣', category: '科幻', cover: 'https://picsum.photos/300/400?random=32', views: 65432, rating: 9.0, description: '一个乡村教师在生命的最后时刻，把力学三大定律讲解给自己的学生。' },
  { id: 24, title: '超神机械师', author: '齐佩甲', category: '科幻', cover: 'https://picsum.photos/300/400?random=33', views: 156789, rating: 8.9, description: '韩萧来到了星际时代，凭借先知先觉，成为最强的机械师。' },
  { id: 25, title: '全球进化', author: '咬狗', category: '科幻', cover: 'https://picsum.photos/300/400?random=34', views: 134567, rating: 8.7, description: '寒武纪再现，生物大进化，超凡生物降临地球。' },
  { id: 26, title: '学霸的黑科技系统', author: '晨星LL', category: '科幻', cover: 'https://picsum.photos/300/400?random=35', views: 167890, rating: 9.1, description: '一个大学数学老师意外获得黑科技系统，走上学霸之路。' },
  { id: 27, title: '我在末世有套房', author: '晨星LL', category: '科幻', cover: 'https://picsum.photos/300/400?random=36', views: 145678, rating: 8.8, description: '一觉醒来，末世降临，觉醒空间异能，却发现自己在末世前有一套房。' },
  { id: 28, title: '黑暗血时代', author: '天下飘火', category: '科幻', cover: 'https://picsum.photos/300/400?random=37', views: 123456, rating: 8.6, description: '如果这个世界没有光明，那么我就是那太阳。' },
  { id: 29, title: '九星毒奶', author: '育', category: '科幻', cover: 'https://picsum.photos/300/400?random=38', views: 176543, rating: 8.9, description: '融合九颗灾星，一步步成就不朽毒奶传奇。' },
  { id: 30, title: '末日边缘', author: '纪归墟', category: '科幻', cover: 'https://picsum.photos/300/400?random=39', views: 98765, rating: 8.5, description: '末日降临，看主角如何带领人类走向新生。' },
  
  // 仙侠类
  { id: 31, title: '凡人修仙传', author: '忘语', category: '仙侠', cover: 'https://picsum.photos/300/400?random=40', views: 156789, rating: 9.0, description: '一个普通的山村穷小子，偶然之下，跨入到一个江湖小门派。' },
  { id: 32, title: '求魔', author: '耳根', category: '仙侠', cover: 'https://picsum.photos/300/400?random=41', views: 145678, rating: 9.2, description: '既然世人皆称我为魔，则索性，从此我苏铭……就是魔。' },
  { id: 33, title: '我欲封天', author: '耳根', category: '仙侠', cover: 'https://picsum.photos/300/400?random=42', views: 167890, rating: 9.1, description: '我若要有，天不可无。我若要无，天不许有。' },
  { id: 34, title: '三寸人间', author: '耳根', category: '仙侠', cover: 'https://picsum.photos/300/400?random=43', views: 134567, rating: 8.8, description: '举头三尺已无神明，掌心三寸方是人间。' },
  { id: 35, title: '飞天', author: '跃千愁', category: '仙侠', cover: 'https://picsum.photos/300/400?random=44', views: 123456, rating: 8.7, description: '万丈红尘三杯酒，千秋大业一壶茶。' },
  { id: 36, title: '道君', author: '跃千愁', category: '仙侠', cover: 'https://picsum.photos/300/400?random=45', views: 112345, rating: 8.6, description: '一个地球神棍，穿越异界，凭借地球道术传承，步步崛起。' },
  { id: 37, title: '前任无双', author: '跃千愁', category: '仙侠', cover: 'https://picsum.photos/300/400?random=46', views: 98765, rating: 8.5, description: '跃千愁新书，带你走进不一样的仙侠世界。' },
  { id: 38, title: '遮天', author: '辰东', category: '仙侠', cover: 'https://picsum.photos/300/400?random=47', views: 165432, rating: 9.1, description: '冰冷与黑暗并存的宇宙深处，九具庞大的龙尸拉着一口青铜古棺。' },
  { id: 39, title: '仙逆', author: '耳根', category: '仙侠', cover: 'https://picsum.photos/300/400?random=48', views: 134567, rating: 8.9, description: '顺为凡，逆则仙，仙逆顺为凡，逆则仙。' },
  { id: 40, title: '百炼成仙', author: '幻雨', category: '仙侠', cover: 'https://picsum.photos/300/400?random=49', views: 145678, rating: 8.6, description: '平凡少年林轩，意外得到上古神器百灵钟，踏上修仙之路。' },
  
  // 武侠类
  { id: 41, title: '雪中悍刀行', author: '烽火戏诸侯', category: '武侠', cover: 'https://picsum.photos/300/400?random=50', views: 167890, rating: 9.4, description: '道门真人飞天入地，千里取人首级。' },
  { id: 42, title: '连城诀', author: '金庸', category: '武侠', cover: 'https://picsum.photos/300/400?random=51', views: 87654, rating: 8.8, description: '讲述了一个性格卑劣、心术不正的恶劣书童的故事。' },
  { id: 43, title: '多情剑客无情剑', author: '古龙', category: '武侠', cover: 'https://picsum.photos/300/400?random=52', views: 98765, rating: 9.0, description: '小李探花李寻欢，一个人，一壶酒，一把刀，浪迹天涯。' },
  { id: 44, title: '白发魔女传', author: '梁羽生', category: '武侠', cover: 'https://picsum.photos/300/400?random=53', views: 76543, rating: 8.7, description: '一段刻骨铭心的爱情，一个白发魔女的传说。' },
  { id: 45, title: '大唐双龙传', author: '黄易', category: '武侠', cover: 'https://picsum.photos/300/400?random=54', views: 112345, rating: 8.9, description: '隋末唐初，寇仲和徐子陵两个扬州小混混的传奇故事。' },
  { id: 46, title: '陆小凤传奇', author: '古龙', category: '武侠', cover: 'https://picsum.photos/300/400?random=55', views: 123456, rating: 9.1, description: '四条眉毛的陆小凤，一个充满智慧和侠义的传奇。' },
  { id: 47, title: '七剑下天山', author: '梁羽生', category: '武侠', cover: 'https://picsum.photos/300/400?random=56', views: 87654, rating: 8.6, description: '清朝初年，天山派七剑下天山的故事。' },
  { id: 48, title: '侠客行', author: '金庸', category: '武侠', cover: 'https://picsum.photos/300/400?random=57', views: 134567, rating: 8.8, description: '一个从小叫狗杂种的孩子，一个充满奇遇的江湖故事。' },
  { id: 49, title: '书剑恩仇录', author: '金庸', category: '武侠', cover: 'https://picsum.photos/300/400?random=58', views: 98765, rating: 8.5, description: '红花会群雄反清复明的故事。' },
  { id: 50, title: '欢乐英雄', author: '古龙', category: '武侠', cover: 'https://picsum.photos/300/400?random=59', views: 112345, rating: 9.0, description: '四个性格各异的年轻人，在富贵客栈的欢乐故事。' },
  
  // 历史类
  { id: 51, title: '明朝那些事儿', author: '当年明月', category: '历史', cover: 'https://picsum.photos/300/400?random=60', views: 234567, rating: 9.3, description: '以史料为基础，用小说般的笔法讲述了明朝三百年的历史。' },
  { id: 52, title: '大秦帝国', author: '孙皓晖', category: '历史', cover: 'https://picsum.photos/300/400?random=61', views: 145678, rating: 9.2, description: '讲述了大秦帝国从秦孝公到秦始皇的兴亡历史。' },
  { id: 53, title: '回到明朝当王爷', author: '月关', category: '历史', cover: 'https://picsum.photos/300/400?random=62', views: 187654, rating: 8.9, description: '一个现代人杨凌，穿越到明朝正德年间，成为王爷。' },
  { id: 54, title: '极品家丁', author: '禹岩', category: '历史', cover: 'https://picsum.photos/300/400?random=63', views: 198765, rating: 8.8, description: '一个现代人穿越到明朝，成为林三，如何在古代风生水起。' },
  { id: 55, title: '唐砖', author: '孑与2', category: '历史', cover: 'https://picsum.photos/300/400?random=64', views: 156789, rating: 9.0, description: '一个现代考古队回到贞观年间，搅动大唐风云。' },
  { id: 56, title: '新宋', author: '阿越', category: '历史', cover: 'https://picsum.photos/300/400?random=65', views: 134567, rating: 8.9, description: '一个历史系研究生回到北宋，改变了宋朝的命运。' },
  { id: 57, title: '赘婿', author: '愤怒的香蕉', category: '历史', cover: 'https://picsum.photos/300/400?random=66', views: 145678, rating: 8.9, description: '一个现代金融精英穿越到武朝，成为赘婿。' },
  { id: 58, title: '庆余年', author: '猫腻', category: '历史', cover: 'https://picsum.photos/300/400?random=67', views: 167890, rating: 9.1, description: '范闲，庆国数十年风雨的见证者。' },
  { id: 59, title: '春秋我为王', author: '七月新番', category: '历史', cover: 'https://picsum.photos/300/400?random=68', views: 123456, rating: 8.7, description: '穿越到春秋战国，成为晋国赵氏旁支子弟。' },
  { id: 60, title: '汉乡', author: '孑与2', category: '历史', cover: 'https://picsum.photos/300/400?random=69', views: 145678, rating: 8.8, description: '我们的汉乡，我们的根，我们的灵魂。' },
  
  // 军事类
  { id: 61, title: '弹痕', author: '纷舞妖姬', category: '军事', cover: 'https://picsum.photos/300/400?random=70', views: 145678, rating: 8.9, description: '当侦察兵换了一种活法，将谱写怎样的军旅传奇。' },
  { id: 62, title: '利刃', author: '丛林狼', category: '军事', cover: 'https://picsum.photos/300/400?random=71', views: 134567, rating: 8.7, description: '利刃出鞘，谁与争锋！' },
  { id: 63, title: '绝密543', author: '西小舟', category: '军事', cover: 'https://picsum.photos/300/400?random=72', views: 98765, rating: 8.6, description: '中国第一支地空导弹部队的战斗故事。' },
  { id: 64, title: '血色誓言', author: '纷舞妖姬', category: '军事', cover: 'https://picsum.photos/300/400?random=73', views: 112345, rating: 8.8, description: '特种兵的热血誓言。' },
  { id: 65, title: '尖兵利刃', author: '丛林狼', category: '军事', cover: 'https://picsum.photos/300/400?random=74', views: 123456, rating: 8.7, description: '特种尖兵的热血军旅。' },
  { id: 66, title: '抗命', author: '哲窠', category: '军事', cover: 'https://picsum.photos/300/400?random=75', views: 98765, rating: 8.5, description: '一个现代军人的抗战故事。' },
  { id: 67, title: '火力法则', author: '如水意', category: '军事', cover: 'https://picsum.photos/300/400?random=76', views: 112345, rating: 8.8, description: '火力为王，谁与争锋！' },
  { id: 68, title: '诡刺', author: '纷舞妖姬', category: '军事', cover: 'https://picsum.photos/300/400?random=77', views: 134567, rating: 8.9, description: '特种兵王的热血传奇。' },
  { id: 69, title: '龙组', author: '蓝白色', category: '军事', cover: 'https://picsum.photos/300/400?random=78', views: 156789, rating: 8.6, description: '中国龙组，守护华夏的神秘组织。' },
  { id: 70, title: '特战先锋', author: '丛林狼', category: '军事', cover: 'https://picsum.photos/300/400?random=79', views: 123456, rating: 8.7, description: '特种兵的训练与战斗。' },
  
  // 游戏类
  { id: 71, title: '全职高手', author: '蝴蝶蓝', category: '游戏', cover: 'https://picsum.photos/300/400?random=80', views: 176543, rating: 9.3, description: '网游荣耀中被誉为教科书级别的顶尖高手叶修，被俱乐部驱逐后重新归来。' },
  { id: 72, title: '英雄联盟之谁与争锋', author: '龙之舞', category: '游戏', cover: 'https://picsum.photos/300/400?random=81', views: 145678, rating: 8.7, description: '当中国电竞选手李akes横空出世，谁与争锋！' },
  { id: 73, title: '王者时刻', author: '蝴蝶蓝', category: '游戏', cover: 'https://picsum.photos/300/400?random=82', views: 134567, rating: 8.9, description: '王者荣耀职业选手的传奇故事。' },
  { id: 74, title: '联盟之绝对零度', author: '慕容咸鱼', category: '游戏', cover: 'https://picsum.photos/300/400?random=83', views: 123456, rating: 8.5, description: 'LOL职业选手的崛起之路。' },
  { id: 75, title: '禁区之雄', author: '林海听涛', category: '游戏', cover: 'https://picsum.photos/300/400?random=84', views: 112345, rating: 8.6, description: '足球游戏的巅峰之作。' },
  { id: 76, title: '重生之我是大球星', author: '灵魂男子', category: '游戏', cover: 'https://picsum.photos/300/400?random=85', views: 98765, rating: 8.4, description: '重生到足球世界，成为球星。' },
  { id: 77, title: '网游之代练传说', author: '大烟缸', category: '游戏', cover: 'https://picsum.photos/300/400?random=86', views: 123456, rating: 8.5, description: '代练的传奇，游戏人生。' },
  { id: 78, title: '重生之贼行天下', author: '发飙的蜗牛', category: '游戏', cover: 'https://picsum.photos/300/400?random=87', views: 134567, rating: 8.7, description: '重生到游戏世界，成为贼王。' },
  { id: 79, title: '天醒之路', author: '蝴蝶蓝', category: '游戏', cover: 'https://picsum.photos/300/400?random=88', views: 112345, rating: 8.8, description: '电竞与热血的交织。' },
  { id: 80, title: '巅峰玩家', author: '切的声音', category: '游戏', cover: 'https://picsum.photos/300/400?random=89', views: 98765, rating: 8.6, description: '巅峰玩家的游戏人生。' },
  
  // 竞技类
  { id: 81, title: '禁区之雄', author: '林海听涛', category: '竞技', cover: 'https://picsum.photos/300/400?random=90', views: 112345, rating: 8.6, description: '足球游戏的巅峰之作。' },
  { id: 82, title: '冠军教父', author: '林海听涛', category: '竞技', cover: 'https://picsum.photos/300/400?random=91', views: 134567, rating: 9.0, description: '足球经理人的传奇故事。' },
  { id: 83, title: '我们是冠军', author: '林海听涛', category: '竞技', cover: 'https://picsum.photos/300/400?random=92', views: 123456, rating: 8.9, description: '足球的热血与激情。' },
  { id: 84, title: '胜者为王', author: '林海听涛', category: '竞技', cover: 'https://picsum.photos/300/400?random=93', views: 112345, rating: 8.7, description: '竞技体育的热血故事。' },
  { id: 85, title: '求胜之路', author: '林海听涛', category: '竞技', cover: 'https://picsum.photos/300/400?random=94', views: 98765, rating: 8.5, description: '追求胜利的竞技之路。' },
  { id: 86, title: '中国足球人', author: '林海听涛', category: '竞技', cover: 'https://picsum.photos/300/400?random=95', views: 87654, rating: 8.4, description: '中国足球的梦想与坚持。' },
  { id: 87, title: '一球成名', author: '天天不码字', category: '竞技', cover: 'https://picsum.photos/300/400?random=96', views: 123456, rating: 8.6, description: '从草根到球星的传奇。' },
  { id: 88, title: '足球解说员', author: '林海听涛', category: '竞技', cover: 'https://picsum.photos/300/400?random=97', views: 98765, rating: 8.5, description: '足球解说的职业生涯。' },
  { id: 89, title: '超级指环王', author: '七乐', category: '竞技', cover: 'https://picsum.photos/300/400?random=98', views: 112345, rating: 8.7, description: '篮球竞技的热血故事。' },
  { id: 90, title: '教父', author: '林海听涛', category: '竞技', cover: 'https://picsum.photos/300/400?random=99', views: 134567, rating: 8.9, description: '足球教练的传奇人生。' },
  
  // 悬疑类
  { id: 91, title: '鬼吹灯', author: '天下霸唱', category: '悬疑', cover: 'https://picsum.photos/300/400?random=100', views: 187654, rating: 9.2, description: '胡八一上山下乡来到东北地区，在一个叫做岗岗营子的村庄插队落户。' },
  { id: 92, title: '盗墓笔记', author: '南派三叔', category: '悬疑', cover: 'https://picsum.photos/300/400?random=101', views: 198765, rating: 9.1, description: '五十年前，一群长沙土夫子挖到了一件战国古墓，从此开启了一段惊心动魄的冒险。' },
  { id: 93, title: '藏海花', author: '南派三叔', category: '悬疑', cover: 'https://picsum.photos/300/400?random=102', views: 145678, rating: 8.8, description: '盗墓笔记前传，讲述张起灵的成长故事。' },
  { id: 94, title: '沙海', author: '南派三叔', category: '悬疑', cover: 'https://picsum.photos/300/400?random=103', views: 134567, rating: 8.9, description: '盗墓笔记后传，讲述吴邪深入沙漠的故事。' },
  { id: 95, title: '茅山后裔', author: '大力金刚掌', category: '悬疑', cover: 'https://picsum.photos/300/400?random=104', views: 123456, rating: 8.7, description: '茅山术的传奇故事。' },
  { id: 96, title: '我当道士那些年', author: '仐三', category: '悬疑', cover: 'https://picsum.photos/300/400?random=105', views: 145678, rating: 8.8, description: '一个道士的成长经历。' },
  { id: 97, title: '民调局异闻录', author: '儿东水寿', category: '悬疑', cover: 'https://picsum.photos/300/400?random=106', views: 112345, rating: 8.6, description: '特殊调查局的超自然案件。' },
  { id: 98, title: '苗疆蛊事', author: '南无袈裟理科佛', category: '悬疑', cover: 'https://picsum.photos/300/400?random=107', views: 134567, rating: 8.9, description: '苗疆蛊术的神秘传说。' },
  { id: 99, title: '十宗罪', author: '蜘蛛', category: '悬疑', cover: 'https://picsum.photos/300/400?random=108', views: 156789, rating: 8.8, description: '十个恐怖惊悚的犯罪故事。' },
  { id: 100, title: '心理罪', author: '雷米', category: '悬疑', cover: 'https://picsum.photos/300/400?random=109', views: 134567, rating: 9.0, description: '犯罪心理学天才方木的破案故事。' },
  
  // 言情类
  { id: 101, title: '何以笙箫默', author: '顾漫', category: '言情', cover: 'https://picsum.photos/300/400?random=110', views: 167890, rating: 9.2, description: '如果世界上曾经有那个人出现过，其他人都会变成将就。' },
  { id: 102, title: '微微一笑很倾城', author: '顾漫', category: '言情', cover: 'https://picsum.photos/300/400?random=111', views: 187654, rating: 9.1, description: '在游戏里相恋，在现实中相遇的爱情故事。' },
  { id: 103, title: '你是我的荣耀', author: '顾漫', category: '言情', cover: 'https://picsum.photos/300/400?random=112', views: 176543, rating: 9.0, description: '航天工程师与女明星的爱情故事。' },
  { id: 104, title: '何以故人归', author: '顾漫', category: '言情', cover: 'https://picsum.photos/300/400?random=113', views: 145678, rating: 8.9, description: '顾漫经典言情作品。' },
  { id: 105, title: '原来你也在这里', author: '桐华', category: '言情', cover: 'https://picsum.photos/300/400?random=114', views: 134567, rating: 8.8, description: '跨越时空的爱情故事。' },
  { id: 106, title: '步步惊心', author: '桐华', category: '言情', cover: 'https://picsum.photos/300/400?random=115', views: 156789, rating: 9.1, description: '现代女孩穿越到清朝，卷入九子夺嫡的争斗。' },
  { id: 107, title: '三生三世十里桃花', author: '唐七公子', category: '言情', cover: 'https://picsum.photos/300/400?random=116', views: 187654, rating: 9.2, description: '三生三世的爱情传奇。' },
  { id: 108, title: '华胥引', author: '唐七公子', category: '言情', cover: 'https://picsum.photos/300/400?random=117', views: 145678, rating: 8.9, description: '华胥一引，乱世成殇。' },
  { id: 109, title: '扶摇', author: '天下归元', category: '言情', cover: 'https://picsum.photos/300/400?random=118', views: 167890, rating: 8.8, description: '孟扶摇的传奇人生。' },
  { id: 110, title: '知否？知否？应是绿肥红瘦', author: '关心则乱', category: '言情', cover: 'https://picsum.photos/300/400?random=119', views: 176543, rating: 9.0, description: '庶女明兰的成长之路。' },
  
  // 短篇类
  { id: 111, title: '睡前故事', author: '读者', category: '短篇', cover: 'https://picsum.photos/300/400?random=120', views: 65432, rating: 8.5, description: '温馨的睡前小故事。' },
  { id: 112, title: '心灵鸡汤', author: 'Various', category: '短篇', cover: 'https://picsum.photos/300/400?random=121', views: 76543, rating: 8.6, description: '温暖心灵的小故事。' },
  { id: 113, title: '微小说集', author: 'Various', category: '短篇', cover: 'https://picsum.photos/300/400?random=122', views: 54321, rating: 8.4, description: '150字的微小说精选。' },
  { id: 114, title: '一分钟小说', author: 'Various', category: '短篇', cover: 'https://picsum.photos/300/400?random=123', views: 45678, rating: 8.3, description: '一分钟读完的小故事。' },
  { id: 115, title: '暖心故事', author: 'Various', category: '短篇', cover: 'https://picsum.photos/300/400?random=124', views: 56789, rating: 8.7, description: '温暖人心的短篇故事。' },
  { id: 116, title: '青春物语', author: 'Various', category: '短篇', cover: 'https://picsum.photos/300/400?random=125', views: 67890, rating: 8.5, description: '青春校园短篇故事。' },
  { id: 117, title: '都市传说', author: 'Various', category: '短篇', cover: 'https://picsum.photos/300/400?random=126', views: 54321, rating: 8.4, description: '神秘的都市传说故事。' },
  { id: 118, title: '科幻小品', author: 'Various', category: '短篇', cover: 'https://picsum.photos/300/400?random=127', views: 43210, rating: 8.6, description: '短小精悍的科幻故事。' },
  { id: 119, title: '悬疑一刻', author: 'Various', category: '短篇', cover: 'https://picsum.photos/300/400?random=128', views: 56789, rating: 8.5, description: '紧张刺激的悬疑短篇。' },
  { id: 120, title: '治愈系短篇', author: 'Various', category: '短篇', cover: 'https://picsum.photos/300/400?random=129', views: 65432, rating: 8.8, description: '治愈心灵的温暖短篇。' }
])

const filteredNovels = computed(() => {
  if (activeTab.value >= categories.value.length) return []
  const category = categories.value[activeTab.value].name
  return novels.value.filter(novel => novel.category === category)
})

onMounted(() => {
  if (route.query.type) {
    const index = categories.value.findIndex(c => c.name === route.query.type)
    if (index !== -1) {
      activeTab.value = index
    }
  }
})
</script>

<style scoped>
.category-page {
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

.category-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid #e5e5e5;
  overflow-x: auto;
}

.tab-item {
  flex-shrink: 0;
  padding: 16px 24px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
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

.novel-list {
  min-height: 300px;
}

.novel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.novel-card {
  display: flex;
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.novel-cover {
  width: 120px;
  height: 160px;
  object-fit: cover;
  flex-shrink: 0;
}

.novel-info {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.novel-title {
  font-size: 16px;
  margin: 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.novel-author {
  font-size: 12px;
  color: #999;
  margin: 0 0 8px;
}

.novel-desc {
  font-size: 12px;
  color: #666;
  margin: 0 0 8px;
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.novel-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.category-tag {
  font-size: 12px;
  color: #fff;
  background: #ed424b;
  padding: 2px 8px;
  border-radius: 4px;
}

.novel-views {
  font-size: 12px;
  color: #666;
}

.rating {
  font-size: 12px;
  color: #ff9800;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

@media (max-width: 768px) {
  .novel-grid {
    grid-template-columns: 1fr;
  }

  .novel-card {
    flex-direction: column;
  }

  .novel-cover {
    width: 100%;
    height: 200px;
  }
}
</style>
