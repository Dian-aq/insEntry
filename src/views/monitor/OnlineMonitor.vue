<template>
    <div>
      <a-row>
        <a-col :xs="12" :sm="5" :span="4">
          <meter-pointer-tree customerId="haha" :defaultSelectedKey="treeSelectedKeys" @select="onTreeSelect" @load="onTreeLoad"></meter-pointer-tree>
        </a-col>
        <a-col :xs="12" :sm="19" :span="20" style="padding:20px">
          <factor-selector :pointId="selectedPointId" :pointType="selectedPointType" ref="factorSelector" @search="onSearch" @complete="onFactorComplete"></factor-selector>
          <a-card
            style="width:100%;margin-top:10px"
            :tabList="tabsList"
            :activeTabKey="tabsListActiveKey"
            @tabChange="tabsListActiveKey => onTabChange(tabsListActiveKey, 'tabsListActiveKey')"
          >
            <div v-if="tabsListActiveKey === 'trendmap'">
              <ve-line-chart :data="chartData" :settings="chartSettings" :yAxis="chartStyle.yAxis" :height="300" :theme="ins" :loading="tableLoading"/>
              <a-table :columns="columns" :dataSource="tableData" rowKey="name" :pagination="false" :loading="tableLoading" :scroll="{ x: 800 }">
                <span slot="action" slot-scope="action">
                  <a-tag v-if="action==='warning31'" color="#198cff">一般</a-tag>
                  <a-tag v-if="action==='warning32'" color="#faad14">紧急</a-tag>
                  <a-tag v-if="action==='warning33'" color="#f52222">严重</a-tag>
                  <a-tag v-if="action==='warning34'" color="#f52222">严重</a-tag>
                </span>
                <span slot="doit">
                  <a href="javascript:;">通知历史</a>
                </span>
              </a-table>
            </div>
            <div v-else>
              <a-button @click="exportHistoryData" :loading="exportLoading" style="margin-bottom:10px">导出数据</a-button>
              <a-table
                :columns="historyColumns"
                :dataSource="historyData"
                bordered
                rowKey="gettime"
                :scroll="{x: 1000 }"
                :loading="tableLoading"
                size="middle"
              />
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
</template>
<script>
import MeterPointerTree from '@/components/MeterPointerTree'
import FactorSelector from '@/components/FactorSelector'
import { mapGetters } from 'vuex'
// import 've-charts/lib/common' // 公共chuck，引入单个图表前需引入公共包
// import VeLineChart from 've-charts/lib/VeLineChart' // 单个图表chuck
import { VeLineChart } from 've-charts'
// import 've-charts/lib/ve-charts.min.css'
import ins from '@/utils/echartTheme'
import { monitor } from '@/api'

let p1 = {}
const columns = [
  {
    dataIndex: 'name',
    title: '监测因子',
    width: 300
  },
  {
    title: '最新值',
    dataIndex: 'count'
  },
  {
    title: '最大值',
    dataIndex: 'maxValue'
  },
  {
    title: '最大值时间',
    dataIndex: 'maxTime'
  },
  {
    title: '最小值',
    dataIndex: 'minValue'
  },
  {
    title: '最小值时间',
    dataIndex: 'minTime'
  },
  {
    title: '平均值',
    dataIndex: 'avgValue'
  }
]

export default {
  name: 'OnlineMonitor',
  components: {
    MeterPointerTree,
    FactorSelector,
    VeLineChart
  },
  data () {
    return {
      ins,
      chartData: {},
      chartSettings: {},
      chartStyle: {
        yAxis: {
          scale: true,
          axisLine: {
            show: false
          },
          axisTick: {
            lineStyle: {
              color: '#e1e1e1'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#e1e1e1',
              type: 'dashed'
            }
          }
        }
      },
      columns,
      historyColumns: [],
      historyData: [],
      tableData: [],
      tableLoading: false,
      exportLoading: false,
      tabsList: [{
        key: 'trendmap',
        tab: '趋势图'
      }, {
        key: 'datatable',
        tab: '数据表格',
        scopedSlots: { tab: 'tabBarExtraContent' }
      }],
      tabsListActiveKey: 'trendmap',
      selectedPointId: '',
      selectedPointType: '',
      selectedPointName: '',
      factorData: null
    }
  },
  computed: {
    ...mapGetters([
      'meterPoint'
    ]),
    treeSelectedKeys () {
      return Array.of(this.selectedPointId)
    }
  },
  mounted () {
    // this.$message.warning('设置监测点id为 faa18380-a815-4d89-bdf7-00fb962b63a5')
    if (this.meterPoint) {
      this.selectedPointId = this.meterPoint[0].children[0].key
      this.selectedPointName = this.meterPoint[0].children[0].title
      this.selectedPointType = this.meterPoint[0].children[0].modelId
    }
    // this.$refs.factorSelector.getFactors('faa18380-a815-4d89-bdf7-00fb962b63a5')
  },
  methods: {
    exportHistoryData () {
      this.exportLoading = true
      monitor.exportHistoryData(p1)
        .then((res) => {
          const blob = new Blob([res.data])
          const downloadElement = document.createElement('a')
          const href = window.URL.createObjectURL(blob)
          // 后台再header中传文件名
          const name = decodeURI(res.headers.filename)
          downloadElement.href = href
          downloadElement.download = name
          document.body.appendChild(downloadElement)
          downloadElement.click()
          document.body.removeChild(downloadElement) // 下载完成移除元素
          this.exportLoading = false
        })
        .catch((err) => {
          console.log(err)
        })
    },
    onFactorComplete (p) {
      this.onSearch(p)
    },
    onSearch (p2) {
      this.factorData = p2
      p1 = {
        measurePointId: this.selectedPointId,
        measurePointName: this.selectedPointName
      }
      Object.assign(p1, p2)
      this.tableLoading = true
      monitor.getHistoryData(p1)
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            console.log('getHistoryData', res.body)
            this.chartData = res.body.line
            this.tableData = res.body.data
            this.chartSettings = {
              smooth: true,
              tooltipFormatter: function (params) {
                return params[0].value[0] + '<br/>' + params[0].seriesName + ' ' + params[0].value[1] + ' ' + res.body.line.measures[0].unit
              }
            }
            this.tableLoading = false
          }
        })
        .catch((err) => {
          console.log(err)
        })
      monitor.getHistoryTableData(p1)
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            console.log('getHistoryTableData', res.body)
            this.historyColumns = res.body.columns
            this.historyData = res.body.data
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    onTreeSelect (selectedKeys, info) {
      // 不能取消选择
      if (selectedKeys) {
        this.selectedPointId = selectedKeys
        this.selectedPointName = info.node.title
        this.selectedPointType = info.node.dataRef.modelId
      }
      // this.onSearch(this.factorData)
    },
    onTreeLoad (treeNodes) {
      console.log('onTreeLoad', treeNodes)
      this.selectedPointId = treeNodes[0].children[0].key
    },
    onTabChange (key, type) {
      this[type] = key
    }
  }
}
</script>
