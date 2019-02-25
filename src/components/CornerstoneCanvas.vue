<template>
  <div>
    <div class="image-canvas-wrapper" oncontextmenu="return false" unselectable='on' onselectstart='return false;'
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
      
      element:null,
      isSimpleAngle:false,//默认是否开启角度工具
      isLengthTool:false,//默认是否开启长度工具
      isTagging:false,
      stepList:[]
    };
  },
  methods: {
    step(){//前进后退

    },
    init(imageUrl) { //初始化
      return new Promise((resolve, reject)=>{
          // 找到要渲染的元素
          let canvas  =  this.element =  this.$refs.canvas;
          let then = 
          
          canvas.addEventListener('cornerstoneimagerendered', e=>{
            let viewport = cornerstone.getViewport(e.target);
          });
          // 在 DOM 中将 canvas 元素注册到 cornerstone
          cornerstone.enable(canvas);


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
              
              // console.log(cornerstone.getViewport(canvas))
              resolve(cornerstone)
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
      // let allImageIds = [];
      // this.exampleStudyImageIds.forEach(function(imageId) {
      //   let imageUrl = "wadouri:" + _self.baseUrl + imageId;
      //   allImageIds.push(imageUrl);
      // });

      
      let config = {
          // invert: true,
          minScale: 0.2,
          maxScale: 80.0,
          preventZoomOutsideImage: true
      };
      cornerstoneTools.toolColors.setToolColor('#F5A623');
      cornerstoneTools.toolColors.setActiveColor('#06bd98');
      cornerstoneTools.toolStyle.setActiveWidth('2')
      cornerstoneTools.toolStyle.setToolWidth('2')
      cornerstoneTools.zoom.setConfiguration(config);
      // Create canvasStack
      let canvasStack = {
        currentImageIdIndex: 0,
        // imageIds: allImageIds
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
    disableAllTools(){
        cornerstoneTools.wwwc.disable(this.element);
        cornerstoneTools.pan.activate(this.element, 2); // 2 is middle mouse button
        cornerstoneTools.zoom.activate(this.element, 4); // 4 is right mouse button
        cornerstoneTools.probe.deactivate(this.element, 1);
        // cornerstoneTools.length.deactivate(this.element, 1);
        cornerstoneTools.ellipticalRoi.deactivate(this.element, 1);
        cornerstoneTools.rectangleRoi.deactivate(this.element, 1);
        // cornerstoneTools.angle.deactivate(this.element, 1);
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
    zoom(){//放大工具
      return{
        activate:()=>{
          this.disableAllTools(this.element);
          cornerstoneTools.zoom.activate(this.element, 5);
          cornerstoneTools.zoomWheel.activate(this.element);
        },
        deactivate:()=>{
          cornerstoneTools.zoom.deactivate(this.element);
          cornerstoneTools.zoomWheel.deactivate(this.element);
        }
      }
    },
    zoomFun(scale){
      const viewport = cornerstone.getViewport(this.element);
      viewport.scale += scale;
      cornerstone.setViewport(this.element, viewport);
    },
    reset(){//复原
      cornerstone.reset(this.element);
    },
    simpleAngle(){ //角度工具
      return {
        disable:()=>{//禁用
          cornerstoneTools.simpleAngle.disable(this.element);
        },
        enable:()=>{ //启用
          cornerstoneTools.simpleAngle.enable(this.element);
        },
        activate:()=>{ //激活
          cornerstoneTools.simpleAngle.activate(this.element, 1);
          this.lengthTool().deactivate()
        },
        deactivate:()=>{  //取消激活
          cornerstoneTools.simpleAngle.deactivate(this.element, 1);
        },
      }
    },
    lengthTool(){ //测量工具
      return {
        disable:()=>{//禁用
          cornerstoneTools.length.disable(this.element);
        },
        enable:()=>{ //启用
          cornerstoneTools.length.enable(this.element);
        },
        activate:()=>{ //激活
          cornerstoneTools.length.activate(this.element, 1);
          this.simpleAngle().deactivate()
        },
        deactivate:()=>{  //取消激活
          cornerstoneTools.length.deactivate(this.element, 1);
        },
      }
    },
    lengthToolFun(){//激活或关闭测量工具
      this.isLengthTool = !this.isLengthTool
      cornerstoneTools.length.deactivate(this.element, 1)
      let lengthTool = this.lengthTool()
      if(this.isLengthTool){
        lengthTool.activate()
        this.isSimpleAngle = false
      }else{
        lengthTool.deactivate()
      }
    },
    simpleAngleFun(){//激活或关闭角度工具
      this.isSimpleAngle = !this.isSimpleAngle
      cornerstoneTools.angle.deactivate(this.element, 1);
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
        return {
          activate:()=>{//激活
            this.disableAllTools();
            cornerstoneTools.pan.activate(this.element, 3); 
          },
          deactivate:()=>{//冻结
            cornerstoneTools.pan.deactivate(this.element); 
            // cornerstoneTools.wwwc.activate(this.element,1);
          }
        }
    },
    tagging(){//显示或隐藏标注
      this.isTagging = !this.isTagging
      if(this.isTagging){
          this.lengthTool().disable()
          this.simpleAngle().disable()
      }else{
          this.lengthTool().enable()
          this.simpleAngle().enable()
      }
    },
    resize(){//重置窗口大小
      cornerstone.resize(this.element)
    },
    windowWidth(ww,wl){ //设置窗宽窗位
      let viewport = cornerstone.getViewport(this.element);
      viewport.voi.windowWidth = ww;
      viewport.voi.windowCenter = wl;
      cornerstone.setViewport(this.element, viewport);
    },
    loadImage(imageUrl){//切换图片
        let imageId = "wadouri:" + imageUrl;
        cornerstone.loadImage(imageId).then(
          (image)=>{
            // 设置元素视口
            let viewport = cornerstone.getDefaultViewportForImage(
              this.element,
              image
            );
            // 显示图像
            cornerstone.displayImage(this.element, image, viewport);
            // 激活工具
            this.initCanvasTools();
          },(err)=>{
            alert(err);
          }
        )
    }
  }
};
</script>
<style scoped>
.image-canvas-wrapper {
  width: 100%;
  height: 92vh;
  margin: 0 auto;
}
.image-canvas {
  width: 100%;
  height: 100%;
}
</style>