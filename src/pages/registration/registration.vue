<template>
  <view class="registration-container">
    <!-- 顶部导航 -->
    <view class="navbar">
      <view class="navbar-left" @tap="navigateBack">
        <text class="iconfont icon-back"></text>
      </view>
      <view class="navbar-title">赛事报名</view>
      <view class="navbar-right"></view>
    </view>

    <!-- 赛事信息 -->
    <view class="event-info">
      <image class="event-image" :src="eventDetail.image" mode="aspectFill"></image>
      <view class="event-content">
        <text class="event-title">{{ eventDetail.title }}</text>
        <view class="event-meta">
          <text class="event-date">{{ formatDate(eventDetail.startTime) }}</text>
          <text class="event-location">{{ eventDetail.location }}</text>
        </view>
      </view>
    </view>

    <!-- 报名信息 -->
    <view class="registration-form">
      <view class="form-section">
        <view class="section-title">参赛人信息</view>
        
        <view class="form-item">
          <text class="label">姓名</text>
          <input class="input" v-model="form.name" placeholder="请输入真实姓名" />
        </view>
        
        <view class="form-item">
          <text class="label">手机号</text>
          <input class="input" v-model="form.phone" type="number" maxlength="11" placeholder="请输入手机号" />
        </view>
        
        <view class="form-item">
          <text class="label">身份证号</text>
          <input class="input" v-model="form.idCard" placeholder="请输入身份证号" />
        </view>
        
        <view class="form-item">
          <text class="label">性别</text>
          <view class="radio-group">
            <label class="radio-item" @tap="form.gender = 'male'">
              <radio :checked="form.gender === 'male'" />
              <text>男</text>
            </label>
            <label class="radio-item" @tap="form.gender = 'female'">
              <radio :checked="form.gender === 'female'" />
              <text>女</text>
            </label>
          </view>
        </view>
        
        <view class="form-item">
          <text class="label">紧急联系人</text>
          <input class="input" v-model="form.emergencyContact" placeholder="请输入紧急联系人姓名" />
        </view>
        
        <view class="form-item">
          <text class="label">紧急联系电话</text>
          <input class="input" v-model="form.emergencyPhone" type="number" maxlength="11" placeholder="请输入紧急联系电话" />
        </view>
      </view>

      <view class="form-section">
        <view class="section-title">参赛项目</view>
        <view class="project-list">
          <view 
            class="project-item"
            :class="{ active: form.projectId === item.id }"
            v-for="item in eventDetail.projects"
            :key="item.id"
            @tap="selectProject(item)"
          >
            <view class="project-info">
              <text class="project-name">{{ item.name }}</text>
              <text class="project-distance">{{ item.distance }}</text>
            </view>
            <text class="project-price">¥{{ item.price }}</text>
          </view>
        </view>
      </view>

      <view class="form-section">
        <view class="section-title">参赛须知</view>
        <view class="notice-content">
          <text class="notice-text">1. 参赛者必须年满18周岁且身体健康</text>
          <text class="notice-text">2. 参赛者需签署免责声明</text>
          <text class="notice-text">3. 报名成功后不可退款</text>
          <text class="notice-text">4. 请确保填写信息真实有效</text>
        </view>
        <view class="checkbox-item">
          <checkbox :checked="form.agreed" @tap="form.agreed = !form.agreed" />
          <text class="checkbox-text">我已阅读并同意《参赛协议》</text>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="price-info">
        <text class="price-label">合计：</text>
        <text class="price-value">¥{{ totalPrice }}</text>
      </view>
      <button 
        class="submit-btn" 
        :disabled="!canSubmit"
        @tap="submitRegistration"
      >
        立即报名
      </button>
    </view>
  </view>
</template>

<script>
import { eventApi, registrationApi } from '@/api/index.js'
import { formatDate } from '@/utils/common.js'

