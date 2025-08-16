<template>
	<view class="container">
		<!-- 用户信息 -->
		<view class="user-info">
			<view class="avatar-section" @click="callLoginPopup">
				<image class="avatar" :src="userInfo.avatar || '/static/images/default-avatar.png'" mode="aspectFill"></image>
				<view class="user-details">
					<text class="username">{{ userInfo.name || '请登录' }}</text>
				</view>
			</view>
		</view>
		
		<view class="pop_root" v-if="!isHidden">
		    <!-- 蒙层 -->
		    <view class="pop_mask" @click="onClickMask"></view>
		    <!-- 弹窗内容 -->
		    <view class="pop_content">
		      <!-- 标题与说明 -->
		      <view class="pop-title">申请获取您的头像、昵称</view>
		      <!-- 头像授权行 -->
		      <view class="form-item">
		        <text class="label">头像：</text>
		        <view class="avatar-container">
		          <button class="pop_avatar" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
		            <image v-if="userInfo.avatar" :src="userInfo.avatar" mode="aspectFill" class="avatar_login"></image>
		            <view v-else class="placeholder">点击选择</view>
		          </button>
		        </view>
		      </view>
		      <!-- 昵称授权行 -->
		      <view class="form-item">
		        <text class="label">昵称：</text>
		        <input 
		          type="nickname" 
		          placeholder="请输入昵称" 
		          class="getNickNameInput"  
		          @blur="getName"
		          v-model="userInfo.nickName"
		        ></input>
		      </view>
		      <!-- 操作按钮 -->
		      <view class="bottom-button">
		        <button class="cancel-btn" @click="onClickCancelButton">拒绝</button>
		        <button class="confirm-btn" @click="onClickConfirmButton">允许</button>
		      </view>
		    </view>
		  </view>
	
		
		
		<!--登录弹窗-->
		

		<!-- 功能菜单 -->
		<view class="menu-section">
			<view class="menu-list">
				<view class="menu-item" @tap="goToRegistrationRecords" v-if="false">
					<text class="iconfont icon-order menu-icon"></text>
					<text class="menu-title">我的报名</text>
					<text class="arrow-right">></text>
				</view>
				<view class="menu-item" @tap="goToFavorites">
					<text class="iconfont icon-star menu-icon"></text>
					<text class="menu-title">我的收藏</text>
					<text class="arrow-right">></text>
				</view>
				<view class="menu-item" @tap="goToSettings">
					<text class="iconfont icon-setting menu-icon"></text>
					<text class="menu-title">账号设置</text>
					<text class="arrow-right">></text>
				</view>
				<view class="menu-item" @tap="goToAbout">
					<text class="iconfont icon-info-circle menu-icon"></text>
					<text class="menu-title">关于我们</text>
					<text class="arrow-right">></text>
				</view>
			</view>
		</view>

		<!-- 退出登录 -->
		<view class="logout-section" v-if="isLoggedIn">
			<button class="logout-btn" @tap="handleLogout">退出登录</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: {
				id: 12345,
				name: '张三',
				avatar: '/static/images/avatar.jpg',
				phone: '138****8888'
			},
			stats: {
				registrationCount: 5,
				favoriteCount: 12,
				completedCount: 3
			},
			isLoggedIn: true,
			isHidden: true
		}
	},
	onShow() {
		this.loadUserInfo()
	},
	computed: {
		userInfo() {
		     return this.$store.state.userInfo; // 自动同步
		   },
		   isLoggedIn() {
			   return this.$store.state.isLoggedIn;
		   }
	},
	methods: {
		getName(e){
			console.log("getName")
			console.log(e)
			this.$data.userInfo.name=e.detail.value
		},
		onChooseAvatar(e){
			console.log("onChooseAvatar")
			console.log(e)
			 // 正确更新数据的方式（Vue3/uni-app方式）
			  this.userInfo = {
			    ...this.userInfo,  // 保留其他用户信息
			    avatar: e.detail.avatarUrl  // 更新头像
			  };
			console.log(this.$data)
		},
		onClickCancelButton(){
			this.$data.isHidden = true
		},
		 setUserData(){
			
			this.$data.isHidden = true
			this.$data.isLoggedIn= true
			uni.setStorageSync('userInfo', this.userInfo) // 如果需要本地存储
			uni.setStorageSync("isLoggedIn", true)
	
		},
		async onClickConfirmButton() {
			// #ifdef MP-WEIXIN
			uni.showLoading({
				title: '微信登录中...'
			})
			try {
				const [err, res] = await uni.login({ provider: 'weixin' })
				console.log("res:-->", res)
				if (res.code) {
					const params = {
						code: res.code
					}
					console.log("params:-->", params)
					// 发送code到后端进行登录
					const loginRes = await this.$api.userApi.wxLogin(params)
					if (loginRes.code === 200) {
						this.$data.isHidden = true
						this.$data.isLoggedIn= true
						await uni.setStorage({
							key: 'userInfo',
							data: this.userInfo,
						});
						await uni.setStorage({
							key: 'isLoggedIn',
							data: true,
						});
						uni.hideLoading()
						uni.showToast({
							title: '微信登录成功',
							icon: 'success'
						})
						setTimeout(() => {
							uni.redirectTo({ url: '/pages/profile/profile' });

							// uni.switchTab({
							// 	url: '/pages/index/index'
							// })
						}, 1500)
					} else {
						uni.hideLoading()
						uni.showToast({
							title: loginRes.message || '微信登录失败',
							icon: 'none'
						})
					}
				} else {
					uni.hideLoading()
					uni.showToast({
						title: '获取微信授权失败',
						icon: 'none'
					})
				}
			} catch (e) {
				uni.hideLoading()
				uni.showToast({
					title: '微信登录异常',
					icon: 'none'
				})
				console.error('微信登录失败', e)
			}
			// #endif
			// #ifndef MP-WEIXIN
			uni.showToast({
				title: '请在微信小程序中打开',
				icon: 'none'
			})
			// #endif
		},
		callLoginPopup(){
			if(!this.isLoggedIn){
				this.$data.isHidden = false
			}
		},
		loadUserInfo() {
			// 从Vuex获取用户信息
			this.userInfo = uni.getStorageSync('userInfo') || {}
			this.isLoggedIn = uni.getStorageSync('isLoggedIn')
			console.log("loadUserInfo", this.userInfo)
			console.log("loadUserInfo:login", this.isLoggedIn)

		},
		goToRegistrationRecords() {
			uni.navigateTo({
				url: '/pages/registration-records/registration-records'
			})
		},
		goToFavorites() {
			uni.switchTab({
				url: '/pages/favorites/favorites'
			})
		},
		goToSettings() {
			uni.navigateTo({
				url: '/pages/settings/settings'
			})
		},
		goToAbout() {
			uni.navigateTo({
				url: '/pages/about/about'
			})
		},
		handleLogout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						this.$store.dispatch('logout').then(() => {
							uni.reLaunch({
								url: '/pages/index/index'
							})
						})
					}
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
/* 蒙层：覆盖全屏，半透明背景 */
.pop_root {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 999;
}
.pop_mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
}

