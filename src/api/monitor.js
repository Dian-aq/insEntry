/** 用能监测模块接口列表 */

import API from './base'
import axios from '@/utils/http'
import qs from 'qs'

const monitor = {

  // 监测点视图
  getMeterPointer (params) { return axios.get(API.SERVER + '/getMeterPointerTree', qs.stringify(params)) },
  getPointViewsData (params) { return axios.post(API.SERVER + '/web/realTimeData/getMeasurePointRealTimeData', qs.stringify(params)) }, // 监测点视图数据
  getPointConfigItem  (params) { return axios.post(API.SERVER + '/web/custDataGroupCfg/toEdit', qs.stringify(params)) }, // 获取监测点配置项
  getMonitorItemFromMeterPoint (params) { return axios.post(API.SERVER + '/web/measurePoint/getMonitorFactorSelectedListByModelId', qs.stringify(params)) }, // 获取监测项
  saveMeterPointConfig (params) { return axios.post(API.SERVER + '/web/custDataGroupCfg/saveDataForMeasurePoint', params, { headers: { 'Content-Type': 'application/json' } }) }, // 新增监测点视图保存
  editMeterPointConfig (params) { return axios.post(API.SERVER + '/web/custDataGroupCfg/updateDataDataForMeasurePoint', params, { headers: { 'Content-Type': 'application/json' } }) }, // 编辑监测点视图保存
  delMeterPointConfig (params) { return axios.post(API.SERVER + '/web/custDataGroupCfg/deleteDatas', qs.stringify(params)) }, // 监测点视图和多因子视图删除
  copyMeterPointConfig (params) { return axios.post(API.SERVER + '/web/custDataGroupCfg/copyDatas', qs.stringify(params)) }, // 复制监测点视图保存
  sortMeterPointConfig (params) { return axios.post(API.SERVER + '/web/custDataGroupCfg/resetOrderNo', qs.stringify(params)) }, // 排序监测点视图保存
  loadDefaultConfig (params) { return axios.post(API.SERVER + '/web/measurePoint/getDefalutMonitorFactorSelectedList', qs.stringify(params)) }, // 加载默认配置项
  getFileUploadToken (params) { return axios.post(API.SERVER + '/web/customer/getFileUploadToken', qs.stringify(params)) }, // 上传文件前获取uploadToken

  // 多因子视图
  getFactorViewsData (params) { return axios.post(API.SERVER + '/web/realTimeData/getMonitorFactorRealTimeData', qs.stringify(params)) }, // 多因子视图数据
  getFactorItems (params) { return axios.post(API.SERVER + '/web/custDataItemCfg/getMonitorFactor', qs.stringify(params)) }, // 读取多因子项数据
  saveFactorGroup (params) { return axios.post(API.SERVER + '/web/custDataGroupCfg/saveDataForMonitorFactor', params, { headers: { 'Content-Type': 'application/json' } }) }, // 新增多因子分类
  updateFactorGroup (params) { return axios.post(API.SERVER + '/web/custDataGroupCfg/updateDataDataForMonitorFactor', params, { headers: { 'Content-Type': 'application/json' } }) }, // 编辑多因子分类
  saveFactor (params) { return axios.post(API.SERVER + '/web/custDataItemCfg/saveDataForMonitorFactor', params, { headers: { 'Content-Type': 'application/json' } }) }, // 新增多因子
  updateFactor (params) { return axios.post(API.SERVER + '/web/custDataItemCfg/updataDataForMonitorFactor', params, { headers: { 'Content-Type': 'application/json' } }) }, // 编辑多因子
  delFactor (params) { return axios.post(API.SERVER + '/web/custDataItemCfg/deleteDatas', qs.stringify(params)) }, // 编辑多因子
  sortFactor (params) { return axios.post(API.SERVER + '/web/custDataItemCfg/resetOrderNo', qs.stringify(params)) }, // 排序多因子

  // 电量报表
  getReportData (params) { return axios.post(API.SERVER + '/web/elecQuan/getElecQuanStatements', qs.stringify(params)) }, // 获取预警列表数据
  exportReportData (params) { return axios.post(API.SERVER + '/web/elecQuan/exportData', qs.stringify(params), { responseType: 'blob' }) }, // 导出
  getElecQuanChart (params) { return axios.post(API.SERVER + '/web/elecQuan/getElecQuanChart', qs.stringify(params)) }, // 查询监测点柱图

  // 在线监测
  getFactorFilterItem (params) { return axios.post(API.SERVER + '/web/onlineMonitor/getFactorByMeasurePointId', qs.stringify(params)) }, // 获取监测因子
  getFactorFilterItemNew (params) { return axios.post(API.SERVER + '/web/onlineMonitor/getFactorTreeByMeasurePointId', qs.stringify(params)) }, // 获取监测因子-新
  getHistoryData (params) { return axios.post(API.SERVER + '/web/onlineMonitor/getOnlineMonitorDataForChart', qs.stringify(params)) }, // 查询历史数据
  getHistoryTableData (params) { return axios.post(API.SERVER + '/web/onlineMonitor/getHistoryTableDataOfChart', qs.stringify(params)) }, // 查询历史表格数据
  exportHistoryData (params) { return axios.post(API.SERVER + '/web/onlineMonitor/downloadHistoryTableData', qs.stringify(params), { responseType: 'blob' }) }, // 导出历史表格数据

  // 预警监测
  getWarning (params) { return axios.post(API.SERVER + '/web/warning/getWarningPagination', qs.stringify(params)) }, // 获取预警列表数据
  getWarningInfo (params) { return axios.post(API.SERVER + '/web/warning/getWarningInfoById', qs.stringify(params)) }, // 获取预警列表数据
  getPowerfactorHistory (params) { return axios.post(API.SERVER + '/web/warning/getWarningValueChart', qs.stringify(params)) } // 获取预警列表数据
}

export default monitor
