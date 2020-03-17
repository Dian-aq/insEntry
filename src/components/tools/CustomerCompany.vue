<template>
  <div style="display: inline-block">
    <a-button class="name" type="link" @click="onClick">{{customerName}} <a-icon type="caret-down" v-if="this.companyList.length > 1" :style="{fontSize:'9px'}"/></a-button>
    <a-drawer
      title="企业列表"
      placement="top"
      height="600"
      :closable="true"
      @close="onClose"
      :visible="visible"
    >
      <CustomerTable @click="onCustomerClick" mode="drawer"></CustomerTable>
    </a-drawer>
  </div>
</template>
<script>
// import { profile } from '@/api'
import { mapGetters } from 'vuex'
import CustomerTable from '@/components/tools/CustomerTable'

export default {
  name: 'CustomerCompany',
  components: {
    CustomerTable
  },
  inject: ['reload'],
  data () {
    return {
      visible: false
    }
  },
  computed: {
    ...mapGetters([
      'customerName',
      'companyList'
    ])
  },
  created: function () {
    // console.log('store', this.$store.state.customer.company)
    // this.getCustomerCompany()
  },
  methods: {
    onCustomerClick (customer) {
      console.log('onCustomerClick', this.$router)
      // 切换企业时，跳转首页或刷新首页
      if (this.$router.history.current.name !== 'profile') {
        this.$router.push({ name: 'profile' }).catch(() => {})
      } else {
        this.reload()
      }
      this.visible = false
      // this.$router.push({ name: 'profile' }).catch(() => {})
      // console.log('我点击了客户', customer)
    },
    onClick () {
      if (this.companyList.length > 1) this.visible = true
    },
    onClose () {
      this.visible = false
    }
  }
}
</script>
<style lang="stylus" scoped>
  .name
    font-size 18px
    color #333
    padding-left 0
    letter-spacing 1px
    display flex
    align-items center
</style>
