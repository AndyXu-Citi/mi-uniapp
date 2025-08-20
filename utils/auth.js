/**
 * 认证相关工具函数
 */

// 设置token
export function setToken(token) {
  uni.setStorageSync('token', token)
}

// 获取token
export function getToken() {
  return uni.getStorageSync('token')
}

// 移除token
export function removeToken() {
  uni.removeStorageSync('token')
}

// 检查是否登录
export function checkLogin() {
  const token = getToken()
  return !!token
}

// 跳转到登录页
export function toLogin(redirect = true) {
  const currentPage = getCurrentPages().pop()
  const currentRoute = currentPage ? currentPage.route : ''
  
  // 如果当前已经在登录页，不再跳转
  if (currentRoute === 'pages/login/index') {
    return
  }
  
  // 跳转到登录页
  if (redirect && currentRoute) {
    uni.navigateTo({
      url: `/pages/login/index?redirect=/${currentRoute}`
    })
  } else {
    uni.navigateTo({
      url: '/pages/login/index'
    })
  }
}

// 登录拦截
export function loginInterceptor(options = {}) {
  const { needLogin = true, callback } = options
  
  if (needLogin && !checkLogin()) {
    uni.showToast({
      title: '请先登录',
      icon: 'none',
      complete: () => {
        setTimeout(() => {
          toLogin()
        }, 1500)
      }
    })
    return false
  }
  
  if (typeof callback === 'function') {
    return callback()
  }
  
  return true
}