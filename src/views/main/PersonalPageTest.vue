<script setup>
import { ref, onMounted, reactive, provide } from 'vue';
import { getBlogs, getSingleBlogDetail, deleteSingleBlog, uploadAvatar, changeSign, changeArticleStatus } from "@/api"
import { encrypt } from "@/utils"
import WOW from 'wow.js'
import router from '@/router'
import navigation from '@/components/navigation/navigation.vue'

//开头定义变量
const BASE_INFO_KEY = JSON.parse(localStorage.getItem("baseInfo"))
//初始化博客数组
const blogArray = ref([])

//初始化用户信息
let user = ref({
    id: BASE_INFO_KEY ? BASE_INFO_KEY.id : "",
    username: BASE_INFO_KEY ? BASE_INFO_KEY.username : "",
    avatar: BASE_INFO_KEY ? BASE_INFO_KEY.avatar : "",
    signature: BASE_INFO_KEY ? BASE_INFO_KEY.signature : "",
})

//博客的进入动画
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

//校验个人博客数量是否为0
const startTips = ref(true)
const handleContent = (articles) => {
    if (articles.length != 0) {
        startTips.value = false
        blogArray.value = articles
    }
}

//获得所有个人博客
let userId = ref()
const getBlog = async () => {
    // get all blogs
    if (localStorage.getItem("baseInfo")) {
        userId.value = BASE_INFO_KEY.id
        getBlogs(BASE_INFO_KEY.id).then(res => {
            let articles = res.data.data
            articles.forEach(item => {
                item.tags = toStringArray(item.tags)
            })
            handleContent(articles)
        })
        user.value = BASE_INFO_KEY
    }
    return
}

//处理字符串
function toStringArray(source) {
    return source.substring(1, source.length - 1).split(',')
}

// 博客细节
const checkDetail = async (index) => {
    let id = blogArray.value[index].id
    let originString = `id=${id}&userId=${userId.value}`
    let sign = encrypt(originString)
    const result = await getSingleBlogDetail(id, userId.value, sign)
    if (result.data.code == 1) {
        localStorage.setItem("article", JSON.stringify(result.data.data))
        router.push("/detail")
    }
}

// 博客删除
const deleteBlog = (index) => {
    ElMessageBox.confirm(
        // 'proxy will permanently delete the file. Continue?',
        '此操作将删除此条日记,是否继续?',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            const result = await deleteSingleBlog(blogArray.value[index].id, BASE_INFO_KEY.id)
            if (result.data.code == 1) {
                router.go(0)
                ElMessage({
                    type: 'success',
                    message: '成功删除',
                })
            }

        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}

// 有关博客的顺序 将blogArray中的内容按照id进行顺序排序
const order_count_time = ref(0)
const sortBlogByTime = () => {
    if (order_count_time.value == 0) {
        order_count_time.value = 1
        blogArray.value.sort((a, b) => {
            return a.id - b.id
        })
    } else {
        order_count_time.value = 0
        blogArray.value.sort((a, b) => {
            return b.id - a.id
        })
    }

}

//按照热度排序
const sortBlogByPopularity = () => {
    ElMessage({
        type: 'info',
        message: '暂时不支持按照热度排序',
    })
}


// 关于头像的上传和修改
const dialogVisible = ref(false)

const avatar = ref()
const getSonHander = async () => {
    user.value.avatar = avatar.value.avatarPath
    localStorage.setItem("baseInfo", JSON.stringify(user.value))
    dialogVisible.value = false
    let data = user.value
    const result = await uploadAvatar(data)
    if (result.data.code == 1) {
        ElMessage.success({ message: "图片上传成功！！" })
        window.location.reload()
    }

}

// 关于用户信息的显示
const visible = ref({
    key: "",
    appear: false
})

const handleDisapper = key => {
    visible.value.key = key
    visible.value.appear = !visible.value.appear

}

// 有关签名的操作
const signature = ref(true)
// 在失去焦点之后发送请求

const handleSignature = async (new_signature, userId) => {
    signature.value = !signature.value
    const result = await changeSign(new_signature, userId)
    if (result.data.code == 1) {
        localStorage.setItem("baseInfo", JSON.stringify(user.value))
        ElMessage.success({ message: "签名修改成功！！" })
    }
}



const ChangePrivate = (info, data, userId, isPrivate, index) => {
    ElMessageBox.confirm(
        "此操作将会使此条日记变为" + info + "日记,是否继续?",
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        const result = await changeArticleStatus(data.id, isPrivate, userId)
        if (result.data.code == 1) {
            ElMessage.success({ message: "修改成功！！" })
            blogArray.value[index].isPrivate = !data.isPrivate
        }

    }).catch((err) => {
        console.log(err.message)
    })
}

