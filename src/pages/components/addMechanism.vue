<template>
  <el-container>

    <el-dialog title="机构编辑" :visible.sync="dialogTableVisible" :append-to-body='true' width="660px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="机构名称：" prop="institutionName" class="">
              {{parameter.institutionName}}
            </el-form-item>
            <el-form-item label="渠道：" prop="channelName" class="">
              {{parameter.channelName}}
            </el-form-item>
            <el-form-item label="渠道联系人" prop="channelUser" class="">
              <el-input v-model="parameter.channelUser"></el-input>
            </el-form-item>
            <el-form-item label="机构联系人" prop="institutionUser" class="">
              <el-input v-model="parameter.institutionUser"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构ID：" prop="institutionId" class="">
              {{parameter.institutionId}}
            </el-form-item>
            <el-form-item label="所在地区：" prop="provinceName" class="">
              {{parameter.provinceName}}{{parameter.cityName}}
            </el-form-item>
            <el-form-item label="联系方式" prop="channelUserPhoneNum" class="">
              <el-input v-model="parameter.institutionUserPhoneNum"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="institutionUserPhoneNum" class="">
              <el-input v-model="parameter.institutionUserPhoneNum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">

          </el-col>
          <el-col :span="24">
            <el-form-item label="上级机构" prop="channelValue" class="dialog-item">
              <ELTreeSelect
                ref="treeSelect"
                v-model="ids"
                :selectParams="selectParams"
                :treeParams="elTreeParams"
                @node-click="fun"
                @select-clear="fun"
                @searchFun="fun"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            &nbsp;
          </el-col>
          <el-col :span="8">
            <el-button class="button-center-def" @click="dialogTableVisible=false">跳过</el-button>
          </el-col>
          <el-col :span="8">
            <el-button type="success" class="button-center" @click="submitForm('ruleForm')">创建</el-button>
          </el-col>
          <el-col :span="4">
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
  import ELTreeSelect from 'el-tree-select';

  export default {
    name: "addUser",
    components: {ELTreeSelect},
    data() {
      return {
        dialogTableVisible: true,
        values: ['3'],
        selectParams: {
          'multiple': true,
          'clearable': true,
          'placeholder': '请输入内容'
        },
        treeParams: {
          'default-expand-all': true,
          'filterable': true,
          'check-strictly': true,
          'render-content': this._renderFun,
          'data': [{
            flowId: '1', name: '哎哎哎',
            children: [{flowId: '3', name: '啊啊啊啊'}]
          },
            {
              flowId: '2',
              name: '发生的'
            }],
          'props': {
            children: 'children',
            label: 'name',
            value: 'flowId'
          }
        },
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
      editMechanism(obj) {
        console.log(obj)
        this.parameter = obj
        this.ruleForm.channelValue = obj.channelName
        this.ruleForm.institutionValue = obj.institutionName
        this.queryRelateInstitutionList(1)
        this.queryRelateInstitutionList(2)
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
      queryRelateInstitutionList(relateType) {
        let parameter = {
          relateType,
          institutionId: ''
        }
        this.$post('/manager/queryRelateInstitutionList', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message(response.msg);
              return
            }
            if (relateType == 1) {
              this.upRelate = response.data
            } else if (relateType == 2) {
              this.downRelate = response.data
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
