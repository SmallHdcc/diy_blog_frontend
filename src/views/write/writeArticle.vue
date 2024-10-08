<script lang="ts" setup>
import { reactive, ref, nextTick, onMounted, watch } from 'vue'
import { uploadArticle, uploadCover } from "@/api/blog.js"
import textEditor from '../../components/article/editorArticle.vue';
import { ElMessage } from 'element-plus'
import router from '../../router';


// do not use same name with ref

const ruleFormRef = ref()

const form = reactive({
    userId: '',
    title: '',
    day: null,
    date: null,
    image: '',
    tags: ["日常"],
    content: '',
    profile: ''
})

let errorClickNumber = ref(0)
const onSubmit = async () => {
    // set content
    form.content = localStorage.getItem("content") || ''
    if (form.content != null && form.content.trim() != '') {
        //set userId
        form.userId = JSON.parse(localStorage.getItem("baseInfo") || '').id

        const result = await uploadArticle(form)
        if (result.data.code == 1) {
            ElMessage.success({ message: "发布成功" })
            router.push("/personal")
            return
        }
    } else {
        if (errorClickNumber.value > 5) {
            router.push("/sb")
        }
        if (errorClickNumber.value == 5) {
            ElMessage.error({ message: "再乱点封号！！！" })
        }
        errorClickNumber.value++
        console.log(errorClickNumber.value)
        ElMessage.error({ message: "抖机灵？" })
        return
    }
    ElMessage.error({ message: "内容不能为空！！！" })
}

const resetForm = (formEl: any) => {
    if (!formEl) return
    formEl.resetFields()
}


// 标签相关配置
const inputValue = ref('')
const dynamicTags = ref(['标签 1', '标签 2', '标签 3'])
const inputVisible = ref(false)
const InputRef = ref()

const handleClose = (tag: any) => {
    form.tags.splice(form.tags.indexOf(tag), 1)
}

const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value!.input!.focus()
    })
}

const handleInputConfirm = () => {
    if (inputValue.value) {
        if (form.tags.length < 3)
            form.tags.push(inputValue.value)
        else
            ElMessage.error({ showClose: true, message: '最多只能添加3个标签' })
    }
    inputVisible.value = false
    inputValue.value = ''
}
// 封面相关内容
const imageUrl = ref('')
// : UploadProps['onSuccess'] 
const handleAvatarSuccess = async (
    response: any,
    uploadFile: any
) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
    console.log(response)
}



const beforeAvatarUpload = async (rawFile: any) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('封面必须是jpg/png格式!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('封面大小不能超过2MB!')
        return false
    }
    const result = await uploadCover(rawFile)
    console.log(result.data)
    imageUrl.value = result.data.data
    form.image = result.data.data
    return true
}
// 时间校验
const validateTime = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请选择时间'))
    }
    callback()

}

const rules = reactive({
    day: [{ validator: validateTime, trigger: 'blur' }],

})

onMounted(() => {
})



</script>

<template>
    <div id="writeArticle">
        <div id="container">
            <h1 id="header-line">写下今天的Blog</h1>
            <el-form :rules="rules" :model="form" label-width="120px" ref="ruleFormRef">
                <el-form-item label="标题">
                    <el-input v-model="form.title" />
                </el-form-item>
                <el-form-item label="类型">
                    <el-tag v-for="tag in form.tags" :key="tag" class="mx-1" closable :disable-transitions="false"
                        @close="handleClose(tag)">
                        {{ tag }}
                    </el-tag>
                    <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="ml-1 w-20" size="small"
                        @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
                    <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
                        + 新标签
                    </el-button>
                </el-form-item>
                <el-form-item label="封面">
                    <el-upload class="avatar-uploader" :show-file-list="false" :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="内容">
                    <keep-alive>
                        <textEditor ref="contents" style="resize: none;" />
                    </keep-alive>
                </el-form-item>
                <el-form-item label="简介">
                    <el-input v-model="form.profile" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">发布</el-button>
                    <el-button @click="resetForm(ruleFormRef)">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style lang="less" scoped>
#writeArticle {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 94vh;

    #container {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        width: 1000px;
        margin-top: 50px;
        background-color: white;
        padding: 20px;

        #header-line {
            width: 100%;
            text-align: center;
            margin-bottom: 10px;
            background-color: white;
            overflow: hidden;
        }

        .mx-1 {
            margin-right: 10px;
        }
    }

    .avatar-uploader .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

}
</style>