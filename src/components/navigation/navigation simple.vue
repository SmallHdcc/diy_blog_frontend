<script setup>
import { onMounted, onUnmounted, provide, ref, watch } from 'vue'
import Login from '@/components/login/Login.vue';
import Register from '@/components/login/Register.vue';
import WebFunction from '@/components/navigation/WebFunction.vue';
import { checkToken, search } from '@/api/index.js'
import { ElMessage } from 'element-plus';


//设置常量
const BASE_INFO_KEY = 'baseInfo'

const getBaseInfo = () => {
    const baseInfo = localStorage.getItem(BASE_INFO_KEY);
    return baseInfo ? JSON.parse(baseInfo) : null;
}

const linkList = ref([
    {
        name: '首页',
        link: "/",
    },
])


//父子组件共同控制登录框的显示与隐藏
const dialogVisable = ref(false)
provide('dialogVisable', dialogVisable)
//这里检测是否登录
const isLogin = ref(false)
provide('isLogin', isLogin)

const userAvatar = ref(null)
const username = ref(null)
//监视登录状态
watch(isLogin, () => {
    if (isLogin.value) {
        const baseInfo = getBaseInfo()
        username.value = baseInfo?.username ?? null
        userAvatar.value = baseInfo?.avatar ?? null
        if (!baseInfo) {
            isLogin.value = false
        }
    }
})

//根据状态展示注册或者是登录窗口
const isHaveAccount = ref(true)
provide('isHaveAccount', isHaveAccount)


//传给抽屉子组件
provide('username', username)
provide('userAvatar', userAvatar)

const emit = defineEmits(['search'])

/* 导航栏颜色控制 */
const isScrolled = ref(false)

const handleScroll = () => {
    console.log(window.scrollY)
    isScrolled.value = window.scrollY > 10
}

const UNAUTHORIZED = 401
onMounted(async () => {
    window.addEventListener('scroll', handleScroll)
    const { data: { code } } = await checkToken()
    if (code == UNAUTHORIZED) {
        //过期显示登录按钮
        isLogin.value = false
        ElMessage.warning("请重新登陆")
    } else {
        const baseInfo = getBaseInfo()
        username.value = baseInfo ? baseInfo.username : null
        userAvatar.value = baseInfo ? baseInfo.avatar : null
        isLogin.value = true
    }
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

</script>
<template>
    <div id="header">
        <div id="container" :class="{ scrolled: isScrolled }">
            <div id="setWidth">
                <div id="navigation">
                    <router-link active-class="link-hover" to="/" id="web-name" class="web-common_style">
                        <img src="/img/零玖网.png" alt="">
                    </router-link>
                    <router-link active-class="link-hover" v-for="item in linkList" :to="item.link" id="web-page"
                        class="web-common_style">
                        <span>{{ item.name }}</span>
                    </router-link>
                    <div id="navigation-user" class="web-common_style">
                        <div id="navigation-user-avatar">
                            <el-dropdown style="width: 100%;height: 100%;" lacement="bottom">
                                <span style=" width: 100%; height: 100%;" class="el-dropdown-link">
                                    <img id="user_avatar" style="width: 100%;border-radius: 100%;" v-if="isLogin"
                                        :src="userAvatar" alt="">
                                </span>
                                <template #dropdown>
                                    <el-dropdown-menu
                                        style="position: relative; width: 300px;height: 400px; padding: 0;">
                                        <WebFunction />
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                    </div>
                    <div @click="dialogVisable = true" v-if="!isLogin" id="not_login_in">登录</div>
                </div>
                <Login v-show="isHaveAccount" />
                <Register v-show="!isHaveAccount" />
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
#header {
    position: fixed;
    height: 6vh;
    background-color: transparent;
    z-index: 1;

    #container {
        position: fixed;
        display: flex;
        justify-content: center;
        width: 100%;
        height: 6vh;
        // background-color: rgba(255, 255, 255, 0.2);
        // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
        //背景透明
        background-color: transparent;
        transition: all 0.5s;

        #setWidth {
            position: relative;
            width: 100%;
            height: 100%;
            background-color: transparent;

            #navigation {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 6vh;
                font-size: 20px;
                margin-top: 15px;

                .web-common_style {
                    display: flex;
                    align-items: center;
                    background-color: white;
                    border-radius: 30px;
                    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
                }

                #web-name {
                    position: absolute;
                    left: 10px;
                    height: 100%;

                    img {
                        width: 5em;
                    }
                }

                #web-page {
                    justify-content: center;
                    width: 10%;
                    height: 100%;

                    span:hover {
                        transition: all 0.5s;
                        border-radius: 5px;
                        background-color: rgb(205, 208, 210);
                    }
                }

                #navigation-user {
                    position: absolute;
                    right: 20px;
                    width: 25%;
                    height: 100%;
                    overflow: hidden;

                    #navigation-user-avatar {
                        position: absolute;
                        left: 10px;
                        width: 2.5vw;
                        height: 5vh;
                        cursor: pointer;
                        background-color: white;

                        .example-showcase .el-dropdown-link,
                        #user_avatar {
                            cursor: pointer;
                            color: var(--el-color-primary);
                            display: flex;
                            align-items: center;
                            border-radius: 100%;
                        }

                    }

                }

                #not_login_in {
                    position: absolute;
                    right: 20px;
                    width: 40px;
                    height: 40px;
                    font-size: 16px;
                    border-radius: 100%;
                    line-height: 40px;
                    color: white;
                    text-align: center;
                    cursor: pointer;
                    background-color: rgb(0, 161, 214);
                }

                #Search_input {
                    position: absolute;
                    right: 100px;

                    .Search_option {
                        display: flex;
                        flex-direction: column;
                        position: absolute;
                        width: 100%;
                        background-color: white;
                        border-radius: 4px;
                        // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);

                        span {
                            width: 100%;
                            padding-left: 20px;
                            font-size: 14px;
                            margin-bottom: 10px;
                        }

                        span:hover {
                            background-color: rgb(205, 208, 210);
                            color: white;
                        }
                    }
                }
            }
        }
    }

    #container.scrolled {
        background-color: white;
    }

}


.link-hover {
    color: rgb(0, 161, 214);
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