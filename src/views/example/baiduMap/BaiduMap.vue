<template>
    <div>
        <a-card :bordered="false" style="margin-top:10px">
            <baidu-map class="bm-view" center="佛山" :zoom="14" :scroll-wheel-zoom="true" ak="6d24fe702108da9203a540980252e3c8"></baidu-map>
        </a-card>
    </div>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'

export default {
  components: {
    BaiduMap
  },
  data () {
    return {}
  }
}
</script>
<style lang="stylus" scoped>
    .bm-view
        width 100%
        height 400px
</style>
