<template>
    <a-drawer
      title="配置监测点"
      placement="right"
      width="720"
      @close="onDrawerClose"
      :visible="drawerShow"
    >
      <a-spin :spinning="loading">
      <a-form layout="vertical">
        <h4>第一步：选择监测点</h4>
        <a-row>
          <a-col :span="12" class="pad-10">
            <a-form-item
              label="监测点"
              :validate-status="pointIdValidate"
              :help="pointIdValidateMsg"
            >
              <a-tree-select
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="computedMeterPoint"
                :defaultSelectedKeys="[item.pointId]"
                placeholder="请选择监测点"
                @change="onMeterPointChange"
                @select="onMeterPointSelect"
                treeDefaultExpandAll
                v-model="item.pointId"
              >
              </a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :span="12" class="pad-10">
            <a-form-item
              label="显示名称"
              :validate-status="pointDisplayNameValidate"
              :help="pointDisplayNameValidateMsg"
            >
              <a-input placeholder="可填" v-model="item.pointDisplayName"/>
            </a-form-item>
          </a-col>
        </a-row>
        <h4>第二步：配置监测项</h4>
        <a-row>
          <a-col :span="12" class="pad-10">
            <a-card size="small" hoverable class="small-card" :bodyStyle="{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', alignContent: 'flex-start' }">
              <div slot="title"><div class="dot normal-dot"/>{{item.pointDisplayName}}</div>
              <!-- <value-item class="item" title="监测项" value="10" unit="K" center="true" :bordered="false"/> -->
              <div :class="[ itemActive===0 ? 'active' : '', 'setting-item' ]" @click="onItemChange(0)">
                <div v-if="item.children[0].displayName != ''"><span class="val">888</span> <span class="unit">{{item.children[0].unit}}</span></div>
                <div v-if="item.children[0].displayName != ''">{{item.children[0].displayName}}</div>
                <span v-if="item.children[0].displayName == ''">点击配置</span>
              </div>
              <div :class="[ itemActive===1 ? 'active' : '', 'setting-item' ]" @click="onItemChange(1)">
                <div v-if="item.children[1].displayName != ''"><span class="val">888</span> <span class="unit">{{item.children[1].unit}}</span></div>
                <div v-if="item.children[1].displayName != ''">{{item.children[1].displayName}}</div>
                <span v-if="item.children[1].displayName == ''">点击配置</span>
              </div>
              <div :class="[ itemActive===2 ? 'active' : '', 'setting-item' ]" @click="onItemChange(2)">
                <div v-if="item.children[2].displayName != ''"><span class="val">888</span> <span class="unit">{{item.children[2].unit}}</span></div>
                <div v-if="item.children[2].displayName != ''">{{item.children[2].displayName}}</div>
                <span v-if="item.children[2].displayName == ''">点击配置</span>
              </div>
              <div :class="[ itemActive===3 ? 'active' : '', 'setting-item' ]" @click="onItemChange(3)">
                <div v-if="item.children[3].displayName != ''"><span class="val">888</span> <span class="unit">{{item.children[3].unit}}</span></div>
                <div v-if="item.children[3].displayName != ''">{{item.children[3].displayName}}</div>
                <span v-if="item.children[3].displayName == ''">点击配置</span>
              </div>
            </a-card>
            <a-row>
              <a-col class="col" :span="12"><a-button @click="loadDefaultConfig">使用默认配置</a-button></a-col>
              <a-col class="col" :span="12"><a-button @click="resetConfig">清空配置</a-button></a-col>
            </a-row>
          </a-col>
          <a-col :span="12" class="pad-10">
            <a-form-item
              label="监测项"
            >
              <a-select placeholder="请选择监测项" labelInValue :value="{key:item.children[itemActive].itemId,label:item.children[itemActive].itemName}" :loading="monitorItemLoading"  @change="monitorItemChange">
                <a-select-option v-for="item in monitorItem" :unit="item.unit" :key="item.id">{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="显示名称">
              <a-input placeholder="可填" v-model="item.children[itemActive].displayName"/>
            </a-form-item>
            <a-form-item label="单位">
              <a-input placeholder="可填" v-model="item.children[itemActive].unit"/>
            </a-form-item>
            <a-form-item
              label="数量级"
              help="系统将实际数值除以数量级进行呈现"
            >
              <a-input placeholder="可填" v-model="item.children[itemActive].number"/>
            </a-form-item>
            <a-form-item
              label="下限值"
              help="越限后系统将对监测数据进行显色标记"
            >
              <a-input placeholder="可填" v-model="item.children[itemActive].lowerLimitValue"/>
            </a-form-item>
            <a-form-item
              label="上限值"
              help="越限后系统将对监测数据进行显色标记"
            >
              <a-input placeholder="可填" v-model="item.children[itemActive].upperLimitValue"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      </a-spin>
      <div
        :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }"
      >
        <a-button type="primary" @click="onSave">保存</a-button>
      </div>
    </a-drawer>
