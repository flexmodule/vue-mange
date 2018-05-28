<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage' }">医院管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/hospital-manage/hospital/'+hospitalId }">{{hospitalName}}</el-breadcrumb-item>
      <el-breadcrumb-item>医院端管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card clearfix">
      <span>医院端账号设置</span>
    </el-card>
    <div id="account">
      <el-button type="primary" @click="totalAcBind">账号绑定</el-button>
      <el-dialog :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="账号类型" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="请选择">
              <el-option v-for="item in accountType" :label="item.roleName" :value="item.roleName" :key="item.roleId">{{item.roleName}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="一健康注册手机" :label-width="formLabelWidth">
            <el-input v-model="form.tel" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="accountCreate">创建</el-button>
        </div>
      </el-dialog>
          <el-dialog :visible.sync="dialogTableVisible">
          <el-table :data="gridData">
            <el-table-column property="id" label="用户编号" width="150"></el-table-column>
            <el-table-column property="nickName" label="用户昵称" width="200"></el-table-column>
            <el-table-column property="mobileNo" label="注册手机"></el-table-column>
            <el-table-column property="createdAt" label="注册时间"></el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="accountBind">绑定</el-button>
            <el-button icon="el-icon-refresh" @click="dialogTableVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>账号列表</span>
      </div>
      <div class="dataList">
        <!-- 医院列表部分操作按钮 start -->
        <el-table :data="tableData" v-loading="loading" style="width: 100%">
          <el-table-column prop="mobileNo" label="登录账号" align="center">
          </el-table-column>
          <el-table-column prop="realName" label="姓名" align="center">
          </el-table-column>
          <el-table-column prop="roleName" label="类型" align="center">
          </el-table-column>
          <el-table-column label="操作" width="220" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="unbindAccount(scope.$index, scope.row)">解绑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页模块 start -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
        </el-pagination>
        <!-- 分页模块 end -->
      </div>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
#account {
  .el-dialog__wrapper {
      .el-dialog {
      width: 38%;
      .el-select {
          width: 300px;
        }
      .el-input {
        width: 300px;
      }
      .el-button {
        width: 100px;
      }
    }
  }
}
.box-card {
  margin: 10px 0;
  .conditions {
    border-bottom: 1px solid #e6ebf5;
    p {
      width: 100px;
      overflow: hidden;
      white-space: nowrap;
    }
    .el-select {
      width: 200px;
    }
    .el-input {
      width: 200px;
    }
  }
  .operation {
    padding-top: 20px;
    text-align: center;
  }
}
</style>

<script>
export default {
  data() {
    return {
      gridData: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
          name: '',
          region: '',
          tel:"",
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
      hospitalId: 0,
      hospitalName: "",
      accountType:[],
      tableData: [],
      totalNum: 0, //总页数
      currentPage: 1, //分页当前页
      currentPageSize: 10,
      loading: false,
      realName: "",     //真实姓名
      roleId: 0,
      roleName: "",
      telphoneNo: "",
    };
  },
  methods: {
    //获取账号类型
    totalAcBind() {
      this.dialogFormVisible = true;
      this.$http
        .get("/hospital-platform-manage/find-hospital-platform-user-role", {
          params: {
          }
        })
        .then(res => {
          console.log(res.data.data)
          this.loading = false;
          if (res.data.rc === 0) {
            this.accountType = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    //账号创建
    accountCreate() {
      if(this.form.region!=""&&this.form.tel!=""&&this.form.name!=""){
        console.log(this.form.region)
        var typelength=this.accountType.length
        for(var i=0;i<typelength;i++) {
          if(this.form.region==this.accountType[i].roleName){
            this.roleId=this.accountType[i].roleId;
            break;
          }
        }
        this.realName=this.form.name;
        this.roleName=this.form.region;
        this.telphoneNo=this.form.tel;
        this.$http
        .get("/hospital-platform-manage/validate-telphone", {
          params: {
            telphoneNo: this.form.tel||""
          }
        })
        .then(res => {
          console.log(res.data)
          this.loading = false;
          if (res.data.rc === 0) {
            this.gridData=[]
            this.gridData.push(res.data.data);
            this.dialogFormVisible=false;
            this.dialogTableVisible=true;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          this.$message({
          message: "没找到对应用户，请先注册！",
          center: true
          });
          this.loading = false;
        });
      }else {
        this.$message({
          message: "你还有未填写的项，请填写完整",
          center: true
        });
      } 
    },
    //获取账号类型、账号绑定
    accountBind() {
      console.log(this.form)
      this.dialogTableVisible=false;
      this.$http
        .post("/hospital-platform-manage/bind-user", {
            organizationId: this.hospitalId,
            realName: this.realName,     //真实姓名
            roleId: this.roleId,
            roleName: this.roleName,
            telphoneNo: this.telphoneNo
        })
        .then(res => {
          console.log(res.data)
          this.loading = false;
          if (res.data.rc === 0) {
            this.dialogTableVisible=false;
            this.getList({});
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    //获取账号类型id
    getAccountId() {
      
    },

    //处理列表编辑按钮
    unbindAccount(index, row) {
      console.log(index,row)
      this.$http
        .delete(
          "/hospital-platform-manage/unbind-user/" +
            row.id+`?organizationId=${this.hospitalId}`
        )
        .then(res => {
          this.getList({});
        }).catch((err) => {
          });;
    },
    //分页处理函数
    handleSizeChange(val) {
      this.currentPage = 1;
      this.currentPageSize = val;
      this.getList({
        page: this.currentPage,
        size: val,
        organizationId: this.hospitalId
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList({
        page: val,
        size: this.currentPageSize,
        organizationId: this.hospitalId
      });
    },
    getList(json) {
      this.loading = true;
      this.$http
        .get("/hospital-platform-manage/find-enable-user", {
          params: {
            page: json.page || 1,
            size: json.size || 10,
            organizationId: this.hospitalId
          }
        })
        .then(res => {
          console.log(res.data)
          this.loading = false;
          if (res.data.rc === 0) {
            this.tableData = res.data.data.resultList;
            this.totalNum = res.data.data.records;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    getInfo() {
      this.$http.get("/hospital/ops/" + this.hospitalId).then(res => {
        if (res.data.rc === 0) {
          this.hospitalName = res.data.data.name;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  },
  mounted() {
    this.hospitalId = this.$route.params.hid;
    this.getInfo();
    this.getList({});
  }
};
</script>
