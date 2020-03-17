<template>
    <div>
      <a-row v-if="$route.name==='warning-monitor'">
        <a-col :xs="12" :sm="5" :span="4">
          <meter-pointer-tree customerId="haha" :disabledCustomer="false" :defaultSelectedKey="treeSelectedKeys" @select="onTreeSelect"></meter-pointer-tree>
        </a-col>
        <a-col :xs="12" :sm="19" :span="20" style="padding:20px">
            <div>
              状态：
                <a-radio-group v-model="state" @change="onStateChange" defaultValue="" size="small" buttonStyle="solid" style="margin-right:40px">
                  <a-radio-button value="">所有</a-radio-button>
                  <a-radio-button value="生效中">生效中</a-radio-button>
                  <a-radio-button value="已恢复">已恢复</a-radio-button>
                </a-radio-group>
            级别：
            <a-radio-group v-model="action" @change="onActionChange" defaultValue="" buttonStyle="solid" size="small">
              <a-radio-button value="">所有</a-radio-button>
              <a-radio-button value="warning31">一般</a-radio-button>
              <a-radio-button value="warning32">紧急</a-radio-button>
              <a-radio-button value="warning34">严重</a-radio-button>
            </a-radio-group>
            </div>
            <div style="margin-top:10px">
              时间：
              <a-range-picker
                :value="time"
                @change="onRangeDateChange"
                :showTime="{ format: 'HH:mm' }"
                format="YYYY-MM-DD HH:mm"
                style="margin-right:20px"/>
              <a-button icon="step-backward" size="small" class="mar-r-10" @click="setDate('lastCycle', 1)">上一个周期</a-button>
              <a-button size="small" icon="step-forward" class="mar-r-10" @click="setDate('nextCycle', 1)">下一个周期</a-button>
              <a-button size="small" class="mar-r-10" @click="setDate('today', 1)">今天</a-button>
              <a-button size="small" class="mar-r-10" @click="setDate('yesterday', 1)">昨日</a-button>
              <a-button size="small" class="mar-r-10" @click="setDate('week', 1)">本周</a-button>
              <a-button size="small" class="mar-r-10" @click="setDate('month', 1)">本月</a-button>
            </div>
          <a-card title="预警信息" style="width:100%;margin-top:10px">
            <!-- <a-button type="primary" slot="extra" icon="file-protect" @click="warningConfig">配置预警规则</a-button> -->
            <a-table :columns="columns" :dataSource="warningData" rowKey="id" :scroll="{ x: 1800, y: tableHeght }" :pagination="pagination" :loading="tableLoading">
              <span slot="action" slot-scope="action">
                <a-tag v-if="action==='warning31'" color="#198cff">一般</a-tag>
                <a-tag v-if="action==='warning32'" color="#faad14">紧急</a-tag>
                <a-tag v-if="action==='warning33'" color="#faad14">紧急</a-tag>
                <a-tag v-if="action==='warning34'" color="#f52222">严重</a-tag>
              </span>
              <div class="cancelState" slot="cancelState" slot-scope="cancelState">
                <a-badge v-if="cancelState==='已恢复'" status="success" /><a-badge v-else status="error" />{{cancelState}}
              </div>
              <span slot="doit" slot-scope="text,record">
                <a href="javascript:;" @click="onWarningHistoryClick(record)">详情</a>
                <!-- <a-divider type="vertical" />
                <a href="javascript:;">通知历史</a> -->
              </span>
            </a-table>
          </a-card>
          <a-modal
            title="预警规则配置"
            centered
            :width="1300"
            :bodyStyle="{height: '600px', padding: '10px'}"
            v-model="warningConfigShow"
            @ok="() => modal2Visible = false"
          >
            <iframe src="http://192.168.0.228:8080/insclient/warningdata/WarningRulesConfiguration.form?eCustomerId=521e2917-585f-4aea-967b-5595984c32b5" style="height:100%;width:100%" frameborder="0"></iframe>
          </a-modal>
        </a-col>
      </a-row>
      <router-view v-else></router-view>
    </div>
</template>
<script>
import MeterPointerTree from '@/components/MeterPointerTree'
import { monitor } from '@/api'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { setDateMixin } from '@/utils/mixin'

