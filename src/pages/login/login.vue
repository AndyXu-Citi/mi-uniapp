<template>
	<view class="container">
		<!-- 登录表单 -->
		<view class="login-form">
			<view class="logo-section">
				<u-image src="/static/images/logo.png" width="120" height="120" mode="aspectFit"></u-image>
				<text class="app-name">马拉松报名</text>
			</view>

			<u-form ref="loginForm" :model="loginForm" :rules="rules">
				<u-form-item prop="phone">
					<u-input 
						v-model="loginForm.phone" 
						placeholder="请输入手机号"
						prefix-icon="phone"
						maxlength="11"
					></u-input>
				</u-form-item>

				<u-form-item prop="password">
					<u-input 
						v-model="loginForm.password" 
						type="password"
						placeholder="请输入密码"
						prefix-icon="lock"
					></u-input>
				</u-form-item>

				<u-form-item v-if="loginType === 'sms'" prop="code">
					<u-input 
						v-model="loginForm.code" 
						placeholder="请输入验证码"
						prefix-icon="chat"
					>
						<u-button slot="suffix" size="mini" @click="getCode" :disabled="codeDisabled">
							{{ codeText }}
						</u-button>
					</u-input>
				</u-form-item>
			</u-form>

			<view class="form-actions">
				<u-button type="primary" @click="handleLogin" :loading="loading">
					登录
				</u-button>
				<view class="login-type-switch" @click="switchLoginType">
					{{ loginType === 'password' ? '短信验证码登录' : '密码登录' }}
				</view>
			</view>

			<view class="other-actions">
				<text @click="goToRegister">立即注册</text>
				<text @click="goToForgotPassword">忘记密码</text>
			</view>

			<!-- 第三方登录 -->
			<view class="third-party-login">
				<view class="divider">
					<text>其他登录方式</text>
				</view>
				<view class="login-buttons">
					<u-button type="success" plain @click="wechatLogin">
						<u-icon name="weixin" size="32"></u-icon>
						微信登录
					</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			loginType: 'password',
			loginForm: {
				phone: '',
				password: '',
				code: ''
			},
			rules: {
				phone: [
					{ required: true, message: '请输入手机号', trigger: 'blur' },
					{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 6, max: 20, message: '密码长度6-20位', trigger: 'blur' }
				],
				code: [
					{ required: true, message: '请输入验证码', trigger: 'blur' },
					{ len: 6, message: '验证码为6位数字', trigger: 'blur' }
				]
			},
			loading: false,
			codeText: '获取验证码',
			codeDisabled: false,
			countdown: 60
		}
	},
	methods: {
		handleLogin() {
			this.$refs.loginForm.validate(valid => {
				if (!valid) return
				
				this.loading = true
				
				// 模拟登录
				setTimeout(() => {
					const userInfo = {
						id: 12345,
						name: '张三',
						phone: this.loginForm.phone,
						avatar: '/static/images/avatar.jpg'
					}
					
					this.$store.commit('SET_USER_INFO', userInfo)
					this.$store.commit('SET_TOKEN', 'mock_token_12345')
					
					uni.showToast({
						title: '登录成功',
						icon: 'success'
					})
					
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/index/index'
						})
					}, 1500)
					
					this.loading = false
				}, 1000)
			})
		},
		switchLoginType() {
			this.loginType = this.loginType === 'password' ? 'sms' : 'password'
			this.$refs.loginForm.resetFields()
		},
		getCode() {
			this.$refs.loginForm.validateField('phone', valid => {
				if (!valid) return
				
				this.codeDisabled = true
				this.codeText = `${this.countdown}秒后重试`
				
				const timer = setInterval(() => {
					this.countdown--
					this.codeText = `${this.countdown}秒后重试`
					
					if (this.countdown <= 0) {
						clearInterval(timer)
						this.codeText = '获取验证码'
						this.codeDisabled = false
						this.countdown = 60
					}
				}, 1000)
				
				uni.showToast({
					title: '验证码已发送',
					icon: 'success'
				})
			})
		},
		wechatLogin() {
			uni.showToast({
				title: '微信登录功能开发中',
				icon: 'none'
			})
		},
		goToRegister() {
			uni.navigateTo({
				url: '/pages/register/register'
			})
		},
		goToForgotPassword() {
			uni.navigateTo({
				url: '/pages/forgot-password/forgot-password'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	background-color: #f5f5f5;
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40rpx;
}

.login-form {
	background: #fff;
	border-radius: 20rpx;
	padding: 60rpx 40rpx;
	width: 100%;
	max-width: 600rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.logo-section {
	text-align: center;
	margin-bottom: 60rpx;
}

.app-name {
	display: block;
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-top: 20rpx;
}

.form-actions {
	margin-top: 40rpx;
}

.login-type-switch {
	text-align: center;
	font-size: 28rpx;
	color: #007AFF;
	margin-top: 30rpx;
}

.other-actions {
	display: flex;
	justify-content: space-between;
	font-size: 28rpx;
	color: #007AFF;
	margin-top: 30rpx;
}

.third-party-login {
	margin-top: 60rpx;
}

.divider {
	position: relative;
	text-align: center;
	margin-bottom: 40rpx;
}

.divider text {
	background: #fff;
	padding: 0 20rpx;
	font-size: 28rpx;
	color: #999;
}

.divider::before {
	content: '';
	position: absolute;
	top: 50%;
	left: 0;
	right: 0;
	height: 1rpx;
	background: #eee;
	z-index: -1;
}

.login-buttons {
	display: flex;
	justify-content: center;
}
</style>