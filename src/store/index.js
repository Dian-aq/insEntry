import Vue from 'vue'
import Vuex from 'vuex'

/* 模块store */
import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import customer from './modules/customer'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    customer,
    permission
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
