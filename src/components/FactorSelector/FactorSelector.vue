<template>
    <div>
        <a-row v-if="factorSelectShow">
          <a-col :span="12" :sm="13" :xs="24">
            <h4>选择参数</h4>
            <div class="factor-row">
              <a-tag v-for="(item, index) in factors" :key="item.fullKey" :color="row1Active === index ? '#fa6728' : ''" @click="row1Click(index)">{{item.name}}</a-tag>
            </div>
            <div class="factor-row">
              <a-tag v-for="(item, index) in row2" :key="item.fullKey" :color="row2Active === index ? '#fa6728' : ''" @click="row2Click(index)">{{item.name}}</a-tag>
            </div>
            <div class="factor-row" v-show="row3.length || row3_select.length">
              <a-select v-if="row3_select.length" style="width: 200px;margin-right:5px" labelInValue :value="selectValues" @change="onSelectChange">
                 <a-select-option v-for="(item, index) in row3_select" :index="index" :key="item.key">{{item.label}}</a-select-option>
              </a-select>
              <a-checkbox-group :options="row3" :value="checkedValues" @change="onRow3Change" />
            </div>
            <div class="date-row">
              参考日期：
              <a-date-picker :value="referenceDate" format="YYYY-MM-DD" @change="onReferDateChange" style="margin-right:60px"/> <a-button ref="searchBtn" type="primary" @click="onSearch">查询</a-button>
            </div>
          </a-col>
          <a-col :span="12" :sm="11" :xs="24" style="padding-left:20px">
            <h4>时间范围</h4>
            <div class="date-row">
              <a-range-picker
                :value="[startTime,endTime]"
                format="YYYY-MM-DD HH:mm"
                @change="onRangeDateChange" style="margin-right:60px"/>
            </div>
            <div class="date-row">
              <a-button icon="step-backward" size="small" style="margin-right:20px" @click="setDate('lastCycle', 3)">上一个周期</a-button>
              <a-button size="small" icon="step-forward" @click="setDate('nextCycle')">下一个周期</a-button>
            </div>
            <div class="date-row">
              <a-button size="small" class="mar-r-5" @click="setDate('today', 3)">今日</a-button>
              <a-button size="small" class="mar-r-5" @click="setDate('yesterday', 3)">昨日</a-button>
              <a-button size="small" class="mar-r-5" @click="setDate('week')">本周</a-button>
              <a-button size="small" class="mar-r-5" @click="setDate('month')">本月</a-button>
              <a-button size="small" class="mar-r-5" @click="setDate('10days')">近10天</a-button>
              <a-button size="small" class="mar-r-5" @click="setDate('15days')">近15天</a-button>
              <a-button size="small" class="mar-r-5" @click="setDate('30days')">近30天</a-button>
            </div>
          </a-col>
        </a-row>
        <a-card v-else>
          当前：{{factorItemText}}
        </a-card>
        <a-divider style="margin: 10px 0" orientation="right"><span  style="font-size:12px;color:#ccc;cursor:pointer" @click="toggleItem">{{toggleItemText}}</span></a-divider>
    </div>
</template>
<script>
import moment from 'moment'
import { monitor } from '@/api'
import { setDateMixin } from '@/utils/mixin'
import onlineMonitorStore from '@/store/modules/onlineMonitorData'

