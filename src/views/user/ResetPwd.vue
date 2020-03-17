<template>
  <div>
    <a-card style="margin-top:10px" title="修改密码" :bordered="false">
      <a-form @submit="handleSubmit" :form="form">
        <a-form-item
            label="新密码"
            v-bind="formItemLayout">
            <a-input
            v-decorator="[
                'newpassword',
                {rules: [{ required: true, message: '新密码不能为空' }, {validator: validateToNextPassword}]}
            ]"
            type="password"
            placeholder="请输入新密码" />
        </a-form-item>
        <a-form-item
            label="确认新密码"
            v-bind="formItemLayout">
            <a-input
            v-decorator="[
                'confirmNewpassword',
                {rules: [{ required: true, message: '确认密码不能为空！' }, { validator: compareToFirstPassword}]}
            ]"
            type="password"
            @blur="handleConfirmBlur"
            placeholder="请确认新密码" />
        </a-form-item>
        <a-form-item
            :wrapperCol="{ span: 20 }"
            style="text-align: center"
        >
            <a-button htmlType="submit" style="width:150px" type="primary">确定</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
<script>
import Vue from 'vue'
import md5 from 'md5'
import { login } from '@/api'

export default {
  name: 'ResetPwd',
  data () {
    return {
      confirmDirty: false,
      formItemLayout: {
        labelCol: { lg: { span: 7 }, sm: { span: 7 } },
        wrapperCol: { lg: { span: 8 }, sm: { span: 15 } }
      },
      form: this.$form.createForm(this)
    }
  },
  methods: {
    handleSubmit  (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          let p = md5(Vue.ls.get('userName') + values.newpassword)
          login.resetPassword({ newPassword: p })
            .then((res) => {
              if (res.header.status === 'SUCCESS') {
                this.$router.push({ name: 'resetPwdSuccess' }).catch(() => {})
              }
            })
            .catch((err) => {
              console.log(err)
            })
        }
      })
    },
    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    compareToFirstPassword (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('newpassword')) {
        // eslint-disable-next-line
        callback('确认密码与新密码不一致！')
      } else {
        callback()
      }
    },
    validateToNextPassword (rule, value, callback) {
      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['confirmNewpassword'], { force: true })
      }
      callback()
    }
  }
}
</script>
