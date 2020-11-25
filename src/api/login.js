import request from '@/utils/request'
import qs from 'qs'

export function login(account, password) {
  return request({
    url: '/account/enterprise/login',
    method: 'post',
    data: qs.stringify({ loginId: account, password: password})
  })
}
export function changeOrgName( id, customerName, status) {
  return request({
    url: '/webapi/datacenter/core/customer/modify',
    method: 'post',
    data: qs.stringify({ id: id, customerName: customerName, status: status})
  })
}
export function wechatlogin(openId) {
  return request({
    url: '/account/wechat/enterprise/login',
    method: 'post',
    data: qs.stringify(openId)
  })
}

export function getUserInfo(employeeId) {
  return request({
    url: '/webapi/enterprise/user/info',
    method: 'get',
    params:{ "employeeId": employeeId}
  })
}
export function loginout(query) {
  return request({
    url: '/webapi/enterprise/logout/out',
    method: 'get',
    params: query
  })
}
