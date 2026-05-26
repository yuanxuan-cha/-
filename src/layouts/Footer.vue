<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-main">
        <div class="footer-section">
          <h4>关于起点</h4>
          <ul>
            <li><a href="#">关于我们</a></li>
            <li><a href="#">联系我们</a></li>
            <li><a href="#">加入我们</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>帮助中心</h4>
          <ul>
            <li><a href="#">常见问题</a></li>
            <li><a href="#">用户协议</a></li>
            <li><a href="#">隐私政策</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>合作服务</h4>
          <ul>
            <li><a href="#">作家福利</a></li>
            <li><a href="#">联系出版</a></li>
            <li><a href="#">IP合作</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>关注我们</h4>
          <ul>
            <li><a href="#">官方微博</a></li>
            <li><a href="#">官方微信</a></li>
            <li><a href="#">RSS订阅</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 半页故事. All rights reserved. | 前端设计技术课程设计</p>
        <p>24计科10班 | 指导教师：伍泳琪</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #2c2c2c;
  color: #999;
  margin-top: 60px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 20px;
}

.footer-main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.footer-section h4 {
  color: #fff;
  font-size: 16px;
  margin-bottom: 16px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 12px;
}

.footer-section a {
  color: #999;
  text-decoration: none;
  transition: color 0.3s;
  font-size: 14px;
}

.footer-section a:hover {
  color: #ed424b;
}

.footer-bottom {
  border-top: 1px solid #3c3c3c;
  padding-top: 20px;
  text-align: center;
  font-size: 14px;
  line-height: 1.8;
}

.footer-bottom p {
  margin: 0;
}

@media (max-width: 768px) {
  .footer-main {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .footer-section {
    text-align: center;
  }
}
</style>
