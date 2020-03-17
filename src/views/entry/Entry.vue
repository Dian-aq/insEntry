<template>
    <div>
      <div style=" padding: 15px;">
        <a-row :gutter="13">
          <a-col :span="19" >
            <a-row :gutter="15">
              <a-col :span="12">
                <div>
                  <a-card  :bordered="false" >
                    <template slot="title">
                      <span style="color: #2D64B3">
                      <a-icon type="desktop" /> 业务应用
                      </span>
                    </template>
                    <a-badge :count="item.num" style="margin:10px 33px" v-for="(item) in appList" :key="item.id">
                      <a :href="item.href" target="_blank">
                        <img src="../../assets/entry/u21.png" class="appImgCss">
                      </a>
                      <span style="margin-top: 10px;display: flex;justify-content:center;">{{item.name}}</span>
                    </a-badge>
                </a-card>
                </div>
                <div  style=" padding-top: 15px">
                <a-card  :bordered="false">
                  <template slot="title" >
                    <span style="color: #2D64B3">
                    <a-icon type="desktop" /> 运营支持
                    </span>
                  </template>
                  <a-badge :count="item.num" style="margin:10px 33px" v-for="(item) in appList" :key="item.id">
                    <a :href="item.href" target="_blank">
                      <img src="../../assets/entry/u21.png" class="appImgCss">
                    </a>
                    <span style="margin-top: 10px;display: flex;justify-content:center;">{{item.name}}</span>
                  </a-badge>
                </a-card>
                </div>
              </a-col>

              <a-col :span="12" >
                <div>
                <a-card  :bordered="false">
                  <template slot="title">
                    <span style="color: #2D64B3">
                    <a-icon type="desktop" /> 内部管理
                    </span>
                  </template>
                  <a-badge :count="item.num" style="margin:10px 33px" v-for="(item) in appList" :key="item.id">
                    <a :href="item.href" target="_blank">
                      <img src="../../assets/entry/u21.png" class="appImgCss">
                    </a>
                    <span style="margin-top: 10px;display: flex;justify-content:center;">{{item.name}}</span>
                  </a-badge>
                </a-card>
                </div>
                <div style=" padding-top: 15px">
                <a-card  :bordered="false">
                  <template slot="title">
                    <span style="color: #2D64B3">
                    <a-icon type="desktop" /> 鹰熊联盟
                    </span>
                  </template>
                  <a-badge :count="item.num" style="margin:10px 33px" v-for="(item) in appList" :key="item.id">
                    <a :href="item.href" target="_blank">
                      <img src="../../assets/entry/u21.png" class="appImgCss">
                    </a>
                    <span style="margin-top: 10px;display: flex;justify-content:center;">{{item.name}}</span>
                  </a-badge>
                </a-card>
                </div>
              </a-col>
            </a-row>
          </a-col>

          <a-col :span="5" >
            <a-card
              :tabList="tabListNoTitle"
              :activeTabKey="noTitleKey"
              @tabChange="key => onTabChange(key, 'noTitleKey')"
            >
              <p v-if="noTitleKey === 'article'">
                <a-list itemLayout="horizontal" :dataSource="data">
                  <a-list-item slot="renderItem" slot-scope="item, index">
                    <a-list-item-meta >//:description="item.data"
              <template slot="title" >
                <a-tag color="#f50">置顶</a-tag><span>{{item.text}}</span>
                <span style="float: right;color: rgba(0, 0, 0, 0.45)">{{item.data}}</span>
                </template>
                    </a-list-item-meta>
                  </a-list-item>
                </a-list>
              </p>
              <p v-else-if="noTitleKey === 'app'">app content</p>
              <p v-else="noTitleKey === 'project'">project content</p>
            </a-card>
            <img src="../../assets/entry/1_增购服务.png" style="width:100%" />
            <a-card
              style="width:100%"
              :tabList="tabListNoTitle1"
              :activeTabKey="noTitleKey1"
              @tabChange="key => onTabChange1(key, 'noTitleKey1')"
            >
              <!--<a-badge count="5" style="margin:10px 15px" >
                <a-avatar shape="square" :size="70" src="../../assets/entry/u21.png"  />
                <p style="margin-top: 10px;display: flex;justify-content:center;">系统</p>
              </a-badge>-->
              <div class="card-group">
              <a-badge :count="item.num" style="margin:5px 11px" v-for="(item) in appList" :key="item.id">
                <a :href="item.href" target="_blank">
                  <img src="../../assets/entry/u21.png" class="appImgCss2">
                </a>
                <span style="margin-top: 10px;display: flex;justify-content:center;">{{item.name}}</span>
              </a-badge>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </div>
</template>
<script>
export default {
  data(){
    return{
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
      tabListNoTitle: [
        {
          key: 'article',
          tab: '所有',
        },
        {
          key: 'app',
          tab: '发文',
        },
        {
          key: 'project',
          tab: '通知',
        },
      ],
      tabListNoTitle1: [
        {
          key: 'article',
          tab: '即将推出'
        }
      ],

      noTitleKey: 'article',
      noTitleKey1: 'article',
    }
  },
  methods:{
    onTabChange(key, type) {
      console.log(key, type);
      this[type] = key;
    },
    onTabChange1(key, type) {
      console.log(key, type);
      this[type] = key;
    },

  }

}
</script>
<style lang="stylus" scoped>
  .appImgCss{
    width: 70px;
    height: 70px;
    border-radius: 4px;
  }
  .appImgCss2{
    width: 60px;
    height: 60px;
    border-radius: 4px;
  }
  .card-group
    display flex
    justify-content flex-start
    align-items center
    flex-wrap wrap


</style>
