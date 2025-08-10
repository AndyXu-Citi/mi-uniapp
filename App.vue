<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
    // 检查登录状态
    this.checkLoginStatus()
    // 获取系统信息
    this.getSystemInfo()
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  },
  methods: {
    checkLoginStatus() {
      const token = uni.getStorageSync('token')
      if (token) {
        // 验证token有效性
        this.$api.user.verifyToken().then(res => {
          if (res.code !== 200) {
            uni.removeStorageSync('token')
            uni.removeStorageSync('userInfo')
          }
        }).catch(() => {
          uni.removeStorageSync('token')
          uni.removeStorageSync('userInfo')
        })
      }
    },
    getSystemInfo() {
      uni.getSystemInfo({
        success: (res) => {
          this.$store.commit('setSystemInfo', res)
        }
      })
    }
  }
}
</script>

<style>
/*每个页面公共css */
@import './src/static/css/common.css';

page {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
    Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei',
    sans-serif;
  background-color: #f8f8f8;
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  box-sizing: border-box;
}

.container {
  padding: 20rpx;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-primary {
  color: #3cc51f;
}

.text-gray {
  color: #999;
}

.text-small {
  font-size: 24rpx;
}

.text-large {
  font-size: 32rpx;
}

.margin-top-sm {
  margin-top: 10rpx;
}

.margin-top {
  margin-top: 20rpx;
}

.margin-top-lg {
  margin-top: 40rpx;
}

.margin-bottom-sm {
  margin-bottom: 10rpx;
}

.margin-bottom {
  margin-bottom: 20rpx;
}

.margin-bottom-lg {
  margin-bottom: 40rpx;
}
</style>