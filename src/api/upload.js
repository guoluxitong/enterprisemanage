import request from '@/utils/request'

export function deleteFile (path) {
  return request({
    url: '/webapi/enterprise/file/deleteFile',
    method: 'post',
    params: {path}
  })
}
