<template>
    <a-card :class="layout" :title="title" style="margin-top:10px;" :bodyStyle="{height: cardBodyHeight+'px'}">
        <div v-if="editMode" slot="extra" class="edit-block">
          <layout-tool-bar :item="item" @edit="onEditClick" @del="onDeleteClick"/>
        </div>
        <div v-else slot="extra" class="edit-block">
          <!-- <span class="pointName">监测点：</span> -->
          <a-tree-select
            v-if="item.switchable"
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
          <span class="pointName" v-else>{{item.pointName}}</span>
        </div>
        <ve-line-chart :data="chartData" :legend-visible="false" :settings="chartSettings" :series="computedSeries" :grid="chartStyle.grid" :loading="chartLoading" :yAxis="chartStyle.yAxis" :height="cardBodyHeight - 48" :theme="ins"/>
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
require('echarts/lib/component/markLine')

export default {
  name: 'Recent24HourDemandTrend',
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
        smooth: true
      },
      chartStyle: {
        grid: {
          top: '15%'
        },
        yAxis: {
          name: '需量（kW）'
        }
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
            type: 'line',
            markLine: null
          }
          series.push(seriesItem)
        })
        // 画一条虚线
        if (this.chartData.demandVal) {
          let markLineItem = {
            label: {
              position: 'end',
              textStyle: {
                align: 'right',
                baseline: 'bottom',
                color: '#999'
              },
              formatter: '申报需量: {c}kW'
            },
            lineStyle: {
              color: '#999'
            },
            data: [
              [{
                name: '申报需量',
                value: this.chartData.demandVal,
                coord: [this.chartData.dimensions.data[0], this.chartData.demandVal]
              }, {
                value: this.chartData.demandVal,
                coord: [this.chartData.dimensions.data[this.chartData.dimensions.data.length - 1], this.chartData.demandVal]
              }]
            ]
          }
          series[0].markLine = markLineItem
        }
      }
      return series
    }
  },
  created () {},
  methods: {
    getData (mId) {
      profile.getRecent24HourDemandTrend({ measurePointId: mId })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            console.log('getRecent24HourDemandTrend', res.body)
            this.chartData = res.body.measures.length ? res.body : {}
            this.chartSettings = {
              smooth: true,
              tooltipFormatter: function (params) {
                return params[0].value[0] + '<br/>' + params[0].seriesName + ' ' + params[0].value[1] + ' kW'
              }
            }
          }
        })
        .catch((err) => {
          this.chartData = {}
          console.log(err)
        })
      this.chartSettings = {
        smooth: true,
        tooltipFormatter: function (params) {
          return params[0].value[0] + '<br/>' + params[0].seriesName + ' ' + params[0].value[1] + ' kW'
        }
      }
      this.chartLoading = false
    },
    init () {
      this.getData(this.item.pointId)
    }
  }
}
</script>
