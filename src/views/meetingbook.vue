<style scope>
.meetingbook {
  width: 100%;
  height: 100%;
}
.meetingbook .header {
  position: relative;
  background: #d74d33;
  padding: 0.1rem 0 0.4rem 0;
  color: #fff;
}
.meetingbook .header .header-l {
  text-align: center;
  font: 0.3rem/0.8rem "";
}
.meetingbook .header .header-r {
  position: absolute;
  top: 0.3rem;
  right: 0.2rem;
  display: flex;
  align-items: center;
}
.meetingbook .header .header-r .header-rl {
  font: 0.2rem/0.4rem "";
  margin-right: 0.1rem;
}
.meetingbook .header .header-rr {
  font-size: 0;
  width: 0.3rem;
  height: 0.3rem;
}
.meetingbook .header .header-rr img {
  width: 100%;
  height: 100%;
}
.meetingbook .header .header-b {
  display: flex;
  margin-top: 0.2rem;
  justify-content: center;
}
.meetingbook .header .header-bl {
  display: flex;
  align-items: center;
  padding: 0.1rem;
  margin-right: 0.4rem;
  border: 0.01rem solid #fff;
  border-radius: 0.4rem;
}
.meetingbook .header .header-bll {
  font: 0.34rem/0.34rem "";
  margin-right: 0.1rem;
}
.meetingbook .header .header-blr {
  width: 0.34rem;
  font-size: 0;
  height: 0.34rem;
}
.meetingbook .header .header-blr img {
  width: 100%;
  height: 100%;
}
.meetingbook .header .header-br {
  border-radius: 0.4rem;
  background: #fff;
  padding: 0.12rem 0.5rem;
  color: #d74d33;
  font: 0.3rem/0.3rem "";
}
.meetingbook .calendar-t {
  display: flex;
  justify-content: space-around;
  padding: 0.2rem 0;
}
.meetingbook .calendar-t .title {
  font: 0.2rem/.4rem "";
  color: #999;
}
.meetingbook .calendar-t .data {
  padding: 0.16rem 0.05rem;
  margin: 0.1rem 0;
  text-align: center;
  width: 0.8rem;
  height: 0.6rem;
  position: relative;
}
.meetingbook .calendar-t .data-t {
  font: 0.2rem/.24rem "";
  color: #000;
}
.meetingbook .calendar-t .data-b {
  font: 0.2rem/.24rem "";
  color: #999;
}
.meetingbook .calendar-t .backactive {
  background: #d74d33;
  border-radius: 50%;
  color: #fff;
}
.meetingbook .calendar-t .backactive .data-t {
  color: #fff;
}
.meetingbook .calendar-t .backactive .data-b {
  color: #fff;
}
.meetingbook .calendar-t .bookactive::after {
  position: absolute;
  right: -0.2rem;
  top: -0.24rem;
  content: "";
  width: 0;
  height: 0;
  border-top: 0.16rem solid #4fbbf0;
  border-bottom: 0.16rem solid transparent;
  border-left: 0.16rem solid transparent;
  border-right: 0.16rem solid transparent;
  transform: rotate(225deg);
}
.meetingbook .calendar-bt {
  display: flex;
  justify-content: center;
  font: 0.3rem/.4rem "";
  color: #000;
}
.meetingbook .calendar-b .data-l,
.data-r {
  position: relative;
  margin: 0 0.6rem;
}
.meetingbook .calendar-b .data-l::before {
  position: absolute;
  content: "";
  width: 0.4rem;
  height: 0.4rem;
  left: -0.6rem;
  top: 0;
  bottom: 0;
  margin: auto;
  background: #d74d33;
  border-radius: 18%;
}
.meetingbook .calendar-b .data-r::before {
  position: absolute;
  content: "";
  width: 0.4rem;
  height: 0.4rem;
  left: -0.6rem;
  top: 0;
  bottom: 0;
  margin: auto;
  border-radius: 18%;
  background: #4fbbf0;
}
.meetingbook .calendar-b .info {
  font: 0.24rem/.5rem "";
  color: #999;
  text-align: center;
}
.meetingbook .box {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
}
.meetingbook .box .selectbox {
  width: 3.4rem;
  height: 3rem;
  border-radius: 0.2rem;
  background: #fff;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.meetingbook .box .selectbox .title {
  background: #d74d33;
  font: 0.3rem/0.8rem "";
  color: #fff;
  border-top-left-radius: 0.2rem;
  border-top-right-radius: 0.2rem;
}
.meetingbook .box .selectbox .data {
  font: 0.3rem/.6rem "";
  position: relative;
  width: 100%;
  height: 0.6rem;
}
.meetingbook .box .selectbox .data.active::after {
  position: absolute;
  content: "";
  width: 0.2rem;
  height: 0.2rem;
  border-radius: 50%;
  background: #d74d33;
  left: 0.6rem;
  top: 0;
  bottom: 0;
  margin: auto;
}
</style>
<template>
  <div class="meetingbook">
    <div class="header">
      <div class="header-t">
        <div class="header-l">会议室预定</div>
        <div class="header-r" @click="tomy">
          <div class="header-rl">我的预订</div>
          <div class="header-rr">
            <img src="@/assets/img/arrow.png" alt>
          </div>
        </div>
      </div>
      <div class="header-b">
        <div class="header-bl" @click="selectroom">
          <div class="header-bll">{{roomnum}}</div>
          <div class="header-blr">
            <img src="@/assets/img/downarrow.png" alt>
          </div>
        </div>
        <div class="header-br">查询</div>
      </div>
    </div>
    <div class="calendar">
      <div class="calendar-t">
        <div class="calendarc">
          <div class="data title">周一</div>
          <div
            class="data"
            v-for="item,index in calendardata"
            @click="tobooking(item)"
            v-if="item.key=='周一'"
            :class="`${item.iscurrent?'backactive':''} ${item.isbooking?'bookactive':''}`"
          >
            <div class="data-t">{{item.value}}</div>
            <div class="data-b" v-if="item.isout">{{item.isbooking?'有预定':'未预定'}}</div>
          </div>
        </div>
        <div class="calendarc">
          <div class="data title">周二</div>
          <div
            class="data"
            v-for="item,index in calendardata"
            @click="tobooking(item)"
            v-if="item.key=='周二'"
            :class="`${item.iscurrent?'backactive':''} ${item.isbooking?'bookactive':''}`"
          >
            <div class="data-t">{{item.value}}</div>
            <div class="data-b" v-if="item.isout">{{item.isbooking?'有预定':'未预定'}}</div>
          </div>
        </div>
        <div class="calendarc">
          <div class="data title">周三</div>
          <div
            class="data"
            v-for="item,index in calendardata"
            @click="tobooking(item)"
            v-if="item.key=='周三'"
            :class="`${item.iscurrent?'backactive':''} ${item.isbooking?'bookactive':''}`"
          >
            <div class="data-t">{{item.value}}</div>
            <div class="data-b" v-if="item.isout">{{item.isbooking?'有预定':'未预定'}}</div>
          </div>
        </div>
        <div class="calendarc">
          <div class="data title">周四</div>
          <div
            class="data"
            v-for="item,index in calendardata"
            @click="tobooking(item)"
            v-if="item.key=='周四'"
            :class="`${item.iscurrent?'backactive':''} ${item.isbooking?'bookactive':''}`"
          >
            <div class="data-t">{{item.value}}</div>
            <div class="data-b" v-if="item.isout">{{item.isbooking?'有预定':'未预定'}}</div>
          </div>
        </div>
        <div class="calendarc">
          <div class="data title">周五</div>
          <div
            class="data"
            v-for="item,index in calendardata"
            @click="tobooking(item)"
            v-if="item.key=='周五'"
            :class="`${item.iscurrent?'backactive':''} ${item.isbooking?'bookactive':''}`"
          >
            <div class="data-t">{{item.value}}</div>
            <div class="data-b" v-if="item.isout">{{item.isbooking?'有预定':'未预定'}}</div>
          </div>
        </div>
        <div class="calendarc">
          <div class="data title">周六</div>
          <div
            class="data"
            v-for="item,index in calendardata"
            @click="tobooking(item)"
            v-if="item.key=='周六'"
            :class="`${item.iscurrent?'backactive':''} ${item.isbooking?'bookactive':''}`"
          >
            <div class="data-t">{{item.value}}</div>
            <div class="data-b" v-if="item.isout">{{item.isbooking?'有预定':'未预定'}}</div>
          </div>
        </div>
        <div class="calendarc">
          <div class="data title">周日</div>
          <div
            class="data"
            v-for="item,index in calendardata"
            @click="tobooking(item)"
            v-if="item.key=='周日'"
            :class="`${item.iscurrent?'backactive':''} ${item.isbooking?'bookactive':''}`"
          >
            <div class="data-t">{{item.value}}</div>
            <div class="data-b" v-if="item.isout">{{item.isbooking?'有预定':'未预定'}}</div>
          </div>
        </div>
      </div>
      <div class="calendar-b">
        <div class="calendar-bt">
          <div class="data-l">当前日期</div>
          <div class="data-r">已有预定</div>
        </div>
        <div class="info">请点击未预定日期，完成会议室预定提交</div>
      </div>
    </div>
    <div class="box" @click.self="closebox" v-if="isselect">
      <div class="selectbox">
        <div class="title">会议室选择</div>
        <div
          class="data"
          :class="roomindex==index?'active':''"
          v-for="item,index in roomdata"
          @click="selectindex(item.value,index)"
        >{{item.value}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "meetingbook",
  components: {},
  data() {
    return {
      roomnum: "9S-908",
      roomindex: 0,
      isselect: false,
      roomdata: [
        { key: "1", isselect: false, value: "9S-906" },
        { key: "2", isselect: false, value: "9S-907" },
        { key: "3", isselect: false, value: "9S-908" }
      ],
      calendardata: [
        {
          key: "周一",
          value: "01",
          isbooking: false,
          iscurrent: false,
          isout: false
        },
        {
          key: "周一",
          value: "08",
          isbooking: true,
          iscurrent: false,
          isout: true
        },
        {
          key: "周一",
          value: "15",
          isbooking: false,
          iscurrent: false,
          isout: true
        },
        {
          key: "周一",
          value: "23",
          isbooking: false,
          iscurrent: false,
          isout: true
        },
        {
          key: "周二",
          value: "02",
          isbooking: false,
          iscurrent: false,
          isout: false
        },
        {
          key: "周二",
          value: "09",
          isbooking: false,
          iscurrent: false,
          isout: true
        },
        {
          key: "周二",
          value: "16",
          isbooking: false,
          iscurrent: false,
          isout: true
        },
        {
          key: "周二",
          value: "24",
          isbooking: false,
          iscurrent: false,
          isout: true
        },
        {
          key: "周三",
          value: "03",
          isbooking: true,
          iscurrent: true,
          isout: true
        },
        {
          key: "周三",
          value: "10",
          isbooking: true,
          iscurrent: false,
          isout: true
        },
        {
          key: "周三",
          value: "17",
          isbooking: false,
          iscurrent: false,
          isout: true
        },
        {
          key: "周三",
          value: "25",
          isbooking: false,
          iscurrent: false,
          isout: true
        },
        {
          key: "周四",
          value: "04",
          isbooking: true,
          iscurrent: false,
          isout: true
        },
        {
          key: "周四",
          value: "11",
          isbooking: false,
          iscurrent: false,
          isout: true
        },
        {
          key: "周四",
          value: "18",
          isbooking: false,
          iscurrent: false,
          isout: true
        },
        {
          key: "周四",
          value: "26",
          isbooking: false,
          iscurrent: false,
          isout: true
        },
        {
          key: "周五",
          value: "05",
          isbooking: true,
          iscurrent: false,
          isout: true
        },
        {
          key: "周五",
          value: "12",
          isbooking: false,
          iscurrent: false,
          isout: true
        },
        {
          key: "周五",
          value: "19",
          isbooking: false,
          iscurrent: false,
          isout: true
        },
        {
          key: "周五",
          value: "27",
          isbooking: false,
          iscurrent: false,
          isout: true
        },
        {
          key: "周六",
          value: "06",
          isbooking: false,
          iscurrent: false,
          isout: true
        },
        {
          key: "周六",
          value: "13",
          isbooking: false,
          iscurrent: false,
          isout: true
        },
        {
          key: "周六",
          value: "21",
          isbooking: false,
          iscurrent: false,
          isout: true
        },
        {
          key: "周六",
          value: "28",
          isbooking: false,
          iscurrent: false,
          isout: true
        },
        {
          key: "周日",
          value: "07",
          isbooking: false,
          iscurrent: false,
          isout: true
        },
        {
          key: "周日",
          value: "14",
          isbooking: false,
          iscurrent: false,
          isout: true
        },
        {
          key: "周日",
          value: "22",
          isbooking: false,
          iscurrent: false,
          isout: true
        },
        {
          key: "周日",
          value: "29",
          isbooking: false,
          iscurrent: false,
          isout: true
        }
      ]
    };
  },
  methods: {
    tomy() {
      this.$router.push("/mybooking");
    },
    tobooking(item) {
      if (!item.isbooking) {
        this.$router.push("/booksubmit");
      } else {
        alert("请选择未预定的预定");
      }
    },
    selectindex(item, index) {
      this.roomindex = index;
      this.roomnum = item;
      this.isselect = false;
    },
    selectroom() {
      this.isselect = true;
    },
    closebox() {
      this.isselect = false;
    }
  },
  mounted() {}
};
</script>
