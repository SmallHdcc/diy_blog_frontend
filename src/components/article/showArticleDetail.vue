<script setup>
import { ref, inject, onMounted, watch } from 'vue'
/*--评论相关接口--*/
import { uploadComment, getComments, toggleLike, deleteComment } from '@/api/comment.js'
import { ElMessage } from 'element-plus';
import thumbsUp from '@/components/icon/thumbsUp.vue';
/*--防抖--*/
import { debounce } from 'lodash'
/*--代码高亮--*/
import Prism from "prismjs"
import "prismjs/themes/prism-one-dark.css"
import "prismjs/components/prism-python.js"


import { useUserStore } from '@/stores/user.js';

const fetchBaseInfo = () => {
    return JSON.parse(localStorage.getItem("baseInfo"))
}

const userStore = useUserStore()
let isLogin = userStore.isLogin

watch(() => userStore.isLogin, (newVal, oldVal) => {
    if (newVal) {
        userAvatar.value = fetchBaseInfo().avatar
        console.log(userAvatar.value)
    } else {
        userAvatar.value = null
    }

})

const article = ref({
    title: '',
    author: '',
    date: '',
    heat: '',
    content: '',
    authorAvatar: '',
})

const handleArticleShow = inject('handleArticleShow')

watch(handleArticleShow, () => {
    article.value = JSON.parse(localStorage.getItem("article"))
})

// 与评论有关
const commentArray = ref([])

/*here is about commnet*/

const userAvatar = ref('')
if (fetchBaseInfo()) {
    userAvatar.value = fetchBaseInfo().avatar
    isLogin = true
}

const commentInput = ref()
// 这是要提交的data
const commentUpload = ref({
    userId: "",
    articleId: "",
    content: "",
})

const uploadCommentData = async () => {
    commentUpload.value.userId = JSON.parse(localStorage.getItem("baseInfo")).id
    commentUpload.value.articleId = JSON.parse(localStorage.getItem("article")).id
    commentUpload.value.content = commentInput.value
    console.log(commentUpload.value)
    if (commentUpload.value.content.trim() == "") {
        ElMessage.error("评论不能为空")
        commentUpload.value.content = ""
        return
    }
    const result = await uploadComment(commentUpload.value)
    if (result.data.code == 1) {
        ElMessage.success("评论成功")
        commentInput.value = ""
        fetchComments()
    }
}

let commentNumber = ref()

const fetchComments = async () => {
    const articleId = JSON.parse(localStorage.getItem("article")).id
    const baseInfo = JSON.parse(localStorage.getItem("baseInfo"))
    const userId = baseInfo && baseInfo.id ? baseInfo.id : null
    const result = await getComments(articleId, userId)
    if (result.data.code == 1) {
        commentArray.value = result.data.data
        commentNumber.value = commentArray.value.length
    }
}

//防抖的使用 点赞
const debounceToggleLike = debounce(toggleLike, 1500)


const toggleCommentLike = async (index) => {
    let comment = commentArray.value[index]
    try {
        await debounceToggleLike(comment.id, comment.isLiked)
    } catch (error) {
        // 如果请求失败，恢复原来的 isLiked 状态和 likeCount
        comment.isLiked = !comment.isLiked
        comment.likeCount += comment.isLiked ? 1 : -1
        console.error(error)
    }
    // 切换 isLiked 状态
    comment.isLiked = !comment.isLiked
    // 根据新的 isLiked 状态增加或减少 likeCount
    comment.likeCount += comment.isLiked ? 1 : -1
    // 发送请求到服务器
    console.log(comment.id, comment.isLiked)

}


//删除评论
const removeComments = async (index) => {
    const result = await deleteComment(commentArray.value[index].id)
    if (result.data.code === 1) {
        ElMessage.success("删除成功")
        fetchComments()
    } else {
        ElMessage.error("删除失败")
    }

}
// const showDetailVisible = inject('showDetailVisible')

