<template>
  <div class="container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/standard-bussiness-data/spe-ragion-manage' }">专区管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <div class="info picture">
            <div>
              <p>专区名称：</p>
              <div>
                <span>{{name}}</span>
              </div>
            </div>
            <div>
              <p>封面图片：</p>
                <div class="img-container logo-img">
                  <file-input 
                    v-on:fileInfo="getLogoImg1"
                    fileType="image"></file-input>
                  <div class="showImg">
                    <img :src="avatarPic" v-if="avatarPic.length>0" width="196px">
                    <!-- <img :src="avatarPic" width="60px"> -->
                  </div>
                </div>
            </div>
            <div>
              <p>封面头像：</p>
                <div class="img-container logo-img">
                  <file-input 
                    v-on:fileInfo="getLogoImg2"
                    fileType="image"></file-input>
                  <div class="showImg">
                    <img :src="coverPic" v-if="coverPic.length>0" width="196px">
                    <!-- <img :src="coverPic"> -->
                  </div>
                </div>
            </div>
            <div>
              <p>筛选标签：</p>
              <div class="tags">
                <ul class="maxHeight">
                    <li v-for="(item,index) in tagsNew" :key="item.id">
                      <span>{{item.name}}</span>
                      <span class="ops" @click="deleteTag(index,item.id,item.name)">移除</span>
                    </li>
                </ul>
              </div>
            </div>
            <div>
              <p></p>
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
          </div>
          <div class="data-submit">
             <el-button type="success" icon="el-icon-search" @click="saveEdit">保存</el-button>
             <el-button type="info" icon="el-icon-refresh" @click="$router.go(-1)">取消</el-button>
          </div>
      </el-card>
  </div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
}
.marginL10 {
  margin-left: 10px;
}
.el-card__body {
  width: 100%;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.picture {
  div {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
    p {
      width: 120px;
      text-align: right;
      line-height: 40px;
      margin-right: 10px;
    }
    .img-container {
      position: relative;
      width: 200px;
      height: 200px;
      // border: 1px dashed #c0ccda;
      border-radius: 6px;
    }

    .main-img {
      width: 600px;
      height: 300px;
      .file-input {
        width: 600px;
        height: 300px;
      }
      img {
        width: 600px;
        height: 300px;
      }
    }
  }
}
.data-submit {
  text-align: center;
}
.tags {
  width: 400px;
  box-shadow: 0 0 0 0 5px;
  box-shadow: 0 0 5px;
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
import fileInput from "@/components/fileInput";
export default {
  components: {
    fileInput
  },
  data() {
    return {
      name: "", //专区名称
      avatarPic: "", //头像
      coverPic: "", //图片
      avatarPicId: null, //头像fileid
      coverPicId: null, //图片id
      tags: [], //标签
      tagsNew: [], //增减后的标签
      options: [], //标签列表
      tagLists: [], //展示全部的标签列表
      value8: "",

      loading: true,
      tagNameShow:'',
      tagNameList:[],
    };
  },
  mounted() {
    this.detail(this.$route.params.regionId);
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
    /* 图片上传 */
    getLogoImg1(fileInfo) {
      //获取formData对象
      //console.log(fileInfo);
      this.avatarPicId = fileInfo.fileId;
    },
    getLogoImg2(fileInfo) {
      //获取formData对象
      //console.log(fileInfo);
      this.coverPicId = fileInfo.fileId;
    },
    //详情
    detail: function(id) {
      this.$http
        .get("/ops/meal/division/" + id)
        .then(res => {
          if (res.data.rc === 0) {
            this.name = res.data.data.name;
            this.avatarPic = res.data.data.avatarPicUrl;
            this.coverPic = res.data.data.coverPicUrl;
            this.avatarPicId = res.data.data.avatarPicId;
            this.coverPicId = res.data.data.coverPicId;
            this.tags = res.data.data.tags;
            this.tagsNew = this.tags;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //保存
    saveEdit: function() {
      var list = [];
      for (var i = 0; i < this.tagsNew.length; i++) {
        list.push(parseInt(this.tagsNew[i].id));
      }
      this.$http
        .post("/ops/meal/division/" + this.$route.params.regionId, {
          avatarPicId: this.avatarPicId,
          coverPicId: this.coverPicId,
          tagIds: list
        })
        .then(res => {
          if (res.data.rc === 0) {
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.$router.go(-1);
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
    },
    //添加标签
    addTag: function() {
      //console.log(this.tagNameShow)
       if(this.tagNameShow === ''){
            this.$message('请选择标签！');
          }else{
            console.log(this.tagsNew)
            
            if(this.tagsNew.length === 0){
              this.tagsNew.unshift(JSON.parse(this.tagNameShow));
            }else{
              var isHave = this.tagsNew.some(t=>{
                return t.id == JSON.parse(this.tagNameShow).id
              })
              if(isHave){
                this.$message('请勿重复添加！');
              }else{
                this.tagsNew.unshift(JSON.parse(this.tagNameShow));
              }
            }
        }
    },
  }
};
</script>
