import axios from '@/libs/api.request'

/**
 * @description 查询原始轨迹标准轨迹映射分页列表
 */
export const selectTraceOriginalStandardPageAPI = (params) => {
    return axios.request({
        url: '/traceoriginalstandard/page',
        method: 'get',
        params: params
    });
}



/**
 * @description 删除原始轨迹标准轨迹映射
 */
export const delTraceOriginalStandardAPI = (params) => {
    return axios.request({
        url: '/traceoriginalstandard/delete',
        method: 'post',
        data: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    });
}

