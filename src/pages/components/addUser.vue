<template>
  <el-container>
    <el-dialog title="新建账号" :visible.sync="dialogTableVisible" :append-to-body='true'>
      <el-row class="dialog-item">
        <el-col :span="8" class="dialog-item-title">
          <span class="color-red-star">*</span>用户姓名
        </el-col>
        <el-col :span="16">
          <el-input v-model="parameter.userName"></el-input>
        </el-col>
      </el-row>
      <el-row class="dialog-item">
        <el-col :span="8" class="dialog-item-title">
          <span class="color-red-star">*</span>所属渠道
        </el-col>
        <el-col :span="16">
          <el-select v-model="channel.value" filterable placeholder="渠道" class="main-input">
            <el-option
              v-for="item in channel.list"
              :key="item.channelId"
              :label="item.channelName"
              :value="item.channelId">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="dialog-item">
        <el-col :span="8" class="dialog-item-title">
          <span class="color-red-star">*</span>所处机构
        </el-col>
        <el-col :span="16">
          <el-select v-model="institution.value" filterable placeholder="机构" class="main-input">
            <el-option
              v-for="item in institution.list"
              :key="item.institutionId"
              :label="item.institutionName"
              :value="item.institutionId">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="dialog-item">
        <el-col :span="8" class="dialog-item-title">
          <span class="color-red-star">*</span>所处科室
        </el-col>
        <el-col :span="16">
          <el-select v-model="office.value" filterable placeholder="科室" class="main-input">
            <el-option
              v-for="item in office.list"
              :key="item.officeId"
              :label="item.officeName"
              :value="item.officeId">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="dialog-item">
        <el-col :span="8" class="dialog-item-title">
          <span class="color-red-star">*</span>手机号码
        </el-col>
        <el-col :span="16">
          <el-input v-model="parameter.phoneNum"></el-input>
        </el-col>
      </el-row>
      <el-row class="dialog-item">
        <el-col :span="8" class="dialog-item-title">
          权限
        </el-col>
        <el-col :span="16">
          <el-select v-model="isEnable.value" placeholder="请选择" class="main-input">
            <el-option
              v-for="item in isEnable.list"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="dialog-item">
        <el-button type="success" class="button-center" @click="addUserInfo">创建</el-button>
      </el-row>
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
        isEnable: {value: '启用', key: 0, list: [{value: 0, label: '启用'}, {value: 1, label: '禁用'}]}
      }
    },
    computed: {
      channelValue() {
        return this.channel.value
      },
      institutionValue() {
        return this.institution.value
      },
      officeValue() {
        return this.office.value
      },
      isEnableValue() {
        return this.isEnable.value
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
      addUserInfo() {
        let parameter = {
          userId: this.parameter.userId,
          userName: this.parameter.userName,
          phoneNum: this.parameter.phoneNum,
          institutionId: this.institution.key,
          officeId: this.office.key,
          isEnable: this.isEnable.key
        }
        debugger
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
    }
  }
</script>

<style scoped lang="scss">
  @import "../sass/common";
</style>
