import service from '../Service.js'

// 上传评论
export function uploadComment(data) {
    return service({
        method: "POST",
        url: "/comment",
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
export function toggleLike(id, isLiked) {
    return service({
        method: "PUT",
        url: `/comment/like?id=${id}&isLiked=${isLiked} `,
    })
}

//根据评论id和用户id判断是否点赞评论
export function isLikeTheComment(id) {
    return service({
        method: "GET",
        url: `/comment/like?id=${id}`,
    })
}

//根据id删除评论
export function deleteComment(id) {
    return service({
        method: "DELETE",
        url: `/comment?id=${id}`
    })
}


