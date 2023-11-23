import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

export const BACKEND_LIST = [{
  label: '线上',
  value: 'https://go-backend-17832-5-1312859283.sh.run.tcloudbase.com'
}, {
  label: '团队测试(test)',
  value: 'https://go-backend-test-17832-5-1312859283.sh.run.tcloudbase.com'
}, {
  label: '开发者测试(localhost)',
  value: 'http://127.0.0.1:8080'
}]

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_API_BASE_URL,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    const serverUrl = localStorage.getItem('serverUrl')
    console.log('serverUrl', serverUrl)
    config.baseURL = serverUrl

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log('request err', error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    if (!res.code || res.code === 200) {
      return res
    }

    // if (res.code === 50009) {
    //   // 密码错误
    //   return Promise.reject(new Error('账号或密码错误'))
    // }

    Message({
      message: res.msg || 'Error',
      type: 'error',
      duration: 5 * 1000
    })

    // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      // to re-login
      MessageBox.confirm('会话过期了，重新登陆下喵', '会话超时', {
        confirmButtonText: '重新登陆',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    }
    console.log('request err', res)
    return Promise.reject(new Error(res.msg || 'Error'))
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
