<template>
    <div class="container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/standard-bussiness-data/banner-manage' }">banner管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增banner</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="mt10">
            <div class="info picture">
                <div>
                    <p>活动名称：</p>
                    <div>
                        <el-input v-model="title" placeholder="请输入活动名称"></el-input>
                    </div>
                </div>
                <div>
                    <p>banner页图片:</p>
                    <div class="img-container logo-img">
                        <file-input 
                        v-on:fileInfo="getLogoImg"
                        fileType="image"></file-input>
                        <div class="showImg">
                            <img :src="showLogoImg" v-if="showLogoImg.length>0">
                        </div>
                    </div>
                </div>
                <div>
                    <p>类型：</p>
                    <div>
                        <template>
                            <el-select v-model="bannerType" placeholder="请选择"
                                @change="selectType">
                                <el-option
                                v-for="item in type"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </div>  
                </div>
                <div v-if="ADS">
                    <p>html地址：</p>
                    <div>
                        <el-input v-model="address" placeholder="请输入html地址"></el-input>
                    </div>
                </div>
                <div>
                    <p>发布时间：</p>
                    <div>
                        <template>
                            <div class="block">
                                <el-date-picker
                                v-model="startDate"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="datetime"
                                placeholder="选择日期时间"
                                :picker-options="pickerOptions">
                                </el-date-picker>
                            </div>
                        </template>
                    </div>
                </div>
                <div>
                    <p>到期时间：</p>
                    <div>
                        <template>
                            <div class="block">
                                <el-date-picker
                                v-model="endDate"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="datetime"
                                placeholder="选择日期时间"
                                :picker-options="pickerOptions">
                                </el-date-picker>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <div class="data-submit">
             <el-button type="success" @click="editBanner">保存</el-button>
             <el-button type="info" @click="$router.go(-1)">返回</el-button>
            </div>
        </el-card> 
    </div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
}
.picture {
  div {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
    p {
      width: 120px;
      text-align: right;
      line-height: 40px;
      margin-right: 10px;
    }
    .img-container {
      position: relative;
      width: 200px;
      height: 200px;
      border: 1px dashed #c0ccda;
      border-radius: 6px;
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
  }
}
.data-submit {
  text-align: center;
}
</style>

<script>
import fileInput from "@/components/fileInput/";
export default {
  components: {
    fileInput
  },
  data() {
    return {
      pickerOptions: {
          disabledDate(time) {
              return time.getTime() < Date.now() - 8.64e7
          }
        },
      disabled: false, //
      title: "", //活动名称
      showLogoImg: "", //上传图片
      type: [
        {
          //文件类型
          value: "ADS",
          label: "广告"
        },
        {
          value: "DEFAULT",
          label: "展示图"
        }
      ],
      bannerType: "", //banner类型选中值
      address: "", //html地址
      startDate: "", //发布时间
      endDate: "", //到期时间
      logoImg: "", //图片id
      ADS: false //广告/展示图
    };
  },
  mounted() {},
  methods: {
    //类型选择
    selectType: function(val) {
      if (val === "ADS") {
        //广告
        this.ADS = true;
      } else {
        this.ADS = false;
      }
    },
    /* 图片上传 */
    getLogoImg(fileInfo) {
      //获取formData对象
      console.log(fileInfo);
      this.logoImg = fileInfo.fileId;
    },
    //编辑banner
    editBanner: function() {
      //console.log(this.bannerType);
      //console.log(this.address);
      //console.log(this.startDate);
      //console.log(this.endDate);
      this.add();
    },
    //添加预发布banner
    add: function() {
      if (!this.ADS) {
        if (
          this.logoImg === "" ||
          this.title === "" ||
          this.bannerType === "" ||
          this.startDate === "" ||
          this.endDate === ""
        ) {
          this.$message({
            message: "请填写完整信息",
            type: "warning"
          });
        } else {
          this.$http
            .post("/banner/ops/addBanner", {
              avatarId: this.logoImg,
              title: this.title,
              target: this.address,
              type: this.bannerType,
              startAt: this.startDate,
              endAt: this.endDate,
              positionId: this.$route.params.position
            })
            .then(res => {
              console.log(res);
              if (res.data.rc === 0) {
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.$router.go(-1)
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      } else {
        //广告
        if (
          this.logoImg === "" ||
          this.title === "" ||
          this.address === "" ||
          this.bannerType === "" ||
          this.startDate === "" ||
          this.endDate === ""
        ) {
          this.$message({
            message: "请填写完整信息",
            type: "warning"
          });
        } else {
          this.$http
            .post("/banner/ops/addBanner", {
              avatarId: this.logoImg,
              title: this.title,
              target: this.address,
              type: this.bannerType,
              startAt: this.startDate,
              endAt: this.endDate,
              positionId: this.$route.params.position
            })
            .then(res => {
              console.log(res);
              if (res.data.rc === 0) {
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.$router.go(-1)
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      }
    }
  }
};
</script>