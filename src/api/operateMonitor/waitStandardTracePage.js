import axios from '@/libs/api.request'

/**
 * @description 查询待标准化轨迹分页列表
 */
export const selectWaitStandardTracePageAPI = (params) => {
    return axios.request({
        url: '/waitstandardtrace/page',
        method: 'get',
        params: params
    });
}



/**
 * @description 删除待标准化轨迹
 */
export const delWaitStandardTraceAPI = (params) => {
    return axios.request({
        url: '/waitstandardtrace/delete',
        method: 'post',
        data: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    });
}

