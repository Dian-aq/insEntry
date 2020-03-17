<template>
    <a-card :class="layout" :title="title" style="margin-top:10px;" :bodyStyle="{height: cardBodyHeight+'px'}">
        <div v-if="editMode" slot="extra" class="edit-block">
          <layout-tool-bar :item="item" @edit="onEditClick" @del="onDeleteClick"/>
        </div>
        <div v-else-if="item.switchable" slot="extra" class="edit-block">
          <span class="pointName">监测点：</span>
          <a-tree-select
            style="width:150px"
            dropdownClassName="dropdownPosition"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            :treeData="meterPoint"
            placeholder="请选择监测点"
            @change="onSwitchChange"
            :defaultValue="item.pointId"
            treeDefaultExpandAll
          >
          </a-tree-select>
        </div>
        <a-row>
          <a-col :span="12">
            <div class="item">
              <div>同比 <span :class="[epDayTotal_YAY>0?'up':'down']"><a-icon v-if="epDayTotal_YAY!=='-'" :type="epDayTotal_YAY>0?'caret-up':'caret-down'"/> {{epDayTotal_YAY}}%</span></div>
              <div>环比 <span :class="[epDayTotal_MAM>0?'up':'down']"><a-icon v-if="epDayTotal_MAM!=='-'" :type="epDayTotal_MAM>0?'caret-up':'caret-down'"/> {{epDayTotal_MAM}}%</span></div>
            </div>
            <div style="text-align:center;height26px;line-height:26px;padding:5px 0">本日用电</div>
            <ve-donut-chart
              :legend="legend"
              :title="dayTitle"
              :data="dayChartData"
              :color="dayColor"
              :tooltip="tooltip"
              :settings="chartSettings"
              :height="cardBodyHeight-48-20-36"
              :theme="ins"
            />
          </a-col>
          <a-col :span="12">
            <div class="item">
              <div>同比 <span :class="[epMonthTotal_YAY>0?'up':'down']"><a-icon v-if="epMonthTotal_YAY!=='-'" :type="epMonthTotal_YAY>0?'caret-up':'caret-down'"/> {{epMonthTotal_YAY}}%</span></div>
              <div>环比 <span :class="[epMonthTotal_MAM>0?'up':'down']"><a-icon v-if="epMonthTotal_MAM!=='-'" :type="epMonthTotal_MAM>0?'caret-up':'caret-down'"/> {{epMonthTotal_MAM}}%</span></div>
            </div>
            <div style="text-align:center;height26px;line-height:26px;padding:5px 0">本月用电</div>
            <ve-donut-chart
              :legend="legend"
              :data="monthChartData"
              :color="monthColor"
              :title="monthTitle"
              :tooltip="tooltip"
              :settings="chartSettings"
              :height="cardBodyHeight-48-20-36"
              :theme="ins"
            />
          </a-col>
        </a-row>
    </a-card>
</template>
<script>
import { itemMixin } from '../itemMixin'
import LayoutToolBar from '../LayoutToolBar'
import '../items.styl'
import { VeDonutChart } from 've-charts'
import ins from '@/utils/echartTheme'
import { profile } from '@/api'
import moment from 'moment'

export default {
  name: 'MonthTimeSharingTotal',
  components: {
    LayoutToolBar,
    VeDonutChart
  },
  mixins: [itemMixin],
  props: {},
  data () {
    return {
      ins,
      legend: {
        show: false
      },
      dayChartData: {},
      monthChartData: {},
      chartSettings: {
        radius: ['35%', '55%']
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          return params.seriesName + '<br/>' + params.value[0] + '：' + params.value[1] + ' kWh (' + params.percent + '%)'
        }
      },
      epDayTotal_MAM: 0,
      epMonthTotal_MAM: 0,
      epDayTotal: 0,
      epMonthTotal: 0,
      epDayTotal_YAY: 0,
      epMonthTotal_YAY: 0
    }
  },
  computed: {
    dayTitle () {
      return {
        show: true,
        text: this.epDayTotal,
        subtext: 'kWh',
        x: 'center',
        y: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal',
          color: ['#333']
        },
        subtextStyle: {
          color: '#666',
          fontSize: 12
        }
      }
    },
    monthTitle () {
      return {
        show: true,
        text: this.epMonthTotal,
        subtext: 'kWh',
        x: 'center',
        y: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal',
          color: ['#333']
        },
        subtextStyle: {
          color: '#666',
          fontSize: 12
        }
      }
    },
    monthColor () {
      let arr = []
      if (this.monthChartData.dimensions) {
        this.monthChartData.dimensions.data.forEach((item, index) => {
          arr.push(this.color[this.colorIndex(item)])
        })
      }
      return arr
    },
    dayColor () {
      let arr = []
      if (this.dayChartData.dimensions) {
        this.dayChartData.dimensions.data.forEach((item, index) => {
          arr.push(this.color[this.colorIndex(item)])
        })
      }
      return arr
    }
  },
  created () {},
  methods: {
    moment,
    init () {
      this.getData(this.item.pointId)
    },
    getData (mId) {
      // mId = 'f67238d5-c23f-4437-823e-1dfad736915b'
      profile.getMonthTimeSharingTotal({ measurePointId: mId })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            console.log('getMonthTimeSharingTotal', res.body)
            this.epDayTotal_MAM = res.body.epDayTotal_MAM
            this.epMonthTotal_MAM = res.body.epMonthTotal_MAM
            this.epDayTotal = res.body.epDayTotal
            this.epMonthTotal = res.body.epMonthTotal
            this.epDayTotal_YAY = res.body.epDayTotal_YAY
            this.epMonthTotal_YAY = res.body.epMonthTotal_YAY
            this.dayChartData = res.body.epDayTotal_pie.measures.length ? res.body.epDayTotal_pie : {}
            this.monthChartData = res.body.epMonthTotal_pie.measures.length ? res.body.epMonthTotal_pie : {}
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="stylus" scoped>
  .item
    background-color rgba(0,0,0,.02)
    border-radius 8px
    padding 5px 20px
    display flex
    justify-content space-between
    align-items center
    margin-left 5px
    margin-right 5px
  .unit
    font-size 70%
    color #999
  .value
    font-size 24px
    font-weight 600
    color #198cff
    margin-right 10px
  .up
    color #f52222
    margin-left 10px
    margin-right 2px
  .down
    color #52c41a
    margin 0 10px
    margin-left 10px
    margin-right 2px
  @media (max-width: 1440px)
    .up
      margin-left 0
    .down
      margin-left 0
</style>
