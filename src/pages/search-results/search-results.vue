<template>
  <view class="search-results-container">
    <!-- 顶部搜索栏 -->
    <view class="search-header">
      <view class="search-bar">
        <text class="iconfont icon-search"></text>
        <input 
          class="search-input" 
          v-model="keyword"
          placeholder="搜索马拉松赛事"
          @confirm="handleSearch"
          @input="handleInput"
        />
        <text v-if="keyword" class="iconfont icon-clear" @tap="clearKeyword"></text>
      </view>
      <text class="cancel-btn" @tap="navigateBack">取消</text>
    </view>

    <!-- 搜索历史 -->
    <view class="search-history" v-if="showHistory && searchHistory.length">
      <view class="history-header">
        <text class="history-title">搜索历史</text>
        <text class="clear-btn" @tap="clearHistory">
          <text class="iconfont icon-delete"></text>
        </text>
      </view>
      <view class="history-list">
        <view 
          class="history-item" 
          v-for="(item, index) in searchHistory" 
          :key="index"
          @tap="selectHistory(item)"
        >
          <text class="history-text">{{ item }}</text>
        </view>
      </view>
    </view>

    <!-- 筛选条件 -->
    <view class="filter-bar" v-if="results.length">
      <view 
        class="filter-item" 
        :class="{ active: sortBy === 'relevance' }"
        @tap="changeSort('relevance')"
      >
        综合排序
      </view>
      <view 
        class="filter-item" 
        :class="{ active: sortBy === 'time' }"
        @tap="changeSort('time')"
      >
        时间排序
      </view>
      <view 
        class="filter-item" 
        :class="{ active: sortBy === 'price' }"
        @tap="changeSort('price')"
      >
        价格排序
      </view>
      <view class="filter-item" @tap="showFilterModal">
        <text class="iconfont icon-filter"></text>
        筛选
      </view>
    </view>

    <!-- 搜索结果 -->
    <scroll-view 
      class="results-list" 
      scroll-y 
      @scrolltolower="loadMore"
      v-if="results.length"
    >
      <EventCard 
        v-for="event in results" 
        :key="event.id" 
        :event="event"
        @tap="goToDetail(event.id)"
      />
      
      <!-- 加载更多 -->
      <view class="load-more" v-if="hasMore">
        <text v-if="loading">加载中...</text>
        <text v-else @tap="loadMore">加载更多</text>
      </view>
      
      <!-- 没有更多 -->
      <view class="no-more" v-else>
        <text>没有更多了</text>
      </view>
    </scroll-view>

    <!-- 空状态 -->
    <view class="empty-state" v-else-if="!loading">
      <image class="empty-image" src="/static/images/empty-search.png" mode="aspectFit"></image>
      <text class="empty-text">没有找到相关赛事</text>
      <button class="empty-btn" @tap="goToDiscover">去发现</button>
    </view>

    <!-- 筛选弹窗 -->
    <view class="filter-modal" v-if="showFilter">
      <view class="modal-mask" @tap="closeFilterModal"></view>
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">筛选条件</text>
          <text class="modal-close" @tap="closeFilterModal">×</text>
        </view>
        
        <scroll-view class="modal-body" scroll-y>
          <!-- 价格区间 -->
          <view class="filter-group">
            <text class="group-title">价格区间</text>
            <view class="price-range">
              <input 
                class="price-input" 
                v-model="filterForm.minPrice"
                type="number"
                placeholder="最低价"
              />
              <text class="range-separator">-</text>
              <input 
                class="price-input" 
                v-model="filterForm.maxPrice"
                type="number"
                placeholder="最高价"
              />
            </view>
          </view>

          <!-- 赛事类型 -->
          <view class="filter-group">
            <text class="group-title">赛事类型</text>
            <view class="filter-options">
              <view 
                class="filter-option"
                :class="{ active: filterForm.types.includes('full') }"
                @tap="toggleType('full')"
              >
                全程马拉松
              </view>
              <view 
                class="filter-option"
                :class="{ active: filterForm.types.includes('half') }"
                @tap="toggleType('half')"
              >
                半程马拉松
              </view>
              <view 
                class="filter-option"
                :class="{ active: filterForm.types.includes('mini') }"
                @tap="toggleType('mini')"
              >
                迷你马拉松
              </view>
            </view>
          </view>

          <!-- 举办城市 -->
          <view class="filter-group">
            <text class="group-title">举办城市</text>
            <view class="filter-options">
              <view 
                class="filter-option"
                :class="{ active: filterForm.city === 'beijing' }"
                @tap="filterForm.city = 'beijing'"
              >
                北京
              </view>
              <view 
                class="filter-option"
                :class="{ active: filterForm.city === 'shanghai' }"
                @tap="filterForm.city = 'shanghai'"
              >
                上海
              </view>
              <view 
                class="filter-option"
                :class="{ active: filterForm.city === 'guangzhou' }"
                @tap="filterForm.city = 'guangzhou'"
              >
                广州
              </view>
              <view 
                class="filter-option"
                :class="{ active: filterForm.city === 'shenzhen' }"
                @tap="filterForm.city = 'shenzhen'"
              >
                深圳
              </view>
            </view>
          </view>
        </scroll-view>
        
        <view class="modal-footer">
          <button class="reset-btn" @tap="resetFilter">重置</button>
          <button class="confirm-btn" @tap="confirmFilter">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { eventApi } from '@/api/index.js'
