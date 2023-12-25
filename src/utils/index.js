import md5 from "js-md5";
export function encrypt(query) {
    let secretKey = 'lhd'
    let accesskey = 'hdcc'
    let stringA = accesskey + '=access&' + query + '&SecretKey=' + secretKey
    let sign = md5(stringA).toUpperCase();
    return sign
}
