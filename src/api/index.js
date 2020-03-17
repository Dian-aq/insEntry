/** api接口的统一出口 */

// 登录模块接口
import login from '@/api/login'

import monitor from '@/api/monitor' // 在线监测模块接口
import profile from '@/api/profile' // 客户概况接口
export {
  login,
  monitor,
  profile
}
