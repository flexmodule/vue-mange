<template>
    <div class="container">
        <el-breadcrumb separator-class="el-icon-arrow-right">   
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <!-- <el-breadcrumb-item>优惠管理</el-breadcrumb-item> -->
            <el-breadcrumb-item :to="{ path: '/standard-bussiness-data/voucher' }">代金券</el-breadcrumb-item>  
            <el-breadcrumb-item>添加代金券</el-breadcrumb-item>  
        </el-breadcrumb>
        <el-card class="box-card">
            <ul>
                <li>
                    <p>代金券名称</p>
                    <el-input
                    placeholder="代金券名称"
                    v-model="name">

                    </el-input>
                </li>
                <li>
                    <p>总券数</p>
                    <el-input
                    placeholder="总券数，若不填代表不限量"
                    v-model="quantity"
                    type="number">

                    </el-input>
                </li>
                <li>
                    <p>每人送的数量</p>
                    <el-input
                    placeholder="每人送的数量"
                    v-model="num"
                    type="number">

                    </el-input>
                </li>
                <li>
                    <p>有效期（天）</p>
                    <el-input
                    placeholder="有效期（天）"
                    v-model="duration"
                    type="number">

                    </el-input>
                </li>
                <li>
                    <p>需要订单的金额</p>
                    <el-input
                    placeholder="需要订单的金额"
                    v-model="money"
                    type="number">

                    </el-input>
                </li>
                <li>
                    <p>优惠金额</p>
                    <el-input
                    placeholder="优惠金额"
                    v-model="discount"
                    type="number">

                    </el-input>
                </li>
                <li>
                    <p>选择适用的医院</p>
                    <el-select
                        v-model="hspIds"
                        multiple
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="remoteMethodHsp"
                        :loading="loading"
                        @change="selectHsp">
                        <el-option
                        v-for="item in hspList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <p>选择适用的套餐</p>
                    <el-select
                        v-model="pgIds"
                        multiple
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="remoteMethodPg"
                        :loading="loading"
                        :disabled="isSelectHsp">
                        <el-option
                        v-for="item in pgList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </li>
                <li class="save">
                    <el-button type="primary" @click="submitVoucher">保存</el-button>
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
      width: 720px;
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
      hspIds: "",
      hspList: [],
      hid: "",
      pgIds: "",
      pgList: [],
      name: "",
      quantity: "",
      num: "",
      money: "",
      discount: "",
      duration: "",

      isSelectHsp: true,

      isNameEmpty: true,
      isNumEmpty: true,
      isDurationEmpty: true,
      isMoneyEmpty: true,
      isDiscountEmpty: true,
      isQuantity: true,

      hspList: [],
      isSubmit: false,
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
        this.hid = '';
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
    submitVoucher() {
      var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (this.discount == "") {
        this.$message.error("优惠金额不能为空");
        this.isDiscountEmpty = false;
      } else if (!reg.test(this.discount)) {
        this.$message.error("优惠金额输入有误");
        this.isDiscountEmpty = false;
      }
      if (this.money == "") {
        this.$message.error("需要订单的金额不能为空");
        this.isMoneyEmpty = false;
      } else if (!reg.test(this.money)) {
        this.$message.error("需要订单的金额输入有误");
        this.isMoneyEmpty = false;
      }
      if (this.duration == "") {
        this.$message.error("有效期不能为空");
        this.isDurationEmpty = false;
      } else if (this.duration < 0) {
        this.$message.error("有效期不能小于零");
        this.isDurationEmpty = false;
      }
      if (this.num == "") {
        this.$message.error("每人送的数量不能为空");
        this.isNumEmpty = false;
      } else if (this.num < 0) {
        this.$message.error("每人送的数量不能小于零");
        this.isNumEmpty = false;
      }
      if (this.quantity < 0) {
        this.$message.error("总券数不能小于零");
        this.isQuantity = false;
      }
      if (this.name == "") {
        this.$message.error("代金券名称不能为空");
        this.isNameEmpty = false;
      }
      if (this.hspIds.length == 0) {
        var hspIds = -1;
      } else {
        var hspIds = "";
        for (var i in this.hspIds) {
          if (i == this.hspIds.length - 1) {
            hspIds += this.hspIds[i];
          } else {
            hspIds += this.hspIds[i] + ",";
          }
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
        this.isNumEmpty &&
        this.isDurationEmpty &&
        this.isMoneyEmpty &&
        this.isDiscountEmpty &&
        this.isQuantity
      ) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$http
          .post( "/voucher/coupons-distribute", {
            name: this.name,
            quantity: this.quantity || -1,
            num: this.num,
            money: this.money,
            discount: this.discount,
            hospitals: this.hid,
            selMeals: pgIds,
            duration: this.duration,
            type: 2
          })
          .then(res => {
            loading.close();
            if (res.data.rc == 0) {
              this.$message.success("添加代金券成功");
              this.$router.go(-1);
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(err => {
            loading.close();
          });
      }
      
      this.isNameEmpty = true;
      this.isNumEmpty = true;
      this.isDurationEmpty = true;
      this.isMoneyEmpty = true;
      this.isDiscountEmpty = true;
      this.isQuantity = true;
    }
  }
};
</script>
