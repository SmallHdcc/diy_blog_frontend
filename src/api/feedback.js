import service from '../Service.js'

/*--- ---*/
/*---提交反馈 ---*/
export function submitFeedback(data) {
    return service({
        method: "POST",
        url: "/feedback",
        data
    })
}



