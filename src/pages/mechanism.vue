<template>
  <el-container>
    <el-main>
      <el-row class="text-left main-title">机构管理</el-row>
      <el-row class="text-left main-screen">
        <el-col :span="20">
          <el-select v-model="value" placeholder="请选择" class="main-input">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="value" placeholder="请选择" class="main-input">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="value" placeholder="渠道" class="main-input"></el-input>
          <el-input v-model="value" placeholder="机构" class="main-input"></el-input>
        </el-col>
        <el-col :span="4" class="display-right">
          <el-button type="success" class="search-button">搜索</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" stripe>
        <el-table-column prop="name" label="机构名称" width="120">
        </el-table-column>
        <el-table-column prop="name" label="渠道">
        </el-table-column>
        <el-table-column prop="name" label="所在地区">
        </el-table-column>
        <el-table-column prop="name" label="机构接口人">
        </el-table-column>
        <el-table-column prop="name" label="渠道接口人">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <img src="./assets/login/username.png" class="table-icon">
            <img src="./assets/login/username.png" class="table-icon">
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
</style>
