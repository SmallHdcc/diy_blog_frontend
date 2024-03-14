import service from '../Service.js'
import md5 from 'js-md5'


//登录接口
export function login(originalData) {
    const data = {
        ...originalData,
        password: md5(originalData.password)
    }
    return service({
        method: 'POST',
        url: '/user/login',
        data
    })
}
//注册接口
export function register(originalData) {
    const data = {
        ...originalData,
        password: md5(originalData.password)
    }
    return service({
        method: 'PUT',
        url: '/user/register',
        data
    })
}
//检查用户名是否已经注册
export function checkUsername(username) {
    return service({
        method: 'GET',
        url: `/user/checkUsername?username=${username}`
    })
}


//检查邮箱是否已经注册
export function checkEmail(email) {
    return service({
        method: 'GET',
        url: `/user/checkEmail?email=${email}`
    })
}
//发送邮件
export function sendEmail(email) {
    return service({
        method: 'GET',
        url: `/user/sendEmail?email=${email}`
    })
}

// 签名修改
export function changeSign(signature, userId) {
    return service({
        method: "PUT",
        url: `/user/signature?signature=${signature}&userId=${userId}`,
    })
}

// 头像上传
export function uploadAvatar(data) {
    return service({
        method: "PUT",
        url: "/user/avatar",
        data
    })
}


//搜索功能
export function search(keyword) {
    return service({
        method: "GET",
        url: `/article/search?keyword=${keyword}`,
    })
}

//检查token是否有效
export function checkToken() {
    return service({
        method: "GET",
        url: `/common/checkToken`,
    })
}








