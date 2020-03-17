<template>
    <div style=" padding: 20px;" >
      <a-row :gutter="16">
        <a-col class="gutter-row" :span="7">
          <div class="gutter-box">
            <a-card>

              <div style="margin: 20px">
                <a-row>
                  <a-col span="18">

                    <span style="font-size: 24px;color: black">广东环境保护工程职业学院</span>
                    <div style="margin-top: 10px">

                    <span style="font-size: 14px;color: black">韦老师</span>
                      &nbsp; &nbsp;
                    <span style="font-size: 14px;color: black">13755555555</span>
                    </div>
                    <div style="margin-top: 15px">
                      <span style="font-size: 15px;">广东佛山市南海区瀚天科技城</span>
                    </div>
                    <div style="margin-top: 15px">
                      <a-tag>配电运维</a-tag><a-tag>数据监测</a-tag>
                    </div>


                  </a-col>
                  <a-col span="6">

                    <a-upload
                    name="avatar"
                    listType="picture-card"
                    class="avatar-uploader"
                    :showUploadList="false"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    :beforeUpload="beforeUpload"
                    @change="handleChange"
                  >
                    <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                    <div v-else>
                      <a-icon :type="loading ? 'loading' : 'plus'" />
                      <div class="ant-upload-text">Upload</div>
                    </div>
                  </a-upload></a-col>
                </a-row>

              </div>
              <div style="margin-top: 30px;display: flex;justify-content: space-around">
                <div style="position: relative; text-align: center;" v-for="item in leftdata" :key="item.id">
                  <span style="color: rgb(0,157,217);font-size: 40px">{{item.num}}</span>
                  <br/>
                  <span style="color: black">{{item.str}}</span>
                </div>
               <!-- <a-row>
                  <a-col span="6">
                    <div style="position: relative; text-align: center;" v-for="item in leftdata" :key="item.id">
                      <span style="color: rgb(0,157,217);font-size: 40px">{{item.num}}</span>
                      <br/>
                      <span style="color: black">{{item.str}}</span>
                    </div>
                  </a-col>
                  <a-col span="6">
                    <div style="position: relative; text-align: center;">
                      <span style="color: rgb(0,157,217);font-size: 40px">2</span>
                      <br/>
                      <span style="color: black">变压器</span>
                    </div>
                  </a-col>
                  <a-col span="6">
                    <div style="position: relative; text-align: center;">
                      <span style="color: rgb(0,157,217);font-size: 40px">2</span>
                      <br/>
                      <span style="color: black">检测仪表</span>
                    </div>
                  </a-col>
                  <a-col span="6">
                    <div style="position: relative; text-align: center;">
                      <span style="color: red;font-size: 40px">2</span>
                      <br/>
                      <span style="color: black">离线仪表</span>
                    </div>
                  </a-col>
                </a-row>-->
              </div>
              <div style="margin: 50px 20px 20px 20px">
                <p>客户位置</p>
                <div style="width: 100%;height: 400px;background-color: rgb(156,156,156);"></div>
              </div>
            </a-card>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="12">
            <a-card title="关键指标" >
              <div class="indexmsgside">
              <div  style="position: relative; text-align: center; background-color: rgb(1,200,83);height: 80px;width: 110px" v-for="item in prameterKey" :key="item.id">
                <span style="color: #eeeeee;font-size: 25px;">{{item.num1}}%</span>
                <br/>
                <span style="color: #eeeeee;font-size: 10px;">标准>{{item.num2}}%</span>
                <p style="border: 1px solid black;background-color: white;padding: 3px;margin-top: 4px">
                  {{item.str}}
                </p>
              </div>
               <!-- <div class="indexmsg" style="position: relative; text-align: center; background-color: rgb(255,119,71);">
                  <span style="color: #eeeeee;font-size: 25px;">98%</span>
                  <br/>
                  <span style="color: #eeeeee;font-size: 10px;">标准>98%</span>
                  <p style="border: 1px solid black;background-color: white;padding: 3px;margin-top: 4px">
                    仪表在线率
                  </p>

                </div><div class="indexmsg" style="position: relative; text-align: center; background-color: rgb(255,0,0);">
                <span style="color: #eeeeee;font-size: 25px;">98%</span>
                <br/>
                <span style="color: #eeeeee;font-size: 10px;">标准>98%</span>
                <p style="border: 1px solid black;background-color: white;padding: 3px;margin-top: 4px">
                  仪表在线率
                </p>

              </div><div class="indexmsg" style="position: relative; text-align: center; background-color: rgb(1,200,83);">
                <span style="color: #eeeeee;font-size: 25px;">98%</span>
                <br/>
                <span style="color: #eeeeee;font-size: 10px;">标准>98%</span>
                <p style="border: 1px solid black;background-color: white;padding: 3px;margin-top: 4px">
                  仪表在线率
                </p>

              </div><div class="indexmsg" style="position: relative; text-align: center; background-color: rgb(1,200,83);">
                <span style="color: #eeeeee;font-size: 25px;">98%</span>
                <br/>
                <span style="color: #eeeeee;font-size: 10px;">标准>98%</span>
                <p style="border: 1px solid black;background-color: white;padding: 3px;margin-top: 4px">
                  仪表在线率
                </p>

              </div>-->
              </div>
            </a-card>
          <div style="margin-top: 15px">
          <a-card title="监控数据" >
            <a-row :gutter="16">
              <a-col span="12">
                <a-card title="500KVA总进线" >
                  <p>
                    <a-row>
                      <a-col span="12">
                        <div style="position: relative; text-align: center;">
                          <span class="eledatacss">289</span><span> kw</span> <p>实时总有功功率</p>
                        </div>
                        <div style="margin-top: 15px;position: relative; text-align: center;">
                          <span class="eledatacss">289</span><span> kw</span> <p>实时总有功功率</p>
                        </div>
                      </a-col>
                      <a-col span="12">
                        <div style="position: relative; text-align: center;">
                          <span class="eledatacss">289</span><span> kw</span> <p>实时总有功功率</p>
                        </div>
                        <div style="margin-top: 15px;position: relative; text-align: center;">
                          <span class="eledatacss">289</span><span> kw</span> <p>实时总有功功率</p>
                        </div>

                      </a-col>

                    </a-row>



                  </p>
                </a-card>
              </a-col>
              <a-col span="12">
                <a-card title="500KVA总进线" >
                  <p>
                    <a-row>
                      <a-col span="12">
                        <div style="position: relative; text-align: center;">
                          <span class="eledatacss">289</span><span> kw</span> <p>实时总有功功率</p>
    </div>
  <div style="margin-top: 15px;position: relative; text-align: center;">
    <span class="eledatacss">289</span><span> kw</span> <p>实时总有功功率</p>
  </div>
  </a-col>
  <a-col span="12">
    <div style="position: relative; text-align: center;">
      <span class="eledatacss">289</span><span> kw</span> <p>实时总有功功率</p>
    </div>
    <div style="margin-top: 15px;position: relative; text-align: center;">
      <span class="eledatacss">289</span><span> kw</span> <p>实时总有功功率</p>
    </div>

  </a-col>

  </a-row>



  </p>
  </a-card>
              </a-col>
            </a-row>




          </a-card>
          </div>
          <div style="margin-top: 15px">
            <a-card
              style="width:100%"
              :tabList="tabListNoTitle2"
              :activeTabKey="noTitleKey2"
              @tabChange="key => onTabChange2(key, 'noTitleKey2')"
            >
              <div v-if="noTitleKey2 === 'article'">

                <a-steps progressDot :current="1" status="error">
                  <a-step title="合同签署" description="2020/1/1" />
                  <a-step title="交接派工" description="2020/1/1" />
                  <a-step title="现场交接" description="2020/1/1" />
                  <a-step title="日常巡视" description="2020/1/1" />
                </a-steps>
                <div style="margin: 20px 10px 0px 10px" class="dian1">
                  <a-badge :count="item.num" style="margin:5px 0px" v-for="(item) in appList" :key="item.id">
                    <a :href="item.href" target="_blank">
                      <img src="../../assets/entry/u21.png" class="appImgCss2">
                    </a>
                    <span style="margin-top: 10px;display: flex;justify-content:center;">{{item.name}}</span>
                  </a-badge>
                </div>

              </div>
              <div v-else>
                无
              </div>
            </a-card>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="5">
            <a-card
              style="width:100%"
              :tabList="tabListNoTitle"
              :activeTabKey="noTitleKey"
              @tabChange="key => onTabChange(key, 'noTitleKey')"
            >
              <p v-if="noTitleKey === 'article'">
                <a-timeline >
                  <a-timeline-item color="green" v-for="item in ServiceHistory" :key="item.id">{{item.msg}}<span style="float: right;color: rgba(0, 0, 0, 0.45)">{{item.data}}</span></a-timeline-item>
                </a-timeline>
              </p>
            </a-card>
            <a-card
              style="width:100%"
              :tabList="tabListNoTitle1"
              :activeTabKey="noTitleKey1"
              @tabChange="key => onTabChange1(key, 'noTitleKey1')"
            >
              <p v-if="noTitleKey1 === 'article'">
                <a-list itemLayout="horizontal" :dataSource="data">
                  <a-list-item slot="renderItem" slot-scope="item, index">
                    <a-list-item-meta >//:description="item.data"
                      <template slot="title" >
                        <!--<a-badge status="error" />-->
                        <a-badge dot style="margin-right: 10px">
                          <a-icon type="notification" />
                        </a-badge>
                        <span>{{item.text}}</span>
                        <span style="float: right;color: rgba(0, 0, 0, 0.45)">{{item.data}}</span>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </a-list>
              </p>
              <p v-else-if="noTitleKey1 === 'app'">
                无
              </p>
            </a-card>
        </a-col>
      </a-row>
    </div>
