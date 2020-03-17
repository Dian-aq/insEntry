<template>
  <div style="padding-top:30px">
    <div class="state-block">
      <div class="dot normal-dot mar-l-15"/> 正常
      <div class="dot abnormal-dot mar-l-15"/> 异常
      <div class="dot offline-dot mar-l-15"/> 离线
    </div>
    <div class="item-block">
        <draggable v-model="list" v-bind="dragOptions" @end="onDragEnd">
          <transition-group name="no" class="card-group" tag="div">
            <a-card size="small" hoverable class="card" v-for="item in list" :key="item.id" :bodyStyle="{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', alignContent: 'flex-start' }">
              <template v-if="editMode" class="ant-card-actions" slot="actions">
                  <a-tooltip placement="top" title="编辑">
                    <a-icon type="edit" @click="onEditItem(item)"/>
                  </a-tooltip>
                  <a-tooltip placement="top" title="复制">
                    <a-icon type="copy" @click="onCopyItem(item.id)"/>
                  </a-tooltip>
                  <a-popconfirm
                      title="您确定删除该监测点?"
                      @confirm="onDeleteItem((item.id))"
                      okText="是"
                      cancelText="否"
                    >
                    <a-tooltip placement="top" title="删除">
                        <a-icon type="delete" />
                    </a-tooltip>
                  </a-popconfirm>
              </template>
              <div slot="title"><div :class="['dot', item.state+'-dot']"/>{{item.name}}</div>
              <span v-if="item.state === 'offline'" slot="extra" class="subText">已离线</span>
              <span v-else slot="extra" class="subText">{{item.time}}</span>
                <value-item class="item" :state="item2.state" :title="item2.title" :value="item2.value" :unit="item2.unit" :center="true" :bordered="false" v-for="(item2, index) in item.children" :key="item2.title + index"/>
            </a-card>
            <a-card hoverable v-if="editMode" class="card add" key="add" :bodyStyle="{ height:'276px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px dashed #ccc' }" @click="onAddItem">
              <a-icon type="plus" style="font-size:90px;color:#ccc"/>
            </a-card>
          </transition-group>
        </draggable>
    </div>
    <point-edit :drawerShow="drawerShow" @done="ondrawerClose" ref="pointEdit"></point-edit>
  </div>
</template>
<script>
import valueItem from '@/components/tools/valueItem'
import realtimeStore from '@/store/modules/realtimeData'
// import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import PointEdit from './PointEdit'
import { monitor } from '@/api'
import { mapGetters } from 'vuex'

export default {
  name: 'PointViews',
  components: {
    draggable,
    PointEdit,
    valueItem
  },
  data () {
    return {
      state: realtimeStore.state,
      drawerShow: false,
      list: [],
      action: '',
      timer: null
    }
  },
  created: function () {
    this.getPointViewsData()
  },
  mounted () {
    this.timer = setInterval(() => {
      this.getPointViewsData()
    }, 60 * 1000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
    this.timer = null
    realtimeStore.setEditModeAction(false)
    console.log('销毁定时器')
  },
  computed: {
    ...mapGetters([
      'customerId'
    ]),
    dragOptions () {
      return {
        filter: '.add',
        disabled: !this.state.editMode,
        ghostClass: 'ghost'
      }
    },
    editMode () {
      return realtimeStore.state.editMode
    }
  },
  methods: {
    onDeleteItem (id) {
      monitor.delMeterPointConfig({ id: id })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            this.getPointViewsData()
            this.$message.info('删除成功')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    onDragEnd () {
      this.sortGroup(this.getSortIds())
    },
    getSortIds () {
      let arr = []
      this.list.forEach((item, index) => {
        arr.push(item.id)
      })
      return arr.join(',')
    },
    sortGroup (ids) {
      monitor.sortMeterPointConfig({ ids: ids })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            // this.$emit('done', false)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    onAddItem () {
      this.$refs.pointEdit.newConfigItem()
      this.drawerShow = true
    },
    onEditItem (item) {
      this.drawerShow = true
      this.$refs.pointEdit.getConfigItem(item.id)
    },
    onCopyItem (id) {
      monitor.copyMeterPointConfig({ id: id })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            this.getPointViewsData()
            this.$message.info('复制成功')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    ondrawerClose () {
      this.getPointViewsData()
      this.drawerShow = false
    },
    getPointViewsData () {
      monitor.getPointViewsData({ customerId: this.customerId })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            console.log('getPointViewsData', res.body.list)
            this.list = this.formatArrayNull(res.body.list)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    formatArrayNull (list) {
      const t = {
        title: '-----',
        id: new Date().getTime(),
        unit: '-',
        value: -999999,
        standardValue: '-',
        time: '-',
        state: '-'
      }
      list.forEach((item, index) => {
        let arr = []
        item.children.forEach((item2, index2) => {
          if (item2 === '-') {
            arr.push(t)
          } else {
            if (item2.value === '-') item2.value = -999999
            arr.push(item2)
          }
        })
        item.children = arr
      })
      // console.log('formatArrayNull', list)
      return list
    }
  }
}
</script>
<style lang="stylus" scoped>
    .ghost
      opacity .6
      border 3px dashed #fa6728
    .card-group
      display flex
      align-items center
      flex-wrap wrap
    .subText
      color #999
      font-size 12px
    .item-block
      display flex
      justify-content flex-start
      flex-wrap wrap
      align-items center
    .item
      width 50%
      margin 10px 0
    .card
      width 370px
      margin-right 20px
      margin-bottom 20px
    @media (max-width: 1920px)
      .card
        width 370px
        margin-right 10px
        margin-bottom 10px
</style>
