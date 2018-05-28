<template>
    <div class="container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/standard-bussiness-data/meal-recomend'}">套餐推荐</el-breadcrumb-item>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
      </el-breadcrumb>
        <div v-loading="loading">
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
                            <span>零售价：</span>
                            <span>{{baseMessage.saleDate}}</span>
                        </div>
                        <div>
                            <span>促销价</span>
                            <span>{{baseMessage.retailPrice}}</span>
                        </div>
                        <div>
                            <span>促销时间：</span>
                            <span>{{baseMessage.saleDate}}</span>
                        </div>
                        <!-- <div>
                            <span>设置为推荐套餐：</span>
                            <el-switch
                            v-model="isRecommendation"
                            active-text="开启"
                            inactive-text="取消"
                            @change="setRecommed">
                            </el-switch>
                        </div>   -->
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
                            <li v-for="item in physicalItem.physicalItem" v-dragging="{ item: item, list: physicalItem.physicalItem, group: 'item' }" :key="item.id">
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
                <!-- <el-button type="success" @click="keepRecommed">保存</el-button> -->
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
            display: inline-block;
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
        baseMessage: {}, //套餐几本信息
        purchaseMessage: {}, //套餐采购信息
        physicalItem: {},
        classfy: {},
        tagList: [],
        //isRecommendation: true,  //是否设置为推荐
        restaurants: [],
        hosName: '', //选中医院名称
        loading: true,

        outerVisible: false,
        innerVisible: false,
        phyItem:{}, //体检项详情
        hspItemDtoList:[], //检查项列表
        phyItemDetail: {}, //检查项详情
      }
    },
    methods: {
      //套餐编辑详情
      recommendMealList: function(isRecommend,recommendDate,cityName,search){
        this.$http.get('/stantard-bussiness/add/meal-detail/' + this.$route.params.mealid,).then((res) => {
            this.loading = false;
            //console.log(res.data.data)
            if(res.data.rc === 0){
                this.baseMessage = res.data.data.baseMessage;
                this.purchaseMessage = res.data.data.purchaseMessage; //采购信息
                this.physicalItem = res.data.data.physicalItem; //体检项
                this.classfy = res.data.data.classfy; //归类
                this.tagList = this.classfy.tags.split(',');
                //this.isRecommendation = res.data.data.baseMessage.isRecommendation;
            }else{
                this.$message.error(res.data.msg);
            }
        }).catch( error => {
            this.loading = false;
            console.log(error)
            this.$message.error(error);
        })
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
      //设置为推荐
        // setRecommed: function(val){
        //     this.isRecommendation = val;
        // },
        //取消推荐
        //保存为推荐
        // keepRecommed: function(){
        //     this.$http.put('/stantard-bussiness/meal-recommend/set-recommend' + '?id=' + this.$route.params.mealid + '&isRecommend=' 
        //     + this.isRecommendation + '&userName=王大锤&userId=007').then((res) => {
        //         console.log(res)
        //         if(!this.isRecommendation){
        //             this.$message({
        //                 message: '取消推荐设置成功！',
        //                 type: 'success'
        //             });
        //             this.$router.go(-1);
        //         }else{
        //             this.$message({
        //                 message: '设置推荐套餐成功！',
        //                 type: 'success'
        //             });
        //             this.$router.go(-1);
        //         }
        //     }).catch( error => {
        //         console.log(error)
        //     })
        // },
    },
    mounted() {
        this.recommendMealList();
    }
  }
</script>