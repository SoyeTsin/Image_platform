<template>
  <el-container>
    <el-main>
      <el-row class="text-left main-title">机构管理</el-row>
      <el-row class="text-left main-screen">
        <el-col :span="20">
          <el-select v-model="provinces.value" placeholder="省份或直辖市" class="main-input">
            <el-option
              v-for="item in provinces.list"
              :key="item.provinceCode"
              :label="item.provinceName"
              :value="item.provinceCode">
            </el-option>
          </el-select>
          <el-select v-model="city.value" placeholder="城市" class="main-input">
            <el-option
              v-for="item in city.list"
              :key="item.cityCode"
              :label="item.cityName"
              :value="item.cityCode">
            </el-option>
          </el-select>
          <el-input v-model="parameter.channelId" placeholder="渠道" class="main-input"></el-input>
          <el-input v-model="parameter.institutionId" placeholder="机构" class="main-input"></el-input>
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
        <el-table-column prop="institutionUser" label="机构接口人">
        </el-table-column>
        <el-table-column prop="channelUser" label="渠道接口人">
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
        provinces: {value: '', list: []},
        city: {value: '', list: []},
      }
    },
    mounted() {
      this.getData()
      this.queryRegionInfo()
    },
    computed: {
      provincesValue() {
        return this.provinces.value
      },
      cityValue() {
        return this.city.value
      },
    },
    watch: {
      provincesValue(val) {
        this.queryRegionInfo(val)
        this.city = {value: '', list: []}
      },
      cityValue(val) {
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
          channelId: this.parameter.channelId,
          institutionId: this.parameter.institutionId,
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
</style>
