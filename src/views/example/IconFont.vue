<template>
  <div class="icons-list">
    <icon-font type="icon-chengshi" />
    <icon-font type="icon-liujisuan" />
    <icon-font type="icon-guizeyinqing" />
    <icon-font type="icon-gaojing" />
    <icon-font type="icon-wumoxing" />
    <icon-font type="icon--lumingpai" />
    <h3>自定义svgicon</h3>
    <a-icon :component="sampleSvg"/>
  </div>
</template>
<script>
import { Icon } from 'ant-design-vue'
import { sampleSvg } from '@/utils/icons'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1422288_ptewjhdjq3.js'
})
export default {
  components: {
    IconFont
  },
  data () {
    return {
      sampleSvg
    }
  }
}
</script>
<style scoped>
.icons-list >>> .anticon {
  margin-right: 20px;
  font-size: 40px;
}
</style>
