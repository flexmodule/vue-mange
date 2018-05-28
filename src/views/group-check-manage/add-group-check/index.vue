<template>
	<div class="container">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/group-check-manage/index'}">团检企业</el-breadcrumb-item>
      <el-breadcrumb-item v-if="groupId">修改团检信息</el-breadcrumb-item>
      <el-breadcrumb-item v-else>添加团检</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card class="box-card">
			<div slot="header" class="header">
				<span>基本信息</span>
				<el-button @click="dialogVisible = true">选择企业</el-button>
			</div>
			<div class="info" v-if="companyId">
				<ul>
					<li class="title">
						<p>
							<span>企业名称：</span>
							{{companyName}}
						</p>
					</li>
					<li>
						<p>
							<span>所在省市：</span>
							{{companyArea}}
						</p>
						<p>
							<span>联系人：</span>
							{{contactPerson}}
						</p>
					</li>
					<li>
						<p>
							<span>企业地址：</span>
							{{companyAddress}}
						</p>
						<p>
							<span>联系方式：</span>
							{{companyTel}}
						</p>
					</li>
					<li>
						<p>
							<span>企业规模：</span>
							{{companyScale}}
						</p>
					</li>
					<li>
						<p>
							<span>企业性质：</span>
							{{companyType}}
						</p>
					</li>
				</ul>
			</div>
		</el-card>
		<el-card class="box-card" v-if="companyId">
			<div slot="header">
				<span>本次体检配置</span>
			</div>
			<div class="deploy">
				<div class="flex mb10">
					<p>企业团检日期：</p>
					<el-date-picker :disabled="$route.query.groupId && !isBind" v-model="selectedDate" type="daterange" range-separator="至" :start-placeholder="startPlaceholder" :end-placeholder="endPlaceholder" @change="selectDate">
					</el-date-picker>
				</div>
				<div class="flex mb10">
					<p>
						<span>团检可预约日期间隔：</span>
						<el-input v-model="spacingDate"></el-input>
						<span>天</span>
					</p>
				</div>
				<div class="mb10 tip">
					<p>例如：当天是1号如果设置间隔2天可以预约4号的体检</p>
				</div>
				<div class="flex">
					<p>体检套餐详情：</p>
					<el-radio v-model="radio" label="0">展示</el-radio>
					<el-radio v-model="radio" label="1">不展示</el-radio>
				</div>
			</div>
		</el-card>
		<div v-if="companyId && isBind">
			<el-button type="success" @click="handleSubmit">确认</el-button>
		</div>

		<!--选择企业-->
		<el-dialog title="选择企业" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
			<span>企业名称</span>
			<el-select v-model="companyInfo" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading" @change="selectCompany">
				<el-option v-for="item in companyInfoList" :key="item.value" :label="item.name" :value="JSON.stringify(item)">
				</el-option>
			</el-select>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitSelect">确 定</el-button>
			</span>
		</el-dialog>

	</div>
</template>

<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .info {
    ul li {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      font-size: 16px;
      &.title {
        font-weight: bold;
      }
      p {
        width: 50%;
      }
    }
  }
  .deploy {
    p {
      margin-right: 20px;
    }
    .el-input__inner {
      width: 400px;
    }
    .el-input {
      width: 50px;
    }
    .tip {
      color: #acacac;
    }
  }
}
.el-range-separator {
  width: auto;
}
</style>

