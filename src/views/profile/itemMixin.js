import { profile } from '@/api'
import { mapGetters } from 'vuex'

const itemMixin = {
  props: {
    cardBodyHeight: {
      type: Number,
      required: false,
      default: 292
    },
    layout: {
      type: String,
      required: true,
      default: 'full'
    },
    title: {
      type: String,
      required: true,
      default: '未定义标题'
    },
    editMode: {
      type: Boolean,
      required: true,
      default: false
    },
    isLoaded: {
      type: String,
      required: true,
      default: ''
    },
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      color: ['#f52222', '#fa6728', '#198cff', '#52c41a'], // 尖、峰、平、谷
      chartLoading: true,
      chartStyle: {
        legend: {
          align: 'left'
        },
        legendGrid: {
          top: 40,
          left: 40,
          right: 40,
          bottom: '10%'
        },
        grid: {
          top: '5%',
          left: 40,
          right: 20,
          bottom: '10%'
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            lineStyle: {
              color: '#e1e1e1'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#e1e1e1',
              type: 'dashed'
            }
          }
        }
      }
    }
  },
  created () {
    this.isLoaded && this.init()
  },
  // watch: {
  //   customerId: function (val, oldVal) {
  //     if (val !== oldVal) {
  //       this.init()
  //     }
  //   }
  // },
  computed: {
    ...mapGetters([
      'customerId',
      'meterPoint'
    ]),
    computedStack () {
      let arr = []
      this.chartData.measures.forEach((item, index) => {
        arr.push(item.name)
      })
      return arr
    }
  },
  methods: {
    colorIndex (str) {
      let idx = 3 // 默认谷
      switch (str) {
        case '尖':
          idx = 0
          break
        case '峰':
          idx = 1
          break
        case '平':
          idx = 2
          break
        default:
          idx = 3
      }
      return idx
    },
    onSwitchChange (value, label, extra) {
      this.getData(value)
    },
    onEditClick () {
      this.$emit('edit', this.item)
    },
    onDeleteClick (e) {
      profile.delLayout({ id: this.item.id })
        .then((res) => {
          console.log('saveLayout', res)
          if (res.header.status === 'SUCCESS') {
            this.$message.info('删除成功')
            this.$emit('del')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}

export { itemMixin }
