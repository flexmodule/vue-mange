<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/group-check-manage/index'}">团检企业</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/group-check-manage/booking-situation/'+ groupId + '?companyId=' + companyId}">预约情况</el-breadcrumb-item>
      <el-breadcrumb-item>员工信息编辑</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header">
        <span>员工信息编辑</span>
      </div>
      <ul class="employees-info">
        <li>
          <p>
            <span>姓名：</span>
            <el-input v-model="name"></el-input>
          </p>
          <p class="widthP35">
            <span>性别：</span>
            <el-select v-model="gender">
              <el-option v-for="item in isGender" :key="item" :value="item" :label="item"></el-option>
            </el-select>
            <span>年龄：</span>
            <el-input v-model="age"></el-input>
            <span>婚否：</span>
            <el-select v-model="married">
              <el-option v-for="item in isMarried" :key="item" :value="item" :label="item"></el-option>
            </el-select>
            <p>
              <span>身份证：</span>
              <el-input v-model="idCard"></el-input>
            </p>
        </li>
        <li>
          <p>
            <span>联系电话：</span>
            <el-input v-model="phone"></el-input>
          </p>
          <p>
            <span>团检编号：</span>
            <el-input v-model="checkCode"></el-input>
          </p>
          <p>
            <span>员工号：</span>
            <el-input v-model="employeesNum"></el-input>
          </p>
        </li>
        <li>
          <p>
            <span>部门：</span>
            <el-input v-model="department"></el-input>
          </p>
          <p>
            <span>职级：</span>
            <el-input v-model="rank"></el-input>
          </p>
        </li>
        <li>
          <p class="flex-top">
            <span>套餐编码：</span>
            <el-input type="textarea" v-model="packageCode"></el-input>
          </p>
        </li>
      </ul>
      <div class="tip">
        <span>注：不同套餐编码用英文逗号隔开 部门：从一级部门写起，上下级部门用户英文斜杠隔开</span>
      </div>
    </el-card>
    <div>
      <el-button type="success" @click="handleSubmit">保存</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
  .employees-info {
    li {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      p {
        display: flex;
        align-items: center;
        width: 25%;
        margin-right: 20px;
        &.widthP35 {
          width: 40%;
          span {
            width: 12%;
          }
          .el-select {
            width: 18%;
            margin-right: 10px;
          }
          .el-input {
            width: 12%;
            margin-right: 10px;
          }
        }
        &.flex-top {
          align-items: top;
          width: 60%;
          span {
            width: 20%;
          }
        }
        span {
          width: 25%;
          white-space: nowrap;
          margin-right: 10px;
        }
        .el-input {
          width: 60%;
        }
      }
    }
  }
  .tip {
    color: red;
  }
}
</style>

<script>
export default {
  name: "Edit-employeesInfo",
  data() {
    return {
      groupId: null,
      companyId: null,
      employeesId: null,
      name: "",
      gender: "",
      isGender: ["男", "女"],
      age: "",
      married: "",
      isMarried: ["已婚", "未婚"],
      idCard: "",
      phone: "",
      checkCode: "",
      employeesNum: "",
      department: "",
      rank: "",
      packageCode: ""
    };
  },
  created() {
    this.groupId = this.$route.params.gid;
    this.companyId = this.$route.query.companyId;
    this.employeesId = this.$route.query.employeesId;
    this.getInfo();
  },
  methods: {
    getInfo() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .get("/group-check-manage/group-order-employee/" + this.employeesId)
        .then(res => {
          loading.close();
          if (res.data.rc == 0) {
            res = res.data.data;
            this.name = res.realName;
            this.gender = res.sex;
            this.age = res.age;
            this.married = res.married;
            this.idCard = res.identity;
            this.phone = res.mobilePhone;
            this.checkCode = res.checkupNo;
            this.employeesNum = res.employeeNo;
            this.department = res.department;
            this.rank = res.position;
            this.packageCode = res.setMealTemplateId;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          loading.close();
        });
    },
    handleSubmit() {
      if (this.name != "") {
        var phoneReg = /^1[3|4|5|8][0-9]\d{8}$/;
        if (!phoneReg.test(this.phone)) {
          this.$message.error("手机号有误请修改后，保存");
        } else {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          var params = {
            id: this.employeesId,
            groupOrderId: this.groupId,
            realName: this.name,
            sex: this.gender,
            age: this.age,
            married: this.married,
            identity: this.idCard,
            mobilePhone: this.phone,
            checkupNo: this.checkCode,
            employeeNo: this.employeesNum,
            department: this.department,
            position: this.rank,
            setMealTemplateId: this.packageCode
          };
          this.$http
            .post(
              "/group-check-manage/group-order-employee/" +
                this.employeesId +
                "/update",
              params
            )
            .then(res => {
              loading.close();
              if (res.data.rc == 0) {
                this.$message.success("员工信息编辑成功");
                this.$router.go(-1);
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(err => {
              loading.close();
            });
        }
      } else {
        this.$message.error("员工姓名不能为空");
      }
    }
  }
};
</script>