/* 弹窗内容 */
.pop_content {
  width: 100%;
  background: #fff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 标题样式 */
.pop-title {
  font-size: 17px;
  font-weight: bold;
  color: #333;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
  text-align: center;
}

/* 表单项通用布局 */
.form-item {
  display: flex;
  align-items: center;
  margin: 15rpx;
  border-bottom: 1px solid #f5f5f5;
  width: 500rpx;
}
.label {
  font-size: 12px;
  color: #666;
  width: 60px; /* 固定标签宽度 */
  flex-shrink: 0; /* 防止标签被压缩 */
}

/* 输入区域容器 - 实现靠右对齐 */
.input-container {
  flex: 1; /* 占据剩余空间 */
  display: flex;
  justify-content: flex-end; /* 内容靠右 */
}

// /* 头像按钮样式 - 圆形设计 */
// .pop_avatar {
//   width: 40px;
//   height: 40px;
//   border-radius: 50%; /* 圆形头像 */
//   border: 1px solid #eee;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   overflow: hidden;
//   background: #f8f8f8;
//   padding: 0;
//   margin-left: 200rpx;
// }

/* 头像图片样式 */
.avatar_login {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

/* 未选择头像时的占位文字 - 靠右显示 */
.placeholder {
  font-size: 12px;
  color: #999;
  text-align: right; /* 文字靠右 */
  width: 100%;
  padding-right: 8px; /* 适当右内边距 */
}

/* 昵称输入框样式 - 靠右显示 */
.getNickNameInput {
  width: 100%;
  height: 25px;
  line-height: 36px;
  font-size: 15px;
  color: #333;
  text-align: right; /* 输入文本靠右 */
  padding: 0 8px;
  margin: 0;
  border: none;
}

/* 底部按钮栏 */
.bottom-button {
  display: flex;
  margin-top: 12px;
}
.bottom-button button {
  flex: 1;
  height: 48px;
  line-height: 48px;
  text-align: center;
  font-size: 17px;
  border: none;
  outline: none;
  margin: 0 8px 16px;
  border-radius: 8px;
}

/* 拒绝按钮 */
.cancel-btn {
  color: #666;
  background: #f5f5f5;
}

/* 允许按钮 */
.confirm-btn {
  color: #fff;
  background: #27d76c;
}
    



	.getNickNameInput{
		border-color: #f0f0f0;
		border-style: solid;
		border-radius: 15rpx;
		text-align: center;
		margin-bottom: 30rpx;
		height: 100rpx;
	}
	.cancel-btn{
		margin-right: 200rpx;
		width: 200rpx;
	}
	.confirm-btn{
		width: 200rpx;
		background: limegreen;
		color: white;
	}
	/* 头像选择按钮 */
.pop_avatar {
	

	background: #f8f8f8;
	margin-left: 200rpx;
	
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  // margin: 0 auto 30rpx;
  padding: 0;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  border: 2rpx dashed #ddd;
}
	.bottom-button{
		display: flex;
		flex-direction: row;
	}
	.pop_root{
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgb(0, 0, 0, 0.6);
	
		
	}
	
	.pop_content{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: white;
		border-top-right-radius: 30rpx;
		border-top-left-radius: 30rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
	}
.pop-tip{
	font-size: 32rpx;
	margin-top: 30rpx;
	margin-bottom: 30rpx;
}
.container {
	background-color: #f5f5f5;
	min-height: 100vh;
	padding-bottom: 40rpx;
}
.user-info {
	background: linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%);
	color: #fff;
	padding: 60rpx 40rpx 40rpx;
	margin-bottom: 20rpx;
}

.avatar-section {
	display: flex;
	align-items: center;
	margin-bottom: 40rpx;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	border: 4rpx solid rgba(255, 255, 255, 0.3);
}
.avatar_login {
	width: 180rpx;
	height: 180rpx;
	border-radius: 50%;
	border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.user-details {
	margin-left: 30rpx;
}

.username {
	font-size: 36rpx;
	font-weight: bold;
	display: block;
	margin-bottom: 10rpx;
}

.user-id {
	font-size: 24rpx;
	opacity: 0.8;
}

.stats-section {
	display: flex;
	justify-content: space-around;
}

.stat-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20rpx;
}

.stat-number {
	font-size: 36rpx;
	font-weight: bold;
	margin-bottom: 10rpx;
}

.stat-label {
	font-size: 24rpx;
	opacity: 0.9;
}

.menu-section {
	background: #fff;
	margin-bottom: 20rpx;
}

.menu-list {
	padding: 0 30rpx;
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 30rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-icon {
	font-size: 32rpx;
	margin-right: 20rpx;
	color: #007AFF;
}

.menu-title {
	flex: 1;
	font-size: 30rpx;
	color: #333;
}

.arrow-right {
	color: #999;
	font-size: 28rpx;
}

.logout-section {
	padding: 40rpx;
}

.logout-btn {
	width: 100%;
	height: 88rpx;
	background-color: #ff4757;
	color: #fff;
	border-radius: 44rpx;
	font-size: 32rpx;
	border: none;
}

.logout-btn:active {
	background-color: #ff3838;
}
</style>