<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>团检企业</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>条件筛选</span>
      </div>
      <div class="filterData">
        <div class="select-date">
          <span>体检年月日：</span>
          <el-date-picker v-model="selectedDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :editable="false">
          </el-date-picker>
        </div>
        <div class="input-container" @keyup.enter="searchFilter">
          <span>企业名称：</span>
          <el-input placeholder="请输入企业名称、企业code" v-model="inputName" clearable>
          </el-input>
        </div>
        <div class="submit">
          <el-button type="primary" icon="el-icon-search" @click="searchFilter">查询</el-button>
          <el-button type="info" icon="el-icon-refresh" @click="resetFilter">重置</el-button>
        </div>
      </div>
    </el-card>
    <div class="clearfix">
      <el-button type="primary" icon="el-icon-circle-plus" @click="$router.push('/group-check-manage/add-group-check')">添加团检</el-button>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>企业团检列表</span>
      </div>
      <div class="dataList">
        <!-- 医院列表部分操作按钮 start -->
        <el-table :data="tableData" v-loading="loading" style="width: 100%">
          <el-table-column prop="code" label="code" align="center" width="100">
          </el-table-column>
          <el-table-column prop="enterpriseName" label="企业名称">
          </el-table-column>
          <el-table-column prop="total" label="体检总人数" align="center" width="200">
          </el-table-column>
          <el-table-column label="体检日期" align="center" width="200">
            <template slot-scope="scope">
              {{ handleReplace(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column prop="checkStatus" label="状态" align="center" width="200">
            <template slot-scope="scope">
              <!-- 体检状态转换 -->
              {{checkStatus(scope.row.status,scope.row.checkupStartAt,scope.row.checkupEndAt,scope.row.isBind)}}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="$router.push('/group-check-manage/group-check-detail/'+scope.row.id)">编辑</el-button>
              <!-- 已结束不显示下线按钮 通过判断返回值是否等于2 -->
              <el-button size="mini" type="danger" v-if="scope.row.isBind && compareTime(scope.row.checkupStartAt,scope.row.checkupEndAt)!=2 && (scope.row.status == 3 || scope.row.status == 1)" @click="openOnline(scope.row)">上线</el-button>
              <el-button size="mini" type="danger" v-if="scope.row.isBind && compareTime(scope.row.checkupStartAt,scope.row.checkupEndAt)!=2 && scope.row.status == 2" @click="openOffline(scope.row)">下线</el-button>
              <el-button size="mini" @click="$router.push('/group-check-manage/booking-situation/'+scope.row.id + '?companyId=' + scope.row.enterpriseId)">预约情况</el-button>
              <el-button size="mini" v-if="scope.row.showHistoryButton" @click="$router.push('/group-check-manage/check-history/'+scope.row.enterpriseId)">查看历史团检</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页模块 start -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
        </el-pagination>
        <!-- 分页模块 end -->
      </div>
    </el-card>

    <!--确认上线-->
    <el-dialog :visible.sync="onlineVisible" width="30%" :close-on-click-modal="false">
      <div slot="title">
        <span>提示：</span>
      </div>
      <span v-if="process > 3">请仔细检查团检信息每一步设置，确认无误！</span>
      <span v-else>本次团检，有信息还未完善，请完善后再上线！</span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="onlineVisible = false">取消</el-button>
        <el-button type="info" v-if="process > 3" @click="getOnline">确定无误，立即上线</el-button>
        <el-button v-else @click="$router.push('/group-check-manage/group-check-detail/'+ onId)">去完善</el-button>
      </span>
    </el-dialog>

    <!--确认下线-->
    <el-dialog :visible.sync="offlineVisible" width="30%" :close-on-click-modal="false">
      <div slot="title">
        <span>提示：</span>
      </div>
      <span>下线后，企业没预约的员工将不可以预约体检</span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="offlineVisible = false">取消</el-button>
        <el-button type="info" @click="getOffline">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
}
.filterData {
  .input-container {
    margin-top: 10px;
    .el-input {
      margin-left: 14px;
      width: 350px;
    }
  }
  .submit {
    text-align: center;
    margin-top: 10px;
  }
}
</style>

<script>
export default {
  name: "GroupManage",
  data() {
    return {
      inputName: "",
      selectedDate: "",
      loading: false,
      tableData: [],
      totalNum: 0, //总数
      currentPage: 1, //分页当前页
      currentPageSize: 10,

      onlineVisible: false,
      onId: "",
      process: "",
      offlineVisible: false,
      offId: ""
    };
  },
  mounted() {
    this.getList({});
  },
  methods: {
    getList(json) {
      this.loading = true;
      var startAt = null;
      var endAt = null;
      if (this.selectedDate != "") {
        startAt = this.format(this.selectedDate[0]);
        endAt = this.format(this.selectedDate[1]);
      }
      this.$http
        .get("/group-check-manage/group-order/list/", {
          params: {
            pageSize: json.size,
            pageNo: json.page,
            name: this.inputName,
            checkupStartAt: startAt,
            checkupEndAt: endAt
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
          this.loading = false;
        });
    },
    openOnline(row) {
      this.onId = row.id;
      this.process = row.process;
      this.onlineVisible = true;
    },
    getOnline() {
      this.$http
        .get("/group-check-manage/group-order/online/" + this.onId)
        .then(res => {
          if (res.data.rc == 0) {
            this.$message.success("上线成功");
            this.onlineVisible = false;
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
    },
    openOffline(row) {
      this.offId = row.id;
      this.offlineVisible = true;
    },
    getOffline() {
      this.$http
        .get("/group-check-manage/group-order/offline/" + this.offId)
        .then(res => {
          if (res.data.rc == 0) {
            this.$message.success("下线成功");
            this.offlineVisible = false;
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
    },
    format(date) {
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      month = this.fixZero(month);
      day = this.fixZero(day);
      return year + "-" + month + "-" + day;
    },
    fixZero(num) {
      if (num < 10) {
        num = "0" + num;
      }
      return num;
    },
    searchFilter() {
      this.getList({});
    },
    resetFilter() {
      this.inputName = "";
      this.selectedDate = "";
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
    checkStatus(status, s, e, isBind) {
      var checkStatus = "";
      if (!isBind) {
        checkStatus = "已结束";
      } else {
        var compare = this.compareTime(s, e);

        if (compare === 0) {
          if (status == 1 || status == 3) {
            checkStatus = "待上线";
          } else if (status == 2) {
            checkStatus = "即将开始";
          }
        } else if (compare === 1) {
          if (status == 1 || status == 3) {
            checkStatus = "待上线";
          } else if (status == 2) {
            checkStatus = "正在进行";
          }
        } else if (compare === 2) {
          checkStatus = "已结束";
        }
      }
      return checkStatus;
    },
    handleReplace(row) {
      if (row.checkupStartAt && row.checkupEndAt) {
        return (
          row.checkupStartAt.replace(/\-/g, ".") +
          "-" +
          row.checkupEndAt.replace(/\-/g, ".")
        );
      }
    }
  }
};
</script>
