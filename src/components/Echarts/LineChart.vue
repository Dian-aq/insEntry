<!--
/*
 * @Description: Echarts的折线图封装
 * @Author: popotang
 * @param id [String] 图表id，不填则自动生成
 * @param chartData [Object] 数据默认{}
 * @param width [Number] 宽度
 * @param height [Number] 高度
 * @param option [Object] echart配置参数，页面必须手动引入:option="option"
*/
-->
<template>
  <div>
    <div class="shadow" v-show="isOptionAbnormal">数据为空</div>
    <div :id="id" class="echart" :style="style" v-show="!isOptionAbnormal"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
import uuidv1 from 'uuid/v1'
import { isValidOption, isEmptyObject } from '@/utils/utils' // triggerWindowResizeEvent

export default {
  name: 'line-chart',
  data () {
    return {
      chart: '',
      isOptionAbnormal: false
    }
  },
  props: {
    id: {
      type: String,
      default () {
        return uuidv1()
      }
    },
    chartData: {
      type: Object,
      default () {
        return {}
      }
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    option: {
      type: Object,
      // Object类型的prop值一定要用函数return出来，不然会报错。原理和data是一样的，
      default () {
        return {
          xAxis: {
            type: 'category',
            data: this.chartData.dimensions.data
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.chartData.measures[0].data,
            type: 'line'
          }]
        }
      }
    }
  },
  computed: {
    style () {
      return {
        height: this.height,
        width: this.width
      }
    }
  },
  watch: {
    chartData (val) {
      this.chartData = val
      this.option.xAxis.data = val.dimensions.data
      this.option.series[0].data = val.measures[0].data
      this.drawChart()
    },
    option: {
      handler (newVal, oldVal) {
        if (this.chart) {
          if (isValidOption(newVal)) {
            this.chart.setOption(newVal)
            this.isOptionAbnormal = false
          } else {
            this.chart.setOption(oldVal)
            this.isOptionAbnormal = true
          }
        } else {
          this.drawChart()
        }
      },
      deep: true // 对象内部属性的监听，关键。
    }
  },
  mounted () {
    if (isEmptyObject(this.chartData)) {
      this.isOptionAbnormal = true
    }
    this.$nextTick(() => {
      this.drawChart()
    })
  },
  created () {
    // isValidOption(this.option)
  },
  methods: {
    drawChart () {
      this.chart = echarts.init(document.getElementById(this.id))
      if (this.chart === undefined) {
        console.error(`echarts init dom id ${this.id} failed`)
        return
      }
      this.chart.setOption(this.option)

      let self = this
      let work = null
      window.addEventListener('resize', function () {
        if (work == null) {
          work = setTimeout(function () {
            self.chart.resize()
            work = null
          }, 100)
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  .shadow
    width 100%
    height 100%
    display flex
    justify-content center
    align-items center
    font-size 1rem
    color #8590a6
</style>
