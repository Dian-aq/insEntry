<template>
    <div>
        <a-card title="折线图" :bordered="false" style="margin-top:10px">
            <div slot="extra">
                <a-button @click="changeChartData">重获chartData</a-button>
                <a-button @click="changeOption">自定义option</a-button>
            </div>
            <line-chart :chartData="chartData"/>
        </a-card>
    </div>
</template>
<script>
import LineChart from '@/components/Echarts/LineChart'

export default {
  components: {
    LineChart
  },
  data () {
    return {
      chartData: {
        dimensions: {
          name: 'Week',
          data: ['Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fir.', 'Sat.', 'Sun.']
        },
        measures: [{
          name: 'Vue',
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }]
      },
      option: {}
    }
  },
  methods: {
    changeChartData () {
      // 模拟数据
      let _arr = []
      for (let i = 0; i <= 6; i++) {
        _arr.push(Math.random() * 1000)
      }
      this.chartData = {
        dimensions: {
          name: '星期',
          data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
        },
        measures: [{
          name: 'Vue',
          data: _arr
        }]
      }
    },
    changeOption () {
      this.option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar'
        }]
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
    .ant-btn
        margin-right 5px
</style>
