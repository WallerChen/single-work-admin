import request from '@/utils/request'

// 获取活动列表
export function getAct(params) {
  return request({
    url: `/activity`,
    method: 'get',
    params
  })
}

// 删除活动
export function deleteAct(params) {
  return request({
    url: `/activity/${params.id}`,
    method: 'delete'
  })
}

// 创建活动
export function createAct(params) {
  return request({
    url: `/activity`,
    method: 'post',
    data: params
  })
}

export function getList(params) {
  return request({
    url: `/api/admin/userList`,
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

