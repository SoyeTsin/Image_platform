<template>
  <el-container>
    <el-main>
      <el-row class="text-left main-title">影像列表</el-row>
      <el-row class="text-left main-screen">
        <el-col :span="20">
          <el-button plain type="primary" class="add-button" @click="dialogTableVisible = true"><i
            class="el-icon-refresh"></i>刷新数据
          </el-button>
          <el-select v-model="value" placeholder="所在机构" class="main-input">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="value" placeholder="全部AI病种" class="main-input">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
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
            :current-page.sync="currentPage2" :page-sizes="[100, 200, 300, 400]" :page-size="100"
            layout="sizes, prev, pager, next" :total="1000">
      </el-pagination>
    </el-main>
  </el-container>
</template>

<script>
  export default {
    name: "mechanism",
    data() {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      };
      return {
        value6:'',
        tableData: Array(20).fill(item),
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 4,
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
    }, methods: {
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
  .el-container{
        background-color: #F3F6FC;
        .el-main{
            background: #fff;
            margin: 20px;
            
        }
  }
</style>
