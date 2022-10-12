/**
 * Created by wangweijie5 on 2016/12/2.
 */

// 错误码
const PLAYM4_PARA_OVER = 0; 	// 参数错误
const PLAYM4_OK = 1;             //正确
const PLAYM4_ORDER_ERROR = 2; 	// 调用接口顺序错误
const PLAYM4_TIMER_ERROR = 3; 	// 创建多媒体时钟错误
const PLAYM4_DEC_VIDEO_ERROR = 4; 	// 视频设备错误
const PLAYM4_DEC_AUDIO_ERROR = 5; 	// 音频设备错误
const PLAYM4_ALLOC_MEMORY_ERROR = 6; 	// 申请内存失败
const PLAYM4_OPEN_FILE_ERROR = 7; 	// 打开文件失败
const PLAYM4_BUF_OVER = 11; 	// 缓存溢出
const PLAYM4_SYS_NOT_SUPPORT = 16; 	// 不支持
const PLAYM4_NEED_MORE_DATA = 31; 	// 需要更多数据才能解析
const PLAYM4_NEED_NEET_LOOP = 35; //丢帧需要下个循环
const PLAYM4_BUF_WILL_OVER = 36;    //C层缓存即将满，需触发解I帧

const PLAYM4_NOT_KEYFRAME = 48; 	// 非关键帧
const PLAYM4_WORKER_ERROR = 60; 	// WORKER错误
const PLAYM4_CREATE_RENDERER_ERROR = 61; 	// 创建渲染句柄失败
const PLAYM4_LOAD_UNFINISHED = 62; 	// js文件未加载完成
const PLAYM4_GET_VOLUME_ERROR = 63; 	// 获取音频音量失败

const PLAYM4_ITYPE_DECODE_ERROR = 100;   //定位后送进来的第一帧I帧解码失败
const PLAYM4_FIRST_FRAME_NOT_ICURRENT = 101;   //定位后送进来的第一帧不是定位帧所在的I帧（Ni>Mp）

// 加密类型
const SECRET_NONE = 0;   // 不加密
const SECRET_AES = 1;   // AES 加密

// 流模式
const STREAM_REALTIME = 0;         // 实时流
const STREAM_FILE = 1;             // 文件流

// 解码类型
const DECODE_ALL = 0;   // 全解
const DECODE_VIDEO_KEYFRAME = 1;   // 只解关键帧

// 缓存帧数
const BUFFER_MAXNUM_ONEBYONE = 15;   // 帧进上限缓存数
const BUFFER_MINNUM_ONEBYONE = 8;   // 帧进下限缓存数
const BUFFER_NUM_NORMAL = 1;   // 正常缓存数
const BUFFER_NUM_AUDIO = 50;   // 音频存储25帧播放一次
const BUFFER_MAXNUM_YUV = 5;   // YUV最大缓存帧数
const YUV_SKIP_NUM = 2;   // YUV跳帧间隔

// const BUFFER_NODE_NUM = 20;   // 输入缓存节点数
// const BUFFER_MAX_SIZE = 800*1024;   // 最大缓存
const BUFFER_MAX_SIZE = 5 * 1024 * 1024;   // 最大缓存
const BUFFER_MIN_SIZE = 100;//最小缓存
const BUFFER_INPUT_SIZE = 1024*20;   // 一次送入数据大小
// const BUFFER_FAST_INPUT_SIZE = 10000; // 快放一次送入数据大小

const WRITE_AUD_ENCODE_NUM = 200; //一次写编码音频帧总帧数
const WRITE_AUD_PCM_NUM = 100; //一次写PCM数据
const WRITE_VID_YUV_NUM = 20; //一次写YUV数据
const WRITE_VID_RAW_NUM = 100;//一次写裸数据
// 电子放大区域
const WRITE_RTP_NUM =200;    //写RTP数据

//解码回调帧信息
var DECODE_INFO_YUV = {
    "width": 0,
    "height": 0,
    "frameNum": 0,
    "yuvData": null
};
//显示回调帧信息
var DISPLAY_INFO_YUV = {
    "width": 0,
    "height": 0,
    "frameNum": 0,
    "yuvData": null
};

//音频PCM回调信息
var DECODE_INFO_PCM = {
    "sampleRate": 0,
    "channel": 0,
    "bitsPerSample": 0,
    "length": 0,
    "pcmData": null
};

// xx.js加载标识
var bAudioRenderLoad = false;
var bSuperRenderLoad = false;

// 回调函数参数对象
var CALLBACK_PARAMETER = {
    "id": null,
    "cmd": null,
    "data": null,
    "errorCode": 0,
    "status": null
};

//定义类 JSPlayCtrl
export class JSPlayCtrl {
    constructor(path, callBack, winId) {

        // 路径
        if (path != null && path !== undefined && typeof (path) === "string") {
            this.szBasePath = path;
        } else {
            return PLAYM4_PARA_OVER;
        }

        // 加载回调
        if (callBack && typeof (callBack) === "function") {
            this.fnCallBack = callBack;
        } else {
            return PLAYM4_PARA_OVER;
        }

        // 解码 Worker
        this.decodeWorker = null;

        // 开启流类型
        this.streamOpenMode = null;
        this.bOpenStream = false;


        // 音频渲染
        this.audioRenderer = null;
        this.aAudioBuffer = [];
        this.iAudioBufferSize = 0;
		this.Volume = 0;

        // 视频渲染库
        this.oSuperRender = null;
        this.aVideoFrameBuffer = []; //YUV数据
        this.YUVBufferSize = BUFFER_NUM_NORMAL;
        this.szOSDTime = null;

        //打印日志
        //JS层log打印开关
        this.bJSPrintLog = false;

        //下载YUV数据
        this.bWriteYUVData = false;
        this.iYUV10size = 0;//YUV帧数
        this.aVideoYUVBuffer = [];

        //下载PCM数据
        this.bWritePCMData = false;
        this.iAudioBuffer500Size = 0;
        this.aAudioPCMBuffer = [];

        //下载裸数据
        this.bWriteRawData = false;
        this.iRawDataSize = 0;
        this.aRawDataBuffer = [];

        //下载RTP数据
        this.bWriteRTPData = true;
        this.iRTPDataSize = 0;
        this.aRTPDataBuffer = [];
        this.downloadRTP =false;
        this.rtpNum=0;

        // 播放音视频标识
        this.bPlaySound = false;
        this.bPlay = false;
        this.bPause = false;
        this.bOnebyOne = false;
        this.bPlayRateChange = false;
       // this.bAudioTypeSupport = true;
        this.audioNum = 0;
        this.videoNum = 0;

        //帧进步长
        this.FrameForwardLen = 1;

        //纯音频播放标识
        this.bOnlyPlaySound = false;

        // 回调函数
        this.dataCallBackFun = null;  // 截图回调函数
        this.YUVBufSizeCBFun = null;  // YUV缓存大小回调函数
        this.DecCallBackFun = null;//解码回调函数
        this.DisplayCallBackFun = null; //显示回调函数
        this.PCMCallBackFun = null;//PCM数据回调
        this.DecInfoYUV = DECODE_INFO_YUV;  //解码回调数据
        this.DisplayInfoYUV = DISPLAY_INFO_YUV; //显示回调数据
        this.DecInfoPCM = DECODE_INFO_PCM;//音频PCM回调数据


        // 图像宽高
        this.nWidth = 0;
        this.nHeight = 0;

        //图像的裁剪信息
        this.nSPSCropLeft=0;
        this.nSPSCropRight=0;
        this.nSPSCropTop=0;
        this.nSPSCropBottom=0;

        // 画布ID
        this.sCanvasId = null;

        // 显示图像数据缓存
        this.aDisplayBuf = null;

        // 页面是否激活
        this.bVisibility = true;

        // 解码类型
        this.nDecFrameType = DECODE_ALL;

        // 电子放大
        this.iCanvasWidth = 0;  // canvas宽
        this.iCanvasHeight = 0;  // canvas高
        this.iZoomNum = 0;  // 放大次数
        this.iRatio_x = 1;  // X方向比率
        this.iRatio_y = 1;  // Y方向比率
        this.stDisplayRect = {
            "top": 0,
            "left": 0,
            "right": 0,
            "bottom": 0
        };  // 上一次电子放大区域
        this.bDisRect = false;
        this.stYUVRect = {
            "top": 0,
            "left": 0,
            "right": 0,
            "bottom": 0
        };  // 映射到YUV上区域

        this.aInputDataLens = [];   // 送入缓存数据长度列表
        /***********性能不足解决方案************/
        this.aInputDataBuffer = [];   // 送入数据的缓存
        this.bIsGetYUV = false; // 获取YUV数据
        this.bIsFirstFrame = true; // 第一帧数据
        this.iInputMaxBufSize = BUFFER_MAX_SIZE; // 输入最大缓存大小
        this.bIsInput = false; // 输入数据
        this.bIsInputBufOver = false; // 输入缓存溢出
        this.bIsInputBufWillOver = false;//C层缓存将要溢出
        this.iInputDataLen = BUFFER_INPUT_SIZE; // 输入数据长度

        var that = this;  // 保存this, 在onmessage回调中使用
        this.errorCode = PLAYM4_OK;
        this.loopNum = 0;

        // 回调设置
        this.setCallBack = function (that, cmd, data, errorCode, status) {
            // 回调函数参数
            var callBackParameter = CALLBACK_PARAMETER;

            callBackParameter.id = winId;
            callBackParameter.cmd = cmd;
            callBackParameter.data = data;
            callBackParameter.errorCode = errorCode;
            callBackParameter.status = status;

            that.fnCallBack(callBackParameter);
        };

        // 加载音频渲染js文件
        if (!bAudioRenderLoad) {
            bAudioRenderLoad = true;
            var script_audio = document.createElement("script");
            script_audio.type = "text/javascript";
            script_audio.src = that.szBasePath + "AudioRenderer.js";
            var head_audio = document.getElementsByTagName('head')[0];
            head_audio.appendChild(script_audio);
            script_audio.onload = script_audio.onreadystatechange = function () {
                if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                    if (this.bJSPrintLog) {
                        console.log(">>>JS AudioRenderer.js load finish!");
                    }
                }
            };
        }

