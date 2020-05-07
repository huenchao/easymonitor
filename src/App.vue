<template>
  <div id="app">
    <div id="nav">
      <ElTabs v-model="activeName" @tab-click="handleRouter">
        <ElTabPane label="系统信息" name="sysinfo">
          <div id="sysinfo-part1">
            <div id="sysinfo-part1-selecttip"></div>
            <ElSelect
              v-model="sysinfoValue"
              size="medium"
              @change="changeIpHandle"
            >
              <ElOption
                v-for="item in sysinfoIpLists"
                :key="`${item}${Math.random()}`"
                :label="item"
                :value="item"
              >
              </ElOption>
            </ElSelect>
          </div>
          <div id="sysinfo-part2">
            <el-tag>磁盘使用率</el-tag>
            <el-table :data="sysinfoDiskInfo" style="width: 100%">
              <el-table-column prop="file_name" label="文件" fixed="left">
              </el-table-column>
              <el-table-column
                prop="disk_rate"
                label="使用率"
                fixed="right"
              ></el-table-column>
            </el-table>
          </div>
          <div class="nomalgap"></div>
          <div id="sysinfo-part3">
            <div id="sysinfo-part3-switch">
              <el-switch
                v-model="sysinfoSwitch"
                active-text="4h"
                inactive-text="24h"
                active-color="#54BB91"
                @change="switchQueryInfo"
              >
              </el-switch>
            </div>
            <div id="sysinfo-part3-tabs">
              <div
                class="sysinfo-btn active"
                data-index="1"
                @click="changeChartsInSys"
              >
                CPU使用率
              </div>
              <div
                class="sysinfo-btn"
                data-index="2"
                @click="changeChartsInSys"
              >
                服务器线程数
              </div>
              <div
                class="sysinfo-btn"
                data-index="3"
                @click="changeChartsInSys"
              >
                SWAP信息
              </div>
            </div>
            <div id="sysinfo-view">
              <div id="sysinfo-part3-echarts-title">
                <span
                  v-if="sysinfoTabIndex === 1 || sysinfoTabIndex === 2"
                  id="sysinfo-part3-echarts-title-g"
                >
                  {{ sysinfoViewTop }}</span
                ><span v-if="sysinfoTabIndex === 1">%</span>
                <span
                  v-if="sysinfoTabIndex === 3"
                  id="sysinfo-part3-echarts-title-r-g"
                >
                  <span class="sysinfoSwapInfoLv">{{ sysinfoSwapInfoLv }}</span>
                  <span class="sysinfoSwapInfoLvGap">/</span>
                  <span class="sysinfoSwapInfoRv">{{ sysinfoSwapInfoRv }}</span>
                </span>
              </div>
              <div
                id="sysinfo-part3-echarts"
                style="width: 100%;height:340px;"
              ></div>
              <div id="sysinfo-part3-echarts-bottom">
                {{ sysinfoViewBottom }}
              </div>
            </div>
          </div>
        </ElTabPane>
        <ElTabPane label="应用信息" name="appinfo">系统信息组件2</ElTabPane>
        <ElTabPane label="异常信息" name="exptinfo">
          <div class="content" id="exptinfo-tabs">
            <div class="placeholder-header"></div>
            <nav class="nav-fixed" id="navFixed">
              <div
                class="sysinfo-btn active"
                data-index="1"
                @click="changeChartsInSys"
              >
                CPU使用率
              </div>
              <div
                class="sysinfo-btn"
                data-index="2"
                @click="changeChartsInSys"
              >
                服务器线程数
              </div>
              <div
                class="sysinfo-btn"
                data-index="3"
                @click="changeChartsInSys"
              >
                SWAP信息
              </div>
              <div
                class="sysinfo-btn"
                data-index="4"
                @click="changeChartsInSys"
              >
                程序异常信息
              </div>
            </nav>
          </div>
          <div id="exptinfo-view-container">
            <div id="exptinfo-part2">
              <el-tag>磁盘使用率</el-tag>
            </div>
          </div>
        </ElTabPane>
      </ElTabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sysinfoValue: "",
      sysinfoIpLists: [],
      activeName: "sysinfo",
      sysinfoDiskInfo: [],
      sysinfoCPUInfo: [],
      sysinfoSwapInfo: {
        data1: [],
        data2: [],
        x: []
      },
      sysinfoSwapInfoLv: 0,
      sysinfoSwapInfoRv: 0,
      sysinfoSwitch: true,
      sysinfoViewTop: "",
      sysinfoViewBottom: "",
      sysinfoTabIndex: 1
    };
  },
  methods: {
    handleRouter(tab) {
      const index = tab.index;
      console.log("index===>", index);
      setTimeout(() => {
        const sysinfo = document.querySelector("#tab-sysinfo");
        const appinfo = document.querySelector("#tab-appinfo");
        const exptinfo = document.querySelector("#tab-exptinfo");
        const offset = [
          sysinfo.offsetLeft,
          appinfo.offsetLeft,
          exptinfo.offsetLeft
        ];
        const bar = document.querySelector(".el-tabs__active-bar.is-top");
        bar.style.transform = `translateX(${offset[index]}px)`;
        if (index == 0) {
          this.query24hWithNoParams();
        } else if (index == 1) {
          //
        } else if (index == 2) {
          //
        }
      });
    },
    drawChart(option) {
      // 基于准备好的dom，初始化echarts实例;
      const myChart = this.$echarts.init(
        document.getElementById("sysinfo-part3-echarts")
      );
      myChart.setOption(option, true);
    },
    modifyChartsOptions(index) {
      let option = {};
      if (index === 1) {
        const showDate = this.sysinfoCPUInfo[this.sysinfoCPUInfo.length - 1];
        this.sysinfoViewTop = (+showDate[1] * 100).toFixed(0);
        this.sysinfoViewBottom = showDate[0];
        option = {
          animation: false,
          tooltip: {
            triggerOn: "click",
            show: true,
            trigger: "axis",
            formatter: info => {
              const data = info[0].data;
              this.sysinfoViewTop = (+data[1] * 100).toFixed(0);
              this.sysinfoViewBottom = data[0];
            }
          },
          xAxis: {
            type: "time",
            show: false
          },
          yAxis: {
            type: "value",
            show: false
          },
          grid: {
            top: 110,
            left: 15,
            right: 15,
            height: 160
          },
          series: [
            {
              type: "line",
              smooth: true,
              symbol: "circle",
              symbolSize: 5,
              sampling: "average",
              itemStyle: {
                color: "#8ec6ad"
              },
              stack: "a",
              areaStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#8ec6ad"
                  },
                  {
                    offset: 1,
                    color: "#ffe"
                  }
                ])
              },
              data: this.sysinfoCPUInfo
            }
          ]
        };
      } else if (index === 2) {
        const showDate = this.sysinfoThreadInfo[
          this.sysinfoThreadInfo.length - 1
        ];
        this.sysinfoViewTop = (+showDate[1] * 100).toFixed(0);
        this.sysinfoViewBottom = showDate[0];
        option = {
          animation: false,
          tooltip: {
            triggerOn: "click",
            show: true,
            trigger: "axis",
            formatter: info => {
              const data = info[0].data;
              this.sysinfoViewTop = (+data[1] * 100).toFixed(0);
              this.sysinfoViewBottom = data[0];
            }
          },
          xAxis: {
            type: "time",
            show: false
          },
          yAxis: {
            type: "value",
            show: false
          },
          grid: {
            top: 110,
            left: 15,
            right: 15,
            height: 160
          },
          series: [
            {
              type: "line",
              smooth: true,
              symbol: "circle",
              symbolSize: 5,
              sampling: "average",
              itemStyle: {
                color: "#8ec6ad"
              },
              stack: "a",
              areaStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#8ec6ad"
                  },
                  {
                    offset: 1,
                    color: "#ffe"
                  }
                ])
              },
              data: this.sysinfoThreadInfo
            }
          ]
        };
      } else if (index === 3) {
        (this.sysinfoSwapInfoLv = this.sysinfoSwapInfo.data1[
          this.sysinfoSwapInfo.data1.length - 1
        ]),
          (this.sysinfoSwapInfoRv = this.sysinfoSwapInfo.data2[
            this.sysinfoSwapInfo.data2.length - 1
          ]),
          (option = {
            legend: {
              left: "right",
              top: "10%",
              data: [
                {
                  name: "swap_in",
                  icon:
                    "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAcCAYAAAA0u3w+AAAAAXNSR0IArs4c6QAAAVdJREFUWAljYBgFoyEwGgKjITAaAqMhMBoCwzYEGOnhs4g9k2z/MjCU/v//3wRkHyMj4xlmBobuFS55h2ltP809GLZnUtU/BoYWhv//UewCcv4BPVq7yiWvjZaeRLGU2haF7Z1i9+//vwMsjEwMEcoWjPaSmmArDj6/zrDi7on/f//9/c/MyOhAy5hkorankM37//9fCSjmQJ7zlzdmEGDjAmMQGyT2n4GBCZR0kfVQm40RgyG7JwLtpS6YbZcC9hiyqR9+fWNIPTQHWYgq7DWu+Sh+omkMUsXFFBrCgq4fPQTQ5Unhh+6ZtAlYcvqC8hwoWSIDkBgIAAuazatd8vyQ5ajJxvAgNQ0HVQXAPOYNLFBAyQajkAEK/gepoaad6GahpFd0SWrwQ/dOrGb4x9AEKlCQzQNaPPSrCZiHBrKih7lhlB4NgdEQGA2B0RAYDYHREBiGIQAAi8Nn3ptAThAAAAAASUVORK5CYII="
                },
                {
                  name: "swap_out",
                  icon:
                    "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAcCAYAAAA0u3w+AAAAAXNSR0IArs4c6QAAARpJREFUWAntlT8OAUEUxr9ZdC7AHXQaBdneHZxBQciyjUUkGmdwBL1EIlHp3IEL6GT3eeNPZHfaGYL3mt19s3nfvN/MNwNICAEhIASEgBAQAj9LQL2jM5qijgRd1qo+9PbwMFcBtq71nTdIYwTcxBiErFbCmVANMXXZZFbUqhY31+CCG3gFwI8UKq17/cOSsyEhvhBy8F2uZN5qR2axzm3l/Aio9V6j93eFdV89tq6zrWqsIEU8JdvRPgLFUrrq+QQsyumchS8Vpq3gWaj5vyXYgyu9I2g3IyN0To/xPy4JufUgXwWI0eQDRVvBPGTAdtD/OAzDg7a1aIIBHyQjrpu1w/dfE09Yn7zon3OQpxAQAkJACAgBIfCDBK4csVrlOUrMFQAAAABJRU5ErkJggg=="
                }
              ]
            },
            animation: false,
            tooltip: {
              triggerOn: "click",
              show: true,
              trigger: "axis",
              formatter: info => {
                this.sysinfoSwapInfoLv = info[0].data;
                this.sysinfoSwapInfoRv = info[1].data;
              }
            },
            xAxis: {
              type: "category",
              show: false,
              data: this.sysinfoSwapInfo.x
            },
            yAxis: {
              type: "value",
              show: false
            },
            grid: {
              top: 110,
              left: 15,
              right: 15,
              height: 160
            },
            series: [
              {
                name: "swap_in",
                type: "line",
                data: this.sysinfoSwapInfo.data1,
                itemStyle: {
                  normal: {
                    lineStyle: {
                      color: "#54BB91"
                    }
                  }
                }
              },
              {
                name: "swap_out",
                type: "line",
                data: this.sysinfoSwapInfo.data2,
                itemStyle: {
                  normal: {
                    lineStyle: {
                      color: "#FF7C00"
                    }
                  }
                }
              }
            ]
          });
      }
      return option;
    },
    changeChartsInSys(e) {
      const domlists = document.querySelectorAll(".sysinfo-btn");
      this.sysinfoTabIndex = +e.target.dataset.index;
      for (let i = 0; i < domlists.length; i++) {
        if (domlists[i].classList.contains("active")) {
          domlists[i].classList.remove("active");
        }
      }
      if (!e.target.classList.contains("active")) {
        e.target.classList.add("active");
      }
      const option = this.modifyChartsOptions(+this.sysinfoTabIndex);
      this.drawChart(option);
    },
    mock() {
      this.sysinfoIpLists = this.__noparamsof24h__.data.ip_list;
      this.sysinfoDiskInfo = this.__noparamsof24h__.data.server_info.disk_info.map(
        item => {
          return {
            ...item,
            // eslint-disable-next-line
            disk_rate: (+item.disk_rate * 100).toFixed(0) + '%'
          };
        }
      );
      const tmpcpu = [];
      const tmpthread = [];
      for (
        let i = 0;
        i < this.__noparamsof24h__.data.server_info.cpu_info.length;
        i++
      ) {
        tmpcpu.push([
          this.__noparamsof24h__.data.server_info.cpu_info[i].update_time,
          this.__noparamsof24h__.data.server_info.cpu_info[i].cpu_rate
        ]);
      }

      for (
        let i = 0;
        i < this.__noparamsof24h__.data.server_info.thread_info.length;
        i++
      ) {
        tmpthread.push([
          this.__noparamsof24h__.data.server_info.thread_info[i].update_time,
          this.__noparamsof24h__.data.server_info.thread_info[i].thread_num
        ]);
      }
      const tmpdata1 = [];
      const tmpdata2 = [];
      const tmpx = [];
      for (
        let i = 0;
        i < this.__noparamsof24h__.data.server_info.swap_info.length;
        i++
      ) {
        tmpdata1.push(
          this.__noparamsof24h__.data.server_info.swap_info[i].swap_in
        );
        tmpdata2.push(
          this.__noparamsof24h__.data.server_info.swap_info[i].swap_out
        );
        tmpx.push(
          this.__noparamsof24h__.data.server_info.swap_info[i].update_time
        );
      }
      this.sysinfoSwapInfo.data1 = tmpdata1;
      this.sysinfoSwapInfo.data2 = tmpdata2;
      this.sysinfoSwapInfo.x = tmpx;
      this.sysinfoCPUInfo = tmpcpu;
      this.sysinfoThreadInfo = tmpthread;
      this.sysinfoValue = this.sysinfoIpLists[0];
      const option = this.modifyChartsOptions(1);
      this.drawChart(option);
    },
    query24hWithNoParams() {
      this.$axios({
        method: "get",
        url: "http://192.168.80.130:5001/api/server_manage/" // 接口地址
      })
        .then(response => {
          this.__noparamsof24h__ = response;
          this.mock();
        })
        .catch(error => {
          console.log(error);
          this.mock();
        });
      // 失败的返回
    },
    query24hWithParams(data) {
      this.$axios({
        method: "post",
        url: "http://192.168.80.130:5001/api/server_manage/", // 接口地址
        data
      })
        .then(response => {
          console.log(response, "success"); // 成功的返回
          this.__noparamsof24h__ = response;
          this.mock(response);
        })
        .catch(error => {
          console.log(error);
          this.mock();
        });
    },
    switchQueryInfo() {
      const data = {
        ip: this.sysinfoValue,
        // eslint-disable-next-line
        time_flag: this.sysinfoSwitch ? 15 : 1
      };
      console.log("data", data);
      this.query24hWithParams(data);
    },
    changeIpHandle() {
      const data = {
        ip: this.sysinfoValue,
        // eslint-disable-next-line
        time_flag: ''
      };
      this.query24hWithParams(data);
    },
    queryErrorInfo() {
      //
    },
    handleScroll() {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      console.log(scrollTop);
    }
  },
  mounted() {
    setTimeout(() => {
      const sysinfo = document.querySelector("#tab-sysinfo");
      const offsetLeft = sysinfo.offsetLeft;
      const bar = document.querySelector(".el-tabs__active-bar.is-top");
      bar.style.transform = `translateX(${offsetLeft}px)`;
    });
    window.addEventListener("scroll", this.handleScroll);
    this.query24hWithNoParams();
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  margin: 0 auto;
  .el-tabs__nav.is-top {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    float: none;
  }
  .el-tabs__item.is-top {
    color: #868686;
    font-size: 14px;
  }
  .el-tabs__item.is-top.is-active {
    color: #323232;
    font-size: 16px;
  }
  .el-tabs__active-bar {
    background-color: #54bb91;
    height: 4px;
  }
  #tab-sysinfo,
  #tab-appinfo,
  #tab-exptinfo {
    padding: 0;
  }
}
#pane-sysinfo {
  #sysinfo-part1 {
    display: flex;
    align-items: center;
    margin-bottom: 18px;
    #sysinfo-part1-selecttip {
      width: 1%;
      height: 23px;
      margin-right: 5%;
      background-color: #54bb91;
    }
    .el-select-dropdown__item.selected {
      color: #323232;
    }
    .el-select.el-select--medium {
      width: 88.26%;
      height: 38px;
    }
  }
  #sysinfo-part2 {
    .el-tag.el-tag--light {
      width: 25.86%;
      height: 27px;
      line-height: 27px;
      background-color: #e1fbf0;
      color: #54bb91;
      font-size: 14px;
      border: none;
    }
    th div.cell {
      font-size: 13px;
      color: #868686;
      letter-spacing: 0;
    }
    .el-table th {
      padding: 6px 0;
    }
    th div.cell {
      font-weight: 400;
      font-size: 13px;
      color: #868686;
      letter-spacing: 0;
      padding: 0 0 0 12%;
    }
    th:last-child div.cell {
      display: flex;
      justify-content: flex-end;
      padding: 0 12% 0 0;
    }

    td div.cell {
      font-size: 13px;
      color: #323230;
      letter-spacing: 0;
      padding: 0 0 0 12%;
    }
    td:last-child div.cell {
      font-size: 15px;
      color: #54bb91;
      letter-spacing: 0;
      display: flex;
      justify-content: flex-end;
      padding: 0 12% 0 0;
    }
  }
  .nomalgap {
    background: #ececec;
    width: 100%;
    height: 6px;
  }
  #sysinfo-part3 {
    position: relative;
    #sysinfo-part3-switch {
      margin-top: 6px;
      .el-switch__label {
        font-size: 13px;
        color: #8c99a6;
      }
    }
    #sysinfo-view {
      margin-top: -5px;
    }
    #sysinfo-part3-tabs {
      margin-top: 12px;
      display: flex;
      justify-content: space-around;
      .sysinfo-btn {
        padding: 6px 24px;
        border: 1px solid #54bb91;
        border-radius: 2px;
        border-radius: 2px;
        font-size: 13px;
        color: #868686;
        letter-spacing: 0;
      }
      .sysinfo-btn.active {
        font-size: 13px;
        color: #f3f8fb;
        letter-spacing: 0;
        background: #54bb91;
        border-radius: 2px;
        border-radius: 2px;
      }
    }
    #sysinfo-part3-echarts-title {
      position: absolute;
      left: 50%;
      bottom: 240px;
      transform: translateX(-50%);
      #sysinfo-part3-echarts-title-g {
        font-family: Impact;
        font-size: 21px;
        color: #54bb91;
        font-weight: 600;
      }
    }
    #sysinfo-part3-echarts-bottom {
      position: absolute;
      left: 50%;
      bottom: 40px;
      font-weight: 300;
      font-size: 12px;
      transform: translateX(-50%);
    }
    .sysinfoSwapInfoLv,
    .sysinfoSwapInfoRv,
    .sysinfoSwapInfoLvGap {
      font-size: 21px;
      color: #54bb91;
      font-weight: 600;
      padding: 3px;
    }
    .sysinfoSwapInfoRv {
      color: #ff7c00;
    }
    .sysinfoSwapInfoLvGap {
      color: #868686;
    }
  }
}
#pane-exptinfo {
  #exptinfo-tabs {
    position: fixed;
    background-color: #fff;
    top: 64px; // 44px是导航标题头的高度
    z-index: 999;
    width: 95%;
    #exptinfo-tabs-container {
      display: flex;
      justify-content: space-between;
      .sysinfo-btn {
        padding: 3px;
        text-align: center;
        border: 1px solid #54bb91;
        border-radius: 2px;
        border-radius: 2px;
        font-size: 12px;
        color: #868686;
        letter-spacing: 0;
      }
      .sysinfo-btn.active {
        font-size: 12px;
        color: #f3f8fb;
        letter-spacing: 0;
        background: #54bb91;
        border-radius: 2px;
        border-radius: 2px;
      }
    }
  }
}

#searchBar {
  .isFixed {
    position: fixed;
    background-color: #fff;
    top: 44px; // 44px是导航标题头的高度
    z-index: 999;
  }
}
</style>
