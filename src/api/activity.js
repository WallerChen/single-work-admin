import request from '@/utils/request'

export function getActivityList(params) {
  return request({
    url: '/api/admin/activityList',
    method: 'get',
    params
  })
}
export function getActivity(id) {
  return request({
    url: '/api/admin/activity',
    method: 'get',
    params: {
      id
    }
  })
}

export function createActivity(data) {
  return request({
    url: '/api/admin/activity',
    method: 'post',
    data
  })
}

export function updateActivity(id, data) {
  return request({
    url: '/api/admin/activity',
    method: 'PUT',
    params: {
      id
    },
    data
  })
}
