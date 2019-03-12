<template>
  <el-container>
    <el-main>
      <el-row class="text-left main-title">机构管理</el-row>
      <el-row class="text-left main-screen">
        <el-col :span="20">
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
          <el-select clearable v-model="channel.value" filterable placeholder="渠道" class="main-input">
            <el-option
              v-for="item in channel.list"
              :key="item.channelId"
              :label="item.channelName"
              :value="item.channelId">
            </el-option>
          </el-select>
          <el-select clearable v-model="institution.value" filterable placeholder="机构"
                     class="main-input main-right">
            <el-option
              v-for="item in institution.list"
              :key="item.institutionId"
              :label="item.institutionName"
              :value="item.institutionId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" class="display-right">
          <el-button plain type="primary" class="add-button" @click="refreshFun" style="margin: 0">
            <img src="./assets/chongzhi.png" class="so-icon"/>
          </el-button>
          <el-button type="success" class="search-button" @click="search">查询</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" stripe :header-cell-style="{background:'#F3F6FC '}">
        <el-table-column prop="institutionName" label="机构名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="channelName" label="渠道" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="name" label="所在地区" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.provinceName }}{{ scope.row.cityName}}
          </template>
        </el-table-column>
        <el-table-column label="机构接口人" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.institutionUser }}<br>{{ scope.row.institutionContact}}
          </template>
        </el-table-column>
        <el-table-column label="渠道接口人" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.channelUser }}<br>{{ scope.row.channelContact}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="点击编辑" placement="bottom">
              <img :src="icon_edit" class="table-icon" @click="editUser(scope.row)">
            </el-tooltip>
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
      <addMechanism ref="addMechanism" @renewList="getData"></addMechanism>
    </el-main>
  </el-container>
</template>

<script>
  import common from './common/common'
  import icon_edit from './assets/list/edit.png'
  import addMechanism from './components/addMechanism'

  export default {
    name: "mechanism",
    components: {addMechanism},
    data() {
      return {
        icon_edit,
        pageParameter: common.pageParameter,
        parameter: {
          channelId: "",
          institutionId: "",
          provinceCode: "",
          cityCode: "",
          pageNum: 1,
          pageSize: common.pageParameter.pageSize
        },
        tableData: [],
        channel: {value: '', key: null, list: []},
        institution: {value: '', key: null, list: []},
        provinces: {value: '', list: []},
        city: {value: '', list: []},
      }
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
    mounted() {
      this.getData()
      this.queryRegionInfo()
      this.queryOrganizationList()
      this.queryOrganizationList(0)
    },
    computed: {
      provincesValue() {
        return this.provinces.value
      },
      cityValue() {
        return this.city.value
      },
      channelValue() {
        return this.channel.value
      },
      institutionIdValue() {
        return this.institution.value
      },
    },
    watch: {
      provincesValue(val) {
        this.queryRegionInfo(val)
        this.city = {value: '', list: []}
        this.queryOrganizationList()
        this.queryOrganizationList(0)
      },
      cityValue(val) {
        this.queryOrganizationList()
        this.queryOrganizationList(0)
      },
      channelValue(val) {
        let channelId = val
        this.institution = {value: '', list: []}
        this.channel.key = channelId
        if (channelId) {
          this.queryOrganizationList(2, channelId)
        } else {
          this.queryOrganizationList(0)
        }
      },
      institutionIdValue(val) {

      },
    },
    methods: {
      getData() {
        this.$post('/manager/queryInstitutionList', this.parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message.error(response.msg);
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
              this.$message.error(response.msg);
              return
            }
            if (parameter.provinceCode) {
              this.city.list = response.data
              // this.city.value = this.city.list.length > 0 ? this.city.list[0].cityCode : ''
            } else {
              this.provinces.list = response.data
            }
          })
      },
      refreshFun() {
        this.provinces.value = ''
        this.city.value = ''
        this.channel.value = ''
        this.institution.value = ''
        this.institution.list = []
        this.search()
        this.queryOrganizationList()
        this.queryOrganizationList(0)
      },
      search() {
        this.pageParameter.currentPage = 1
        this.parameter = {
          channelId: this.channel.value,
          institutionId: this.institution.value,
          provinceCode: this.provinces.value,
          cityCode: this.city.value,
          pageNum: 1,
          pageSize: common.pageParameter.pageSize
        }
        this.getData()
      },
      editUser(user) {
        this.$refs.addMechanism.changeDialogTableVisible()
        this.$refs.addMechanism.editMechanism(user)
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageParameter.currentPage = 1
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
      queryOrganizationList(dataType = 1, channelId = '') {
        let parameter = {
          provinceCode: this.provinces.value,
          cityCode: this.city.value,
          channelId,
          dataType
        }
        this.$post('/manager/queryOrganizationList', parameter)
          .then((response) => {

            if (response.code != '000000') {
              this.$message.error(response.msg);
              return
            }
            if (dataType == 1) {
              this.channel = {value: '', list: []}
              this.channel.list = response.data.channelList
            } else if (dataType == 0) {
              this.institution = {value: '', list: []}
              let newData = response.data.group
              let list = []
              for (let i in newData) {
                let m = newData[i]
                let y = {}
                for (let j in m.institutions) {
                  y = {
                    institutionName: m.institutions[j].institutionName,
                    institutionId: m.institutions[j].institutionId,
                    type: 1
                  }
                  list.push(y)
                }
                this.institution.list = list
              }
            } else {
              this.institution = {value: '', list: []}
              this.institution.list = response.data.institutionList
            }
          })
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.parameter = {
          channelId: this.parameter.channelId,
          institutionId: this.parameter.institutionId,
          provinceCode: this.provinces.value,
          cityCode: this.city.value,
          pageNum: val,
          pageSize: common.pageParameter.pageSize
        }
        this.getData()
        this.pageParameter.nowPage = val
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "sass/common";

  .two-col {
    padding: 4px 0;
  }
</style>
