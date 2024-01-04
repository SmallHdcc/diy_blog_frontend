<script setup>
import { onMounted, provide, ref, nextTick, watch } from 'vue'
import Login from '@/components/login/Login.vue';
import Register from '@/components/login/Register.vue';
import WebFunction from '@/components/navigation/WebFunction.vue';
import { checkToken } from '@/api/index.js'
import router from '../../router';

//设置常量
const BASE_INFO_KEY = 'baseInfo'

const getBaseInfo = () => {
    const baseInfo = localStorage.getItem(BASE_INFO_KEY);
    return baseInfo ? JSON.parse(baseInfo) : null;
}

const linkList = ref([
    {
        name: '社区',
        link: "/",
    },
])

const ShowUserInfo = ref(false)

//父子组件共同控制登录框的显示与隐藏
const dialogVisable = ref(false)
provide('dialogVisable', dialogVisable)
//这里检测是否登录
const isLogin = ref(false)
provide('isLogin', isLogin)
const userAvatar = ref()

//监视登录状态
watch(isLogin, () => {
    if (isLogin.value == true) {
        if (getBaseInfo() != null)
            userAvatar.value = getBaseInfo().avatar
        else
            isLogin.value = false
    }
})


//根据状态展示注册或者是登录窗口
const isHaveAccount = ref(true)
provide('isHaveAccount', isHaveAccount)

onMounted(async () => {
    const result = await checkToken()
    if (result.data.code == 401) {
        //过期显示登录按钮
        isLogin.value = false
    } else {
        const baseInfo = getBaseInfo()
        userAvatar.value = baseInfo ? baseInfo.avatar : null
        isLogin.value = true
    }
})
//控制抽屉的显示与隐藏
const dialog = ref(false)
provide('username', getBaseInfo() ? getBaseInfo().username : null)
provide('userAvatar', getBaseInfo() ? getBaseInfo().avatar : null)
provide('dialog', dialog)




</script>
<template>
    <div id="header">
        <div id="navigation">
            <div id="web-name"><img src="/img/logo.png" alt=""></div>
            <router-link active-class="link-hover" v-for="item in linkList" :to="item.link">{{ item.name }}</router-link>
            <img v-if="isLogin" @click="dialog = true" id="navigation-user-avatar" :src="userAvatar" alt="">
            <WebFunction />

            <div @click="dialogVisable = true" v-if="!isLogin" id="not_login_in">登录</div>
        </div>
        <Login v-show="isHaveAccount" />
        <Register v-show="!isHaveAccount" />
    </div>
</template>
<style lang="less" scoped>
#header {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 50px;
    overflow: hidden;

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

        #navigation-user-avatar {
            position: absolute;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 100%;
            transition: all 0.5s;
            cursor: pointer;
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
            position: absolute;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 100%;
        }

        #not_login_in {
            position: absolute;
            right: 20px;
            width: 40px;
            height: 40px;
            font-size: 16px;
            border-radius: 100%;
            line-height: 40px;
            color: rgb(135, 200, 238);
            cursor: pointer;
        }

    }

}


.link-hover {
    color: rgb(135, 200, 238);
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