<script>
export default {
  data() {
    return {
      groupId: null,
      companyId: null,
      companyName: "",
      companyArea: "",
      contactPerson: "",
      companyAddress: "",
      companyTel: "",
      companyScale: "",
      companyType: "",

      selectedDate: [],
      startAt: "",
      endAt: "",
      spacingDate: "",
      radio: "0",
      startPlaceholder: "开始日期",
      endPlaceholder: "结束日期",
      dialogVisible: false,
      loading: false,
      companyInfoList: [],
      companyInfo: "",
      isBind: true,
    };
  },
  mounted() {
    if (this.$route.query.groupId) {
      this.companyId = this.$route.query.companyId;
      this.groupId = this.$route.query.groupId;
      this.getData();
    }
  },
  methods: {
    getData() {
      const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
      this.$http
        .get("/group-check-manage/group-order/" + this.groupId)
        .then(res => {
          loading.close();
          this.companyName = res.data.data.enterpriseName;
          this.startPlaceholder = res.data.data.checkupStartAt;
          this.endPlaceholder = res.data.data.checkupEndAt;
          this.startAt = new Date(res.data.data.checkupStartAt);
          this.endAt = new Date(res.data.data.checkupEndAt);
          this.isBind = res.data.data.isBind;
          if (res.data.data.showSetMealInfo == true) {
            this.radio = "0";
          } else {
            this.radio = "1";
          }
          this.spacingDate = res.data.data.minBookDays;
        })
        .catch(err => {
          loading.close();
        });

      this.$http
        .get("/group-check-manage/company-info/" + this.companyId)
        .then(res => {
          this.companyArea =
            res.data.data.province +
            " " +
            res.data.data.city +
            " " +
            res.data.data.district;
          this.contactPerson = res.data.data.contact;
          this.companyAddress = res.data.data.address;
          this.companyTel = res.data.data.phone;
          this.companyScale = res.data.data.scale + "人";
          this.companyType = res.data.data.type;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //选择企业
    selectCompany(val) {
      //console.log(this.companyInfo);
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        this.$http
          .get("/group-check-manage/company-info/list/", {
            params: {
              name: query
            }
          })
          .then(res => {
            this.companyInfoList = res.data.data.resultList;
            this.loading = false;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.companyInfoList = [];
      }
    },
    submitSelect() {
      if( this.companyInfo ){
        var companyInfo = JSON.parse(this.companyInfo);
        this.companyId = companyInfo.id;
        this.companyName = companyInfo.name;
        this.companyArea =
          companyInfo.province +
          " " +
          companyInfo.city +
          " " +
          companyInfo.district;
        this.contactPerson = companyInfo.contact;
        this.companyAddress = companyInfo.address;
        this.companyTel = companyInfo.phone;
        this.companyScale = companyInfo.scale + "人";
        this.companyType = companyInfo.type;
        this.dialogVisible = false;
        this.selectedDate = [];
        this.startPlaceholder = "开始日期";
        this.endPlaceholder = "结束日期";
        this.spacingDate = "";
      }else{
        this.$message.error("请选择企业");
      }
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
    selectDate(val) {
      if (val == null || val.length == 0) {
        this.startAt = "";
        this.endAt = "";
        this.startPlaceholder = "开始日期";
        this.endPlaceholder = "结束日期";
      } else {
        this.startAt = this.format(val[0]);
        this.endAt = this.format(val[1]);
      }
    },
    handleSubmit() {
      if (this.radio == 0) {
        var isShow = true;
      } else if (this.radio == 1) {
        var isShow = false;
      }
      if (this.groupId) {
        this.$http
          .post("/group-check-manage/group-order/update", {
            id: this.groupId,
            enterpriseId: this.companyId,
            enterpriseName: this.companyName,
            checkupStartAt: this.startAt,
            checkupEndAt: this.endAt,
            showSetMealInfo: isShow,
            minBookDays: this.spacingDate
          })
          .then(res => {
            if (res.data.rc == 0) {
              this.$message.success("修改成功");
              this.$router.go(-1);
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$http
          .post("/group-check-manage/group-order/add", {
            enterpriseId: this.companyId,
            enterpriseName: this.companyName,
            checkupStartAt: this.startAt,
            checkupEndAt: this.endAt,
            showSetMealInfo: isShow,
            minBookDays: this.spacingDate
          })
          .then(res => {
            if (res.data.rc == 0) {
              this.$message.success("增加成功");
              this.$router.push(
                "/group-check-manage/group-check-detail/" + res.data.data.id
              );
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
};
</script>

