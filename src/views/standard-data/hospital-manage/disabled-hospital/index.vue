<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage' }">医院管理</el-breadcrumb-item>
      <el-breadcrumb-item>已禁用医院</el-breadcrumb-item>
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
              <el-option v-for="item in filterData_gradeList" :key="item.value" :label="item.label" :value="item.value">
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
            <div class="demonstration" style="width:80px;">录入时间：</div>
            <el-date-picker v-model="inputDate" value-format="yyyy-MM-dd" type="daterange" range-separator="至"  start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
        <div class="submit">
          <el-button type="primary" @click="searchFilter">查询</el-button>
          <el-button type="info" @click="resetFilter">重置</el-button>
        </div>
      </div>
    </el-card>
    <!-- 筛选操作 end -->
    <el-card>
      <div slot="header" class="clearfix">
        <span>已禁用医院列表</span>
      </div>
      <div class="dataList">
        <!-- 医院列表部分操作按钮 start -->
        <el-table :data="tableData" v-loading="loading" style="width: 100%">
          <el-table-column prop="code" label="医院编码" width="100">
          </el-table-column>
          <el-table-column prop="name" label="医院名称">
          </el-table-column>
          <el-table-column prop="grade" label="医院等级" width="120">
          </el-table-column>
          <el-table-column prop="domain" label="省市区">
          </el-table-column>
          <el-table-column prop="createdAt" label="录入时间" width="120">
          </el-table-column>
          <el-table-column prop="createdOperatorName" label="录入人" width="120">
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button size="mini" @click="$router.push('/standard-data/hospital-manage/hospital/'+scope.row.id)">查看详情</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">彻底删除</el-button>
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
.el-table {
  margin-top: 10px;
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
  CodeToText,
  TextToCode
} from "@/utils/areaSelect";
export default {
  data() {
    return {
      //省市区三级联动
      options: regionData,
      selectedOptions: [],
      filterData_gradeList: [
        {
          value: "公立三特",
          label: "公立三特"
        },
        {
          value: "公立三甲",
          label: "公立三甲"
        },
        {
          value: "公立三乙",
          label: "公立三乙"
        },
        {
          value: "公立三丙",
          label: "公立三丙"
        },
        {
          value: "公立二甲",
          label: "公立二甲"
        },
        {
          value: "公立二乙",
          label: "公立二乙"
        },
        {
          value: "公立二丙",
          label: "公立二丙"
        },
        {
          value: "公立一甲",
          label: "公立一甲"
        },
        {
          value: "公立一乙",
          label: "公立一乙"
        },
        {
          value: "公立一丙",
          label: "公立一丙"
        }
      ],
      tableData: [
        {
          id: "1",
          name: "杭州第一人民医院",
          grade: "公立三甲",
          address: "上海市普陀区金沙江路 1518 弄",
          date: "2016-05-02",
          inputPerson: "王小虎"
        },
        {
          id: "1",
          name: "杭州第一人民医院",
          grade: "公立三甲",
          address: "上海市普陀区金沙江路 1518 弄",
          date: "2016-05-02",
          inputPerson: "王小虎"
        },
        {
          id: "1",
          name: "杭州第一人民医院",
          grade: "公立三甲",
          address: "上海市普陀区金沙江路 1518 弄",
          date: "2016-05-02",
          inputPerson: "王小虎"
        },
        {
          id: "1",
          name: "杭州第一人民医院",
          grade: "公立三甲",
          address: "上海市普陀区金沙江路 1518 弄",
          date: "2016-05-02",
          inputPerson: "王小虎"
        }
      ],
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
    //处理删除按钮操作
    handleDelete(index, id) {
      this.$confirm("确定要彻底删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.delete("/hospital/ops/" + id).then(res => {
            if (res.data.rc === 0) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            } else {
              this.$message({
                type: "error",
                message: "删除失败!"
              });
            }
            this.getList({
              page: this.currentPage,
              size: this.currentPageSize
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //分页处理函数
    handleSizeChange(val) {
      this.currentPage = 1;
      this.currentPageSize = val;
      console.log(`每页 ${val} 条`);
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
      console.log(`当前页: ${val}`);
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
    //省市区联动钩子函数
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
    getList(json, success) {
      this.loading = true;
      this.$http
        .get("/hospital/ops/disable/list", {
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
          console.log(res.data)
          this.tableData = res.data.data.resultList;
          this.totalNum = res.data.data.records;
          this.loading = false;
          success ? success() : "";
        })
        .catch(error => {
          this.loading = false;
        });
    },
    /* 搜索内容提交按钮 */
    searchFilter() {
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
      this.inputDate = "";
    }
  },
  mounted() {
    this.getList({});
  }
};
</script>