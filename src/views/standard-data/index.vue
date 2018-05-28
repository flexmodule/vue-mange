<template>
  <div class="StandardData-container container">
    <div class="left-menu">
      <el-menu default-active="/standard-data/hospital-manage" router class="el-menu-vertical-list" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item index="/standard-data/hospital-manage">
          <span slot="title">医院管理</span>
        </el-menu-item>
        <el-submenu index="/standard-data/check-manage">
          <template slot="title">
            <span>检查项目管理</span>
          </template>
          <el-menu-item index="/standard-data/check-manage/index">
            <span slot="title">检查项目库</span>
          </el-menu-item>
          <el-menu-item index="/standard-data/check-manage/maintain-category">
            <span slot="title">类目维护</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="/standard-data/city-manage">
          <template slot="title">
            <span>城市管理</span>
          </template>
          <el-menu-item index="/standard-data/city-manage/index">
            <span slot="title">上线城市</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="/standard-data/package-character">
          <span slot="title">体检套餐特征库</span>
        </el-menu-item>
        <el-menu-item index="/standard-data/independent-manual">
          <span slot="title">自助手册管理</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="main-content">
      <!-- <back-button></back-button> -->
      <transition name="fade" mode="out-in">
        <keep-alive include="HospitalManage">
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>

  </div>
</template>
<script>
// import backButton from "../../components/backButton/index";
// const backButton = () => import("../../components/backButton/index");
export default {
  name: "StandardData",
  // components: {
  //   backButton
  // },
  data() {
    return {
      activeName: ""
    };
  },
  methods: {},
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
  height: 100%;
}
.main-content {
  padding-left: 221px;
  padding-top: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
}
</style>
