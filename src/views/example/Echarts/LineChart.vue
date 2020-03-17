<template>
    <div>
        <a-card title="折线图" :bordered="false" style="margin-top:10px">
            <div slot="extra">
                <a-button @click="changeChartData">重获chartData</a-button>
                <a-button @click="changeOption">自定义option</a-button>
            </div>
            <ve-line-chart :data="chartData" :settings="chartSettings" />
        </a-card>
    </div>
</template>
<script>
// import echarts from 'echarts'
import 've-charts/lib/common' // 公共chuck，引入单个图表前需引入公共包
import VeLineChart from 've-charts/lib/VeLineChart' // 单个图表chuck
import 've-charts/lib/ve-charts.min.css'

export default {
  components: {
    VeLineChart
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
        name: 'Week',
        data: ['Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fir.', 'Sat.', 'Sun.']
      },
      measures: [{
        name: 'V1',
        data: [256, 767, 1356, 2087, 803, 582, 432]
      }, {
        name: 'V2',
        data: [287, 707, 1756, 1822, 987, 432, 322]
      }]
    }
  },
  methods: {
    buildMeasures () {
      let lineNum = Math.floor(Math.random() * (1 - 5) + 5) // 随机数1-5
      let measures = []
      for (let i = 1; i <= lineNum; i++) {
        let _arr = []
        for (let i = 0; i <= 6; i++) {
          _arr.push(Math.floor(Math.random() * 1000))
        }
        let line = {
          name: 'V' + i,
          data: _arr
        }
        measures.push(line)
      }
      return measures
    },
    changeChartData () {
      // 模拟数据
      this.chartData = {
        dimensions: {
          name: '星期',
          data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
        },
        measures: this.buildMeasures()
      }
    },
    changeOption () {
      this.chartSettings = {
        label: {
          show: true,
          fontSize: '12',
          fontWeight: 'bold'
        },
        smooth: true
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
    .ant-btn
        margin-right 5px
</style>
