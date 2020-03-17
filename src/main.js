// 兼容 >=IE10
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import bootstrap from './utils/bootstrap'
import Storage from 'vue-ls'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import permissionHelper from '@/utils/helper/permissionHelper'
// TODO permission 权限: 引入了自定义的鉴权指令
import './utils/action'
import './permission'
import MultiTab from '@/components/MultiTab'
import PageLoading from '@/components/PageLoading'
import './app.styl'

Vue.use(Antd)
Vue.use(Storage)
Vue.use(permissionHelper)
Vue.use(MultiTab)
Vue.use(PageLoading)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  created () {
    bootstrap()
  },
  render: h => h(App)
}).$mount('#app')

console.log('当前的环境是：', process.env)
