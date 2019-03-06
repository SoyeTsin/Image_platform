<template>
  <el-container>

    <el-dialog title="错误反馈" :visible.sync="dialogTableVisible" :append-to-body='true' width="600px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="请填写错误详情说明" prop="descValue">
          <el-input type="textarea" v-model="parameter.content"></el-input>
        </el-form-item>
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
        canCall: [],
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
            {min: 2, max: 255, message: '长度在 2 到 255 个字符', trigger: 'blur'}
          ],
        }
      }
    },
    computed: {
      descValue() {
        return this.parameter.content
      }
    },
    watch: {
      descValue(val) {
        this.ruleForm.descValue = val
      }
    },
    mounted() {

    },
    methods: {
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
      addFeedback() {
        this.parameter.institutionId = (JSON.parse(localStorage.getItem('institution'))).institutionId
        this.parameter.canCall = this.canCall.length > 0 ? 1 : 0
        this.$post('/api/diseaseFeedback', this.parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message(response.msg);
              return
            }
            this.$message({
              message: response.msg, type: 'success'
            });
            this.dialogTableVisible = false
          })
      },
      initParameter(obj) {
        this.parameter = obj
        this.parameter.beginTime = obj.beginDate
        this.parameter.endTime = obj.endDate
        this.parameter.canCall = []
        console.log(obj)
      },
      changeDialogTableVisible() {
        this.dialogTableVisible = !this.dialogTableVisible
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
</style>
