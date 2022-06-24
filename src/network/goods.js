import { request } from './request'


// 商品分类管理部分
// 获取商品分类数据列表
export function getgoodscateListdata(obj) {
  return request({
    url: 'categories',
    method: 'get',
    params: obj
  })
}

// 添加分类请求
export function getParentCateListdata(obj) {
  return request({
    url: 'categories',
    method: 'post',
    data: obj
  })
}

// 编辑提交分类
export function editCommitCatedata(obj) {
  return request({
    url: `categories/${obj.cat_id}`,
    method: 'put',
    data: {
      cat_name: obj.cat_name
    }
  })
}

// 删除分类
export function deleteCate(id) {
  return request({
    url: `categories/${id}`,
    method: 'delete'
  })
}



// 分类参数管理部分
// 获取参数列表
export function getParamsListdata(id, sel) {
  return request({
    url: `categories/${id}/attributes`,
    method: 'get',
    params: {
      sel: sel
    }
  })
}


// 添加动态参数或静态属性
export function addParamsOrAttributes(id, attr_name, attr_sel) {
  return request({
    url: `categories/${id}/attributes`,
    method: 'post',
    data: {
      attr_name: attr_name,
      attr_sel: attr_sel
    }
  })
}

// 编辑提交参数
export function editCommitParams(obj) {
  return request({
    url: `categories/${obj.id}/attributes/${obj.attrId}`,
    method: 'put',
    data: {
      attr_name: obj.attr_name,
      attr_sel: obj.attr_sel,
      attr_vals: obj.attr_vals
    }
  })
}

// 删除参数
export function deleteParams(id, attrid) {
  return request({
    url: `categories/${id}/attributes/${attrid}`,
    method: 'delete'
  })
}


// 商品管理部分
// 请求商品列表数据
export function getGoodsListData(obj) {
  return request({
    url: 'goods',
    method: 'get',
    params: obj
  })
}

// 删除商品
export function deleteGoodsData(id) {
  return request({
    url: `goods/${id}`,
    method: 'delete'
  })
}

// 添加商品
export function addGoodsRequest(obj) {
  return request({
    url: 'goods',
    method: 'post',
    data: obj
  })
}

// 编辑提交商品
export function editCommitGoods(id, obj) {
  return request({
    url: `goods/${id}`,
    method: 'put',
    data: obj
  })
}