export default {
  name: 'FactorSelector',
  mixins: [setDateMixin],
  props: {
    pointId: {
      type: String,
      default: '',
      required: true
    },
    pointType: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      state: '',
      factorSelectShow: true,
      row3Show: true,
      factors: [],
      row1Active: 0,
      row2Active: 0,
      row3Active: 0,
      checkedValues: [],
      selectValues: {},
      referenceDate: null,
      startTime: moment().startOf('day'),
      endTime: moment().endOf('day')
    }
  },
  created () {
    this.state = onlineMonitorStore.state
  },
  computed: {
    row2 () {
      return this.factors[this.row1Active] ? this.factors[this.row1Active].children : []
    },
    row3_select () {
      let list = []
      if (this.factors[this.row1Active]) {
        let row2Item = this.factors[this.row1Active].children[this.row2Active]
        if (row2Item.children.length && row2Item.uiControl === 'select') {
          row2Item.children.forEach((item, index) => {
            let selectItem = {}
            selectItem.label = item.name
            selectItem.key = item.fullKey
            selectItem.children = item.children
            selectItem.uiControl = item.uiControl
            list.push(selectItem)
          })
        }
      }
      return list
    },
    row3 () {
      let list = []
      if (this.factors[this.row1Active]) {
        let row2Item = this.factors[this.row1Active].children[this.row2Active]
        if (row2Item.uiControl === 'checkbox' && row2Item.children.length) {
          row2Item.children.forEach((item, index) => {
            let chkItem = { label: '', value: '' }
            chkItem.label = item.name
            chkItem.value = item.fullKey
            list.push(chkItem)
          })
        } else if (this.row3_select.length && this.row3_select[this.row3Active].uiControl === 'checkbox' && this.row3_select[this.row3Active].children.length) {
          let row3Item = this.row3_select[this.row3Active]
          row3Item.children.forEach((item, index) => {
            let chkItem = { label: '', value: '' }
            chkItem.label = item.name
            chkItem.value = item.fullKey
            list.push(chkItem)
          })
        }
      }
      return list
    },
    toggleItemText () {
      return this.factorSelectShow ? '收缩筛选' : '展开筛选'
    },
    factorItemText () {
      let tmp = []
      this.checkedValues.forEach((item, index) => {
        this.row3.forEach((item2, index2) => {
          if (item === item2.value) {
            tmp.push(item2.label)
          }
        })
      })
      let str = tmp.length ? tmp.join('-') : ''
      return this.row2[this.row2Active].name + '-' + str + ' ' + this.startTime.format('YYYY-MM-DD HH:mm') + ' 至 ' + this.endTime.format('YYYY-MM-DD HH:mm')
    }
  },
  watch: {
    pointId: function (val, oldVal) {
      if (val !== oldVal) {
        this.getFactors()
      }
    },
    pointType: function (val, oldVal) {
      if (val !== oldVal) {
        this.getLocalFactor()
      }
    }
  },
  methods: {
    moment,
    // 读取之前选择的因子项
    getLocalFactor () {
      if (this.state.model.length) {
        let idx = this.state.model.findIndex(item => item.modelId === this.pointType)
        console.log('getLocalFactor', idx, this.pointType, this.state.model)
        if (idx !== -1) {
          this.row1Active = this.state.model[idx].row1Active
          this.row2Active = this.state.model[idx].row2Active
          this.row3Active = this.state.model[idx].row3Active
          this.checkedValues = this.state.model[idx].checkedValues
        }
      }
    },
    toggleItem () {
      this.factorSelectShow = !this.factorSelectShow
    },
    onReferDateChange (date, dateString) {
      this.referenceDate = date
    },
    onRangeDateChange (date, dateString) {
      if (date[1].diff(date[0], 'days') > 93) {
        this.$message.error('时间跨度不能超过3个月')
      } else {
        this.startTime = date[0]
        this.endTime = date[1]
      }
    },
    row1Click (idx) {
      this.row1Active = idx
      this.row2Active = 0 // 子级默然选择第一项
      this.checkedValues = [] // 清空多选框
      this.row2[this.row2Active].children.length > 0 && this.checkedValues.push(this.row2[this.row2Active].children[0].fullKey) // 默认选中1个
      // 如果下级是select，默认选中第一个
      this.row3Active = 0
    },
    row2Click (idx) {
      this.row2Active = idx
      this.checkedValues = []
      if (this.row2[this.row2Active].uiControl === 'checkbox') {
        this.row2[this.row2Active].children.length > 0 && this.checkedValues.push(this.row2[this.row2Active].children[0].fullKey)
      }
      // 如果下级是select，默认选中第一个
      this.row3Active = 0
      if (this.row2[this.row2Active].uiControl === 'select') {
        this.selectValues = {
          key: this.row3_select[0].key,
          label: this.row3_select[0].label
        }
        this.row3_select[this.row3Active].children.length > 0 && this.checkedValues.push(this.row3_select[0].children[0].fullKey)
      }
    },
    onSelectChange (value, node) {
      // console.log('onSelectChange', value, node)
      this.selectValues = value
      this.row3Active = node.data.attrs.index
      this.checkedValues = []
      if (this.row3_select[node.data.attrs.index].uiControl === 'checkbox') {
        this.row3_select[node.data.attrs.index].children.length > 0 && this.checkedValues.push(this.row3_select[this.row3Active].children[0].fullKey)
      }
    },
    onRow3Change (checkedValues) {
      this.checkedValues = checkedValues
    },
    getFactors () {
      monitor.getFactorFilterItemNew({ measurePointId: this.pointId })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            console.log('getFactorFilterItem', res.body)
            this.factors = res.body
            let idx = this.state.model.findIndex(item => item.modelId === this.pointType)
            if (idx === -1) {
              this.row1Active = 0
              this.row2Active = 0
              this.row3Active = 0
              this.checkedValues = []
              this.checkedValues.push(this.row3[0].value) // 初始化时默认选中第一个
              if (this.row3_select.length) {
                this.selectValues = { // 初始化下拉默认选中第一个
                  key: this.row3_select[0].key,
                  label: this.row3_select[0].label
                }
              }
            }
            this.$emit('complete', this.getFilterItem())
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getFilterItem () {
      let filterItem = {
        startTime: this.startTime.format('YYYY-MM-DD HH:mm'),
        endTime: this.endTime.format('YYYY-MM-DD HH:mm'),
        referenceDate: this.referenceDate ? this.referenceDate.format('YYYY-MM-DD') : '',
        marks: ''
      }
      if (this.row2[this.row2Active].children.length > 0) {
        filterItem.marks = this.checkedValues.join(',')
      } else {
        filterItem.marks = this.row2[this.row2Active].fullKey
      }
      return filterItem
    },
    onSearch () {
      let localFactor = {
        modelId: this.pointType,
        row1Active: this.row1Active,
        row2Active: this.row2Active,
        row3Active: this.row3Active,
        checkedValues: this.checkedValues
      }
      onlineMonitorStore.saveLocalFactor(localFactor)
      this.$emit('search', this.getFilterItem())
    }
  }
}
</script>
<style lang="stylus" scoped>
  h4
    font-size 16px
  .factor-row
    padding 8px 0
    border-bottom 1px dashed #ddd
  .date-row
    padding 8px 0
</style>
