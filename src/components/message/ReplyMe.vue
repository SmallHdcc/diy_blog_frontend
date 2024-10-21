<script setup>
import { ref, onMounted } from 'vue'
import { getReplyMessage } from '@/api/message';
import { ElMessage } from 'element-plus';

const USER_ID = JSON.parse(localStorage.getItem('baseInfo')).id
const message = ref([])

const fetchReplyMessages = async () => {
    const result = await getReplyMessage(USER_ID)
    if (result.data.code === 1) {
        message.value = result.data.data
        message.value.forEach(item => {
            item.delBtn = false
        })
    } else {
        ElMessage.error('获取消息失败！')
    }
}


/* 有关删除按钮的删除和重现 */
const showDelBtn = (index) => {
    message.value[index].delBtn = true
}
const hideDelBtn = (index) => {
    message.value[index].delBtn = false
}



onMounted(() => {
    fetchReplyMessages()
})


</script>
<template>
    <div id="ReplyMe">
        <div class="content" v-for="(item, key) in message" @mouseover="showDelBtn(key)" @mouseleave="hideDelBtn(key)">
            <div class="content-userAvatar"><img :src="item.senderAvatar" alt=""></div>
            <div class="content-mainInfo">
                <div class="mainInfo-top">
                    <div class="top-left">
                        <div class="username">{{ item.sender }}&nbsp;<span>{{ item.type }}</span></div>
                        <div class="comment-detail">{{ item.message }}</div>
                    </div>
                </div>
                <div class="mainInfo-bottom">
                    <div class="mb-info">
                        <span class="time">{{ item.time }}</span>
                        <div class="mb-del-btn" v-show="item.delBtn" @click="handleDelete" style="margin-left: 20px;">
                            <el-icon>
                                <Delete />
                            </el-icon>
                            <span>删除该通知</span>
                        </div>
                    </div>
                    <el-divider></el-divider>
                </div>
            </div>
            <div class="content-relatedPostCover"><img src="" alt=""></div>

        </div>
    </div>
</template>

<style lang="less" scoped>
#ReplyMe {
    width: 100%;
    height: 100%;

    .content {
        display: flex;
        align-items: center;
        height: 130px;

        .content-userAvatar {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 10%;
            height: 100%;

            img {
                width: 60px;
                height: 60px;
                border-radius: 100%;
            }
        }

        .content-mainInfo {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            width: 600px;
            height: 100%;

            .mainInfo-top {
                display: flex;
                justify-content: space-between;
                width: 100%;
                height: 70%;

            }

            .mainInfo-bottom {
                display: flex;
                flex-direction: column;
                justify-content: center;
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 30%;

                .mb-info {
                    display: flex;

                    .mb-del-btn {
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        color: grey;
                    }
                }

                .el-divider {
                    margin-top: 10px;
                }
            }

        }

        .content-relatedPostCover {
            width: 100px;
            height: 100px;
        }
    }
}
</style>
