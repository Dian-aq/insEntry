<template>
    <a-drawer
          title="配置监测项"
          placement="right"
          width="720"
          @close="onDrawerClose"
          :visible="itemEditShow"
        >
        <a-form layout="vertical">
            <a-row>
              <a-col :span="12" class="pad-10">
                <a-form-item
              label="监测点"
            >
              <a-tree-select
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="computedMeterPoint"
                :defaultSelectedKeys="[item.pointId]"
                placeholder="请选择监测点"
                @change="onMeterPointChange"
                treeDefaultExpandAll
                v-model="item.pointId"
              >
              </a-tree-select>
            </a-form-item>
              </a-col>
                <a-col :span="12" class="pad-10">
              </a-col>
            </a-row>
          <a-row>
          <a-col :span="12" class="pad-10">
            <a-form-item
              label="监测项"
            >
              <a-select placeholder="请选择监测项" labelInValue :value="{key:item.itemId,label:item.itemName}" :loading="monitorItemLoading"  @change="monitorItemChange">
                <a-select-option v-for="item in monitorItem" :unit="item.unit" :key="item.id">{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
                label="单位"
                >
                <a-input placeholder="可填" v-model="item.unit"/>
            </a-form-item>
            <a-form-item
                label="数量级"
                help="系统将实际数值除以数量级进行呈现"
                >
                <a-input placeholder="可填" v-model="item.number"/>
            </a-form-item>
          </a-col>
          <a-col :span="12" class="pad-10">
              <a-form-item
                label="显示名称"
                >
                <a-input placeholder="可填" v-model="item.displayName"/>
            </a-form-item>
            <a-form-item
                label="下限值"
                help="越限后系统将对监测数据进行显色标记"
                >
                <a-input placeholder="可填" v-model="item.lowerLimitValue"/>
            </a-form-item>
            <a-form-item
                label="上限值"
                help="越限后系统将对监测数据进行显色标记"
                >
                <a-input placeholder="可填" v-model="item.upperLimitValue"/>
            </a-form-item>
          </a-col>
        </a-row>
        </a-form>
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
          }">
            <a-button @click="onSave" type="primary">保存</a-button>
        </div>
    </a-drawer>
</template>
<script>
import { mixinMeterPoint } from '../mixin'
import { monitor } from '@/api'
import { mapGetters } from 'vuex'

function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  name: 'FactorItemEdit',
  mixins: [mixinMeterPoint],
  props: {
    itemEditShow: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      imageUrl: '',
      editMode: false,
      monitorItem: [],
      monitorItemLoading: false,
      item: {
        id: '',
        pointId: '',
        modelId: '',
        itemId: '',
        groupId: '',
        displayName: '',
        unit: '',
        number: 1,
        upperLimitValue: '',
        lowerLimitValue: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'customerId'
    ])
  },
  methods: {
    monitorItemChange (value, option) {
      this.item.itemId = value.key
      this.item.displayName = value.label
      this.item.unit = option.data.attrs.unit
    },
    newItem (gid) {
      this.item = {
        id: 'newId',
        itemId: '',
        groupId: gid,
        displayName: '',
        unit: '',
        number: 1,
        upperLimitValue: '',
        lowerLimitValue: ''
      }
    },
    getItem (id) {
      this.loading = true
      this.editMode = true
      monitor.getFactorItems({ id: id })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            console.log('getFactorItems', res.body)
            this.loading = false
            this.item = res.body
            this.getMonitorItem(this.item.modelId)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    onMeterPointChange (value, label, extra) {
      this.item.pointId = value
      this.item.pointName = label[0]
      this.item.pointDisplayName = label[0]
      this.item.modelId = extra.triggerNode._props.dataRef.modelId
      this.getMonitorItem(extra.triggerNode._props.dataRef.modelId)
    },
    getMonitorItem (modelId) {
      this.monitorItemLoading = true
      monitor.getMonitorItemFromMeterPoint({ modelId: modelId })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            console.log('getMonitorItemFromMeterPoint', res.body)
            this.monitorItemLoading = false
            this.monitorItem = res.body.list
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
      let temp = JSON.parse(JSON.stringify(this.item))
      temp.customerId = this.customerId
      console.log('传参:', temp)
      if (this.editMode) {
        monitor.updateFactor(temp)
          .then((res) => {
            console.log('updateFactor', res)
            if (res.header.status === 'SUCCESS') {
              this.$message.info('修改成功')
              this.$emit('done', false)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        // console.log('I come in')
        monitor.saveFactor(temp)
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
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl
          this.loading = false
        })
      }
    },
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
        this.$message.error('图片必须jpg格式!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小不要超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>
<style lang="stylus" scoped>
  .ant-row >>> .ant-form-explain
    font-size 12px
</style>
