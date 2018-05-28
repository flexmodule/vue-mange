<template>
  <div class="report-container box-card">
    <div class="dataList">
      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="reportName" label="体检报告">
        </el-table-column>
        <el-table-column prop="realName" label="体检者">
        </el-table-column>
        <el-table-column prop="mobileNo" label="联系电话">
        </el-table-column>
        <el-table-column prop="identityNo" label="身份证号">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row.srcFileId)" type="text" size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页模块 start -->
    <div class="pagination" v-if="totalNum>10">
      <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" background layout="prev, pager, next" :total="totalNum">
      </el-pagination>
    </div>
    <!-- 分页模块 end -->
  </div>
</template>

<style lang="scss" scoped>
.box-card {
  border: 1px solid #ebeef5;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  color: #303133;
  border-radius: 4px;
  overflow: hidden;
  padding: 20px;
}
.pagination {
  text-align: center;
}
</style>

<script>
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      totalNum: 0, //总条数
      currentPage: 1 //当前页数
    };
  },
  mounted() {
    this.getList(this.currentPage)
  },
  methods: {
    handleCurrentChange(val) {
      this.getList(val);
    },
    handleClick(pdfId) {
      /* 获取新的pdfURL */
      this.$http.get(`/checkup/pdf/fileinfo/${pdfId}`).then(res=>{
        if (res.data.rc===0) {
          window.open(res.data.data.url)
        }else{
          this.$message(res.data.msg)
        }
      })
    },
    getList(currentPage) {
      this.loading = true
      this.$http.get(`/user/${this.$route.params.userId}/report/file`,{
        params: {
          pageNo: currentPage||1
        }
      }).then(res => {
        this.loading = false
        if (res.data.rc === 0) {
          this.totalNum = res.data.data.records
          this.tableData = res.data.data.resultList
        } else {
          this.$message(res.data.msg);
        }
      }).catch(err=>{
        this.loading = false
      })
    }
  }
};
</script>