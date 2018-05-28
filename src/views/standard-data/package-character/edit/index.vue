<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/package-character' }">体检套餐特征库</el-breadcrumb-item>
      <el-breadcrumb-item>{{pageType==='a'?'新增':'编辑'}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" v-loading="loading">
      <div class="character-name">
        <div>特征名称：</div>
        <el-input placeholder="请输入内容" v-model="name" clearable>
        </el-input>
      </div>
      <div class="character-icon mt10">
        <div>图标: </div>
        <div class="icon-container">
          <file-input v-on:fileInfo="getFile" fileType="image"></file-input>
          <div class="showImg">
            <img :src="showLogoImg" v-if="showLogoImg.length>0">
          </div>
        </div>
      </div>
    </el-card>
    <div class="buttons">
      <el-button type="success" @click="handleSave" :disabled="name.length<=0">保存</el-button>
      <el-button @click="$router.push('/standard-data/package-character')">取消</el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
}
.character-name,
.character-icon {
  display: flex;
  align-items: center;
  .el-input {
    margin-left: 10px;
    width: 400px;
  }
}
.icon-container {
  width: 70px;
  height: 70px;
  margin-left: 10px;
  position: relative;
  .showImg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

<script>
// import fileInput from '../../../../components/fileInput/';
const fileInput = () => import("../../../../components/fileInput/");
export default {
  components: {
    fileInput
  },
  data() {
    return {
      loading: false,
      pageType: "a",
      name: "",
      avatarId: "",
      showLogoImg: ""
    };
  },
  methods: {
    getFile(file) {
      this.avatarId = file.fileId;
    },
    //保存按钮
    handleSave() {
      if (this.pageType === "e") {
        this.update();
      } else if (this.pageType === "a") {
        this.add();
      }
    },
    add() {
      this.loading = true;
      this.$http
        .post("/set-meal-character/add", {
          name: this.name,
          avatarId: this.avatarId
        })
        .then(res => {
          this.loading = false;
          if (res.data.rc === 0) {
            this.$message.success("添加成功！");
            setTimeout(() => {
              this.$router.push("/standard-data/package-character");
            }, 1000);
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    update() {
      this.loading = true;
      this.$http
        .put("/set-meal-character/update", {
          id: this.characterId,
          name: this.name,
          avatarId: this.avatarId
        })
        .then(res => {
          this.loading = false;
          if (res.data.rc === 0) {
            this.$message.success("修改成功！");
            setTimeout(() => {
              this.$router.push("/standard-data/package-character");
            }, 1000);
          } else {
            this.$message.error(res.data.msg);
          }
        });
    }
  },
  created() {
    this.pageType = this.$route.query.t;
    this.characterId = this.$route.query.i;
  },
  mounted() {
    if (this.$route.query.t === "e") {
      this.loading = true;
      this.$http.get("/set-meal-character/" + this.$route.query.i).then(res => {
        this.loading = false;
        console.log(res);
        if (res.data.rc === 0) {
          this.name = res.data.data.name;
          this.avatarId = res.data.data.avatarId;
          this.showLogoImg = res.data.data.avatarPath || "";
        }
      });
    }
  }
};
</script>