<script setup>
import { ref, onMounted, provide, watch } from 'vue'
import router from '../../router';
import { getPublicBlogs, getPublicBlogDetail, getHeatList } from '@/api/blog.js'
import { useArticleStore } from '@/stores/article.js'

const blogStore = useArticleStore()
watch(() => blogStore.blogArray, () => {
    community_content.value = blogStore.blogArray
})

const community_content = ref([])
const heat_list = ref([])


const getPublicBlogsInPage = async () => {
    const result = await getPublicBlogs()
    if (result.data.code === 1) {
        community_content.value = result.data.data
        console.log(community_content.value)
    }
}


const getBlogDetail = async (index) => {
    const result = await getPublicBlogDetail(community_content.value[index].id)
    if (result.data.code === 1) {
        localStorage.setItem("article", JSON.stringify(result.data.data))
        router.push("/detail")
    }
}
const getHeatListInPage = async () => {
    const result = await getHeatList()
    if (result.data.code === 1) {
        //获取前5个
        heat_list.value = result.data.data.slice(0, 5)
    }
}

const isGold = (index) => {
    return index + 1 === 1
}
const isSliver = (index) => {
    return index + 1 === 2
}
const isCopper = (index) => {
    return index + 1 === 3
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


onMounted(() => {
    getPublicBlogsInPage()
    getHeatListInPage()
})


</script>

<template>
    <div id="Community">
        <div class="Community-container">
            <div v-for="(item, index) in community_content" class="Community-content" @click=getBlogDetail(index)>
                <h2 class="content-title">{{ item.title }}</h2>
                <div class="content-brief">{{ item.brief }}</div>
                <div class="content-release_time">{{ item.releaseTime }}</div>
                <div class="content-auther">
                    <el-icon style="margin-right: 5px;">
                        <View />
                    </el-icon>
                    <span style="margin-right: 10px;">{{ item.views }}</span>
                    <span>{{ item.username }} </span>
                </div>
            </div>
        </div>
        <div class="Community-side-list">
            <div class="side-bar side-common">
                <h2>希望今天是美好的😂</h2>
            </div>
            <div class="side-list side-common">
                <h2>热门帖🔥</h2>
                <div v-for="(item, index) in heat_list">
                    <div class="side-list-element">
                        <span style="font-weight: 700;" :class="getColor(index)"> {{ index + 1 }}.</span>
                        {{ item.articleTitle }}
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style lang="less" scoped>
#Community {
    display: flex;
    justify-content: center;
    width: 100vw;
    background-color: rgb(234, 239, 245);

    .Community-side-list {
        width: 20%;
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


    .Community-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 50%;
        min-height: 100vh;


        .Community-content {
            position: relative;
            width: 100%;
            height: 150px;
            // background-color: pink;
            margin: 10px 0px;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
            background-color: white;
            transition: all 0.5s;
            cursor: pointer;

            .content-release_time {
                position: absolute;
                bottom: 20px;
                right: 0px;
                padding: 0 15px 0 0;

            }

            .content-auther {
                display: flex;
                align-items: center;
                position: absolute;
                bottom: 0px;
                right: 0px;
                padding: 0 15px 0 0;
            }
        }

        .Community-content:hover {

            //放大为原来的1.1倍
            transform: scale(1.1);

        }
    }
}

.gold-color {
    color: gold;
}

.sliver-color {
    color: rgb(139, 134, 134);
}

.copper-color {
    color: #cd7f32;
}
</style>
