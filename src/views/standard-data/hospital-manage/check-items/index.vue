<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage' }">医院管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage/hospital/'+hospitalId }">{{hospitalName}}</el-breadcrumb-item>
      <el-breadcrumb-item>检查项目</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>条件筛选</span>
      </div>
      <div class="conditions">
        <div class="flex mb10">
          <p>是否与标准项匹配：</p>
          <el-select v-model="match" placeholder="请选择" clearable>
            <el-option v-for="item in isMatch" :key="item.match" :value="item.match">
            </el-option>
          </el-select>
        </div>
        <div class="flex mb10" @keyup.enter="handleSearch">
          <p>搜索：</p>
          <el-input placeholder="体检项目名称、标准项目名称、标准编号" v-model="item"></el-input>
        </div>
      </div>
      <div class="operation">
        <el-button type="primary" icon="el-icon-search" class="mr30" @click="handleSearch">搜索</el-button>
        <el-button type="info" icon="el-icon-refresh" @click="handleRefresh">重置</el-button>
      </div>
    </el-card>
    <div>
      <el-button type="primary" icon="el-icon-circle-plus" @click="$router.push('/standard-data/hospital-manage/hospital/'+hospitalId+'/add-check-items')">新增</el-button>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>医院体检项目列表</span>
      </div>
      <div class="dataList">
        <el-table :data="tableData" v-loading="loading" style="width: 100%">
          <el-table-column prop="itemName" label="项目名称" align="center">
          </el-table-column>
          <el-table-column prop="checkItemName" label="对应标准项名称" align="center">
          </el-table-column>
          <el-table-column prop="checkItemId" label="对应标准项编号" align="center">
          </el-table-column>
          <el-table-column label="是否匹配" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isMatched">已匹配</span>
              <span class="red" v-else>未匹配</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页模块 start -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
        </el-pagination>
        <!-- 分页模块 end -->
      </div>
    </el-card>
    <div class="opeartion">
         <el-button type="primary" @click="$router.push(`/standard-data/hospital-manage/hospital/${hospitalId}`)">返回</el-button> 
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
  .conditions {
    p {
      width: 150px;
    }
    .el-select {
      width: 300px;
    }
    .el-input {
      width: 300px;
    }
  }
  .operation {
    padding-top: 20px;
    text-align: center;
  }
  .red {
    color: #f99;
  }
}
</style>

<script>
export default {
  data() {
    return {
      hospitalId: 0,
      hospitalName: "",

      match: "",
      isMatch: [
        {
          match: "是"
        },
        {
          match: "否"
        }
      ],

      item: "",

      tableData: [],
      currentPage: 1,
      currentPageSize: 10,
      totalNum: 0,
      loading: false
    };
  },
  created() {
    this.hospitalId = this.$route.params.hid;
  },
  mounted() {
    this.getInfo();
    this.getList({});
  },
  methods: {
    getList(json) {
      this.loading = true;
      this.$http
        .get("/hospital/check-items/", {
          params: {
            hospitalId: this.hospitalId,
            isMatched: json.isMatched || "",
            item: json.item || "",
            page: json.page || 1,
            size: json.size || 10
          }
        })
        .then(res => {
          this.loading = false;
          if (res.data.rc == 0) {
            this.tableData = res.data.data.resultList;
            this.totalNum = res.data.data.records;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    //搜索
    handleSearch() {
      if (this.match == "是") {
        var isMatched = "true";
      } else if (this.match == "否") {
        var isMatched = "false";
      }
      this.getList({
        isMatched: isMatched,
        item: this.item
      });
    },
    handleRefresh() {
      this.match = "";
      this.item = "";
    },
    //编辑
    handleEdit(index, row) {
      this.$router.push(
        "/standard-data/hospital-manage/hospital/" +
          this.hospitalId +
          "/add-check-items?itemsId=" +
          row.id
      );
    },
    //分页处理函数
    handleSizeChange(val) {
      this.currentPageSize = val;
      this.currentPage = 1;
      if (this.match == "是") {
        var isMatched = "true";
      } else if (this.match == "否") {
        var isMatched = "false";
      }
      this.getList({
        page: this.currentPage,
        size: val,
        isMatched: isMatched,
        item: this.item
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.match == "是") {
        var isMatched = "true";
      } else if (this.match == "否") {
        var isMatched = "false";
      }
      this.getList({
        page: val,
        size: this.currentPageSize,
        isMatched: isMatched,
        item: this.item
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
  }
};
</script>