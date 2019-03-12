<template>
  <el-container>

    <el-dialog :title="editType?'创建账号':'编辑账号'" :visible.sync="dialogTableVisible" :append-to-body='true' width="600px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="用户姓名：" prop="userName" class="dialog-item" v-show="!editType">
          {{ruleForm.userName}}
        </el-form-item>
        <el-form-item label="用户    ID：" prop="userName" class="dialog-item" v-show="!editType">
          {{parameter.userId}}
        </el-form-item>
        <el-form-item label="用户姓名：" prop="userName" class="dialog-item" v-show="editType">
          <el-input v-model="ruleForm.userName" placeholder="姓名" maxlength="25"></el-input>
        </el-form-item>
        <el-form-item label="所属机构：" prop="institutionValue" class="dialog-item">
          <el-select v-model="ruleForm.institutionValue" filterable placeholder="机构" class="main-input">
            <el-option
              v-for="item in institution.list"
              :key="item.flowId"
              :label="item.name"
              :value="item.flowId"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所处科室：" prop="officeValue" class="dialog-item">
          <el-select v-model="ruleForm.officeValue" filterable placeholder="科室" class="main-input">
            <el-option
              v-for="item in office.list"
              :key="item.officeId"
              :label="item.officeName"
              :value="item.officeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phoneNum" class="dialog-item">
          <el-input v-model="ruleForm.phoneNum"></el-input>
        </el-form-item>
        <el-form-item label="权限：" prop="isEnableValue" class="dialog-item">
          <el-select v-model="ruleForm.isEnableValue" filterable placeholder="请选择" class="main-input">
            <el-option
              v-for="item in isEnable.list"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-button type="success" class="button-center" @click="submitForm('ruleForm')">{{editType?'创建':'确定'}}
          </el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
  export default {
    name: "addUser",
    data() {
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
          callback();
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
          console.log(reg.test(value));
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      };
      return {
        editType: true,
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
            {required: true, validator: checkPhone, trigger: 'blur'}
          ],
          channelValue: [
            {required: true, message: '请选择所属渠道', trigger: 'change'}
          ],
          institutionValue: [
            {required: true, message: '请选择所处机构', trigger: 'change'}
          ],
          officeValue: [
            {required: true, message: '请选择所处科室', trigger: 'change'}
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
      },
      dialogTableVisible(val) {
        !val && setTimeout(() => {
          this.$refs['ruleForm'].resetFields();
        }, 0);
      }
    },
    mounted() {

    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addUserInfo()
          } else {
            // this.$message('请正确填写表单内容！');
            return false;
          }
        });
      },
      addUserInfo() {
        let isEnableValue = this.ruleForm.isEnableValue
        for (let i in this.isEnable.list) {
          if (this.isEnable.list[i].label == isEnableValue) {
            this.isEnable.key = this.isEnable.list[i].value
          }
        }
        let institutionValue = this.ruleForm.institutionValue

        for (let i in this.institution.list) {
          if (this.institution.list[i].name == '-- ' + institutionValue) {
            this.institution.key = this.parameter.institutionId
          }
        }
        let officeValue = this.ruleForm.officeValue
        for (let i in this.office.list) {
          if (this.office.list[i].officeName == officeValue) {
            this.office.key = this.parameter.officeId
          }
        }
        let parameter = {
          userId: this.parameter.userId,
          userName: this.ruleForm.userName,
          phoneNum: this.ruleForm.phoneNum,
          institutionId: this.institution.key,
          officeId: this.office.key,
          isEnable: this.isEnable.key
        }

        this.$post('/account/editUserInfo', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message.error(response.msg);
              return
            }
            let msg = '创建成功'
            if (this.parameter.userId) {
              msg = '编辑成功'
            }
            this.$message({
              message: msg, type: 'success'
            });
            this.dialogTableVisible = false
            this.$emit('renewList')
          })
      },
      addUser() {
        this.user = ''
        this.parameter = {userName: '', phoneNum: '', userId: ''}
        this.institution.value = ''
        this.office.value = ''
        this.isEnable = {value: '启用', key: 0, list: [{value: 0, label: '启用'}, {value: 1, label: '禁用'}]}
        this.ruleForm = {
          userName: '',
          phoneNum: '',
          channelValue: '',
          institutionValue: '',
          officeValue: '',
          isEnableValue: 0,
        }
        this.editType = true
        this.queryOfficeList()
        this.queryOrganizationList()
      },
      editUser(user) {
        console.log(user)
        this.user = user
        this.parameter.userId = user.userId
        this.parameter.institutionId = user.institution.institutionId
        this.parameter.officeId = user.office.officeId
        this.parameter.isEnable = user.authority
        this.ruleForm.userName = user.userName
        this.ruleForm.phoneNum = user.phoneNum
        this.ruleForm.isEnableValue = user.authority
        this.editType = false
        this.queryOfficeList()
        this.queryOrganizationList()
      },
      changeDialogTableVisible() {
        this.dialogTableVisible = !this.dialogTableVisible
      },
      queryOfficeList() {
        let parameter = {}
        this.$post('/manager/queryOfficeList', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message.error(response.msg);
              return
            }
            this.office.list = response.data
            if (this.user) {
              this.ruleForm.officeValue = this.user.office.officeId

            }
          })
      },
      queryOrganizationList() {
        let parameter = {
          dataType: 0
        }
        this.$post('/manager/queryOrganizationList', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message.error(response.msg);
              return
            }
            let newData = response.data.group
            let list = []
            for (let i in newData) {
              let m = newData[i]
              let n = {
                disabled: true,
                name: '- ' + m.channelName,
                flowId: m.channelId,
              }
              let y = {}
              // list.push(n)
              for (let j in m.institutions) {
                y = {
                  name: m.institutions[j].institutionName,
                  flowId: m.institutions[j].institutionId,
                  type: 1
                }
                list.push(y)
              }
            }
            this.institution.list = list
            if (this.user) {
              this.ruleForm.institutionValue = this.user.institution.institutionId
            }
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
