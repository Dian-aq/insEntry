<template>
    <div style="padding: 24px 16px;">
        <a-button @click="onBackClick" type="link" style="margin-bottom:10px" ><a-icon type="arrow-left" /> 返回</a-button>
        <a-row style="padding-bottom:10px">
            <a-col :span="6" style="padding-right:10px">
                <a-card :bodyStyle="{height: cardBodyHeght+56 +'px'}" class="left-card">
                    <a-row>
                        <a-col :span="4" :xs="8" class="field">设备：</a-col>
                        <a-col :span="20" :xs="16">{{info.measurePointName}}</a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="4" :xs="8" class="field">监测点：</a-col>
                        <a-col :span="20" :xs="16">{{info.measurePointName}}</a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="4" :xs="8" class="field">预警级别：</a-col>
                        <a-col :span="20" :xs="16">
                          <a-tag v-if="info.action === 'warning31'" color="#198cff">一般</a-tag>
                          <a-tag v-if="info.action === 'warning32' || info.action === 'warning33'" color="#faad14">紧急</a-tag>
                          <a-tag v-if="info.action === 'warning34'" color="#f52222">严重</a-tag>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="4" :xs="8" class="field">预警内容：</a-col>
                        <a-col :span="20" :xs="16" class="textEll">{{info.content}}</a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="4" :xs="8" class="field">标准值：</a-col>
                        <a-col :span="20" :xs="16">{{info.reference}}</a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="4" :xs="8" class="field">发生时间：</a-col>
                        <a-col :span="20" :xs="16">{{info.getTimeStr}}</a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="4" :xs="8" class="field">恢复时间：</a-col>
                        <a-col :span="20" :xs="16">{{info.cancelTimeStr}}</a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="4" :xs="8" class="field">持续时长：</a-col>
                        <a-col :span="20" :xs="16">{{info.longTime}}</a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="4" :xs="8" class="field">当前状态：</a-col>
                        <a-col :span="20" :xs="16">
                          <span style="color:#f52222" v-if="info.cancelState === '生效中'">生效中</span>
                          <span style="color:#52c41a" v-else>已恢复</span>
                        </a-col>
                    </a-row>
                </a-card>
            </a-col>
            <a-col :span="18">
                <a-card :title="cardTitle" :bodyStyle="{height: cardBodyHeght+'px',padding: '10px'}">
                    <!-- <a href="#" slot="extra">more</a> -->
                    <ve-line-chart :data="chartData" :dataZoom="chartDataZoom" :yAxis="yAxis" :visualMap="chartVisualMap" :settings="chartSettings" :height="cardBodyHeght-20" :theme="ins"/>
                </a-card>
            </a-col>
        </a-row>
        <a-card title="预警历史" :bodyStyle="{padding: 0}">
            <a-table :columns="columns" :dataSource="warningHistory" rowKey="id" :pagination="pagination" :loading="tableLoading">
              <span slot="action" slot-scope="action">
                <a-tag v-if="action==='warning31'" color="#198cff">一般</a-tag>
                <a-tag v-if="action==='warning32'" color="#faad14">紧急</a-tag>
                <a-tag v-if="action==='warning33'" color="#f52222">严重</a-tag>
                <a-tag v-if="action==='warning34'" color="#f52222">严重</a-tag>
              </span>
              <div class="cancelState" slot="cancelState" slot-scope="cancelState">
                <a-badge v-if="cancelState==='已恢复'" status="success" /><a-badge v-else status="error" />{{cancelState}}
              </div>
              <span slot="doit">
                <a href="javascript:;">通知历史</a>
              </span>
            </a-table>
        </a-card>
    </div>
</template>
<script>
import { VeLineChart } from 've-charts'
import ins from '@/utils/echartTheme'
import { monitor } from '@/api'
import { mapGetters } from 'vuex'

require('echarts/lib/component/dataZoom')
require('echarts/lib/component/dataZoomInside')
require('echarts/lib/component/dataZoomSlider')

