<script setup>
import { ref, onMounted, provide, watch } from 'vue'
import router from '../../router';
import { getPublicBlogs, getPublicBlogDetail, getHeatList } from '@/api/blog.js'
import { useArticleStore } from '@/stores/article.js'
import showArticle from '@/components/article/showArticle.vue';


const blogStore = useArticleStore()
watch(() => blogStore.blogArray, () => {
    community_content.value = blogStore.blogArray
})

const heat_list = ref([])

const getBlogDetail = async (index) => {
    const result = await getPublicBlogDetail(community_content.value[index].id)
    if (result.data.code === 1) {
        localStorage.setItem("article", JSON.stringify(result.data.data))
        router.push("/detail")

    }
}
const getHeatListInPage = async () => {
    const result = await getHeatList()
    console.log(result.data.data)
    if (result.data.code === 1) {
        //获取前5个
        heat_list.value = result.data.data.slice(0, 5)
    }
}

function getColor(index) {
    const rank = index + 1;
    if (rank === 1) {
        return 'gold-color';
    } else if (rank === 2) {
        return 'silver-color';
    } else if (rank === 3) {
        return 'copper-color';
    } else {
        return '';
    }
}

//滚动加载
const load = () => {
    console.log("滚动加载")
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
                    <div v-for="(item, index) in heat_list">
                        <div class="side-list-element" :class="getColor(index)">
                            <span style="font-weight: 700;" :class="getColor(index)"> {{ index + 1 }}.</span>
                            {{ item.articleTitle }}
                        </div>
                    </div>
                </div>
            </div>
            <div v-infinite-scroll="load" class="container-center-content">
                <showArticle></showArticle>
            </div>

        </div>
    </div>
</template>

<style lang="less" scoped>
#Community {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgb(234, 239, 245);

    .container {
        display: flex;
        justify-content: center;
        width: 70%;

        .container-side-list {
            position: static;
            top: 0;
            width: 29%;
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
                justify-content: space-around;
                width: 100%;
                height: 40vh;
                background-color: white;
                overflow-y: hidden;
                padding-left: 20px;

                .side-list-element {
                    width: 100%;
                    cursor: pointer;
                }
            }
        }

        .container-center-content {
            width: 71%;
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
