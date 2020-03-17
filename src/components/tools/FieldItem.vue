<!--
 * @Description: 带数字跳动的区块项组件
 * @Author: popotang
 * @Date: 2019-08-01 16:29:03
 * @param: {String} [title] 数据项的标题
 * @param: {String} [unit] 单位
 * @param: {Boolean} [bordered] 是否带分割线
 * @param: {Boolean} [center] 数据项居中
 * @param: {Number} [startVal] 初始值，默认为0
 * @param: {Number} [endVal] 传入最终值
 * @param: {Number} [decimals] 小数位数，自动计算
 * @param: {Number} [duration] 数字跳动时间，单位毫秒ms
 -->

<template>
  <div class="field-info" :class="center && 'center'">
    <span class="title">{{ title }}</span>
    <p><span v-if="value===-999999">--</span><count-to v-else :startVal="startVal" :endVal="value" :decimals="decimals" :duration='1500'/> <span class="unit">{{unit}}</span></p>
    <em v-if="bordered"/>
  </div>
</template>

<script>
import countTo from 'vue-count-to'

export default {
  name: 'FieldInfo',
  components: { countTo },
  data () {
    return {
      startVal: 0,
      decimals: 0
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      default: ''
    },
    bordered: {
      type: Boolean,
      default: false
    },
    center: {
      type: Boolean,
      default: true
    }
  },
  mounted: function () {
    let n = this.value.toString().split('.')[1]
    if (n > 0) {
      this.decimals = String(n).length
    }
  }
}
</script>

<style lang="stylus">
  .field-info
    display inline-block
    position: relative
    text-align: left
    padding: 0 32px 0 0
    min-width: 125px
    &.center
      text-align: center
      padding: 0 32px
    span.title
      color: rgba(0, 0, 0, .65)
      display: inline-block
      font-size: 12px
      line-height: 22px
      margin-bottom: 4px
    span.unit
      color: rgba(0, 0, 0, .45)
      font-size 12px
    p
      color: 198cff
      font-size: 24px
      line-height: 32px
      margin: 0
      span
        color #198cff
        font-weight 600
    em
      background-color: #e8e8e8
      position: absolute
      height: 56px
      width: 1px
      top: 0
      right: 0
    @media (max-width: 1440px)
      .field-info
        p
          line-height: 26px
</style>
