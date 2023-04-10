import request from '@/utils/request'

// 代理域名配置
const path = process.env.NODE_ENV === 'development' ? 'single' : ''

// 获取学生信息（审核)
export function getStudentInfo(params) {
  return request({
    url: `${path}/admin/auth/info`,
    method: 'get',
    params
  })
}

// type: 'education', 'job
// status: 'pass', 'reject'
export function verifyInfo(studentId, type, status) {
  return request({
    url: `${path}/admin/auth/verify`,
    method: 'post',
    data: {
      studentId,
      type,
      status
    }
  })
}
