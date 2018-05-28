<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>团检咨询</el-breadcrumb-item>
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
            <div style="width:80px;">状态: </div>
            <el-select v-model="state" clearable placeholder="请选择">
              <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="flex mr30">
            <div style="width:80px;">行业: </div>
            <el-select v-model="industryType" clearable placeholder="请选择">
              <el-option v-for="item in industryTypeList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="flex">
            <div style="width:80px;">省市区：</div>
            <!-- 省市区三级联动 -->
            <el-cascader change-on-select size="large" :options="options" v-model="selectedOptions" @change="handleChange">
            </el-cascader>
          </div>
        </div>
        <div class="flex mt10">
          <div class="flex mr30" @keyup.enter="searchBtn">
            <div style="width:76px;">搜索：</div>
            <el-input placeholder="联系人姓名、联系电话" v-model="condition" clearable>
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
        <span>咨询列表</span>
      </div>
      <div class="dataList">
        <!-- 医院列表部分操作按钮 start -->
        <el-table :data="orderList" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="序号" align="center" width="50">
          </el-table-column>
          <el-table-column prop="createdAt" label="提交时间">
          </el-table-column>
          <el-table-column prop="contactName" label="联系人姓名">
          </el-table-column>
          <el-table-column prop="contactTel" label="联系人电话">
          </el-table-column>
          <el-table-column prop="trade" label="所属行业">
          </el-table-column>
          <el-table-column prop="area" label="所在地区">
          </el-table-column>
           <el-table-column label="状态">
            <template slot-scope="scope">
              <span>{{orderState(scope.row.state)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="source" label="来源">
          </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button type="primary" @click="addinfo(scope)">{{scope.row.hasRemark?seeremarks:addremarks}}</el-button>
              <el-button type="danger"  @click="open2(scope)">{{orderState(!scope.row.state)}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页模块 start -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 分页模块 end -->
      </div>

    </el-card>
    <template>
      <el-dialog :title="remarkstitle" :visible.sync="dialogFormVisible">
        <div>
          <span>体检人数：</span>
          <el-input
            placeholder="请输入内容"
            v-model="personNo"
            clearable>
          </el-input>
        </div>
        <div class="extrainfo">
          <span>备注信息：</span>
          <textarea id="" cols="30" rows="10" v-model="extra"></textarea>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveremark">保存</el-button>
        </div>
      </el-dialog>
    </template>
  </div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
}
.el-dialog {
  .el-input {
    width: 60%;
  }
  .extrainfo {
    margin-top: 20px;
    span {
      vertical-align: top
    }
    textarea {
      width: 60%;
    }
  }
}
.submit {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  button {
    margin: 0 20px;
  }
}
.dataList {
  .el-button {
    width: 80px;
    padding: 0;
    text-align: center;
    padding: 5px 0;
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
import {
  provinceAndCityData,
  regionData,
  CodeToText
} from "@/utils/areaSelect";
export default {
  name: "OrderManage",
  data() {
    return {
      //省市区三级联动
      options: regionData,
      selectedOptions: [],
      filterData_province: "",
      filterData_city: "",
      filterData_grade: "",
      filterData_district: "",
      search_input: "",
      inputDate: [],

      industryType: null, 
      industryTypeList: [
        //行业列表
        { value: "计算机/互联网/通信电子", label: "计算机/互联网/通信电子" },
        { value: "会计/金融/银行/保险", label: "会计/金融/银行/保险" },
        { value: "贸易/消费/制造/运营", label: "贸易/消费/制造/运营" },
        { value: "制药/医疗", label: "制药/医疗" },
        { value: "广告/媒体", label: "广告/媒体" },
        { value: "房地产/建筑", label: "房地产/建筑" },
        { value: "专业服务/教育/培训", label: "专业服务/教育/培训" },
        { value: "服务业", label: "服务业" },
        { value: "物流/运输", label: "物流/运输" },
        { value: "能源/源材料", label: "能源/源材料" },
        { value: "政府/非营利机构", label: "政府/非营利机构" },
        { value: "其他", label: "其他" }
      ],
      stateList: [
        //状态
        { value: "0", label: "未处理" },
        { value: 1, label: "已处理" }
      ],
      state: "", //订单状态
      dealDate: "", //成交时间
      condition: "", //搜索框

      total: 0, //总页数
      currentPage: 1, //分页当前页
      currentPageSize: 10,
      orderList: [], //订单列表
      personNo: "",
      loading: true,
      editjudge:false,
      seeremarks:"查看备注",
      addremarks:"添加备注",
      dialogFormVisible:false,
      handleinfo:"未处理",
      remarkstitle:"",
      extra:"",
      groupConsultId:"",
      btnstate:"",
      currentid:""
    };
  },
  mounted() {
    this.FetchOrderList({});
  },
  methods: {
    //添加备注
    addinfo: function(scope) {
      console.log(scope.row)
      this.dialogFormVisible=true;
      this.groupConsultId=scope.row.id
      if(scope.row.hasRemark){
        this.remarkstitle=this.seeremarks
        this.$http
        //.get("http://192.168.137.202:9993/order/ops/list", {
        .get("/group-consult/remark", {
          params: {
            id: scope.row.id || ""
          }
        })
        .then(res => {
          this.loading = false;
          console.log(res.data);
          if (res.data.rc === 0) {
           this.personNo=res.data.data.personNo
           this.extra=res.data.data.remark
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
          this.$message.error(error);
        });
      }else {
        this.remarkstitle=this.addremarks
        this.personNo=""
        this.extra=""
      }

    },
    //保存
    saveremark: function (){
      this.$http
        //.get("http://192.168.137.202:9993/order/ops/list", {
        .post("/group-consult/remark/save-update", {
              groupConsultId: this.groupConsultId,
              personNo: this.personNo,
              remark: this.extra
        })
        .then(res => {
          this.loading = false;
          console.log(res.data)
          if (res.data.rc === 0) {
           this.$message.success("添加成功");
           this.dialogFormVisible=false;
           this.FetchOrderList({})
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
    //弹窗
    open2: function(scope) {
      var oState
      if(scope.row.state==0){
        oState=1
      }else if(scope.row.state==1){
        oState=0
      }
      this.$confirm('确定执行此操作，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.handleinfo="已处理"
        this.$message({
          type: 'success',
          message: '已处理!'
        });
        this.$http
        //.get("http://192.168.137.202:9993/order/ops/list", {
        .put("/group-consult/state", {
             id:scope.row.id,
             state:oState
        })
        .then(res => {
          this.loading = false;
          console.log(res.data)
          if (res.data.rc === 0) {
           this.FetchOrderList({})
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
          this.$message.error(error);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '未处理'
        });          
      });
      },
    //省市区三级联动变化方法
    handleChange(value) {
      value.filter((t, i) => {
        switch (i) {
          case 0:
            this.filterData_province = CodeToText[t];
            break;
          case 1:
            this.filterData_city = CodeToText[t];
            break;
          case 2:
            this.filterData_district = CodeToText[t];
            break;
        }
      });
    },
    //分页处理函数
    handleSizeChange(val) {
      this.currentPageSize = val;
      this.currentPage = 1;
      this.FetchOrderList({
        page: this.currentPage,
        pageSize: this.currentPageSize,
        state: this.state,
        trade: this.industryType,
        province: this.filterData_province,
        city: this.filterData_city,
        district: this.filterData_district,
        condition: this.condition
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.FetchOrderList({
        page: this.currentPage,
        pageSize: this.currentPageSize,
        state: this.state,
        trade: this.industryType,
        province: this.filterData_province,
        city: this.filterData_city,
        district: this.filterData_district,
        condition: this.condition
      });
    },
    //订单列表
    FetchOrderList: function(json) {
      this.$http
        //.get("http://192.168.137.202:9993/order/ops/list", {
        .get("/group-consult", {
          params: {
            page: json.page || 1,
            pageSize: json.pageSize || 10,
            state: json.state || "",
            trade: json.trade || "", //
            province: json.province || "",
            city: json.city || "",
            district: json.district || "",
            condition: json.condition || ""
          }
        })
        .then(res => {
          this.loading = false;
          console.log(res.data);
          if (res.data.rc === 0) {
            this.orderList = res.data.data.resultList;
            console.log(this.orderList)
            this.total = res.data.data.records;
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
        page: this.currentPage,
        pageSize: this.currentPageSize,
        state: this.state,
        trade: this.industryType,
        province: this.filterData_province,
        city: this.filterData_city,
        district: this.filterData_district,
        condition: this.condition
      });
    },
    //重置
    reset: function() {
      this.industryType = null;
      this.state = null;
      this.selectedOptions = [];
      this.filterData_province="",
      this.filterData_city="",
      this.filterData_district="",
      this.condition = "";
    },
    //订单状态
    orderState: function(state) {
      if(state==0){
        return "未处理";
      }else {
        return "已处理";
      }
    },
  }
};
</script>