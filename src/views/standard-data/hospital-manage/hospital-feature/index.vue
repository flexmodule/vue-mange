<template>
  <div class="feature-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage' }">医院管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage/hospital/'+hospitalId }">{{hospitalName}}</el-breadcrumb-item>
      <el-breadcrumb-item>医院特色</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" v-loading="eLoading">
      <div slot="header" class="header">
        <span>特色设备</span>
        <el-button type="primary" @click="showAdd('equipment')">新增</el-button>
      </div>
      <div v-for="(item, index) in equipmentList" :key="index" class="list">
        <div class="wrap">
          <div class="info-wrap">
            <div class="info">
              <p>设备名称：</p>
              <p>{{ item.name }}</p>
            </div>
            <div class="info area">
              <p>设备介绍：</p>
              <p>{{ item.intro }}</p>
            </div>
            <div class="info">
              <p>设备照片：</p>
              <div class="img-wrap">
                <img :src="item.avatarPath" alt="">
              </div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="info area">
              <p>用户受益：</p>
              <p>{{ item.userBenefit }}</p>
            </div>
          </div>
        </div>
        <div class="opeartion">
          <el-button type="primary" @click="showEdit('equipment',item)">编辑</el-button>
          <el-button type="danger" @click="handleDelete('equipment',item.id)">删除</el-button>
        </div>
      </div>
    </el-card>

    <!-- 暂无 -->
    <!-- <el-card class="box-card" v-loading="dLoading">
      <div slot="header" class="header">
        <span>诊疗特色</span>
        <el-button type="primary" @click="showAdd('diagnosis')">新增</el-button>
      </div>
      <div v-for="(item, index) in diagnosisList" :key="index" class="list">
        <div class="wrap">
          <div class="info-wrap">
            <div class="info">
              <p>诊疗名称：</p>
              <p>{{ item.name }}</p>
            </div>
            <div class="info area">
              <p>特色说明：</p>
              <p>{{ item.description }}</p>
            </div>
          </div>
          <div class="info-wrap">
            <div class="info area">
              <p>诊疗介绍：</p>
              <p>{{ item.intro }}</p>
            </div>
          </div>
        </div>
        <div class="opeartion">
          <el-button type="primary" @click="showEdit('diagnosis',item)">编辑</el-button>
          <el-button type="danger" @click="handleDelete('diagnosis',item.id)">删除</el-button>
        </div>
      </div>
    </el-card> -->

    <el-card class="box-card" v-loading="sLoading">
      <div slot="header" class="header">
        <span>服务案例</span>
        <el-button type="primary" @click="showAdd('service')">新增</el-button>
      </div>
      <div v-for="(item, index) in serviceList" :key="index" class="list">
        <div class="wrap">
          <div class="info-wrap">
            <div class="info">
              <p>公司名称：</p>
              <p>{{ item.companyName }}</p>
            </div>
            <div class="info">
              <p>公司logo：</p>
              <div class="img-wrap">
                <img :src="item.avatarPath" alt="">
              </div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="info area">
              <p>案例说明：</p>
              <p>{{ item.caseExplain }}</p>
            </div>
          </div>
        </div>
        <div class="opeartion">
          <el-button type="primary" @click="showEdit('service',item)">编辑</el-button>
          <el-button type="danger" @click="handleDelete('service',item.id)">删除</el-button>
        </div>
      </div>
    </el-card>

    <el-card v-loading="hLoading">
      <div slot="header" class="header">
        <span>院内环境</span>
      </div>
      <div class="hospital-img">
        <ul class="img-list">
          <li v-for="(item, index) in imgList" :key="index">
            <img :src="item.avatarPath" alt="">
            <el-input v-model="item.name"></el-input>
            <i class="el-icon-circle-close col-red" @click="closeImg(index)"></i>
          </li>
          <div class="img-add">
            <file-input v-on:fileInfo="getHspEnv" fileType="image" isImg="no"></file-input>
          </div>
        </ul>

      </div>
      <div class="opeartion">
        <el-button type="success" @click="submitHspImg()">保存</el-button>
         <el-button icon="el-icon-circle-close-outline" @click="$router.push(`/standard-data/hospital-manage/hospital/${hospitalId}`)">取 消</el-button> 
      </div>
    </el-card>

    <!-- 弹窗 start -->
    <el-dialog :title="selectClassify" :visible.sync="dialogVisible" width="60%" center>
      <div class="wrap" v-if="selectClassify.indexOf('设备') != -1">
        <div class="info-wrap">
          <div class="info">
            <p>设备名称：</p>
            <el-input v-model="equipmentName"></el-input>
          </div>
          <div class="info area">
            <p>设备介绍：</p>
            <el-input v-model="equipmentIntroduce" type="textarea" :rows="4"></el-input>
          </div>
          <div class="info">
            <p>设备照片：</p>
            <div class="avatar">
              <file-input v-on:fileInfo="getAvatar" fileType="image" v-if="imgShow"></file-input>
              <div class="avatar-path">
                <img :src="avatarPath" alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="info-wrap">
          <div class="info area">
            <p>用户受益：</p>
            <el-input v-model="equipmentBenefit" type="textarea" :rows="4"></el-input>
          </div>
        </div>
      </div>
      <div class="wrap" v-if="selectClassify.indexOf('诊疗') != -1">
        <div class="info-wrap">
          <div class="info">
            <p>诊疗名称：</p>
            <el-input v-model="diagnosisName"></el-input>
          </div>
          <div class="info area">
            <p>特色说明：</p>
            <el-input v-model="diagnosisInstructions" type="textarea" :rows="4"></el-input>
          </div>
          <div class="info area">
            <p>诊疗介绍：</p>
            <el-input v-model="diagnosisIntroduce" type="textarea" :rows="4"></el-input>
          </div>
        </div>
      </div>
      <div class="wrap" v-if="selectClassify.indexOf('服务') != -1">
        <div class="info-wrap">
          <div class="info">
            <p>公司名称：</p>
            <el-input v-model="serviceName"></el-input>
          </div>
          <div class="info">
            <p>公司logo:</p>
            <div class="avatar">
              <file-input v-on:fileInfo="getLogo" fileType="image" v-if="imgShow"></file-input>
              <div class="avatar-path">
                <img :src="logoPath" alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="info-wrap">
          <div class="info area">
            <p>案例说明:</p>
            <el-input v-model="serviceInstructions" type="textarea" :rows="4"></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="submit()">保 存</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button> 
      </span>
    </el-dialog>
    <!-- 弹窗 end -->
  </div>
