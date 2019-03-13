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
        app.title = '';
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
            formatter(params) {
              console.log(params)
              console.log(typeof (params[0].color))
              let relVal = params[0].axisValue
              for (let i = 0, l = params.length; i < l; i++) {
                let color = (typeof (params[i].color) == 'string') ? params[i].color : ('linear-gradient(180deg, ' + params[i].color.colorStops[0].color + ', ' + params[i].color.colorStops[1].color + ');')
                relVal += '<div style="box-sizing:border-box;padding: 0 10px;width: 180px;display: flex;justify-content: space-between;margin: 10px 0 4px 0"><div><div style="float:left;margin:4px;width: 10px;height: 10px;border-radius: 50%;background: ' + color + '"></div>' + params[i].seriesName + ' </div><div> ' + params[i].value + (i == 2 ? '%' : "") + "</div></div>";
              }
              return relVal;
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
              axisTick: {
                alignWithLabel: true
              },
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
