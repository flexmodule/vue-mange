<template>
  <div class="expertTeam-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage' }">医院管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage/hospital/'+hospitalId }">{{hospitalName}}</el-breadcrumb-item>
      <el-breadcrumb-item>专家团队</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="header">
        <span>专家团队</span>
        <el-button type="primary" @click="showAdd">新增</el-button>
      </div>
      <div v-for="(item, index) in expertList" :key="index" class="expert-list">
        <div class="expert-wrap">
          <div class="expert-info-wrap">
            <div class="expert-info">
              <p>专家名称：</p>
              <p>{{ item.name }}</p>
            </div>
            <div class="expert-info">
              <p>擅长领域：</p>
              <p>{{ item.goodAt }}</p>
            </div>
            <div class="expert-info">
              <p>专家头像：</p>
              <div class="img-wrap">
                <img :src="item.avatarPath" alt="">
              </div>
            </div>
          </div>
          <div class="expert-info-wrap">
            <div class="expert-info">
              <p>专家职称：</p>
              <p>{{ item.title }}</p>
            </div>
            <div class="expert-info area">
              <p>专家简介：</p>
              <p>{{ item.introduction }}</p>
            </div>
          </div>
        </div>
        <div class="opeartion">
          <el-button type="primary" @click="showEdit(item.id)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(item.id)">删除</el-button>
        </div>
      </div>
    </el-card>
    <!-- 新增弹窗 start -->
    <el-dialog :title="isAdd?'新增专家':'编辑专家'" :visible.sync="dialogVisible" width="60%" center>
      <div class="expert-wrap">
        <div class="expert-info-wrap">
          <div class="expert-info">
            <p>专家名称：</p>
            <el-input v-model="name"></el-input>
          </div>
          <div class="expert-info">
            <p>擅长领域：</p>
            <el-input v-model="goodAt"></el-input>
          </div>
          <div class="expert-info">
            <p>专家头像：</p>
            <div class="avatar">
              <file-input v-on:fileInfo="getAvatar" fileType="image" v-if="imgShow"></file-input>
              <div class="avatar-path">
                <img :src="avatarPath" alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="expert-info-wrap">
          <div class="expert-info">
            <p>专家职称：</p>
            <el-input v-model="title"></el-input>
          </div>
          <div class="expert-info area">
            <p>专家简介：</p>
            <el-input v-model="resume" type="textarea" :rows="4"></el-input>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitExpert">保 存</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 新增弹窗 end -->
    <div class="opeartion">
         <el-button type="primary" @click="$router.push(`/standard-data/hospital-manage/hospital/${hospitalId}`)">返回</el-button> 
    </div>
  </div>
</template>

<style lang="scss" scoped>
.expertTeam-container {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .box-card {
    margin: 10px 0;
  }
  .expert-list {
    margin-bottom: 20px;

    .opeartion {
      text-align: center;
    }
  }
}
.expert-wrap {
  display: flex;
  .expert-info-wrap {
    width: 50%;
    .expert-info {
      display: flex;
      margin-right: 20px;
      margin-bottom: 20px;
      align-items: center;
      &.area {
        align-items: flex-start;
      }
      p {
        margin-right: 20px;
        &:first-child {
          min-width: 80px;
        }
      }
      .img-wrap {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .avatar {
        position: relative;
        width: 200px;
        height: 200px;
        .avatar-path {
          width: 200px;
          height: 200px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
<script>
const fileInput = () => import("@/components/fileInput/");
export default {
  name: "ExpertTeam",
  components: {
    fileInput
  },
  data() {
    return {
      hospitalId: null,
      hospitalName: "",
      expertList: [],
      dialogVisible: false,
      isAdd: true,
      id: "",
      name: "",
      goodAt: "",
      fileId: "",
      title: "",
      resume: "",
      avatarPath: "",
      imgShow: false
    };
  },
  mounted() {
    this.hospitalId = this.$route.params.hid;
    this.getList();
    this.getInfo();
  },
  methods: {
    getList() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .get("/hospital/expert", {
          params: {
            hspId: this.hospitalId
          }
        })
        .then(res => {
          if (res.data.rc == 0) {
            this.expertList = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
          loading.close();
        })
        .catch(err => {
          loading.close();
        });
    },
    getInfo() {
      this.$http.get("/hospital/ops/" + this.hospitalId).then(res => {
        if (res.data.rc === 0) {
          this.hospitalName = res.data.data.name;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    showAdd() {
      this.dialogVisible = true;
      this.isAdd = true;
      this.id = "";
      this.name = "";
      this.goodAt = "";
      this.fileId = "";
      this.title = "";
      this.resume = "";
      this.avatarPath = "";
      this.imgShow = true;
    },
    showEdit(id) {
      this.dialogVisible = true;
      this.isAdd = false;
      this.id = id;
      this.getData(id);
      this.imgShow = true;
    },
    handleDelete(id) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .delete(`/hospital/expert/${id}`)
        .then(res => {
          if (res.data.rc == 0) {
            this.$message.success("删除专家成功");
            this.getList();
          } else {
            this.$message.error(res.data.msg);
          }
          loading.close();
        })
        .catch(err => {
          loading.close();
        });
    },
    getAvatar(fileInfo) {
      this.fileId = fileInfo.fileId;
    },
    getData(id) {
      this.avatarPath = "";
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .get(`/hospital/expert/${id}`)
        .then(res => {
          if (res.data.rc == 0) {
            res = res.data.data;
            this.name = res.name;
            this.goodAt = res.goodAt;
            this.title = res.title;
            this.resume = res.introduction;
            this.avatarPath = res.avatarPath;
          } else {
            this.$message.error(res.data.msg);
          }
          loading.close();
        })
        .catch(err => {
          loading.close();
        });
    },
    submitExpert() {
      // if (
      //   this.name == "" ||
      //   this.goodAt == "" ||
      //   this.title == "" ||
      //   this.resume == "" ||
      //   this.fileId == ""
      // ) {
      //   this.$message.error("请检查所有元素是否都填写");
      // } else {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        if (this.isAdd) {
          this.$http
            .post(`/hospital/expert/`, {
              hspId: this.hospitalId,
              name: this.name,
              goodAt: this.goodAt,
              title: this.title,
              introduction: this.resume,
              avatar: this.fileId
            })
            .then(res => {
              if (res.data.rc == 0) {
                this.$message.success("添加专家成功");
                this.dialogVisible = false;
                this.getList();
                this.imgShow = false;
              } else {
                this.$message.error(res.data.msg);
              }
              loading.close();
            })
            .catch(err => {
              loading.close();
            });
        } else {
          this.$http
            .put(`/hospital/expert/${this.id}`, {
              hspId: this.hospitalId,
              name: this.name,
              goodAt: this.goodAt,
              title: this.title,
              introduction: this.resume,
              avatar: this.fileId
            })
            .then(res => {
              if (res.data.rc == 0) {
                this.$message.success("修改专家成功");
                this.dialogVisible = false;
                this.getList();
                this.imgShow = false;
              } else {
                this.$message.error(res.data.msg);
              }
              loading.close();
            })
            .catch(err => {
              loading.close();
            });
        }
      // }
    }
  }
};
</script>
