<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/check-manage/index' }">检查项目库</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>条件筛选</span>
      </div>
      <div class="conditions">
        <div class="flex mb10">
          <div class="flex mr30">
            <p>一级类目：</p>
            <el-select v-model="primaryCategoryName" placeholder="请选择" @change="selectPrimary" clearable>
              <el-option v-for="item in primaryData" :key="item.id" :value="item.id" :label="item.name">
              </el-option>
            </el-select>
          </div>
          <div class="flex mr30">
            <p>二级类目：</p>
            <el-select v-model="secondCategoryName" placeholder="请选择" @change="selectSecond" :disabled="secondDisabled" clearable>
              <el-option v-for="item in secondData" :key="item.id" :value="item.id" :label="item.name">
              </el-option>
            </el-select>
          </div>
          <div class="flex">
            <p>体检项目：</p>
            <el-select v-model="checkItem" placeholder="请选择" :disabled="checkDisabled" clearable>
              <el-option v-for="item in checkData" :key="item.id" :value="item.id" :label="item.name">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="flex mb10" @keyup.enter="handleSearch">
          <p>搜索：</p>
          <el-input placeholder="检查项目名称、code、编码" style="width:194px" v-model="item"></el-input>
        </div>
      </div>
      <div class="operation">
        <el-button type="primary" icon="el-icon-search" class="mr30" @click="handleSearch">搜索</el-button>
        <el-button type="info" icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </div>
    </el-card>
    <div>
      <el-button type="primary" @click="$router.push('/standard-data/check-manage/add-category')">增加</el-button>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>检查项目列表</span>
      </div>
      <div class="dataList">
        <!-- 检查项目列表操作按钮 start -->
        <el-table :data="tableData" v-loading="loading" style="width: 100%">
          <el-table-column prop="id" label="项目id" align="center">
          </el-table-column>
          <el-table-column prop="name" label="检查项目标准名" align="center">
          </el-table-column>
          <el-table-column prop="code" label="code" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <!-- <el-button
                        size="mini"
                        @click="toLog(scope.$index, scope.row)">日志</el-button> -->
              <el-button size="mini" type="danger" @click="handleDisabled(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页模块 start -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="count">
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
      width: 80px;
      overflow: hidden;
      white-space: nowrap;
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
      loading: false,
      checkItemId: null,
      checkItemName: "浙江大学附属第一医院",
      tableData: [],
      currentPage: 1, //分页当前页
      currentPageSize: 10, //分页条数
      count: 0, // 总条数

      primaryCategoryName: "",
      primaryData: [],

      secondCategoryName: "",
      secondData: [],
      secondDisabled: true,

      checkItem: "",
      checkData: [],
      checkDisabled: true,

      item: ""
    };
  },
  methods: {
    toLog(index, row) {
      console.log(index, row);
    },
    //获取一级类目
    getPrimary() {
      this.$http
        .get("/check-manage/primary-category/")
        .then(res => {
          this.primaryData = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //选择一级类目 获取二级类目
    selectPrimary(val) {
      if (val) {
        this.$http
          .get("/check-manage/second-category/" + val)
          .then(res => {
            this.secondData = res.data.data;
            this.secondDisabled = false;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.secondData = [];
        this.secondDisabled = true;
      }
      this.secondCategoryName = "";
      this.checkItem = "";
      this.checkData = [];
      this.checkDisabled = true;
    },
    //选择二级类目 获取检查项目
    selectSecond(val) {
      if (val) {
        this.$http
          .get("/check-manage/inspection-item/" + val)
          .then(res => {
            this.checkData = res.data.data;
            this.checkDisabled = false;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.checkDisabled = true;
      }
      this.checkItem = "";
      this.checkData = [];
    },
    //搜索
    handleSearch() {
      this.getList({});
    },
    //重置
    handleReset() {
      this.primaryCategoryName = "";
      this.secondCategoryName = "";
      this.checkItem = "";
      this.secondDisabled = true;
      this.checkDisabled = true;
      this.selMeal = "";
      this.item = "";
    },
    //处理列表编辑按钮
    handleEdit(index, row) {
      this.$router.push(
        `/standard-data/check-manage/add-category?itemId=${row.id}`
      );
    },
    //处理删除按钮操作
    handleDisabled(index, row) {
      this.$confirm("检查项目删除后无法恢复，确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .delete("/check-manage/inspection-items/" + row.id)
            .then(res => {
              if (res.data.rc == 0) {
                this.$message.success("删除成功");
                this.getList({
                  page: this.currentPage,
                  size: this.currentPageSize
                });
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(err => {
              console.log(err);
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
        size: val
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList({
        page: val,
        size: this.currentPageSize
      });
    },
    getList(json) {
      this.loading = true;
      this.$http
        .get("/check-manage/inspection-items/", {
          params: {
            name: this.item || "",
            sectionId: this.checkItem || "",
            sectionPrimaryId: this.primaryCategoryName || "",
            sectionSecondId: this.secondCategoryName || "",
            page: json.page || 1,
            size: json.size || 10
          }
        })
        .then(res => {
          console.log(res.data)
          this.loading = false;
          if (res.data.rc === 0) {
            this.tableData = res.data.data.resultList;
            this.count = res.data.data.records;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
          this.$message.error(err);
        });
    }
  },
  mounted() {
    this.getPrimary();
    this.getList({});
  }
};
</script>
