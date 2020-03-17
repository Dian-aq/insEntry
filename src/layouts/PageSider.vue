<template>
  <a-layout-sider
    :class="['sider', menuTheme, { 'ant-fixed-sidemenu': fixedSiderbar }]"
    :width="200"
    :trigger="null"
    :collapsible="collapsible"
    v-model="collapsed"
    :style="{ minHeight:siderHeight +'px', overflow:'auto' }"
    >
    <div class="page-sider">
        <logo />
        <s-menu :theme="menuTheme" :menus="menus" :accrodion="accrodion" @select="onSelect" @titleClick="titleClick" :collapsed="collapsed"/>
    </div>
  </a-layout-sider>
</template>
<script>
import logo from '@/components/tools/Logo'
import sMenu from '@/components/Menu' // render()函数式渲染菜单
// import sMenu from '@/components/tools/Menu' // template形式渲染菜单

export default {
  components: {
    logo,
    sMenu
  },
  props: {
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menuTheme: {
      type: String,
      required: false,
      default: 'dark'
    },
    fixedSiderbar: {
      type: Boolean,
      required: true,
      default: false
    },
    accrodion: {
      type: Boolean,
      required: true,
      default: false
    },
    menus: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      siderHeight: document.body.offsetHeight
    }
  },
  methods: {
    onSelect (obj) {
      // this.$emit('menuSelect', obj)
    },
    titleClick (key) {
      // this.$emit('titleClick', key)
    }
  }
}
</script>
