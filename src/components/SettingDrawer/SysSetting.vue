<template>
    <div id="sysSetting" style="display:inline-block" @click="settingHandle" class="action">
      <a-icon type="setting" />
      <a-drawer title="系统设置"
        placement="right"
        :closable="false"
        :width="300"
        @close="onClose"
        :visible="visible"
        :handle="handle"
      >
        <div class="setting-drawer-content">
          <div class="setting-drawer-item">
            <h4 class="title">整体风格风格</h4>
            <div class="nav-content">
              <a-tooltip>
                <template slot="title">
                  暗色菜单风格
                </template>
                <div class="setting-drawer-index-item" @click="changeMenuTheme('dark')">
                  <img src="../../assets/nav_dark.svg" alt="sidemenu">
                  <div class="setting-drawer-index-selectIcon" v-if="menuTheme === 'dark'">
                    <a-icon type="check"/>
                  </div>
                </div>
              </a-tooltip>

              <a-tooltip>
                <template slot="title">
                  亮色菜单风格
                </template>
                <div class="setting-drawer-index-item" @click="changeMenuTheme('light')">
                  <img src="../../assets/nav_light.svg" alt="topmenu">
                  <div class="setting-drawer-index-selectIcon" v-if="menuTheme === 'light'">
                    <a-icon type="check"/>
                  </div>
                </div>
              </a-tooltip>
            </div>
          </div>
          <div class="setting-drawer-item">
            <h4 class="title">主题色（预览）</h4>
            <div class="nav-content" style="height: 20px">
              <a-tooltip class="setting-drawer-colorItem" v-for="(item, index) in colorList" :key="index">
                <template slot="title">
                  {{ item.key }}
                </template>
                <a-tag :color="item.color" @click="changeTheme(item.color)">
                  <a-icon type="check" v-if="item.color === primaryColor"></a-icon>
                </a-tag>
              </a-tooltip>
            </div>
          </div>
          <a-divider />
          <div class="setting-drawer-item">
            <h4 class="title">导航栏风格</h4>
            <div class="nav-content">
              <a-tooltip>
                <template slot="title">
                  侧边栏导航
                </template>
                <div class="setting-drawer-index-item" @click="changeLayout('sidemenu')">
                  <img src="../../assets/nav_vertical.svg" alt="sidemenu">
                  <div class="setting-drawer-index-selectIcon" v-if="layoutMode === 'sidemenu'">
                    <a-icon type="check"/>
                  </div>
                </div>
              </a-tooltip>
              <a-tooltip>
                <template slot="title">
                  顶部栏导航
                </template>
                <div class="setting-drawer-index-item" @click="changeLayout('topmenu')">
                  <img src="../../assets/nav_horizontal.svg" alt="topmenu">
                  <div class="setting-drawer-index-selectIcon" v-if="layoutMode === 'topmenu'">
                    <a-icon type="check"/>
                  </div>
                </div>
              </a-tooltip>
            </div>
            <a-list :split="false">
              <a-list-item>
                <a-tooltip slot="actions">
                  <template slot="title">
                    该设定仅 [顶部栏导航] 时有效
                  </template>
                  <a-select size="small" style="width: 80px;">
                    <a-select-option value="Fixed">固定</a-select-option>
                    <a-select-option value="Fluid">流式</a-select-option>
                  </a-select>
                </a-tooltip>
                <a-list-item-meta>
                  <div slot="title">内容区域宽度</div>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-switch slot="actions" size="small" :defaultChecked="fixedHeader" @change="setFixedHeader"/>
                <a-list-item-meta>
                  <div slot="title">固定 Header</div>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-switch slot="actions" size="small" :disabled="!fixedHeader" :defaultChecked="autoHideHeader" @change="setFixedHeaderHidden"/>
                <a-list-item-meta>
                  <a-tooltip slot="title" placement="left">
                    <template slot="title">固定 Header 时可配置</template>
                    <div :style="{ opacity: !fixedHeader ? '0.5' : '1' }">下滑时隐藏 Header</div>
                  </a-tooltip>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item >
                <a-switch slot="actions" size="small" :disabled="(layoutMode === 'topmenu')" :defaultChecked="fixedSiderbar" @change="setFixedSiderbar"/>
                <a-list-item-meta>
                  <div slot="title" :style="{ textDecoration: layoutMode === 'topmenu' ? 'line-through' : 'unset' }">固定侧边菜单</div>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item >
                <a-switch slot="actions" size="small" :disabled="(layoutMode === 'topmenu')" :defaultChecked="sidebarAccordionMode" @change="setAccordionMode"/>
                <a-list-item-meta>
                  <div slot="title" :style="{ textDecoration: layoutMode === 'topmenu' ? 'line-through' : 'unset' }">侧边栏开启手风琴模式</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </div>
          <a-divider />
          <div class="setting-drawer-item">
            <h4 class="title">其他设置</h4>
            <a-list>
              <a-list-item>
                <a-switch slot="actions" size="small" :defaultChecked="multiTab" @change="onMultiTab"/>
                <a-list-item-meta>
                  <div slot="title">多页签模式</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </div>
        </div>
      </a-drawer>
    </div>
