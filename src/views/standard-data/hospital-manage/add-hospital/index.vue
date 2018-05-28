<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage' }">医院管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{isDetail?'医院详情':'新增医院'}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div class="info base">
        <div class="leftInfo infoItem">
          <div>
            <p>医院信息：</p>
            <el-input v-model="hospitalName" placeholder="请输入医院名称"></el-input>
          </div>
          <div>
            <p>医院等级: </p>
            <el-select v-model="hospitalGrade" clearable placeholder="请选择">
              <el-option v-for="item in hospitalGradeList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="rightInfo infoItem">
          <h3>预约设置</h3>
          <div>
            <p>休息日</p>
            <el-checkbox-group v-model="checkedCities">
              <el-checkbox v-for="city in cities" :label="city" :key="city">{{handleWeek(city)}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div>
            <p>上班时间范围</p>
            <el-time-select placeholder="起始时间" v-model="startTime" :picker-options="{
                            start: '00:00',
                            step: '00:15',
                            end: '24:00'
                            }">
            </el-time-select>
            <el-time-select placeholder="结束时间" v-model="endTime" :picker-options="{
                            start: '08:00',
                            step: '00:15',
                            end: '18:30',
                            minTime: startTime
                            }">
            </el-time-select>
          </div>
          <div>
            <p>预约提前天数</p>
            <el-input-number :min="0" v-model="aheadDay"></el-input-number>
          </div>
          <div>
            <p>每日限额</p>
            <el-input-number :min="0" v-model="limitNum" :disabled="checked"></el-input-number>
            <el-checkbox v-model="checked" class="ml20">不限额</el-checkbox>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>医院简介</span>
      </div>
      <div class="info introduction">
        <div>
          <p>联系电话</p>
          <el-input placeholder="请输入联系电话" v-model="telphone" clearable>
          </el-input>
        </div>
        <div>
          <p>医院标签</p>
          <div>
            <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput" v-show="dynamicTags.length < 4">添加新标签</el-button>
          </div>
        </div>
        <div class="introArea">
          <p>医院介绍</p>
          <el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="hospitalIntro">
          </el-input>
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>地理信息</span>
      </div>
      <div class="info location">
        <div>
          <p>所在城市</p>
          <!-- 省市区三级联动 -->
          <el-cascader size="large" :options="options" v-model="selectedOptions" @change="handleChange">
          </el-cascader>
        </div>
        <div>
          <p>详细地址</p>
          <el-input placeholder="请输入详细地址" v-model="hospitalAddress" clearable>
          </el-input>
        </div>
        <div>
          <p>经纬度</p>
          <el-input placeholder="请输入经度" v-model="longitude" clearable>
          </el-input>
          <el-input placeholder="请输入维度" v-model="latitude" clearable>
          </el-input>
        </div>
      </div>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>图片信息</span>
      </div>
      <div class="info picture">
        <div>
          <p>医院logo</p>
          <div class="img-container logo-img">
            <file-input v-on:fileInfo="getLogoImg" fileType="image"></file-input>
            <img :src="showLogoImg" v-if="showLogoImg.length>0" class="showImg">
          </div>

        </div>
        <div>
          <p>医院主图</p>
          <div class="img-container main-img">
            <file-input v-on:fileInfo="getMainImg" fileType="image"></file-input>
            <img :src="showMainImg" v-if="showMainImg.length>0" class="showImg">
          </div>
        </div>

      </div>
    </el-card>
    <div class="data-submit">
      <el-button type="success" @click="dataSubmit" :disabled="hospitalName.length<=0">保存</el-button>
      <el-button type="info" @click="$router.push(`/standard-data/hospital-manage/hospital/${hospitalId}`)">取消</el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
  .info {
    display: flex;
    justify-content: space-between;
  }
}
.infoItem {
  padding: 10px 20px;
  h3 {
    text-align: center;
  }
  div {
    display: flex;
    align-items: center;
    margin: 5px 0;
    p {
      width: 100px;
      margin-right: 10px;
    }
  }
}
.rightInfo {
  border: 1px solid #000;
}
.introduction,
.location {
  display: flex;
  flex-direction: column;
  div {
    display: flex;
    align-items: center;
    margin: 5px 0;
  }
  p {
    width: 80px;
    margin-right: 10px;
  }
  .el-cascader,
  .el-input,
  .el-textarea {
    width: 500px;
  }
  .introArea {
    align-items: flex-start;
    p {
      margin-top: 5px;
    }
  }
}
/* 标签样式start */
.el-tag {
  margin-right: 10px;
}
.button-new-tag {
  margin-right: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.introduction .input-new-tag {
  width: 120px;
  vertical-align: bottom;
}
/* 标签样式start */

/* 图片信息样式 */
.picture {
  div {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
    p {
      width: 80px;
    }
    .img-container {
      position: relative;
      width: 200px;
      height: 200px;
    }

    .main-img {
      width: 600px;
      height: 300px;
      .file-input {
        width: 600px;
        height: 300px;
      }
      img {
        width: 600px;
        height: 300px;
      }
    }
    .showImg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}
.data-submit {
  margin-top: 20px;
}
</style>
<script>
import {
  provinceAndCityData,
  regionData,
  CodeToText,
  TextToCode
} from "@/utils/areaSelect";
// import fileInput from "../../../../components/fileInput/";
const fileInput = () => import("../../../../components/fileInput/");
export default {
  components: {
    fileInput
  },
  name: "AddHospital",
  data() {
    return {
      isDetail: false, //展示详情内容
      //省市区三级联动
      options: regionData,
      selectedOptions: [],
      hospitalId: 0,
      hospitalName: "",
      hospitalCode: "",
      hospitalGradeList: [
        "公立三特",
        "公立三甲",
        "公立三乙",
        "公立三丙",
        "公立二甲",
        "公立二乙",
        "公立二丙",
        "公立一甲",
        "公立一乙",
        "公立一丙",
        "其他"
      ],
      hospitalGrade: "",

      // 休息日
      checkedCities: [],
      cities: ["1", "2", "3", "4", "5", "6", "7"],
      weekMap: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      //时间范围
      timeRange: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      startTime: "",
      endTime: "",
      //提前天数
      aheadDay: 7,
      //每日限额
      limitNum: 0,
      checked: false,
      //联系电话
      telphone: "",
      /* 医院标签 start */
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      /* 医院标签 end */
      hospitalIntro: "", //医院介绍
      hospitalProvince: "",
      hospitalCity: "",
      hospitalDistrict: "",
      hospitalAddress: "", //医院详细地址
      //图片信息
      logoId: "",
      avatarId: "",
      showLogoImg: "",
      showMainImg: "",
      loading: "",
      longitude: "",
      latitude: "",
      isTrue: true,
    };
  },
  watch: {
    inputValue: function(newValue, oldValue) {
      this.inputValue = newValue.replace(/,/g, "");
    }
  },
  methods: {
    /* 星期的映射方法 */
    handleWeek(value) {
      return this.weekMap[value - 1];
    },
    //省市区三级联动变化方法
    handleChange(value) {
      value.filter((t, i) => {
        switch (i) {
          case 0:
            this.hospitalProvince = CodeToText[t];
            break;
          case 1:
            this.hospitalCity = CodeToText[t];
            break;
          case 2:
            this.hospitalDistrict = CodeToText[t];
            break;
        }
      });
      this.isTrue = true;
    },
    //添加新标签
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      var inputValue = this.inputValue;
      var len = 0;
      for (var i = 0; i < inputValue.length; i++) {
        var c = inputValue.charCodeAt(i);
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
          len++;
        } else {
          len += 2;
        }
      }
      if (inputValue) {
        if (len <= 16) {
          this.dynamicTags.push(inputValue);
        } else {
          this.$message.error("每个标签不超过8个字");
        }
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    /* 图片上传 */
    getLogoImg(fileInfo) {
      //获取文件信息
      console.log(fileInfo);
      this.logoId = fileInfo.fileId;
    },
    getMainImg(fileInfo) {
      console.log(fileInfo);
      this.avatarId = fileInfo.fileId;
    },
    //提交信息
    dataSubmit() {
      /* 请求前全屏加载 */
      this.loading = this.$loading({
        lock: true,
        text: "正在保存",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.isDetail ? this.updateFun() : this.addFun();
    },
    areaCode2Text(province, city, district) {
      if (province) {
        if (TextToCode[province]) {
          this.selectedOptions.push(TextToCode[province].code);
          if (city) {
            if (TextToCode[province][city]) {
              this.selectedOptions.push(TextToCode[province][city].code);
              if (district) {
                if (TextToCode[province][city][district]) {
                  this.selectedOptions.push(
                    TextToCode[province][city][district].code
                  );
                } else {
                  this.isTrue = false;
                  this.hospitalProvince = "";
                  this.hospitalCity = "";
                  this.hospitalDistrict = "";
                  this.$message.error(province + city + district + "不存在");
                }
              }
            } else {
                  this.isTrue = false;
              this.hospitalProvince = "";
              this.hospitalCity = "";
              this.hospitalDistrict = "";
              this.$message.error(province + city + district + "不存在");
            }
          }
        } else {
                  this.isTrue = false;
          this.hospitalProvince = "";
          this.hospitalCity = "";
          this.hospitalDistrict = "";
          this.$message.error(province + city + district + "不存在");
        }
      }
    },
    addFun() {
      if (this.checked) {
        this.limitNum = null;
      }
      if (this.isTrue) {
        if (this.longitude <= 180 && this.longitude >= -180) {
          if (this.latitude <= 90 && this.latitude >= -90) {
            this.$http
              .post("/hospital/ops/add", {
                name: this.hospitalName,
                grade: this.hospitalGrade,
                disableWeekdays: this.checkedCities.join(","),
                workingStartTime: this.startTime,
                workingEndTime: this.endTime,
                advanceReservationDays: this.aheadDay,
                limitNumber: this.limitNum,
                tel: this.telphone,
                tags: this.dynamicTags.join(","),
                intro: this.hospitalIntro,
                province: this.hospitalProvince,
                city: this.hospitalCity,
                district: this.hospitalDistrict,
                address: this.hospitalAddress,
                longitude: this.longitude,
                latitude: this.latitude,
                logoId: this.logoId,
                avatarId: this.avatarId
              })
              .then(res => {
                this.loading.close();
                if (res.data.rc === 0) {
                  this.$notify({
                    title: "成功",
                    message: " 保存成功",
                    type: "success"
                  });
                  this.$router.push("/standard-data/hospital-manage/hospital/"+res.data.data);
                } else {
                  this.$notify({
                    title: "错误",
                    message: res.data.msg,
                    type: "error"
                  });
                }
              })
              .catch(error => {
                this.loading.close();
                console.log(error);
              });
          } else {
            this.$message.error("纬度应在-90到90之间");
            this.loading.close();
          }
        } else {
          this.$message.error("经度应在-180到180之间");
          this.loading.close(); 
        }
      } else {
        this.loading.close();
        this.$message.error("省市区必填");
      }
    },
    updateFun() {
      if (this.checked) {
        this.limitNum = null;
      }
      /* 省市区必须存在 */
      if (this.isTrue) {
      
      // if (this.hospitalProvince && this.hospitalCity && this.hospitalDistrict) {
        if (this.longitude <= 180 && this.longitude >= -180) {
          if (this.latitude <= 90 && this.latitude >= -90) {
            this.$http
              .put("/hospital/ops/update/" + this.hospitalId, {
                code: this.hospitalCode,
                name: this.hospitalName,
                grade: this.hospitalGrade,
                disableWeekdays: this.checkedCities.join(","),
                workingStartTime: this.startTime,
                workingEndTime: this.endTime,
                advanceReservationDays: this.aheadDay,
                limitNumber: this.limitNum,
                tel: this.telphone,
                tags: this.dynamicTags.join(","),
                intro: this.hospitalIntro,
                province: this.hospitalProvince,
                city: this.hospitalCity,
                district: this.hospitalDistrict,
                address: this.hospitalAddress,
                latitude: this.latitude,
                longitude: this.longitude,
                logoId: this.logoId,
                avatarId: this.avatarId
              })
              .then(res => {
                this.loading.close();
                if (res.data.rc === 0) {
                  this.$notify({
                    title: "成功",
                    message: " 保存成功",
                    type: "success"
                  });
                  this.$router.push("/standard-data/hospital-manage/hospital/"+this.hospitalId);
                } else {
                  this.$notify({
                    title: "错误",
                    message: res.data.msg,
                    type: "error"
                  });
                }
              })
              .catch(error => {
                this.loading.close();
                console.log(error);
              });
          } else {
            this.loading.close();
            this.$message.error("纬度应在-90到90之间");
          }
        } else {
          this.loading.close(); 
          this.$message.error("经度应在-180到180之间");
        }
      } else {
        this.loading.close();
        this.$message.error("省市区必填");
      }
    },
    getInfo(hospitalId) {
      const loading = this.$loading({
        lock: true,
        text: "正在加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http.get("/hospital/ops/" + hospitalId).then(res => {
        if (res.data.rc === 0) {
          console.log(res.data.data);
          res = res.data.data;
          this.hospitalCode = res.code;
          this.hospitalName = res.name;
          this.hospitalGrade = res.grade;
          if (res.disableWeekdays === "") {
            this.checkedCities = [];
          } else {
            if (res.disableWeekdays) {
              this.checkedCities = res.disableWeekdays.split(",");
            }
          }
          this.startTime = res.workingStartTime;
          this.endTime = res.workingEndTime;
          this.aheadDay = res.advanceReservationDays;
          if (res.limitNumber == "" || res.limitNumber == null) {
            this.limitNum = 0;
            this.checked = true;
          } else {
            this.limitNum = res.limitNumber;
          }
          this.telphone = res.tel;
          if (res.tags) {
            this.dynamicTags = res.tags.split(",");
          }
          this.hospitalIntro = res.intro;
          this.hospitalProvince = res.province;
          this.hospitalCity = res.city;
          this.longitude = res.longitude;
          this.latitude = res.latitude;
          this.hospitalDistrict = res.district;
          this.areaCode2Text(res.province, this.hospitalCity, res.district);
          this.hospitalAddress = res.address;
          this.logoId = res.logoId;
          this.avatarId = res.avatarId;
          this.showLogoImg = res.logoPath || "";
          this.showMainImg = res.avatarPath || "";
        } else {
          this.$message.error(res.data.msg);
        }
        loading.close();
      });
    }
  },
  mounted() {
    if (this.$route.query.d === "1") {
      this.hospitalId = this.$route.query.i;
      this.isDetail = true; //当前是详情页
      this.getInfo(this.hospitalId);
    }
  }
};
</script>