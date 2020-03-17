/** 登录模块接口列表 */

import API from './base'
import axios from '@/utils/http'
import qs from 'qs'

const login = {
  userLogin (params) { return axios.post(API.SERVER + '/web/right/auth/login.form', qs.stringify(params)) },
  userLogout (params) { return axios.post(API.SERVER + '/web/user/auth/logout', qs.stringify(params)) },
  getInfo (params) { return axios.get('http://rap2api.taobao.org/app/mock/236340/getUserInfo', qs.stringify(params)) },
  getSmsCaptcha (tel) { return axios.get(API.SERVER + '/getSmsCaptcha', qs.stringify(tel)) },
  resetPassword (params) { return axios.post(API.SERVER + '/web/customer/resetPw', qs.stringify(params)) },
  getCustomerCompany (params) { return axios.post(API.SERVER + '/web/customer/getCustomerList', qs.stringify(params)) }, // 获取客户企业
  getMeterPointerTree (params) { return axios.post(API.SERVER + '/web/measurePoint/getMeasurePointTreeByCustomerId', qs.stringify(params)) } // 获取监测点，根据客户企业
}

export default login
