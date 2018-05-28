<template>
  <header class="header">
    <div class="logo">
      <router-link to="/"><img src="../../static/images/logo.png" alt=""></router-link>
    </div>
    <div class="user-info-wrap">
      <el-select v-model="value" placeholder="请选择" @change="jumpTo" class="select">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" class="option">
        </el-option>
      </el-select>
      <div class="user-info">
        <span class="user-name">{{userName}}</span>
        <span class="edit-pwd">修改密码</span>
        <!-- <span class="user-msg">消息</span> -->
        <span class="login-out" @click="signOut">退出</span>
      </div>

    </div>
  </header>
</template>
<style lang="scss">
header {
  width: 100%;
  height: 40px;
  padding: 0 30px;
  background-color: #1f1b1b;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  .logo {
    height: 100%;
    width: 200px;
    display: flex;
    align-items: center;
    img {
      vertical-align: middle;
    }
  }
  .user-info-wrap {
    display: flex;
    align-items: center;
    .user-info {
      font-size: 16px;
      span {
        cursor: pointer;
        padding: 0 10px;
        border-left: 1px solid #fff;
      }
    }
    .select {
      margin-right: 20px;
      input {
        height: 30px;
      }
    }
  }
  .el-select .el-input .el-select__caret {
    color: #000;
  }
}
</style>

<script>
import { deleteToken, deleteUserName, getName } from "@/utils/utils";
export default {
  name: "HeadMenu",
  data() {
    return {
      value: "/home",
      options: [
        {
          value: "/home",
          label: "首页"
        },
        {
          value: "/standard-data",
          label: "基础数据"
        },
        {
          value: "/standard-bussiness-data",
          label: "专业运营"
        },
        {
          value: "/group-check-manage",
          label: "团检管理"
        },
        // {
        //   value: "/marketing-manage",
        //   label: "营销管理"
        // },
        // {
        //   value: "/discount-manage",
        //   label: "优惠管理"
        // },
        {
          value: "/experts-manage",
          label: "专家管理"
        },
        {
          value: "选项1",
          label: "一键康管理"
        },
        {
          value: "/backaccount-mange/home",
          label: "运营后台账号管理"
        },
        // {
        //   value: "选项2",
        //   label: "消息推送"
        // },
        // {
        //   value: "选项3",
        //   label: "数据监测"
        // },
        // {
        //   value: "选项4",
        //   label: "公众号管理"
        // },
        // {
        //   value: "选项5",
        //   label: "客服"
        // },
        // {
        //   value: "选项6",
        //   label: "权限管理"
        // }
      ],
      userName: ""
    };
  },
  methods: {
    jumpTo(value) {
      this.$router.push(value);
    },
    changeValue() {
      this.options.map((t, i) => {
        if (this.$route.path.indexOf(t.value) != "-1") {
          this.value = t.value;
        }
      });
    },
    signOut() {
      this.$confirm("是否确认退出？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteToken();
          deleteUserName();
          // this.$message({
          //   type: "success",
          //   message: "已登出，正在关闭页面"
          // });
          // setTimeout(() => {
            this.$router.push({ path: "/user/login" });
          // }, 2000);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消退出"
          });
        });
    }
  },
  watch: {
    $route: "changeValue"
  },
  mounted() {
    // this.value = "/" + this.$route.path.split("/")[1];
    // this.userName = getName();
  }
};
</script>