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
        <ve-line-chart :data="chartData" :color="colorx" :grid="chartStyle.grid" :legend="chartStyle.legend" :loading="chartLoading" :settings="chartSettings" :yAxis="chartStyle.yAxis" :height="cardBodyHeight - 48" :theme="ins"/>
    </a-card>
</template>
<script>
import { VeLineChart } from 've-charts'
import ins from '@/utils/echartTheme'
import { profile } from '@/api'
import { itemMixin } from '../itemMixin'
import LayoutToolBar from '../LayoutToolBar'
import '../items.styl'

export default {
  name: 'RecentHalfYearUseElecTrend',
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
      chartSettings: {},
      chartStyle: {
        yAxis: {
          name: '用电量（kWh）'
        },
        grid: {
          top: 40,
          left: 70,
          right: 40,
          bottom: '10%'
        }
      }
    }
  },
  created () {},
  computed: {
    colorx () {
      let arr = []
      if (this.chartData.measures) {
        this.chartData.measures.forEach((item, index) => {
          arr.push(this.color[this.colorIndex(item.name)])
        })
      }
      return arr
    }
  },
  methods: {
    getData (mId) {
      profile.getRecentHalfYearUseElecTrend({ measurePointId: mId })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            console.log('getRecentHalfYearUseElecTrend', res.body)
            this.chartData = res.body
            this.chartSettings = {
              stack: {
                lang: this.computedStack
              },
              smooth: true,
              areaStyle: {},
              tooltipFormatter: function (params) {
                let [tar] = params
                const tooltipContent = params.map(v => {
                  return `${v.seriesName}：${v.value[v.seriesIndex + 1]} kWh`
                }).join('<br/>')
                return tar.name + '<br/>' + tooltipContent
              }
            }
            this.chartLoading = false
          }
        })
        .catch((err) => {
          console.log(err)
        })
      this.chartLoading = false
    },
    init () {
      this.getData(this.item.pointId)
    }
  }
}
</script>
