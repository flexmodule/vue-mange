<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>精选医院地区管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 筛选操作 start -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>条件筛选</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
      </div>
      <div class="filterData">
        <div class="flex mt10">
          <div class="flex mr30" @keyup.enter="searchBtn">
            <div style="width:76px;">搜索：</div>
            <el-input placeholder="城市" v-model="search" clearable>
            </el-input>
          </div>
        </div>
        <div class="submit">
          <el-button type="primary" icon="el-icon-search" @click="searchBtn">查询</el-button>
          <el-button type="info" icon="el-icon-refresh" @click="reset">重置</el-button>
        </div>
      </div>
    </el-card>
    <!-- 筛选操作 end -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>精选医院列表</span>
      </div>
      <div class="dataList">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card>
              <div slot="header" class="clearfix">
                <span>城市列表</span>
              </div>
              <div v-loading="loading">
                <ul class="cityList" v-if="searchCityList.length === 0">
                  <li v-for="item in cityList" :key="item.city" @click="showHos(item.city)" :class="{'active':showIndex == item.city}">{{item.city}}</li>
                </ul>
                <ul class="cityList" v-if="searchCityList.length > 0">
                  <li v-for="(item,index) in searchCityList" :key="item.city" @click="showHos(item.city)" :class="{'active':index === 0}">{{item.city}}</li>
                </ul>
              </div>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card>
              <div slot="header" class="clearfix">
                <span>精选医院列表</span>
              </div>
              <div>
                <ul class="cityList">
                  <li v-for="(list,index) in hosList" :key="list.name" v-dragging="{ item: list, list: hosList, group: 'list' }" @dragend="drop">
                    <span class="mr10">{{index + 1}}</span>
                    <span>{{list.name}}</span>
                    <span class="fr">
                      <el-button type="danger" size="mini" @click="cancleHot(list.id)">撤销</el-button>
                    </span>
                    <span class="fr edit">
                      <el-button type="primary" size="mini" @click="editdialog(list)">编辑</el-button>
                    </span>
                  </li>
                </ul>
                <div class="mt10">
                  <el-button type="primary" @click="adddialog" v-if="this.hosList.length < 5">新增</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

    </el-card>
    <!-- 新增精选医院弹框 -->
    <template>
      <el-dialog :title="dialogtitle" :visible.sync="dialogFormVisible">
        <div>
          <span>医院名称：</span>
          <el-select v-model="addHosId" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :disabled="editjudge">
          <el-option v-for="item in restaurants" :key="item.value" :label="item.name" :value="JSON.stringify(item)">
          </el-option>
          </el-select>
        </div>
        <div class="selectresons">
          <span>精选原因：</span>
          <el-input
            placeholder="请输入内容"
            v-model="choseReason"
            clearable maxlength="6">
          </el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addHos" :disabled="addHosId==''||choseReason==''">确定</el-button>
        </div>
      </el-dialog>
    </template>
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
.selectresons {
  margin-top: 10px;
  .el-input {
    width: 217px;
    height: 40px;
  }
}
.cityList {
  max-height: 400px;
  overflow-y: auto;
  li {
    border-bottom: 1px solid #ddd;
    padding: 8px 0;
    &.active {
      color: #409eff;
    }
    .edit {
      margin-right: 5px;
    }
  }
}
</style>

