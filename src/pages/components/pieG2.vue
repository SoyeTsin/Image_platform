<template>
  <!--此处的id用变量，方便同一页面引用多次相同的组件-->
  <div class="chart">
    <div class="title">2017 年西安居民人均消费支出</div>
    <div :id="id"></div>
  </div>
</template>

<script>
  require('../common/data-set')
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
      this.ds = new DataSet();
      this.chart = new G2.Chart({
        container: this.id,
        forceFit: true,
        padding: 'auto'
      });
      this.chart.guide().html({
        position: ['50%', '50%'],
        html: '<div class="g2-guide-html"><p class="title">总数</p><p class="value">19670</p></div>'
      });
      // this.drawChart()
    },
    beforeUpdate() {
      // this.drawChart();
    },
    watch: {
      charData(val, oldVal) {    // 监听charData，当放生变化时，触发这个回调函数绘制图表
        console.log('new: %s, old: %s', val, oldVal);
        this.drawChart(val);
      }
    },
    methods: {
      drawChart(datas) {
        const that = this
        this.startAngle = -Math.PI / 2 - Math.PI / 4;
        var data = [{"type": "极低数量", "value": 7}, {"type": "较低数量", "value": 9}, {
          "type": "一般数量",
          "value": 3
        }, {"type": "较高数量", "value": 10}, {"type": "极高数量", "value": 7}]
        console.log(JSON.stringify(datas))
        this.dv = this.ds.createView().source(data);
        this.dv.transform({
          type: 'percent',
          field: 'value',
          dimension: 'type',
          as: 'percent'
        });

        this.chart.source(this.dv);
        this.chart.legend(false);
        this.chart.coord('theta', {
          radius: 0.75,
          innerRadius: 0.5,
          startAngle: this.startAngle,
          endAngle: this.startAngle + Math.PI * 2
        });
        this.chart.intervalStack().position('value').color('type', ['#0a4291', '#0a57b6', '#1373db', '#2295ff', '#48adff', '#6fc3ff', '#96d7ff', '#bde8ff']).opacity(1).label('percent', {
          offset: -20,
          textStyle: {
            fill: 'white',
            fontSize: 12,
            shadowBlur: 2,
            shadowColor: 'rgba(0, 0, 0, .45)'
          },
          formatter: function formatter(val) {
            return parseInt(val * 100) + '%';
          }
        });

        this.chart.render();
        //draw label
        this.OFFSET = 20;
        this.APPEND_OFFSET = 50;
        this.LINEHEIGHT = 60;
        this.coord = this.chart.get('coord'); // 获取坐标系对象
        this.center = this.coord.center; // 极坐标圆心坐标
        this.r = this.coord.radius; // 极坐标半径
        this.canvas = null
        this.canvas = this.chart.get('canvas');

        this.canvasWidth = this.chart.get('width');
        this.canvasHeight = this.chart.get('height');
        this.labelGroup = this.canvas.addGroup();
        this.labels = [];
        this.addPieLabel(this.chart);
        this.canvas.draw();
        this.chart.on('afterpaint', function () {
          that.addPieLabel(that.chart);
        });
      },
      addPieLabel() {
        var halves = [[], []];
        var data = this.dv.rows;
        var angle = this.startAngle;

        for (var i = 0; i < data.length; i++) {
          var percent = data[i].percent;
          var targetAngle = angle + Math.PI * 2 * percent;
          var middleAngle = angle + (targetAngle - angle) / 2;
          angle = targetAngle;
          var edgePoint = this.getEndPoint(this.center, middleAngle, this.r);
          var routerPoint = this.getEndPoint(this.center, middleAngle, this.r + this.OFFSET);
          //label
          var label = {
            _anchor: edgePoint,
            _router: routerPoint,
            _data: data[i],
            x: routerPoint.x,
            y: routerPoint.y,
            r: this.r + this.OFFSET,
            fill: '#bfbfbf'
          };
          // 判断文本的方向
          if (edgePoint.x < this.center.x) {
            label._side = 'left';
            halves[0].push(label);
          } else {
            label._side = 'right';
            halves[1].push(label);
          }
        } // end of for

        var maxCountForOneSide = parseInt(this.canvasHeight / this.LINEHEIGHT, 10);
        const that = this
        halves.forEach(function (half, index) {
          // step 2: reduce labels
          if (half.length > maxCountForOneSide) {
            half.sort(function (a, b) {
              return b._percent - a._percent;
            });
            half.splice(maxCountForOneSide, half.length - maxCountForOneSide);
          }

          // step 3: distribute position (x and y)
          half.sort(function (a, b) {
            return a.y - b.y;
          });
          that.antiCollision(half, index);
        });
      },
      getEndPoint(center, angle, r) {

        return {
          x: center.x + r * Math.cos(angle),
          y: center.y + r * Math.sin(angle)
        };
      },
      antiCollision(half, isRight) {
        const that = this
        var startY = that.center.y - that.r - that.OFFSET - that.LINEHEIGHT;
        var overlapping = true;
        var totalH = that.canvasHeight;
        var i = void 0;
        var maxY = 0;
        var minY = Number.MIN_VALUE;
        var boxes = half.map(function (label) {
          var labelY = label.y;
          if (labelY > maxY) {
            maxY = labelY;
          }
          if (labelY < minY) {
            minY = labelY;
          }
          return {
            size: that.LINEHEIGHT,
            targets: [labelY - startY]
          };
        });
        if (maxY - startY > totalH) {
          totalH = maxY - startY;
        }

        while (overlapping) {
          boxes.forEach(function (box) {
            var target = (Math.min.apply(minY, box.targets) + Math.max.apply(minY, box.targets)) / 2;
            box.pos = Math.min(Math.max(minY, target - box.size / 2), totalH - box.size);
          });

          // detect overlapping and join boxes
          overlapping = false;
          i = boxes.length;
          while (i--) {
            if (i > 0) {
              var previousBox = boxes[i - 1];
              var box = boxes[i];
              if (previousBox.pos + previousBox.size > box.pos) {
                // overlapping
                previousBox.size += box.size;
                previousBox.targets = previousBox.targets.concat(box.targets);

                // overflow, shift up
                if (previousBox.pos + previousBox.size > totalH) {
                  previousBox.pos = totalH - previousBox.size;
                }
                boxes.splice(i, 1); // removing box
                overlapping = true;
              }
            }
          }
        }

        // step 4: normalize y and adjust x
        i = 0;
        boxes.forEach(function (b) {
          var posInCompositeBox = startY; // middle of the label
          b.targets.forEach(function () {
            half[i].y = b.pos + posInCompositeBox + that.LINEHEIGHT / 2;
            posInCompositeBox += that.LINEHEIGHT;
            i++;
          });
        });

        // (x - cx)^2 + (y - cy)^2 = totalR^2
        half.forEach(function (label) {
          var rPow2 = label.r * label.r;
          var dyPow2 = Math.pow(Math.abs(label.y - that.center.y), 2);
          if (rPow2 < dyPow2) {
            label.x = that.center.x;
          } else {
            var dx = Math.sqrt(rPow2 - dyPow2);
            if (!isRight) {
              // left
              label.x = that.center.x - dx;
            } else {
              // right
              label.x = that.center.x + dx;
            }
          }
          that.drawLabel(label);
        });
      },
      drawLabel(label) {
        var _anchor = label._anchor,
          _router = label._router,
          fill = label.fill,
          y = label.y;

        var labelAttrs = {
          y: y,
          fontSize: 12, // 字体大小
          fill: '#808080',
          text: label._data.type + '\n' + label._data.value,
          textBaseline: 'bottom'
        };
        var lastPoint = {
          y: y
        };

        if (label._side === 'left') {
          // 具体文本的位置
          lastPoint.x = this.APPEND_OFFSET;
          labelAttrs.x = this.APPEND_OFFSET; // 左侧文本左对齐并贴着画布最左侧边缘
          labelAttrs.textAlign = 'left';
        } else {
          lastPoint.x = this.canvasWidth - this.APPEND_OFFSET;
          labelAttrs.x = this.canvasWidth - this.APPEND_OFFSET; // 右侧文本右对齐并贴着画布最右侧边缘
          labelAttrs.textAlign = 'right';
        }

        // 绘制文本
        var text = this.labelGroup.addShape('Text', {
          attrs: labelAttrs
        });
        this.labels.push(text);
        // 绘制连接线
        var points = void 0;
        if (_router.y !== y) {
          // 文本位置做过调整
          points = [[_anchor.x, _anchor.y], [_router.x, y], [lastPoint.x, lastPoint.y]];
        } else {
          points = [[_anchor.x, _anchor.y], [_router.x, _router.y], [lastPoint.x, lastPoint.y]];
        }

        this.labelGroup.addShape('polyline', {
          attrs: {
            points: points,
            lineWidth: 1,
            stroke: fill
          }
        });
      },
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
