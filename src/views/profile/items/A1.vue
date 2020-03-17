<template>
    <a-card :class="layout" :title="title" style="margin-top:10px;" :bodyStyle="{height: cardBodyHeight+'px'}">
        <div v-if="editMode" slot="extra" class="edit-block">
          <layout-tool-bar :item="item" @edit="onEditClick" @del="onDeleteClick"/>
        </div>
        <p>我是A1</p>
    </a-card>
</template>
<script>
import { itemMixin } from '../itemMixin'
import LayoutToolBar from '../LayoutToolBar'
import '../items.styl'

export default {
  name: 'A1',
  components: {
    LayoutToolBar
  },
  mixins: [itemMixin],
  props: {},
  data () {
    return {}
  },
  created () {},
  methods: {
    getItemData () {
      console.log('A1 do it')
    }
  }
}
</script>
