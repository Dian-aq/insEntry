<template>
    <div>
        <a-button @click="handleCloseCurrentTab" style="margin-right: 16px;">关闭当前页</a-button>
        <a-button @click="handleOpenTab" style="margin-right: 16px;">打开业务图标页面</a-button>
      <p/>
        <h4>全局遮罩测试</h4>
        <a-button @click="handleOpenLoading" style="margin-right: 16px;">打开遮罩(5s 自动关闭)</a-button>
        <a-button @click="handleOpenLoadingCustomTip">打开遮罩(自定义提示语)</a-button>
      <p/>
        <h4>这是管理(列表)页内容</h4>
        <a-button @click="handleOpenLoading" style="margin-right: 16px;">打开遮罩(5s 自动关闭)</a-button>
    </div>
</template>
<script>
export default {
  name: 'Test',
  data () {
    return {}
  },
  methods: {
    handleCloseCurrentTab () {
      this.$multiTab.closeCurrentPage() // or this.$multiTab.close()
    },
    handleOpenTab () {
      this.$multiTab.open('/iconfont')
    },
    handleOpenLoading () {
      this.$loading.show()
      setTimeout(() => {
        this.$loading.hide()
      }, 5000)
    },
    handleOpenLoadingCustomTip () {
      this.$loading.show({ tip: '自定义提示语' })
      setTimeout(() => {
        this.$loading.hide()
      }, 5000)
    }
  }
}
</script>
