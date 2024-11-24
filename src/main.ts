import * as Icons from '@ant-design/icons-vue'
import Antd from 'ant-design-vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'
import { setupRouterGuard } from './router/guard'
import { setupRequest } from './utils/request'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const app = createApp(App)
const router = createRouter({
  routes,
  history: createWebHistory(import.meta.env.BASE_URL),
})

// 先注册路由
app.use(router)

// 然后设置路由守卫和请求配置
setupRouterGuard(router)
setupRequest(router)

app.use(createPinia())
app.use(Antd)

// 注册图标组件
Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key as keyof typeof Icons])
})

app.mount('#app')
