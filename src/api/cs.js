import request from '@/utils/request'

export function csList() {
    return request({
        url: "cmsapi/cs/list",
        method: 'get'
    })
}
export function loadaUserList(params) {
    return request({
        url: "cmsapi/cs/userlist_by_id",
        method: 'get',
        params
    })
}

export function saveCs(data) {
    return request({
        url: "cmsapi/cs/save",
        method: 'post',
        data
    })
}

