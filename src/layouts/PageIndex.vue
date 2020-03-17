<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <page-sider v-if="isSideMenu()"
    :menuTheme="menuTheme"
    :accrodion="sidebarAccordionMode"
    :collapsed="collapsed"
    :collapsible="true"
    :fixedSiderbar="fixedSiderbar"
    :menus="menus"
    />
    <a-layout :style="{ paddingLeft: contentPaddingLeft, minHeight: minHeight+'px' }">
      <page-header :collapsed="collapsed" @toggle="toggle" :mode="layoutMode" :menus="menus" :menuTheme="menuTheme"/>
      <a-layout-content :style="{ minHeight: '280px', paddingTop: fixedHeader ? '64px' : '0' }">
          <multi-tab v-if="multiTab"></multi-tab>
          <route-view v-if="isRouterAlive"/>
      </a-layout-content>
      <!-- <a-layout-footer style="textAlign: center">
        <page-footer />
      </a-layout-footer> -->
    </a-layout>
  </a-layout>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import PageHeader from '@/layouts/PageHeader'
// import PageFooter from '@/components/PageFooter'
import PageSider from '@/layouts/PageSider'
import RouteView from '@/layouts/RouteView'
import { mixin, AppDeviceEnquire } from '@/utils/mixin'
import { triggerWindowResizeEvent } from '@/utils/utils'

import '@/stylus/global.styl'

export default {
  mixins: [mixin, AppDeviceEnquire],
  components: {
    PageHeader,
    // PageFooter,
    PageSider,
    RouteView
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true,
      collapsed: false,
      minHeight: document.documentElement.clientHeight,
      menus: []
    }
  },
  computed: {
    ...mapState({
      // mainMenu: state => state.permission.addRouters ppt
      mainMenu: state => state.user.menuTree
    }),
    contentPaddingLeft () {
      if (this.layoutMode === 'topmenu') {
        return 0
      } else {
        if (this.fixedSiderbar) {
          return this.sidebarOpen ? '200px' : '80px'
        }
      }
      return 0
    }
  },
  methods: {
    ...mapActions(['setSidebar']),
    handleClick (e) {
      console.log('click', e)
    },
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    toggle () {
      this.collapsed = !this.collapsed
      this.setSidebar(!this.collapsed)
      triggerWindowResizeEvent()
    }
  },
  watch: {
    sidebarOpen (val) {
      this.collapsed = !val
    }
  },
  created: function () {
    // 刷新 保存sideBar伸缩状态 未完成
    // console.log('sidebarOpen', this.sidebarOpen)
    // this.collapsed = !this.sidebarOpen
    // this.setSidebar(this.sidebarOpen)
    this.menus = [...this.mainMenu]
    // this.menus = this.mainMenu.find(item => item.path === '/').children ppt
  },
  mounted: function () {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      console.log('ie')
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }
  }
}
</script>
