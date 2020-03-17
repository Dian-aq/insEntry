import Vue from 'vue'
import {
  DEFAULT_LAYOUT_MODE,
  DEFAULT_MENU_THEME,
  SIDEBAR_STATE,
  DEFAULT_FIXED_HEADER,
  DEFAULT_FIXED_SIDERBAR,
  DEFAULT_FIXED_HEADER_HIDDEN,
  DEFAULT_ACCORDION_MODE,
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_MULTI_TAB
} from '@/store/mutation-types'

/*
const options = {
  namespace: 'vuejs__', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local' // storage name session, local, memory
}
*/
const app = {
  state: {
    layout: '',
    menuTheme: '',
    device: 'desktop',
    sidebarOpen: true,
    fixedHeader: false,
    fixedSiderbar: false,
    autoHideHeader: false,
    sidebarAccordionMode: false,
    primaryColor: null,
    multiTab: true
  },
  mutations: {
    TOGGLE_MULTI_TAB: (state, bool) => {
      Vue.ls.set(DEFAULT_MULTI_TAB, bool)
      state.multiTab = bool
    },
    TOGGLE_PRIMARY_COLOR: (state, color) => {
      Vue.ls.set(DEFAULT_PRIMARY_COLOR, color)
      state.primaryColor = color
    },
    TOGGLE_ACCORDION_MODE: (state, mode) => {
      Vue.ls.set(DEFAULT_ACCORDION_MODE, mode)
      state.sidebarAccordionMode = mode
    },
    TOGGLE_LAYOUT_MODE: (state, layout) => {
      Vue.ls.set(DEFAULT_LAYOUT_MODE, layout)
      state.layout = layout
    },
    TOGGLE_MENU_THEME: (state, menuTheme) => {
      Vue.ls.set(DEFAULT_MENU_THEME, menuTheme)
      state.menuTheme = menuTheme
    },
    SET_SIDEBAR_STATE: (state, sidebarOpen) => {
      Vue.ls.set(SIDEBAR_STATE, sidebarOpen)
      state.sidebarOpen = sidebarOpen
    },
    CLOSE_SIDEBAR: (state) => {
      Vue.ls.set(SIDEBAR_STATE, true)
      state.sidebarOpen = false
    },
    TOGGLE_FIXED_HEADER: (state, fixed) => {
      Vue.ls.set(DEFAULT_FIXED_HEADER, fixed)
      state.fixedHeader = fixed
    },
    TOGGLE_FIXED_SIDERBAR: (state, fixed) => {
      Vue.ls.set(DEFAULT_FIXED_SIDERBAR, fixed)
      state.fixedSiderbar = fixed
    },
    TOGGLE_FIXED_HEADER_HIDDEN: (state, show) => {
      Vue.ls.set(DEFAULT_FIXED_HEADER_HIDDEN, show)
      state.autoHideHeader = show
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    }
  },
  actions: {
    ToggleMultiTab ({ commit }, bool) {
      commit('TOGGLE_MULTI_TAB', bool)
    },
    TogglePrimaryColor ({ commit }, color) {
      commit('TOGGLE_PRIMARY_COLOR', color)
    },
    ToggleDevice ({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    setSidebar ({ commit }, sidebarOpen) {
      commit('SET_SIDEBAR_STATE', sidebarOpen)
    },
    closeSidebar ({ commit }) {
      commit('CLOSE_SIDEBAR')
    },
    ToggleLayoutMode ({ commit }, layout) {
      commit('TOGGLE_LAYOUT_MODE', layout)
    },
    ToggleMenuTheme ({ commit }, menuTheme) {
      commit('TOGGLE_MENU_THEME', menuTheme)
    },
    ToggleFixedHeader ({ commit }, fixedHeader) {
      // if (!fixedHeader) {
      //  commit('TOGGLE_FIXED_HEADER_HIDDEN', false)
      // }
      commit('TOGGLE_FIXED_HEADER', fixedHeader)
    },
    ToggleFixSiderbar ({ commit }, fixSiderbar) {
      commit('TOGGLE_FIXED_SIDERBAR', fixSiderbar)
    },
    ToggleFixedHeaderHidden ({ commit }, show) {
      commit('TOGGLE_FIXED_HEADER_HIDDEN', show)
    },
    ToggleAccordionMode ({ commit }, sidebarAccordionMode) {
      commit('TOGGLE_ACCORDION_MODE', sidebarAccordionMode)
    }
  }
}

export default app
