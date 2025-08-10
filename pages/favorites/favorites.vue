<template>
	<view class="container">
		<!-- 顶部导航 -->
		<view class="navbar">
			<text class="nav-title">我的收藏</text>
		</view>

		<!-- 收藏列表 -->
		<view class="content">
			<view v-if="favoriteList.length > 0" class="event-list">
				<event-card 
					v-for="event in favoriteList" 
					:key="event.id" 
					:event="event"
					@tap="goToEventDetail(event.id)"
				></event-card>
			</view>

			<!-- 空状态 -->
			<view v-else class="empty-state">
				<image class="empty-icon" src="/static/images/empty-favor.png" mode="aspectFit"></image>
				<text class="empty-text">暂无收藏的赛事</text>
				<button class="search-btn" @tap="goToSearch">去发现赛事</button>
			</view>
		</view>
	</view>
</template>

<script>
import EventCard from '@/components/EventCard.vue'

export default {
	components: {
		EventCard
	},
	data() {
		return {
			favoriteList: [
				{
					id: 1,
					title: '2024北京马拉松',
					date: '2024-10-20',
					location: '北京市',
					price: 200,
					image: '/static/images/events/beijing.jpg',
					status: '报名中'
				},
				{
					id: 2,
					title: '2024上海马拉松',
					date: '2024-11-10',
					location: '上海市',
					price: 180,
					image: '/static/images/events/shanghai.jpg',
					status: '报名中'
				}
			]
		}
	},
	onShow() {
		this.loadFavorites()
	},
	methods: {
		loadFavorites() {
			// 从本地存储或API获取收藏列表
			const favorites = uni.getStorageSync('favorites') || []
			this.favoriteList = favorites
		},
		goToEventDetail(id) {
			uni.navigateTo({
				url: `/pages/event-detail/event-detail?id=${id}`
			})
		},
		goToSearch() {
			uni.switchTab({
				url: '/pages/search/search'
			})
		},
		removeFavorite(id) {
			// 移除收藏
			const index = this.favoriteList.findIndex(item => item.id === id)
			if (index > -1) {
				this.favoriteList.splice(index, 1)
				uni.setStorageSync('favorites', this.favoriteList)
				uni.showToast({
					title: '已取消收藏',
					icon: 'success'
				})
			}
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

.content {
	padding: 20rpx;
}

.event-list {
	padding: 20rpx 0;
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