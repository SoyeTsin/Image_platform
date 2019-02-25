<template>
  <el-container>
    <el-main>
      <div class="so-return">
        <div class="so-button" @click="returnGo">
          <i class="el-icon-arrow-left"></i>
          返回
        </div>
      </div>
      <div class="report-main">
        <div class="report-title">
          <i class="el-icon-picture"></i>
          AI辅助筛查统计报告（个人）
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
            <div><i class="el-icon-picture"></i>平安颖像肺结节智能筛查系统提示：通过对您病区患者的肺结节影像智能筛查，筛查状况见下表，此提示仅供您参考，请进一步诊断确认！</div>
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
                <i class="el-icon-picture"></i>患者基本信息
              </div>
              <el-row class="report-item">
                <el-col :span="24">AI检测结果：该患者疑似存在3个肺结节</el-col>
              </el-row>
              <el-row class="report-item">
                <el-col :span="24">AI影像分析：中线结构偏右</el-col>
              </el-row>
              <el-row class="report-item">
                <el-col :span="24">AI病灶编号：</el-col>
              </el-row>
              <el-row class="report-item">
                <el-col :span="24">
                  <el-table :data="tableData" stripe>
                    <el-table-column prop="name" label="结节编号" width="120">
                    </el-table-column>
                    <el-table-column prop="name" label="病灶类型">
                    </el-table-column>
                    <el-table-column prop="name" label="所在图层">
                    </el-table-column>
                    <el-table-column prop="name" label="大小">
                    </el-table-column>
                    <el-table-column prop="name" label="准确度">
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </div>
            <div class="report-main-right">
              <div class="ct-img">
                CT影像
              </div>
              <div class="ct-button">
                <el-button type="success" class="ct-button-1">查看影像</el-button>
                <el-button type="success" class="ct-button-2">错误反馈</el-button>
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
    methods: {
      returnGo(){
        this.$router.go(-1)
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "sass/common";
.el-main{

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
</style>
