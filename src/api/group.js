import request from '@/utils/request'

// 代理域名配置
const path = 'single';

// 获取活动列表
export function getAct(params) {
  return request({
    url: `${path}/activity`,
    method: 'get',
    params
  })
}

// 删除活动
export function deleteAct(params) {
  return request({
    url: `${path}/activity/${params.id}`,
    method: 'delete'
  })
}


// 创建活动
export function createAct(params) {
  return request({
    url: `${path}/activity`,
    method: 'post',
    data: params
  })
}

export function getList(params) {
  return request({
    url: `${path}/admin/users/index`,
    method: 'get',
    params
  })
}

export function getListByNickname(params) {
    return request({
        url: `${path}/admin/users/fuzzySearch`,
        method: 'get',
        params
    })
}

export function updateUserInfo(id ,params) {
    return request({
        url: `${path}/admin/users/resultful/${id}`,
        method: 'put',
        data: params
    })
}
  
