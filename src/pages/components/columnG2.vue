<template>
  <!--此处的id用变量，方便同一页面引用多次相同的组件-->
  <div :id="id" class="chart"></div>
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
            data: [{'mzkId': 112, 'strftime': "2017-01-11", 'value': 9275501},  // 测试数据，根据自己需求自己设置数据
              {'mzkId': 112, 'strftime': "2017-01-12", 'value': 9281904},
              {'mzkId': 112, 'strftime': "2017-01-13", 'value': 9290777},
              {'mzkId': 112, 'strftime': "2017-01-14", 'value': 9297913},
              {'mzkId': 112, 'strftime': "2017-01-15", 'value': 9306918},
              {'mzkId': 112, 'strftime': "2017-01-16", 'value': 9315641}]
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
          width: 580,
          height: 340
        });
        this.chart.source(data);
        this.chart.scale('value', {
          alias: '占比（%）',
          max: 75,
          min: 0,
          tickCount: 4
        });
        this.chart.axis('type', {
          label: {
            textStyle: {
              fill: '#aaaaaa'
            }
          },
          tickLine: {
            alignWithLabel: false,
            length: 0
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
        this.chart.legend({
          position: 'top-center'
        });
        this.chart.interval().position('type*value').color('company').opacity(1).adjust([{
          type: 'dodge',
          marginRatio: 1 / 32
        }]);
        this.chart.render();
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
