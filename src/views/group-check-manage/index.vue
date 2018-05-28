<template>
  <div class="GroupCheckManage-container container">
    <div class="left-menu">
      <el-menu default-active="/group-check-manage/index" router class="el-menu-vertical-list" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-submenu index="/group-check-manage/index">
          <template slot="title">
            <span>企业团检管理</span>
          </template>
          <el-menu-item index="/group-check-manage/index">
            <span slot="title">团检企业</span>
          </el-menu-item>
          <el-menu-item index="/group-check-manage/will-unbind">
            <span slot="title">待解绑企业</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="/group-check-manage/info-manage">
          <span slot="title">企业信息管理</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="main-content">
      <!-- <back-button></back-button> -->
      <transition name="fade" mode="out-in">
        <router-view/>
      </transition>
    </div>

  </div>
</template>
<script>
// import backButton from "../../components/backButton/index";
// const backButton = () => import('../../components/backButton/index')

export default {
  // components: {
  //   backButton
  // },
  name: "GroupCheckManage",
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
