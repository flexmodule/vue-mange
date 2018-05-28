<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/group-check-manage/index'}">团检企业</el-breadcrumb-item>
      <el-breadcrumb-item>预约情况</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header">
        <span>基本信息</span>
      </div>
      <div class="company-info">
        <ul>
          <li class="title">
            <span>{{companyName}}</span>
          </li>
          <li>
            <p>
              <span>企业地址：{{companyAddress}}</span>
            </p>
            <p>
              <span>企业规模：{{companyScale}}人</span>
            </p>
            <p>
              <span>企业性质：{{companyType}}</span>
            </p>
          </li>
          <li>
            <p>
              <span>联系人：{{contactPerson}}</span>
            </p>
            <p>
              <span>电话：{{contactPhone}}</span>
            </p>
          </li>
          <li>
            <p class="widthP30">
              <span>体检时间：{{checkDate}}</span>
            </p>
            <p>
              <span>总人数：{{total}}</span>
            </p>
            <p>
              <span>已体检：{{checkNum}}</span>
            </p>
            <p>
              <span>未体检：{{usedNum}}</span>
            </p>
          </li>
        </ul>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header">
        <span>条件筛选</span>
      </div>
      <div class="search">
        <el-select v-model="status" placeholder="请选择">
          <el-option v-for="item in situation" :key="item.state" :label="item.name" :value="JSON.stringify(item)">
          </el-option>
        </el-select>
        <div @keyup.enter="handleSearch">
          <el-input v-model="inputName" placeholder="输入员工姓名、身份证号、员工、体检编号、手机号"></el-input>
        </div>
      </div>
      <div class="operation">
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button type="info" @click="handleReset">重置</el-button>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header">
        <span>本次团检情况列表</span>
      </div>
      <div class="data-list">
        <el-table :data="tableData" v-loading="loading" style="width: 100%">
          <el-table-column prop="id" label="序号" align="center"></el-table-column>
          <el-table-column prop="reservationNo" label="预约编码" align="center"></el-table-column>
          <el-table-column prop="realName" label="姓名" align="center"></el-table-column>
          <el-table-column prop="sex" label="性别" align="center"></el-table-column>
          <el-table-column prop="age" label="年龄" align="center"></el-table-column>
          <el-table-column prop="married" label="是否已婚" align="center"></el-table-column>
          <el-table-column prop="identity" label="身份证号" align="center"></el-table-column>
          <el-table-column prop="employeeNo" label="员工号" align="center"></el-table-column>
          <el-table-column prop="mobilePhone" label="手机号" align="center"></el-table-column>
          <el-table-column prop="checkupNo" label="体检编号" align="center"></el-table-column>
          <el-table-column prop="reservedPartyName" label="体检医院" align="center"></el-table-column>
          <el-table-column prop="serviceItemName" label="体检套餐" align="center"></el-table-column>
          <el-table-column label="订单状态" align="center">
            <template slot-scope="scope">
              {{ checkStatus(scope.row.state) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template slot-scope="scope">
              <el-button type="mini" @click="handleEdit(scope.index,scope.row)">编辑</el-button>
              <el-button type="mini" @click="handleDelete(scope.index,scope.row)">删除</el-button>
              <el-button type="mini" @click="handleManage(scope.index,scope.row)" v-if="scope.row.state != 4">订单管理</el-button>
              <!-- <el-button type="mini" @click="goLog(scope.index,scope.row)">日志</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页模块 start -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
        </el-pagination>
        <!-- 分页模块 end -->
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
  .company-info {
    ul li {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      &.title {
        span {
          font-size: 16px;
          font-weight: bold;
        }
      }
      p {
        width: 20%;
        margin-right: 20px;
        &.widthP30 {
          width: 30%;
        }
      }
    }
  }
  .search {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .el-input {
      margin-left: 20px;
      width: 400px;
    }
  }
  .operation {
    text-align: center;
  }
}
</style>

<script>
export default {
  data() {
    return {
      groupId: null,
      companyId: null,
      companyName: "",
      companyAddress: "",
      companyScale: "",
      companyType: "",
      contactPerson: "",
      contactPhone: "",
      checkDate: "",
      total: "",
      checkNum: "",
      usedNum: "",
      status: "",
      situation: [
        {
          state: 99,
          name: "全部"
        },
        {
          state: 0,
          name: "待预约(运营对接医院)"
        },
        {
          state: 1,
          name: "已预约(用户提交预约后)"
        },
        {
          state: 2,
          name: "已完成(运营人员点击已完成)"
        },
        {
          state: 3,
          name: "已取消(预约已取消)"
        },
        {
          state: 4,
          name: "未预约(用户还未预约)"
        }
      ],
      inputName: "",
      loading: false,
      tableData: [],
      totalNum: 0, //总数
      currentPage: 1, //分页当前页
      currentPageSize: 10,
      state: 99
    };
  },
  created() {
    this.groupId = this.$route.params.gid;
    this.companyId = this.$route.query.companyId;

    this.getData();
    this.getList({});
  },
  methods: {
    getData() {
      this.$http
        .get("/group-check-manage/company-info-with-delete/" + this.companyId)
        .then(res => {
          res = res.data.data;
          this.companyName = res.name;
          this.companyAddress = res.address;
          this.companyScale = res.scale;
          this.companyType = res.type;
          this.contactPerson = res.contact;
          this.contactPhone = res.phone;
        })
        .catch(err => {
          console.log(err);
        });
      this.$http
        .get(
          "/group-check-manage/" + this.groupId + "/group-order-employee/status"
        )
        .then(res => {
          res = res.data.data;
          this.checkDate = res.checkupStartAt + "-" + res.checkupEndAt;
          this.total = res.total;
          this.checkNum = res.finishCheckup;
          this.usedNum = res.notFinishCheckup;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getList(json) {
      this.loading = true;
      this.$http
        .get(
          "/group-check-manage/" + this.groupId + "/group-order-employee/list",
          {
            params: {
              pageSize: json.size || 10,
              pageNo: json.page || 1,
              state: this.state,
              keyValue: this.inputName
            }
          }
        )
        .then(res => {
          this.loading = false;
          if (res.data.rc == 0) {
            this.tableData = res.data.data.resultList;
            this.totalNum = res.data.data.records;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSearch() {
      if (this.status == "") {
        this.state = 99;
      } else {
        this.state = JSON.parse(this.status).state;
      }
      this.getList({});
    },
    handleReset() {
      this.status = "";
      this.inputName = "";
    },
    handleEdit(index, row) {
      this.$router.push(
        "/group-check-manage/booking-situation/" +
          this.groupId +
          "/edit-employees-info?employeesId=" +
          row.id +
          "&companyId=" +
          this.companyId
      );
    },
    handleDelete(index, row) {
      this.$confirm("确认要删除该员工吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .delete("/group-check-manage/group-order-employee/" + row.id)
            .then(res => {
              if (res.data.rc == 0) {
                this.getList({});
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else {
                this.$message({
                  type: "error",
                  message: res.data.msg
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除"
          });
        });
    },
    handleManage(index, row) {
      const loading = this.$loading({
        lock: true,
        text: "正在跳转...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .get(
          "group-check-manage/" +
            row.id +
            "/group-order-employee/order?reservationNo=" +
            row.reservationNo
        )
        .then(res => {
          if (res.data.rc == 0) {
            this.$router.push(
              "/standard-bussiness-data/physical-appointment-detail/" +
                res.data.data.id +
                "/detail/" +
                row.reservationNo
            );
          } else {
            this.$message.error(res.data.msg);
          }
          loading.close();
        })
        .catch(err => {
          loading.close();
        });
    },
    goLog(index, row) {
      console.log(row);
    },
    handleSizeChange(val) {
      this.currentPageSize = val;
      this.currentPage = 1;
      this.getList({
        page: this.currentPage,
        size: val
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList({
        page: val,
        size: this.currentPageSize
      });
    },
    checkStatus(state) {
      var checkStatus;
      switch (state) {
        case 0:
          checkStatus = "待预约";
          break;
        case 1:
          checkStatus = "已预约";
          break;
        case 2:
          checkStatus = "已完成";
          break;
        case 3:
          checkStatus = "已取消";
          break;
        case 4:
          checkStatus = "未预约";
          break;
      }
      return checkStatus;
    }
  }
};
</script>
