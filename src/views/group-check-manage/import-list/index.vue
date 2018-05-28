<template>
	<div class="container">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/group-check-manage/index'}">团检企业</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/group-check-manage/group-check-detail/' + groupId}">团检详情</el-breadcrumb-item>
			<el-breadcrumb-item>团检名单导入</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card class="box-card">
			<div slot="header">
				<span>团检名单导入</span>
			</div>
			<div class="import-excel">
				<p>企业团检名单：</p>
				<div class="wrap">
					<div class="file-input" v-loading="loading" element-loading-text="正在上传中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
						<input type="file" name="file" id="file-input" @change="selectFile">
						<i :class="fileName.length<=0?'el-icon-plus':''">{{fileName}}</i>
					</div>
				</div>
				<span v-if="fileLen != 0">总计：{{fileLen}} 人</span>
			</div>
			<div>
				<p>导入名单校验：包含套餐编码是否填写及套餐编码是否为本次套餐编码，其他信息需要运营人员仔细核对。</p>
			</div>
		</el-card>
		<div>
			<el-button type="success" @click="$router.go(-1)">保存</el-button>
		</div>
	</div>
</template>

<script>
export default {
	name: "ImportList",
  data() {
    return {
      groupId: null,
      fileName: "",
      loading: false,
      fileLen: 0,
      process: 2
    };
  },
  created() {
    this.groupId = this.$route.params.gid;
    this.getProcess();
  },
  methods: {
    getProcess() {
      this.$http
        .get("group-check-manage/group-order/process/" + this.groupId)
        .then(res => {
          this.process = res.data.data.process;
        })
        .catch(err => {});
    },
    handleUpload(file) {
      var formData = new FormData();
      formData.append("file", file);
      //进行文件上传获取文件id
      if (this.process > 2) {
        this.$http
          .post(
            "/group-check-manage/group-order-employee/" +
              this.groupId +
              "/supplement",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" }
            }
          )
          .then(res => {
            this.loading = false;
            if (res.data.rc === 0) {
              this.$message.success("上传成功！");
              this.fileLen = res.data.data.length;
            } else {
              this.fileName = "";
              this.$message.error(res.data.msg);
            }
          })
          .catch(error => {
            this.loading = false;
          });
      } else {
        this.$http
          .post(
            "/group-check-manage/group-order-employee/" + this.groupId + "/add",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" }
            }
          )
          .then(res => {
            this.loading = false;
            if (res.data.rc === 0) {
              this.$message.success("上传成功！");
              this.fileLen = res.data.data.length;
            } else {
              this.fileName = "";
              this.$message.error(res.data.msg);
            }
          })
          .catch(error => {
            this.loading = false;
          });
      }
    },
    selectFile(ev) {
      var file = ev.target.files[0];
      this.loading = true;
      this.fileName = file.name;
      this.handleUpload(file);
    }
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
  .import-excel {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    font-size: 16px;
    line-height: 20px;
    p {
      width: 160px;
      font-weight: bold;
    }
    .wrap {
      position: relative;
      width: 200px;
      height: 200px;
      margin-right: 20px;
    }
  }
}
.file-input {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  #file-input {
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0;
    background: rgba(0, 0, 0, 0);
    cursor: pointer;
    font-size: 0;
    z-index: 2;
    position: absolute;
    top: 0;
    left: 0;
  }
  .file-input-showImg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  i {
    color: #8c939d;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    font-style: normal;
  }
  i.el-icon-plus {
    font-size: 28px;
  }
}
</style>