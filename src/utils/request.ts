import type { Router } from 'vue-router'
import { message } from 'ant-design-vue'
import axios from 'axios'

// 获取环境变量
const apiUrl = import.meta.env.VITE_CHATAI_API_URL

const request = axios.create({
  baseURL: `${apiUrl}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

export function setupRequest(router: Router) {
  // 请求拦截器
  request.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  // 响应拦截器
  request.interceptors.response.use(
    (response) => {
      if (response.data.code === '500') {
        localStorage.removeItem('token')
        router.push('/login')
        message.info('登录已过期，请重新登录')
      }
      return response
    },
    (error) => {
      if (error.response?.status !== 200) {
        localStorage.removeItem('token')
        router.push('/login')
        message.error('登录已过期，请重新登录')
      }
      else {
        message.error(error.response?.data?.info || '请求失败')
      }
      return Promise.reject(error)
    },
  )
}

export function useRequest() {
  return request
}
