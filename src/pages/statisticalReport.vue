<template>
  <el-container>
    <el-header>
      <top></top>
    </el-header>
    <el-main>
      <div class="so-content">
        <div class="so-return">
          <div class="so-button" @click="returnGo">
            <i class="el-icon-arrow-left"></i>
            返回
          </div>
          <div class="screen">
            <el-select clearable v-model="disease.value" placeholder="请选择">
              <el-option
                v-for="item in disease.list"
                :key="item.id"
                :label="item.val"
                :value="item.id">
              </el-option>
            </el-select>
            <el-date-picker
              v-model="timeArr"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions2"
            ></el-date-picker>
          </div>
        </div>
        <div class="report-main">
          <div class="report-title">
            <img src="./assets/statisticalReport.png" class="title-icon">
            AI辅助筛查统计报告
          </div>
          <div class="report-content">
            <div class="report-nav report-nav-right">
              <div>{{institutionName}}</div>
            </div>
            <div class="report-nav report-nav-between">
              <div>项目名称：{{diseaseName}}</div>
              <div>报告日期：{{nowDate}}</div>
            </div>
            <div class="report-nav report-nav-left">
              <div>
                <img src="./assets/tishi.png" class="tishi-icon">
                平安颖像肺结节智能筛查系统提示：通过对您病区患者的肺结节影像智能筛查，筛查状况见下表，此提示仅供您参考，请进一步诊断确认！
              </div>
            </div>
            <div :class="pieCount>0?'report-des':'report-des pie-hide'">
              <div class="chart-content chart-content-1">
                <columnG2 :charData="serverData" :id="'c1'" id="c1"></columnG2>
              </div>
              <div class="chart-content chart-content-2" v-show="pieCount>0">
                <pieG2 :charData="pieData" :id="'c1'" id="c2"></pieG2>
              </div>
            </div>
            <div class="button-right">
              <el-button type="success" class="button-center" @click="addFeedbackFun">错误反馈</el-button>
            </div>
          </div>
        </div>
      </div>
      <feedback ref="addFeedback" @renewList="getData"></feedback>
    </el-main>
  </el-container>
</template>

