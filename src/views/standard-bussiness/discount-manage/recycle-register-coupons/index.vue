<template>
  <div class="DiscountManage-container container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <!-- <el-breadcrumb-item>优惠管理</el-breadcrumb-item> -->
      <el-breadcrumb-item :to="{ path: '/standard-bussiness-data/register-coupons'}">注册送券</el-breadcrumb-item>
      <el-breadcrumb-item>回收站</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <div slot="header">
        <span>优惠管理回收站</span>
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
          <el-table-column prop="recycleTime" label="回收时间">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleChange(scope.$index, scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页模块 start -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
        </el-pagination>
        <!-- 分页模块 end -->
      </div>
    </el-card>

    <!-- 查看注册送券 start -->
    <el-dialog :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false">
      <div slot="title">
        查看注册送券
      </div>
      <ul class="to-view">
        <li>
          <p>满减券渠道：</p>
          <div>{{ name }}</div>
        </li>
        <li>
          <p>总券数：</p>
          <div>{{ quantity }}</div>
        </li>
        <li>
          <p>有效期起始：</p>
          <div>{{ time }}</div>
        </li>
        <li>
          <p>每人送的数量：</p>
          <div>{{ num }}</div>
        </li>
        <li>
          <p>需要的订单金额：</p>
          <div>{{ money }}</div>
        </li>
        <li>
          <p>优惠金额：</p>
          <div>{{ discount }}</div>
        </li>
        <li>
          <p>有效期（天）：</p>
          <div>{{ duration }}</div>
        </li>
      </ul>
      <div slot="footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 查看注册送券 end -->
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
      name: "", //用途描述
      quantity: "", //数量
      time: "", //已发次数
      num: "", //数量
      money: "", //满多少使用
      discount: "", //减少金额
      duration: "" //有效期
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
            isDeleted: true
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
    handleChange(index, row) {
      this.dialogVisible = true;
      this.name = row.name;
      this.quantity = row.quantity;
      if (this.quantity == -1) {
        this.quantity = "∞";
      }
      this.time = row.time;
      this.num = row.num;
      this.money = row.money;
      this.discount = row.discount;
      this.duration = row.duration;
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
  }
}
</style>
