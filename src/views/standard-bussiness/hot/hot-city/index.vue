<template>
    <div class="container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>热门城市</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 筛选操作 start -->
        <el-card class="box-card" v-loading="loading">
            <div>
                <el-button type="primary" @click="$router.push('/standard-bussiness-data/add-city')" icon="el-icon-circle-plus">新增城市</el-button>
            </div>
            <ul class="city-list">
                <li v-for="item in cityList" :key="item.name">
                    <div>{{item.city}}</div>
                    <el-button type="danger" class="fr" size="small" @click="deleteHotCity(item.id)">删除</el-button>
                </li>
            </ul>
            <div class="mt10">
                操作须知：为了增加用户体验感，请不要设置过多的热门城市
            </div>
        </el-card>
    </div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
}
.city-list {
  max-height: 600px;
  overflow-y: auto;
  li {
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:first-child {
      border-top: 1px solid #ddd;
      margin-top: 10px;
    }
  }
}
</style>

<script>
export default {
  name: "HotCity",
  data() {
    return {
      cityList: [], //城市列表
      loading: true
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList: function() {
      this.$http
        .get("/city/hot/cityList")
        .then(res => {
          this.loading = false;
          if (res.data.rc === 0) {
            this.cityList = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(error);
        });
    },
    //热门城市删除
    deleteHotCity: function(id) {
      this.$http
        .delete("/city/hot/" + id)
        .then(response => {
          this.$message({
            message: "删除成功！",
            type: "success"
          });
          this.getList();
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>