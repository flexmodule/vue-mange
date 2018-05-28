<template>
	<div class="container">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/standard-bussiness-data/user-message' }">全部用户</el-breadcrumb-item>
			<el-breadcrumb-item>{{$route.params.userID}}</el-breadcrumb-item>
			<el-breadcrumb-item>修改信息</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 筛选操作 end -->
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>基本信息</span>
			</div>
			<div class="text item">
				<el-row class="row">
					<el-col :span="8">
						<div class="flex">
							姓名：
							<el-input class="input" v-model="userName" placeholder="姓名"></el-input>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="flex">
							联系电话：
							<el-input class="input" v-model="tel" placeholder="电话"></el-input>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="flex">
							性别：
							<el-input class="input" v-model="sex" placeholder="性别"></el-input>
						</div>
					</el-col>
				</el-row>
				<el-row class="row">
					<el-col :span="8">
						<div class="flex">
							年龄：
							<el-input class="input" v-model="age" placeholder="年龄"></el-input>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="flex">
							身份证号：
							<el-input class="input" v-model="ID" placeholder="身份证"></el-input>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="flex">
							单位信息：
							<el-input class="input" v-model="unit" placeholder="单位信息"></el-input>
						</div>
					</el-col>
				</el-row>
			</div>
			<div class="submit">
				<el-button type="primary" icon="el-icon-search" @click="edit">保存</el-button>
			</div>
		</el-card>
	</div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
}
.flex {
  display: flex;
}
.input {
  width: 60%;
}
.row {
  margin-bottom: 20px;
}
</style>

<script>
export default {
  data() {
    return {
      userName: "王大锤", //体检人姓名
      tel: "13732231826", //电话
      sex: "男",
      age: 18,
      ID: "33031234569874526589",
      unit: "杭州势成科技"
    };
  },
  mounted() {
    this.fetch(this.$route.params.userID);
  },
  methods: {
    //获取用户信息
    fetch: function(id) {
      //this.$http.get('http://192.168.137.85:9999//stantard-bussiness/user/checkup/' + id).then((res) => {
      this.$http
        .get("/stantard-bussiness/user/checkup/" + id)
        .then(res => {
          //console.log(res.data)
          this.userName = res.data.data.realName;
          this.tel = res.data.data.mobileNo;
          this.sex = res.data.data.sex;
          this.age = res.data.data.age;
          this.ID = res.data.data.identityNo;
          this.unit = res.data.data.enterpriseName;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //修改用户信息
    edit: function() {
      //this.$http.put('http://192.168.137.85:9999/stantard-bussiness/user/' + this.$route.params.userID,{
      this.$http
        .put("/stantard-bussiness/user/" + this.$route.params.userID, {
          realName: this.userName,
          mobileNo: this.tel,
          sex: this.sex,
          age: this.age,
          identityNo: this.ID,
          enterpriseName: this.unit
        })
        .then(res => {
          if (res.data.rc === 0) {
            this.$message({
              message: "修改成功！",
              type: "success"
            });
            this.$router.go(-1);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>