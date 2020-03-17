<template>
    <div>
        <a-tooltip placement="top" title="编辑">
          <a-icon type="edit" @click="onEditClick"/>
        </a-tooltip>
        <a-popconfirm
              title="您确定删除该模块?"
              placement="bottom"
              okText="是"
              cancelText="否"
              @confirm="onDeleteClick"
              @cancel="onCancelClick"
            >
            <a-tooltip placement="top" title="删除"><a-icon type="delete"/></a-tooltip>
        </a-popconfirm>
    </div>
</template>
<script>
export default {
  name: 'LayoutToolBar',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  },
  methods: {
    onEditClick (e) {
      this.$emit('edit')
    },
    onDeleteClick (e) {
      this.$emit('del')
    },
    onCancelClick (e) {}
  }
}
</script>
