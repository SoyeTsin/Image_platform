<template>
  <el-container>

    <el-dialog title="编辑机构" :visible.sync="dialogTableVisible" :append-to-body='true' width="660px">
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
              <el-input v-model="ruleForm.channelUser" maxlength="25"></el-input>
            </el-form-item>
            <el-form-item label="机构联系人" prop="institutionUser" class="">
              <el-input v-model="ruleForm.institutionUser" maxlength="25"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构ID：" prop="institutionId" class="">
              {{parameter.institutionId}}
            </el-form-item>
            <el-form-item label="所在地区：" prop="provinceName" class="">
              {{parameter.provinceName}}{{parameter.cityName}}
            </el-form-item>
            <el-form-item label="联系方式" prop="channelContact" class="">
              <el-input v-model="ruleForm.channelContact" maxlength="25"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="institutionContact" class="">
              <el-input v-model="ruleForm.institutionContact" maxlength="25"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">

          </el-col>
          <el-col :span="24">
            <el-form-item label="上级机构" prop="upRelate" class="dialog-item">
              <el-select clearable multiple v-model="upRelateArr" filterable placeholder="机构" class="main-input">
                <el-option
                  v-for="item in upRelate.list"
                  :key="item.flowId"
                  :label="item.name"
                  :value="item.flowId"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="下级机构" prop="downRelate" class="dialog-item">
              <el-select clearable multiple v-model="downRelateArr" filterable placeholder="机构" class="main-input">
                <el-option
                  v-for="item in downRelate.list"
                  :key="item.flowId"
                  :label="item.name"
                  :value="item.flowId"
                  :disabled="item.disabled"
                  selected>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button type="success" class="button-center" @click="submitForm('ruleForm')">确定</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
  export default {
    name: "addUser",
    components: {},
    data() {
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          // return callback(new Error('手机号不能为空'));
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
        upRelateArr: [],
        downRelateArr: [],
        dialogTableVisible: false,
        upRelate: {value: [], key: null, list: []},
        downRelate: {value: [], key: null, list: []},
        office: {value: '', key: null, list: []},
        parameter: {userName: '', phoneNum: '', userId: ''},
        isEnable: {value: '启用', key: 0, list: [{value: 0, label: '启用'}, {value: 1, label: '禁用'}]},
        ruleForm: {
          upRelate: [],
          downRelate: [],
          channelUser: '',
          institutionUser: '',
          channelContact: '',
          institutionContact: '',
        },
        rules: {
          channelUser: [
            {required: false, message: '请输入渠道联系人', trigger: 'blur'},
            {min: 2, max: 25, message: '长度为2 到 25 个字符', trigger: 'blur'}
          ],
          institutionUser: [
            {required: false, message: '请输入机构联系人', trigger: 'blur'},
            {min: 2, max: 25, message: '长度为2 到 25 个字符', trigger: 'blur'}
          ],
          channelContact: [
            {validator: checkPhone, trigger: 'blur'}
          ],
          institutionContact: [
            {validator: checkPhone, trigger: 'blur'}
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
        this.upRelate.key = val
      },
      institutionValue(val) {
        this.downRelate.key = val
      },
      officeValue(val) {
        this.office.key = val
      },
      isEnableValue(val) {
        console.log(val)
        this.isEnable.key = val
      },
      upRelateArr(val) {
      },
      downRelateArr(val) {
      },
      dialogTableVisible(val) {
        // !val && setTimeout(() => {
        //   this.$refs['ruleForm'].resetFields();
        // }, 0);
      }
    },
    mounted() {
      this.queryOrganizationList()
      this.queryOfficeList()
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addMechanism()
          } else {
            // this.$message('请正确填写表单内容！');
            return false;
          }
        });
      },
      addMechanism() {
        let parameter = {
          "institutionId": this.parameter.institutionId,
          "channelUser": this.ruleForm.channelUser,
          "channelContact": this.ruleForm.channelContact,
          "institutionUser": this.ruleForm.institutionUser,
          "institutionContact": this.ruleForm.institutionContact,
          "father_institutions": this.upRelateArr.join(','),
          "child_institutions": this.downRelateArr.join(',')
        }
        this.$post('/manager/editInstitutionInfo', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message.error(response.msg);
              return
            }
            this.$message({
              message: '编辑成功', type: 'success'
            });
            this.dialogTableVisible = false
            this.$emit('renewList')
          })
      },
      editMechanism(obj) {
        console.log(obj)
        this.parameter = obj
        // this.ruleForm = {}
        this.ruleForm.channelUser = obj.channelUser || ''
        this.ruleForm.channelContact = obj.channelContact || ''
        this.ruleForm.institutionUser = obj.institutionUser || ''
        this.ruleForm.institutionContact = obj.institutionContact || ''
        this.queryRelateInstitutionList(obj.institutionId)

      },
      queryRelateInstitutionList(institutionId) {
        let parameter = {institutionId, relateType: 0}
        this.$post('manager/queryRelateInstitutionList', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message.error(response.msg);
              return
            }
            let arr = []
            let upRelate = response.data.upRelate
            //---------------------------
            this.upRelateArr = []
            for (let i in upRelate) {
              this.upRelateArr.push(upRelate[i].institutionId)
            }
            // this.upRelateArr = upRelate
            let downRelate = response.data.downRelate
            this.downRelateArr = []
            for (let i in downRelate) {
              this.downRelateArr.push(downRelate[i].institutionId)
            }
            // setTimeout(() => {
            //   this.$refs['ruleForm'].resetFields();
            // }, 0);
          })
      },
      changeDialogTableVisible() {
        this.dialogTableVisible = !this.dialogTableVisible
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
                name: m.channelName,
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
            this.upRelate.list = list
            this.downRelate.list = list
          })
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
          })
      },
      treeChangeFun() {
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
