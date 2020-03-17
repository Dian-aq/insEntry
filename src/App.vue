<template>
  <a-locale-provider :locale="zh_CN">
    <div id="app">
      <router-view/>
    </div>
  </a-locale-provider>
</template>

<script>
// eslint-disable-next-line
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

export default {
  data () {
    return {
      zh_CN
    }
  },
  created () {
    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem('store')) {
      console.log('app.vue', this.$store.state)
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('store'))))
    }

    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', (e) => {
      console.log('beforeunload', this.$store.state)
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  }
}
</script>
<style lang="stylus">
  #app
    height: 100%;
</style>
