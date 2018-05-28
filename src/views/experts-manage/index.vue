<template>
  <div class="GroupCheckManage-container container">
    <div class="left-menu">
      <el-menu default-active="/experts-manage/index" router class="el-menu-vertical-list" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item index="/experts-manage/index">
          <span slot="title">专家管理</span>
        </el-menu-item>
        <el-menu-item index="/experts-manage/ask-medical">
          <span slot="title">问医审核</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="main-content">
      <!-- <back-button></back-button> -->
      <transition name="fade" mode="out-in">
        <keep-alive :include="includedComponents">
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
  
  name: "ExpertsManage",
  data() {
    return {
      includedComponents: "test-keep-alive",
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
