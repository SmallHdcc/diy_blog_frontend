<script setup>
import { ref } from 'vue'

const feedbackInfo = ref('')

const feedback = () => {
    if (feedbackInfo.value.length < 10) {
        ElMessage.error("反馈内容太短！")
        return
    }
    ElMessage.success("感谢您的反馈！")
}


</script>

<template>
    <div id="FeedBack">
        <h1>写下你的意见！</h1>
        <div id="feed-back-content">
            <textarea v-model="feedbackInfo" name="" id="" cols="30" rows="10"></textarea>
        </div>
        <el-button @click="feedback" type="primary">提交</el-button>

    </div>
</template>

<style lang="less" scoped>
@import '../../assets/font/font.css';

#FeedBack {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100vw;
    height: 100vh;

    #feed-back-content {
        textarea {
            width: 600px;
            height: 400px;
            font-family: xiawu;
        }
    }

}
</style>