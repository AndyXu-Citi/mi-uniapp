import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		// 用户token
		token: uni.getStorageSync('token') || '',
		// 用户信息
		userInfo: uni.getStorageSync('userInfo') || {},
		// 登录状态
		isLoggedIn: uni.getStorageSync('isLoggedIn') || true,
		// 系统信息
		systemInfo: {},
		// 全局加载状态
		isLoading: false
	},
	mutations: {
		// 设置token
		SET_TOKEN(state, token) {
			state.token = token
			uni.setStorageSync('token', token)
		},
		// 清除token
		CLEAR_TOKEN(state) {
			state.token = ''
			uni.removeStorageSync('token')
		},
		// 设置用户信息
		SET_USER_INFO(state, userInfo) {
			state.userInfo = userInfo
			uni.setStorageSync('userInfo', userInfo)
		},
		// 清除用户信息
		CLEAR_USER_INFO(state) {
			state.userInfo = {}
			uni.removeStorageSync('userInfo')
		},
		// 设置系统信息
		SET_SYSTEM_INFO(state, systemInfo) {
			state.systemInfo = systemInfo
		},
		// 设置加载状态
		SET_LOADING(state, loading) {
			state.isLoading = loading
		}
	},
	actions: {
		// 登录
		async login({ commit }, userInfo) {
			const { data } = await uni.$u.api.login(userInfo)
			commit('SET_TOKEN', data.token)
			commit('SET_USER_INFO', data.userInfo)
			return data
		},
		// 获取用户信息
		async getUserInfo({ commit, state }) {
			const { data } = await uni.$u.api.getUserInfo()
			commit('SET_USER_INFO', data)
			return data
		},
		// 退出登录
		async logout({ commit }) {
			await uni.$u.api.logout()
			commit('CLEAR_TOKEN')
			commit('CLEAR_USER_INFO')
		}
	},
	getters: {
		// 是否已登录
		isLoggedIn: state => !!state.token,
		// 用户信息
		userInfo: state => state.userInfo,
		// 系统信息
		systemInfo: state => state.systemInfo
	}
})

export default store