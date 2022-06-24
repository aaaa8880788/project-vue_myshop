import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入全局样式表
import '@/assets/css/global.css'
// 引入vue-table-with-tree-grid
import ZkTable from 'vue-table-with-tree-grid'
// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 引入echarts
import * as echarts from 'echarts';

// 导入过滤样式
import * as filters from '@/common/filter.js'
// console.log(filters);

Vue.config.productionTip = false

Vue.component('tree-table', ZkTable)

Object.keys(filters.default).forEach((item) => {
  Vue.filter(item, filters.default[item])
})
// 使用富文本编辑器
Vue.use(VueQuillEditor)

new Vue({
  router,
  beforeCreate() {
    Vue.prototype.$bus = this //安装全局事件总线，$bus就是当前应用的vm
    Vue.prototype.$echarts = echarts
  },
  render: h => h(App)
}).$mount('#app')
