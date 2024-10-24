<script setup>
import { inject, nextTick, onMounted, reactive, ref } from 'vue'
import router from '../../router';
//父组件拿值
const username = inject('username')


//退出登录函数
const exitAccount = () => {
    // 清空所有 localStorage 中的信息
    localStorage.removeItem('baseInfo')
    localStorage.removeItem('token')

    // 在下一个 "tick" 中更新路由
    nextTick(() => {
        router.push('/')
    })

    ElMessage.success({ message: "退出登录成功！！" })
    // 强制刷新
    window.location.reload()
}


//未开发
const notDefined = () => {
    ElMessage.warning({ message: "该功能暂未开发！" })
    //3s后跳转
    setTimeout(() => {
        router.push("/")
    }, 3000);
}

const mediaData = reactive([
    { number: 0, type: "关注" },
    { number: 0, type: "粉丝" },
    { number: 0, type: "动态" }
])


onMounted(() => {
})

</script>
<template>
    <div id="WebFunction">
        <div class="user-base-info">
            <div id="user_name">{{ username }}</div>
        </div>
        <div class="media-data">
            <div class="media-show" v-for="(media, index) in mediaData">
                <p>{{ media.number }}</p>
                <p>{{ media.type }}</p>
            </div>
        </div>
        <div class="func-write">
            <router-link class="after_touch" active-class="link-hover" :to="'/personal'">
                <svg class="icon icon_special" aria-hidden="true">
                    <use xlink:href="#icon-gerenshezhi"></use>
                </svg>
                个人中心
            </router-link>
            <router-link class="after_touch" active-class="link-hover" :to="'/message'">
                <svg class="icon icon_special" aria-hidden="true">
                    <use xlink:href="#icon-dialog"></use>
                </svg>
                消息中心
            </router-link>
        </div>
        <div class="func-write">
            <router-link class="after_touch" active-class="link-hover" :to="'/writeArticle'">
                <svg class="icon icon_special" aria-hidden="true">
                    <use xlink:href="#icon-tianjia"></use>
                </svg>
                添加新帖
            </router-link>

            <router-link class="after_touch" active-class="link-hover" :to="'/feedback'">
                <svg class="icon icon_special" aria-hidden="true">
                    <use xlink:href="#icon-yijianfankui"></use>
                </svg>
                反馈
            </router-link>
            <div class="after_touch" style="text-align: right;" @click="exitAccount" id="exit-account">
                <svg class="icon icon_special" aria-hidden="true">
                    <use xlink:href="#icon--_tuichu"></use>
                </svg>
                退出
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
#WebFunction {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 0px 20px;
    background-color: rgb(242, 242, 248);
    z-index: 1;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 10px;

    .user-base-info {
        width: 100%;
        font-size: 24px;
        margin: 20px 0;
        text-align: center;

        #user_name {
            color: #409EFF;
        }
    }

    .media-data {
        display: flex;
        justify-content: space-around;
        width: 100%;
        margin-bottom: 10px;

        .media-show {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex: 1;
            background-color: white;
            border-radius: 5px;
            font-size: 16px;
            padding: 10px 0;
            transition: all 0.5s;
            cursor: pointer;
        }

        .media-show:hover {
            background-color: #dfe3e8;
        }

        .media-show:nth-child(2) {
            margin: 0 10px;
            /* 中间元素左右各隔开 10px */
        }
    }

    .func-write {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        width: 100%;
        margin-bottom: 10px;
        padding: 10px 10px;
        border-radius: 5px;
        background-color: white;

        .after_touch {
            display: flex;
            align-items: center;
            width: 100%;
            height: 100%;
            font-size: 16px;
            background-color: rgb(242, 242, 248);
            padding-left: 20px;
            border-radius: 5px;
            background-color: white;
            transition: all 0.5s;
            cursor: pointer;
        }

        .after_touch:hover {
            background-color: #dfe3e8;
        }

    }

    .link-hover {
        color: rgb(135, 200, 238);
    }

    #exit-account {
        text-align: right;
        cursor: pointer;
    }

    .icon_special {
        width: 1.5em;
        height: 1.5em;
        margin-right: 10px;
    }

}
</style>