const columns = [
  {
    dataIndex: 'content',
    title: '内容',
    width: 450
  },
  // {
  //   title: '参考值',
  //   width: 100,
  //   dataIndex: 'reference'
  // },
  {
    title: '告警源',
    width: 150,
    dataIndex: 'measurePointName'
  },
  {
    title: '级别',
    dataIndex: 'action',
    width: 80,
    scopedSlots: { customRender: 'action' }
  },
  {
    title: '状态',
    width: 100,
    className: 'cancelStateH',
    dataIndex: 'cancelState',
    scopedSlots: { customRender: 'cancelState' }
  },
  {
    title: '发生时间',
    width: 180,
    dataIndex: 'getTimeStr'
  },
  {
    title: '恢复时间',
    width: 180,
    dataIndex: 'cancelTimeStr'
  },
  {
    title: '持续时间（分）',
    width: 150,
    dataIndex: 'longTime'
  },
  {
    title: '类型',
    width: 150,
    dataIndex: 'checkType'
  },
  {
    title: '操作',
    dataIndex: 'doit',
    fixed: 'right',
    width: 90,
    scopedSlots: { customRender: 'doit' }
  }
]

export default {
  name: 'WarningMonitor',
  mixins: [setDateMixin],
  components: {
    MeterPointerTree
  },
  data () {
    return {
      warningConfigShow: false,
      selectedPointId: '',
      selectedPointType: '',
      columns,
      tableLoading: false,
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
      tableHeght: document.body.offsetHeight - 153 - 12 - 49 - 150,
      warningData: [],
      state: '',
      action: '',
      pageSize: 10,
      time: [
        moment().subtract(3, 'month').startOf('day'),
        moment().endOf('day')
      ],
      startTime: moment().subtract(3, 'month').startOf('day'),
      endTime: moment().endOf('day')
    }
  },
  computed: {
    ...mapGetters([
      'meterPoint',
      'customerId'
    ]),
    treeSelectedKeys () {
      return Array.of(this.selectedPointId)
    }
  },
  mounted: function () {
    // console.log(this.meterPoint[0].key, this.treeSelectedKeys)
    // this.$message.warning('设置监测点id为131')
    // if (this.meterPoint) {
    //   this.selectedPointId = this.meterPoint[0].key
    // }
    this.getWarning()
  },
  methods: {
    moment,
    warningConfig () {
      this.warningConfigShow = true
    },
    onRangeDateChange (date, dateString) {
      // console.log(date, dateString)
      // this.startTime = date[0]
      // this.endTime = date[1]
      this.time = [date[0], date[1]]
      this.pagination.current = 1
      this.getWarning()
    },
    onPageChange (page, pageSize) {
      this.pagination.current = page
      this.getWarning()
    },
    onPageShowSizeChange (pageSize) {
      this.pageSize = pageSize
      this.getWarning()
    },
    onStateChange (e) {
      this.getWarning()
    },
    onActionChange (e) {
      this.getWarning()
    },
    onTreeSelect (selectedKeys, info) {
      this.selectedPointId = selectedKeys
      this.selectedPointType = info.node.dataRef.slots.icon
      this.pagination.current = 1
      this.getWarning()
    },
    onWarningHistoryClick (row) {
      // console.log(row.id)
      this.$router.push({ name: 'warningHistory', params: { warningId: row.id } }).catch(err => { console.log(err) })
    },
    getWarning () {
      this.tableLoading = true
      let params = {
        customerId: this.customerId,
        id: this.selectedPointId, // this.selectedPointId
        idType: this.selectedPointType,
        startTime: this.time[0] ? this.time[0].format('YYYY-MM-DD HH:mm') : '',
        endTime: this.time[1] ? this.time[1].format('YYYY-MM-DD HH:mm') : '',
        action: this.action,
        state: this.state,
        rows: this.pageSize,
        page: this.pagination.current
      }
      // console.log('传参', params)
      monitor.getWarning(params)
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            this.warningData = res.body.data
            this.pagination.total = res.body.page.rowCount
          }
          this.tableLoading = false
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="stylus" scoped>
  th.cancelStateH,
  td.cancelStateH {
    text-align: center !important;
  }
  .cancelState
    display flex
    justify-content center
    align-items center
</style>
