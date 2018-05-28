<template>
	<div class="container">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>专家管理</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card class="box-card">
			<div slot="header">
				<span>条件筛选</span>
			</div>
			<div class="filterData">
				<div class="input-wrap">
					<div class="flex mr30">
						<p>性别：</p>
						<el-select v-model="fixGender" placeholder="请选择" clearable>
							<el-option v-for="item in gender" :key="item" :label="item" :value="item">
							</el-option>
						</el-select>
					</div>
					<div class="flex">
						<p>职称：</p>
						<el-select v-model="fixLevel" placeholder="请选择" clearable>
							<el-option v-for="item in level" :key="item" :label="item" :value="item">
							</el-option>
						</el-select>
					</div>
				</div>
				<div class="input-wrap" @keyup.enter="searchFilter">
					<p>搜索：</p>
					<el-input v-model="inputValue" placeholder="姓名、注册手机、身份证号"></el-input>
				</div>
				<div class="submit">
					<el-button type="primary" icon="el-icon-search" @click="searchFilter">查询</el-button>
					<el-button type="info" icon="el-icon-refresh" @click="resetFilter">重置</el-button>
				</div>
			</div>
		</el-card>
		<div>
			<el-button type="primary" @click="$router.push('/experts-manage/add-expert')">帮注册</el-button>
		</div>
    
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>专家列表</span>
			</div>
			<div class="dataList">
				<el-table :data="tableData" v-loading="loading" style="width: 100%">
					<el-table-column prop="code" label="编号code" align="center">
					</el-table-column>
					<el-table-column prop="realName" label="姓名">
					</el-table-column>
					<el-table-column prop="mobileNo" label="注册手机">
					</el-table-column>
					<el-table-column prop="sex" label="性别">
					</el-table-column>
					<el-table-column prop="title" label="职称">
					</el-table-column>
					<el-table-column prop="identityNo" label="身份证号">
					</el-table-column>
					<el-table-column prop="createdAt" label="注册时间">
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<el-button size="mini" @click="$router.push('/experts-manage/expert-detail/'+scope.row.id)">查看详情</el-button>
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
  .input-wrap {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  p {
    width: 100px;
  }
  .el-select {
    width: 300px;
  }
  .el-input {
    width: 300px;
  }
  .submit {
    text-align: center;
  }
}
</style>

<script>
export default {
  name: 'test-keep-alive',
  data() {
    return {
      fixGender: "",
      gender: ["男", "女"],
      fixLevel: "",
      level: [
        "副主任医师",
        "主治医师",
        "医师",
        "医士",
        "主任药师",
        "副主任药师",
        "主管药师",
        "药师",
        "药士",
        "主任护师",
        "副主任护师",
        "主管护师",
        "护师",
        "护士",
        "主任技师",
        "副主任技师",
        "主管技师",
        "技士"
      ],
			inputValue: "",
			loading: false,
      tableData: [],
      totalNum: 0, //总数
      currentPage: 1, //分页当前页
      currentPageSize: 10
    };
  },
  mounted(){
    this.getList();
  },
  methods: {
    getList(){
      this.loading = true;
      this.$http.get("/expert" ,{
        params: {
          sex: this.fixGender || "",
          title: this.fixLevel || "",
          queryInfo: this.inputValue || "",
          pageNo: this.currentPage || 1,
          pageSize : this.currentPageSize || 10,
        }
      })
      .then(res=>{
        this.loading = false;
        console.log(res);
        if(res.data.rc == 0){
          this.tableData = res.data.data.resultList;
          this.totalNum = res.data.data.records;
        }else {
          this.$message.error(res.data.msg);
        }
      }).catch(err=>{
        this.loading = false;
      })
    },
		//搜索
		searchFilter() {
      this.currentPage = 1;
      this.currentPageSize = 10;
      this.getList();
		},
		//重置
    resetFilter() {
			this.fixGender = "";
			this.fixLevel = "";
      this.inputValue = "";
    },
    //分页处理函数
    handleSizeChange(val) {
		  this.currentPageSize = val;
      this.currentPage = 1;	
      this.getList();
      
      //   this.getList({
      //     page: this.currentPage,
      //     size: val
      //   });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
      //   this.getList({
      //     page: val,
      //     size: this.currentPageSize
      //   });
    }
  }
};
</script>