<script setup>
import { ref, inject, onMounted, watch } from 'vue'
/*--评论相关接口--*/
import { uploadComment, getComments, toggleLike, deleteComment } from '@/api/comment.js'
/*--动画相关--*/
import WOW from 'wow.js'
import { ElMessage } from 'element-plus';
import thumbsUp from '@/components/icon/thumbsUp.vue';
/*--防抖--*/
import { debounce } from 'lodash'
/*--代码高亮--*/
import Prism from "prismjs"
import "prismjs/themes/prism-one-dark.css"
import "prismjs/components/prism-python.js"


import { useUserStore } from '@/stores/user.js';

const getBaseInfo = () => {
    return JSON.parse(localStorage.getItem("baseInfo"))
}

const userStore = useUserStore()
let isLogin = userStore.isLogin

watch(() => userStore.isLogin, (newVal, oldVal) => {
    if (newVal) {
        userAvatar.value = getBaseInfo().avatar
        console.log(userAvatar.value)
    } else {
        userAvatar.value = null
    }

})

const article = ref({
    title: '',
    username: '',
    date: '',
    heat: '',
    content: ''
})

const handleArticleShow = inject('handleArticleShow')

watch(handleArticleShow, () => {
    article.value = JSON.parse(localStorage.getItem("article"))
})




// 关于动画
const wow = new WOW({
    boxClass: 'wow',            //动画元素的CSS类(默认为wow)
    animateClass: 'animated',   // CSS类(默认为animation)
    offset: 0,                  //触发动画时到元素的距离(默认为0)
    mobile: true,               //在移动设备上触发动画(默认为true)
    live: true,                 //异步加载内容(默认为true)
    callback: function (box) {
        //每次动画开始时触发回调
        //传入的参数是正在动画的DOM节点
    },
    scrollContainer: null,      //可选滚动容器选择器，否则使用window
})


// 与评论有关
const commentArray = ref([
])

/*here is about commnet*/

const userAvatar = ref('')
if (getBaseInfo()) {
    userAvatar.value = getBaseInfo().avatar
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
        getCommentInPage()
    }
}

let commentNumber = ref()

const getCommentInPage = async () => {
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


const toggleLikeInPage = async (index) => {
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


const showArticleDeatil = inject('showDetailVisible')

const backToMainPage = () => {
    showArticleDeatil.value = false
}

//删除评论
const deleteCommentInPage = async (index) => {
    const result = await deleteComment(commentArray.value[index].id)
    if (result.data.code === 1) {
        ElMessage.success("删除成功")
        getCommentInPage()
    } else {
        ElMessage.error("删除失败")
    }

}


onMounted(() => {
    wow.init()
    article.value = JSON.parse(localStorage.getItem("article"))
    console.log(article)
    if (JSON.parse(localStorage.getItem("baseInfo")))
        getCommentInPage()
    setTimeout(() => {
        Prism.highlightAll()// 全局代码高亮
    }, 100)
})


</script>

<template>
    <div id="detailPage">
        <div id="container">
            <div id="main" class="wow bounceInUp">
                <div @click="backToMainPage" class="arrow-back">
                    <el-icon style="font-weight: 700;" size="30px">
                        <Back />
                    </el-icon>
                </div>
                <h1 id="title">{{ article.title }}</h1>
                <div id="baseInfo">
                    <span id="date">
                        <el-icon style="margin-right: 10px;">
                            <Calendar />
                        </el-icon>
                        <span>{{ article.createTime }}</span>
                    </span>
                    <span id="heat">
                        <el-icon style="margin-right: 10px;">
                            <View />
                        </el-icon>
                        <span>{{ article.views + 1 }}</span>
                    </span>
                    <span id="username">
                        <el-icon style="margin-right: 10px;">
                            <User />
                        </el-icon>
                        <span>{{ article.username }}</span>
                    </span>
                </div>
                <!--  柔和分割线-->
                <div style="width: 70%;height: 1px;background-color: rgba(0, 0, 0, 0.1);margin: 20px 0px;"></div>

                <div id="content" style="white-space: pre-wrap;padding: 10px;" v-html="article.content">
                </div>
                <div class="comment">
                    <div style="width: 70%;height: 1px;background-color: rgba(0, 0, 0, 0.1);margin: 20px 0px;"></div>

                    <div id="comment-font-box">
                        <h2>评论</h2>
                        <span>{{ commentNumber }}</span>
                    </div>
                    <div id="comment-input-box">
                        <div id="username-avatar">
                            <img v-if="isLogin" :src=userAvatar alt="">
                            <div v-if="!isLogin">请先登录</div>
                        </div>
                        <div id="input-container">
                            <textarea v-model="commentInput" style=" resize: none;font-family: -apple-system;" name=""
                                placeholder="发表一条评论吧" cols="30" rows="10"></textarea>
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
                                    <div class="thumbs" @click="toggleLikeInPage(key)">
                                        <thumbsUp :fill="item.isLiked ? 'green' : '#666666'" :id="key + 'like-btn'"
                                            style="width: 100%;height: 100%; color: green;" />
                                        <span>{{ item.likeCount }}</span>
                                    </div>
                                    <div>回复</div>
                                    <el-popconfirm title="你确定你要删除吗?" confirm-button-text="确认" cancel-button-text="取消"
                                        @confirm="deleteCommentInPage(key)">
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
</template>

<style lang="less" scoped>
#detailPage {
    width: 90%;
    min-height: 100vh;
    background-color: rgb(234, 239, 245);
    background-attachment: fixed;
    background-size: 100%;

    #container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;

        #main {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            background-color: rgba(255, 255, 255);
            border-radius: 10px;
            margin: 10px 0px 30px 0px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            z-index: 0;

            .arrow-back {
                position: absolute;
                top: 0;
                left: 10px;
                cursor: pointer;
            }

            #baseInfo {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 20px;
                width: 60%;

                #heat,
                #date,
                #username {
                    display: flex;
                    align-items: center;
                }
            }


            #title {
                margin: 50px 0px 50px 0px;
            }


            #content {
                width: 85%;
                height: 100%;
                margin: 0px 20px;
                font-size: 20px;

                code {
                    font-size: 14px;
                }
            }

            .comment {
                display: flex;
                flex-direction: column;
                width: 100%;
                margin-top: 70px;

                #comment-font-box {
                    display: flex;
                    // justify-content: center;
                    align-items: center;

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
                        width: 70px;
                        height: 70px;
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
                            background-color: rgb(99, 204, 131);
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
                        background-color: rgb(99, 204, 131);
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
                            width: 70px;
                            height: 70px;
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
                            border-bottom: 1px solid rgba(0, 0, 0, 0.5);
                            margin: 10px 0px;

                            .coomenter-nickname {
                                font-size: 16px;
                                color: rgb(99, 204, 131);
                            }

                            .commenter-content {
                                font-size: 20px;
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
}
</style>
