<template>
  <el-container>
    <el-header>
      <top></top>
    </el-header>
    <el-main>
      <div class="so-content">
    
      <div class="so-return">
        <div class="so-button" @click="$router.go(-1)">
          <i class="el-icon-arrow-left"></i>
          返回
        </div>
      </div>
      <div class="report-main">
        <div class="report-title">
          <img src="./assets/statisticalReport.png" class="title-icon">
          诊断报告
        </div>
        <div class="report-content">
          <div class="report-nav report-nav-right">
            <div>{{institution}}</div>
          </div>
          <div class="report-nav report-nav-between">
            <div>项目名称：{{diseaseType}}</div>
            <div>报告日期：{{serial.examDate}}</div>
          </div>
          <div class="report-des">
            <div class="report-main-left">
              <div class="report-label">
                <img src="./assets/jbxx.png" class="tishi-icon"/>患者基本信息
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
                <img src="./assets/zdjg.png" class="tishi-icon"/>影像描述
              </div>
              <el-row class="report-item">
                <!-- <el-col :span="24" class="label">中线位置：居中</el-col> -->
                <el-col :span="24" v-if="queryDiagnosis">{{queryDiagnosis.doctorDesc||''}}</el-col>
              </el-row>
              <el-row class="report-item">
                <el-col :span="24"  class="label">诊断结论</el-col>
                <el-col :span="24"  v-if="queryDiagnosis">{{queryDiagnosis.doctorResult||''}}</el-col>
              </el-row>
            </div>
            <div class="report-main-right">
              <div class="ct-img">
                <cornerstone-canvas height="100%" width="100%" ref="cornerstone"></cornerstone-canvas>
              </div>
              <div class="ct-button">
                <el-button type="success" class="ct-button-2" @click="preview()">打印</el-button>
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
import top from './components/top'
import CornerstoneCanvas from '@/components/CornerstoneCanvas'
  export default {
    name: "userInfo",
    data() {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      };
      return {
        serial:{},
        serialImages:{},
        queryDiagnosis:{},
        institution:''
      }
    },
    methods:{
        preview(oper){
            window.print()
        }
    },
    components: {
      CornerstoneCanvas,
      top
    },
    created(){
      this.$fetch('/api/diseaseType').then(res=>{
          if(res.code == '000000'){
              this.diseaseType = res.data[this.$route.query.diseaseType]
          }
      })
      this.institution = JSON.parse(localStorage.getItem('institution')).institutionName
      this.$post('/api/serial',this.$route.query).then(res=>{
        this.serial = res.data
      })
      this.$post('/api/serialImages',this.$route.query).then(res=>{
        this.tableData = res.data
        this.$refs.cornerstone.init(this.tableData[0].imageUrl).then((res)=>{
          this.cornerstone = this.$refs.cornerstone
        })
      })
      this.$post('/api/queryDiagnosis',this.$route.query).then(res=>{
        this.queryDiagnosis = res.data
        console.log( this.queryDiagnosis,'/api/queryDiagnosis')
      })
    },
    filters: {
      genderFilter(value) {
        if (value == 'm') {
          return '男'
        } else if (value == 'f') {
          return '女'
        } else {
          return '未知'
        }
      }
    },
  }
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
  @media print{
    .el-header,.so-return,.ct-button-2{
      display: none;
    }
    .report-des{
          flex-wrap: wrap;
    }
    .report-main-left{
          flex: 1 0 100%;
    }
  }
</style>
