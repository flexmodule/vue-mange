<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/group-check-manage/index'}">团检企业</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/group-check-manage/group-check-detail/' + groupId}">团检详情</el-breadcrumb-item>
      <el-breadcrumb-item>医院及套餐配置</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="header">
        <span>医院和套餐配置</span>
        <el-button @click="addHspVisible = true">添加医院</el-button>
      </div>
      <div class="data-list">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="hospitalId" label="序号">
          </el-table-column>
          <el-table-column prop="hospitalName" label="医院名称">
          </el-table-column>
          <el-table-column label="可选套餐">
            <template slot-scope="scope">
              <el-tag v-for="(tag,PgIndex) in scope.row.setMealTemplates" closable :key="tag.id" :disable-transitions="false" @close="closePackage(scope.$index,PgIndex)">
                {{tag.name}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="可体检日期">
            <template slot-scope="scope">
              <el-button type="mini" @click="setDate(scope.$index,scope.row)">设置</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="mini" @click="handleDelete(scope.$index,scope.row)">删除医院</el-button>
              <el-button type="mini" @click="selectPackage(scope.$index,scope.row)">选择套餐</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <div>
      <el-button type="success" @click="handleSubmit" :disabled="tableData.length == 0">保存</el-button>
    </div>

    <!--添加医院弹窗-->
    <el-dialog title="添加医院" :visible.sync="addHspVisible" width="50%" :close-on-click-modal="false">
      <div class="flex">
        <span class="mr30">医院名称</span>
        <el-select v-model="hspData" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethodHsp" :loading="loading" clearable>
          <el-option v-for="item in hspList" :key="item.id" :label="item.name" :value="JSON.stringify(item)">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addHspVisible = false">取 消</el-button>
        <el-button type="primary" @click="addHsp">确 定</el-button>
      </span>
    </el-dialog>

    <!--选择套餐弹窗-->
    <el-dialog title="选择套餐" :visible.sync="selectPgVisible" width="50%" :close-on-click-modal="false">
      <div>
        <el-checkbox-group v-model="checkedPg">
          <el-checkbox v-for="item in packagesList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectPgVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPg">确 定</el-button>
      </span>
    </el-dialog>

    <!--设置日期弹窗-->
    <el-dialog title="本次团检时间设置" :visible.sync="setDateVisible" width="80%" :close-on-click-modal="false">
      <p class="mb10">{{hspName}}</p>
      <div class="flex mb10">
        <p>团检时间段：</p>
        <div class="flex">
          <p class="mr10">{{checkupStartAt}}</p>
          <p class="mr10">至</p>
          <p>{{checkupEndAt}}</p>
        </div>
      </div>

      <div class="configure-wrap">
        <div class="flex mb10">
          <div class="title">
            <p>周期配置：</p>
            <p>可约人数：</p>
          </div>
          <ul class="configure-list">
            <li v-for="(item, index) in weekList" :key="index">
              <div class="select-week" @click="selectWeek($event,item.id)">
                <span>{{item.name}}</span>
              </div>
              <div><input type="text" :data-week="item.id" @keyup="changeNum" /></div>
            </li>
          </ul>
        </div>
      </div>

      <ul class="calendar-list-wrap">
        <li class="calendar-wrap" v-for="item in dateList" :key="item.ym">
          <p class="title">{{ item.ym }}</p>
          <div class="date-wrap">
            <div class="date-top">
              <span>日</span>
              <span>一</span>
              <span>二</span>
              <span>三</span>
              <span>四</span>
              <span>五</span>
              <span>六</span>
            </div>
            <div class="date-body">
              <span v-for="(date, index) in item.date" @click="isSelect(date)" :key="index">
                {{ date.day }}
                <!-- <div class="date-person" v-show="date.isShow">{{ date.num }}</div> -->
                <input class="date-person" type="text" :value="date.num" v-show="date.isShow" v-on:click.stop="doThis" @keyup="dayChangeNum($event,date.ymd)" >
                <div class="point" v-show="date.isShow"></div>
                <div class="mask" v-show="!date.isMonth"></div>
              </span>
            </div>
          </div>
        </li>
      </ul>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setDateVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSetDate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      groupId: null,
      tableData: [],
      isHaveData: false,
      addHspVisible: false,
      loading: false,
      hspData: "",
      hspList: [],

      packagesList: [],
      selectPgVisible: false,
      checkedPg: [],
      hspIndex: "",

      setDateVisible: false,
      selectDate: "",
      hspId: "",
      hspName: "",

      dateList: [],
      weekList: [
        {
          name: "周一",
          id: "1"
        },
        {
          name: "周二",
          id: "2"
        },
        {
          name: "周三",
          id: "3"
        },
        {
          name: "周四",
          id: "4"
        },
        {
          name: "周五",
          id: "5"
        },
        {
          name: "周六",
          id: "6"
        },
        {
          name: "周日",
          id: "0"
        }
      ],

      setDateIndex: "",
      groupOrderHospitalDates: [],
      checkupStartAt: "",
      checkupEndAt: "",
      startAt: "",
      endAt: "",
      HospitalDates: [],
    };
  },
  created() {
    this.groupId = this.$route.params.gid;
    this.getData();
  },
  methods: {
    doThis(ev) {
      // console.log(ev);
    },
    getData() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .get("/group-check-manage/group-order/process/" + this.groupId)
        .then(res => {
          loading.close();
          if (res.data.rc == 0) {
            this.checkupStartAt = res.data.data.checkupStartAt;
            this.checkupEndAt = res.data.data.checkupEndAt;
            this.startAt = new Date(this.checkupStartAt);
            this.endAt = new Date(this.checkupEndAt);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          loading.close();
        });
      this.$http
        .get("/group-check-manage/" + this.groupId + "/hospital")
        .then(res => {
          if (res.data.data.length == 0) {
            this.isHaveData = false;
          } else {
            this.isHaveData = true;
          }
          if (res.data.rc == 0) {
            this.tableData = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          loading.close();
        });
    },
    setDate(index, row) {
      this.setDateVisible = true;
      this.hspId = row.hospitalId;
      this.hspName = row.hospitalName;
      this.setDateIndex = index;
      this.HospitalDates = row.groupOrderHospitalDates;
      this.dateList = [];
      this.getDate();
    },
    submitSetDate() {
      this.groupOrderHospitalDates = [];
      var startAt = this.startAt.getTime();
      var endAt = this.endAt.getTime();
      this.dateList.forEach((item, index) => {
        item.date.forEach((t, i) => {
          var time = new Date(t.ymd).getTime();
          if (t.isMonth && time >= startAt && time <= endAt && t.isShow && t.num != 0) {
            this.groupOrderHospitalDates.push({
              groupOrderHospitalId: this.hspId,
              checkupAt: t.ymd,
              limitedNumber: Number(t.num),
              usedNumber: 0
            });
          }
        });
      });
      this.setDateVisible = false;
      this.tableData[
        this.setDateIndex
      ].groupOrderHospitalDates = this.groupOrderHospitalDates;
    },
    selectWeek(ev, val) {
      var startAt = this.startAt.getTime();
      var endAt = this.endAt.getTime();
      this.dateList.map((item, index) => {
        item.date.map((t, i) => {
          var time = new Date(t.ymd).getTime();
          if (t.week == val && t.isMonth && time >= startAt && time <= endAt) {
            t.isclick = !t.isclick;
            t.isShow = !t.isShow;
          }
        });
      });
    },
    changeNum(ev) {
      this.dateList.map((item, index) => {
        item.date.map((t, i) => {
          if (t.week == ev.target.dataset.week) {
            t.num = ev.target.value;
          }
        });
      });
    },
    dayChangeNum(ev,ymd){
      this.dateList.map((item, index) => {
        item.date.map((t, i) => {
          if (t.ymd == ymd) {
            t.num = ev.target.value;
          }
        });
      });
    },
    handleDelete(index, row) {
      this.tableData.splice(index, 1);
    },
    selectPackage(index, row) {
      this.selectPgVisible = true;
      this.hspIndex = index;
      this.checkedPg = [];
      this.$http
        .get("/group-check-manage/" + this.groupId + "/set-meal-template/list")
        .then(res => {
          this.packagesList = res.data.data.resultList;
        })
        .catch(err => {
          console.log(err);
        });
      if (row.setMealTemplates && row.setMealTemplates.length != 0) {
        for (var i = 0; i < row.setMealTemplates.length; i++) {
          this.checkedPg.push(row.setMealTemplates[i].packageId);
        }
      }
    },
    //搜索医院
    remoteMethodHsp(query) {
      if (query !== "") {
        this.$http
          .get("/hospital/ops/name?name=" + query)
          .then(res => {
            if (res.data.data != []) {
              this.hspList = res.data.data;
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.hspList = [];
      }
    },
    //添加医院
    addHsp() {
      if (this.hspData != "") {
        var hspData = JSON.parse(this.hspData);
        var isHave = false;
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].hospitalId == hspData.id) {
            isHave = true;
          }
        }
        if (isHave) {
          this.$message.error("该医院已存在");
        } else {
          this.tableData.push({
            hospitalId: hspData.id,
            hospitalName: hspData.name,
            setMealTemplates: [],
            groupOrderHospitalDates: null,
            groupOrderId: this.groupId
          });
          this.addHspVisible = false;
          this.hspData = "";
          this.$message.success("添加医院成功");
        }
      } else {
        this.$message.error("请选择医院");
      }
    },
    closePackage(index, PgIndex) {
      this.tableData[index].setMealTemplates.splice(PgIndex, 1);
    },
    addPg() {
      var list = [];
      this.checkedPg.map(item => {
        this.packagesList.map(listItem => {
          if (item == listItem.id) {
            list.push(listItem);
          }
        });
      });
      this.tableData[this.hspIndex].setMealTemplates = list;
      this.$message.success("修改套餐成功");
      this.selectPgVisible = false;
    },
    handleSubmit() {
      if (this.tableData.length != 0) {
        var isPgEmpty = this.tableData.every(t => {
          return t.setMealTemplates.length != 0;
        });
        var isDateEmpty = this.tableData.every(t => {
          return t.groupOrderHospitalDates != null;
        });
        if (!isPgEmpty) {
          this.$message.error("医院套餐不能为空");
        }
        if (!isDateEmpty) {
          this.$message.error("医院配置日期不能为空");
        }
        if (isPgEmpty && isDateEmpty) {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          var params = {
            groupOrderHospitalRequests: this.tableData
          };
          if (this.isHaveData) {
            this.$http
              .post(
                "/group-check-manage/" + this.groupId + "/hospital/update",
                params
              )
              .then(res => {
                loading.close();
                if (res.data.rc == 0) {
                  this.$router.go(-1);
                  this.$message.success("修改成功");
                } else {
                  this.$message.error(res.data.msg);
                }
              })
              .catch(err => {
                loading.close();
              });
          } else {
            this.$http
              .post("/group-check-manage/" + this.groupId + "/hospital", params)
              .then(res => {
                if (res.data.rc == 0) {
                  this.$router.go(-1);
                  this.$message.success("完成配置医院");
                } else {
                  this.$message.error(res.data.msg);
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
        }
      } else {
        this.$message.error("请配置医院");
      }
    },
    isSelect(val) {
      if (val.isclick) {
        val.isShow = !val.isShow;
      }
    },
    ltTen(val) {
      if (val < 10) {
        val = "0" + val;
      }
      return val;
    },
    getDate() {
      this.dateList = [];
      var startYear = this.startAt.getFullYear();
      var startMonth = this.startAt.getMonth();
      var endYear = this.endAt.getFullYear();
      var endMonth = this.endAt.getMonth() + 1;
      if (endMonth == 12) {
        endYear = endYear + 1;
        endMonth = 0;
      }
      do {
        var obj = {};
        var list = [];
        obj.ym = startYear + "年" + (startMonth + 1) + "月";
        var date = new Date(startYear, startMonth, 1);
        date.setTime(date.getTime() - 86400000 * date.getDay());
        do {
          for (var i = 0; i < 7; i++) {
            var dateObj = {};
            var month = date.getMonth() + 1;
            var day = date.getDate();
            month = this.ltTen(month);
            day = this.ltTen(day);
            var ymd = startYear + "-" + month + "-" + day;
            dateObj.ymd = ymd;
            dateObj.isclick = false;
            dateObj.isShow = false;
            dateObj.num = 0;
            dateObj.week = date.getDay();
            dateObj.day = day;
            if (date.getMonth() == startMonth) {
              dateObj.isMonth = true;
            } else {
              dateObj.isMonth = false;
            }
            list.push(dateObj);
            date.setTime(date.getTime() + 86400000);
          }
        } while (date.getMonth() == startMonth);
        obj.date = list;
        this.dateList.push(obj);
        
        
        if( this.HospitalDates != null ){
          this.HospitalDates.map(t=>{
            list.some(d=>{
              if(t.checkupAt == d.ymd && t.limitedNumber != 0){
                d.isShow = true;
                d.isclick = true;
                d.num = t.limitedNumber;
              }
            })
          })
        }

        if (startMonth == 11) {
          startYear = startYear + 1;
          startMonth = 0;
        } else {
          startMonth = startMonth + 1;
        }
      } while (startYear != endYear || startMonth != endMonth);
    }
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .el-tag {
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
}
.configure-wrap {
  .title {
    width: 80px;
  }
  .configure-list {
    display: flex;
    align-items: center;
    li {
      width: 100px;
      text-align: center;
      border-width: 2px;
      border-style: solid;
      border-color: #ccc;
      margin-right: 10px;
      .select-week {
        &.active {
          background: red;
        }
      }
      input {
        width: 100%;
        border: none;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #ccc;
        outline: none;
        text-align: center;
      }
    }
  }
}
.calendar-list-wrap {
  display: flex;
  align-items: top;
  flex-wrap: wrap;
  justify-content: space-between;
  .calendar-wrap {
    width: 45%;
    margin-bottom: 20px;
    .title {
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 10px;
    }
    .date-wrap {
      border-top: 1px solid #acacac;
      border-left: 1px solid #acacac;
    }
    .date-top {
      font-size: 0;
      height: 28px;
      span {
        display: inline-block;
        box-sizing: border-box;
        width: calc(100%/7);
        font-size: 14px;
        line-height: 28px;
        height: 28px;
        text-align: center;
        border-right: 1px solid #acacac;
        border-bottom: 1px solid #acacac;
      }
    }
    .date-body {
      span {
        display: inline-block;
        box-sizing: border-box;
        width: calc(100%/7);
        width: -moz-calc(100%/7);
        width: -webkit-calc(100%/7);
        font-size: 14px;
        height: 50px;
        text-align: center;
        border-right: 1px solid #acacac;
        border-bottom: 1px solid #acacac;
        position: relative;
        .date-person {
          color: red;
          position: absolute;
          left: 50%;
          width: 50%;
          margin-left: -25%;
          bottom: 8px;
          border: 1px solid #eee;
          font-size: 12px;
          height: 14px;
          line-height: 14px;
          text-align: center;
          border: 1px solid #acacac;
        }
        .point {
          position: absolute;
          width: 5px;
          height: 5px;
          background: red;
          right: 2px;
          top: 2px;
          border-radius: 50%;
        }
        .mask {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #fff;
        }
      }
    }
  }
}
</style>