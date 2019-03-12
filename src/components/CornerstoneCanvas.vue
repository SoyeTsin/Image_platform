<template>
  <div
    class="image-canvas-wrapper"
    oncontextmenu="return false"
    :style="{'width':width,'height':height}"
    unselectable="on"
    onselectstart="return false;"
    onmousedown="return false;"
  >
    <!-- DICOM CANVAS -->
    <div ref="canvas" class="image-canvas" oncontextmenu="return false"></div>
  </div>
</template>

<script>
//引入 cornerstone,dicomParser,cornerstoneWADOImageLoader
import * as cornerstone from "cornerstone-core";
import * as dicomParser from "dicom-parser";
import * as cornerstoneWADOImageLoader from "../../static/dist/cornerstoneWADOImageLoader.js";

// Cornerstone 工具外部依赖
import Hammer from "hammerjs";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneTools from "cornerstone-tools";

// Specify external dependencies
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneWADOImageLoader.external.cornerstoneMath = cornerstoneMath;

//指定要注册加载程序的基石实例
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstone.registerImageLoader("http", cornerstoneWADOImageLoader.loadImage);
cornerstone.registerImageLoader("https", cornerstoneWADOImageLoader.loadImage);

//配置 webWorker (必须配置)
var config = {
  webWorkerPath: "/static/dist/cornerstoneWADOImageLoaderWebWorker.js",
  taskConfiguration: {
    decodeTask: {
      codecsPath: "/static/dist/cornerstoneWADOImageLoaderCodecs.js"
    }
  }
};

cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

