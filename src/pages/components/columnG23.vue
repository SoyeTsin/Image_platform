<template>
  <!--此处的id用变量，方便同一页面引用多次相同的组件-->
  <div class="chart">
    <div class="title">数据趋势</div>
    <div id="main" style="width: 100%;height:400px"></div>
  </div>
</template>

<script>
  // import G2 from '@antv/g2'

  export default {
    data() {
      return {
        chart: null
      };
    },
    props: {
      charData: {
        type: Object,
        default() {
          return {
            data: []
          };
        }
      },
      id: String
    },
    mounted() {
      this.myChart = this.$echarts.init(document.getElementById('main'));
//      this.drawChart();       // 第一步想到的是创建的时候更新图表，但是这个不适用于异步请求接口获取相关数据，所以采用下面的监听的方式
    },
    beforeUpdate() {
//      this.drawChart();
    },
    watch: {
      charData(val, oldVal) {    // 监听charData，当放生变化时，触发这个回调函数绘制图表
        console.log('new: %s, old: %s', val, oldVal);
        this.drawChart(val);
      }
    },
    methods: {
      drawChart(val) {
        app.title = '折柱混合';
        let option = {
          grid: {
            left: 30,
            right: 30,
            bottom: 60,
            top: 10,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#e5e5e5'
              }
            }
          },
          legend: {
            data: [{name: 'AI检出序列', icon: 'rect'}, {name: '上传序列', icon: 'rect'}, {name: 'AI检出占比'}],
            bottom: 20
          },
          xAxis: [
            {
              type: 'category',
              data: val.date,
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '',
              min: 0,
              interval: 25,
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: '',
              show: false,
              min: 0,
              max: 100,
              interval: 25,
              axisLabel: {
                formatter: '{value} %'
              }
            }
          ],
          series: [
            {
              name: 'AI检出序列',
              type: 'bar',
              data: val.aiSeriesCountArr,
              itemStyle: {
                normal: {
                  //颜色渐变
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#B8B1FF'
                  }, {
                    offset: 1,
                    color: '#7567FF'
                  }])
                }
              }
            },
            {
              name: '上传序列',
              type: 'bar',
              data: val.seriesCountArr,
              itemStyle: {
                normal: {
                  //颜色渐变
                  color: '#BEDFFF'
                }
              }
            },
            {
              name: 'AI检出占比',
              type: 'line',
              yAxisIndex: 1,
              data: val.rate,
              itemStyle: {
                normal: {
                  //颜色渐变
                  color: '#FFB74F'
                }
              }
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        this.myChart.setOption(option);
      }
    }
  }
</script>

<style scoped lang="scss">
  .chart {
    width: 100%;
    border: 1px solid #e7e7e7;
    border-radius: 1px;

    .title {
      font-family: MicrosoftYaHei-Bold;
      font-size: 16px;
      color: #32456D;
      text-align: left;
      box-sizing: border-box;
      padding: 20px;
    }
  }
</style>
