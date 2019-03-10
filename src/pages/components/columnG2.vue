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
        // 如果图形存在则删除再创建，这个地方感觉稍微有点坑
        // 具体的G2 api函数说明请看上面提供的官网地址，此处不再逐一说明
        this.chart && this.chart.destroy();
        let data = val.datas;
        let dfs = val.dfs;
        this.chart = new G2.Chart({
          id: this.id,
          forceFit: true,
          padding: [20, 60, 130, 80]
        });
        this.chart.source(data, dfs, {
          value: {
            min: 0,   // 坐标轴的起始值
            max: 1,  // 坐标轴的结束值
            formatter: val => {    // 设置坐标轴和提示框的文字
              return val + '%';
            },
            tickInterval: 0.003,  // 设置坐标轴间隔
            alias: '比例'       // 提示信息起别名
          },
        });
        this.chart.scale({
          rate: {
            alias: 'AI占比(%)',
            tickCount: 7
          },
          value: {
            alias: '次数',
            tickCount: 7
          },
          time:{
            alias: '次数',
            tickCount: 7
          }
        });
        this.chart.axis('value', {
          label: {
            textStyle: {
              fill: '#aaaaaa'
            }
          },
          title: {
            offset: 50
          }
        });
        this.chart.tooltip({
          crosshairs: {
            type: 'line'
          }
        });
        this.chart.interval().position('time*value').color('name', ['l(90) 0:#B8B1FF 1:#7567FF', '#BEDFFF']).adjust([{
          type: 'dodge',
          marginRatio: 1 / 32
        }]);
        this.chart.line().position('time*rate').size(2).color('#FFB74F');
        this.chart.legend({
          custom: true,
          allowAllCanceled: true,
          items: [{
            value: 'AI检出序列',
            marker: {
              symbol: 'square',
              fill: 'l(90) 0:#B8B1FF 1:#7567FF',
              radius: 5
            }
          }, {
            value: '上传序列',
            marker: {
              symbol: 'square',
              fill: '#BEDFFF',
              radius: 5,
            }
          }, {
            value: 'AI检出占比',
            marker: {
              symbol: 'hyphen',
              stroke: '#FFB74F',
              radius: 5,
              lineWidth: 3
            }
          }]
        });
        this.chart.render();
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
