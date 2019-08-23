import axios from '@/libs/api.request'

/**
 * @description 查询标准轨迹分页列表
 */
export const selectStandardTracePageAPI = (params) => {
    return axios.request({
        url: '/standardtrace/page',
        method: 'get',
        params: params
    });
}


/**
 * @description 查询标准轨迹详情   
 */
export const selectStandardTraceDetailAPI = (params) => {
    return axios.request({
        url: '/standardtrace/detail',
        method: 'get',
        params: params
    });
}

/**
 * @description 查询标准轨迹列表   
 */
export const selectStandardTraceListAPI = (params) => {
    return axios.request({
        url: '/standardtrace/list',
        method: 'get',
        params: params
    });
}




/**
 * @description 新增标准轨迹
 */
export const saveStandardTraceAPI = (params) => {
    return axios.request({
        url: '/standardtrace/save',
        method: 'post',
        data: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    });
}


/**
 * @description 修改标准轨迹
 */
export const editStandardTraceAPI = (params) => {
    return axios.request({
        url: '/standardtrace/update',
        method: 'post',
        data: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    });
}



/**
 * @description 删除标准轨迹
 */
export const delStandardTraceAPI = (params) => {
    return axios.request({
        url: '/standardtrace/delete',
        method: 'post',
        data: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    });
}




/**
 * @description 导入标准轨迹
 */
export const importStandardTraceAPI = (params) => {
    return axios.request({
        url: '/standardtrace/import',
        method: 'post',
        data: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    });
}





