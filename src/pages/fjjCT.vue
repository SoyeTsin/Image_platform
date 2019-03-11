<template>
  <el-container>
    <el-aside :width="asideWidth" style="background-color:#131f2c;">
      <div class="top">
        <i class="icon-fanhui iconfont" style="cursor: pointer;" @click="asideFun"></i>
        <i style="padding-left: 26.5px;">
          <img src="../../static/fjj-icon/yx.png" alt>
        </i>
        <p>{{detail?detail.modality:''}}</p>
      </div>
      <div class="info">
        <div class="img">
          <cornerstone-canvas height="100%" width="100%" ref="cornerstone1"></cornerstone-canvas>
          <span>{{exampleStudyImageIds.length}}张</span>
        </div>
        <div class="text">
          <p>
            <span>{{detail.patientName}}</span>
            <span>{{detail.sex|genderFilter}}</span>
            {{detail.studyAge}}
            <span>岁</span>
          </p>
          <p>
            <span>{{detail.examDate}}</span>
          </p>
        </div>
      </div>
      <div class="info-list">
        <div class="title">
          <h4>AI检测信息（{{exampleStudyImageIds1.length}}）</h4>
          <span @click="isResult">
            <img src="../../static/fjj-icon/yc.png" alt>
          </span>
        </div>
        <div class="list">
          <div class="nature">
            <span>病灶编号</span>
            <span>描述</span>
            <span>层面</span>
            <span>概率</span>
          </div>
          <ul style="max-height: 264px;overflow-y: scroll;">
            <li
              v-for="(x,index) in exampleStudyImageIds1"
              :class="[index == listIndex?'active':'']"
              :key="index"
              @click="listClick(index,x)"
            >
              <span>{{index+1}}</span>
              <el-popover placement="bottom" width="200" trigger="hover" content="肺结节">
                <span slot="reference">{{x.diseaseTypeDesc?x.diseaseTypeDesc:"肺结节"}}</span>
              </el-popover>
              <span>{{x.imageNo}}</span>
              <span>{{x.probability}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="btn">
        <div class="item" @click="getResult(1);">编辑诊断结果</div>
        <div class="item1" @click="getResult(2);">查看诊断结果
          <!-- <router-link :to="{name:'report',query:$route.query}"></router-link> -->
        </div>
      </div>
    </el-aside>
    <el-container>
      <el-header height="76px">
        <div v-if="!isAside" class="shrink" @click="asideFun">
          <i class="icon-fanhui iconfont"></i>
        </div>
        <el-row type="flex" class="header-btn">
          <!-- <el-col>
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
          </el-col>-->
          <!-- <el-col>
           <p>
            <img src="../../static/fjj-icon/bc.png">
            <span>保存</span>
          </p>
          </el-col>-->
          <el-col :class="[active == 'yd'?'active':'']">
            <p @click="activeFun('yd')">
              <img src="../../static/fjj-icon/yd.png">
              <span>移动</span>
            </p>
          </el-col>
          <el-col :class="[active == 'fd'?'active':'']">
            <p @click="activeFun('fd')">
              <img src="../../static/fjj-icon/fd.png">
              <span>放大</span>
            </p>
          </el-col>
          <el-col :class="[active == 'xz'?'active':'']">
            <p @click="activeFun('xz')">
              <img src="../../static/fjj-icon/xz.png">
              <span>旋转</span>
            </p>
          </el-col>
          <el-col :class="[active == 'zyfz'?'active':'']">
            <p @click="activeFun('zyfz')">
              <img src="../../static/fjj-icon/zyfz.png">
              <span>左右翻转</span>
            </p>
          </el-col>
          <el-col :class="[active == 'sxfz'?'active':'']">
            <p @click="activeFun('sxfz')">
              <img src="../../static/fjj-icon/sxfz.png">
              <span>上下翻转</span>
            </p>
          </el-col>
          <el-col :class="[active == 'ckcw'?'active':'']" style="position: relative;">
            <p @click="activeFun('ckcw')">
              <img src="../../static/fjj-icon/ckcw.png">
              <span>窗口窗位</span>
            </p>
            <i class="xl-icon">
              <img
                :style="{transform:isWindow?'rotateX(180deg)':'rotateX(0deg)'}"
                src="../../static/fjj-icon/xl-icon.png"
                alt
              >
            </i>
            <div class="ckcw" v-if="isWindow">
              <ul>
                <li
                  v-for="(x,index) in windowList"
                  :key="index"
                  :class="[windowIndex == index?'act':'']"
                  @click="windowFun(x.ww,x.wl,index)"
                >{{x.name}}</li>
              </ul>
            </div>
          </el-col>
          <el-col :class="[active == 'cj'?'active':'']">
            <p @click="activeFun('cj')">
              <img src="../../static/fjj-icon/cj.png">
              <span>测距</span>
            </p>
          </el-col>
          <el-col :class="[active == 'jd'?'active':'']">
            <p @click="activeFun('jd')">
              <img src="../../static/fjj-icon/jdcl.png">
              <span>角度</span>
            </p>
          </el-col>
          <el-col :class="[active == 'bzyc'?'active':'']">
            <p @click="activeFun('bzyc')">
              <img src="../../static/fjj-icon/ycbz.png">
              <span>标注隐藏</span>
            </p>
          </el-col>
          <el-col>
            <p @click="activeFun('fy');">
              <img src="../../static/fjj-icon/fy.png">
              <span>复原</span>
            </p>
          </el-col>
          <el-col>
            <el-popover placement="top" v-model="isRemind" width="216" trigger="click">
              <div class="tips">
                <p style="text-align: center;padding-top: 18px;">是否出现漏诊？</p>
                <div class="btn">
                  <span @click="serialImage({missedDiagnosisFlag:0,imageNo:listDetail.imageNo},3)">否</span>
                  <span @click="serialImage({missedDiagnosisFlag:1,imageNo:listDetail.imageNo},3)">是</span>
                </div>
              </div>
              <i slot="reference">
                <p @click="activeFun('lztx')">
                  <img src="../../static/fjj-icon/lztx-1.png">
                  <span>漏诊提醒</span>
                </p>
              </i>
            </el-popover>
          </el-col>
          <el-col>
            <p @click="$router.go(-1)">
              <img src="../../static/fjj-icon/lztx.png">
              <span>退出</span>
            </p>
          </el-col>
        </el-row>
      </el-header>
      <el-main style="padding:0px;" :style="{cursor:active == 'yd'?'all-scroll':'auto'}">
        <div class="zoom" v-if="active == 'fd'">
          <p>使用鼠标滚轮缩放</p>
          <p>{{scale}}%</p>
        </div>
        <el-dialog
          :title="queryDiagnosis&&queryDiagnosis.doctor_desc&&queryDiagnosis.doctor_result?'编辑诊断结果':'诊断结果'"
          :visible.sync="dialogVisible"
          width="660"
          center
          :before-close="handleClose"
        >
          <el-row>
            <el-col :span="24" style="padding:5px 0 14px 0;">影像描述</el-col>
            <el-col :span="24">
              <el-input type="textarea" :rows="5" :maxlength='500' v-model="describe"></el-input>
            </el-col>
            <el-col :span="24" style="padding:30px 0 14px 0;">诊断结果</el-col>
            <el-col :span="24">
              <el-input type="textarea" :rows="5" :maxlength='500' v-model="result"></el-input>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <button
              class="submit"
              v-if="result.length >0&&describe.length>0"
              @click="editResult()"
            >{{queryDiagnosis&&queryDiagnosis.doctor_desc&&queryDiagnosis.doctor_result?'保存':'提交'}}</button>
            <button
              class="submit"
              v-else
              style="opacity: 0.6;"
            >{{queryDiagnosis&&queryDiagnosis.doctor_desc&&queryDiagnosis.doctor_result?'保存':'提交'}}</button>
          </span>
        </el-dialog>
        <div class="popup" v-if="isDetail">
          <div class="title">
            <i></i>
            <h4>AI诊断结果</h4>
            <i @click="isDetail = false">
              <img src="../../static/fjj-icon/yxgb.png" alt>
            </i>
          </div>
          <div class="text">
            <p>病灶描述：{{listDetail.diseaseTypeDesc?listDetail.diseaseTypeDesc:"肺结节"}}</p>
            <p>直径：{{listDetail.diameter}}</p>
            <p>密度：{{listDetail.density}}</p>
            <p>可能概率：{{listDetail.probability}}</p>
            <p>坐标：{{listDetail.location}}</p>
          </div>
          <div class="popup-btn">
            <i @click="sliderSwitch(true)">
              <img src="../../static/fjj-icon/jgl.png" alt>
            </i>
            <i @click="sliderSwitch(false)">
              <img src="../../static/fjj-icon/jgr.png" alt>
            </i>
            <el-popover placement="top" width="216" v-model="isCorrect" trigger="click">
              <div class="tips" style="height: 159px;padding: 8px;">
                <p style="padding-bottom: 20px;">信息修正</p>
                <p
                  style="padding-bottom: 15px;"
                >AI提示：{{listDetail.diseaseTypeDesc?listDetail.diseaseTypeDesc:"肺结节"}}</p>
                <p style="display: flex;padding-bottom: 15px;">
                  <span>实际情况：</span>
                  <span>
                    <input type="text" v-model="correct" placeholder="请输入">
                  </span>
                </p>
                <div class="btn">
                  <span @click="isCorrect = false">取消</span>
                  <span
                    @click="serialImage({diseaseTypeDesc:correct,imageNo:listDetail.imageNo,imageId:listIndex+1,diameter:listDetail.diameter,probability:listDetail.probability,density:listDetail.density,location:listDetail.location},1)"
                  >确定</span>
                </div>
              </div>
              <i slot="reference">
                <img src="../../static/fjj-icon/bjjg.png" alt>
              </i>
            </el-popover>
            <el-popover placement="top" width="216" v-model="isDelete" trigger="click">
              <div class="tips">
                <p style="text-align: center;padding-top: 18px;">是否确定删除AI提示？</p>
                <div class="btn">
                  <span @click="isDelete = false">取消</span>
                  <span
                    @click="serialImage({deleteFlag:1,imageNo:listDetail.imageNo,imageId:listIndex+1,diameter:listDetail.diameter,probability:listDetail.probability,density:listDetail.density,location:listDetail.location,diseaseTypeDesc:listDetail.diseaseTypeDesc?listDetail.diseaseTypeDesc:'肺结节'},2)"
                  >删除</span>
                </div>
              </div>
              <i slot="reference">
                <img src="../../static/fjj-icon/scjg.png" alt>
              </i>
            </el-popover>
          </div>
        </div>
        <div class="direction" style="top:18px;left:50%;transform:translate(-50%,0%);">A</div>
        <div class="direction" style="top:50%;right:18px;transform:translate(0%,-50%);">R</div>
        <div class="direction" style="top:50%;left:18px;transform:translate(0%,-50%);">L</div>
        <div class="direction" style="bottom:18px;left:50%;transform:translate(-50%,0%);">D</div>
        <div class="left-top" style="left:18px;top:18px;">LIDC-IDRI-0586
          <br>CT LUNG SCREEN
        </div>
        <div class="left-bottom" style="left:18px;bottom:18px;">
          X : {{$store.state.point.x}} &nbsp&nbsp Y : {{$store.state.point.y}} &nbsp&nbsp Val : {{$store.state.point.val}}
          <br>
          WW : {{windowWidth}} &nbsp&nbsp WL :{{windowCenter}} 「CT Chest 」
          <br>T : 2.5mm &nbsp&nbsp L : -46.8
          <br>
        </div>
        <div class="right-bottom" style="right:18px;bottom:18px;">50mA &nbsp&nbsp 140KV
          <br>
          {{detail.examDate}}
          <br>
        </div>
        <cornerstone-canvas height="92vh" width="100%" ref="cornerstone"></cornerstone-canvas>
        <div class="right">
          <p>
            <span>{{slider.value+1}}</span>
            /{{exampleStudyImageIds.length}}
          </p>
          <div class="slider">
            <div class="b-t"></div>
            <div class="b-b"></div>
            <vue-slider
              ref="slider"
              :dotSize="slider.dotSize"
              :direction="slider.direction"
              :width="slider.width"
              :reverse="slider.reverse"
              :height="slider.height"
              :max="exampleStudyImageIds.length-1"
              :min="slider.min"
              :tooltip="false"
              :bg-style="slider.bgStyle"
              :slider-style="slider.sliderStyle"
              :process-style="slider.processStyle"
              :tooltip-style="slider.tooltipStyle"
              :dot-width="24"
              :dot-height="38"
              @callback="sliderCallback"
              v-model="slider.value"
            ></vue-slider>
          </div>
          <a @click="sliderSwitch(true)">
            <img src="../../static/fjj-icon/fyxs.png" alt>
          </a>
          <a @click="sliderSwitch(false)">
            <img src="../../static/fjj-icon/fyxx.png" alt>
          </a>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import CornerstoneCanvas from "@/components/CornerstoneCanvas";
import vueSlider from "vue-slider-component";
export default {
  components: {
    CornerstoneCanvas,
    vueSlider
  },
  data() {
    return {
      cornerstone: null,
      asideWidth: "280px",
      isAside: true,
      active: "",
      textarea: "",
      isWindow: false,
      windowList: [
        {
          name: "默认",
          ww: 400,
          wl: 40
        },
        {
          name: "头部扫平  （WW:90,WL:35 )",
          ww: 90,
          wl: 35
        },
        {
          name: "头颅骨窗  （WW:1600,WL:450 )",
          ww: 1600,
          wl: 450
        },
        {
          name: "颈椎  （WW:4000,WL:700 )",
          ww: 4000,
          wl: 700
        },
        {
          name: "肺窗  （WW:1000,WL:-650 )",
          ww: 1000,
          wl: -650
        },
        {
          name: "纵隔窗  （WW:350,WL:40 )",
          ww: 350,
          wl: 40
        },
        {
          name: "腹部  （WW:1500,WL:-700 )",
          ww: 1500,
          wl: -700
        },
        {
          name: "肝脏  （WW:400,WL:40 )",
          ww: 400,
          wl: 40
        },
        {
          name: "关节骨窗  （WW:1600,WL:500 )",
          ww: 1600,
          wl: 500
        },
        {
          name: "血管  （WW:500,WL:40 )",
          ww: 500,
          wl: 40
        }
      ],
      windowIndex: 0,
      dialogVisible: false,
      describe: "",
      result: "",
      slider: {
        direction: "vertical",
        reverse: true,
        width: 2,
        height: 380,
        dotStyle: {
          backgroundColor: "#34EDB6"
        },
        sliderStyle: [
          {
            backgroundColor: "#f05b72"
          },
          {
            backgroundColor: "#3498db"
          }
        ],
        bgStyle: {
          backgroundColor: "#34EDB6"
        },
        processStyle: { backgroundColor: "#34EDB6" },
        max: 10,
        min: 0,
        value: 0,
        tooltipStyle: [
          {
            backgroundColor: "#f05b72",
            borderColor: "#f05b72"
          },
          {
            backgroundColor: "#3498db",
            borderColor: "#3498db"
          }
        ]
      },
      exampleStudyImageIds: [],
      exampleStudyImageIds1: [],
      isRemind: false,
      isCorrect: false,
      isDelete: false,
      isDetail: false,
      detail: {},
      listIndex: 0,
      listDetail: null,
      pixel: {
        pageX: 0,
        pageY: 0
      },
      doctorDesc: "",
      doctorResult: "",
      correct: "",
      queryDiagnosis: null
    };
  },
  methods: {
    isResult() {
      if (this.listDetail.location) {
        this.isDetail = !this.isDetail;
      } else {
        this.isDetail = false;
      }
    },
    getResult(type) {
      //获取诊断结果
      let query = this.$route.query;
      this.$post("/api/queryDiagnosis", {
        institutionId: query.institutionId,
        serialUID: query.serialUID,
        diseaseType: query.diseaseType,
        channelId: query.channelId
      }).then(res => {
        if (res.code == "000000") {
          if (type == 1) {
            this.queryDiagnosis = res.data;
            if(res.data){
                this.describe = res.data.doctor_desc;
                this.result = res.data.doctor_result;
            }
            this.dialogVisible = true;
            console.log(this.dialogVisible)
          } else if (type == 2) {
            if (res.data && res.data.doctor_result && res.data.doctor_desc) {
              this.$router.push({ name: "report", query: this.$route.query });
            } else {
              this.$message({
                message: "没有提交诊断结果",
                type: "warning"
              });
            }
          }
        }
      });
    },
    editResult() {
      //提交诊断结果
      this.$post(
        "/api/diagnosis",
        Object.assign(this.$route.query, {
          doctorDesc: this.describe,
          doctorResult: this.result
        })
      ).then(res => {
        console.log(res);
      });
      this.dialogVisible = false;
    },
    serialImage(obj, type) {
      let query = this.$route.query;
      //保存方法  type:1 编辑  2删除  3漏诊提醒
      let data = Object.assign(query, obj);
      if (type == 1) {
        this.$post("/api/serialImage", data).then(res => {
          if (res.code == "000000") {
            this.exampleStudyImageIds[
              obj.imageId - 1
            ].diseaseTypeDesc = this.correct;
            this.$message({
              message: "修正成功",
              type: "success"
            });
            this.isCorrect = false;
            this.correct = "";
          }
        });
      } else if (type == 2) {
        //2删除
        this.$post("/api/serialImage", data).then(res => {
          if (res.code == "000000") {
            if (data.deleteFlag == 1) {
              this.exampleStudyImageIds.map((v, k) => {
                if (v.imageNo == obj.imageNo) {
                  let delData = {
                    deletedFalg: null,
                    density: null,
                    diameter: null,
                    diseaseTypeDesc: null,
                    imageId: null,
                    imageNo: v.imageNo,
                    imageUrl: v.imageUrl,
                    location: null,
                    missedDiagnosisFlag: null,
                    probability: null
                  };
                  this.listDetail = delData;
                  this.isDetail = false;
                  this.exampleStudyImageIds[k] = delData;
                  this.cornerstone.loadImage(
                    this.exampleStudyImageIds[this.$refs.slider.getIndex()]
                      .imageUrl,
                    this.exampleStudyImageIds[this.$refs.slider.getIndex()]
                  );
                  this.cornerstone1.loadImage(
                    this.exampleStudyImageIds[this.$refs.slider.getIndex()]
                      .imageUrl,
                    this.exampleStudyImageIds[this.$refs.slider.getIndex()]
                  );
                }
              });
              this.$message({
                message: "删除成功",
                type: "success"
              });
            }
          }
        });
        this.isDelete = false;
      } else if (type == 3) {
        this.$post("/api/image/missDiagnosis", data).then(res => {
          if (res.code == "000000") {
            if (data.missedDiagnosisFlag == 1) {
              this.$message({
                message: "已提交漏诊提醒，我们将会近一步核对详情",
                type: "success"
              });
            }
            this.isRemind = false;
          }
        });
      }
    },
    listClick(index, data) {
      //点击列表
      this.listIndex = index;
      this.listDetail = data;
      if (data.location) {
        this.isDetail = true;
      } else {
        this.isDetail = false;
      }
      this.exampleStudyImageIds.map((v,k)=>{
        if(data.imageNo == v.imageNo){
          this.$refs.slider.setIndex(k);
          this.cornerstone.loadImage(
            this.exampleStudyImageIds[k].imageUrl,
            this.exampleStudyImageIds[k]
          );
        }
      })
      
      // console.log(data)
      // this.$refs.slider.setIndex(index);
      // this.cornerstone.loadImage(
      //   this.exampleStudyImageIds[this.$refs.slider.getIndex()].imageUrl,
      //   this.exampleStudyImageIds[this.$refs.slider.getIndex()]
      // );
    },
    sliderCallback() {
      //拖动回调
      this.cornerstone.loadImage(
        this.exampleStudyImageIds[this.$refs.slider.getIndex()].imageUrl,
        this.exampleStudyImageIds[this.$refs.slider.getIndex()]
      );
      this.cornerstone1.loadImage(
        this.exampleStudyImageIds[this.$refs.slider.getIndex()].imageUrl,
        this.exampleStudyImageIds[this.$refs.slider.getIndex()]
      );
      // this.listIndex = this.$refs.slider.getIndex();
      this.listDetail = this.exampleStudyImageIds[this.slider.value];
      if (this.listDetail.location) {
        this.isDetail = true;
      } else {
        this.isDetail = false;
      }
      this.windowFun(400, 40, 0);
    },
    sliderSwitch(type) {
      //切换
      if (type) {
        if (this.$refs.slider.getIndex() != 0) {
          this.$refs.slider.setIndex(this.$refs.slider.getIndex() - 1);
        }
      } else {
        if (this.$refs.slider.getIndex() != this.slider.max) {
          this.$refs.slider.setIndex(this.$refs.slider.getIndex() + 1);
        }
      }
      this.cornerstone.loadImage(
        this.exampleStudyImageIds[this.slider.value].imageUrl,
        this.exampleStudyImageIds[this.slider.value]
      );
      this.cornerstone1.loadImage(
        this.exampleStudyImageIds[this.slider.value].imageUrl,
        this.exampleStudyImageIds[this.slider.value]
      );
      // this.listIndex = this.$refs.slider.getIndex();
      this.listDetail = this.exampleStudyImageIds[this.slider.value];
      if (this.listDetail.location) {
        this.isDetail = true;
      } else {
        this.isDetail = false;
      }
      this.windowFun(400, 40, 0);
    },
    handleClose(done) {
      //弹窗关闭回调
      if (
        this.queryDiagnosis &&
        this.queryDiagnosis.doctor_result &&
        this.queryDiagnosis.doctor_desc
      ) {
        //编辑结果
        if (
          this.describe != this.queryDiagnosis.doctor_desc ||
          this.result != this.queryDiagnosis.doctor_result
        ) {
          this.$confirm("内容未提交，是否直接关闭？")
            .then(_ => {
              done();
            })
            .catch(_ => {});
        } else {
          done();
        }
      } else {
        //提交结果
        if (this.describe.length > 1 && this.result.length > 1) {
          this.$confirm("内容未提交，是否直接关闭？")
            .then(_ => {
              done();
            })
            .catch(_ => {});
        } else {
          done();
        }
      }
    },
    windowFun(ww, wl, index) {
      //调整窗口窗位
      this.windowIndex = index;
      this.cornerstone.windowWidth(ww, wl);
    },
    asideFun() {
      //是否全屏
      this.isAside = !this.isAside;
      if (this.isAside) {
        this.asideWidth = "280px";
      } else {
        this.asideWidth = "0";
      }
      setTimeout(() => {
        this.cornerstone.resize();
      });
    },
    activeFun(data) {
      //工具方法
      this.active = data;
      this.cornerstone.zoom().deactivate();
      this.cornerstone.pan().deactivate();
      this.cornerstone.lengthTool().deactivate();
      switch (data) {
        case "yd":
          this.cornerstone.pan().activate();
          break;
        case "xz":
          this.cornerstone.rotate(90);
          break;
        case "fd":
          this.cornerstone.zoom().activate();
          break;
        case "zyfz":
          this.cornerstone.vFlip();
          break;
        case "sxfz":
          this.cornerstone.hFlip();
          break;
        case "cj":
          this.cornerstone.lengthTool().activate();
          this.cornerstone.pan().deactivate();
          break;
        case "jd":
          this.cornerstone.simpleAngle().activate();
          this.cornerstone.pan().deactivate();
          break;
        case "bzyc":
          this.cornerstone.tagging();
          break;
        case "fy":
          this.cornerstone.reset();
          this.active = "";
          this.windowFun(400, 40, 0);
          break;
      }

      if (this.active == "fd") {
        this.cornerstone.zoomFun(0.5);
      }

      if (this.active == "ckcw") {
        //是否显示窗宽床位
        this.isWindow = !this.isWindow;
      } else {
        this.isWindow = false;
      }
    }
  },
  created() {
    let data = this.$route.query;
    this.$post("/api/serial", data).then(res => {
      this.detail = res.data;
    });
     this.$post("/api/listOriginalImages", data).then(res => {
      this.exampleStudyImageIds = res.data;
      this.slider.max = res.data.lenght - 1;
       this.$post("/api/serialImages", data).then(res => {
        this.exampleStudyImageIds1 = res.data;
        this.listDetail = this.exampleStudyImageIds1[0];
        this.exampleStudyImageIds.map((v,k)=>{
          this.exampleStudyImageIds1.map((n,m)=>{
            if(v.imageNo == n.imageNo){
                this.exampleStudyImageIds[k] = n
            }
          })
        })
         setTimeout(() => {
          this.$refs.cornerstone
            .init(
              this.exampleStudyImageIds[0].imageUrl,
              this.exampleStudyImageIds[0]
            )
            .then(res => {
              //初始化工具
              this.cornerstone = this.$refs.cornerstone;
            });
          this.$refs.cornerstone1
            .init(this.exampleStudyImageIds[0].imageUrl)
            .then(res => {
              //初始化缩略图
              this.cornerstone1 = this.$refs.cornerstone1;
            });
        }, 100);
      });
     
    });
    this.$post("/api/serialImages", data).then(res => {
      this.exampleStudyImageIds1 = res.data;
      // this.slider.max = res.data.lenght - 1;
      this.listDetail = this.exampleStudyImageIds1[0];
      // setTimeout(() => {
      //   this.$refs.cornerstone
      //     .init(
      //       this.exampleStudyImageIds[0].imageUrl,
      //       this.exampleStudyImageIds[0]
      //     )
      //     .then(res => {
      //       //初始化工具
      //       this.cornerstone = this.$refs.cornerstone;
      //     });
      //   this.$refs.cornerstone1
      //     .init(this.exampleStudyImageIds[0].imageUrl)
      //     .then(res => {
      //       //初始化缩略图
      //       this.cornerstone1 = this.$refs.cornerstone1;
      //     });
      // }, 100);
    });
  },
  computed: {
    windowWidth() {
      return this.$store.state.cornerstone.voi
        ? this.$store.state.cornerstone.voi.windowWidth
        : "";
    },
    windowCenter() {
      return this.$store.state.cornerstone.voi
        ? this.$store.state.cornerstone.voi.windowCenter
        : "";
    },
    scale() {
      return this.$store.state.cornerstone.scale
        ? Math.round(this.$store.state.cornerstone.scale * 100)
        : "";
    }
  },
  filters: {
    genderFilter(value) {
      if (value == "m") {
        return "男";
      } else if (value == "f") {
        return "女";
      } else {
        return "--";
      }
    },
    toFixedTwo(value) {
      return Number(value).toFixed(2);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
  background: #000;
  .zoom {
    position: absolute;
    top: 20px;
    z-index: 10;
    left: 50%;
    transform: translate(-50%, 0%);
    p {
      display: block;
      height: 40px;
      text-align: center;
      line-height: 40px;
      margin-bottom: 10px;
      width: 200px;
      border: 1px solid #0bc69f;
      background: #00000078;
      color: #fff;
    }
  }
  .xl-icon {
    position: absolute;
    top: 16px;
    left: 50%;
    margin-left: 18px;
    img {
      width: 18px;
      height: 18px !important;
      padding-top: 0px !important;
    }
  }
  .el-main {
    position: relative;
    .direction,
    .left-top,
    .left-bottom,
    .right-bottom {
      color: #fff;
      position: absolute;
      text-align: left;
    }
  }
  .popup {
    position: absolute;
    left: 20px;
    top: 64px;
    width: 252px;
    height: 255px;
    border: 1px solid #0bc69f;
    background: #00000078;
    color: #fff;
    z-index: 10;
    .title {
      height: 44px;
      line-height: 44px;
      font-size: 16px;
      border-bottom: 1px solid #304f6a4f;
      display: flex;
      justify-content: space-between;
      i {
        width: 26px;
        padding-top: 10px;
        padding-right: 10px;
      }
    }
    .text {
      height: 125px;
      font-size: 15px;
      padding: 20px;
      line-height: 26px;
      text-align: left;
    }
    .popup-btn {
      height: 44px;
      border-top: 1px solid #304f6a4f;
      display: flex;
      i,
      span {
        flex: 0 1 25%;
        padding: 10px 0;
        text-align: center;
        img {
          height: 24px;
        }
      }
    }
  }
  .btn {
    position: absolute;
    left: 20px;
    bottom: 40px;
    cursor: pointer;
    .item,
    .item1 {
      width: 240px;
      height: 44px;
      border: 1px solid #00adf5;
      box-shadow: inset 0 1px 20px 0 #00adf5;
      font-size: 16px;
      color: #ffffff;
      line-height: 44px;
      font-weight: bold;
    }
    .item1 {
      border: 1px solid #31c198;
      box-shadow: inset 0 1px 20px 0 #2b9e80;
      margin-top: 16px;
      a {
        color: #ffffff;
      }
    }
  }
  .info-list {
    border-bottom: 1px solid #304f6a4f;
    .title {
      color: #fff;
      display: flex;
      justify-content: space-between;
      padding: 20px 20px 0 20px;
      img {
        width: 22px;
      }
    }
    .nature {
      font-size: 12px;
      color: #98f4e2;
      padding: 20px;
      display: flex;
      padding-right: 0;
      span {
        flex: 0 1 25%;
      }
    }
    .list {
      ul {
        li {
          line-height: 44px;
          display: flex;
          padding-left: 20px;
          cursor: pointer;
          span {
            flex: 0 1 25%;
            color: #fff;
            font-size: 12px;
          }
          &:nth-child(odd) {
            background: #000000;
          }
        }
        .active {
          border-left: 4px solid #34edb6;
          padding-left: 16px;
        }
      }
    }
  }
  .info {
    color: #fff;
    border-bottom: 1px solid #304f6a4f;
    height: 68px;
    display: flex;
    padding: 20px 0;
    font-size: 14px;
    .img {
      padding: 0 20px;
      width: 69px;
      height: 69px;
      position: relative;
      img {
        display: block;
        width: 100%;
        height: 100%;
        border: 1px solid #34edb6;
      }
      span {
        font-size: 12px;
        position: absolute;
        bottom: 5px;
        left: 0;
        text-align: center;
        width: 100%;
      }
    }
    .text {
      padding-left: 10px;
      p {
        padding-bottom: 14px;
        span {
          padding-right: 10px;
        }
      }
    }
  }
  .ckcw {
    width: 260px;
    background: #fff;
    position: absolute;
    top: 76px;
    left: 0;
    background: #1e2c39;
    box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.5);
    z-index: 10;
    ul {
      overflow: hidden;
      li {
        border-bottom: 1px solid #101e2a;
        line-height: 52px;
        text-align: left;
        text-indent: 40px;
        cursor: pointer;
      }
    }
    .act {
      background: #121e28;
    }
  }
  .right {
    position: absolute;
    right: 25px;
    top: 117px;
    width: 85px;
    p {
      font-size: 16px;
      color: #0bc69f;
      font-weight: bold;
      text-align: center;
      span {
        font-size: 26px;
      }
    }
    a {
      display: block;
      width: 40px;
      height: 40px;
      color: #fff;
      margin: 8px auto 0 auto;
      line-height: 40px;
      text-align: center;
    }
    .slider {
      position: relative;
      width: 26px;
      height: 380px;
      margin: 0 auto;
      .b-t,
      .b-b {
        position: absolute;
        left: 7px;
        z-index: 1;
        height: 20px;
        width: 12px;
        display: flex;
        justify-content: center;
        &::after {
          content: "";
          display: block;
          height: 20px;
          width: 2px;
          background: #34edb6;
        }
      }
      .b-t {
        top: 0;
        border-top: 2px solid #34edb6;
      }
      .b-b {
        bottom: 0;
        border-bottom: 2px solid #34edb6;
      }
    }
  }
  .shrink {
    width: 60px;
    margin-right: 232px;
    background-image: linear-gradient(90deg, #132332 0%, #0c1924 100%);
    cursor: pointer;
    i {
      color: #fff;
      font-size: 22px;
      line-height: 75px;
      transform: rotateY(180deg);
      display: block;
    }
  }
  .top {
    color: #fff;
    font-size: 16px;
    display: flex;
    height: 75px;
    border-bottom: 1px solid #304f6a4f;
    align-items: center;
    i {
      font-size: 22px;
      padding-left: 22px;
      img {
        height: 26px;
      }
    }
    p {
      padding-left: 7px;
    }
  }
  .el-header {
    color: #fff;
    border-bottom: 1px solid #304f6a;
    padding: 0;
    display: flex;
    .header-btn {
      height: 100%;
      width: 100%;
      .active {
        span {
          border-bottom: 4px solid #34edb6;
          padding-bottom: 4px;
        }
      }
      .el-col {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      p {
        width: 100%;
        text-align: center;
      }
      img {
        height: 34px;
        padding-top: 8px;
      }
      span {
        padding-top: 4px;
        display: block;
        text-align: center;
        padding-bottom: 8px;
      }
    }
  }
}
</style>
