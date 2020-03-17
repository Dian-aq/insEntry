<template>
  <div>
    <a-card title="监测点" size="small" :bodyStyle="{ minHeight:cardHeight +'px', overflowY: 'hidden', overflowX: 'hidden', padding: '14px' }">
      <a-tree
        v-if="computedMeterPoint.length"
        @load="onLoad"
        :treeData="computedMeterPoint"
        showIcon
        @select="onSelect"
        :selectedKeys="defaultSelectedKey"
        @expand="onExpand"
        :autoExpandParent="true"
        :expandedKeys="expandedKeys"
      >
          <a-icon type="down" slot="switcherIcon" />
          <i slot="customer" class="iconfont icon-customer" style="color:#647DFA"></i>
          <i slot="dian" class="iconfont icon-dian" style="color:#FAAD14"></i>
          <i slot="catalog" class="iconfont icon-catalog" style="color:#F52222"></i>
          <template slot="custom" slot-scope="{selected}">
          <a-icon :type="selected ? 'frown':'frown-o'" />
          </template>
      </a-tree>
    </a-card>
  </div>
</template>

<script>
// import { monitor } from '@/api'
import { mixinMeterPoint } from '@/views/monitor/realtimeData/mixin'

export default {
  name: 'MeterPointerTree',
  mixins: [mixinMeterPoint],
  props: {
    customerId: {
      type: String,
      required: true,
      default: ''
    },
    defaultSelectedKey: {
      type: Array,
      default: function () { return [] }
    }
  },
  data () {
    return {
      expandedKeys: [],
      cardHeight: document.body.offsetHeight - 100 - 3
    }
  },
  watch: {
    defaultSelectedKey: function (val, oldVal) {
      // console.log(val, oldVal)
      if (val !== oldVal) {
        this.expandedKeys = val
      }
    }
  },
  methods: {
    onExpand (expandedKeys) {
      // console.log('onExpand', expandedKeys)
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onLoad (loadedKeys, event) {
      // console.log('onLoad', loadedKeys)
      this.$emit('load', loadedKeys)
    },
    onSelect (selectedKeys, info) {
      this.$emit('select', selectedKeys[0], info)
    }
  }
}
</script>
<style lang="stylus">
  .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected::before
    background #1890ff
</style>
