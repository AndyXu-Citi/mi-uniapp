/**
 * 请求封装
 */

// 请求基础URL
const baseURL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8081/api'
  : 'https://api.itquiz.com/api'

// 请求超时时间
const timeout = 10000

// 请求拦截器
const requestInterceptor = (config) => {
  // 获取token
  const token = uni.getStorageSync('token')
  // 设置请求头
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    }
  }
  
  return config
}

// 响应拦截器
const responseInterceptor = (response) => {
  // 请求成功
  if (response.statusCode === 200) {
    // 业务状态码判断
    return response.data
  } else {
    // HTTP错误
    const error = new Error(response.data.message || `HTTP错误 ${response.statusCode}`)
    error.statusCode = response.statusCode
    return Promise.reject(error)
  }
}

// 错误处理
const errorHandler = (error) => {
  // 网络错误
  if (!error.statusCode) {
    uni.showToast({
      title: '网络异常，请检查网络连接',
      icon: 'none'
    })
  }
  
  // 401未授权
  if (error.statusCode === 401 || error.code === 401) {
    // 清除token
    uni.removeStorageSync('token')
    uni.removeStorageSync('user_info')
    
    // 跳转到登录页
    uni.showToast({
      title: '登录已过期，请重新登录',
      icon: 'none',
      complete: () => {
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/login/index'
          })
        }, 1500)
      }
    })
  } else {
    // 其他错误
    uni.showToast({
      title: error.message || '请求失败',
      icon: 'none'
    })
  }
  
  return Promise.reject(error)
}

// 请求方法
const request = (options) => {
  return new Promise((resolve, reject) => {
    // 合并选项
    const requestOptions = {
      url: `${baseURL}${options.url}`,
      data: options.data,
      method: options.method || 'GET',
      header: options.header || {},
      timeout: options.timeout || timeout,
	    contentType : options.contentType
    }
    
    // 请求拦截
    const config = requestInterceptor(requestOptions)
    
    // 发起请求
    uni.request({
      ...config,
      success: (res) => {
        try {
          const response = responseInterceptor(res)
          resolve(response)
        } catch (error) {
          errorHandler(error)
          reject(error)
        }
      },
      fail: (err) => {
        const error = new Error(err.errMsg || '请求失败')
        errorHandler(error)
        reject(error)
      }
    })
  })
}

// 导出请求方法
export default {
  get: (url, params = {}) => {
    return request({
      url,
      data: params,
      method: 'GET'
    })
  },
  post: (url, data = {}) => {
    return request({
      url,
      data,
      method: 'POST'
    })
  },
  put: (url, data = {}) => {
    return request({
      url,
      data,
      method: 'PUT'
    })
  },
  delete: (url, data = {}) => {
    return request({
      url,
      data,
      method: 'DELETE'
    })
  }
}