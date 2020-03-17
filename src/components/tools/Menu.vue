<template>
    <a-menu :theme="theme" :mode="mode" :defaultSelectedKeys="['13']" @select="onSelect" :openKeys="openKeys" :defaultOpenKeys="computedOpenKeys" @openChange="onOpenChange">
      <a-sub-menu key="sub1" @titleClick="titleClick">
          <span slot="title"><a-icon type="pie-chart" /><span>能效管理</span></span>
          <a-menu-item key="1"><router-link to="/overviews">用电概况</router-link></a-menu-item>
          <a-menu-item key="2"><router-link to="/realtime-data">实时数据</router-link></a-menu-item>
          <a-menu-item key="3">在线监测</a-menu-item>
          <a-menu-item key="4">对比分析</a-menu-item>
          <a-menu-item key="5">最大需量</a-menu-item>
          <a-menu-item key="6">能效报告</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub2" @titleClick="titleClick">
          <span slot="title"><a-icon type="file-text" /><span>运维档案</span></span>
          <a-menu-item key="7">设备档案</a-menu-item>
          <a-menu-item key="8">运维档案 </a-menu-item>
          <a-menu-item key="9">缺陷预警</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub3" @titleClick="titleClick">
          <span slot="title"><a-icon type="solution" /><span>我的报告</span></span>
          <a-menu-item key="10">方案报告</a-menu-item>
          <a-menu-item key="11">合同档案</a-menu-item>
          <a-menu-item key="12">运维技师</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub4" @titleClick="titleClick">
          <span slot="title"><a-icon type="appstore" /><span>业务组件</span></span>
          <a-sub-menu key="sub4-1" title="结果页">
            <a-menu-item key="13"><router-link to="/result/success">成功</router-link></a-menu-item>
            <a-menu-item key="14"><router-link to="/result/fail">失败</router-link></a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub4-2" title="异常页">
            <a-menu-item key="15"><router-link to="/views/403">403</router-link></a-menu-item>
            <a-menu-item key="16"><router-link to="/views/404">404</router-link></a-menu-item>
            <a-menu-item key="17"><router-link to="/views/500">500</router-link></a-menu-item>
            <a-menu-item key="18"><router-link to="/views/triggerException">触发异常</router-link></a-menu-item>
          </a-sub-menu>
      </a-sub-menu>
    </a-menu>
</template>
<script>

export default {
  props: {
    mode: {
      type: String,
      default: 'inline',
      required: false
    },
    theme: {
      type: String,
      default: 'dark',
      required: false
    },
    accrodion: {
      type: Boolean,
      default: false,
      required: false
    },
    menus: {
      type: Array,
      default: function () { return [] },
      required: true
    }
  },
  data () {
    return {
      rootSubmenuKeys: ['sub1', 'sub2', 'sub3', 'sub4'],
      openKeys: []
    }
  },
  computed: {
    computedOpenKeys () {
      let r
      if (this.mode === 'horizontal') {
        r = []
      } else { r = this.openKeys }
      return r
    }
  },
  mounted: function () {
    console.log('menus:' + this.menus)
  },
  methods: {
    titleClick (e) {
      // console.log('titleClick', e)
    },
    onSelect (e) {
      console.log('onSelect', e)
    },
    onOpenChange (openKeys) {
      console.log('openKeys:', openKeys)
      if (this.accrodion) {
        const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1)
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
          this.openKeys = openKeys
        } else {
          this.openKeys = latestOpenKey ? [latestOpenKey] : []
        }
      } else {
        this.openKeys = openKeys
      }
    }
  }
}
</script>
<style lang="stylus">

</style>
