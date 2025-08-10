// 全局过滤器

/**
 * 日期过滤器
 * @param {Date|string} value - 日期值
 * @param {string} format - 格式字符串
 * @returns {string} 格式化后的日期
 */
export function date(value, format = 'yyyy-MM-dd') {
  if (!value) return ''
  
  const date = new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')
  
  return format
    .replace('yyyy', year)
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

/**
 * 价格过滤器
 * @param {number|string} value - 价格值
 * @param {string} symbol - 货币符号，默认'¥'
 * @returns {string} 格式化后的价格
 */
export function currency(value, symbol = '¥') {
  if (!value && value !== 0) return `${symbol}0.00`
  return `${symbol}${Number(value).toFixed(2)}`
}

/**
 * 文本截断过滤器
 * @param {string} value - 文本内容
 * @param {number} length - 截断长度，默认20
 * @returns {string} 截断后的文本
 */
export function truncate(value, length = 20) {
  if (!value) return ''
  if (value.length <= length) return value
  return value.substring(0, length) + '...'
}

/**
 * 状态文本过滤器
 * @param {string|number} value - 状态值
 * @param {Object} statusMap - 状态映射对象
 * @returns {string} 状态文本
 */
export function status(value, statusMap) {
  return statusMap[value] || value || ''
}

/**
 * 文件大小过滤器
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的文件大小
 */
export function fileSize(bytes) {
  if (!bytes) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 手机号脱敏过滤器
 * @param {string} phone - 手机号
 * @returns {string} 脱敏后的手机号
 */
export function maskPhone(phone) {
  if (!phone || phone.length !== 11) return phone
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 邮箱脱敏过滤器
 * @param {string} email - 邮箱地址
 * @returns {string} 脱敏后的邮箱
 */
export function maskEmail(email) {
  if (!email || !email.includes('@')) return email
  
  const [username, domain] = email.split('@')
  if (username.length <= 3) {
    return username + '@' + domain
  }
  
  return username.substring(0, 3) + '***@' + domain
}

// 注册所有过滤器
export default {
  date,
  currency,
  truncate,
  status,
  fileSize,
  maskPhone,
  maskEmail
}