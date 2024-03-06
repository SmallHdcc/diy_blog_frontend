import service from '../Service.js'

// 博客文章上传
export function uploadArticle(data) {
    return service({
        method: 'POST',
        url: "/article",
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
export function getBlogs() {
    return service({
        method: "GET",
        url: `/article`
    })
}


// 获取单个博客的详情页面
export function getSingleBlogDetail(id, userId, sign) {
    return service({
        method: "GET",
        url: `/article/detail?id=${id}`
    })
}

// 删除单个博客
export function deleteSingleBlog(id, userId) {
    return service({
        method: "DELETE",
        url: `/article?id=${id}&userId=${userId}`,
    })
}


//文章状态修改
export function changeArticleStatus(id, isPrivate) {
    return service({
        method: "PUT",
        url: `/article/private?isPrivate=${isPrivate}&id=${id}`,
    })
}

//获取所有公开的博客
export function getPublicBlogs() {
    return service({
        method: "GET",
        url: `/article/public`,
    })
}
//获取单个公开博客的细节
export function getPublicBlogDetail(id) {
    return service({
        method: "GET",
        url: `/article/public/detail?id=${id}`,
    })
}

export function getHeatList() {
    return service({
        method: "GET",
        url: `/heat`,
    })
}

