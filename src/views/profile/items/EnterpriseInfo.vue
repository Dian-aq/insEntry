<template>
    <a-card :class="layout" :title="title" style="margin-top:10px;" :bodyStyle="{height: cardBodyHeight+'px',overflow: 'auto'}">
        <div v-if="editMode" slot="extra" class="edit-block">
          <layout-tool-bar :item="item" @edit="onEditClick" @del="onDeleteClick"/>
        </div>
        <div class="flex">
          <!-- <a-carousel v-if="img.length>0" :afterChange="onChange" style="width:300px;height:244px">
            <div class="carousel" v-for="item in img" :key="item"><img class="album" :src="item" alt=""></div>
          </a-carousel> -->
          <a-upload
              name="file"
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              :action="upload_serv"
              :beforeUpload="beforeUpload"
              :headers="uploadHeaders"
              @change="handleChange"
            >
              <a-tooltip placement="top">
              <template slot="title">
                点击上传企业照片
              </template>
              <img v-if="previewImg" class="preview-img" :src="previewImg" alt="企业照片" />
              <div v-else>
                <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传照片</div>
              </div>
              </a-tooltip>
            </a-upload>
          <div>
            <h4 style="letter-spacing: 1px">{{eName}}</h4>
            <p>{{address}}</p>
          </div>
        </div>
        <div class="flex">
          <field-item class="item" title="变压器数量" :value="transformers" unit="个" :center="false" :bordered="false" />
          <field-item class="item" title="变压器总容量" :value="totalCapacity" unit="kVA" :center="false" :bordered="false" />
          <field-item class="item" title="仪表数量" :value="meters" unit="个" :center="false" :bordered="false" />
        </div>
    </a-card>
</template>
<script>
import API from '@/api/base'
import { profile, monitor } from '@/api'
import { itemMixin } from '../itemMixin'
import LayoutToolBar from '../LayoutToolBar'
import FieldItem from '@/components/tools/FieldItem'
import '../items.styl'
import { mapGetters } from 'vuex'

function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  name: 'EnterpriseInfo',
  components: {
    FieldItem,
    LayoutToolBar
  },
  mixins: [itemMixin],
  props: {},
  data () {
    return {
      eName: '企业名称',
      address: '企业地址',
      img: [],
      transformers: -999999,
      totalCapacity: -999999,
      meters: -999999,
      uploadLoading: false,
      previewImg: '',
      uploadToken: '',
      upload_serv: API.UPLOAD + '?entityName=cn.inspower.dto.CustomerDTO.imgPath',
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
    init () {
      profile.getEnterpriseInfo({ id: this.customerId })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            console.log('getEnterpriseInfo', res.body)
            this.eName = res.body.name
            this.address = res.body.contactAddress
            this.totalCapacity = res.body.totalCapacity
            this.transformers = res.body.transformers
            this.previewImg = res.body.img[0]
            this.meters = res.body.meters
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    onChange (a, b, c) {
      console.log(a, b, c)
    },
    uploadPhoto () {
      profile.saveEnterprisePhoto({ customerId: this.customerId, attId: this.attId })
        .then((res) => {
          if (res.header.status === 'SUCCESS') {
            console.log('saveEnterprisePhoto', res.body)
            this.uploadLoading = false
            this.init()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done') {
        getBase64(info.file.originFileObj, imageUrl => {
          this.previewImg = imageUrl
          this.attId = info.file.response.id
          this.uploadPhoto()
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
  },
  created () {}
}
</script>
<style lang="stylus" scoped>
  .preview-img
    width: 100%;
    height: 100%;
  .avatar-uploader >>> .ant-upload
    width 200px
    height 160px
    padding 0
    margin-bottom 0
  .carousel
    width 200px
    height 160px
    .album
      // width auto
      // height auto
      width 100%
      height 100%
      max-width 100%
      max-height 100%
  .ant-carousel >>> .slick-slide
    text-align center
    height 160px
    line-height 160px
    background #364d79
    overflow hidden

  .ant-carousel >>> .slick-slide h3
    color: #fff
  .flex
    display flex
    justify-content flex-start
    align-items normal
    &:first-child
      margin-bottom 10px
    h4
      font-size 20px
      font-weight 600
  .f-1
    flex 1
  .item
    background-color #eee;
    padding 10px 20px
    margin-right 10px
  // @media (max-width: 1440px)
  //   .avatar-uploader >>> .ant-upload
  //     width 250px
  //     height 225px
  //   .flex
  //     align-items flex-start
  //     flex-wrap wrap
  //   .pad-20
  //     padding-left 5px
  //   .item
  //     margin-right 10px
  //     margin-bottom 10px
  //     padding: 5px 10px;
</style>
