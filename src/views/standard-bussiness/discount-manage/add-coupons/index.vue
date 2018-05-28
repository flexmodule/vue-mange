<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <!-- <el-breadcrumb-item>优惠管理</el-breadcrumb-item> -->
      <el-breadcrumb-item :to="{ path: '/standard-bussiness-data/discount-manage' }">优惠码</el-breadcrumb-item>
      <el-breadcrumb-item>添加优惠码</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <ul>
        <li>
          <p>选择适用的医院</p>
          <el-select v-model="hspIds" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethodHsp" :loading="loading" @change="selectHsp">
            <el-option v-for="item in hspList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </li>
        <li>
          <p>选择适用的套餐</p>
          <el-select v-model="pgIds" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethodPg" :loading="loading" :disabled="isSelectHsp">
            <el-option v-for="item in pgList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </li>
        <li>
          <p>生成优惠码个数</p>
          <el-input placeholder="生成优惠码个数" v-model="quantity" type="number">

          </el-input>
        </li>
        <li>
          <p>有效期起始</p>
          <el-date-picker v-model="startTime" type="date" :editable="false" clearable placeholder="有效期起始">
          </el-date-picker>
        </li>
        <li>
          <p>使用的次数，最多500</p>
          <el-input placeholder="500" v-model="times" type="number">

          </el-input>
        </li>
        <li>
          <p>有效期截止</p>
          <el-date-picker v-model="endTime" type="date" :editable="false" clearable placeholder="有效期截止">
          </el-date-picker>
        </li>
        <li>
          <p>优惠券金额</p>
          <el-input placeholder="优惠券金额" v-model="discount" type="number">

          </el-input>
        </li>
        <li>
          <p>需要订单的金额</p>
          <el-input placeholder="需要订单的金额" v-model="money" type="number">

          </el-input>
        </li>
        <li>
          <p>用途描述</p>
          <el-input placeholder="用途描述" v-model="name">

          </el-input>
        </li>
        <li class="save">
          <el-button type="primary" @click="submitCoupons">保存</el-button>
        </li>
      </ul>

    </el-card>
  </div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
  ul li {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    &.save {
      display: block;
      text-align: center;
    }
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
    .el-select {
      width: 400px;
    }
  }
}
</style>

<script>
export default {
  data() {
    return {
      loading: false,
      isSelectHsp: true,
      hspIds: "",
      hspList: [],
      hid: "",
      pgIds: "",
      pgList: [],

      quantity: "",
      startTime: "",
      times: "", //次数
      endTime: "",
      money: "",
      discount: "",
      name: "",

      isNameEmpty: true,
      isMoneyEmpty: true,
      isDiscountEmpty: true,
      isEndTimeEmpty: true,
      isTimesEmpty: true,
      isStartTimeEmpty: true,
      isQuantityEmpty: true,
      isGt: true
    };
  },
  methods: {
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
    selectHsp() {
      if (this.hspIds.length == 0) {
        this.isSelectHsp = true;
        this.hid = -1;
      } else {
        this.isSelectHsp = false;
        this.hid = "";
        for (var i in this.hspIds) {
          if (i == this.hspIds.length - 1) {
            this.hid += this.hspIds[i];
          } else {
            this.hid += this.hspIds[i] + ",";
          }
        }
      }
      this.selMealList = [];
    },
    //搜索套餐
    remoteMethodPg(query) {
      if (query !== "") {
        this.$http
          .get("/set-meal-list", {
            params: {
              hospitalIds: this.hid,
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
    //提交
    submitCoupons() {
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
      if (this.times == "") {
        this.$message.error("使用的次数不能为空");
        this.isTimesEmpty = false;
      } else if (this.times < 1 || this.times > 500) {
        this.$message.error("使用的次数输入有误，应在1-500之间");
        this.isTimesEmpty = false;
      } else {
        this.isTimesEmpty = true;
      }
      if (this.startTime == "") {
        this.$message.error("有效期起始不能为空");
        this.isStartTimeEmpty = false;
      } else {
        this.isStartTimeEmpty = true;
      }
      if (this.quantity == "") {
        this.$message.error("生成优惠码个数不能为空");
        this.isQuantityEmpty = false;
      } else if (this.quantity < 0) {
        this.$message.error("生成优惠码个数不能小于零");
        this.isQuantityEmpty = false;
      } else {
        this.isQuantityEmpty = true;
      }
      if (this.isEndTimeEmpty && this.isStartTimeEmpty) {
        if (this.endTime.getTime() <= this.startTime.getTime()) {
          this.$message.error("有效期截止时间应晚于有效期起始时间");
          this.isGt = false;
        } else {
          this.isGt = true;
        }
      }
      if (this.pgIds.length == 0) {
        var pgIds = -1;
      } else {
        var pgIds = "";
        for (var i in this.pgIds) {
          if (i == this.pgIds.length - 1) {
            pgIds += this.pgIds[i];
          } else {
            pgIds += this.pgIds[i] + ",";
          }
        }
      }
      if (
        this.isNameEmpty &&
        this.isMoneyEmpty &&
        this.isDiscountEmpty &&
        this.isEndTimeEmpty &&
        this.isTimesEmpty &&
        this.isStartTimeEmpty &&
        this.isQuantityEmpty &&
        this.isGt
      ) {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .post("/voucher/promo-code-distribute/", {
            name: this.name,
            quantity: this.quantity,
            time: this.times,
            money: this.money,
            discount: this.discount,
            hospitalIds: this.hid,
            selMealIds: pgIds,
            startTime: this.startTime,
            endTime: this.endTime
          })
          .then(res => {
            loading.close();
            if (res.data.rc == 0) {
              this.$message.success("增加成功");
              this.$router.go(-1);
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(err => {
            loading.close();
          });
      }
    }
  }
};
</script>
