<script setup>
import { ref, onMounted, provide, watch } from 'vue'
import navigation from '@/components/navigation/navigation.vue'
import banner from "@/components/aboutImg/bannerInHeader.vue"
import router from '../../router';
import { getPublicBlogs, getPublicBlogDetail } from '@/api/index.js'
const community_content = ref([
    // { title: "社区模块测试", brief: '测试用例', releaseTime: "2023-12-25", username: "developer" }, { title: "社区模块测试", brief: '测试用例', release_time: "2023-12-25", username: "developer" }, { title: "社区模块测试", brief: '测试用例', release_time: "2023-12-25", username: "developer" }
])
provide('blogArray', community_content)


const getPublicBlogsInPage = async () => {
    const result = await getPublicBlogs()
    if (result.data.code === 1) {
        community_content.value = result.data.data
    }
}


const getBlogDetail = async (index) => {
    console.log(community_content.value[index])
    const result = await getPublicBlogDetail(community_content.value[index].id)
    if (result.data.code === 1) {
        localStorage.setItem("article", JSON.stringify(result.data.data))
        router.push("/detail")
    }
}


onMounted(() => {
    getPublicBlogsInPage()
})






</script>
<template>
    <div id="Community">
        <navigation />
        <!-- <banner /> -->
        <div class="Community-container">
            <div v-for="(item, index) in community_content" class="Community-content" @click=getBlogDetail(index)>
                <h2 class="content-title">{{ item.title }}</h2>
                <div class="content-brief">{{ item.brief }}</div>
                <div class="content-release_time">{{ item.releaseTime }}</div>
                <div class="content-auther">{{ item.username }} </div>
            </div>
        </div>

    </div>
</template>
<style lang="less" scoped>
#Community {
    width: 100vw;

    .Community-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        min-height: 100vh;

        .Community-content {
            position: relative;
            width: 50%;
            height: 150px;
            // background-color: pink;
            margin: 10px 0px;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
            cursor: pointer;

            .content-release_time {
                position: absolute;
                bottom: 20px;
                right: 0px;
                padding: 0 15px 0 0;

            }

            .content-auther {
                position: absolute;
                bottom: 0px;
                right: 0px;
                padding: 0 15px 0 0;
            }
        }
    }
}
</style>



