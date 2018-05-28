<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/standard-bussiness-data/hot-city'}">热门城市</el-breadcrumb-item>
      <el-breadcrumb-item>新增城市</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 筛选操作 start -->
    <el-card class="box-card">
      <el-select v-model="cityName" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod">
				<el-option v-for="item in restaurants" :key="item.value" :label="item.city" :value="JSON.stringify(item)">
				</el-option>
			</el-select>
      <div class="mt10">
        <el-button type="success" @click="addHotCity">保存</el-button>
      </div>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
}
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>

<script>
export default {
  name: "AddCity",
  data() {
    return {
      restaurants: [], //城市列表
      cityName: "", //选择的城市
      cid: null, //选择的城市id
      province: "", //省
      isHot: null, //是否热门
      isOnline: null, //是否上线

      disable: false, //按钮是否可用
      city: "" //保存city
    };
  },
  methods: {
     remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        this.$http
          .get("city/online/city/list", {
            params: {
              search: query
            }
          })
          .then(res => {
            this.restaurants = res.data.data.resultList;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.restaurants = [];
      }
    },
    handleIconClick(ev) {
      console.log(ev);
    },
    //添加为热门城市
    addHotCity: function() {
      if(this.cityName === ''){
            this.$message('请选择城市！');
          }else{
              this.$http
          .post("/city/add/hot", {
            id: JSON.parse(this.cityName).id,
            city: JSON.parse(this.cityName).city,
            province: JSON.parse(this.cityName).province,
            isHot: JSON.parse(this.cityName).isHot,
            isOnline: JSON.parse(this.cityName).isOnline,
          })
          .then(res => {
            //console.log(res.data.msg)
            if (res.data.msg === null) {
              this.$message({
                message: "添加成功！",
                type: "success"
              });
              this.$router.go(-1);
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
          }
    }
  },
  mounted() {
    //this.getList();
  },
  watch: {
    cityName: function(val) {
      var bool;
      bool = this.restaurants.some(function(item, index, array) {
        return item.city === val;
      });
      if (bool) {
        this.disable = false;
      } else {
        this.disable = true;
      }
    }
  }
};
</script>