import { mapState } from 'vuex'
import { deviceEnquire, DEVICE_TYPE } from '@/utils/device'
import moment from 'moment'

const mixin = {
  computed: {
    ...mapState({
      layoutMode: state => state.app.layout,
      menuTheme: state => state.app.menuTheme,
      sidebarOpen: state => state.app.sidebarOpen,
      fixedHeader: state => state.app.fixedHeader,
      primaryColor: state => state.app.primaryColor,
      fixedSiderbar: state => state.app.fixedSiderbar,
      autoHideHeader: state => state.app.autoHideHeader,
      multiTab: state => state.app.multiTab,
      sidebarAccordionMode: state => state.app.sidebarAccordionMode
    })
  },
  methods: {
    isTopMenu () {
      return this.layoutMode === 'topmenu'
    },
    isSideMenu () {
      return !this.isTopMenu()
    }
  }
}

const mixinDevice = {
  computed: {
    ...mapState({
      device: state => state.app.device
    })
  },
  methods: {
    isMobile () {
      return this.device === DEVICE_TYPE.MOBILE
    },
    isDesktop () {
      return this.device === DEVICE_TYPE.DESKTOP
    },
    isTablet () {
      return this.device === DEVICE_TYPE.TABLET
    }
  }
}

const AppDeviceEnquire = {
  mounted () {
    const { $store } = this
    deviceEnquire(deviceType => {
      switch (deviceType) {
        case DEVICE_TYPE.DESKTOP:
          $store.commit('TOGGLE_DEVICE', 'desktop')
          $store.dispatch('setSidebar', true)
          break
        case DEVICE_TYPE.TABLET:
          $store.commit('TOGGLE_DEVICE', 'tablet')
          $store.dispatch('setSidebar', false)
          break
        case DEVICE_TYPE.MOBILE:
        default:
          $store.commit('TOGGLE_DEVICE', 'mobile')
          $store.dispatch('setSidebar', true)
          break
      }
    })
  }
}

const setDateMixin = {
  methods: {
    setDate (str, type) {
      let _startTime = JSON.parse(JSON.stringify(this.startTime))
      let _endTime = JSON.parse(JSON.stringify(this.endTime))
      switch (str) {
        case 'lastCycle':
          // 判断是否选择一个月否则按天数递减
          if (this.startTime.format('DD') === '01' && this.startTime.endOf('month').format('YYYY-MM-DD') === this.endTime.format('YYYY-MM-DD')) {
            this.endTime = moment(_startTime).subtract(1, 'month').endOf('month')
            this.startTime = moment(_startTime).subtract(1, 'month').startOf('month')
          } else {
            let diffDate = moment(_endTime).diff(moment(_startTime), 'days') + 1
            this.endTime = moment(_startTime).subtract(1, 'day').endOf('day')
            this.startTime = moment(_startTime).subtract(diffDate, 'day').startOf('day')
          }
          break
        case 'nextCycle':
          // 判断是否选择一个月否则按天数递增
          if (this.startTime.format('DD') === '01' && this.startTime.endOf('month').format('YYYY-MM-DD') === this.endTime.format('YYYY-MM-DD')) {
            this.endTime = moment(_startTime).add(1, 'month').endOf('month')
            this.startTime = moment(_startTime).add(1, 'month').startOf('month')
          } else {
            let diffDate = moment(_endTime).diff(moment(_startTime), 'days') + 1
            this.endTime = moment(_endTime).add(diffDate, 'day').endOf('day')
            this.startTime = moment(_endTime).add(1, 'day').startOf('day')
          }
          break
        case 'yesterday':
          this.startTime = moment().subtract(1, 'day').startOf('day')
          this.endTime = moment().subtract(1, 'day').endOf('day')
          break
        case 'week':
          this.startTime = moment().startOf('week').startOf('day')
          this.endTime = moment().endOf('week').endOf('day')
          break
        case 'month':
          this.startTime = moment().startOf('month').startOf('day')
          this.endTime = moment().endOf('month').endOf('day')
          break
        case '10days':
          this.startTime = moment().subtract(10, 'day').startOf('day')
          this.endTime = moment().endOf('day')
          break
        case '15days':
          this.startTime = moment().subtract(15, 'day').startOf('day')
          this.endTime = moment().endOf('day')
          break
        case '30days':
          this.startTime = moment().subtract(30, 'day').startOf('day')
          this.endTime = moment().endOf('day')
          break
        default:
          this.startTime = moment().startOf('day')
          this.endTime = moment().endOf('day')
          break
      }
      if (type === 1) {
        this.pagination.current = 1
        this.time[0] = this.startTime
        this.time[1] = this.endTime
        this.getWarning()
      } else if (type === 2) {
        this.pagination.current = 1
        this.getReportData()
      }
    }
  }
}
export { mixin, mixinDevice, AppDeviceEnquire, setDateMixin }
