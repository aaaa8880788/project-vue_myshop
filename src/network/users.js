import { request } from './request'

// 获取用户列表数据
export function getUsersListdata(obj) {
  return request({
    url: '/users',
    method: 'get',
    params: obj
  })
}

// 更新用户状态
export function updatauserstate(obj) {
  return request({
    url: `users/${obj.uId}/state/${obj.type}`,
    method: 'put',
  })
}

// 添加用户数据
export function addUserData(obj) {
  return request({
    url: 'users',
    method: 'post',
    data: obj
  })
}

// 查询用户信息
export function getUserdata(id) {
  return request({
    url: `users/${id}`,
    method: 'get'
  })
}

// 修改用户信息
export function changeUserdata(id, obj) {
  return request({
    url: `users/${id}`,
    method: 'put',
    data: obj
  })
}

// 删除用户信息
export function removeUserdata(id) {
  return request({
    url: `users/${id}`,
    method: 'delete'
  })
}