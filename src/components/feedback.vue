<template>
  <el-container>

    <el-dialog title="错误反馈" :visible.sync="dialogTableVisible" :append-to-body='true' width="600px"
               :before-close="beforeClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="请填写错误详情说明" prop="descValue">
          <el-input type="textarea" v-model="textareaContent" :rows="8" maxlength="500"></el-input>
        </el-form-item>
        <div :class="parameter.content|classFilter">{{parameter.content|numberFilter}}/500
        </div>
        <el-form-item label="">
          <el-checkbox-group v-model="canCall">
            <el-checkbox label="是否愿意接受电话回访" name="canCall"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-row>
          <el-button type="success" class="button-center" @click="submitForm('ruleForm')">确定</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
  export default {
    name: "addUser",
    data() {

      return {
        dialogTableVisible: false,
        centerDialogVisible: false,
        canCall: [],
        timeArr: [],
        textareaContent: '',
        parameter: {
          institutionId: '',
          diseaseType: '',
          content: '',
          canCall: '',
          beginTime: '',
          endTime: ''
        },
        ruleForm: {
          descValue: '',
        },
        rules: {
          descValue: [
            {required: true, message: '请输入反馈信息', trigger: 'blur'},
            {min: 2, max: 500, message: '长度在 2 到 500 个字符', trigger: 'blur'}
          ],
        }
      }
    },
    computed: {
      descValue() {
        return this.textareaContent
      }
    },
    watch: {
      descValue(val) {
        this.ruleForm.descValue = val
      }
    },
    filters: {
      numberFilter(val) {
        let num = val || ''
        return num.length
      },
      classFilter(val) {
        let num = val || ''
        return num.length > 500 ? 'zhishu red' : 'zhishu'
      }
    },
    mounted() {

    },
    methods: {
      getData() {
        // /api/getLastDiseaseFeedback
        if (this.timeArr && this.timeArr.length > 0) {
          this.parameter.beginDate = this.timeArr[0].getFullYear() + '-' + ((this.timeArr[0].getMonth() + 1) < 10 ? '0' + (this.timeArr[0].getMonth() + 1) : (this.timeArr[0].getMonth() + 1)) + '-' + (this.timeArr[0].getDate() < 10 ? '0' + this.timeArr[0].getDate() : this.timeArr[0].getDate())
          this.parameter.endDate = this.timeArr[1].getFullYear() + '-' + ((this.timeArr[1].getMonth() + 1) < 10 ? '0' + (this.timeArr[1].getMonth() + 1) : (this.timeArr[1].getMonth() + 1)) + '-' + (this.timeArr[1].getDate() < 10 ? '0' + this.timeArr[1].getDate() : this.timeArr[1].getDate())
        }
        let parameter = {
          beginTime: this.parameter.beginTime,
          endTime: this.parameter.endTime,
          institutionId: this.parameter.institutionId,
          diseaseType: this.parameter.diseaseType,
        }
        this.$post('/api/getLastDiseaseFeedback', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message.error(response.msg);
              return
            }
            this.textareaContent = response.data.content || ''
            this.canCall = (response.data.canCall == 1)
          })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addFeedback()
          } else {
            // this.$message('请正确填写表单内容！');
            return false;
          }
        });
      },
      serialImages() {
        let parameter = {
          institutionId: this.parameter.institutionId,
          serialUID: this.parameter.serialUID,
          channelId: this.parameter.channelId,
          diseaseType: this.parameter.diseaseType,
        }
        this.$post('/api/serialImages', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message.error(response.msg);
              return
            }
            this.$message({
              message: response.msg, type: 'success'
            });
            this.dialogTableVisible = false
          })
      },
      addFeedback() {
        this.parameter.institutionId = (JSON.parse(localStorage.getItem('institution'))).institutionId
        this.parameter.canCall = this.canCall ? 1 : 0
        debugger
        this.parameter.content = this.textareaContent
        this.$post('/api/diseaseFeedback', this.parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message.error(response.msg);
              return
            }
            this.$message({
              message: '反馈成功', type: 'success'
            });
            this.dialogTableVisible = false
          })
      },
      initParameter(obj, timeArr) {
        this.parameter = obj
        this.parameter.beginTime = obj.beginDate
        this.parameter.endTime = obj.endDate
        this.parameter.canCall = []
        this.timeArr = timeArr
        console.log(obj)
        this.getData()
      },
      changeDialogTableVisible() {
        this.dialogTableVisible = !this.dialogTableVisible
        this.textareaContent = '';
        this.canCall = false;
      },
      beforeClose(done) {
        if (this.parameter.content) {
          this.$confirm('内容未提交,确认关闭？')
            .then(_ => {
              done();
            })
            .catch(_ => {
            });
        } else {
          done();
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "../sass/common";

  .el-form-item {
    display: flex;
    flex-direction: column;

    /deep/ .el-form-item__label {
      width: 100% !important;
      margin: 0;
      text-align: left;
    }

    /deep/ .el-form-item__content {
      width: 100%;
      margin: 0 !important;
    }
  }

  .zhishu {
    float: right;
    position: relative;
    right: 0px;
    top: -20px;
  }

  .red {
    color: red;
  }
</style>
