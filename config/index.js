// 全局配置文件
const config = {
	// 基础配置
	baseURL: process.env.NODE_ENV === 'development' 
		? 'http://localhost:8080/api' 
		: 'https://your-domain.com/api',
	
	// 应用信息
	appName: '马拉松报名',
	version: '1.0.0',
	
	// 分页配置
	pageSize: 10,
	
	// 上传配置
	upload: {
		maxSize: 5 * 1024 * 1024, // 5MB
		allowTypes: ['jpg', 'jpeg', 'png', 'gif']
	},
	
	// 缓存时间（秒）
	cacheTime: {
		events: 300, // 赛事列表缓存5分钟
		userInfo: 3600 // 用户信息缓存1小时
	},
	
	// 微信配置
	wechat: {
		appId: 'wx21a3d7f98708c369',
		scope: 'snsapi_userinfo'
	},
	
	// 地图配置
	map: {
		key: 'your-amap-key',
		version: '2.0'
	},
	
	// 分享配置
	share: {
		title: '马拉松报名小程序',
		desc: '发现精彩马拉松赛事，一键报名！',
		imageUrl: '/static/images/share.png'
	}
}

export default config