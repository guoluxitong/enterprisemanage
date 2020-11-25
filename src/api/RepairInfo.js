import request from '@/utils/request'
import qs from 'qs'
export function getRepairInfoListByProductId(query) {
  return request({
    url: '/webapi/enterprise/repairinfo/list/product',
    method: 'get',
    params: query
  });
}
export function getRepairInfoListByDate(query) {
  return request({
    url: '/webapi/enterprise/repairinfo/list/product/date',
    method: 'get',
    params: {productId: query.productId, startTime: query.startTime, endTime: query.endTime}
  });
}
export function getRepairInfoListBydate(query) {
  return request({
    url: '/webapi/enterprise/repairinfo/list/user/date',
    method: 'get',
    params: {userId: query.userId, startTime: query.startTime, endTime: query.endTime}
  });
}

export function getRepairInfoListByUserId(userId) {
  return request({
    url: '/webapi/enterprise/repairinfo/list/user',
    method: 'get',
    params: {userId}
  });
}
export function insertRepairInfo(repairInfo) {
  return request({
    url: '/webapi/enterprise/repairinfo/create',
    method: 'post',
    data: repairInfo
  })
};
export function deleteRepairInfoByProductId(id) {
  return request({
    url: '/webapi/enterprise/repairinfo/remove',
    method: 'post',
    data: qs.stringify({id: id})
  })
}

