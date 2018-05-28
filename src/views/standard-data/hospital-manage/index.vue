<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>医院管理</el-breadcrumb-item>
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
            <div style="width:80px;">医院等级: </div>
            <el-select v-model="filterData_grade" clearable placeholder="请选择">
              <el-option v-for="item in hospitalGradeList" :key="item" :label="item" :value="item">
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
          <div class="flex mr30" @keyup.enter="searchFilter">
            <div style="width:96px;">搜索：</div>
            <el-input placeholder="请输入医院名称、医院编码、id" v-model="search_input" clearable>
            </el-input>
          </div>
          <div class="flex">
            <div class="demonstration" style="width: 80px;">录入时间：</div>
            <el-date-picker v-model="inputDate" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
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
      <el-button type="primary" icon="el-icon-circle-plus" @click="$router.push('/standard-data/hospital-manage/add')">新增</el-button>
      <el-button @click="export2Excel" icon="el-icon-download">导出xlsx</el-button>
      <el-button type="info" class="fr" @click="$router.push('/standard-data/hospital-manage/disabled')">已禁用医院列表</el-button>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>医院列表</span>
      </div>
      <div class="dataList">
        <!-- 医院列表部分操作按钮 start -->
        <el-table :data="tableData" v-loading="loading" style="width: 100%">
          <el-table-column prop="code" label="医院编码" align="center" width="100">
          </el-table-column>
          <el-table-column prop="name" label="医院名称">
          </el-table-column>
          <el-table-column prop="grade" label="医院等级" align="center" width="120">
          </el-table-column>
          <el-table-column prop="domain" label="省市区">
          </el-table-column>
          <el-table-column prop="createdAt" label="录入时间" align="center" width="200">
          </el-table-column>
          <el-table-column prop="createdOperatorName" label="录入人" align="center" width="120">
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="toDetail(scope.row.id,scope.row.name)">查看详情</el-button>
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
import { export2Excel } from "../../../utils/utils";
import {
  provinceAndCityData,
  regionData,
  CodeToText
} from "@/utils/areaSelect";
export default {
  name: "HospitalManage",
  data() {
    return {
      hospitalGradeList: ["公立三特","公立三甲","公立三乙","公立三丙","公立二甲","公立二乙","公立二丙","公立一甲","公立一乙","公立一丙"],
      loading: false,

      //省市区三级联动
      options: regionData,
      selectedOptions: [],
      filterData_province: "",
      filterData_city: "",
      filterData_grade: "",
      filterData_district: "",
      search_input: "",
      inputDate: [],

      tableData: [],
      totalNum: 0, //总数
      currentPage: 1, //分页当前页
      currentPageSize: 10
    };
  },
  methods: {
    /* 查看详情按钮 传递医院名称 */
    toDetail(id, name) {
      this.$router.push({
        path: `/standard-data/hospital-manage/hospital/${id}`
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
      this.getList({
        page: this.currentPage,
        size: val,
        name: this.search_input || "",
        grade: this.filterData_grade || "",
        province: this.filterData_province || "",
        city: this.filterData_city || "",
        district: this.filterData_district || "",
        startDate: this.inputDate[0] || "",
        endDate: this.inputDate[1] || ""
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList({
        page: val,
        size: this.currentPageSize,
        name: this.search_input || "",
        grade: this.filterData_grade || "",
        province: this.filterData_province || "",
        city: this.filterData_city || "",
        district: this.filterData_district || "",
        startDate: this.inputDate[0] || "",
        endDate: this.inputDate[1] || ""
      });
    },
    export2Excel() {
      /* 表格数据导出到Excel */
      this.$http
        .get("/hospital/ops/list/total")
        .then(res => {
          export2Excel(
            res.data.data,
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
        province: this.filterData_province || "",
        city: this.filterData_city || "",
        district: this.filterData_district || "",
        startDate: this.inputDate[0] || "",
        endDate: this.inputDate[1] || ""
      });
      this.currentPage = 1;
      this.currentPageSize = 10;
    },
    /* 重置按钮 */
    resetFilter() {
      this.filterData_grade = "";
      this.search_input = "";
      this.selectedOptions = [];
      this.filterData_province = "";
      this.filterData_city = "";
      this.filterData_district = "";
      this.inputDate = []
    }
  },
  mounted() {
    this.getList({});
  }
};
</script>