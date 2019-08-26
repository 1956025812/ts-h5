import axios from '@/libs/api.request'

/**
 * @description 查询基础操作日志分页列表
 */
export const selectBaseOperateLogPageAPI = (params) => {
    return axios.request({
        url: '/baseoperatelog/page',
        method: 'get',
        params: params
    });
}
