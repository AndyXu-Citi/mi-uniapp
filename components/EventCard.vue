<template>
	<view class="event-card" @click="$emit('click')">
		<view class="event-image">
			<image :src="event.image" mode="aspectFill" class="event-img"></image>
			<view class="event-status" :class="statusClass">{{ event.status }}</view>
		</view>
		<view class="event-info">
			<text class="event-title">{{ event.title }}</text>
			<view class="event-meta">
				<view class="meta-item">
					<image src="/static/icons/calendar.png" class="meta-icon"></image>
					<text class="meta-text">{{ formatDate(event.date) }}</text>
				</view>
				<view class="meta-item">
					<image src="/static/icons/map.png" class="meta-icon"></image>
					<text class="meta-text">{{ event.location }}</text>
				</view>
			</view>
			<view class="event-price">
				<text class="price-label">报名费：</text>
				<text class="price-value">¥{{ event.price }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'EventCard',
	props: {
		event: {
			type: Object,
			required: true
		}
	},
	computed: {
		statusClass() {
			const status = this.event.status
			if (status === '报名中') return 'status-active'
			if (status === '即将开始') return 'status-upcoming'
			if (status === '已结束') return 'status-ended'
			return ''
		}
	},
	methods: {
		formatDate(date) {
			// 简单的日期格式化
			if (!date) return ''
			const d = new Date(date)
			const month = d.getMonth() + 1
			const day = d.getDate()
			return `${month}/${day}`
		}
	}
}
</script>

<style lang="scss" scoped>
.event-card {
	background: #fff;
	border-radius: 8rpx;
	overflow: hidden;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.event-image {
	position: relative;
	height: 200rpx;
}

.event-img {
	width: 100%;
	height: 200rpx;
}

.event-status {
	position: absolute;
	top: 20rpx;
	right: 20rpx;
	padding: 4rpx 12rpx;
	border-radius: 20rpx;
	font-size: 20rpx;
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
	padding: 20rpx;
}

.event-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 15rpx;
}

.event-meta {
	margin-bottom: 15rpx;
}

.meta-item {
	display: flex;
	align-items: center;
	margin-bottom: 10rpx;
}

.meta-icon {
	width: 28rpx;
	height: 28rpx;
	margin-right: 10rpx;
}

.meta-text {
	font-size: 26rpx;
	color: #666;
	margin-left: 10rpx;
}

.event-price {
	display: flex;
	align-items: center;
}

.price-label {
	font-size: 26rpx;
	color: #666;
}

.price-value {
	font-size: 32rpx;
	font-weight: bold;
	color: #ff4757;
}
</style>