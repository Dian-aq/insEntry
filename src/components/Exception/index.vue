<template>
    <div :class="`exception ${className}`" :style="exceptionStyle">
        <div class="imgBlock">
            <div class="imgEle" :style="`background-image: url(${img || config[pageType].img})`" />
        </div>
        <div class="content">
            <h1>{{ title || config[pageType].title }}</h1>
            <slot name="title" />
            <div class="desc">{{ desc || config[pageType].desc }}</div>
            <slot name="desc" />
            <div class="actions">
                <router-link to="/">
                    <a-button type="primary">返回首页</a-button>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import config from './typeConfig'
export default {
  name: 'Exception',
  props: {
    type: {
      type: String
    },
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    },
    exceptionStyle: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      config,
      pageType: this.type in config ? this.type : '404'
    }
  }
}
</script>
<style lang="stylus">
.exception
    display flex
    align-items center
    height 100%
    .imgBlock
        flex 0 0 62.5%
        width 62.5%
        padding-right 152px
        zoom 1
        &:before,
        &:after
            content " ";
            display table;
        &:after
            clear both;
            visibility hidden;
            font-size 0;
            height 0;
    .imgEle
        height 360px
        width 100%
        max-width 430px
        float right
        background-repeat no-repeat
        background-position 50% 50%
        background-size contain
    .content
        flex auto
        h1
            color #434e59
            font-size 72px
            font-weight 600
            line-height 72px
            margin-bottom 24px
        .desc
            font-size 20px
            line-height 28px
            margin-bottom 16px
        .actions
            button:not(:last-child)
                margin-right: 8px;
@media screen and (max-width: 1200px)
    .exception
        .imgBlock
            padding-right 88px
@media screen and (max-width: 576px)
    .exception
        display block
        text-align center
        .imgBlock
            padding-right 0
            margin 0 auto 24px
@media screen and (max-width: 480px)
    .exception
        .imgBlock
            margin-bottom -24px;
            overflow hidden;

</style>
