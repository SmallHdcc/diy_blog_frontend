<script setup>
import { ref, reactive, inject } from 'vue'
import router from '@/router';
import { ElMessage } from 'element-plus'
import { login } from '@/api'
const ruleFormRef = ref()

const ruleForm = reactive({
    username: '',
    password: '',
})

// Here is a custom check for the password
const passwordCheck = (rule, value, callback) => {
    let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

    if (value === '') {
        callback(new Error('请输入密码！'))
    } else if (!reg.test(value)) {
        callback(new Error('密码必须包含大小写字母和数字'))
        // the password should include uppercase and lowercase letters and numbers
    }
    callback()
}
const usernameCheck = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入用户名'))
    } else if (value.length < 4 || value.length > 10) {
        callback(new Error('用户名太短或太长'))
    }
    callback()
    // todo: check the format
}

const rules = reactive({
    username: [{ validator: usernameCheck, trigger: 'blur' }],
    password: [{ validator: passwordCheck, trigger: 'blur' }]
})

//根据时间显示不同的欢迎信息
const WelcomeMessageBox = new Map()
WelcomeMessageBox.set(0, "早上好！新的一天开始了，让我们充满活力地迎接挑战吧！")
WelcomeMessageBox.set(1, "中午好，休息一下，为下午的工作充电！")
WelcomeMessageBox.set(2, "下午好！希望你的下午充满活力和创造力！")
WelcomeMessageBox.set(3, "晚上好,在安静的夜晚一起进步吧！")
const WelcomeMessageInfo = ref()
const WelcomeUser = (username) => {
    const hour = new Date().getHours();
    if (hour < 12) {
        WelcomeMessageInfo.value = WelcomeMessageBox.get(0)
    } else if (hour < 14) {
        WelcomeMessageInfo.value = WelcomeMessageBox.get(1)
    } else if (hour < 18) {
        WelcomeMessageInfo.value = WelcomeMessageBox.get(2)
    } else {
        WelcomeMessageInfo.value = WelcomeMessageBox.get(3)
    }
    ElNotification({
        title: '欢迎您 ' + username,
        message: WelcomeMessageInfo.value,
        type: 'success',
    })
}

const dialogVisible = inject('dialogVisable')
const isLogin = inject('isLogin')

//submit 
const submitForm = (formEl) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            const result = await login(ruleForm)
            if (result.data.code === 1) {
                //将获取的信息存储到localStorage中
                localStorage.setItem("baseInfo", JSON.stringify(result.data.data))
                localStorage.setItem("token", result.data.data.token)
                dialogVisible.value = false
                isLogin.value = true
                router.push("/")
                WelcomeUser(result.data.data.username)
            } else {
                ElMessage.error(result.data.msg)
            }

        } else {
            ElMessage.error("登录无效！")
            return false
        }
    })
}
// 监听键盘按下事件
// document.addEventListener('keydown', function (event) {
//     if (!isHaveAccount.value) {
//         return
//     }
//     // 监听键盘按下事件
//     if (event.key === 'Enter') {
//         // 回车键被按下
//         submitForm(ruleFormRef.value);
//     }
// })

const isHaveAccount = inject('isHaveAccount')
//展示注册页面
const showRegister = () => {
    isHaveAccount.value = !isHaveAccount.value
}

</script>
<template>
    <div id="login">
        <el-dialog title="登 录" :style="{ height: '400px' }" v-model="dialogVisible" center draggable>
            <div class="head-info" style="letter-spacing: 10px;">
                <img src="/img/logo.png" alt="">
            </div>
            <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px"
                class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="ruleForm.username" autocomplete="off" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
                </el-form-item>
                <el-form-item>
                    <p>还没有账号？<router-link @click="showRegister()" :to="'#'" style="color: #606266;">注册</router-link></p>
                </el-form-item>
                <el-form-item>
                    <button class="login-button" style="" ref="loginButton" type="button"
                        @keydown.enter="submitForm(ruleFormRef)" @click="submitForm(ruleFormRef)">登录</button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<style lang="less" scoped>
#login {
    position: absolute;
    width: 100%;
    overflow-x: hidden;

    .el-dialog {
        display: flex;
        flex-direction: column;
        align-items: center;

        .demo-ruleForm {
            margin: auto;

        }

        .head-info {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;

            img {
                width: 150px;
            }
        }

        .el-form {
            width: 60%;

            .el-input {
                width: 400px;
            }

            :deep(.el-form-item__label) {
                width: 80px !important;
                padding: 0px 10px 0px 0px;
            }

            :deep(.el-form-item__content) {
                display: flex;
                justify-content: center;
                margin: 0px !important;
                width: 100%;
            }

            .login-button {
                width: 30%;
                height: 32px;
                background-color: #409EFF;
                color: white;
                outline: none;
                border: none;
                border-radius: 3px;
                font-size: 18px;
                letter-spacing: 5px;
                cursor: pointer;
            }
        }


    }

}
</style>  

  