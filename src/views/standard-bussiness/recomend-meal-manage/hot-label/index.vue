<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>热门标签</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="main">
        <p>筛选标签：</p>
        <div>
          <div class="tags">
            <ul class="maxHeight">
                <li v-for="(item,index) in tagsNew" :key="item.id">
                  <span>{{item.name}}</span>
                  <span class="ops" @click="deleteTag(index,item.id,item.name)">移除</span>
                </li>
            </ul>
          </div>
          <div class="searchbtn">
            <div>
              <el-select v-model="tagNameShow" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading">
                <el-option v-for="item in tagNameList" :key="item.id" :label="item.name" :value="JSON.stringify(item)">
                </el-option>
              </el-select>
            </div>
            <div class="marginL10">
              <el-button type="primary" @click="addTag">添加</el-button>
            </div>
          </div>
          <div class="data-submit">
            <el-button type="info" icon="el-icon-refresh" @click="$router.go(-1)">取消</el-button>
          </div>
        </div>
      </div>
      

        
     
     
  </el-card>
  </div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
}
.title {
  float: left;
  margin: 10px 20px 0 0;
}
.main {
  display: flex;
  width: 80%;
}
.searchbtn {
  display: flex;
  margin-bottom: 50px;
  .marginL10 {
    margin-left: 10px;
  }
}



.tags {
  width: 400px;
  box-shadow: 0 0 0 0 5px;
  box-shadow: 0 0 5px;
  margin-bottom: 50px;
  ul {
    width: 100%;
    li {
      padding: 10px;
      border-bottom: 1px solid #eee;
      span {
        &.ops {
          color: #778eff;
          float: right;
        }
      }
    }
  }
}
.maxHeight{
  max-height:250px;
  overflow: auto;
}
</style>
<script>
export default {
  name: "HostLabel",
  data() {
    return {
      tagList: [], 
      searchTagList: [], 
      newsearchTagList:[],
      loading: true,
      inputtag:"",
      tagsNew: [], //增减后的标签
      tagNameShow:'',
      tagNameList:[],
      loading:true,
    };
  },
  mounted() {
    this.detail();
  },
  methods: {
    remoteMethod(query) {
      if (query !== "") {
        this.$http
          .get("/tag/searchTag", {
            params: {
              keyword: query
            }
          })
          .then(res => {
            this.loading = false;
            this.tagNameList = res.data.data;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.tagNameList = [];
      }
    },
     //详情
    detail: function() {
      this.$http
        .get("/hot-tag")
        .then(res => {
          if (res.data.rc === 0) {
            this.name = res.data.data.name;
            // this.avatarPic = res.data.data.avatarPicUrl;
            // this.coverPic = res.data.data.coverPicUrl;
            // this.avatarPicId = res.data.data.avatarPicId;
            // this.coverPicId = res.data.data.coverPicId;
            this.tags = res.data.data;
            this.tagsNew = this.tags;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //移除
    deleteTag: function(index, id, name) {
      for (var i = 0; i < this.tagsNew.length; i++) {
        if (i === index) {
          this.tagsNew.splice(index, 1);
        }
      }
      this.$http
        .delete("/hot-tag/delete", {
          params: {
              id: id
            }
        })
        .then(res => {
          if (res.data.rc === 0) {
            this.$message({
              message: "移除成功",
              type: "success"
            });
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //添加标签
    addTag: function() {
      //console.log(this.tagNameShow)
       if(this.tagNameShow === ''){
            this.$message('请选择标签！');
          }else{
            console.log(this.tagsNew,this.tagNameShow)
            
            if(this.tagsNew.length === 0){
              this.addtagrequest(JSON.parse(this.tagNameShow))
              this.tagsNew.unshift(JSON.parse(this.tagNameShow));
            }else{
              var isHave = this.tagsNew.some(t=>{
                return t.id == JSON.parse(this.tagNameShow).id
              })
              if(isHave){
                this.$message('请勿重复添加！');
              }else{
                this.addtagrequest(JSON.parse(this.tagNameShow))
                this.tagsNew.unshift(JSON.parse(this.tagNameShow));
              }
            }
        }
    },
    addtagrequest: function(obj) {
      this.$http
        .post("/hot-tag/add ", obj)
        .then(res => {
          if (res.data.rc === 0) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
   
  },
  filters: {
   filtertagList: function(value) {
      console.log(value)
      console.log(this.inputtag)
      
    },
  }
};
</script>

