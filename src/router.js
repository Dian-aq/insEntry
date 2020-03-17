import Vue from 'vue'
import Router from 'vue-router'
import { constRouterMap } from '@/config/router.config'

Vue.use(Router)

export default new Router({
  //  此处可修改路由模式. 可选值: hash/history
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constRouterMap
})
