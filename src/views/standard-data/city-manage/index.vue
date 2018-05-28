<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>上线城市</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>条件筛选</span>
      </div>
      <div class="filterData">
        <div class="selectProvince">
          <span>省份：</span>
          <el-select v-model="searchProvince" clearable placeholder="请选择省份">
            <el-option v-for="item in provinceList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </div>
        <div class="selectCity" @keyup.enter="searchFilter">
          <span>搜索：</span>
          <el-input placeholder="请输入城市" v-model="searchCity" clearable>
          </el-input>
        </div>
        <div class="submit">
          <el-button type="primary" icon="el-icon-search" @click="searchFilter">查询</el-button>
          <el-button type="info" icon="el-icon-refresh" @click="resetFilter">重置</el-button>
        </div>
      </div>
    </el-card>
    <div class="clearfix">
      <el-button type="primary" icon="el-icon-circle-plus" @click="dialogFormVisible = true">新增</el-button>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>上线城市列表</span>
      </div>
      <div class="dataList">
        <!-- 医院列表部分操作按钮 start -->
        <el-table :data="tableData" v-loading="loading" style="width: 100%">
          <el-table-column prop="city" label="上线市（地级市）" align="center">
          </el-table-column>
          <el-table-column prop="province" align="center" label="所属省份（省、直辖市、自治区）">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="handleOffline(scope.row.id)">下线</el-button>
              <!-- <el-button
                  size="mini"
                  @click="">日志</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页模块 start -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
        </el-pagination>
        <!-- 分页模块 end -->
      </div>
    </el-card>
    <!-- 弹出层 -->
    <el-dialog title="新增上线城市" :visible.sync="dialogFormVisible">
      <el-cascader size="large" :options="options" v-model="selectedOptions" @change="handleChange">
      </el-cascader>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
}
.filterData {
  .submit {
    text-align: center;
    margin-top: 10px;
  }
}
.selectCity {
  margin-top: 10px;
  .el-input {
    width: 194px;
  }
}
</style>

<script>
import { provinceAndCityData, CodeToText } from "@/utils/areaSelect";
export default {
  name: "GroupManage",
  data() {
    return {
      dialogFormVisible: false,
      inputName: "",
      searchProvince: "",
      searchCity: "",
      loading: false,
      tableData: [],
      provinceList: [
        "北京市",
        "天津市",
        "河北省",
        "山西省",
        "内蒙古自治区",
        "辽宁省",
        "吉林省",
        "黑龙江省",
        "上海市",
        "江苏省",
        "浙江省",
        "安徽省",
        "福建省",
        "江西省",
        "山东省",
        "河南省",
        "湖北省",
        "湖南省",
        "广东省",
        "广西壮族自治区",
        "海南省",
        "重庆市",
        "四川省",
        "贵州省",
        "云南省",
        "西藏自治区",
        "陕西省",
        "甘肃省",
        "青海省",
        "宁夏回族自治区",
        "新疆维吾尔自治区",
        "台湾省",
        "香港特别行政区",
        "澳门特别行政区"
      ],
      totalNum: 0, //总数
      currentPage: 1, //分页当前页
      currentPageSize: 10,
      /* 省市 */
      options: provinceAndCityData,
      selectedOptions: [],
      add_province: "",
      add_city: ""
    };
  },
  methods: {
    searchFilter() {
      this.getList(this.currentPage, this.currentPageSize);
    },
    resetFilter() {
      this.searchProvince = "";
      this.searchCity = "";
    },
    handleAdd() {
      //过滤直辖市
      if (this.add_city.indexOf("市辖区") != -1) {
        this.add_city = this.add_province;
      }
      this.$http
        .post("/city/add/online", {
          province: this.add_province,
          city: this.add_city
        })
        .then(res => {
          if (res.data.rc === 0) {
            this.$notify({
              title: "成功",
              message: "添加成功！",
              type: "success"
            });
            this.dialogFormVisible = false;
            this.getList(this.currentPage, this.currentPageSize);
          } else {
            this.$notify({
              title: "错误",
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
    //分页处理函数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentPageSize = val;
      this.getList(this.currentPage, this.currentPageSize);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getList(this.currentPage, this.currentPageSize);
    },
    handleOffline(id) {
      this.$confirm("下线后，该城市在用户端将不再展示，确定要下线吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .delete("/city/online/" + id)
            .then(res => {
              if (res.data.rc === 0) {
                this.$message({
                  type: "success",
                  message: "下线成功!"
                });
                this.getList(this.currentPage, this.currentPageSize);
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消下线"
          });
        });
    },
    //获取上线城市列表
    getList(page, size) {
      this.loading = true;
      this.tableData = [];
      this.$http
        .get("/city/online/city/list", {
          params: {
            province: this.searchProvince || "",
            search: this.searchCity || "",
            pageNo: page || "1",
            pageSize: size || "10"
          }
        })
        .then(res => {
          console.log(res.data)
          this.loading = false;
          if (res.data.rc === 0) {
            this.tableData = res.data.data.resultList;
            this.totalNum = res.data.data.records;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    //省市区三级联动变化方法
    handleChange(value) {
      value.filter((t, i) => {
        switch (i) {
          case 0:
            this.add_province = CodeToText[t];
            break;
          case 1:
            this.add_city = CodeToText[t];
            break;
        }
      });
    }
  },
  mounted() {
    this.getList();
  }
};
</script>