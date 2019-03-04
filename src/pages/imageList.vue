<template>
  <el-container>
    <el-header>
      <top></top>
    </el-header>
    <el-main>
      <div class="so-content">
        <el-row class="text-left main-title image-list-title">影像列表</el-row>
        <el-row class="text-left image-list-des" v-show="diseaseCount.length>0">
          最近30天筛查出
          <span class="text-color-red" @click="intoReport" v-for="(item, index) in diseaseCount">
            {{item.diseaseSeriesCount}}例疑似{{item.diseaseName}}{{(index+1)==diseaseCount.length?'':'、'}}
          </span>
          ，点击红色字体立即查看
        </el-row>
        <el-row class="text-left main-screen">
          <el-col :span="20">
            <el-button plain type="primary" class="add-button" @click="refresh"><i
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
            <el-select v-model="aiResult.value" placeholder="全部AI病种" class="main-input">
              <el-option
                v-for="item in aiResult.list"
                :key="item.id"
                :label="item.val"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="disease.value" placeholder="全部检查情况" class="main-input">
              <el-option
                v-for="item in disease.list"
                :key="item.id"
                :label="item.val"
                :value="item.id">
              </el-option>
            </el-select>
            <el-date-picker
              type="date"
              v-model="parameter.examDate"
              placeholder="检测日期">
            </el-date-picker>
          </el-col>
          <el-col :span="4" class="display-right">
            <el-button type="success" class="search-button" @click="search">查询</el-button>
          </el-col>
        </el-row>

        <el-table :data="tableData" stripe>
          <el-table-column prop="serialUID" label="影像编号" width="210">
          </el-table-column>
          <el-table-column prop="examDate" label="检查时间" sortable width="150">
          </el-table-column>
          <el-table-column prop="patientName" label="姓名">
          </el-table-column>
          <el-table-column label="性别">
            <template slot-scope="scope">
              {{ scope.row.gender|genderFilter }}
            </template>
          </el-table-column>
          <el-table-column prop="studyAge" label="年龄">
          </el-table-column>
          <el-table-column prop="bodyPartExamined" label="拍摄部位">
          </el-table-column>
          <el-table-column prop="modality" label="检测设备">
          </el-table-column>
          <el-table-column label="AI检测情况">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="light" :content="scope.row.aiMsg" placement="bottom">
                <span>{{scope.row.aiMsg}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="查看影像" placement="bottom">
                <router-link
                  :to="{path:'fjjCT',query:{institutionId:scope.row.institutionId,serialUID: scope.row.serialUID,channelId: scope.row.channelId,diseaseType: scope.row.diseaseType}}">
                  <img src="./assets/image/ck.png" class="table-icon">
                </router-link>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="查看报告" placement="bottom">
                <router-link
                  :to="{path:'personalReport',query:{institutionId:scope.row.institutionId,serialUID: scope.row.serialUID,channelId: scope.row.channelId,diseaseType: scope.row.diseaseType}}">
                  <img src="./assets/image/bg.png" class="table-icon">
                </router-link>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="pageParameter.currentPage" :page-sizes="pageParameter.pageSizes"
                       :page-size="pageParameter.pageSize"
                       layout="sizes, prev, pager, next" :total="pageParameter.total">
        </el-pagination>
      </div>

    </el-main>

  </el-container>
</template>

<script>
  import top from './components/top'
  import common from './common/common'

  export default {
    name: "mechanism",
    components: {top},
    data() {

      return {
        diseaseCount: [],
        channel: {value: '', key: null, list: []},
        institution: {value: '', key: null, list: []},
        disease: {value: '', key: null, list: []},
        aiResult: {value: '', key: null, list: []},
        options: '',
        timeArr: [],
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
    filters: {
      genderFilter(value) {
        if (value == 'm') {
          return '男'
        } else if (value == 'f') {
          return '女'
        } else {
          return '未知'
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
      aiResultValue() {
        return this.aiResult.value
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
        this.institution.key = institutionId
        this.findAllDiseaseTypeCountList(institutionId)
        this.getData()
      },
      diseaseValue(val) {
        console.log(val)
        this.disease.key = val
      },
      aiResultValue(val) {
        this.aiResult.key = val
      }
    },
    mounted() {
      this.diseaseType()
      this.getAiResult()
      this.queryOrganizationList()
    },
    methods: {
      getData(msg = '') {
        this.$post('/api/serials', this.parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message(response.msg);
              return
            }
            if (msg) {
              this.$message(msg);
            }
            this.tableData = response.data.list
            this.pageParameter.total = response.data.total || 0
            this.pageParameter.nowPage = response.data.pageNum || 0
            this.findAllDiseaseTypeCountList()
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
            // this.parameter.aiMsg = response.msg
            this.getData()
          })
      },
      getAiResult() {
        let parameter = {}
        this.$fetch('/api/aiResult', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message(response.msg);
              return
            }
            let list = [];
            for (let i in  response.data) {
              list.push({
                id: i,
                val: response.data[i]
              })
            }
            this.aiResult.list = list
          })
      },
      diseaseType() {
        let parameter = {}
        this.$fetch('/api/diseaseType', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message(response.msg);
              return
            }
            let list = [];
            for (let i in  response.data) {
              list.push({
                id: i,
                val: response.data[i]
              })
            }
            this.disease.list = list
          })
      },
      search() {
        let newDate = new Date(this.parameter.examDate)
        let time = newDate.getFullYear() + '-' + ((newDate.getMonth() + 1) < 10 ? '0' + (newDate.getMonth() + 1) : (newDate.getMonth() + 1)) + '-' + (newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate())
        this.parameter = {
          institutionId: this.institution.key,
          diseaseType: this.disease.key * 1,
          aiMsg: this.aiResult.key,
          examDate: this.parameter.examDate ? time : '',
          pageNum: 1,
          pageSize: common.pageParameter.pageSize
        }
        this.getData()
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        let newDate = new Date(this.parameter.examDate)
        let time = newDate.getFullYear() + '-' + ((newDate.getMonth() + 1) < 10 ? '0' + (newDate.getMonth() + 1) : (newDate.getMonth() + 1)) + '-' + (newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate())
        this.parameter = {
          institutionId: this.institution.key,
          diseaseType: this.disease.key * 1,
          aiMsg: this.aiResult.key,
          examDate: this.parameter.examDate ? time : '',
          pageNum: 1,
          pageSize: val
        }
        this.getData()
      },
      handleCurrentChange(val) {
        let newDate = new Date(this.parameter.examDate)
        let time = newDate.getFullYear() + '-' + ((newDate.getMonth() + 1) < 10 ? '0' + (newDate.getMonth() + 1) : (newDate.getMonth() + 1)) + '-' + (newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate())
        this.parameter = {
          institutionId: this.institution.key,
          diseaseType: this.disease.key * 1,
          aiMsg: this.aiResult.key,
          examDate: this.parameter.examDate ? time : '',
          pageNum: val,
          pageSize: common.pageParameter.pageSize
        }
        this.getData()
      },
      findAllDiseaseTypeCountList() {
        let parameter = {
          institutionId: this.parameter.institutionId,
        }
        this.$post('/api/findAllDiseaseTypeCountList', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message(response.msg);
              return
            }
            this.diseaseCount = response.data
          })
      },
      refresh() {
        this.getData('刷新成功')
      },
      intoReport() {
        this.$router.push({
          name: 'statisticalReport',
          params: {institutionId: this.parameter.institutionId}
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "sass/common";
  .el-header {
    padding: 0;
  }

  .el-main {
    min-width: 1380px;
    box-sizing: border-box;
    padding: 20px;
    background: rgb(246, 246, 246);
    height: 100%;
  }

  .so-content {
    box-sizing: border-box;
    padding: 20px;
    background: #ffffff;
  }

  .image-list-title {
    margin-bottom: 13px;
  }

  .image-list-des {
    margin-bottom: 28px;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    line-height: 16px;

    .text-color-red {
      color: red;
      cursor: pointer;
    }
  }

</style>
