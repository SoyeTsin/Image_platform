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
            <img src="../assets/grbg.png" class="title-icon">
            AI辅助筛查统计报告（个人）
          </div>
          <div class="report-content">
            <div class="report-nav report-nav-right">
              <div>{{institution}}</div>
            </div>
            <div class="report-nav report-nav-between">
              <div>项目名称：{{diseaseType}}筛查</div>
              <div>报告日期：{{FormatDate}}</div>
            </div>
            <div class="report-nav report-nav-left">
              <div>
                <img src="../assets/tishi.png" class="tishi-icon">平安颖像肺结节智能筛查系统提示：通过对您病区患者的肺结节影像智能筛查，筛查状况见下表，此提示仅供您参考，请进一步诊断确认！
              </div>
            </div>
            <div class="report-des">
              <div class="report-main-left">
                <div class="report-label">
                  <img src="../assets/jbxx.png" class="tishi-icon">患者基本信息
                </div>
                <el-row class="report-item">
                  <el-col :span="8">患者姓名：{{serial.patientName}}</el-col>
                  <el-col :span="8">患者年龄：{{serial.studyAge?serial.studyAge:'--'}}</el-col>
                  <el-col :span="8">患者性别：{{serial.sex|genderFilter}}</el-col>
                </el-row>
                <el-row class="report-item">
                  <el-col :span="8">拍摄部位：{{serial.bodyPartExamined?serial.bodyPartExamined:'--'}}</el-col>
                  <el-col :span="8">检查设备：{{serial.modality}}</el-col>
                  <el-col :span="8">检查时间：{{serial.examDate}}</el-col>
                </el-row>
                <div class="report-label">
                  <img src="../assets/zdjg.png" class="tishi-icon">AI诊断结果
                </div>
                <el-row class="report-item">
                  <el-col :span="24">AI检测结果：该患者疑似存在{{tableData.length}}个肺结节</el-col>
                </el-row>
                <el-row class="report-item">
                  <el-col :span="24">AI病灶编号：</el-col>
                </el-row>
                <el-row class="report-item">
                  <el-col :span="24">
                    <el-table :data="tableData" stripe ref="singleTable" @row-click="listClick">
                      <el-table-column type="index" label="结节编号" width="120">
                        <!-- <template slot-scope="scope">结节{{scope.row.imageNo?scope.row.imageNo:'--'}}</template> -->
                      </el-table-column>
                      <el-table-column prop="diseaseDesc" label="病灶类型">
                        <template
                          slot-scope="scope"
                        >{{scope.row.diseaseTypeDesc?scope.row.diseaseTypeDesc:'肺结节'}}</template>
                      </el-table-column>
                      <el-table-column prop="imageNo" label="所在图层">
                        <template slot-scope="scope"> -- </template>
                      </el-table-column>
                      <el-table-column prop="diameter" label="大小">
                        <template slot-scope="scope">{{scope.row.diameter?scope.row.diameter+'px':'--'}}</template>
                      </el-table-column>
                      <el-table-column prop="probability" label="准确度">
                        <template slot-scope="scope">{{scope.row.probability}}</template>
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
                  <el-button type="success" class="ct-button-2" @click="getFeedback()">错误反馈</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-main>
    <el-dialog
      title="错误反馈"
      :visible.sync="dialogVisible"
      width="660px"
      class="feedback"
      :before-close="handleClose"
    >
      <p>
        <span>*</span>请填写错误详情说明
      </p>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
         <el-form-item prop="textarea">
            <el-row>
              <el-col :span="24" style="position: relative;">
                <el-input type="textarea" :rows="5" placeholder="请输入内容" :maxlength='500' v-model="ruleForm.textarea"></el-input>
                <div class="text-length">
                  {{ruleForm.textarea.length}}/500
                </div>
              </el-col>
            </el-row>
          </el-form-item>
      </el-form>
       
      <el-checkbox v-model="checked">是否愿意接受电话回访</el-checkbox>
      <button class="submit" v-if="ruleForm.textarea.length>0" @click="submitForm('ruleForm')" >提交</button>
      <button class="submit" v-else style="opacity: 0.6;" @click="submitForm('ruleForm')" >提交</button>
    </el-dialog>
  </el-container>
</template>
<script>
import top from "@/components/top";
import CornerstoneCanvas from "@/components/CornerstoneCanvas";
import feedback from "@/components/feedback";
export default {
  name: "userInfo",
  data() {
    return {
      tableData: [],
      serial: {},
      serialImages: {},
      queryDiagnosis: {},
      diseaseType: "",
      FormatDate: "",
      dialogVisible: false,
      textarea: "",
      checked: false,
      ruleForm:{
        textarea:''
      },
      rules: {
          textarea: [
            { required: true, message: '请输入反馈信息', trigger: 'blur' }
          ]
        }
    };
  },
  components: {
    CornerstoneCanvas,
    top
  },
  methods: {
    getFeedback(){
      let query = this.$route.query;
      this.$post("/api/getLastPatientFeedback",query).then(res=>{
        if(res.data){
          this.ruleForm.textarea = res.data.content
          this.checked = res.data.canCall == 1?true:false
        }
      })
      this.dialogVisible = true
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
        if (valid) {
          let query = this.$route.query;
          this.$post(
            "/api/patientFeedback",
            Object.assign(query, {
              content: this.ruleForm.textarea,
              canCall: this.checked ? 1 : 0
            })
          ).then(res => {
            if (res.code == "000000") {
              this.dialogVisible = false;
              this.checked = false;
              // this.textarea = "";
              this.$message({
                message: "反馈成功",
                type: "success"
              });
            }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleClose(done) {
      if (this.ruleForm.textarea.length > 0) {
        this.$confirm("内容未提交,是否直接关闭？")
          .then(_ => {
            this.textarea = "";
            done();
          })
          .catch(_ => {});
      } else {
        done();
      }
    },
    returnGo() {
      this.$router.go(-1);
    },
    listClick(row) {
      this.cornerstone.loadImage(row.imageUrl);
    },
    submit() {
      let query = this.$route.query;
      this.$post(
        "/api/patientFeedback",
        Object.assign(query, {
          content: this.textarea,
          canCall: this.checked ? 1 : 0
        })
      ).then(res => {
        if (res.code == "000000") {
          this.dialogVisible = false;
          this.checked = false;
          // this.textarea = "";
          this.$message({
            message: "反馈成功",
            type: "success"
          });
        }
      });
    }
  },
  mounted() {},
  created() {
    function myDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    }
    this.FormatDate = myDate()
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
      if(this.tableData.length>0){
          this.$refs.cornerstone.init(this.tableData[0].imageUrl).then(res => {
          this.cornerstone = this.$refs.cornerstone;
        });
      }
    });
    this.$post("/api/queryDiagnosis", this.$route.query).then(res => {
      this.queryDiagnosis = res.data;
    });
  },
  filters: {
     genderFilter(value) {
        if (value == 'm' || value == 0 || value == '男') {
          return '男'
        } else if (value == 'f' || value == 1 || value == '女') {
          return '女'
        } else {
          return '--'
        }
      },
  }
};
</script>

<style lang="scss" scoped>
 @import "../sass/common";
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
