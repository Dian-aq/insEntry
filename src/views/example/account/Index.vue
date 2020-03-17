<template>
    <div>
        <a-card :bordered="false" style="margin-top:10px">
          <a-row :gutter="10">
            <a-col class="gutter-row" :span="4">
              <div class="gutter-box">
                <a-menu
                  mode="inline"
                  :selectedKeys="selectedKeys"
                  type="inner"
                  @openChange="onOpenChange"
                >
                  <a-menu-item key="/account/baseInfo">
                    <router-link :to="{ name: 'baseInfo' }">
                      基本信息
                    </router-link>
                  </a-menu-item>
                  <a-menu-item key="/account/contractInfo">
                    <router-link :to="{ name: 'contractInfo' }">
                      合同信息
                    </router-link>
                  </a-menu-item>
                  <a-menu-item key="/account/customSettings">
                    <router-link :to="{ name: 'customSettings' }">
                      个性化定制
                    </router-link>
                  </a-menu-item>
                </a-menu>
              </div>
            </a-col>
            <a-col class="gutter-row" :span="20">
              <div class="gutter-box">
                <route-view></route-view>
              </div>
            </a-col>
          </a-row>
        </a-card>
    </div>
</template>
<script>
import { RouteView } from '@/layouts'

export default {
  components: {
    RouteView
  },
  data () {
    return {
      openKeys: [],
      selectedKeys: []
    }
  },
  created () {
    this.updateMenu()
  },
  methods: {
    onOpenChange (openKeys) {
      this.openKeys = openKeys
    },
    updateMenu () {
      const routes = this.$route.matched.concat()
      this.selectedKeys = [ routes.pop().path ]
    }
  },
  watch: {
    '$route' (val) {
      this.updateMenu()
    }
  }
}
</script>
