<template>
  <div class="healthManage-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage' }">医院管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage/hospital/'+hospitalId }">{{hospitalName}}</el-breadcrumb-item>
      <el-breadcrumb-item>健管服务</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" v-loading="loading">
      <div slot="header" class="header">
        <span>健管服务</span>
        <el-button type="primary" @click="showAdd">新增</el-button>
      </div>
      <div v-for="(item, index) in healthList" :key="index" class="health-list">
        <div class="health-wrap">
          <div class="health-info">
            <p>健管名称：</p>
            <p>{{ item.name }}</p>
          </div>
          <div class="health-info">
            <p>健管特点：</p>
            <p>{{ item.trait }}</p>
          </div>
          <div class="health-info area">
            <p>健管描述：</p>
            <p>{{ item.description }}</p>
          </div>
        </div>
        <div class="opeartion">
          <el-button type="primary" @click="showEdit(item)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(item.id)">删除</el-button>
        </div>
      </div>
    </el-card>
    <!-- 新增弹窗 start -->
    <el-dialog :title="isAdd?'新增健管服务':'编辑健管服务'" :visible.sync="dialogVisible" width="60%" center>
      <div class="health-wrap">
        <div class="health-info">
          <p>健管名称：</p>
          <el-input v-model="name"></el-input>
        </div>
        <div class="health-info">
          <p>健管特点：</p>
          <el-input v-model="feature"></el-input>
        </div>
        <div class="health-info area">
          <p>健管描述：</p>
          <el-input v-model="describe" type="textarea" :rows="4"></el-input>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="submithealth">保 存</el-button>
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
.healthManage-container {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .box-card {
    margin: 10px 0;
  }
  .health-list {
    margin-bottom: 20px;

    .opeartion {
      text-align: center;
    }
  }
}
.health-wrap {
  width: 50%;
  .health-info {
    display: flex;
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
    .el-input {
      width: 180px;
    }
  }
}
</style>
<script>
export default {
  name: "healthManage",
  data() {
    return {
      hospitalId: null,
      hospitalName: "",
      loading: false,
      healthList: [],
      dialogVisible: false,
      isAdd: true,
      id: "",
      name: "",
      feature: "",
      describe: ""
    };
  },
  mounted() {
    this.hospitalId = this.$route.params.hid;
    this.getList();
    this.getInfo();
  },
  methods: {
    getList() {
      this.loading = true;
      this.$http
        .get(
          `/hospital/ops/${
            this.hospitalId
          }/health-management`
        )
        .then(res => {
          if (res.data.rc == 0) {
            this.healthList = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
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
      this.feature = "";
      this.describe = "";
    },
    showEdit(item) {
      this.dialogVisible = true;
      this.isAdd = false;
      this.id = item.id;
      this.name = item.name;
      this.feature = item.trait;
      this.describe = item.description;
    },
    handleDelete(id) {
      this.$http
        .delete(
          `/hospital/ops/${
            this.hospitalId
          }/health-management/delete`,
          {
            params: {
              healthManagementId: id
            }
          }
        )
        .then(res => {
          if (res.data.rc == 0) {
            this.$message.success("删除健管服务成功");
            this.getList();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {});
    },
    getAvatar(fileInfo) {
      this.fileId = fileInfo.fileId;
    },
    submithealth() {
      // if (this.name == "" || this.feature == "" || this.describe == "") {
      //   this.$message.error("请检查所有元素是否都填写");
      // } else {
        if (this.isAdd) {
          this.$http
            .post(
              `/hospital/ops/${
                this.hospitalId
              }/health-management/add`,
              {
                name: this.name,
                trait: this.feature,
                description: this.describe
              }
            )
            .then(res => {
              if (res.data.rc == 0) {
                this.$message.success("添加健管服务成功");
                this.dialogVisible = false;
                this.getList();
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.$http
            .put(
              `/hospital/ops/${
                this.hospitalId
              }/health-management/update`,
              {
                id: this.id,
                name: this.name,
                trait: this.feature,
                description: this.describe
              }
            )
            .then(res => {
              if (res.data.rc == 0) {
                this.$message.success("修改健管服务成功");
                this.dialogVisible = false;
                this.getList();
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      // }
    }
  }
};
</script>