// const flag = inject('flag')
// //当updateArticle变化时，更新article
// watch(flag, () => {
//     article.value = JSON.parse(localStorage.getItem("article"))
//     if (JSON.parse(localStorage.getItem("baseInfo")))
//         fetchComments()
//     console.log("文章更新")
//     showDetailVisible.value = true;
// })

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

const doWhileEnter = () => {
    article.value = JSON.parse(localStorage.getItem("article"))
    const baseInfo = JSON.parse(localStorage.getItem("baseInfo"))
    if (baseInfo) {
        article.value.authorAvatar = baseInfo.avatar
        fetchComments()
    }
    article.value.createTime = dateFormat(article.value.createTime)
}

onMounted(() => {
    doWhileEnter()
    setTimeout(() => {
        Prism.highlightAll()// 全局代码高亮
    }, 100)
})


</script>

<template>
    <el-scrollbar height="625px">
        <div id="detailPage">
            <div id="container">
                <div id="author-info">
                    <div id="author-avatar">
                        <img :src="article.authorAvatar" alt="">
                    </div>
                    <div id="author-name">
                        <span>{{ article.username }}</span>
                    </div>
                    <el-button type="primary">关注+</el-button>
                </div>
                <div id="main">
                    <h1 id="title">{{ article.title }}</h1>

                    <div id="content" style="white-space: pre-wrap;padding: 10px; text-indent: 2em;"
                        v-html="article.content">
                    </div>
                    <div id="baseInfo">
                        <span id="date">
                            <span>{{ article.createTime }}</span>
                        </span>
                        <span id="view">
                            <svg class="icon icon_special" aria-hidden="true">
                                <use xlink:href="#icon-yanjing"></use>
                            </svg>
                            {{ article.views }}
                        </span>
                        <span id="share">
                            <svg class="icon icon_special" aria-hidden="true">
                                <use xlink:href="#icon-fenxiang"></use>
                            </svg>
                        </span>
                    </div>
                    <div class="comment">
                        <div id="comment-font-box">
                            <h2>全部评论{{ article.commentNumber }}</h2>
                            <span>{{ commentNumber }}</span>
                        </div>
                        <div id="comment-input-box">
                            <div id="username-avatar">
                                <img v-if="isLogin" :src=userAvatar alt="">
                                <div v-if="!isLogin">请先登录</div>
                            </div>
                            <div id="input-container">
                                <textarea v-model="commentInput" style=" resize: none;font-family: -apple-system;"
                                    name="" placeholder="发表一条评论吧" cols="30" rows="10"></textarea>
                            </div>
                            <div :disabled="isLogin" id="input-commit-button" @click="uploadCommentData">发布</div>
                        </div>
                        <div id="comment-list-box">
                            <div class="comment-list" v-for="(item, key) in commentArray">
                                <div class="commenter-avatar"><img :src=item.avatar alt=""></div>
                                <div class="commenter-info">
                                    <div class="coomenter-nickname">{{ item.username }}</div>
                                    <div class="commenter-content">{{ item.content }}</div>
                                    <div class="comment-interaction">
                                        <div class="release-time">{{ item.createTime }}</div>
                                        <div class="thumbs" @click="toggleCommentLike(key)">
                                            <thumbsUp :fill="item.isLiked ? 'green' : '#666666'" :id="key + 'like-btn'"
                                                style="width: 100%;height: 100%; color: green;" />
                                            <span>{{ item.likeCount }}</span>
                                        </div>
                                        <div>回复</div>
                                        <el-popconfirm title="你确定你要删除吗?" confirm-button-text="确认"
                                            cancel-button-text="取消" @confirm="removeComments(key)">
                                            <template #reference>
                                                <div>删除</div>
                                            </template>
                                        </el-popconfirm>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-scrollbar>
</template>

