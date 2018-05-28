<template>
	<div class="container">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/group-check-manage/index'}">团检企业</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/group-check-manage/group-check-detail/' + groupId}">团检详情</el-breadcrumb-item>
			<el-breadcrumb-item>团检套餐列表</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="mt10">
			<el-button type="primary" @click="$router.push('/group-check-manage/group-check-detail/' + groupId + '/add-package')">新增</el-button>
		</div>
		<el-card class="box-card">
			<div slot="header">
				<span>套餐列表</span>
			</div>
			<div class="data-list">
				<el-table :data="tableData" style="width: 100%" v-loading="loading">
					<el-table-column prop="id" label="套餐编码">
					</el-table-column>
					<el-table-column prop="name" label="套餐名称">
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="mini" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
							<!-- <el-button type="mini">日志</el-button> -->
						</template>
					</el-table-column>
					<el-table-column prop="createdAt" label="录入时间" align="center">
					</el-table-column>
					<el-table-column prop="createdOperatorName" label="录入人" align="center">
					</el-table-column>
				</el-table>
			</div>
			<!-- 分页模块 start -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
			</el-pagination>
			<!-- 分页模块 end -->
		</el-card>
		<div>
			<el-button type="info" v-if="tableData.length == 0">保存</el-button>
			<el-button type="success" @click="submitPackages" v-else>保存</el-button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
}
</style>

<script>
export default {
	name: "Packages",
  data() {
    return {
      groupId: null,
      loading: false,
      tableData: [],
      totalNum: 0, //总数
      currentPage: 1, //分页当前页
      currentPageSize: 10
    };
  },
  created() {
    this.groupId = this.$route.params.gid;
    this.getList({});
  },
  methods: {
    getList(json, success) {
      this.loading = true;
      this.$http
        .get(
          "/group-check-manage/" + this.groupId + "/set-meal-template/list",
          {
            pageSize: json.size,
            pageNo: json.page
          }
        )
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
    handleEdit(index, row) {
      this.$router.push(
        "/group-check-manage/group-check-detail/" +
          this.groupId +
          "/add-package?setMealId=" +
          row.id
      );
    },
    submitPackages() {
      this.$router.go(-1);
    }
  }
};
</script>