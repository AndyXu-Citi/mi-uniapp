<template>
	<view class="container">
		<!-- 顶部图片 -->
		<view class="event-header">
			<image :src="event.image" mode="aspectFill" class="event-image"></image>
			<view class="event-status" :class="statusClass">{{ event.status }}</view>
		</view>

		<!-- 赛事信息 -->
		<view class="event-info">
			<text class="event-title">{{ event.title }}</text>
			<view class="event-meta">
				<view class="meta-item">
					<image src="/static/icons/calendar.png" class="meta-icon"></image>
					<text class="meta-text">{{ event.date }}</text>
				</view>
				<view class="meta-item">
					<image src="/static/icons/map.png" class="meta-icon"></image>
					<text class="meta-text">{{ event.location }}</text>
				</view>
				<view class="meta-item">
					<image src="/static/icons/clock.png" class="meta-icon"></image>
					<text class="meta-text">{{ event.startTime }} - {{ event.endTime }}</text>
				</view>
			</view>
			<view class="event-price">
				<text class="price-label">报名费：</text>
				<text class="price-value">¥{{ event.price }}</text>
			</view>
		</view>

		<!-- 赛事详情 -->
		<view class="event-detail">
			<view class="tab-nav">
			<view 
				v-for="(tab, index) in tabList" 
				:key="index"
				class="tab-item"
				:class="{ active: currentTab === index }"
				@click="currentTab = index"
			>
				{{ tab.name }}
			</view>
		</view>
			<view class="tab-content">
				<!-- 赛事介绍 -->
				<view v-if="currentTab === 0" class="content-section">
					<view class="section-title">赛事介绍</view>
					<rich-text :nodes="event.description"></rich-text>
				</view>

				<!-- 比赛路线 -->
				<view v-if="currentTab === 1" class="content-section">
					<view class="section-title">比赛路线</view>
					<view class="route-info">
						<view class="route-item">
							<text class="route-label">起点：</text>
							<text class="route-value">{{ event.route.start }}</text>
						</view>
						<view class="route-item">
							<text class="route-label">终点：</text>
							<text class="route-value">{{ event.route.end }}</text>
						</view>
						<view class="route-item">
							<text class="route-label">总距离：</text>
							<text class="route-value">{{ event.route.distance }}公里</text>
						</view>
					</view>
					<map 
						:latitude="event.latitude"
						:longitude="event.longitude"
						:markers="markers"
						:polyline="polyline"
						style="width: 100%; height: 300px; margin-top: 20px;"
					></map>
				</view>

				<!-- 报名信息 -->
				<view v-if="currentTab === 2" class="content-section">
					<view class="section-title">报名信息</view>
					<view class="registration-info">
						<view class="info-item">
							<text class="info-label">报名开始：</text>
							<text class="info-value">{{ event.registration.startDate }}</text>
						</view>
						<view class="info-item">
							<text class="info-label">报名截止：</text>
							<text class="info-value">{{ event.registration.endDate }}</text>
						</view>
						<view class="info-item">
							<text class="info-label">参赛名额：</text>
							<text class="info-value">{{ event.registration.quota }}人</text>
						</view>
						<view class="info-item">
							<text class="info-label">已报名：</text>
							<text class="info-value">{{ event.registration.registered }}人</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="bottom-bar">
			<view class="action-buttons">
				<button class="btn-favorite" @click="toggleFavorite">
					<image :src="isFavorite ? '/static/icons/star-fill.png' : '/static/icons/star.png'" class="favorite-icon"></image>
					<text>{{ isFavorite ? '已收藏' : '收藏' }}</text>
				</button>
				<button 
					class="btn-register" 
					:type="event.status === '报名中' ? 'primary' : 'default'"
					:disabled="event.status !== '报名中'"
					@click="goToRegistration"
				>
					{{ event.status === '报名中' ? '立即报名' : event.status }}
				</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			event: {
				id: 1,
				title: '2024北京马拉松',
				image: '/static/images/events/beijing.jpg',
				status: '报名中',
				date: '2024-10-20',
				startTime: '07:30',
				endTime: '13:30',
				location: '北京市天安门广场',
				price: 200,
				description: '<p>北京马拉松创办于1981年，是国内历史最悠久的马拉松赛事之一，素有“国马”之称。赛事起点设在天安门广场，终点设在奥林匹克公园景观大道，全程42.195公里，途经长安街、复兴门、月坛、北展桥、知春路、学院路、林萃路等地标性建筑。</p><p>本届赛事将延续“健康、绿色、智慧、快乐”的办赛理念，为跑者提供专业、安全、贴心的赛事服务。</p>',
				route: {
					start: '天安门广场',
					end: '奥林匹克公园景观大道',
					distance: 42.195
				},
				latitude: 39.9042,
				longitude: 116.4074,
				registration: {
					startDate: '2024-08-01',
					endDate: '2024-09-30',
					quota: 30000,
					registered: 15000
				}
			},
			currentTab: 0,
			isFavorite: false,
			tabList: [
				{ name: '赛事介绍' },
				{ name: '比赛路线' },
				{ name: '报名信息' }
			],
			markers: [{
				id: 1,
				latitude: 39.9042,
				longitude: 116.4074,
				name: '起点'
			}],
			polyline: [{
				points: [
					{ latitude: 39.9042, longitude: 116.4074 },
					{ latitude: 39.9136, longitude: 116.3972 },
					{ latitude: 39.9311, longitude: 116.4563 }
				],
				color: '#007AFF',
				width: 4
			}]
		}
	},
	onLoad(options) {
		if (options.id) {
			this.loadEventDetail(options.id)
		}
	},
	computed: {
		statusClass() {
			const status = this.event.status
			if (status === '报名中') return 'status-active'
			if (status === '即将开始') return 'status-upcoming'
			return 'status-ended'
		}
	},
	methods: {
		loadEventDetail(id) {
			// 根据ID加载赛事详情
			console.log('加载赛事详情:', id)
		},
		toggleFavorite() {
			this.isFavorite = !this.isFavorite
			uni.showToast({
				title: this.isFavorite ? '收藏成功' : '取消收藏',
				icon: 'none'
			})
		},
		goToRegistration() {
			if (this.event.status === '报名中') {
				uni.navigateTo({
					url: `/pages/registration/registration?eventId=${this.event.id}`
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
	padding-bottom: 120rpx;
}

.event-header {
	position: relative;
}

.event-image {
	width: 100%;
	height: 400rpx;
}

.event-status {
	position: absolute;
	top: 20rpx;
	right: 20rpx;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	color: #fff;
}

.status-active {
	background-color: #007AFF;
}

.status-upcoming {
	background-color: #ff9500;
}

.status-ended {
	background-color: #999;
}

.event-info {
	background: #fff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.event-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 20rpx;
}

.event-meta {
	margin-bottom: 20rpx;
}

.meta-item {
	display: flex;
	align-items: center;
	margin-bottom: 10rpx;
}

.meta-icon {
	width: 32rpx;
	height: 32rpx;
	margin-right: 10rpx;
}

.meta-text {
	font-size: 28rpx;
	color: #666;
	margin-left: 10rpx;
}

.event-price {
	display: flex;
	align-items: center;
}

.price-label {
	font-size: 28rpx;
	color: #666;
}

.price-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #ff4757;
}

.event-detail {
	margin-top: 20rpx;
	background: #fff;
	margin-bottom: 20rpx;
}

.tab-nav {
	display: flex;
	border-bottom: 1rpx solid #eee;
	background-color: #fff;
}

.tab-item {
	flex: 1;
	text-align: center;
	padding: 20rpx 0;
	font-size: 28rpx;
	color: #666;
	border-bottom: 4rpx solid transparent;
}

.tab-item.active {
	color: #007AFF;
	border-bottom-color: #007AFF;
}

.tab-content {
	padding: 30rpx;
}

.content-section {
	margin-bottom: 40rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.route-info {
	background-color: #f8f9fa;
	border-radius: 10rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
}

.route-item {
	display: flex;
	margin-bottom: 15rpx;
}

.route-label {
	font-size: 28rpx;
	color: #666;
	min-width: 120rpx;
}

.route-value {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
}

.registration-info {
	background-color: #f8f9fa;
	border-radius: 10rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
}

.info-item {
	display: flex;
	justify-content: space-between;
	margin-bottom: 15rpx;
	padding-bottom: 15rpx;
	border-bottom: 1rpx solid #eee;
}

.info-item:last-child {
	margin-bottom: 0;
	padding-bottom: 0;
	border-bottom: none;
}

.info-label {
	font-size: 28rpx;
	color: #666;
}

.info-value {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
}

.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #fff;
	padding: 20rpx;
	border-top: 1rpx solid #eee;
}

.action-buttons {
	display: flex;
	gap: 20rpx;
	align-items: center;
}

.btn-favorite {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 20rpx;
	border: 1rpx solid #ddd;
	border-radius: 10rpx;
	background-color: #fff;
	width: 120rpx;
}

.favorite-icon {
	width: 40rpx;
	height: 40rpx;
}

.btn-favorite text {
	font-size: 24rpx;
	color: #666;
	margin-top: 5rpx;
}

.btn-register {
	flex: 1;
	padding: 20rpx;
	border-radius: 10rpx;
	font-size: 32rpx;
	font-weight: bold;
}
</style>