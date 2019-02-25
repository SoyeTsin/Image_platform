<template>
  <el-container>
    <el-main>
      <el-row class="text-left main-title">用户列表</el-row>
      <el-row class="text-left main-screen">
        <el-col :span="20">
          <el-button plain type="primary" class="add-button" @click="dialogTableVisible = true"><i
            class="el-icon-plus"></i>创建账号
          </el-button>
          <el-input v-model="value" placeholder="姓名" class="main-input"></el-input>
          <el-select v-model="value" placeholder="省份或直辖市" class="main-input">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="value" placeholder="城市" class="main-input">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="value" placeholder="机构" class="main-input">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="value" placeholder="科室" class="main-input">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" class="display-right">
          <el-button type="success" class="search-button">搜索</el-button>
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
            <el-input></el-input>
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
          pageNum: 0,
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
        value: ''
      }
    },
    mounted() {
      this.getData()
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
