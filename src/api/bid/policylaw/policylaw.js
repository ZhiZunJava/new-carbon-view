import request from '@/utils/request'

export function getPolicylawList(params) {
    return request({
        url: '/bid/policylaw/front/list',
        method: 'get',
        params
    })
}

export function getPolicylawDetail(id) {
    return request({
        url: '/bid/policylaw/front/' + id,
        method: 'get'
    })
}