import EventCard from '@/components/EventCard.vue'

export default {
  components: {
    EventCard
  },

  data() {
    return {
      keyword: '',
      results: [],
      searchHistory: [],
      showHistory: true,
      sortBy: 'relevance',
      filterForm: {
        minPrice: '',
        maxPrice: '',
        types: [],
        city: ''
      },
      showFilter: false,
      loading: false,
      page: 1,
      hasMore: true
    }
  },

  onLoad(options) {
    this.keyword = options.keyword || ''
    this.loadSearchHistory()
    if (this.keyword) {
      this.handleSearch()
    }
  },

  methods: {
    async handleSearch() {
      if (!this.keyword.trim()) return
      
      this.showHistory = false
      this.loading = true
      this.page = 1
      
      try {
        const params = {
          keyword: this.keyword,
          page: this.page,
          sortBy: this.sortBy,
          ...this.filterForm
        }
        
        const res = await eventApi.searchEvents(params)
        this.results = res.data.list
        this.hasMore = res.data.hasMore
        
        // 添加到搜索历史
        this.addToHistory(this.keyword)
      } catch (error) {
        uni.showToast({
          title: '搜索失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    async loadMore() {
      if (this.loading || !this.hasMore) return
      
      this.loading = true
      this.page++
      
      try {
        const params = {
          keyword: this.keyword,
          page: this.page,
          sortBy: this.sortBy,
          ...this.filterForm
        }
        
        const res = await eventApi.searchEvents(params)
        this.results = [...this.results, ...res.data.list]
        this.hasMore = res.data.hasMore
      } catch (error) {
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    handleInput() {
      if (!this.keyword.trim()) {
        this.showHistory = true
        this.results = []
      }
    },

    clearKeyword() {
      this.keyword = ''
      this.showHistory = true
      this.results = []
    },

    selectHistory(keyword) {
      this.keyword = keyword
      this.handleSearch()
    },

    loadSearchHistory() {
      const history = uni.getStorageSync('searchHistory') || []
      this.searchHistory = history.slice(0, 10)
    },

    addToHistory(keyword) {
      let history = uni.getStorageSync('searchHistory') || []
      history = history.filter(item => item !== keyword)
      history.unshift(keyword)
      history = history.slice(0, 10)
      uni.setStorageSync('searchHistory', history)
      this.searchHistory = history
    },

    clearHistory() {
      uni.removeStorageSync('searchHistory')
      this.searchHistory = []
    },

    changeSort(sortBy) {
      this.sortBy = sortBy
      if (this.keyword) {
        this.handleSearch()
      }
    },

    showFilterModal() {
      this.showFilter = true
    },

    closeFilterModal() {
      this.showFilter = false
    },

    toggleType(type) {
      const index = this.filterForm.types.indexOf(type)
      if (index > -1) {
        this.filterForm.types.splice(index, 1)
      } else {
        this.filterForm.types.push(type)
      }
    },

    resetFilter() {
      this.filterForm = {
        minPrice: '',
        maxPrice: '',
        types: [],
        city: ''
      }
    },

    confirmFilter() {
      this.closeFilterModal()
      if (this.keyword) {
        this.handleSearch()
      }
    },

    goToDetail(id) {
      uni.navigateTo({
        url: `/pages/event-detail/event-detail?id=${id}`
      })
    },

    navigateBack() {
      uni.navigateBack()
    },

    goToDiscover() {
      uni.switchTab({
        url: '/pages/index/index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.search-results-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.search-header {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;

  .search-bar {
    flex: 1;
    display: flex;
    align-items: center;
    height: 70rpx;
    background-color: #f5f5f5;
    border-radius: 35rpx;
    padding: 0 30rpx;

    .icon-search {
      font-size: 32rpx;
      color: #999;
      margin-right: 20rpx;
    }

    .search-input {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }

    .icon-clear {
      font-size: 32rpx;
      color: #999;
      margin-left: 20rpx;
    }
  }

  .cancel-btn {
    font-size: 30rpx;
    color: #666;
    margin-left: 30rpx;
  }
}

.search-history {
  background-color: #fff;
  margin-bottom: 20rpx;

  .history-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    border-bottom: 1rpx solid #eee;

    .history-title {
      font-size: 30rpx;
      font-weight: 500;
      color: #333;
    }

    .clear-btn {
      .iconfont {
        font-size: 36rpx;
        color: #999;
      }
    }
  }

  .history-list {
    padding: 20rpx 30rpx;

    .history-item {
      display: inline-block;
      padding: 15rpx 30rpx;
      margin: 0 20rpx 20rpx 0;
      background-color: #f5f5f5;
      border-radius: 30rpx;

      .history-text {
        font-size: 26rpx;
        color: #666;
      }
    }
  }
}

.filter-bar {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;

  .filter-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88rpx;
    font-size: 28rpx;
    color: #666;

    &.active {
      color: #007aff;
      font-weight: 500;
    }

    .iconfont {
      font-size: 24rpx;
      margin-right: 10rpx;
    }
  }
}

.results-list {
  height: calc(100vh - 180rpx);
}

.load-more, .no-more {
  text-align: center;
  padding: 40rpx;
  font-size: 28rpx;
  color: #999;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;

  .empty-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 40rpx;
  }

  .empty-text {
    font-size: 30rpx;
    color: #999;
    margin-bottom: 40rpx;
  }

  .empty-btn {
    width: 200rpx;
    height: 70rpx;
    line-height: 70rpx;
    font-size: 28rpx;
    color: #007aff;
    background-color: transparent;
    border: 1rpx solid #007aff;
    border-radius: 35rpx;
  }
}

.filter-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;

  .modal-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600rpx;
    max-height: 80vh;
    background-color: #fff;
    border-radius: 20rpx;
    overflow: hidden;

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30rpx;
      border-bottom: 1rpx solid #eee;

      .modal-title {
        font-size: 32rpx;
        font-weight: 500;
        color: #333;
      }

      .modal-close {
        font-size: 40rpx;
        color: #999;
      }
    }

    .modal-body {
      max-height: 60vh;
      padding: 30rpx;

      .filter-group {
        margin-bottom: 40rpx;

        .group-title {
          display: block;
          font-size: 30rpx;
          font-weight: 500;
          color: #333;
          margin-bottom: 20rpx;
        }

        .price-range {
          display: flex;
          align-items: center;

          .price-input {
            flex: 1;
            height: 70rpx;
            padding: 0 20rpx;
            background-color: #f5f5f5;
            border-radius: 8rpx;
            font-size: 28rpx;
            color: #333;
          }

          .range-separator {
            margin: 0 20rpx;
            font-size: 28rpx;
            color: #666;
          }
        }

        .filter-options {
          display: flex;
          flex-wrap: wrap;

          .filter-option {
            padding: 15rpx 30rpx;
            margin: 0 20rpx 20rpx 0;
            background-color: #f5f5f5;
            border-radius: 30rpx;
            font-size: 26rpx;
            color: #666;

            &.active {
              background-color: #007aff;
              color: #fff;
            }
          }
        }
      }
    }

    .modal-footer {
      display: flex;
      border-top: 1rpx solid #eee;

      .reset-btn, .confirm-btn {
        flex: 1;
        height: 90rpx;
        line-height: 90rpx;
        font-size: 30rpx;
        border-radius: 0;
      }

      .reset-btn {
        color: #666;
        background-color: #f5f5f5;
      }

      .confirm-btn {
        color: #fff;
        background-color: #007aff;
      }
    }
  }
}
</style>