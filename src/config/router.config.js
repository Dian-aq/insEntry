/*
 * @Author: popotang
 * @Date: 2019-09-05 9:27:03
 * @route数据结构描述
 * 属性名                   类型            默认值       其它说明
 * ---------------------------------------------------------------------------
 * path                   String            -         跳转地址路径
 * name                   String            -         路由名称, 必须设置,且不能重名
 * redirect               String            -         重定向地址, 访问这个路由时,自定进行重定向
 * meta                   String           {}         路由元信息
 * hideChildrenInMenu     Boolean           -         强制菜单显示为Item而不是SubItem(配合 meta.hidden)
 * hidden                 Boolean         false       控制路由是否显示在 sidebar
 * --------------------------------------------------------------------------------
 *
 * @meta数据结构描述
 * 属性名                   类型            默认值       其它说明
 * ---------------------------------------------------------------------------
 * title                  String             -         路由标题, 用于显示面包屑, 页面标题
 * icon                   String svg         -         路由在 menu 上显示的图标
 * keepAlive              Boolean           false      是否缓存该路由
 * hidden                 Boolean           false      用于隐藏菜单时，提供递归到父菜单显示 选中菜单项（可参考 个人页 配置方式）
 * permission             array[string]      []        与项目提供的权限拦截匹配的权限，如果不匹配，则会被禁止访问该路由页面
*/

import { PageIndex, PageLogin, RouteView } from '@/layouts'
/**
 * 动态路由
 */
export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: PageIndex,
    meta: { title: '首页' },
    redirect: '/entry',
    children: [
      // 入口页
      {
        path: '/entry',
        name: 'entry',
        meta: { title: '入口', keepAlive: true, permission: ['entry'] },
        component: () => import('@/views/entry/Entry')
      },
      {
        path: '/unit',
        name: 'unit',
        meta: { title: '单元', keepAlive: true, permission: ['entry'] },
        component: () => import('@/views/unit/Unit')
      },
      // 业务组件
      {
        path: '/profile',
        name: 'profile',
        meta: { title: '客户概况', keepAlive: true, permission: ['profile'] },
        component: () => import('@/views/profile/CustomerProfile')
      },
      {
        path: '/monitor',
        name: 'monitor',
        component: RouteView,
        redirect: '/monitor/realtime-data',
        meta: { title: '用能监测', keepAlive: true, permission: ['monitor'] },
        children: [
          {
            path: '/monitor/realtime-data',
            name: 'realtime-data',
            meta: { title: '实时状态', keepAlive: true, permission: ['monitor'] },
            component: () => import('@/views/monitor/realtimeData/RealtimeData'),
            redirect: '/monitor/pointViews',
            hideChildrenInMenu: false,
            children: [
              {
                path: '/monitor/pointViews',
                name: 'pointViews',
                meta: { title: '监测点视图', keepAlive: false, hidden: true, permission: ['monitor'] },
                component: () => import('@/views/monitor/realtimeData/pointer/PointViews')
              },
              {
                path: '/monitor/deviceViews',
                name: 'deviceViews',
                meta: { title: '设备视图', keepAlive: false, hidden: true, permission: ['monitor'] },
                component: () => import('@/views/monitor/realtimeData/DeviceViews')
              },
              {
                path: '/monitor/factorViews',
                name: 'factorViews',
                meta: { title: '监测点视图', keepAlive: false, hidden: true, permission: ['monitor'] },
                component: () => import('@/views/monitor/realtimeData/factor/FactorViews')
              }
            ]
          },
          {
            path: '/monitor/online-monitor',
            name: 'online-monitor',
            meta: { title: '在线监测', keepAlive: true, permission: ['monitor'] },
            component: () => import('@/views/monitor/OnlineMonitor')
          },
          {
            path: '/monitor/warning-monitor',
            name: 'warning-monitor',
            meta: { title: '预警监测', keepAlive: true, permission: ['monitor'] },
            hideChildrenInMenu: true,
            component: () => import('@/views/monitor/warningMonitor/WarningMonitor'),
            children: [
              {
                path: '/monitor/warning-history',
                name: 'warningHistory',
                component: () => import('@/views/monitor/warningMonitor/warningHistory'),
                meta: { title: '详细页', keepAlive: true, hidden: true, permission: ['monitor'] }
              }
            ]
          },
          {
            path: '/monitor/data-report',
            name: 'data-report',
            meta: { title: '数据报表', keepAlive: true, permission: ['monitor'] },
            component: () => import('@/views/monitor/DataReport')
          }
        ]
      },
      {
        path: '/resetPwd',
        name: 'resetPwd',
        component: () => import('@/views/user/ResetPwd')
      },
      {
        path: '/resetPwdSuccess',
        name: 'resetPwdSuccess',
        component: () => import('@/views/user/ResetPwdSuccess')
      }
    ]
  },
  {
    path: '*',
    redirect: '/404'
  }
]

/**
 * 基础路由
 */
export const constRouterMap = [
  // 登录
  {
    path: '/user',
    component: PageLogin,
    children: [
      {
        path: '/user/login',
        name: 'login',
        component: () => import('@/views/user/Login')
      },
      {
        path: '/user/register',
        name: 'register',
        component: () => import('@/views/user/Register')
      },
      {
        path: '/user/register-result',
        name: 'registerResult',
        component: () => import('@/views/user/RegisterResult')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/exception/404')
  },
  {
    path: '/403',
    component: () => import('@/views/exception/403')
  },
  {
    path: '/500',
    component: () => import('@/views/exception/500')
  }
]
