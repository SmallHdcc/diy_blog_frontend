import './assets/base.css'

import { createApp, onBeforeMount } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// about wow.js
import 'wow.js/css/libs/animate.css'
// 引入图标
import './assets/icon/iconfont.css'
import './assets/icon/iconfont.js'


const app = createApp(App)


// 这里是设置路由守卫
router.beforeEach((to, from, next) => {
    if (!to.meta.isAuth) {
        if (localStorage.getItem("token")) {
            next()
        } else {
            next("/")
        }
    } else {
        next()
    }

})
//全局后置路由守卫————初始化的时候被调用、每次路由切换之后被调用
router.afterEach((to, from) => {
    document.title = to.meta.title || "该页没取名😀"   //修改网页的title
})

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.component('navigation', navigation)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')