</template>
<script>
import { mixinMeterPoint } from '../mixin'
import { monitor } from '@/api'
import { mapGetters } from 'vuex'

const defaultItem = {
  pointName: '',
  pointId: '',
  funType: 0,
  modelId: '',
  pointIdValidate: 'success',
  pointDisplayNameValidate: 'success',
  pointDisplayName: '显示名称',
  children: [
    {
      id: 'newId',
      itemId: '',
      displayName: '',
      unit: '',
      groupId: '',
      modelId: '',
      number: 1,
      upperLimitValue: '',
      lowerLimitValue: ''
    },
    {
      id: 'newId',
      itemId: '',
      displayName: '',
      unit: '',
      groupId: '',
      modelId: '',
      number: 1,
      upperLimitValue: '',
      lowerLimitValue: ''
    },
    {
      id: 'newId',
      itemId: '',
      displayName: '',
      unit: '',
      groupId: '',
      modelId: '',
      number: 1,
      upperLimitValue: '',
      lowerLimitValue: ''
    },
    {
      id: 'newId',
      itemId: '',
      displayName: '',
      unit: '',
      groupId: '',
      modelId: '',
      number: 1,
      upperLimitValue: '',
      lowerLimitValue: ''
    }
  ]
}

export default {
  name: 'PointEdit',
  mixins: [mixinMeterPoint],
  props: {
    drawerShow: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      editMode: false, // false为新增，true为编辑
      monitorItemLoading: false,
      pointIdValidate: 'success',
      pointIdValidateMsg: '请选择监测点',
      pointDisplayNameValidate: 'success',
      pointDisplayNameValidateMsg: '名称不能为空',
      itemActive: 0, // 配置项激活
      form: this.$form.createForm(this, { name: 'layoutItemForm' }),
      id: undefined,
      list: [],
      item: defaultItem,
      monitorItem: []
    }
  },
  created () {
    // this.state = profileStore.state
    // this.getLayoutTypeData()
  },
  computed: {
    ...mapGetters([
      'customerId'
    ])
  },
  methods: {
    resetConfig () {
      for (let i = 0; i < this.item.children.length; i++) {
        console.log(defaultItem.children[i], i)
        this.item.children[i] = defaultItem.children[i]
        this.itemActive = i
      }
      this.itemActive = 0
    },
    loadDefaultConfig () {
      if (this.item.modelId) {
        monitor.loadDefaultConfig({ modelId: this.item.modelId })
          .then((res) => {
            if (res.header.status === 'SUCCESS') {
              console.log('loadDefaultConfig', res.body.list)
              this.item.children = res.body.list
              this.item = this.formatNulltoObject(JSON.parse(JSON.stringify(this.item)))
            }
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        this.$message.error('请先选择监测点!')
      }
    },
    monitorItemChange (value, option) {
      // console.log('monitorItemChange', option)
      // console.log(this.item.children[this.itemActive])
      // console.log(this.item.children[0], this.item.children[1], this.item.children[2], this.item.children[3])
      this.item.children[this.itemActive].itemId = value.key
      this.item.children[this.itemActive].displayName = value.label
      this.item.children[this.itemActive].unit = option.data.attrs.unit
    },
    onMeterPointChange (value, label, extra) {
      this.item.pointId = value
      this.item.pointName = label[0]
      this.item.pointDisplayName = label[0]
      this.item.modelId = extra.triggerNode._props.dataRef.modelId
      this.getMonitorItem(extra.triggerNode._props.dataRef.modelId)
    },
    onMeterPointSelect (value, label, extra) {
      // console.log('onMeterPointSelect', extra.triggerNode._props.dataRef)
      if (extra.node.dataRef.slots.icon === 'customer') { // 点击户号时不能选择
        return false
      }
    },
    getMonitorItem (modelId) {
      this.monitorItemLoading = true
      monitor.getMonitorItemFromMeterPoint({ modelId: modelId })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            // console.log('getMonitorItemFromMeterPoint', res.body)
            this.monitorItemLoading = false
            this.monitorItem = res.body.list
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    newConfigItem () {
      this.itemActive = 0
      this.editMode = false
      this.item = JSON.parse(JSON.stringify(defaultItem))
    },

    getConfigItem (id) {
      this.loading = true
      this.editMode = true
      this.itemActive = 0
      monitor.getPointConfigItem({ id: id })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            console.log('getConfigItem', res.body)
            this.loading = false
            this.item = this.formatNulltoObject(JSON.parse(JSON.stringify(res.body)))
            this.getMonitorItem(this.item.modelId)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    onDrawerClose () {
      this.$emit('done', false)
    },
    onSave () {
      let temp = this.formatData(JSON.parse(JSON.stringify(this.item)))
      temp.customerId = this.customerId
      console.log('onSave', temp)
      if (temp.pointId === '') { // 验证必填
        this.pointIdValidate = 'error'
        return false
      } else {
        this.pointIdValidate = 'success'
        this.pointIdValidateMsg = ''
      }
      if (temp.pointDisplayName === '') { // 验证必填
        this.pointDisplayNameValidate = 'error'
        return false
      } else {
        this.pointDisplayNameValidate = 'success'
        this.pointDisplayNameValidateMsg = ''
      }
      if (this.editMode) {
        monitor.editMeterPointConfig(temp)
          .then((res) => {
            console.log('editMeterPointConfig', res)
            if (res.header.status === 'SUCCESS') {
              this.$message.info('修改成功')
              this.$emit('done', false)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        monitor.saveMeterPointConfig(temp)
          .then((res) => {
            if (res.header.status === 'SUCCESS') {
              this.$message.info('保存成功')
              this.$emit('done', false)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    onItemChange (n) {
      this.itemActive = n
    },
    formatData (obj) {
      let arr = []
      obj.children.forEach((v, index) => {
        if (v.displayName === '') {
          arr.push(null)
        } else {
          arr.push(v)
        }
      })
      obj.children = arr
      return obj
    },
    formatNulltoObject (obj) {
      let arr = []
      obj.children.forEach((v, index) => {
        if (v) {
          arr.push(v)
        } else {
          let nullObj = {
            id: 'newId',
            itemId: '',
            displayName: '',
            groupId: '',
            unit: '',
            modelId: '',
            number: 1,
            upperLimitValue: '',
            lowerLimitValue: ''
          }
          arr.push(nullObj)
        }
      })
      obj.children = arr
      // console.log('haha', obj)
      return obj
    }
  }
}
</script>
<style lang="stylus" scoped>
  h4
    font-weight 600
  .ant-form-vertical >>> .ant-form-explain
    font-size 12px
  .small-card
    width 310px
  .setting-item
    width: 50%
    font-size 12px
    border: 1px dashed #ccc
    display flex
    flex-direction column
    justify-content center
    align-items center
    height: 70px
    .val
      color #000
      font-size 18px
      margin-right 5px
    .unit
      color #999
  .setting-item.active
    border: 2px dashed #f00
  .col
    display flex
    justify-content center
    align-content center
    padding 10px 5px
</style>
