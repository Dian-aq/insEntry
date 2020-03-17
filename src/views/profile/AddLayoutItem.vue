<template>
    <a-drawer
          title="编辑配置项"
          placement="right"
          :width="drawerWidth"
          :zIndex="3000"
          :bodyStyle="{ padding: 0 }"
          @close="onDrawerClose"
          :visible="itemEditShow"
        >
          <a-form :form="form" @submit="handleSubmit" layout="horizontal">
          <a-row>
            <a-col v-if="!editStatus" :span="8" :style="{ borderRight: '1px solid #eee', height: bodyHeght+'px', overflow: 'auto' }">
                <a-collapse style="border:0;" v-model="activeKey">
                  <a-collapse-panel v-for="item in list" :key="item.id" :header="item.title" :disabled="item.disabled">
                    <div :class="['item', child.id===listItemActive ? 'active' : '']" v-for="child in item.children" :key="child.title" @click="onTypeClick(child)"><i :class="['iconfont', child.icon]"></i> {{child.title}}</div>
                  </a-collapse-panel>
                </a-collapse>
            </a-col>
            <a-col :span="computedSpan" style="padding:20px;">
              <div v-if="item">
                <img :src="previewImg" alt="预览图" style="margin-bottom:20px ">
                <a-form-item label="标题" v-bind="formItemLayout">
                  <a-input v-decorator="['title', { rules: [{ required: true, message: '标题不能为空!' }] }]" />
                </a-form-item>
                <a-form-item label="默认监测点" v-bind="formItemLayout" v-if="item.pointDisable">
                  <!-- <a-select
                    v-decorator="['point', { rules: [{ required: true }],initialValue: '#1变压器'} ]"
                  >
                    <a-select-option value="#1变压器">#1变压器</a-select-option>
                    <a-select-option value="#2变压器">#2变压器</a-select-option>
                  </a-select> -->
                  <a-tree-select
                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                    :treeData="computedMeterPoint"
                    placeholder="请选择监测点"
                    dropdownClassName="dropdownPosition"
                    :getPopupContainer="triggerNode => triggerNode.parentNode"
                    @change="onMeterPointChange"
                    treeDefaultExpandAll
                    v-decorator="['pointId', { rules: [{ required: true, message: '请选择默认监测点!' }] }]"
                  >
                  </a-tree-select>
                </a-form-item>
                <a-form-item label="可切换监测点"  v-bind="formItemLayout" v-if="item.pointDisable">
                  <a-switch v-decorator="['switchable', { valuePropName: 'checked' }]" />
                  <!-- <a-checkbox
                    :checked="switchable"
                    @change="switchChange"
                    v-decorator="[
                      'switchable',
                      {
                        valuePropName: 'switchable',
                        initialValue: true,
                      },
                    ]"
                  >
                    可切换监测点
                  </a-checkbox> -->
                </a-form-item>
                <a-form-item label="宽度" v-bind="formItemLayout" v-if="item.layoutDisable">
                  <a-radio-group buttonStyle="solid" v-decorator="['layout',{ initialValue: 'full' }]">
                    <a-radio-button value="half">一半屏宽</a-radio-button>
                    <a-radio-button value="full" defaultChecked>全屏宽</a-radio-button>
                  </a-radio-group>
                </a-form-item>              </div>
              <div v-else>请点击右边分类项</div>
            </a-col>
          </a-row>
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
            <a-button html-type="submit" type="primary">保存</a-button>
        </div>
        </a-form>
    </a-drawer>
</template>
<script>
import { profile } from '@/api'
import profileStore from '@/store/modules/profile'
import { mixinMeterPoint } from '@/views/monitor/realtimeData/mixin'
import { mapGetters } from 'vuex'

export default {
  name: 'AddLayoutItem',
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
      form: this.$form.createForm(this, { name: 'layoutItemForm' }),
      bodyHeght: document.body.clientHeight - 108,
      activeKey: ['1', '2', '3', '4', '5', '6'],
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 19 }
        },
        state: ''
      },
      editStatus: false,
      switchable: false,
      list: [],
      listItemActive: null
    }
  },
  created () {
    this.state = profileStore.state
    this.getLayoutTypeData()
  },
  computed: {
    ...mapGetters([
      'customerId'
    ]),
    item () {
      return this.state.item
    },
    drawerWidth () {
      return this.editStatus ? 600 : 800
    },
    computedSpan () {
      return this.editStatus ? 21 : 16
    },
    previewImg () {
      // console.log(this.item)
      return '/assets/preview/' + this.item.preview
    }
  },
  methods: {
    onMeterPointChange (value, label, extra) {
      this.item.pointName = label[0]
    },
    onTypeClick (type) {
      this.listItemActive = type.id
      profileStore.setItemAction(type)
      this.$nextTick(() => {
        this.setValue()
      })
    },
    getLayoutTypeData () {
      profile.getLayoutTypeData()
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            console.log('getLayoutTypeData', res.body)
            this.list = res.body
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
      this.$emit('done', false)
    },
    switchChange (e) {
      this.switchable = e.target.checked
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          let newObj = {}
          if (this.editStatus) {
            let p = {
              customerId: this.customerId,
              pageName: this.item.pageName,
              comId: this.item.id,
              id: this.item.id,
              pointId: this.pointId,
              pointName: this.item.pointName,
              pointDisable: this.item.pointDisable,
              switchable: this.item.switchable,
              layoutDisable: this.item.layoutDisable,
              preview: this.item.pageName + '.jpg'
            }
            Object.assign(newObj, p, values)
            profile.editLayout(newObj)
              .then((res) => {
                if (res.header.status === 'SUCCESS') {
                  this.$message.info('修改成功')
                  this.$emit('done', false)
                }
              })
              .catch((err) => {
                console.log(err)
              })
          } else {
            let p = {
              customerId: this.customerId,
              pageName: this.item.pageName,
              comId: this.item.id,
              id: 'newId',
              pointId: this.pointId,
              pointName: this.item.pointName,
              pointDisable: this.item.pointDisable,
              switchable: this.item.switchable,
              layoutDisable: this.item.layoutDisable,
              preview: this.item.pageName + '.jpg'
            }
            Object.assign(newObj, p, values)
            console.log(newObj)
            profile.saveLayout(newObj)
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
          console.log(newObj)
        }
      })
    },
    setValue (status) {
      this.listItemActive = null
      this.editStatus = status
      this.form.setFieldsValue({
        title: this.item.title,
        layout: this.item.layout,
        pointId: this.item.pointId,
        switchable: this.item.switchable
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
    .ant-collapse > .ant-collapse-item
      border-bottom 1px solid #ddd
    .ant-collapse > .ant-collapse-item:last-child
      border-bottom 0
    .ant-collapse > .ant-collapse-item >>> .ant-collapse-content
      border-top 1px solid #ddd
    .ant-collapse-content
      border-top 1px solid #ddd
    .item
      padding 5px 10px
      cursor pointer
    .active
      color #fa6728
</style>
