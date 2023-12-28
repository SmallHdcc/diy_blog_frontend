<script setup>
import { onMounted, provide, ref } from 'vue'
import Login from '@/components/login/Login.vue';
import router from '@/router';
const linkList = ref([
    {
        name: '社区',
        link: "/",
    },
    {
        name: "个人",
        link: "/personal"
    },
    {
        name: "反馈",
        link: "/feedback"
    },
    {
        name: "添加新帖",
        link: "/writeArticle"
    }
])

const ShowUserInfo = ref(false)
//控制头像显示框的隐藏和重现
const handleUserInfoEnter = () => {
    const navigationUserAvatar = document.getElementById('navigation-user-avatar')
    navigationUserAvatar.style.transform = 'translateY(30px) scale(2)'
    ShowUserInfo.value = true
}

const handleUserInfoOut = () => {
    const navigationUserAvatar = document.getElementById('navigation-user-avatar')
    navigationUserAvatar.style.transform = 'none'
    ShowUserInfo.value = false

}

const dialogVisable = ref(false)
provide('dialogVisable', dialogVisable)
//这里检测是否登录
const isLogin = ref(false)
const userAvatar = ref()
onMounted(() => {
    if (localStorage.getItem('baseInfo')) {
        userAvatar.value = JSON.parse(localStorage.getItem('baseInfo')).avatar
        isLogin.value = true
    }
})

const exitAccount = () => {
    localStorage.removeItem('baseInfo')
    localStorage.removeItem('token')

    ElMessage.success({ message: "退出登录成功！！" })
    //强制刷新
    window.location.reload()

}

</script>
<template>
    <div id="header">
        <div id="navigation">
            <div id="web-name"><img src="/img/logo.png" alt=""></div>
            <router-link v-for="item in linkList" :to="item.link">{{ item.name }}</router-link>
            <div v-if="isLogin" id="navigation-user" @mouseover="handleUserInfoEnter" @mouseout="handleUserInfoOut">
                <img id="navigation-user-avatar" :src="userAvatar" alt="">
                <transition name="fade">
                    <div v-show="ShowUserInfo" id="navigation-user-info">
                        <div id="navigation-user-info-message">
                            <div class="message-media">
                                <div class="flexColunmCenter"><span>粉丝</span>66</div>
                                <div class="flexColunmCenter"><span>关注</span>66</div>
                            </div>
                            <div class="message-tips">
                                <span>消息中心</span>
                                <div class="message-tips-icon">6</div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <div @click="dialogVisable = true" v-if="!isLogin" id="not_login_in">登录</div>

            <div @click="exitAccount" id="exit-account">退出</div>
        </div>
        <Login v-if="dialogVisable" />
    </div>
</template>
<style lang="less" scoped>
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
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 50px;
        background-color: white;
        font-size: 20px;
        box-shadow: 0px 5px 0px 0px rgba(0, 0, 0, 0.1);
        z-index: 99;

        a {
            margin: 0px 20px;
        }

        a:hover {
            color: black;
        }

        #web-name {
            display: flex;
            align-items: center;
            position: absolute;
            left: 10px;

            img {
                width: 100px;
            }
        }

        #navigation-user {
            position: relative;
            width: 40px;
            height: 40px;
            border-radius: 100%;

            #navigation-user-avatar {
                width: 100%;
                height: 100%;
                border-radius: 100%;
                transition: all 0.5s;
            }

            #navigation-user-info {
                // visibility: hidden;
                // opacity: 0;
                position: absolute;
                left: -100px;
                width: 250px;
                height: 300px;
                box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
                background-color: white;
                border-radius: 4px;
                z-index: -1;

                #navigation-user-info-message {
                    width: 100%;
                    margin-top: 45px;

                    .message-media {
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        width: 100%;
                        height: 100%;
                    }

                    .message-tips {
                        display: flex;
                        justify-content: center;
                        width: 100%;
                        text-align: center;
                        cursor: pointer;

                        .message-tips-icon {
                            width: 20px;
                            height: 20px;
                            background-color: red;
                            border-radius: 100%;
                            color: white;
                            font-size: 14px;
                            line-height: 20px;
                        }
                    }
                }
            }

        }

        #not_login_in {
            width: 40px;
            height: 40px;
            font-size: 16px;
            border-radius: 100%;
            line-height: 40px;
            color: rgb(135, 200, 238);
            cursor: pointer;
        }

        #exit-account {
            position: absolute;
            right: 10px;
            cursor: pointer;
        }
    }
}

.flexColunmCenter {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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