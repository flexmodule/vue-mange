<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/check-manage/maintain-category' }">类目维护</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="conditions">
      <el-card class="box-card">
        <div slot="header" class="clearfix flex">
          <span class="mr10 title">一级类目</span>
          <el-button type="primary" size="small" class="mr10" @click="openPrimary()">增加</el-button>
        </div>
        <div>
          <el-table :data="primaryData" highlight-current-row @current-change="handleSelectPrimary" style="width: 100%" v-loading="pLoading">
            <el-table-column prop="id" label="编码">
            </el-table-column>
            <el-table-column prop="name" label="项目名称">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="deletePrimary(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix flex">
          <span class="mr10 title">二级类目</span>
          <el-button type="primary" size="small" class="mr10" @click="openSecond()">增加</el-button>
        </div>
        <div>
          <el-table :data="secondData" highlight-current-row @current-change="handleSelectSecond" style="width: 100%" v-loading="sLoading">
            <el-table-column prop="id" label="编码">
            </el-table-column>
            <el-table-column prop="name" label="项目名称">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="deleteSecond(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix flex">
          <span class="mr10 title">体检项目</span>
          <el-button type="primary" size="small" class="mr10" @click="openCheckItem()">增加</el-button>
        </div>
        <div>
          <el-table :data="checkData" highlight-current-row style="width: 100%" v-loading="cLoading">
            <el-table-column prop="id" label="编码">
            </el-table-column>
            <el-table-column prop="name" label="项目名称">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editCheckItem(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteCheckItem(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>

    <!-- add-primary -->
    <el-dialog title="新增一级类目" :visible.sync="primaryVisible" width="40%" :close-on-click-modal="false">
      <div class="alert-wrap">
        <p>
          <span>一级类目名称</span>
        </p>
        <el-input v-model="addprimaryName">
        </el-input>
      </div>
      <el-button type="success" @click="addPrimary()">保存</el-button>
    </el-dialog>

    <!-- add-second -->
    <el-dialog title="新增二级类目" :visible.sync="secondVisible" width="40%" :close-on-click-modal="false">
      <div class="alert-wrap">
        <p>
          <span>二级类目名称</span>
        </p>
        <el-input v-model="addSecondName">
        </el-input>
      </div>
      <div class="alert-wrap">
        <p>
          <span>所属一级类目</span>
        </p>
        <el-select v-model="primaryId" style="width:100%" @change="selectPrimary">
          <el-option v-for="item in primaryData" :key="item.id" :value="item.id" :label="item.name">
          </el-option>
        </el-select>
      </div>
      <el-button type="success" @click="addSecond()">保存</el-button>
    </el-dialog>

    <!-- add-checkItem -->
    <el-dialog title="新增体检项目" :visible.sync="checkItemVisible" width="40%" :close-on-click-modal="false">
      <div class="alert-wrap">
        <p>
          <span>体检项目名称</span>
        </p>
        <el-input v-model="addItemName">
        </el-input>
      </div>
      <div class="alert-wrap">
        <p>
          <span>Logo</span>
          <span class="tip">（应用与解读手册）</span>
        </p>
        <div class="img-container">
          <file-input v-if="showInput" v-on:fileInfo="getItemsLogo" fileType="image"></file-input>
        </div>
      </div>
      <div class="alert-wrap">
        <p>
          <span>icon</span>
          <span class="tip">（应用与套餐详情）</span>
        </p>
        <div class="img-small-container">
          <file-input v-if="showInput" v-on:fileInfo="getItemsIcon" fileType="image"></file-input>
        </div>
      </div>
      <div class="alert-wrap">
        <p>
          <span>所属一级类目</span>
        </p>
        <el-select v-model="primaryId" style="width:100%" @change="itemSelectPrimary">
          <el-option v-for="item in primaryData" :key="item.id" :value="item.id" :label="item.name">
          </el-option>
        </el-select>
      </div>
      <div class="alert-wrap">
        <p>
          <span>所属二级类目</span>
        </p>
        <el-select v-model="secondId" style="width:100%" :disabled="isdisabled" @change="selectSecond">
          <el-option v-for="item in selectSecondData" :key="item.id" :value="item.id" :label="item.name">
          </el-option>
        </el-select>
      </div>
      <el-button type="success" @click="addCheckItem()">保存</el-button>
    </el-dialog>

    <!-- edit-checkItem -->
    <el-dialog title="编辑体检项目" :visible.sync="editCheckItemVisible" width="40%" :close-on-click-modal="false">
      <div v-loading="editLoading">
        <div class="alert-wrap">
          <p>
            <span>体检项目名称</span>
          </p>
          <el-input v-model="editItemName">
          </el-input>
        </div>
        <div class="alert-wrap">
          <p>
            <span>Logo</span>
            <span class="tip">（应用与解读手册）</span>
          </p>
          <div class="img-container">
            <file-input v-if="showInput" v-on:fileInfo="getItemsLogo" fileType="image"></file-input>
            <img :src="reportLogoUrl" alt="">
          </div>
        </div>
        <div class="alert-wrap">
          <p>
            <span>icon</span>
            <span class="tip">（应用与套餐详情）</span>
          </p>
          <div class="img-small-container">
            <file-input v-if="showInput" v-on:fileInfo="getItemsIcon" fileType="image"></file-input>
            <img :src="picturePathUrl" alt="">
          </div>
        </div>
        <div class="alert-wrap">
          <p>
            <span>所属一级类目</span>
          </p>
          <el-select v-model="editPrimary" style="width:100%" @change="itemSelectPrimary">
            <el-option v-for="item in primaryData" :key="item.id" :value="item.id" :label="item.name">
            </el-option>
          </el-select>
        </div>
        <div class="alert-wrap">
          <p>
            <span>所属二级类目</span>
          </p>
          <el-select v-model="editSecond" style="width:100%" :disabled="editDisabled" @change="selectSecond">
            <el-option v-for="item in selectSecondData" :key="item.id" :value="item.id" :label="item.name">
            </el-option>
          </el-select>
        </div>
        <el-button type="success" @click="submitCheckItem()">保存</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<style lang="scss" scoped>
.conditions {
  display: flex;
  justify-content: space-between;
  .box-card {
    width: 32%;
    margin: 10px 0;
    span.title {
      font-size: 16px;
      font-weight: bold;
    }
  }
}
.alert-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  .img-container {
    width: 100px;
    height: 100px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .img-small-container {
    width: 80px;
    height: 80px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
  }
  p {
    min-width: 120px;
    .tip {
      position: absolute;
      bottom: 5px;
      left: 230px;
      color: #acacac;
    }
  }
}

.empty-wrap {
  text-align: center;
}
</style>
<script>
const fileInput = () => import("../../../../components/fileInput/");
export default {
  components: {
    fileInput
  },
  data() {
    return {
      //弹窗
      primaryVisible: false,
      secondVisible: false,
      checkItemVisible: false,

      primaryData: [],
      secondData: [],
      checkData: [],
      selectSecondData: [],
      pLoading: false,
      sLoading: false,
      cLoading: false,

      addprimaryName: "",
      addSecondName: "",
      addItemName: "",
      primaryId: "",
      secondId: "",
      isdisabled: true,

      selectPrimaryId: "",
      selectSecondId: "",

      logoId: "",
      iconId: "",
      showInput: false,

      editCheckItemVisible: false,
      editId: "",
      editLoading: false,
      editItemName: "",
      picturePathUrl: "",
      reportLogoUrl: "",
      editPrimary: "",
      editSecond: "",
      editDisabled: true,
      editPrimaryId: "",
      editSecondId: ""
    };
  },
  mounted() {
    this.getPrimary();
  },
  methods: {
    //获取一级类目
    getPrimary() {
      this.pLoading = true;
      this.$http
        .get("/check-manage/primary-category/")
        .then(res => {
          this.pLoading = false;
          if (res.data.rc == 0) {
            this.primaryData = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取二级类目
    getSecond(id) {
      this.sLoading = true;
      this.checkData = [];
      this.$http
        .get("/check-manage/second-category/" + id)
        .then(res => {
          this.sLoading = false;
          if (res.data.rc == 0) {
            this.secondData = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取三级类目
    getCheckItems(id) {
      this.cLoading = true;
      this.$http
        .get("/check-manage/inspection-item/" + id)
        .then(res => {
          this.cLoading = false;
          if (res.data.rc == 0) {
            this.checkData = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //选择一级类目获取二级类目
    handleSelectPrimary(val) {
      if (val) {
        this.selectPrimaryId = val.id;
        this.getSecond(this.selectPrimaryId);
      }
    },
    //选择二级类目获取类目名称
    handleSelectSecond(val) {
      if (val) {
        this.selectSecondId = val.id;
        this.getCheckItems(this.selectSecondId);
      }
    },
    //打开一级类目弹窗
    openPrimary() {
      this.primaryVisible = true;
      this.addprimaryName = "";
    },
    addPrimary() {
      if (this.addprimaryName.length == "") {
        this.$notify({
          title: "提示",
          message: "名称不能为空"
        });
      } else {
        var params = {
          name: this.addprimaryName
        };
        this.$http
          .post("/check-manage/primary-category/add", params, {
            headers: { "Content-Type": "application/json;charset=UTF-8" }
          })
          .then(res => {
            if (res.data.rc == 0) {
              this.$message.success("一级类目添加成功");
              this.primaryVisible = false;
              this.getPrimary();
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    //打开二级类目弹窗
    openSecond() {
      this.secondVisible = true;
      this.primaryId = "";
      this.addSecondName = "";
    },
    //选择所属一级类目
    selectPrimary(val) {
      this.primaryId = val;
    },
    addSecond() {
      if (this.addSecondName.length == "" || this.primaryId == "") {
        this.$notify({
          title: "提示",
          message: "名称不能为空"
        });
      } else {
        var params = {
          primaryId: this.primaryId,
          name: this.addSecondName
        };
        this.$http
          .post("/check-manage/second-category/add", params, {
            headers: { "Content-Type": "application/json;charset=UTF-8" }
          })
          .then(res => {
            if (res.data.rc == 0) {
              this.getSecond(this.primaryId);
              this.$message.success("二级类目添加成功");
              this.secondVisible = false;
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    //打开体检项目弹窗
    openCheckItem() {
      this.checkItemVisible = true;
      this.addItemName = "";
      this.primaryId = "";
      this.secondId = "";
      this.isdisabled = true;
      this.showInput = true;
    },
    getItemsLogo(fileInfo) {
      this.logoId = fileInfo.fileId;
    },
    getItemsIcon(fileInfo) {
      this.iconId = fileInfo.fileId;
    },
    //选择所属一级类目
    itemSelectPrimary(val) {
      this.primaryId = val;
      this.isdisabled = false;
      this.editDisabled = false;
      this.secondId = "";
      this.editSecond = "";
      this.$http
        .get("/check-manage/second-category/" + this.primaryId)
        .then(res => {
          this.selectSecondData = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //选择所属二级类目
    selectSecond(val) {
      this.secondId = val;
    },
    //增加检查项目
    addCheckItem() {
      if (
        this.addItemName == "" ||
        this.primaryId == "" ||
        this.secondId == ""
      ) {
        this.$notify({
          title: "提示",
          message: "名称不能为空"
        });
      } else {
        var params = {
          primaryId: this.primaryId,
          secondId: this.secondId,
          name: this.addItemName,
          reportLogoId: this.logoId,
          fileId: this.iconId
        };
        console.log(params);
        this.$http
          .post("/check-manage/inspection-item/add", params, {
            headers: { "Content-Type": "application/json;charset=UTF-8" }
          })
          .then(res => {
            if (res.data.rc == 0) {
              this.getSecond(this.primaryId);
              this.getCheckItems(this.secondId);
              this.showInput = false;
              this.$message.success("体检项目添加成功");
              this.checkItemVisible = false;
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    //删除一级类目
    deletePrimary(index, row) {
      this.$confirm("如果需要删除，请先清空该类目下的全部内容", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .delete("/check-manage/primary-category/" + row.id)
            .then(res => {
              if (res.data.rc == 1) {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "error"
                });
              } else if (res.data.rc == 0) {
                this.getPrimary();
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //删除二级类目
    deleteSecond(index, row) {
      this.$confirm("如果需要删除，请先清空该类目下的全部内容", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .delete("/check-manage/second-category/" + row.id)
            .then(res => {
              if (res.data.rc == 1) {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "error"
                });
              } else if (res.data.rc == 0) {
                this.getSecond(this.selectPrimaryId);
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //删除检查项目
    deleteCheckItem(index, row) {
      this.$http
        .delete("/check-manage/inspection-item/" + row.id)
        .then(res => {
          if (res.data.rc == 1) {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: "error"
            });
          } else if (res.data.rc == 0) {
            this.getCheckItems(this.selectSecondId);
            this.$message({
              type: "success",
              message: "删除成功"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    editCheckItem(row) {
      this.editId = row.id;
      this.showInput = true;
      this.editLoading = true;
      this.editCheckItemVisible = true;
      this.primaryId = "";
      this.secondId = "";
      this.$http
        .get(
          "/check-manage/inspection-item/edit/" +
            row.id
        )
        .then(res => {
          this.editLoading = false;
          if (res.data.rc == 0) {
            res = res.data.data;
            this.editDisabled = false;
            this.editItemName = res.name;
            this.picturePathUrl = res.picturePathUrl;
            this.reportLogoUrl = res.reportLogoUrl;
            this.editPrimary = res.primaryName;
            this.editPrimaryId = res.primaryId;
            this.editSecond = res.secondName;
            this.editSecondId = res.secondId;
            this.logoId = res.reportLogoId;
            this.iconId = res.picturePathId;
            this.$http
              .get("/check-manage/second-category/" + this.editPrimaryId)
              .then(res => {
                this.selectSecondData = res.data.data;
              })
              .catch(err => {
                console.log(err);
              });
          }
        })
        .catch(err => {});
    },
    submitCheckItem() {
      if (this.editItemName == "") {
        this.$notify({
          title: "提示",
          message: "名称不能为空"
        });
      } else {
        var pri = "",
          sec = "";
        if (this.primaryId == "") {
          pri = this.editPrimaryId;
        } else {
          pri = this.primaryId;
        }
        if (this.secondId == "") {
          sec = this.editSecondId;
        } else {
          sec = this.secondId;
        }
        var params = {
          id: this.editId,
          primaryId: pri,
          secondId: sec,
          name: this.editItemName,
          reportLogoId: this.logoId,
          fileId: this.iconId
        };
        console.log(params);
        this.$http
          .post("/check-manage/inspection-item/add", params)
          .then(res => {
            if (res.data.rc == 0) {
              this.getSecond(pri);
              this.getCheckItems(sec);
              this.showInput = false;
              this.$message.success("体检项目修改成功");
              this.editCheckItemVisible = false;
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
};
</script>