</template>
<script>
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
export default {
  name: "Unit",
  data(){
    return{
      leftdata:[
        {id:'1',num:'2',str:'合同'},
        {id:'1',num:'2',str:'变压器'},
        {id:'1',num:'2',str:'检测仪表'},
        {id:'1',num:'2',str:'离线仪表'},
      ],
      prameterKey:[
        {id:'1',num1:'98',num2:'98',str:'仪表在线率'},
        {id:'1',num1:'98',num2:'98',str:'仪表在线率'},
        {id:'1',num1:'98',num2:'98',str:'仪表在线率'},
        {id:'1',num1:'98',num2:'98',str:'仪表在线率'},
        {id:'1',num1:'98',num2:'98',str:'仪表在线率'},
        {id:'1',num1:'98',num2:'98',str:'仪表在线率'},

      ],
      appList:[
        {
          id:'1',
          num:1,
          src:'../../assets/entry/u21.png',
          href:' https://www.baidu.com',
          name:'运维系统'
        },
        {
          id:'1',
          num:1,
          src:'../../assets/entry/u21.png',
          href:' https://www.baidu.com',
          name:'运维系统'
        },
        {
          id:'1',
          num:1,
          src:'../../assets/entry/u21.png',
          href:' https://www.baidu.com',
          name:'运维系统'
        },
        {
          id:'1',
          num:1,
          src:'../../assets/entry/u21.png',
          href:' https://www.baidu.com',
          name:'运维系统'
        },
        {
          id:'1',
          num:1,
          src:'../../assets/entry/u21.png',
          href:' https://www.baidu.com',
          name:'运维系统'
        },


      ],
      ServiceHistory:[
        {id:'1',msg:'平洲单元/A小组完成日常巡检工作，没有发现问题。',data:'2020/1/1'},
        {id:'2',msg:'平洲单元/A小组完成日常巡检工作，没有发现问题。',data:'2020/1/1'},
      ],
      data:[
        {
          text: '关于疫情防控...，落实基本电费减免优化的措施...',
          data:'2020/1/1'
        },
        {
          text: '关于疫情防控...，落实基本电费减免优化的措施...',
          data:'2020/1/1'
        },
        {
          text: '关于疫情防控...，落实企业预防性新型病毒 基本电费减免优化的措施...',
          data:'2020/1/1'
        },
      ],
      loading: false,
      imageUrl: '',

      tabListNoTitle: [
        {
          key: 'article',
          tab: '服务历史',
        }
      ],
      tabListNoTitle1: [
        {
          key: 'article',
          tab: '预警',
        },
        {
          key: 'app',
          tab: '通知',
        }
      ],
      tabListNoTitle2: [
        {
          key: 'article',
          tab: '运维业务',
        },
        {
          key: 'sy',
          tab: '实验业务',
        },
        {
          key: 'jc',
          tab: '检测业务',
        },
        {
          key: 'other',
          tab: '其他',
        },
      ],
      noTitleKey: 'article',
      noTitleKey1: 'article',
      noTitleKey2: 'article',
    }
  },
  methods:{
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl;
          this.loading = false;
        });
      }
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        this.$message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!');
      }
      return isJPG && isLt2M;
    },
    onTabChange(key, type) {
      console.log(key, type);
      this[type] = key;
    },
    onTabChange1(key, type) {
      console.log(key, type);
      this[type] = key;
    },
    onTabChange2(key, type) {
      console.log(key, type);
      this[type] = key;
    },
  }
}
</script>

<style lang="stylus" scoped>
  .dian1{
    display flex
    justify-content space-around
    align-items center
    flex-wrap wrap
  }

  .eledatacss{
    color: rgb(82,196,26);
    font-size: 20px;
  }
  .indexmsgside{
    display: flex;
    justify-content: space-around;
    align-items center
    flex-wrap wrap
    margin: 0 40px;
  }
  .indexmsg{
    height: 80px;
    width: 100px;
  }
</style>
