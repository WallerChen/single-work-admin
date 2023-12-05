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

export async function tinyMceUploadImg(blobInfo, success, failure, progress) {
  const formdata = new FormData()
  formdata.append('file', blobInfo.blob())
  formdata.append('saveDir', 'activity/editor')
  formdata.append('compressImg', '1')

  try {
    const res = await request({
      url: '/api/admin/upload',
      method: 'POST',
      data: formdata,

      onUploadProgress: progress
    })

    success(res.data.url)
  } catch (error) {
    failure(error)
  }
}

export async function upload(file, saveDir, compressImg = true) {
  const formdata = new FormData()

  formdata.append('file', file)
  formdata.append('saveDir', saveDir)
  formdata.append('compressImg', compressImg ? '1' : '0')

  return await request({
    url: '/api/admin/upload',
    method: 'POST',
    data: formdata
  })
}

