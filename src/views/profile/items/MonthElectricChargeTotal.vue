<template>
    <a-card :class="layout" :title="title" style="margin-top:10px;" :bodyStyle="{height: cardBodyHeight+'px'}">
        <div v-if="editMode" slot="extra" class="edit-block">
          <layout-tool-bar :item="item" @edit="onEditClick" @del="onDeleteClick"/>
        </div>
        <div id="edit-block" v-else-if="item.switchable" slot="extra" class="edit-block">
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
          <a-tooltip>
            <template slot="title">
              电价信息
            </template>
            <a-icon type="money-collect" :style="{fontSize: '20px', marginLeft: '5px'}" @click="onIconClick"/>
          </a-tooltip>
        </div>
        <a-row>
          <a-col :span="14">
            <ve-donut-chart :tooltip="tooltip" :legend="legend" :data="chartData" :title="chartTitle" :settings="chartSettings" :height="cardBodyHeight-48" :theme="ins"/>
          </a-col>
          <a-col :span="10">
            <div class="block">
              <div class="item">
                <div>总电费</div>
                <div><span class="value">{{total|NumFormat}}</span> <span class="unit">元</span></div>
              </div>
              <div class="item">
                <div>同比</div>
                <div><span :class="[totalYear>0?'up':'down']"><a-icon  v-if="totalYear!=='-'" :type="totalYear>0?'caret-up':'caret-down'"/> {{totalYear}}%</span></div>
              </div>
              <div class="item">
                <div>环比</div>
                <div><span :class="[totalMonth>0?'up':'down']"><a-icon v-if="totalMonth!=='-'" :type="totalMonth>0?'caret-up':'caret-down'" /> {{totalMonth}}%</span></div>
              </div>
            </div>
            <div class="block">
              <div class="item">
                <div>平均电价</div>
                <div><span class="value">{{avg}}</span> <span class="unit">元/kWh</span></div>
              </div>
              <div class="item">
                <div>同比</div>
                <div><span :class="[avgYear>0?'up':'down']"><a-icon v-if="avgYear!=='-'" :type="avgYear>0?'caret-up':'caret-down'"/> {{avgYear}}%</span></div>
              </div>
              <div class="item">
                <div>环比</div>
                <div><span :class="[avgMonth>0?'up':'down']"><a-icon v-if="avgMonth!=='-'" :type="avgMonth>0?'caret-up':'caret-down'"/> {{avgMonth}}%</span></div>
              </div>
            </div>
          </a-col>
        </a-row>
        <a-modal
            title="电价信息"
            centered
            :width="600"
            :bodyStyle="{height: '600px', padding: '10px 20px'}"
            v-model="dialogShow"
            @ok="() => dialogShow = false"
          >
            <h4>单价</h4>
            <div class="ant-table ant-table-default ant-table-bordered ant-table-middle">
              <div class="ant-table-content">
                <div class="ant-table-body">
                  <table class="table">
                    <thead class="ant-table-thead">
                      <tr>
                        <th class="ta" v-for="item in elecCalcInfo" :key="item.id">{{item.title}}</th>
                      </tr>
                    </thead>
                    <tbody class="ant-table-tbody">
                      <tr>
                        <td v-for="item in elecCalcInfo" :key="item.id">
                          <div class="ta" style="font-size: 18px">{{item.value}}</div>
                          <div class="ta" style="color: #adabab">{{item.unit}}</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <h4>时段</h4>
            <div class="ant-table ant-table-default ant-table-bordered ant-table-middle" style="width:80%">
              <div class="ant-table-content">
                <div class="ant-table-body">
                  <table class="table">
                    <tbody class="ant-table-tbody">
                      <tr v-for="item in timeInfo" :key="item.id">
                        <td class="td_bg ta">{{item.time}}</td>
                        <td class="ta">{{item.text}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </a-modal>
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
  name: 'MonthElectricChargeTotal',
  components: {
    LayoutToolBar,
    VeDonutChart
  },
  mixins: [itemMixin],
  props: {},
  filters: {
    NumFormat: function (value) {
      if (!value) return '-'
      // 原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正
      // 后来改成了 Number(value)|0,但是输入超过十一位就为负数了，具体见评论
      let intPart = Number(value) - Number(value) % 1 // 获取整数部分（这里是windy93的方法）
      let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断

      let floatPart = '.00' // 预定义小数部分
      let value2Array = value.toString().split('.')

      // =2表示数据有小数位
      if (value2Array.length === 2) {
        floatPart = value2Array[1].toString() // 拿到小数部分

        if (floatPart.length === 1) { // 补0,实际上用不着
          return intPartFormat + '.' + floatPart + '0'
        } else {
          return intPartFormat + '.' + floatPart
        }
      } else {
        return intPartFormat + floatPart
      }
    }
  },
  data () {
    return {
      ins,
      dialogShow: false,
      legend: {
        show: false
      },
      chartData: {},
      chartSettings: {
        radius: ['35%', '55%']
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          return params.seriesName + '<br/>' + params.value[0] + '：' + params.value[1] + ' 元 (' + params.percent + '%)'
        }
      },
      total: 0,
      avgYear: 0,
      avg: 0,
      totalMonth: 0,
      totalYear: 0,
      avgMonth: 0,
      elecCalcInfo: '',
      timeInfo: ''
    }
  },
  computed: {
    chartTitle () {
      return {
        show: true,
        text: this.total,
        subtext: '元',
        x: 'center',
        y: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'normal',
          color: ['#333']
        },
        subtextStyle: {
          color: '#666',
          fontSize: 12
        }
      }
    }
  },
  created () {},
  methods: {
    moment,
    init () {
      this.getData(this.item.pointId)
    },
    onIconClick () {
      this.dialogShow = true
    },
    getData (mId) {
      // mId = 'f67238d5-c23f-4437-823e-1dfad736915b'
      profile.getMonthElectricChargeTotal({ measurePointId: mId })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            console.log('getMonthElectricChargeTotal', res.body)
            this.total = res.body.total
            this.avgYear = res.body.avgYear
            this.avg = res.body.avg
            this.totalMonth = res.body.totalMonth
            this.totalYear = res.body.totalYear
            this.avgMonth = res.body.avgMonth
            this.chartData = res.body.pie.measures[0].data.length ? res.body.pie : {}
            this.elecCalcInfo = res.body.priceInfo.elecCalcInfo
            this.timeInfo = res.body.priceInfo.timeInfo
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
  .block
    background-color rgba(0,0,0,.02)
    border-radius 8px
    padding 5px 20px
    margin-bottom 10px
    .item
      display flex
      justify-content space-between
      align-items center
      padding 5px 0
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
  h4
    font-weight: 600
    padding 15px 0
  .td_bg
    background-color #fafafa
    width 50%
  .ta
    text-align center
  .ant-table-thead > tr > th
    font-weight 600
  @media (max-width: 1440px)
    .value
      font-size 20px
</style>