<script>
  import G2 from "@antv/g2";
  import columnG2 from "./components/columnG2";
  import pieG2 from "./components/pieG2";
  import top from "./components/top";
  import feedback from './components/feedback'

  export default {
    name: "userInfo",
    components: {columnG2, pieG2, top, feedback},
    data() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
      return {
        pieCount: 0,
        timeArr: [start, end],
        serverData: [],
        pieData: [],
        institutionName: '',
        nowDate: '',
        diseaseName: '',
        parameter: {
          beginDate: '',
          endDate: '',
          diseaseType: '',
          institutionId: '',
        },
        pickerOptions2: {
          shortcuts: [
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 8);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 31);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 91);
                picker.$emit("pick", [start, end]);
              }
            }, {
              text: "最近半年",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 183);
                picker.$emit("pick", [start, end]);
              }
            }
          ],
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e7;
          }
        },
        disease: {value: '', key: null, list: []},
      };
    },
    computed: {
      diseaseValue() {
        return this.disease.value
      },
    },
    watch: {
      diseaseValue(val) {
        console.log(val)
        this.parameter.diseaseType = val
      },
      timeArr() {
        this.getData()
      }
    },
    mounted() {
      this.parameter.institutionId = this.$route.query.institutionId || ''
      this.institutionName = this.$route.query.institutionName || ''
      this.diseaseName = this.$route.query.diseaseName || ''
      let nowDate = new Date()
      this.nowDate = nowDate.getFullYear() + '-' + ((nowDate.getMonth() + 1) < 10 ? '0' + (nowDate.getMonth() + 1) : (nowDate.getMonth() + 1)) + '-' + (nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate())
      this.diseaseType()
      this.serverData = []
    },
    methods: {
      getData() {
        const that = this
        this.parameter.beginDate = this.timeArr[0].getFullYear() + '-' + ((this.timeArr[0].getMonth() + 1) < 10 ? '0' + (this.timeArr[0].getMonth() + 1) : (this.timeArr[0].getMonth() + 1)) + '-' + (this.timeArr[0].getDate() < 10 ? '0' + this.timeArr[0].getDate() : this.timeArr[0].getDate())
        this.parameter.endDate = this.timeArr[1].getFullYear() + '-' + ((this.timeArr[1].getMonth() + 1) < 10 ? '0' + (this.timeArr[1].getMonth() + 1) : (this.timeArr[1].getMonth() + 1)) + '-' + (this.timeArr[1].getDate() < 10 ? '0' + this.timeArr[1].getDate() : this.timeArr[1].getDate())
        this.$post('/api/findDiseaseDetailData', this.parameter)
          .then((response) => {
            if (response.code != '000000') {
              that.$message(response.msg);
              return
            }
            console.log(response.data)
            // this.myData=response.data
            let myArr = []
            let lineArr = []
            let aiSeriesCountMap = response.data.aiSeriesCountMap
            let seriesCountMap = response.data.seriesCountMap
            for (let i in aiSeriesCountMap) {
              let rate = ((aiSeriesCountMap[i] || 0) / (seriesCountMap[i] || 1) * 100)
              rate = (rate % 1 == 0 ? rate : rate.toFixed(2)) + '%'
              myArr.push({
                name: "AI检出序列",
                time: i.replace(/-/g, " "),
                value: aiSeriesCountMap[i], //+ Math.ceil(Math.random() * 10),
                rate
              })
              myArr.push({
                name: "上传序列",
                time: i.replace(/-/g, " "),
                value: seriesCountMap[i],// + Math.ceil(Math.random() * 10),
                rate
              })
              console.log(i)
              console.log(aiSeriesCountMap[i])
              console.log(seriesCountMap[i])
              console.log(rate)
            }
            let probabilityArr = []
            let probabilityMap = response.data.probabilityMap
            let count = 0;
            for (let i in probabilityMap) {
              count += probabilityMap[i] || 0
              switch (i) {
                case 'probability2040Count':
                  probabilityArr.push({
                    type: '较低数量', value: probabilityMap[i] || 0
                  })
                  break;
                case 'probability4060Count':
                  probabilityArr.push({
                    type: '一般数量', value: probabilityMap[i] || 0
                  })
                  break;
                case 'probability6080Count':
                  probabilityArr.push({
                    type: '较高数量', value: probabilityMap[i] || 0
                  })
                  break;
                case 'probabilityLe80Count':
                  probabilityArr.push({
                    type: '极高数量', value: probabilityMap[i] || 0
                  })
                  break;
                case 'probabilityLt20Count':
                  probabilityArr.push({
                    type: '极低数量', value: probabilityMap[i] || 0
                  })
                  break;
              }
            }
            this.pieCount = count
            that.serverData = {datas: myArr, dfs: []}
            that.pieData = probabilityArr
          })
      },
      diseaseType() {
        let parameter = {}
        this.$fetch('/api/diseaseType', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message(response.msg);
              return
            }
            let list = [];
            for (let i in  response.data) {
              list.push({
                id: i,
                val: response.data[i]
              })
            }
            this.disease.list = list
            this.disease.value = list[0].id
            this.disease.key = list[0].id
            this.parameter.diseaseType = list[0].id
            this.getData()
          })
      },
      returnGo() {
        this.$router.go(-1);
      },
      addFeedbackFun() {
        this.$refs.addFeedback.changeDialogTableVisible()
        this.$refs.addFeedback.initParameter(this.parameter)
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "sass/common";

  .el-main {
    box-sizing: border-box;
    padding: 20px;
    background: rgb(246, 246, 246);
    height: 100%;

    .pie-hide {
      justify-content: center;
    }
  }

  .el-header {
    padding: 0;
  }

  .so-content {
    box-sizing: border-box;
    padding: 40px;
    background: #ffffff;
    min-width: 1380px;
    height: 100%;
  }

  .report-content {
    overflow: hidden;
  }

  .button-right {
    margin-top: 24px;
    float: right;

    .button-center {
      font-family: MicrosoftYaHei-Bold;
      font-size: 14px;
      color: #ffffff;
      letter-spacing: 1px;
    }
  }

  .title-icon {
    width: 30px;
    height: 30px;
    position: relative;
    top: 6px;
  }

  .tishi-icon {
    width: 16px;
    height: 16px;
    position: relative;
    top: 2px;
  }

  .report-nav {
    height: 26px;
  }

  .report-nav-right {
    text-align: right;
  }

  .report-nav-left {
    display: flex;
    justify-content: flex-start;
    padding-top: 10px;
  }

  .report-nav-between {
    display: flex;
    justify-content: space-between;
    border-bottom: solid 1px #e7e7e7;
  }

  .report-des {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    overflow: hidden;
    width: 100%;

    .report-label {
      border-left: solid 4px #2fdac5;
      box-sizing: border-box;
      padding-left: 10px;
      font-family: MicrosoftYaHei-Bold;
      font-size: 16px;
      color: #32456d;
      text-align: left;
      font-weight: 600;
      margin-bottom: 14px;
      margin-top: 40px;
    }

    .report-item {
      height: 36px;
      line-height: 36px;
      font-family: MicrosoftYaHei;
      font-size: 14px;
      color: #30333f;
      letter-spacing: 0;
      text-align: left;
    }

    .ct-button {
      display: flex;
      justify-content: space-between;
    }

    .ct-button-1 {
      background-image: linear-gradient(90deg, #00acff 3%, #49d6ff 100%);
      box-shadow: 0 6px 10px 0 rgba(61, 181, 253, 0.25);
      border-radius: 1px;
      border: solid 1px transparent;
      width: 160px;
    }

    .ct-button-2 {
      background-image: linear-gradient(90deg, #28c3d5 0%, #34edb6 100%);
      box-shadow: 0 6px 10px 0 rgba(44, 212, 200, 0.25);
      border-radius: 1px;
      border: solid 1px transparent;
      width: 160px;
    }
  }

  .chart-content {
    width: 50%;
    background: #ffffff;
    margin: 20px 0 0 0;
    box-sizing: border-box;
  }

  .chart-content-1 {
    padding-right: 10px;
  }

  .chart-content-2 {
    padding: 0 2px 0 10px;
  }

  .button-center {
    background-image: linear-gradient(90deg, #19ff66, #16a7ff);
    border: none;
  }
</style>
