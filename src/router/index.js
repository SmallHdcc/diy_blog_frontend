import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../views/main/Community.vue'),
      meta: { isAuth: true, title: '社区' },
    },
    {
      path: '/personal',
      name: "personal",
      component: () => import('../views/main/PersonalPage.vue'),
      meta: { title: '个人页' }
    },
    {
      path: '/writeArticle',
      name: "article",
      key: 'article',
      component: () => import('../views/write/writeArticle.vue'),
      meta: { title: '记录日记' }
    },
    {
      path: '/feedback',
      name: "feedback",
      component: () => import('../views/main/Feedback.vue')
    },
    {
      path: '/test',
      name: "testPage",
      component: () => import('../views/test/test08.vue'),
      meta: { isAuth: false, title: '测试页面' }
    },
    {
      path: "/:pathMatch(.*)*", // 必备
      component: () => import("@/views/error/404.vue"),
      meta: { isAuth: false, title: '404' }
    },

  ]
})

export default router
