<template>
    <a-card class="mar-t-10" :bodyStyle="{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }">
        <div v-if="editMode" slot="extra">
            <a-tooltip placement="top" title="上移一位">
              <a-icon type="arrow-up" class="icon" @click="moveUp"/>
            </a-tooltip>
            <a-tooltip placement="top" title="下移一位">
              <a-icon type="arrow-down" class="icon"  @click="moveDown"/>
            </a-tooltip>
            <a-tooltip placement="top" title="编辑">
              <a-icon type="edit" class="icon"  @click="editGroup"/>
            </a-tooltip>
            <a-popconfirm
              title="您确定删除该分类?"
              placement="leftTop"
              @confirm="delGroup"
              okText="是"
              cancelText="否"
            >
              <a-tooltip placement="top" title="删除">
                <a-icon type="delete" class="icon"/>
              </a-tooltip>
            </a-popconfirm>
        </div>
        <div slot="title">{{title}}
            <a-tooltip placement="top" title="查看图片">
                <a-icon v-if="image" type="eye" style="cursor:pointer" @click="seeImage"/>
            </a-tooltip>
        </div>
        <draggable v-model="item.children" v-bind="dragOptions" @end="onDragEnd">
          <transition-group name="no" class="card-group" tag="div">
            <a-card size="small" hoverable class="factor-item mar-r-10 mar-b-10" v-for="item in item.children" :key="item.id" :bodyStyle="{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }" style="width:224px">
              <template v-if="editMode" class="ant-card-actions" slot="actions">
                  <a-tooltip placement="top" title="编辑">
                    <a-icon type="edit" @click="editGroupItem(item)"/>
                  </a-tooltip>
                  <a-popconfirm
                      title="您确定删除该监测项?"
                      okText="是"
                      @confirm="delGroupItem(item)"
                      cancelText="否"
                    >
                    <a-tooltip placement="top" title="删除">
                        <a-icon type="delete" />
                    </a-tooltip>
                  </a-popconfirm>
              </template>
              <div><i :class="['dot', item.state+'-dot']"/> <span class="standard">{{item.name}}</span></div>
              <value-item class="item" :biaoZhunZhi="true" :title="item.standardValue" :state="item.state" :value="item.value" :unit="item.unit" :center="true" :bordered="false"/>
              <div class="time">{{item.time}}</div>
          </a-card>
          <a-card size="small" class="mar-b-10 add" hoverable v-if="editMode" key="add" :bodyStyle="{ height:'190px', width:'178px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px dashed #ccc' }" @click="addGroupItem(item.id)">
            <a-icon type="plus" style="font-size:40px;color:#ccc"/>
          </a-card>
          </transition-group>
        </draggable>
        <factor-item-edit :itemEditShow="itemEditShow" @done="onDone" ref="factorItemEdit"></factor-item-edit>
        <a-modal :title="title" v-model="imageShow" :width='800' :footer='null' :bodyStyle='{height: 400+"px"}'>
          <img :src="image" class="previewImage" alt="图片">
        </a-modal>
    </a-card>
</template>
<script>
import valueItem from '@/components/tools/valueItem'
import FactorItemEdit from './FactorItemEdit'
import draggable from 'vuedraggable'
import { monitor } from '@/api'

export default {
  name: 'FactorCard',
  components: {
    draggable,
    valueItem,
    FactorItemEdit
  },
  props: {
    title: {
      type: String,
      required: true,
      default: '未命名'
    },
    index: {
      type: Number,
      required: false
    },
    image: {
      type: String,
      required: false
    },
    editMode: {
      type: Boolean,
      required: true,
      default: false
    },
    item: {
      type: Object,
      default: function () { return {} }
    }
  },
  data () {
    return {
      itemEditShow: false,
      newItems: [],
      fitem: {},
      imageShow: false
    }
  },
  computed: {
    dragOptions () {
      return {
        filter: '.add',
        disabled: !this.editMode,
        ghostClass: 'ghost'
      }
    }
  },
  created: function () {
    // console.log(this.index)
  },
  methods: {
    seeImage () {
      console.log(this.image)
      // eslint-disable-next-line
      this.imageShow = this.image !== undefined ? true : false
    },
    addGroupItem (groupId) {
      this.itemEditShow = true
      this.$refs.factorItemEdit.newItem(groupId)
    },
    editGroupItem (item) {
      this.itemEditShow = true
      this.$refs.factorItemEdit.getItem(item.id)
    },
    delGroupItem (item) {
      monitor.delFactor({ id: item.id })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            this.$emit('done', false)
            this.$message.info('删除成功')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    editGroup () {
      this.$emit('onEditGroup', this.item)
    },
    delGroup () {
      monitor.delMeterPointConfig({ id: this.item.id })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            this.$emit('done', false)
            this.$message.info('删除成功')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    onDragEnd () {
      monitor.sortFactor({ ids: this.getSortIds() })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            // this.$emit('onDragEnd', this.item)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getSortIds () {
      console.log(this.item)
      let arr = []
      this.item.children.forEach((item, index) => {
        arr.push(item.id)
      })
      return arr.join(',')
    },
    moveUp () {
      this.$emit('moveUp', this.item, this.index)
    },
    moveDown () {
      this.$emit('moveDown', this.item, this.index)
    },
    onDone (flag) {
      this.itemEditShow = flag
      this.$emit('done', false)
    }
  }
}
</script>
<style lang="stylus" scoped>
    .ghost
      opacity .6
      border 3px dashed #fa6728
    .card-group
      display flex
      align-items center
      flex-wrap wrap
    .icon
      margin-right 10px
      font-size 18px
      cursor pointer
      :hover
        color #fa6728
    .standard
      color: #000
      font-size 14px
    .item
        margin-top 10px
        margin-bottom 0
    .time
        color #999
        font-size 12px
        min-height 20px
    .previewImage
      width auto
      height auto
      max-width 100%
      max-height 100%
</style>
