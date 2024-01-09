<script setup>
import { onMounted, provide, ref, inject, watch, computed } from 'vue'
import Login from '@/components/login/Login.vue';
import Register from '@/components/login/Register.vue';
import WebFunction from '@/components/navigation/WebFunction.vue';
import { checkToken, search } from '@/api/index.js'
import router from '../../router';
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue'
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


//控制抽屉的显示与隐藏
const dialog = ref(false)
//传给抽屉子组件
provide('dialog', dialog)
provide('username', username)
provide('userAvatar', userAvatar)


const UNAUTHORIZED = 401
onMounted(async () => {
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

//搜索功能
const search_content = ref('')
const is_show_article_name = ref(false)
const select_article_name = ref([])

const blogArray = inject('blogArray')



const search_article = async (value) => {
    is_show_article_name.value = true
    const result = await search(value)
    if (result.data.code === 1) {
        select_article_name.value = result.data.data.slice(0, 5)
    }
}
//帮我实现一个搜索功能,
const show_search_result = (value, index) => {
    if (value === '') {
        return
    }
    if (index === undefined) {
        blogArray.value = select_article_name.value
        console.log('blogArray.value:', blogArray.value);
        return
    }
    //以数组的形式传递
    blogArray.value = [select_article_name.value[index]]
}


</script>
<template>
    <div id="header">
        <div id="navigation">
            <div id="web-name"><img src="/img/logo.png" alt=""></div>
            <router-link active-class="link-hover" v-for="item in linkList" :to="item.link">{{ item.name }}</router-link>
            <img v-if="isLogin" @click="dialog = true" id="navigation-user-avatar" :src="userAvatar" alt="">
            <WebFunction />

            <div id="Search_input">
                <el-input @focus="is_show_article_name = true" @blur="is_show_article_name = true"
                    @input="search_article(search_content)" v-model="search_content" class="w-50 m-2" placeholder="点击搜索..."
                    :prefix-icon="Search" @keydown.enter="show_search_result(search_content)" />
                <div class="Search_option" v-if="is_show_article_name">
                    <span v-for="(item, index) in select_article_name" v-html="item.title"
                        @click="show_search_result('1', index)"></span>
                </div>
            </div>
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
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);

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