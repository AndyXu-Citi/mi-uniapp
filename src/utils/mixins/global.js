// 全局混入
export default {
  data() {
    return {
      // 全局数据
      systemInfo: {},
      isLoading: false
    }
  },

  onLoad() {
    // 获取系统信息
    this.systemInfo = uni.getSystemInfoSync()
    
    // 设置页面标题
    if (this.$options.title) {
      uni.setNavigationBarTitle({
        title: this.$options.title
      })
    }
  },

  methods: {
    /**
     * 显示加载中
     */
    showLoading(title = '加载中...') {
      this.isLoading = true
      uni.showLoading({
        title,
        mask: true
      })
    },

    /**
     * 隐藏加载中
     */
    hideLoading() {
      this.isLoading = false
      uni.hideLoading()
    },

    /**
     * 显示成功提示
     */
    showSuccess(title) {
      uni.showToast({
        title,
        icon: 'success'
      })
    },

    /**
     * 显示错误提示
     */
    showError(title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    },

    /**
     * 显示确认对话框
     */
    showConfirm(title, content) {
      return new Promise((resolve, reject) => {
        uni.showModal({
          title,
          content,
          success: (res) => {
            if (res.confirm) {
              resolve()
            } else {
              reject()
            }
          },
          fail: reject
        })
      })
    },

    /**
     * 页面跳转
     */
    navigateTo(url) {
      uni.navigateTo({
        url,
        fail: () => {
          uni.switchTab({
            url
          })
        }
      })
    },

    /**
     * 重定向页面
     */
    redirectTo(url) {
      uni.redirectTo({ url })
    },

    /**
     * 返回上一页
     */
    navigateBack(delta = 1) {
      uni.navigateBack({ delta })
    },

    /**
     * 预览图片
     */
    previewImage(urls, current = 0) {
      uni.previewImage({
        urls: Array.isArray(urls) ? urls : [urls],
        current
      })
    },

    /**
     * 保存图片到相册
     */
    saveImageToPhotosAlbum(url) {
      return new Promise((resolve, reject) => {
        uni.downloadFile({
          url,
          success: (res) => {
            if (res.statusCode === 200) {
              uni.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: resolve,
                fail: reject
              })
            } else {
              reject(new Error('下载图片失败'))
            }
          },
          fail: reject
        })
      })
    },

    /**
     * 拨打电话
     */
    makePhoneCall(phoneNumber) {
      uni.makePhoneCall({
        phoneNumber
      })
    },

    /**
     * 打开地图
     */
    openLocation(latitude, longitude, name, address) {
      uni.openLocation({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        name,
        address,
        scale: 18
      })
    },

    /**
     * 设置存储
     */
    setStorage(key, data) {
      uni.setStorageSync(key, data)
    },

    /**
     * 获取存储
     */
    getStorage(key, defaultValue = null) {
      return uni.getStorageSync(key) || defaultValue
    },

    /**
     * 移除存储
     */
    removeStorage(key) {
      uni.removeStorageSync(key)
    },

    /**
     * 清空存储
     */
    clearStorage() {
      uni.clearStorageSync()
    },

    /**
     * 检查登录状态
     */
    checkLogin() {
      const token = this.getStorage('token')
      if (!token) {
        this.navigateTo('/pages/login/login')
        return false
      }
      return true
    },

    /**
     * 获取页面参数
     */
    getPageParams() {
      return this.$mp && this.$mp.query ? this.$mp.query : {}
    }
  },

  computed: {
    /**
     * 是否iOS
     */
    isIOS() {
      return this.systemInfo.platform === 'ios'
    },

    /**
     * 是否Android
     */
    isAndroid() {
      return this.systemInfo.platform === 'android'
    },

    /**
     * 是否微信环境
     */
    isWeChat() {
      return this.systemInfo.platform === 'devtools' || this.systemInfo.platform === 'wechat'
    },

    /**
     * 屏幕宽度
     */
    screenWidth() {
      return this.systemInfo.screenWidth || 375
    },

    /**
     * 屏幕高度
     */
    screenHeight() {
      return this.systemInfo.screenHeight || 667
    },

    /**
     * 状态栏高度
     */
    statusBarHeight() {
      return this.systemInfo.statusBarHeight || 20
    },

    /**
     * 是否刘海屏
     */
    isIphoneX() {
      return this.systemInfo.model && this.systemInfo.model.indexOf('iPhone X') > -1
    }
  }
}