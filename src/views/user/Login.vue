<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="loginRequest"
    >
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset', color: '#fff' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="tab1" tab="账号密码登录">
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="帐号/邮箱地址"
              v-decorator="[
                'loginName',
                {rules: [{ required: true, message: '请输入帐号或邮箱地址' }, { validator: checkUsernameOrEmail }], validateTrigger: 'change'}
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input-password
              size="large"
              type="password"
              autocomplete="false"
              placeholder="密码"
              v-decorator="[
                'password',
                {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input-password>
          </a-form-item>
          <a-row :gutter="16">
            <a-col class="gutter-row" :span="16">
              <a-form-item>
                <a-input size="large" type="text" placeholder="验证码" v-decorator="['verificationCode', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur' }]"></a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <img :src="vertImg" class="verificationCode" @click="refreshCode">
            </a-col>
          </a-row>
        </a-tab-pane>
        <!-- 隐藏手机登录
        <a-tab-pane key="tab2" tab="手机号登录">
          <a-form-item>
            <a-input size="large" type="text" placeholder="手机号" v-decorator="['mobile', {rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'change'}]">
              <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-row :gutter="16">
            <a-col class="gutter-row" :span="16">
              <a-form-item>
                <a-input size="large" type="text" placeholder="验证码" v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
                  <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-button
                class="getCaptcha"
                tabindex="-1"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
                v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
              ></a-button>
            </a-col>
          </a-row>
        </a-tab-pane> -->
      </a-tabs>

      <!-- <a-form-item>
        <a-checkbox v-decorator="['rememberMe']">自动登录</a-checkbox>
        <router-link
          :to="{ name: 'recover', params: { user: 'aaa'} }"
          class="forge-password"
          style="float: right;"
        >忘记密码</router-link>
      </a-form-item> -->

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          :loading="state.loginBtn"
        >{{state.loginBtnText}}</a-button>
      </a-form-item>

      <div class="user-login-other">
        <span style='color:#fff'>其他登录方式</span>
        <a>
          <a-icon class="item-icon" type="wechat" />
        </a>
        <router-link class="register" :to="{ name: 'register' }">注册账户</router-link>
      </div>
    </a-form>
  </div>
</template>

<script>
import Vue from 'vue'
import md5 from 'md5'
import { mapActions } from 'vuex'
import API from '@/api/base'

export default {
  data () {
    return {
      customActiveKey: 'tab1',
      stepCaptchaVisible: false,
      vertImg: API.SERVER + '/web/right/verificationCode/loadImage.form' + '?timestamp=' + new Date().getTime(),
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtnText: '确定',
        loginBtn: false,
        loginType: 0,
        smsSendBtn: false
      },
      userEnvironment: ''
    }
  },
  created () {
    this.userEnvironment = this.getUserAgent()
  },
  mounted () {
    this.form.setFieldsValue({
      loginName: Vue.ls.get('userName'),
      password: '1234567',
      verificationCode: 'a'
    })
  },
  methods: {
    ...mapActions(['Login', 'getCompany', 'getMeterPointerTree', 'setCompany']),
    refreshCode () {
      this.vertImg = this.vertImg + '?timestamp=' + new Date().getTime()
    },
    getUserAgent () {
      let UA = require('ua-device')
      let user = new UA(navigator.userAgent)
      this.userEnvironment = 'terminal:' + user.device.type + ',operatingSystemVersion:' + user.os.version.original + ',operatingSystem:' + user.os.name + ' ,browser:' + user.browser.name + ',browserVersion:' + user.browser.version.original + ',phoneModel:' + user.device.model
    },
    checkUsernameOrEmail (rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleTabClick (key) {
      this.customActiveKey = key
    },
    loginRequest (e) {
      e.preventDefault()
      const { state, customActiveKey, Login, form: { validateFields } } = this // 调用state等同this.state
      const validateFieldsKey = customActiveKey === 'tab1' ? ['loginName', 'password', 'verificationCode'] : ['mobile', 'captcha']
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          state.loginBtn = true
          state.loginBtnText = '登录中...'
          const loginParams = { ...values }
          loginParams.password = md5(values.loginName + values.password)
          loginParams.loginEnvironment = this.userEnvironment
          Login(loginParams, values.loginName)
            .then((res) => this.loginSuccess(res, values.loginName))
            .catch(err => this.loginFailed(err))
            .finally(() => {})
        }
      })
    },
    loginSuccess (res, userName) {
      // 暂时保存用户名在前台，后续换成接口
      console.log('loginSuccess', res)
      Vue.ls.set('userName', userName)
      // 查询用户企业和监测点
      this.$router.push({ name: 'entry' }).catch(() => {})
    },
    loginFailed (res) {
      console.log('loginFailed', res)
      // console.log('loginFailed', err)
      this.state.loginBtn = false
      this.state.loginBtnText = '登录'
      this.vertImg = this.vertImg + '?timestamp=' + new Date().getTime()
    },
    getCaptcha (e) {
      e.preventDefault()
      console.log('获取验证码')
    }
  }
}
</script>

<style lang="stylus">
    .user-layout-login
      padding 0 48px
      .ant-tabs-bar
        margin: 0 0 30px 0;
      .ant-btn-primary
        padding 0 15px
        font-size 16px
        height 40px
        width 100%
        background-color #eb5f25
        border-color #eb5f25
        &:hover,&:focus
          color #fff
          background-color #ef7c4d
          border-color #ef7c4d
      .ant-tabs-ink-bar
        background-color #eb5f25
      .ant-tabs-nav
        .ant-tabs-tab
          color rgba(0,0,0, .6)
          &:hover
            color #000
        .ant-tabs-tab-active
          color #000
      label
          font-size 14px
      .getCaptcha
          display block
          width 100%
          height 40px
      .forge-password
          font-size 14px
      .user-login-other
          text-align: left;
          margin-top: 24px;
          line-height: 22px;
          .item-icon
              font-size: 24px;
              color: rgba(255, 255, 255, 0.4);
              margin-left: 16px;
              vertical-align: middle;
              cursor: pointer;
              transition: color 0.3s;
              &:hover
                  color: #fff;
          .register
              float right
              color #fff
    .verificationCode
      width 100%
      height 40px
      cursor pointer
</style>
