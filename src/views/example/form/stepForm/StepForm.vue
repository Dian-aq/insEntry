<template>
    <div>
        <page-view>
            <h2>分步表单</h2>
            <div style="color: rgba(0, 0, 0, 0.65);margin-bottom:15px">将一个冗长或用户不熟悉的表单任务分成多个步骤，指导用户完成。</div>
        </page-view>
        <a-card style="margin-top:10px" :bordered="false">
          <a-steps class="steps" :current="currentStep">
            <a-step title="填写转账信息" />
            <a-step title="确认转账信息" />
            <a-step title="完成" />
          </a-steps>
          <div class="content">
            <step1 v-if="currentStep === 0" @nextStep="nextStep"/>
            <step2 v-if="currentStep === 1" @nextStep="nextStep" @prevStep="prevStep"/>
            <step3 v-if="currentStep === 2" @prevStep="prevStep" @finish="finish"/>
          </div>
        </a-card>
    </div>
</template>
<script>
import PageView from '@/layouts/PageView'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

export default {
  name: 'StepForm',
  components: {
    PageView,
    Step1,
    Step2,
    Step3
  },
  data () {
    return {
      currentStep: 0
    }
  },
  methods: {
    // handler
    nextStep () {
      if (this.currentStep < 2) {
        this.currentStep += 1
      }
    },
    prevStep () {
      if (this.currentStep > 0) {
        this.currentStep -= 1
      }
    },
    finish () {
      this.currentStep = 0
    }
  }
}
</script>
<style lang="stylus">
  .steps
    max-width 750px
    margin 16px auto
</style>
