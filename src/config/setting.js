/**
 * 项目默认配置项
 * primaryColor - 默认主题色, 如果修改颜色不生效，请清理 localStorage
 * navTheme -  导航菜单两种主题['dark', 'light']
 * layout - 整体布局方式 ['sidemenu', 'topmenu'] 竖向、横向两种布局
 * fixedHeader - 固定 Header : boolean
 * fixedSiderbar - 固定左侧菜单栏 ： boolean
 * autoHideHeader - 向下滚动时，隐藏 Header : boolean
 * sidebarAccordionMode - 侧边栏开启手风琴模式 ： boolean
 * contentWidth - 内容区布局： 流式 |  固定
 * multiTab - 开启多页签选项 ： boolean
 */

export default {
  primaryColor: '#1890FF',
  navTheme: 'dark',
  layout: 'topmenu',
  contentWidth: 'Fixed',
  fixedHeader: true,
  fixedSiderbar: true,
  autoHideHeader: false,
  multiTab: false,
  sidebarAccordionMode: false
  // production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true'
}