// 修改日记的公开状态
const handlePrivate = (event, index) => {
    event.stopPropagation()
    let data = blogArray.value[index]
    let status = data.isPrivate == 1 ? "公开" : "私密"
    let isPrivate = data.isPrivate != 1
    //如果已经是公开的了，那就变为私密
    ChangePrivate(status, data, BASE_INFO_KEY.id, isPrivate, index)
}


onMounted(() => {
    wow.init()
    getBlog()
})

</script>

<template>
    <div id="PersonalPageTest">
        <div id="container">
            <navigation />
            <div id="showContent">
                <div id="left-content">
                    <div v-if="startTips" class="if-no-content">
                        <div class="content-bear" id="instruction">
                            <div class="title">欢迎来到SANLINGJIU!</div>
                            <div class="time">2024-1-1</div>
                        </div>
                        一篇记录也没有~~~😑
                    </div>
                    <div class="content-order_way" v-if="!startTips">
                        <span @click="sortBlogByPopularity()">按热度</span>
                        <span @click="sortBlogByTime()">按时间</span>
                    </div>
                    <div v-if="!startTips" class="content-bear wow bounceInLeft" data-wow-duration="2s" :index=key
                        v-for="(item, key) in   blogArray  " @click="checkDetail(key)">
                        <div class="title">{{ item.title }}</div>
                        <div class="time">{{ item.date }}</div>
                        <div class="profile">{{ item.profile }}</div>
                        <div class="tags">
                            <el-tag v-for="(son) in item.tags">{{ son }}</el-tag>
                            <div class="comment">
                                <el-icon size="25px">
                                    <ChatLineRound />
                                </el-icon>
                                <span>{{ item.commentCount }}</span>
                            </div>
                        </div>
                        <div class="state_pri" v-if="item.isPrivate" @click="handlePrivate($event, key)">未公开</div>
                        <div class="state_pub" v-if="!item.isPrivate" @click="handlePrivate($event, key)">已公开</div>
                        <div class="icon-more">
                            <!-- 这里是点击这个三个点的按钮之后弹出来的 -->
                            <el-popover :visible="visible.key == key && visible.appear == true" :width="160">
                                <!-- <p>Are you sure to delete this?</p> -->
                                <div class="icon-operation" @click="deleteBlog(key)">
                                    <span>删除</span>
                                    <el-icon size="25px">
                                        <Delete />
                                    </el-icon>
                                </div>
                                <div class="icon-operation">
                                    <span>更新</span>
                                    <el-icon size="25px">
                                        <Edit />
                                    </el-icon>
                                </div>
                                <template #reference>
                                    <el-icon size="30px" color="#2C3E50">
                                        <MoreFilled @click.stop="handleDisapper(key)" />
                                    </el-icon>
                                </template>
                            </el-popover>
                        </div>
                    </div>
                </div>
                <div class="right-userInfo wow bounceInUp">
                    <div class="el-card">
                        <div id="avatar" @click="dialogVisible = true">
                            <img :src=user.avatar alt="">
                        </div>
                        <div id="userInfo">
                            <div id="username">
                                <el-icon>
                                    <User />
                                </el-icon>
                                <span style="padding-left: 10px;">{{ user.username }}</span>
                            </div>
                            <div id="signature">
                                <!-- I AM A ROOKIE -->
                                <span v-if="signature">{{ user.signature }}</span>
                                <input @blur="handleSignature(user.signature, user.id)" v-model="user.signature"
                                    v-if="!signature"
                                    style="outline: none;border: none;font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;"
                                    type="text" placeholder="编辑个性签名吧！">
                                <el-icon @click="signature = !signature">
                                    <EditPen />
                                </el-icon>
                            </div>
                        </div>
                    </div>
                    <el-dialog v-model="dialogVisible" title="更换头像" width="30%">
                        <avatarCropper style="display: flex; justify-content: center;" ref='avatar'></avatarCropper>
                        <template #footer>
                            <span class="dialog-footer">
                                <el-button @click="dialogVisible = false">取消</el-button>
                                <el-button type="primary" @click="getSonHander">
                                    确定
                                </el-button>
                            </span>
                        </template>
                    </el-dialog>
                </div>
            </div>

        </div>
    </div>
</template>

