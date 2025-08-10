<template>
	<view class="container">
		<!-- 搜索栏 -->
		<view class="search-header">
			<view class="search-bar">
				<text class="iconfont icon-search search-icon"></text>
				<input 
					class="search-input"
					v-model="searchKeyword"
					placeholder="搜索马拉松赛事"
					@confirm="handleSearch"
				/>
				<text class="search-btn" @tap="handleSearch">搜索</text>
			</view>
		</view>

		<!-- 搜索历史 -->
		<view class="search-history" v-if="searchHistory.length > 0 && !searchKeyword">
			<view class="history-header">
				<text class="history-title">搜索历史</text>
				<text class="clear-btn" @tap="clearHistory">清空</text>
			</view>
			<view class="history-tags">
				<view 
					class="tag-item"
					v-for="(item, index) in searchHistory" 
					:key="index"
				>
					<text @tap="selectKeyword(item)">{{ item }}</text>
					<text class="close-btn" @tap="removeHistory(index)">×</text>
				</view>
			</view>
		</view>

		<!-- 热门搜索 -->
		<view class="hot-search" v-if="!searchKeyword">
			<view class="hot-header">
				<text class="hot-title">热门搜索</text>
			</view>
			<view class="hot-tags">
				<view 
					class="tag-item"
					v-for="(item, index) in hotKeywords" 
					:key="index"
					@tap="selectKeyword(item)"
				>
					{{ item }}
				</view>
			</view>
		</view>

		<!-- 搜索结果 -->
		<view class="search-results" v-if="searchKeyword">
			<view class="filter-section">
				<view class="filter-tabs">
					<view 
						class="filter-tab"
						v-for="(options, key) in filterOptions"
						:key="key"
						@tap="showFilter(key)"
					>
						{{ getFilterTitle(key) }}
					</view>
				</view>
			</view>

			<view class="result-list">
				<event-card 
					v-for="event in searchResults" 
					:key="event.id" 
					:event="event"
					@tap="goToEventDetail(event.id)"
				></event-card>
			</view>

			<!-- 加载更多 -->
			<view 
				class="load-more"
				v-if="searchResults.length > 0 && loadStatus === 'loadmore'"
				@tap="loadMore"
			>
				点击加载更多
			</view>

			<!-- 空状态 -->
			<view v-if="searchResults.length === 0 && loading === false" class="empty-state">
				<image class="empty-icon" src="/static/images/empty-search.png" mode="aspectFit"></image>
				<text class="empty-text">暂无相关赛事</text>
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
			searchKeyword: '',
			searchHistory: [],
			hotKeywords: ['北京马拉松', '上海马拉松', '广州马拉松', '深圳马拉松', '杭州马拉松'],
			searchResults: [],
			loading: false,
			loadStatus: 'loadmore',
			filter: {
				city: '',
				type: '',
				price: '',
				date: ''
			},
			cityOptions: [
				{ label: '全部', value: '' },
				{ label: '北京', value: '北京' },
				{ label: '上海', value: '上海' },
				{ label: '广州', value: '广州' },
				{ label: '深圳', value: '深圳' }
			],
			typeOptions: [
				{ label: '全部', value: '' },
				{ label: '全程马拉松', value: 'full' },
				{ label: '半程马拉松', value: 'half' },
				{ label: '迷你马拉松', value: 'mini' }
			],
			priceOptions: [
				{ label: '全部', value: '' },
				{ label: '0-100元', value: '0-100' },
				{ label: '100-200元', value: '100-200' },
				{ label: '200元以上', value: '200+' }
			],
			dateOptions: [
				{ label: '全部', value: '' },
				{ label: '本周', value: 'this-week' },
				{ label: '本月', value: 'this-month' },
				{ label: '下月', value: 'next-month' }
			]
		}
	},
	onLoad(options) {
		if (options.keyword) {
			this.searchKeyword = options.keyword
			this.handleSearch()
		}
		this.loadSearchHistory()
	},
	methods: {
		loadSearchHistory() {
			this.searchHistory = uni.getStorageSync('searchHistory') || []
		},
		saveSearchHistory(keyword) {
			if (!keyword.trim()) return
			let history = this.searchHistory.filter(item => item !== keyword)
			history.unshift(keyword)
			if (history.length > 10) history = history.slice(0, 10)
			this.searchHistory = history
			uni.setStorageSync('searchHistory', history)
		},
		removeHistory(index) {
			this.searchHistory.splice(index, 1)
			uni.setStorageSync('searchHistory', this.searchHistory)
		},
		clearHistory() {
			this.searchHistory = []
			uni.removeStorageSync('searchHistory')
		},
		selectKeyword(keyword) {
			this.searchKeyword = keyword
			this.handleSearch()
		},
		handleSearch() {
			if (!this.searchKeyword.trim()) return
			
			this.saveSearchHistory(this.searchKeyword)
			this.loading = true
			
			// 模拟搜索
			setTimeout(() => {
				this.searchResults = [
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
				this.loading = false
			}, 1000)
		},
		goToEventDetail(id) {
			uni.navigateTo({
				url: `/pages/event-detail/event-detail?id=${id}`
			})
		},
		loadMore() {
			// 加载更多数据
			console.log('加载更多')
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	background-color: #f5f5f5;
	min-height: 100vh;
}

.container {
	background-color: #f5f5f5;
	min-height: 100vh;
}

.search-header {
	background: #fff;
	padding: 20rpx;
	position: sticky;
	top: 0;
	z-index: 100;
}

.search-bar {
	display: flex;
	align-items: center;
	background-color: #f5f5f5;
	border-radius: 40rpx;
	padding: 20rpx 30rpx;
}

.search-icon {
	font-size: 32rpx;
	color: #999;
	margin-right: 20rpx;
}

.search-input {
	flex: 1;
	font-size: 28rpx;
	border: none;
	background: transparent;
}

.search-btn {
	color: #007AFF;
	font-size: 28rpx;
	margin-left: 20rpx;
}

.search-history,
.hot-search {
	background: #fff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.history-header,
.hot-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.history-title,
.hot-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.clear-btn {
	color: #999;
	font-size: 28rpx;
}

.history-tags,
.hot-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.tag-item {
	display: flex;
	align-items: center;
	background-color: #f5f5f5;
	border-radius: 20rpx;
	padding: 10rpx 20rpx;
	font-size: 24rpx;
	color: #666;
}

.close-btn {
	margin-left: 10rpx;
	color: #999;
	font-size: 24rpx;
}

.search-results {
	padding: 20rpx;
}

.filter-section {
	background: #fff;
	margin-bottom: 20rpx;
	border-radius: 8rpx;
}

.filter-tabs {
	display: flex;
	justify-content: space-around;
	padding: 20rpx 0;
}

.filter-tab {
	padding: 20rpx 30rpx;
	font-size: 28rpx;
	color: #666;
	border-bottom: 2rpx solid transparent;
}

.filter-tab.active {
	color: #007AFF;
	border-bottom-color: #007AFF;
}

.result-list {
	padding: 0 20rpx;
	margin-bottom: 20rpx;
}

.load-more {
	text-align: center;
	padding: 40rpx;
	color: #999;
	font-size: 28rpx;
}

.empty-state {
	text-align: center;
	padding: 100rpx 0;
}

.empty-icon {
	width: 200rpx;
	height: 200rpx;
	margin-bottom: 20rpx;
}

.empty-text {
	color: #999;
	font-size: 28rpx;
}
</style>