const columns = [
  {
    dataIndex: 'content',
    title: '内容',
    width: 500
  },
  // {
  //   title: '参考值',
  //   width: 100,
  //   dataIndex: 'reference'
  // },
  {
    title: '级别',
    dataIndex: 'action',
    width: 80,
    scopedSlots: { customRender: 'action' }
  },
  {
    title: '状态变化',
    width: 100,
    className: 'cancelStateH',
    dataIndex: 'cancelState',
    scopedSlots: { customRender: 'cancelState' }
  },
  {
    title: '发生时间',
    width: 180,
    dataIndex: 'getTimeStr'
  }
  // {
  //   title: '操作',
  //   dataIndex: 'doit',
  //   width: 150,
  //   scopedSlots: { customRender: 'doit' }
  // }
]

export default {
  components: {
    VeLineChart
  },
  data () {
    return {
      ins,
      cardTitle: '',
      cardBodyHeght: 350,
      chartData: {},
      chartSettings: {},
      chartDataZoom: [ {
        type: 'inside',
        start: 0,
        end: 100
      }],
      yAxis: {
        scale: true,
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      chartVisualMap: {
        show: false
      },
      columns,
      tableLoading: false,
      pagination: {
        size: 'small',
        total: 50,
        current: 1,
        defaultPageSize: 5,
        pageSize: 5,
        showTotal: total => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '15', '20'],
        onChange: (current, pageSize) => this.onPageChange(current),
        onShowSizeChange: (current, pageSize) => this.onPageShowSizeChange(pageSize)
      },
      info: {
        measurePointName: '',
        measurePointId: '',
        action: '',
        content: '',
        reference: '',
        getTimeStr: '',
        cancelTimeStr: '',
        longTime: '',
        cancelState: ''
      },
      warningHistory: []
    }
  },
  computed: {
    ...mapGetters([
      'customerId'
    ])
  },
  created () {
    this.getWarningInfo()
    this.getPowerfactorHistory()
  },
  methods: {
    onPageChange (page, pageSize) {
      this.pagination.current = page
      this.getWarning(this.info.measurePointId)
    },
    onPageShowSizeChange (pageSize) {
      this.pagination.pageSize = pageSize
      this.getWarning(this.info.measurePointId)
    },
    onBackClick () {
      this.$router.push({ name: 'warning-monitor' })
    },
    getWarningInfo () {
      monitor.getWarningInfo({ warningId: this.$route.params.warningId })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            this.info = res.body
            this.getWarning(res.body.measurePointId)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getPowerfactorHistory () {
      this.chartSettings = {
        areaStyle: {}
      }
      monitor.getPowerfactorHistory({ warningId: this.$route.params.warningId }) // '86820522-8f96-4b3a-b6b9-94d4cf88dda1'
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            this.chartData = res.body
            this.cardTitle = res.body.measures[0].name + '预警追溯'
            console.log('getPowerfactorHistory', res.body)
            this.setVisualMap(res.body.markPoint)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    setVisualMap (markPoint) { // 恢复 发生 最差
      console.log(markPoint)
      let min = 0
      let max = 0
      if (markPoint[1].xAxis) {} min = markPoint[1].yAxisIndex
      if (markPoint[0].xAxis) max = markPoint[0].yAxisIndex
      if (markPoint[2].xAxis) {
        if (markPoint[1].xAxis === '') min = markPoint[2].yAxisIndex
        if (markPoint[0].xAxis === '') max = markPoint[2].yAxisIndex
      }
      this.chartVisualMap = {
        show: false,
        type: 'piecewise',
        dimension: 0,
        pieces: [{
          gte: min,
          lte: max,
          color: 'rgba(255,72,74,0.3)'
        }],
        outOfRange: {
          color: 'rgba(25, 189, 122, .5)'
        }
      }
    },
    getWarning (measurePointId) {
      this.tableLoading = true
      monitor.getWarning({ customerId: this.customerId, id: measurePointId, pageSize: this.pagination.pageSize, pageNum: this.pagination.current - 1 })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            this.warningHistory = res.body.data
            this.pagination.total = res.body.page.rowCount
          }
          this.tableLoading = false
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="stylus" scoped>
    .left-card
        // font-size 12px
    .ant-row
      padding 5px 0
    .field
      color #999
    .textEll
      overflow: hidden;
      text-overflow: ellipsis
      display: -webkit-box
      -webkit-line-clamp: 4
      -webkit-box-orient: vertical
    .cancelState
      display flex
      justify-content center
      align-items center
    th.cancelStateH,
    td.cancelStateH
      text-align center !important
</style>
