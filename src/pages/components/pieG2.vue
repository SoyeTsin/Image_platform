<template>
  <!--此处的id用变量，方便同一页面引用多次相同的组件-->
  <div class="chart">
    <div class="title">AI检测异常占比</div>
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
          forceFit: true,
          padding: [ 20, 80, 80, 80]
        });
        let chart = this.chart
        chart.source(data, {
          percent: {
            formatter: function formatter(val) {
              val = val * 100 + '%';
              return val;
            }
          }
        });
        chart.coord('theta', {
          radius: 0.75,
          innerRadius: 0.6
        });
        chart.tooltip({
          showTitle: false,
          itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        });
        let conut = 0;
        for (let i in data) {
          conut += data[i].value
        }
        // 辅助文本
        chart.guide().html({
          position: ['50%', '50%'],
          html: '<div style="color:#8c8c8c;font-size: 14px;text-align: center;width: 10em;"><span style="color:#8c8c8c;font-size:20px">' + conut + '</span><br>异常总数</div>',
          alignX: 'middle',
          alignY: 'middle'
        });
        var interval = chart.intervalStack().position('value').color('type').label('type*value', {
          formatter: function formatter(val, item) {
            return val + ': ' + item.point.value;
          },
          offset: 40
        }).tooltip('type*value', function (type, value) {
          let r = value * 100 + '%';
          return {
            name: type,
            value: value,
            r
          };
        }).style({
          lineWidth: 1,
          stroke: '#fff'
        });
        this.chart.render();
        interval.setSelected(data[0]);
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
