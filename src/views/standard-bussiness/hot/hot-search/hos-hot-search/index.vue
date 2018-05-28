<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>医院热搜</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 筛选操作 start -->
    <el-card class="box-card">
      <div>
        <el-button type="primary" icon="el-icon-circle-plus" @click="dialogFormVisible = true,hosName = ''" :disabled="hosList.length > 7">新增</el-button>
      </div>
      <ul class="city-list" v-loading="loading">
        <li v-for="item in hosList" :key="item.id">
          <div>{{item.name}}</div>
          <el-button type="danger" class="fr" size="small" @click="deleteHos(item.id)">删除</el-button>
        </li>
      </ul>
      <div class="mt10">
        操作须知：热搜医院最多只显示8个，请知悉
      </div>
    </el-card>
    <!-- 新增热搜医院 -->
    <div v-if="dialogFormVisible" class="dialog">
      <div class="content">
        <div class="marginB10">
          <el-select v-model="hosName" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod">
				<el-option v-for="item in restaurants" :key="item.value" :label="item.name" :value="JSON.stringify(item)">
				</el-option>
			</el-select>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="add">保存</el-button>
          <el-button type="danger" @click="dialogFormVisible = false">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.marginB10{
  margin-bottom:10px;
}
.dialog{
  position: fixed;top:0;
  bottom:0;
  right: 0;
  left: 0;
  background:rgba(0,0,0,0.5)
}
.content{
  width:400px;
  padding:40px 20px;
  border-radius:5px;
  position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background:#fff;
}
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
  name: "HosHotSearch",
  data() {
    return {
      hosList: [], //热搜医院列表

      dialogFormVisible: false, //新增弹窗
      restaurants: [],
      hosName: "", //医院名称
      hosid: "", //医院id
      loading: true,

      disable: false, //按钮是否可用
    };
  },
  mounted() {
    this.fetchHosList();
    //this.hostList();
  },
  watch: {
    hosName: function(val) {
      var bool;
      bool = this.restaurants.some(function(item, index, array) {
        return item.name === val;
      });
      if (bool) {
        this.disable = false;
      } else {
        this.disable = true;
      }
    }
  },
  methods: {
    remoteMethod(query) {
      if (query !== "") {
        this.$http
          .get("/hospital/ops/list/online", {
            params: {
              search: query,
              isDisable: false
            }
          })
          .then(res => {
            this.restaurants = res.data.data.resultList;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.restaurants = [];
      }
    },
    handleIconClick(ev) {
      //console.log(ev);
    },
    // 热搜医院列表
    fetchHosList: function() {
      this.$http
        .get("/hot-tag/hospital/list")
        .then(res => {
          this.loading = false;
          //console.log(res.data.data);
          if (res.data.rc === 0) {
            this.hosList = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    //热搜城市删除
    deleteHos: function(id) {
      //console.log(id);
      this.$http
        .delete("/hot-tag/hospital/delete?id=" + id)
        .then(res => {
          if (res.data.rc === 0) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.dialogFormVisible = false;
            this.fetchHosList();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 添加热搜医院
    add: function() {
      if(this.hosName === ''){
        this.$message('请选择医院！');
      }else{
        this.$http
        .post("/hot-tag/hospital/add", {
          name: JSON.parse(this.hosName).name,
          id: JSON.parse(this.hosName).id
        })
        .then(res => {
          if (res.data.rc === 0) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.dialogFormVisible = false;
            this.fetchHosList();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
      }
    },
    //医院列表
    hostList: function() {
      this.$http
        .get("/hospital/ops/list/total")
        .then(res => {
          this.restaurants = res.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>