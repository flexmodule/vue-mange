<template>
  <div class="container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage' }">医院管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{hospitalName}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card" v-loading="loading">
        <div slot="header" class="clearfix">
            <span>{{hospitalName}}</span>
            <el-switch
            style="display: block;float:right"
            v-model="enable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启用"
            inactive-text="禁用"
            @change="switchState">
            </el-switch>   
        </div>
        <div class="hospital-info">
            <!-- 医院信息 -->
            <div class="list-item">
                <router-link :to="{path:'/standard-data/hospital-manage/add',query:{i:this.hospitalId,d:'1'}}">医院信息</router-link>
            </div>
            <!-- 医院信息 -->
            <div class="list-item">
                <router-link :to="{path:'/standard-data/hospital-manage/hospital/'+hospitalId+'/features'}">医院特色</router-link>
            </div>
            <!-- 体检套餐 -->
            <div class="list-item">
                <router-link :to="{path:'/standard-data/hospital-manage/hospital/'+hospitalId+'/packages'}">体检套餐</router-link>
            </div>
            <div class="list-item">
                <router-link :to="{path:'/standard-data/hospital-manage/hospital/'+hospitalId+'/check-items'}">检查项目</router-link>
            </div>
            <!-- 医院信息 -->
            <div class="list-item">
                <router-link :to="{path:'/standard-data/hospital-manage/hospital/'+hospitalId+'/health-manage'}">健管服务</router-link>
            </div>
            <!-- 医院信息 -->
            <div class="list-item">
                <router-link :to="{path:'/standard-data/hospital-manage/hospital/'+hospitalId+'/experts'}">专家团队</router-link>
            </div>
             <!-- 医院信息 -->
            <div class="list-item">
                <router-link :to="{path:'/standard-data/hospital-manage/hospital/'+hospitalId+'/select-flow'}">流程管理</router-link>
            </div>
        </div>
        </el-card>    
        <div class="opeartion">
         <el-button type="primary" @click="$router.push(`/standard-data/hospital-manage`)">返回</el-button> 
      </div>    
  </div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
}
.hospital-info {
  display: flex;

  .list-item {
    width: 250px;
    height: 150px;
    background-color: #ddd;
    margin: 0 20px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    a {
      color: #000;
      text-align: center;
      line-height: 150px;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
<script>
export default {
  name:"hospitalDetail",
  data() {
    return {
      hospitalName: "",
      hospitalId: 0,
      //禁用
      enable: false,
      loading: false
    };
  },
  methods: {
    //改变启用禁用状态
    switchState() {
      //switchState中返回的是已经改变之后的状态值
      if (!this.enable) {
        this.$confirm("禁用后，医院将不再出现在医院列表中，确定要禁用吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.enable = false;
            this.switch(1);
            this.$message({
              type: "success",
              message: "禁用成功!"
            });
          })
          .catch(() => {
            this.enable = true;
            this.$message({
              type: "info",
              message: "取消禁用"
            });
          });
      } else {
        this.$confirm("启用后，医院将出现在医院列表中，确定要启用吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.enable = true;
            this.switch(0);
            this.$message({
              type: "success",
              message: "启用成功!"
            });
          })
          .catch(() => {
            this.enable = false;
            this.$message({
              type: "info",
              message: "取消启用"
            });
          });
      }
    },
    switch(value) {
      this.$http
        .put(
          "/hospital/ops/" +
            this.hospitalId +
            "?is_disable=" +
            value
        )
        .then(res => {
          console.log(res);
        });
    },
    getInfo() {
      this.loading = true;
      this.$http
        .get("/hospital/ops/" + this.hospitalId)
        .then(res => {
          this.loading = false;
          if (res.data.rc === 0) {
            this.hospitalName = res.data.data.name;
            this.enable = !res.data.data.isDisable;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    }
  },
  created() {
    this.hospitalId = this.$route.params.hid;
    //根据医院id获取医院详情
    this.getInfo();
  }
};
</script>
