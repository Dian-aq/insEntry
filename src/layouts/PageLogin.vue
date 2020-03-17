<template>
  <div id="userLayout" :class="['user-layout-wrapper']">
    <div class="container">
      <vue-particles
        class="particles"
        color="#dedede"
        :particleOpacity="0.7"
        :particlesNumber="80"
        shapeType="circle"
        :particleSize="4"
        linesColor="#dedede"
        :linesWidth="2"
        :lineLinked="true"
        :lineOpacity="0.3"
        :linesDistance="150"
        :moveSpeed="3"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
      >
      </vue-particles>
      <div class="top">
        <div class="header">
          <a href="/">
            <img src="../assets/logo.svg" class="logo" alt="logo">
            <span class="title">鹰视能效</span>
          </a>
        </div>
        <div class="desc">
          善用能源的践行者，帮助企业高效管理用电
        </div>
      </div>
      <router-view/>
      <div class="footer">
        <div class="links">
          <a href="_self">帮助</a>
          <a href="_self">隐私</a>
          <a href="_self">条款</a>
        </div>
        <div class="copyright">
          Copyright &copy; 2019 鹰视能效科技有限公司出品
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueParticles from 'vue-particles'
Vue.use(VueParticles)

export default {
  data () {
    return {}
  },
  mounted () {
    document.body.classList.add('userLayout')
  },
  beforeDestroy () {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="stylus">
  .particles
    position: absolute;
    right 5px
    left 5px
    z-index 10
    bottom 5px
    top 5px
  #userLayout.user-layout-wrapper
    height: 100%;
    .container
      width 100%
      min-height 100%
      // background url(https://images.unsplash.com/photo-1501492751416-51484c0d911f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80) no-repeat 50%
      background #f0f2f5 url(../assets/bg4.jpg) no-repeat 50%
      // background #f00 url(https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg) no-repeat 50%
      background-color #02040a
      background-size cover
      // padding 110px 0 144px
      position relative
      display flex
      flex-direction column
      justify-content center
      align-items center
      a
        text-decoration none
      .top
        text-align center
        z-index 12
        .header
          height 44px
          line-height 44px
          .badge
            position absolute
            display inline-block
            line-height 1
            vertical-align middle
            margin-left -12px
            margin-top -10px
            opacity 0.8
          .logo
            height 44px
            vertical-align top
            margin-right 16px
            border-style none
          .title
            font-size 33px
            color rgba(255, 255, 255, 1)
            font-family Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif
            font-weight 600
            position relative
            top 2px
            letter-spacing 10px
        .desc
          font-size 16px
          color rgba(255, 255, 255, .85)
          margin-top 12px
          margin-bottom 40px
          letter-spacing 2px
      .main
        margin 0 auto
        width 456px
        background-color #fff
        border-radius 10px
        z-index 11
        height: 400px\0
      .footer
        width 100%
        padding 0 16px
        margin 48px 0 24px
        text-align center

        .links
          margin-bottom 8px
          font-size 14px
          a
            color rgba(255, 255, 255, 0.65)
            transition all 0.3s
            &:not(:last-child)
              margin-right 40px

        .copyright
          color rgba(255, 255, 255, 0.65)
          font-size 14px
          letter-spacing 1px
</style>
