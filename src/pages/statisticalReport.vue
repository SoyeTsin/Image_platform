<template>
  <el-container>
    <el-main>
      <div class="report-body">
        <div class="so-return">
          <div class="so-button" @click="returnGo">
            <i class="el-icon-arrow-left"></i>
            返回
          </div>
        </div>
        <div class="report-main">
          <div class="report-title">
            <img src="./assets/statisticalReport.png" class="title-icon">
            统计报告
          </div>
          <div class="report-content">
            <div class="report-nav report-nav-right">
              <div>上海仁济医院</div>
            </div>
            <div class="report-nav report-nav-between">
              <div>项目名称：肺结节筛查</div>
              <div>报告日期：2018-10-28</div>
            </div>
            <div class="report-nav report-nav-left">
              <div><img src="./assets/tishi.png" class="tishi-icon"/>
                平安颖像肺结节智能筛查系统提示：通过对您病区患者的肺结节影像智能筛查，筛查状况见下表，此提示仅供您参考，请进一步诊断确认！
              </div>
            </div>
            <div class="report-des">
              <columnG2 :charData="serverData" :id="'c1'" id="c1" class="chart"></columnG2>
              <pieG2 :charData="pieData" :id="'c1'" id="c2" class="chart"></pieG2>
            </div>
            <div class="button-right">
              <el-button type="success" class="button-center" @click="submitForm('ruleForm')">错误反馈</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import G2 from '@antv/g2'
  import columnG2 from './components/columnG2';
  import pieG2 from './components/pieG2';

  export default {
    name: "userInfo",
    components: {columnG2, pieG2},
    data() {
      return {
        serverData: [],
        pieData: [],
      }
    },
    mounted() {
      this.imgReportOne()
      this.imgReportTwo()
    },
    methods: {
      imgReportOne() {
        this.serverData = [{
          company: 'Apple',
          type: '整体',
          value: 30
        }, {
          company: 'Facebook',
          type: '整体',
          value: 35
        }, {
          company: 'Google',
          type: '整体',
          value: 28
        }, {
          company: 'Apple',
          type: '非技术岗',
          value: 40
        }, {
          company: 'Facebook',
          type: '非技术岗',
          value: 65
        }, {
          company: 'Google',
          type: '非技术岗',
          value: 47
        }, {
          company: 'Apple',
          type: '技术岗',
          value: 23
        }, {
          company: 'Facebook',
          type: '技术岗',
          value: 18
        }, {
          company: 'Google',
          type: '技术岗',
          value: 20
        }, {
          company: 'Apple',
          type: '技术岗',
          value: 35
        }, {
          company: 'Facebook',
          type: '技术岗',
          value: 30
        }, {
          company: 'Google',
          type: '技术岗',
          value: 25
        }];
      },
      imgReportTwo() {
        this.pieData = [{
          item: '事例一',
          count: 40,
          percent: 0.4
        }, {
          item: '事例二',
          count: 21,
          percent: 0.21
        }, {
          item: '事例三',
          count: 17,
          percent: 0.17
        }, {
          item: '事例四',
          count: 13,
          percent: 0.13
        }, {
          item: '事例五',
          count: 9,
          percent: 0.09
        }];
      },
      returnGo() {
        this.$router.go(-1)
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "sass/common";

  .report-body {
    width: 1260px;
    text-align: center;
    margin: auto;

    .button-right {
      margin-top: 24px;
      float: right;

      .button-center {
        font-family: MicrosoftYaHei-Bold;
        font-size: 14px;
        color: #FFFFFF;
        letter-spacing: 1px;
      }
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
    border-bottom: solid 1px #E7E7E7;
  }

  .report-des {
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;

    .report-label {
      border-left: solid 4px #2FDAC5;
      box-sizing: border-box;
      padding-left: 10px;
      font-family: MicrosoftYaHei-Bold;
      font-size: 16px;
      color: #32456D;
      text-align: left;
      font-weight: 600;
      margin-bottom: 14px;
      margin-top: 40px;
    }

    .report-main-left {
      width: 770px
    }

    .report-main-right {
      width: 340px;
    }

    .report-item {
      height: 36px;
      line-height: 36px;
      font-family: MicrosoftYaHei;
      font-size: 14px;
      color: #30333F;
      letter-spacing: 0;
      text-align: left;
    }

    .ct-button {
      display: flex;
      justify-content: space-between;

    }

    .ct-button-1 {
      background-image: linear-gradient(90deg, #00ACFF 3%, #49D6FF 100%);
      box-shadow: 0 6px 10px 0 rgba(61, 181, 253, 0.25);
      border-radius: 1px;
      border: solid 1px transparent;
      width: 160px;
    }

    .ct-button-2 {
      background-image: linear-gradient(90deg, #28C3D5 0%, #34EDB6 100%);
      box-shadow: 0 6px 10px 0 rgba(44, 212, 200, 0.25);
      border-radius: 1px;
      border: solid 1px transparent;
      width: 160px;
    }
  }

  .chart {
    width: 620px;
    height: 300px;
    background: #FFFFFF;
    border: 1px solid #E7E7E7;
    border-radius: 1px;
    margin: 20px 20px 0 0;
    box-sizing: border-box;
    padding: 20px;
  }
</style>
