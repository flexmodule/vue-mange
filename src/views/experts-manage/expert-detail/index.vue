<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/experts-manage' }">专家管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{ name }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div class="dataList">
        <el-table :data="tableData" v-loading="loading" style="width: 100%">
          <el-table-column prop="code" label="编号code" align="center">
          </el-table-column>
          <el-table-column prop="realName" label="姓名">
          </el-table-column>
          <el-table-column prop="mobileNo" label="注册手机">
					</el-table-column>
					<el-table-column prop="sex" label="性别">
					</el-table-column>
					<el-table-column prop="title" label="职称">
					</el-table-column>
					<el-table-column prop="identityNo" label="身份证号">
					</el-table-column>
					<el-table-column prop="createdAt" label="注册时间">
					</el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="$router.push('/experts-manage/add-expert?e='+scope.row.id)">资料维护</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header">
        <span>功能列表</span>
      </div>
      <div class="title">
        <span>问医</span>
      </div>
      <div>
        <el-switch style="display: block" v-model="isDisable" active-color="#13ce66" inactive-color="#ff4949" active-text="启用" inactive-text="停用" @change="switchState">
        </el-switch>
      </div>
    </el-card>
    <div class="opeartion">
         <el-button type="primary" @click="$router.push(`/experts-manage/index`)">返回</el-button> 
      </div>
  </div>
</template>

<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
  .title{
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
    border: 1px solid #333;
    margin-bottom: 20px;
  }
}
</style>
<script>
export default {
  data() {
    return {
      eid: null,
      loading: false,
      tableData: [],
      isDisable: true,
      name: "",
    };
  },
  mounted() {
    this.eid = this.$route.params.eid;
    this.getData();
  },
  methods: {
    getData(){
      this.loading = true;
      this.$http.get("/expert/" + this.eid)
      .then(res=>{
        if( res.data.rc == 0){
          this.tableData.push(res.data.data);
          this.isDisable = res.data.data.canWenYi;
          this.name = res.data.data.realName;
        }else{
          this.$message.error( res.data.msg );
        }
        this.loading = false;
      }).catch(err=>{
        this.loading = false;
      })
    },
    //启用 or 禁用
    switch(val){
      this.$http.put("/expert/" + this.eid + "/wenYi?enable=" + val)
      .then(res => {
        // console.log(res);
      }).catch(err=>{
        console.log(err);
      })
    },
    switchState() {
      if (!this.isDisable) {
        this.$confirm("确定要关停该专家的问医权限吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.isDisable = false;
            this.switch(0);
            this.$message({
              type: "success",
              message: "停用成功!"
            });
          })
          .catch(() => {
            this.isDisable = true;
            this.$message({
              type: "info",
              message: "取消停用"
            });
          });
      } else {
        this.$confirm("确定要开启该专家的问医权限吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.isDisable = true;
            this.switch(1);
            this.$message({
              type: "success",
              message: "启用成功!"
            });
          })
          .catch(() => {
            this.isDisable = false;
            this.$message({
              type: "info",
              message: "取消启用"
            });
          });
      }
    }
  }
};
</script>