<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-bussiness-data/index-expert' }">首页专家配置</el-breadcrumb-item>
      <el-breadcrumb-item>编辑</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-card class="box-card">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="code" label="编号" width="180">
          </el-table-column>
          <el-table-column prop="realName" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="mobileNo" label="手机号">
          </el-table-column>
          <el-table-column prop="sex" label="性别" width="180">
          </el-table-column>
          <el-table-column prop="title" label="职称" width="180">
          </el-table-column>
          <el-table-column prop="identityNo" label="身份证号">
          </el-table-column>
        </el-table>
      </el-card>
      <el-card>
        <div class="filterData">
          <div class="flex mt10">
            <div class="flex mr30">
              <div style="width:200px;">专家首页配置文案：</div>
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="artical">
              </el-input>
            </div>
          </div>
          <div class="picture">
            <div>
              <p>专家的宣传形象：</p>
              <div class="img-container logo-img">
                <file-input v-on:fileInfo="getLogoImg" fileType="image"></file-input>
                <div class="showImg">
                  <img :src="showLogoImg" v-if="showLogoImg?true:''">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="submit">
          <el-button type="primary" icon="el-icon-search" @click="update">保存</el-button>
          <el-button type="info" icon="el-icon-refresh" @click="$router.go(-1)">取消</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
}
.submit {
  margin-top: 20px;
}
.userHeader {
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}
.userMesssage {
  padding: 10px 0;
  padding-top: 20px;
}
.picture {
  margin-top: 10px;
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
      border: 1px dashed #c0ccda;
      border-radius: 6px;
      .showImg{
        width: 200px;
        height: 200px;
        img{
          width: 100%;
          height: 100%;
        }
      }
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
</style>
<script>
import fileInput from "../../../../../components/fileInput";
export default {
  data() {
    return {
      expertNum: "", //专家编号搜索
      artical: "", //文章
      showLogoImg: "", // 专家的宣传形象
      tableData: []
    };
  },
  components: {
    fileInput
  },
  mounted() {
    this.expertNum = this.$route.params.expertId;
    this.getData();
  },
  methods: {
    getData() {
      this.$http
        .get("/expert/" + this.expertNum)
        .then(res => {
          console.log(res);
          if(res.data.rc == 0){
            res = res.data.data;
            this.artical = res.publicityDesc;
            this.logoImg = res.publicityPicFileId;
            this.showLogoImg = res.publicityPicFilePath;
            this.search(res.code)
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    /* 图片上传 */
    getLogoImg(fileInfo) {
      //获取formData对象
      console.log(fileInfo);
      this.logoImg = fileInfo.fileId;
    },
    //搜索专家
    search: function(code) {
      this.$http
        .get("/expert", {
          params: {
            code: code
          }
        })
        .then(res => {
          console.log(res.data)
          if (res.data.rc === 0) {
            if (res.data.data.resultList.length === 0) {
              this.$message("该专家不存在!");
            } else {
              this.detail = true;
              this.tableData = res.data.data.resultList;
            }
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    //保存添加
    update: function() {
      this.$http
        .put("/appindex/expert/" + this.expertNum, {
          publicityDesc: this.artical, //首家首页配置方案
          publicityPicFileId: this.logoImg //专家首页的宣传形象
        })
        .then(res => {
          if (res.data.rc === 0) {
            this.$message.success("修改成功！");
            this.$router.go(-1);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          loading.close();
        });
    }
  }
};
</script>


