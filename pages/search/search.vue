<template>
	<view class="container">
		<!-- 搜索栏 -->
		<view class="search-header">
			<u-search 
				placeholder="搜索马拉松赛事" 
				v-model="searchKeyword"
				:show-action="true"
				action-text="搜索"
				@search="handleSearch"
				@custom="handleSearch"
			></u-search>
		</view>

		<!-- 搜索历史 -->
		<view class="search-history" v-if="searchHistory.length > 0 && !searchKeyword">
			<view class="history-header">
				<text class="history-title">搜索历史</text>
				<text class="clear-btn" @click="clearHistory">清空</text>
			</view>
			<view class="history-tags">
				<u-tag 
					v-for="(item, index) in searchHistory" 
					:key="index"
					:text="item" 
					mode="light" 
					@close="removeHistory(index)"
					closeable
				></u-tag>
			</view>
		</view>

		<!-- 热门搜索 -->
		<view class="hot-search" v-if="!searchKeyword">
			<view class="hot-header">
				<text class="hot-title">热门搜索</text>
			</view>
			<view class="hot-tags">
				<u-tag 
					v-for="(item, index) in hotKeywords" 
					:key="index"
					:text="item" 
					mode="light"
					@click="selectKeyword(item)"
				></u-tag>
			</view>
		</view>

		<!-- 搜索结果 -->
		<view class="search-results" v-if="searchKeyword">
			<view class="filter-section">
				<u-dropdown>
					<u-dropdown-item v-model="filter.city" title="城市" :options="cityOptions"></u-dropdown-item>
					<u-dropdown-item v-model="filter.type" title="类型" :options="typeOptions"></u-dropdown-item>
					<u-dropdown-item v-model="filter.price" title="价格" :options="priceOptions"></u-dropdown-item>
					<u-dropdown-item v-model="filter.date" title="时间" :options="dateOptions"></u-dropdown-item>
				</u-dropdown>
			</view>

			<view class="result-list">
				<event-card 
					v-for="event in searchResults" 
					:key="event.id" 
					:event="event"
					@click="goToEventDetail(event.id)"
				></event-card>
			</view>

			<!-- 加载更多 -->
			<u-loadmore 
				:status="loadStatus" 
				@loadmore="loadMore"
				v-if="searchResults.length > 0"
			></u-loadmore>

			<!-- 空状态 -->
			<view v-if="searchResults.length === 0 && loading === false" class="empty-state">
				<u-empty text="暂无相关赛事" mode="search"></u-empty>
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

.search-header {
	background: #fff;
	padding: 20rpx;
}

.search-history,
.hot-search {
	background: #fff;
	margin: 20rpx 0;
	padding: 30rpx;
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
	font-size: 28rpx;
	color: #999;
}

.history-tags,
.hot-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.search-results {
	padding: 20rpx;
}

.filter-section {
	background: #fff;
	margin-bottom: 20rpx;
	border-radius: 8rpx;
}

.result-list {
	margin-bottom: 20rpx;
}

.empty-state {
	padding: 200rpx 0;
}
</style>