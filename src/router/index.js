import Vue from 'vue'
import Vuerouter from 'vue-router'

Vue.use(Vuerouter);

const login = () => import('@/components/login/Login')
const home = () => import('@/views/home/Home')
const welcome = () => import('@/views/welcome/Welcome')
const users = () => import('@/views/user/User')
const rights = () => import('@/views/power/Right')
const roles = () => import('@/views/power/Role')
const cate = () => import('@/views/goods/Cate')
const params = () => import('@/views/goods/Params')
const list = () => import('@/views/goods/List')
const add = () => import('@/views/goods/Add')
const order = () => import('@/views/order/Order')
const report = () => import('@/views/report/Report')


const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: home,
    redirect: '/home/welcome',
    children: [
      {
        path: 'welcome',
        component: welcome
      },
      {
        path: 'users',
        component: users
      },
      {
        path: 'rights',
        component: rights
      },
      {
        path: 'roles',
        component: roles
      },
      {
        path: 'categories',
        component: cate
      },
      {
        path: 'params',
        component: params
      },
      {
        path: 'goods',
        component: list
      },
      {
        path: 'goods/add',
        component: add
      },
      {
        path: 'orders',
        component: order
      },
      {
        path: 'reports',
        component: report
      }
    ]
  }
]

const router = new Vuerouter({
  routes
})


// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to  将要访问的路径
  // from  代表从那个路径跳转而来
  // next  是一个函数代表放行
  // next的两种方式
  // 1. next()  直接放行
  // 2. next('/XXXXX')  强制跳转
  if (to.path === '/login') {
    return next()
  }
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  } else {
    next()
  }
})

export default router