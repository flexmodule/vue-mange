<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>待解绑企业</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>待解绑团检列表</span>
      </div>
      <div class="dataList">
        <!-- 医院列表部分操作按钮 start -->
        <el-table :data="tableData" v-loading="loading" style="width: 100%">
          <el-table-column prop="id" label="序号" align="center" width="100">
          </el-table-column>
          <el-table-column prop="enterpriseName" label="企业名称">
          </el-table-column>
          <el-table-column prop="total" label="总人数" align="center" width="100">
          </el-table-column>
          <el-table-column prop="finishCheckup" label="已体检" align="center" width="100">
          </el-table-column>
          <el-table-column prop="notFinishCheckup" label="未体检" align="center" width="100">
          </el-table-column>
          <el-table-column label="体检日期" align="center" width="200">
            <template slot-scope="scope">
              {{ handleReplace(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="150">
            <template slot-scope="scope">
              <span v-if="compareTime(scope.row.checkupStartAt,scope.row.checkupEndAt) == 2">已结束</span>
              <span v-else>待上线</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="$router.push('/group-check-manage/group-check-detail/'+scope.row.id)">编辑</el-button>
              <el-button size="mini" @click="$router.push('/group-check-manage/booking-situation/'+scope.row.id + '?companyId=' + scope.row.enterpriseId)">预约情况</el-button>
              <el-button type="danger" size="mini" @click="relieve(scope.row.id)">解除员工绑定</el-button>
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
</style>

<script>
export default {
  name: "GroupManage",
  data() {
    return {
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
    getList(json, success) {
      this.loading = true;
      this.$http
        .get("/group-check-manage/group-order/list/unbind", {
          params: {
            pageSize: json.size,
            pageNo: json.page
          }
        })
        .then(res => {
          this.tableData = res.data.data.resultList;
          this.totalNum = res.data.data.records;
          this.loading = false;
          success ? success() : "";
        })
        .catch(err => {
          console.log(err);
        });
    },
    //分页处理函数
    handleSizeChange(val) {
      this.currentPageSize = val;
      this.currentPage = 1;
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
    handleReplace(row) {
      if (row.checkupStartAt && row.checkupEndAt) {
        return (
          row.checkupStartAt.replace(/\-/g, ".") +
          "-" +
          row.checkupEndAt.replace(/\-/g, ".")
        );
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
    },
    relieve(id) {
      this.$confirm(
        "解除员工绑定后，本次团检所有员工注册账号与企业绑定关系解除，下次团检需要重新鉴权确认要解除员工绑定关系么？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http
            .get("/group-check-manage/group-order/unbind/" + id)
            .then(res => {
              if (res.data.rc == 0) {
                this.getList({
                  page: this.currentPage,
                  size: this.currentPageSize
                });
                this.$message({
                  type: "success",
                  message: "解绑成功!"
                });
              } else {
                this.$message({
                  type: "error",
                  message: res.data.msg
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消解绑"
          });
        });
    }
  }
};
</script>
