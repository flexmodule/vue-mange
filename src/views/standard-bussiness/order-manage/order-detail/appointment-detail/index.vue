<template>
	<div class="container">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/standard-bussiness-data/order-manage' }">订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>预约详情</el-breadcrumb-item>
		</el-breadcrumb>
		<div v-loading="loading">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>用户信息</span>
				</div>
				<div class="info base">
					<div class="leftInfo infoItem">
						<ul class="baseMessage">
							<li>
								<el-row>
									<el-col :span="12">
										<span>姓名：</span>
										<span>{{reservationPartyInfo.name}}</span>
									</el-col>
									<el-col :span="12">
										<span>身份证：</span>
										<span>{{reservationPartyInfo.identity}}</span>
									</el-col>
								</el-row>
							</li>
							<li>
								<el-row>
									<el-col :span="12">
										<span>联系电话：</span>
										<span>{{reservationPartyInfo.mobileNo}}</span>
									</el-col>
									<el-col :span="12">
										<el-row width="100%">
											<el-col :span="12" style="margin-right:10px;">
												<span>性别：</span>
												<span>{{IdCard(identityNum,2)}}</span>
											</el-col>
											<el-col :span="12">
												<span style="width:50px;">年龄：</span>
												<span>{{IdCard(identityNum,3)}}</span>
											</el-col>
										</el-row>
									</el-col>
								</el-row>
							</li>
							<li v-if="reservationInfo.ReservationType  === 1">
								<span>所属单位：</span>
								<span></span>
							</li>
							<li>
								<span>用户分类：</span>
								<span>个检</span>
							</li>
							<li>
								<span>预约发起时间：</span>
								<span>{{reservationPartyInfo.createdAt}}</span>
							</li>
						</ul>
					</div>
					<div class="rightInfo infoItem">
						<h3>预约信息</h3>
						<ul class="appointmentDate">
							<li>
								<span>医院名称：</span>
								<span>{{reservationInfo.reservedPartyName}}</span>
							</li>
							<li>
								<span>套餐名称：</span>
								<span>{{reservationInfo.serviceItemName}}</span>
							</li>
							<li>
								<span>套餐编码：</span>
								<span>{{reservationInfo.serviceItemId}}</span>
							</li>
							<li>
								<span>预约时间：</span>
								<span>{{reservationInfo.reservationTime}}</span>
							</li>
						</ul>
						<p>
							<span>备注：</span>
							<span>{{reservationInfo.mark}}</span>
						</p>
					</div>
				</div>
			</el-card>
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>体检项目</span>
				</div>
				<div>
					<h4>项目名称</h4>
					<ul class="physicalItem">
						<li v-for="item in serviceItemDetail" :key="item.name">{{item.name}}</li>
					</ul>
				</div>
			</el-card>
		</div>
		<div>
			<el-button size="small" type="primary" @click="$router.go(-1)">返回</el-button>
		</div>
	</div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
  .info {
    display: flex;
    justify-content: space-between;
  }
}
.infoItem {
  padding: 10px 20px;
  h3 {
    text-align: center;
  }
  div {
    display: flex;
    align-items: center;
    margin: 5px 0;
    p {
      width: 100px;
      margin-right: 10px;
    }
  }
}
.noPDFReport {
  width: 200px;
  padding: 20px;
  text-align: center;
  border: 1px solid #ddd;
  margin: 0 auto;
}
.baseMessage {
  li {
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
  }
}
.appointmentDate {
  li {
    padding: 10px 0;
  }
}
.changeAppointmentMessage {
  color: #778ef2;
}
.physicalItem {
  li {
    padding: 8px 0;
    border-bottom: 2px solid #ddd;
  }
}
.leftInfo {
  flex: 1;
}
.rightInfo {
  border: 1px solid #000;
  flex: 1;
}
.introduction,
.location {
  display: flex;
  flex-direction: column;
  div {
    display: flex;
    align-items: center;
    margin: 5px 0;
  }
  p {
    width: 80px;
    margin-right: 10px;
  }
  .el-cascader,
  .el-input,
  .el-textarea {
    width: 500px;
  }
  .introArea {
    align-items: flex-start;
    p {
      margin-top: 5px;
    }
  }
}
.file-container {
  position: relative;
  width: 200px;
  height: 200px;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
}
/* 标签样式start */
.el-tag {
  margin-right: 10px;
}
.button-new-tag {
  margin-right: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.introduction .input-new-tag {
  width: 120px;
  vertical-align: bottom;
}
</style>
<script>
export default {
  name: "AppointmentDetail",
  data() {
    return {
      reservationPartyInfo: {}, //用户信息
      reservationInfo: {}, //预约信息
      serviceItemDetail: [], //体检项目
      loading: true,
      identityNum: "", //身份证号
    };
  },
  mounted() {
    this.detail(this.$route.params.orderId);
  },
  methods: {
    //预约详情
    detail: function(id) {
      this.$http
        .get("/manage/reservation/checkup/" + id)
        .then(res => {
          this.loading = false;
          console.log(res.data)
          if (res.data.rc === 0) {
            this.reservationPartyInfo = res.data.data.reservationPartyInfo;
            this.reservationInfo = res.data.data.reservationInfo;
            this.serviceItemDetail = res.data.data.serviceItemDetail.content;
            this.identityNum = res.data.data.reservationPartyInfo.identity;
          } else {
            this.$message.error(res.data.msg);
          }
          //console.log(res.data.data)
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
          this.$message.error(error);
        });
    },
     //根据身份证判断年龄性别
    IdCard: function(UUserCard, num) {
      //console.log(UUserCard)
      if (num == 1) {
        //获取出生日期
        birth =
          UUserCard.substring(6, 10) +
          "-" +
          UUserCard.substring(10, 12) +
          "-" +
          UUserCard.substring(12, 14);
        return birth;
      }
      if (num == 2) {
        //获取性别
        //console.log(parseInt(UUserCard.substr(16, 1)))
        if (UUserCard.length === 15) {
          if (parseInt(UUserCard.substr(14, 1)) % 2 == 1) {
            //男
            return "男";
          } else {
            //女
            return "女";
          }
        } else if (UUserCard.length === 18) {
          if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
            //男
            return "男";
          } else {
            //女
            return "女";
          }
        }
      }
      if (num == 3) {
        //获取年龄
        var myDate = new Date();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
        if (
          UUserCard.substring(10, 12) < month ||
          (UUserCard.substring(10, 12) == month &&
            UUserCard.substring(12, 14) <= day)
        ) {
          age++;
        }
        return age;
      }
    },

  }
};
</script>