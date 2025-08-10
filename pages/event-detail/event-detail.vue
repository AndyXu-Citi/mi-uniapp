<template>
	<view class="container">
		<!-- 顶部图片 -->
		<view class="event-header">
			<u-image :src="event.image" width="100%" height="400" mode="aspectFill"></u-image>
			<view class="event-status" :class="statusClass">{{ event.status }}</view>
		</view>

		<!-- 赛事信息 -->
		<view class="event-info">
			<text class="event-title">{{ event.title }}</text>
			<view class="event-meta">
				<view class="meta-item">
					<u-icon name="calendar" size="32" color="#666"></u-icon>
					<text class="meta-text">{{ event.date }}</text>
				</view>
				<view class="meta-item">
					<u-icon name="map" size="32" color="#666"></u-icon>
					<text class="meta-text">{{ event.location }}</text>
				</view>
				<view class="meta-item">
					<u-icon name="clock" size="32" color="#666"></u-icon>
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
			<u-tabs :list="tabList" v-model="currentTab" active-color="#007AFF"></u-tabs>
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
					<u-icon :name="isFavorite ? 'star-fill' : 'star'" size="40" :color="isFavorite ? '#ff9500' : '#999'"></u-icon>
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
	padding-bottom: 100rpx;
}

.event-header {
	position: relative;
}

.event-status {
	position: absolute;
	top: 30rpx;
	right: 30rpx;
	padding: 8rpx 20rpx;
	border-radius: 30rpx;
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
	margin-bottom: 15rpx;
}

.meta-text {
	font-size: 28rpx;
	color: #666;
	margin-left: 15rpx;
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
	background: #fff;
	margin-bottom: 20rpx;
}

.tab-content {
	padding: 30rpx;
}

.content-section {
	margin-bottom: 30rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.route-info {
	margin-bottom: 20rpx;
}

.route-item {
	display: flex;
	margin-bottom: 10rpx;
}

.route-label {
	font-size: 28rpx;
	color: #666;
	width: 120rpx;
}

.route-value {
	font-size: 28rpx;
	color: #333;
	flex: 1;
}

.registration-info {
	margin-bottom: 20rpx;
}

.info-item {
	display: flex;
	margin-bottom: 15rpx;
}

.info-label {
	font-size: 28rpx;
	color: #666;
	width: 150rpx;
}

.info-value {
	font-size: 28rpx;
	color: #333;
	flex: 1;
}

.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: #fff;
	padding: 20rpx;
	border-top: 1rpx solid #eee;
}

.action-buttons {
	display: flex;
	align-items: center;
}

.btn-favorite {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: none;
	border: none;
	font-size: 24rpx;
	color: #666;
}

.btn-register {
	flex: 3;
	margin-left: 20rpx;
}
</style>