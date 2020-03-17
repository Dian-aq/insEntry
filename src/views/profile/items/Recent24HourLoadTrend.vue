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
        <ve-line-chart :data="chartData" :legend-visible="false" :series="series" :grid="chartStyle.grid" :loading="chartLoading" :settings="chartSettings" :yAxis="chartStyle.yAxis" :height="cardBodyHeight - 48" :theme="ins"/>
    </a-card>
</template>
<script>
import { VeLineChart } from 've-charts'
import ins from '@/utils/echartTheme'
import { profile } from '@/api'
import { itemMixin } from '../itemMixin'
import LayoutToolBar from '../LayoutToolBar'
import '../items.styl'

let echarts = require('echarts/lib/echarts')
require('echarts/lib/component/markLine')

export default {
  name: 'Recent24HourLoadTrend',
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
          name: '负荷率（%）'
        }
      },
      series: [
        {
          name: '负荷率',
          type: 'line',
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(25, 140, 255, 0.4)'
              }, {
                offset: 0.8,
                color: 'rgba(25, 140, 255, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          markLine: {
            label: {
              position: 'end',
              textStyle: {
                align: 'right',
                baseline: 'bottom',
                color: '#999'
              },
              formatter: '平均线: {c}%'
            },
            lineStyle: {
              color: '#999'
            },
            data: [
              { type: 'average', name: '平均值' }
            ]
          }
        }
      ]
    }
  },
  created () {},
  methods: {
    getData (mId) {
      profile.getRecent24HourLoadTrend({ measurePointId: mId })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            console.log('getRecent24HourLoadTrend', res.body)
            this.chartData = res.body
            this.chartLoading = false
          }
        })
        .catch((err) => {
          console.log(err)
        })
      this.chartSettings = {
        smooth: true,
        tooltipFormatter: function (params) {
          return params[0].value[0] + '<br/>' + params[0].seriesName + ' ' + params[0].value[1] + ' %'
        }
      }
    },
    init () {
      this.getData(this.item.pointId)
    }
  }
}
</script>
