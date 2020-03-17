<template>
    <div>
        <a-card title="环型图" :bordered="false" style="margin-top:10px">
            <div slot="extra">
                <a-button @click="changeChartData">重获chartData</a-button>
                <a-button @click="changeOption">自定义option</a-button>
            </div>
            <ve-donut-chart :data="chartData" :settings="chartSettings" />
        </a-card>
    </div>
</template>
<script>
// import echarts from 'echarts'
import 've-charts/lib/common' // 公共chuck，引入单个图表前需引入公共包
import VeDonutChart from 've-charts/lib/VeDonutChart' // 单个图表chuck
import 've-charts/lib/ve-charts.min.css'

export default {
  components: {
    VeDonutChart
  },
  data () {
    return {
      chartData: {},
      chartSettings: {}
    }
  },
  created () {
    this.chartData = {
      dimensions: {
        name: '渠道',
        data: ['APP', 'PC', 'M端', '微信', '手Q', '小程序']
      },
      measures: [{
        name: 'PV',
        data: [40000, 27800, 22000, 20200, 15600, 13600]
      }]
    }
  },
  methods: {

    changeChartData () {
      // 模拟数据
      let _arr = []
      for (let i = 0; i <= 5; i++) {
        _arr.push(Math.floor(Math.random() * 50000))
      }
      this.chartData = {
        dimensions: {
          name: '渠道',
          data: ['APP', 'PC', 'M端', '微信', '手Q', '小程序']
        },
        measures: [{
          name: 'PV',
          data: _arr
        }]
      }
    },
    changeOption () {
      this.chartSettings = {
        radius: ['35%', '55%']
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
    .ant-btn
        margin-right 5px
</style>
