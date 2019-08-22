import axios from '@/libs/api.request'

/**
 * @description 查询轨迹环节分页列表
 */
export const selectTraceCyclePageAPI = (params) => {
    return axios.request({
        url: '/tracecycle/page',
        method: 'get',
        params: params
    });
}


/**
 * @description 查询轨迹环节详情   
 */
export const selectTraceCycleDetailAPI = (params) => {
    return axios.request({
        url: '/tracecycle/detail',
        method: 'get',
        params: params
    });
}

/**
 * @description 查询轨迹环节列表   
 */
export const selectTraceCycleListAPI = (params) => {
    return axios.request({
        url: '/tracecycle/list',
        method: 'get',
        params: params
    });
}




/**
 * @description 新增轨迹环节
 */
export const saveTraceCycleAPI = (params) => {
    return axios.request({
        url: '/tracecycle/save',
        method: 'post',
        data: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    });
}


/**
 * @description 修改轨迹环节
 */
export const editTraceCycleAPI = (params) => {
    return axios.request({
        url: '/tracecycle/update',
        method: 'post',
        data: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    });
}



/**
 * @description 删除轨迹环节
 */
export const delTraceCycleAPI = (params) => {
    return axios.request({
        url: '/tracecycle/delete',
        method: 'post',
        data: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    });
}




