<script setup>
import { inject } from 'vue'
import router from '../../router';
//父组件拿值
const dialog = inject('dialog')
const username = inject('username')
const avatar = inject('userAvatar')

//退出登录函数
const exitAccount = () => {
    // 清空所有 localStorage 中的信息
    localStorage.clear()

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

</script>
<template>
    <div id="WebFunction">
        <el-drawer v-model="dialog" direction="rtl" size="20%">
            <template #header="{ titleId, titleClass }">
                <div :id="titleId" :class="titleClass">
                    <img @click="dialog = true" :src="avatar" alt="">
                    <span>{{ username }}</span>
                </div>
            </template>
            <!-- 分割线 -->
            <div style="height: 1px; background-color: #ebeef5; margin: 10px 0px;"></div>

            <div class="after_touch">
                <el-icon>
                    <User />
                </el-icon>
                <router-link active-class="link-hover" :to="'/personal'">个人中心</router-link>
            </div>

            <div class="after_touch" @click="notDefined">
                <el-icon>
                    <ChatSquare />
                </el-icon>
                <router-link active-class="link-hover" :to="'/message'">消息中心</router-link>
            </div>

            <div style="height: 1px; background-color: #ebeef5; margin: 10px 0px;"></div>

            <div class="after_touch">
                <el-icon>
                    <CirclePlus />
                </el-icon>
                <router-link active-class="link-hover" :to="'/writeArticle'">添加新帖</router-link>
            </div>

            <div class="after_touch" style="height: 1px; background-color: #ebeef5; margin: 10px 0px;"></div>

            <div class="after_touch" id="feedback">
                <el-icon>
                    <Message />
                </el-icon>
                <router-link active-class="link-hover" :to="'/feedback'">反馈</router-link>
            </div>

            <div class="after_touch" style="height: 1px; background-color: #ebeef5; margin: 10px 0px;"></div>

            <div class="after_touch" @click="exitAccount" id="exit-account">退出</div>
        </el-drawer>
    </div>
</template>
<style lang="less" scoped>
#WebFunction {
    .el-drawer.rtl {

        .el-drawer__header {
            height: 40px !important;
            margin-bottom: 0px !important;
            padding-top: 20px;

            .el-drawer__title {
                display: flex;
                align-items: center;
                height: 40px;

                img {
                    height: 100%;
                    margin-right: 20px;
                    border-radius: 100%;
                    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
                }

                span {
                    font-size: 16px;
                    color: black;
                }
            }
        }

        .el-drawer__body {
            display: flex;
            flex-direction: column;

            #exit-account {
                cursor: pointer;
            }

            #feedback {
                cursor: pointer;
            }

            .after_touch {
                display: flex;
                align-items: center;
                border-radius: 5px;

                .el-icon {
                    width: 20%;
                    margin-right: 10px;
                }

                a {
                    width: 80%;
                }
            }

            .after_touch:hover {
                background-color: #dfe3e8;
            }
        }
    }

    .link-hover {
        color: rgb(135, 200, 238);
    }

}
</style>