<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>每日精选</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>条件筛选</span>
      </div>
      <div class="filterData">
        <div class="flex mt10">
          <div class="flex mr30" @keyup.enter="filterSerach">
            <div style="width:120px;">文章标题：</div>
            <el-input placeholder="请输入文章标题" v-model="search" clearable>
            </el-input>
          </div>
          <div class="flex mr30">
            <div class="demonstration" style="width: 80px;">发布时间：</div>
            <el-date-picker v-model="onlineDate" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:400px;">
            </el-date-picker>
          </div>
          <div class="flex mr30">
            <div style="width:80px;">状态: </div>
            <el-select v-model="state" clearable placeholder="请选择">
              <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="submit">
          <el-button type="primary" icon="el-icon-search" @click="filterSerach">查询</el-button>
          <el-button type="info" icon="el-icon-refresh" @click="reset">重置</el-button>
        </div>
      </div>
    </el-card>
    <div>
      <el-button type="primary" @click="$router.push('/standard-bussiness-data/add-day-chosen')">添加精选</el-button>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>精选列表</span>
      </div>
      <div class="table-body">
        <!-- articalList -->
        <el-table :data="articalList" style="width:100%" :show-header="false" v-loading="loading">
          <el-table-column prop="name" label="体检项目名称">
            <template slot-scope="scope">
              <p v-if="scope.row.status != 'draft'">{{scope.row.publishAt}}</p>
              <p :class="scope.row.status == 'draft' ? 'color-green' : scope.row.status == 'forbid' ? 'color-red' : ''">{{articalState(scope.row.status)}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="src" label="图片">
            <template slot-scope="scope">
              <img :src="scope.row.coverPath" alt="" style="width:80px;">
            </template>
          </el-table-column>
          <el-table-column prop="name" label="看不到">
            <template slot-scope="scope">
              <p>
                <del v-if="scope.row.status == 'forbid'">{{scope.row.title}}</del>
                <span v-else>{{scope.row.title}}</span>
              </p>
              <p>阅读数：{{scope.row.readNum}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="$router.push('/standard-bussiness-data/edit-day-chosen/' + scope.row.id)" v-if="scope.row.status !== 'forbid'">编辑</el-button>
              <el-button type="primary" size="mini" @click="handleShow(scope.row.id)" v-if="scope.row.status === 'published'">查看</el-button>
              <el-button type="success" size="mini" @click="publish(scope.row.id)" v-if="scope.row.status === 'draft'">发布</el-button>
              <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)" v-if="scope.row.status !== 'published'">删除</el-button>
              <el-button type="warning" size="mini" @click="getOffline(scope.row.id)" v-if="scope.row.status === 'published'">下架</el-button>
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
.color-red {
  color: #f00;
}
.color-green {
  color: #0dbc79;
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
      search: "", //文章标题
      onlineDate: "", //发布时间
      state: "", //状态
      stateList: [
        //状态
        { value: "published", label: "已发布" },
        { value: "forbid", label: "已下架" },
        { value: "draft", label: "未发布" }
      ],
      articalList: []
    };
  },
  created(){
    this.newsUrl = process.env.NEWS_API;
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      var startDate = "",
        endDate = "";
      if (this.onlineDate) {
        startDate = this.onlineDate[0];
        endDate = this.onlineDate[1];
      }
      this.$http
        .get("/news", {
          params: {
            type: "selection", //info: 资讯，selection: 精选文章，famous: 名医说/名医课堂
            keyword: this.search, //文章标题
            startDate: startDate, //发布开始时间
            endDate: endDate, //发布结束时间
            status: this.state, //状态：publish对应已发布, draft对应未发布, forbid对应已下架
            pageNo: this.currentPage,
            pageSize: this.currentPageSize
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
          this.loading = false;
        });
    },
    //分页处理函数
    handleSizeChange(val) {
      this.currentPageSize = val;
      this.currentPage = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    filterSerach() {
      this.currentPageSize = 10;
      this.currentPage = 1;
      this.getList();
    },
    reset() {
      this.search = "";
      this.onlineDate = "";
      this.state = "";
    },
    
    //文章状态
    articalState: function(state) {
      switch (state) {
        case "published":
          return "已发布";
          break;
        case "forbid":
          return "已下架";
          break;
        case "draft":
          return "未发布";
          break;
      }
    },
    handleShow(id) {
      window.open(`${this.newsUrl}?id=${id}&fromOps=1`);
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
                this.getList();
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
                this.getList();
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
                this.getList();
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
