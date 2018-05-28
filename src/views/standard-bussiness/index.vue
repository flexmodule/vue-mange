<template>
  <div class="StandardData-container container">
    <div class="left-menu">
      <el-menu default-active="/standard-bussiness-data/person-check" router class="el-menu-vertical-list" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-submenu index="/standard-bussiness-data/person-check">
          <template slot="title">
            <span>体检预约管理</span>
          </template>
         <el-menu-item index="/standard-bussiness-data/person-check">
            <span slot="title">个检预约管理</span>
          </el-menu-item>
          <el-menu-item index="/standard-bussiness-data/group-check">
            <span slot="title">团检预约管理</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="/standard-data/check-manage">
          <template slot="title">
            <span>推荐套餐管理</span>
          </template>
          <el-menu-item index="/standard-bussiness-data/spe-ragion-manage">
            <span slot="title">专区管理</span>
          </el-menu-item>
          <el-menu-item index="/standard-bussiness-data/meal-recomend">
            <span slot="title">套餐推荐</span>
          </el-menu-item>
          <el-menu-item index="/standard-bussiness-data/meal-promot">
            <span slot="title">套餐促销</span>
          </el-menu-item>
          <el-menu-item index="/standard-bussiness-data/hot-label">
            <span slot="title">热门标签</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="/standard-bussiness-data/hot-city">
          <template slot="title">
            <span>热门</span>
          </template>
          <el-submenu index="/standard-bussiness-data/hos-hot">
            <template slot="title">
              <span>热搜管理</span>
            </template>
            <el-menu-item index="/standard-bussiness-data/hos-hot">
              <span slot="title">医院热搜</span>
            </el-menu-item>
            <el-menu-item index="/standard-bussiness-data/meal-hot">
              <span slot="title">套餐热搜</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="/standard-bussiness-data/hot-city">
            <span slot="title">热门城市</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="/standard-bussiness-data/chosen-hos">
          <span slot="title">精选医院管理</span>
        </el-menu-item>
        <el-menu-item index="/standard-bussiness-data/team-consult">
          <span slot="title">团检咨询</span>
        </el-menu-item>
        <!-- <el-menu-item index="/standard-bussiness-data/order-manage">
          <span slot="title">订单管理</span>
        </el-menu-item> -->
        <el-submenu index="/standard-bussiness-data/person-order">
          <template slot="title">
            <span>订单管理</span>
          </template>
         <el-menu-item index="/standard-bussiness-data/person-order">
            <span slot="title">个检订单管理</span>
          </el-menu-item>
          <el-menu-item index="/standard-bussiness-data/group-order">
            <span slot="title">团检订单管理</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="/standard-bussiness-data/user-message">
          <span slot="title">用户信息</span>
        </el-menu-item>
        <el-submenu index="/standard-bussiness-data/index-expert">
          <template slot="title">
            <span>app首页配置</span>
          </template>
          <el-menu-item index="/standard-bussiness-data/index-expert">
            <span slot="title">首页专家配置</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="/standard-bussiness-data/content-manage">
          <template slot="title">
            <span>内容管理</span>
          </template>
          <el-menu-item index="/standard-bussiness-data/content-manage">
            <span slot="title">名医说管理</span>
          </el-menu-item>
          <el-menu-item index="/standard-bussiness-data/info-manage">
            <span slot="title">资讯管理</span>
          </el-menu-item>
          <el-menu-item index="/standard-bussiness-data/day-chosen">
            <span slot="title">每日精选</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="/standard-bussiness-data/discount-manage">
          <template slot="title">
            <span>优惠管理</span>
          </template>
          <el-menu-item index="/standard-bussiness-data/discount-manage">
            <span slot="title">优惠码</span>
          </el-menu-item>
          <el-menu-item index="/standard-bussiness-data/register-coupons">
            <span slot="title">注册送券</span>
          </el-menu-item>
          <el-menu-item index="/standard-bussiness-data/voucher">
            <span slot="title">代金券</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="/standard-bussiness-data/banner-manage">
          <template slot="title">
            <span>banner管理</span>
          </template>
          <el-menu-item index="/standard-bussiness-data/banner-manage">
            <span slot="title">banner管理</span>
          </el-menu-item>
          <el-menu-item index="/standard-bussiness-data/banner-history">
            <span slot="title">历史记录</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="main-content">
      <!-- <back-button></back-button> -->
      <transition name="fade" mode="out-in">
        <keep-alive include="physical-appointment-manage,OrderManage,userMessage">
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>

  </div>
</template>
<script>
// import backButton from "../../components/backButton/index";
export default {
  // components: {
  //   backButton
  // },
  name: "StandardBussiness",
  data() {
    return {
      activeName: "",
    };
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.left-menu {
  width: 201px;
  height: 100%;
  position: fixed;
  left: 0;
  top: 40px;
}
.el-menu {
  min-height: 100%;
  max-height: 100%;
  overflow-y: auto;
  padding-bottom: 25px;
}
.main-content {
  padding-left: 221px;
  padding-top: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
}
</style>
