<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/group-check-manage/index'}">团检企业</el-breadcrumb-item>
      <el-breadcrumb-item>团检详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="flex header">
        <p>{{companyName}}</p>
        <p>团检时间：{{date}}</p>
      </div>
      <ul>
        <li class="active" @click="$router.push('/group-check-manage/add-group-check?companyId=' + companyId + '&groupId=' + groupId)">
          <p>第一步</p>
          <p>团检基本信息添加</p>
        </li>
        <li class="active" @click="$router.push('/group-check-manage/group-check-detail/' + groupId + '/packages')">
          <p>第二步</p>
          <p>团检套餐添加</p>
        </li>
        <li :class="process > 1 ? 'active' : ''" @click="goImportList">
          <p>第三步</p>
          <p>团检名单导入</p>
        </li>
        <li :class="process > 2 ? 'active' : ''" @click="goHsp">
          <p>第四步</p>
          <p>医院和套餐配置</p>
        </li>
        <li :class="(process > 3 && state != 2 && isBind)? 'active' : ''" @click="(state != 2 && isBind)? getLine() : ''">
          <p>第五步</p>
          <p v-if="state == 2">当前团检已结束</p>
          <div v-else>
            <p v-if="status == 1 || status == 3">发布上线</p>
            <p v-if="status == 2">发布下线</p>
          </div>
        </li>
      </ul>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
  .header {
    font-size: 16px;
    p {
      margin-right: 50px;
      font-weight: bold;
    }
  }
  ul {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    li {
      width: 18%;
      padding: 40px 0;
      border: 1px solid #333;
      border-radius: 20px;
      cursor: pointer;
      background: #eee;
      &.active {
        background: #409eff;
      }
    }
  }
}
</style>

<script>
export default {
  name: "GroupCheckDetail",
  data() {
    return {
      groupId: null,
      companyId: null,
      companyName: "",
      date: "",
      process: 0,
      status: "",
      state: "",
      isBind: true,
    };
  },
  created() {
    this.groupId = this.$route.params.gid;
  },
  mounted() {
    this.getData();
  },
  methods: {
    replace(date) {
      return date.replace(/\-/g, ".");
    },
    getData() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .get("/group-check-manage/group-order/process/" + this.groupId)
        .then(res => {
          loading.close();
          console.log(res);
          if (res.data.rc == 0) {
            this.companyId = res.data.data.enterpriseId;
            this.companyName = res.data.data.enterpriseName;
            this.date =this.replace(res.data.data.checkupStartAt) +"-" +this.replace(res.data.data.checkupEndAt);
            this.state = this.compareTime(res.data.data.checkupStartAt, res.data.data.checkupEndAt);
            this.process = res.data.data.process;
            this.status = res.data.data.status;
            this.isBind = res.data.data.isBind;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          loading.close();
        });
    },
    goImportList() {
      if (this.process > 1) {
        this.$router.push(
          "/group-check-manage/group-check-detail/" +
            this.groupId +
            "/import-list"
        );
      }
    },
    goHsp() {
      if (this.process > 2) {
        this.$router.push(
          "/group-check-manage/group-check-detail/" +
            this.groupId +
            "/hospital-package"
        );
      }
    },
    getLine() {
      if (this.process > 3) {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        if (this.status == 2) {
          this.$http
            .get("/group-check-manage/group-order/offline/" + this.groupId)
            .then(res => {
              loading.close();
              if (res.data.rc == 0) {
                this.$message.success("下线成功");
                this.getData();
                loading.close();
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(err => {
              loading.close();
            });
        } else {
          this.$http
            .get("/group-check-manage/group-order/online/" + this.groupId)
            .then(res => {
              loading.close();
              if (res.data.rc == 0) {
                this.$message.success("上线成功");
                this.getData();
                loading.close();
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(err => {
              loading.close();
            });
        }
      }
    },
    compareTime(s, e) {
      if (s && e) {
        let nowTime = new Date().valueOf(); //当前时间时间戳
        let sA = s.split("-");
        //此处获取到的月份要减1
        let startTime = new Date(sA[0], sA[1] - 1, sA[2]).valueOf(); //开始时间的时间戳
        let eA = e.split("-");
        let endTime = new Date(eA[0], eA[1] - 1, eA[2]).valueOf(); //结束时间的时间戳
        //进行时间比较返回当前状态 即将开始: 0  正在进行: 1 已结束: 2
        return nowTime < startTime ? 0 : nowTime < endTime ? 1 : 2;
      }
    }
  }
};
</script>

