<template>
    <div class="container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>历史记录</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 筛选操作 start -->
      <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>历史记录</span>
            </div>
            <div>
                <template>
                    <el-table
                        :data="tableData"
                        v-loading="loading"
                        style="width: 100%">
                        <el-table-column
                          type="index"
                          :index="indexMethod">
                        </el-table-column>
                        <el-table-column
                        prop="title"
                        label="标题">
                        </el-table-column>
                        <el-table-column
                        width="200px"
                        label="图片">
                          <template slot-scope="scope">
                            <img :src="scope.row.avatarPath" alt="" width="50%">
                          </template>
                        </el-table-column>
                        <el-table-column
                        prop="target"
                        label="url">
                        </el-table-column>
                        <el-table-column
                        prop="endAt"
                        label="到期时间">
                        </el-table-column>
                        <el-table-column
                        prop="publishBy"
                        label="发布人">
                        </el-table-column>
                        <el-table-column
                        label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" @click="$router.push('/standard-bussiness-data/banner-detail/' + scope.row.id)">查看详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </div>  
            <!-- 分页模块 start -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
          <!-- 分页模块 end -->
      </el-card>   
    </div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
}
.onlineBanner {
  border-collapse: collapse;
  border: 1px solid #ddd;
  width: 100%;
  text-align: center;
  td {
    border: 1px solid #ddd;
    padding: 8px 0;
  }
  th {
    border: 1px solid #ddd;
    padding: 10px 0;
  }
}
</style>

<script>
export default {
  data() {
    return {
      total: 0, //总页数
      pageNo: 1, //默认第一页
      pageSize: 10, //默认每页10条
      currentPage: 1, //分页当前页
      tableData: [],
      loading:true,
    };
  },
  mounted() {
    this.bannerList({});
  },
  methods: {
    indexMethod(index) {
        return (index + 1);
    },
    //banner历史记录
    bannerList: function(json) {
      this.$http
        .get("/banner/ops/history/banner/list",{
          params:{
            pageNo: json.pageNo || 1,
            pageSize: json.pageSize || 10
          }
        })
        .then(res => {
          this.loading = false;
          //console.log(res.data.data.resultList)
          if(res.data.rc === 0){
            this.tableData = res.data.data.resultList;
            this.total = res.data.data.records;
          }else{
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
           this.loading = false;
          console.log(error);
          this.$message.error(error);
        });
    },
    //分页处理函数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.bannerList({
        pageNo: this.pageNo,
        pageSize:val
      });
    },
    //分页
    handleCurrentChange(val) {
      // console.log(val)
      // console.log(` ${val} 页`);
      this.bannerList({
        pageNo: val,
        pageSize:this.pageSize
      });
    }
  }
};
</script>