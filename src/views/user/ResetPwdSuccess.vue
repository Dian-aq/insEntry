<template>
  <a-card :bordered="false">
    <result type="success" :description="description" :title="title">
      <template slot="action">
        <a-button type="primary" @click="gotoIndex">返回首页</a-button>
      </template>
    </result>
  </a-card>
</template>

<script>
import { Result } from '@/components'

const directionType = {
  horizontal: 'horizontal',
  vertical: 'vertical'
}

export default {
  name: 'Success',
  components: {
    Result
  },
  data () {
    return {
      title: '密码修改成功',
      description: '',
      directionType
    }
  },
  methods: {
    gotoIndex () {
      this.$router.push({ name: 'profile' }).catch(() => {})
    }
  }
}
</script>

<style lang="stylus">

</style>
