<script setup>
import { ref, reactive, inject } from 'vue'
import router from '@/router';
import { ElMessage } from 'element-plus'
import { register, checkUsername, checkEmail, sendEmail } from '@/api'
import _ from 'lodash';
const ruleFormRef = ref()

const ruleForm = reactive({
    username: '',
    password: '',
    repassword: '',
    email: '',
    captcha: ''
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
const usernameCheck = async (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入用户名'))
    } else if (value.length < 4 || value.length > 10) {
        callback(new Error('用户名太短或太长'))
    }
    let isUsed = await usernameCheck2(value)
    if (!isUsed) {
        return callback(new Error('用户名已被注册'))
    }
    callback()
    // todo: check the format
}

const usernameCheck2 = _.throttle(async (username) => {
    const result = await checkUsername(username)
    if (result.data.code != 1) {
        return false;
    }
    return true
}, 1000)

const repasswordCheck = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码！'))
    } else if (value != ruleForm.password) {
        callback(new Error('两次密码不一致,请重新输入'))
    }
    callback()
    // todo: check the format
}

const emailCheck = async (rule, value, callback) => {
    let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
    if (value === '') {
        callback(new Error('请输入邮箱！'))
    } else if (!reg.test(value)) {
        callback(new Error('邮箱格式不正确'))
    }
    let isUsed = await emailCheck2(value)
    if (!isUsed) {
        return callback(new Error('邮箱已被注册'))
    }
    callback()
}
//检查邮箱是否可用
const emailCheck2 = _.throttle(async (email) => {
    const result = await checkEmail(email)
    if (result.data.code != 1) {
        return false;
    }
    return true
}, 1000)


const rules = reactive({
    username: [{ required: true, validator: usernameCheck, trigger: 'blur' }],
    password: [{ required: true, validator: passwordCheck, trigger: 'blur' }],
    repassword: [{ required: true, validator: repasswordCheck, trigger: 'blur' }],
    email: [{ required: true, validator: emailCheck, trigger: 'blur' }],
    captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})

const dialogVisible = inject('dialogVisable')
const isLogin = inject('isLogin')

//submit 
const submitFormRegister = (formEl) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            const result = await register(ruleForm)
            console.log(result.data)
            if (result.data.code === 1) {
                ElMessage.success("注册成功！")
                //ruleForm所有属性置空
                for (let key in ruleForm) {
                    ruleForm[key] = ''
                }
                isHaveAccount.value = !isHaveAccount.value
            }
        } else {
            ElMessage.error("注册失败！")
            return false
        }
    })
}


const send_email = async email => {
    if (email === '') {
        ElMessage.error('请先输入邮箱！')
        return
    }
    const result = await sendEmail(email)
    if (result.data.code === 1) {
        ElMessage.success(result.data.data)
    }
}

// 监听键盘按下事件
document.addEventListener('keydown', function (event) {
    if (isHaveAccount.value) {
        return
    }
    // 监听键盘按下事件
    if (event.key === 'Enter') {
        // 回车键被按下
        submitFormRegister(ruleFormRef.value);
    }
})

//展示注册页面
const isHaveAccount = inject('isHaveAccount')
const showRegister = () => {
    isHaveAccount.value = !isHaveAccount.value
}


</script>
<template>
    <div id="Register">
        <el-dialog title="注 册" :style="{ height: '500px' }" v-model="dialogVisible" center draggable>
            <div class="head-info" style="letter-spacing: 10px;">
                <img src="/img/logo.png" alt="">
            </div>
            <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px"
                class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="ruleForm.username" @input="usernameCheck2(ruleForm.username)" autocomplete="off" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
                </el-form-item>
                <el-form-item label="重复密码" prop="repassword">
                    <el-input v-model="ruleForm.repassword" type="password" autocomplete="off" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="ruleForm.email" @input="emailCheck2(ruleForm.email)" type="pasword"
                        autocomplete="off" />
                </el-form-item>
                <el-form-item style="display: flex;justify-content: space-between;" label="验证码" prop="captcha">
                    <el-input style="width: 200px;margin-right: 20px;" v-model="ruleForm.captcha" type="pasword"
                        autocomplete="off" />
                    <el-button @click="send_email(ruleForm.email)">点击获取</el-button>
                </el-form-item>
                <el-form-item>
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <p style="display: block;">已经有账号？<router-link @click="showRegister()" :to="'#'"
                                style="color: #606266;">登录</router-link></p>
                        <p>请牢记账号密码,暂不支持找回</p>
                    </div>
                </el-form-item>
                <el-form-item>
                    <button class="register-button" style="" ref="loginButton" type="button"
                        @click="submitFormRegister(ruleFormRef)">注册</button>
                </el-form-item>

            </el-form>
        </el-dialog>
    </div>
</template>
<style lang="less" scoped>
#Register {
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
            width: 70%;

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

            .register-button {
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

  