import axios from '@/libs/api.request'

/**
 * @description 查询轨迹节点分页列表
 */
export const selectTraceNodePageAPI = (params) => {
    return axios.request({
        url: '/tracenode/page',
        method: 'get',
        params: params
    });
}


/**
 * @description 查询轨迹节点详情   
 */
export const selectTraceNodeDetailAPI = (params) => {
    return axios.request({
        url: '/tracenode/detail',
        method: 'get',
        params: params
    });
}


/**
 * @description 查询轨迹节点列表   
 */
export const selectTraceNodeListAPI = (params) => {
    return axios.request({
        url: '/tracenode/list',
        method: 'get',
        params: params
    });
}



/**
 * @description 新增轨迹节点
 */
export const saveTraceNodeAPI = (params) => {
    return axios.request({
        url: '/tracenode/save',
        method: 'post',
        data: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    });
}


/**
 * @description 修改轨迹节点
 */
export const editTraceNodeAPI = (params) => {
    return axios.request({
        url: '/tracenode/update',
        method: 'post',
        data: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    });
}



/**
 * @description 删除轨迹节点
 */
export const delTraceNodeAPI = (params) => {
    return axios.request({
        url: '/tracenode/delete',
        method: 'post',
        data: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    });
}




