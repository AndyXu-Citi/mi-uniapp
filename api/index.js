// API请求封装
import config from '@/config/index.js'

// 请求拦截器
const request = (options) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: config.baseURL + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: {
				'Content-Type': 'application/json',
				'Authorization': uni.getStorageSync('token') || '',
				...options.header
			},
			success: (res) => {
				if (res.statusCode === 200) {
					if (res.data.code === 200) {
						resolve(res.data)
					} else {
						uni.showToast({
							title: res.data.message || '请求失败',
							icon: 'none'
						})
						reject(res.data)
					}
				} else if (res.statusCode === 401) {
					uni.showToast({
						title: '登录已过期',
						icon: 'none'
					})
					uni.removeStorageSync('token')
					uni.navigateTo({
						url: '/pages/login/login'
					})
					reject(res)
				} else {
					uni.showToast({
						title: '网络错误',
						icon: 'none'
					})
					reject(res)
				}
			},
			fail: (err) => {
				uni.showToast({
					title: '网络连接失败',
					icon: 'none'
				})
				reject(err)
			}
		})
	})
}

// 用户相关API
export const userApi = {
	// 登录
	login: (data) => request({
		url: '/user/login',
		method: 'POST',
		data
	}),
	
	// 获取用户信息
	getUserInfo: () => request({
		url: '/user/info',
		method: 'GET'
	}),
	
	// 退出登录
	logout: () => request({
		url: '/user/logout',
		method: 'POST'
	}),
	
	// 更新用户信息
	updateUserInfo: (data) => request({
		url: '/user/update',
		method: 'POST',
		data
	})
}

// 赛事相关API
export const eventApi = {
	// 获取赛事列表
	getEventList: (params) => request({
		url: '/events',
		method: 'GET',
		data: params
	}),
    getEventList1: (params) => request({
        url: '/events/list',
        method: 'GET',
        data: params
    }),
	// 获取赛事详情
	getEventDetail: (id) => request({
		url: `/events/${id}`,
		method: 'GET'
	}),
	
	// // 搜索赛事
	// searchEvents: (params) => request({
	// 	url: '/events/search',
	// 	method: 'GET',
	// 	data: params
	// }),

    // 搜索赛事
    searchEvents: (requestBody) => request({
        url: '/events/search',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    }),
	
	// 获取热门赛事
	getHotEvents: () => request({
		url: '/events/hot',
		method: 'GET'
	}),
	
	// 获取即将开始赛事
	getupComingEvents: () => request({
		url: '/events/upcoming',
		method: 'GET'
	})
}

// 收藏相关API
export const favoriteApi = {
	// 获取收藏列表
	getFavorites: () => request({
		url: '/favorites',
		method: 'GET'
	}),
	
	// 添加收藏
	addFavorite: (eventId) => request({
		url: `/favorites/${eventId}`,
		method: 'POST'
	}),
	
	// 取消收藏
	removeFavorite: (eventId) => request({
		url: `/favorites/${eventId}`,
		method: 'DELETE'
	})
}

// 报名相关API
export const registrationApi = {
	// 获取报名记录
	getRegistrations: (params) => request({
		url: '/registrations',
		method: 'GET',
		data: params
	}),
	
	// 创建报名
	createRegistration: (data) => request({
		url: '/registrations',
		method: 'POST',
		data
	}),
	
	// 获取报名详情
	getRegistrationDetail: (id) => request({
		url: `/registrations/${id}`,
		method: 'GET'
	}),
	
	// 取消报名
	cancelRegistration: (id) => request({
		url: `/registrations/${id}`,
		method: 'DELETE'
	})
}

export default {
	userApi,
	eventApi,
	favoriteApi,
	registrationApi
}