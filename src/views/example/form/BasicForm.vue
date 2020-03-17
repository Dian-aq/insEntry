<template>
    <div>
        <page-view>
            <h2>基础表单</h2>
            <div style="color: rgba(0, 0, 0, 0.65);margin-bottom:15px">表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。</div>
        </page-view>
        <a-card style="margin-top:10px" :bordered="false">
            <a-form @submit="handleSubmit" :form="form">
                <a-form-item
                    label="Select"
                    v-bind="formItemLayout"
                    has-feedback
                    >
                    <a-select
                        v-decorator="[
                        'select',
                        {rules: [{ required: true, message: 'Please select your country!' }]}
                        ]"
                        placeholder="Please select a country"
                    >
                        <a-select-option value="china">
                        China
                        </a-select-option>
                        <a-select-option value="usa">
                        U.S.A
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    v-bind="formItemLayout"
                    label="Select[multiple]"
                    >
                    <a-select
                        v-decorator="[
                        'select-multiple', {
                            rules: [{ required: true, message: 'Please select your favourite colors!', type: 'array' }],
                        }]"
                        mode="multiple"
                        placeholder="选择喜欢颜色"
                    >
                        <a-select-option value="red">
                        红色
                        </a-select-option>
                        <a-select-option value="green">
                        绿色
                        </a-select-option>
                        <a-select-option value="blue">
                        蓝色
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    label="标题"
                    v-bind="formItemLayout">
                    <a-input
                    v-decorator="[
                        'name',
                        {rules: [{ required: true, message: '请输入标题' }]}
                    ]"
                    name="name"
                    placeholder="给目标起个名字" />
                </a-form-item>
                <a-form-item
                    label="起止日期"
                    v-bind="formItemLayout">
                    <a-range-picker
                    name="buildTime"
                    style="width: 100%"
                    v-decorator="[
                        'buildTime',
                        {rules: [{ required: true, message: '请选择起止日期' }]}
                    ]" />
                </a-form-item>
                <a-form-item
                    label="目标描述"
                    v-bind="formItemLayout">
                    <a-textarea
                    rows="4"
                    placeholder="请输入你阶段性工作目标"
                    v-decorator="[
                        'description',
                        {rules: [{ required: true, message: '请输入目标描述' }]}
                    ]" />
                </a-form-item>
                <a-form-item
                    v-bind="formItemLayout"
                    label="Phone Number"
                    >
                    <a-input
                        v-decorator="[
                        'phone',
                        {
                            rules: [{ required: true, message: 'Please input your phone number!' }],
                        }
                        ]"
                        style="width: 100%"
                    >
                        <a-select
                        slot="addonBefore"
                        v-decorator="[
                            'prefix',
                            { initialValue: '86' }
                        ]"
                        style="width: 70px"
                        >
                        <a-select-option value="86">
                            +86
                        </a-select-option>
                        <a-select-option value="87">
                            +87
                        </a-select-option>
                        </a-select>
                    </a-input>
                </a-form-item>
                <a-form-item
                    label="Switch"
                    v-bind="formItemLayout"
                >
                <a-switch v-decorator="['switch', { valuePropName: 'checked' }]" />
                </a-form-item>

                <a-form-item
                    label="Slider"
                    v-bind="formItemLayout"
                    >
                    <a-slider
                        v-decorator="['slider']"
                        :marks="{ 0: 'A', 20: 'B', 40: 'C', 60: 'D', 80: 'E', 100: 'F' }"
                    />
                </a-form-item>

                <a-form-item
                    label="权重"
                    v-bind="formItemLayout"
                    :required="false"
                >
                    <a-input-number :min="0" :max="100" />
                    <span> %</span>
                </a-form-item>
                <a-form-item
                    v-bind="formItemLayout"
                    label="Radio.Group"
                    >
                    <a-radio-group v-decorator="['radio-group']">
                        <a-radio value="a">
                        item 1
                        </a-radio>
                        <a-radio value="b">
                        item 2
                        </a-radio>
                        <a-radio value="c">
                        item 3
                        </a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    v-bind="formItemLayout"
                    label="Radio.Button"
                    >
                    <a-radio-group v-decorator="['radio-button']">
                        <a-radio-button value="a">
                        item 1
                        </a-radio-button>
                        <a-radio-button value="b">
                        item 2
                        </a-radio-button>
                        <a-radio-button value="c">
                        item 3
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>

                <a-form-item
                    v-bind="formItemLayout"
                    label="Checkbox.Group"
                    >
                    <a-checkbox-group
                        v-decorator="['checkbox-group', {initialValue: ['A', 'B']}]"
                        style="width: 100%;"
                    >
                        <a-row>
                        <a-col :span="8">
                            <a-checkbox value="A">
                            A
                            </a-checkbox>
                        </a-col>
                        <a-col :span="8">
                            <a-checkbox
                            disabled
                            value="B"
                            >
                            B
                            </a-checkbox>
                        </a-col>
                        <a-col :span="8">
                            <a-checkbox value="C">
                            C
                            </a-checkbox>
                        </a-col>
                        <a-col :span="8">
                            <a-checkbox value="D">
                            D
                            </a-checkbox>
                        </a-col>
                        <a-col :span="8">
                            <a-checkbox value="E">
                            E
                            </a-checkbox>
                        </a-col>
                        </a-row>
                    </a-checkbox-group>
                </a-form-item>

                <a-form-item
                    v-bind="formItemLayout"
                    label="Rate"
                    >
                    <a-rate
                        v-decorator="['rate', {initialValue: 3.5}]"
                        allow-half
                    />
                </a-form-item>

                <a-form-item
                    :wrapperCol="{ span: 24 }"
                    style="text-align: center"
                >
                    <a-button htmlType="submit" type="primary">提交</a-button>
                    <a-button style="margin-left: 8px">保存</a-button>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>
<script>
import PageView from '@/layouts/PageView'

export default {
  name: 'BaseForm',
  components: {
    PageView
  },
  data () {
    return {
      formItemLayout: {
        labelCol: { lg: { span: 7 }, sm: { span: 7 } },
        wrapperCol: { lg: { span: 10 }, sm: { span: 17 } }
      },
      form: this.$form.createForm(this)
    }
  },
  methods: {
    handleSubmit  (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    }
  }
}
</script>
