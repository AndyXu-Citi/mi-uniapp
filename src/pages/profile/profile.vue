<template>
	<view class="container">
		<!-- 用户信息 -->
		<view class="user-info">
			<view class="avatar-section">
				<u-avatar :src="userInfo.avatar || '/static/images/default-avatar.png'" size="120"></u-avatar>
				<view class="user-details">
					<text class="username">{{ userInfo.name || '未登录' }}</text>
					<text class="user-id">ID: {{ userInfo.id || '000000' }}</text>
				</view>
			</view>
			<view class="stats-section">
				<view class="stat-item" @click="goToRegistrationRecords">
					<text class="stat-number">{{ stats.registrationCount }}</text>
					<text class="stat-label">已报名</text>
				</view>
				<view class="stat-item" @click="goToFavorites">
					<text class="stat-number">{{ stats.favoriteCount }}</text>
					<text class="stat-label">收藏</text>
				</view>
				<view class="stat-item">
					<text class="stat-number">{{ stats.completedCount }}</text>
					<text class="stat-label">已完成</text>
				</view>
			</view>
		</view>

		<!-- 功能菜单 -->
		<view class="menu-section">
			<u-cell-group>
				<u-cell-item 
					icon="order" 
					title="我的报名" 
					@click="goToRegistrationRecords"
					arrow-direction="right"
				></u-cell-item>
				<u-cell-item 
					icon="star" 
					title="我的收藏" 
					@click="goToFavorites"
					arrow-direction="right"
				></u-cell-item>
				<u-cell-item 
					icon="setting" 
					title="账号设置" 
					@click="goToSettings"
					arrow-direction="right"
				></u-cell-item>
				<u-cell-item 
					icon="info-circle" 
					title="关于我们" 
					@click="goToAbout"
					arrow-direction="right"
				></u-cell-item>
			</u-cell-group>
		</view>

		<!-- 退出登录 -->
		<view class="logout-section" v-if="isLoggedIn">
			<u-button type="error" @click="handleLogout">退出登录</u-button>
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
			isLoggedIn: true
		}
	},
	onShow() {
		this.loadUserInfo()
	},
	computed: {
		
	},
	methods: {
		loadUserInfo() {
			// 从Vuex获取用户信息
			this.userInfo = this.$store.getters.userInfo || {}
			this.isLoggedIn = this.$store.getters.isLoggedIn
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

.logout-section {
	padding: 40rpx;
}
</style>