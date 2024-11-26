import request from '@/utils/request'

export function getInformationList(params) {
    return request({
        url: '/bid/information/front/list',
        method: 'get',
        params
    })
}

export function getInformationDetail(id) {
    return request({
        url: '/bid/information/front/' + id,
        method: 'get'
    })
}