<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>企业信息管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>条件筛选</span>
      </div>
      <div class="filterData">
        <div class="input-container" @keyup.enter="searchFilter">
          <el-input placeholder="请输入企业名称、省、市或者企业code" v-model="inputName" clearable>
          </el-input>
        </div>
        <div class="submit">
          <el-button type="primary" icon="el-icon-search" @click="searchFilter">查询</el-button>
          <el-button type="info" icon="el-icon-refresh" @click="resetFilter">重置</el-button>
        </div>
      </div>
    </el-card>
    <div class="clearfix">
      <el-button type="primary" icon="el-icon-circle-plus" @click="$router.push('/group-check-manage/add-company/')">新增企业</el-button>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>企业信息列表</span>
      </div>
      <div class="dataList">
        <!-- 医院列表部分操作按钮 start -->
        <el-table :data="tableData" v-loading="loading" style="width: 100%">
          <el-table-column prop="code" label="code" align="center" width="100">
          </el-table-column>
          <el-table-column prop="name" label="企业名称">
          </el-table-column>
          <el-table-column prop="scale" label="规模" align="center" width="200">
          </el-table-column>
          <el-table-column prop="type" label="性质" align="center" width="200">
          </el-table-column>
          <el-table-column prop="contact" label="联系人" align="center" width="200">
          </el-table-column>
          <el-table-column prop="phone" label="联系电话" align="center" width="200">
          </el-table-column>
          <el-table-column label="省市区" align="center" width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.province">{{ scope.row.province + '、' + scope.row.city + '、' + scope.row.district }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="$router.push('/group-check-manage/add-company?companyId='+scope.row.id)">编辑</el-button>
              <el-button size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
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
}
.filterData {
  .input-container {
    width: 300px;
  }
  .submit {
    text-align: center;
    margin-top: 10px;
  }
}
</style>

<script>
export default {
  name: "InfoManage",
  data() {
    return {
      inputName: "",
      loading: false,
      tableData: [],
      totalNum: 0, //总数
      currentPage: 1, //分页当前页
      currentPageSize: 10
    };
  },
  mounted() {
    this.getList({});
  },
  methods: {
    getList(json) {
      this.loading = true;
      // http://192.168.16.10:9999
      this.$http
        .get("/group-check-manage/company-info/list/", {
          params: {
            pageSize: json.pageSize,
            pageNo: json.pageNo,
            name: this.inputName
          }
        })
        .then(res => {
          console.log(res.data)
          this.loading = false;
          if (res.data.rc == 0) {
            this.tableData = res.data.data.resultList;
            this.totalNum = res.data.data.records;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    searchFilter() {
      this.getList({});
    },
    resetFilter() {
      this.inputName = "";
    },
    //优惠码分页
    handleSizeChange(val) {
      this.currentPageSize = val;
      this.currentPage = 1;
      this.getList({
        pageNo: this.currentPage,
        pageSize: val
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList({
        pageNo: val,
        pageSize: this.currentPageSize
      });
    },
    handleDelete(id) {
      this.$confirm("删除企业有所关联的团检也将被删除，确认删除么？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .delete("/group-check-manage/company-info/" + id)
            .then(res => {
              if (res.data.rc == 0) {
                this.getList({
                  pageNo: this.currentPage,
                  pageSize: this.currentPageSize
                });
                this.$message.success("删除成功");
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
            message: "取消删除"
          });
        });
    }
  }
};
</script>
