<template>
  <div class="logo">
    <!-- <router-link :to="{name:'overviews'}"> -->
      <!-- <img src="@/assets/logo.svg" style="width:40;height:32px"> --><div class="logo-block"></div><span v-if="showTitle">{{title}}</span>
    <!-- </router-link> -->
  </div>
</template>

<script>

export default {
  name: 'Logo',
  props: {
    title: {
      type: String,
      default: '鹰巣',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
<style lang="stylus">
    .page-top
      .logo
        // float left
        color #fff
        font-size 18px
        letter-spacing 2px
        display flex
        justify-content center
        align-items center
    .page-sider
      .logo
        height 32px
        /* background: rgba(255,255,255,.2); */
        color #fff
        margin 16px
        display flex
        justify-content center
        align-items center
        font-size 18px
        letter-spacing 2px
    .logo
      .logo-block
        width 40px
        height 32px
        // margin-right 8px
        background url(../../assets/ins-Logo.png) no-repeat
        background-size 100% 100%
      span
        transition opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), width 0s cubic-bezier(0.645, 0.045, 0.355, 1)
        opacity 1
        display inline-block
    .ant-layout-sider-collapsed .page-sider .logo img
        margin-right 0
    .ant-layout-sider-collapsed .logo span
        transition opacity 0s cubic-bezier(0.645, 0.045, 0.355, 1)
        opacity 0
        max-width 0
    .light
      .logo
        color:#000
        .logo-block
          background url(../../assets/ins-Logo_light.png) no-repeat
</style>
