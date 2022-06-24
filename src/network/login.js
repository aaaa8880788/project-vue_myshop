import { request } from './request'

// 请求登录部分数据
export function getLogindata(obj) {
  return request({
    url: '/login',
    method: 'post',
    params: obj
  })
}