<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/experts-manage/ask-medical' }">问医审核</el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="data-wrap">
      <div class="box-card questioner-info">
        <div class="questioner-icon">
          <img :src="avatar" alt="">
        </div>
        <p class="questioner-name">昵称：{{ nickName }}</p>
        <div class="operation">
          <p>
            <el-button @click="goAnswers" :type="show===1?'primary':''">问题描述</el-button>
          </p>
          <p>
            <el-button @click="goReports" :type="show===2?'primary':''">体检报告</el-button>
          </p>
          <p>
            <el-button>健康自测</el-button>
          </p>
          <p>
            <el-button>综合评估</el-button>
          </p>
        </div>
      </div>
      <div class="box-card router">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.data-wrap {
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  .box-card {
    border: 1px solid #ebeef5;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    color: #303133;
    border-radius: 4px;
    overflow: hidden;
    &.questioner-info {
      width: 200px;
      padding: 20px;
      margin-right: 20px;
      .questioner-icon {
        width: 100px;
        height: 100px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .questioner-name {
        margin-top: 5px;
        margin-bottom: 15px;
        white-space: nowrap;
        overflow: hidden;
      }
      .operation {
        p {
          margin-bottom: 10px;
        }
        .el-button {
          width: 100%;
        }
      }
    }
    &.router {
      flex: 1;
      padding: 20px;
    }
  }
}
</style>

<script>
export default {
  data() {
    return {
      qid: null,
      show: 1,
      nickName: "",
      avatar: "",
      userId: '',
      infoList: [{
        name: "问题描述",
        url: "describe",
      },{
        name: "体检报告",
        url: "reports",
      },{
        name: "健康自测",
        url: "health",
      },{
        name: "综合评估",
        url: "assess",
      }]
    };
  },
  mounted() {
    this.qid = this.$route.params.qid;
    this.getUrl();
    this.getQuestion();
  },
  methods: {
    getUrl(){
      var path = this.$route.path;
      this.infoList.forEach((item,index) => {
        if(path.indexOf(item.url) != -1){
          this.show = index + 1;
        }
      });
    },
    goAnswers() {
      this.show = 1;
      this.$router.push(`/experts-manage/ask-medical-detail/${this.qid}/describe`);
    },
    goReports() {
      this.show = 2;
      this.$router.push(`/experts-manage/ask-medical-detail/${this.qid}/reports/${this.userId}`);
    },
    getQuestion() {
      this.$http
        .get("/expert/ask/" + this.qid)
        .then(res => {
          if (res.data.rc == 0) {
            res = res.data.data;
            this.nickName = res.nickName;
            this.avatar = res.avatarPath;
            this.userId = res.userId;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>