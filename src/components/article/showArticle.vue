<script setup>
import { ref, onMounted, inject } from 'vue'
import { getPublicBlogDetail, getBlogsByPage } from '@/api/blog.js'

const article_content = ref()
/* 定义每次滚动获取的帖子数目 */
const PAGE_SIZE = 5
const currentPage = ref(1)

//日期格式化函数
const dateFormat = (date_parm) => {
    let date = new Date(date_parm)
    let now = new Date()
    let time = now - date
    let day = Math.floor(time / (24 * 3600 * 1000))
    //如果是今年就省略年份
    let year = now.getFullYear() - date.getFullYear()
    if (year === 0) {
        if (day === 0) {
            return "今天 " + date.getHours() + ":" + date.getMinutes()
        } else if (day === 1) {
            return "昨天 " + date.getHours() + ":" + date.getMinutes()
        } else {
            return (date.getMonth() + 1) + "-" + date.getDate()
        }
    }
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()

}

/*--- 控制滚动加载变量 ---*/
const loading = ref(false)
const userId = inject('userId')

/*--- 获取文章 ---*/
const fetchArticles = async () => {
    loading.value = true
    console.log(userId)
    const result = await getBlogsByPage(currentPage.value, pageSize.value, userId)
    if (result.data.code === 1) {
        let articles = result.data.data.records
        //将字符串 转化为数组
        articles.forEach(item => {
            item.tags = toStringArray(item.tags)
        })
        article_content.value = articles
        //将article_content.value中的时间转化为今天昨天+时间,如果不可以再标为具体日期
        article_content.value.forEach(item => {
            item.createTime = dateFormat(item.createTime)
        })
    }
    loading.value = false
    currentPage.value++
}

//处理字符串
function toStringArray(source) {
    return source.substring(1, source.length - 1).split(',')
}

const showArticleDeatil = inject('showDetailVisible')

/*--- 获取文章细节 ---*/
const fetchArticleDetail = async (index) => {
    const result = await getPublicBlogDetail(article_content.value[index].id)
    if (result.data.code === 1) {
        localStorage.setItem("article", JSON.stringify(result.data.data))
    }
    showArticleDeatil.value = true
}

const pageSize = ref(PAGE_SIZE)

const endOfContent = ref(false)


/*--- 滚动加载 ---*/
const load = async () => {
    console.log("开始执行", loading.value)
    if (loading.value || article_content.value === null) {
        return
    }
    loading.value = true
    try {
        const result = await getBlogsByPage(currentPage.value, pageSize.value, userId)
        loading.value = false
        if (result.data.code === 1) {
            let articles = result.data.data.records
            if (articles.length === 0) {
                endOfContent.value = true
                loading.value = false
                return
            }
            //将字符串 转化为数组
            articles.forEach(item => {
                item.tags = toStringArray(item.tags)
            })
            articles.forEach(item => {
                item.createTime = dateFormat(item.createTime)
            })
            //将新的文章添加到原来的文章中
            article_content.value = article_content.value.concat(articles)
            currentPage.value++
        }
    } finally {
        loading.value = false
    }
    console.log("执行结束")

}

onMounted(() => {
    fetchArticles()
})



</script>

<template>
    <transition name="fade">
        <div v-infinite-scroll="load" id="showArticle">
            <div class="article" v-for="(article, index) in article_content" @click="fetchArticleDetail(index)">
                <div class="article-cover">
                    <img :src=article.filePath alt="">
                </div>
                <div class="article-info">
                    <div class="article-info-top">
                        <div class="article-info-top-left">
                            <h3 class="info-title">{{ article.title }}</h3>
                            <span class="info-profile">{{ article.profile }}</span>
                            <div class="info-tags">
                                <el-tag style="margin-right: 5px;" v-for="(tag) in article.tags">
                                    {{ tag }}
                                </el-tag>
                            </div>
                        </div>
                        <div class="article-info-top-right">
                            {{ article.createTime }}
                        </div>
                    </div>
                    <div class="article-info-bottom">
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

            <div v-if="loading" class="bottom-content">
                <el-icon size="20px" class="is-loading">
                    <Loading />
                </el-icon>
                <span>加载中...</span>
            </div>
            <div v-if="endOfContent" class="bottom-content">已经到底了...😓</div>
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
        width: 100%;
        height: 250px;
        margin: 0 auto;
        padding: 20px;
        cursor: pointer;
        background-color: white;
        transition: all 0.5s;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        z-index: 1;

        /* 添加底部边框 */
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

                    .info-profile {
                        font-size: 14px;
                        color: #666;
                        margin: 10px, 0;
                    }
                }

                .article-info-top-right {
                    width: 30%;
                    text-align: center;
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

                .info-date {
                    text-align: center;
                    font-size: 14px;
                    color: #666;
                }

            }

        }

        .article-cover {
            display: flex;
            align-items: center;
            width: 40%;
            height: 100%;
            border-radius: 10px;
            overflow: hidden;

            img {
                width: 100%;
                border-radius: 10px;
            }
        }
    }

    .bottom-content {
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
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
