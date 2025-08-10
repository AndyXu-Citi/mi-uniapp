import Vue from 'vue'
import App from './App'
import store from './src/store/index.js'

Vue.config.productionTip = false

App.mpType = 'app'

// 引入全局过滤器
import filters from './src/utils/filters/index.js'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 引入全局混入
import globalMixin from './src/utils/mixins/global.js'
Vue.mixin(globalMixin)

// 引入全局API请求
import api from './src/api/index.js'
Vue.prototype.$api = api

// 引入全局工具函数
import utils from './src/utils/common.js'
Vue.prototype.$utils = utils

const app = new Vue({
  ...App,
  store
})
app.$mount()