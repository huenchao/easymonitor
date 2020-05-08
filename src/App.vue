<template>
  <div id="app" ref="elTabs">
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
                active-text="4"
                inactive-text="24h"
                inactive-color="#13ce66"
                active-color="rgba(0,0,0,0.1)"
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
                style="width: 100%;height:280px;padding-bottom:10px"
              ></div>
              <div class="line-4-echarts"></div>
              <div id="sysinfo-part3-echarts-bottom">
                {{ formatterday(sysinfoViewBottom) }}
              </div>
            </div>
          </div>
        </ElTabPane>
        <ElTabPane label="应用信息" name="appinfo">
          <div id="appinfo-part1">
            <div id="appinfo-part1-selecttip"></div>
            <ElSelect
              v-model="appinfoValue"
              size="medium"
              @change="changeIpHandle4appinfo"
            >
              <ElOption
                v-for="item in appinfoIpLists"
                :key="`${item}${Math.random()}`"
                :label="item"
                :value="item"
              >
              </ElOption>
            </ElSelect>
          </div>
          <div id="appinfo-part2">
            <el-table :data="appInfo" style="width: 100%">
              <el-table-column prop="app_name" label="程序" fixed="left">
              </el-table-column>
              <el-table-column label="健康状况" fixed="right">
                <template slot-scope="scope">
                  <span
                    :class="[
                      appInfo[scope.$index].error_flag
                        ? 'app_err'
                        : 'app_healthy'
                    ]"
                    style="font-size:15px; text-align: center;"
                    >{{ appInfo[scope.$index].error_flag ? "异常" : "健康" }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </ElTabPane>
        <ElTabPane label="异常信息" name="exptinfo">
          <div class="content" id="exptinfo-tabs">
            <div
              ref="myTabs"
              :class="{ fixed: isFixed }"
              id="placeholder-header"
            >
              <nav id="exptinfo-tabs-container">
                <div
                  :class="[
                    errinfoTabIndex === 1 ? 'active' : '',
                    'errinfo-btn'
                  ]"
                  data-index="1"
                  ref="errinfo-btn-1"
                  @click="changeChartsInErr"
                >
                  CPU使用率
                </div>
                <div
                  :class="[
                    errinfoTabIndex === 2 ? 'active' : '',
                    'errinfo-btn'
                  ]"
                  data-index="2"
                  ref="errinfo-btn-2"
                  @click="changeChartsInErr"
                >
                  磁盘使用率
                </div>
                <div
                  :class="[
                    errinfoTabIndex === 3 ? 'active' : '',
                    'errinfo-btn'
                  ]"
                  data-index="3"
                  ref="errinfo-btn-3"
                  @click="changeChartsInErr"
                >
                  SWAP信息
                </div>
                <div
                  :class="[
                    errinfoTabIndex === 4 ? 'active' : '',
                    'errinfo-btn'
                  ]"
                  data-index="4"
                  ref="errinfo-btn-4"
                  @click="changeChartsInErr"
                >
                  程序异常信息
                </div>
              </nav>
            </div>
          </div>
          <div id="exptinfo-view-container">
            <div ref="exptinfo-view-1" class="exptinfo-floor exptinfo-view-cpu">
              <el-tag>CPU使用率</el-tag>
              <div
                v-for="(item, index) in errinfoCPUInfoTexts"
                :key="item.ip"
                style="width:100%;position:relative"
              >
                <div class="exptinfo-show-ip">IP: {{ item.ip }}</div>
                <div
                  class="syserror-part3-echarts-title"
                  style="z-index: 99999"
                >
                  <span class="syserror-part3-echarts-title-g">
                    {{ errinfoCPUInfoTexts[index].cpuRate }}</span
                  ><span>%</span>
                </div>
                <div
                  :id="item.ip"
                  style="width: 100%;height:280px;box-sizing: border-box;padding-bottom:20px"
                ></div>
                <div class="line-4-echarts"></div>
                <div
                  class="syserror-part3-echarts-bottom"
                  style="z-index: 99999"
                >
                  {{ formatterday(errinfoCPUInfoTexts[index].updateTime) }}
                </div>
              </div>
              <div class="nomalgap"></div>
            </div>

            <div
              ref="exptinfo-view-2"
              class="exptinfo-floor exptinfo-view-disk"
            >
              <el-tag>磁盘使用率</el-tag>
              <div
                v-for="(item, index) in errinfoDISKInfoTexts"
                :key="item.ip"
                style="width:100%;position:relative"
              >
                <div class="exptinfo-show-ip">IP: {{ item.ip }}</div>
                <el-table :data="errinfoDISKInfos[index]" style="width: 100%">
                  <el-table-column prop="update_time"> </el-table-column>
                  <el-table-column prop="file_name"> </el-table-column>
                  <el-table-column prop="disk_rate"></el-table-column>
                </el-table>
              </div>
              <div class="nomalgap"></div>
            </div>
            <div
              ref="exptinfo-view-3"
              class="exptinfo-floor exptinfo-view-swap"
            >
              <el-tag>SWAP信息</el-tag>
              <div
                v-for="(item, index) in errinfoSwapInfoTexts"
                :key="item.ip"
                style="width:100%;position:relative"
              >
                <div class="exptinfo-show-ip">IP: {{ item.ip }}</div>
                <el-table :data="errinfoSwapInfos[index]" style="width: 100%">
                  <el-table-column prop="update_time"> </el-table-column>
                  <el-table-column>
                    <template slot-scope="scope">
                      <span
                        class="cell-in-swap_in"
                        style="font-size:15px; text-align: left;"
                        >{{ errinfoSwapInfos[index][scope.$index].swap_in }} /
                      </span>

                      <span
                        class="cell-in-swap_out"
                        style="font-size:15px; text-align: right; color:#F78915;"
                        >{{ errinfoSwapInfos[index][scope.$index].swap_out }}
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="nomalgap"></div>
            </div>
            <div ref="exptinfo-view-4" class="exptinfo-floor exptinfo-view-app">
              <el-tag>程序异常信息</el-tag>
              <div
                v-for="(item, index) in errinfoappInfoTexts"
                :key="item.ip"
                style="width:100%;position:relative"
              >
                <div class="exptinfo-show-ip">IP: {{ item.ip }}</div>
                <div class="exptinfo-show-error">异常</div>
                <el-table :data="errinfoappInfos[index]" style="width: 100%">
                  <el-table-column prop="app_name"> </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </ElTabPane>
      </ElTabs>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { tween } from "shifty";

