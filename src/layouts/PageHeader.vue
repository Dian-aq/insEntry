<template>
  <transition name="showHeader">
    <div v-if="visible" class="header-animat">
      <a-layout-header v-if="visible" :class="[{sideHeader: isSideMenu(), 'ant-header-fixedHeader':fixedHeader},menuTheme, sidebarOpen ? 'ant-header-side-opened' : 'ant-header-side-closed']">
        <div v-if="isSideMenu()" class="page-header">
            <div class="header-left">
              <a-icon
                class="trigger"
                :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                @click="toggle"
              />
              <customer-company></customer-company>
            </div>
            <div class="header-right">
              <header-menu />
            </div>
        </div>
        <div v-else class="page-top">
          <div class="page-top-left">
            <logo />
            <!-- <s-menu mode="horizontal" :menus="menus" :theme="menuTheme" /> -->
            <!-- <s-menu :theme="menuTheme" mode="horizontal"/> -->
          </div>
          <div class="page-top-right">
            <header-menu />
          </div>
        </div>
      </a-layout-header>
    </div>
  </transition>
</template>
<script>

import logo from '@/components/tools/Logo'
import HeaderMenu from '@/components/tools/HeaderMenu'
import CustomerCompany from '@/components/tools/CustomerCompany'
// import sMenu from '@/components/Menu' // render()函数式渲染菜单
import { mixin } from '@/utils/mixin'

export default {
  mixins: [mixin],
  components: {
    logo,
    HeaderMenu,
    CustomerCompany
    // sMenu
  },
  props: {
    collapsed: {
      type: Boolean
    },
    menus: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      visible: true,
      oldScrollTop: 0
    }
  },
  mounted () {
    document.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll () {
      if (!this.autoHideHeader) {
        return
      }
      const scrollTop = document.body.scrollTop + document.documentElement.scrollTop
      if (!this.ticking) {
        this.ticking = true
        requestAnimationFrame(() => {
          if (this.oldScrollTop > scrollTop) {
            this.visible = true
          } else if (scrollTop > 300 && this.visible) {
            this.visible = false
          } else if (scrollTop < 300 && !this.visible) {
            this.visible = true
          }
          this.oldScrollTop = scrollTop
          this.ticking = false
        })
      }
    },
    toggle () {
      this.$emit('toggle')
    }
  },
  beforeDestroy () {
    document.removeEventListener('scroll', this.handleScroll, true)
  }
}
</script>
