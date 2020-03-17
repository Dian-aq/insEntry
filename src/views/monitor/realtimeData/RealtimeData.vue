<template>
    <div style="padding: 24px 16px;">
        <div style="background-color:#fff;margin:-24px -16px;padding:0 20px;border-bottom:1px solid #e8e8e8">
            <a-tabs defaultActiveKey="1" @change="ontabChange" size="large" :tabBarStyle="{margin:0,borderBottom:0}">
                <a-tab-pane tab="监测点视图" :disabled="editMode" key="1"></a-tab-pane>
                <!-- <a-tab-pane tab="设备视图" :disabled="editMode" key="2"></a-tab-pane> -->
                <a-tab-pane tab="多因子视图" :disabled="editMode" key="3"></a-tab-pane>
                <a-button  v-if="editMode"  class="mt" type="primary" icon="logout" slot="tabBarExtraContent" @click="onCompleteClick">退出编辑模式</a-button>
                <a-button v-else class="mt" type="primary" icon="setting" slot="tabBarExtraContent" @click="onSettingClick">配置</a-button>
            </a-tabs>
        </div>
        <route-view :keepAlive="false"></route-view>
    </div>
</template>
<script>
import { RouteView } from '@/layouts'
import realtimeStore from '@/store/modules/realtimeData'

export default {
  name: 'RealtimeData',
  components: {
    RouteView
  },
  data () {
    return {
      state: ''
    }
  },
  created () {
    // 注意：这里需要赋值 state 对象，而不能直接赋值对象中的某个值，否则不能触发响应式
    this.state = realtimeStore.state
  },
  computed: {
    editMode () {
      return realtimeStore.state.editMode
    }
  },
  methods: {
    ontabChange (key) {
      switch (key) {
        case '1':
          this.$router.push({ name: 'pointViews' }).catch(() => {})
          break
        // case '2':
        //   this.$router.push({ name: 'deviceViews' }).catch(() => {})
        //   break
        default:
          this.$router.push({ name: 'factorViews' }).catch(() => {})
          break
      }
    },
    onSettingClick () {
      realtimeStore.setEditModeAction(true)
    },
    onCompleteClick () {
      realtimeStore.setEditModeAction(false)
    }
  }
}
</script>
<style lang="stylus">
    .mt
      margin-top: 11px;
    .state-block
      display flex
      justify-content center
      align-items center
      padding 10px
      color #333
      font-size 12px
    .dot
      border-radius 50%
      width 10px
      height 10px
      margin-right 5px
      display inline-block
    .normal-dot
      background-color #52c41a
      box-shadow 0px 1px 10px #6CD164
    .abnormal-dot
      background-color #f52222
      box-shadow 0px 1px 10px #F56969
    .offline-dot
      background-color #999
      box-shadow 0px 1px 10px #ccc
</style>
