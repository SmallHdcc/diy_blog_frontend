<script lang="ts" setup>
import { reactive, ref, nextTick, onMounted, watch } from 'vue'
import { uploadArticle, uploadCover } from "@/api"
import textEditor from '../../components/text/textEditor.vue';
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
    console.log('submit!')
    console.log(form.content.trim().length)
    if (form.day !== null && form.date !== null) {
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
    }
    ElMessage.error({ message: "时间和内容均不能为空，不然你发布个啥?" })
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
        form.tags.push(inputValue.value)
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
        <navigation />
        <div id="container">
            <h1 id="header-line">写下今天的Blog</h1>
            <el-form :rules="rules" :model="form" label-width="120px" ref="ruleFormRef">
                <el-form-item label="标题">
                    <el-input v-model="form.title" />
                </el-form-item>
                <el-form-item label="时间" prop="day">
                    <el-col :span="11">
                        <el-date-picker v-model="form.day" type="date" placeholder="日期" style="width: 100%" />
                    </el-col>
                    <el-col :span="2" class="text-center">
                        <span class="text-gray-500">-</span>
                    </el-col>
                    <el-col :span="11">
                        <el-time-picker v-model="form.date" placeholder="时间" style="width: 100%" />
                    </el-col>
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
                        <textEditor ref="contents" />
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
    // justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100%;
    // overflow-x: hidden;

    #navigation {
        position: absolute;
        top: 0px;
    }

    #header-line {
        width: 100%;
        text-align: center;
        margin-bottom: 10px;
    }

    #container {
        width: 1000px;
        height: 80%;
        margin-top: 50px;

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
