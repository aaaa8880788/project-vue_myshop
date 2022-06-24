import { request } from './request';

// 数据统计部分数据
export function getCounterData() {
  return request({
    url: 'reports/type/1',
    method: 'get'
  })
}