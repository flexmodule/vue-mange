<template>
  <div class="StandardData-container container">
    <div class="left-menu">
      <el-menu default-active="/backaccount-mange/home" router class="el-menu-vertical-list" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item index="/backaccount-mange/home">
          <span slot="title">运营后台账号管理</span>
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
export default {
  // components: {
  //   backButton
  // },
  name: "StandardBussiness",
  data() {
    return {
      activeName: ""
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
