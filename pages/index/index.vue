<template>
	<view class="container">
		<!-- 轮播图 -->
		<view class="banner-section">
			<swiper class="banner-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="(item, index) in bannerList" :key="index" @click="goToEventDetail(item.eventId)">
					<image :src="item.image" class="banner-image" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</view>

		<!-- 搜索栏 -->
		<view class="search-section">
			<view class="search-bar">
				<text class="iconfont icon-search"></text>
				<input 
					class="search-input"
					v-model="searchKeyword"
					placeholder="搜索马拉松赛事"
					@confirm="handleSearch"
				/>
			</view>
		</view>

		<!-- 分类导航 -->
		<view class="category-section">
			<view class="category-grid">
				<view class="category-item" v-for="(item, index) in categoryList" :key="index" @tap="handleCategoryClick(item)">
					<image :src="item.icon" class="category-icon" mode="aspectFit"></image>
					<text class="category-name">{{ item.name }}</text>
				</view>
			</view>
		</view>

		<!-- 热门赛事 -->
		<view class="section">
			<view class="section-header">
				<text class="section-title">热门赛事</text>
				<text class="more-text" @click="handleMoreEvents">更多 ></text>
			</view>
			<view class="event-list">
				<event-card 
					v-for="event in hotEvents" 
					:key="event.id" 
					:event="event"
					@click="goToEventDetail(event.id)"
				></event-card>
			</view>
		</view>

		<!-- 火热报名中 -->
		<view class="section">
			<view class="section-header">
				<text class="section-title">火热报名中</text>
				<text class="more-text" @click="handleMoreEvents">更多 ></text>
			</view>
			<view class="event-list">
				<event-card 
					v-for="event in upComingEvents"
					:key="event.id" 
					:event="event"
					@click="goToEventDetail(event.id)"
				></event-card>
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
      bannerList: [], //
      categoryList: [],
      hotEvents: [],
      upComingEvents: []
    }
  },
	onLoad() {
		this.loadData()
    this.getList()
	},
	methods: {
    async getList(){
      try {
        // 实际项目中应该从API获取数据
        const res = await this.$api.eventApi.getEventList1()
        console.log("后端API返回：", res)
        this.searchKeyword = res.data.searchKeyword
        this.bannerList = res.data.bannerList
        this.categoryList = res.data.categoryList
        this.hotEvents = res.data.hotEvents
        this.upComingEvents = res.data.upComingEvents
      } catch (error) {
        console.error('获取分类数据失败', error)
      }
    },
		loadData() {
			// 加载首页数据
			console.log('加载首页数据')
		},
		handleSearch(keyword) {
			uni.navigateTo({
				url: `/pages/search-results/search-results?keyword=${keyword}`
			})
		},
		handleCategoryClick(category) {
			uni.navigateTo({
				url: `/pages/search-results/search-results?category=${category.name}`
			})
		},
		handleMoreEvents() {
			uni.switchTab({
				url: '/pages/search/search'
			})
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

.banner-section {
	margin-bottom: 20rpx;
}

.search-section {
	padding: 20rpx;
	background: #fff;
}

.category-section {
	background: #fff;
	padding: 20rpx 0;
	margin-bottom: 20rpx;
}

.category-grid {
	display: flex;
	justify-content: space-around;
	align-items: center;
	padding: 20rpx 0;
}

.category-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 25%;
}

.category-icon {
	width: 48rpx;
	height: 48rpx;
	margin-bottom: 10rpx;
}

.category-name {
	font-size: 24rpx;
	color: #666;
	margin-top: 10rpx;
}

.banner-swiper {
	width: 100%;
	height: 320rpx;
}

.banner-image {
	width: 100%;
	height: 100%;
}

.search-bar {
	display: flex;
	align-items: center;
	background-color: #f5f5f5;
	border-radius: 40rpx;
	padding: 20rpx 30rpx;
}

.icon-search {
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

.section {
	background: #fff;
	margin-bottom: 20rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 20rpx 20rpx;
	border-bottom: 1rpx solid #f5f5f5;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.more-text {
	font-size: 26rpx;
	color: #999;
}

.event-list {
	padding: 20rpx;
}
</style>