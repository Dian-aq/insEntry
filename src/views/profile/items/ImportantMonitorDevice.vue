<template>
    <a-card :class="layout" :title="title" style="margin-top:10px;" :bodyStyle="{height: cardBodyHeight+'px', display: 'flex', overflowY: 'hidden', overflowX: 'auto'}">
        <div v-if="editMode" slot="extra" class="edit-block">
          <layout-tool-bar :item="item" @edit="onEditClick" @del="onDeleteClick"/>
        </div>
        <div v-else slot="extra" class="edit-block">
          <span style="font-size:12px" @click="goToPointViews">配置</span>
        </div>
        <a-card size="small" class="card" v-for="item in list" :key="item.id" :bodyStyle="{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', alignContent: 'flex-start' }">
          <div slot="title"><div :class="['dot', item.state+'-dot']"/>{{item.name}}</div>
          <span slot="extra" class="subText">{{item.time}}</span>
            <value-item class="item" :state="item2.state" :title="item2.title" :value="item2.value" :unit="item2.unit" :center="true" :bordered="false" v-for="(item2, index) in item.children" :key="item2.title + index"/>
        </a-card>
    </a-card>
</template>
<script>
import { itemMixin } from '../itemMixin'
import LayoutToolBar from '../LayoutToolBar'
import valueItem from '@/components/tools/valueItem'
import { monitor } from '@/api'
import '../items.styl'

export default {
  name: 'ImportantMonitorDevice',
  components: {
    LayoutToolBar,
    valueItem
  },
  mixins: [itemMixin],
  props: {},
  data () {
    return {
      list: []
    }
  },
  created () {},
  methods: {
    goToPointViews () {
      this.$router.push({ name: 'pointViews' }).catch(err => { console.log(err) })
    },
    getData (id) {
      monitor.getPointViewsData({ customerId: id })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            console.log('ImportantMonitorDevice', res.body.list)
            this.list = this.formatArrayNull(res.body.list)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    init () {
      this.getData(this.customerId)
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
    .card
      display inline-block
      flex-shrink 0
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
</style>
