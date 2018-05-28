<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage' }">医院管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage/hospital/'+hospitalId }">{{hospitalName}}</el-breadcrumb-item>
      <el-breadcrumb-item>医院端管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <h3>流程选择</h3>
      <p>在线预约到报告流程</p>
      <div class="flow clearfix">
        <div class="flow-l">
        <h3>通用流程</h3>
        <div class="flow-l-b">
          <p><span v-if="tongyong">启用中</span><el-button type="primary" v-else @click="tySwitch">切换此流程</el-button></p>
        </div>
      </div>
      <div class="flow-r">
        <h3>医院端流程</h3>
         <div class="flow-r-b clearfix">
          <p><span v-if="hosshow" class="setAccount"><i>启用中</i><b @click="$router.push(`/standard-data/hospital-manage/hospital/${hospitalId}/hos-manage`)">设置账号</b></span><el-button type="primary" v-else @click="hosSwitch">切换此流程</el-button></p>
          
        </div>
      </div>
      </div>
      
    </el-card>
  </div>
</template>
<style lang="scss" scoped>

.box-card {
  margin: 10px 0;
  padding: 20px;
 h3 {
   margin-bottom: 10px;
 }
 .flow {
   margin-top: 10px;
 }
 .flow-l,.flow-r {
   float: left;
   margin-right: 20px;
   width: 20%;
   h3 {
     border: 1px solid #333;
     text-align: center;
     height: 100px;
     font: 20px/100px "";
   }
   .flow-l-b,.flow-r-b {
     .el-button {
       text-align: center;
       padding: 10px;
     }
     .setAccount {
       margin-top: 9px;
       i,b {
         font-style: normal;
       }
       i {
         margin-right: 30px;
       }
       b {
         color: blue;
         cursor: pointer;
       }
       
     }
   }
 }
}
</style>

<script>
export default {
  data() {
    return {
      hospitalId: 0,
      hospitalName: "",
      tongyong:true,
      hosshow:false
    };
  },
  created() {
    this.hospitalId = this.$route.params.hid;
  },
  methods: {
    hosSwitch() {
      this.$http
        .put("/hospital-platform-manage/update-reservation-process/"+this.hospitalId+`?type=${1}`, {
       
        })
        .then(res => {
          if (res.data.rc === 0) {
            this.tongyong=false;
            this.hosshow=true;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    tySwitch() {
      this.$http
        .put("/hospital-platform-manage/update-reservation-process/"+this.hospitalId+`?type=${0}`, {
        })
        .then(res => {
          if (res.data.rc === 0) {
            this.tongyong=true;
            this.hosshow=false;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    getFLow() {
       this.$http
        .get("/hospital-platform-manage/reservation-process/"+this.hospitalId, {
        })
        .then(res => {
          console.log(res.data)
          if (res.data.rc === 0) {
           if(res.data.data.type==0){
             this.tongyong=true;
             this.hosshow=false;
           }else if(res.data.data.type==1){
             this.tongyong=false;
             this.hosshow=true;
           }
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    getInfo() {
      this.$http.get("/hospital/ops/" + this.hospitalId).then(res => {
        if (res.data.rc === 0) {
          this.hospitalName = res.data.data.name;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  },
  mounted() {
    
    this.getInfo();
    this.getFLow();
  }
};
</script>
