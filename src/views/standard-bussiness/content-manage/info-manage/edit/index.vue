<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-bussiness-data/info-manage' }">资讯管理</el-breadcrumb-item>
      <el-breadcrumb-item>编辑</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" v-loading="loading">
      <div class="info picture">
        <div>
          <p>标题：</p>
          <div>
            <el-input v-model="title" placeholder="请在这里输入标题"></el-input>
          </div>
        </div>
      </div>
      <div class="ue">
        <p>正文：</p>
        <div>
          <editor ref="myTextEditor" :fileName="'myFile'" :canCrop="canCrop" :uploadUrl="uploadUrl" v-model="content">
          </editor>
        </div>
      </div>
      <div class="info picture">
        <div>
          <p>封面图片：</p>
          <div class="img-container logo-img">
            <file-input v-on:fileInfo="getLogoImg" fileType="image"></file-input>
            <div class="showImg">
              <img :src="showLogoImg" v-if="showLogoImg.length>0" width="196px" height="196px">
            </div>
          </div>
        </div>
        <div>
          <p>分类：</p>
          <div>
            <el-select v-model="category" filterable placeholder="请选择" class="box-card-tags">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div>
          <p>标签：</p>
          <div>
            <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </div>
        </div>
      </div>
      <div class="data-submit">
        <el-button type="primary" @click="add">保存</el-button>
        <el-button @click="preview">预览</el-button>
        <el-button type="success" @click="submit">保存并发布</el-button>
      </div>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.box-card {
  margin: 10px 0;
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
      border: 1px dashed #c0ccda;
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
.ue {
  display: flex;
  p {
    min-width: 120px;
    margin-right: 10px;
    text-align: right;
  }
  .quill-editor {
    width: 80%;
    height: 400px;
    margin-bottom: 100px;
  }
}
.data-submit {
  text-align: right;
}
.author {
  display: flex;
  align-items: center;
  div {
    &.img {
      display: flex;
      align-items: center;
      margin-right: 10px;
    }
  }
}
li.author {
  height: 80px;
}
</style>

<script>
import fileInput from "../../../../../components/fileInput";
import editor from "@/components/editor/";
export default {
  name: "",
  data() {
    return {
      title: "", //标题
      authorId: "", //作者Id
      author: "", //作者名称
      coverId: "", //封面图id
      showLogoImg: "", //上传图片
      content: "", //富文本编辑器内容
      category: "", //文章分类
      tag: "", //标签
      editorOption: {
        // something config
      },
      options: [
        {
          value: "疾病",
          label: "疾病"
        },
        {
          value: "生活",
          label: "生活"
        },
        {
          value: "母婴",
          label: "母婴"
        },
        {
          value: "健身",
          label: "健身"
        },
        {
          value: "养生",
          label: "养生"
        },
        {
          value: "两性",
          label: "两性"
        },
        {
          value: "体检",
          label: "体检"
        }
      ],
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",

      canCrop: false,
      /* 测试上传图片的接口，返回结构为 {url:''}*/
      uploadUrl: "https://localhost:4000/api/upload",

      loading: false
    };
  },
  components: {
    editor,
    fileInput
  },
  mounted() {
    this.articalDetail(this.$route.params.articalId);
  },
  methods: {
    /* 图片上传 */
    getLogoImg(fileInfo) {
      //获取formData对象
      //console.log(fileInfo);
      this.coverId = fileInfo.fileId;
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    add() {
      this.submitData("draft", 0);
    },
    preview() {
      this.submitData("draft", 1);
    },
    submit() {
      this.submitData("published");
    },
    submitData(status, state) {
      this.loading = true;
      this.$http
        //.put("http://192.168.137.186:9999/news/" + this.$route.params.articalId, {
        .put("/news/" + this.$route.params.articalId, {
          title: this.title,
          status: status, // 新建的文章状态, publish对应已发布, draft对应未发布, forbid对应已下架; 无特殊情况建议用draft
          expertId: this.authorId, // 作者id
          coverFileId: this.coverId, // 封面图id
          htmlContent: this.content, // 正文内容
          type: "info", //
          cate: this.category, // 文章分类, illness对应疾病, life对应生活, motherandbaby对应母婴, fitness对应健身, healthcare对应养生, sex对应两性, checkup对应体检; 传错的话请求会失败
          tags: this.dynamicTags.join(",") // 文章标签, 英文逗号分隔, 建议处理的时候先strip
        })
        .then(res => {
          this.loading = false;
          if (res.data.rc === 0) {
            if (status == "published") {
              this.$message({
                message: "发布成功",
                type: "success"
              });
              this.$router.go(-1);
            } else {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              //1预览  0新增
              if (state) {
                window.open(
                  "https://test-news.touchealth.com/?id=" +
                    res.data.data.id +
                    "&fromOps=1"
                );
              } else {
                //this.$router.go(-1);
              }
            }
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
          this.$message.error(error);
        });
    },
    //文章详情
    articalDetail: function(newsId) {
      this.$http
        //.get("http://192.168.137.186:9999/news/" + newsId)
        .get("/news/" + newsId)
        .then(res => {
          if (res.data.rc === 0) {
            this.title = res.data.data.title;
            this.content = res.data.data.htmlContent;
            this.showLogoImg = res.data.data.coverPath;
            this.coverId = res.data.data.coverId;
            this.category = res.data.data.cate;
            this.dynamicTags = res.data.data.tags;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
