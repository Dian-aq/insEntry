import { mapGetters } from 'vuex'

const mixinMeterPoint = {
  props: {
    disabledCustomer: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters([
      'meterPoint'
    ]),
    computedMeterPoint () {
      this.meterPoint.forEach((item, index) => {
        if (item.slots.icon === 'customer') { // 户号不能选择
          item.selectable = !this.disabledCustomer
        }
      })
      // console.log(this.meterPoint)
      return this.meterPoint
    }
  }
}

export { mixinMeterPoint }
