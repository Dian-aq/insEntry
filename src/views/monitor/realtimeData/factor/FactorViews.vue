<template>
    <div style="padding-top:30px">
        <div v-if="view===1">
          <div class="state-block">
            <div class="dot normal-dot mar-l-15"/> 正常
            <div class="dot abnormal-dot mar-l-15"/> 异常
            <div class="dot offline-dot mar-l-15"/> 离线
          </div>
          <factor-card
            v-for="(item, index) in group"
            :key="item.id"
            :title="item.name"
            :image="item.imageUrl"
            :editMode="editMode"
            :item="item"
            :index="index"
            @moveUp="moveUp"
            @moveDown="moveDown"
            @onDragEnd="onDragEnd"
            @onEditGroup="onEditGroup"
            @done="onDone"
          />
        </div>
        <div style="padding-top:30px" v-if="view===2 && !editMode" class="noData">
          <img src="@/assets/factorSample.jpg" alt="">
          <p style="padding: 2em 1em .5em">多因子视图</p>
          <p class="text" style="padding-bottom:1em">
            <span>1、任意组合的配置方式</span> <span>2、可适应多种需求场景</span> <span>3、满足实时数据监控需求</span>
          </p>
          <a-button type="primary" size="large" @click="onSettingClick">开始配置</a-button>
        </div>
        <a-card style="margin-top:10px" hoverable v-if="editMode" :bodyStyle="{ height:'80px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px dashed #ccc' }" @click="onAddGroup">
          <a-icon type="plus" style="font-size:40px;color:#ccc"/>
        </a-card>
        <factor-type-edit :groupSettingShow="groupSettingShow" :groupItem="groupItem" @done="onDone" ref="factorGroup"></factor-type-edit>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import FactorCard from './FactorCard'
import FactorTypeEdit from './FactorTypeEdit'
import realtimeStore from '@/store/modules/realtimeData'
import { monitor } from '@/api'

export default {
  name: 'FactorViews',
  components: {
    FactorCard,
    FactorTypeEdit
  },
  data () {
    return {
      groupSettingShow: false,
      state: realtimeStore.state,
      group: [],
      view: 0, // 0空，1显示列表，2没数据提示
      groupItem: {}
    }
  },
  created: function () {
    this.getFactorViewsData()
  },
  computed: {
    ...mapGetters([
      'customerId'
    ]),
    editMode () {
      return realtimeStore.state.editMode
    }
  },
  methods: {
    onSettingClick () {
      realtimeStore.setEditModeAction(true)
      this.groupSettingShow = true
      this.$refs.factorGroup.newGroup()
    },
    getFactorViewsData () {
      monitor.getFactorViewsData({ customerId: this.customerId })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            console.log('getFactorViewsData', res.body.list)
            this.view = res.body.list.length > 0 ? 1 : 2
            this.group = res.body.list
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    onDragEnd (item) {
      console.log(item)
    },
    moveUp (item, idx) {
      if (idx !== 0) {
        this.group[idx] = this.group.splice(idx - 1, 1, this.group[idx])[0]
      } else {
        // this.group.push(this.group.shift())
        this.$message.info('不能再上移了^_^')
      }
      this.sortGroup(this.getSortIds())
    },
    moveDown (item, idx) {
      if (idx !== this.group.length - 1) {
        this.group[idx] = this.group.splice(idx + 1, 1, this.group[idx])[0]
      } else {
        // this.group.unshift(this.group.splice(idx, 1)[0])
        this.$message.info('到底了！不能再下移了^_^')
      }
      this.sortGroup(this.getSortIds())
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
    getSortIds () {
      let arr = []
      this.group.forEach((item, index) => {
        arr.push(item.id)
      })
      return arr.join(',')
    },
    onDone (flag) {
      this.groupSettingShow = flag
      this.getFactorViewsData()
    },
    onAddGroup (groupItem) {
      this.groupSettingShow = true
      this.$refs.factorGroup.newGroup()
    },
    onEditGroup (groupItem) {
      this.groupSettingShow = true
      this.$refs.factorGroup.editGroup(JSON.parse(JSON.stringify(groupItem)))
    }
  }
}
</script>
<style lang="stylus" scoped>
  .noData
    display flex
    flex-direction column
    justify-content center
    align-items center
    font-size 16px
    color #999
    .text
      span
        margin-right 20px
</style>
