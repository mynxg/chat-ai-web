import type { Router } from 'vue-router'

export function setupRouterGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const publicPaths = ['/guide', '/login']

    if (publicPaths.includes(to.path)) {
      if (token) {
        next('/')
      }
      else {
        next()
      }
      return
    }

    if (!token) {
      next('/guide')
      return
    }

    next()
  })
}
