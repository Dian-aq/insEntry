import Vue from 'vue'
import store from '@/store/'
import {
  DEFAULT_LAYOUT_MODE,
  DEFAULT_MENU_THEME,
  SIDEBAR_STATE,
  DEFAULT_FIXED_HEADER,
  DEFAULT_FIXED_SIDERBAR,
  DEFAULT_FIXED_HEADER_HIDDEN,
  DEFAULT_ACCORDION_MODE,
  ACCESS_TOKEN,
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_MULTI_TAB
} from '@/store/mutation-types'
import config from '@/config/setting'

export default function Initializer () {
  store.commit('TOGGLE_LAYOUT_MODE', Vue.ls.get(DEFAULT_LAYOUT_MODE, config.layout))
  store.commit('TOGGLE_MENU_THEME', Vue.ls.get(DEFAULT_MENU_THEME, config.navTheme))
  store.commit('SET_SIDEBAR_STATE', Vue.ls.get(SIDEBAR_STATE, true))
  store.commit('TOGGLE_FIXED_HEADER', Vue.ls.get(DEFAULT_FIXED_HEADER, config.fixedHeader))
  store.commit('TOGGLE_FIXED_SIDERBAR', Vue.ls.get(DEFAULT_FIXED_SIDERBAR, config.fixedSiderbar))
  store.commit('TOGGLE_FIXED_HEADER_HIDDEN', Vue.ls.get(DEFAULT_FIXED_HEADER_HIDDEN, config.autoHideHeader))
  store.commit('TOGGLE_ACCORDION_MODE', Vue.ls.get(DEFAULT_ACCORDION_MODE, config.sidebarAccordionMode))
  store.commit('SET_TOKEN', Vue.ls.get(ACCESS_TOKEN))
  store.commit('TOGGLE_MULTI_TAB', Vue.ls.get(DEFAULT_MULTI_TAB, config.multiTab))
  store.commit('TOGGLE_PRIMARY_COLOR', Vue.ls.get(DEFAULT_PRIMARY_COLOR, config.primaryColor))
}
