<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>体检套餐特征库</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>条件筛选</span>
        </div>
        <div class="filterData">
          <div class="input-container" @keyup.enter="searchFilter">
            <el-input
              placeholder="请输入特征名称"
              v-model="inputName"
              clearable>
            </el-input>
          </div>
          <div class="submit">
            <el-button type="primary" icon="el-icon-search" @click="searchFilter">查询</el-button>
            <el-button type="info" icon="el-icon-refresh" @click="resetFilter">重置</el-button>
          </div>
        </div>
    </el-card>
    <div class="clearfix">
        <el-button type="primary" icon="el-icon-circle-plus" @click="$router.push('/standard-data/package-character/edit?t=a')">新增</el-button>
    </div>
    <el-card class="box-card">
    <div slot="header" class="clearfix">
        <span>特征列表</span>
    </div>
    <div class="dataList">
        <!-- 医院列表部分操作按钮 start -->
        <el-table
        :data="tableData"
        
        v-loading="loading"
        style="width: 100%">
        <el-table-column
            label="特征图标"
            align="center">
            <template slot-scope="scope">
                <img class="character-icon" :src="scope.row.avatarPath" alt="">
            </template>
        </el-table-column>
        <el-table-column
            prop="name"
            align="center"
            label="特征名称">
        </el-table-column>
        <el-table-column 
            label="操作"
            align="center"
            >
            <template slot-scope="scope">
            <el-button
                size="mini"
                @click="$router.push('/standard-data/package-character/edit?t=e&i='+scope.row.id)">编辑</el-button>
            <!-- <el-button
                size="mini"
                @click="$router.push('/standard-data/hospital-manage/hospital/'+scope.row.id)">日志</el-button> -->
            </template>
        </el-table-column>
        </el-table>
        <!-- 分页模块 start -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
        </el-pagination>
        <!-- 分页模块 end -->          
    </div>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
.box-card{
    margin: 10px 0;
}
.filterData{
  .input-container{
    width: 300px;
  }
  .submit{
    text-align: center;
    margin-top: 10px;
  }
}
.character-icon {
  max-width: 100px;
  max-height: 100px;
}
</style>

<script>
export default {
  name: 'GroupManage',
  data () {
    return {
      inputName: '',
      loading: true,
      tableData: [],
      totalNum: null,//总数
      currentPage: 1,//分页当前页 
      currentPageSize: 10

    }
  },
  methods: {
    searchFilter(){
      this.getList({})
    },
    resetFilter(){
      this.inputName = ''
    },
    //分页处理函数
    handleSizeChange(val) {
      this.currentPageSize = val;
      this.currentPage = 1;
      this.getList({
        page: this.currentPage,
        size: val
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList({
        page: val,
        size: this.currentPageSize
      });
    },
    getList(json){
      this.$http.get('/set-meal-character',{
        params: {
          page: json.page||1,
          pageSize: json.size||10,
          name: this.inputName||''
        }
      }).then(res=>{
        this.loading = false
        console.log(res.data.data)
        if (res.data.rc===0) {
          this.tableData = res.data.data.resultList
          this.totalNum = res.data.data.records         
        }else{
          this.$message.error(res.data.msg)
        }
      })
    }
  },
  mounted() {
    this.getList({page:1,size:10})
  }
}
</script>