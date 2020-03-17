/*
 * @Description: 菜单json数据结构描述
 * @Author: popotang
 * @Date: 2019-09-05 16:29:03
 * 属性名     类型      是否允许为空    其它说明
 * --------------------------------------------------
 * path      String        否         跳转路径. 即使是没有对应界面的菜单项也必须有path值. 如果path值以 http:// 或 https:// 打头, 则在新标签页打开, 否则在当前页打开
 * flag      String        否         唯一, 构建菜单时不需要, 但需要使用该属性与路由中的permission值进行比较,用于构建动态路由
 * title     String        否         菜单标题
 * icon      String        是         菜单图标
 * children  Array<object> 是         子菜单
*/
import Menu from 'ant-design-vue/es/menu'
import Icon from 'ant-design-vue/es/icon'

const { Item, SubMenu } = Menu

export default {
  name: 'SMenu',
  props: {
    mode: {
      type: String,
      default: 'inline',
      required: false
    },
    theme: {
      type: String,
      default: 'dark',
      required: false
    },
    accrodion: {
      type: Boolean,
      default: false,
      required: false
    },
    menus: {
      type: Array,
      // default: function () { return [] },
      required: true
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      openKeys: ['/monitor'], // 默认展开菜单，临时设置
      selectedKeys: [],
      cachedOpenKeys: []
    }
  },
  computed: {
    rootSubmenuKeys: vm => {
      const keys = []
      vm.menus.forEach(item => {
        keys.push(item.path)
      })
      return keys
    }
  },
  mounted () {
    this.updateMenu()
  },
  watch: {
    collapsed (val) {
      if (val) {
        this.cachedOpenKeys = this.openKeys.concat()
        this.openKeys = []
      } else {
        this.openKeys = this.cachedOpenKeys
      }
    },
    $route: function () {
      this.updateMenu()
    }
  },
  methods: {
    // 判断菜单的path是否为外部链接
    menuPathIsExternalLinks (path) {
      let result = false
      if (path) {
        if (path.toLowerCase().startsWith('https://') || path.toLowerCase().startsWith('http://')) {
          result = true
        }
      }
      return result
    },
    onOpenChange (openKeys) {
      // 在水平模式下时执行，并且不再执行后续
      if (this.mode === 'horizontal') {
        this.openKeys = openKeys
        return
      }
      // 非水平模式时
      if (this.accrodion) {
        const latestOpenKey = openKeys.find(key => !this.openKeys.includes(key))
        if (!this.rootSubmenuKeys.includes(latestOpenKey)) {
          this.openKeys = openKeys
        } else {
          this.openKeys = latestOpenKey ? [latestOpenKey] : []
        }
      } else {
        this.openKeys = openKeys
      }
    },
    updateMenu () {
      // if (this.accrodion)
      const routes = this.$route.matched.concat()
      const { hidden } = this.$route.meta
      if (routes.length >= 3 && hidden) {
        routes.pop()
        this.selectedKeys = [routes[routes.length - 1].path]
      } else {
        this.selectedKeys = [routes.pop().path]
      }
      if (this.accrodion) {
        const openKeys = []
        if (this.mode === 'inline') {
          routes.forEach(item => {
            openKeys.push(item.path)
          })
        }
        this.collapsed ? (this.cachedOpenKeys = openKeys) : (this.openKeys = openKeys)
      }
    },

    // render
    renderItem (menu) {
      if (!menu.hidden) {
        return menu.children && !menu.hideChildrenInMenu ? this.renderSubMenu(menu) : this.renderMenuItem(menu)
      }
      return null
    },
    renderMenuItem (menu) {
      // 判断菜单的链接是否为外部链接, 如果是则使用新标签页打开, 否则在当前页打开
      const isExternalLinks = this.menuPathIsExternalLinks(menu.path)
      const target = isExternalLinks || null
      // eslint-disable-next-line
      const tag = target && 'a' || 'router-link'
      const props = { to: menu.path }
      const attrs = { href: menu.path, target: isExternalLinks ? '_blank' : '' }

      if (menu.children && menu.hideChildrenInMenu) {
        // 把有子菜单的 并且 父菜单是要隐藏子菜单的
        // 都给子菜单增加一个 hidden 属性
        // 用来给刷新页面时， selectedKeys 做控制用
        menu.children.forEach(item => {
          item.meta = Object.assign(item.meta, { hidden: true })
        })
      }
      return (
        <Item {...{ key: menu.path }}>
          <tag {...{ props, attrs }}>
            {this.renderIcon(menu.icon)}
            <span>{menu.title}</span>
          </tag>
        </Item>
      )
    },
    renderSubMenu (menu) {
      const itemArr = []
      if (!menu.hideChildrenInMenu) {
        menu.children.forEach(item => itemArr.push(this.renderItem(item)))
      }
      const on = {
        titleClick: key => {
          this.$emit('titleClick', key)
        }
      }
      return (
        <SubMenu {...{ key: menu.path, on: on }}>
          <span slot="title">
            {this.renderIcon(menu.icon)}
            <span>{menu.title}</span>
          </span>
          {itemArr}
        </SubMenu>
      )
    },
    renderIcon (icon) {
      if (icon === 'none' || icon === undefined || icon === '') {
        return null
      }
      const props = {}
      typeof (icon) === 'object' ? props.component = icon : props.type = icon
      if (typeof (icon) === 'string') {
        if (icon.startsWith('fa-')) {
          // 使用的是Font Awesome图标
          return (
            <i class={'winter-menu-icon fa ' + icon} aria-hidden="true"></i>
          )
        } else if (icon.startsWith('iconfont')) {
          // 使用的是阿里的字体图标(需要预先引入对应的 iconfont.css)
          return (
            <span class={'winter-menu-icon ' + icon}></span>
          )
        } else {
          return (
            <Icon {... { props }}/>
          )
        }
      } else {
        return (
          <Icon {... { props }}/>
        )
      }
    }
  },

  render () {
    const { mode, theme, menus } = this
    const props = {
      mode: mode,
      theme: theme,
      openKeys: this.openKeys
    }
    const on = {
      select: obj => {
        this.selectedKeys = obj.selectedKeys
        this.$emit('select', obj)
      },
      openChange: this.onOpenChange
    }

    const menuTree = menus.map(item => {
      // console.log(item.title, item)
      if (item.hidden) {
        return null
      }
      return this.renderItem(item)
    })
    return (
      <Menu vModel={this.selectedKeys} {...{ props, on: on }}>
        {menuTree}
      </Menu>
    )
  }
}
