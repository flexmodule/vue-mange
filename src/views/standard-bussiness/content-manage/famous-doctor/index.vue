<template>
    <div class="container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>名医说管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>条件筛选</span>
            </div>
            <div class="filterData">
                <div class="flex mt10">
                    <div class="flex mr30" @keyup.enter="search">
                        <div style="width:120px;">文章标题：</div>
                        <el-input placeholder="请输入文章标题" v-model="title">
                        </el-input>
                    </div>
                    <div class="flex mr30">
                        <div class="demonstration" style="width: 80px;">发布时间：</div>
                        <el-date-picker style="width:400px;" v-model="onlineDate" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false">
                        </el-date-picker>
                    </div>
                    <div class="flex mr30">
                        <div style="width:80px;">状态: </div>
                        <el-select v-model="state" placeholder="请选择">
                            <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="submit">
                    <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                    <el-button type="info" icon="el-icon-refresh" @click="reset">重置</el-button>
                </div>
            </div>
        </el-card>
        <el-button type="primary" @click="$router.push('/standard-bussiness-data/add-famous')">新增</el-button>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>文章列表</span>
            </div>
            <div class="table-body">
                <el-table
                    :data="articalList"
                    style="width: 100%"
                    v-loading="loading"
                    :show-header="false">
                    <el-table-column
                        prop="date"
                        label="状态">
                        <template slot-scope="scope">
                            <div>
                                <p v-if="scope.row.status != 'draft'">{{scope.row.publishAt}}</p>
                                <p v-if="scope.row.status === 'published'">{{articalState(scope.row.status)}}</p>
                                <p class="color-red" v-if="scope.row.status === 'draft'">{{articalState(scope.row.status)}}</p>
                                <p class="color-green" v-if="scope.row.status === 'forbid'">{{articalState(scope.row.status)}}</p>
                            </div>
                        </template>  
                    </el-table-column>
                    <el-table-column
                        label="图片">
                        <template slot-scope="scope">
                            <div class="coverPath">
                                <div>
                                    <img :src="scope.row.coverPath" alt="" width="60px" height="60px">
                                </div>
                                <div>
                                    <del v-if="scope.row.status == 'forbid'">{{scope.row.title}}</del>
                                        <span v-else>{{scope.row.title}}</span>
                                    <p>阅读数：{{scope.row.readNum}}</p>
                                </div>
                            </div>
                        </template>  
                    </el-table-column>
                    <el-table-column
                        label="作者">
                        <template slot-scope="scope">
                            <div>
                                {{scope.row.expert.name}}
                            </div>
                        </template>  
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="$router.push('/standard-bussiness-data/edit-famous/' + scope.row.id)" v-if="scope.row.status !== 'forbid'">编辑</el-button>
                            <el-button type="primary" size="mini" @click="handleShow(scope.row.id)" v-if="scope.row.status === 'published'">查看</el-button>
                            <el-button type="success" size="mini" @click="publish(scope.row.id)" v-if="scope.row.status === 'draft'" >发布</el-button>
                            <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)" v-if="scope.row.status !== 'published'" >删除</el-button>
                            <el-button type="danger" size="mini" @click="getOffline(scope.row.id)" v-if="scope.row.status === 'published'">下架</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页模块 start -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 分页模块 end -->
        </el-card>
    </div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
}
.submit {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  button {
    margin: 0 20px;
  }
}
.table-header{
    background:#f2f4f8;
    padding:10px;
    span{
        font-weight: bold;
        font-size:16px;
    }
}
.table-body{
    padding:20px;
    li{
        padding:10px 0;
        border-bottom:1px solid #eee;
    }
}
.color-red{
    color:#f00;
}
.color-green{
    color:#0DBC79;
}
.coverPath{
    display: flex;
    align-content: center;
    div{
        margin-right:10px;
    }
}
</style>
<script>
export default {
  name: "",
  data() {
      return {
      newsUrl: "",
      loading: false,  
      total: 0, //总页数
      currentPage: 1, //分页当前页
      currentPageSize: 10,
      title: "", //文章标题
      onlineDate: '',  //发布时间
      startDate: '', //搜索开始时间
      endDate: '',  //搜索结束时间
      state: "", //状态
      stateList: [
        //状态
        { value: 'published', label: "已发布" },
        { value: 'forbid', label: "已下架" },
        { value: 'draft', label: "未发布" },
      ],
      articalList:[], //文章列表
      loading: true,
    };
  },
  created(){
    this.newsUrl = process.env.NEWS_API;
  },
  mounted() {
    this.dataList({})
  },
  methods: {
    //分页处理函数
    handleSizeChange(val) {
        //console.log(val)
         this.currentPageSize = val;
            this.currentPage = 1;
         this.dataList({
            type: 'famous',
            keyword: this.title, 
            startDate: this.startDate, 
            endDate: this.endDate, 
            status: this.state, 
            pageNo: this.currentPage,
            pageSize: val,
        });
    },
    handleCurrentChange(val) {
        //console.log(val)
        this.currentPage = val;
        this.dataList({
            type: 'famous',
            keyword: this.title, 
            startDate: this.startDate, 
            endDate: this.endDate, 
            status: this.state, 
            pageNo: val,
            pageSize: this.currentPageSize
        });
    },
      //文章状态
    articalState: function(state) {
      switch (state) {
        case 'published':
          return "已发布";
          break;
        case 'forbid':
          return "已下架";
          break;
        case 'draft':
          return "未发布";
          break;
      }
    },
    handleShow(id){
      window.open(`${this.newsUrl}?id=${id}&fromOps=1`);
    },
    //文章列表
    dataList:function(json){
        this.$http
        //.get("http://192.168.137.171:9999/news", {
        .get("/news", {
          params: {
            type: 'famous',  //文章类型, 非必选, mingyi对应名医说, news对应资讯, selection对应精选
            keyword: json.keyword || "", //文章标题
            startDate: json.startDate || "",  //发布开始时间
            endDate: json.endDate || "",  //发布结束时间
            status: json.status || "",  //状态：publish对应已发布, draft对应未发布, forbid对应已下架
            pageNo: json.pageNo || 1,
            pageSize: json.pageSize || 10
          }
        })
        .then(res => {
          this.loading = false;
          if (res.data.rc === 0) {
            this.articalList = res.data.data.resultList;
            this.total = res.data.data.records;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //搜索
    search: function(){
        this.startDate = this.onlineDate[0];
        this.endDate = this.onlineDate[1];
        this.dataList({
            type: 'famous',
            keyword: this.title, 
            startDate: this.startDate, 
            endDate: this.endDate, 
            status: this.state, 
            pageNo: this.page,
            pageSize: this.pageSezi
        });
        this.currentPage = 1;
        this.currentPageSize = 10;
    },
    //重置
    reset: function(){
        this.title = '';
        this.onlineDate = '';
        this.state = '';
    },
    //下架
    getOffline(id) {
      this.$confirm("确认下架吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .put("/news/" + id + "/forbid")
            .then(res => {
              if (res.data.rc === 0) {
                this.$message({
                  message: res.data.data,
                  type: "success"
                });
                this.dataList({
            type: 'famous',
            keyword: this.title, 
            startDate: this.startDate, 
            endDate: this.endDate, 
            status: this.state, 
            pageNo: this.page,
            pageSize: this.pageSezi
        });
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消下架"
          });
        });
    },
    //发布
    publish(newsId) {
      this.$confirm("确认发布吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .put("/news/" + newsId + "/publish")
            .then(res => {
              if (res.data.rc === 0) {
                this.$message({
                  message: res.data.data,
                  type: "success"
                });
                this.dataList({
            type: 'famous',
            keyword: this.title, 
            startDate: this.startDate, 
            endDate: this.endDate, 
            status: this.state, 
            pageNo: this.page,
            pageSize: this.pageSezi
        });
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消发布"
          });
        });
    },
    //删除
    handleDelete(newsId) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .delete("/news/" + newsId)
            .then(res => {
              if (res.data.rc === 0) {
                this.$message({
                  message: res.data.data,
                  type: "success"
                });
                this.dataList({
            type: 'famous',
            keyword: this.title, 
            startDate: this.startDate, 
            endDate: this.endDate, 
            status: this.state, 
            pageNo: this.page,
            pageSize: this.pageSezi
        });
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
