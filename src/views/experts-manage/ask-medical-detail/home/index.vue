<template>
  <div class="container">
    <div class="operation">
      <div>
        <el-button type="primary" @click="getOnline" v-if="auditState == 2 || auditState == 1">恢复上架</el-button>
        <el-button type="danger" @click="showOffline" v-if="auditState == 3 ||  auditState == 0">下架该问题</el-button>
        <el-button @click="showHistory">下架历史</el-button>
      </div>
    </div>
    <div class="question-wrap">
      <div class="question-info">
        <p class="title">问题描述</p>
        <p class="content">{{ content }}</p>
        <p class="pdf" @click="openPdf" v-if="pdfName != null">{{ pdfName }}</p>
        <div class="img-wrap">
          <img alt="" v-for="(item, index) in picPaths" :src="item" :key="index">
        </div>
      </div>
      <div class="question-detail">
        <p class="question-time">{{ questionTime }}</p>
        <p class="answer-num">历史回答数： {{ answerNum }}</p>
      </div>
    </div>
    <div class="answer-wrap">
      <ul>
        <li v-for="(item, index) in answerList" :key="index">
          <div class="title">
            <div class="img-wrap">
              <img :src="item.expert[0].avatarPath" alt="">
            </div>
            <div class="expert-info">
              <p class="expert-name">{{ item.expert[0].name }}</p>
              <p class="expert-good">{{ item.expert[0].goodAt }}</p>
            </div>
          </div>
          <div class="like">
            <span>{{ item.like }}人赞了这个问题</span>
          </div>
          <div class="content">
            <div ref="listShow">
              <p class="part">{{ item.textContent.length >= 300 ? (item.textContent.substr(0,300) + "...") : item.textContent }}
                <span class="fontB" @click="readAll($event, index)" v-if="item.textContent.length >= 300">阅读全文</span>
              </p>
              <p class="all">{{ item.textContent }}</p>
              <div class="pack-up">
                <el-button @click="readPart($event, index)">收起</el-button>
              </div>
            </div>
          </div>
          <div class="date">
            <span>编辑于{{ item.createdAt }}</span>
          </div>
        </li>
      </ul>
    </div>
    <!-- 分页模块 start -->
    <div class="pagination" v-if="totalNum>10">
      <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" background layout="prev, pager, next" :total="totalNum">
      </el-pagination>
    </div>
    <!-- 分页模块 end -->

    <!-- 下架弹窗 -->
    <el-dialog title="下架该问题" :visible.sync="offlineVisible" width="60%" :close-on-click-modal="false">
      <div class="flex mb10">
        <p class="mr10">下架理由：</p>
        <el-select v-model="reason" placeholder="请选择" clearable>
          <el-option v-for="(item, index) in reasonList" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </div>
      <p class="mb10">详细理由：</p>
      <el-input type="textarea" :rows="6" v-model="detailReason"></el-input>
      <div class="offline-footer">
        <el-button type="primary" @click="getOffline()">确定下架</el-button>
        <el-button @click="offlineVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 下架历史弹窗 -->
    <el-dialog title="下架历史" :visible.sync="historyVisible" width="60%" :close-on-click-modal="false">
      <!-- 下架详情弹窗 -->
      <el-dialog width="40%" title="下架详情" :visible.sync="detailVisible" append-to-body top="20vh" :close-on-click-modal="false">
        <div>
          {{ offDetailReason }}
        </div>
      </el-dialog>
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="序号" align="center">
        </el-table-column>
        <el-table-column prop="reason" label="下架原因">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="showDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.operation {
  margin-bottom: 20px;
}
.question-wrap {
  margin-bottom: 20px;
  .question-info {
    line-height: 1em;
    border: 1px solid #dfdfdf;
    padding: 20px;
    .title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .content {
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 10px;
    }
    .pdf{
      border: 1px dashed #333;
      margin-bottom: 10px;
      padding: 5px;
    }
    .img-wrap {
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }
  .question-detail {
    display: flex;
    line-height: 24px;
    .question-time {
      margin-right: 20px;
    }
  }
}
.answer-wrap ul li {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #acacac;
  &:last-child {
    border-bottom: none;
  }
  .title {
    display: flex;
    .img-wrap {
      width: 50px;
      height: 50px;
      margin-right: 10px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .expert-info {
      .expert-name {
        line-height: 28px;
        font-size: 16px;
      }
      .expert-good {
        line-height: 22px;
        font-size: 14px;
      }
    }
  }
  .like {
    color: #acacac;
    font-size: 14px;
    line-height: 24px;
    margin-top: 5px;
  }
  .content {
    margin-top: 10px;
    .fontB {
      font-weight: bold;
    }
    .part {
      display: block;
    }
    .all {
      display: none;
    }
    .pack-up {
      display: none;
    }
  }
  .date {
    margin-top: 10px;
    font-size: 14px;
    line-height: 24px;
  }
}
.offline-footer {
  margin-top: 20px;
  text-align: center;
  .el-button {
    margin-right: 30px;
  }
}
#showDetail {
  .part {
    display: none;
  }
  .all {
    display: block;
  }
  .pack-up {
    display: block;
    margin-top: 30px;
    display: flex;
    flex-direction: row-reverse;
  }
}
</style>

<script>
export default {
  data() {
    return {
      qid: null,
      content: "",
      questionTime: "",
      answerNum: "",
      answerList: [],
      pdfName: "",
      pdfPath: "",
      picPaths: [],
      auditState: "",
      offlineVisible: false,
      reason: "",
      reasonList: [
        "广告、垃圾信息",
        "色情、淫秽或低俗内容",
        "激进时政或意识形态话题",
        "其他原因"
      ],
      detailReason: "",
      offDetailReason: "",

      historyVisible: false,
      loading: false,
      tableData: [],

      detailVisible: false,
      totalNum: 0,
      currentPage: 1
    };
  },
  mounted() {
    this.qid = this.$route.params.qid;
    new Promise((resolve, reject) => {
      this.getQuestion();
      resolve();
    }).then(r => {
      this.getAnswers();
    });
  },
  methods: {
    getQuestion() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .get("/expert/ask/" + this.qid)
        .then(res => {
          loading.close();
          if (res.data.rc == 0) {
            res = res.data.data;
            this.questionTime = res.createdAt;
            this.answerNum = res.answerNum;
            this.content = res.textContent;
            this.pdfName = res.pdfName;
            this.pdfPath = res.pdfPath;
            this.picPaths = res.picPaths;
            this.auditState = res.auditState;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          loading.close();
        });
    },
    getAnswers() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .get("/expert/ask/" + this.qid + "/answer", {
          params: {
            pageNo: this.currentPage
          }
        })
        .then(res => {
          loading.close();
          if (res.data.rc == 0) {
            this.answerList = res.data.data.resultList;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          loading.close();
        });
    },
    getOnline() {
      this.$http
        .post("/expert/ask/" + this.qid + "/shelf")
        .then(res => {
          if (res.data.rc == 0) {
            this.$message.success("上架成功");
            this.currentPage = 1;
            this.currentPageSize = 10;
            this.getQuestion();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    showOffline() {
      this.reason = "";
      this.detailReason = "";
      this.offlineVisible = true;
    },
    getOffline() {
      this.$http
        .post("/expert/ask/" + this.qid + "/off-the-shelf", {
          reason: this.reason,
          detailReason: this.detailReason
        })
        .then(res => {
          if (res.data.rc == 0) {
            this.offlineVisible = false;
            this.$message.success("下架成功");
            this.currentPage = 1;
            this.currentPageSize = 10;
            this.getQuestion();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    showHistory() {
      this.historyVisible = true;
      this.$http
        .get("/expert/ask/off-the-shelf/history/" + this.qid)
        .then(res => {
          if (res.data.rc == 0) {
            this.tableData = res.data.data.resultList;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    openPdf() {
      window.open(this.pdfPath);
    },
    readAll(ev, index) {
      this.$refs.listShow[index].id = "showDetail";
    },
    readPart(ev, index) {
      this.$refs.listShow[index].id = "";
    },
    showDetail(val) {
      this.detailVisible = true;
      this.offDetailReason = val.detailedReason;
    },
    //分页处理函数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAnswer();
    }
  }
};
</script>