<style lang="less" scoped>
#detailPage {
    position: relative;
    width: 100%;
    height: 100%;
    // min-height: 100vh;
    // background-color: rgb(234, 239, 245);
    background-attachment: fixed;
    background-size: 100%;

    #container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;

        #author-info {
            display: flex;
            align-items: center;
            position: relative;
            width: 100%;

            #author-avatar {
                width: 40px;
                height: 40px;
                margin-right: 5px;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 100%;
                }
            }

            #author-name {
                align-self: flex-start;
                color: black;
            }

            .el-button {
                position: absolute;
                right: 10px;
                background-color: rgb(0, 161, 214);
            }
        }

        #main {
            position: relative;
            display: flex;
            flex-direction: column;
            // align-items: center;
            width: 100%;
            background-color: rgba(255, 255, 255);
            border-radius: 10px;
            margin: 0 0 10px 0;
            z-index: 0;


            #baseInfo {
                display: flex;
                justify-content: left;
                width: 100%;
                font-size: 14px;
                margin-top: 10px;

                #view,
                #date,
                #username {
                    display: flex;
                    align-items: center;
                    margin-right: 20px;
                    color: gray;
                }
            }


            #title {
                text-align: center;
                font-weight: 700;
            }


            #content {
                width: 85%;
                height: 100%;
                margin: 0px 20px;
                font-size: 16px;

                code {
                    font-size: 14px;
                }
            }

            .comment {
                display: flex;
                flex-direction: column;
                width: 100%;
                margin-top: 30px;

                #comment-font-box {
                    display: flex;
                    align-items: center;

                    h2 {
                        font-weight: 700;
                    }

                    span {
                        margin-left: 10px;
                        font-size: 20px;
                    }
                }

                #comment-input-box {
                    display: flex;
                    width: 80%;
                    margin-top: 30px;

                    #username-avatar {
                        width: 40px;
                        height: 40px;
                        border-radius: 100%;
                        margin-right: 30px;
                        margin-left: 20px;

                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: 100%;
                        }

                        div {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 100%;
                            height: 100%;
                            border-radius: 100%;
                            background-color: rgb(0, 161, 214);
                            color: white;
                            font-size: 14px;
                        }
                    }

                    #input-container {
                        width: 60%;
                        height: 70px;
                        border-radius: 5px;

                        textarea {
                            width: 100%;
                            height: 100%;
                            border-radius: 5px;
                            outline: none;
                            border: none;
                            background-color: #E0E0E0;
                            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                            //文字缩进
                            padding: 10px;
                        }

                        textarea:hover {
                            background-color: #F1F2F3;
                        }
                    }

                    #input-commit-button {
                        width: 10%;
                        height: 70px;
                        background-color: rgb(0, 161, 214);
                        margin-left: 10px;
                        border-radius: 5px;
                        line-height: 70px;
                        text-align: center;
                        font-size: 20px;
                        color: white;
                        letter-spacing: 2px;
                        cursor: pointer;
                    }
                }

                #comment-list-box {
                    width: 60%;
                    margin-top: 30px;

                    .comment-list {
                        display: flex;
                        // justify-content: space-around;
                        width: 100%;

                        .commenter-avatar {
                            width: 40px;
                            height: 40px;
                            margin-right: 30px;
                            margin-left: 20px;
                            border-radius: 100%;

                            img {
                                width: 100%;
                                height: 100%;
                                border-radius: 100%;
                            }
                        }

                        .commenter-info {
                            width: 70%;
                            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                            margin: 10px 0px;

                            .coomenter-nickname {
                                font-size: 16px;
                                color: black;
                            }

                            .commenter-content {
                                font-size: 14px;
                                margin-bottom: 10px;

                            }

                            .comment-interaction {
                                display: flex;
                                position: relative;
                                justify-content: space-between;
                                font-size: 16px;
                                color: rgba(0, 0, 0, 0.5);
                                box-sizing: border-box;

                                .thumbs {
                                    display: flex;
                                    align-items: center;
                                    width: 40px;
                                    height: 25px;
                                    cursor: pointer;
                                }

                                .el-tooltip__trigger {
                                    cursor: pointer;
                                }

                            }
                        }
                    }

                }
            }

        }

    }

    .icon_special {
        width: 1.5em;
        height: 1.5em;
        margin-right: 5px;
    }
}
</style>
