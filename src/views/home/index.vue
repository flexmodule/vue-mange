<template>
    <div class="home-container container">
        <div class="menu-list">
                <el-card v-for="item in menuList" :key="item.value">
                    <div class="clickItem" @click="jumpTo(item.route)">{{item.name}}</div>
                </el-card>
        </div>
    </div>
</template>
<style lang="scss">
.home-container {
  .menu-list {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .el-card {
      width: 30%;
      height: 150px;
      margin: 15px;
      font-size: 18px;
      font-weight: bold;
      .el-card__body{
          width: 100%;
          height: 100%;
      }
    }
    .clickItem{
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 108px;
        cursor: pointer;
    }
  }
  .title {
    padding: 0 30px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    background: #fff;
  }
}
</style>

<script>
import { getToken } from '@/utils/utils'
export default {
  name: "Home",
  data() {
    return {
      menuList: [
        {
          name: "基础数据",
          route: "/standard-data"
        },{
            name: "专业运营",
            route: "/standard-bussiness-data"
        },{
            name: "团检管理",
            route: "/group-check-manage"
        },{
            name: "专家管理",
            route: "/experts-manage"
        }
        ,{
            name: "一键康管理",
            route: ""
         },//{
            // name: "运营后台账号管理",
            // route: "/backaccount-mange/home"
        // },//{
         //    name: "消息推送",
          //   route: ""
        // },{
        //     name: "数据监测",
        //     route: ""
        // },{
        //     name: "公众号管理",
        //     route: ""
        // },{
        //     name: "客服",
        //     route: ""
        // },{
        //     name: "权限管理",
        //     route: ""
        // }
      ]
    };
  },
  methods: {
      jumpTo (link) {
          this.$router.push(link)
      }
  },
  mounted () {
      if (!getToken()) {
          this.$message.error('登录信息失效，请重新登录！')
          setTimeout(()=>{
              this.$router.push('/user/login')
          },1000)
      }
  }
};
</script>
