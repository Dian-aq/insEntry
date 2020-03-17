/** 接口域名的管理 */

// 环境模式（production：生产环境，development：测试）
const ENV = 'development'
const REMOTE_SERVER = '/serv'
const LOCAL_SERVER = [
  '/api', // 正式
  '/pin',
  '/bobo', // 思行
  '/chen', // 陈
  'http://rap2api.taobao.org/app/mock/236340' // rap2
]

const REMOTE_UPLOAD = '/upload_serv'
const LOCAL_UPLOAD = '/upload_api'

const API = {
  SERVER: ENV === 'production' ? REMOTE_SERVER : LOCAL_SERVER[1],
  UPLOAD: ENV === 'production' ? REMOTE_UPLOAD : LOCAL_UPLOAD // 演示https://www.mocky.io/v2/5cc8019d300000980a055e76
}

export default API
