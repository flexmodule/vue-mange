<template>
  <div class="DiscountManage-container container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <!-- <el-breadcrumb-item>优惠管理</el-breadcrumb-item> -->
      <el-breadcrumb-item>代金券</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="header">
      <el-button type="primary" @click="$router.push('/standard-bussiness-data/add-voucher')">添加</el-button>
      <el-button @click="$router.push('/standard-bussiness-data/recycle-voucher')">回收站</el-button>
    </div>

    <el-card class="box-card">
      <div slot="header">
        <span>代金券</span>
      </div>
      <div>
        <el-table :data="tableData" v-loading="loading" style="width: 100%">
          <el-table-column prop="name" label="代金券名称">
          </el-table-column>
          <el-table-column label="总券数">
            <template slot-scope="scope">
              <span v-if="scope.row.quantity == -1">∞</span>
              <span v-else>{{ scope.row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="已发放数">
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
          <el-table-column prop="duration" label="有效期（天）">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleChange(scope.$index, scope.row)" class="mb10">修改</el-button>
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

    <!-- 修改代金券 start -->
    <el-dialog :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false">
      <div slot="title">
        {{name}}
      </div>
      <ul>
        <li>
          <p>选择适用的医院</p>
          <el-select v-model="hspIds" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethodHsp" :loading="loading" @change="selectHsp">
            <el-option v-for="item in hspList" :key="item.value" :label="item.label" :value="item">
            </el-option>
          </el-select>
        </li>
        <li>
          <p>当前选择的医院</p>
          <div v-if="hospitalList.length != 0">
            <el-tag v-for="(tag,index) in hospitalList" :key="tag.value" closable @close="handleCloseHsp(index)">
              {{tag.label}}
            </el-tag>
          </div>
          <span v-else>全部医院</span>
        </li>
        <li>
          <p>选择适用的套餐</p>
          <el-select v-model="pgIds" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethodPg" :loading="loading" @change="selectPg">
            <el-option v-for="item in pgList" :key="item.value" :label="item.label" :value="item">
            </el-option>
          </el-select>
        </li>
        <li>
          <p>当前选择的套餐</p>
          <div v-if="selMealList.length != 0">
            <el-tag v-for="(tag,index) in selMealList" :key="tag.value" closable @close="handleClosePg(index)">
              {{tag.label}}
            </el-tag>
          </div>
          <span v-else>全部套餐</span>
        </li>
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
        <!-- <li>
            <p>每人送的数量</p>
            <el-input
            v-model="num">

            </el-input>
        </li> -->
        <li>
          <p>代金券名称</p>
          <el-input v-model="name">

          </el-input>
        </li>
      </ul>
      <div class="save" slot="footer">
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </el-dialog>
    <!-- 修改代金券 end -->

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

      name: "", //代金券名称
      quantity: "", //数量
      time: "", //次数
      num: "",
      money: "", //满多少使用
      discount: "", //减少金额
      hospitalIds: "", //医院id
      hospitalList: [], //医院列表
      hospitalName: "", //使用医院
      selMealIds: "", //套餐id
      selMealList: [],
      selMealName: "", //适用套餐
      duration: "",

      id: "",
      hspIds: "",
      hspList: [],
      pgIds: "",
      pgList: []
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
    handleChange(index, row) {
      this.dialogVisible = true;
      this.id = row.id;
      this.name = row.name;
      this.money = row.money;
      this.discount = row.discount;
      this.hospitalIds = row.hospitalIds;
      this.selMealIds = row.selMealIds;

      this.hospitalList = [];
      if (row.hospitalName != "") {
        this.hospitalName = row.hospitalName;
        var hspNameList = row.hospitalName.split(",");
        var hspIdList = row.hospitalIds.split(",");
        for (var i = 0; i < hspNameList.length; i++) {
          this.hospitalList[i] = { label: hspNameList[i], value: hspIdList[i] };
        }
      } else {
        this.hospitalList = [];
      }

      this.selMealList = [];
      if (row.selMealName != "") {
        this.selMealName = row.selMealName;
        var pgNameList = row.selMealName.split(",");
        var pgIdList = row.selMealIds.split(",");
        for (var i = 0; i < pgNameList.length; i++) {
          this.selMealList[i] = { label: pgNameList[i], value: pgIdList[i] };
        }
      } else {
        this.selMealName = "";
      }

      this.duration = row.duration;
    },
    //搜索医院
    remoteMethodHsp(query) {
      if (query !== "") {
        this.$http
          .get("/hospital/ops/name?name=" + query)
          .then(res => {
            if (res.data.data != []) {
              this.hspList = res.data.data.map(item => {
                return { value: item.id, label: item.name };
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.hspList = [];
      }
    },
    //选择医院
    selectHsp(val) {
      if (this.filters(this.hospitalList, val.value)) {
        this.$message.error("该医院已选择");
      } else {
        this.hospitalList.push(val);
      }
      this.hspIds = "";
    },
    //关已选择医院
    handleCloseHsp(index) {
      this.hospitalList.splice(index, 1);
    },
    //过滤
    filters(arr, id) {
      return arr.some((item, index) => {
        return item.value == id;
      });
    },
    getHspIds() {
      var hid = "";
      if (this.hospitalList.length == 0) {
        hid = -1;
      } else {
        for (var i = 0; i < this.hospitalList.length; i++) {
          if (i == this.hospitalList.length - 1) {
            hid += this.hospitalList[i].value;
          } else {
            hid += this.hospitalList[i].value + ",";
          }
        }
      }
      return hid;
    },
    //搜索套餐
    remoteMethodPg(query) {
      if (query !== "") {
        var hid = "";
        if (this.getHspIds() != -1) {
          hid = this.getHspIds();
        }
        this.$http
          .get("/set-meal-list", {
            params: {
              hospitalIds: hid,
              keyWord: query
            }
          })
          .then(res => {
            console.log(res.data)
            if (res.data.data.resultList != []) {
              this.pgList = res.data.data.resultList.map(item => {
                return { value: item.id, label: item.name };
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.pgList = [];
      }
    },
    //选择套餐
    selectPg(val) {
      if (this.filters(this.selMealList, val.value)) {
        this.$message.error("该套餐已选择");
      } else {
        this.selMealList.push(val);
      }
      this.pgIds = "";
    },
    //关已选择套餐
    handleClosePg(index) {
      this.selMealList.splice(index, 1);
    },
    handleSubmit() {
      var pid = "";
      if (this.selMealList.length == 0) {
        pid = -1;
      } else {
        for (var i = 0; i < this.selMealList.length; i++) {
          if (i == this.selMealList.length - 1) {
            pid += this.selMealList[i].value;
          } else {
            pid += this.selMealList[i].value + ",";
          }
        }
      }
      this.$http
        .put("/voucher/coupons-distribute/", {
          id: this.id,
          name: this.name,
          money: this.money,
          discount: this.discount,
          duration: this.duration,
          hospitals: this.getHspIds(),
          selMeals: pid
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
                this.$message.success("删除成功");
                this.getList({
                  page: this.currentPage,
                  size: this.currentPageSize
                });
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
    },
    split(val){
      return val.split(',');
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
