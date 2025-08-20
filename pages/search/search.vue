<template>
	<view>
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
					@input="onSearchInput"
				/>
				<text class="search-btn" @tap="handleSearch">搜索</text>
			</view>
		</view>
		
		<!-- 搜索条件 -->
		<view class="search-condition">
		  <scroll-view scroll-x="true" class="scroll-container" scroll-with-animation>
		    <view 
		          class="scroll-item" 
		          :class="{active: activeCondition === 'hot'}"
		          @tap="handleConditionSearch('hot')"
		        >热门赛事</view>
			<view 
			      class="scroll-item"
			      :class="{active: activeCondition === 'signup'}"
			      @tap="handleConditionSearch('signup')"
			      >报名中</view>
			<view class="scroll-item" 
		            :class="{active: activeCondition === 'nearby'}"
			      @tap="handleConditionSearch('nearby')"
			      >离我最近</view>
			<view
				      class="scroll-item"
				      :class="{active: activeCondition === 'startsoon'}"
				      @tap="handleConditionSearch('startsoon')"
				>即将开始</view>
		    <view class="scroll-item" @tap="showFilterPopup">筛选</view>
		  </scroll-view>
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
		<view class="search-results" v-if="showResults">
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
		
		<!-- 筛选弹窗 -->
	<u-popup :show="showFilter" mode="bottom" border-radius="20" @close="closeFilterPopup">
		<view class="filter-popup">
			<view class="filter-header">
				<text class="filter-title">筛选条件</text>
				<text class="filter-close" @tap="closeFilterPopup">×</text>
			</view>
			
			<view class="filter-content">
				<view class="filter-item">
					<text class="filter-label">比赛地点</text>
					<view class="filter-options">
						<view 
							v-for="item in cityOptions" 
							:key="item.value"
							class="filter-option"
							:class="{active: filter.city === item.value}"
							@tap="selectFilter('city', item.value)"
						>
							{{ item.label }}
						</view>
					</view>
				</view>
				
				<view class="filter-item">
					<text class="filter-label">赛事类型</text>
					<view class="filter-options">
						<view 
							v-for="item in typeOptions" 
							:key="item.value"
							class="filter-option"
							:class="{active: filter.type === item.value}"
							@tap="selectFilter('type', item.value)"
						>
							{{ item.label }}
						</view>
					</view>
				</view>
				
				<view class="filter-item">
					<text class="filter-label">比赛状态</text>
					<view class="filter-options">
						<view 
							class="filter-option"
							:class="{active: filter.status === ''}"
							@tap="selectFilter('status', '')"
						>
							全部
						</view>
						<view 
							class="filter-option"
							:class="{active: filter.status === '1'}"
							@tap="selectFilter('status', '1')"
						>
							未开始
						</view>
						<view 
							class="filter-option"
							:class="{active: filter.status === '2'}"
							@tap="selectFilter('status', '2')"
						>
							报名中
						</view>
						<view 
							class="filter-option"
							:class="{active: filter.status === '5'}"
							@tap="selectFilter('status', '5')"
						>
							已结束
						</view>
					</view>
				</view>
			</view>
			
			<view class="filter-footer">
				<view class="filter-btn filter-reset" @tap="resetFilter">重置</view>
				<view class="filter-btn filter-confirm" @tap="confirmFilter">确定</view>
			</view>
		</view>
	</u-popup>
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
			activeCondition: '', // 当前激活的条件
			searchKeyword: '',
			searchHistory: [],
			hotKeywords: ['北京马拉松', '上海马拉松', '广州马拉松', '深圳马拉松', '杭州马拉松'],
			searchResults: [
				{
      "id": 1,
      "title": "2024北京马拉松",
      "date": "2024-10-20",
      "location": "北京市",
      "price": 200,
      "image": "/static/images/events/beijing.jpg",
      "status": "报名中"
    },
    {
      "id": 2,
      "title": "2024上海马拉松",
      "date": "2024-11-10",
      "location": "上海市",
      "price": 180,
      "image": "/static/images/events/shanghai.jpg",
      "status": "报名中"
    }
			],
			loading: false,
			loadStatus: 'loadmore',
			showFilter: false, // 显示筛选弹窗
			showResults: true, // 显示搜索结果
			filter: {
				city: '',
				type: '',
				status: '',
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
				{ label: '全程马拉松', value: '1' },
				{ label: '半程马拉松', value: '2' },
				{ label: '健康跑', value: '3' },
				{ label: '越野跑', value: '4' },
				{ label: '其他', value: '5' }
			],
			pageNum: 1,
			pageSize: 10,
			hasMore: true
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
			this.activeCondition = '' // 清空条件筛选
			this.resetFilterData()
			this.handleSearch()
		},
		onSearchInput() {
			// 当用户输入搜索关键词时，清空其他筛选条件
			if (this.searchKeyword) {
				this.activeCondition = ''
				this.resetFilterData()
			}
		},
		// 搜索框搜索
		async handleSearch() {
			if (!this.searchKeyword.trim()) {
				this.showResults = false
				return
			}
			
			this.saveSearchHistory(this.searchKeyword)
			await this.performSearch()
		},
		// 条件搜索
		async handleConditionSearch(type) {
			// 清空搜索框
			this.searchKeyword = ''
			this.activeCondition = type
			
			await this.performSearch()
		},
		// 执行搜索
		async performSearch() {
			this.loading = true
			this.pageNum = 1
			
			try {
				const params = this.buildSearchParams()
				
				let res
				if (this.activeCondition === 'hot') {
					res = await this.$api.eventApi.getHotEvents()
				} else if (this.activeCondition === 'startsoon') {
					res = await this.$api.eventApi.getupComingEvents()
				} else {
					res = await this.$api.eventApi.searchEvents(params)
				}
				
				if (res.code === 200) {
					this.searchResults = res.data.searchResults || res.data || []
					this.hasMore = res.data.total > this.pageNum * this.pageSize
					this.showResults = true
				}
			} catch (error) {
				console.error('搜索失败:', error)
				uni.showToast({
					title: '搜索失败，请重试',
					icon: 'none'
				})
			} finally {
				this.loading = false
			}
		},
		// 构建搜索参数
		buildSearchParams() {
			const params = {
				pageNum: this.pageNum,
				pageSize: this.pageSize
			}
			
			if (this.searchKeyword) {
				params.keyword = this.searchKeyword
			}
			
			if (this.filter.city) {
				params.city = this.filter.city
			}
			
			if (this.filter.type) {
				params.type = this.filter.type
			}
			
			if (this.filter.status) {
				params.status = this.filter.status
			}
			
			return params
		},
		// 显示筛选弹窗
		showFilterPopup() {
			this.showFilter = true
		},
		// 关闭筛选弹窗
		closeFilterPopup() {
			this.showFilter = false
		},
		// 选择筛选条件
		selectFilter(key, value) {
			this.filter[key] = value
		},
		// 重置筛选
		resetFilter() {
			this.filter = {
				city: '',
				type: '',
				status: '',
				date: ''
			}
		},
		// 重置筛选数据
		resetFilterData() {
			this.filter = {
				city: '',
				type: '',
				status: '',
				date: ''
			}
		},
		// 确认筛选
		async confirmFilter() {
			this.closeFilterPopup()
			this.searchKeyword = '' // 清空搜索框
			this.activeCondition = '' // 清空条件筛选
			await this.performSearch()
		},
		// 加载更多
		async loadMore() {
			if (!this.hasMore || this.loading) return
			
			this.pageNum++
			this.loading = true
			
			try {
				const params = this.buildSearchParams()
				const res = await this.$api.eventApi.searchEvents(params)
				
				if (res.code === 200) {
					const newResults = res.data.records || []
					this.searchResults = [...this.searchResults, ...newResults]
					this.hasMore = res.data.total > this.pageNum * this.pageSize
				}
			} catch (error) {
				console.error('加载更多失败:', error)
			} finally {
				this.loading = false
			}
		},
		goToEventDetail(id) {
			uni.navigateTo({
				url: `/pages/event-detail/event-detail?id=${id}`
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

.search-header {
	background: #fff;
	padding: 20rpx;
	position: sticky;
	top: 0;
	z-index: 100;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
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

/* 搜索条件样式 */
.search-condition {
	width: 100%;
	padding: 20rpx 0;
	background-color: #fff;
	white-space: nowrap;
	border-bottom: 1rpx solid #eee;
}

.scroll-container {
	width: 100%;
	white-space: nowrap;
	padding: 0 20rpx;
}

.scroll-item {
	display: inline-block;
	padding: 15rpx 30rpx;
	margin-right: 20rpx;
	border-radius: 30rpx;
	font-size: 28rpx;
	color: #666;
	background-color: #f5f5f5;
	transition: all 0.3s ease;
}

.scroll-item.active {
	color: #fff;
	background-color: #007AFF;
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

/* 筛选弹窗样式 */
.filter-popup {
	padding: 30rpx;
}

.filter-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 40rpx;
}

.filter-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.filter-close {
	font-size: 40rpx;
	color: #999;
}

.filter-item {
	margin-bottom: 40rpx;
}

.filter-label {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.filter-options {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.filter-option {
	padding: 15rpx 30rpx;
	border-radius: 30rpx;
	background-color: #f5f5f5;
	font-size: 28rpx;
	color: #666;
	transition: all 0.3s ease;
}

.filter-option.active {
	background-color: #007AFF;
	color: #fff;
}

.filter-footer {
	display: flex;
	gap: 20rpx;
	margin-top: 40rpx;
}

.filter-btn {
	flex: 1;
	height: 80rpx;
	border-radius: 40rpx;
	font-size: 32rpx;
	border: none;
	text-align: center;
	line-height: 80rpx;
}

.reset-btn {
	background-color: #f5f5f5;
	color: #666;
}

.confirm-btn {
	background-color: #007AFF;
	color: #fff;
}
</style>