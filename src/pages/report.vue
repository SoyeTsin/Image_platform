<template>
  <el-container>
    <el-main>
      <div class="so-return">
        <div class="so-button">
          <i class="el-icon-arrow-left"></i>
          返回
        </div>
      </div>
      <div class="report-main">
        <div class="report-title">
          <i class="el-icon-picture"></i>
          诊断报告
        </div>
        <div class="report-content">
          <div class="report-nav report-nav-right">
            <div>上海仁济医院</div>
          </div>
          <div class="report-nav report-nav-between">
            <div>项目名称：肺结节筛查</div>
            <div>报告日期：2018-10-28</div>
          </div>
          <div class="report-des">
            <div class="report-main-left">
              <div class="report-label">
                <i class="el-icon-picture"></i>患者基本信息
              </div>
              <el-row class="report-item">
                <el-col :span="8">患者姓名：张大大</el-col>
                <el-col :span="8">患者年龄：65</el-col>
                <el-col :span="8">患者性别：男</el-col>
              </el-row>
              <el-row class="report-item">
                <el-col :span="8">拍摄部位：胸部</el-col>
                <el-col :span="8">检查设备：CT</el-col>
                <el-col :span="8">检查时间：2018-08-09 14：25：00</el-col>
              </el-row>
              <div class="report-label">
                <i class="el-icon-picture"></i>影像描述
              </div>
              <el-row class="report-item">
                <el-col :span="24" class="label">中线位置：居中</el-col>
                <el-col :span="24">影像描述详情影像描述详情影像描述详情影像描述详情影像描述详情影像描述详情影像描述详情影像描述详情影像描述详情影像描述详情
</el-col>
              </el-row>
              <el-row class="report-item">
                <el-col :span="24"  class="label">诊断结论</el-col>
                <el-col :span="24">影像描述详情影像描述详情影像描述详情影像描述详情影像描述详情影像描述详情影像描述详情影像描述详情影像描述详情影像描述详情
</el-col>
              </el-row>
            </div>
            <div class="report-main-right">
              <div class="ct-img">
                CT影像
              </div>
              <div class="ct-button">
                <el-button type="success" class="ct-button-2">打印</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  export default {
    name: "userInfo",
    data() {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      };
      return {
        tableData: Array(5).fill(item),
      }
    },
    methods: {},
  }
</script>

<style lang="scss" scoped>
  @import "sass/common";

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
    justify-content: space-between;
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
      .label{
          width: 128px;
          text-align: center;
          background: rgba(47,218,197,0.10);
          border: 1px solid #2FDAC5;
          height: 28px;
          line-height: 28px;
          font-size: 14px;
        color: #00B5A1;
      }
    }

    .ct-button {
      display: flex;
      justify-content: flex-end;
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
</style>
