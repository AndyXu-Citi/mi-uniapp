<template>
	<view class="container">
		<!-- 顶部导航 -->
		<view class="navbar">
			<text class="nav-title">报名记录</text>
		</view>

		<!-- 筛选标签 -->
		<view class="filter-tabs">
			<view class="tab-list">
				<view 
					class="tab-item"
					v-for="(tab, index) in tabList" 
					:key="index"
					:class="{ active: currentTab === index }"
					@tap="currentTab = index"
				>
					{{ tab.name }}
				</view>
			</view>
		</view>

		<!-- 报名列表 -->
		<view class="content">
			<view v-if="registrationList.length > 0" class="registration-list">
				<view 
					v-for="item in filteredRegistrations" 
					:key="item.id" 
					class="registration-card"
					@tap="goToRegistrationDetail(item.id)"
				>
					<view class="event-info">
						<image :src="item.event.image" class="event-image" mode="aspectFill"></image>
						<view class="event-details">
							<text class="event-title">{{ item.event.title }}</text>
							<text class="event-date">{{ item.event.date }}</text>
							<text class="event-location">{{ item.event.location }}</text>
						</view>
					</view>
					<view class="registration-status">
						<text class="status-tag" :class="getStatusClass(item.status)">{{ item.status }}</text>
						<text class="registration-time">报名时间：{{ item.registrationTime }}</text>
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<view v-else class="empty-state">
				<image class="empty-icon" src="/static/images/empty-list.png" mode="aspectFit"></image>
				<text class="empty-text">暂无报名记录</text>
				<button class="search-btn" @tap="goToSearch">去发现赛事</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentTab: 0,
			tabList: [
				{ name: '全部' },
				{ name: '报名成功' },
				{ name: '待付款' },
				{ name: '已完成' },
				{ name: '已取消' }
			],
			registrationList: [
				{
					id: 1,
					event: {
						id: 1,
						title: '2024北京马拉松',
						date: '2024-10-20',
						location: '北京市',
						image: '/static/images/events/beijing.jpg'
					},
					status: '报名成功',
					registrationTime: '2024-08-15 10:30:00',
					price: 200,
					orderNumber: 'BM202408151030001'
				},
				{
					id: 2,
					event: {
						id: 2,
						title: '2024上海马拉松',
						date: '2024-11-10',
						location: '上海市',
						image: '/static/images/events/shanghai.jpg'
					},
					status: '已完成',
					registrationTime: '2024-07-20 14:20:00',
					price: 180,
					orderNumber: 'BM202407201420002'
				},
				{
					id: 3,
					event: {
						id: 3,
						title: '2024广州马拉松',
						date: '2024-12-08',
						location: '广州市',
						image: '/static/images/events/guangzhou.jpg'
					},
					status: '待付款',
					registrationTime: '2024-08-25 09:15:00',
					price: 150,
					orderNumber: 'BM202408250915003'
				}
			]
		}
	},
	computed: {
		filteredRegistrations() {
			const statusMap = ['', '报名成功', '待付款', '已完成', '已取消']
			const filterStatus = statusMap[this.currentTab]
			
			if (!filterStatus) {
				return this.registrationList
			}
			
			return this.registrationList.filter(item => item.status === filterStatus)
		}
	},
	onLoad() {
		this.loadRegistrations()
	},
	methods: {
		loadRegistrations() {
			// 从API获取报名记录
			console.log('加载报名记录')
		},
		getStatusClass(status) {
			const classMap = {
				'报名成功': 'status-success',
				'待付款': 'status-warning',
				'已完成': 'status-info',
				'已取消': 'status-error'
			}
			return classMap[status] || 'status-primary'
		},
		goToRegistrationDetail(id) {
			uni.navigateTo({
				url: `/pages/registration/registration?id=${id}`
			})
		},
		goToSearch() {
			uni.switchTab({
				url: '/pages/search/search'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	background-color: #f5f5f5;
	min-height: 100vh;
}

.navbar {
	height: 88rpx;
	background-color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	border-bottom: 1rpx solid #f0f0f0;
	position: sticky;
	top: 0;
	z-index: 100;
}

.nav-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.filter-tabs {
	background: #fff;
	margin-bottom: 20rpx;
}

.tab-list {
	display: flex;
	justify-content: space-around;
	align-items: center;
	padding: 0 20rpx;
}

.tab-item {
	padding: 20rpx 0;
	font-size: 28rpx;
	color: #666;
	border-bottom: 2rpx solid transparent;
}

.tab-item.active {
	color: #007AFF;
	border-bottom-color: #007AFF;
}

.content {
	padding: 20rpx;
}

.registration-list {
	padding: 20rpx 0;
}

.registration-card {
	background: #fff;
	border-radius: 8rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.event-info {
	display: flex;
	margin-bottom: 20rpx;
}

.event-image {
	width: 120rpx;
	height: 80rpx;
	border-radius: 8rpx;
}

.event-details {
	flex: 1;
	margin-left: 20rpx;
}

.event-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 10rpx;
}

.event-date,
.event-location {
	font-size: 26rpx;
	color: #666;
	display: block;
	margin-bottom: 5rpx;
}

.registration-status {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.status-tag {
	padding: 5rpx 15rpx;
	border-radius: 15rpx;
	font-size: 24rpx;
	color: #fff;
}

.status-success {
	background-color: #52c41a;
}

.status-warning {
	background-color: #faad14;
	color: #333;
}

.status-info {
	background-color: #1890ff;
}

.status-error {
	background-color: #ff4d4f;
}

.registration-time {
	font-size: 24rpx;
	color: #999;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 200rpx 40rpx;
}

.empty-icon {
	width: 200rpx;
	height: 200rpx;
	margin-bottom: 20rpx;
}

.empty-text {
	color: #999;
	font-size: 28rpx;
	margin-bottom: 40rpx;
}

.search-btn {
	width: 200rpx;
	height: 70rpx;
	background-color: #007AFF;
	color: #fff;
	border-radius: 35rpx;
	font-size: 28rpx;
	border: none;
}

.search-btn:active {
	background-color: #0066cc;
}
</style>