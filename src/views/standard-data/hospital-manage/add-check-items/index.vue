<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage' }">医院管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage/hospital/'+hospitalId }">{{hospitalName}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage/hospital/'+hospitalId+'/check-items' }">检查项目</el-breadcrumb-item>
      <el-breadcrumb-item v-if="itemsId">修改</el-breadcrumb-item>
      <el-breadcrumb-item v-else>新增</el-breadcrumb-item>      
    </el-breadcrumb>
    <el-card class="box-card">
      <div class="conditions">
        <div class="flex mb30">
          <p>检查项目名称</p>
          <el-input placeholder="请输入" v-model="item">

          </el-input>
        </div>
        <div class="flex">
          <p>标准库匹配</p>
          <!-- <el-autocomplete
                    v-model="matchName"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入内容"
                    @select="handleSelect"
                    ></el-autocomplete> -->
          <el-select v-model="matchName" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading" @change="handleSelect" clearable>
            <el-option v-for="item in itemsList" :key="item.id" :label="item.name" :value="JSON.stringify(item)">
            </el-option>
          </el-select>
        </div>
      </div>
      <div>
        <el-button type="success" @click="submitCheckItems">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
  .conditions {
    margin-bottom: 350px;
    p {
      width: 150px;
      text-align: right;
      margin-right: 30px;
    }
    .el-input {
      width: 200px;
    }
    .el-select {
      width: 200px;
      .el-option {
        max-height: 200px;
      }
    }
  }
}
</style>

<script>
export default {
  data() {
    return {
      hospitalId: null,
      hospitalName: "",
      itemsId: null,
      loading: false,
      item: "",
      matchItemId: "",
      matchItemName: "",
      matchName: "",
      itemsList: []
    };
  },
  created() {
    this.hospitalId = this.$route.params.hid;
    this.getInfo();
  },
  mounted() {
    this.itemsId = this.$route.query.itemsId;
    if (this.itemsId) {
      this.getData();
    }
  },
  methods: {
    getInfo() {
      this.$http.get("/hospital/ops/" + this.hospitalId).then(res => {
        if (res.data.rc === 0) {
          this.hospitalName = res.data.data.name;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    getData() {
      this.$http
        .get("/hospital/check-items/findItem/", {
          params: {
            id: this.itemsId
          }
        })
        .then(res => {
          console.log(res);
          this.item = res.data.data.itemName;
          this.matchName = res.data.data.checkItemName;
          this.matchItemId = res.data.data.checkItemId;
          this.matchItemName = res.data.data.checkItemName;
        })
        .catch(error => {
          console.log(error);
        });
    },
    remoteMethod(queryString) {
      if (queryString != "") {
        this.$http
          .get("/hospital/check-items/enquiries/", {
            params: {
              item: queryString
            }
          })
          .then(res => {
            this.loading = false;
            if (res.data.data != null) {
              this.itemsList = res.data.data;
            } else {
              this.itemsList = [];
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.itemsList = [];
      }
    },
    handleSelect(item) {
      if (item) {
        item = JSON.parse(item);
        this.matchItemId = item.id;
        this.matchItemName = item.name;
      } else {
        this.matchItemId = "";
        this.matchItemName = "";
      }
    },
    submitCheckItems() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      if (this.item == "") {
        this.$message.error("检查项目名称不能为空");
      } else {
        if (this.itemsId) {
          var params = {
            id: this.itemsId,
            hospitalId: this.hospitalId,
            itemName: this.item,
            matchItemId: this.matchItemId || "",
            matchItemName: this.matchItemName || ""
          };
        } else {
          var params = {
            hospitalId: this.hospitalId,
            itemName: this.item,
            matchItemId: this.matchItemId || "",
            matchItemName: this.matchItemName || ""
          };
        }
        this.$http
          .post("/hospital/check-items/", params)
          .then(res => {
            loading.close();
            if (res.data.rc == 0) {
              if (this.itemsId) {
                this.$message.success("修改检查项目成功");
              } else {
                this.$message.success("新增检查项目成功");
              }
              this.$router.go(-1);
            } else if (res.data.rc == 1) {
              this.$message.error(res.data.msg);
            }
          })
          .catch(error => {
            loading.close();
          });
      }
    }
  }
};
</script>