export default {
  watch: {
    scrollTop() {
      if (this.anchorChange) {
        // 切换按钮会滚动视图，$nextTick 之后按钮值改变了，但滚动可能还没有结束，所以需要打个标记。
        this.isScroll = true;
      }
    }
  },
  data() {
    return {
      appinfoIpLists: [],
      appinfoValue: "",
      sysinfoValue: "",
      sysinfoIpLists: [],
      activeName: "sysinfo",
      sysinfoDiskInfo: [],
      appInfo: [],
      sysinfoCPUInfo: [],
      sysinfoSwapInfo: {
        data1: [],
        data2: [],
        x: []
      },
      sysinfoSwapInfoLv: 0,
      sysinfoSwapInfoRv: 0,
      sysinfoSwitch: false,
      sysinfoViewTop: "",
      sysinfoViewBottom: "",
      sysinfoTabIndex: 1,
      errinfoTabIndex: 1,
      errinfoCPUInfos: [],
      errinfoCPUInfoTexts: [],
      errinfoDISKInfos: [],
      errinfoDISKInfoTexts: [],
      errinfoSwapInfos: [],
      errinfoSwapInfoTexts: [],
      errinfoappInfos: [],
      errinfoappInfoTexts: [],
      isFixed: false,
      fixedHeight: 60,
      scrollTop: 0,
      anchorChange: false,
      isScroll: true
    };
  },
  methods: {
    changeIpHandle4appinfo(e) {
      this.appinfoValue = e;
      const data = {
        ip: this.appinfoValue
      };
      this.queryAppWithParams(data);
    },
    //获取当前元素的offsetTop
    getOffsetTop(obj) {
      let offsetTop = 0;
      while (obj != window.document.body && obj != null) {
        offsetTop += obj.offsetTop;
        obj = obj.offsetParent;
      }
      return offsetTop;
    },

    formatterday(time, o) {
      const oo = o ? o : "HH:mm";
      return dayjs(time).format(oo);
    },
    handleRouter(tab) {
      const index = tab.index;
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
          this.queryAppWithNoParams();
        } else if (index == 2) {
          this.tabsHeight = this.$refs.myTabs.offsetHeight;
          this.queryErrorInfo();
        }
      });
    },
    drawChart(option, id, seriesIndexs, dataIndex) {
      // 基于准备好的dom，初始化echarts实例;
      const myChart = this.$echarts.init(document.getElementById(id));
      myChart.setOption(option, true);
      console.log(`id, seriesIndexs, dataIndex`, id, seriesIndexs, dataIndex);
      setTimeout(() => {
        for (let i = 0; i < seriesIndexs; i++) {
          myChart.dispatchAction({
            type: "showTip",
            seriesIndex: i,
            dataIndex
          });
        }
      });
    },
    modifyChartsOptions4sys(index) {
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
            axisPointer: {
              type: "none"
            },
            trigger: "axis",
            formatter: info => {
              const data = info[0].data;
              this.sysinfoViewTop = (+data[1] * 100).toFixed(0);
              console.log(`data[0]data[0]data[0]`,data[0])
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
              symbol: "emptyCircle",
              type: "line",
              smooth: true,
              showSymbol: false,
              symbolSize: 8,
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
            axisPointer: {
              type: "none"
            },
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
              symbol: "emptyCircle",
              type: "line",
              smooth: true,
              showSymbol: false,
              symbolSize: 8,
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
              formatter: name => {
                return name.substring(5, 10);
              },
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
              axisPointer: {
                type: "none"
              },
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
                symbol: "emptyCircle",
                type: "line",
                smooth: true,
                showSymbol: false,
                symbolSize: 8,
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
                symbol: "emptyCircle",
                type: "line",
                smooth: true,
                showSymbol: false,
                symbolSize: 8,
                name: "swap_out",
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
    modifyChartsOptions4err(index) {
      let option = {};
      option = {
        animation: false,
        xAxis: {
          type: "time",
          show: false
        },
        yAxis: {
          type: "value",
          show: false
        },
        grid: {
          top: 100,
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
            data: this.errinfoCPUInfos[index]
          }
        ]
      };

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
      const option = this.modifyChartsOptions4sys(+this.sysinfoTabIndex);
      const serin = +this.sysinfoTabIndex === 3 ? 2 : 1;
      const len =
        +this.sysinfoTabIndex === 3
          ? this.sysinfoSwapInfo.data1.length - 1
          : +this.sysinfoTabIndex === 2
          ? this.sysinfoThreadInfo.length - 1
          : this.sysinfoCPUInfo.length - 1;
      this.drawChart(option, "sysinfo-part3-echarts", serin, len);
    },
    changeChartsInErr(e) {
      this.isScroll = false;
      this.anchorChange = false;
      // 滚动高度等于元素距离可视区头部高度减去元素自身高度与元素上边框高度以及滚动区距离可视区头部的高度。
      const rootScrollElementScrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const offsetTop = this.getOffsetTop(
        this.$refs[`exptinfo-view-${e.target.dataset.index}`]
      );

      tween({
        from: { x: rootScrollElementScrollTop },
        to: { x: offsetTop - this.fixedHeight },
        duration: 500,
        easing: "easeOutQuint",
        step: ({ x }) => {
          document.documentElement.scrollTop = x;
        }
      }).then(() => {
        document.documentElement.scrollTop = offsetTop - this.fixedHeight;
        this.errinfoTabIndex = +e.target.dataset.index;
        this.anchorChange = true;
      });
    },
    //模拟系统信息数据
    mock4sys(withP) {
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
      if (!withP) {
        this.sysinfoValue = this.sysinfoIpLists[0];
      }

      const option = this.modifyChartsOptions4sys(1);
      this.drawChart(
        option,
        "sysinfo-part3-echarts",
        1,
        this.sysinfoCPUInfo.length - 1
      );
    },
    mock4app(withP) {
      this.appinfoIpLists = this.__noparamsofapp__.data.ip_list;
      if (!withP) {
        this.appinfoValue = this.appinfoIpLists[0];
      }
      this.appInfo = this.__noparamsofapp__.data.app_info.app_info;
    },
    mock4err() {
      const tmpc = this.__errorInfo__.data.error_info.cpu_info;
      const tmpd = this.__errorInfo__.data.error_info.disk_info;
      const tmps = this.__errorInfo__.data.error_info.swap_info;
      const tmpa = this.__errorInfo__.data.error_info.app_info;
      const tmpcShowTextCpu = [];
      const tmpcShowLineDataCpu = [];
      const tmpcShowTextDisk = [];
      const tmpcShowLineDataDisk = [];
      const tmpsShowTextSWAP = [];
      const tmpsShowLineDataSWAP = [];
      const tmpsShowTextapp = [];
      const tmpsShowLineDataapp = [];

      for (let i = 0; i < tmpc.length; i++) {
        const tmpArr = [];
        let tmps = {};
        let shouldSet = false;
        const ip = Object.keys(tmpc[i])[0];
        for (let j = 0; j < tmpc[i][ip].length; j++) {
          if (tmpc[i][ip][j].cpu_rate >= 0.8) {
            shouldSet = true;
            tmps = {
              ip,
              cpuRate: tmpc[i][ip][j].cpu_rate,
              updateTime: tmpc[i][ip][j].update_time
            };
          }
          tmpArr.push([tmpc[i][ip][j].update_time, tmpc[i][ip][j].cpu_rate]);
        }
        if (shouldSet) {
          tmpcShowLineDataCpu.push(tmpArr);
          tmpcShowTextCpu.push(tmps);
        }
      }
      this.errinfoCPUInfos = tmpcShowLineDataCpu;
      this.errinfoCPUInfoTexts = tmpcShowTextCpu;
      for (let j = 0; j < this.errinfoCPUInfoTexts.length; j++) {
        const option = this.modifyChartsOptions4err(j);
        setTimeout(() => {
          this.drawChart(option, this.errinfoCPUInfoTexts[j].ip);
        }, 300);
      }
      const keys = Object.keys(tmpd);
      for (let i = 0; i < keys.length; i++) {
        let tmps = {};
        const ip = keys[i];
        const _tmp = tmpd[ip].map(item => {
          return {
            ...item,
            // eslint-disable-next-line
            update_time: this.formatterday(item.update_time,"HH:mm:ss"),
            // eslint-disable-next-line
            disk_rate: (+item.disk_rate * 100).toFixed(0) + '%'
          };
        });
        tmps = {
          ip
        };
        tmpcShowTextDisk.push(tmps);
        tmpcShowLineDataDisk.push(_tmp);
      }
      this.errinfoDISKInfos = tmpcShowLineDataDisk;
      this.errinfoDISKInfoTexts = tmpcShowTextDisk;
      const keys4tmps = Object.keys(tmps);
      for (let i = 0; i < keys4tmps.length; i++) {
        let _tmps = {};
        const ip = keys4tmps[i];
        const data = tmps[ip].map(item => {
          return {
            ...item,
            // eslint-disable-next-line
            update_time: this.formatterday(item.update_time,"HH:mm:ss"),
            // eslint-disable-next-line
           inout:{
              in: item.swap_in,
              out: item.swap_out
            }
          };
        });
        _tmps = {
          ip
        };
        tmpsShowTextSWAP.push(_tmps);
        tmpsShowLineDataSWAP.push(data);
      }
      this.errinfoSwapInfos = tmpsShowLineDataSWAP;
      this.errinfoSwapInfoTexts = tmpsShowTextSWAP;

      const keys4tmpa = Object.keys(tmpa);
      for (let i = 0; i < keys4tmpa.length; i++) {
        let _tmps = {};
        const ip = keys4tmpa[i];
        const data = tmpa[ip];
        _tmps = {
          ip
        };
        tmpsShowTextapp.push(_tmps);
        tmpsShowLineDataapp.push(data);
      }
      this.errinfoappInfos = tmpsShowLineDataapp;
      this.errinfoappInfoTexts = tmpsShowTextapp;
    },
    //查询系统信息(不带参数)
    query24hWithNoParams() {
      if (process.env.NODE_ENV !== "local") {
        this.$axios({
          method: "get",
          url: "http://192.168.80.130:5001/mobile/server_manage/" // 接口地址
        })
          .then(response => {
            this.__noparamsof24h__ = response;
            this.mock4sys();
          })
          .catch(error => {
            console.log(error);
            this.mock4sys();
          });
        // 失败的返回
      } else {
        this.mock4sys();
      }
    },
    //查询系统信息(带参数)
    query24hWithParams(data) {
      if (process.env.NODE_ENV !== "local") {
        this.$axios({
          method: "post",
          url: "http://192.168.80.130:5001/mobile/server_manage/", // 接口地址
          data
        })
          .then(response => {
            console.log(response, "success"); // 成功的返回
            this.__noparamsof24h__ = response;
            this.mock4sys(true);
          })
          .catch(error => {
            console.log(error);
            this.mock4sys(true);
          });
      } else {
        this.mock4sys(true);
      }
    },
    queryAppWithNoParams() {
      if (process.env.NODE_ENV !== "local") {
        this.$axios({
          method: "get",
          url: "http://192.168.80.130:5001/mobile/server_manage/" // 接口地址
        })
          .then(response => {
            this.__noparamsofapp__ = response;
            this.mock4app();
          })
          .catch(error => {
            console.log(error);
            this.mock4app();
          });
        // 失败的返回
      } else {
        this.mock4app();
      }
    },
    queryAppWithParams(data) {
      if (process.env.NODE_ENV !== "local") {
        this.$axios({
          method: "post",
          url: "http://192.168.80.130:5001/mobile/server_manage/", // 接口地址
          data
        })
          .then(response => {
            console.log(response, "success"); // 成功的返回
            this.__noparamsofapp__ = response;
            this.mock4app(true);
          })
          .catch(error => {
            console.log(error);
            this.mock4app(true);
          });
      } else {
        this.mock4app(true);
      }
    },
    //查询异常信息的接口
    queryErrorInfo() {
      if (process.env.NODE_ENV !== "local") {
        this.$axios({
          method: "get",
          url: "http://192.168.80.130:5001/mobile/error_info/" // 接口地址
        })
          .then(response => {
            this.__errorInfo__ = response;
            this.mock4err();
          })
          .catch(error => {
            console.log(error);
            this.mock4err();
          });
        // 失败的返回
      } else {
        this.mock4err();
      }
    },
    switchQueryInfo() {
      const data = {
        ip: this.sysinfoValue,
        // eslint-disable-next-line
        time_flag: this.sysinfoSwitch ? 15 : 1
      };
      this.query24hWithParams(data);
    },
    changeIpHandle(e) {
      this.sysinfoValue = e;
      console.log(e);
      const data = {
        ip: e,
        // eslint-disable-next-line
        time_flag: ''
      };
      this.query24hWithParams(data);
    },

    handleScroll() {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      this.scrollTop = scrollTop;
      if (!this.isScroll) return;
      let offsetTop = this.getOffsetTop(this.$refs.myTabs);
      this.isFixed = scrollTop > offsetTop;

      /**
       * scrollTop 页面的滚动条的高度
       * offsetTop 当前选中的tab元素的offsetTop
       * offsetHeight 当前选中元素的高度
       */
      offsetTop = this.getOffsetTop(
        this.$refs[`errinfo-btn-${this.errinfoTabIndex}`]
      );

      const scrollList = [];
      [1, 2, 3, 4].forEach(item => {
        const element = this.$refs[`exptinfo-view-${item}`];
        if (element) {
          const top = element.offsetTop;
          scrollList.push({
            top: top + element.clientTop - this.fixedHeight,
            bottom: top + element.offsetHeight - this.fixedHeight
          });
        }
      });
      // 遍历按钮元素的 top 和 bottom，查看当前滚动在那个元素的区间内。
      scrollList.some((it, index) => {
        if (index && scrollTop >= it.top && scrollTop < it.bottom) {
          this.errinfoTabIndex = index + 1;
        } else {
          // 当小于最小高度时，就等于最小高度
          if (scrollTop >= 0 && scrollTop < scrollList[1].top) {
            this.errinfoTabIndex = 1;
          }
        }
      });
    }
  },
  created() {
    document.title = "生产监控";
  },
  mounted() {
    document.title = "生产监控";
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
<style lang="less" src="./assets/app.less"></style>
