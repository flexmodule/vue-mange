<template>
    <div class="container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <!-- <el-breadcrumb-item>优惠管理</el-breadcrumb-item> -->
            <el-breadcrumb-item :to="{ path: '/standard-bussiness-data/register-coupons'}">注册送券</el-breadcrumb-item>
            <el-breadcrumb-item>注册送券添加</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <ul>
                <li>
                    <p>满减券渠道</p>
                    <el-select v-model="id" placeholder="请选择" @change="handleSelect">
                        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <p>总券数</p>
                    <el-input placeholder="总券数，若不填代表不限量" v-model="quantity" type="number">

                    </el-input>
                </li>
                <li>
                    <p>每人送的数量</p>
                    <el-input placeholder="每人送的数量" v-model="num" type="number">

                    </el-input>
                </li>
                <li>
                    <p>有效期（天）</p>
                    <el-input placeholder="有效期（天）" v-model="duration" type="number">

                    </el-input>
                </li>
                <li>
                    <p>需要订单的金额</p>
                    <el-input placeholder="需要订单的金额" v-model="money" type="number">

                    </el-input>
                </li>
                <li>
                    <p>优惠金额</p>
                    <el-input placeholder="优惠金额" v-model="discount" type="number">

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
  }
}
</style>

<script>
export default {
  data() {
    return {
      options: [
        {
          id: 1,
          name: "[app]新用户注册领取"
        },
        {
          id: 2,
          name: "[微信小程序]首次登录"
        },
        {
          id: 3,
          name: "[微信公众号]首次引导登记注册"
        }
      ],
      id: "",
      name: "",
      quantity: "",
      num: "",
      money: "",
      discount: "",
      duration: "",

      isNameEmpty: true,
      isNumEmpty: true,
      isDurationEmpty: true,
      isMoneyEmpty: true,
      isDiscountEmpty: true,
      isQuantity: true
    };
  },
  methods: {
    handleSelect(val) {
      this.id = val;
      for (var i = 0; i < this.options.length; i++) {
        if (this.id == this.options[i].id) {
          this.name = this.options[i].name;
        }
      }
    },
    submitCoupons() {
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
        this.$message.error("请选择满减券渠道");
        this.isNameEmpty = false;
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
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .post("/voucher/coupons-distribute", {
            name: this.name,
            quantity: this.quantity || -1,
            num: this.num,
            money: this.money,
            discount: this.discount,
            duration: this.duration,
            type: 1,
            autoType: this.id
          })
          .then(res => {
            loading.close();
            if (res.data.rc == 0) {
              this.$router.go(-1);
              this.$message.success("添加注册送券成功");
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(err => {
            loading.close();
          });
      }
      this.init();
    },
    init() {
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
