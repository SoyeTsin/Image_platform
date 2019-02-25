<template>
  <el-container>
    <el-main>
      <el-row class="text-left main-title">用户列表</el-row>
      <el-row class="text-left main-screen">
        <el-col :span="20">
          <el-button plain type="primary" class="add-button" @click="dialogTableVisible = true"><i
            class="el-icon-plus"></i>创建账号
          </el-button>
          <el-input v-model="parameter.userName" placeholder="姓名" class="main-input"></el-input>
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
          <el-select v-model="channel.value" placeholder="机构" class="main-input">
            <el-option
              v-for="item in channel.list"
              :key="item.channelId"
              :label="item.channelName"
              :value="item.channelId">
            </el-option>
          </el-select>
          <el-select v-model="institution.value" placeholder="科室" class="main-input">
            <el-option
              v-for="item in institution.list"
              :key="item.institutionId"
              :label="item.institutionName"
              :value="item.institutionId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" class="display-right">
          <el-button type="success" class="search-button" @click="search">搜索</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" stripe>
        <el-table-column prop="userName" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="office.officeName" label="所在科室">
        </el-table-column>
        <el-table-column prop="institution.institutionName" label="所在医院">
        </el-table-column>
        <el-table-column label="所在地区">
          <template slot-scope="scope">
            {{ scope.row.institution.provinceName }}{{ scope.row.institution.cityName }}
          </template>
        </el-table-column>
        <el-table-column prop="phoneNum" label="联系方式">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <img :src="icon_report" class="table-icon" @click="openReport">
            <img :src="icon_delete" class="table-icon">
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="pageParameter.currentPage" :page-sizes="pageParameter.pageSizes"
                     :page-size="pageParameter.pageSize"
                     layout="sizes, prev, pager, next" :total="pageParameter.total">
      </el-pagination>
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
            <span class="color-red-star">*</span>所属机构
          </el-col>
          <el-col :span="16">
            <el-select v-model="value" placeholder="请选择" class="main-input">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="dialog-item">
          <el-col :span="8" class="dialog-item-title">
            <span class="color-red-star">*</span>所处科室
          </el-col>
          <el-col :span="16">
            <el-select v-model="value" placeholder="请选择" class="main-input">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="dialog-item">
          <el-col :span="8" class="dialog-item-title">
            <span class="color-red-star">*</span>手机号码
          </el-col>
          <el-col :span="16">
            <el-input></el-input>
          </el-col>
        </el-row>
        <el-row class="dialog-item">
          <el-col :span="8" class="dialog-item-title">
            权限
          </el-col>
          <el-col :span="16">
            <el-select v-model="value" placeholder="请选择" class="main-input">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="dialog-item">
          <el-button type="success" class="button-center">创建</el-button>
        </el-row>
      </el-dialog>
    </el-main>

  </el-container>
</template>

<script>
  import icon_delete from './assets/list/delete.png'
  import icon_report from './assets/list/report.png'
  import common from './common/common'

  export default {
    name: "userInfo",
    data() {
      return {
        icon_delete, icon_report,
        dialogTableVisible: false,
        pageParameter: common.pageParameter,
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
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        provinces: {value: '', list: []},
        city: {value: '', list: []},
        channel: {value: '', list: []},
        institution: {value: '', list: []},
        value: ''
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
      channelValue() {
        return this.channel.value
      }
    },
    watch: {
      provincesValue(val) {
        this.queryRegionInfo(val)
        this.city = {value: '', list: []}
      },
      cityValue(val) {
        this.queryOrganizationList()
      },
      channelValue(val) {
        this.queryOrganizationList(2, val)
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
      search() {
        this.parameter = {
          userName: this.parameter.userName,
          channelId: this.channel.value,
          institutionId: this.institution.value,
          provinceCode: this.provinces.value,
          cityCode: this.city.value,
          officeId: "",
          pageNum: 1,
          pageSize: common.pageParameter.pageSize
        }
        this.getData()
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageParameter.pageSize = val
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
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
