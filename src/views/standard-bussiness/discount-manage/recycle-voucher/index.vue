<template>
  <div class="DiscountManage-container container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <!-- <el-breadcrumb-item>优惠管理</el-breadcrumb-item> -->
      <el-breadcrumb-item :to="{ path: '/standard-bussiness-data/voucher'}">代金券</el-breadcrumb-item>
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
          <el-table-column label="适用医院" width="190">
            <template slot-scope="scope">
              <span v-if="scope.row.hospitalName == ''">全部适用</span>
              <div v-else>
                <p v-for="item in split(scope.row.hospitalName)">{{ item }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="适用套餐" width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.selMealName == ''">全部适用</span>
              <div v-else>
                <p v-for="item in split(scope.row.selMealName)">{{ item }}</p>
              </div>
            </template>
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

    <!-- 查看代金券 start -->
    <el-dialog :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false">
      <div slot="title">
        查看代金券
      </div>
      <ul class="to-view">
        <li>
          <p>代金券名称：</p>
          <div>{{ name }}</div>
        </li>
        <li>
          <p>总券数：</p>
          <div>{{ quantity }}</div>
        </li>
        <li>
          <p>每人送的数量：</p>
          <div>{{ num }}</div>
        </li>
        <li>
          <p>有效期（天）：</p>
          <div>{{ duration }}</div>
        </li>
        <li>
          <p>需要订单的金额：</p>
          <div>{{ money }}</div>
        </li>
        <li>
          <p>优惠金额：</p>
          <div>{{ discount }}</div>
        </li>
        <li>
          <p>适用的医院:</p>
          <div>{{ hospitalName }}</div>
        </li>
        <li>
          <p>适用的套餐:</p>
          <div>{{ selMealName }}</div>
        </li>
      </ul>
      <div slot="footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 查看代金券 end -->

  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      currentPageSize: 10,
      totalNum: 0,
      loading: false,

      dialogVisible: false,
      name: "", //代金券名称
      quantity: "", //数量
      num: "",
      money: "", //满多少使用
      discount: "", //减少金额
      hospitalName: "", //使用医院
      selMealName: "", //适用套餐
      duration: "",
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
            couponsDistributeType: 2,
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
      if( row.quantity == -1 ){
        this.quantity = "∞";
      }
      this.num = row.num;
      this.money = row.money;
      this.discount = row.discount;
      this.duration = row.duration;
      this.hospitalName = row.hospitalName;
      if( row.hospitalIds == -1 ){
        this.hospitalName = "全部适用";
      }
      this.selMealName = row.selMealName;
      if( row.selMealIds == -1 ){
        this.selMealName = "全部适用";
      }
    },
    handleSizeChange(val) {
      this.currentPageSize = val;
      this.currentPage = 1;
      this.getList({
        currentPage: this.currentPage,
        pageSize: val
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList({
        currentPage: val,
        pageSize: this.currentPageSize
      });
    },
    split(val){
      return val.split(',');
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
      min-width: 120px;
      text-align: right;
      margin-right: 20px;
    }
    .el-input {
      width: 200px;
    }
    .el-select {
      width: 200px;
    }
    .el-tag {
      margin-right: 10px;
      margin-bottom: 5px;
    }
  }
}
</style>
