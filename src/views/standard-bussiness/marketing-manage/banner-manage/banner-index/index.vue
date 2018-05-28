<template>
    <div class="container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>banner管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 筛选操作 start -->
      <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>线上banner</span>
                <el-button type="primary" class="fr" size="small" @click="addBanner">新增一个banner</el-button>
            </div>
            <div>
                <div>
                  <ul>
                    <li class="dragTable table-title">
                      <div>编号</div>
                        <div>标题</div>
                        <div width="20%">图片</div>
                        <div>url</div>
                        <div>到期时间</div>
                        <div>发布人</div>
                        <div>操作</div>
                    </li>
                  </ul>
                  <ul>
                    <draggable v-model="online" :move="getdata" @update="datadragEndOnline">
                      <transition-group>
                        <li v-for="(list,index) in online" :key="index" class="dragTable">
                          <div class="lineHeight80">{{(index + 1)}}</div>
                          <div>{{list.title}}</div>
                          <div>
                            <img :src="list.avatarPath" alt="" width="100px">
                          </div>
                          <div @click="showUrl(list.target)"><p class="url-contain">{{list.target}}</p></div>
                          <div>{{list.endAt}}</div>
                          <div>{{list.publishBy}}</div>
                          <div v-if="list.title != ''">
                            <el-button type="danger" size="small" @click="dialogVisible = true,bannerID = list.id">下线</el-button>
                          </div>
                        </li>
                      </transition-group>
                    </draggable>
                  </ul>
                </div>
                <el-dialog
                  title="提示"
                  :visible.sync="dialogVisible"
                  width="30%">
                  <span>是否确认下线？</span>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="offLine">确 定</el-button>
                  </span>
                </el-dialog>
            </div>  
      </el-card>  
      <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>预发布</span>
            </div>
            <div>
                <div>
                  <ul>
                    <li class="dragTable table-title">
                      <div>编号</div>
                        <div>标题</div>
                        <div width="20%">图片</div>
                        <div>url</div>
                        <div>发布时间</div>
                        <div>发布人</div>
                        <div>操作</div>
                    </li>
                  </ul>
                  <ul>
                    <draggable v-model="preline" :move="getdata" @update="datadragEndPreline">
                      <transition-group>
                        <li v-for="(list,index) in preline" :key="index" class="dragTable">
                          <div class="lineHeight80">{{(index + 1)}}</div>
                          <div>{{list.title}}</div>
                          <div>
                            <img :src="list.avatarPath" alt="" width="100px">
                          </div>
                          <div @click="showUrl(list.target)"><p class="url-contain">{{list.target}}</p></div>
                          <div>{{list.startAt}}</div>
                          <div>{{list.publishBy}}</div>
                          <div v-if="list.title != ''">
                            <el-button type="primary" size="small" @click="putOnline(list.id,list.positionId)">发布</el-button>
                            <el-button type="success" size="small" @click="$router.push('/standard-bussiness-data/banner-edit/' + list.id)">编辑</el-button>
                            <el-button type="danger" size="small" @click="deletePreLine(list.id)">删除</el-button>
                          </div>
                        </li>
                      </transition-group>
                    </draggable>
                  </ul>
                </div>
            </div>  
      </el-card>  
    </div>
</template>
<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
}
.lineHeight80{
  line-height:80px;
}
.table-title{
  line-height:80px;
}
.url-contain{
  height: auto;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
}
.dragTable {
  border: 1px solid #ddd;
  border-bottom: none;
  width: 100%;
  min-height:80px;
  font-size:0;
  div {
    font-size:14px;
    display: inline-block;
    text-align: center;
    // border-right: 1px solid #ddd;
    vertical-align: middle;
    height:100%;
    &:nth-child(1) {
      width: 10%;
    }
    &:nth-child(2) {
      width: 10%;
    }
    &:nth-child(3) {
      width: 15%;
    }
    &:nth-child(4) {
      width: 15%;
    }
    &:nth-child(5) {
      width: 15%;
    }
    &:nth-child(6) {
      width: 15%;
    }
    &:nth-child(7) {
      width: 20%;
    }
  }
}
.dragTable:last-child {
  border-bottom: 1px solid #ddd;
}
</style>

<script>
import draggable from "vuedraggable";

