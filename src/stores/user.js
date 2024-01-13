import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('login', () => {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    function increment() {
        count.value++
    }

    const isLogin = ref(false)
    function login() {
        isLogin.value = true
    }
    function logout() {
        isLogin.value = false
    }
    return { count, doubleCount, increment, isLogin, login, logout }
})
