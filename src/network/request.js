import axios from 'axios'

export function request(config) {
  // 1.创建对应的axios实例
  const instance = axios.create({
    // baseURL: 'http://127.0.0.1:8888/api/private/v1'
    baseURL: 'https://lianghj.top:8888/api/private/v1/'
  })
  // 设置axios请求拦截器
  instance.interceptors.request.use(config => {
    // 为请求头对象添加Token验证的Authorization字段
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  }, err => {
    console.log(err);
  })

  // 2.发送真正的网络请求
  // 因为axios实例对象就是promise对象
  return instance(config)
}
