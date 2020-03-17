<template>
    <div class="user-wrapper">
        <div class="content-box">
          <!-- <a href="https://pro.loacg.com/docs/getting-started" target="_blank">
            <span class="action">
              <a-icon type="question-circle-o"></a-icon>
            </span>
          </a>
          <user-msg />-->
          <a-button type="link" class="link-btn">应用下载</a-button>
          <a-button type="link" class="link-btn">帮助</a-button>
          <sys-setting />
          <a-dropdown placement="bottomRight" overlayClassName="dropdown-block">
            <span class="action ant-dropdown-link">
              <a-avatar class="avatar" size="small" icon="user" style="backgroundColor:#87d068;margin-right: 10px;vertical-align: middle;"/>
              <span>{{userName}}</span>
            </span>
            <a-menu slot="overlay" class="" @click="onUserClick">
              <!-- <a-menu-item key="0">
                <a-icon type="user"/>
                <span>个人中心</span>
              </a-menu-item>
              <a-menu-item key="1">
                  <a-icon type="setting"/>
                  <span>账户设置</span>
              </a-menu-item>
              <a-menu-item key="2" disabled>
                <a-icon type="setting"/>
                <span>测试</span>
              </a-menu-item> -->
              <a-menu-item key="1">
                <a-icon type="lock"/>
                <span>修改密码</span>
              </a-menu-item>
              <a-menu-divider/>
              <a-menu-item key="3">
                  <a-icon type="logout"/>
                  <span>退出登录</span>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
    </div>
</template>
<script>
// import UserMsg from '@/components/tools/UserMsg'
import SysSetting from '@/components/SettingDrawer/SysSetting'
import Vue from 'vue'
import { mapActions } from 'vuex'

export default {
  components: {
    // UserMsg
    SysSetting
  },
  created () {
    this.userName = Vue.ls.get('userName')
  },
  data () {
    return {
      userName: '佚名'
    }
  },
  methods: {
    ...mapActions(['Logout']),
    onUserClick ({ item, key, keyPath }) {
      if (key === '3') {
        this.Logout()
          .then((res) => {
            this.$router.push('/user/login').catch(() => {})
          })
          // .catch(err => {})
          // .finally(() => {})
      } else {
        this.$router.push({ name: 'resetPwd' }).catch(() => {})
      }
    }
  }
}
</script>
<style lang="stylus">
    .user-wrapper
      float: right
      height: 100%
      padding-right: 10px
      .action
        &:hover
          background: rgba(0,0,0,.035);
        cursor: pointer
        padding: 0 12px;
        display: inline-block
        -webkit-transition: all .3s
        transition: all .3s
        height: 100%
        color: rgba(0,0,0,.65)
        font-size:14px !important
    .dropdown-block
        width: 150px
    .link-btn
      color #fff !important
</style>
