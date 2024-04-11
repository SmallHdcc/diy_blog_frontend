import service from '../Service.js'

/*--- 获得回复我的消息 ---*/
export function getReplyMessage(userId) {
    return service({
        method: "GET",
        url: `/message/reply?userId=${userId}`
    })
}


