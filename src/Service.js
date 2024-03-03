import axios from "axios";

import { ElNotification } from "element-plus";
const service = axios.create({
    baseURL: "/api",
    timeout: 5000,
})

// 添加请求拦截器

service.interceptors.request.use(function (config) {
    let token = localStorage.getItem("token")
    if (token) {
        config.headers.token = token //将token设置成请求头
    }
    return config;
}, function (error) {
    return Promise.reject(error);
})


// 错误处理函数
function handleError(error) {
    let message = '服务器失效';

    if (error.code === 'ECONNABORTED') {
        // 请求超时
        message = '请求超时';
    } else if (error.response) {
        // 请求已发送，但服务器响应的状态码在 2xx 之外
        if (error.response.status >= 500) {
            message = '服务器错误';
        } else if (error.response.status >= 400) {
            message = '请求错误';
        }
    } else if (error.request) {
        // 请求已发送，但没有收到响应
        message = '网络错误';
    } else {
        // 发送请求时出现错误
        message = '未知错误';
    }

    ElNotification({
        title: '提示',
        message: message,
        type: 'error',
    });

    return Promise.reject(error);
}

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    if (response.status >= 500) {
        return handleError(response);
    }

    return response;
}, handleError);

export default service