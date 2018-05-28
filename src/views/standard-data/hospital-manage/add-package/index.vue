<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage' }">医院管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage/hospital/'+hospitalId }">{{hospitalName}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage/hospital/'+hospitalId+'/packages' }">套餐管理</el-breadcrumb-item>
      <el-breadcrumb-item v-if="this.$route.query.setMealId">修改套餐</el-breadcrumb-item>
      <el-breadcrumb-item v-else>新增套餐</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div class="info">
        <div>
          <div class="another-name">
            <p>
              <span>套餐别称</span>
            </p>
            <el-input placeholder="如果不编辑，则以套餐名称为准" v-model="anotherName">

            </el-input>
          </div>
        </div>
        
        <div class="buyer-info">
          <h3 class="title">采购信息</h3>
          <div class="info-detail">
            <p>
              <span>套餐名称</span>
            </p>
            <el-input v-model="name">

            </el-input>
          </div>
          <div class="info-detail">
            <p>
              <span>套餐定价</span>
            </p>
            <el-input v-model="price">

            </el-input>
          </div>
          <div class="info-detail items-start">
            <p>
              <span>备注</span>
            </p>
            <el-input type="textarea" :autosize="{ minRows: 4}" v-model="remark">

            </el-input>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>归类</span>
      </div>
      <div class="classified">
        <div class="flex mr30">
          <p>
            <span>适用性别</span>
          </p>
          <el-select v-model="gender" placeholder="不限" @change="selectGender" clearable>
            <el-option v-for="item in isGender" :key="item.gender" :value="item.gender">
            </el-option>
          </el-select>
        </div>
        <div class="flex" v-show="isShowMarried">
          <p>
            <span>是否结婚</span>
          </p>
          <el-select v-model="married" placeholder="不限" clearable>
            <el-option v-for="item in isMarried" :key="item.married" :value="item.married">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="classified">
        <p>
          <span>适用人群</span>
        </p>
        <el-select v-model="group" placeholder="通用" clearable>
          <el-option v-for="item in isGroup" :key="item.group" :value="item.group">
          </el-option>
        </el-select>
      </div>
      <div class="classified">
        <p>
          <span>标签</span>
        </p>
        <div>
          <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" style="width:80px">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </div>
      </div>
      <div class="classified">
        <p>
          <span>套餐特征</span>
        </p>
        <el-checkbox-group v-model="feature" :max="10">
          <el-checkbox v-for="item in featureList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </el-card>
    <!-- <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>体检项</span>
      </div>
      <div class="medical">
        <div class="medical-hd">
          <p class="name">名称</p>
          <p class="operation">操作</p>
        </div>
        <div class="medical-main">
          <ul>
            <li v-for="(item,index) in medicalItems" v-dragging="{ item: item, list: medicalItems, group: 'item' }" :key="item.hspSectionName">
              <p>
                <span class="item-name">{{ item.hspSectionName }}</span>
              </p>
              <p class="operation">
                <span class="edit" @click="handleEdit(item)">编辑</span>
                <span class="delete" @click="handleDelete(index)">删除</span>
              </p>
            </li>
          </ul>
        </div>
        <div class="medical-ft">
          <p>
            <span class="add" @click="handleAdd()">+添加体检项</span>
          </p>
          <p>
            <span class="sum">合计：{{ medicalItems.length }}项</span>
          </p>
        </div>
      </div>
    </el-card> -->
    <div>
      <el-button type="success" @click="saveSetMeal">保存</el-button>
      <el-button type="info" @click="$router.go(-1)">取消</el-button>
    </div>

    <!-- <el-dialog title="添加体检项" :visible.sync="outerVisible" width="80%" :close-on-click-modal="false">
      <el-dialog :visible.sync="innerVisible" width="70%" :close-on-click-modal="false" append-to-body top="20vh">
        <p class="item-title">
          <span>{{itemName}}</span>
          <span v-if="isMatched" class="success">已匹配</span>
          <span v-else class="danger">未匹配</span>
        </p>
        <p class="item-detail" v-if="isMatched">
          <span>对应标准项名称：{{itemObj.checkItemName}}</span>
          <span>对应标准项编码：{{itemObj.checkItemId}}</span>
        </p>
        <p class="item-success">
          <el-button type="success" @click="determine">确定</el-button>
        </p>
      </el-dialog>

      <div class="checkItem">
        <p>
          <span>体检项</span>
        </p>
        <el-input v-model="checkItem"></el-input>
      </div>
      <div class="selectCheck">
        <p class="title">检查项目已选：{{data.length}}项</p>
        <el-table :data="data" style="width:100%">
          <el-table-column label="体检项目名称">
            <template slot-scope="scope">
              <span class="danger mr10" v-if="!scope.row.isMatched">未匹配</span>
              <span>{{scope.row.name}}</span>
            </template>

          </el-table-column>
          <el-table-column label="操作" align="right">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="handleShowDetail(scope.$index, scope.row)">详情</el-button>
              <el-button size="mini" type="text" class="danger" @click="handleDeleteItems(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="addItems">
        <el-autocomplete v-model="itemsName" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelect"></el-autocomplete>

        <el-button @click="addItemsName">添加</el-button>
      </div>
      <div class="wraps">
        <p>检查目的</p>
        <el-input type="textarea" width="300px" :rows="4" placeholder="请输入内容" v-model="purpose">
        </el-input>
      </div>
      <div class="wraps">
        <p>注意事项</p>
        <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="notice">
        </el-input>
      </div>
      <div class="commit">
        <el-button type="success" @click="submitItems">提交</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      hospitalId: 0,
      hospitalName: "",
      outerVisible: false,
      innerVisible: false,
      inputVisible: false,

      anotherName: "", // 别名
      name: "", //套餐名称
      price: "",
      remark: "",

      inputValue: "",
      loading: false,
      checkItem: "",

      item: "",
      itemsName: "",
      itemsNameData: [],
      list: [],
      itemList: [],
      hspSectionId: null,

      feature: [],
      featureList: [],

      gender: "",
      isGender: [
        {
          gender: "不限"
        },
        {
          gender: "男"
        },
        {
          gender: "女"
        }
      ],

      isShowMarried: false,
      married: "",
      isMarried: [
        {
          married: "不限"
        },
        {
          married: "已婚"
        },
        {
          married: "未婚"
        }
      ],

      group: "",
      isGroup: [
        {
          group: "通用"
        },
        {
          group: "老年"
        },
        {
          group: "中年"
        },
        {
          group: "青年"
        },
        {
          group: "儿童"
        },
        {
          group: "入职"
        },
        {
          group: "高端"
        },
        {
          group: "婚前"
        },
        {
          group: "孕前"
        }
      ],

      dynamicTags: [],

      medicalItems: [],

      data: [],
      isMatched: false,
      itemName: "",
      itemObj: {},
      purpose: "",
      notice: "",

      isNameEmpty: true,
      isPriceEmpty: true,
      isSale: Boolean,

      //医院列表
      hospitalList:[],
      hsptName:"",
      hosptal:"",
    };
  },
  methods: {
    //获取特征
    getFeature() {
      this.$http
        .get("/hospital/set-meal/character/")
        .then(res => {
          this.featureList = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // querySearchAsync(queryString, cb) {
    //   this.itemList = [];
    //   if (queryString !== "") {
    //     this.$http
    //       .get("http://192.168.16.10:9999/hospital/set-meal/item", {
    //         params: {
    //           hspHospitalId: this.hospitalId,
    //           name: queryString
    //         }
    //       })
    //       .then(res => {
    //         this.loading = false;
    //         this.itemsNameData = res.data.data;
    //         if (this.itemsNameData != null) {
    //           this.list = this.itemsNameData.map(item => {
    //             return {
    //               value: item.name,
    //               id: item.id,
    //               isMatched: item.isMatched
    //             };
    //           });
    //           cb(this.list);
    //         }
    //       })
    //       .catch(error => {});
    //   }
    // },
    // handleSelect(item) {
    //   this.itemList = item;
    // },
    // addItemsName() {
    //   if (this.itemList.length != 0) {
    //     var obj = {
    //       name: this.itemList.value,
    //       id: this.itemList.id,
    //       isMatched: this.itemList.isMatched
    //     };
    //     this.itemsName = "";
    //     this.itemList = [];
    //     this.data.push(obj);
    //   } else {
    //     if (this.itemsName != "") {
    //       this.$http
    //         .get("http://192.168.16.10:9999/hospital/set-meal/findItem", {
    //           params: {
    //             name: this.itemsName,
    //             hspSectionId: this.hospitalId
    //           }
    //         })
    //         .then(res => {
    //           if (res.data.rc == 0) {
    //             if (res.data.data != null) {
    //               this.data.push(res.data.data);
    //             } else {
    //               this.data.push({
    //                 name: this.itemsName,
    //                 isMatched: false
    //               });
    //             }
    //             this.itemsName = "";
    //           }
    //         })
    //         .catch(error => {
    //           console.log(error);
    //         });
    //     } else {
    //       this.$message.error("体检项目名称不能为空");
    //     }
    //   }
    // },
    // submitItems() {
    //   if (this.checkItem == "") {
    //     this.$message.error("体检项不能为空");
    //   } else if (this.data.length == 0) {
    //     this.$message.error("检查项目不能为空");
    //   } else {
    //     this.$http
    //       .post("http://192.168.16.10:9999/hospital/set-meal/item", {
    //         hspHospitalId: this.hospitalId,
    //         hspSectionId: this.hspSectionId,
    //         hspSectionName: this.checkItem,
    //         hspItemDtoList: this.data,
    //         sectionPurpose: this.purpose,
    //         notice: this.notice
    //       })
    //       .then(res => {
    //         if (res.data.rc == 0) {
    //           if (this.hspSectionId) {
    //             for (var i = 0; i < this.medicalItems.length; i++) {
    //               if (this.hspSectionId == this.medicalItems[i].hspSectionId) {
    //                 this.medicalItems[i] = res.data.data;
    //                 this.$message.success("修改成功");
    //                 this.outerVisible = false;
    //               }
    //             }
    //           } else {
    //             this.medicalItems.push(res.data.data);
    //             this.$message.success("增加成功");
    //             this.outerVisible = false;
    //             this.checkItem = "";
    //             this.purpose = "";
    //             this.notice = "";
    //             this.data = [];
    //           }
    //         } else {
    //           this.$message.error(res.data.msg);
    //         }
    //       })
    //       .catch(err => {
    //         console.log(err);
    //       });
    //   }
    // },
    //选择性别
    selectGender() {
      if (this.gender == "女") {
        this.isShowMarried = true;
      } else {
        this.married = "";
        this.isShowMarried = false;
      }
    },
    //体检项编辑按钮
    // handleEdit(val) {
    //   console.log(val)
    //   this.checkItem = "";
    //   this.data = [];
    //   this.notice = "";
    //   this.purpose = "";
    //   const loading = this.$loading({
    //     lock: true,
    //     text: "正在保存",
    //     spinner: "el-icon-loading",
    //     background: "rgba(0, 0, 0, 0.7)"
    //   });
    //   this.outerVisible = true;
    //   this.hspSectionId = val.hspSectionId;
    //   this.$http
    //     .get("http://192.168.16.10:9999/hospital/set-meal/findSection", {
    //       params: {
    //         hspSectionId: val.hspSectionId
    //       }
    //     })
    //     .then(res => {
    //       console.log(res.data)
    //       if (res.data.rc == 0) {
    //         res = res.data.data;
    //         this.checkItem = res.hspSectionName;
    //         this.data = res.hspItemDtoList;
    //         this.notice = res.notice;
    //         this.purpose = res.sectionPurpose;
    //       } else {
    //         this.$message.error(res.data.msg);
    //       }
    //       loading.close();
    //     })
    //     .catch(err => {
    //       loading.close();
    //     });
    // },
    //体检项删除按钮
    // handleDelete(index) {
    //   this.medicalItems.splice(index, 1);
    // },
    //添加体检项按钮
    // handleAdd() {
    //   this.hspSectionId = null;
    //   this.checkItem = "";
    //   this.itemsName = "";
    //   this.purpose = "";
    //   this.notice = "";
    //   this.data = [];
    //   this.outerVisible = true;
    // },
    //减少标签
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    //显示input
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //增加标签
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    //检查项目详情
    // handleShowDetail(index, row) {
    //   this.innerVisible = true;
    //   this.isMatched = row.isMatched;
    //   this.itemName = row.name;
    //   this.itemObj = {};
    //   if (row.id) {
    //     this.$http
    //       .get("/hospital/check-items/findItem/", {
    //         params: {
    //           id: row.id
    //         }
    //       })
    //       .then(res => {
    //         this.itemObj = res.data.data;
    //       })
    //       .catch(error => {
    //         console.log(error);
    //       });
    //   }
    // },
    // determine() {
    //   this.innerVisible = false;
    // },
    //删除检查项目
    // handleDeleteItems(index, row) {
    //   this.data.splice(index, 1);
    // },
    saveSetMeal() {
      // \d{1,10}(\.\d{1,2})?$
      var reg = /(^[1-9]\d*(\.\d{1,4})?$)|(^0(\.\d{1,4})?$)/;
      if (this.price == "") {
        this.$message.error("套餐价格不能为空");
        this.isPriceEmpty = false;
      } else if (!reg.test(this.price)) {
        this.$message.error("套餐价格输入有误");
        this.isPriceEmpty = false;
      }
      if (this.name == "") {
        this.$message.error("套餐名称不能为空");
        this.isNameEmpty = false;
      }

      if (this.isNameEmpty && this.isPriceEmpty) {
        const loading = this.$loading({
          lock: true,
          text: "正在保存",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        if (this.gender == "") {
          this.gender = "不限";
        }
        if (this.group == "") {
          this.group = "通用";
        }
        if (this.$route.query.setMealId) {//更新套餐接口
          this.$http
            .post("/hospital/update-set-meal/", {
              id: this.$route.query.setMealId,
              name: this.trim(this.name),
              hospitalId: this.hospitalId,
              anotherName: this.trim(this.anotherName) || this.trim(this.name),
              price: this.trim(this.price),
              remark: this.remark,
              fitSex: this.gender,//使用性格
              maritalStatus: this.married || "不限",
              fitPeople: this.group,//使用人群
              tags: this.dynamicTags.join(","),//标签
              character: this.feature,//套餐特征
              isSale: this.isSale
            })
            .then(res => {
              loading.close();
              if (res.data.rc == 0) {
                this.$message.success("套餐修改成功");
                this.$router.push(
                  "/standard-data/hospital-manage/hospital/" +
                    this.hospitalId+
                    "/packages"
                );
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(error => {
              loading.close();
            });
        } else {//新增套餐接口
          this.$http
            .post("/hospital/save-set-meal/", {
              name: this.trim(this.name),
              hospitalId:this.hospitalId,
              anotherName: this.trim(this.anotherName) || this.trim(this.name),
              price: this.trim(this.price),
              remark: this.remark,
              fitSex: this.gender,
              maritalStatus: this.married || "不限",
              fitPeople: this.group,
              tags: this.dynamicTags.join(","),
              character: this.feature,
            })
            .then(res => {
              loading.close();
              if (res.data.rc == 0) {
                this.$message.success("套餐添加成功");
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
      this.isNameEmpty = true;
      this.isPriceEmpty = true;
    },
    getData() {
      if (this.$route.query.setMealId) {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("/hospital/set-meal/" + this.$route.query.setMealId)
          .then(res => {
            console.log(res.data)
            if (res.data.rc == 0) {
              res = res.data.data;
              this.anotherName = res.anotherName;
              this.name = res.name;
              this.price = res.price;
              this.remark = res.remark;
              this.gender = res.fitSex;
              this.isSale = res.isSale;
              //新增
              this.hosptal = res.hospitalId;
              if (this.gender == "女") {
                this.isShowMarried = true;
              }
              this.group = res.fitPeople;
              this.married = res.maritalStatus;
              if (res.tags != "") {
                this.dynamicTags = res.tags.split(",");
              }
              this.medicalItems = res.section?res.section:[];
              
              for (var i = 0; i < res.character.length; i++) {
                this.feature.push(res.character[i].id);
              }
              console.log(res.character.length)
            } else {
              this.$message.error(res.data.msg);
            }
            loading.close();
          })
          .catch(err => {
            loading.close();
          });
      }else if(this.$route.query.copyMealId){
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("/hospital/set-meal/" + this.$route.query.copyMealId)
          .then(res => {
            if (res.data.rc == 0) {
              res = res.data.data;
              this.anotherName = res.anotherName;
              this.name = res.name;
              this.price = res.price;
              this.remark = res.remark;
              this.gender = res.fitSex;
              this.isSale = res.isSale;
              this.hospitalId=res.hospitalId;
              if (this.gender == "女") {
                this.isShowMarried = true;
              }
              this.group = res.fitPeople;
              this.married = res.maritalStatus;
              if (res.tags != "") {
                this.dynamicTags = res.tags.split(",");
              }
              this.medicalItems = res.section?res.section:[];
              for (var i = 0; i < res.character.length; i++) {
                this.feature.push(res.character[i].id);
              }
            } else {
              this.$message.error(res.data.msg);
            }
            loading.close();
          })
          .catch(err => {
            loading.close();
          });
      }
    },
    //获取医院信息
    getInfo() {
      this.$http.get("/hospital/ops/" + this.hospitalId).then(res => {
        if (res.data.rc === 0) {
          this.hospitalName = res.data.data.name;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //trim方法
    trim(str){
      var newPrice = str.replace(/(^\s*)|(\s*$)/g, "");
      return newPrice
    }
  },
  created() {
    this.hospitalId = this.$route.params.hid;
    // console.log(this.hospitalId)
    this.getInfo();
  },
  mounted() {
    //拖拽体检项
    this.$dragging.$on("dragged", ({ value }) => {
      console.log(value.item);
    });
    this.getFeature();
    this.getData();
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
  .info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .another-name,.hospital-name {
      display: flex;
      align-items: center;
      width: 100%;
      margin-bottom:20px;
      p {
        min-width: 80px;
      }
    }
    .buyer-info {
      width: 50%;
      background: #eee;
      border-radius: 20px;
      padding: 20px;
      .title {
        text-align: center;
      }
      .info-detail {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        &.items-start {
          align-items: flex-start;
        }
        p {
          min-width: 100px;
          text-align: right;
          margin-right: 30px;
        }
      }
    }
  }
  .medical {
    .medical-hd {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: bold;
    }
    .medical-main {
      ul li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #ccc;
        height: 30px;
        margin-bottom: 1px;
        line-height: 30px;
        font-size: 14px;
        .operation {
          .edit {
            cursor: pointer;
            color: #409eff;
            margin-right: 10px;
          }
          .delete {
            cursor: pointer;
            color: #f56c6c;
          }
        }
      }
    }
    .medical-ft {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .add {
        cursor: pointer;
        color: #409eff;
      }
      .sum {
        font-size: 16px;
        font-weight: bold;
        color: #878d99;
      }
    }
    p {
      text-align: center;
      width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 0 20px;
      .item-name {
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
  .classified {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    p {
      min-width: 100px;
    }
  }
}

.el-tag {
  margin-right: 10px;
  margin-bottom: 5px;
}

.checkItem {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  p {
    min-width: 100px;
  }
}

.el-input {
  width: 300px;
}

.selectCheck {
  margin-bottom: 20px;
  .title {
    font-size: 14px;
    margin-bottom: 5px;
  }
}

.addItems {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .el-autocomplete {
    width: 300px;
    margin-right: 20px;
  }
}

.item-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.item-detail {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  span {
    margin-right: 30px;
  }
}

.item-success {
  text-align: center;
}

.success {
  color: #67c23a;
}

.danger {
  color: #f56c6c;
}

.wraps {
  width: 390px;
  display: flex;
  align-items: top;
  margin-bottom: 20px;
  p {
    width: 100px;
  }
}
</style>
