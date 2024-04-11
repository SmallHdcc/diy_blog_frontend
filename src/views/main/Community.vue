<script setup>
import { ref, onMounted, provide, watch } from 'vue'
import { getPublicBlogDetail, getHeatList } from '@/api/blog.js'
import { useArticleStore } from '@/stores/article.js'
import showArticle from '@/components/article/showArticle.vue';
import showDeatil from '@/components/article/showArticleDeatil.vue'

const blogStore = useArticleStore()
watch(() => blogStore.blogArray, () => {
    community_content.value = blogStore.blogArray
})

const heat_list = ref([])

const getHeatListInPage = async () => {
    const result = await getHeatList()
    if (result.data.code === 1) {
        //获取前10个
        heat_list.value = result.data.data.slice(0, 10)
    }
    heat_list.value.forEach(item => {
        item.articleTitle = item.articleTitle === null ? '虚位以待' : item.articleTitle
    });
}

function getColor(index) {
    const rank = index + 1
    if (rank === 1) {
        return 'gold-color'
    } else if (rank === 2) {
        return 'silver-color'
    } else if (rank === 3) {
        return 'copper-color'
    } else {
        return ''
    }
}


/*---控制详情页与主页---*/
const showDetailVisible = ref(false) // Flag to control visibility

provide('showDetailVisible', showDetailVisible) // Provide the flag to all children components

const handleArticleShow = ref(false)
provide('handleArticleShow', handleArticleShow)

const getBlogDetailById = async (id) => {
    const result = await getPublicBlogDetail(id)
    if (result.data.code === 1) {
        localStorage.setItem("article", JSON.stringify(result.data.data))
        // router.push("/detail")
        showDetailVisible.value = true
        handleArticleShow.value = !handleArticleShow.value
    }
}



onMounted(() => {
    getHeatListInPage()
})


</script>

<template>
    <div id="Community">
        <div class="container">
            <div class="container-side-list">
                <div class="side-bar side-common">
                    <h2>希望今天是美好的😂</h2>
                </div>
                <div class="side-list side-common">
                    <h2>热门帖🔥</h2>
                    <div v-for="(item, index) in heat_list" @click="getBlogDetailById(item.articleId)">
                        <div class="side-list-element" :class="getColor(index)">
                            <span style="font-weight: 700;" :class="getColor(index)"> {{ index + 1 }}.</span>
                            {{ item.articleTitle }}
                        </div>
                    </div>
                </div>
            </div>
            <el-scrollbar class="container-center-content">
                <showArticle v-if="!showDetailVisible"></showArticle>
                <showDeatil v-if="showDetailVisible"></showDeatil>
            </el-scrollbar>
        </div>
    </div>
</template>

<style lang="less" scoped>
#Community {
    display: flex;
    justify-content: right;
    width: 100%;
    height: 80%;
    background-color: rgb(234, 239, 245);

    .container {
        display: flex;
        justify-content: center;
        width: 90%;

        .container-side-list {
            position: static;
            top: 0;
            width: 25%;
            margin: 10px 30px 0px 20px;

            .side-common {
                border-radius: 5px;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
            }

            .side-bar {
                width: 100%;
                height: 20vh;
                background-color: white;
                margin-bottom: 40px;
                text-align: center;
                line-height: 20vh;
            }

            .side-list {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 40vh;
                background-color: white;
                overflow-y: hidden;
                padding-left: 20px;

                .side-list-element {
                    flex-grow: 1;
                    flex-basis: auto;
                    width: 100%;
                    cursor: pointer;
                    border-radius: 5px;
                    transition: all 0.5s;
                }

                .side-list-element:hover {
                    background-color: rgb(228, 233, 239);
                }
            }
        }

        .container-center-content {
            width: 75%;
            height: 100%;
        }
    }

}

.gold-color {
    color: gold;
}

.sliver-color {
    color: rgb(71, 69, 69);
}

.copper-color {
    color: #cd7f32;
}
</style>
