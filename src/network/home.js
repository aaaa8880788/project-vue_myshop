import { request } from './request'

// 请求左侧菜单栏数据
export function getMenuListdata() {
  return request({
    url: '/menus',
    method: 'get',
  })
}