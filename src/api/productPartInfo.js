import request from '@/utils/request'
import qs from 'qs'

export function partlist(query) {
  return request({
    url: '/webapi/enterprise/productpartinfo/list',
    method: 'get',
    params: query
  })
}
export function addPart(data) {
  return request({
    url: '/webapi/enterprise/productpartinfo/create',
    method: 'post',
    data: data
  })
}
export function editPart(productPartInfo) {
  return request({
    url: '/webapi/enterprise/productpartinfo/modify',
    method: 'post',
    data: productPartInfo
  })
}
export function deletePart(data) {
  return request({
    url: '/webapi/enterprise/productpartinfo/remove',
    method: 'post',
    data: qs.stringify({productId: data.productId, productPartInfoId: data.productPartInfoId})
  })
}
