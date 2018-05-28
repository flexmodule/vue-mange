<template>
  <div class="DiscountManage-container container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <!-- <el-breadcrumb-item>优惠管理</el-breadcrumb-item> -->
      <el-breadcrumb-item>优惠码</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="header">
      <el-button type="primary" @click="$router.push('/standard-bussiness-data/add-coupons')">添加</el-button>
      <el-button @click="$router.push('/standard-bussiness-data/recycle-coupons')">回收站</el-button>
    </div>
    <el-card class="box-card">
      <div slot="header">
        <span>优惠码</span>
      </div>
      <div class="dataList">
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
          <el-table-column prop="createTime" label="创建时间">
          </el-table-column>
          <el-table-column label="开始时间-过期时间">
            <template slot-scope="scope">
              <span>{{scope.row.startTime + '-' + scope.row.endTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-button size="mini" v-if="scope.row.disabled" @click="handleEnalbed(scope.$index, scope.row)">已禁用</el-button>
              <el-button size="mini" v-else @click="handleDisalbed(scope.$index, scope.row)"> 已启用</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleChange(scope.$index, scope.row)" class="mb10">修改</el-button>
              <el-button size="mini" @click="showCoupons(scope.$index, scope.row)" class="mb10">显示优惠码</el-button>
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

    <!-- 修改优惠码 start -->
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
          <p>有效期起始</p>
          <el-date-picker v-model="startTime" type="date" :editable="false" clearable placeholder="有效期起始">
          </el-date-picker>
        </li>
        <li>
          <p>有效期截止</p>
          <el-date-picker v-model="endTime" type="date" :editable="false" clearable placeholder="有效期截止">
          </el-date-picker>
        </li>
        <li>
          <p>优惠券金额</p>
          <el-input placeholder="优惠券金额" v-model="discount">

          </el-input>
        </li>
        <li>
          <p>需要订单的金额</p>
          <el-input placeholder="需要订单的金额" v-model="money">

          </el-input>
        </li>
        <li>
          <p>用途描述</p>
          <el-input placeholder="用途描述" v-model="name">

          </el-input>
        </li>
      </ul>
      <div slot="footer">
        <el-button type="primary" @click="submitChange">保存</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </el-dialog>
    <!-- 修改优惠码 end -->

    <!-- 显示优惠码 start -->
    <el-dialog :visible.sync="couponsVisible" width="60%" :close-on-click-modal="false">
      <div slot="title">
        <el-button type="primary" @click="export2Excel" v-loading="exportLoading">导出</el-button>
      </div>
      <el-table :data="data" v-loading="loading" style="width: 100%">
        <el-table-column prop="code" label="优惠码" align="center">
        </el-table-column>
        <el-table-column prop="time" label="可使用次数" align="center">
        </el-table-column>
        <el-table-column prop="usedTime" label="已使用次数" align="center">
        </el-table-column>
      </el-table>
      <!-- 分页模块 start -->
      <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <!-- 分页模块 end -->
    </el-dialog>
    <!-- 显示优惠码 end -->
  </div>
</template>
<script>
import { export2Excel } from "../../../utils/utils";
export default {
  name: "DiscountManage",
  data() {
    return {
      tableData: [],
      currentPage: 1,
      currentPageSize: 10,
      totalNum: 0,
      loading: false,
      exportLoading: false,

      data: [],
      id: "",
      currPage: 1,
      currPageSize: 10,
      total: 0,

      dialogVisible: false,
      couponsVisible: false,
      name: "", //用途描述
      quantity: "", //数量
      time: "", //次数
      money: "", //满多少使用
      discount: "", //减少金额
      hospitalIds: "", //医院id
      hospitalName: "", //使用医院
      hospitalList: [], //医院列表
      selMealIds: "", //套餐id
      selMealName: "", //适用套餐
      selMealList: [],
      createTime: "", //创建时间
      startTime: "", //开始时间
      endTime: "", //过期时间

      changeId: "",
      hspIds: "",
      hspList: [],
      pgIds: "",
      pgList: [],

      isNameEmpty: true,
      isMoneyEmpty: true,
      isDiscountEmpty: true,
      isStartTimeEmpty: true,
      isEndTimeEmpty: true,
      isGt: true
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
            isDeleted: false
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
    getCouponsList(json, success) {
      this.$http
        .get("/voucher/promo-code-manage/", {
          params: {
            id: json.id,
            currentPage: json.page || 1,
            pageSize: json.size || 10
          }
        })
        .then(res => {
          this.data = res.data.data.resultList;
          this.total = res.data.data.total;
          this.loading = false;
          success ? success() : "";
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleChange(index, row) {
      this.dialogVisible = true;
      this.changeId = row.id;
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

      this.createTime = row.createTime;
      this.startTime = row.startTime.split("/").join("-");
      this.endTime = row.endTime.split("/").join("-");
    },
    showCoupons(index, row) {
      this.couponsVisible = true;
      (this.id = row.id),
        this.getCouponsList({
          id: row.id
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
            .delete("/voucher/promo-code-distribute/" + row.id)
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
    export2Excel() {
      /* 表格数据导出到Excel */
      this.exportLoading = true;
      this.$http
        .get("/voucher/promo-code-manage/" + this.id, {
          params: {}
        })
        .then(res => {
          if (res.data.rc == 0) {
            export2Excel(
              res.data.data,
              ["优惠码", "可适用次数", "已使用次数"],
              ["code", "time", "usedTime"],
              "优惠码列表"
            );
            this.exportLoading = false;
          } else {
            this.$message.error("导出失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //优惠券分页
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
    //优惠码分页
    sizeChange(val) {
      this.currPageSize = val;
      this.currPage = 1;
      this.getCouponsList({
        id: this.id,
        page: this.currPage,
        size: val
      });
    },
    currentChange(val) {
      this.currPage = val;
      this.getCouponsList({
        id: this.id,
        page: val,
        size: this.currPageSize
      });
    },
    //禁用
    handleDisalbed(index, row) {
      this.$http
        .put("/voucher/promo-code-distribute/disable/" + row.id)
        .then(res => {
          if (res.data.rc == 0) {
            this.$message.success("禁用成功");
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
    },
    //启用
    handleEnalbed(index, row) {
      this.$http
        .put("/voucher/promo-code-distribute/enable/" + row.id)
        .then(res => {
          if (res.data.rc == 0) {
            this.$message.success("启用成功");
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
      var hid = "";
      if (this.getHspIds() != -1) {
        hid = this.getHspIds();
      }
      if (query !== "") {
        this.$http
          .get("/set-meal-list", {
            params: {
              hospitalIds: hid,
              keyWord: query
            }
          })
          .then(res => {
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
    //修改
    submitChange() {
      var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (this.name == "") {
        this.$message.error("用途描述不能为空");
        this.isNameEmpty = false;
      } else {
        this.isNameEmpty = true;
      }
      if (this.money == "") {
        this.$message.error("需要订单的金额不能为空");
        this.isMoneyEmpty = false;
      } else if (!reg.test(this.money)) {
        this.$message.error("需要订单的金额输入有误");
        this.isMoneyEmpty = false;
      } else {
        this.isMoneyEmpty = true;
      }
      if (this.discount == "") {
        this.$message.error("优惠金额不能为空");
        this.isDiscountEmpty = false;
      } else if (!reg.test(this.discount)) {
        this.$message.error("优惠金额输入有误");
        this.isDiscountEmpty = false;
      } else {
        this.isDiscountEmpty = true;
      }
      if (this.endTime == "") {
        this.$message.error("有效期截止不能为空");
        this.isEndTimeEmpty = false;
      } else {
        this.isEndTimeEmpty = true;
      }
      if (this.startTime == "") {
        this.$message.error("有效期起始不能为空");
        this.isStartTimeEmpty = false;
      } else {
        this.isStartTimeEmpty = true;
      }
      if (this.isEndTimeEmpty && this.isStartTimeEmpty) {
        if (
          new Date(this.endTime).getTime() <= new Date(this.startTime).getTime()
        ) {
          this.$message.error("有效期截止时间应晚于有效期起始时间");
          this.isGt = false;
        } else {
          this.isGt = true;
        }
      }
      if (
        this.isNameEmpty &&
        this.isMoneyEmpty &&
        this.isDiscountEmpty &&
        this.startTime &&
        this.isEndTimeEmpty &&
        this.isGt
      ) {
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
          .put("/voucher/promo-code-distribute/", {
            id: this.changeId,
            name: this.name,
            money: this.money,
            discount: this.discount,
            hospitalIds: this.getHspIds(),
            selMealIds: pid,
            startTime: this.startTime,
            endTime: this.endTime
          })
          .then(res => {
            if (res.data.rc == 0) {
              this.$message.success("修改成功");
              this.dialogVisible = false;
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
      }
    },
    closeDialog() {
      this.dialogVisible = false;
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
      width: 120px;
      text-align: right;
      margin-right: 20px;
    }
    .el-input {
      width: 200px;
    }
    .el-select {
      width: 200px;
    }
    .el-date-picker {
      width: 200px;
    }
  }
  .el-tag {
    margin-right: 10px;
  }
}
</style>
