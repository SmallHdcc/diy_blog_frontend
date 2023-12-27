<script setup>
import { ref, reactive, onMounted } from 'vue'
// import "highlight.js/styles/github-dark.css";
import { uploadComment, getComments, likeTheComment, cancelLikeTheComment } from '@/api'
import WOW from 'wow.js'
import { ElMessage } from 'element-plus';
import thumbsUp from '@/components/icon/thumbsUp.vue';
// 防抖
import { debounce } from 'lodash'
// 代码高亮
import Prism from "prismjs"
import "prismjs/themes/prism-one-dark.css"
// import "prismjs/components/prism-java.js"
import "prismjs/components/prism-python.js"





const article = ref({
    title: '测试文章',
    date: '',
    content: ''
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

const userAvatar = ref(JSON.parse(localStorage.getItem("baseInfo")).avatar)


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
    const result = await getComments(JSON.parse(localStorage.getItem("article")).id, JSON.parse(localStorage.getItem("baseInfo")).id)
    if (result.data.code == 1) {
        // 格式化时间
        result.data.data.forEach((item, key) => {
            let date = new Date(item.createTime)
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            let day = date.getDate()
            let hour = date.getHours()
            let minute = date.getMinutes()
            let second = date.getSeconds()
            item.createTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`
        })
        commentArray.value = result.data.data
        commentNumber.value = commentArray.value.length
    }
}

//防抖的使用

const debounceLikeTheComment = debounce(likeTheComment, 500)
const debounceCancelLikeTheComment = debounce(cancelLikeTheComment, 500)


const likeTheCommentInPage = async (index) => {
    let data = {
        userId: JSON.parse(localStorage.getItem("baseInfo")).id,
        id: commentArray.value[index].id,
    }
    //根据
    console.log(commentArray.value[index].isLiked)
    if (commentArray.value[index].isLiked) {
        // 调用取消点赞接口
        debounceCancelLikeTheComment(data)
        commentArray.value[index].isLiked = false
        commentArray.value[index].likeCount--
    } else {
        debounceLikeTheComment(data)
        commentArray.value[index].isLiked = true
        commentArray.value[index].likeCount++
    }

}



onMounted(() => {
    wow.init()
    article.value = JSON.parse(localStorage.getItem("article"))
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
                <h1 id="title">{{ article.title }}</h1>
                <span id="date">{{ article.date }}</span>
                <!--  -->
                <div id="content" style="white-space: pre-wrap;padding: 10px;" v-html="article.content">
                </div>
                <div class="comment">
                    <div id="comment-font-box">
                        <h2>评论</h2>
                        <span>{{ commentNumber }}</span>
                    </div>
                    <div id="comment-input-box">
                        <div id="username-avatar">
                            <img :src=userAvatar alt="">
                        </div>
                        <div id="input-container">
                            <textarea v-model="commentInput" style="resize: none;font-family: -apple-system;" name=""
                                placeholder="发表一条评论吧" cols="30" rows="10"></textarea>
                        </div>
                        <div id="input-commit-button" @click="uploadCommentData">发布</div>
                    </div>
                    <div id="comment-list-box">
                        <div class="comment-list" v-for="(item, key) in commentArray">
                            <div class="commenter-avatar"><img :src=item.avatar alt=""></div>
                            <div class="commenter-info">
                                <div class="coomenter-nickname">{{ item.username }}</div>
                                <div class="commenter-content">{{ item.content }}</div>
                                <div class="comment-interaction">
                                    <div class="release-time">{{ item.createTime }}</div>
                                    <div class="thumbs" @click="likeTheCommentInPage(key)">
                                        <thumbsUp :fill="item.isLiked ? 'green' : '#666666'" :id="key + 'like-btn'"
                                            style="width: 100%;height: 100%; color: green;" />
                                        <span>{{ item.likeCount }}</span>
                                    </div>
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
    width: 100%;
    // height: 100;
    // height: 100%;
    min-height: 100vh;
    background-image: url(/img/detailBGI.jpg);
    background-attachment: fixed;
    background-size: 100%;




    #container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;

        #header {
            position: fixed;
            width: 100%;
            height: 50px;
            background-color: rgba(100, 227, 155, 0.7);
        }

        #main {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 75%;
            // background-color: rgba(255, 255, 255, 0.5);
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 10px;
            margin: 60px 0px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

            #date {
                font-size: 24px;
                color: rgb(25, 22, 23)
            }

            #title {
                margin: 100px 0px 50px 0px;
            }

            #content {
                // text-indent: 2rem;
                margin: 0px 20px;
                font-size: 20px;
                width: 100%;
                height: 100%;

            }

            .comment {
                display: flex;
                flex-direction: column;
                width: 100%;

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
                    width: 70%;
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
                                // justify-content: space-between;
                                font-size: 16px;
                                color: rgba(0, 0, 0, 0.5);

                                .thumbs {
                                    display: flex;
                                    align-items: center;
                                    width: 40px;
                                    height: 25px;
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
