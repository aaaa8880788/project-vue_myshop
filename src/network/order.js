import { request } from './request'

// 订单数据列表获取
export function getOrderListData(obj) {
  return request({
    url: 'orders',
    method: 'get',
    params: obj
  })
}

// 查看物流信息
export function getLogisticsInfo() {
  return request({
    url: '/kuaidi/1106975712662',
    method: 'get'
  })
}