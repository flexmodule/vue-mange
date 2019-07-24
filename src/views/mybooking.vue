<style scope>
.mybooking .header {
  position: relative;
  background: #d74d33;
  padding: 0.1rem 0 0.1rem 0;
  color: #fff;
}
.mybooking .header .header-l {
  position: absolute;
  left: 0.2rem;
  top: 0.35rem;
  font-size: 0;
  width: 0.3rem;
  height: 0.3rem;
  transform: rotate(180deg);
}
.mybooking .header .header-l img {
  width: 100%;
  height: 100%;
}
.mybooking .header .header-c {
  text-align: center;
  font: 0.3rem/0.8rem "";
}
.mybooking .header .header-r {
  position: absolute;
  top: 0.3rem;
  right: 0.2rem;
  display: flex;
  align-items: center;
}
.mybooking .header .header-rl {
  font: 0.2rem/0.4rem "";
  margin-right: 0.1rem;
}
.mybooking .header .header-rr {
  font-size: 0;
  width: 0.3rem;
  height: 0.3rem;
}
.mybooking .header .header-rr img {
  width: 100%;
  height: 100%;
}
.mybooking .info {
  display: flex;
  justify-content: center;
  font: 0.32rem/.7rem "";
}
.mybooking .info .info-l {
  color: #999;
  margin-right: 0.2rem;
}
.mybooking .info .info-r {
  color: #000;
}
.mybooking .body {
  padding: 0.4rem 0.8rem 0;
}
.mybooking .body .data {
  margin-bottom: 0.3rem;
  position: relative;
}
.mybooking .body .data .del {
  position: absolute;
  right: 0.3rem;
  top: 0;
  font: 0.24rem/.24rem "";
  color: #4fbbf0;
}
.mybooking .body .data .data-t {
  font: 0.3rem/.5rem "";
}
.mybooking .body .data .data-c {
  color: #999;
  font: 0.24rem/.5rem "";
}
.mybooking .body .data .data-b {
  display: flex;
  justify-content: space-between;
  font: 0.22rem/.5rem "";
  color: #999;
}
.mybooking .body .data:before {
  position: absolute;
  width: 0.3rem;
  height: 0.3rem;
  content: "";
  background: #d74d33;
  left: -0.5rem;
  border-radius: 50%;
  top: 0.1rem;
}
.mybooking .body .other {
  text-align: center;
  font: 0.3rem/.4rem "";
  color: #333;
}
</style>
<template>
  <div class="mybooking">
    <div class="header">
      <div class="header-l" @click="returnmeeting">
        <img src="@/assets/img/arrow.png" alt>
      </div>
      <div class="header-c">我的预订</div>
      <div class="header-r" @click="returnmeeting">
        <div class="header-rl">会议室预定</div>
        <div class="header-rr">
          <img src="@/assets/img/arrow.png" alt>
        </div>
      </div>
    </div>
    <div class="info">
      <div class="info-l">温馨提示</div>
      <div class="info-r">您最近提交了{{notes.length}}条预定记录</div>
    </div>
    <div class="body">
      <div v-if="notes.length!=0">
        <div class="data" v-for="item,index in notes">
          <div class="data-t">{{item.room}}</div>
          <div class="data-c">{{item.reasons}}</div>
          <div class="data-b">
            <div class="data-bl">{{item.time}}</div>
            <div class="data-br">{{item.date}}</div>
          </div>
          <div class="del" @click="del(index)">删除</div>
        </div>
      </div>
      <div class="other" v-else>对不起，目前没有任何记录</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "mybooking",
  components: {},
  data() {
    return {
      notes: [
        {
          room: "9S-908",
          reasons: "项目组新方案设计推广介绍",
          time: "09:30-10:00",
          date: "2017-03-08"
        },
        {
          room: "9S-9087",
          reasons: "项目组新方案设计推广介绍",
          time: "09:30-10:00",
          date: "2017-03-08"
        }
      ]
    };
  },
  methods: {
    del(index) {
      this.notes.splice(index, 1);
      this.$forceUpdate();
    },
    returnmeeting() {
      this.$router.push("/");
    }
  },
  mounted() {}
};
</script>
