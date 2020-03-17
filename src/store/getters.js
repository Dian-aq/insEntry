const getters = {
  device: state => state.app.device,
  token: state => state.user.token,
  primaryColor: state => state.app.primaryColor,
  avatar: state => state.user.avatar,
  nickName: state => state.user.nickName,
  userId: state => state.user.id,
  menuTree: state => state.user.menuTree,
  executedLoadPermissionFromBackend: state => state.user.executedLoadPermissionFromBackend,
  funPermissions: state => state.user.funPermissions,
  routerPermissions: state => state.user.routerPermissions,
  multiTab: state => state.app.multiTab,
  addRouters: state => state.permission.addRouters,
  customerName: state => state.customer.currentCompanyName,
  customerId: state => state.customer.currentCompanyId,
  companyList: state => state.customer.companyList,
  meterPoint: state => state.customer.meterPoint
}

export default getters
