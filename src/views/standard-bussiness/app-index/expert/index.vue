<template>
  <div class="container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>首页专家配置</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button type="primary" @click="$router.push('/standard-bussiness-data/add-expert')" :disabled="expertsList.length > 4">新增</el-button>
      </div>
      <ul class="list">
          <li>
            <div>专家</div>
            <div>手机号</div>
            <div>身份证</div>
            <div>职业点</div>
            <div>操作</div>
          </li>
          <li v-for="list in expertsList" :key="list.num" v-dragging="{ item: list, list: expertsList, group: 'list' }" @dragend="drop">
            <div>
                {{list.name}}
            </div>
            <div>
                {{list.mobileNo}}
            </div>
            <div>
                {{list.identityNo}}
            </div>
            <div>
                {{list.workPlace}}
            </div>
            <div>
              <el-button type="primary" size="small" @click="$router.push('/standard-bussiness-data/edit-expert/'+list.id)">编辑</el-button>
              <el-button size="small" @click="deleteQuestion(list.id)">撤销</el-button>
            </div>
          </li>
      </ul>
    </el-card>
    <p class="tip">可以通过拖拽，来调整专家在用户端显示的排列顺序</p>
  </div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
}
.submit {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  button {
    margin: 0 20px;
  }
}
.el-row{
    padding:10px 0;
     border-bottom:1px solid #eee;
     line-height:50px;
}
.tableHeader{
    padding:10px 0;
}
.list{
  li{
    border-bottom:1px solid #eee;
    padding:10px;
    display: flex;
    div{
      width:25%;
    }

  }
}
.tip{
  color: #9a9a9a;
}
</style>
<script>
export default {
  data() {
    return {
      expertsList: []
    };
  },
  mounted() {
    this.dataList();
  },
  methods: {
    //文章列表
    dataList:function(){
        this.$http
        .get("/appindex/expert")
        .then(res => {
          if (res.data.rc === 0) {
            this.expertsList =  res.data.data.experts;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //撤销
    deleteQuestion: function(id){
      this.$http
          //.post("/article", {
          .delete("/appindex/expert/" + id)
          .then(res => {
            if (res.data.rc === 0) {
              this.$message({
                message: res.data.data,
                type: "success"
              });
              this.dataList({})
            }else{
                this.$message.error(res.data.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
    },
    //鼠标拖拽时间
    drop: function() {
      this.dragList = [];
      for (var i = 0; i < this.expertsList.length; i++) {
        this.dragList.push(this.expertsList[i].id);
      }
      //console.log(this.dragList)
      this.$http
        .put("/appindex/expert/sort", {
          //this.$http.post('http://192.168.137.171:9999/city/hot-hospital/',{
          expertIds: this.dragList
        })
        .then(res => {
          if (res.data.rc === 0) {
            this.$message({
              message: "已重新调整顺序",
              type: "success"
            });
          }else{
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
  }
};
</script>