export default {
  data() {
    return {
      eventId: null,
      eventDetail: {
        projects: []
      },
      form: {
        name: '',
        phone: '',
        idCard: '',
        gender: 'male',
        emergencyContact: '',
        emergencyPhone: '',
        projectId: null,
        agreed: false
      }
    }
  },

  computed: {
    totalPrice() {
      const project = this.eventDetail.projects.find(p => p.id === this.form.projectId)
      return project ? project.price : 0
    },

    canSubmit() {
      return this.form.name && 
             this.form.phone && 
             this.form.idCard && 
             this.form.emergencyContact && 
             this.form.emergencyPhone && 
             this.form.projectId && 
             this.form.agreed
    }
  },

  onLoad(options) {
    this.eventId = options.id
    this.loadEventDetail()
  },

  methods: {
    formatDate,

    async loadEventDetail() {
      try {
        const res = await eventApi.getEventDetail(this.eventId)
        this.eventDetail = res.data
      } catch (error) {
        uni.showToast({
          title: '获取赛事信息失败',
          icon: 'none'
        })
      }
    },

    selectProject(project) {
      this.form.projectId = project.id
    },

    async submitRegistration() {
      if (!this.validateForm()) return

      try {
        uni.showLoading({
          title: '提交中...',
          mask: true
        })

        const data = {
          ...this.form,
          eventId: this.eventId,
          amount: this.totalPrice
        }

        await registrationApi.createRegistration(data)

        uni.hideLoading()
        uni.showToast({
          title: '报名成功',
          icon: 'success'
        })

        setTimeout(() => {
          uni.redirectTo({
            url: '/pages/registration-records/registration-records'
          })
        }, 1500)
      } catch (error) {
        uni.hideLoading()
        uni.showToast({
          title: error.message || '报名失败',
          icon: 'none'
        })
      }
    },

    validateForm() {
      if (!this.form.name) {
        uni.showToast({
          title: '请输入姓名',
          icon: 'none'
        })
        return false
      }

      if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        return false
      }

      if (!/^\d{17}[\dXx]$/.test(this.form.idCard)) {
        uni.showToast({
          title: '请输入正确的身份证号',
          icon: 'none'
        })
        return false
      }

      if (!this.form.emergencyContact) {
        uni.showToast({
          title: '请输入紧急联系人',
          icon: 'none'
        })
        return false
      }

      if (!/^1[3-9]\d{9}$/.test(this.form.emergencyPhone)) {
        uni.showToast({
          title: '请输入正确的紧急联系电话',
          icon: 'none'
        })
        return false
      }

      if (!this.form.projectId) {
        uni.showToast({
          title: '请选择参赛项目',
          icon: 'none'
        })
        return false
      }

      if (!this.form.agreed) {
        uni.showToast({
          title: '请阅读并同意参赛协议',
          icon: 'none'
        })
        return false
      }

      return true
    },

    navigateBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
.registration-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  height: 88rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;

  &-left {
    .iconfont {
      font-size: 40rpx;
      color: #333;
    }
  }

  &-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }

  &-right {
    width: 40rpx;
  }
}

.event-info {
  display: flex;
  padding: 30rpx;
  background-color: #fff;
  margin-bottom: 20rpx;

  .event-image {
    width: 200rpx;
    height: 150rpx;
    border-radius: 8rpx;
    margin-right: 20rpx;
  }

  .event-content {
    flex: 1;

    .event-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
      margin-bottom: 10rpx;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .event-meta {
      .event-date, .event-location {
        font-size: 24rpx;
        color: #666;
        margin-right: 20rpx;
      }
    }
  }
}

.registration-form {
  .form-section {
    background-color: #fff;
    margin-bottom: 20rpx;

    .section-title {
      padding: 30rpx;
      font-size: 30rpx;
      font-weight: 500;
      color: #333;
      border-bottom: 1rpx solid #eee;
    }

    .form-item {
      display: flex;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1rpx solid #f5f5f5;

      .label {
        width: 180rpx;
        font-size: 28rpx;
        color: #333;
      }

      .input {
        flex: 1;
        font-size: 28rpx;
        color: #333;
      }

      .radio-group {
        display: flex;

        .radio-item {
          display: flex;
          align-items: center;
          margin-right: 40rpx;

          radio {
            margin-right: 10rpx;
          }

          text {
            font-size: 28rpx;
            color: #333;
          }
        }
      }
    }

    .project-list {
      .project-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 30rpx;
        border-bottom: 1rpx solid #f5f5f5;

        &.active {
          background-color: #f0f9ff;
          border-left: 4rpx solid #007aff;
        }

        .project-info {
          .project-name {
            display: block;
            font-size: 30rpx;
            font-weight: 500;
            color: #333;
            margin-bottom: 10rpx;
          }

          .project-distance {
            font-size: 24rpx;
            color: #666;
          }
        }

        .project-price {
          font-size: 32rpx;
          font-weight: 500;
          color: #ff6b35;
        }
      }
    }

    .notice-content {
      padding: 30rpx;

      .notice-text {
        display: block;
        font-size: 26rpx;
        color: #666;
        line-height: 1.6;
        margin-bottom: 10rpx;
      }
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      padding: 30rpx;

      checkbox {
        margin-right: 20rpx;
      }

      .checkbox-text {
        font-size: 28rpx;
        color: #333;
      }
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;

  .price-info {
    .price-label {
      font-size: 28rpx;
      color: #666;
    }

    .price-value {
      font-size: 36rpx;
      font-weight: 500;
      color: #ff6b35;
    }
  }

  .submit-btn {
    width: 240rpx;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 30rpx;
    color: #fff;
    background-color: #007aff;
    border-radius: 40rpx;

    &:disabled {
      background-color: #ccc;
    }
  }
}
</style>