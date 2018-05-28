<template>
    <div class="container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>团检预约管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 筛选操作 start -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>条件筛选</span>
          <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
        </div>
        <div class="filterData">
          <div class="flex mt10">
            <div class="mr30">
              <span>状态: </span>
              <el-select v-model="status" clearable placeholder="请选择">
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>             
            </div>
            <div class="mr30">
              <span>有无报告: </span>
              <el-select v-model="hasReport" clearable placeholder="请选择">
                <el-option
                  v-for="item in hasReportList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>             
            </div>
            <!-- <div class="mr30">
              <span>用户分类: </span>
              <el-select v-model="userType" clearable placeholder="请选择">
                <el-option
                  v-for="item in userTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>             
            </div> -->
            <div class="flex mr30" @keyup.enter="searchFilter">
              <div style="width:140px;">是否支医院端：</div>
              <el-select v-model="supportHospital" clearable placeholder="请选择">
                <el-option
                  v-for="item in isSuportList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>            
            </div>
          </div>
          <div class="flex mt10">
            <div class="flex mr30" @keyup.enter="searchFilter">
              <div style="width:70px;">搜索：</div>
              <el-input
                placeholder="订单编号、姓名、手机、身份证、医院"
                v-model="search_input"
                clearable>
              </el-input>              
            </div>
            <div class="flex mr30">
              <div style="width:120px;">所属企业：</div>
              <el-input
                placeholder="请输入企业名称"
                v-model="firm_name"
                clearable>
              </el-input>              
            </div>
            
          </div>
          <div class="submit">
            <el-button type="primary" icon="el-icon-search" @click="searchFilter">查询</el-button>
            <el-button type="info" icon="el-icon-refresh" @click="resetFilter">重置</el-button>
          </div>
        </div>
      </el-card>
      <!-- 筛选操作 end -->
      <div class="clearfix">
        <el-button @click="export2Excel">导出xlsx</el-button>
      </div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>预约名单</span>
        </div>
        <div class="dataList">
          <!-- 医院列表部分操作按钮 start -->
            <el-table
                v-loading="loading"
                ref="multipleTable"
                :data="orderList"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                type="selection"
                align="center">
                </el-table-column>
                <el-table-column
                label="预约单号">
                <template slot-scope="scope">{{ scope.row.reservationNo }}</template>
                </el-table-column>
                <el-table-column
                label="体检人信息">
                    <template slot-scope="scope">
                        <p>{{ scope.row.reservationPartyInfo.name }}</p>
                        <p>{{ scope.row.reservationPartyInfo.mobileNo }}</p>
                        <p>{{ scope.row.reservationPartyInfo.identity}}</p>
                    </template>
                </el-table-column>

                <el-table-column
                label="所属企业">
                <template slot-scope="scope">{{ scope.row.enterpriseName }}</template>
                </el-table-column>

                <el-table-column
                prop="address"
                label="预约套餐"
                show-overflow-tooltip>
                    <template slot-scope="scope">
                        <p>{{ scope.row.serviceItemName}}</p>
                        <p>{{ scope.row.reservedPartyName}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                prop="reservationTime"
                label="预约日期"
                align="center"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="createdAt"
                align="center"
                label="预约发起时间"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="state"
                label="状态"
                align="center"
                show-overflow-tooltip>
                    <template slot-scope="scope">
                        <p :class="stateChange(scope.row.state) == '待预约' ? 'red' : stateChange(scope.row.state) == '已预约' ? 'blue' : '' ">{{ stateChange(scope.row.state) }}</p>
                    </template>
                </el-table-column>
                <el-table-column 
                label="操作"
                align="center"
                >
                    <template slot-scope="scope">
                        <el-button size="mini" type="info" disabled v-if="cancleAppointment">已取消</el-button>
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row),$router.push('/standard-bussiness-data/booking-detail/' + scope.row.id + '/detail/' + scope.row.reservationNo + '/from/1')" class="cursor">详情</el-button>
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
p.red {
  color: #F56C6C;
}
p.blue{
  color: #409EFF;
}
</style>

