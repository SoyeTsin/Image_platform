<template>
  <el-container>
    <el-header>
      <top></top>
    </el-header>
    <el-main>
      <div class="so-content">
        <el-row class="text-left main-title image-list-title">影像列表</el-row>
        <el-row class="text-left image-list-des">
          <div v-show="diseaseCount.length>0">
            最近30天筛查出
            <span class="text-color-red" @click="intoReport" v-for="(item, index) in diseaseCount" v-if="index==0">
            &nbsp;{{item.diseaseSeriesCount}}&nbsp;例疑似存在肺结节
              <!--例疑似{{item.diseaseName}}{{(index+1)==diseaseCount.length?'':'、'}}-->
          </span>
            ，点击红色字体立即查看
          </div>
        </el-row>
        <el-row class="text-left main-screen">
          <el-col :span="20">
            <el-button plain type="primary" class="add-button" @click="refresh"><i
              class="el-icon-refresh"></i>刷新数据
            </el-button>
            <el-select v-model="institution.value" filterable placeholder="机构" class="main-input main-right">
              <el-option
                v-for="item in institution.list"
                :key="item.institutionId"
                :label="item.institutionName"
                :value="item.institutionId">
              </el-option>
            </el-select>
            <el-select v-model="disease.value" placeholder="全部AI病种" class="main-input">
              <el-option
                v-for="item in disease.list"
                :key="item.id"
                :label="item.val"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select clearable v-model="aiResult.value" placeholder="全部检查情况" class="main-input">
              <el-option
                v-for="item in aiResult.list"
                :key="item.id"
                :label="item.val"
                :value="item.id">
              </el-option>
            </el-select>
            <!--<el-date-picker-->
            <!--v-model="timeArr"-->
            <!--type="daterange"-->
            <!--align="right"-->
            <!--unlink-panels-->
            <!--range-separator="至"-->
            <!--start-placeholder="开始日期"-->
            <!--end-placeholder="结束日期"-->
            <!--:picker-options="pickerOptions2"-->
            <!--&gt;</el-date-picker>-->
            <el-date-picker
              v-model="timeArr"
              type="datetimerange"
              :picker-options="pickerOptions2"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
          </el-col>
          <el-col :span="4" class="display-right">
            <el-button type="success" class="search-button" @click="refreshFun" style="margin: 0">
              <!--<img src="../assets/chongzhi.png" class="so-icon"/>-->
              清空
            </el-button>
            <el-button type="success" class="search-button" @click="search">查询</el-button>
          </el-col>
        </el-row>
        <el-table :data="tableData" stripe :header-cell-style="{background:'#F3F6FC '}">
          <el-table-column prop="serialUID" label="影像编号" width="210">
          </el-table-column>
          <el-table-column prop="examDate" label="检查时间" sortable width="150">
          </el-table-column>
          <el-table-column label="姓名">
            <template slot-scope="scope">{{scope.row.patientName|ifNull}}</template>
          </el-table-column>
          <el-table-column label="性别">
            <template slot-scope="scope">
              {{ scope.row.sex|genderFilter }}
            </template>
          </el-table-column>
          <el-table-column label="年龄">
            <template slot-scope="scope">{{scope.row.studyAge|ifNull}}</template>
          </el-table-column>
          <el-table-column prop="bodyPartExamined" label="拍摄部位">
          </el-table-column>
          <el-table-column prop="modality" label="检测设备">
          </el-table-column>
          <el-table-column label="AI检测情况">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="light" :content="scope.row.aiMsg" placement="bottom">
                <span :style="scope.row.aiCode|msgColorFilter(scope.row.aiMsg)">{{scope.row.aiMsg}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div v-show='scope.row.aiCode=="000000"'>
                <el-tooltip class="item" effect="dark" content="查看影像" placement="bottom">
                  <router-link
                    :to="{path:'fjjCT',query:{institutionId:scope.row.institutionId,serialUID: scope.row.serialUID,channelId: scope.row.channelId,diseaseType: scope.row.diseaseType}}">
                    <img src="../assets/image/ck.png" class="table-icon">
                  </router-link>
                  npm install jsencrypt
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="查看报告" placement="bottom">
                  <router-link
                    :to="{path:'personalReport',query:{institutionId:scope.row.institutionId,serialUID: scope.row.serialUID,channelId: scope.row.channelId,diseaseType: scope.row.diseaseType}}">
                    <img src="../assets/image/bg.png" class="table-icon">
                  </router-link>
                </el-tooltip>
              </div>
              <div v-show='scope.row.aiCode!="000000"'>
                <el-tooltip class="item" effect="dark" placement="bottom" content="无法查看">
                  <img src="../assets/list/listyxh@2x.png" class="table-icon">
                </el-tooltip>
                <el-tooltip class="item" effect="dark" placement="bottom" content="无法查看">
                  <img src="../assets/list/listbgh@2x.png" class="table-icon">
                </el-tooltip>
              </div>
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
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import top from '@/components/top'
  import common from '@/common/common'

  export default {
    name: "mechanism",
    components: {top},
    data() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);

      return {
        diseaseCount: [],
        channel: {value: '', key: null, list: []},
        institution: {value: '', key: null, list: []},
        disease: {value: '', key: null, list: []},
        aiResult: {value: '', key: null, list: []},
        options: '',
        timeArr: null,
        tableData: [],
        pageParameter: common.pageParameter,
        parameter: {
          institutionId: '',
          diseaseType: '',
          aiMsg: '',
          beginDate: '',
          endDate: '',
          pageNum: 1,
          pageSize: common.pageParameter.pageSize
        },
        userInstitution: {},
        pickerOptions2: {
          shortcuts: [
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              }
            }, {
              text: "最近半年",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 182);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
      }
    },
    filters: {
      ifNull(val) {
        if (!val) {
          return '--'
        } else {
          return val
        }
      },
      totalPageFilter(val, pageSize) {
        let c = val % pageSize
        let a = val - c
        let b = a / pageSize
        let d = b + (c > 0 ? 1 : 0)
        return d
      },
      genderFilter(value) {
        if (value == 'M' ||value == 'm' || value == 0 || value == '男') {
          return '男'
        } else if (value == 'F' ||value == 'f' || value == 1 || value == '女') {
          return '女'
        } else {
          return '--'
        }
      },
      msgColorFilter(value, msg) {
        const msgColor = ['#008DFF', '#999999', '#00CB9E', '#FF2929',]
        let coler = ''
        if (value == '000000') {
          coler = msgColor[3]
          if (msg == 'AI检测无异常') {
            coler = msgColor[2]
          }
        } else if (value == '000001') {
          coler = msgColor[2]
        } else if (value.indexOf('0031') == 0) {
          coler = msgColor[1]
        } else {
          coler = msgColor[0]
        }
        if (msg == 'AI检测失败') {
          coler = msgColor[1]
        }
        return 'color:' + coler + ';'
      }
    },
    computed: {
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
      institutionIdValue(val) {
        let institutionId = val
        this.institution.key = institutionId
        this.parameter.institutionId = institutionId
        console.log(institutionId)
        this.findAllDiseaseTypeCountList(institutionId)
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
      this.userInstitution = JSON.parse(localStorage.getItem('institution'))
      this.queryOrganizationList()
    },
    methods: {
      format(time) {
        let str = time.getFullYear() + '-' + ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1)) + '-' + (time.getDate() < 10 ? '0' + time.getDate() : time.getDate()) + ' '
        str += (time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) + ':' + (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ':' + (time.getSeconds() < 10 ? '0' + time.getHours() : time.getSeconds())
        return str
      },
      getData(msg = '') {
        if (this.timeArr && this.timeArr.length > 0) {
          this.parameter.beginDate = this.format(this.timeArr[0])
          this.parameter.endDate = this.format(this.timeArr[1])
        }
        this.$post('/api/serials', this.parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message.error(response.msg);
              return
            }
            this.tableData = response.data.list
            this.pageParameter.total = response.data.total || 0
            this.pageParameter.nowPage = response.data.pageNum || 0
            this.findAllDiseaseTypeCountList()
            if (msg) {
              this.$message({
                message: msg, type: 'success'
              });
            }
          })
      },
      queryOrganizationList(dataType = 1, channelId = '') {
        // 查询上下级机构
        let parameter = {
          relateType: 0,
          institutionId: this.userInstitution.institutionId,
        }
        this.$post('manager/queryRelateInstitutionList', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message.error(response.msg);
              return
            }
            this.institution.list.push(this.userInstitution)
            for (let i in  response.data.downRelate) {
              this.institution.list.push(response.data.downRelate[i])
            }
            this.institution.value = this.userInstitution.institutionId //response.data.downRelate.length > 0 ? response.data.downRelate[0].institutionId : ''
            this.getAiResult()
          })
      },
      findAllDiseaseTypeCountList(institutionId) {
        //副标题统计异常
        let parameter = {
          institutionId
        }
        this.$post('/api/findAllDiseaseTypeCountList', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message.error(response.msg);
              return
            }
            // this.parameter.aiMsg = response.msg
            // this.getData()
          })
      },
      getAiResult() {
        let parameter = {}
        this.$fetch('/api/aiResult', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message.error(response.msg);
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
            // this.aiResult.value = list.length > 0 ? list[0].id : ''
            this.diseaseType()

          })
      },
      diseaseType() {
        let parameter = {}
        this.$fetch('/api/diseaseType', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message.error(response.msg);
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
            this.disease.value = list.length > 0 ? list[0].id : ''
            this.getData()
          })
      },
      refresh() {
        this.institution.value = this.institution.list[0].institutionId
        this.aiResult.value = ''
        this.disease.value = this.disease.list[0].id
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        this.timeArr = []
        this.parameter = {
          institutionId: this.institution.value,
          diseaseType: this.disease.value * 1,
          aiMsg: this.aiResult.value,
          pageNum: 1,
          pageSize: common.pageParameter.pageSize
        }
        this.getData('刷新成功')
      },
      refreshFun() {
        this.institution.value = this.institution.list[0].institutionId
        this.aiResult.value = ''
        this.disease.value = this.disease.list[0].id
        // this.aiResult.value=''
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        this.timeArr = []
        this.parameter = {
          institutionId: this.institution.value,
          diseaseType: this.disease.value * 1,
          aiMsg: this.aiResult.value,
          pageNum: 1,
          pageSize: common.pageParameter.pageSize
        }
        // this.search()
      },
      search() {
        if (this.timeArr && this.timeArr.length > 0) {
          this.parameter.beginDate = this.timeArr[0].getFullYear() + '-' + ((this.timeArr[0].getMonth() + 1) < 10 ? '0' + (this.timeArr[0].getMonth() + 1) : (this.timeArr[0].getMonth() + 1)) + '-' + (this.timeArr[0].getDate() < 10 ? '0' + this.timeArr[0].getDate() : this.timeArr[0].getDate())
          this.parameter.endDate = this.timeArr[1].getFullYear() + '-' + ((this.timeArr[1].getMonth() + 1) < 10 ? '0' + (this.timeArr[1].getMonth() + 1) : (this.timeArr[1].getMonth() + 1)) + '-' + (this.timeArr[1].getDate() < 10 ? '0' + this.timeArr[1].getDate() : this.timeArr[1].getDate())
        }
        this.pageParameter.currentPage = 1
        this.parameter = {
          institutionId: this.institution.value,
          diseaseType: this.disease.value * 1,
          aiMsg: this.aiResult.value,
          pageNum: 1,
          pageSize: common.pageParameter.pageSize
        }
        this.getData()
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        if (this.timeArr && this.timeArr.length > 0) {
          this.parameter.beginDate = this.timeArr[0].getFullYear() + '-' + ((this.timeArr[0].getMonth() + 1) < 10 ? '0' + (this.timeArr[0].getMonth() + 1) : (this.timeArr[0].getMonth() + 1)) + '-' + (this.timeArr[0].getDate() < 10 ? '0' + this.timeArr[0].getDate() : this.timeArr[0].getDate())
          this.parameter.endDate = this.timeArr[1].getFullYear() + '-' + ((this.timeArr[1].getMonth() + 1) < 10 ? '0' + (this.timeArr[1].getMonth() + 1) : (this.timeArr[1].getMonth() + 1)) + '-' + (this.timeArr[1].getDate() < 10 ? '0' + this.timeArr[1].getDate() : this.timeArr[1].getDate())
        }
        this.pageParameter.currentPage = 1
        this.parameter = {
          institutionId: this.institution.value,
          diseaseType: this.disease.value * 1,
          aiMsg: this.aiResult.value,
          pageNum: 1,
          pageSize: val
        }
        this.getData()
        this.pageParameter.pageSize = val
      },
      handleCurrentChange(val) {
        if (this.timeArr && this.timeArr.length > 0) {
          this.parameter.beginDate = this.timeArr[0].getFullYear() + '-' + ((this.timeArr[0].getMonth() + 1) < 10 ? '0' + (this.timeArr[0].getMonth() + 1) : (this.timeArr[0].getMonth() + 1)) + '-' + (this.timeArr[0].getDate() < 10 ? '0' + this.timeArr[0].getDate() : this.timeArr[0].getDate())
          this.parameter.endDate = this.timeArr[1].getFullYear() + '-' + ((this.timeArr[1].getMonth() + 1) < 10 ? '0' + (this.timeArr[1].getMonth() + 1) : (this.timeArr[1].getMonth() + 1)) + '-' + (this.timeArr[1].getDate() < 10 ? '0' + this.timeArr[1].getDate() : this.timeArr[1].getDate())
        }
        this.parameter = {
          institutionId: this.institution.value,
          diseaseType: this.disease.value * 1,
          aiMsg: this.aiResult.value,
          pageNum: val,
          pageSize: common.pageParameter.pageSize
        }
        this.getData()
        this.pageParameter.nowPage = val
      },
      findAllDiseaseTypeCountList() {
        let parameter = {
          institutionId: this.parameter.institutionId,
        }
        this.$post('/api/findAllDiseaseTypeCountList', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.$message.error(response.msg);
              return
            }
            this.diseaseCount = response.data
          })
      },
      intoReport() {
        let institutionName = ''
        for (let i in this.institution.list) {
          if (this.institution.value == this.institution.list[i].institutionId) {
            institutionName = this.institution.list[i].institutionName
          }
        }
        let diseaseName = ''
        for (let i in this.disease.list) {
          if (this.disease.value == this.disease.list[i].id) {
            diseaseName = this.disease.list[i].val
          }
        }
        this.$router.push({
          name: 'statisticalReport',
          query: {institutionId: this.parameter.institutionId, institutionName, diseaseName}
        })
      }
    },

  }
</script>

<style lang="scss" scoped>
  @import "../sass/common";

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
    margin-bottom: 8px;
    height: 26px;
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
