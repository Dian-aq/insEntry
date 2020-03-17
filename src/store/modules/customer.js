import { login } from '@/api'

const permission = {
  state: {
    currentCompanyName: '',
    currentCompanyId: '',
    companyList: [],
    meterPoint: []
  },
  mutations: {
    SET_COMPANY (state, company) {
      state.currentCompanyName = company.name
      state.currentCompanyId = company.id
    },
    SET_COMPANY_LIST (state, companyList) {
      state.companyList = companyList
    },
    SET_METER_POINT (state, meterPoint) {
      state.meterPoint = meterPoint
    }
  },
  actions: {
    getCompany ({ commit }, params) {
      return new Promise((resolve, reject) => {
        login.getCustomerCompany(params)
          .then((res) => {
            if (res.header.status === 'SUCCESS') {
              // console.log(res.body)
              commit('SET_COMPANY_LIST', res.body.data)
              res.body.data.length && commit('SET_COMPANY', res.body.data[0])
              resolve(res)
            }
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      })
    },
    setCompany ({ commit }, company) {
      commit('SET_COMPANY', company)
    },
    getMeterPointerTree ({ commit }, id) {
      return new Promise((resolve, reject) => {
        login.getMeterPointerTree({ customerId: id })
          .then((res) => {
            if (res.header.status === 'SUCCESS') {
              console.log('getMeterPointerTree', res.body)
              commit('SET_METER_POINT', res.body.list)
              resolve(res)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      })
    }
  }
}

export default permission
