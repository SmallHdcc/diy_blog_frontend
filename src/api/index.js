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


// 博客文章上传
export function uploadArticle(data) {
    console.log(data)
    return service({
        method: 'POST',
        url: "/article/upload",
        data
    })


}
//文章封面上传
export function uploadCover(data) {
    const formData = new FormData();
    formData.append('file', data)

    return service({
        method: 'POST',
        url: "/common/upload",
        headers: {
            'Content-Type': 'multipart/form-data' // 设置请求头为multipart/form-data  
        },
        data: formData

    })

}
// 获取所有博客
export function getBlogs(userId) {
    return service({
        method: "GET",
        url: `/article?userId=${userId}`
    })
}



// 获取单个博客的详情页面
export function getSingleBlogDetail(id, userId, sign) {
    let query = `id=${id}&userId=${userId}&sign=${sign}`
    return service({
        method: "GET",
        url: `/article/detail?${query}`
    })
}

// 删除单个博客
export function deleteSingleBlog(id, userId) {
    return service({
        method: "DELETE",
        url: `/article?id=${id}&userId=${userId}`,
    })
}

// 以下是与评论相关的接口

// 上传评论
export function uploadComment(data) {
    return service({
        method: "POST",
        url: "/comment/upload",
        data
    })
}

// 获得特定文章的所有评论
export function getComments(id, userId) {
    return service({
        method: "GET",
        url: `/comment?articleId=${id}&userId=${userId}`,
    })
}

// 点赞评论
export function likeTheComment(data) {
    return service({
        method: "PUT",
        url: "/comment/like",
        data
    })
}
//取消点赞评论
export function cancelLikeTheComment(data) {
    return service({
        method: "Delete",
        url: "/comment/cancelLike",
        data
    })
}
//根据评论id和用户id判断是否点赞评论
export function isLikeTheComment(id, userId) {
    return service({
        method: "GET",
        url: `/comment/isLike?id=${id}&userId=${userId}`,
    })
}

// 以下是与用户相关的接口


// 头像上传
export function uploadAvatar(data) {
    return service({
        method: "PUT",
        url: "/user/avatar",
        data
    })
}

// 签名修改
export function changeSign(signature, userId) {
    return service({
        method: "PUT",
        url: `/user/signature?signature=${signature}&userId=${userId}`,
    })
}
//文章状态修改
export function changeArticleStatus(id, isPrivate, userId) {
    return service({
        method: "PUT",
        url: `/article/private?isPrivate=${isPrivate}&id=${id}&userId=${userId}`,
    })
}

//获取所有公开的博客
export function getPublicBlogs() {
    return service({
        method: "GET",
        url: `/article/public/getArticles`,
    })
}
//获取单个公开博客的细节
export function getPublicBlogDetail(id) {
    return service({
        method: "GET",
        url: `/article/public/detail?id=${id}`,
    })
}

//检查token是否有效
export function checkToken() {
    return service({
        method: "GET",
        url: `/common/checkToken`,
    })
}








