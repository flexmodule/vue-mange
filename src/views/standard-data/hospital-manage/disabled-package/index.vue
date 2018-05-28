<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage' }">医院管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage/hospital/'+hospitalId }">{{hospitalName}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage/hospital/'+hospitalId+'/packages' }">套餐管理</el-breadcrumb-item>
      <el-breadcrumb-item>已禁用套餐</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>条件筛选</span>
      </div>
      <div class="conditions">
        <div class="flex mb10">
          <div class="flex mr30">
            <p>性别：</p>
            <el-select v-model="gender" placeholder="请选择" @change="selectGender" clearable>
              <el-option v-for="item in isGender" :key="item.gender" :value="item.gender">
              </el-option>
            </el-select>
          </div>
          <div class="flex" v-show="isShowMarried">
            <p>婚姻：</p>
            <el-select v-model="married" placeholder="请选择" clearable>
              <el-option v-for="item in isMarried" :key="item.married" :value="item.married">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="flex mb10" @keyup.enter="handleSearch">
          <p>搜索：</p>
          <el-input placeholder="套餐名称、编码" v-model="item"></el-input>
        </div>
      </div>
      <div class="operation">
        <el-button type="primary" icon="el-icon-search" class="mr30" @click="handleSearch">搜索</el-button>
        <el-button type="info" icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </div>
    </el-card>
    <div>
      <el-button type="danger" @click="batchDelete">批量删除</el-button>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>套餐列表</span>
      </div>
      <div class="dataList">
        <!-- 医院列表部分操作按钮 start -->
        <el-table :data="tableData" v-loading="loading" @selection-change="handleSelectionChange" style="width: 100%">
          <el-table-column type="selection" align="center" width="55">
          </el-table-column>
          <el-table-column prop="code" label="套餐编码" align="center">
          </el-table-column>
          <el-table-column prop="name" label="套餐名称" align="center">
          </el-table-column>
          <el-table-column prop="hspName" label="医院的套餐名称" align="center">
          </el-table-column>
          <el-table-column prop="hspPrice" label="医院进价" align="center">
          </el-table-column>
          <el-table-column prop="retailPrice" label="医院定价" align="center">
          </el-table-column>
          <el-table-column label="操作" width="220" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" @click="handleEnabled(scope.$index, scope.row)">启用</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="录入时间" align="center">
          </el-table-column>
          <el-table-column prop="createdOperatorName" label="录入人" align="center">
          </el-table-column>
        </el-table>
        <!-- 分页模块 start -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
        </el-pagination>
        <!-- 分页模块 end -->
      </div>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
  .conditions {
    border-bottom: 1px solid #e6ebf5;
    p {
      width: 160px;
      overflow: hidden;
      white-space: nowrap;
    }
    .el-select {
      width: 200px;
    }
    .el-input {
      width: 200px;
    }
  }
  .operation {
    padding-top: 20px;
    text-align: center;
  }
}
</style>

<script>
export default {
  data() {
    return {
      disableQuantity: 1,
      hospitalId: 0,
      hospitalName: "",
      tableData: [],
      loading: false,
      currentPage: 1, //分页当前页
      currentPageSize: 10,
      totalNum: 0,

      gender: "",
      isGender: [
        {
          gender: "不限"
        },
        {
          gender: "男"
        },
        {
          gender: "女"
        }
      ],

      isShowMarried: false,
      married: "",
      isMarried: [
        {
          married: "不限"
        },
        {
          married: "已婚"
        },
        {
          married: "未婚"
        }
      ],

      deleteList: [],
      deleteListId: [],
      deleteId: "",

      item: "",
      itemId: "",
      itemName: ""
    };
  },
  methods: {
    //选择性别
    selectGender() {
      if (this.gender == "女") {
        this.isShowMarried = true;
      } else {
        this.married = "";
        this.isShowMarried = false;
      }
    },
    //处理列表编辑按钮
    handleEdit(index, row) {
      this.$router.push(
        "/standard-data/hospital-manage/hospital/" +
          this.hospitalId +
          "/add-package?setMealId=" +
          row.id
      );
    },
    //启用套餐
    handleEnabled(index, row) {
      this.$confirm("确定要启用该套餐吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            method: "put",
            url: "/hospital/enable-set-meal/?id=" + row.id
          })
            .then(res => {
              if (res.data.rc == 0) {
                this.$message({
                  type: "success",
                  message: "启用成功!"
                });
                this.getList({
                  page: this.currentPage,
                  size: this.currentPageSize,
                });
              } else if (res.data.rc == 1) {
                this.$message({
                  type: "error",
                  message: res.data.msg
                });
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消启用"
          });
        });
    },
    handleDelete(index, row) {
      this.$confirm("确定要彻底删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .delete("/hospital/del-set-meal/", {
              params: {
                ids: row.id
              }
            })
            .then(res => {
              if (res.data.rc == 0) {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                this.getList({
                  page: this.currentPage,
                  size: this.currentPageSize,
                });
              } else if (res.data.rc == 1) {
                this.$message({
                  type: "error",
                  message: res.data.msg
                });
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //列表复选框
    handleSelectionChange(val) {
      this.deleteList = val;
    },
    batchDelete() {
      this.$confirm("确定要彻底删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          for (var i = 0; i < this.deleteList.length; i++) {
            this.deleteListId.push(this.deleteList[i].id);
          }
          this.deleteId = this.deleteListId.join(",");
          this.$http
            .delete("/hospital/del-set-meal/", {
              params: {
                ids: this.deleteId
              }
            })
            .then(res => {
              if (res.data.rc == 0) {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                this.getList({
                  page: this.currentPage,
                  size: this.currentPageSize,
                });
              } else if (res.data.rc == 1) {
                this.$message({
                  type: "error",
                  message: res.data.msg
                });
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //分页处理函数
    handleSizeChange(val) {
      this.currentPage = 1;
      this.currentPageSize = val;
      this.getList({
        page: this.currentPage,
        size: val,
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList({
        page: val,
        size: this.currentPageSize,
      });
    },
    handleReset() {
      this.item = "";
      this.gender = "";
      this.married = "";
      this.isShowMarried = false;
    },
    handleSearch() {
      this.getList({});
    },
    getList(json) {
      this.loading = true;
      if (/^\d+$/.test(this.item)) {
        this.itemId = this.item;
        this.itemName = "";
      } else {
        this.itemId = "";
        this.itemName = this.item;
      }
      this.$http
        .get("/hospital/set-meal/", {
          params: {
            name: this.itemName || "",
            id: this.itemId || "",
            fitSex: this.gender || "",
            isDisabled: true,
            maritalStatus: this.married || "",
            page: json.page || 1,
            pageSize: json.size || 10,
            hospitalId: this.hospitalId
          }
        })
        .then(res => {
          console.log(res.data)
          this.loading = false;
          if(res.data.rc == 0){
            this.tableData = res.data.data.resultList;
            this.totalNum = res.data.data.records;
          }else{
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
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
    }
  },
  mounted() {
    this.hospitalId = this.$route.params.hid;
    this.getInfo();
    this.getList({});
  }
};
</script>
