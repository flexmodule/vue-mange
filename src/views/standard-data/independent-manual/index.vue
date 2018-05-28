<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>自助手册管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>自助手册列表</span>
      </div>
      <div class="filterData">
        <div class="addBtn">
          <el-button type="primary" icon="el-icon-circle-plus" @click="add">新增</el-button>
        </div>

      </div>
      <div class="itemContent" v-for="t in allItems" :key="t.id">
        <div class="physicalExamination" v-if="t.itemNameDtoList.length == 0?false:true">
          {{ t.sectionName }}
        </div>
        <div class="checkItem" v-for="c in t.itemNameDtoList" :key="c.id">
          <p>{{c.name}}</p>
          <el-button type="text" @click="deleteItem(c.id)">删除</el-button>
        </div>
      </div>
    </el-card>
    <!-- 弹出层 -->
    <el-dialog title="新增检查项目" :visible.sync="dialogFormVisible" center>
      <div class="addItems" v-loading="loading">
        <div class="lf">
          <p class="center">体检项目</p>
          <p v-for="(a,index) in addAllItems" :key="a.id" :class="index == num?'active':''" @click=activeItem(index)>{{a.sectionName}}</p>

        </div>
        <div class="rt">
          <p class="center">检查项目</p>
          <p v-for="(b,ind) in selectCheck" :key="ind" class="cItem">
            <el-checkbox v-model="b.isSelfHelpManual">{{b.name}}</el-checkbox>
          </p>

        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="handleAdd" icon="el-icon-success">确 定</el-button>
        <el-button @click="dialogFormVisible = false" icon="el-icon-error">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
}
.filterData {
  display: flex;
  justify-content: flex-end;
  background: #f0f4f7;
  padding: 10px 20px;
}
.itemContent {
  margin-top: 10px;
  font-size: 14px;
  line-height: 34px;
  .physicalExamination {
    background: #f2f2f2;
    text-indent: 1em;
  }
  .checkItem {
    padding: 0 2em;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f2f2f2;
  }
}
.addItems {
  display: flex;
  justify-content: space-between;

  .lf,
  .rt {
    width: 49%;
    background: #f2f2f2;
    font-size: 14px;
    height: 500px;
    overflow-y: scroll;
    p {
      line-height: 3em;
      text-indent: 2em;
      border-bottom: 1px solid #e4e4e4;
      display: flex;
      align-items: center;
      &:hover {
        cursor: pointer;
      }
    }
    .cItem {
      text-indent: 10px;
      padding-left: 10px;
    }
    .center {
      text-indent: 0px;
      justify-content: center;
    }
    .active {
      background: #fff;
    }
  }
}
</style>

<script>
import { provinceAndCityData, CodeToText } from "@/utils/areaSelect";
export default {
  name: "GroupManage",
  data() {
    return {
      allItems: [],
      addAllItems: [],
      dialogFormVisible: false,
      num: 0,
      addAllCheck: [],
      selectCheck: [],
      checked: false,
      loading: false
    };
  },
  methods: {
    //获取列表
    getList: function() {
      this.$http
        .get("/self-help-manual/manual/list")
        .then(res => {
          if (res.data.rc === 0) {
            this.allItems = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {});
    },
    deleteItem(id) {
      this.$confirm("确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .delete("/self-help-manual/delete?itemId=" + id)
            .then(res => {
              if (res.data.rc === 0) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getList();
              } else {
                this.$message.error(res.data.msg);
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
    //新增查询所有体检项
    addGetList: function() {
      this.num = 0;
      this.loading = true;
      this.$http
        .get("/self-help-manual/list")
        .then(res => {
          if (res.data.rc === 0) {
            this.addAllItems = [];
            res.data.data.forEach(item => {
              if (item.itemNameDtoList.length != 0) {
                var itemNameDtoList = [];
                item.itemNameDtoList.forEach(i => {
                  if (!i.isSelfHelpManual) {
                    itemNameDtoList.push(i);
                  }
                });
                this.addAllItems.push({
                  id: item.id,
                  sectionName: item.sectionName,
                  itemNameDtoList: itemNameDtoList
                });
              } else {
                this.addAllItems.push({
                  id: item.id,
                  sectionName: item.sectionName,
                  itemNameDtoList: []
                });
              }
            });
            this.selectCheck = this.addAllItems[0].itemNameDtoList;
          } else {
            this.$message.error(res.data.msg);
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    add: function() {
      this.dialogFormVisible = true;
      this.addGetList();
    },
    handleAdd() {
      var arr = [];
      this.addAllItems.forEach(item => {
        var itemIds = [];
        item.itemNameDtoList.forEach(i => {
          if (i.isSelfHelpManual) {
            itemIds.push(i.id);
          }
        });
        if (itemIds.length != 0) {
          arr.push({
            sectionId: item.id,
            itemId: itemIds
          });
        }
      });
      this.$http
        .put("/self-help-manual/add", {
          sectionItemRequest: arr
        })
        .then(res => {
          if (res.data.rc == 0) {
            this.$message.success("添加检查项目成功");
            this.dialogFormVisible = false;
            this.getList();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {});
    },
    activeItem(i) {
      this.selectCheck = this.addAllItems[i].itemNameDtoList;
      this.num = i;
    }
  },
  mounted() {
    this.getList();
  }
};
</script>