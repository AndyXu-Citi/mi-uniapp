/**
 * 分类相关接口
 */
import request from '@/utils/request'

export default {
    // 获取赛事列表
    getEventList1(params) {
        return request.get('/events/list', params)
    }
}