import request from '@/utils/request'
import qs from 'qs'
export function productSearch(data) {
  return request({
    url: '/webapi/enterprise/product/search',
    method: 'post',
    data: data.product,
    params: {pageNum: data.pageNum, pageSize: data.pageSize}
  })
}

export function getProductUsers(productId) {
  return request({
    url: '/webapi/enterprise/product/users',
    method: 'get',
    params: {productId}
  })
}
export function findSoldProduct(data) {
  return request({
    url: '/webapi/enterprise/product/sold',
    method: 'post',
    data: data
  })
}
export function getUsers(productId) {
  return request({
    url: '/webapi/enterprise/product/users',
    method: 'get',
    params: {productId: productId}
  })
}
export function editProduct(data) {
  return request({
    url: '/webapi/enterprise/product/modify',
    method: 'post',
    data: data
  })
}

export function productSell(data) {
    return request({
        url: '/webapi/enterprise/product/sell',
        method: 'post',
        data: data
    })
}
export function insertProduct(data) {
  return request({
    url: '/webapi/enterprise/product/create',
    method: 'post',
    data: data
  })
}

export function modifyProductUser(productId,data) {
  return request({
    url: '/webapi/enterprise/product/users/modify',
    method: 'post',
    params:{productId},
    data:data
  })
}
export function deleteProductById(id,controllerNo) {
  return request({
    url: '/webapi/enterprise/product/remove',
    method: 'post',
    data: qs.stringify({id: id, controllerNo: controllerNo})
  })
}
export function getDeviceNo(query) {
  return request({
    url: '/webapi/enterprise/org/prefix',
    method: 'post',
    data: query
  })
}