</template>

<style lang="scss" scoped>
.feature-container {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .box-card {
    margin: 10px 0;
  }
  .list {
    margin-bottom: 20px;
  }
}
.wrap {
  display: flex;
  .info-wrap {
    width: 50%;
    margin-right: 20px;
    .info {
      display: flex;
      margin-bottom: 20px;
      align-items: center;
      &.area {
        align-items: flex-start;
      }
      p {
        margin-right: 20px;
        &:first-child {
          min-width: 80px;
        }
      }
      .el-input {
        width: 180px;
      }
      .img-wrap {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .avatar {
        position: relative;
        width: 200px;
        height: 200px;
        .avatar-path {
          width: 200px;
          height: 200px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
.opeartion {
  text-align: left;
  margin-top: 20px;
}
.hospital-img {
  display: flex;
  .img-list {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 21%;
      margin-right: 20px;
      margin-bottom: 20px;
      width: 200px;
      position: relative;
      .col-red {
        position: absolute;
        top: -5px;
        right: -5px;
        color: red;
      }
      img {
        width: 200px;
        height: 200px;
      }
    }
    .img-add {
      width: 200px;
      height: 200px;
      position: relative;
    }
  }
}
</style>

<script>
const fileInput = () => import("@/components/fileInput/");
export default {
  name: "hospitalFeature",
  components: {
    fileInput
  },
  data() {
    return {
      hospitalId: null,
      hospitalName: "",
      selectClassify: "",
      dialogVisible: false,
      isAdd: true,
      id: "",
      imgShow: false,
      equipmentList: [],
      eLoading: false,
      equipmentName: "",
      equipmentIntroduce: "",
      equipmentBenefit: "",
      avatarId: "",
      avatarPath: "",
      diagnosisList: [],
      dLoading: false,
      diagnosisName: "",
      diagnosisInstructions: "",
      diagnosisIntroduce: "",
      serviceList: [],
      sLoading: false,
      serviceName: "",
      serviceInstructions: "",
      logoId: "",
      logoPath: "",
      imgList: [],
      hLoading: false
    };
  },
  mounted() {
    this.hospitalId = this.$route.params.hid;
    this.getInfo();
    this.getEquipment();
    this.getDiagnosis();
    this.getService();
    this.getHspImg();
  },
  methods: {
    getInfo() {
      this.$http.get("/hospital/ops/" + this.hospitalId).then(res => {
        if (res.data.rc === 0) {
          this.hospitalName = res.data.data.name;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    switch(classify, isAdd, item) {
      this.dialogVisible = true;
      this.imgShow = true;
      switch (classify) {
        case "equipment":
          if (isAdd) {
            this.selectClassify = "新增设备";
            this.id = "";
            this.equipmentName = "";
            this.equipmentIntroduce = "";
            this.equipmentBenefit = "";
            this.avatarId = "";
            this.avatarPath = "";
          } else {
            this.selectClassify = "编辑设备";
            this.id = item.id;
            this.equipmentName = item.name;
            this.equipmentIntroduce = item.intro;
            this.equipmentBenefit = item.userBenefit;
            this.avatarId = item.picId;
            this.avatarPath = item.avatarPath;
          }
          break;
        case "diagnosis":
          if (isAdd) {
            this.selectClassify = "新增诊疗特色";
            this.id = "";
            this.diagnosisName = "";
            this.diagnosisInstructions = "";
            this.diagnosisIntroduce = "";
          } else {
            this.selectClassify = "编辑诊疗特色";
            this.id = item.id;
            this.diagnosisName = item.name;
            this.diagnosisInstructions = item.description;
            this.diagnosisIntroduce = item.intro;
          }
          break;
        case "service":
          if (isAdd) {
            this.selectClassify = "新增服务案例";
            this.id = "";
            this.serviceName = "";
            this.serviceInstructions = "";
            this.logoId = "";
            this.logoPath = "";
          } else {
            this.selectClassify = "编辑服务案例";
            this.id = item.id;
            this.serviceName = item.companyName;
            this.serviceInstructions = item.caseExplain;
            this.logoId = item.picId;
            this.logoPath = item.avatarPath;
          }
          break;
      }
    },
    showAdd(classify) {
      this.isAdd = true;
      this.switch(classify, this.isAdd);
    },
    showEdit(classify, item) {
      this.isAdd = false;
      this.switch(classify, this.isAdd, item);
    },
    getAvatar(fileInfo) {
      this.avatarId = fileInfo.fileId;
    },
    getLogo(fileInfo) {
      this.logoId = fileInfo.fileId;
    },
    getEquipment() {
      this.eLoading = true;
      this.$http
        .get(`/hospital/ops/${this.hospitalId}/equipment`)
        .then(res => {
          if (res.data.rc == 0) {
            this.equipmentList = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
          this.eLoading = false;
        })
        .catch(err => {
          this.eLoading = false;
        });
    },
    addEquipment() {
      this.$http
        .post(`/hospital/ops/${this.hospitalId}/equipment/add`, {
          name: this.equipmentName,
          intro: this.equipmentIntroduce,
          userBenefit: this.equipmentBenefit,
          picId: this.avatarId
        })
        .then(res => {
          if (res.data.rc == 0) {
            this.$message.success("添加特色设备成功");
            this.dialogVisible = false;
            this.imgShow = false;
            this.getEquipment();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateEquipment() {
      this.$http
        .put(`/hospital/ops/${this.hospitalId}/equipment/update`, {
          id: this.id,
          name: this.equipmentName,
          intro: this.equipmentIntroduce,
          userBenefit: this.equipmentBenefit,
          picId: this.avatarId
        })
        .then(res => {
          if (res.data.rc == 0) {
            this.$message.success("修改特色设备成功");
            this.dialogVisible = false;
            this.imgShow = false;
            this.getEquipment();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getDiagnosis() {
      this.dLoading = true;
      this.$http
        .get(`/hospital/ops/${this.hospitalId}/feature`)
        .then(res => {
          if (res.data.rc == 0) {
            this.diagnosisList = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
          this.dLoading = false;
        })
        .catch(err => {
          this.dLoading = false;
        });
    },
    addDiagnosis() {
      this.$http
        .post(`/hospital/ops/${this.hospitalId}/feature/add`, {
          name: this.diagnosisName,
          intro: this.diagnosisIntroduce,
          description: this.diagnosisInstructions
        })
        .then(res => {
          if (res.data.rc == 0) {
            this.$message.success("添加诊疗特色成功");
            this.dialogVisible = false;
            this.getDiagnosis();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateDiagnosis() {
      this.$http
        .put(`/hospital/ops/${this.hospitalId}/feature/update`, {
          id: this.id,
          name: this.diagnosisName,
          intro: this.diagnosisIntroduce,
          description: this.diagnosisInstructions
        })
        .then(res => {
          if (res.data.rc == 0) {
            this.$message.success("修改诊疗特色成功");
            this.dialogVisible = false;
            this.getDiagnosis();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getService() {
      this.sLoading = true;
      this.$http
        .get(`/hospital/ops/${this.hospitalId}/serve-case`)
        .then(res => {
          if (res.data.rc == 0) {
            this.serviceList = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
          this.sLoading = false;
        })
        .catch(err => {
          this.sLoading = false;
        });
    },
    addService() {
      this.$http
        .post(`/hospital/ops/${this.hospitalId}/serve-case/add`, {
          companyName: this.serviceName,
          caseExplain: this.serviceInstructions,
          picId: this.logoId
        })
        .then(res => {
          if (res.data.rc == 0) {
            this.$message.success("添加服务案例成功");
            this.dialogVisible = false;
            this.imgShow = false;
            this.getService();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateService() {
      this.$http
        .put(`/hospital/ops/${this.hospitalId}/serve-case/update`, {
          id: this.id,
          companyName: this.serviceName,
          caseExplain: this.serviceInstructions,
          picId: this.logoId
        })
        .then(res => {
          if (res.data.rc == 0) {
            this.$message.success("修改服务案例成功");
            this.dialogVisible = false;
            this.imgShow = false;
            this.getService();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleDelete(item, id) {
      switch (item) {
        case "equipment":
          this.$http
            .delete(`/hospital/ops/${this.hospitalId}/equipment/delete`, {
              params: {
                equipmentId: id
              }
            })
            .then(res => {
              if (res.data.rc == 0) {
                this.$message.success("删除特色设备成功");
                this.getEquipment();
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
          break;
        case "diagnosis":
          this.$http
            .delete(`/hospital/ops/${this.hospitalId}/feature/delete`, {
              params: {
                featureId: id
              }
            })
            .then(res => {
              if (res.data.rc == 0) {
                this.$message.success("删除诊疗特色成功");
                this.getDiagnosis();
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
          break;
        case "service":
          this.$http
            .delete(`/hospital/ops/${this.hospitalId}/serve-case/delete`, {
              params: {
                serveCaseId: id
              }
            })
            .then(res => {
              if (res.data.rc == 0) {
                this.$message.success("删除服务案例成功");
                this.getService();
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
          break;
      }
    },
    submit() {
      switch (this.selectClassify) {
        case "新增设备":
          // if (
          //   this.equipmentName == "" ||
          //   this.equipmentIntroduce == "" ||
          //   this.equipmentBenefit == "" ||
          //   this.avatarId == ""
          // ) {
          //   this.$message.error("请检查所有元素是否都填写");
          // } else {
            this.addEquipment();
          // }
          break;
        case "编辑设备":
          // if (
          //   this.equipmentName == "" ||
          //   this.equipmentIntroduce == "" ||
          //   this.equipmentBenefit == "" ||
          //   this.avatarId == ""
          // ) {
          //   this.$message.error("请检查所有元素是否都填写");
          // } else {
            this.updateEquipment();
          // }
          break;
        case "新增诊疗特色":
          // if (
          //   this.diagnosisName == "" ||
          //   this.diagnosisIntroduce == "" ||
          //   this.diagnosisInstructions == ""
          // ) {
          //   this.$message.error("请检查所有元素是否都填写");
          // } else {
            this.addDiagnosis();
          // }
          break;
        case "编辑诊疗特色":
          // if (
          //   this.diagnosisName == "" ||
          //   this.diagnosisIntroduce == "" ||
          //   this.diagnosisInstructions == ""
          // ) {
          //   this.$message.error("请检查所有元素是否都填写");
          // } else {
            this.updateDiagnosis();
          // }
          break;
        case "新增服务案例":
          // if (
          //   this.serviceName == "" ||
          //   this.serviceInstructions == "" ||
          //   this.logoId == ""
          // ) {
          //   this.$message.error("请检查所有元素是否都填写");
          // } else {
            this.addService();
          // }
          break;
        case "编辑服务案例":
          // if (
          //   this.serviceName == "" ||
          //   this.serviceInstructions == "" ||
          //   this.logoId == ""
          // ) {
          //   this.$message.error("请检查所有元素是否都填写");
          // } else {
            this.updateService();
          // }
          break;
      }
    },
    getHspImg() {
      this.hLoading = true;
      this.$http
        .get(`/hospital/ops/${this.hospitalId}/environment`)
        .then(res => {
          if (res.data.rc == 0) {
            this.imgList = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
          this.hLoading = false;
        })
        .catch(err => {
          this.hLoading = false;
        });
    },
    closeImg(index) {
      this.imgList.splice(index, 1);
    },
    getHspEnv(fileInfo) {
      this.imgList.push({
        picId: fileInfo.fileId,
        avatarPath: fileInfo.filePath,
        name: ""
      });
    },
    submitHspImg() {
      this.$http
        .post(`/hospital/ops/${this.hospitalId}/environment/update`, {
          environments: this.imgList
        })
        .then(res => {
          if (res.data.rc == 0) {
            this.$message.success("修改院内环境成功");
            this.getHspImg();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
