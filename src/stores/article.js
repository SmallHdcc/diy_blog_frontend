import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useArticleStore = defineStore('article', () => {

    const blogArray = ref([])
    const setBlogs = (blogs) => {
        blogArray.value = blogs
    }
    const getBlogs = () => {
        return blogArray.value
    }
    return { blogArray, setBlogs }
})