export default {
  name: "HelloWorld",
  props: {
    width: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isInitLoad: true,
      element: null,
      isSimpleAngle: false, //默认是否开启角度工具
      isLengthTool: false, //默认是否开启长度工具
      isTagging: false,
      stepList: [],
      remind: false
    };
  },
  methods: {
    init(imageUrl,data) {
      //初始化
      return new Promise((resolve, reject) => {
        // 找到要渲染的元素
        let canvas = (this.element = this.$refs.canvas);
        canvas.addEventListener("cornerstoneimagerendered", e => {
          let viewport = cornerstone.getViewport(e.target);
          this.$store.commit("SET_CORNERSTONE", viewport);
          canvas.addEventListener("mousemove", e => {
            const {
              rows,
              columns,
              data,
              getPixelData,
              slope,
              intercept
            } = cornerstone.getImage(canvas);
            const pixelData = getPixelData();
            let x = e.pageX;
            let y = e.pageY;
            let xx = Math.max(Math.round(x), 0);
            let yy = Math.max(Math.round(y), 0);
            xx = Math.min(xx, columns);
            yy = Math.min(yy, columns);
            const index = yy * columns + xx;
            // const slope = data.string('x00281053');
            // const intercept = data.string('x00281052');
            const pixel = pixelData[index];
            const val = pixel * slope + (intercept - 0);
            // console.log(slope)
            // console.log(intercept)
            const point = {
              x: xx,
              y: yy,
              val
            };
            this.$store.commit("SET_POINT", point);
            // console.log(point)
          });
        });

        // 在 DOM 中将 canvas 元素注册到 cornerstone
        cornerstone.enable(canvas);
        let imageId = "wadouri:" + imageUrl;

        //  Load & Display
        cornerstone.loadAndCacheImage(imageId).then(
          image => {
            // 设置元素视口
            let viewport = cornerstone.getDefaultViewportForImage(
              canvas,
              image
            );
            viewport.voi.windowWidth = 400;
            viewport.voi.windowCenter = 40;
            // 显示图像
            cornerstone.displayImage(canvas, image, viewport);
            if(data&&data.location){//恢复病灶
                this.setEllipticalRoi(data)
            }
            // .string('x00080030')
            // console.log(dicomParser.readTag(canvas))
            // 激活工具
            this.initCanvasTools();
            resolve(cornerstone);
          },
          err => {
            console.log(err)
            reject(err);
          }
        );
      });
    },
    initCanvasTools() {
      let _self = this;
      let canvas = this.$refs.canvas;
      this.isInitLoad = false;

      // 为 canvasStack 找到 imageIds
      // let allImageIds = [];
      // this.exampleStudyImageIds.forEach(function(imageId) {
      //   let imageUrl = "wadouri:" + _self.baseUrl + imageId;
      //   allImageIds.push(imageUrl);
      // });

      let config = {
        // invert: true,
        minScale: 0.2,
        maxScale: 8.0,
        preventZoomOutsideImage: true
      };
      cornerstoneTools.toolColors.setToolColor("#F5A623");
      cornerstoneTools.toolColors.setActiveColor("#06bd98");
      cornerstoneTools.toolStyle.setActiveWidth("2");
      cornerstoneTools.toolStyle.setToolWidth("2");
      cornerstoneTools.zoom.setConfiguration(config);
      // Create canvasStack
      let canvasStack = {
        currentImageIdIndex: 0,
        touchEnabled: false
        // imageIds: allImageIds
      };
      // Enable Inputs
      cornerstoneTools.mouseInput.enable(canvas);
      cornerstoneTools.mouseWheelInput.enable(canvas);
      cornerstoneTools.ellipticalRoi.enable(canvas);
      // cornerstoneTools.touchInput.enable(canvas);
      // Set the stack as tool state
      cornerstoneTools.addStackStateManager(canvas, ["stack"]);
      cornerstoneTools.addToolState(canvas, "stack", canvasStack);
      // cornerstoneTools.stackScrollWheel.activate(canvas); // Mouse wheel
      // cornerstoneTools.scrollIndicator.enable(canvas); // Position indicator
      // Mouse
      // cornerstoneTools.wwwc.activate(canvas, 1); // left click
      cornerstoneTools.pan.activate(canvas, 2); // middle click
      // // Touch / Gesture
      // cornerstoneTools.wwwcTouchDrag.activate(canvas); // - Drag
      // cornerstoneTools.zoomTouchPinch.activate(canvas); // - Pinch
      // cornerstoneTools.panMultiTouch.activate(canvas); // - Multi (x2)
    },
    /*
     * Window Resize
     *
     */
    listenForWindowResize() {
      this.$nextTick(function() {
        window.addEventListener(
          "resize",
          this.debounce(this.onWindowResize, 100)
        );
      });
    },
    onWindowResize() {
      cornerstone.resize(this.$refs.canvas, true);
    },
    /*
     * Utility Methods
     *
     */
    debounce(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this;
        var args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },
    disableAllTools() {
      cornerstoneTools.wwwc.disable(this.element);
      cornerstoneTools.pan.activate(this.element, 2); // 2 is middle mouse button
      // cornerstoneTools.zoom.activate(this.element, 4); // 4 is right mouse button
      cornerstoneTools.probe.deactivate(this.element, 1);
      // cornerstoneTools.length.deactivate(this.element, 1);
      cornerstoneTools.ellipticalRoi.deactivate(this.element, 1);
      cornerstoneTools.rectangleRoi.deactivate(this.element, 1);
      // cornerstoneTools.angle.deactivate(this.element, 1);
      cornerstoneTools.highlight.deactivate(this.element, 1);
      cornerstoneTools.freehand.deactivate(this.element, 1);
      // cornerstoneTools.eraser.deactivate(this.element, 1);
    },
    setEllipticalRoi(data){//绘制病灶
        cornerstoneTools.clearToolState(this.element, "ellipticalRoi"); //清理工具
        if(data&&data.location){
            let xx = Number(data.location.split(',')[0])
            let yy = Number(data.location.split(',')[1])
            let diameter =  Number(data.diameter / 2)
            console.log(xx,yy,diameter)
            let ellipticalRoi = {
              active: false,
              // area: 6151.977806452801,
              color:'#FF1515',
              handles: {
                start: {
                  active: false,
                  highlight: true,
                  x: xx - diameter,
                  y: yy - diameter
                },
                end: {
                  active: false,
                  highlight: true,
                  x: xx + diameter,
                  y: yy + diameter
                },
                textBox: {
                  active: false,
                  drawnIndependently: true,
                  hasBoundingBox: true,
                  hasMoved: false
                }
              },
              invalidated: false,
              visible: true
            };
            cornerstoneTools.addToolState(
              this.element,
              "ellipticalRoi",
              ellipticalRoi
            );
        }
    },
    rotate(rotation) {
      //旋转
      const viewport = cornerstone.getViewport(this.element);
      viewport.rotation += rotation;
      cornerstone.setViewport(this.element, viewport);
    },
    hFlip() {
      //上下翻转
      const viewport = cornerstone.getViewport(this.element);
      viewport.hflip = !viewport.hflip;
      cornerstone.setViewport(this.element, viewport);
    },
    vFlip() {
      //左右翻转
      const viewport = cornerstone.getViewport(this.element);
      viewport.vflip = !viewport.vflip;
      cornerstone.setViewport(this.element, viewport);
    },
    zoom() {
      //放大工具
      return {
        activate: () => {
          this.disableAllTools(this.element);
          cornerstoneTools.zoom.activate(this.element, 5);
          cornerstoneTools.zoomWheel.activate(this.element);
        },
        deactivate: () => {
          cornerstoneTools.zoom.deactivate(this.element);
          cornerstoneTools.zoomWheel.deactivate(this.element);
        }
      };
    },
    zoomFun(scale) {
      const viewport = cornerstone.getViewport(this.element);
      viewport.scale += scale;
      if (viewport.scale > 8) {
        viewport.scale = 8;
      }
      cornerstone.setViewport(this.element, viewport);
    },
    reset() {
      //复原
      cornerstoneTools.clearToolState(this.element, "simpleAngle");
      cornerstoneTools.clearToolState(this.element, "length");
      cornerstone.reset(this.element);
      cornerstone.updateImage(this.element);
    },
    simpleAngle() {
      //角度工具
      return {
        disable: () => {
          //禁用
          cornerstoneTools.simpleAngle.disable(this.element);
        },
        enable: () => {
          //启用
          cornerstoneTools.simpleAngle.enable(this.element);
        },
        activate: () => {
          //激活
          cornerstoneTools.simpleAngle.activate(this.element, 1);
          this.lengthTool().deactivate();
        },
        deactivate: () => {
          //取消激活
          cornerstoneTools.simpleAngle.deactivate(this.element, 1);
        }
      };
    },
    ellipticalRoi(){ //椭圆工具
      return {
        clear:()=>{//清除工具
          console.log('11111')
          cornerstoneTools.clearToolState(this.element, "ellipticalRoi");
        }
      }
    },
    lengthTool() {
      //测量工具
      return {
        disable: () => {
          //禁用
          cornerstoneTools.length.disable(this.element);
        },
        enable: () => {
          //启用
          cornerstoneTools.length.enable(this.element);
        },
        activate: () => {
          //激活
          cornerstoneTools.length.activate(this.element, 1);
          this.simpleAngle().deactivate();
        },
        deactivate: () => {
          //取消激活
          cornerstoneTools.length.deactivate(this.element, 1);
        }
      };
    },
    lengthToolFun() {
      //激活或关闭测量工具
      this.isLengthTool = !this.isLengthTool;
      cornerstoneTools.length.deactivate(this.element, 1);
      let lengthTool = this.lengthTool();
      if (this.isLengthTool) {
        lengthTool.activate();
        this.isSimpleAngle = false;
      } else {
        lengthTool.deactivate();
      }
    },
    simpleAngleFun() {
      //激活或关闭角度工具
      this.isSimpleAngle = !this.isSimpleAngle;
      cornerstoneTools.angle.deactivate(this.element, 1);
      let simpleAngle = this.simpleAngle();
      if (this.isSimpleAngle) {
        simpleAngle.activate();
        this.lengthTool().deactivate();
        this.isLengthTool = false;
      } else {
        simpleAngle.deactivate();
      }
    },
    pan() {
      //移动工具
      return {
        activate: () => {
          //激活
          this.disableAllTools();
          cornerstoneTools.pan.activate(this.element, 3);
        },
        deactivate: () => {
          //冻结
          cornerstoneTools.pan.deactivate(this.element);
          // cornerstoneTools.wwwc.activate(this.element,1);
        }
      };
    },
    tagging() {
      //显示或隐藏标注
      this.isTagging = !this.isTagging;
      if (this.isTagging) {
        this.lengthTool().disable();
        this.simpleAngle().disable();
        cornerstoneTools.ellipticalRoi.disable(this.element);
      } else {
        this.lengthTool().enable();
        this.simpleAngle().enable();
        cornerstoneTools.ellipticalRoi.enable(this.element);
      }
    },
    resize() {
      //重置窗口大小
      cornerstone.resize(this.element);
    },
    windowWidth(ww, wl) {
      //设置窗宽窗位
      let viewport = cornerstone.getViewport(this.element);
      viewport.voi.windowWidth = ww;
      viewport.voi.windowCenter = wl;
      cornerstone.setViewport(this.element, viewport);
    },
    loadImage(imageUrl,data) {
      //切换图片
      let imageId = "wadouri:" + imageUrl;
      cornerstone.loadImage(imageId).then(
        image => {
          // 设置元素视口
          let viewport = cornerstone.getDefaultViewportForImage(
            this.element,
            image
          );
         console.log(data,222222)
          if(data&&data.location){//恢复病灶
              this.setEllipticalRoi(data)
          }else{
              // cornerstoneTools.clearToolState(this.element, "ellipticalRoi"); //清理工具
          }

          viewport.voi.windowWidth = 400;
          viewport.voi.windowCenter = 40;
          cornerstoneTools.clearToolState(this.element, "simpleAngle");
          cornerstoneTools.clearToolState(this.element, "length");
          cornerstone.updateImage(this.element);
          this.isTagging = false
          // 显示图像
          cornerstone.displayImage(this.element, image, viewport);
          // 激活工具
          this.initCanvasTools();
        },
        err => {
          alert(err);
        }
      );
    }
  }
};
</script>
<style scoped>
.image-canvas-wrapper {
  /* width: 100%;
  height: 92vh; */
  margin: 0 auto;
}
.image-canvas {
  width: 100%;
  height: 100%;
}
</style>