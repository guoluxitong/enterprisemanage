import request from '@/utils/request'
import qs from 'qs'
export function getProductCategoryListAndPage(query) {
  return request({
    url: '/webapi/enterprise/productcategory/pagelist',
    method: 'get',
    params: query
  })
}

export function getProductCategoryList() {
  return request({
    url: '/webapi/enterprise/productcategory/list',
    method: 'get'
  })
}

export function editBoilerModel(data) {
  return request({
    url: '/webapi/enterprise/productcategory/modify',
    method: 'post',
    data: data
  })
}
export function createBoilerModel(data) {
  return request({
    url: '/webapi/enterprise/productcategory/create',
    method: 'post',
    data: data
  })
}
export function deleteBoilerModelById(id) {
  return request({
    url: '/webapi/enterprise/productcategory/deleteboilermodelbyid',
    method: 'post',
    params: {id: id}
  })
}
