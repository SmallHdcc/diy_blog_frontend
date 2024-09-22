<script setup>
import { ref } from 'vue'
import { submitFeedback } from '@/api/feedback.js';

const feedbackInfo = ref({
    content: "",
    type: "页面太丑了"
})

const feedback = async () => {
    if (feedbackInfo.value.content.length < 10) {
        ElMessage.error("反馈内容太短！")
        return
    }
    const result = await submitFeedback(feedbackInfo.value)
    if (result.data.code === 1) {
        feedbackInfo.value.content = ""
        ElMessage.success("感谢您的反馈！")
    } else {
        ElMessage.error("反馈失败！")
    }
}


</script>

<template>
    <div id="FeedBack">
        <!-- <navigation /> -->
        <h1>写下你的意见！</h1>
        <div id="feed-back-content">
            <textarea v-model="feedbackInfo.content" name="" id="" cols="30" rows="10"></textarea>
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
    height: 94vh;

    #feed-back-content {
        textarea {
            width: 600px;
            height: 400px;
            font-family: xiawu;
        }
    }

}
</style>
