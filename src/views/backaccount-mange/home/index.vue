<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>运营后台账号管理</el-breadcrumb-item>
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
            <div style="width:80px;">部门: </div>
            <el-select v-model="filterData_grade" clearable placeholder="请选择">
              <el-option v-for="item in hospitalGradeList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="flex mt10">
          <div class="flex mr30" @keyup.enter="searchFilter">
            <div style="width:96px;">搜索：</div>
            <el-input placeholder="工号、姓名、手机号码、登录账号" v-model="search_input" clearable>
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
      <el-button type="primary" @click="$router.push('/standard-data/hospital-manage/add')">注册</el-button>
      <el-button @click="manyIn">批量导入</el-button>
      <el-button type="info" class="fr" @click="$router.push('/standard-data/hospital-manage/disabled')">限制登录名单</el-button>
    </div>
    <div>
      <el-dialog
        :visible.sync="lotin"
        width="30%"
        center>
        <div class="dialog-head"><span>批量生成运营后台账号</span><el-button type="primary" @click="export2Excel">点击下载模板</el-button></div>
        <div class="dislog-body">
          <p>请上传注册名单</p>
          <input type="file" value="选择文件" @change="selectWj"> 
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="upLoadwj" :type="btnType">上传</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="lotinResult"
        width="30%"
        center>
        <div class="dialogResult-t">
          <p>导入成功：<span>20</span></p>
          <p>导入失败：<span>0</span></p>
        </div>
        <div class="dialogResult-c">
          <h3>失败清单:</h3>
          <el-table :data="gridData">
            <el-table-column property="date" label="日期" width="150"></el-table-column>
            <el-table-column property="name" label="姓名" width="200"></el-table-column>
            <el-table-column property="address" label="地址"></el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">下载失败清单</el-button>
          <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>运营后台账号管理</span>
      </div>
      <div class="dataList">
        <!-- 医院列表部分操作按钮 start -->
        <el-table :data="tableData" v-loading="loading" style="width: 100%">
          <el-table-column prop="code" label="工号" align="center" width="100">
          </el-table-column>
          <el-table-column prop="name" label="姓名">
          </el-table-column>
          <el-table-column prop="grade" label="手机号码" align="center">
          </el-table-column>
          <el-table-column prop="domain" label="所属部门">
          </el-table-column>
          <el-table-column prop="createdAt" label="登录账号(企业邮箱)" align="center" width="200">
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="toDetail(scope.row.id,scope.row.name)">维护信息</el-button>
              <el-button size="mini" @click="limitLoginOp">限制登录</el-button>
              <!-- <el-button size="mini" @click="$router.push('/standard-data/hospital-manage/hospital-log/'+scope.row.id)">日志</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页模块 start -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
        </el-pagination>
        <!-- 分页模块 end -->
      </div>

    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="limitLogin"
      width="30%"
      center>
      <h3>请注意！账号限制登录后，该账号将无法正常使用！请谨慎操作！</h3>
      <p>注：限制登录功能，仅建议在员工离职时使用。</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="limitLogin = false">限制登录</el-button>
        <el-button @click="limitLogin = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
  .filterData {
    .el-select,.el-input {
      width: 80%;
    }
    .mr30 {
      width: 30%;
    }
  }
}
.el-dialog {
  .dialog-head {
    padding-bottom: 10px;
    border-bottom: 1px solid #999;
    span {
      margin-right: 10px;
    }
  }
  .dislog-body {
    p {
      margin: 10px 0;
    }
  }
  .el-dialog__footer {
    text-align: center;
  }
  .dialogResult-t {
    padding-bottom: 10px;
    border-bottom: 1px solid #999;
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
.operation {
  margin-top: 20px;
}

.el-date-editor,
.el-cascader {
  width: 500px;
}
</style>

<script>
import { export2Excel } from "../../../utils/utils";
import fileInput from "@/components/fileInput";
export default {
  components: {
    fileInput
  },
  name: "HospitalManage",
  data() {
    return {
      gridData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
      hospitalGradeList: ["产品运营部","用户运营部","网络销售部","产品部","客服部","健康管理部","策划退关部","学术推广部","营销运营部","人力资源部","行政部","其他"],
      loading: false,
      limitLogin: false,
      filterData_grade: "",

      tableData: [],
      search_input:"",
      totalNum: 0, //总数
      currentPage: 1, //分页当前页
      currentPageSize: 10,
      lotin: false,
      lotinResult: false,
      coverPicId:"",
      btnType:""

    };
  },
  methods: {
    //限制登录
    limitLoginOp() {
      this.limitLogin=true
    },
    //
    selectWj() {
      console.log(1111)
      this.btnType="success"
    },
    //上传文件
    upLoadwj() {
      this.lotin = false;
      this.lotinResult=true;
    },
    //批量导入
    manyIn() {
      this.lotin=true
    },
    //show部门列表
    showPart() {
      this.$http
        .get("/operation/operationusermanager/finddepartment", {
          params: {}
        })
        .then(res => {
          if (res.data.rc === 0) {
            console.log(res.data)
            // this.tableData = res.data.data.resultList;
            // this.totalNum = res.data.data.records;
            this.loading = false;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    /* 查看详情按钮 传递医院名称 */
    toDetail(id, name) {
      this.$router.push({
        path: `/standard-data/hospital-manage/hospital/${id}`
      });
    },
    //分页处理函数
    handleSizeChange(val) {
      this.currentPageSize = val;
      this.currentPage = 1;
      this.getList({
        page: this.currentPage,
        size: val,
        name: this.search_input || "",
        grade: this.filterData_grade || "",
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList({
        page: val,
        size: this.currentPageSize,
        name: this.search_input || "",
        grade: this.filterData_grade || "",
      });
    },
    export2Excel() {
      /* 表格数据导出到Excel */
      this.$http
        .get("/hospital/ops/list/total")
        .then(res => {
          export2Excel(
            [],
            ["医院编码", "医院名称", "医院等级", "省市区", "录入时间", "录入人"],
            ["code", "name", "grade","domain", "createdAt", "createdOperatorName"],
            "医院列表"
          );
        });
    },
    getList(json, success) {
      this.loading = true;
      this.$http
        .get("/hospital/ops/list", {
          params: {
            search: json.name || "",
            grade: json.grade || "",
            province: json.province || "",
            city: json.city || "",
            district: json.district || "",
            startDate: json.startDate || "",
            endDate: json.endDate || "",
            pageNo: json.page || 1,
            pageSize: json.size || 10
          }
        })
        .then(res => {
          if (res.data.rc === 0) {
            this.tableData = res.data.data.resultList;
            this.totalNum = res.data.data.records;
            this.loading = false;
            success ? success() : "";
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    /* 搜索内容提交按钮 */
    searchFilter() {
      if (this.filterData_city.indexOf('市辖区')!=-1) {
        this.filterData_city = this.filterData_province;
      }
      this.getList({
        name: this.search_input || "",
        grade: this.filterData_grade || "",
      });
      this.currentPage = 1;
      this.currentPageSize = 10;
    },
    /* 重置按钮 */
    resetFilter() {
      this.filterData_grade = "";
      this.search_input = "";
    }
  },
  mounted() {
    this.getList({});
    // this.showPart({});
  }
};
</script>