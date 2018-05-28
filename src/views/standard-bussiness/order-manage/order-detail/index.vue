<template>
    <div class="container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <!-- <el-breadcrumb-item :to="{ path: '/standard-bussiness-data/order-manage' }">订单管理</el-breadcrumb-item> -->
            <el-breadcrumb-item :to="{ path: '/standard-bussiness-data/person-order' }" v-if="personOrder">个检订单管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/standard-bussiness-data/group-order' }" v-else>团检订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div v-loading="loading">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>交易信息</span>
                </div>
                <div class="info base">
                    <div class="leftInfo infoItem">
                        <ul class="baseMessage">
                            <li>
                                <el-row>
                                    <el-col :span="6">
                                        <span>订单编号:</span>
                                        <b>{{opsOrderInfo.orderNo}}</b>
                                    </el-col>
                                    <el-col :span="6">
                                        <span>原价：</span>
                                        <b>{{opsOrderInfo.totalAmount}}</b>
                                    </el-col>
                                    <el-col :span="6">
                                        <span>实际支付：</span>
                                        <b>{{opsOrderInfo.actualPaymentAmount}}</b>
                                    </el-col>
                                    <el-col :span="6">
                                        <span>业务类型：</span>
                                        <b>{{transType(opsOrderInfo.transactionType)}}</b>
                                    </el-col>
                                </el-row>
                            </li>
                            <li>
                                <span>优惠信息：</span>
                                <b>{{accountType(opsOrderInfo.paymentItemType)}}{{opsOrderInfo.paymentAmount}}</b>
                            </li>
                            <li>
                                <span>支付渠道：</span>
                                <b>{{payChannel(opsOrderInfo.paymentChannel)}}</b>
                            </li>
                            <li>
                                <span>订单来源：</span>
                                <b>{{orderFrom(opsOrderInfo.tradeType)}}</b>
                            </li>           
                            <li>
                                <span>成交时间：</span>
                                <b>{{opsOrderInfo.createTime}}</b>
                            </li>
                            <li>
                                <span>订单状态：</span>
                                <b>{{orderState(opsOrderInfo.state)}}</b>
                            </li>
                            <li v-if="opsOrderInfo.state === 5">
                                <span>退款时间：</span>
                                <b>{{refundRecordInfo.refundTime}}</b>
                            </li>
                            <li v-if="opsOrderInfo.state === 5">
                                <span>退款金额：</span>
                                <b>{{refundRecordInfo.refundAmount}}</b>
                            </li>
                            <li v-if="opsOrderInfo.state === 5">
                                <span>退款理由：</span>
                                <b>{{refundRecordInfo.refundReason}}</b>
                            </li>
                        </ul>
                        <div class="data-submit">
                            <el-button type="danger" @click="dialogFormVisible = true" v-if="refound">退款</el-button>
                            <!-- <el-button type="danger" @click="dialogFormVisible = true">退款</el-button> -->
                            <el-button type="info" disabled v-if="opsOrderInfo.state === 5">已退款</el-button>
                        </div>
                    </div>
                </div>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>用户信息</span>
                </div>
                <div>
                    <el-row>
                        <el-col :span="8">
                            <span>用户id:</span>
                            <b>{{userInfo.userId}}</b>
                        </el-col>
                        <el-col :span="8">
                            <span>用户名称:</span>
                            <b>{{userInfo.nickName}}</b>
                        </el-col>
                        <el-col :span="8">
                            <span>注册手机：</span>
                            <b>{{userInfo.mobileNo}}</b>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>业务信息</span>
                </div>
                <div>
                    <ul class="baseMessage">
                        <li>
                            <el-row>
                                <el-col :span="6">
                                    <span>预约编号:</span>
                                    <b>{{appointmentList.reservationNo}}</b>
                                </el-col>
                                <el-col :span="6">
                                    <span>姓名：</span>
                                    <b>{{appointmentList.name}}</b>
                                </el-col>
                                <el-col :span="6">
                                    <span>联系电话：</span>
                                    <b>{{appointmentList.mobileNo}}</b>
                                </el-col>
                                <el-col :span="6">
                                    <el-button size="small" type="primary" @click="$router.push('/standard-bussiness-data/order-detail/appointment-detail/' + appointmentList.reservationId)">详情</el-button>
                                </el-col>
                            </el-row>
                        </li>
                    </ul>
                </div>
            </el-card>
        </div>
        
        <div>
            <el-button size="small" type="primary" @click="$router.go(-1)">返回</el-button>
        </div>
        <!-- 退款弹窗 -->
        <el-dialog title="退款" :visible.sync="dialogFormVisible">
            <el-form>
                <el-form-item label="退款金额" :label-width="formLabelWidth">
                    <el-input v-model="refundAmount" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="退款理由" :label-width="formLabelWidth">
                    <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="refundReason">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="refund">提交</el-button>
            </div>
        </el-dialog>
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
.baseMessage {
  li {
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
  }
}
.leftInfo {
  flex: 1;
}
</style>
<script>
export default {
  components: {},
  data() {
    return {
      dialogFormVisible: false, //打开对话框
      formLabelWidth: "120px",
      textarea: "",
      appointmentList: {}, //预约列表
      userInfo: {}, //用户信息
      opsOrderInfo: {}, //交易信息
      refundReason: "", //退款理由
      refundAmount: "", //退款金额
      loading: true,
      orderId: '', 
      refundRecordInfo:{}, //退款信息

      personOrder:false,
      refound:false,
    };
  },
  mounted() {
      this.orderId = this.$route.params.orderId;
    this.detail(this.$route.params.orderId);
  },
  methods: {
    //订单详情
    detail: function(orderId) {
      //this.$http.get('http://192.168.137.202:9999/order/ops/detail/' + orderId).then((res) => {
      this.$http
        .get("/order/ops/detail/" + orderId)
        .then(res => {
          this.loading = false;
          //console.log(res.data)
          if (res.data.rc === 0) {
            this.appointmentList = res.data.data.reservationInfo;
            this.userInfo = res.data.data.userInfo;
            this.opsOrderInfo = res.data.data.opsOrderInfo;

            this.refundRecordInfo = res.data.data.refundRecordInfo;
            //console.log(res.data.data.reservationInfo.reservationType)
            if(res.data.data.reservationInfo.reservationType == 0){
              this.personOrder = true;
              if(res.data.data.opsOrderInfo.state == 1 || res.data.data.opsOrderInfo.closedCause == "取消预约"){
                this.refound = true
              }else{
                this.refound = false
              }
            }else{
              this.personOrder = false;
              this.refound = false
            }
            
          } else {
              this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
          this.$message.error(error);
        });
    },
    //支付渠道
    payChannel: function(paymentChannel) {
      switch (paymentChannel) {
        case "101":
          return "BeeCloud支付";
          break;
        case "1001":
          return "支付宝";
          break;
        case "1002":
          return "微信支付";
          break;
      }
    },
    //订单来源
    orderFrom: function(tradeType) {
      switch (tradeType) {
        case 0:
          return "app支付";
          break;
        case 1:
          return "公众号支付";
          break;
        case 2:
          return "小程序支付";
          break;
        case 3:
          return "H5支付";
          break;
        case 4:
          return "扫码支付";
          break;
        case 5:
          return "刷卡支付";
          break;
      }
    },
    //订单状态
    orderState: function(state) {
      switch (state) {
        case 0:
          return "待付款";
          break;
        case 1:
          return "已付款";
          break;
        case 2:
          return "已完成";
          break;
        case 3:
          return "已关单";
          break;
        
      }
    },
    //业务类型
    transType: function(transactionType) {
      switch (transactionType) {
        case 0:
          return "体检";
          break;
        case 1:
          return "城市卡";
          break;
        case 2:
          return "健管套餐";
          break;
        case 3:
          return "专家咨询";
          break;
      }
    },
    //优惠类型
    accountType: function(paymentItemType) {
      switch (paymentItemType) {
        case 0:
          return "红包";
          break;
        case 1:
          return "代金券";
          break;
        case 2:
          return "减满优惠";
          break;
      }
    },
    //退款
    refund: function() {
      if(this.refundAmount === ''){
          this.$message({
            message: '退款金额不能为空',
            type: 'warning'
          });
      }else if(this.refundReason === ''){
          this.$message({
            message: '退款理由不能为空',
            type: 'warning'
          });
      }else if (this.refundAmount > this.opsOrderInfo.actualPaymentAmount) {
        this.$message({
          message: "退款金额不得高于支付金额！",
          type: "warning"
        });
      } else {
        this.$http
          .post("/order/ops/refund", {
          //.post("http://192.168.137.137:9999/order/ops/refund", {
            transOrderNo: this.$route.params.orderNo, //订单号
            refundReason: this.refundReason, //退款理由
            refundAmount: this.refundAmount //退款金额
          })
          .then(res => {
            //console.log(res.data);
            if (res.data.rc === 0) {
              this.$message({
                message: "退款成功！",
                type: "success"
              });
              this.dialogFormVisible = false;
              this.detail(this.$route.params.orderId);
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
};
</script>