        // 加载视频渲染js文件
        if (!bSuperRenderLoad) {
            bSuperRenderLoad = true;
            var script_vedio = document.createElement("script");
            script_vedio.type = "text/javascript";
            script_vedio.src = that.szBasePath + "SuperRender_10.js";
            var head_vedio = document.getElementsByTagName('head')[0];
            head_vedio.appendChild(script_vedio);
            script_vedio.onload = script_vedio.onreadystatechange = function () {
                if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                    if (this.bJSPrintLog) {
                        console.log(">>>JS SuperRender_10.js load finish!");
                    }
                }
            };

        }

        this.convertErrorCode = function (nErrorCode) {
            switch (nErrorCode) {
                case 1:
                    return PLAYM4_OK;

                case 98:
                    return PLAYM4_PARA_OVER;

                default:
                    return nErrorCode;
            }
        };

        // ArrayBuffer复制
        this.arrayBufferCopy = function (srcArrayBuf) {
            var length = srcArrayBuf.byteLength;
            var destBuf = new Uint8Array(length);
            var srcBuf = new Uint8Array(srcArrayBuf);

            var i = 0;
            for (i = 0; i < length; i++) {
                destBuf[i] = srcBuf[i];
            }

            return destBuf;
        };

        // 送入数据
        this.inputDataFun = function () {
            var aReadBuf;
            var aSendBuf;
            var iSize = 0;
            that.bIsGetYUV = false;
            // 如果解析解码缓存溢出，则停止送入数据，直到缓存空闲后继续送入
            if (that.bIsInputBufOver || that.bIsInputBufWillOver) {
                aReadBuf = new Uint8Array(1);
                aSendBuf = new Uint8Array(aReadBuf);
                var message = {'command': "InputData", 'data': aSendBuf.buffer, 'dataSize': 0};
                that.decodeWorker.postMessage(message, [message.data]);
            } else {
                if ((that.bPlay && (!that.bPause || that.bOnebyOne)) || this.bOnlyPlaySound) {
                    //播放或单帧前进时，往worker送流
                    while (that.aInputDataLens.length > 0) {
                        iSize += that.aInputDataLens.shift();
                        if (iSize > that.iInputDataLen) {
                            break;
                        }
                    }
                    aReadBuf = that.aInputDataBuffer.splice(0, iSize);
                    aSendBuf = new Uint8Array(aReadBuf); 
                    var message = {'command': "InputData", 'data': aSendBuf.buffer, 'dataSize': iSize};
                    that.decodeWorker.postMessage(message, [message.data]);
                }
            }
            aReadBuf = null;
            aSendBuf = null;
        };

        this.getPic = function (callBack, command) {
            if (this.decodeWorker == null || this.oSuperRender == null) {
                return PLAYM4_ORDER_ERROR;
            }

            if (!this.bPlay) {
                return PLAYM4_ORDER_ERROR;
            }

            if (callBack && typeof (callBack) === "function") {
                this.dataCallBackFun = callBack;
            } else {
                return PLAYM4_PARA_OVER;
            }

            // 映射到原图位置信息
            if (0 === this.iZoomNum) {
                this.stYUVRect.left = 0;
                this.stYUVRect.top = 0;
                this.stYUVRect.right = 0;
                this.stYUVRect.bottom = 0;
            } else {
                if (0 === this.iCanvasWidth || 0 === this.iCanvasHeight) {
                    this.stYUVRect.left = 0;
                    this.stYUVRect.top = 0;
                    this.stYUVRect.right = 0;
                    this.stYUVRect.bottom = 0;
                } else {
                    var ratio_x = this.nWidth / this.iCanvasWidth;
                    var ratio_y = this.nHeight / this.iCanvasHeight;
                    this.stYUVRect.left = Math.round(this.stDisplayRect.left * ratio_x);
                    this.stYUVRect.top = Math.round(this.stDisplayRect.top * ratio_y);
                    this.stYUVRect.right = Math.round(this.stDisplayRect.right * ratio_x);
                    this.stYUVRect.bottom = Math.round(this.stDisplayRect.bottom * ratio_y);
                }

                // 宽高必须大于32
                if ((this.stYUVRect.right - this.stYUVRect.left) < 32 || (this.stYUVRect.bottom - this.stYUVRect.top) < 32) {
                    return PLAYM4_PARA_OVER;
                }
            }

            // 数据转换
            if (this.aDisplayBuf == null) {
                return PLAYM4_ORDER_ERROR;
            }
            var buf = this.arrayBufferCopy(this.aDisplayBuf);

            // 往 Worker 送数据
            var message = {
                'command': command, 'data': buf.buffer, 'width': this.nWidth, 'height': this.nHeight,
                'rect': this.stYUVRect
            };
            this.decodeWorker.postMessage(message, [message.data]);

            return PLAYM4_OK;
        };

        this.createWorker = function (self) {
            // 加载Worker
            if (window.Worker) { // 判断浏览器是否支持 Worker
                if (this.decodeWorker == null) {
                    // 创建解码 Worker
                    this.decodeWorker = new Worker(that.szBasePath + "DecodeWorker.js");
                    if (self.bJSPrintLog)
                    {
                        console.log(">>>JSPlayV1.1 createWorker success!");
                    }
                    if (this.decodeWorker == null) {
                        return PLAYM4_WORKER_ERROR;
                    }
                }

                // 接收 message
                this.decodeWorker.onmessage = function (evt) {
                    var typeName = null;
                    var eventData = evt.data;
                    switch (eventData.function) {
                        case "printLog":
                            console.log("print JSPlayerSDK log failed");
                            break;

                        case "loaded":
                            typeName = "loaded";

                            self.setCallBack(self, "loaded", 0, 0, true);
                            break;

                        case "SetStreamOpenMode":
                            typeName = "SetStreamOpenMode";
                            break;

                        case "OpenStream":
                            typeName = "OpenStream";
                            if (1 === eventData.errorCode) {
                                that.bOpenStream = true;
                                return;
                            }
                            break;

                        case "InputData":
                            typeName = "InputData";

                            //　解析解码缓存溢出
                            if (eventData.errorCode === PLAYM4_BUF_OVER) {
                                that.bIsInputBufOver = true;
                                console.log("yff inputBuffer over set key frame \n");
                                if(that.nDecFrameType!= DECODE_VIDEO_KEYFRAME)
                                {
                                   that.PlayM4_SetDecodeFrameType(DECODE_VIDEO_KEYFRAME);//本地流功能测试，很容易送流过快，导致触发解I帧
                                }
                                //that.inputDataFun();
                            }
                            if (eventData.errorCode === PLAYM4_BUF_WILL_OVER) {
                                that.bIsInputBufWillOver = true;
                                console.log("C buffer will over, C sourceRemain:"+eventData.sourceRemain);
                                
                                //that.inputDataFun();
                            }

                            // 解析解码缓存空闲(inputdata接口不会返回need more data)
                            if (eventData.errorCode === PLAYM4_NEED_MORE_DATA) {
                                //console.log(">>>JS inputdata need more data \n");
                                that.bIsInputBufOver = false;
                                that.bIsInputBufWillOver = false;
                                if (that.aInputDataLens.length > 0 && that.bIsInput) {
                                    that.inputDataFun();
                                    that.bIsInput = false;
                                } else {
                                    that.bIsGetYUV = true;
                                }
                                //console.log(">>> js inputdata need more data,aInputDataLens.length:"+that.aInputDataLens.length+" bIsGetYUV:"+that.bIsGetYUV+",bIsInput:"+that.bIsInput)
                            }
                            break;

                        case "GetFrameData":
                            typeName = "GetFrameData";
                            
                            if (!that.bOnlyPlaySound) {
                                if (eventData.data != null && eventData.frameInfo != null) {
                                    // 获取图像宽高
                                    var width = eventData.frameInfo.width;
                                    var height = eventData.frameInfo.height;
                                }

                                if (!that.bPlay) {
                                    return;
                                }
                                that.errorCode = eventData.errorCode;
                                //送数据策略，连续送5次后中断
                                if (!that.bIsFirstFrame && (eventData.errorCode === PLAYM4_NEED_MORE_DATA || eventData.errorCode === PLAYM4_NEED_NEET_LOOP)) {
                                    if(eventData.errorCode === PLAYM4_NEED_MORE_DATA)
                                    {
                                        that.bIsInputBufOver = false;
                                        that.bIsInputBufWillOver = false;
                                    }
                                    //送数据策略
                                    if(that.loopNum > 5)
                                    {
                                        that.bIsGetYUV = true;
                                        that.loopNum =0;
                                    }else{
                                        //setTimeout(that.inputDataFun(), 5);
                                        that.inputDataFun();
                                        that.loopNum++;//连续送数据计数
                                    }
                                    //console.log("loopNum:"+that.loopNum);
                                   break;
                                }else if (that.bIsInputBufOver || that.bIsInputBufWillOver) {
                                    // 解析缓存溢出
                                    that.inputDataFun();
                                } else {
                                    if (eventData.type === "videoType") {
                                        if (that.aInputDataLens.length > 0 && that.bIsInput) {
                                            that.inputDataFun();
                                            that.bIsInput = false;
                                        } else {
                                            that.bIsGetYUV = true;
                                        }

                                        that.bIsFirstFrame = false;
                                    }
                                }

                            }

                            // web页面激活时才缓存音视频数据
                            if (that.bVisibility) {
                                if (PLAYM4_OK === eventData.errorCode) {
                                    switch (eventData.type) {
                                        case "videoType":
                                            if (eventData.data == null || eventData.frameInfo == null) {
                                                return PLAYM4_PARA_OVER;
                                            }
                                            //显示回调
                                            if (that.DecCallBackFun != null) {
                                                that.DecInfoYUV.height = eventData.frameInfo.height;
                                                that.DecInfoYUV.width = eventData.frameInfo.width;
                                                that.DecInfoYUV.frameNum = eventData.frameInfo.frameNum;
                                                that.DecInfoYUV.yuvData = new Uint8Array(eventData.data);
                                                that.DecCallBackFun(that.DecInfoYUV)
                                            }
                                            that.bIsFirstFrame = false;

                                            //处理视频数据
                                            self.nWidth = eventData.frameInfo.width;
                                            self.nHeight = eventData.frameInfo.height;
                                            self.nSPSCropLeft=eventData.frameInfo.cropLeft;
                                            self.nSPSCropRight=eventData.frameInfo.cropRight;
                                            self.nSPSCropTop=eventData.frameInfo.cropTop;
                                            self.nSPSCropBottom=eventData.frameInfo.cropBottom;

                                            var oVideoFrameInfo = new Object();
                                            oVideoFrameInfo.data = eventData.data;
                                            oVideoFrameInfo.osdTime = eventData.osd;
                                            oVideoFrameInfo.nWidth = eventData.frameInfo.width;
                                            oVideoFrameInfo.nHeight = eventData.frameInfo.height;
                                            oVideoFrameInfo.frameNum = eventData.frameInfo.frameNum;
                                            oVideoFrameInfo.timeStamp = eventData.frameInfo.timeStamp;

                                            //打印10帧YUV视频
                                            if (self.bWriteYUVData) {
                                                var bufferPackage = new Uint8Array(eventData.data);
                                                var iIndexBuffer = self.aVideoYUVBuffer.length;
                                                for (var i = 0, iLen = bufferPackage.length; i < iLen; i++) {
                                                    self.aVideoYUVBuffer[iIndexBuffer + i] = bufferPackage[i];
                                                }
                                                self.iYUV10size++;
                                                bufferPackage = null;
                                            }
                                            if (self.bWriteYUVData && self.iYUV10size >= WRITE_VID_YUV_NUM) {
                                                var YUVbuffer = new Uint8Array(self.aVideoYUVBuffer);
                                                self.downloadFile(YUVbuffer, "videoYUV.data");
                                                self.aVideoYUVBuffer.splice(0, self.aVideoYUVBuffer.length);//清空PCM缓存
                                                self.bWriteYUVData = false;
                                                self.iYUV10size = 0;
                                                YUVbuffer = null;
                                            }
                                            /*******打印结束*****/
                                            self.aVideoFrameBuffer.push(oVideoFrameInfo);
                                            oVideoFrameInfo = null;

                                            // 如果YUV缓存大于阈值时进行抽帧显示，防止内存快速增长导致浏览器崩溃
                                            var iYUVNum = self.aVideoFrameBuffer.length;
                                            if (iYUVNum > BUFFER_MAXNUM_YUV) {
                                                // 非单帧模式下进行该处理
                                                // YUV缓存超过BUFFER_MAXNUM_YUV个节点后隔YUV_SKIP_NUM个帧播一帧
                                                if (!self.bOnebyOne) {
                                                    self.aVideoFrameBuffer.splice(0, YUV_SKIP_NUM);
                                                }
                                            }
                                            // 单帧
                                            if (self.bOnebyOne) {
                                                // 缓存满，通知上层停止送流
                                                if (self.aVideoFrameBuffer.length >= BUFFER_MAXNUM_ONEBYONE) {
                                                    self.setCallBack(self, "OnebyOne", 0, 0, false);

                                                    // 下次直接从缓存读取数据
                                                    self.bIsFirstFrame = true;
                                                    break;
                                                }
                                            }
                                            break;

                                        case "audioType":
                                            if ((self.bPlaySound && !self.bPlayRateChange) || that.bOnlyPlaySound) {
                                                //音频PCM回调
                                                if (that.PCMCallBackFun != null) {
                                                    that.DecInfoPCM.sampleRate = eventData.frameInfo.samplesPerSec;
                                                    that.DecInfoPCM.channel = eventData.frameInfo.channels;
                                                    that.DecInfoPCM.bitsPerSample = eventData.frameInfo.bitsPerSample;
                                                    that.DecInfoPCM.pcmData = new Uint8Array(eventData.data);
                                                    that.DecInfoPCM.length = that.DecInfoPCM.pcmData.length;
                                                    that.PCMCallBackFun(that.DecInfoPCM)
                                                }

                                                //处理音频数据
                                                var bufferPackage = new Uint8Array(eventData.data);
                                                var iIndexBuffer = self.aAudioBuffer.length;
                                                for (var i = 0, iLen = bufferPackage.length; i < iLen; i++) {
                                                    self.aAudioBuffer[iIndexBuffer + i] = bufferPackage[i];
                                                }
                                                self.iAudioBufferSize++;
                                                bufferPackage = null;

                                                //打印10帧PCM音频
                                                if (self.bWritePCMData) {
                                                    var bufferPackage = new Uint8Array(eventData.data);
                                                    var iIndexBuffer = self.aAudioPCMBuffer.length;
                                                    for (var i = 0, iLen = bufferPackage.length; i < iLen; i++) {
                                                        self.aAudioPCMBuffer[iIndexBuffer + i] = bufferPackage[i];
                                                    }
                                                    console.log("audio_type num:"+self.iAudioBuffer500Size+", len:"+bufferPackage.length);
                                                    self.iAudioBuffer500Size++;
                                                    bufferPackage = null;
                                                }

                                                if (self.bWritePCMData && self.iAudioBuffer500Size >= WRITE_AUD_PCM_NUM) {
                                                    var PCMbuffer = new Uint8Array(self.aAudioPCMBuffer);
                                                    self.downloadFile(PCMbuffer, "audioPCM.data");
                                                    self.aAudioPCMBuffer.splice(0, self.aAudioPCMBuffer.length);//清空PCM缓存
                                                    self.bWritePCMData = false;
                                                    self.iAudioBuffer500Size = 0;
                                                    PCMbuffer = null;
                                                }
                                                /********打印结束*****/

                                                // 储存25帧播放一次
                                                if (self.iAudioBufferSize >= BUFFER_NUM_AUDIO) {
                                                    // 播放
                                                    self.audioRenderer.Play(self.aAudioBuffer, self.aAudioBuffer.length, eventData.frameInfo);
                                                    self.aAudioBuffer.splice(0, self.aAudioBuffer.length);
                                                    self.aAudioBuffer.length = 0;
                                                    self.iAudioBufferSize = 0;
                                                }
                                            }
                                            break;

                                        case "privateType":
                                            break;

                                        default:
                                            break;
                                    }
                                }

                            }
                            break;
                        case "GetRawData":
                            typeName = "GetRawData";
                            /********打印10帧裸数据*****/
                            if (self.bWriteRawData) {
                                var bufferRawPackage = new Uint8Array(eventData.data);
                                var iIndexRawBuffer = self.aRawDataBuffer.length;
                                for (var i = 0, iLen = bufferRawPackage.length; i < iLen; i++) {
                                    self.aRawDataBuffer[iIndexRawBuffer + i] = bufferRawPackage[i];
                                }
                                self.iRawDataSize++;
                                bufferRawPackage = null;
                            }

                            if (self.bWriteRawData && self.iRawDataSize >= WRITE_VID_RAW_NUM) {
                                var RAWbuffer = new Uint8Array(self.aRawDataBuffer);
                                self.downloadFile(RAWbuffer, "rawBuffer.data");
                                self.aRawDataBuffer.splice(0, self.aRawDataBuffer.length);//清空PCM缓存
                                self.bWriteRawData = false;
                                self.iRawDataSize = 0;
                                RAWbuffer = null;
                            }
                            /********打印结束*****/
                            break;

                        case "PlaySound":
                            typeName = "PlaySound";
                            break;

                        case "GetJPEG":
                            typeName = "GetJPEG";

                             if (eventData.errorCode !== PLAYM4_OK) {
                                console.log("GetJPEG ErrorParam");
                                return;
                            }
                            // 获取图像宽高
                            var pJpegData = eventData.data;

                            self.dataCallBackFun(pJpegData);
                            break;

                        case "GetBMP":
                            typeName = "GetBMP";

                            if (eventData.errorCode !== PLAYM4_OK) {
                                console.log("GetBMP ErrorParam");
                                return;
                            }
                            // 获取图像宽高
                            var pBmpData = eventData.data;

                            self.dataCallBackFun(pBmpData);
                            break;     
                        default:
                            break;
                    }
                    //如果返回错误码该如何处理

                    // 回调方式返回错误码
                    if ("GetFrameData" !== typeName) {
                        self.setCallBack(self, typeName, 0, self.convertErrorCode(eventData.errorCode), true);
                    } else {
                        
                        if (PLAYM4_SYS_NOT_SUPPORT === eventData.errorCode || PLAYM4_FIRST_FRAME_NOT_ICURRENT === eventData.errorCode || PLAYM4_ITYPE_DECODE_ERROR === eventData.errorCode || PLAYM4_NOT_KEYFRAME === eventData.errorCode) {
                            self.setCallBack(self, typeName, 0, self.convertErrorCode(eventData.errorCode), true);
                        }
                    }
                };
            }
        };

        this.createWorker(that);

        // 视频渲染
        this.draw = function () {
            if (that.bPlay) {
                if (!that.bPause || that.bOnebyOne) {
                    // that.bPause:true 暂停
                    requestAnimationFrame(that.draw);

                    var iYUVNum = that.aVideoFrameBuffer.length;
                    if (that.YUVBufSizeCBFun != null) {
                        that.YUVBufSizeCBFun(iYUVNum);
                    }
                    if (that.bOnebyOne) {
                        // 缓存不够，通知上层开始送流
                        if (iYUVNum <= BUFFER_MINNUM_ONEBYONE) {
                            that.setCallBack(that, "OnebyOne", 0, PLAYM4_NEED_MORE_DATA, true);
                        }
                        if (iYUVNum <= that.FrameForwardLen + 1) {
                            that.setCallBack(that, "OnebyOne", 0, PLAYM4_NEED_MORE_DATA, true);
                            return;
                        } else {
                            var frameForwardLen = that.FrameForwardLen;
                            while (frameForwardLen > 1) {
                                var framevuffer = that.aVideoFrameBuffer.shift();
                                frameForwardLen--;
                            }
                        }
                        that.bOnebyOne = false;
                    }

                    if (iYUVNum > 0) {
                        var oVideoFrameInfo = that.aVideoFrameBuffer.shift();

                        that.aDisplayBuf = oVideoFrameInfo.data;
                        var displayBuf = new Uint8Array(that.aDisplayBuf);
                        that.oSuperRender.SR_DisplayFrameData(oVideoFrameInfo.nWidth, oVideoFrameInfo.nHeight, displayBuf,oVideoFrameInfo.nWidth- that.nSPSCropLeft - that.nSPSCropRight,oVideoFrameInfo.nHeight- that.nSPSCropTop - that.nSPSCropBottom);
                        if (that.DisplayCallBackFun != null) {
                            that.DisplayInfoYUV.height = oVideoFrameInfo.nHeight;
                            that.DisplayInfoYUV.width = oVideoFrameInfo.nWidth;
                            that.DisplayInfoYUV.frameNum = oVideoFrameInfo.frameNum;
                            that.DisplayInfoYUV.yuvData = new Uint8Array(displayBuf);
                            that.DisplayCallBackFun(that.DisplayInfoYUV)
                        }

                        displayBuf = null;
                        // 当前OSD时间
                        that.szOSDTime = oVideoFrameInfo.osdTime;
                        oVideoFrameInfo = null;
                    } else {
                        that.setCallBack(that, "Play", 0, PLAYM4_NEED_MORE_DATA, true);
                    }
                }
            } else {
                if (!that.bPlay) {
                    // 停止播放清空视频帧和音频帧数据缓存
                    that.aVideoFrameBuffer.splice(0, that.aVideoFrameBuffer.length);
                    that.aAudioBuffer.splice(0, that.aAudioBuffer.length);
                }
            }
        };
    }

 /**
     * @synopsis 根据帧号进行精确定位
     * @param nFrameNum [IN] 定位帧号
     * @param playType [IN] 定位后是否继续播放。true为继续播放，false为暂停播放
     */
    PlayM4_SetCurrentFrameNum(nFrameNum, playType) {
        return PLAYM4_SYS_NOT_SUPPORT;
    }
  
    /**
     * @synopsis 播放库打印日志开关
     * @param downloadFlag [IN] true为打开日志，false为关闭日志
     * @returns 返回错误码
     */
    PlayM4_OpenPlayerSDKPrintLog(downloadFlag) {
        if (downloadFlag === true) {
            this.bJSPrintLog = true;
            this.decodeWorker.postMessage({'command': "printLog", 'data': downloadFlag});
        } else {
            this.bJSPrintLog = false;
            this.decodeWorker.postMessage({'command': "printLog", 'data': downloadFlag});
        }
        return PLAYM4_OK;

    }

    /**
     * @synopsis 下载YUV数据开关
     */
    PlayM4_DownloadYUVdata() {
        this.bWriteYUVData = true;
        return PLAYM4_OK;
    }

    /**
     * @synopsis 下载PCM数据开关
     */
    PlayM4_DownloadPCMdata() {
        this.bWritePCMData = true;
        return PLAYM4_OK;
    }

    /**
     * @synopsis 设置解码回调
     * @param DecCBFun [IN] 解码回调函数
     * @returns 返回错误码
     */
    PlayM4_SetDecCallBack(DecCBFun) {
        if (DecCBFun && typeof (DecCBFun) === "function") {
            this.DecCallBackFun = DecCBFun;
            return PLAYM4_OK;
        } else {
            return PLAYM4_PARA_OVER;
        }
    }

    /**
     * @synopsis 设置显示回调
     * @param DecCBFun [IN] 显示回调函数
     * @returns 返回错误码
     */
    PlayM4_SetDisplayCallBack(DisplayCBFun) {
        if (DisplayCBFun && typeof (DisplayCBFun) === "function") {
            this.DisplayCallBackFun = DisplayCBFun;
            return PLAYM4_OK;
        } else {
            return PLAYM4_PARA_OVER;
        }
    }

    /**
     * @synopsis 设置音频PCM数据回调
     * @param DecCBFun [IN] 音频回调函数
     * @returns 返回错误码
     */
    PlayM4_SetPCMCallBack(PCMCBFun) {
        if (PCMCBFun && typeof (PCMCBFun) === "function") {
            this.PCMCallBackFun = PCMCBFun;
            return PLAYM4_OK;
        } else {
            return PLAYM4_PARA_OVER;
        }
    }

    /**
     * @synopsis 设置开启流播放模式
     *
     * @param nMode [IN] 打开方式
     *
     * @returns 状态码
     */
    PlayM4_SetStreamOpenMode(nMode) {
        if (nMode == null || nMode === undefined) {
            return PLAYM4_PARA_OVER;
        }

        if (nMode !== STREAM_REALTIME && nMode !== STREAM_FILE) {
            return PLAYM4_PARA_OVER;
        }

        this.streamOpenMode = nMode;

        return PLAYM4_OK;
    }
    PlayM4_DownloadRTPData(downloadFlag)
    {
        this.downloadRTP=downloadFlag;
    }
    /**
     * @synopsis 实时流、回放流时字节头开流
     *
     * @param pFileHeadBuf 文件头缓存数据
     * @param nSize 文件头缓存大小
     * @param nBufPoolSize 流缓存大小
     *
     * @returns 状态码
     */
    PlayM4_OpenStream(pFileHeadBuf, nSize, nBufPoolSize) {
        if (this.bJSPrintLog) {
            console.log(">>>JS PlayM4_OpenStream nSysTime:" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + "." + new Date().getMilliseconds());
        }
        if (this.decodeWorker == null) {
            return PLAYM4_ORDER_ERROR;
        }

        if(this.downloadRTP)
        {
            var apRTPHeadData = new Uint8Array(pFileHeadBuf.buffer);
            this.DownloadRTPData(apRTPHeadData);
            console.log("write 40 hik head");
        }

        if (pFileHeadBuf == null || nSize <= 0 || nBufPoolSize <= 0) {
            return PLAYM4_PARA_OVER;
        }

        // 单帧后恢复回放，清除状态值
        this.bPlay = false;
        this.bPause = false;
        this.bOnebyOne = false;
        this.bIsFirstFrame = true;
        this.bIsGetYUV = false;
        this.bIsInput = false;

        // 往 Worker 送数据
        this.decodeWorker.postMessage({'command': "SetStreamOpenMode", 'data': this.streamOpenMode});
        // 往 Worker 送数据
        this.decodeWorker.postMessage({
            'command': "OpenStream",
            'data': pFileHeadBuf,
            'dataSize': nSize,
            'bufPoolSize': nBufPoolSize
        });

        this.bOpenStream = true;
        return PLAYM4_OK;
    }
	

    /**
     * @synopsis 关闭流
     *
     * @returns 状态码
     */
    PlayM4_CloseStream() {
        if (this.decodeWorker === null || this.bOpenStream === false) {
            return PLAYM4_ORDER_ERROR;
        }

        this.bOnlyPlaySound = false;

        this.PlayM4_Stop();

        // 往 Worker 送数据
        this.decodeWorker.postMessage({'command': "CloseStream"});

        if (this.oSuperRender !== null) {
            // 释放渲染资源
            this.oSuperRender.SR_Destroy();
            this.oSuperRender = null;
        }

        if (this.audioRenderer !== null) {
            // 释放渲染资源
            this.audioRenderer.Stop();
            this.audioRenderer = null;
        }

        // 清空缓存
        this.aAudioBuffer.splice(0, this.aAudioBuffer.length);
        this.aVideoFrameBuffer.splice(0, this.aVideoFrameBuffer.length);
        this.aInputDataBuffer.splice(0, this.aInputDataBuffer.length);
        this.aInputDataLens.splice(0, this.aInputDataLens.length);
        this.aVideoYUVBuffer.splice(0, this.aVideoYUVBuffer.length);
        this.aAudioPCMBuffer.splice(0, this.aAudioPCMBuffer.length);
        this.aRawDataBuffer.splice(0, this.aRawDataBuffer.length);

        this.bOpenStream = false;
        this.iAudioBufferSize = 0;
        this.szOSDTime = null;

        return PLAYM4_OK;
    }

    /**
     * @synopsis 销毁，关闭worker
     *
     * @returns 状态码
     */
    PlayM4_Destroy() {
        if (this.decodeWorker === null) {
            return PLAYM4_OK;
        }

        this.PlayM4_CloseStream();


        this.decodeWorker.terminate();  // 停止 Worker 工作
        this.decodeWorker = null;
        return PLAYM4_OK;
    }

    /**
     * @synopsis 实时流、回放流送数据
     *
     * @param dataBuf  [IN] 输入数据缓存
     * @param nSize [IN] 输入数据大小
     *
     * @returns 状态码
     */
    PlayM4_InputData(dataBuf, nSize) {
        //if (this.decodeWorker === null || this.bOpenStream === false) {
        //    return PLAYM4_ORDER_ERROR;
       // }
        //console.log(">>>JSPlaySDKInterface.js PlayM4_InputData nSize:"+nSize+",bIsGetYUV:"+this.bIsGetYUV+",bIsInput:"+this.bIsInput);
        var iInputBufLen = this.aInputDataBuffer.length;

        // 结束送流标识位[0x01, 0x02, 0x03, 0x04]
        if (nSize === 4) {
            var aBuf = new Uint8Array(dataBuf.buffer);
            if (aBuf[0] === 0x01 && aBuf[1] === 0x02 && aBuf[2] === 0x03 && aBuf[3] === 0x04) {
                if (this.bIsFirstFrame) {
                    // 直接往 Worker 送数据
                    this.inputDataFun();
                } else {
                    if (this.bIsGetYUV) {
                        this.inputDataFun();
                    } else {
                        this.bIsInput = true;
                    }
                }

                aBuf = null;
                return PLAYM4_OK;
            }
        }
        // 超出设置的缓存阈值，返回错误码（缓存溢出）
        if (iInputBufLen + nSize > this.iInputMaxBufSize) {
           console.log("input over");
            //this.inputDataFun();
            if (this.bIsGetYUV) {
                this.inputDataFun();
            } else {
                this.bIsInput = true;
            }
            return PLAYM4_BUF_OVER;
        }

        // 写入缓存，添加4字节头
        var tempBuf = null;
        var iDataLen = nSize;
        switch (this.streamOpenMode) {
            case STREAM_FILE:
                tempBuf = new Uint8Array(dataBuf.buffer);
                if(this.downloadRTP)
                {
                    this.DownloadRTPData(tempBuf);
                    this.rtpNum++;
                    console.log("STREAM_FILE psNUm:"+this.rtpNum);
                }
                this.aInputDataLens.push(nSize);
                break;

            case STREAM_REALTIME:
                // 加4字节长度信息
                iDataLen = nSize + 4;
                var a32 = new Uint32Array([nSize]);
                var a8 = new Uint8Array(a32.buffer);
                tempBuf = new Uint8Array(iDataLen);
                tempBuf.set(a8, 0);
                tempBuf.set(dataBuf, 4);
                if(this.downloadRTP)
                {
                    this.DownloadRTPData(tempBuf);
                    this.rtpNum++;
                    console.log("STREAM_REALTIME rtpNUm:"+this.rtpNum);
                }
                a32 = null;
                a8 = null;

                this.aInputDataLens.push(nSize + 4);
                break;

            default:
                return PLAYM4_SYS_NOT_SUPPORT;
        }

        for (var i = 0; i < iDataLen; i++) {
            this.aInputDataBuffer[iInputBufLen + i] = tempBuf[i];
        }
        if((!this.bPlay&&!this.bOnlyPlaySound) || this.decodeWorker === null || this.bOpenStream === false)
        {
            return PLAYM4_OK;
        }
        tempBuf = null;
        if (this.bOnlyPlaySound) {
            //直接送音频帧，一个RTP包一个音频帧
            this.inputDataFun();
        } else {

            if (this.bIsFirstFrame) {
                // 首帧直接往 Worker 送数据
                this.inputDataFun();
            } else {
                if (this.bIsGetYUV) {
                    this.inputDataFun();
                } else {
                    this.bIsInput = true;
                }
            }
        }
        return PLAYM4_OK;
    }

    DownloadRTPData(rtpData)
    {
        if (this.bWriteRTPData) {

            var bufferPackage = new Uint8Array(rtpData);
            var iIndexBuffer = this.aRTPDataBuffer.length;
            for (var i = 0, iLen = bufferPackage.length; i < iLen; i++) {
                this.aRTPDataBuffer[iIndexBuffer + i] = bufferPackage[i];
            }
            this.iRTPDataSize++;
            bufferPackage = null;
        }
        if (this.bWriteRTPData && this.iRTPDataSize >= WRITE_RTP_NUM) {
            console.log("download"+WRITE_RTP_NUM+"RTPdata");
            var RTPbuffer = new Uint8Array(this.aRTPDataBuffer);
            this.downloadFile(RTPbuffer, "RTP.data");
            this.aRTPDataBuffer.splice(0, this.aRTPDataBuffer.length);//清空YUV缓存
            //this.bWriteRTPData = false; 应注释，修复再次调用无法下载数据的问题
            this.iRTPDataSize = 0;
            this.rtpNum=0;
            this.downloadRTP=false;
            RTPbuffer = null;
        }
    }
    /**
     * @synopsis 开启播放
     *
     * @param canvasID  [IN] 窗口id
     *
     * @returns 状态码
     */
    PlayM4_Play(canvasID) {

        if (this.decodeWorker === null) {
            return PLAYM4_ORDER_ERROR;
        }
        //canvasID传入为null，则表示只送入纯音频js播放库进行播放
        if (this.bJSPrintLog) {
            console.log(">>>JS PlayM4_Play canvasID: " + canvasID);
        }
        if (canvasID === null) {
            //console.log(">>>>>>>>> PlayM4_Play 2-1 nSysTime:" + (new Date().getMonth()+1) + "-" + new Date().getDate() + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + "." + new Date().getMilliseconds());
            this.bOnlyPlaySound = true;
            //console.log("fzj---------------------------------true");
            // 往 Worker 送数据
            this.decodeWorker.postMessage({
                'command': "OnlyPlaySound"
            }); 
            this.sCanvasId = null;
        } else {
            if (typeof (canvasID) !== "string") {
                return PLAYM4_PARA_OVER;
            }

            if (this.bOnebyOne) {
                this.bPlayRateChange = false;
                this.bOnebyOne = false;
                this.bPause = false;
                this.draw();
            }
            
            if (this.bPlay) {
                return PLAYM4_OK;
            }

            // 创建视频渲染句柄
            if (this.oSuperRender == null) {
                this.oSuperRender = new SuperRender(canvasID, this.szBasePath);
                if (this.oSuperRender == null) {
                    return PLAYM4_CREATE_RENDERER_ERROR;
                }
            }

            this.sCanvasId = canvasID;

            // 初始化
            this.bPlay = true;
            this.bPause = false;
            this.bOnebyOne = false;

            // 关闭声音
           // this.bPlaySound = false;
            this.bPlayRateChange = false;
            this.bOnlyPlaySound = false;
            this.draw();
            //console.log(">>>>>>>>> PlayM4_Play 2-2 nSysTime:" + (new Date().getMonth()+1) + "-" + new Date().getDate() + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + "." + new Date().getMilliseconds());
        }

        // 创建音频渲染句柄
        if (this.audioRenderer == null) {
            this.audioRenderer = new AudioRenderer();
            if (this.audioRenderer == null) {
                return PLAYM4_CREATE_RENDERER_ERROR;
            }
        }
	    this.decodeWorker.postMessage({
            'command': "Play"
        });
        //console.log(">>>>>>>>> PlayM4_Play 3 nSysTime:" + (new Date().getMonth()+1) + "-" + new Date().getDate() + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + "." + new Date().getMilliseconds());
        return PLAYM4_OK;
    }

    /**
     * @synopsis 停止播放
     *
     * @returns 状态码
     */
    PlayM4_Stop() {
        if (this.decodeWorker == null || this.oSuperRender == null) {
            return PLAYM4_ORDER_ERROR;
        }

        if (!this.bPlay) {
            return PLAYM4_ORDER_ERROR;
        }

        // 关闭声音
        if (this.bPlaySound) {
            this.PlayM4_StopSound();
            this.bPlaySound = true;
        }

        this.bPlay = false;
        this.bOnebyOne = false;
        this.bPause = false;

        // 关闭电子放大
        this.oSuperRender.SR_SetDisplayRect(null);
        this.iZoomNum = 0;
        this.bDisRect = false;

        // 画布置黑
        this.oSuperRender.SR_DisplayFrameData(this.nWidth, this.nHeight, null);
        // let oldCanvas = document.getElementById(this.sCanvasId);
        // if (oldCanvas) {
        //     this.clonedCanvas = oldCanvas.cloneNode(true); // 克隆节点
        //     this.clonedCanvasParentNode = oldCanvas.parentNode;
        //     oldCanvas.parentNode.removeChild(oldCanvas);
        //     this.clonedCanvasParentNode.replaceChild(this.clonedCanvas, oldCanvas);
        // }
        return PLAYM4_OK;
    }

    /**
     * @synopsis 播放速率
     *
     * @param nPlayRate [IN] 倍率
     *
     * @returns 状态码
     */
    PlayM4_PlayRate(nPlayRate) {
        if (this.decodeWorker == null) {
            return PLAYM4_ORDER_ERROR;
        }

        if (nPlayRate === 1) {
            this.bPlayRateChange = false;
        } else {
            this.bPlayRateChange = true;
        }

        if (nPlayRate < 1) {
            nPlayRate = 1;
        }
        this.iInputDataLen = nPlayRate * BUFFER_INPUT_SIZE;
        this.decodeWorker.postMessage({
            'command': "PlayRate",
            'playRate':nPlayRate
        });

        return PLAYM4_OK;
    }

    /**
     * @synopsis 暂停播放
     *
     * @param pause [IN] 暂停/恢复标识
     *
     * @returns 状态码
     */
    PlayM4_Pause(pause) {
        if (this.decodeWorker == null || this.oSuperRender == null) {
            return PLAYM4_ORDER_ERROR;
        }

        if (!this.bPlay) {
            return PLAYM4_ORDER_ERROR;
        }

        if (this.bOnebyOne) {
            return PLAYM4_ORDER_ERROR;
        }
		
		if (this.bPause == pause) {
            return PLAYM4_ORDER_ERROR;
        }

        if (typeof (pause) !== "boolean") {
            return PLAYM4_PARA_OVER;
        }

        this.bPause = pause;
        // this.bOnebyOne = false;
        // 下次直接从缓存读取数据
        this.bIsFirstFrame = true;
        if (pause) {
            if (this.bPlaySound) {
                this.PlayM4_StopSound();
                this.bPlaySound = true;
            }
        } else {
            if (this.bPlaySound) {
                this.PlayM4_PlaySound();
            }

            this.draw();
        }
        return PLAYM4_OK;
    }

    /**
     * @synopsis 帧进
     *
     * @returns 状态码
     */
    PlayM4_OneByOne(stepLength) {
        if (this.decodeWorker == null || this.oSuperRender == null) {
            return PLAYM4_ORDER_ERROR;
        }

        if (!this.bPlay) {
            return PLAYM4_ORDER_ERROR;
        }
        if (stepLength > 10 || stepLength <= 0) {
            return PLAYM4_PARA_OVER;
        }
        if (!stepLength) {
            stepLength = 1;
        }
        this.iInputDataLen = BUFFER_INPUT_SIZE;
        this.FrameForwardLen = stepLength;
        this.bPause = true;
        this.bOnebyOne = true;
        //this.bPlaySound = false;  // 单帧模式下关闭声音
        //this.bPlayRateChange = true;
        this.bIsFirstFrame = true;
        this.draw();
        return PLAYM4_OK;
    }

    /**
     * @synopsis 开启声音
     *
     *  @param iWndNum [IN] 窗口号
     *
     * @returns 状态码
     */
    PlayM4_PlaySound(iWndNum) {
        if (this.decodeWorker === null || this.bOpenStream === false) {
            return PLAYM4_ORDER_ERROR;
        }

        // // 判断音频格式是否支持，如果不支持返回状态码
        // if (!this.bAudioTypeSupport) {
        //     return PLAYM4_SYS_NOT_SUPPORT;
        // }

        // 最大支持16路
        if (iWndNum < 0 || iWndNum > 16) {
            return PLAYM4_PARA_OVER;
        }

        // 创建音频渲染句柄
        if (this.audioRenderer == null) {
            this.audioRenderer = new AudioRenderer();
            if (this.audioRenderer == null) {
                return PLAYM4_CREATE_RENDERER_ERROR;
            }
        }
        // 往 Worker 送数据
        this.decodeWorker.postMessage({
            'command': "PlaySound"
        });
        // 设置当前窗口号
        this.audioRenderer.SetWndNum(iWndNum);
		if(this.Volume !== 0)
		{
			this.audioRenderer.SetVolume(this.Volume);
		}
        this.audioRenderer.oAudioContext.resume();
        this.bPlaySound = true;
        return PLAYM4_OK;
    }

    /**
     * @synopsis 关闭声音
     *
     * @returns
     */
    PlayM4_StopSound() {
        if (this.decodeWorker == null || this.audioRenderer == null) {
            return PLAYM4_ORDER_ERROR;
        }

        if (!this.bPlaySound) {
            return PLAYM4_ORDER_ERROR;
        }
        this.decodeWorker.postMessage({
            'command': "StopSound"
        });
        this.bPlaySound = false;
        return PLAYM4_OK;
    }

    /**
     * @synopsis 设置解码后缓存
     *
     * @param nNum [IN] 显示缓存节点数
     *
     * @returns 状态码
     */
    PlayM4_SetDisplayBuf(nNum) {
        if (this.decodeWorker == null) {
            return PLAYM4_ORDER_ERROR;
        }

        if (nNum <= 0) {
            return PLAYM4_PARA_OVER;
        }

        this.YUVBufferSize = nNum;
        return PLAYM4_OK;
    }

    /**
     * @synopsis 设置解密秘钥
     *
     * @param nKeyType [IN] 密钥类型
     * @param pSecretKey [IN] 密钥缓存
     * @param nKeyLen [IN] 密钥缓存大小
     *
     * @returns 状态码
     */
    PlayM4_SetSecretKey(nKeyType, pSecretKey, nKeyLen) {
        if (this.decodeWorker == null || this.bOpenStream === false) {
            return PLAYM4_ORDER_ERROR;
        }

        if (pSecretKey == null) {
            return PLAYM4_PARA_OVER;
        }

        if (SECRET_AES === nKeyType) {
            if (128 === nKeyLen) {
                if (pSecretKey == null || pSecretKey === undefined) {
                    return PLAYM4_PARA_OVER;
                }
            } else {
                return PLAYM4_PARA_OVER;
            }
        } else if (SECRET_NONE === nKeyType) {
        } else {
            return PLAYM4_PARA_OVER;
        }

        // 往 Worker 送数据
        this.decodeWorker.postMessage({
            'command': "SetSecretKey",
            'data': pSecretKey,
            'nKeyType': nKeyType,
            'nKeyLen': nKeyLen
        });

        return PLAYM4_OK;
    }

    /**
     * @synopsis 设置要解码的帧类型.默认正常解码，当前只支持全解和只解码I帧
     *
     * @param nFrameType [IN] 帧类型
     *
     * @returns 状态码
     */
    PlayM4_SetDecodeFrameType(nFrameType) {
        console.log("PlayM4_SetDecodeFrameType nFrameType:"+nFrameType);
        if (this.decodeWorker == null || this.oSuperRender == null) {
            return PLAYM4_ORDER_ERROR;
        }

        if (nFrameType !== DECODE_ALL && nFrameType !== DECODE_VIDEO_KEYFRAME) {
            return PLAYM4_PARA_OVER;
        }

        if (this.bJSPrintLog) {
            console.log(">>>JS PlayM4_SetDecodeFrameType :"+nFrameType);
        }

        this.nDecFrameType = nFrameType;
            // 往 Worker 送数据
        this.decodeWorker.postMessage({'command': "SetDecodeFrameType", 'data': nFrameType});

        return PLAYM4_OK;
    }

    /**
     * @synopsis 设置跳I帧间隔(调用前需要设置 setDecodeFrameType(1)只解关键帧，否则返回错误码 2)
     *
     * @param nInterval [IN] 跳I帧间隔
     *
     * @returns 状态码
     */
    PlayM4_SetIFrameDecInterval(nInterval) {
        if (this.nDecFrameType !== DECODE_VIDEO_KEYFRAME) {
            return PLAYM4_ORDER_ERROR;
        }

        if (nInterval < 0) {
            return PLAYM4_PARA_OVER;
        }

        // 往 Worker 送数据
        this.decodeWorker.postMessage({'command': "SetIFrameDecInterval", 'data': nInterval});

        return PLAYM4_OK;
    }
	/**
     * @synopsis 设置丢帧模式
     *
     * @param nInterval [IN] 丢帧模式
     *
     * @returns 状态码
     */
    PlayM4_SetLostFrameMode(nLostMode) {

        if (nLostMode < 0 || nLostMode > 1) {
            return PLAYM4_PARA_OVER;
        }

        // 往 Worker 送数据
        this.decodeWorker.postMessage({'command': "SetLostFrameMode", 'data': nLostMode});

        return PLAYM4_OK;
    }
    /**
     * @synopsis 电子放大
     *
     * @param diplayRect [IN] 显示区域
     * @param bEnable [IN] 是否显示
     *
     * @returns 状态码
     */
    PlayM4_SetDisplayRegion(diplayRect, bEnable) {

        if (this.decodeWorker === null || this.bPlay === false || this.oSuperRender === null) {
            return PLAYM4_ORDER_ERROR;
        }

        if (this.canvasId === null) {
            return PLAYM4_ORDER_ERROR;
        }

        if (bEnable === true) {
            if (diplayRect === null || diplayRect === undefined) {
                return PLAYM4_PARA_OVER;
            }

            // 判断放大区域参数
            if (typeof diplayRect.left === "number" &&
                typeof diplayRect.top === "number" &&
                typeof diplayRect.right === "number" &&
                typeof diplayRect.bottom === "number") {

                if (diplayRect.right < 0 ||
                    diplayRect.left < 0 ||
                    diplayRect.top < 0 ||
                    diplayRect.bottom < 0) {
                    return PLAYM4_PARA_OVER;
                }
				
                var iLeft = diplayRect.left;
                var iRight = diplayRect.right;
                var iTop = diplayRect.top;
                var iBottom = diplayRect.bottom;

                // 获取画布大小
                var oRect = document.getElementById(this.sCanvasId).getBoundingClientRect();
                this.iCanvasWidth = oRect.width;
                this.iCanvasHeight = oRect.height;

                /*区域宽高必须不小于16且不大于图像宽高*/
                /*modify.2018.7.6经过测试区域宽高可以大于分辨率*/
                if (iRight - iLeft < 16 || iBottom - iTop < 16 ||
                    iRight - iLeft > this.iCanvasWidth || iBottom - iTop > this.iCanvasHeight) {
                    return PLAYM4_PARA_OVER;
                }

                // 获取画布大小
                /*var oRect = document.getElementById(this.sCanvasId).getBoundingClientRect();
                this.iCanvasWidth = oRect.width;
                this.iCanvasHeight = oRect.height;*/

                if (this.iZoomNum !== 0) {
                    iLeft = Math.round(iLeft / this.iRatio_x) + this.stDisplayRect.left;
                    iTop = Math.round(iTop / this.iRatio_y) + this.stDisplayRect.top;
                    iRight = Math.round(iRight / this.iRatio_x) + this.stDisplayRect.left;
                    iBottom = Math.round(iBottom / this.iRatio_y) + this.stDisplayRect.top;
                }

                // 电子放大
                this.stDisplayRect = {
                    "top": iTop,
                    "left": iLeft,
                    "right": iRight,
                    "bottom": iBottom
                };

                // 开启电子放大
                this.oSuperRender.SR_SetDisplayRect(this.stDisplayRect);
                this.bDisRect = true;

                // 电子放大选择区域大小
                var nCropWidth = iRight - iLeft;
                var nCropHeight = iBottom - iTop;

                // 计算放大比率
                this.iRatio_x = this.iCanvasWidth / nCropWidth;
                this.iRatio_y = this.iCanvasHeight / nCropHeight;

              //  this.iZoomNum++;
            } else {
                return PLAYM4_PARA_OVER;
            }
        } else {
            // 关闭电子放大
            this.oSuperRender.SR_SetDisplayRect(null);
            this.iZoomNum = 0;
            this.bDisRect = false;
        }

        // 如果暂停、单帧、快慢放情况，电子放大后需要刷新一帧
        if (this.bPause || this.bOnebyOne || this.bPlayRateChange) {
            this.oSuperRender.SR_DisplayFrameData(this.nWidth, this.nHeight,
                (new Uint8Array(this.aDisplayBuf)));
        }

        return PLAYM4_OK;
    }

    /**
     * @synopsis 抓取BMP图
     *
     * @param callBack [IN] 数据回调函数
     *
     * @returns 状态码
     */
    PlayM4_GetBMP(callBack) {
        return this.getPic(callBack, "GetBMP");
    }

    /**
     * @synopsis 抓取JPEG图
     *
     * @param callBack [IN] 数据回调函数
     *
     * @returns 状态码
     */
    PlayM4_GetJPEG(callBack) {
        return this.getPic(callBack, "GetJPEG");
    }

    /**
     * @synopsis 设置音量
     *
     * @param volume [IN] 音量
     *
     * @returns 状态码
     */
    PlayM4_SetVolume(volume) {
        if (this.decodeWorker == null) {
            return PLAYM4_ORDER_ERROR;
        }

        if (this.audioRenderer == null) {
            return PLAYM4_ORDER_ERROR;
        }

		//增加volume === ""兼容框内容什么都不填的情况
        if (volume < 0 || volume > 100 || volume === "") {
            return PLAYM4_PARA_OVER;
        }
		//保存音量
		this.Volume = volume;
		
        this.audioRenderer.SetVolume(volume);

        return PLAYM4_OK;
    }

    /**
     * @synopsis 获取音量
     *
     * @param callBack [IN] 音量回调函数
     *
     * @returns 状态码
     */
    PlayM4_GetVolume(callBack) {
        if (this.decodeWorker == null) {
            return PLAYM4_ORDER_ERROR;
        }

        if (this.audioRenderer == null) {
            return PLAYM4_ORDER_ERROR;
        }

        if (callBack && typeof (callBack) === "function") {
            var volume = this.audioRenderer.GetVolume();
            if (volume === null) {
                return PLAYM4_GET_VOLUME_ERROR;
            } else {
				//修改逻辑解决设置获取音量不一致的问题
                callBack(volume);

                return PLAYM4_OK;
            }
        } else {
            return PLAYM4_PARA_OVER;
        }
    }

    /**
     * @synopsis 获取OSD时间信息
     *
     * @param callBack [IN] 获取OSD时间信息回调函数
     *
     * @returns 状态码
     */
    PlayM4_GetOSDTime(callBack) {
        if (this.decodeWorker == null) {
            return PLAYM4_ORDER_ERROR;
        }

        if (!this.bPlay) {
            return PLAYM4_ORDER_ERROR;
        }

        if (callBack && typeof (callBack) === "function") {
            callBack(this.szOSDTime);

            return PLAYM4_OK;
        } else {
            return PLAYM4_PARA_OVER;
        }
    }

    /**
     * @synopsis 当前页面状态
     *
     * @param visibility [IN] 页面状态
     *
     * @returns 状态码
     */
    PlayM4_IsVisible(visibility) {
        this.bVisibility = visibility;

        return PLAYM4_OK;
    }

    /**
     * @synopsis 获取SDK版本信息
     *
     * @returns 状态码
     */
    PlayM4_GetSdkVersion() {
        return "07040001";
    }

    /**
     * @synopsis 获取build日期
     *
     * @returns 状态码
     */
    PlayM4_GetBuildDate() {
        return "20220624";
    }

    /**
     * @synopsis 获取输入缓存大小
     *
     * @returns 返回输入缓存大小
     */
    PlayM4_GetInputBufSize() {
        return this.aInputDataBuffer.length;
    }

    /**
     * @synopsis 设置输入缓存大小
     *
     * @returns 设置输入缓存大小
     */
    PlayM4_SetInputBufSize(iInputBufSize) {
        if (iInputBufSize > 0) {
            this.iInputMaxBufSize = iInputBufSize;
            console.log(">>JSBufferSize SetInputBufSize:"+this.iInputMaxBufSize);
            return PLAYM4_OK;
        } else {
            return PLAYM4_PARA_OVER;
        }
    }

    /**
     * @synopsis 获取YUV缓存大小
     *
     * @returns 返回YUV缓存大小
     */
    PlayM4_GetYUVBufSize() {
        return this.aVideoFrameBuffer.length;
    }

    /**
     * @synopsis 获取一帧图像分辨率
     *
     * @param callBack [IN] 获取一帧图像分辨率回调函数
     *
     * @returns 状态码
     */
    PlayM4_GetFrameResolution(callBack) {
        if (this.decodeWorker == null) {
            return PLAYM4_ORDER_ERROR;
        }

        if (callBack && typeof (callBack) === "function") {
            callBack(this.nWidth, this.nHeight);

            return PLAYM4_OK;
        } else {
            return PLAYM4_PARA_OVER;
        }
    }


    /**
     * @synopsis 获取YUV缓存大小
     *
     * @returns 返回YUV缓存大小
     */
    PlayM4_RegisterYUVBufSizeCB(callback) {
        if (callback && typeof (callback) === "function") {
            this.YUVBufSizeCBFun = callback;
            return PLAYM4_OK;
        } else {
            return PLAYM4_PARA_OVER;
        }
    }

    /**
     * @synopsis 注销YUV缓存大小回调
     *
     * @returns
     */
    PlayM4_UnRegisterYUVBufSizeCB() {
        if (this.YUVBufSizeCBFun != null) {
            this.YUVBufSizeCBFun = null;
        }

        return PLAYM4_OK;
    }

    /**
     * @synopsis 画布置透明
     *
     * @returns 状态码
     */
    PlayM4_ClearCanvas() {
        if (this.oSuperRender == null) {
            return PLAYM4_ORDER_ERROR;
        }

        // 画布置黑
        this.oSuperRender.SR_DisplayFrameData(this.nWidth, this.nHeight, null);

        return PLAYM4_OK;
    }

    /**
     * @synopsis 释放输入码流缓存
     *
     * @returns 状态码
     */
    PlayM4_ReleaseInputBuffer() {
        if (this.aInputDataBuffer === null) {
            return PLAYM4_ORDER_ERROR;
        }

        // 释放缓存
        this.aInputDataBuffer.splice(0, this.aInputDataBuffer.length);
        this.aInputDataLens.splice(0, this.aInputDataLens.length);

        return PLAYM4_OK;
    }

    /**
     * @synopsis 获取解码帧类型
     *
     * @returns 返回解码帧类型
     */
    PlayM4_GetDecodeFrameType() {
        return this.nDecFrameType;
    }

    /**
     * @synopsis 设置编码层断帧
     *
     * @returns 错误码
     */
    PlayM4_SetDemuxModel(nIdemuxType,bTrue) {
         // 往 Worker 送数据
         this.decodeWorker.postMessage({
            'command': "SetDemuxModel",
            'nIdemuxType': nIdemuxType,
            'bTrue': bTrue
        });
        return PLAYM4_OK;
    }

    /**
     * @synopsis 设置跳过错误数据
     *
     * @returns 错误码
     */
    PlayM4_SkipErrorData(bSkip) {
        // 往 Worker 送数据
        this.decodeWorker.postMessage({
           'command': "SkipErrorData",
           'bSkip': bSkip
       });
       return PLAYM4_OK;
   }

    /**
     * @synopsis 设置解码差错隐藏等级
     *
     * @returns 错误码
     */
    PlayM4_SetDecodeERC(nLevel) {
        // 往 Worker 送数据
        this.decodeWorker.postMessage({
           'command': "SetDecodeERC",
           'nLevel': nLevel
       });
       return PLAYM4_OK;
   }

    /**
     * @synopsis 设置降噪等级
     *
     * @returns 错误码
     */
    PlayM4_SetANRParam(nEnable,nANRLevel) {
        // 往 Worker 送数据
        this.decodeWorker.postMessage({
           'command': "SetANRParam",
           'nEnable': nEnable,
           'nANRLevel':nANRLevel,
       });
       return PLAYM4_OK;
   }
     /**
     * @synopsis 设置重采样
     *
     * @returns 错误码
     */
    PlayM4_SetResampleValue(nEnable,resampleValue) {
        // 往 Worker 送数据
        this.decodeWorker.postMessage({
           'command': "SetResampleValue",
           'nEnable': nEnable,
           'resampleValue':resampleValue,
       });
       return PLAYM4_OK;
   }
    /**
     * @synopsis 下载文件
     *
     * @param {object} oData 数据 File对象或者Blob对象或者ArrayBuffer对象
     * @param {string} szName 下载文件名
     * @returns {none} 无返回
     */
    downloadFile(oData, szName) {
        let oBlob = oData;
        if (!(oData instanceof Blob || oData instanceof File)) {
            oBlob = new Blob([oData]);
        }
        var szFileUrl = window.URL.createObjectURL(oBlob);
        var oLink = window.document.createElement("a");
        oLink.href = szFileUrl;
        oLink.download = szName;

        var oClick = document.createEvent("MouseEvents");
        oClick.initEvent("click", true, true);
        oLink.dispatchEvent(oClick);
    }
}
