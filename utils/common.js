// 通用工具函数

/**
 * 格式化日期
 * @param {Date|string} date - 日期对象或日期字符串
 * @param {string} format - 格式字符串，默认 'yyyy-MM-dd'
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'yyyy-MM-dd') {
  if (!date) return ''
  
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('yyyy', year)
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

/**
 * 格式化价格
 * @param {number|string} price - 价格数字
 * @returns {string} 格式化后的价格字符串
 */
export function formatPrice(price) {
  if (!price && price !== 0) return '0.00'
  return Number(price).toFixed(2)
}

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} delay - 延迟时间，默认300ms
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, delay = 300) {
  let timeout
  return function(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), delay)
  }
}

/**
 * 节流函数
 * @param {Function} func - 要执行的函数
 * @param {number} delay - 节流时间，默认300ms
 * @returns {Function} 节流后的函数
 */
export function throttle(func, delay = 300) {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime > delay) {
      lastTime = now
      func.apply(this, args)
    }
  }
}

/**
 * 验证手机号
 * @param {string} phone - 手机号
 * @returns {boolean} 是否有效
 */
export function validatePhone(phone) {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

/**
 * 验证邮箱
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
export function validateEmail(email) {
  const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return reg.test(email)
}

/**
 * 生成随机字符串
 * @param {number} length - 字符串长度，默认8
 * @returns {string} 随机字符串
 */
export function randomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 复制到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise} 复制结果
 */
export function copyToClipboard(text) {
  return new Promise((resolve, reject) => {
    uni.setClipboardData({
      data: text,
      success: () => {
        uni.showToast({
          title: '复制成功',
          icon: 'success'
        })
        resolve()
      },
      fail: () => {
        uni.showToast({
          title: '复制失败',
          icon: 'none'
        })
        reject()
      }
    })
  })
}

/**
 * 显示加载中
 * @param {string} title - 提示文字，默认'加载中...'
 */
export function showLoading(title = '加载中...') {
  uni.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载中
 */
export function hideLoading() {
  uni.hideLoading()
}

/**
 * 显示成功提示
 * @param {string} title - 提示文字
 */
export function showSuccess(title) {
  uni.showToast({
    title,
    icon: 'success'
  })
}

/**
 * 显示错误提示
 * @param {string} title - 提示文字
 */
export function showError(title) {
  uni.showToast({
    title,
    icon: 'none'
  })
}

/**
 * 获取系统信息
 * @returns {Object} 系统信息
 */
export function getSystemInfo() {
  return uni.getSystemInfoSync()
}

/**
 * 判断是否为iOS
 * @returns {boolean} 是否为iOS
 */
export function isIOS() {
  const systemInfo = getSystemInfo()
  return systemInfo.platform === 'ios'
}

/**
 * 判断是否为Android
 * @returns {boolean} 是否为Android
 */
export function isAndroid() {
  const systemInfo = getSystemInfo()
  return systemInfo.platform === 'android'
}

/**
 * 获取页面参数
 * @param {Object} options - 页面参数
 * @returns {Object} 解析后的参数
 */
export function getPageParams(options = {}) {
  return {
    ...options,
    ...uni.getLaunchOptionsSync().query
  }
}

/**
 * 延迟执行
 * @param {number} ms - 延迟时间，默认1000ms
 * @returns {Promise} Promise对象
 */
export function sleep(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default {
  formatDate,
  formatPrice,
  debounce,
  throttle,
  validatePhone,
  validateEmail,
  randomString,
  copyToClipboard,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  getSystemInfo,
  isIOS,
  isAndroid,
  getPageParams,
  sleep
}