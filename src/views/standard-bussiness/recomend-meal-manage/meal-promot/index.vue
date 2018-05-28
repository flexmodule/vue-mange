<template>
    <div class="container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>套餐促销</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 筛选操作 start -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>条件筛选</span>
          <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
        </div>
        <div class="filterData">
          <div class="flex mt10">
            <div class="flex mr30">
              <div style="width:80px;">是否推荐: </div>
              <el-select v-model="isRecommendValue" clearable placeholder="请选择">
                <el-option
                  v-for="item in isRecommendList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>             
            </div>
            <div class="flex mr30">
              <div style="width:80px;">是否生效: </div>
              <el-select v-model="isSaleValue" clearable placeholder="请选择">
                <el-option
                  v-for="item in isSaleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>             
            </div>
            <div class="flex mr30">
              <div class="demonstration" style="width: 80px;">促销时间：</div>
              <el-date-picker
                v-model="inputDate"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false">
              </el-date-picker>
            </div>
            
          </div>
          <div class="flex mt10" @keyup.enter="searchBtn">
            <div class="flex mr30">
                <div style="width:80px;">城市搜索：</div>
                <el-input
                    placeholder="请输入城市名称"
                    v-model="cityName"
                    style="width: 194px;"
                    clearable>
                </el-input>    
            </div>
            <div class="flex mr30">
              <div style="width:80px;">搜索：</div>
              <el-input
                placeholder="请输入套餐名称、医院编码、医院名称"
                v-model="search"
                style="width: 194px;"
                clearable>
              </el-input>              
            </div>

          </div>
          <div class="submit">
            <el-button type="primary" icon="el-icon-search" @click="searchBtn">查询</el-button>
            <el-button type="info" icon="el-icon-refresh" @click="reset">重置</el-button>
          </div>
        </div>
      </el-card>
      <!-- 筛选操作 end -->
      <div class="clearfix">
        <el-button type="primary" icon="el-icon-circle-plus" @click="$router.push('/standard-bussiness-data/meal-promot-add')">新增</el-button>
      </div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>特价套餐列表</span>
        </div>
        <div class="dataList">
          <!-- 医院列表部分操作按钮 start -->
          <el-table
            :data="mealList"
            style="width: 100%"
            v-loading="loading">
            <el-table-column
              prop="id"
              label="套餐编码"
              align="center">
            </el-table-column>
            <el-table-column
              prop="name"
              label="套餐名称">
            </el-table-column>
            <el-table-column
              prop="hospitalName"
              label="所属医院"
              align="center">
            </el-table-column>
            <el-table-column
              prop="setSaleAt"
              label="设定时间">
            </el-table-column>
            <el-table-column
              prop="startSaleDate"
              label="促销开始时间">
            </el-table-column>
            <el-table-column
              prop="endSaleDate"
              label="促销结束时间">
            </el-table-column>
            <el-table-column 
              label="操作"
              align="center"
              >
              <template slot-scope="scope">
                <el-button
                  size="mini" @click="$router.push('/standard-bussiness-data/meal-promot-edit/' + scope.row.id)">编辑</el-button>
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
            :total="total">
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
.submit{
  display: flex;
  justify-content: center;
  margin-top: 20px;
  button{
    margin: 0 20px;
  }
}
.operation{
  margin-top: 20px;
}

.el-date-editor,.el-cascader{
  width: 500px;
}
</style>

<script>
  export default {
    data () {
      return {
        isSetSale : true, //是否设置特价 
        isRecommendValue: null, //是否推荐值
        isRecommendList:[  //是否推荐
          {value: true, label: '是'},
          {value: false, label: '否'},
        ], 
        isSaleValue: null, //是否生效
        isSaleList:[  //是否生效列表
          {value: true, label: '已生效'},
          {value: false, label: '未生效'},
        ],
        inputDate: '', //促销时间
        saleDate: '',  //搜索时间
        cityName: '', //搜索城市名称
        search: '', //搜索
        total:0, //总页数
        page: 1, //默认第一页
        pageSezi: 10, //默认每页10条
        currentPage: 1,//分页当前页 
        mealList: [],  //套餐列表
        loading: true,
      }
    },
    mounted() {
      this.promotMealList(this.isSetSale,{});
    },
    methods: {
      //分页处理函数
      handleSizeChange(val) {
        this.promotMealList(this.isSetSale,{
            isRecommend: this.isRecommend,
            isSale: this.isSale,
            saleDate: this.saleDate,
            cityName: this.cityName, 
            search: this.search,
            page: this.page,
            pageSize: val, 
        });
      },
      handleCurrentChange(val) {
        this.promotMealList(this.isSetSale,{
            isRecommend: this.isRecommend,
            isSale: this.isSale,
            saleDate: this.saleDate,
            cityName: this.cityName, 
            search: this.search,
            page: val,
            pageSize: this.pageSize, 
        });
      },
      //促销套擦列表
      promotMealList: function(isSetSale,json){
        this.$http.get('/stantard-bussiness/meal-list',{
          params: {
            isSetSale: this.isSetSale || true, //特价套餐
            isRecommend: json.isRecommend,  //是否推荐
            isSale: json.isSale, //是否生效
            saleDate: json.saleDate || '', //促销时间
            cityName: json.cityName || '', //城市搜索
            search: json.search || '', //搜索
            page: json.page || 1,
            pageSize: json.pageSize || 10, 
          },
        }).then((res) => {
            this.loading = false;
            //console.log(res.data.data)
            if(res.data.rc === 0){
              this.total = res.data.data.records;
              this.mealList = res.data.data.resultList;
            }else{
              this.$message.error(res.data.msg);
            }
        }).catch( error => {
            this.loading = false;
            console.log(error)
            this.$message.error(error);
        })
      },
      //搜索
      searchBtn: function(){
        if(this.inputDate === ''){
          this.saleDate === '';
        }else{
          this.saleDate = this.inputDate[0] + ',' + this.inputDate[1];
        }
        this.promotMealList(this.isSetSale,{
            isRecommend: this.isRecommendValue,  //是否推荐
            isSale: this.isSaleValue, //是否生效
            saleDate: this.saleDate, //促销时间
            cityName: this.cityName, //城市搜索
            search: this.search, //搜索
            page: this.page,
            pageSize: this.pageSize, 
        })
      },
      //重置
      reset: function(){
        this.isRecommendValue = null;
        this.isSaleValue = null;
        this.inputDate = '';
        this.saleDate = '';
        this.cityName = '';
        this.search = '';
      },
    }
  }
</script>