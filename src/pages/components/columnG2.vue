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
      drawChart(datas) {
        // 如果图形存在则删除再创建，这个地方感觉稍微有点坑
        // 具体的G2 api函数说明请看上面提供的官网地址，此处不再逐一说明
        this.chart && this.chart.destroy();
        let data = datas;
        this.chart = new G2.Chart({
          id: this.id,
          forceFit: true
        });
        this.chart.source(data);
        this.chart.scale({
          rate: {
            alias: 'AI占比(%)'
          },
          value:{
            alias: '次数'
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
        this.chart.interval().position('time*value').color('name').adjust([{
          type: 'dodge',
          marginRatio: 1 / 32
        }]);
        this.chart.line().position('time*rate').size(2).color('#FFB74F');
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
    .title{
      font-family: MicrosoftYaHei-Bold;
      font-size: 16px;
      color: #32456D;
      text-align: left;
      box-sizing: border-box;
      padding: 20px;
    }
  }
</style>
