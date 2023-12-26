<script setup>
import { reactive, ref, onMounted } from 'vue'
import router from '@/router';
import { ElMessage } from 'element-plus'
import { login } from '../api'
import WOW from 'wow.js'


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
                router.push("/personal")
            }

        } else {
            ElMessage.error("登录无效！")
            return false
        }
    })
}


// about wow.js
const wow = new WOW({
    boxClass: 'wow',            //动画元素的CSS类(默认为wow)
    animateClass: 'animated',   // CSS类(默认为animation)
    offset: 0,                  //触发动画时到元素的距离(默认为0)
    mobile: true,               //在移动设备上触发动画(默认为true)
    live: true,                 //异步加载内容(默认为true)
    callback: function (box) {
        //每次动画开始时触发回调
        //传入的参数是正在动画的DOM节点
    },
    scrollContainer: null,      //可选滚动容器选择器，否则使用window
})

const loginButton = ref(null)

// 监听键盘按下事件
document.addEventListener('keydown', function (event) {
    // 监听键盘按下事件
    if (event.key === 'Enter') {
        // 回车键被按下
        submitForm(ruleFormRef.value);
    }
})


onMounted(async () => {
    wow.init()
})

</script>

<template>
    <div id="login-page">
        <div class="container">
            <div id="login" class="wow bounceInRight">
                <div class="head-info" style="margin: 50px; letter-spacing: 10px;">
                    <img src="/img/logo.png" alt="">
                    <h1>登录</h1>
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
                        <button class="login-button" style="" ref="loginButton" type="button"
                            @keydown.enter="submitForm(ruleFormRef)" @click="submitForm(ruleFormRef)">登录</button>
                        <!-- <el-button @click="resetForm(ruleFormRef)">重置</el-button> -->
                    </el-form-item>
                </el-form>
                <div>
                    <p>什么,你还没有注册?</p>
                    <a href="">注册账号</a>
                </div>

            </div>

        </div>
    </div>
</template>

<style lang="less" scoped>
#login-page {
    width: 100vw;
    height: 100vh;

    .container {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
        // background-image: url(/img/loginBGI.jpg);
        background-size: 100%;

        #login {
            position: relative;
            top: 150px;
            display: flex;
            align-items: center;
            flex-direction: column;
            width: 600px;
            height: 500px;
            background-color: rgba(255, 255, 255, 0.5);
            border-radius: 5%;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);

            .head-info {
                h1 {
                    text-align: center;
                }

                img {
                    width: 200px;
                }
            }


            .el-form {
                .el-input {
                    width: 400px;
                }

                :deep(.el-form-item__label) {
                    width: 80px !important;
                }

                :deep(.el-form-item__content) {
                    display: flex;
                    justify-content: center;
                    margin: 0px !important;
                    width: 100%;
                }
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