export default {
  data() {
    return {
      preLineLength: 0, //预发布数量
      preLineAdd: [],

      online: [], //线上banner
      preline: [], //预发布banner
      dialogVisible: false,

      bannerID: null,

      tags: []
    };
  },
  components: {
    draggable
  },
  mounted() {
    this.onlineBanner();
    this.prelineBanner();
  },
  methods: {
    //补全空对象
    addObj: function(arr1, arr2) {
      var empty = {
        id: "",
        code: "",
        positionId: "",
        avatarPath: "",
        title: "",
        target: "",
        state: "",
        type: "",
        sequence: "",
        startAt: "",
        endAt: "",
        isDel: "",
        publishBy: ""
      };
      var str = "";
      for (var j = 0; j < 5; j++) {
        for (var i = 0; i < arr2.length; i++) {
          str = arr2[i].positionId.toString();
          if (str.indexOf(j) === 0) {
            arr1[j] = arr2[i];
          }
        }
        if (arr1[j] == "" || typeof arr1[j] == "undefined") {
          arr1[j] = empty;
        }
      }
      return arr1;
    },
    //按照列表顺序新增一个
    addFirst: function(first, preline) {
      console.log(preline);
      if (preline.length === 0) {
        return 0;
      } else {
        var str = "";
        for (var i = 0; i < preline.length; i++) {
          str += preline[i].positionId.toString();
        }
        for (var j = 0; j < 5; j++) {
          if (str.indexOf(j) === -1) {
            first.push(j);
          }
        }
      }

      //console.log(first)
      return first[0];
    },
    //线上列表
    onlineBanner: function() {
      this.$http
        .get("/banner/ops/online/banner/list")
        //.get("http://192.168.137.202:9999/banner/ops/online/banner/list")
        .then(res => {
          var arr1 = [];
          //console.log(res.data.data);
          this.online = this.addObj(arr1, res.data.data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    prelineBanner: function() {
      this.$http
        .get("/banner/ops/prepare/online/banner/list")
        .then(res => {
          var arr1 = [];
          //console.log(res.data)
          this.preLineAdd = res.data.data;
          this.preLineLength = res.data.data.length;
          this.preline = this.addObj(arr1, res.data.data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    //预上线删除
    deletePreLine: function(id) {
      this.$http
        .delete("/banner/ops//prepare/online/banner/" + id)
        .then(res => {
          if (res.data.rc === 0) {
            this.$message.success("删除成功!");
            this.prelineBanner();
          } else {
            this.$message.error("删除失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //新增banner
    addBanner: function() {
      if (this.preLineLength < 5) {
        this.$router.push(
          "/standard-bussiness-data/banner-add/" + this.addFirst([], this.preLineAdd)
        );
      } else {
        this.$message.success("预发布已满，无法添加");
      }
    },
    //发布
    putOnline: function(id, positionID) {
      console.log(this.preline[positionID].positionId);
      console.log(this.online[positionID].positionId);

      if (
        this.preline[positionID].positionId ===
        this.online[positionID].positionId
      ) {
        this.$message({
          message: "不可发布",
          type: "warning"
        });
      } else {
        this.$http
          .put("/banner/ops/online/banner/" + id)
          .then(res => {
            console.log(res);
            if (res.data.rc === 0) {
              this.$message({
                message: "发布成功",
                type: "success"
              });
              this.onlineBanner();
              this.prelineBanner();
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    //下线
    offLine: function() {
      //console.log(this.bannerID);
      this.$http
        .put("/banner/ops/off/banner/" + this.bannerID)
        .then(res => {
          console.log(res);
          if (res.data.rc === 0) {
            this.$message({
              message: "下线成功",
              type: "success"
            });
            this.onlineBanner();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.dialogVisible = false;
    },

    getdata(evt) {
      //console.log(evt.draggedContext.element.id);
    },
    //线上拖拽排序
    datadragEndOnline: function(evt){
      var bannerList = []; //排序数组
       for(var i = 0;i < this.online.length; i ++){
         if(this.online[i].id != ''){
           bannerList.push(
             {
               id:this.online[i].id,
               positionId:i
             }
           )
         }
       }
       //console.log(bannerList)
       this.$http.put('/banner/ops/sort/banner',{
         "bannerList":bannerList
       }).then((res) => {
         //console.log(res.data)
         if(res.data.rc === 0){
           this.$message({
              message: "banner展示位置调整成功",
              type: "success"
            });
            this.onlineBanner();
         }else{
           this.$message.error(res.msg);
         }
       }).catch((error) => {
         console.log(error)
       })
    },
    //预上线拖拽排序
    datadragEndPreline(evt) {
       //console.log("拖动前的索引 :" + evt.oldIndex);
       //console.log("拖动后的索引 :" + evt.newIndex);
       //console.log(this.preline);
       var bannerList = []; //排序数组
       for(var i = 0;i < this.preline.length; i ++){
         if(this.preline[i].id != ''){
           bannerList.push(
             {
               id:this.preline[i].id,
               positionId:i
             }
           )
         }
       }
       //console.log(bannerList)
       this.$http.put('/banner/ops/sort/banner',{
         "bannerList":bannerList
       }).then((res) => {
         //console.log(res.data)
         if(res.data.rc === 0){
           this.$message({
              message: "banner展示位置调整成功",
              type: "success"
            });
            this.prelineBanner();
         }else{
           this.$message.error(res.msg);
         }
       }).catch((error) => {
         console.log(error)
       })
    },
    //showUrl
    showUrl: function(url){
      window.open(url)
    },
  }
};
</script>