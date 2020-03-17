<template>
    <div>
      <a-row>
        <a-col :xs="12" :sm="5" :span="4">
          <meter-pointer-tree customerId="haha" :defaultSelectedKey="treeSelectedKeys" @select="onTreeSelect" @load="onTreeLoad"></meter-pointer-tree>
        </a-col>
        <a-col :xs="12" :sm="19" :span="20" style="padding:20px">
            <div style="margin-bottom:10px">
                <a-radio-group v-model="reportType" defaultValue="day" @change="ontypeChange" size="small" buttonStyle="solid" style="margin-right:40px">
                  <a-radio-button value="day">日报表</a-radio-button>
                  <a-radio-button value="month">月报表</a-radio-button>
                  <a-radio-button value="year">年报表</a-radio-button>
                </a-radio-group>
              参考日期：
                <a-range-picker
                :value="[moment(this.startTime, dateOption.formatStr), moment(this.endTime,dateOption.formatStr)]"
                @change="onRangeDateChange"
                @openChange="onOpenChange"
                @panelChange="onPanelChange"
                @calendarChange="oncalendarChange"
                :open="dateOpen"
                :mode="dateOption.mode"
                :showTime="dateOption.showTime"
                size="small" :format="dateOption.formatStr" style="margin-right:20px"/>
                <a-button icon="step-backward" size="small" class="mar-r-10" @click="setDate('lastCycle', 2)">上一个周期</a-button>
                <a-button size="small" icon="step-forward" @click="setDate('nextCycle', 2)">下一个周期</a-button>
            </div>
          <a-card size="small" style="width:100%;margin-top:10px">
            <div slot="title" class="zxzx">
              <span style="margin-right: 20px">单位：kWh</span>
              用电时段：<i class="color-block jian"></i> 尖段<i class="color-block feng"></i> 峰段<i class="color-block ping"></i> 平段<i class="color-block gu"></i> 谷段
            </div>
            <a-button type="default" :loading="exportLoading" slot="extra" icon="export" @click="exportData">导出</a-button>
            <a-table
              :columns="computedColumns"
              :rowKey="record => record.id"
              :dataSource="reportData"
              bordered
              :rowClassName="rowClass"
              :pagination="pagination"
              :scroll="{ x: tableWidth }"
              :loading="tableLoading"
              size="middle">
              <span slot="customHeader"><a-icon type="smile-o" /> Name</span>
            </a-table>
          </a-card>
        </a-col>
      </a-row>
      <a-modal
        :title="modalTitle"
        centered
        :width="1300"
        :footer="null"
        :bodyStyle="{height: '600px', padding: '10px'}"
        v-model="modalShow"
      >
        <div style="position: absolute; top:20px; right: 10%; z-index:444">
          <i class="color-block jian2"></i> 尖段<i class="color-block feng2"></i> 峰段<i class="color-block ping2"></i> 平段<i class="color-block gu2"></i> 谷段
        </div>
        <ve-bar-chart
          v-if="reportType==='day'"
          :legend-visible="false"
          :title="chartTitle"
          :yAxis="chartStyle.yAxis"
          :grid="chartStyle.grid"
          :data="chartData"
          :settings="chartSettings"
          :series="computedSeries"
          :loading="chartLoading"
          :height="600"
        />
        <ve-bar-chart
          v-else
          :data="chartData"
          :title="chartTitle2"
          :grid="chartStyle.grid"
          :yAxis="chartStyle.yAxis"
          :color="colorx"
          :settings="computedChartSetting"
          :loading="chartLoading"
          :height="600"
        />
      </a-modal>
    </div>
</template>
<script>
import MeterPointerTree from '@/components/MeterPointerTree'
import { monitor } from '@/api'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { setDateMixin } from '@/utils/mixin'
import { VeBarChart } from 've-charts'
import { isEmptyObject } from '@/utils/utils'

let _panelclick = 0

