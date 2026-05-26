<template>
  <div class="bookshelf">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">我的书架</h1>
        <div class="header-actions">
          <button class="btn-sort" @click="toggleSort">{{ sortLabel }}</button>
          <button class="btn-refresh" @click="loadBooks">🔄 刷新</button>
        </div>
      </div>

      <div v-if="books.length === 0" class="empty-state">
        <div class="empty-icon">📚</div>
        <p class="empty-text">书架空空如也，快去收藏一些小说吧！</p>
        <router-link to="/" class="btn-primary">去首页看看</router-link>
      </div>

      <div v-else class="books-grid">
        <div v-for="book in sortedBooks" :key="book.id" class="book-item">
          <router-link :to="`/detail/${book.id}`" class="book-cover-wrap">
            <img v-lazy="book.cover" :alt="book.title" class="book-cover" />
            <span v-if="book.status === '连载中'" class="status-badge">{{ book.status }}</span>
          </router-link>
          <div class="book-info">
            <router-link :to="`/detail/${book.id}`" class="book-title">{{ book.title }}</router-link>
            <p class="book-author">{{ book.author }}</p>
            <div class="book-meta">
              <span class="book-category">{{ book.category }}</span>
              <span class="book-rating">评分: {{ book.rating }}</span>
            </div>
            <div class="book-update">
              <span class="book-chapter">{{ book.lastChapter }}</span>
            </div>
            <div class="book-actions">
              <button class="btn-read" @click="startRead(book)">继续阅读</button>
              <button class="btn-remove" @click="removeBook(book)">移出书架</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getNovelsByIds } from '@/data/novels';
const router = useRouter();
const books = ref([]);
const sortBy = ref('update');
const sortLabel = computed(() => {
 return sortBy.value === 'update' ? '按更新排序' : '按名称排序';
});
const sortedBooks = computed(() => {
 const sorted = [...books.value];
 if (sortBy.value === 'update') {
 return sorted;
 }
 else {
 return sorted.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
 }
});
const loadBooks = () => {
 const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
 if (favorites.length > 0) {
 books.value = getNovelsByIds(favorites);
 }
 else {
 books.value = [];
 }
};
const toggleSort = () => {
 sortBy.value = sortBy.value === 'update' ? 'name' : 'update';
};
const removeBook = (book) => {
 if (!confirm(`确定要将《${book.title}》移出书架吗？`))
 return;
 let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
 favorites = favorites.filter(id => String(id) !== String(book.id));
 localStorage.setItem('favorites', JSON.stringify(favorites));
 books.value = books.value.filter(b => b.id !== book.id);
};
const startRead = (book) => {
 const readingProgress = JSON.parse(localStorage.getItem('readingProgress') || '{}');
 const progress = readingProgress[book.id];
 if (progress) {
 router.push(`/reader/${book.id}/${progress.chapterId}`);
 }
 else {
 router.push(`/reader/${book.id}/1`);
 }
};
loadBooks();
</script>

<style scoped>
.bookshelf {
  background: #f5f5f5;
  min-height: calc(100vh - 200px);
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-sort, .btn-refresh {
  padding: 8px 16px;
  background: #fff;
  color: #666;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-sort:hover, .btn-refresh:hover {
  border-color: #ed424b;
  color: #ed424b;
}

.empty-state {
  background: #fff;
  padding: 80px 20px;
  border-radius: 4px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.btn-primary {
  display: inline-block;
  padding: 12px 32px;
  background: #ed424b;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  font-size: 16px;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #d63640;
}

.books-grid {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.book-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
  position: relative;
}

.book-item:hover {
  background: #f9f9f9;
}

.book-item:last-child {
  border-bottom: none;
}

.book-cover-wrap {
  flex-shrink: 0;
  position: relative;
}

.book-cover {
  width: 100px;
  height: 140px;
  object-fit: cover;
  border-radius: 2px;
}

.status-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 8px;
  background: #ed424b;
  color: #fff;
  font-size: 12px;
  border-radius: 2px;
}

.book-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.book-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  margin-bottom: 8px;
  transition: color 0.2s;
}

.book-title:hover {
  color: #ed424b;
}

.book-author {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
}

.book-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}

.book-category {
  font-size: 12px;
  color: #999;
  padding: 2px 8px;
  background: #f5f5f5;
  border-radius: 2px;
}

.book-rating {
  font-size: 12px;
  color: #ff9800;
}

.book-update {
  margin-bottom: 12px;
}

.book-chapter {
  font-size: 14px;
  color: #ed424b;
}

.book-actions {
  display: flex;
  gap: 12px;
  margin-top: auto;
}

.btn-read {
  padding: 8px 24px;
  background: #ed424b;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-read:hover {
  background: #d63640;
}

.btn-remove {
  padding: 8px 24px;
  background: #fff;
  color: #666;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-remove:hover {
  border-color: #ed424b;
  color: #ed424b;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .book-item {
    flex-direction: column;
  }

  .book-cover {
    width: 80px;
    height: 112px;
  }
}
</style>