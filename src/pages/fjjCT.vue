<template>
  <el-container>
    <el-aside width="280px" style="background-color:#131f2c;">
      导航
    </el-aside>
    <el-container>
      <el-header height="76px">
        <el-row type="flex" class="header-btn">
        <el-col>
           <p>
            <img src="../../static/fjj-icon/xq.png">
            <span>向前</span>
          </p>
        </el-col>
        <el-col>
           <p>
            <img src="../../static/fjj-icon/xh.png">
            <span>向后</span>
          </p>
        </el-col>
        <!-- <el-col>
           <p>
            <img src="../../static/fjj-icon/bc.png">
            <span>保存</span>
          </p>
        </el-col> -->
        <el-col>
           <p @click="cornerstone.pan()">
            <img src="../../static/fjj-icon/yd.png">
            <span>移动</span>
          </p>
        </el-col>
        <el-col>
           <p @click="cornerstone.zoomIn(0.5)">
            <img src="../../static/fjj-icon/fd.png">
            <span>放大</span>
          </p>
        </el-col>
        <el-col>
           <p @click="cornerstone.rotate(90)">
            <img src="../../static/fjj-icon/xz.png">
            <span>旋转</span>
          </p>
        </el-col>
       
        <el-col>
           <p @click="cornerstone.vFlip()">
            <img src="../../static/fjj-icon/zyfz.png">
            <span>左右翻转</span>
          </p>
        </el-col>
        <el-col>
           <p @click="cornerstone.hFlip()">
            <img src="../../static/fjj-icon/sxfz.png">
            <span>上下翻转</span>
          </p>
        </el-col>
        <el-col>
           <p>
            <img src="../../static/fjj-icon/ckcw.png">
            <span>窗口窗位</span>
          </p>
        </el-col>
        <el-col>
           <p @click="cornerstone.lengthToolFun()">
            <img src="../../static/fjj-icon/cj.png">
            <span>测距</span>
          </p>
        </el-col>
        <el-col>
           <p @click="cornerstone.simpleAngleFun()">
            <img src="../../static/fjj-icon/jdcl.png">
            <span>角度</span>
          </p>
        </el-col>
        <el-col>
           <p>
            <img src="../../static/fjj-icon/jdcl.png">
            <span>标注隐藏</span>
          </p>
        </el-col>
         <el-col>
           <p @click="cornerstone.reset()">
            <img src="../../static/fjj-icon/fy.png">
            <span>复原</span>
          </p>
        </el-col>
        <el-col>
           <p>
            <img src="../../static/fjj-icon/jdcl.png">
            <span>漏诊提醒</span>
          </p>
        </el-col>
        <el-col>
          <p>
            <img src="../../static/fjj-icon/lztx.png">
            <span>退出</span>
          </p>
        </el-col>
      </el-row>
      </el-header>
      <el-main style="padding:0px;">
        <cornerstone-canvas ref="cornerstone"></cornerstone-canvas>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import CornerstoneCanvas from '@/components/CornerstoneCanvas'

export default {
  components: {
    CornerstoneCanvas
  },
  data () {
    return {
      cornerstone:null
    }
  },
  mounted(){
    console.log(this.$refs.cornerstone)
    this.$refs.cornerstone.init().then(()=>{
      this.cornerstone = this.$refs.cornerstone
    })
  },
}
</script>

<style lang="scss" scoped>
  .el-container{
    height: 100%;
    background: #000;
    .el-header{
      color: #fff;
      border-bottom: 1px solid #304F6A;
      .header-btn{
        height: 100%;
        .el-col{
          display: flex;
          justify-content: center;
          align-items: center;
        }
        p{
          width: 100%;
          text-align: center;
        }
        img{
          height: 34px;
        }
        span{
          padding-top: 4px;
          display: block;
          text-align: center;
        }
      }
    }
  }
</style>
