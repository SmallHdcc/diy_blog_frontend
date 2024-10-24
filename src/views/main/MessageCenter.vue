<script setup>
import { ref } from 'vue'
const message_type = ref(
    [
        {
            message_title: '系统消息',
            link: '/message/sys'
        },
        {
            message_title: '回复我的',
            link: '/message/reply'
        },
        {
            message_title: '点赞我的',
            link: '/message/like'
        },
        {
            message_title: '关注我的',
            link: '/message/follow'
        }
    ]
)

</script>
<template>
    <div id="MessageCenter">
        <div style="width: 100%;height: 100%;">
            <el-scrollbar height="100vh">
                <div id="container">
                    <div class="left-message-navigation">
                        <div class="left-message-navigation-head">
                            <el-icon style="margin-right: 10px;" size="25px">
                                <Position />
                            </el-icon>
                            <h2>消息中心</h2>
                        </div>
                        <ul class="left-message-navigation-list">
                            <li v-for="(item, key) in message_type" :key="key">
                                <router-link :to="item.link" active-class="link-hover">
                                    {{ item.message_title }}
                                </router-link>
                            </li>
                        </ul>
                    </div>
                    <div class="right-message-content">
                        <div class="title">标头</div>
                        <router-view></router-view>
                    </div>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>
<style lang="less">
#MessageCenter {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100vh;

    #container {
        display: flex;
        justify-content: space-around;
        width: 70%;
        height: 100%;
        background-color: white;
        margin: 65px auto;

        .left-message-navigation {
            display: flex;
            flex-direction: column;
            width: 20%;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

            .left-message-navigation-head {
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: center;
                height: 20%;
            }

            .left-message-navigation-list {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: center;
                padding: 0;
                width: 100%;
                height: 50%;
                font-size: 20px;
                color: rgb(161, 163, 165);

                li {
                    width: 100%;
                    list-style: inside;
                    cursor: pointer;
                    text-align: center;
                    transition: all 0.2s;
                }

                li:hover {
                    color: rgb(135, 200, 238);
                }
            }
        }

        .right-message-content {
            width: 75%;

            .title {
                width: 100%;
                height: 50px;
                margin: 10px 0;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                line-height: 50px;
            }
        }
    }
}
</style>
