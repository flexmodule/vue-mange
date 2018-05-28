<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>专区管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>专区列表</span>
      </div>
      <template>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="code" label="专区编号" width="180">
          </el-table-column>
          <el-table-column label="专区图片">
            <template slot-scope="scope">
              <img :src="scope.row.coverPicUrl" alt="" width="60">
            </template>
          </el-table-column>
          <el-table-column prop="name" label="专区名字">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="$router.push('/standard-bussiness-data/spe-region-edit/' + scope.row.id)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页模块 start -->
        <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination> -->
        <!-- 分页模块 end -->
      </template>
    </el-card>
  </div>
</template>
<style ang="scss" scoped>
.box-card {
  margin: 10px 0;
}
</style>
<script>
export default {
  data() {
    return {
      tableData: [{
        code: '001',
        name: '哈哈哈哈',
        coverPicId: '2'
      }],
      total: 0, //总页数
      currentPage: 1 //当前页
    };
  },
  mounted() {
    this.dataList({});
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {},
    //列表
    dataList: function(json){
        this.$http
        .get("/ops/meal/division",{
            pageNo: json.pageNo || 1,
            pageSize: json.pageSize || 10
        })
        .then(res => {
          if (res.data.rc === 0) {
            this.tableData =  res.data.data.content;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
      },
  }
};
</script>

