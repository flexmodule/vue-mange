<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>套餐热搜</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 筛选操作 start -->
    <el-card class="box-card">
      <div>
        <el-button type="primary" icon="el-icon-circle-plus" @click="dialogFormVisible = true,input = ''" :disabled="mealList.length > 7">新增</el-button>
      </div>
      <ul class="city-list" v-loading="loading">
        <li v-for="item in mealList" :key="item.id">
          <div>{{item.name}}</div>
          <el-button type="danger" class="fr" size="small" @click="deleteMeal(item.id)">删除</el-button>
        </li>
      </ul>
      <div class="mt10">
        操作须知：热搜套餐最多只显示8个，请知悉
      </div>
    </el-card>
    <!-- 新增热搜医院 -->
    <div>
      <el-dialog title="热搜标签" :visible.sync="dialogFormVisible">
        <div>
          <el-input v-model="input" placeholder="请输入内容"></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="add">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
}
.city-list {
  max-height: 600px;
  overflow-y: auto;
  li {
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:first-child {
      border-top: 1px solid #eee;
      margin-top: 10px;
    }
  }
}
.inline-input {
  width: 350px;
}
</style>

<script>
export default {
  name: "MealHotSearch",
  data() {
    return {
      mealList: [], //热搜医院列表
      dialogFormVisible: false, //新增弹窗
      input: "", //输入字段
      loading: true
    };
  },
  mounted() {
    this.fetchMealList();
  },
  methods: {
    // 热搜套餐列表
    fetchMealList: function() {
      this.$http
        .get("/hot-tag/meal/list")
        .then(res => {
          this.loading = false;
          //console.log(res.data.data)
          if (res.data.rc === 0) {
            this.mealList = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
          this.$message.error(error);
        });
    },
    //热搜套餐删除
    deleteMeal: function(id) {
      //console.log(id)
      this.$http
        .delete("/hot-tag/hospital/delete?id=" + id)
        .then(res => {
          if (res.data.rc === 0) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.dialogFormVisible = false;
            this.fetchMealList();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 添加热搜套餐
    add: function() {
      //console.log(this.input)
      var arr = [];
      for(var i = 0;i< this.mealList.length;i++){
        arr.push(this.mealList[i].name)
      }
     // console.log(arr)
     if(arr.indexOf(this.input) === -1){
       this.$http
        .post("/hot-tag/meal/add", {
          name: this.input
        })
        .then(res => {
          if (res.data.rc === 0) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.dialogFormVisible = false;
            this.fetchMealList();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
     }else{
       this.$message.error('不能添加相同的标签');
     }
      //console.log(arr.indexOf(this.input))
      
    }
  }
};
</script>