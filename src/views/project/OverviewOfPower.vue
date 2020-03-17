<template>
    <div>
        <page-view>
          <a-row>
            <a-col :span="16" :sm="14">
              <div id="pointer">
                监测点：
                <a-dropdown :trigger="['click']">
                  <a class="ant-dropdown-link" href="#">
                    401开关 <a-icon type="down" />
                  </a>
                  <a-menu slot="overlay">
                    <a-menu-item key="0">
                      <a href="http://www.alipay.com/">401开关</a>
                    </a-menu-item>
                    <a-menu-item key="1">
                      <a href="http://www.taobao.com/">402开关</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </div>
              <div class="tagList" style="padding:10px 0">
                <a-tag color="#2db7f5">大工业</a-tag>
                <a-tag color="#2db7f5">公线专变客户</a-tag>
                <a-tag color="#2db7f5">10kV</a-tag>
                <a-tag color="#2db7f5">功率因数0.90考核</a-tag>
                <a-tag color="#2db7f5">高供高计</a-tag>
                <a-tag color="#2db7f5">按容量计费</a-tag>
              </div>
            </a-col>
            <a-col :span="8" :sm="10" class="flex-right">
              <field-item title="企业本月用电量" id="ben" :value="4.65" unit="万kWh" :center="false" :bordered="false" />
              <field-item title="企业年度用电量" id="nian" :value="1335" unit="万kWh" :center="false" :bordered="false"/>
            </a-col>
          </a-row>
        </page-view>
        <a-card
          style="width:100%;margin-top:10px"
          :tabList="usePowerTabs"
          :activeTabKey="usePowerActiveKey"
          @tabChange="usePowerActiveKey => onTabChange(usePowerActiveKey, 'usePowerActiveKey')"
        >
          <p v-if="usePowerActiveKey === 'today'">今日用电</p>
          <p v-else-if="usePowerActiveKey === 'yesterday'">昨日用电</p>
          <p v-else-if="usePowerActiveKey === 'thisMonth'">本月用电</p>
          <p v-else>上月用电</p>
        </a-card>
        <a-card title="实时有功电量" style="margin-top:10px">
          <a href="#" slot="extra">more</a>
          <p>chart</p>
        </a-card>

        <a-card title="我是占位块" style="margin-top:10px">
          <a href="#" slot="extra">more</a>
          <p>chart</p>
        </a-card>
        <a-card title="我是占位块" style="margin-top:10px">
          <a href="#" slot="extra">more</a>
          <p>chart</p>
        </a-card>
        <a-card title="我是占位块" style="margin-top:10px">
          <a href="#" slot="extra">more</a>
          <p>chart</p>
        </a-card>
        <a-card title="我是占位块" style="margin-top:10px">
          <a href="#" slot="extra">more</a>
          <p>chart</p>
        </a-card>
        <a-card title="我是占位块" style="margin-top:10px">
          <a href="#" slot="extra">more</a>
          <p>chart</p>
        </a-card>
        <a-card title="我是占位块" style="margin-top:10px">
          <a href="#" slot="extra">more</a>
          <p>chart</p>
        </a-card>
        <a-card title="我是占位块" style="margin-top:10px">
          <a href="#" slot="extra">more</a>
          <p>chart</p>
        </a-card>

    </div>
</template>
<script>
import Vue from 'vue'
import PageView from '@/layouts/PageView'
import FieldItem from '@/components/tools/FieldItem'
import Smartour from 'smartour/dist/index.esm.js'
import '@/stylus/smartour.styl'

export default {
  components: {
    PageView,
    FieldItem
  },
  data () {
    return {
      usePowerTabs: [{
        key: 'today',
        tab: '今日用电'
      }, {
        key: 'yesterday',
        tab: '昨日用电'
      }, {
        key: 'thisMonth',
        tab: '本月用电'
      }, {
        key: 'lastMonth',
        tab: '上月用电'
      }],
      usePowerKey: '今日用电',
      usePowerActiveKey: 'today'
    }
  },
  methods: {
    onTabChange (key, type) {
      console.log(key, type)
      this[type] = key
    }
  },
  mounted () {
    setTimeout(() => {
      if (!Vue.ls.get('OverviewOfPower_Tour_End')) {
        let tour = new Smartour()
        this.$nextTick(() => {
          console.log(111)
          tour
            .queue([{
              el: '#sysSetting',
              slot: '<p>这里可以自定义设置</p>',
              options: {
                layerEvent: tour.next.bind(tour),
                slotPosition: 'bottom'
              }
            }, {
              el: '#pointer',
              slot: '<p>这里选择不同监测点</p>',
              options: {
                layerEvent: tour.next.bind(tour),
                slotPosition: 'right'
              }
            }, {
              el: '#ben',
              options: {
                layerEvent: tour.next.bind(tour),
                slotPosition: 'left'
              },
              slot: '<p>这里是本月用电量显示</p>'
            }, {
              el: '#nian',
              options: {
                layerEvent: tour.next.bind(tour),
                slotPosition: 'top'
              },
              slot: '<p>这里是本年用电量显示</p>'
            }])
            .run()
          Vue.ls.set('OverviewOfPower_Tour_End', true, 60 * 60 * 1000 * 24)
        })
      }
    }, 1000)
  }
}
</script>
<style lang="stylus" scoped>
  .tagList
    .ant-tag
      margin-bottom 5px
  .flex-right
    display flex
    justify-content flex-end
    flex-wrap wrap
</style>