<style lang="less" scoped>
#PersonalPageTest {
    display: flex;
    justify-content: center;
    width: 100%;
    min-height: 100vh;
    background-color: rgb(242, 243, 245);

    overflow-x: hidden;

    #container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;

        #header {
            display: flex;
            justify-content: center;
            width: 100%;
            height: 50px;
            // background-color: pink;
            overflow: hidden;
            // padding: 0 24px;

            #navigation {
                position: fixed;
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 99%;
                height: 50px;
                background-color: white;
                font-size: 20px;
                box-shadow: 0px 5px 0px 0px rgba(0, 0, 0, 0.1);
                z-index: 99;

                ul {
                    display: flex;

                    li {
                        margin: 0px 10px;
                        cursor: pointer;
                    }
                }

                #add-new-blog {
                    padding-right: 40px;
                }

            }
        }


        #showContent {
            position: relative;
            display: flex;
            width: 80%;
            // background-color: pink;

            #left-content {
                width: 70%;

                .content-order_way {

                    margin: 10px 40px;

                    span {
                        margin: 0 10px;
                        cursor: pointer;
                    }

                    span:hover {
                        color: rgb(135, 200, 238);
                    }
                }

                .if-no-content {
                    display: block;
                    width: 100%;
                    font-size: 30px;
                    color: #999;
                    text-align: center;
                }

                #instruction {
                    justify-content: center;
                }

                .content-bear {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    width: 90%;
                    height: 170px;
                    margin: 10px 40px;
                    padding: 0 10px;
                    background-color: white;
                    border-radius: 5px;
                    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
                    transition: all 0.5s;
                    cursor: pointer;

                    .title {
                        font-size: 24px;
                        padding: 10px 0;
                    }

                    .time {
                        font-size: 16px;
                        padding-bottom: 10px;

                    }

                    .profile {
                        font-size: 14px;
                    }

                    .tags {
                        position: relative;
                        display: flex;
                        align-items: center;

                        .comment {
                            position: absolute;
                            right: 0px;
                            display: flex;
                            align-items: center;
                            cursor: pointer;
                            margin-left: 100px;
                        }

                        .el-tag {
                            margin: 10px 10px 5px 0px;
                        }
                    }

                    .state_pri {
                        position: absolute;
                        top: 10px;
                        right: 50px;
                        width: 50px;
                        height: 20px;
                        background-color: rgb(104, 228, 55);
                        text-align: center;
                        line-height: 20px;
                        border-radius: 5px;
                        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
                        font-size: 14px;
                    }

                    .state_pub {
                        position: absolute;
                        top: 10px;
                        right: 50px;
                        width: 50px;
                        height: 20px;
                        background-color: rgb(245, 32, 71);
                        text-align: center;
                        line-height: 20px;
                        border-radius: 5px;
                        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
                        font-size: 14px;
                    }

                    .icon-more {
                        position: absolute;
                        right: 10px;
                        top: 0px;
                        cursor: pointer;

                    }

                    #instructionDetail {
                        font-size: 16px;
                        text-align: left;
                        //首段缩进
                        text-indent: 2em;

                    }
                }

                .content-bear:hover {
                    background-color: rgb(135, 200, 238);
                    transform: translateX(5px);
                }
            }

            //用户信息相对于浏览器定位
            .right-userInfo {
                position: fixed; //这里是相对于浏览器定位的，所以宽度都是针对浏览器的，不能搞混
                right: 160px; //调整的
                width: 24%;
                height: 400px;
                margin-top: 10px;
                // background-color: pink;

                .el-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                    // background-color: pink;
                    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

                    #avatar {
                        width: 150px;
                        height: 150px;
                        border-radius: 100%;
                        margin-top: 50px;
                        background-color: white;

                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: 100%;
                            cursor: pointer;
                        }
                    }

                    #username {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 26px;
                        text-align: center;
                        margin-top: 24px;

                    }

                    #signature {
                        display: flex;
                        align-items: center;
                        font-size: 20px;

                        span,
                        input {
                            width: 150px;
                            height: 30px;
                            color: #999;
                            padding-right: 10px;
                            border-radius: 5px;
                            text-align: center;
                            transition: all 0.5s;
                        }

                        span:focus,
                        input:focus {
                            background-color: #c2ceda;
                        }

                        .el-icon {
                            cursor: pointer;
                        }
                    }
                }



            }
        }
    }
}

.el-popover {
    .icon-operation {
        display: flex;
        justify-content: center;
        align-items: center;
        // background-color: pink;
        font-size: 20px;
        cursor: pointer;

        span {
            padding-right: 10px;
        }
    }
}
</style>
