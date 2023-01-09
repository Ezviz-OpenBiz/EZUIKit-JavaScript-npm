/**
 * Created by wangweijie5 on 2016/12/5.
 */
(function (event) {
    const AUDIO_TYPE = 0;	// 音频
    const VIDEO_TYPE = 1;   // 视频
    const PRIVT_TYPE = 2;  // 私有帧

    const PLAYM4_AUDIO_FRAME = 100; // 音频帧
    const PLAYM4_VIDEO_FRAME = 101; // 视频帧

    const PLAYM4_OK = 1;
	const PLAYM4_ORDER_ERROR = 2;
    const PLAYM4_DECODE_ERROR = 44 	// 解码失败
    const PLAYM4_NOT_KEYFRAME = 48; 	// 非关键帧
    const PLAYM4_NEED_MORE_DATA = 31;   // 需要更多数据才能解析
    const PLAYM4_NEED_NEET_LOOP = 35; //丢帧需要下个循环
    const PLAYM4_SYS_NOT_SUPPORT = 16; 	// 不支持

    importScripts('Decoder.js');
    Module.addOnPostRun(function () {
        postMessage({'function': "loaded"});
    });

    var iStreamMode = 0;  // 流模式

    var bOpenMode = false;
    var bOpenStream = false;
    
    var funGetFrameData = null;
    var funGetAudFrameData = null;
	
    var bWorkerPrintLog=false;//worker层log开关
    
    var g_nPort = -1;

    onmessage = function (event)
    {
        var eventData = event.data;
        var res = 0;
        switch (eventData.command)
        {
			case "printLog":
			    let downloadFlag=eventData.data;
			    if(downloadFlag===true)
                {
                    bWorkerPrintLog=true;
                    res = Module._SetPrintLogFlag(g_nPort,downloadFlag);
                }
			    else
                {
                    bWorkerPrintLog=false;
                    res = Module._SetPrintLogFlag(g_nPort,downloadFlag);
                }

				if (res !== PLAYM4_OK)
                {
					console.log("DecodeWorker.js: PlayerSDK print log failed,res"+res);
                    postMessage({'function': "printLog", 'errorCode': res});
                }
				break;
            case "SetPlayPosition":
                let nFrameNumOrTime=eventData.data;
                let enPosType=eventData.type;
                // res = Module._SetPlayPosition(nFrameNumOrTime,enPosType);
                // if (res !== PLAYM4_OK)
                // {
                //     postMessage({'function': "SetPlayPosition", 'errorCode': res});
                //     return;
                // }
                // //有没有buffer需要清除

                break;
            case "SetStreamOpenMode":
                //获取端口号
                g_nPort = Module._GetPort();
                //设置流打开模式
                iStreamMode = eventData.data;
                res = Module._SetStreamOpenMode(g_nPort,iStreamMode);
                if (res !== PLAYM4_OK)
                {
                    postMessage({'function': "SetStreamOpenMode", 'errorCode': res});
                    return;
                }
                bOpenMode = true;
                break;

            case "OpenStream":
                // 接收到的数据
                var iHeadLen = eventData.dataSize;
                var pHead = Module._malloc(iHeadLen + 4);
                if (pHead === null)
                {
                    return;
                }
                var aHead = Module.HEAPU8.subarray(pHead, pHead + iHeadLen);
                aHead.set(eventData.data);
                res = Module._OpenStream(g_nPort,pHead, iHeadLen, eventData.bufPoolSize);
                postMessage({'function': "OpenStream", 'errorCode': res});
                if (res !== PLAYM4_OK)
                {
                    //释放内存
                    Module._free(pHead);
                    pHead = null;
                    return;
                }
                bOpenStream = true;
                break;
            case "Play":
                 let resP = Module._Play(g_nPort);
                 if (resP !== PLAYM4_OK)
                 {
                     return;
                 }
                break;
            case "InputData":
                // 接收到的数据
                var iLen = eventData.dataSize;
                if (iLen > 0)
                {
                    var pInputData = Module._malloc(iLen);
                    if (pInputData === null)
                    {
                        return;
                    }
                    var inputData = new Uint8Array(eventData.data);
                    // var aInputData = Module.HEAPU8.subarray(pInputData, pInputData + iLen);
                    // aInputData.set(inputData);
                    Module.writeArrayToMemory(inputData, pInputData);
                    inputData = null;
                    res = Module._InputData(g_nPort,pInputData, iLen);
                    if (res !== PLAYM4_OK)
                    {
                        let errorCode = Module._GetLastError(g_nPort);
                        let sourceRemain =  Module._GetSourceBufferRemain(g_nPort);
                        postMessage({'function': "InputData", 'errorCode': errorCode,"sourceRemain":sourceRemain});
                    }
                    Module._free(pInputData);
                    pInputData = null;  
                }else{
                    let sourceRemain =  Module._GetSourceBufferRemain(g_nPort);
                    if(sourceRemain == 0)
                    {
                        // console.log("C buffer and JS buffer size is both 0");
                        postMessage({'function': "InputData", 'errorCode':PLAYM4_NEED_MORE_DATA});
                        return;
                    }
                }

                /////////////////////
                if (funGetFrameData === null)
                {
                    funGetFrameData = Module.cwrap('GetFrameData', 'number');
                }

                while (bOpenMode && bOpenStream)
                {
                    
                    var ret = getFrameData(funGetFrameData);
                    // 直到获取视频帧或数据不足为止
                    if (PLAYM4_VIDEO_FRAME === ret ||PLAYM4_NEED_MORE_DATA === ret || PLAYM4_ORDER_ERROR === ret || PLAYM4_NEED_NEET_LOOP ===ret)//PLAYM4_VIDEO_FRAME === ret ||
                    {
                        break;
                    }
                }
                break;

            case "SetSecretKey":
                var keyLen = eventData.nKeyLen;
                var pKeyData = Module._malloc(keyLen);
                if (pKeyData === null) {
                    return;
                }
                var nKeySize = eventData.data.length
                var bufData = stringToBytes (eventData.data);
                var aKeyData = Module.HEAPU8.subarray(pKeyData, pKeyData + keyLen);
                aKeyData.set(new Uint8Array(bufData));

                res = Module._SetSecretKey(g_nPort,eventData.nKeyType, pKeyData, keyLen);//, nKeySize
                if (res !== PLAYM4_OK) {
                    postMessage({'function': "SetSecretKey", 'errorCode': res});
                    Module._free(pKeyData);
                    pKeyData = null;
                    return;
                }

                Module._free(pKeyData);
                pKeyData = null;
                break;

            case "GetBMP":
                var nBMPWidth = eventData.width;
                var nBMPHeight = eventData.height;
                var pYUVData = eventData.data;
                var nYUVSize = nBMPWidth * nBMPHeight * 3 / 2;
                var oBMPCropRect = eventData.rect;

                var pDataYUV = Module._malloc(nYUVSize);
                if (pDataYUV === null) {
                    return;
                }

                Module.writeArrayToMemory(new Uint8Array(pYUVData, 0, nYUVSize), pDataYUV);

                // 分配BMP空间
                var nBmpSize = nBMPWidth * nBMPHeight * 4 + 60;
                var pBmpData = Module._malloc(nBmpSize);
                var pBmpSize = Module._malloc(4);
                if (pBmpData === null || pBmpSize === null) {
                    Module._free(pDataYUV);
                    pDataYUV = null;

                    if (pBmpData != null) {
                        Module._free(pBmpData);
                        pBmpData = null;
                    }

                    if (pBmpSize != null) {
                        Module._free(pBmpSize);
                        pBmpSize = null;
                    }
                    return;
                }

               //Module._memset(pBmpSize, nBmpSize, 4); // 防止bmp截图出现输入数据过大的错误码
                Module.setValue(pBmpSize, nBmpSize, "i32"); 
                res = Module._GetBMP(g_nPort,pDataYUV, nYUVSize, pBmpData, pBmpSize,
                    oBMPCropRect.left, oBMPCropRect.top, oBMPCropRect.right, oBMPCropRect.bottom);
                if (res !== PLAYM4_OK) {
                    postMessage({'function': "GetBMP", 'errorCode': res});
                    Module._free(pDataYUV);
                    pDataYUV = null;
                    Module._free(pBmpData);
                    pBmpData = null;
                    Module._free(pBmpSize);
                    pBmpSize = null;
                    return;
                }

                // 获取BMP图片大小
                var nBmpDataSize = Module.getValue(pBmpSize, "i32");

                // 获取BMP图片数据
                var aBmpData = new Uint8Array(nBmpDataSize);
                aBmpData.set(Module.HEAPU8.subarray(pBmpData, pBmpData + nBmpDataSize));

                postMessage({'function': "GetBMP", 'data': aBmpData, 'errorCode': res}, [aBmpData.buffer]);
                aBmpData=null;
                if (pDataYUV != null) {
                    Module._free(pDataYUV);
                    pDataYUV = null;
                }
                if (pBmpData != null) {
                    Module._free(pBmpData);
                    pBmpData = null;
                }
                if (pBmpSize != null) {
                    Module._free(pBmpSize);
                    pBmpSize = null;
                }
                break;

            case "GetJPEG":
                var nJpegWidth = eventData.width;
                var nJpegHeight = eventData.height;
                var pYUVData1 = eventData.data;
                var nYUVSize1 = nJpegWidth * nJpegHeight * 3 / 2;
                var oJpegCropRect = eventData.rect;

                var pDataYUV1 = Module._malloc(nYUVSize1);
                if (pDataYUV1 === null) {
                    return;
                }

                Module.writeArrayToMemory(new Uint8Array(pYUVData1, 0, nYUVSize1), pDataYUV1);

                // 分配JPEG空间
                var pJpegData = Module._malloc(nYUVSize1);
                var pJpegSize = Module._malloc(4);
                if (pJpegData === null || pJpegSize === null) {
                    if (pJpegData != null) {
                        Module._free(pJpegData);
                        pJpegData = null;
                    }

                    if (pJpegSize != null) {
                        Module._free(pJpegSize);
                        pJpegSize = null;
                    }

                    if (pDataYUV1 != null) {
                        Module._free(pDataYUV1);
                        pDataYUV1 = null;
                    }
                    return;
                }

                Module.setValue(pJpegSize, nJpegWidth * nJpegHeight * 2, "i32");    // JPEG抓图，输入缓冲长度不小于当前帧YUV大小

                res = Module._GetJPEG(g_nPort,pDataYUV1, nYUVSize1, pJpegData, pJpegSize,
                    oJpegCropRect.left, oJpegCropRect.top, oJpegCropRect.right, oJpegCropRect.bottom);
                if (res !== PLAYM4_OK) {
                    postMessage({'function': "GetJPEG", 'errorCode': res});
                    if (pJpegData != null) {
                        Module._free(pJpegData);
                        pJpegData = null;
                    }

                    if (pJpegSize != null) {
                        Module._free(pJpegSize);
                        pJpegSize = null;
                    }

                    if (pDataYUV1 != null) {
                        Module._free(pDataYUV1);
                        pDataYUV1 = null;
                    }
                    return;
                }

                // 获取JPEG图片大小
                var nJpegSize = Module.getValue(pJpegSize, "i32");

                // 获取JPEG图片数据
                var aJpegData = new Uint8Array(nJpegSize);
                aJpegData.set(Module.HEAPU8.subarray(pJpegData, pJpegData + nJpegSize));

                postMessage({'function': "GetJPEG", 'data': aJpegData, 'errorCode': res}, [aJpegData.buffer]);

                nJpegSize = null;
                aJpegData = null;

                if (pDataYUV1 != null) {
                    Module._free(pDataYUV1);
                    pDataYUV1 = null;
                }
                if (pJpegData != null) {
                    Module._free(pJpegData);
                    pJpegData = null;
                }
                if (pJpegSize != null) {
                    Module._free(pJpegSize);
                    pJpegSize = null;
                }
                break;

            case "SetDecodeFrameType":
                var nFrameType = eventData.data;
                res = Module._SetDecodeFrameType(g_nPort,nFrameType);
                if (res !== PLAYM4_OK) {
                    postMessage({'function': "SetDecodeFrameType", 'errorCode': res});
                    return;
                }
                break;
            case "CloseStream":
                //stop
                let resS = Module._Stop(g_nPort);
                if (resS !== PLAYM4_OK) {
                    postMessage({'function': "Stop", 'errorCode': res});
                    return;
                }
                //closeStream
                res = Module._CloseStream(g_nPort);
                if (res !== PLAYM4_OK) {
                    postMessage({'function': "CloseStream", 'errorCode': res});
                    return;
                }
                //freePort
                let resF = Module._FreePort(g_nPort);
                if (resF !== PLAYM4_OK) {
                    postMessage({'function': "FreePort", 'errorCode': res});
                    return;
                }
                break;
            case "PlaySound":
                let resPS = Module._PlaySound(g_nPort);
                if (resPS !== PLAYM4_OK) {
                    console.log("PlaySound failed");
                    return;
                }
                break;
            case "StopSound":
                let resSS = Module._StopSound();
                if (resSS !== PLAYM4_OK) {
                    console.log("StopSound failed");
                    return;
                }
                break;
            case "SetVolume":
                let resSV = Module._SetVolume(g_nPort,eventData.volume);
                if (resSV !== PLAYM4_OK) {
                    console.log("Audio SetVolume failed");
                    return;
                }
                break;
            case "GetVolume":
                let volume = Module._GetVolume();
                if(volume>0)
                {
                    postMessage({'function': "GetVolume", 'volume': volume});
                }
                else{
                    console.log("Audio GetVolume failed");
                    return;
                }
                break;
            case "OnlyPlaySound":
                let resOPS = Module._OnlyPlaySound(g_nPort);
                if (resOPS !== PLAYM4_OK) {
                    console.log("OnlyPlaySound failed");
                    return;
                }
                break;
            case "Pause" :
                let resPa = Module._Pause(g_nPort,eventData.bPlay);
                if (resPa !== PLAYM4_OK) {
                    console.log("Pause failed");
                    return;
                }
            case "PlayRate":
                Module._SetPlayRate(g_nPort,eventData.playRate);
                break;
            case "SetIFrameDecInterval":
                Module._SetIFrameDecInterval(g_nPort,eventData.data);
                break;
			case "SetLostFrameMode":
			    Module._SetLostFrameMode(g_nPort,eventData.data);
                break;
            case "SetDemuxModel":
                Module._SetDemuxModel(g_nPort,eventData.nIdemuxType,eventData.bTrue);
                break;
            case "SkipErrorData":
                Module._SkipErrorData(g_nPort,eventData.bSkip);
                break;
            case "SetDecodeERC":
                Module._SetDecodeERC(g_nPort,eventData.nLevel);
                break;
            case "SetANRParam":
                Module._SetANRParam(g_nPort,eventData.nEnable,eventData.nANRLevel);
                break;
            case "SetResampleValue":
                Module._SetResampleValue(g_nPort,eventData.nEnable,eventData.resampleValue);
                break;
            case "GetLastError":
                let errorCode = Module._GetLastError(g_nPort);
                postMessage({'function': "GetLastError", 'errorCode': errorCode});
                break;
            default:
                break;
        }
    };

    function getOSDTime(oFrameInfo) {
        var iYear = oFrameInfo.year;
        var iMonth = oFrameInfo.month;
        var iDay = oFrameInfo.day;
        var iHour = oFrameInfo.hour;
        var iMinute = oFrameInfo.minute;
        var iSecond = oFrameInfo.second;

        if (iMonth < 10) {
            iMonth = "0" + iMonth;
        }
        if (iDay < 10) {
            iDay = "0" + iDay;
        }
        if (iHour < 10) {
            iHour = "0" + iHour;
        }
        if (iMinute < 10) {
            iMinute = "0" + iMinute;
        }
        if (iSecond < 10) {
            iSecond = "0" + iSecond;
        }

        return iYear + "-" + iMonth + "-" + iDay + " " + iHour + ":" + iMinute + ":" + iSecond;
    }
    // 获取帧数据
    function getFrameData(fun)
    {
    // function getFrameData() {
        // 获取帧数据
        // var res = Module._GetFrameData();
        var res = fun();
        if (res === PLAYM4_OK)
        {
            var oFrameInfo = Module._GetFrameInfo();
            switch (oFrameInfo.frameType)
            {
                case AUDIO_TYPE:
                    var iSize = oFrameInfo.frameSize;
                    if (0 === iSize)
                    {
                        return -1;
                    }
                    var pPCM = Module._GetFrameBuffer();
                    // var audioBuf = new ArrayBuffer(iSize);
                    var aPCMData = new Uint8Array(iSize);
                    aPCMData.set(Module.HEAPU8.subarray(pPCM, pPCM + iSize));
                    if(bWorkerPrintLog)
                    {
                        console.log("<<<Worker: audio media Info: nSise:"+ oFrameInfo.frameSize+",nSampleRate:"+oFrameInfo.samplesPerSec+',channel:'+oFrameInfo.channels+',bitsPerSample:'+oFrameInfo.bitsPerSample);
                    }
                    postMessage({
                        'function': "GetFrameData", 'type': "audioType", 'data': aPCMData.buffer,
                        'frameInfo': oFrameInfo, 'errorCode': res
                    }, [aPCMData.buffer]);

                    oFrameInfo = null;
                    pPCM = null;
                    aPCMData = null;
                    return PLAYM4_AUDIO_FRAME;

                case VIDEO_TYPE:
                    var szOSDTime = getOSDTime(oFrameInfo);

                    var iWidth = oFrameInfo.width;
                    var iHeight = oFrameInfo.height;

                    var iYUVSize = iWidth * iHeight * 3 / 2;
                    if (0 === iYUVSize)
                    {
                        return -1;
                    }

                    var pYUV = Module._GetFrameBuffer();

                    // 图像数据渲染后压回，若从主码流切到子码流，存在数组大小与图像大小不匹配现象
                    var aYUVData = new Uint8Array(iYUVSize);
                    aYUVData.set(Module.HEAPU8.subarray(pYUV, pYUV + iYUVSize));
                    if(bWorkerPrintLog)
                    {
                        console.log("<<<Worker: video media Info: Width:"+ oFrameInfo.width+",Height:"+oFrameInfo.height+",timeStamp:"+oFrameInfo.timeStamp);
                    }

                    postMessage({
                      'function': "GetFrameData", 'type': "videoType", 'data': aYUVData.buffer,
                   'dataLen': aYUVData.length,'osd': szOSDTime, 'frameInfo': oFrameInfo, 'errorCode': res
                    }, [aYUVData.buffer]);

                    oFrameInfo = null;
                    pYUV = null;
                    aYUVData = null;
                    return PLAYM4_VIDEO_FRAME;

                case PRIVT_TYPE:
                    postMessage({
                        'function': "GetFrameData", 'type': "", 'data': null,
                        'dataLen': -1, 'osd': 0, 'frameInfo': null, 'errorCode': PLAYM4_SYS_NOT_SUPPORT
                    });
                    return PLAYM4_SYS_NOT_SUPPORT;

                default:
                    postMessage({
                        'function': "GetFrameData", 'type': "", 'data': null,
                        'dataLen': -1, 'osd': 0, 'frameInfo': null, 'errorCode': PLAYM4_SYS_NOT_SUPPORT
                    });
                    return PLAYM4_SYS_NOT_SUPPORT;
            }
        }
        else {
            let errorCode = Module._GetLastError(g_nPort);
            //解码失败返回裸数据
            if(PLAYM4_DECODE_ERROR===errorCode)
            {
                var rawInfo=Module._GetRawDataInfo();
                var pRawData = Module._GetRawDataBuffer();
                var aRawData = new Uint8Array(rawInfo.isize);
                aRawData.set(Module.HEAPU8.subarray(pRawData, pRawData + rawInfo.isize));
                postMessage({
                    'function': "GetRawData", 'type': "", 'data':aRawData.buffer,
                    'rawDataLen': rawInfo.isize, 'osd': 0, 'frameInfo': null, 'errorCode': errorCode
                });
                rawInfo=null;
                pRawData=null;
                aRawData=null;
            }
            //需要更多数据
            if (PLAYM4_NEED_MORE_DATA === errorCode || PLAYM4_SYS_NOT_SUPPORT === errorCode || PLAYM4_NEED_NEET_LOOP === errorCode){
                postMessage({
                    'function': "GetFrameData", 'type': "", 'data': null,
                    'dataLen': -1, 'osd': 0, 'frameInfo': null, 'errorCode': errorCode
                });
            }
            return errorCode;
        }
    }

    // 开始计算时间
    function startTime() {
        return new Date().getTime();
    }

    // 结束计算时间
    function endTime() {
        return new Date().getTime();
    }

    // 字母字符串转byte数组
    function stringToBytes ( str ) {
        var ch, st, re = [];
        for (var i = 0; i < str.length; i++ ) {
            ch = str.charCodeAt(i);  // get char
            st = [];                 // set up "stack"
            do {
                st.push( ch & 0xFF );  // push byte to stack
                ch = ch >> 8;          // shift value down by 1 byte
            }
            while ( ch );
            // add stack contents to result
            // done because chars have "wrong" endianness
            re = re.concat( st.reverse() );
        }
        // return an array of bytes
        return re;
    }
})();