<template>
	<div class="container">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/standard-bussiness-data/user-message' }">全部用户</el-breadcrumb-item>
			<el-breadcrumb-item>详情</el-breadcrumb-item>
		</el-breadcrumb>
		<div v-loading="loading">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>用户信息</span>
				</div>
				<div class="text item">
					<el-row>
						<el-col :span="8">
							<div>用户id：{{userID}}</div>
						</el-col>
						<el-col :span="8">
							用户昵称：{{nickName}}
						</el-col>
						<el-col :span="8">
							注册手机：{{tel}}
						</el-col>
					</el-row>
				</div>
			</el-card>
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>体检报告</span>
				</div>
				<div class="text item">
					<el-table :data="repostList" style="width: 100%">
						<el-table-column prop="reportName" label="报告名称" width="180">
						</el-table-column>
						<el-table-column prop="realName" label="体检者" width="180">
						</el-table-column>
						<el-table-column prop="mobileNo" label="联系电话">
						</el-table-column>
						<el-table-column prop="identityNo" label="身份证号">
						</el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button size="mini" type="primary" @click="$router.push('/standard-bussiness-data/user-edit/' + scope.row.id)">修改信息</el-button>
								<!-- <a :href="href" :download="scope.row.reportName" @click="downPDF(scope.row.srcFileId)">下载</a> -->
								<el-button size="mini" type="primary" @click="showPDF(scope.row.srcFileId)">查看</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</el-card>
      <div class="opeartion">
         <el-button type="primary" @click="$router.push(`/standard-bussiness-data/user-message`)">返回</el-button> 
      </div>
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
  data() {
    return {
      userID: "", //用户id
      nickName: "", //用户名
      tel: "", //手机
      repostList: [], //体检报告列表
      href: "", //体检报告url
      loading: true
    };
  },
  mounted() {
    this.detail(this.$route.params.userID);
  },
  methods: {
    detail: function(userId) {
      //this.$http.get('http://192.168.137.85:9999/stantard-bussiness/user/' + userId).then((res) => {
      this.$http
        .get("/stantard-bussiness/user/" + userId)
        .then(res => {
          this.loading = false;
          if (res.data.rc === 0) {
            this.userID = res.data.data.baseMessage.id;
            this.nickName = res.data.data.baseMessage.nickName;
            this.tel = res.data.data.baseMessage.mobileNo;
            this.repostList = res.data.data.repostList;
          } else {
            this.$message.error(res.data.msg);
          }
          //console.log(this.repostList)
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
          this.$message.error(error);
        });
    },
    //查看PDF
    showPDF: function(fildId) {
      //this.$http.get('http://192.168.137.85:9999/stantard-bussiness/user/download/' + fildId).then((res) => {
      this.$http
        .get("/stantard-bussiness/user/download/" + fildId)
        .then(res => {
          //console.log(res.data)
          this.href = res.data.data.url;
          window.open(res.data.data.url);
        })
        .catch(error => {
          console.log(error);
        });
    },
    //下载PDF
    downPDF: function(fildId) {
      //this.$http.get('http://192.168.137.85:9999/stantard-bussiness/user/download/' + fildId).then((res) => {
      this.$http
        .get("/stantard-bussiness/user/download/" + fildId)
        .then(res => {
          console.log(res.data);
          this.href = res.data.data.url;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>