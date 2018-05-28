<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/experts-manage/index'}">专家管理</el-breadcrumb-item>
      <el-breadcrumb-item v-if="eid">资料维护</el-breadcrumb-item>
      <el-breadcrumb-item v-else>帮注册</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" v-if="eid">
        <el-button :type="isShow ? 'primary' : ''" @click="isShow = true">个人资料</el-button>
        <el-button :type="!isShow ? 'primary' : ''" @click="isShow = false">重置密码</el-button>
      </div>
      <ul v-if="isShow">
        <li v-if="!eid">
          <p>姓名：</p>
          <el-input v-model="name"></el-input>
        </li>
        <li>
          <p>头像：</p>
          <div class="avatar">
            <file-input v-on:fileInfo="getAvatar" fileType="image" radius="radius"></file-input>
            <div class="avatar-path">
              <img :src="avatarPath" alt="" v-if="avatarPath != '' && avatarPath != null">
              <img src="../../../static/images/expert_avatar.png" alt="" v-else>
            </div>
          </div>
        </li>
        <li>
          <p>注册手机：</p>
          <el-input v-model="phone" @blur="getUserInfo"></el-input>
        </li>
        <li>
          <p>职称：</p>
          <el-select v-model="fixLevel" placeholder="请选择" clearable>
            <el-option v-for="item in level" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </li>
        <li class="prove">
          <p>资格证明：请上传专业技术资格证书(职称证)证明</p>
          <div class="upload">
            <file-input v-on:fileInfo="getLogoImg" fileType="image"></file-input>
            <div class="certificate">
              <img :src="certificatePath" alt="">
            </div>
          </div>
        </li>
        <li>
          <p>性别：</p>
          <el-radio-group v-model="fixGender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </li>
        <li>
          <p>身份证号：</p>
          <el-input v-model="idCard"></el-input>
        </li>
        <li>
          <p>执业点：</p>
          <el-input v-model="practice"></el-input>
        </li>
        <li class="align-start">
          <p>擅长：</p>
          <div class="textarea-wrap">
            <el-input type="textarea" :rows="4" v-model="specialty"></el-input>
          </div>
        </li>
        <li class="align-start">
          <p>简介：</p>
          <div class="textarea-wrap">
            <el-input type="textarea" :rows="4" v-model="introduction"></el-input>
          </div>
        </li>
        <li class="align-start">
          <p>专家详情页图片：</p>
          <div class="upload-detail">
            <file-input v-on:fileInfo="getDetailImg" fileType="image"></file-input>
            <div class="certificate">
              <img :src="detailPath" alt="">
            </div>
          </div>
        </li>
      </ul>
      <div v-else class="reset-pwd">
        <p>点击重置密码后，新的密码将以短信形式，发往该专家的注册手机！</p>
        <el-button type="success" @click="resetPwd">重置</el-button>
      </div>
    </el-card>
    <div v-if="isShow">
      <div v-if="!eid">
        <el-button type="success" @click="registerExpert">注册</el-button>
      </div>
      <div v-else>
        <el-button type="success" @click="updateExpert">更新</el-button>
        <el-button type="info" @click="$router.push('/experts-manage/expert-detail/'+eid)">取消</el-button>
      </div>
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
    &.align-start {
      align-items: start;
    }
    &.prove {
      display: block;
      p {
        width: 100%;
        margin-bottom: 10px;
      }
      .upload {
        margin-left: 120px;
        position: relative;
        width: 150px;
        height: 150px;
        .certificate {
          width: 100%;
          height: 100%;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .upload-detail {
      width: 700px;
      height: 300px;
      position: relative;
      .certificate {
        width: 100%;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    p {
      width: 120px;
    }
    .el-select {
      width: 300px;
    }
    .el-input {
      width: 300px;
    }
    .textarea-wrap {
      width: 500px;
    }
    .avatar {
      position: relative;
      width: 100px;
      height: 100px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      .avatar-path {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }
  }
}
.reset-pwd {
  p {
    margin-bottom: 10px;
  }
}
</style>

<script>
import fileInput from "../../../components/fileInput/";
export default {
  components: {
    fileInput
  },
  data() {
    return {
      eid: null,
      isShow: true,
      name: "",
      phone: "",
      avatarPath: "",
      fixLevel: "",
      level: [
        "住院医师",
        "主治医师",
        "主任医师",
        "副主任医师",
        "医师",
        "医士",
        "五级健康管理师",
        "四级健康管理师",
        "三级健康管理师",
        "二级健康管理师",
        "一级健康管理师",
        "高级健康管理师",
        "主任药师",
        "副主任药师",
        "主管药师",
        "药师",
        "药士",
        "主任护师",
        "副主任护师",
        "主管护师",
        "护师",
        "护士",
        "主任技师",
        "副主任技师",
        "主管技师",
        "技士"
      ],
      idCard: "",
      fixGender: 1,
      certificatePath: "",
      practice: "",
      specialty: "",
      introduction: "",
      avatarId: null,
      certificateId: null,
      phoneError: true,
      cardError: true,
      comAvatarId: "",
      comPhone: "",
      comFixLevel: "",
      comCertificateId: "",
      comIdCard: "",
      comPractice: "",
      comSpecialty: "",
      comIntroduction: "",
      detailId: "",
      detailPath: "",
      comDetailId: "",
    };
  },
  mounted() {
    this.eid = this.$route.query.e;
    if (this.eid) {
      this.getData();
    }
  },
  methods: {
    getData() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .get("/expert/" + this.eid)
        .then(res => {
          console.log(res.data.data)
          if (res.data.rc == 0) {
            res = res.data.data;
            this.avatarPath = res.avatarPath;
            this.avatarId = res.avatar;
            this.phone = res.mobileNo;
            this.fixLevel = res.title;
            this.certificatePath = res.certificatePath;
            this.certificateId = res.certificateId;
            this.idCard = res.identityNo;
            this.practice = res.workUnit;
            this.specialty = res.speciality;
            this.introduction = res.description;
            this.detailId = res.detailId;
            this.detailPath = res.detailPath;
            if (res.sex == "男") {
              this.fixGender = 1;
              this.comGender = 1;
            } else if (res.sex == "女") {
              this.fixGender = 0;
              this.comGender = 0;
            }
            this.comAvatarId = res.avatar;
            this.comPhone = res.mobileNo;
            this.comFixLevel = res.title;
            this.comCertificateId = res.certificateId;
            this.comDetailId = res.detailId;
            this.comIdCard = res.identityNo;
            this.comPractice = res.workUnit;
            this.comSpecialty = res.speciality;
            this.comIntroduction = res.description;
          } else {
            this.$message.error(res.data.msg);
          }
          loading.close();
        })
        .catch(err => {
          loading.close();
        });
    },
    getAvatar(fileInfo) {
      this.avatarId = fileInfo.fileId;
    },
    getLogoImg(fileInfo) {
      this.certificateId = fileInfo.fileId;
    },
    getDetailImg(fileInfo) {
      this.detailId = fileInfo.fileId;
    },
    registerExpert() {
      this.expert(1);
    },
    updateExpert() {
      this.expert(0);
    },
    getUserInfo() {
      if (!this.eid) {
        this.$http
          .get("/expert/userInfo", {
            params: {
              mobileNo: this.phone
            }
          })
          .then(res => {
            console.log(res.data);
            if (res.data.rc == 0) {
              res = res.data.data;
              this.name = res.realName;
              this.idCard = res.identityNo;
              if (res.sex == "男") {
                this.fixGender = 1;
              } else if (res.sex == "女") {
                this.fixGender = 0;
              }
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(err => {});
      }
    },
    expert(d) {
      var sex;
      if (this.fixGender == 1) {
        sex = "男";
      } else if (this.fixGender == 0) {
        sex = "女";
      }
      var phoneReg = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
      var cardReg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      if (!phoneReg.test(this.phone)) {
        this.phoneError = false;
        this.$message.error("联系电话错误");
      }
      if (!cardReg.test(this.idCard)) {
        this.cardError = false;
        this.$message.error("身份证信息有误请修改后，保存");
      }
      if (this.phoneError && this.cardError) {
        //1注册 0更新
        if (d) {
          this.$http
            .post("/expert/", {
              avatar: this.avatarId,
              mobileNo: this.phone,
              identityNo: this.idCard,
              sex: sex,
              realName: this.name,
              title: this.fixLevel,
              certificateId: this.certificateId,
              workUnit: this.practice,
              speciality: this.specialty,
              description: this.introduction,
              detailId: this.detailId
            })
            .then(res => {
              if (res.data.rc == 0) {
                this.$message.success("注册成功");
                this.$router.go(-1);
              } else {
                this.$message.error(res.data.msg);
              }
              loading.close();
            })
            .catch(err => {
              loading.close();
            });
        } else {
          if (
            this.comAvatarId == this.avatarId &&
            this.comPhone == this.phone &&
            this.comIdCard == this.idCard &&
            this.fixGender == this.comGender &&
            this.comFixLevel == this.fixLevel &&
            this.comCertificateId == this.certificateId &&
            this.comPractice == this.practice &&
            this.comSpecialty == this.specialty &&
            this.comIntroduction == this.introduction &&
            this.detailId == this.comDetailId
          ) {
            this.$alert("无任何信息更新", {
              confirmButtonText: "确定"
            });
          } else {
            this.$confirm("确定要更新医生资料吗?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "info"
            })
              .then(() => {
                const loading = this.$loading({
                  lock: true,
                  text: "Loading",
                  spinner: "el-icon-loading",
                  background: "rgba(0, 0, 0, 0.7)"
                });
                this.$http
                  .put("/expert/" + this.eid, {
                    avatar: this.avatarId,
                    mobileNo: this.phone,
                    identityNo: this.idCard,
                    sex: sex,
                    title: this.fixLevel,
                    certificateId: this.certificateId,
                    workUnit: this.practice,
                    speciality: this.specialty,
                    description: this.introduction,
                    detailId: this.detailId
                  })
                  .then(res => {
                    if (res.data.rc == 0) {
                      this.$message.success("更新成功");
                      this.$router.push(
                        "/experts-manage/expert-detail/" + this.eid
                      );
                    } else {
                      this.$message.error(res.data.msg);
                    }
                    loading.close();
                  })
                  .catch(err => {
                    loading.close();
                  });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消更新"
                });
              });
          }
        }
      } else {
        this.phoneError = true;
        this.cardError = true;
      }
    },
    //重置密码
    resetPwd() {
      this.$confirm("确定要重置吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          this.$http
            .post("/expert/" + this.eid + "/resetPassword")
            .then(res => {
              if (res.data.rc == 0) {
                this.$message.success(
                  "重置成功，新密码已经以短信形式发往该专家的注册手机！"
                );
              } else {
                this.$message.error(res.data.msg);
              }
              loading.close();
            })
            .catch(err => {
              loading.close();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消重置"
          });
        });
    }
  }
};
</script>