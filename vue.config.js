const path = require('path')
const webpack = require('webpack')
const createThemeColorReplacerPlugin = require('./src/config/plugin.config')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const vueConfig = {
  lintOnSave: false,
  devServer: {
    // disableHostCheck: true, // 解决使用花生壳内网穿透只返回304，invalid host header
    port: 8888,
    proxy: {
      '/api': {
        target: 'http://119.23.116.6:22500', //  http://119.23.116.6:22500
        // ws: true,        //如果要代理 websockets，配置这个参数
        // secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/api': '/customer-agent-web'
        }
      },
      '/pin': {
        target: 'http://192.168.0.224:8081',
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/pin': '/center-manager'
        }
      },
      '/chen': {
        target: 'http://xingxichen.cn:8090', // http://xingxichen.cn:8090，http://192.168.0.228:80
        changeOrigin: true,
        pathRewrite: {
          '^/chen': '/customer_agent_web'
        }
      },
      '/upload_api': {
        target: 'http://192.168.0.203:8200/web/fileoperation/uploadData', // http://192.168.0.220:9380/ 思行，http://192.168.0.203:8200
        changeOrigin: true,
        pathRewrite: {
          '^/upload_api': ''
        }
      },
      '/upload_serv': {
        target: 'http://fbase.inspower.cn:8190/web/fileoperation/uploadData', // https://47.106.59.165:8190，https://fbase.inspower.cn:8190
        changeOrigin: true,
        pathRewrite: {
          '^/upload_serv': ''
        }
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
        /* less 变量覆盖，用于自定义 ant design 主题 */

          'primary-color': '#e8651b' // 全局主色
          /*
          'link-color': '#1890ff';                            // 链接色
          'success-color': '#52c41a';                         // 成功色
          'warning-color': '#faad14';                         // 警告色
          'error-color': '#f5222d';                           // 错误色
          'font-size-base': '14px';                           // 主字号
          'heading-color': rgba(0, 0, 0, .85);              // 标题色
          'text-color': rgba(0, 0, 0, .65);                 // 主文本色
          'text-color-secondary' : rgba(0, 0, 0, .45);      // 次文本色
          'disabled-color' : rgba(0, 0, 0, .25);            // 失效色
          'border-radius-base': 4px;                        // 组件/浮层圆角
          'border-color-base': #d9d9d9;                     // 边框色
          'box-shadow-base': 0 2px 8px rgba(0, 0, 0, .15);  // 浮层阴影
          */
        },
        javascriptEnabled: true
      }
    }
  }
}

if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true') {
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}
module.exports = vueConfig
