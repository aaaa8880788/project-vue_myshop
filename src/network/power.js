import { request } from './request'

// 获取所有权限列表
export function getAllPowerList(type) {
  return request({
    url: `rights/${type}`,
    method: 'get'
  })
}

// 获取角色列表
export function getRoleList() {
  return request({
    url: 'roles',
    method: 'get'
  })
}

// 删除角色指定权限
export function deleteRolePower(roleId, rightId) {
  return request({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}

// 授予角色指定权限
export function giveRolePower(roleId, rids) {
  return request({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: {
      "rids": rids
    }
  })
}

// 分配用户角色
export function giverolestatus(id, rid) {
  return request({
    url: `users/${id}/role`,
    method: 'put',
    data: {
      rid
    }
  })
}

// 添加角色
export function addRoleData(roleName, roleDesc) {
  return request({
    url: 'roles',
    method: 'post',
    data: {
      roleName: roleName,
      roleDesc: roleDesc
    }
  })
}


// 编辑角色
export function editRoleData(obj) {
  return request({
    url: `roles/${obj.id}`,
    method: 'put',
    data: {
      roleName: obj.roleName,
      roleDesc: obj.roleDesc
    }
  })
}


// 删除角色
export function deleteRoleData(id) {
  return request({
    url: `roles/${id}`,
    method: 'delete'
  })
}