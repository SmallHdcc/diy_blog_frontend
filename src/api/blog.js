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
export function deleteArticle(id) {
    return service({
        method: "DELETE",
        url: `/article?id=${id}`,
    })
}



//分页查询博客
export function getBlogsByPage(page, PageSize, userId) {
    return service({
        method: "GET",
        url: `/article?page=${page}&PageSize=${PageSize}&userId=${userId}`,
    })

}


//获取单个公开博客的细节
export function getPublicBlogDetail(id) {
    return service({
        method: "GET",
        url: `/article/detail?id=${id}`,
    })
}

export function getHeatList() {
    return service({
        method: "GET",
        url: `/heat`,
    })
}

