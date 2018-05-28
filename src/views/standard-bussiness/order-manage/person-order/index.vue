<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 筛选操作 start -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>条件筛选</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
      </div>
      <div class="filterData">
        <div class="flex mt10">
          <div class="flex mr30">
            <div style="width:80px;">业务类型: </div>
            <el-select v-model="bussinessType" clearable placeholder="请选择">
              <el-option v-for="item in bussinessTypeList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="flex mr30">
            <div style="width:80px;">状态: </div>
            <el-select v-model="state" clearable placeholder="请选择">
              <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="flex mr30">
            <div class="demonstration" style="width: 80px;">成交时间：</div>
            <el-date-picker v-model="dealDate" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </div>

        </div>
        <div class="flex mt10">
          <div class="flex mr30" @keyup.enter="searchBtn">
            <div style="width:76px;">搜索：</div>
            <el-input placeholder="订单编号、姓名、手机" v-model="search" clearable>
            </el-input>
          </div>
        </div>
        <div class="submit">
          <el-button type="primary" icon="el-icon-search" @click="searchBtn">查询</el-button>
          <el-button type="info" icon="el-icon-refresh" @click="reset">重置</el-button>
        </div>
      </div>
    </el-card>
    <!-- 筛选操作 end -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>订单列表</span>
      </div>
      <div class="dataList">
        <!-- 医院列表部分操作按钮 start -->
        <el-table :data="orderList" style="width: 100%" v-loading="loading">
          <el-table-column prop="orderNo" label="订单编号" align="center">
          </el-table-column>
          <el-table-column label="业务类型">
            <template slot-scope="scope">
              <span>{{transType(scope.row.transactionType)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalAmount" label="原价" align="center">
          </el-table-column>
          <el-table-column prop="actualPaymentAmount" label="实际支付">
          </el-table-column>
          <el-table-column label="优惠信息">
            <template slot-scope="scope">
              <span v-if="scope.row.paymentItemType != null">{{accountType(scope.row.paymentItemType)}}{{scope.row.paymentAmount}}</span>
              <span  v-if="scope.row.paymentItemType === null">无优惠信息</span>
            </template>
          </el-table-column>
          <el-table-column label="订单来源">
            <template slot-scope="scope">
              <span>{{orderFrom(scope.row.tradeType)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="成交时间">
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span>{{orderState(scope.row.state)}}</span>
              <span v-if="scope.row.closedCause">{{"(" + scope.row.closedCause + ")"}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="$router.push('/standard-bussiness-data/order-detail/' + scope.row.id + '/detail/' + scope.row.orderNo)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页模块 start -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 分页模块 end -->
      </div>

    </el-card>

  </div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
}
.submit {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  button {
    margin: 0 20px;
  }
}
.operation {
  margin-top: 20px;
}

.el-date-editor,
.el-cascader {
  width: 500px;
}
</style>

<script>
export default {
  name: "OrderManage",
  data() {
    return {
      bussinessType: null, //业务类型
      bussinessTypeList: [
        //业务类型列表
        { value: "0", label: "体检" },
        { value: 1, label: "城市卡" },
        { value: 2, label: "健康套餐" },
        { value: 3, label: "专家咨询" }
      ],
      stateList: [
        //状态
        // { value: "0", label: "待支付" },
        // { value: 1, label: "已支付" },
        // { value: 4, label: "退款中" },
        // { value: 5, label: "已退款" },
        // { value: 3, label: "交易关闭" }
        { value: "0", label: "待支付" },
        { value: 1, label: "已付款" },
        { value: 2, label: "已完成" },
        { value: 3, label: "已关单" },
      ],
      state: "", //订单状态
      dealDate: "", //成交时间
      search: "", //搜索框

      total: 0, //总页数
      currentPage: 1, //分页当前页
      currentPageSize: 10,
      orderList: [], //订单列表

      loading: true
    };
  },
  mounted() {
    this.FetchOrderList({});
  },
  methods: {
    //分页处理函数
    handleSizeChange(val) {
      this.currentPageSize = val;
      this.currentPage = 1;
      this.FetchOrderList({
        page: this.currentPage,
        size: val,
        transactionType: this.bussinessType,
        state: this.state,
        startDate: this.dealDate[0],
        endDate: this.dealDate[1],
        search: this.search,
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.FetchOrderList({
        page: val,
        size: this.currentPageSize,
        transactionType: this.bussinessType,
        state: this.state,
        startDate: this.dealDate[0],
        endDate: this.dealDate[1],
        search: this.search,
      });
    },
    //订单列表
    FetchOrderList: function(json) {
      this.$http
        //.get("http://192.168.137.202:9993/order/ops/list", {
        .get("/order/ops/list", {
          params: {
            transactionType: json.transactionType || "", //
            state: json.state || "",
            startDate: json.startDate || "",
            endDate: json.endDate || "",
            search: json.search || "",
            pageNo: json.page || 1,
            pageSize: json.pageSize || 10
          }
        })
        .then(res => {
          this.loading = false;
          //console.log(res.data);
          if (res.data.rc === 0) {
            this.orderList = res.data.data.content;
            this.total = res.data.data.totalElements;
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
    //搜索
    searchBtn: function() {
      this.currentPage = 1;
      this.FetchOrderList({
        transactionType: this.bussinessType,
        state: this.state,
        startDate: this.dealDate[0],
        endDate: this.dealDate[1],
        search: this.search,
        page: this.currentPage,
        size: this.currentPageSize,
      });
    },
    //重置
    reset: function() {
      this.bussinessType = null;
      this.state = null;
      this.dealDate = "";
      this.search = "";
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
    //订单状态
    orderState: function(state) {
      switch (state) {
        case 0:
          return "待支付";
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
  }
};
</script>