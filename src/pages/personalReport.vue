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
        </div>
        <div class="report-main">
          <div class="report-title">
            <img src="./assets/statisticalReport.png" class="title-icon">
            AI辅助筛查统计报告（个人）
          </div>
          <div class="report-content">
            <div class="report-nav report-nav-right">
              <div>{{institution}}</div>
            </div>
            <div class="report-nav report-nav-between">
              <div>项目名称：{{diseaseType}}</div>
              <div>报告日期：{{serial.examDate}}</div>
            </div>
            <div class="report-nav report-nav-left">
              <div>
                <img src="./assets/tishi.png" class="tishi-icon">平安颖像肺结节智能筛查系统提示：通过对您病区患者的肺结节影像智能筛查，筛查状况见下表，此提示仅供您参考，请进一步诊断确认！
              </div>
            </div>
            <div class="report-des">
              <div class="report-main-left">
                <div class="report-label">
                  <img src="./assets/jbxx.png" class="tishi-icon">患者基本信息
                </div>
                <el-row class="report-item">
                  <el-col :span="8">患者姓名：{{serial.examDate}}</el-col>
                  <el-col :span="8">患者年龄：{{serial.studyAge}}</el-col>
                  <el-col :span="8">患者性别：{{serial.sex|genderFilter}}</el-col>
                </el-row>
                <el-row class="report-item">
                  <el-col :span="8">拍摄部位：{{diseaseType}}</el-col>
                  <el-col :span="8">检查设备：{{serial.modality}}</el-col>
                  <el-col :span="8">检查时间：{{serial.examDate}}</el-col>
                </el-row>
                <div class="report-label">
                  <img src="./assets/zdjg.png" class="tishi-icon">AI诊断结果
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
                    <el-table :data="tableData" stripe ref="singleTable" @row-click="listClick">
                      <el-table-column type="index" label="结节编号" width="120"></el-table-column>
                      <el-table-column prop="diseaseDesc" label="病灶类型"></el-table-column>
                      <el-table-column prop="imageNo" label="所在图层"></el-table-column>
                      <el-table-column prop="diameter" label="大小"></el-table-column>
                      <el-table-column prop="probability" label="准确度">
                        <template slot-scope="scope">{{scope.row.probability}}%</template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
              </div>
              <div class="report-main-right">
                <div class="ct-img">
                  <cornerstone-canvas height="100%" width="100%" ref="cornerstone"></cornerstone-canvas>
                </div>
                <div class="ct-button">
                  <el-button
                    type="success"
                    class="ct-button-1"
                    @click="$router.push({path:'fjjCT',query:$route.query})"
                  >查看影像</el-button>
                  <el-button type="success" class="ct-button-2">错误反馈</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import top from "./components/top";
import CornerstoneCanvas from "@/components/CornerstoneCanvas";
export default {
  name: "userInfo",
  data() {
    const item = {
      date: "2016-05-02",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄"
    };
    return {
      tableData: [],
      serial: {},
      serialImages: {},
      queryDiagnosis: {},
      diseaseType: ""
    };
  },
  components: {
    CornerstoneCanvas,
    top
  },
  methods: {
    returnGo() {
      this.$router.go(-1);
    },
    listClick(row) {
      console.log(row);
      this.cornerstone.loadImage(row.imageUrl);
    }
  },
  mounted() {},
  created() {
    this.$fetch("/api/diseaseType").then(res => {
      if (res.code == "000000") {
        this.diseaseType = res.data[this.$route.query.diseaseType];
      }
    });
    this.institution = JSON.parse(
      localStorage.getItem("institution")
    ).institutionName;
    this.$post("/api/serial", this.$route.query).then(res => {
      this.serial = res.data;
    });
    this.$post("/api/serialImages", this.$route.query).then(res => {
      this.tableData = res.data;
      this.$refs.cornerstone.init(this.tableData[0].imageUrl).then(res => {
        this.cornerstone = this.$refs.cornerstone;
      });
    });
    this.$post("/api/queryDiagnosis", this.$route.query).then(res => {
      this.queryDiagnosis = res.data;
    });
  },
  filters: {
    genderFilter(value) {
      if (value == "m") {
        return "男";
      } else if (value == "f") {
        return "女";
      } else {
        return "未知";
      }
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
}
.el-header {
  padding: 0;
}

.so-content {
  box-sizing: border-box;
  padding: 20px;
  background: #ffffff;
}
.report-nav {
  height: 26px;
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

  .report-main-left {
    width: 770px;
  }

  .report-main-right {
    width: 340px;
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
</style>
