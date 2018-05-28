<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/group-check-manage/info-manage'}">企业信息管理</el-breadcrumb-item>
      <el-breadcrumb-item v-if="companyId">修改企业信息</el-breadcrumb-item>
      <el-breadcrumb-item v-else>新增企业</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header">
        <span v-if="companyId">修改企业信息</span>
        <span v-else>新增企业</span>
      </div>
      <ul>
        <li>
          <p>企业名称</p>
          <el-input v-model="companyName" clearable></el-input>
        </li>
        <li>
          <p>省市区</p>
          <el-cascader :placeholder="holderArea" size="large" :options="options" v-model="selectedOptions" @change="handleChange">
          </el-cascader>
        </li>
        <li>
          <p>详细地址</p>
          <el-input v-model="address" clearable></el-input>
        </li>
        <li>
          <p>规模</p>
          <el-input-number v-model="scale" :min="0" label="人数" class="mr10"></el-input-number>
          人
        </li>
        <li>
          <p>性质</p>
          <el-select v-model="nature" placeholder="请选择">
            <el-option v-for="item in natureList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </li>
        <li>
          <p>联系人</p>
          <el-input v-model="contact" clearable></el-input>
        </li>
        <li>
          <p>联系电话</p>
          <el-input v-model="phone" clearable></el-input>
        </li>
      </ul>
    </el-card>

    <div>
      <el-button type="success" @click="handleSubmit">保存</el-button>
    </div>
  </div>

</template>


<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
  ul li {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    p {
      width: 100px;
    }
    .el-input {
      width: 260px;
    }
    .el-cascader {
      width: 260px;
    }
    .el-select {
      width: 260px;
    }
    .inputWidth {
      width: 80px;
      margin-right: 10px;
    }
  }
}
</style>
 
 <script>
import {
  provinceAndCityData,
  regionData,
  CodeToText
} from "@/utils/areaSelect";
export default {
  name: "InfoManage",
  data() {
    return {
      companyId: null,
      companyName: "",
      options: regionData,
      selectedOptions: [],
      filterData_province: "",
      filterData_city: "",
      filterData_district: "",
      address: "",
      nature: "未知",
      natureList: ["未知", "政府单位", "事业单位", "国资企业", "外资企业", "合资企业", "渠道", "私有企业"],
      scale: 0,
      contact: "",
      phone: "",

      holderArea: "请选择",

      nameEmpty: true,
      phoneError: true
    };
  },
  mounted() {
    this.companyId = this.$route.query.companyId;
    if (this.companyId) {
      this.getData();
    }
  },
  methods: {
    handleChange(value) {
      value.filter((t, i) => {
        switch (i) {
          case 0:
            this.filterData_province = CodeToText[t];
            break;
          case 1:
            this.filterData_city = CodeToText[t];
            break;
          case 2:
            this.filterData_district = CodeToText[t];
            break;
        }
      });
    },
    getData() {
      this.$http
        .get("/group-check-manage/company-info/" + this.companyId)
        .then(res => {
          if (res.data.rc == 0) {
            this.companyName = res.data.data.name;
            this.filterData_province = res.data.data.province;
            this.filterData_city = res.data.data.city;
            this.filterData_district = res.data.data.district;
            if (this.filterData_province != "") {
              this.holderArea =
                this.filterData_province +
                "/" +
                this.filterData_city +
                "/" +
                this.filterData_district;
            }

            this.address = res.data.data.address;
            this.scale = res.data.data.scale;
            this.nature = res.data.data.type;
            this.contact = res.data.data.contact;
            this.phone = res.data.data.phone;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSubmit() {
      if (this.companyName == "") {
        this.nameEmpty = false;
        this.$message.error("企业名称不能为空");
      }
      var phoneReg = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
      if (!phoneReg.test(this.phone)) {
        this.phoneError = false;
        this.$message.error("联系电话错误");
      }
      if (this.nameEmpty && this.phoneError) {
        if (this.companyId) {
          this.$http
            .post("/group-check-manage/company-info/" + this.companyId, {
              name: this.companyName,
              province: this.filterData_province,
              city: this.filterData_city,
              district: this.filterData_district,
              address: this.address,
              type: this.nature,
              scale: this.scale,
              contact: this.contact,
              phone: this.phone
            })
            .then(res => {
              if (res.data.rc == 0) {
                this.$message.success("修改成功");
                this.$router.go(-1);
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.$http
            .post("/group-check-manage/company-info/add", {
              name: this.companyName,
              province: this.filterData_province,
              city: this.filterData_city,
              district: this.filterData_district,
              address: this.address,
              type: this.nature,
              scale: this.scale,
              contact: this.contact,
              phone: this.phone
            })
            .then(res => {
              if (res.data.rc == 0) {
                this.$message.success("增加成功");
                this.$router.go(-1);
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
      this.nameEmpty = true;
      this.phoneError = true;
    }
  }
};
</script>