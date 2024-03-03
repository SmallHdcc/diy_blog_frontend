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
export function likeTheComment(id) {
    return service({
        method: "PUT",
        url: `/comment/like?id=${id}`,
    })
}
//取消点赞评论
export function cancelLikeTheComment(id) {
    return service({
        method: "Delete",
        url: `/comment/like?id=${id}`,

    })
}
//根据评论id和用户id判断是否点赞评论
export function isLikeTheComment(id, userId) {
    return service({
        method: "GET",
        url: `/comment/like?id=${id}&userId=${userId}`,
    })
}