<script>
import { export2Excel } from "../../../../utils/utils";
export default {
  data() {
    return {
      loading: false,
      status: "", //订单状态
      statusList: [
        { value: "0", label: "待预约" },
        { value: "1", label: "已预约" },
        { value: "2", label: "已到检" },
        { value: "3", label: "已完成" },
        { value: "4", label: "已取消" },
        { value: "5", label: "预约失败" },
        { value: "6", label: "未到检" },
        
      ],
      hasReport: "", //有无报告
      hasReportList: [{ value: 0, label: "有" }, { value: 1, label: "无" }],
      search_input: "", //搜索框
      firm_name:"",//企业名称
      cancleAppointment: false, //是否取消預約
      orderList: [],
      total: 0 ,  //总条数
      currentPage: 1, //分页当前页
      currentPageSize: 10,


      supportHospital:"",//是否支持医院端
      isSuportList:[{value:"0",label:"是"},{value:"1",label:"否"}]
    };
  },
  mounted() {
    this.fetchOrderList({});
  },
  methods: {
    //订单列表
    fetchOrderList: function(json) {
      //this.loading = true;
      this.$http
        .get("/manage/reservation/checkup", {
          params: {
            state: json.state || '', //状态
            hasReport: json.hasReport || "", //有无报告
            reservationType: 1, //用户分类
            search: json.search || '', //搜索
            hospSupport:json.supportHospital || "",//是否支持医院端-0是-1否
            enterpriseName:json.name || "",
            
            page: json.page || 1,
            size: json.pageSize || 10
          }
        })
        .then(res => {
          //console.log(res.data.data);
          this.loading = false;
          if(res.data.rc === 0){
            this.total = res.data.data.totalElements;
            this.orderList = res.data.data.content;
          }else{
            this.$message.error(res.data.msg);
          }
        })
    },
    //搜索
    searchFilter: function() {
      this.fetchOrderList({
        state: this.status, //状态
        hasReport: this.hasReport, //有无报告
        search: this.search_input, //搜索
        supportHospital:this.supportHospital,//是否支持医院
        name:this.firm_name,//公司名称
        page: this.page,
        pageSize: this.size
      });
      this.currentPage = 1;
      this.currentPageSize = 10;
    },
    //重置
    resetFilter: function() {
      this.status = "";
      this.hasReport = "";
      this.search_input = "";
      this.supportHospital = "";
      this.firm_name = "";
    },
    //处理列表编辑按钮
    handleEdit(index, row) {
      //console.log(index, row);
    },
    //分页处理函数
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.currentPageSize = val;
      this.currentPage = 1;
      this.fetchOrderList({
        state: this.status, //状态
        hasReport: this.hasReport, //有无报告
        //reservationType: "0", //用户分类  0-个检
        search: this.search_input, //搜索
        supportHospital:this.supportHospital,//是否支持医院端
        name:this.firm_name,//公司名称
        page: this.currentPage,
        pageSize: val
      });
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.fetchOrderList({
        state: this.status, //状态
        hasReport: this.hasReport, //有无报告
        search: this.search_input, //搜索
        supportHospital:this.supportHospital,//是否支持医院端
        name:this.firm_name,//公司名称
        page: val,
        pageSize: this.currentPageSize
      });
    },
    //多选表格
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //状态转为文字
    stateChange: function(state){
      switch (state) {
        case 0:
          return "待预约"
          break;
        case 1:
          return "已预约"
          break;
        case 2:
          return "已到检"
          break;
        case 3:
          return "已完成"
          break;
        case 4:
          return "已取消"
          break;
        case 5:
          return "预约失败"
          break;
        case 6:
          return "未到检"
          break;
      }
    },
    export2Excel() {
      /* 表格数据导出到Excel */
      /* 表格数据导出前进行数据处理 */
      function getValue(obj) {
        var b = [];
        for (var i in obj) {
          b.push(obj[i]);
        }
        return b;
      }
      let newData = JSON.parse(JSON.stringify(this.orderList));
      newData.filter((item, index) => {
        return (
          (item.reservationPartyInfo = getValue(item.reservationPartyInfo).join("\n")) &&
          (item.serviceItemName = getValue(item.serviceItemName).join("\n")) &&
          (item.state = this.stateChange(item.state))
        );
      });
      export2Excel(
        newData,
        ["预约单号", "体检人信息", "预约套餐", "预约日期", "预约发起时间", "状态"],
        [
          "reservationNo",
          "reservationPartyInfo",
          "serviceItemName",
          "reservationTime",
          "createdAt",
          "state"
        ],
        "体检预约名单"
      );
    }
  }
};
</script>