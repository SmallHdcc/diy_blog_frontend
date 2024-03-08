<script setup>
import { ref, onMounted, inject } from 'vue'
import router from '../../router';
import { getPublicBlogs, getPublicBlogDetail, getHeatList } from '@/api/blog.js'
import WOW from 'wow.js'

const article_content = ref()



/*---获取文章---*/
const getBlogInPage = async () => {
    const result = await getPublicBlogs()
    if (result.data.code === 1) {
        let articles = result.data.data
        //将字符串 转化为数组
        articles.forEach(item => {
            item.tags = toStringArray(item.tags)
        })
        article_content.value = articles
    }
}

//处理字符串
function toStringArray(source) {
    return source.substring(1, source.length - 1).split(',')
}

const showArticleDeatil = inject('showDetailVisible')

/*---获取文章细节 ---*/
const getBlogDetail = async (index) => {
    const result = await getPublicBlogDetail(article_content.value[index].id)
    if (result.data.code === 1) {
        localStorage.setItem("article", JSON.stringify(result.data.data))
        // router.push("/detail")
        showArticleDeatil.value = true
    }
}
/*---滚动加载---*/
const load = () => {
    console.log("滚动加载")
}




onMounted(() => {
    getBlogInPage()
})



</script>

<template>
    <transition name="fade">
        <div id="showArticle" v-infinite-scroll="load">
            <div class="article" v-for="(article, index) in article_content" @click="getBlogDetail(index)">
                <div class="article-cover"><img :src=article.filePath alt=""></div>
                <div class="article-info">
                    <div class="article-info-top">
                        <div class="article-info-top-left">
                            <h2 class="info-title">{{ article.title }}</h2>
                            <span class="info-profile">{{ article.profile }}</span>
                            <div class="info-tags">
                                <el-tag style="margin-right: 5px;" v-for="(tag) in article.tags">
                                    {{ tag }}
                                </el-tag>
                            </div>
                        </div>
                        <div class="article-info-top-right">
                            undo module
                        </div>
                    </div>
                    <div class="article-info-bottom">
                        <div class="info-date">{{ article.date }}</div>
                        <div class="info-author">
                            <div class="article-views">
                                <el-icon style="margin-right: 5px;" size="20px">
                                    <View />
                                </el-icon>
                                <span>
                                    {{ article.views }}
                                </span>
                            </div>
                            <div class="author-avatar"><img :src="article.avatar" alt=""></div>
                            <div class="author-username">{{ article.username }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<style lang="less" scoped>
#showArticle {
    width: 100%;
    height: 100%;
    transition: all 0.5s;

    .article {
        display: flex;
        align-items: center;
        width: 89%;
        height: 200px;
        margin: 20px auto;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
        padding: 10px;
        cursor: pointer;
        border-radius: 5px;
        background-color: white;
        transition: all 0.5s;

        .article-info {
            position: relative;
            display: flex;
            flex-direction: column;
            width: 60%;
            height: 100%;

            .article-info-top {
                display: flex;

                .article-info-top-left {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    align-items: center;
                    width: 70%;

                    .info-title {
                        font-weight: 700;
                    }

                    .info-tags {
                        display: flex;
                        justify-content: center;
                        flex-wrap: wrap;
                    }
                }

                .article-info-top-right {
                    width: 30%;
                }
            }

            .article-info-bottom {
                position: absolute;
                right: 0;
                bottom: 0;
                display: flex;
                flex-direction: column;
                text-align: right;

                .info-author {
                    display: flex;
                    align-items: center;

                    .author-avatar {
                        width: 40px;
                        height: 40px;
                        margin: 0 20px;
                        border-radius: 100%;
                        overflow: hidden;

                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    .article-views {
                        display: flex;
                        align-items: center;
                    }
                }

            }

        }

        .article-cover {
            display: flex;
            align-items: center;
            width: 40%;
            height: 70%;
            border-radius: 10px;

            img {
                width: 100%;
                border-radius: 10px;
            }
        }
    }

    .article:hover {
        //放大为原来的1.1倍
        transform: scale(1.1);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
