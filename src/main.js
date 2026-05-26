import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { lazyLoadDirective } from './utils'

const app = createApp(App)

app.use(router)
app.directive('lazy', lazyLoadDirective)

app.mount('#app')
