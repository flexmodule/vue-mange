<template>
  <div class="DiscountManage-container container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <!-- <el-breadcrumb-item>优惠管理</el-breadcrumb-item> -->
      <el-breadcrumb-item>注册送券</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="header">
      <el-button type="primary" @click="$router.push('/standard-bussiness-data/add-register-coupons')">添加</el-button>
      <el-button @click="$router.push('/standard-bussiness-data/recycle-register-coupons')">回收站</el-button>
    </div>
    <el-card class="box-card">
      <div slot="header">
        <span>注册送券</span>
      </div>
      <div>
        <el-table :data="tableData" v-loading="loading" style="width: 100%">
          <el-table-column prop="name" label="用途描述">
          </el-table-column>
          <el-table-column prop="quantity" label="总券数">
            <template slot-scope="scope">
              <span v-if="scope.row.quantity == -1">∞</span>
              <span v-else>{{ scope.row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="已发次数">
          </el-table-column>
          <el-table-column prop="num" label="每人送的数量">
          </el-table-column>
          <el-table-column prop="money" label="订单满多少使用">
          </el-table-column>
          <el-table-column prop="discount" label="减少金额">
          </el-table-column>
          <el-table-column prop="duration" label="有效期">
          </el-table-column>
          <el-table-column label="状态" width="100" align="center">
            <template slot-scope="scope">
              <el-button size="mini" v-if="scope.row.disabled" @click="handleEnalbed(scope.$index, scope.row)">已禁用</el-button>
              <el-button size="mini" v-else @click="handleDisalbed(scope.$index, scope.row)"> 已启用</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleChange(scope.$index, scope.row)">修改</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页模块 start -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
        </el-pagination>
        <!-- 分页模块 end -->
      </div>
    </el-card>

    <!-- 修改注册送券 start -->
    <el-dialog :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false">
      <div slot="title">
        {{name}}
      </div>
      <ul>
        <li>
          <p>有效期（天）</p>
          <el-input v-model="duration">

          </el-input>
        </li>
        <li>
          <p>优惠金额</p>
          <el-input v-model="discount">

          </el-input>
        </li>
        <li>
          <p>需要的订单金额</p>
          <el-input v-model="money">

          </el-input>
        </li>
        <li>
          <p>每人送的数量</p>
          <el-input v-model="num">

          </el-input>
        </li>
      </ul>
      <div class="save" slot="footer">
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </el-dialog>
    <!-- 修改注册送券 end -->

  </div>
</template>
<script>
export default {
  name: "DiscountManage",
  data() {
    return {
      tableData: [],
      currentPage: 1,
      currentPageSize: 10,
      totalNum: 0,
      loading: false,

      dialogVisible: false,

      id: "",
      name: "", //用途描述
      quantity: "", //数量
      time: "", //已发次数
      num: "", //数量
      money: "", //满多少使用
      discount: "", //减少金额
      duration: "", //有效期

      currentPage: 1
    };
  },
  mounted() {
    this.getList({});
  },
  methods: {
    getList(json, success) {
      this.loading = true;
      this.$http
        .get("/voucher/coupons-distribute/", {
          params: {
            couponsDistributeType: 1,
            currentPage: json.page || 1,
            pageSize: json.size || 10,
            isDeleted: false
          }
        })
        .then(res => {
          this.tableData = res.data.data.resultList;
          this.totalNum = res.data.data.total;
          this.loading = false;
          success ? success() : "";
        })
        .catch(error => {
          this.loading = false;
        });
    },
    //启用
    handleEnalbed(index, row) {
      this.$http
        .put("/voucher/coupons-distribute/disable", {
          id: row.id,
          isDisabled: false
        })
        .then(res => {
          if (res.data.rc == 0) {
            this.getList({
              page: this.currentPage,
              size: this.currentPageSize
            });
            this.$message.success("启用成功");
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //禁用
    handleDisalbed(index, row) {
      this.$http
        .put("/voucher/coupons-distribute/disable", {
          id: row.id,
          isDisabled: true
        })
        .then(res => {
          if (res.data.rc == 0) {
            this.getList({
              page: this.currentPage,
              size: this.currentPageSize
            });
            this.$message.success("禁用成功");
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //修改框
    handleChange(index, row) {
      console.log(row);
      this.dialogVisible = true;
      this.id = row.id;
      this.name = row.name;
      this.time = row.time;
      this.num = row.num;
      this.money = row.money;
      this.discount = row.discount;
      this.duration = row.duration;
    },
    //修改保存
    handleSubmit() {
      this.$http
        .put("/voucher/coupons-distribute/", {
          id: this.id,
          name: this.name,
          money: this.money,
          discount: this.discount,
          duration: this.duration
        })
        .then(res => {
          if (res.data.rc == 0) {
            this.dialogVisible = false;
            this.getList({
              page: this.currentPage,
              size: this.currentPageSize
            });
            this.$message.success("修改注册送券信息成功");
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //删除
    handleDelete(index, row) {
      this.$confirm("是否确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .delete("/voucher/coupons-distribute/" + row.id)
            .then(res => {
              if (res.data.rc == 0) {
                this.getList({
                  page: this.currentPage,
                  size: this.currentPageSize
                });
                this.$message.success("删除成功");
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
            message: "取消删除"
          });
        });
    },
    closeDialog() {
      this.dialogVisible = false;
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
    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
.box-card {
  margin: 10px 0;
}
.el-dialog {
  ul li {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    p {
      width: 300px;
      text-align: right;
      margin-right: 20px;
    }
    .el-input {
      width: 400px;
    }
  }
  .save {
    text-align: center;
  }
}
</style>
