<template>
  <!--此处的id用变量，方便同一页面引用多次相同的组件-->
  <div class="chart">
    <div class="title">数据趋势</div>
    <div :id="id"></div>
  </div>
</template>

<script>
  import G2 from '@antv/g2'

  export default {
    data() {
      return {
        chart: null
      };
    },
    props: {
      charData: {
        type: Array,
        default() {
          return {
            data: []
          };
        }
      },
      id: String
    },
    mounted() {
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
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          toolbox: {
            feature: {
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          legend: {
            data: ['蒸发量', '降水量', '平均温度']
          },
          xAxis: [
            {
              type: 'category',
              data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '水量',
              min: 0,
              max: 250,
              interval: 50,
              axisLabel: {
                formatter: '{value} ml'
              }
            },
            {
              type: 'value',
              name: '温度',
              min: 0,
              max: 25,
              interval: 5,
              axisLabel: {
                formatter: '{value} °C'
              }
            }
          ],
          series: [
            {
              name: '蒸发量',
              type: 'bar',
              data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
            },
            {
              name: '降水量',
              type: 'bar',
              data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
            },
            {
              name: '平均温度',
              type: 'line',
              yAxisIndex: 1,
              data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
            }
          ]
        };
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
