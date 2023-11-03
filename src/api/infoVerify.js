import request from '@/utils/request'

// 获取学生信息（审核)
export function getStudentAuthInfo(params) {
  return request({
    url: `/api/admin/user/auth`,
    method: 'get',
    params
  })
}

// type: 'education', 'job
// status: 'pass', 'reject'
export function verifyInfo(studentId, type, status) {
  return request({
    url: `/api/admin/user/verify`,
    method: 'post',
    data: {
      studentId,
      type,
      status
    }
  })
}
