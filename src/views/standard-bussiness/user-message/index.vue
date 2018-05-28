<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 筛选操作 start -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>条件筛选</span>
      </div>
      <div class="filterData">
        <div class="flex mt10">
          <div class="flex mr30" @keyup.enter="search">
            <div style="width:70px;">搜索：</div>
            <el-input placeholder="用户编号、用户code、用户昵称、注册手机" v-model="search_input" clearable>
            </el-input>
          </div>
        </div>
        <div class="submit">
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="info" icon="el-icon-refresh" @click="reset">重置</el-button>
        </div>
      </div>
    </el-card>
    <!-- 筛选操作 end -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户列表</span>
      </div>
      <div class="dataList">
        <!-- 医院列表部分操作按钮 start -->
        <el-table :data="userList" style="width: 100%" v-loading="loading">
          <el-table-column prop="code" label="code" width="180">
          </el-table-column>
          <el-table-column prop="nickName" label="用户昵称" width="180">
          </el-table-column>
          <el-table-column prop="mobileNo" label="注册手机">
          </el-table-column>
          <el-table-column prop="createdAt" label="注册时间">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="$router.push('/standard-bussiness-data/user-detail/' + scope.row.id)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页模块 start -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 分页模块 end -->
      </div>

    </el-card>

  </div>
</template>
<style lang="scss" scoped>

.box-card {
  margin: 10px 0;
  .filterData {
    .mr30 {
      width: 50%;
    }
  }
}
.submit {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  button {
    margin: 0 20px;
  }
}
</style>

<script>
export default {
  name:"userMessage",
  data() {
    return {
      currentPage: 1, //分页当前页
      total: 0, //总条数
      page: 1, //页数
      pagesize: 10, //条数
      userList: [],
      search_input: "", //搜索
      loading: true
    };
  },
  mounted() {
    this.fetchUserList({});
  },
  methods: {
    //用户列表
    fetchUserList: function(json) {
      this.$http
        .get("/stantard-bussiness/user", {
          params: {
            search: this.search_input || "",
            page: json.page || 1,
            pageSezi: json.pagesize || 10
          }
        })
        .then(res => {
          console.log(res.data.data)
          this.loading = false;
          if (res.data.rc === 0) {
            this.userList = res.data.data.resultList;
            this.total = res.data.data.records;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
          this.$message.error(error);
        });
    },
    //模糊搜索
    search: function() {
      this.fetchUserList({
        search: this.search_input,
        page: this.page,
        pageSezi: this.pagesize
      });
    },
    //重置
    reset: function() {
      this.search_input = "";
    },
    //分页处理函数
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.fetchUserList({
        search: this.search_input,
        page: this.page,
        pageSezi: val
      });
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      //console.log(val)
      this.fetchUserList({
        search: this.search_input,
        page: val,
        pageSezi: this.pagesize
      });
    }
  }
};
</script>