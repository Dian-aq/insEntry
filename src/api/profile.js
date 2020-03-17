/** 客户概况模块接口列表 */

import API from './base'
import axios from '@/utils/http'
import qs from 'qs'

const profile = {
  getLayoutData (params) { return axios.post(API.SERVER + '/web/custFunComCfg/getCustHomePage', qs.stringify(params)) }, // 获取模块数据
  getLayoutTypeData (params) { return axios.get(API.SERVER + '/web/funComCat/getSystemDefaultConfigTree', qs.stringify(params)) }, // 获取模块分类数据
  saveLayout (params) { return axios.post(API.SERVER + '/web/custFunComCfg/saveData', params, { headers: { 'Content-Type': 'application/json' } }) }, // 新增保存板块
  delLayout (params) { return axios.post(API.SERVER + '/web/custFunComCfg/deleteDatas', qs.stringify(params)) }, // 删除板块
  sortLayout (params) { return axios.post(API.SERVER + '/web/custFunComCfg/resetOrderNo', qs.stringify(params)) }, // 排序板块
  editLayout (params) { return axios.post(API.SERVER + '/web/custFunComCfg/updateData', params, { headers: { 'Content-Type': 'application/json' } }) }, // 编辑保存板块

  // 个模块接口定义
  getEnterpriseInfo (params) { return axios.post(API.SERVER + '/web/customer/getCustomer', qs.stringify(params)) }, // 企业信息
  saveEnterprisePhoto (params) { return axios.post(API.SERVER + '/web/customer/upCustomerImgPath', qs.stringify(params)) }, // 保存企业图片
  getRecent24HourLoadTrend (params) { return axios.post(API.SERVER + '/web/eleSituation/getLoadRateChart', qs.stringify(params)) }, // 近24小时负荷趋势
  getRecent24HourDemandTrend (params) { return axios.post(API.SERVER + '/web/eleSituation/nearlyDayDemand', qs.stringify(params)) }, // 近24小时需量趋势
  getRecent24HourUseElecTrend (params) { return axios.post(API.SERVER + '/web/onlineMonitor/getLast24HoursElec', qs.stringify(params)) }, // 近24小时用电趋势
  getRecent30DaysUseElecTrend (params) { return axios.post(API.SERVER + '/web/eleSituation/nearlyMonthElecQuan', qs.stringify(params)) }, // 近30日用电趋势
  getRecentHalfYearUseElecTrend (params) { return axios.post(API.SERVER + '/web/eleSituation/nearlyHalfYearElecQuan', qs.stringify(params)) }, // 近半年用电趋势
  getWarningLog (params) { return axios.post(API.SERVER + '/web/warning/getWarningSummary', qs.stringify(params)) }, // 告警记录
  getMonthElectricChargeTotal (params) { return axios.post(API.SERVER + '/web/onlineMonitor/getMonthlyFeeStatistics', qs.stringify(params)) }, // 本月电费统计
  getPriceInfo (params) { return axios.post(API.SERVER + '/web/eleSituation/elecCalcInfo', qs.stringify(params)) }, // 本月电费统计-电价信息
  getMonthTimeSharingTotal (params) { return axios.post(API.SERVER + '/web/onlineMonitor/getMonthAndDayElecStatistics', qs.stringify(params)) } // 本月分时电量统计
}

export default profile
