<template>
    <div class="container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/standard-bussiness-data/meal-promot'}">套餐促销</el-breadcrumb-item>
        <el-breadcrumb-item>新增</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 筛选操作 start -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>医院搜索</span>
            </div>
            <div class="info base">
                <div class="leftInfo infoItem">
                    <el-select v-model="hosName" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod">
				<el-option v-for="item in restaurants" :key="item.value" :label="item.name" :value="JSON.stringify(item)">
				</el-option>
			</el-select>
                    <div class="mt10">
                        <el-button type="success" @click="showMealList">确定</el-button>
                    </div>
                </div>
                <div class="rightInfo infoItem" v-if="showMeal">
                    <h3 class="meal-list-title">套餐列表</h3>
                    <ul class="meal-list">
                        <li v-for="item in mealList" :key="item.id" @click="mealDetail(item.id)">
                            <span>{{item.name}}</span>
                            <span>{{item.id}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </el-card>
        <div v-if="showMealDetail">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>基本信息</span>
                </div>
                <div class="info base">
                    <div class="leftInfo infoItem">
                        <div>
                            <span>套餐别称：</span>
                            <span>{{baseMessage.name}}</span>
                        </div>
                        <div>
                            <span>是否推荐：</span>
                            <span>{{baseMessage.name}}</span>
                        </div>
                        <div class="flex mr30">
                            <div class="demonstration" style="width: 80px;">特价设置：</div>
                            <el-date-picker
                                v-model="inputDate"
                                value-format="yyyy-MM-dd"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions">
                            </el-date-picker>
                        </div>
                        <div class="flex">
                            <div class="flex">
                                <div style="width:96px;">零售价：</div>
                                <el-input
                                    placeholder="零售价"
                                    v-model="retailPrice"
                                    clearable>
                                </el-input>    
                            </div>
                            <div class="flex">
                                <div style="width:96px;">促销价：</div>
                                <el-input
                                    placeholder="促销价"
                                    v-model="salePrice"
                                    clearable @change="priceJudge">
                                </el-input>    
                            </div>
                        </div>
                    </div>
                    <div class="rightInfo infoItem">
                        <h3 class="meal-list-title">采购信息</h3>
                        <p>
                            <span>套餐名称：</span>
                            <span>{{purchaseMessage.hspName}}</span>
                        </p>
                        <p>
                            <span>套餐编码：</span>
                            <span>{{purchaseMessage.id}}</span>
                        </p>
                        <p>
                            <span>医院定价：</span>
                            <span>{{purchaseMessage.hspPrice}}</span>
                        </p>
                        <p>
                            <span>备注：</span>
                            <span>{{purchaseMessage.remark}}</span>
                            <!-- <span class="change">修改</span> -->
                        </p>
                    </div>
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
                            <li v-for="item in physicalItem.physicalItem" v-dragging="{ item: item, list: physicalItem.physicalItem, group: 'item' }" :key="item.id" :loading="loading">
                                <div>
                                    <span class="item-name">{{ item.hspSectionName }}</span>
                                </div>
                                <p class="operation">
                                    <span class="edit" @click="showPsy(item.hspSectionId)">查看</span>
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div class="medical-ft">
                        <p>
                            <span class="sum">合计：{{physicalItem.total}}</span>
                        </p>
                    </div>
                </div> 
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>归类</span>
                </div> 
                <div class="classified">
                    <p>
                        <span>适用性别:</span>
                        <span>{{classfy.fitSex}}</span>
                    </p>
                </div>
                <div class="classified">
                    <p>
                        <span>适用人群:</span>
                        <span>{{classfy.fitPeople}}</span>
                    </p>
                </div>
                <div class="classified">
                    <p>
                        <span>标签:</span>
                        <el-tag v-for="item in tagList" :key="item" type="success" class="item">{{item}}</el-tag>
                    </p>
                </div>
                <div class="classified">
                    <p>
                        <span>套餐特征:</span>
                        <span v-for="item in classfy.character" :key="item" class="item">{{item}}</span>
                    </p>
                </div>
            </el-card>
            <el-card>
                <el-button type="success" @click="keepSale">保存</el-button>
                <el-button type="info" @click="$router.go(-1)">返回</el-button>
            </el-card>
        </div>
        <!-- 体检项详情 -->
        <div>
            <el-dialog title="体检项详情" :visible.sync="outerVisible">
                <el-dialog
                    width="30%"
                    :title="phyItemDetail.itemName"
                    :visible.sync="innerVisible"
                    append-to-body>
                    <div>
                        <p>
                            {{phyItemDetail.itemName}}
                            <span v-if="phyItemDetail.isMatched" class="colorGreen">已匹配</span>
                            <span v-if="!phyItemDetail.isMatched" class="colorRed">未匹配</span>
                        </p>
                        <p>
                            对应标准项名称：{{phyItemDetail.checkItemName}}
                        </p>
                        <p>
                            对应标准项编码：{{phyItemDetail.checkItemId}}
                        </p>
                    </div>
                </el-dialog>
                <div>
                    <p>
                        <b>体检项名称：</b>
                        {{phyItem.hspSectionName}}
                    </p>
                    <p>
                        <b>体检项目已选：</b>
                        {{hspItemDtoList.length}} 项
                    </p>
                    <P>
                        <b>体检项目名称：</b>
                    </P>
                    <ul>
                        <li v-for="item in hspItemDtoList" :key="item.id">
                            <span v-if="item.isMatched" class="colorGreen">已匹配</span>
                            <span v-if="!item.isMatched" class="colorRed">未匹配</span>
                            {{item.name}}
                            <span class="colorBlue" @click="phyDetail(item.id)">详情</span>
                        </li>
                    </ul>
                    <p>
                        <b>检查目的：</b>
                        {{phyItem.sectionPurpose}}
                    </p>
                    <p>
                        <b>注意事项：</b>
                        {{phyItem.notice}}
                    </p>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="outerVisible = false">取 消</el-button>
                </div>
            </el-dialog>
        </div>   
    </div>
</template>
<style lang="scss" scoped>
.colorRed{
    color:red;
}
.colorGreen{
    color:green;
}
.colorBlue{
    float:right;
    color:blue;
}
.classified {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        p {
            min-width: 100px;
        }
        .item{
            display:inline-block;
            margin-right:10px;
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
            ul li{
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
                        color: #409EFF
                    }
                    .delete {
                        cursor: pointer;
                        color: #fa5555;
                    }
                }
                div{
                    padding-left:20px;
                }
            }
        }
        .medical-ft {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .add {
                cursor: pointer;
                color: #409EFF;
            }
            .sum {
                font-size: 16px;
                font-weight: bold;
                color: #878D99;
            }
        }
        p{
            width: 100px;
            text-align: center;
        }
    }
  .box-card {
    margin: 10px 0;
    .info{
        display: flex;
        justify-content: space-between;
    }
  }
  .leftInfo{
    flex:1;
    div{
        padding:5px;
    }
}
.rightInfo{
    border: 1px solid #000;
    flex:1;
    p{
        padding:10px;
    }
}
.meal-list{
      li{
          padding:10px 0;
          border-bottom:2px solid #ddd;
      }
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
.meal-list{
    max-height:200px;
    overflow-y: auto;
    li{
        padding:10px;
        border-bottom:2px solid #ddd;
    }
}
.meal-list-title{
    padding:10px;
    background: #ddd;
}
.change{
    color:#778ef2;
}
</style>

<script>

  export default {
    data () {
      return {
        pickerOptions: {
          disabledDate(time) {
              return time.getTime() < Date.now() - 8.64e7
          }
        },
        hosid: '', //选中医院id
        mealList: [],  //套餐列表
        baseMessage: {}, //套餐基本信息
        purchaseMessage: {}, //套餐采购信息
        physicalItem: {}, //套餐体检项
        classfy: {}, //套餐归类
        tagList: [], //标签
        showMeal: false,  //套餐列表展示
        showMealDetail: false, //套餐详情展示
        retailPrice: '', //零售价
        salePrice: '', //促销价
        startDate: '', //促销开始日期
        endDate: '', //促销结束日期
        inputDate:'',
        restaurants: [],  //医院列表
        hosName: '', //选中医院名称

        outerVisible: false,
        innerVisible: false,
        phyItem:{}, //体检项详情
        hspItemDtoList:[], //检查项列表
        phyItemDetail: {}, //检查项详情
        loading:true,
      }
    },
    methods: {
      priceJudge() {
        if(this.retailPrice<this.salePrice){
          this.salePrice="";
          this.$message('促销价格不能大于原价，请输入合适价格！');
        }
      },
      handleIconClick(ev) {
        console.log(ev);
      },
      remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        this.$http
          .get("/hospital/ops/list/online", {
            params: {
              search: query
            }
          })
          .then(res => {
              this.loading = false;
            this.restaurants = res.data.data.resultList;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.restaurants = [];
      }
    },
      showMealList: function(){
          if(this.hosName === ''){
            this.$message('请选择医院！');
          }else{
              //console.log(JSON.parse(this.hosName))
              this.showMeal = true; //套餐列表展示
                this.$http.get('/stantard-bussiness/add/meal-list',{
                     params: {
                         hospitalId: JSON.parse(this.hosName).id,
                         isSetSale: false,
                    },
                }).then((res) => {
                    //console.log(res.data.data)
                    this.mealList = res.data.data.resultList;
                }).catch( error => {
                    console.log(error)
                })
          }
      },
      //套餐详情
      mealDetail: function(mealId){
            this.mealId = mealId;
             this.showMealDetail = true; //套餐详情展示
             this.$http.get('/stantard-bussiness/add/meal-detail/' + mealId).then((res) => {
                console.log(res.data.data)
                this.baseMessage = res.data.data.baseMessage; //基本信息
                this.purchaseMessage = res.data.data.purchaseMessage; //采购信息
                this.physicalItem = res.data.data.physicalItem; //体检项
                this.classfy = res.data.data.classfy; //归类
                this.tagList = this.classfy.tags.split(',');
                this.salePrice = this.baseMessage.salePrice; //促销价
                this.retailPrice = this.baseMessage.retailPrice; //促销价
            }).catch( error => {
                console.log(error)
            })
        },
        //保存为特价
        keepSale: function(){
            this.startDate = this.inputDate[0];
            this.endDate = this.inputDate[1];
            if(this.inputDate === ''){
                this.$message({
                    message: '请设定促销价时间!',
                    type: 'warning'
                });
            }else if(parseInt(this.salePrice) > parseInt(this.retailPrice)){
                this.$message({
                    message: '促销价必须低于零售价!',
                    type: 'warning'
                });
            }else{
                this.$http.put('/stantard-bussiness/meal-sale/set-sale',{
                        "id": this.mealId,
                        "startDate": this.startDate,
                        "endDate": this.endDate,
                        "retailPrice": this.retailPrice,
                        "salePrice": this.salePrice,
                }).then((res) => {
                    console.log(res)
                    if (res.data.rc === 0) {
                    this.$message({
                        message: '设置推荐套餐成功！',
                        type: 'success'
                    });
                    this.$router.go(-1)
                        this.recommendMealList();
                }else{
                    this.$message.error('设置失败');
                }
                }).catch( error => {
                    console.log(error)
                })
            }
        },
        //查看体检项
        showPsy: function(hspSectionId){
            this.outerVisible = true;
            this.$http.get('/hospital/set-meal/findSection',{
                params:{
                    hspSectionId: hspSectionId
                }
            }).then((res) => {
                this.phyItem = res.data.data;
                this.hspItemDtoList = res.data.data.hspItemDtoList;
            }).catch( error => {
                console.log(error)
            })
        },
        //体检项目详情
        phyDetail: function(id){
            this.innerVisible = true;
            this.$http.get('/hospital/check-items/findItem',{
                params:{
                    id: id
                }
            }).then((res) => {
                this.phyItemDetail = res.data.data;
            }).catch( error => {
                console.log(error)
            })
        },
    },
    mounted() {

    }
  }
</script>