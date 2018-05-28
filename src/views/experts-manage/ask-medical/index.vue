<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>问医审核</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header">
        <span>条件筛选</span>
      </div>
      <div class="filterData">
        <div class="filter-wrap">
          <div class="flex mr30">
            <p>完成状态：</p>
            <el-select v-model="finish" placeholder="请选择" clearable>
              <el-option v-for="item in finishStatus" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="flex">
            <p>审核状态：</p>
            <el-select v-model="audit" placeholder="请选择" clearable>
              <el-option v-for="item in auditStatus" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="filter-wrap">
          <p class="demonstration">提问时间：</p>
          <el-date-picker v-model="selectDate" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="filter-wrap" @keyup.enter="searchFilter">
          <p class="demonstration">搜索：</p>
          <el-input v-model="inputValue" placeholder="请搜索问题关键字或者问题code"></el-input>
        </div>
        <div class="submit">
          <el-button type="primary" icon="el-icon-search" @click="searchFilter">查询</el-button>
          <el-button type="info" icon="el-icon-refresh" @click="resetFilter">重置</el-button>
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>问题列表</span>
      </div>
      <div class="dataList">
        <el-table :data="tableData" v-loading="loading" style="width: 100%">
          <el-table-column prop="code" label="编号" align="center">
          </el-table-column>
          <el-table-column label="问题描述" width="200">
            <template slot-scope="scope">
              <span class="text-content">{{ scope.row.textContent }}</span>
            </template>
          </el-table-column>
          <el-table-column label="完成状态">
            <template slot-scope="scope">
              {{ scope.row.isComplete == 0 ? "未完成" : "已完成" }}
            </template>
          </el-table-column>
          <el-table-column label="审核状态">
            <template slot-scope="scope">
              {{ filterAudit(scope.row.auditState) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="$router.push('/experts-manage/ask-medical-detail/'+scope.row.id)">查看详情</el-button>
              <el-button size="mini" @click="showReason(scope.row.id)" v-if="scope.row.auditState == 1 || scope.row.auditState == 2">下架理由</el-button>
              <el-button size="mini" @click="getOnline(scope.row.id)" v-if="scope.row.auditState == 1 || scope.row.auditState == 2">上架</el-button>
              <el-button size="mini" @click="showOffline(scope.row.id)" v-if="scope.row.auditState == 3 || scope.row.auditState == 0">下架</el-button>
              <!-- 1在线下 2在线上-->
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页模块 start -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
        </el-pagination>
        <!-- 分页模块 end -->
      </div>
    </el-card>

    <!-- 下架理由 -->
    <el-dialog title="下架理由" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
      <span v-loading="reasonLoading">{{ offReason }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- 下架弹窗 -->
    <el-dialog title="下架该问题" :visible.sync="offlineVisible" width="60%" :close-on-click-modal="false">
      <div class="flex mb10">
        <p class="mr10">下架理由：</p>
        <el-select v-model="reason" placeholder="请选择" clearable>
          <el-option v-for="(item, index) in reasonList" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </div>
      <p class="mb10">详细理由：</p>
      <el-input type="textarea" :rows="6" v-model="detailReason"></el-input>
      <div class="offline-footer" slot="footer">
        <el-button type="primary" @click="getOffline()">确定下架</el-button>
        <el-button @click="offlineVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
  .filter-wrap {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    p {
      width: 100px;
    }
    .el-input {
      width: 300px;
    }
  }
  .submit {
    text-align: center;
  }
}
.el-date-editor,
.el-cascader {
  width: 500px;
}
.text-content {
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  text-overflow: ellipsis;
}
</style>

<script>
export default {
  data() {
    return {
      finish: "",
      finishStatus: [
        {
          value: 0,
          label: "未完成"
        },
        {
          value: 1,
          label: "已完成"
        }
      ],
      audit: "",
      auditStatus: [
        {
          value: 0,
          label: "未审核"
        },
        {
          value: 1,
          label: "医生下架"
        },
        {
          value: 2,
          label: "平台下架"
        },
        {
          value: 3,
          label: "审核通过"
        }
      ],
      selectDate: "",
      inputValue: "",
      loading: false,
      tableData: [],
      totalNum: 0, //总数
      currentPage: 1, //分页当前页
      currentPageSize: 10,
      dialogVisible: false,
      offlineVisible: false,
      offId: "",
      offReason: "",
      reason: "",
      reasonList: [
        "广告、垃圾信息",
        "色情、淫秽或低俗内容",
        "激进时政或意识形态话题",
        "其他原因"
      ],
      detailReason: "",
      reasonLoading: false
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      var askStartAt = "";
      var askEndAt = "";
      if (this.selectDate) {
        askStartAt = this.selectDate[0];
        askEndAt = this.selectDate[1];
      }
      this.$http
        .get("/expert/ask", {
          params: {
            keyword: this.inputValue,
            isComplete: this.finish,
            auditState: this.audit,
            askAtGte: askStartAt,
            askAtLte: askEndAt,
            pageNo: this.currentPage || 1,
            pageSize: this.currentPageSize || 10
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
    //搜索
    searchFilter() {
      this.currentPage = 1;
      this.currentPageSize = 10;
      this.getList();
    },
    //重置
    resetFilter() {
      this.finish = "";
      this.audit = "";
      this.selectDate = "";
      this.inputValue = "";
    },
    showReason(id) {
      this.dialogVisible = true;
      this.reasonLoading = true;
      this.$http
        .get("/expert/ask/off-the-shelf/history/" + id)
        .then(res => {
          this.reasonLoading = false;
          if (res.data.rc == 0) {
            res = res.data.data;
            if (res.resultList.length != 0) {
              this.offReason = res.resultList[res.resultList.length - 1].reason;
            }
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.reasonLoading = false;
        });
    },
    getOnline(id) {
      this.$http
        .post("/expert/ask/" + id + "/shelf")
        .then(res => {
          if (res.data.rc == 0) {
            this.$message.success("上架成功");
            this.currentPage = 1;
            this.currentPageSize = 10;
            this.getList();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    showOffline(id) {
      this.offId = id;
      this.reason = "";
      this.detailReason = "";
      this.offlineVisible = true;
    },
    getOffline() {
      this.$http
        .post("/expert/ask/" + this.offId + "/off-the-shelf", {
          reason: this.reason,
          detailReason: this.detailReason
        })
        .then(res => {
          if (res.data.rc == 0) {
            this.offlineVisible = false;
            this.$message.success("下架成功");
            this.currentPage = 1;
            this.currentPageSize = 10;
            this.getList();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //分页处理函数
    handleSizeChange(val) {
      this.currentPageSize = val;
      this.currentPage = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    filterAudit(state) {
      var status;
      switch (state) {
        case 0:
          status = "未审核";
          break;
        case 1:
          status = "医生下架";
          break;
        case 2:
          status = "平台下架";
          break;
        case 3:
          status = "审核通过";
          break;
      }
      return status;
    }
  }
};
</script>