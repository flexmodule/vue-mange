<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/standard-data/check-manage/index' }">体检项目</el-breadcrumb-item>
      <el-breadcrumb-item v-if="itemId">编辑</el-breadcrumb-item>
      <el-breadcrumb-item v-else>新增</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <ul>
        <li>
          <p>
            <span>检查内容库</span>
          </p>
          <el-input placeholder="请输入内容" v-model="itemName"></el-input>
        </li>
        <li>
          <p>
            <span>一级类目</span>
          </p>
          <el-select v-model="pName" placeholder="请选择一级类目" @change="selectPrimary" clearable>
            <el-option v-for="item in primaryData" :key="item.id" :value="JSON.stringify(item)" :label="item.name">
            </el-option>
          </el-select>
        </li>
        <li>
          <p>
            <span>二级类目</span>
          </p>
          <el-select v-model="sName" placeholder="请选择二级类目" @change="selectSecond" :disabled="secondDisabled" clearable>
            <el-option v-for="item in secondData" :key="item.id" :value="JSON.stringify(item)" :label="item.name">
            </el-option>
          </el-select>
        </li>
        <li>
          <p>
            <span>体检项目</span>
          </p>
          <el-select v-model="cName" placeholder="请选择体检项目" @change="selectItem" :disabled="checkDisabled" clearable>
            <el-option v-for="item in checkData" :key="item.id" :value="JSON.stringify(item)" :label="item.name">
            </el-option>
          </el-select>
        </li>
        <li>
          <p>
            <span>参考范围</span>
          </p>
          <el-select v-model="reference" placeholder="请选择" @change="selectRange" clearable>
            <el-option v-for="item in referenceRange" :key="item" :value="item" :label="item">
            </el-option>
          </el-select>
        </li>
        <!-- 范围 -->
        <li class="no-flex" v-if="reference === '范围'">
          <div class="text-wrap">
            <p>高值</p>
            <el-input v-model="maxValue"></el-input>
          </div>
          <div class="text-wrap flex-start">
            <p>偏高原因</p>
            <el-input class="text-area" type="textarea" :rows="4" v-model="maxValueReason"></el-input>
          </div>
          <div class="text-wrap flex-start">
            <p>建议</p>
            <el-input class="text-area" type="textarea" :rows="4" v-model="maxValueAdvise"></el-input>
          </div>
          <div class="text-wrap">
            <p>低值</p>
            <el-input v-model="minValue"></el-input>
          </div>
          <div class="text-wrap flex-start">
            <p>偏低原因</p>
            <el-input class="text-area" type="textarea" :rows="4" v-model="minValueReason"></el-input>
          </div>
          <div class="text-wrap flex-start">
            <p>建议</p>
            <el-input class="text-area" type="textarea" :rows="4" v-model="minValueAdvise"></el-input>
          </div>
          <div class="text-wrap">
            <p>单位</p>
            <el-select v-model="itemUnit" placeholder="请选择" clearable>
              <el-option v-for="item in unit" :key="item" :value="item" :label="item  ">
              </el-option>
            </el-select>
          </div>
        </li>
        <li class="no-flex" v-if="reference === '单一值' && radio == 1">
          <div class="text-wrap">
            <p>值</p>
            <el-input class="mr30" v-model="maxValue"></el-input>
            <div>
              <el-radio-group v-model="radio" @change="changeRadio">
                <el-radio label="1">不高于</el-radio>
                <el-radio label="2">不低于</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="text-wrap flex-start">
            <p v-if="radio == 1">偏高原因</p>
            <el-input class="text-area" type="textarea" :rows="4" v-model="maxValueReason"></el-input>
          </div>
          <div class="text-wrap flex-start">
            <p>建议</p>
            <el-input class="text-area" type="textarea" :rows="4" v-model="maxValueAdvise"></el-input>
          </div>
          <div class="text-wrap">
            <p>单位</p>
            <el-select v-model="itemUnit" placeholder="请选择" clearable>
              <el-option v-for="item in unit" :key="item" :value="item" :label="item">
              </el-option>
            </el-select>
          </div>
        </li>
        <li class="no-flex" v-if="reference === '单一值' && radio == 2">
          <div class="text-wrap">
            <p>值</p>
            <el-input class="mr30" v-model="minValue"></el-input>
            <div>
              <el-radio-group v-model="radio" @change="changeRadio">
                <el-radio label="1">不高于</el-radio>
                <el-radio label="2">不低于</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="text-wrap flex-start">
            <p v-if="radio == 2">偏低原因</p>
            <el-input class="text-area" type="textarea" :rows="4" v-model="minValueReason"></el-input>
          </div>
          <div class="text-wrap flex-start">
            <p>建议</p>
            <el-input class="text-area" type="textarea" :rows="4" v-model="minValueAdvise"></el-input>
          </div>
          <div class="text-wrap">
            <p>单位</p>
            <el-select v-model="itemUnit" placeholder="请选择" clearable>
              <el-option v-for="item in unit" :key="item" :value="item" :label="item">
              </el-option>
            </el-select>
          </div>
        </li>
        <li v-if="reference === '文字'" class="area-wrap">
          <p>文字描述</p>
          <!-- <el-input v-model="itemTxtDescription"></el-input> -->
          <div class="textarea-wrap">
            <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="itemTxtDescription">
          </el-input>
          </div>
        </li>
      </ul>
      <div class="operation">
        <el-button type="success" @click="submitItem()">保存</el-button>
        <el-button type="info" @click="$router.go(-1)">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itemId: null,
      itemName: "",
      itemPurpose: "",
      notice: "",

      primaryData: [],
      secondData: [],
      checkData: [],
      secondDisabled: true,
      checkDisabled: true,
      pid: "",
      sid: "",
      cid: "",
      pName: "",
      sName: "",
      cName: "",

      reference: "",
      referenceRange: ["范围", "单一值", "文字", "无参考范围"],
      maxValue: "",
      maxValueReason: "",
      maxValueAdvise: "",
      minValue: "",
      minValueReason: "",
      minValueAdvise: "",
      itemTxtDescription: "",
      itemUnit: "",
      unit: ["无单位", "%", "mmol/L", "mmhg", "kg/m^2", "次/分钟"],
      radio: "1"
    };
  },
  mounted() {
    this.getPrimary();
    this.itemId = this.$route.query.itemId;
    if (this.itemId) {
      this.getData();
    }
  },
  methods: {
    //获取一级类目
    getPrimary() {
      this.$http
        .get("/check-manage/primary-category/")
        .then(res => {
          this.primaryData = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取二级类目
    getSecond(id) {
      this.$http
        .get("/check-manage/second-category/" + id)
        .then(res => {
          this.secondData = res.data.data;
          this.secondDisabled = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取检查项目
    getCheckItem(id) {
      this.$http
        .get("/check-manage/inspection-item/" + id)
        .then(res => {
          this.checkData = res.data.data;
          this.checkDisabled = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //选择一级类目
    selectPrimary(val) {
      if (val) {
        var val = JSON.parse(val);
        this.pName = val.name;
        this.pid = val.id;
        this.getSecond(this.pid);
      } else {
        this.secondDisabled = true;
        this.secondData = [];
      }
      this.sid = "";
      this.sName = "";
      this.cid = "";
      this.cName = "";
      this.checkData = [];
      this.checkDisabled = true;
    },
    //选择二级类目
    selectSecond(val) {
      if (val) {
        var val = JSON.parse(val);
        this.sName = val.name;
        this.sid = val.id;
        this.getCheckItem(this.sid);
      } else {
        this.checkDisabled = true;
      }
      this.cid = "";
      this.cName = "";
      this.checkData = [];
    },
    //选择检查项目
    selectItem(val) {
      if (val) {
        var val = JSON.parse(val);
        this.cName = val.name;
        this.cid = val.id;
      }
    },
    //选择参考范围
    selectRange() {
      this.maxValue = "";
      this.maxValueReason = "";
      this.maxValueAdvise = "";
      this.itemUnit = "";
      this.minValue = "";
      this.minValueReason = "";
      this.minValueAdvise = "";
      this.itemTxtDescription = "";
    },
    getData() {
      this.$http
        .get("/check-manage/inspection-items/" + this.$route.query.itemId)
        .then(res => {
          if (res.data.rc == 0) {
            console.log(res.data.data);
            this.itemName = res.data.data.name;
            this.pid = res.data.data.sectionPrimaryId;
            this.sid = res.data.data.sectionSecondId;
            this.cid = res.data.data.sectionId;
            this.pName = res.data.data.sectionPrimaryName;
            this.sName = res.data.data.sectionSecondName;
            this.cName = res.data.data.sectionName;
            this.reference = res.data.data.txtRange;
            this.maxValue = res.data.data.maxValue;
            this.maxValueReason = res.data.data.maxValueReason;
            this.maxValueAdvise = res.data.data.maxValueAdvise;
            this.minValue = res.data.data.minValue;
            this.minValueReason = res.data.data.minValueReason;
            this.minValueAdvise = res.data.data.minValueAdvise;
            this.itemUnit = res.data.data.itemUnit;
            this.itemTxtDescription = res.data.data.itemTxtDescription;
            this.secondDisabled = false;
            this.checkDisabled = false;
            this.getSecond(this.pid);
            this.getCheckItem(this.sid);
            if (this.maxValue == 8888888888) {
              this.radio = "1";
              this.maxValue = "";
            }
            if (this.minValue == 8888888888) {
              this.radio = "2";
              this.minValue = "";
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    changeRadio(val) {
      this.maxValue = "";
      this.maxValueReason = "";
      this.maxValueAdvise = "";
      this.itemUnit = "";
      this.minValue = "";
      this.minValueReason = "";
      this.minValueAdvise = "";
    },
    //提交
    submitItem() {
      var maxValue = this.maxValue,
        minValue = this.minValue;
      if (this.radio == 1) {
        if (maxValue == "") {
          maxValue = "8888888888";
        }
      } else if (this.radio == 2) {
        if (minValue == "") {
          minValue = "8888888888";
        }
      }
      var params = {
        id: this.$route.query.itemId || "",
        name: this.itemName,
        sectionPrimaryId: this.pid,
        sectionSecondId: this.sid,
        sectionId: this.cid,
        sectionPrimaryName: this.pName,
        sectionSecondName: this.sName,
        sectionName: this.cName,
        txtRange: this.reference,
        itemUnit: this.itemUnit,
        maxValue: maxValue,
        maxValueReason: this.maxValueReason,
        maxValueAdvise: this.maxValueAdvise,
        minValue: minValue,
        minValueReason: this.minValueReason,
        minValueAdvise: this.minValueAdvise,
        itemTxtDescription: this.itemTxtDescription
      };
      this.$http
        .post("/check-manage/inspection-items/add", params)
        .then(res => {
          if (res.data.rc == 0) {
            if (this.$route.query.itemId) {
              this.$message.success("修改成功");
            } else {
              this.$message.success("增加成功");
            }
            this.$router.go(-1);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  margin: 10px 0;
  ul li {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    &.area-wrap{
      align-items: flex-start;
      .textarea-wrap{
        width: 400px;
      }
    }
    &.no-flex {
      display: block;
      .text-wrap {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        &.flex-start {
          align-items: flex-start;
        }
        .text-area {
          width: 400px;
        }
      }
    }
    p {
      min-width: 100px;
      span {
        font-size: 14px;
        line-height: 40px;
      }
    }
    .el-input {
      width: 400px;
    }
    .el-select {
      width: 400px;
    }
  }
  .operation {
    margin-top: 20px;
  }
}
</style>