<script>
export default {
  name: "ChosenHosManage",
  data() {
    return {
      restaurants: [],
      hosName: "",
      hosNameSearch: '', //撤销时修改搜索框医院名称
      hosListSearch: [], //搜索医院列表
      showIndex: null,
      search: "", //城市搜索框
      cityList: [], //城市列表
      searchCityList: [], //城市列表搜索
      hosList: [], //精选医院列表
      addHosList: [], //新增和拖拽时的医院列表
      addHosId: "", //新增医院id
      edithosId:"",
      dialogFormVisible: false, //新增精选医院对话框
      dragList: [], //拖拽后的精选医院列表
      form: {
        name: ""
      },
      formLabelWidth: "120px",
      loading: true,
      editjudge:false,
      dialogtitle:"新增精选医院",
      choseReason:""
    };
  },
  mounted() {
    this.fetchCityList();
  },
  methods: {
    remoteMethod(query) {
      if (query !== "") {
        this.$http
          .get("/hospital/ops/list/not/hot", {
            params: {
              city:this.hosNameSearch,
              search: query
            }
          })
          .then(res => {
            console.log(res.data)
            this.restaurants = res.data.data;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.restaurants = [];
      }
    },
    handleIconClick(ev) {
      console.log(ev);
    },
    //上线城市列表
    fetchCityList: function() {
      this.$http
        .get("/city/online/list")
        .then(res => {
          this.loading = false;
          //console.log(res.data.data)
          if (res.data.rc === 0) {
            this.cityList = res.data.data;
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
    //城市对应医院列表
    fetchHosList: function(hosName) {
      this.$http.get("/city/hot-hospital/", {
          //this.$http.get('http://192.168.137.202:9999/hospital/ops/list',{
          params: {
            city: hosName
          }
        })
        .then(res => {
          this.hosList = res.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //点击城市对应医院列表
    showHos: function(hosName) {
      //console.log(hosName);
      this.showIndex = hosName;
      this.search = hosName;
      this.hosNameSearch = hosName;
      //this.hostList();
      this.fetchHosList(hosName);
    },
    //城市搜索
    searchBtn: function() {
      //console.log(this.search)
      if (this.search === "") {
        this.fetchCityList();
      } else {
        this.searchCityList = []; //清空城市列表
        for (var i = 0; i < this.cityList.length; i++) {
          if (this.cityList[i].city.indexOf(this.search) === 0) {
            this.searchCityList.push(this.cityList[i]);
            //console.log(this.cityList[i].city)
          }
        }
        if (this.searchCityList.length > 0) {
          this.fetchHosList(this.searchCityList[0].city);
          this.hosNameSearch = this.searchCityList[0].city;
        } else {
          this.$message.error("您输入的城市不存在");
        }
      }
    },
    //重置
    reset: function() {
      this.search = "";
      this.searchCityList = [];
    },
    //添加热门医院排序
    addHos: function(id) {
      
        if (this.addHosId === "") {
        this.$alert("请选择医院", "提示", {
          confirmButtonText: "确定",
          callback: action => {}
        });
      } else {
        if(this.dialogtitle=="新增精选医院"){
          this.addHosList = []; //清空数组列表
        for (var i = 0; i < this.hosList.length; i++) {
          this.addHosList.push(this.hosList[i].id);
        }
        this.addHosList.push(JSON.parse(this.addHosId).id);
        
        //console.log(this.addHosList)
        this.$http
          .put("/city/hot-hospital/sort", {
            //this.$http.post('http://192.168.137.171:9999/city/hot-hospital/',{
            hospitalIds: this.addHosList
          })
          .then(res => {
            if (res.data.rc === 0) {
              this.addhotreason(JSON.parse(this.addHosId).id,this.choseReason)
            }
          })
          .catch(error => {
            console.log(error);
          });
          }else if(this.dialogtitle=="编辑精选医院"){
            this.addhotreason(this.edithosId,this.choseReason)
            }
          this.dialogFormVisible = false;
      }
    },
    addhotreason: function(id,reason) {
      this.$http
          .post("/city/hot-hospital/add", {
            //this.$http.post('http://192.168.137.171:9999/city/hot-hospital/',{
            hospitalId: id,
            hotReason:reason
          })
          .then(res => {
            if (res.data.rc === 0) {
              this.$message({
                message: res.data.data,
                type: "success"
              });
              this.fetchHosList(this.hosNameSearch);
            }
          })
          .catch(error => {
            console.log(error);
          });
    },
    adddialog: function() {
      this.choseReason="";
      this.addHosId="";
      this.dialogFormVisible = true
      this.editjudge=false;
      this.dialogtitle="新增精选医院"
      this.hosName = ''
    },
    editdialog: function(list) {
      this.addHosId=list.name;
      this.edithosId=list.id;
      this.choseReason=list.hotReason;
      this.editjudge=true;
      this.dialogtitle="编辑精选医院"
      this.dialogFormVisible = true
    },
    // 撤销热门医院
    cancleHot: function(hodid) {
      this.$http
        .delete("/city/hot-hospital/" + hodid)
        .then(res => {
          //this.$http.delete('http://192.168.137.171:9999/city/hot-hospital/'+ hodid).then((res) => {
          //console.log(res)
          if (res.data.rc === 0) {
            this.$message({
              message: res.data.data,
              type: "success"
            });
            this.fetchHosList(this.hosNameSearch);
          } else {
            this.$message.error(res.data.msg);
          }
          //this.fetchHosList(this.search);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //鼠标拖拽时间
    drop: function() {
      this.dragList = [];
      for (var i = 0; i < this.hosList.length; i++) {
        this.dragList.push(this.hosList[i].id);
      }
      //console.log(this.dragList)
      this.$http
        .post("/city/hot-hospital/", {
          //this.$http.post('http://192.168.137.171:9999/city/hot-hospital/',{
          hospitalIds: this.dragList
        })
        .then(res => {
          if (res.data.rc === 0) {
            this.$message({
              message: "已重新调整顺序",
              type: "success"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>