export default {
  name: 'DataReport',
  mixins: [setDateMixin],
  components: {
    MeterPointerTree,
    VeBarChart
  },
  data () {
    return {
      color: ['#f52222', '#fa6728', '#198cff', '#52c41a', '#6208da'], // 尖、峰、平、谷、总
      chartData: {},
      chartSettings: {},
      chartLoading: true,
      chartTitle: {
        show: true,
        text: '小时有功电量',
        left: 'left'
      },
      chartTitle2: {
        show: false
      },
      chartStyle: {
        yAxis: {
          name: '用电量（kWh）'
        },
        grid: {
          left: 50,
          right: 50,
          top: 80,
          bottom: 80
        }
      },
      dateOpen: false,
      selectedPointId: '',
      selectedPointType: '',
      tableWidth: 0,
      columns: [],
      tableLoading: false,
      exportLoading: false,
      modalShow: false,
      modalTitle: '',
      pagination: {
        size: 'small',
        total: 0,
        current: 1,
        defaultPageSize: 20,
        showTotal: total => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '15', '20'],
        onChange: (current, pageSize) => this.onPageChange(current),
        onShowSizeChange: (current, pageSize) => this.onPageShowSizeChange(pageSize)
      },
      tableHeght: document.body.offsetHeight - 153 - 12 - 100,
      reportData: [],
      reportType: 'day',
      pageSize: 20,
      startTime: moment().startOf('day'),
      endTime: moment().endOf('day')
    }
  },
  computed: {
    ...mapGetters([
      'meterPoint'
    ]),
    treeSelectedKeys () {
      return Array.of(this.selectedPointId)
    },
    computedColumns () {
      let computedCols = JSON.parse(JSON.stringify(this.columns))
      computedCols.forEach((item, index) => {
        // 渲染表头 icon
        // console.log(item, customHeaderCell)
        if (index !== 0) item.customHeaderCell = this.customHeaderCell // 表头增加图标
        if (item.children && item.children.length > 0) {
          item.children.forEach((item2, index2) => {
            // if (index2 !== item.children.length - 1) {
            item2.width = 100
            // }
          })
        } else {
          if (index === computedCols.length - 1 && !item.children) {} else {
            item.width = 150
          }
        }
      })
      // console.log('computedCols', computedCols)
      return computedCols
    },
    dateOption () {
      let dateOpts = {
        mode: ['date', 'date'],
        formatStr: 'YYYY-MM-DD HH',
        showTime: { format: 'HH' }
      }
      if (this.reportType === 'day') {
        dateOpts.mode = ['date', 'date']
        dateOpts.formatStr = 'YYYY-MM-DD HH'
      } else if (this.reportType === 'month') {
        dateOpts.mode = ['date', 'date']
        dateOpts.formatStr = 'YYYY-MM-DD'
        dateOpts.showTime = false
      } else {
        dateOpts.mode = ['month', 'month']
        dateOpts.formatStr = 'YYYY-MM'
        dateOpts.showTime = false
      }
      return dateOpts
    },
    computedChartSetting () {
      let setting = {
        showLine: ['总'],
        stack: {
          sum: [ '尖', '峰', '平', '谷' ]
        },
        tooltipFormatter: function (params) {
          let [tar] = params
          const tooltipContent = params.map(v => {
            return `${v.seriesName}：${v.value[v.seriesIndex + 1]} kWh`
          }).join('<br/>')
          return tar.name + '<br/>' + tooltipContent
        }
      }
      return setting
    },
    computedSeries () {
      let series = []
      if (this.chartData.time) {
        let time = this.chartData.time
        series = [
          {
            type: 'bar',
            itemStyle: {
              color: function (params) {
                let colorList = {
                  jian: '#f52222',
                  feng: '#fa6728',
                  ping: '#198cff',
                  gu: '#52c41a',
                  other: '#cccccc'
                }
                return time[params.dataIndex] ? colorList[time[params.dataIndex]] : colorList.other
              }
            }
          }
        ]
        console.log('computedSeries', series)
      }
      return series
    },
    colorx () {
      let arr = []
      if (!isEmptyObject(this.chartData)) {
        this.chartData.measures.forEach((item, index) => {
          arr.push(this.color[this.colorIndex(item.name)])
        })
      }
      return arr
    }
  },
  mounted: function () {
    if (this.meterPoint) {
      this.selectedPointId = this.meterPoint[0].children[0].key
      this.selectedPointType = this.meterPoint[0].children[0].slots.icon
    }
    this.getReportData()
    window.openWin = this.openWin
  },
  methods: {
    moment,
    colorIndex (str) {
      let idx = 3 // 默认谷
      switch (str) {
        case '尖':
          idx = 0
          break
        case '峰':
          idx = 1
          break
        case '平':
          idx = 2
          break
        case '谷':
          idx = 3
          break
        default:
          idx = 4
      }
      return idx
    },
    rowClass (record, index) {
      return record.className
    },
    openWin (column) {
      this.chartLoading = true
      this.modalShow = true
      this.modalTitle = column.title[0].children[0].text
      let p = {
        measurePointId: column.measurePointId,
        startTime: this.startTime.format(this.dateOption.formatStr),
        endTime: this.endTime.format(this.dateOption.formatStr),
        type: this.reportType
      }
      monitor.getElecQuanChart(p)
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            console.log('getElecQuanChart', res.body)
            this.chartLoading = false
            this.chartData = res.body
            this.chartSettings = {
              tooltipFormatter: function (params) {
                let [tar] = params
                const tooltipContent = params.map(v => {
                  return `${v.seriesName}：${v.value[v.seriesIndex + 1]} kWh`
                }).join('<br/>')
                return tar.name + '<br/>' + tooltipContent
              }
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    customHeaderCell (column) {
      return {
        class: {
          meterHeader: true
        },
        domProps: {
          innerHTML: '<span style="color:rgba(0, 0, 0, 0.85)"">' + column.title[0].children[0].text + '</span><span class="iconfont icon-chart mar-l-15 point-icon"></span>'
        },
        on: {
          click: () => {
            this.openWin(column)
          }
        }
      }
    },
    exportData () {
      this.exportLoading = true
      let params = {
        id: this.selectedPointId,
        idType: this.selectedPointType,
        measurePointId: this.selectedPointId, // 131
        startTime: this.startTime.format(this.dateOption.formatStr),
        type: this.reportType,
        endTime: this.endTime.format(this.dateOption.formatStr)
      }
      // console.log(params)
      monitor.exportReportData(params)
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
    onOpenChange (status) {
      this.dateOpen = true
      if (this.reportType === 'day' || this.reportType === 'year') {
        this.pagination.current = 1
        !status && this.getReportData()
      }
    },
    onPanelChange (dates, mode) {
      this.startTime = dates[0]
      this.endTime = dates[1]
      _panelclick++
      // console.log('onPanelChange', dates, mode)
      if (_panelclick === 2) {
        _panelclick = 0
        this.dateOpen = false
        this.pagination.current = 1
        this.getReportData()
      }
    },
    onRangeDateChange (dates, dateString) {
      if (this.reportType === 'day') { // 限制3个月
        if (dates[1].diff(dates[0], 'month') + 1 > 3) {
          this.$message.error('时间跨度不能超过3个月')
          return false
        }
      } else if (this.reportType === 'month') { // 限制3年
        if (dates[1].diff(dates[0], 'years') + 1 > 3) {
          this.$message.error('时间跨度限制为3年')
          return false
        }
      }
      this.startTime = dates[0]
      this.endTime = dates[1]
      this.pagination.current = 1
      this.getReportData()
    },
    oncalendarChange (dates, dateString) {
      // console.log('oncalendarChange', dateString)
    },
    ontypeChange (e) {
      this.pagination.current = 1
      if (e.target.value === 'day') {
        this.startTime = moment().startOf('day')
        this.endTime = moment().endOf('day')
      } else if (e.target.value === 'month') {
        this.startTime = moment().startOf('month')
        this.endTime = moment()
      } else {
        this.startTime = moment().startOf('year')
        this.endTime = moment().endOf('year')
      }
      this.getReportData()
    },
    onPageChange (page, pageSize) {
      this.pagination.current = page
      this.getReportData()
    },
    onPageShowSizeChange (pageSize) {
      this.pageSize = pageSize
      this.getReportData()
    },
    onTreeSelect (selectedKeys, info) {
      // console.log('onTreeSelect', info)
      this.pagination.current = 1
      if (selectedKeys) {
        this.selectedPointId = selectedKeys
        this.selectedPointType = info.node.dataRef.slots.icon
        this.getReportData()
      }
    },
    onTreeLoad (treeNodes) {
      this.selectedPointId = treeNodes[0].children[0].key
    },
    getReportData () {
      this.dateOpen = false
      this.tableLoading = true
      let params = {
        id: this.selectedPointId,
        idType: this.selectedPointType,
        startTime: this.startTime.format(this.dateOption.formatStr),
        type: this.reportType,
        endTime: this.endTime.format(this.dateOption.formatStr),
        rows: this.pageSize,
        page: this.pagination.current
      }
      // console.log('传参', params)
      monitor.getReportData(params)
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            console.log('getReportData', res.body)
            this.columns = res.body.columns
            this.reportData = res.body.data
            this.pagination.total = res.body.page.rowCount
            // this.formatCustomColumns(res.body.columns)
            this.computedScrollX(res.body.columns)
          }
          this.tableLoading = false
        })
        .catch((err) => {
          console.log(err)
        })
    },
    computedScrollX (columns) {
      let tw = 0
      columns.forEach((item, index) => {
        if (item.children && item.children.length > 0) {
          item.children.forEach((item2, index2) => {
            tw += 100
          })
        } else {
          tw += 150
        }
      })
      tw = tw <= 600 ? 0 : tw
      // console.log('computedScrollX', tw)
      this.tableWidth = tw
    },
    formatCustomColumns (columns) {
      columns.forEach((item, index) => {
        if (item.title !== '时间') {
          item.slots = { title: 'customHeader' }
          item.scopedSlots = { customRender: 'name' }
        }
      })
      console.log('formatCustomColumns', columns)
    }
  }
}
</script>
<style lang="stylus">
  .meterHeader
    text-align center
  .point-icon
    font-size 24px
    color #198cff
    cursor pointer
  .zxzx
    display flex
    justify-content flex-start
    align-items center
  i.color-block
    display inline-block
    border 1px solid #ccc
    width 14px
    height 14px
    margin-right 5px
    margin-left 20px
  .jian
    background-color rgba(245,34,34,.08) !important
  .feng
    background-color rgba(250,173,20,.08) !important
  .ping
    background-color rgba(25,140,255,.08) !important
  .gu
    background-color rgba(82,196,26,.08) !important
  .jian2
    background-color #f52222 !important
  .feng2
    background-color #fa6728 !important
  .ping2
    background-color #198cff !important
  .gu2
    background-color #52c41a !important
</style>
