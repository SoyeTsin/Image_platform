<template>
  <el-container>

    <el-dialog title="新建账号" :visible.sync="dialogTableVisible" :append-to-body='true' width="600px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="用户姓名" prop="userName" class="dialog-item">
          <el-input v-model="ruleForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="所属渠道" prop="channelValue" class="dialog-item">
          <el-select v-model="ruleForm.channelValue" filterable placeholder="渠道" class="main-input">
            <el-option
              v-for="item in channel.list"
              :key="item.channelId"
              :label="item.channelName"
              :value="item.channelId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所处机构" prop="institutionValue" class="dialog-item">
          <el-select v-model="ruleForm.institutionValue" filterable placeholder="机构" class="main-input">
            <el-option
              v-for="item in institution.list"
              :key="item.institutionId"
              :label="item.institutionName"
              :value="item.institutionId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所处科室" prop="officeValue" class="dialog-item">
          <el-select v-model="ruleForm.officeValue" filterable placeholder="科室" class="main-input">
            <el-option
              v-for="item in office.list"
              :key="item.officeId"
              :label="item.officeName"
              :value="item.officeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNum" class="dialog-item">
          <el-input v-model="ruleForm.phoneNum"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="isEnableValue" class="dialog-item">
          <el-select v-model="ruleForm.isEnableValue" placeholder="请选择" class="main-input">
            <el-option
              v-for="item in isEnable.list"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-button type="success" class="button-center" @click="submitForm('ruleForm')">创建</el-button>
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
        channel: {value: '', key: null, list: []},
        institution: {value: '', key: null, list: []},
        office: {value: '', key: null, list: []},
        parameter: {userName: '', phoneNum: '', userId: ''},
        isEnable: {value: '启用', key: 0, list: [{value: 0, label: '启用'}, {value: 1, label: '禁用'}]},
        ruleForm: {
          userName: '',
          phoneNum: '',
          channelValue: '',
          institutionValue: '',
          officeValue: '',
          isEnableValue: '',
        },
        rules: {
          userName: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 2, max: 25, message: '长度在 2 到 25 个字符', trigger: 'blur'}
          ],
          phoneNum: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {min: 11, max: 11, message: '长度为 11 个字符', trigger: 'blur'}
          ],
          channelValue: [
            {required: true, message: '请选择所属渠道', trigger: 'change'}
          ],
          institutionValue: [
            {required: true, message: '请选择所属机构', trigger: 'change'}
          ],
          officeValue: [
            {required: true, message: '请选择活动区域', trigger: 'change'}
          ],
          isEnableValue: [
            {required: true, message: '请选择活动区域', trigger: 'change'}
          ],
        }
      }
    },
    computed: {
      channelValue() {
        return this.ruleForm.channelValue
      },
      institutionValue() {
        return this.ruleForm.institutionValue
      },
      officeValue() {
        return this.ruleForm.officeValue
      },
      isEnableValue() {
        return this.ruleForm.isEnableValue
      }
    },
    watch: {
      channelValue(val) {
        this.queryOrganizationList(2, val)
        this.channel.key = val
      },
      institutionValue(val) {
        this.institution.key = val
      },
      officeValue(val) {
        this.office.key = val
      },
      isEnableValue(val) {
        console.log(val)
        this.isEnable.key = val
      }
    },
    mounted() {
      this.queryOfficeList()
      this.queryOrganizationList()
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addUserInfo()
          } else {
            this.$message('请正确填写表单内容！');
            return false;
          }
        });
      },
      addUserInfo() {
        let parameter = {
          userId: this.parameter.userId,
          userName: this.parameter.userName,
          phoneNum: this.parameter.phoneNum,
          institutionId: this.institution.key,
          officeId: this.office.key,
          isEnable: this.isEnable.key
        }
        this.$post('/account/editUserInfo', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message(response.msg);
              return
            }
            this.dialogTableVisible = false
            this.$emit('renewList')
          })
      },
      editUser(user) {
        console.log(user)
        this.parameter.userId = user.userId
        this.parameter.userName = user.userName
        this.parameter.phoneNum = user.phoneNum
        this.channel.value = user.institution.channelName
        this.channel.key = user.institution.channelId
        this.institution.value = user.institution.institutionName
        this.institution.key = user.institution.institutionId
        this.office.value = user.office.officeName
        this.office.key = user.office.officeId
        this.isEnable.value = '启用'
        this.isEnable.key = 0
      },
      changeDialogTableVisible() {
        this.dialogTableVisible = !this.dialogTableVisible
      },
      queryOrganizationList(dataType = 1, channelId = '') {
        let parameter = {
          // provinceCode: this.provinces.value,
          // cityCode: this.city.value,
          channelId,
          dataType
        }
        this.$post('/manager/queryOrganizationList', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message(response.msg);
              return
            }
            if (dataType == 1) {
              this.channel.list = response.data.channelList
            } else {
              this.institution.list = response.data.institutionList
            }
          })
      },
      queryOfficeList() {
        let parameter = {}
        this.$post('/manager/queryOfficeList', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message(response.msg);
              return
            }
            this.office.list = response.data
          })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../sass/common";
</style>