</template>
<script>
import config from '@/config/setting'
import { mixin } from '@/utils/mixin'
import { updateTheme, colorList } from './sysConfig'

// let lessNodesAppended // less节点是否添加
export default {
  mixins: [mixin],
  data () {
    return {
      visible: false,
      colorList: colorList,
      color: '#1890FF',
      handle: <div/>,
      sysConfig: Object.assign({}, config)
    }
  },
  mounted () {
    updateTheme(this.primaryColor)
  },
  methods: {
    settingHandle () {
      this.showDrawer()
    },
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    changeTheme (color) {
      this.sysConfig.primaryColor = color
      if (this.primaryColor !== color) {
        this.$store.dispatch('TogglePrimaryColor', color)
        updateTheme(color)
      }
    },
    onMultiTab (checked) {
      this.$store.dispatch('ToggleMultiTab', checked)
    },
    changeMenuTheme (theme) {
      this.sysConfig.menuTheme = theme
      this.$store.dispatch('ToggleMenuTheme', theme)
    },
    changeLayout (mode) {
      this.sysConfig.layout = mode
      this.$store.dispatch('ToggleLayoutMode', mode)
    },
    setFixedHeader (fixed) {
      this.sysConfig.fixedHeader = fixed
      this.$store.dispatch('ToggleFixedHeader', fixed)
    },
    setFixedSiderbar (fixed) {
      this.sysConfig.fixedSiderbar = fixed
      this.$store.dispatch('ToggleFixSiderbar', fixed)
    },
    setFixedHeaderHidden (autoHidden) {
      this.sysConfig.autoHideHeader = autoHidden
      this.$store.dispatch('ToggleFixedHeaderHidden', autoHidden)
    },
    setAccordionMode (mode) {
      this.sysConfig.sidebarAccordionMode = mode
      this.$store.dispatch('ToggleAccordionMode', mode)
    },
    compileLess (color, msg) {
      if (!window.less) {
        return
      }
      setTimeout(() => {
        window.less
          .modifyVars({
            '@primary-color': color
          })
          .then(() => {
            msg()
          })
          .catch(() => {
            // message.error('Failed to update theme')
            msg()
          })
      }, 200)
    }
  }
}
</script>
<style lang="stylus">
  .setting-drawer-content
    margin 10px
    .setting-drawer-item
      margin-bottom 24px
      .nav-content
        display flex
        .setting-drawer-index-item
          margin-right 16px
          position: relative
          border-radius 4px
          cursor pointer
          img
            width 48px
          .setting-drawer-index-selectIcon
            position absolute
            top 0
            right 0
            width 100%
            padding-top 15px
            padding-left 24px
            height 100%
            color #1890ff
        .setting-drawer-colorItem
          width 20px
          height 20px
          border-radius 2px
          float left
          cursor pointer
          margin-right 8px
          padding-left 0px
          padding-right 0px
          text-align center
          color #fff
          font-weight 700
          i
            font-size 14px
</style>
