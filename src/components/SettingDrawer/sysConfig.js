import { message } from 'ant-design-vue/es'
import themeColor from './themeColor.js'

const colorList = [
  { key: '鹰视橙', color: '#e8651b' },
  { key: '阿里蓝', color: '#1374ce' },
  { key: '微信绿', color: '#3cb035' },
  { key: '明青', color: '#13C2C2' },
  { key: '极光绿', color: '#52C41A' },
  { key: '拂晓蓝（默认）', color: '#1890FF' },
  { key: '极客蓝', color: '#2F54EB' },
  { key: '酱紫', color: '#722ED1' }
]

const updateTheme = newPrimaryColor => {
  const hideMessage = message.loading('主题切换中...^_^', 0)
  themeColor.changeColor(newPrimaryColor).finally(t => {
    setTimeout(() => {
      hideMessage()
    })
  })
}

export { updateTheme, colorList }
