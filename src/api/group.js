import request from '@/utils/request'

export function getList(params) {
  return request({
    url: `/api/admin/user/list`,
    method: 'get',
    params
  })
}

export function updateUserInfo(id, params) {
  return request({
    url: `/api/admin/user/info`,
    method: 'put',
    data: params,
    params: { id }
  })
}

