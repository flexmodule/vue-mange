<template>
  <div class="DiscountManage-container container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <!-- <el-breadcrumb-item>优惠管理</el-breadcrumb-item> -->
      <el-breadcrumb-item :to="{ path: '/standard-bussiness-data/index'}">优惠码</el-breadcrumb-item>
      <el-breadcrumb-item>优惠码回收站</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <div slot="header">
        <span>优惠管理回收站</span>
      </div>
      <div>
        <el-table :data="tableData" v-loading="loading" style="width: 100%">
          <el-table-column prop="name" label="用途描述">
          </el-table-column>
          <el-table-column prop="quantity" label="数量">
          </el-table-column>
          <el-table-column prop="time" label="单张使用次数">
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

    <!-- 查看优惠码 start -->
    <el-dialog :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false">
      <div slot="title">
        查看优惠码
      </div>
      <ul class="to-view">
        <li>
          <p>当前选择的医院：</p>
          <div>{{ hospitalName }}</div>
        </li>
        <li>
          <p>当前选择的套餐：</p>
          <div>{{ selMealName }}</div>
        </li>
        <li>
          <p>生成优惠码数量：</p>
          <div>{{ quantity }}</div>
        </li>
        <li>
          <p>有效期起始：</p>
          <div>{{ startTime }}</div>
        </li>
        <li>
          <p>使用次数：</p>
          <div>{{ time }}</div>
        </li>
        <li>
          <p>有效期截止：</p>
          <div>{{ endTime }}</div>
        </li>
        <li>
          <p>优惠券金额：</p>
          <div>{{ discount }}</div>
        </li>
        <li>
          <p>需要订单的金额：</p>
          <div>{{ money }}</div>
        </li>
        <li>
          <p>用途描述：</p>
          <div>{{ name }}</div>
        </li>
      </ul>
      <div slot="footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 查看优惠码 end -->

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
      time: "", //次数
      money: "", //满多少使用
      discount: "", //减少金额
      hospitalName: "", //使用医院
      selMealName: "", //适用套餐
      startTime: "", //开始时间
      endTime: "" //过期时间
    };
  },
  mounted() {
    this.getList({});
  },
  methods: {
    getList(json, success) {
      this.loading = true;
      this.$http
        .get("/voucher/promo-code-distribute/", {
          params: {
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
        .catch(err => {
          console.log(err);
        });
    },
    handleChange(index, row) {
      this.dialogVisible = true;
      this.name = row.name;
      this.quantity = row.quantity;
      this.time = row.time;
      this.money = row.money;
      this.discount = row.discount;
      this.hospitalName = row.hospitalName;
      this.selMealName = row.selMealName;
      if( row.hospitalIds == -1){
        this.hospitalName = "全部适用"
      }
      if( row.selMealIds == -1){
        this.selMealName = "全部适用"
      }
      this.startTime = row.startTime.split("/").join("-");
      this.endTime = row.endTime.split("/").join("-");
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
.to-view li {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  p {
    width: 120px;
    margin-right: 20px;
  }
}
</style>
