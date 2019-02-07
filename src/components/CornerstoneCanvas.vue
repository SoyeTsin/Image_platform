<template>
  <div>
    <div class="image-canvas-wrapper" :style="{cursor:isPan?'all-scroll':'auto'}"  oncontextmenu="return false" unselectable='on' onselectstart='return false;'
      onmousedown='return false;'>
      <!-- DICOM CANVAS -->
      <div ref="canvas" class="image-canvas" oncontextmenu="return false"></div>
    </div>
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
  data() {
    return {
      isInitLoad: true,
      baseUrl: "http://localhost:8686",
      exampleStudyImageIds: [
        "/static/simple-study/000002.dcm",
        "/static/simple-study/000003.dcm",
        "/static/simple-study/000004.dcm",
      ],
      element:null,
      isPan:false,//默认是否开启移动工具
      isSimpleAngle:false,//默认是否开启角度工具
      isLengthTool:false,//默认是否开启长度工具
    };
  },
  methods: {
    init() { //初始化
      return new Promise((resolve, reject)=>{
          // 找到要渲染的元素
          let canvas  =  this.element =  this.$refs.canvas;

          function onImageRendered(e) {
              let viewport = cornerstone.getViewport(e.target);
              console.log(viewport)
          };
          canvas.addEventListener('cornerstoneimagerendered', onImageRendered);
          // 在 DOM 中将 canvas 元素注册到 cornerstone
          cornerstone.enable(canvas);

          // 拼接 url : cornerstoneWADOImageLoader 需要 wadouri 路径头
          const imageUrl = this.baseUrl + this.exampleStudyImageIds[0];
          let imageId = "wadouri:" + imageUrl;

          //  Load & Display
          cornerstone.loadAndCacheImage(imageId).then(
            (image)=>{
              // 设置元素视口
              let viewport = cornerstone.getDefaultViewportForImage(
                canvas,
                image
              );
              // 显示图像
              cornerstone.displayImage(canvas, image, viewport);
              // 激活工具
              this.initCanvasTools();
              resolve()
            },(err)=>{
              reject()
              alert(err);
            }
          );
      })
    },
    initCanvasTools() {
      let _self = this;
      let canvas = this.$refs.canvas;
      this.isInitLoad = false;
      
      // 为 canvasStack 找到 imageIds
      let allImageIds = [];
      this.exampleStudyImageIds.forEach(function(imageId) {
        let imageUrl = "wadouri:" + _self.baseUrl + imageId;
        allImageIds.push(imageUrl);
      });

      
      let config = {
          // invert: true,
          minScale: 0.2,
          maxScale: 80.0,
          preventZoomOutsideImage: true
      };

      cornerstoneTools.zoom.setConfiguration(config);
      // Create canvasStack
      let canvasStack = {
        currentImageIdIndex: 0,
        imageIds: allImageIds
      };
      // Enable Inputs
      cornerstoneTools.mouseInput.enable(canvas);
      cornerstoneTools.mouseWheelInput.enable(canvas);
      cornerstoneTools.touchInput.enable(canvas);
      // Set the stack as tool state
      cornerstoneTools.addStackStateManager(canvas, ["stack"]);
      cornerstoneTools.addToolState(canvas, "stack", canvasStack);
      // cornerstoneTools.stackScrollWheel.activate(canvas); // Mouse wheel
      // cornerstoneTools.scrollIndicator.enable(canvas); // Position indicator
      // Mouse
      cornerstoneTools.wwwc.activate(canvas, 1); // left click
      cornerstoneTools.pan.activate(canvas, 2); // middle click
      cornerstoneTools.zoom.activate(canvas, 4); // right click
      cornerstoneTools.zoomWheel.activate(canvas);
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
    disableAllTools(){
        cornerstoneTools.wwwc.disable(this.element);
        cornerstoneTools.pan.activate(this.element, 2); // 2 is middle mouse button
        cornerstoneTools.zoom.activate(this.element, 4); // 4 is right mouse button
        cornerstoneTools.probe.deactivate(this.element, 1);
        cornerstoneTools.length.deactivate(this.element, 1);
        cornerstoneTools.ellipticalRoi.deactivate(this.element, 1);
        cornerstoneTools.rectangleRoi.deactivate(this.element, 1);
        cornerstoneTools.angle.deactivate(this.element, 1);
        cornerstoneTools.highlight.deactivate(this.element, 1);
        cornerstoneTools.freehand.deactivate(this.element, 1);
        // cornerstoneTools.eraser.deactivate(this.element, 1);
    },
    rotate(rotation){  //旋转
      const viewport = cornerstone.getViewport(this.element);
      viewport.rotation += rotation;
      cornerstone.setViewport(this.element, viewport);
    },
    hFlip(){//上下翻转
        const viewport = cornerstone.getViewport(this.element);
        viewport.hflip = !viewport.hflip;
        cornerstone.setViewport(this.element, viewport);
    },
    vFlip(){//左右翻转
        const viewport = cornerstone.getViewport(this.element);
        viewport.vflip = !viewport.vflip;
        cornerstone.setViewport(this.element, viewport);
    },
    zoomIn(scale){//放大
      const viewport = cornerstone.getViewport(this.element);
      viewport.scale += scale;
      cornerstone.setViewport(this.element, viewport);
      this.disableAllTools(this.element);
      cornerstoneTools.zoom.activate(this.element, 5);
    },
    reset(){//复原
      cornerstone.reset(this.element);
    },
    simpleAngle(){ //角度工具
      return {
        disable:()=>{//禁用
          cornerstoneTools.simpleAngle.disable(this.element);
          return false;
        },
        enable:()=>{ //启用
          cornerstoneTools.simpleAngle.enable(this.element);
          return false;
        },
        activate:()=>{ //激活
          cornerstoneTools.simpleAngle.activate(this.element, 1);
          return false;
        },
        deactivate:()=>{  //取消激活
          cornerstoneTools.simpleAngle.deactivate(this.element, 1);
          return false;
        },
      }
    },
    lengthTool(){ //测量工具
      return {
        disable:()=>{//禁用
          cornerstoneTools.length.disable(this.element);
          return false;
        },
        enable:()=>{ //启用
          cornerstoneTools.length.enable(this.element);
          return false;
        },
        activate:()=>{ //激活
          cornerstoneTools.length.activate(this.element, 1);
          return false;
        },
        deactivate:()=>{  //取消激活
          cornerstoneTools.length.deactivate(this.element, 1);
          return false;
        },
      }
    },
    lengthToolFun(){//激活或关闭测量工具
      this.isLengthTool = !this.isLengthTool
      let lengthTool = this.lengthTool()
      if(this.isLengthTool){
        lengthTool.activate()
        this.simpleAngle().deactivate()
        this.isSimpleAngle = false
      }else{
        lengthTool.deactivate()
      }
    },
    simpleAngleFun(){//激活或关闭角度工具
      this.isSimpleAngle = !this.isSimpleAngle
      let simpleAngle = this.simpleAngle()
      if(this.isSimpleAngle){
        simpleAngle.activate()
        this.lengthTool().deactivate()
        this.isLengthTool = false
      }else{
        simpleAngle.deactivate()
      }
    },
    pan(){//移动工具
        this.isPan = !this.isPan
        if(this.isPan){//激活
            this.disableAllTools();
            cornerstoneTools.pan.activate(this.element, 3); 
        }else{//关闭
            cornerstoneTools.pan.deactivate(this.element); 
            cornerstoneTools.wwwc.activate(this.element,1);
        }
    }
   
  }
};
</script>
<style scoped>
.image-canvas-wrapper {
  width: 100%;
  height: 92vh;
  margin: 0 auto;
  cursor: all-scroll;
}
.image-canvas {
  width: 100%;
  height: 100%;
}
</style>