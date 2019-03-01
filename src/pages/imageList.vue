<template>
  <el-container>
    <el-main>
      <el-row class="text-left main-title">影像列表</el-row>
      <el-row class="text-left main-screen">
        <el-col :span="20">
          <el-button plain type="primary" class="add-button" @click="dialogTableVisible = true"><i
            class="el-icon-refresh"></i>刷新数据
          </el-button>
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
          <el-select v-model="value" placeholder="全部AI病种" class="main-input">
            <el-option
              v-for="item in disease.list"
              :key="item.diseaseType"
              :label="item.diseaseName"
              :value="item.diseaseType">
            </el-option>
          </el-select>
          <el-select v-model="value" placeholder="全部检查情况" class="main-input">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker
            type="dates"
            v-model="value6"
            placeholder="检测日期">
          </el-date-picker>
        </el-col>
        <el-col :span="4" class="display-right">
          <el-button type="success" class="search-button">查询</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" stripe>
        <el-table-column prop="name" label="影像编号" width="120">
        </el-table-column>
        <el-table-column prop="name" label="检查时间">
        </el-table-column>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="name" label="性别">
        </el-table-column>
        <el-table-column prop="name" label="年龄">
        </el-table-column>
        <el-table-column prop="name" label="拍摄部位">
        </el-table-column>
        <el-table-column prop="name" label="检测设备">
        </el-table-column>
        <el-table-column prop="name" label="AI检测情况">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" content="AI处理中AI处理中AI处理中AI处理中AI处理中" placement="bottom">
              <span>AI处理中</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看影像" placement="bottom">
              <img src="./assets/image/ck.png" class="table-icon">
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看报告" placement="bottom">
              <img src="./assets/image/bg.png" class="table-icon">
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="pageParameter.currentPage" :page-sizes="pageParameter.pageSizes"
                     :page-size="pageParameter.pageSize"
                     layout="sizes, prev, pager, next" :total="pageParameter.total">
      </el-pagination>
    </el-main>
  </el-container>
</template>

<script>
  import common from './common/common'

  export default {
    name: "mechanism",
    data() {
      return {
        channel: {value: '', key: null, list: []},
        institution: {value: '', key: null, list: []},
        disease: {value: '', key: null, list: []},
        aiResult: {value: '', key: null, list: []},
        options: '',
        value: '',
        value6: '',
        tableData: [],
        pageParameter: common.pageParameter,
        parameter: {
          institutionId: '',
          diseaseType: '',
          aiMsg: '',
          examDate: '',
          pageNum: 1,
          pageSize: common.pageParameter.pageSize
        }
      }
    },
    computed: {
      channelValue() {
        return this.channel.value
      },
      institutionIdValue() {
        return this.institution.value
      },
      diseaseValue() {
        return this.disease.value
      },
    },
    watch: {
      channelValue(val) {
        let channelId = val
        if (val == this.channel.list[0].channelName) {
          channelId = this.channel.list[0].channelId
        }
        this.queryOrganizationList(2, channelId)
      },
      institutionIdValue(val) {
        let institutionId = val
        if (val == this.institution.list[0].institutionName) {
          institutionId = this.institution.list[0].institutionId
        }
        this.findAllDiseaseTypeCountList(institutionId)
      },
      diseaseValue(val) {
        console.log(val)
      }
    },
    mounted() {
      this.diseaseType()
      this.aiResultTypes()
      this.queryOrganizationList()
    },
    methods: {
      getData() {
        this.$post('/api/serials', this.parameter)
          .then((response) => {
            if (response.code != '000000') {diseaseType
              this.$message(response.msg);
              return
            }
            this.tableData = response.data.list
            this.pageParameter.total = response.data.total || 0
            this.pageParameter.nowPage = response.data.pageNum || 0
          })
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
              this.channel.value = response.data.channelList[0].channelName
              this.queryOrganizationList(2, response.data.channelList[0].channelId)
            } else {
              this.institution.list = response.data.institutionList
              this.institution.value = response.data.institutionList[0].institutionName
              this.parameter.institutionId = response.data.institutionList[0].institutionId
            }
          })
      },
      findAllDiseaseTypeCountList(institutionId) {
        let parameter = {
          institutionId
        }
        this.$post('/api/findAllDiseaseTypeCountList', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message(response.msg);
              return
            }
            this.parameter.aiMsg = response.msg
            this.getData()
          })
      },
      aiResultTypes() {
        let parameter = {}
        this.$post('/images/aiResultTypes', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message(response.msg);
              return
            }
            this.aiResultTypes.list = response.data
          })
      },
      diseaseType() {
        let parameter = {}
        this.$post('/api/diseaseType', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message(response.msg);
              return
            }
            this.disease.list = response.data
          })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "sass/common";
</style>
