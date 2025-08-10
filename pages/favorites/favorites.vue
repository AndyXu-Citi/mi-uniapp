<template>
	<view class="container">
		<!-- 顶部导航 -->
		<u-navbar title="我的收藏" :is-back="false"></u-navbar>

		<!-- 收藏列表 -->
		<view class="content">
			<view v-if="favoriteList.length > 0" class="event-list">
				<event-card 
					v-for="event in favoriteList" 
					:key="event.id" 
					:event="event"
					@click="goToEventDetail(event.id)"
				></event-card>
			</view>

			<!-- 空状态 -->
			<view v-else class="empty-state">
				<u-empty text="暂无收藏的赛事" mode="favor"></u-empty>
				<u-button type="primary" @click="goToSearch" class="search-btn">去发现赛事</u-button>
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

.search-btn {
	margin-top: 40rpx;
	width: 200rpx;
}
</style>