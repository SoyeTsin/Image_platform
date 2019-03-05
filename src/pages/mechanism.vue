<template>
  <el-container>
    <el-main>
      <el-row class="text-left main-title">机构管理</el-row>
      <el-row class="text-left main-screen">
        <el-col :span="20">
          <el-select v-model="provinces.value" filterable placeholder="省份或直辖市" class="main-input">
            <el-option
              v-for="item in provinces.list"
              :key="item.provinceCode"
              :label="item.provinceName"
              :value="item.provinceCode">
            </el-option>
          </el-select>
          <el-select v-model="city.value" filterable placeholder="城市" class="main-input">
            <el-option
              v-for="item in city.list"
              :key="item.cityCode"
              :label="item.cityName"
              :value="item.cityCode">
            </el-option>
          </el-select>
          <el-select v-model="channel.value" filterable placeholder="渠道" class="main-input">
            <el-option
              v-for="item in channel.list"
              :key="item.channelId"
              :label="item.channelName"
              :value="item.channelId">
            </el-option>
          </el-select>
          <el-select v-model="institution.value" filterable placeholder="机构" class="main-input main-right">
            <el-option
              v-for="item in institution.list"
              :key="item.institutionId"
              :label="item.institutionName"
              :value="item.institutionId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" class="display-right">
          <el-button type="success" class="search-button" @click="search">查询</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" stripe>
        <el-table-column prop="institutionName" label="机构名称">
        </el-table-column>
        <el-table-column prop="channelName" label="渠道">
        </el-table-column>
        <el-table-column prop="name" label="所在地区">
          <template slot-scope="scope">
            {{ scope.row.provinceName }}{{ scope.row.cityName}}
          </template>
        </el-table-column>
        <el-table-column label="机构接口人">
          <template slot-scope="scope">
            {{ scope.row.institutionUser }}<br>{{ scope.row.institutionContact}}
          </template>
        </el-table-column>
        <el-table-column label="渠道接口人">
          <template slot-scope="scope">
            {{ scope.row.channelUser }}<br>{{ scope.row.channelContact}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <img :src="icon_edit" class="table-icon" @click="editUser(scope.row)">
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="pageParameter.currentPage" :page-sizes="pageParameter.pageSizes"
                     :page-size="pageParameter.pageSize"
                     layout="sizes, prev, pager, next" :total="pageParameter.total">
      </el-pagination>
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
    mounted() {
      this.getData()
      this.queryRegionInfo()
      this.queryOrganizationList()
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
      },
      cityValue(val) {
      },
      channelValue(val) {
        let channelId = val
        if (val == this.channel.list[0].channelName) {
          channelId = this.channel.list[0].channelId
        }
        this.channel.key = channelId
        this.queryOrganizationList(2, channelId)
      },
      institutionIdValue(val) {
        let institutionId = val
        if (val == this.institution.list[0].institutionName) {
          institutionId = this.institution.list[0].institutionId
        }
        this.institution.key = institutionId
      },
    },
    methods: {
      getData() {
        this.$post('/manager/queryInstitutionList', this.parameter)
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
            } else {
              this.provinces.list = response.data
            }
          })
      },
      search() {
        this.parameter = {
          channelId: this.channel.key,
          institutionId: this.institution.key,
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
              // this.channel.value = response.data.channelList[0].channelName
              // this.queryOrganizationList(2, response.data.channelList[0].channelId)
            } else {
              this.institution.list = response.data.institutionList
              // this.institution.value = response.data.institutionList[0].institutionName
              // this.parameter.institutionId = response.data.institutionList[0].institutionId
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
