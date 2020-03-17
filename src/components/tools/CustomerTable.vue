<template>
    <div>
      <div class="search">
        <a-input-search style="width:25%" placeholder="请输入企业名称" allowClear @search="onSearch" enterButton="搜索"/>
        <div>
          <a-button-group>
            <a-button class="sort-btn" :type="sortType==='name'?'primary':'default'" @click="sortBy('name')">
              客户名称
              <span v-if="sortType==='name'" class="sort-icon">
                <a-icon :class="[sortOrder==='asc'?'act':'']" type="caret-up" />
                <a-icon :class="[sortOrder==='desc'?'act':'']" type="caret-down" />
              </span>
            </a-button>
            <a-button class="sort-btn" :type="sortType==='recordDate'?'primary':'default'" @click="sortBy('recordDate')">
              注册时间
              <span v-if="sortType==='recordDate'" class="sort-icon">
                <a-icon :class="[sortOrder==='asc'?'act':'']" type="caret-up" />
                <a-icon :class="[sortOrder==='desc'?'act':'']" type="caret-down" />
              </span>
            </a-button>
          </a-button-group>
        </div>
      </div>
      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="companyList"
        :loading="tableLoading"
        :scroll="{ y: tableHeght }"
        :pagination="pagination"
        size="middle"
      >
        <span slot="action" slot-scope="text, record">
          <a-button type="link" @click="onClick(record)">详细档案</a-button>
        </span>
      </a-table>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

const columns = [
  {
    title: '企业名称',
    dataIndex: 'name',
    width: '45%'
  },
  {
    title: '地址',
    dataIndex: 'contactAddress',
    width: '45%'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'CustomerTable',
  props: {
    mode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      contentHeight: document.body.offsetHeight - 64 - 48,
      tableLoading: false,
      columns,
      customers: [],
      keyword: '',
      sortType: 'name',
      sortOrder: 'asc',
      customerId: '',
      pagination: {
        size: 'small',
        total: 0,
        current: 1,
        defaultPageSize: 10,
        showTotal: total => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '15', '20'],
        onChange: (current, pageSize) => this.onPageChange(current),
        onShowSizeChange: (current, pageSize) => this.onPageShowSizeChange(pageSize)
      },
      pageSize: 10
    }
  },
  computed: {
    ...mapGetters([
      'companyList'
    ]),
    tableHeght () {
      return this.mode === 'drawer' ? 340 : document.body.offsetHeight - 64 - 48 - 100
    }
  },
  created: function () {
    // console.log('客户列表', this.companyList)
    // this.getCustomer()
  },
  methods: {
    ...mapActions(['getMeterPointerTree', 'setCompany', 'getCompany']),
    onPageChange (page, pageSize) {
      this.pagination.current = page
      this.searchCustomer()
    },
    onPageShowSizeChange (pageSize) {
      this.pageSize = pageSize
      this.searchCustomer()
    },
    onClick (record) {
      this.setCompany(record)
      this.getMeterPointerTree(record.id)
        .then((res) => {
          this.$emit('click', record)
        })
        .catch(err => this.loginFailed(err))
    },
    onSearch (value) {
      this.keyword = value
      this.pagination.current = 1
      this.searchCustomer()
    },
    sortBy (type) {
      if (this.sortType === type) {
        this.sortOrder === 'asc' ? this.sortOrder = 'desc' : this.sortOrder = 'asc'
      } else {
        this.sortType = type
        this.sortOrder = 'asc'
      }
      this.pagination.current = 1
      this.searchCustomer()
    },
    searchCustomer () {
      this.tableLoading = true
      let p = {
        name: this.keyword,
        sidx: this.sortType,
        sord: this.sortOrder,
        rows: this.pageSize,
        page: this.pagination.current
      }
      console.log('searchCustomer', p)
      this.getCompany(p, p)
        .then((res) => {
          console.log('searchCustomer', res)
          this.pagination.total = res.body.data.length ? res.body.page.rowCount : 0
          this.tableLoading = false
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="stylus" scoped>
  .search
    display flex
    justify-content space-between
    align-items center
    padding 15px 0
  .sort-icon
    font-size 9px
    display inline-flex
    flex-direction column
    margin-left 5px
  .sort-btn
    display: inline-flex;
    justify-content: center;
    align-items: center;
  .ant-btn-default
    .sort-icon
      color rgba(0,0,0,.3)
  .ant-btn-primary
    .sort-icon
      color rgba(255,255,255,.5)
      .act
        color rgba(255,255,255,1)
</style>
