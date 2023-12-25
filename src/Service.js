import axios from "axios";
// import { getToken } from "./utils/Token";
import { ElMessage } from "element-plus";
const service = axios.create({
    baseURL: "/api",
    timeout: 50000,
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
});


// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // let res = response.data

    if (response.code >= 500) {
        console.log(response)
        ElMessage.error({ message: "服务器失效,请耐心等待..." })
        return Promise.reject(response.msg)
    }

    return response;
}, function (error) {

    return Promise.reject(error);
});

export default service