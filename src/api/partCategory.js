import request from '@/utils/request'


export function partCategoryList(query) {
    return request({
        url: '/webapi/enterprise/partcategory/list',
        method: 'get',
        params: query
    })
}
