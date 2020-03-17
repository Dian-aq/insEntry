<template>
    <div style="padding: 24px 16px;">
        <page-view :breadcrumb="false">
          <a-row class="flex-top">
            <a-col :span="20">
              <!-- <a-avatar :size="48" icon="user" style="margin-right:20px"/>
              您好，泡泡棠 -->
            </a-col>
            <a-col :span="4" class="flex-right">
                <a-button  v-if="editMode"  class="mar-r-5" type="primary" icon="plus" @click="onAddLayout">新增版块</a-button>
                <a-button  v-if="editMode"  type="default" icon="logout" @click="onExitConfigLayout">退出编辑模式</a-button>
                <a-button v-else type="primary" icon="setting" @click="onConfigLayout">自定义配置</a-button>
            </a-col>
          </a-row>
        </page-view>
        <draggable v-model="items" v-bind="dragOptions" @end="onDragEnd">
            <transition-group name="no" class="card-group" tag="div">
              <component
                v-for="item in items"
                :key="item.id"
                :is="item.pageName"
                :isLoaded="existCustomerId"
                :layout="item.layout"
                :title="item.title"
                :editMode="editMode"
                :item="item"
                @edit="onEditLayout"
                @del="onDelLayoutCallback"
                />
            </transition-group>
          </draggable>
          <add-layout-item :itemEditShow="itemEditShow" @done="onAddLayoutDone" ref="addLayoutItem"></add-layout-item>
    </div>
</template>
<script>
import { profile } from '@/api'
import PageView from '@/layouts/PageView'
import profileStore from '@/store/modules/profile'
import draggable from 'vuedraggable'
import AddLayoutItem from './AddLayoutItem'
import { mapGetters, mapActions } from 'vuex'

/** 模块 */
import A1 from './items/A1' // 页面模板
import EnterpriseInfo from './items/EnterpriseInfo'
import MonthElectricChargeTotal from './items/MonthElectricChargeTotal'
import ImportantMonitorDevice from './items/ImportantMonitorDevice'
import Recent30DaysUseElecTrend from './items/Recent30DaysUseElecTrend'
import RecentHalfYearUseElecTrend from './items/RecentHalfYearUseElecTrend'
import MonthTimeSharingTotal from './items/MonthTimeSharingTotal'
import Recent24HourUseElecTrend from './items/Recent24HourUseElecTrend'
import Recent24HourLoadTrend from './items/Recent24HourLoadTrend'
import Recent24HourDemandTrend from './items/Recent24HourDemandTrend'
import WarningLog from './items/WarningLog'
/** 模块 end */

export default {
  components: {
    draggable,
    PageView,
    AddLayoutItem,
    // 模块清单
    EnterpriseInfo,
    A1,
    MonthElectricChargeTotal,
    ImportantMonitorDevice,
    Recent30DaysUseElecTrend,
    RecentHalfYearUseElecTrend,
    MonthTimeSharingTotal,
    Recent24HourUseElecTrend,
    Recent24HourLoadTrend,
    Recent24HourDemandTrend,
    WarningLog
  },
  data () {
    return {
      state: '',
      itemEditShow: false,
      items: []
    }
  },
  created () {
    // 注意：这里需要赋值 state 对象，而不能直接赋值对象中的某个值，否则不能触发响应式
    this.state = profileStore.state
    this.checkCustomer()
    // 修复firefox拖动时搜索
    document.body.ondrop = function (event) {
      event.preventDefault()
      event.stopPropagation()
    }
  },
  computed: {
    ...mapGetters([
      'token',
      'customerId'
    ]),
    dragOptions () {
      return {
        disabled: !this.state.editMode,
        ghostClass: 'ghost'
      }
    },
    editMode () {
      return this.state.editMode
    },
    existCustomerId () {
      return this.customerId
    }
  },
  methods: {
    ...mapActions(['setCompany', 'getMeterPointerTree', 'getCompany']),
    onDragEnd () {
      profile.sortLayout({ ids: this.getSortIds() })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            this.$message.info('成功保存')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getSortIds () {
      let arr = []
      this.items.forEach((item, index) => {
        arr.push(item.id)
      })
      return arr.join(',')
    },
    checkCustomer () {
      // 修正关闭页面后，再打开时token未过期,缺少customerId
      if (!this.customerId) {
        let p = { name: '', nameType: 'name', sortType: 'asc' }
        this.getCompany(p, p)
          .then((res) => {
            // 如果关联只有1个企业，直接跳转首页
            if (res.body.data.length === 1) {
              this.getLayoutData()
              this.getMeterPointerTree(res.body.data[0].id)
                .then((res) => {
                  console.log('修正关闭页面后，再打开时token未过期,缺少customerId', res)
                })
                .catch(() => {})
            } else {
              this.$router.push({ name: 'customer' }).catch(() => {})
            }
          })
          .catch(() => {})
      } else {
        this.getLayoutData()
      }
    },
    getLayoutData () {
      profile.getLayoutData({ customerId: this.customerId })
        .then((res) => {
          console.log('getLayoutData', res.body)
          this.items = res.body
        })
        .catch((err) => {
          console.log(err)
        })
    },
    onAddLayoutDone () {
      this.itemEditShow = false
      this.getLayoutData()
    },
    onAddLayout () {
      profileStore.clearItemAction()
      this.itemEditShow = true
      this.$nextTick(() => {
        this.$refs.addLayoutItem.setValue(false)
      })
    },
    onEditLayout (item) {
      // console.log('edit', item)
      profileStore.setItemAction(item)
      this.itemEditShow = true
      this.$nextTick(() => {
        this.$refs.addLayoutItem.setValue(true)
      })
    },
    onDelLayoutCallback (item) {
      this.getLayoutData()
    },
    onConfigLayout () {
      profileStore.setEditModeAction(true)
    },
    onExitConfigLayout () {
      profileStore.setEditModeAction(false)
    }
  },
  mounted () {}
}
</script>
<style lang="stylus" scoped>
  .ghost
    opacity .6
    border 3px dashed #fa6728
  .card-group
    display flex
    justify-content space-between
    align-items center
    flex-wrap wrap
  .half
    width calc(100%/2 - 5px)
  .full
    width 100%
  .flex-right
    height 55px
    display flex
    justify-content flex-end
    align-items center
  .flex-top
    display flex
    justify-content flex-end
    align-items center
  .haha
    right 0
    left 0 !important
  .page-view-top
    min-height 55px
    padding 0 15px
</style>
