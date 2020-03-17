<template>
    <a-card :class="layout" :title="title" style="margin-top:10px;" :bodyStyle="{height: cardBodyHeight+'px',overflow: 'auto', paddingBottom: '0 !important'}">
        <div v-if="editMode" slot="extra" class="edit-block">
          <layout-tool-bar :item="item" @edit="onEditClick" @del="onDeleteClick"/>
        </div>
       <div v-else slot="extra" class="edit-block" style="font-size:14px">
         <div>
         近一个月严重告警<span class="red">{{warning34Count}}</span>次，紧急告警<span class="red">{{warning32Count}}</span>次
         </div>
       </div>
       <div v-if="warningLog.length>0" id="warningList" :style="{height: cardBodyHeight-61 +'px', overflow: 'auto'}">
         <div class="item" v-for="item in warningLog" :key="item.id">
           <div class="col-1"><a-badge v-if="item.cancelState==='生效中'" status="error" /><a-badge v-else status="success" /> <span :class="[item.cancelState==='生效中'? 'red':'green']">{{item.cancelState}}</span></div>
           <div class="col-2">
             <div><span class="content">{{item.content}}</span>
              <a-tag v-if="item.action==='warning31'" color="#198cff">一般</a-tag>
              <a-tag v-else-if="item.action==='warning32' || item.action==='warning33'" color="#faad14">紧急</a-tag>
              <a-tag v-if="item.action==='warning34'" color="#f52222">严重</a-tag>
             </div>
             <!-- <div><span class="title">实测值：</span>{{item.actualvalue}}{{item.unit}} （<span class="title">上限值：</span>{{item.ratingValue}}{{item.unit}}）</div> -->
           </div>
           <div class="col-3">
             <div class="time">{{item.getTimeStr}}</div>
             <div style="text-align:right"><span class="location"><span class="title">位置：</span>{{item.measurePointName}}</span></div>
             <div style="text-align:right"><span class="title">持续时间：</span><span class="duration">{{item.longTime}}</span></div>
           </div>
         </div>
       </div>
       <div v-else class="empty" :style="{height: cardBodyHeight-61 +'px'}">暂无数据</div>
       <div class="more" @click="gotoWarningMore">查看全部</div>
    </a-card>
</template>
<script>
import { profile } from '@/api'
import { itemMixin } from '../itemMixin'
import LayoutToolBar from '../LayoutToolBar'
import { mapGetters } from 'vuex'
import '../items.styl'

export default {
  name: 'WarningLog',
  components: {
    LayoutToolBar
  },
  mixins: [itemMixin],
  props: {},
  data () {
    return {
      warningLog: [],
      warning32Count: '-',
      warning34Count: '-'
    }
  },
  computed: {
    ...mapGetters([
      'customerId'
    ])
  },
  methods: {
    gotoWarningMore () {
      this.$router.push({ name: 'warning-monitor', params: {} }).catch(err => { console.log(err) })
    },
    init () {
      profile.getWarningLog({ customerId: this.customerId })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            console.log('getWarningLog', res.body)
            this.warningLog = res.body.data
            this.warning32Count = res.body.warning32Count
            this.warning34Count = res.body.warning34Count
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    onChange (a, b, c) {
      console.log(a, b, c)
    }
  },
  created () {}
}
</script>
<style lang="stylus" scoped>
  .empty
    display flex
    justify-content center
    align-items center
  .red
    color #f52222
    margin 0 5px
  .more
    padding 5px
    padding-top 10px
    text-align center
    color #fa6728
    border-top 1px solid #eee
    cursor pointer
  .item
    display flex
    align-items flex-start
    padding 10px 5px
    border-bottom 1px dashed #eee
    .red
      color #f52222
    .green
      color #52c41a
    .title
      font-size 12px
      color #999
    .col-1
      width 90px
      display flex
      align-items center
    .col-2
      flex: 1
      .content
        font-weight 600
        margin-right 10px
    .col-3
      width 40%
      .time
        text-align right
</style>
