<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-bussiness-data/day-chosen' }">每日精选</el-breadcrumb-item>
      <el-breadcrumb-item>添加精选文章</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div class="info picture">
        <div>
          <p>标题：</p>
          <div>
            <el-input v-model="input" placeholder="请在这里输入标题" :maxlength="textLength"></el-input>
          </div>
        </div>
      </div>
      <div class="ue">
        <p>正文：</p>
        <editor ref="myTextEditor" :fileName="'myFile'" :canCrop="canCrop" :uploadUrl="uploadUrl" v-model="content"></editor>
      </div>
      <div class="info picture">
        <div>
          <p>封面图片：</p>
          <div class="img-container logo-img">
            <file-input v-on:fileInfo="getLogoImg" fileType="image"></file-input>
            <div class="showImg">
              <img :src="showLogoImg" v-if="showLogoImg.length>0">
            </div>
          </div>
        </div>
        <div>
          <p>分类：</p>
          <div>
            <el-select v-model="cate" filterable placeholder="请选择">
              <el-option v-for="item in cateList" :key="item" :label="item" :value="item">
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
      min-width: 120px;
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
}
</style>

<script>
import fileInput from "../../../../../components/fileInput";
import editor from "@/components/editor/";
export default {
  name: "",
  data() {
    return {
      cities: [
        {
          img: "hfuight", //图片
          name: "王大锤",
          label: "主治医生"
        },
        {
          img: "hfuight", //图片
          name: "二条",
          label: "首席医生"
        }
      ],
      value6: "",
      input: "", //输入框
      showLogoImg: "", //上传图片
      content: "", //富文本编辑器内容
      editorOption: {
        // something config
      },
      cateList: ["疾病", "生活", "母婴", "健身", "养生", "两性", "体检"],
      cate: "",
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      canCrop: false,
      uploadUrl: "",
      id: "",
      textLength: 30,
    };
  },
  components: {
    editor,
    fileInput
  },
  mounted() {},
  methods: {
    /* 图片上传 */
    getLogoImg(fileInfo) {
      this.logoImg = fileInfo.fileId;
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
      if (this.dynamicTags) {
        var tags = this.dynamicTags.join(",");
      }
      if (
        this.input == "" ||
        this.content == "" ||
        this.logoImg == "" ||
        this.cate == ""||
        tags==""
      ) {
        this.$message.error("请完善信息");
      } else {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        if (this.id) {
          this.$http
            .put(`/news/${this.id}`, {
              type: "selection",
              title: this.input,
              htmlContent: this.content,
              coverFileId: this.logoImg,
              cate: this.cate,
              tags: tags,
              status: status
            })
            .then(res => {
              loading.close();
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
                  }
                }
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(error => {
              loading.close();
            });
        } else {
          this.$http
            .post("/news", {
              type: "selection",
              title: this.input,
              htmlContent: this.content,
              coverFileId: this.logoImg,
              cate: this.cate,
              tags: tags,
              status: status
            })
            .then(res => {
              loading.close();
              if (res.data.rc === 0) {
                this.id = res.data.data.id;
                if (status == "published") {
                  this.$message({
                    message: "发布成功",
                    type: "success"
                  });
                  this.$router.go(-1);
                } else {
                  this.$message({
                    message: "保存成功",
                    type: "success"
                  });
                  //1预览  0新增
                  if (state) {
                    window.open(
                      "https://test-news.touchealth.com/?id=" +
                        res.data.data.id +
                        "&fromOps=1"
                    );
                  }
                }
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(error => {
              loading.close();
            });
        }
      }
    }
  }
};
</script>