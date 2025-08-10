<template>
	<view class="container">
		<!-- 顶部导航 -->
		<u-navbar title="报名记录" :is-back="false"></u-navbar>

		<!-- 筛选标签 -->
		<view class="filter-tabs">
			<u-tabs :list="tabList" v-model="currentTab" active-color="#007AFF" inactive-color="#666"></u-tabs>
		</view>

		<!-- 报名列表 -->
		<view class="content">
			<view v-if="registrationList.length > 0" class="registration-list">
				<view 
					v-for="item in filteredRegistrations" 
					:key="item.id" 
					class="registration-card"
					@click="goToRegistrationDetail(item.id)"
				>
					<view class="event-info">
						<u-image :src="item.event.image" width="120" height="80" mode="aspectFill"></u-image>
						<view class="event-details">
							<text class="event-title">{{ item.event.title }}</text>
							<text class="event-date">{{ item.event.date }}</text>
							<text class="event-location">{{ item.event.location }}</text>
						</view>
					</view>
					<view class="registration-status">
						<u-tag :text="item.status" :type="getStatusType(item.status)" size="mini"></u-tag>
						<text class="registration-time">报名时间：{{ item.registrationTime }}</text>
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<view v-else class="empty-state">
				<u-empty text="暂无报名记录" mode="list"></u-empty>
				<u-button type="primary" @click="goToSearch" class="search-btn">去发现赛事</u-button>
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
		getStatusType(status) {
			const typeMap = {
				'报名成功': 'success',
				'待付款': 'warning',
				'已完成': 'info',
				'已取消': 'error'
			}
			return typeMap[status] || 'primary'
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

.filter-tabs {
	background: #fff;
	margin-bottom: 20rpx;
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

.search-btn {
	margin-top: 40rpx;
	width: 200rpx;
}
</style>