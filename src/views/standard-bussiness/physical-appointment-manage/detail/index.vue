<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-bussiness-data/person-check' }" v-if="isShow">个检预约管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-bussiness-data/group-check' }" v-else>团检预约管理</el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div v-loading="loading">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>体检人信息</span>
        </div>
        <div class="info base">
          <div class="leftInfo infoItem">
            <ul class="baseMessage">
              <li>
                <el-row>
                  <el-col :span="12">
                    <span>体检人：</span>
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
                      <div style="margin-right:20px;">
                        <span>性别：</span>
                        <span>{{IdCard(identityNum,2)}}</span>
                      </div>
                      <div>
                        <span>年龄：</span>
                        <span>{{IdCard(identityNum,3)}}</span>
                      </div>
                    </el-row>
                  </el-col>
                </el-row>
              </li>
              <li v-if="reservationType != 0">
                <span>所属单位：</span>
                <span>{{reservationInfo.enterpriseName}}</span>
              </li>
              <li>
                <span>用户分类：</span>
                <span>{{reservationType === 0 ? '个检' : '团检'}}</span>
                <mark v-if="end">已截止</mark>
              </li>
              <li>
                <span>预约发起时间：</span>
                <span>{{reservationPartyInfo.createdAt}}</span>
              </li>
              <li>
                <span>预约单号：</span>
                <span>{{$route.params.appointId}}</span>
              </li>
              <li>
                <span>订单编号：</span>
                <span>{{orderNo}}</span>
              </li>
              <li v-if="isFailure">
                <span>预约失败：</span>
                <span>{{this.reason}}</span>
              </li>
            </ul>
            <div class="data-submit">
              <!-- <span>{{state}}</span> -->
              <!-- <span v-if="!isCancle"> -->
              <span>
                <!-- <el-button type="success" v-if="signDone" @click="alreadyDone">标为已完成</el-button> -->
                <!-- <el-button type="primary" v-if="!signDone" @click="dialogAppoint = true">标为已预约</el-button> -->
                <el-button type="primary" v-if="subscribe" @click="dialogAppoint = true">标为已预约</el-button>
                <el-button type="primary" v-if="rebook" @click="bookInfo = true">重新预约</el-button>
                <el-button type="danger" @click="dialogCancle = true" v-if="isCancle">取消预约</el-button>
              </span>
              <el-button type="info" disabled v-if="hint">{{orderStatus}}</el-button>
            </div>
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
                <div>
                  <div>
                    <span>预约时间：</span>
                  </div>
                  <div>
                    <el-date-picker v-model="appointDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :clearable="false" :focus="true" :disabled="state === 2" @change="dateChange">
                    </el-date-picker>
                  </div>
                </div>
              </li>
              <li class="flex">
                <span class="mark">备注：</span>
                <div v-if="!isChange">
                  <span>{{mark}}</span>
                  <span class="changeAppointmentMessage" @click="isChange = true">修改</span>
                </div>
                <div v-else>
                  <div class="text-wrap">
                    <el-input type="textarea" :rows="4" v-model="mark"></el-input>
                  </div>
                  <el-button @click="changeMark">保存</el-button>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!-- 标为已预约对话框 -->
        <el-dialog title="提示" :visible.sync="dialogAppoint" width="30%">
          <span>确定已经帮该用户预约了吗？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogAppoint = false">取 消</el-button>
            <el-button type="primary" @click="signAppoint">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 取消预约对话框 -->
        <el-dialog title="提示" :visible.sync="dialogCancle" width="30%" center>
          <span>是否需要给用户退款？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="refoundNo">否</el-button>
            <el-button type="primary" @click="cancleAppoint">是</el-button>
          </span>
        </el-dialog>
        <!-- 标为已完成弹窗 -->
        <!-- <el-dialog title="提示" :visible.sync="noPDF" width="30%">
          <span>该用户尚未上传体检报告！</span>
          <div class="mt10">
            <el-checkbox v-model="checked">医院无法提供电子报告</el-checkbox>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="noPDF = false">取 消</el-button>
            <el-button type="primary" @click="hosNoPdf">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="dialogdone" width="30%">
          <span>确定该用户体检流程已完成吗？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogdone = false">取 消</el-button>
            <el-button type="primary" @click="sureAppointDone">确 定</el-button>
          </span>
        </el-dialog> -->
        <!-- 修改时间预约时间 -->
        <el-dialog title="提示" :visible.sync="dialogDate" width="30%">
          <span>你确定要帮用户改变预约时间吗？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancleChangeDate">取 消</el-button>
            <el-button type="primary" @click="sureChangeDate()">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 重新预约 -->
        <el-dialog title="预约信息" :visible.sync="bookInfo" width="30%">
          <!-- <span>你确定要帮用户改变预约时间吗？</span> -->
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
                <div>
                  <div>
                    <span>预约时间：</span>
                  </div>
                  <div>
                    <el-date-picker v-model="appointDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :clearable="false" :focus="true" :disabled="state === 2" @change="rebookDateChange">
                    </el-date-picker>
                  </div>
                </div>
              </li>
            </ul>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancelRebook">取 消</el-button>
            <el-button type="primary" @click="sureChangeDate(true)">确 定</el-button>
          </span>
        </el-dialog>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>体检项目</span>
        </div>
        <div>
          <h4>项目名称</h4>
          <ul class="physicalItem">
            <li v-for="item in serviceItemDetail" :key="item.id">{{item.name}}</li>
          </ul>
        </div>
      </el-card>
      <!-- 体检报告 没报告时-->
      <el-card class="box-card" v-if="upPDF">
        <div slot="header" class="clearfix">
          <span>体检报告</span>
        </div>
        <div class="img-container logo-img">
          <file-input v-on:fileInfo="getLogoImg" :private="'1'" fileType="file"></file-input>
        </div>
      </el-card>
      <!-- 体检报告 有报告时-->
      <el-card class="box-card" v-if="alreadyHasPDF">
        <div slot="header" class="clearfix">
          <span>体检报告</span>
        </div>
        <div class="flex" style="justify-content:space-between;">
          <div>{{fileName}}</div>
          <el-button type="primary" @click="showPDF">查看报告</el-button>
        </div>
      </el-card>
      <!-- 体检报告 无-->
      <el-card class="box-card" v-if="hasNotPDF">
        <div slot="header" class="clearfix">
          <span>体检报告</span>
        </div>
        <div class="noPDFReport">
          <span>医院无法提供电子报告</span>
        </div>
      </el-card>
      <div class="opeartion">
         <el-button type="primary" @click="$router.go(-1)">返回</el-button> 
      </div>
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
    &.flex-start {
      align-items: flex-start;
    }
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
  margin-bottom: 5px;
  li {
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
  }
}
.appointmentDate {
  li {
    padding: 10px 0;
    &.flex {
      display: flex;
      align-items: flex-start;
      .mark {
        width: 60px;
      }
      div {
        width: 100%;
        display: block;
        .text-wrap {
          width: 100%;
          margin-bottom: 10px;
        }
      }
    }
  }
}
.changeAppointmentMessage {
  color: #778ef2;
}
.physicalItem {
  li {
    padding: 8px 0;
    border-bottom: 1px solid #ddd;
  }
}
.leftInfo {
  flex: 1;
}
.rightInfo {
  border: 1px solid #000;
  flex: 1;
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
.img-container {
  position: relative;
  width: 200px;
  height: 200px;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
}
</style>
<script>
const fileInput = () => import("@/components/fileInput/index");
export default {
  components: {
    fileInput
  },
  data() {
    return {
      reservationPartyInfo: {}, //个人信息
      reservationInfo: {}, //预约信息
      serviceItemDetail: [], //体检项目
      state: null, //预约状态

      rebook:false,//重新预约
      dialogDate: false, //修改日期对话框
      dialogAppoint: false, //标为已预约对话框
      dialogCancle: false, //取消预约对话框
      dialogdone: false, //标为已完成对话框
      checked: false, //医院无法提供电子报告
      bookInfo:false,//重新预约对话框
      //signDone: false, //标为已完成
      subscribe:false,//标为已预约
      isCancle: false, //已取消
      hint:false,//提示框
      orderStatus: "", //订单取消或完成

      noPDF: false, //医院无法提供电子报告
      appointDate: "", //预约时间
      defaultDate: "", //默认预约时间
      showLogoImg: "", //上传图片
      value1: "",
      hosName: "", //医院名称-上传pdf

      hasReport: null, //预约完成时，有无报告

      upPDF: false, //上传体检报告
      alreadyHasPDF: false, //有pdf并且已经上传
      hasNotPDF: false, //医院无法提供PDF

      fileName: "", //体检报告名称
      fileId: "", //文件id

      url: "", //体检报告url

      loading: false,

      reservationType: "", //用户分类
      identityNum: "", //身份证号
      mark: "", //备注
      orderNo: "",
      isChange: false,

      isShow:false,
      end:false,//已截止显示和隐藏
      isFailure:false,//预约失败栏
      isShowReason:false,//查看理由提示框
      reason:""//理由
    };
  },
  mounted() {
    this.fetchDetail();
    console.log(this.$route.params.orderId)
    console.log(this.$route.params.fromOps)
    // if(this.$route.params.fromOps  == "0"){
    //   //个检
    //   this.isShow = true
    // }else{
    //   //团检
    //   this.isShow = false
    // }
    //this.timeDiff("2018-04-25")
  },
  watch: {
    state: function(val) {
      if (val === 0) {
        this.upPDF = false;
        this.alreadyHasPDF = false;
        this.hasNotPDF = false;
      } else if (val === 1) {
        //this.upPDF = true;
        if (this.hasReport === 0) {
          //console.log('有报告')
          this.upPDF = false;
          this.alreadyHasPDF = true;
          this.hasNotPDF = false;
        } else if (this.hasReport === 1) {
          //console.log("无报告");
          this.upPDF = true;
          this.alreadyHasPDF = false;
          this.hasNotPDF = false;
        } else {
          this.upPDF = true;
          this.alreadyHasPDF = false;
          this.hasNotPDF = false;
        }
      } else if (val === 2) {
        //console.log(this.checked)
        if (this.checked) {
          this.hasNotPDF = true;
          this.upPDF = false;
          this.alreadyHasPDF = false;
        } else {
          this.upPDF = false;
        }
      }else if (val === 3) {
          this.upPDF = false;
          this.alreadyHasPDF = true;
      }else if (val === 4) {
          this.upPDF = false;
          this.alreadyHasPDF = false;
      }else if (val === 5) {
          this.upPDF = false;
          this.alreadyHasPDF = false;
      }else if (val === 6) {
          this.upPDF = false;
          this.alreadyHasPDF = false;
      }
    }
  },
  methods: {
    //详情
    fetchDetail: function() {
      this.loading = true;
      this.$http
        .get("/manage/reservation/checkup/" + this.$route.params.orderId)
        .then(res => {
          this.loading = false;
          //console.log(res.data.data);
          if (res.data.rc === 0) {
            this.reason = res.data.data.reservationPartyInfo.cancellReason;
            //console.log(this.reason)
            this.reservationPartyInfo = res.data.data.reservationPartyInfo;
            this.reservationInfo = res.data.data.reservationInfo;
            this.serviceItemDetail = res.data.data.serviceItemDetail.content;
            this.defaultDate = res.data.data.reservationInfo.reservationTime; //默认预约时间
            this.appointDate = res.data.data.reservationInfo.reservationTime; //预约时间
            this.hosName = res.data.data.reservationInfo.reservedPartyName;

            this.hasReport = res.data.data.reservationPartyInfo.hasReport;

            this.reservationType = this.reservationPartyInfo.reservationType;
            if(this.reservationType == 0){
              this.isShow = true
            }else{
              this.isShow = false
            }
            //console.log(this.hasReport)
            this.identityNum = res.data.data.reservationPartyInfo.identity;
            this.orderNo = res.data.data.reservationPartyInfo.orderNo;
            this.mark = res.data.data.reservationInfo.mark;
            if (this.hasReport === 0) {
              this.fetchPDF();
            }
            //console.log(typeof(res.data.data.hospSupport))
            if(res.data.data.hospSupport){
              //console.log("1不支持医院")
            }else{
              //console.log("0支持医院")
            }

            this.state = this.reservationPartyInfo.state;
            //console.log(this.state);
            if (this.state === 0) {
              //this.signDone = false;
              this.isCancle = true;
              this.subscribe = true; 
              this.rebook = false;
            } else if (this.state === 1) {
              //this.signDone = true;
              this.isCancle = true;
              this.subscribe = false; 
              this.rebook = false;
              if( this.reservationType  == 1 ){
                  this.timeDiff(this.appointDate)
              }
            } else if (this.state === 2) {
              // this.isCancle = true;
              // this.orderStatus = "订单已完成";
              
              // if (this.hasReport === 0) {
              //   this.upPDF = false; //上传体检报告
              //   this.alreadyHasPDF = true; //有pdf并且已经上传
              //   this.hasNotPDF = false; //医院无法提供PDF
              // } else if (this.hasReport === 1) {
              //   console.log(1);
              //   this.upPDF = false; //上传体检报告
              //   this.alreadyHasPDF = false; //有pdf并且已经上传
              //   this.hasNotPDF = true;
              // }
              this.isCancle = false;
              this.subscribe = false; 
              this.rebook = false;
            }else if (this.state == 3){
              //this.isCancle = true
              this.isCancle = false;
              this.subscribe = false; 
              this.hint = true;
              this.orderStatus = "完成";
            }else if(this.state == 4){
              this.isCancle = false;
              this.subscribe = false; 
              this.hint = true;
              this.orderStatus = "已取消";
            }else if (this.state === 5) {
              // this.isCancle = true;
              // this.orderStatus = "已取消";
              this.isFailure = true;
              if(this.reservationType  == 1){
                this.isCancle = true
                this.rebook = false
                this.hint = false
              }else{
                //console.log("个检预约失败")
                this.isCancle = true
                this.rebook = true
                this.hint = false
              }
              
            }else if(this.state == 6){
              this.isCancle = true;
              this.subscribe = false; 
              this.rebook = false;
              if( this.reservationType  == 1 ){
                  this.timeDiff(this.appointDate)
              }
            }
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
          this.$message.error(error);
        });
    },
    getLogoImg(fileInfo) {
      //获取formData对象
      //console.log(fileInfo);
      this.fileName = fileInfo.fileName;
      this.fileId = fileInfo.fileId;
      this.$http
        .get("/checkup/uploadPdf", {
          params: {
            hospitalName: this.hosName,
            fileId: fileInfo.fileId,
            orderId: this.$route.params.orderId
          }
        })
        .then(res => {
          //console.log(res.data.rc)
          if (res.data.rc === 0) {
            this.upPDF = false;
            this.alreadyHasPDF = true;
            this.hasNotPDF = false;

            this.changeSate(3, 0,"");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //日历聚焦
    dateChange: function(val) {
      if (this.appointDate === this.defaultDate) {
        return;
      } else {
        this.dialogDate = true;
      }
    },
    //重新预约日历聚焦
    rebookDateChange:function(val){
      
      //console.log(val)
    },
    //确定修改预约日期，向用户发送短信
    sureChangeDate: function(reReserve) {
      console.log(reReserve)
      this.bookInfo = false;
      this.dialogDate = false;
      //console.log(this.defaultDate)
      //console.log(this.appointDate)
      this.$http
        .put(
          "/manage/reservation/checkup/" +
            this.$route.params.orderId +
            "/date?reservationTime=" +
            this.appointDate +
            "/reReserve" + reReserve
        )
        .then(res => {
          //console.log(res.data.rc)
          if (res.data.rc === 0) {
            if(reReserve){
              this.$message({
                message: "重新预约成功！",
                type: "success"
              });
              this.changeSate(1,'','')
              // this.fetchDetail()
              // this.rebook = false;
              // this.isCancle = true;
              // this.subscribe = false;
            }else{
              this.$message({
                message: "预约日期修改成功！",
                type: "success"
              });
            }
            
          } else {
            if(reReserve){
              this.$message.error("预约日期修改失败");
              this.appointDate = this.defaultDate;
            }else{
              this.$message.error("重新预约失败");
              this.appointDate = this.defaultDate;
            }
            
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //取消修改预约日期
    cancleChangeDate: function() {
      this.dialogDate = false;
      this.appointDate = this.defaultDate;
    },
    //取消重新预约
    cancelRebook:function(){
      this.bookInfo = false
      this.appointDate = this.defaultDate;
    },
    //预约状态修改
    changeSate: function(state, hasReport,needRefund) {
      this.$http
        .put(
          "/manage/reservation/checkup/" +
            this.$route.params.orderId +
            "/state?state=" +
            state +
            "&hasReport=" +
            hasReport +
            "&needRefund=" +
            needRefund
        )
        .then(res => {
          console.log(res.data)
          //console.log(res.data.rc);
          if (res.data.rc === 0) {
            // this.$message({
            //   message: "预约状态修改成功！",
            //   type: "success"
            // });
            // this.signDone = true;
            this.dialogAppoint = false;
            this.fetchDetail();
          } else {
            this.$message.error("预约状态修改失败");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //确定标为已预约   状态为0-待预约1
    signAppoint: function() {
      //console.log(11111)
      this.changeSate(1, "","");
      //this.isCancle = true;
    },
    //取消预约
    
    refoundNo:function(){
      this.dialogCancle = false
      this.isCancle = false
      this.hint = true
      this.rebook = false
      this.orderStatus = "已取消"
      this.changeSate(4, "","");
    },
    cancleAppoint: function() {
      this.dialogCancle = false;
      this.rebook = false
      this.isCancle = false
      this.hint = true
      this.orderStatus = "已取消"
      this.changeSate(4, "",true);
    },
    //重新预约
    rebookClick:function(){
      this.bookInfo = true
    },
    //标为已完成
    alreadyDone: function() {
      //有pdf时提示流程是否完成
      if (this.fileName != "") {
        this.alreadyHasPDF = true;
        this.dialogdone = true;
      } else if (this.hasNotPDF) {
        this.dialogdone = true;
      } else {
        this.noPDF = true;
      }
    },
    //确定状态完成
    sureAppointDone: function() {
      this.dialogdone = false;
      this.isCancle = true;
      this.orderStatus = "订单已完成";
      //console.log(this.checked);
      if (this.checked) {
        this.changeSate(2, 1,"");
      } else {
        this.changeSate(2, 0,"");
      }
    },
    //医院无法提供电子报告
    hosNoPdf: function() {
      //console.log(this.checked);
      if (this.checked) {
        this.hasNotPDF = true;
        this.upPDF = false;
        this.alreadyHasPDF = false;

        this.dialogdone = false;
        this.isCancle = true;
        this.orderStatus = "订单已完成";

        this.changeSate(2, 1,"");
      } else {
        this.hasNotPDF = false;
        this.upPDF = true;
        this.alreadyHasPDF = false;

        //this.changeSate(1, 0);
      }
      this.noPDF = false;
    },
    //获取pdf
    fetchPDF: function() {
      this.$http
        .get("/checkup/file/show/" + this.$route.params.orderId)
        .then(res => {
          //console.log(res.data);
          if (res.data.rc === 0) {
            //console.log(res.data.data);
            this.fileName = res.data.data.name;
            this.url = res.data.data.url;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //新页面查看PDF
    showPDF: function() {
      window.open(this.url);
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

    //修改备注
    changeMark: function() {
      this.$http({
        url:
          "/manage/reservation/checkup/" + this.$route.params.orderId + "/mark",
        method: "put",
        headers: { "Content-Type": "application/json" },
        data: this.mark
      })
        .then(res => {
          //console.log(res.data.rc);
          if (res.data.rc === 0) {
            this.$message({
              message: "修改成功！",
              type: "success"
            });
            this.isChange = false;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //计算时间差，判断是否截止
    timeDiff:function(dataJson){
      //var time = "2018-04-25"
      var replaceTime = new Date(dataJson.replace(/-/g,'/'))
      //console.log(time.replace(/-/g,'/'))
      var date = new Date()
      //console.log(date - replaceTime )
      if(parseInt( replaceTime - date) < 0){
        this.end = true;
      }else{
        this.end = false;
      }
      
    },
    resonClick:function(){
      this.isShowReason = true
    }
  }
  
};
</script>