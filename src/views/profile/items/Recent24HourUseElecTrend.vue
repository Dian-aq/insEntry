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
        <ve-line-chart :data="chartData"
          :legend-visible="false"
          :series="computedSeries"
          :grid="grid"
          :loading="chartLoading"
          :settings="chartSettings"
          :yAxis="yAxis"
          :height="cardBodyHeight - 48"
          :theme="ins"
        />
    </a-card>
</template>
<script>
import { VeLineChart } from 've-charts'
import ins from '@/utils/echartTheme'
import { profile } from '@/api'
import { itemMixin } from '../itemMixin'
import LayoutToolBar from '../LayoutToolBar'
import '../items.styl'
import { isEmptyObject } from '@/utils/utils'

// let echarts = require('echarts/lib/echarts')
require('echarts/lib/component/markArea')

export default {
  name: 'Recent24HourUseElecTrend',
  components: {
    LayoutToolBar,
    VeLineChart
  },
  mixins: [itemMixin],
  props: {},
  data () {
    return {
      ins,
      chartData: {},
      chartSettings: {
        smooth: true,
        areaStyle: {}
      },
      yAxis: [
        {
          name: '有功电量(kWh)',
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
        }, {
          name: '单价(元)',
          type: 'value',
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
      ],
      grid: {
        top: '15%',
        left: 40,
        right: 40,
        bottom: '10%'
      }
    }
  },
  computed: {
    computedSeries () {
      let series = []
      if (!isEmptyObject(this.chartData)) {
        this.chartData.measures.forEach((item, index) => {
          let seriesItem = {
            smooth: true,
            name: item.name,
            yAxisIndex: 0,
            type: 'line',
            markArea: {}
          }
          series.push(seriesItem)
        })
        // 画峰平谷区域，增加一个series
        if (this.chartData.chargePrice) {
          let fpg = {
            name: '峰平谷',
            type: 'line',
            yAxisIndex: 1,
            symbolSize: 0,
            lineStyle: {
              shadowColor: 'rgba(0,0,0,0.4)',
              width: 0
            },
            data: this.chartData.chargePrice,
            markLine: null,
            markArea: {
              data: this.formatMarkAreaData(this.chartData.timePeriod)
            }
          }
          series.push(fpg)
        }
      }
      // console.log('fpg', fpg)
      return series
    }
  },
  created () {},
  methods: {
    formatMarkAreaData (json) {
      let _arr = []
      json.forEach((item, index) => {
        let bgcolor
        switch (item.name) {
          case '峰':
            bgcolor = 'rgba(250,173,20,.1)'
            break
          case '平':
            bgcolor = 'rgba(25,140,255,.1)'
            break
          case '谷':
            bgcolor = 'rgba(82,196,26,.1)'
            break
          default:
            bgcolor = 'rgba(245,34,34,.1)' // 尖
            break
        }
        let temp = [{
          name: item.name,
          xAxis: item.xAxis,
          yAxis: item.yAxis,
          itemStyle: {
            color: bgcolor
          }
        }, {
          xAxis: item.xAxis2,
          yAxis: item.yAxis2
        }]
        _arr.push(temp)
      })
      return _arr
    },
    getData (mId) {
      // mId = 'f67238d5-c23f-4437-823e-1dfad736915b'
      profile.getRecent24HourUseElecTrend({ measurePointId: mId })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            console.log('getRecent24HourUseElecTrend', res.body)
            this.chartData = res.body ? res.body : {}
            this.chartLoading = false
            this.chartSettings.tooltipFormatter = function (params) {
              return params[0].value[0] + '<br/>' + params[0].seriesName + ' ' + params[0].value[1] + ' kWh'
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
      this.chartSettings = {
        smooth: true,
        areaStyle: {}
      }
      this.chartLoading = false
    },
    init () {
      this.getData(this.item.pointId)
    }
  }
}
</script>
