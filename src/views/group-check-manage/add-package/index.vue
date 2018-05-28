<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/group-check-manage/index'}">团检企业</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/group-check-manage/group-check-detail/' + groupId}">团检详情</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/group-check-manage/group-check-detail/' + groupId + '/packages'}">团检套餐列表</el-breadcrumb-item>
      <el-breadcrumb-item v-if="this.$route.query.setMealId">修改套餐</el-breadcrumb-item>
      <el-breadcrumb-item v-else>新增套餐</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div class="info">
        <div class="another-name">
          <p>
            <span>套餐名称</span>
          </p>
          <el-input placeholder="请输入名称" v-model="name">

          </el-input>
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
    <el-card class="box-card">
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
            <li v-for="(item,index) in medicalItems" v-dragging="{ item: item, list: medicalItems, group: 'item' }" :key="item.libSectionName">
              <p>
                <span class="item-name">{{ item.libSectionName }}</span>
              </p>
              <p class="operation">
                <span class="edit" @click="handleEdit(item, index)">编辑</span>
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
    </el-card>
    <div>
      <el-button type="success" @click="saveSetMeal">保存</el-button>
      <el-button type="info" @click="$router.go(-1)">取消</el-button>
    </div>

    <el-dialog title="添加体检项" :visible.sync="outerVisible" width="80%" :close-on-click-modal="false">
      <div class="checkItem">
        <p>
          <span>体检项</span>
        </p>
        <el-select v-model="checkItem" filterable remote reserve-keyword placeholder="请输入体检项" :remote-method="searchCheckItem" :loading="loading" @change="selectCheckItem">
          <el-option v-for="item in checkItemList" :key="item.id" :label="item.name" :value="JSON.stringify(item)">
          </el-option>
        </el-select>
      </div>
      <div class="selectCheck">
        <p class="title">检查项目已选：{{data.length}}项</p>
        <el-table :data="data" style="width:100%">
          <el-table-column prop="name" label="体检项目名称">
          </el-table-column>
          <el-table-column label="操作" align="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" class="danger" @click="handleDeleteItems(scope.$index, scope.row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="addItems">
        <p class="mr10">
          <span>体检项目</span>
        </p>
        <el-select class="mr10" v-model="examination" filterable remote reserve-keyword placeholder="请输入体检项目" :remote-method="searchExamination" :loading="loading" :disabled="isSelect">
          <el-option v-for="item in examinationList" :key="item.id" :label="item.name" :value="JSON.stringify(item)">
          </el-option>
        </el-select>
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
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      groupId: null,

      hospitalName: "",
      outerVisible: false,
      innerVisible: false,
      inputVisible: false,

      name: "", //套餐名称

      inputValue: "",
      loading: false,
      checkItem: "",
      checkItemId: "",
      checkItemList: [],
      examination: "",
      examinationList: [],

      item: "",
      itemsName: "",
      itemsNameData: [],
      list: [],
      itemList: [],
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
      picturePath: "",
      purpose: "",
      notice: "",
      isSelect: true,
      index: "",
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
    selectCheckItem(val) {
      if (val) {
        this.checkItemId = JSON.parse(this.checkItem).id;
        this.examination = "";
        this.data = [];
        this.isSelect = false;
      } else {
        this.isSelect = true;
      }
    },
    //搜索体检项
    searchCheckItem(query) {
      if (query !== "") {
        this.$http
          .get("/GroupExamine/findSection", {
            params: {
              sectionName: query
            }
          })
          .then(res => {
            if (res.data.data.length != 0) {
              this.checkItemList = res.data.data;
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.checkItemList = [];
      }
    },
    //搜索检查项目
    searchExamination(query) {
      if (query !== "" && this.checkItem) {
        this.$http
          .get("/GroupExamine/findItem", {
            params: {
              sectionId: this.checkItemId,
              itemName: query
            }
          })
          .then(res => {
            if (res.data.data.length != 0) {
              this.examinationList = res.data.data;
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.examinationList = [];
      }
    },
    //添加检查项目
    addItemsName() {
      if (this.examination) {
        var data = JSON.parse(this.examination);
        this.examination = "";
        var isHave = this.data.some(t=>{
          return t.id == data.id;
        })
        if( isHave ){
          this.$message.error("该检查项目已存在");
        }else{
          this.data.push(data);
        }
      }else{
        this.$message.error("检查项目不能为空");
      }
    },
    //删除检查项目
    handleDeleteItems(index, row) {
      this.data.splice(index, 1);
    },
    submitItems() {
      if (this.checkItem == "") {
        this.$message.error("体检项不能为空");
      } else if (this.data.length == 0) {
        this.$message.error("检查项目不能为空");
      } else {
        var libSectionId,
        libSectionName,
        picturePath;
        if( typeof this.index == "number" ){
          libSectionId = this.checkItemId; 
          libSectionName = this.checkItem;
          picturePath = this.picturePath;
          this.medicalItems[this.index]={
            libSectionId: libSectionId,
            libSectionName: libSectionName,
            picturePath: picturePath,
            sectionPurpose: this.purpose,
            notice: this.notice,
            libItemDtoList: this.data
          }
          this.outerVisible = false;
        }else{
          libSectionId = JSON.parse(this.checkItem).id;
          libSectionName = JSON.parse(this.checkItem).name;
          picturePath = JSON.parse(this.checkItem).picturePath;
          var isHave = this.medicalItems.some(t=>{
            return t.libSectionId == libSectionId;
          })
          if( isHave ){
            this.$message.error("该体检项已存在");
          }else{
            this.medicalItems.push({
              libSectionId: libSectionId,
              libSectionName: libSectionName,
              picturePath: picturePath,
              sectionPurpose: this.purpose,
              notice: this.notice,
              libItemDtoList: this.data
            });
            this.outerVisible = false;
          }
        }
      }
    },
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
    handleEdit(val, index) {
      this.outerVisible = true;
      this.examination = "";
      this.index = index;
      this.checkItem = val.libSectionName;
      this.checkItemId = val.libSectionId;
      this.picturePath = val.picturePath;
      this.purpose = val.sectionPurpose;
      this.notice = val.notice;
      this.data = val.libItemDtoList;
      this.isSelect = false;
    },
    //体检项删除按钮
    handleDelete(index) {
      this.medicalItems.splice(index, 1);
    },
    //添加体检项按钮
    handleAdd() {
      this.index = "";
      this.purpose = "";
      this.notice = "";
      this.checkItem = "";
      this.checkItemId = "";
      this.picturePath = "";
      this.itemsName = "";
      this.data = [];
      this.isSelect = true;
      this.outerVisible = true;
    },
    //减少标签
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    //add标签 显示input
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
    //提交套餐
    saveSetMeal() {
      if (this.name == "") {
        this.$message.error("套餐名称不能为空");
      } else {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        if (this.gender == "") {
          this.gender = "不限";
        }
        if (this.group == "") {
          this.group = "通用";
        }
        if (this.$route.query.setMealId) {
          this.$http
            .post("/group-check-manage/group-order/set-meal-template/update", {
              id: this.$route.query.setMealId,
              name: this.name,
              groupOrderId: this.groupId,
              fitSex: this.gender,
              maritalStatus: this.married || "不限",
              fitPeople: this.group,
              tags: this.dynamicTags.join(","),
              character: this.feature,
              section: this.medicalItems
            })
            .then(res => {
              loading.close();
              if( res.data.rc == 0){
                this.$message.success("套餐修改成功");
                this.$router.go(-1);
              }else{
                this.$message.error(res.data.msg);
              }
            })
            .catch(error => {
              loading.close();
            });
        } else {
          this.$http
            .post("/group-check-manage/group-order/set-meal-template/add", {
              name: this.name,
              groupOrderId: this.groupId,
              fitSex: this.gender,
              maritalStatus: this.married || "不限",
              fitPeople: this.group,
              tags: this.dynamicTags.join(","),
              character: this.feature,
              section: this.medicalItems
            })
            .then(res => {
              loading.close();
              if( res.data.rc == 0){
                this.$message.success("套餐添加成功");
                this.$router.go(-1);
              }else{
                this.$message.error(res.data.msg);
              }
            })
            .catch(error => {
              loading.close();
            });
        }
      }
    },
    //获取套餐信息
    getData() {
      if (this.$route.query.setMealId) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$http
          .get(
            "/group-check-manage/set-meal-template/" +
              this.$route.query.setMealId
          )
          .then(res => {
            loading.close();
            if( res.data.rc == 0 ){
              this.name = res.data.data.name;
              this.price = res.data.data.price;
              this.gender = res.data.data.fitSex;
              if (this.gender == "女") {
                this.isShowMarried = true;
              }
              this.group = res.data.data.fitPeople;
              this.married = res.data.data.maritalStatus;
              if (res.data.data.tags != "") {
                this.dynamicTags = res.data.data.tags.split(",");
              }
              this.medicalItems = res.data.data.section;
              for (
                var i = 0;
                i < res.data.data.setMealCharacterBoList.length;
                i++
              ) {
                this.feature.push(res.data.data.setMealCharacterBoList[i].id);
              }
            }else{
              this.$message.error(res.data.msg);
            }
          })
          .catch(err => {
            loading.close();
          });
      }
    }
  },
  created() {
    this.groupId = this.$route.params.gid;
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
    .another-name {
      display: flex;
      align-items: center;
      width: 35%;
      p {
        min-width: 80px;
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
  .el-input {
    width: 300px;
  }
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
