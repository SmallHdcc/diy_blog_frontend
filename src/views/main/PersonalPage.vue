<script setup>
import { ref, onMounted, reactive, provide } from 'vue';
/*--引入博客相关接口--*/
import { getBlogs, getSingleBlogDetail } from "@/api/blog.js"
/*--引入用户相关接口--*/
import { uploadAvatar, changeSign } from "@/api/index.js"
import { encrypt } from "@/utils"
/*--路由器--*/
import router from '@/router'
//element-plus
import { ElMessage } from 'element-plus'
// import personalArticle from '@/components/article/showPersonalArticle.vue'
import showArticle from '@/components/article/articles.vue';
import showArticleDetail from '@/components/article/showArticleDetail.vue';



//开头定义变量
const BASE_INFO_KEY = JSON.parse(localStorage.getItem("baseInfo"))
provide('userId', BASE_INFO_KEY.id)

//初始化博客数组
const blogArray = ref([])

//初始化用户信息
let user = ref({
    id: BASE_INFO_KEY ? BASE_INFO_KEY.id : "",
    username: BASE_INFO_KEY ? BASE_INFO_KEY.username : "",
    avatar: BASE_INFO_KEY ? BASE_INFO_KEY.avatar : "",
    signature: BASE_INFO_KEY ? BASE_INFO_KEY.signature : "",
})

const content_types = reactive([
    '发布', '评论', '草稿', '动态'
])



//校验个人博客数量是否为0
const startTips = ref(true)


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
                    showClose: true,
                    message: '成功删除',
                })
            }

        })
        .catch(() => {
            ElMessage({
                type: 'info',
                showClose: true,
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
const order_count_heat = ref(0)
//按照热度排序
const sortBlogByPopularity = () => {
    if (order_count_heat.value == 0) {
        order_count_heat.value = 1
        blogArray.value.sort((a, b) => {
            return a.heat - b.heat
        })
    } else {
        order_count_heat.value = 0
        blogArray.value.sort((a, b) => {
            return b.heat - a.heat
        })
    }
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
        ElMessage.success({ showClose: true, message: "图片上传成功！！" })
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
        ElMessage.success({ showClose: true, message: "签名修改成功！！" })
    }
}



const ChangePrivate = (info, data, isPrivate, index) => {
    ElMessageBox.confirm(
        "此操作将会使此条日记变为" + info + "日记,是否继续?",
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        const result = await changeArticleStatus(data.id, isPrivate)
        if (result.data.code == 1) {
            ElMessage.success({ showClose: true, message: "修改成功！！" })
            blogArray.value[index].isPrivate = !data.isPrivate
        }

    }).catch((err) => {
        console.log(err.message)
    })
}


/*---控制详情页与主页---*/
const showDetailVisible = ref(false) // Flag to control visibility

provide('showDetailVisible', showDetailVisible) // Provide the flag to all children components
const handleArticleShow = ref(false)
provide('handleArticleShow', handleArticleShow)

const articlesCount = ref(0)
const getArticlesCount = (value) => {
    articlesCount.value = value
}

onMounted(() => {
})

</script>

<template>
    <div id="PersonalPage">
        <div id="container">
            <div id="showContent">
                <div class="left-main_content">
                    <div class="content_type">
                        <span v-for="(type, index) in content_types">
                            {{ type }}<span v-if="type === '发布'">({{ articlesCount }})</span>
                        </span>
                    </div>
                    <showArticle @get-articles-count="getArticlesCount"></showArticle>
                    <el-dialog v-model="showDetailVisible" width="900px" style="display: flex;flex-direction: column;">
                        <showArticleDetail v-if="showDetailVisible"></showArticleDetail>
                    </el-dialog>
                </div>
                <div class="right-userInfo">
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
#PersonalPage {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 94vh;

    #container {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 80%;
        height: 100%;

        #showContent {
            display: flex;
            justify-content: space-between;
            width: 100%;

            .left-main_content {
                display: flex;
                flex-direction: column;
                width: 69%;
                border-radius: 10px 10px 0 0;
                margin: 5px 0 10px 0;

                .content_type {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    width: 100%;
                    height: 50px;
                    border-radius: 10px 10px 0 0;
                    background-color: white;
                    margin-bottom: 10px;
                    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                    font-size: 20px;

                    span {
                        cursor: pointer;
                    }

                    span:hover {
                        color: #409EFF;
                    }
                }

            }

            //用户信息相对于浏览器定位
            .right-userInfo {
                position: sticky; //这里是相对于浏览器定位的，所以宽度都是针对浏览器的，不能搞混
                top: 7vh;
                width: 30%;
                height: 400px;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                overflow: hidden;

                .el-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                    //渐变色 从上到下
                    background: linear-gradient(to bottom, rgba(0, 161, 214), white);


                    #avatar {
                        width: 150px;
                        height: 150px;
                        border-radius: 100%;
                        margin-top: 50px;

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

.example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
}
</style>
