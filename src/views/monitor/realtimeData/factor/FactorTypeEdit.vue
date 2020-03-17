<template>
    <a-drawer
          title="配置分类"
          placement="right"
          width="420"
          @close="onDrawerClose"
          :visible="groupSettingShow"
        >
        <a-form layout="vertical">
            <a-form-item
              label="显示名称"
            >
              <a-input
                v-model="group.name"
                placeholder="可填" />
            </a-form-item>
          </a-form>
          <a-form layout="vertical">
            <a-form-item
              label="上传图片"
            >
              <a-upload
                name="file"
                accept="image/*"
                listType="picture-card"
                class="avatar-uploader"
                :showUploadList="false"
                :headers="uploadHeaders"
                :action="upload_serv"
                :beforeUpload="beforeUpload"
                @change="handleChange"
              >
                  <img v-if="group.imageUrl" :src="group.imageUrl" alt="avatar" class="preview-img"/>
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">上传图片</div>
                  </div>
              </a-upload>
            </a-form-item>
          </a-form>
          <div
          :style="{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }">
            <a-button @click="onSave" type="primary" :loading="formLoading">保存</a-button>
        </div>
    </a-drawer>
</template>
<script>
import API from '@/api/base'
import { monitor } from '@/api'
import { mapGetters } from 'vuex'

const defaultGroup = {
  id: 'newId',
  name: '',
  imageUrl: ''
}

function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  name: 'FactorTypeEdit',
  props: {
    groupSettingShow: {
      type: Boolean,
      required: false,
      default: false
    },
    groupItem: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      uploadToken: '',
      upload_serv: API.UPLOAD + '?entityName=cn.inspower.data.domain.CustDataGroupCfg.picUrl',
      loading: false,
      formLoading: false,
      editMode: false,
      group: defaultGroup,
      attId: ''
    }
  },
  computed: {
    ...mapGetters([
      'customerId'
    ]),
    uploadHeaders () {
      return { 'accessToken': this.uploadToken }
    }
  },
  methods: {
    newGroup () {
      this.formLoading = false
      this.editMode = false
      this.group = {
        id: 'newId',
        name: '',
        imageUrl: ''
      }
    },
    editGroup (obj) {
      this.editMode = true
      this.formLoading = false
      this.group = obj
    },
    onDrawerClose () {
      this.$emit('done', false)
    },
    onSave () {
      let formData = {
        customerId: this.customerId,
        id: this.group.id,
        pointDisplayName: this.group.name,
        funType: 1,
        attId: this.attId
      }
      this.formLoading = true
      if (this.editMode) {
        monitor.updateFactorGroup(formData)
          .then((res) => {
            if (res.header.status === 'SUCCESS') {
              this.$message.info('保存成功')
              this.formLoading = false
              this.$emit('done', false)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        monitor.saveFactorGroup(formData)
          .then((res) => {
            if (res.header.status === 'SUCCESS') {
              this.$message.info('保存成功')
              this.formLoading = false
              this.$emit('done', false)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        getBase64(info.file.originFileObj, imageUrl => {
          this.group.imageUrl = imageUrl
          this.attId = info.file.response.id
          this.loading = false
        })
      }
    },
    beforeUpload (file) {
      return new Promise((resolve, reject) => {
        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        if (!isJPG && !isPNG) {
          this.$message.error('图片必须jpg或png格式!')
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('图片大小不要超过 2MB!')
        }
        // 获取uploadToken
        monitor.getFileUploadToken()
          .then((res) => {
            if (res.header.status === 'SUCCESS') {
              this.uploadToken = res.body.accessToken
              // eslint-disable-next-line
              if (isJPG || isPNG && isLt2M) {
                resolve(res)
              } else {
                reject(res)
              }
            }
          })
          .catch((err) => {
            console.log(err)
          })
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  .preview-img
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  .avatar-uploader >>> .ant-upload
    width 370px
    height 300px
  .ant-upload-select-picture-card i
    font-size 32px
    color #999
  .ant-upload-select-picture-card .ant-upload-text
    margin-top 8px
    color #666
</style>
