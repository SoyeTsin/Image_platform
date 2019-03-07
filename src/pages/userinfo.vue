<template>
  <el-container>
    <el-main>
      <el-row class="text-left main-title">用户列表</el-row>
      <el-row class="text-left main-screen">
        <el-col :span="21">
          <el-button plain type="primary" class="add-button" @click="addUserFun"><i
            class="el-icon-plus"></i>创建账号
          </el-button>
          <el-input v-model="parameter.userName" placeholder="姓名" class="main-input"></el-input>
          <el-select clearable v-model="provinces.value" filterable placeholder="省份或直辖市" class="main-input">
            <el-option
              v-for="item in provinces.list"
              :key="item.provinceCode"
              :label="item.provinceName"
              :value="item.provinceCode">
            </el-option>
          </el-select>
          <el-select clearable v-model="city.value" filterable placeholder="城市" class="main-input">
            <el-option
              v-for="item in city.list"
              :key="item.cityCode"
              :label="item.cityName"
              :value="item.cityCode">
            </el-option>
          </el-select>
          <el-select clearable v-model="institution.value" filterable placeholder="机构" class="main-input">
            <el-option
              v-for="item in upRelate.list"
              :key="item.flowId"
              :label="item.name"
              :value="item.flowId"
              :disabled="item.disabled">
            </el-option>
          </el-select>
          <el-select clearable v-model="office.value" filterable placeholder="科室" class="main-input">
            <el-option
              v-for="item in office.list"
              :key="item.officeId"
              :label="item.officeName"
              :value="item.officeId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3" class="display-right">
          <el-button plain type="primary" class="add-button" @click="refreshFun" style="margin: 0">
            <img src="./assets/chongzhi.png" class="so-icon"/>
          </el-button>
          <el-button type="success" class="search-button" @click="search">查询</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" stripe>
        <el-table-column prop="userName" label="姓名" width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="office.officeName" label="所在科室" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="所在医院" prop="institution.institutionName" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="所在地区" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.institution.provinceName }}{{ scope.row.institution.cityName }}
          </template>
        </el-table-column>
        <el-table-column prop="phoneNum" label="联系方式">
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <img :src="icon_edit" class="table-icon" @click="editUser(scope.row)">
            <!--<img :src="icon_delete" class="table-icon" @click="deleteUser(scope.row)">-->
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="12">
          <div class="page-content">
            共{{pageParameter.total}}条记录，第{{pageParameter.currentPage}}/{{pageParameter.total|totalPageFilter(pageParameter.pageSize)}}页
          </div>
        </el-col>
        <el-col :span="12">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page.sync="pageParameter.currentPage" :page-sizes="pageParameter.pageSizes"
                         :page-size="pageParameter.pageSize"
                         layout="prev, pager, next,sizes,jumper" :total="pageParameter.total">
          </el-pagination>
        </el-col>
      </el-row>
      <addUser ref="addUser" @renewList="getData"></addUser>
    </el-main>
  </el-container>
</template>

<script>
  import icon_delete from './assets/list/delete.png'
  import icon_edit from './assets/list/edit.png'
  import icon_report from './assets/list/report.png'
  import common from './common/common'
  import addUser from './components/addUser'

  export default {
    name: "userInfo",
    components: {addUser},
    data() {
      return {
        icon_delete, icon_report, icon_edit,
        dialogTableVisible: false,
        pageParameter: common.pageParameter,
        upRelate: {value: '', key: null, list: []},
        parameter: {
          userName: "",
          channelId: "",
          institutionId: "",
          provinceCode: "",
          cityCode: "",
          officeId: "",
          pageNum: 1,
          pageSize: common.pageParameter.pageSize
        },
        tableData: [],
        provinces: {value: '', list: []},
        city: {value: '', list: []},
        channel: {value: '', list: []},
        institution: {value: '', list: []},
        office: {value: '', key: null, list: []},
        value: ''
      }
    },
    mounted() {
      this.getData()
      this.queryOfficeList()
      this.queryRegionInfo()
      this.queryOrganizationList()
    },
    filters: {
      totalPageFilter(val, pageSize) {
        let c = val % pageSize
        let a = val - c
        let b = a / pageSize
        let d = b + (c > 0 ? 1 : 0)
        return d
      }
    },
    computed: {
      provincesValue() {
        return this.provinces.value
      },
      cityValue() {
        return this.city.value
      },
      officeValue() {
        return this.office.value
      },
    },
    watch: {
      provincesValue(val) {
        this.queryRegionInfo(val)
        this.city = {value: '', list: []}
        this.queryOrganizationList(true)
      },
      cityValue(val) {
        this.institution = {value: '', list: []}
        this.queryOrganizationList(true)
      },
      officeValue(val) {
        this.office.key = val
      }
    },
    methods: {
      getData() {
        this.$post('/account/queryUserList', this.parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message(response.msg);
              return
            }
            this.tableData = response.data.list
            this.pageParameter.total = response.data.total || 0
            this.pageParameter.nowPage = response.data.pageNum || 0
          })
      },
      queryRegionInfo(provinceCode = '') {
        let parameter = {
          provinceCode
        }
        this.$post('/manager/queryRegionInfo', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message(response.msg);
              return
            }
            if (parameter.provinceCode) {
              this.city.list = response.data
              this.city.value = this.city.list.length > 0 ? this.city.list[0].cityCode : ''
            } else {
              this.provinces.list = response.data
            }
          })
      },
      queryOrganizationList(modle) {
        let parameter = {
          provinceCode: this.provinces.value,
          cityCode: this.city.value,
          dataType: 0
        }
        this.$post('/manager/queryOrganizationList', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message(response.msg);
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
      addUserFun() {
        console.log()
        this.$refs.addUser.changeDialogTableVisible()
        this.$refs.addUser.addUser()
      },
      editUser(user) {
        this.$refs.addUser.changeDialogTableVisible()
        this.$refs.addUser.editUser(user)
      },
      deleteUser(user) {
        //account/delUser
        let parameter = {
          userId: user.userId
        }
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('/account/delUser', parameter)
            .then((response) => {
              if (response.code != '000000') {
                this.$message(response.msg);
                return
              }
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getData()
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      refreshFun() {
        this.parameter.userName = ''
        this.provinces.value = ''
        this.city.value = ''
        this.institution.value = ''
        this.office.value = ''
        this.search()
      },
      search() {
        this.parameter = {
          userName: this.parameter.userName,
          channelId: this.channel.value,
          institutionId: this.institution.value,
          provinceCode: this.provinces.value,
          cityCode: this.city.value,
          officeId: this.office.value,
          pageNum: 1,
          pageSize: common.pageParameter.pageSize
        }
        this.getData()
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.parameter = {
          channelId: this.parameter.channelId,
          institutionId: this.parameter.institutionId,
          provinceCode: this.provinces.value,
          cityCode: this.city.value,
          pageNum: 1,
          pageSize: val
        }
        this.getData()
        this.pageParameter.pageSize = val
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.parameter = {
          userName: this.parameter.userName,
          channelId: this.channel.value,
          institutionId: this.institution.value,
          provinceCode: this.provinces.value,
          cityCode: this.city.value,
          officeId: "",
          pageNum: val,
          pageSize: common.pageParameter.pageSize
        }
        this.getData()
        this.pageParameter.nowPage = val
      },
      openReport() {
        this.$router.push({path: '/personalReport'})
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "sass/common";

</style>
