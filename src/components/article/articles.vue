<script setup>
import { ref, onMounted, inject, reactive } from 'vue'
import { getPublicBlogDetail, getBlogsByPage, deleteArticle } from '@/api/blog.js'
import { ElMessage } from 'element-plus';
import { remove } from 'lodash';

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

const emit = defineEmits(['get-articles-count'])

/*--- 获取文章 ---*/
const fetchArticles = async () => {
    loading.value = true
    const result = await getBlogsByPage(currentPage.value, pageSize.value, userId)
    if (result.data.code === 1) {
        let articles = result.data.data.records
        //将文章总数传递给父组件
        emit('get-articles-count', result.data.data.total)
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

}

const removeArticle = async (index, event) => {
    event.stopPropagation()
    const result = await deleteArticle(article_content.value[index].id)
    if (result.data.code === 1) {
        article_content.value.splice(index, 1)
        ElMessage.success("删除成功")
    }
}
const editArticle = async (index, event) => {
    event.stopPropagation()
    console.log("编辑")
}

// 修改日记的公开状态
const handlePrivate = (event, index) => {
    event.stopPropagation()
    let data = article_content.value[index]
    let status = data.isPrivate === 1 ? "私密" : "公开"
    let isPrivate = data.isPrivate != 1
    //如果已经是公开的了，那就变为私密
    ChangePrivate(status, data, isPrivate, index)
}




onMounted(() => {
    fetchArticles()
})

</script>

<template>
    <transition name="fade">
        <div v-infinite-scroll="load" infinite-scroll-immediate-check="true" id="showArticle">
            <div class="article" v-for="(article, index) in article_content" @click="fetchArticleDetail(index)">
                <div class="article-info">
                    <div class="article-info-top">
                        <div class="article-info-top-left">
                            <h3 class="info-title">{{ article.title }}</h3>
                            <div class="info-tags">
                                <el-tag style="margin-right: 5px;" v-for="(tag) in article.tags">
                                    {{ tag }}
                                </el-tag>
                            </div>
                            <span class="info-profile">{{ article.profile }}</span>
                        </div>
                        <div v-show="userId === 0 ? false : true" class="article-info-top-right">
                            状态: 公开
                        </div>
                    </div>
                    <div class="article-info-bottom">
                        <div class="article-option">
                            <div v-show="userId === 0 ? false : true">
                                <span @click="removeArticle(index, $event)">删除</span>
                                <span @click="editArticle(index, $event)">编辑</span>
                                <span>公开</span>
                            </div>
                        </div>
                        <div class="info-author">
                            <div class="article-commentCount">
                                <el-icon style="margin-right: 5px;" size="20px">
                                    <ChatDotSquare />
                                </el-icon>
                                <span>
                                    {{ article.commentCount }}
                                </span>
                            </div>
                            <div class="article-views">
                                <el-icon style="margin-right: 5px;" size="20px">
                                    <View />
                                </el-icon>
                                <span>
                                    {{ article.views }}
                                </span>
                            </div>
                            <div class="author-avatar"><img :src="article.avatar" alt=""></div>
                            <div class="author-username">
                                <span>{{ article.username }}</span>
                                <span style="color:gray;font-size: 12px;">{{ article.createTime }}</span>
                            </div>
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
            width: 100%;
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
                        width: 100%;
                        font-size: 14px;
                        color: #666;
                        margin-top: 20px;
                        text-indent: 2em;
                        text-align: left;
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
                justify-content: space-between;
                text-align: right;
                width: 100%;

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

                    .article-commentCount {
                        display: flex;
                        align-items: center;
                        align-self: flex-end;
                        margin-right: 20px;
                    }

                    .article-views {
                        display: flex;
                        align-items: center;
                        align-self: flex-end;
                    }

                    .author-username {
                        display: flex;
                        flex-direction: column;
                        text-align: left;
                        font-size: 16px;
                    }
                }

                .info-date {
                    text-align: center;
                    font-size: 14px;
                    color: #666;
                }

                .article-option {
                    width: 25%;
                    font-size: 14px;
                    align-self: flex-end;

                    div {
                        width: 100%;
                        text-align: left;

                        span {
                            margin-right: 10px;
                        }

                        span:hover {
                            color: #409EFF;
                        }
                    }

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
