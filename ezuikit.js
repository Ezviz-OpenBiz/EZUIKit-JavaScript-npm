/**
 * EZUIKitPlayer for npm
 */
(function (global, factory) {

  "use strict";

  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = global.document ?
      factory(global, true) :
      function (w) {
        if (!w.document) {
          throw new Error("EZUIPlayer requires a window with a document");
        }
        return factory(w);
      };
  } else {
    factory(global);
  }

  // Pass this if window is not defined yet
})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
  // 加载js
  function addJs(filepath, callback) {
    var oJs = document.createElement("script");
    oJs.setAttribute("src", filepath);
    oJs.onload = callback;
    document.getElementsByTagName("head")[0].appendChild(oJs);
  }
  // 加载css
  function addCss(filepath, callback) {
    var oJs = document.createElement('link');
    oJs.rel = 'stylesheet';
    oJs.type = 'text/css';
    oJs.href = filepath;
    oJs.onload = callback;
    document.getElementsByTagName("head")[0].appendChild(oJs);
  }
  // 通用请求方法
  function request(url, method, params, header, success, error) {
    var _url = url;
    var http_request = new XMLHttpRequest();
    http_request.onreadystatechange = function () {
      if (http_request.readyState == 4) {
        if (http_request.status == 200) {
          var _data = JSON.parse(http_request.responseText);
          success(_data);
        }
      }
    };
    http_request.open(method, _url, true);
    // http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var data = new FormData();
    for (var i in params) {
      data.append(i, params[i]);
    }
    http_request.send(data);
  };

  var EZUIKit = {
    EZUIKitPlayer: undefined,
    EZUIKitTalk: undefined,
    opt: {
      apiDomain: 'https://open.ys7.com/api/lapp/live/talk/url',
      filePath: 'https://open.ys7.com/assets/ezuikit_v2.6.4',
      accessToken: '',
      url: '',
      deviceSerial: '',
      channelNo: '',
      id: '',
      talkLink: '',
      rtcUrl: '',
      ttsUrl: '',
      stream: '',
      // 对讲插件依赖
      isReliesReady: false,
      template: 'simple',
      audio: 0,// 声音id -1-不开启 0-第一路 1-第二路 
    },
    state: {
      countTimer: undefined,// countTime 计时器
      recodeTime: 0, // 录音时间
      recodeTimer: undefined, //录音时长 计时器
      recodeTime: 0,
      fetchDefaultList: false, // 是否拉取默认语音-当用户语音为空
      page: 0, // 语音当前页
      pageSize: 5,
    }
  }

  /**
   * 视频播放器-开始
   */
  var domain = "https://open.ys7.com";


  var EZUIKitPlayer = function (params) {
    var _this = this;
    console.log("params", params);
    if (params.id) {
      EZUIKit.opt.id = params.id;
    }
    if (params.accessToken) {
      EZUIKit.opt.accessToken = params.accessToken;
    }
    if (params.url) {
      EZUIKit.opt.url = params.url;
      EZUIKit.opt.deviceSerial = params.url.split("/")[3];
      EZUIKit.opt.channelNo = params.url.split("/")[4].split(".")[0];
    }
    if (params.template) {
      EZUIKit.opt.template = params.template;
    }

    let id = EZUIKit.opt.id;
    var domElement = document.getElementById(id);
    // 间隙
    domElement.style.fontSize = 0;
    /**
     * 渲染iframe视频框
     */
    var iframe = document.createElement('iframe');
    function matchIframeUrl() {
      switch (EZUIKit.opt.template) {
        case 'simple':
          return "https://open.ys7.com/ezopen/h5/iframe?url=" + EZUIKit.opt.url + "&autoplay=" + EZUIKit.opt.autoplay + "&audio=" + EZUIKit.opt.audio + "&accessToken=" + params.accessToken + "&templete=0";
        case 'standard':
          return "https://open.ys7.com/ezopen/h5/iframe?url=" + EZUIKit.opt.url + "&autoplay=" + EZUIKit.opt.autoplay + "&audio=" + EZUIKit.opt.audio + "&accessToken=" + params.accessToken + "&templete=1";
        case 'security':
          return "https://open.ys7.com/ezopen/h5/iframe_se?url=" + EZUIKit.opt.url + "&autoplay=" + EZUIKit.opt.autoplay + "&audio=" + EZUIKit.opt.audio + "&accessToken=" + params.accessToken + "&templete=0";
        default:
          return "https://open.ys7.com/ezopen/h5/iframe?url=" + EZUIKit.opt.url + "&autoplay=" + EZUIKit.opt.autoplay + "&audio=" + EZUIKit.opt.audio + "&accessToken=" + params.accessToken + "&templete=0";
      }
    }
    iframe.src = matchIframeUrl();
    // 默认取容器宽高
    var iframeHeight = document.getElementById(id).offsetHeight;
    var iframeWidth = document.getElementById(id).offsetWidth;
    if (params.height) {
      iframeHeight = parseInt(params.height);
    }
    if (params.width) {
      iframeWidth = parseInt(params.width);
    }
    iframe.width = iframeWidth;
    iframe.height = iframeHeight;
    iframe.id = 'EZUIKitPlayer-' + id;
    // 部分iframe属性
    iframe.setAttribute("allowfullscreen", true)
    iframe.setAttribute("frameborder", 0)
    console.log("iframe", iframe)
    domElement.appendChild(iframe)
    var jqueryJS = EZUIKit.opt.filePath + '/js/jquery.js';
    var layerJs = 'https://open.ys7.com/assets/layer/layer.js';
    var recoderCSS = EZUIKit.opt.filePath + '/npm/css/recoder.css';
    addCss(recoderCSS, function () {

    })
    addJs(jqueryJS, function () {
      addJs(layerJs, function () {
        /**
     * 渲染header
     */
        if (matchHeaderOpt().headerContainer) {
          // if (params.header && params.header instanceof Array) {
          var headerContainer = document.createElement('div');
          headerContainer.setAttribute('class', 'panel-top');
          var controsDOM = document.createElement('div');
          controsDOM.setAttribute('class', 'contros');
          headerContainer.appendChild(controsDOM);
          domElement.insertBefore(headerContainer, iframe);
          if (matchHeaderOpt().capturePictureModule) {
            // 截图
            var capturePictureDOM = document.createElement('span');
            capturePictureDOM.innerHTML =
              '<span title="截图">'
              + '<svg id="capturePicture" title="截图" t="1578882764585" class="icon" viewBox="0 0 1024 1024" version="1.1"'
              + '  xmlns="http://www.w3.org/2000/svg" p-id="5958" width="24" height="24">'
              + '  <path'
              + '    d="M887.296 315.904h-153.6c-51.2 0-68.096-102.4-119.296-102.4H392.704c-34.304 0-51.2 102.4-102.4 102.4h-153.6c-29.696 0-51.2 21.504-51.2 51.2v439.296c0 25.6 21.504 47.104 51.2 47.104h751.104c29.696 0 51.2-21.504 51.2-51.2v-435.2c-0.512-30.208-21.504-51.2-51.712-51.2zM512 768c-115.2 0-204.8-89.6-204.8-200.704s89.6-200.704 204.8-200.704 204.8 89.6 204.8 200.704-93.696 200.704-204.8 200.704z m247.296-354.304c-12.8 0-25.6-12.8-25.6-25.6s12.8-25.6 25.6-25.6 25.6 12.8 25.6 25.6c0 17.408-12.8 25.6-25.6 25.6zM256 264.704c0-8.704-8.704-16.896-16.896-16.896h-51.2c-8.704 0-16.896 8.704-16.896 16.896V281.6H256v-16.896z m256 148.992c-85.504 0-153.6 68.096-153.6 153.6s68.096 153.6 153.6 153.6 153.6-68.096 153.6-153.6-68.096-153.6-153.6-153.6z"'
              + '    fill="#ffffff" p-id="5959"></path>'
              + '</svg>'
              + '</span>';
            capturePictureDOM.onclick = function () {
              _this.capturePicture();
            }
            controsDOM.appendChild(capturePictureDOM);
          }
          console.log("matchHeaderOpt().saveModule", matchHeaderOpt().saveModule)
          if (matchHeaderOpt().saveModule) {

            var startSaveDOM = document.createElement('span');
            startSaveDOM.innerHTML =
              '<span title="开始录像">'
              + '  <svg id="startSave" t="1578882716693" class="icon" viewBox="0 0 1024 1024" version="1.1"'
              + '    xmlns="http://www.w3.org/2000/svg" p-id="3782" width="24" height="24">'
              + '    <path'
              + '      d="M915.2 729.6l-128-76.8c-25.6-12.8-44.8-32-44.8-51.2V435.2c0-25.6 19.2-38.4 44.8-51.2l128-76.8c25.6-12.8 44.8 0 44.8 19.2V704c0 32-19.2 38.4-44.8 25.6z m-332.8 89.6H96c-51.2 0-89.6-38.4-89.6-89.6V332.8c0-51.2 38.4-89.6 89.6-89.6h486.4c51.2 0 89.6 38.4 89.6 89.6v396.8c0 51.2-38.4 89.6-89.6 89.6zM192 364.8c-32 6.4-57.6 32-64 64-12.8 57.6 38.4 115.2 96 102.4 32-6.4 57.6-32 64-70.4 12.8-57.6-38.4-108.8-96-96z m0 0"'
              + '      p-id="3783" fill="#ffffff"></path>'
              + '  </svg>'
              + '</span>'
            startSaveDOM.onclick = function () {
              _this.startSave();
              document.getElementById('startSave').setAttribute('class', 'icon hide');
              document.getElementById('stopSave').setAttribute('class', 'icon');
            }
            controsDOM.appendChild(startSaveDOM);

            var stopSaveDOM = document.createElement('span');
            stopSaveDOM.innerHTML =
              '<span title="结束录像">'
              + ' <svg id="stopSave" t="1578882716693" class="icon hide" viewBox="0 0 1024 1024" version="1.1"'
              + '   xmlns="http://www.w3.org/2000/svg" p-id="3782" width="24" height="24">'
              + '   <path'
              + '     d="M915.2 729.6l-128-76.8c-25.6-12.8-44.8-32-44.8-51.2V435.2c0-25.6 19.2-38.4 44.8-51.2l128-76.8c25.6-12.8 44.8 0 44.8 19.2V704c0 32-19.2 38.4-44.8 25.6z m-332.8 89.6H96c-51.2 0-89.6-38.4-89.6-89.6V332.8c0-51.2 38.4-89.6 89.6-89.6h486.4c51.2 0 89.6 38.4 89.6 89.6v396.8c0 51.2-38.4 89.6-89.6 89.6zM192 364.8c-32 6.4-57.6 32-64 64-12.8 57.6 38.4 115.2 96 102.4 32-6.4 57.6-32 64-70.4 12.8-57.6-38.4-108.8-96-96z m0 0"'
              + '     p-id="3783" fill="red"></path>'
              + ' </svg>'
              + ' </span>'
            stopSaveDOM.onclick = function () {
              _this.stopSave();
              document.getElementById('stopSave').setAttribute('class', 'icon hide');
              document.getElementById('startSave').setAttribute('class', 'icon');
            }
            controsDOM.appendChild(stopSaveDOM);
          }
          if (matchHeaderOpt().zoomModule) {

            var enableZoomDOM = document.createElement('span');
            enableZoomDOM.innerHTML =
              '<span title="开启电子放大">'
              + '  <svg id="enableZoom" t="1578882639834" class="icon" viewBox="0 0 1000 1000" version="1.1"'
              + '    xmlns="http://www.w3.org/2000/svg" p-id="2227" width="24" height="24">'
              + '    <path'
              + '      d="M830.6119 441.1089c0-193.7756-157.0939-350.8641-350.8775-350.8641S128.8559 247.3333 128.8559 441.1089 285.9508 791.972 479.7344 791.972 830.6119 634.8845 830.6119 441.1089zM483.2821 710.4863c-146.7975 0-265.8187-118.9953-265.8187-265.8088S336.4847 178.8697 483.2821 178.8697s265.8197 118.9953 265.8197 265.8078S630.0796 710.4863 483.2821 710.4863zM770.6031 653.5739l-72.6417 75.9485 141.6917 160.1814 82.0737-90.0739L770.6031 653.5739zM527.5849 267.4727h-88.60655762279428v132.90489048425167H306.0690340253259v88.60292721534799h132.90933675248866v132.9038911617923h88.60655762279428V488.9794719180395h132.90933675248866v-88.60292721534799H527.5849284006089V267.4726535408993z"'
              + '      p-id="2228" fill="#ffffff"></path>'
              + '  </svg>'
              + '</span>';
            enableZoomDOM.onclick = function () {
              _this.enableZoom();
              document.getElementById('enableZoom').setAttribute('class', 'icon hide');
              document.getElementById('closeZoom').setAttribute('class', 'icon');
            }
            controsDOM.appendChild(enableZoomDOM);

            var closeZoomDOM = document.createElement('span');
            closeZoomDOM.innerHTML =
              '<span title="关闭电子放大">'
              + '  <svg id="closeZoom" t="1578882639834" class="icon hide" viewBox="0 0 1000 1000" version="1.1"'
              + '    xmlns="http://www.w3.org/2000/svg" p-id="2227" width="24" height="24">'
              + '    <path'
              + '      d="M830.6119 441.1089c0-193.7756-157.0939-350.8641-350.8775-350.8641S128.8559 247.3333 128.8559 441.1089 285.9508 791.972 479.7344 791.972 830.6119 634.8845 830.6119 441.1089zM483.2821 710.4863c-146.7975 0-265.8187-118.9953-265.8187-265.8088S336.4847 178.8697 483.2821 178.8697s265.8197 118.9953 265.8197 265.8078S630.0796 710.4863 483.2821 710.4863zM770.6031 653.5739l-72.6417 75.9485 141.6917 160.1814 82.0737-90.0739L770.6031 653.5739zM527.5849 267.4727h-88.60655762279428v132.90489048425167H306.0690340253259v88.60292721534799h132.90933675248866v132.9038911617923h88.60655762279428V488.9794719180395h132.90933675248866v-88.60292721534799H527.5849284006089V267.4726535408993z"'
              + '      p-id="2228" fill="red"></path>'
              + '  </svg>'
              + '</span>'
            closeZoomDOM.onclick = function () {
              _this.closeZoom();
              document.getElementById('closeZoom').setAttribute('class', 'icon hide');
              document.getElementById('enableZoom').setAttribute('class', 'icon');
            }
            controsDOM.appendChild(closeZoomDOM);
          }


        }
        /**
         * 渲染footer
         */
        /** 根据配置匹配底部渲染 */
        function matchFooterOpt() {
          var result = {
            footerContainer: false,
            talkModule: false,
            broadcastModule: false,
            hdModule: false,
            fullScreenModule: false,
          }
          var template = EZUIKit.opt.template;
          switch (template) {
            case 'simple':
              if (params.footer && params.footer instanceof Array) {
                var footer = params.footer;
                result = {
                  footerContainer: true,
                  talkModule: footer.indexOf('talk') !== -1,
                  broadcastModule: footer.indexOf('broadcast') !== -1,
                  hdModule: footer.indexOf('hd') !== -1,
                  fullScreenModule: footer.indexOf('fullScreen') !== -1,
                }
              }
              break;
            case 'standard':
              break;
            case 'security':
              break;
            case 'voice':
              result = {
                footerContainer: true,
                talkModule: true,
                broadcastModule: true,
                hdModule: true,
                fullScreenModule: true,
              }
              break;
          }
          return result;
        }
        /** 根据配置匹配底部渲染 */
        function matchHeaderOpt() {
          var result = {
            headerContainer: false,
            capturePictureModule: false,
            saveModule: false,
            zoomModule: false,
          }
          var template = EZUIKit.opt.template;
          switch (template) {
            case 'simple':
              if (params.header && params.header instanceof Array) {
                var header = params.header;
                result = {
                  headerContainer: true,
                  capturePictureModule: header.indexOf('capturePicture') !== -1,
                  saveModule: header.indexOf('save') !== -1,
                  zoomModule: header.indexOf('zoom') !== -1,
                }
              }
              break;
            case 'standard':
              break;
            case 'security':
              break;
            case 'voice':
              result = {
                headerContainer: true,
                capturePictureModule: true,
                saveModule: true,
                zoomModule: true,
              }
              break;
          }
          return result;
        }
        if (matchFooterOpt().footerContainer) {
          var recoderCSS = EZUIKit.opt.filePath + '/npm/css/recoder.css';
          var recoderJs = EZUIKit.opt.filePath + '/npm/js/recoder.js';
          var recorderJs = EZUIKit.opt.filePath + '/recorder.js';
          // addCss()
          addCss(recoderCSS, function () {
            addJs(recoderJs, function () {
              addJs(recorderJs, function () {
                // 底部容器
                var footerContainer = document.createElement('div');
                footerContainer.setAttribute("class", 'audio-controls');
                domElement.appendChild(footerContainer);
                if (matchFooterOpt().hdModule || matchFooterOpt().fullScreenModule) {
                  // 底部右侧元素
                  var rightContros = document.createElement('div');
                  rightContros.setAttribute('class', 'contros');
                  footerContainer.appendChild(rightContros);
                  if (matchFooterOpt().hdModule) {
                    // 高清-标清切换
                    var hdDom = document.createElement('span');
                    hdDom.setAttribute('id', 'video-hd');
                    hdDom.innerHTML = EZUIKit.opt.url.indexOf('.hd') === -1 ? '标清' : '高清';
                    hdDom.onclick = function () {
                      // 停止
                      _this.stop();
                      if (EZUIKit.opt.url.indexOf('.hd') === -1) {
                        EZUIKit.opt.url = EZUIKit.opt.url.replace('.live', '.hd.live');
                        hdDom.innerHTML = EZUIKit.opt.url.indexOf('.hd') === -1 ? '标清' : '高清';
                      } else {
                        EZUIKit.opt.url = EZUIKit.opt.url.replace('.hd.live', '.live')
                      }
                      iframe.src = "https://open.ys7.com/ezopen/h5/iframe?url=" + EZUIKit.opt.url.replace('.hd.live', '.live') + "&autoplay=1&accessToken=at.bprcrj6c4pi47z4w4usxf4ce7q1ey6mi-5q5mxnkbif-1ej0zrx-frepmdcwl&templete=0";
                    }
                    rightContros.appendChild(hdDom);
                  }
                  if (matchFooterOpt().fullScreenModule) {
                    // 全屏控制
                    var fullScreenDOM = document.createElement('span');
                    fullScreenDOM.setAttribute('title', '全屏');
                    fullScreenDOM.setAttribute('style', 'vertical-align: top;');
                    fullScreenDOM.innerHTML = '<svg id="fullScreen" t="1578020167938" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5035" width="16" height="16"> <path d="M348.373333 625.706667l-128 128-64 64v-128a33.28 33.28 0 0 0-35.413333-35.413334A33.493333 33.493333 0 0 0 85.333333 689.706667v213.333333A33.706667 33.706667 0 0 0 120.96 938.666667h213.333333a35.626667 35.626667 0 0 0 0-71.04h-128l64-64 128-128a35.2 35.2 0 0 0-49.92-49.92zM206.293333 156.373333h128a33.28 33.28 0 0 0 35.413334-35.413333A33.493333 33.493333 0 0 0 334.293333 85.333333H113.706667c-7.04 0-14.08 7.04-21.333334 14.293334a26.026667 26.026667 0 0 0-7.04 21.333333v213.333333a33.493333 33.493333 0 0 0 35.626667 35.413334 33.28 33.28 0 0 0 35.413333-35.413334v-128l192 192a35.2 35.2 0 0 0 49.92-49.92zM903.04 85.333333h-213.333333a33.493333 33.493333 0 0 0-35.413334 35.626667 33.28 33.28 0 0 0 35.413334 35.413333h128l-64 64-128 128a35.2 35.2 0 0 0 49.92 49.92l128-128 64-64v128a35.626667 35.626667 0 0 0 71.04 0v-213.333333A33.706667 33.706667 0 0 0 903.04 85.333333zM903.04 654.293333a33.28 33.28 0 0 0-35.413333 35.413334v128l-64-64-128-128a35.2 35.2 0 0 0-49.92 49.92l128 128 64 64h-128a35.626667 35.626667 0 0 0 0 71.04h213.333333A33.706667 33.706667 0 0 0 938.666667 903.04v-213.333333a33.493333 33.493333 0 0 0-35.626667-35.413334z" p-id="5036" fill="#ffffff"></path></svg>'
                    fullScreenDOM.onclick = function () {
                      _this.fullScreen();
                    }
                    rightContros.appendChild(fullScreenDOM);
                  }
                }
                if (matchFooterOpt().talkModule) {
                  // 对讲
                  var startTalkDOM = document.createElement('div');
                  var stopTalkDOM = document.createElement('div');
                  startTalkDOM.setAttribute("class", "ptp-talk off");
                  startTalkDOM.innerHTML =
                    '<span title="对讲">'
                    + '<svg t="1581930496966" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"'
                    + '  p-id="1641" width="16" height="16">'
                    + '  <path'
                    + '    d="M715.648 647.872c-30.208-22.336-61.568 39.36-100.992 77.44-39.36 38.08-34.112 31.488-123.392-17.088S311.488 540.224 280 491.648C248.448 443.072 265.472 424.704 265.472 424.704s78.72-62.976 97.152-81.344c18.368-18.368 13.12-30.208 13.12-30.208l-128.64-190.144c-23.616-5.184-64.32 5.12-128.576 57.6C54.208 233.088 30.592 353.856 151.296 575.68c120.768 221.824 347.84 330.752 485.568 374.08 137.856 43.328 228.416-61.696 249.408-103.68 21.056-41.984 13.12-85.312 13.12-85.312S745.856 670.208 715.648 647.872z"'
                    + '    p-id="1642" fill="#ffffff"></path>'
                    + '  <path'
                    + '    d="M715.328 64C580.992 64 472.192 172.864 472.192 307.2s108.8 243.2 243.136 243.2 243.2-108.864 243.2-243.2S849.6 64 715.328 64zM715.328 461.056c-84.992 0-153.856-68.864-153.856-153.856s68.864-153.856 153.856-153.856 153.856 68.928 153.856 153.856S800.32 461.056 715.328 461.056z"'
                    + '    p-id="1643" fill="#ffffff"></path>'
                    + '  <path'
                    + '    d="M777.472 277.376c-18.176 0-32.96-14.784-32.96-33.024 0-8.448 3.136-16.064 8.32-21.888-11.52-5.12-24.128-8-37.568-8-51.2 0-92.672 41.472-92.672 92.736s41.472 92.736 92.672 92.736S808.064 358.4 808.064 307.2c0-13.696-3.072-26.688-8.384-38.4C793.728 274.112 786.048 277.376 777.472 277.376zM715.328 340.928c-18.624 0-33.664-15.104-33.664-33.728 0-18.624 15.04-33.728 33.664-33.728 18.688 0 33.728 15.104 33.728 33.728C749.056 325.824 734.016 340.928 715.328 340.928z"'
                    + '    p-id="1644" fill="#ffffff"></path>'
                    + ' </svg>'
                    + ' </span>'
                    + ' <span>开启对讲</span>'

                  startTalkDOM.onclick = function () {
                    console.log("EZUIKit.state.countTimer", EZUIKit.state.countTimer)
                    if (EZUIKit.state.countTimer) {
                      window.layer.msg("语音设备正忙，请稍后重试")
                      return false;
                    }
                    countTime('add', 0);
                    console.log("开始对讲，关闭声音")
                    _this.closeSound(0);

                    console.log(_this.opt)
                    _this.startTalk();
                    this.setAttribute("class", "ptp-talk off hide");
                    stopTalkDOM.setAttribute("class", "ptp-talk on");
                  }
                  stopTalkDOM.setAttribute("class", "ptp-talk on hide");
                  stopTalkDOM.innerHTML =
                    '<span title="对讲">'
                    + ' <svg t="1581930496966" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"'
                    + '    p-id="1641" width="16" height="16">'
                    + '    <path'
                    + '      d="M715.648 647.872c-30.208-22.336-61.568 39.36-100.992 77.44-39.36 38.08-34.112 31.488-123.392-17.088S311.488 540.224 280 491.648C248.448 443.072 265.472 424.704 265.472 424.704s78.72-62.976 97.152-81.344c18.368-18.368 13.12-30.208 13.12-30.208l-128.64-190.144c-23.616-5.184-64.32 5.12-128.576 57.6C54.208 233.088 30.592 353.856 151.296 575.68c120.768 221.824 347.84 330.752 485.568 374.08 137.856 43.328 228.416-61.696 249.408-103.68 21.056-41.984 13.12-85.312 13.12-85.312S745.856 670.208 715.648 647.872z"'
                    + '      p-id="1642" fill="#ff0000"></path>'
                    + '    <path'
                    + '      d="M715.328 64C580.992 64 472.192 172.864 472.192 307.2s108.8 243.2 243.136 243.2 243.2-108.864 243.2-243.2S849.6 64 715.328 64zM715.328 461.056c-84.992 0-153.856-68.864-153.856-153.856s68.864-153.856 153.856-153.856 153.856 68.928 153.856 153.856S800.32 461.056 715.328 461.056z"'
                    + '      p-id="1643" fill="#ff0000"></path>'
                    + '    <path'
                    + '      d="M777.472 277.376c-18.176 0-32.96-14.784-32.96-33.024 0-8.448 3.136-16.064 8.32-21.888-11.52-5.12-24.128-8-37.568-8-51.2 0-92.672 41.472-92.672 92.736s41.472 92.736 92.672 92.736S808.064 358.4 808.064 307.2c0-13.696-3.072-26.688-8.384-38.4C793.728 274.112 786.048 277.376 777.472 277.376zM715.328 340.928c-18.624 0-33.664-15.104-33.664-33.728 0-18.624 15.04-33.728 33.664-33.728 18.688 0 33.728 15.104 33.728 33.728C749.056 325.824 734.016 340.928 715.328 340.928z"'
                    + '      p-id="1644" fill="#ff0000"></path>'
                    + '  </svg>'
                    + ' </span>'
                    + '<span>关闭对讲</span>'
                  stopTalkDOM.onclick = function () {
                    console.log(_this.opt)
                    _this.stopTalk();
                    countTime('destory', 0);
                    _this.openSound(0);
                    this.setAttribute("class", "ptp-talk on hide");
                    startTalkDOM.setAttribute("class", "ptp-talk off");
                  }
                  footerContainer.appendChild(startTalkDOM);
                  footerContainer.appendChild(stopTalkDOM);
                }
                if (matchFooterOpt().broadcastModule) {
                  var startBroadcastDOM = document.createElement('div');
                  var stopBroadcastDOM = document.createElement('div');
                  startBroadcastDOM.setAttribute("class", 'broadcast off');
                  stopBroadcastDOM.setAttribute("class", "broadcast on hide");
                  startBroadcastDOM.innerHTML =
                    ' <span title="语音播报">'
                    + '  <svg t="1583561695846" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"'
                    + '    p-id="1126" width="16" height="16">'
                    + '    <path'
                    + '      d="M513.82044445 964.38044445c-8.192 0-15.47377778-2.73066667-21.84533334-8.192 0 0-46.42133333-41.87022222-99.21422222-86.47111112-89.20177778-73.728-117.41866667-88.29155555-123.79022222-90.112H35.04355555c-14.56355555 0-26.39644445-11.83288889-26.39644444-27.30666666V271.70133333c0-14.56355555 11.83288889-27.30666667 26.39644444-27.30666666H246.21511111c7.28177778-2.73066667 37.31911111-15.47377778 137.44355556-91.02222222 58.25422222-43.69066667 111.04711111-86.47111111 111.04711111-86.47111112 5.46133333-4.55111111 12.74311111-7.28177778 20.02488889-7.28177778 4.55111111 0 10.01244445 0.91022222 14.56355555 3.6408889 10.92266667 5.46133333 18.20444445 17.29422222 18.20444445 30.03733333v837.40444444c0 12.74311111-7.28177778 25.48622222-19.11466667 30.94755556-5.46133333 1.82044445-10.01244445 2.73066667-14.56355555 2.73066667zM270.79111111 724.992c19.11466667 0 48.24177778 8.192 167.48088889 106.496 16.384 13.65333333 33.67822222 28.21688889 51.88266667 43.69066667l5.46133333 4.55111111V139.71911111l-5.46133333 3.64088889c-22.75555555 17.29422222-44.60088889 34.58844445-65.536 50.06222222C293.54666667 291.72622222 264.41955555 299.008 245.30488889 299.008H82.37511111c-20.02488889 0-21.84533333 12.74311111-21.84533333 26.39644445V694.04444445c0 23.66577778 6.37155555 30.03733333 28.21688889 30.03733333h180.224l1.82044444 0.91022222z m520.64711111 162.01955555c-14.56355555 0-26.39644445-11.83288889-26.39644444-27.30666666 0-11.83288889 8.192-20.02488889 16.384-24.576 112.86755555-67.35644445 182.04444445-191.14666667 182.04444444-324.03911111 0-132.89244445-70.08711111-256.68266667-182.04444444-324.03911111-10.01244445-5.46133333-15.47377778-14.56355555-15.47377778-24.576 0-14.56355555 11.83288889-27.30666667 26.39644445-27.30666667 5.46133333 0 10.01244445 1.82044445 16.384 5.46133333 128.34133333 76.45866667 207.53066667 218.45333333 207.53066666 369.55022222 0 152.00711111-80.09955555 293.09155555-208.44088889 369.55022223-6.37155555 5.46133333-10.92266667 7.28177778-16.384 7.28177777z m-90.112-152.91733333c-14.56355555 0-26.39644445-11.83288889-26.39644444-27.30666667 0-10.01244445 4.55111111-18.20444445 12.74311111-23.66577777 61.89511111-34.58844445 100.12444445-100.12444445 100.12444444-171.12177778 0-70.08711111-37.31911111-134.71288889-96.48355555-170.21155555-8.192-4.55111111-12.74311111-13.65333333-12.74311111-23.66577778 0-14.56355555 11.83288889-27.30666667 26.39644444-27.30666667 4.55111111 0 11.83288889 2.73066667 15.47377778 4.55111111 74.63822222 44.60088889 121.96977778 127.43111111 121.96977778 215.72266667 0 90.112-48.24177778 173.85244445-125.61066667 218.45333333-1.82044445 0-9.10222222 4.55111111-15.47377778 4.55111111z"'
                    + '      fill="#ffffff" p-id="1127"></path>'
                    + '  </svg>'
                    + '</span>'
                    + '<span>语音播报</span>';


                  startBroadcastDOM.onclick = function () {
                    this.setAttribute("class", "broadcast off hide");
                    stopBroadcastDOM.setAttribute("class", "broadcast on");
                  }


                  stopBroadcastDOM.innerHTML =
                    '<div class="pop-hover">'
                    + '  <div class="pop-hover-content">'
                    + '    <div class="vioce-list" id="voice-list">'
                    + '      <ul class="voice-list-ul">'
                    + '      </ul>'
                    + '      <div id="voice-list-end"></div>'
                    + '    </div>'
                    + '    <div id="voice-custom" style="text-align: center;">自定义语音</div>'
                    + '  </div>'
                    + '</div>'

                    + '<span title="语音播报">'
                    + '  <svg t="1583561695846" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"'
                    + '    p-id="1126" width="16" height="16">'
                    + '    <path'
                    + '      d="M513.82044445 964.38044445c-8.192 0-15.47377778-2.73066667-21.84533334-8.192 0 0-46.42133333-41.87022222-99.21422222-86.47111112-89.20177778-73.728-117.41866667-88.29155555-123.79022222-90.112H35.04355555c-14.56355555 0-26.39644445-11.83288889-26.39644444-27.30666666V271.70133333c0-14.56355555 11.83288889-27.30666667 26.39644444-27.30666666H246.21511111c7.28177778-2.73066667 37.31911111-15.47377778 137.44355556-91.02222222 58.25422222-43.69066667 111.04711111-86.47111111 111.04711111-86.47111112 5.46133333-4.55111111 12.74311111-7.28177778 20.02488889-7.28177778 4.55111111 0 10.01244445 0.91022222 14.56355555 3.6408889 10.92266667 5.46133333 18.20444445 17.29422222 18.20444445 30.03733333v837.40444444c0 12.74311111-7.28177778 25.48622222-19.11466667 30.94755556-5.46133333 1.82044445-10.01244445 2.73066667-14.56355555 2.73066667zM270.79111111 724.992c19.11466667 0 48.24177778 8.192 167.48088889 106.496 16.384 13.65333333 33.67822222 28.21688889 51.88266667 43.69066667l5.46133333 4.55111111V139.71911111l-5.46133333 3.64088889c-22.75555555 17.29422222-44.60088889 34.58844445-65.536 50.06222222C293.54666667 291.72622222 264.41955555 299.008 245.30488889 299.008H82.37511111c-20.02488889 0-21.84533333 12.74311111-21.84533333 26.39644445V694.04444445c0 23.66577778 6.37155555 30.03733333 28.21688889 30.03733333h180.224l1.82044444 0.91022222z m520.64711111 162.01955555c-14.56355555 0-26.39644445-11.83288889-26.39644444-27.30666666 0-11.83288889 8.192-20.02488889 16.384-24.576 112.86755555-67.35644445 182.04444445-191.14666667 182.04444444-324.03911111 0-132.89244445-70.08711111-256.68266667-182.04444444-324.03911111-10.01244445-5.46133333-15.47377778-14.56355555-15.47377778-24.576 0-14.56355555 11.83288889-27.30666667 26.39644445-27.30666667 5.46133333 0 10.01244445 1.82044445 16.384 5.46133333 128.34133333 76.45866667 207.53066667 218.45333333 207.53066666 369.55022222 0 152.00711111-80.09955555 293.09155555-208.44088889 369.55022223-6.37155555 5.46133333-10.92266667 7.28177778-16.384 7.28177777z m-90.112-152.91733333c-14.56355555 0-26.39644445-11.83288889-26.39644444-27.30666667 0-10.01244445 4.55111111-18.20444445 12.74311111-23.66577777 61.89511111-34.58844445 100.12444445-100.12444445 100.12444444-171.12177778 0-70.08711111-37.31911111-134.71288889-96.48355555-170.21155555-8.192-4.55111111-12.74311111-13.65333333-12.74311111-23.66577778 0-14.56355555 11.83288889-27.30666667 26.39644444-27.30666667 4.55111111 0 11.83288889 2.73066667 15.47377778 4.55111111 74.63822222 44.60088889 121.96977778 127.43111111 121.96977778 215.72266667 0 90.112-48.24177778 173.85244445-125.61066667 218.45333333-1.82044445 0-9.10222222 4.55111111-15.47377778 4.55111111z"'
                    + '      fill="#ff0000" p-id="1127"></path>'
                    + '  </svg>'
                    + '</span>'
                    + '<span>语音播报</span>'

                  // //自定义语音唤起
                  // document.getElementById("voice-custom").onclick = function(){
                  //   console.log("显示自定义语音");
                  // }

                  stopBroadcastDOM.onclick = function () {
                    this.setAttribute("class", "broadcast on hide");
                    startBroadcastDOM.setAttribute("class", "broadcast off");
                  }
                  footerContainer.appendChild(startBroadcastDOM);
                  footerContainer.appendChild(stopBroadcastDOM);
                  // 召唤自定义语言
                  document.getElementById("voice-custom").onclick = function () {
                    console.log("显示自定义语音");
                    startSpeakDOM.setAttribute('class', 'speak off');
                  }
                  // 获取语音列表
                  fetchVoiceList(0);

                  function fetchVoiceList(page) {
                    function apiSuccess(data) {
                      console.log("data", data);
                      if (data.code == 200) {
                        randerVoliceList(data.data, 5);
                        EZUIKit.state.page = data.page.page;
                        // 如果用户语音列表为空
                        if (page == 0 && data.data.length == 0 && !EZUIKit.state.fetchDefaultList) {// 获取用户语音为空
                          EZUIKit.state.fetchDefaultList = true;
                          fetchVoiceList(0);
                        }
                      }
                    }
                    function apiError(err) {
                      console.log("err", err)
                    }
                    request(
                      'https://open.ys7.com/api/lapp/voice/query',
                      'POST',
                      {
                        accessToken: EZUIKit.opt.accessToken,
                        pageStart: page,
                        pageSize: EZUIKit.state.pageSize,
                        default: EZUIKit.state.fetchDefaultList ? 'true' : 'false'
                      },
                      '',
                      apiSuccess,
                      apiError
                    );
                  }
                  function randerVoliceList(data) {
                    console.log("renderVoliceList", data)
                    if (data && data.length > 0) {
                      for (var i = 0; i < data.length; i++) {
                        var voiceItem = document.createElement('li');
                        voiceItem.innerHTML = "<li class='voice-item' id='voice-item-" + i + "' data-time=" + (data[i]["duration"] || 20) + " data-url=" + data[i]["fileUrl"] + ">" + (data[i]["voiceName"].length > 10 ? (data[i]["voiceName"].substr(0, 10) + "...") : data[i]["voiceName"]) + "</li>";
                        document.getElementsByClassName('voice-list-ul')[0].append(voiceItem); // "<li class='voice-item' id='voice-item-" + i + "' data-time=" + (data[i]["duration"] || 20) + " data-url=" + data[i]["fileUrl"] + ">" + (data[i]["voiceName"].length > 10 ? (data[i]["voiceName"].substr(0, 10) + "...") : data[i]["voiceName"]) + "</li>";
                        // $("#voice-list ul").append("<li class='voice-item' id='voice-item-" + i + "' data-time=" + (data[i]["duration"] || 20) + " data-url=" + data[i]["fileUrl"] + ">" + (data[i]["voiceName"].length > 10 ? (data[i]["voiceName"].substr(0, 10) + "...") : data[i]["voiceName"]) + "</li>");
                        voiceItem.onclick = function (e) {
                          console.log("点击元素", e.target, e.target.dataset.url);
                          var voiceUrl = e.target.dataset.url;
                          var time = e.target.dataset.time;
                          playListOfVoice(voiceUrl, time);
                        }
                      }
                      if (data.length === EZUIKit.state.pageSize) {
                        document.getElementById('voice-list-end').innerHTML = "向下滚动加载更多";
                      } else {
                        document.getElementById('voice-list-end').innerHTML = "没有更多数据了";
                      }
                    }
                  }
                  function playListOfVoice(voiceUrl, time) {
                    console.log("播放语音", voiceUrl, time);
                    // decoder && decoder.closeSound(0);
                    function apiSuccess(data) {
                      console.log("data.data", data.data)
                      if (data.code == 200) {
                        // $("#startBroadcast").show();
                        // $("#stopBroadcast").hide();

                        countTime('sub', parseInt(time));
                      } else if (data.code == "10001") {
                        window.layer.msg("未找到当前语音")
                      } else {
                        window.layer.msg(data.msg || '发送失败，请稍后再试')
                      }
                      // padding = false;
                    }
                    function apiError(err) {
                      console.log("err", err)
                    }
                    request(
                      'https://open.ys7.com/api/lapp/voice/send',
                      'POST',
                      {
                        accessToken: EZUIKit.opt.accessToken,
                        deviceSerial: EZUIKit.opt.deviceSerial,
                        channelNo: EZUIKit.opt.channelNo,
                        fileUrl: voiceUrl,
                      },
                      '',
                      apiSuccess,
                      apiError
                    );
                  }
                  // 自定义语音
                  // 对讲
                  var startSpeakDOM = document.createElement('div');
                  var stopSpeakDOM = document.createElement('div');
                  startSpeakDOM.setAttribute('class', 'speak off hide');
                  stopSpeakDOM.setAttribute('class', 'speak on hide');
                  startSpeakDOM.setAttribute('id', 'startSpeak');
                  stopSpeakDOM.setAttribute('id', 'stopSpeak');
                  startSpeakDOM.innerHTML =
                    '<span title="按住说话">'
                    + '  <svg t="1581994757678" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"'
                    + '    p-id="1639" width="16" height="16">'
                    + '    <path'
                    + '      d="M757.059829 393.846154v-52.512821h262.564103v52.512821H757.059829z m-420.102564 481.367521v96.273504h175.042735a8.752137 8.752137 0 0 1 8.752137 8.752137v35.008547a8.752137 8.752137 0 0 1-8.752137 8.752137H109.401709a8.752137 8.752137 0 0 1-8.752136-8.752137v-35.008547a8.752137 8.752137 0 0 1 8.752136-8.752137h175.042735v-96.273504C129.767932 875.213675 4.376068 749.821812 4.376068 595.145299V463.863248a26.25641 26.25641 0 1 1 52.512821 0v113.777778c0 140.174222 113.637744 253.811966 253.811966 253.811965s253.811966-113.637744 253.811966-253.811965V463.863248a26.25641 26.25641 0 1 1 52.51282 0v131.282051c0 154.676513-125.391863 280.068376-280.068376 280.068376z m-26.25641-96.273504c-111.178393 0-201.299145-90.120752-201.299146-201.299145V201.299145C109.401709 90.120752 199.522462 0 310.700855 0s201.299145 90.120752 201.299145 201.299145v376.341881c0 111.178393-90.120752 201.299145-201.299145 201.299145z m691.418803-280.068376H757.059829v-52.512821h245.059829v52.512821z m-17.504273 105.025641H757.059829v-52.512821h227.555556v52.512821z m-17.504274 105.025641H757.059829v-52.512821h210.051282v52.512821z m-8.752137 105.025641H757.059829v-52.512821h201.299145v52.512821z m-17.504273 105.025641H757.059829v-52.512821h183.794872v52.512821z m-26.25641 105.025641H757.059829v-52.512821h157.538462v52.512821z"'
                    + '      p-id="1640" fill="#ffffff"></path>'
                    + '  </svg>'
                    + '</span>'
                    + '<span>按住说话</span>';
                  stopSpeakDOM.innerHTML =
                    '<span title="按住说话">'
                    + '<svg t="1581994757678" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"'
                    + '  p-id="1639" width="16" height="16">'
                    + '  <path'
                    + '    d="M757.059829 393.846154v-52.512821h262.564103v52.512821H757.059829z m-420.102564 481.367521v96.273504h175.042735a8.752137 8.752137 0 0 1 8.752137 8.752137v35.008547a8.752137 8.752137 0 0 1-8.752137 8.752137H109.401709a8.752137 8.752137 0 0 1-8.752136-8.752137v-35.008547a8.752137 8.752137 0 0 1 8.752136-8.752137h175.042735v-96.273504C129.767932 875.213675 4.376068 749.821812 4.376068 595.145299V463.863248a26.25641 26.25641 0 1 1 52.512821 0v113.777778c0 140.174222 113.637744 253.811966 253.811966 253.811965s253.811966-113.637744 253.811966-253.811965V463.863248a26.25641 26.25641 0 1 1 52.51282 0v131.282051c0 154.676513-125.391863 280.068376-280.068376 280.068376z m-26.25641-96.273504c-111.178393 0-201.299145-90.120752-201.299146-201.299145V201.299145C109.401709 90.120752 199.522462 0 310.700855 0s201.299145 90.120752 201.299145 201.299145v376.341881c0 111.178393-90.120752 201.299145-201.299145 201.299145z m691.418803-280.068376H757.059829v-52.512821h245.059829v52.512821z m-17.504273 105.025641H757.059829v-52.512821h227.555556v52.512821z m-17.504274 105.025641H757.059829v-52.512821h210.051282v52.512821z m-8.752137 105.025641H757.059829v-52.512821h201.299145v52.512821z m-17.504273 105.025641H757.059829v-52.512821h183.794872v52.512821z m-26.25641 105.025641H757.059829v-52.512821h157.538462v52.512821z"'
                    + '    p-id="1640" fill="#ff0000"></path>'
                    + '</svg>'
                    + '</span>'
                    + '<span>松开发送</span>';
                  footerContainer.appendChild(startSpeakDOM);
                  footerContainer.appendChild(stopSpeakDOM);
                  document.getElementById("voice-list").onscroll = function (e) {
                    var sum = this.scrollHeight;
                    console.log("sum", sum, this.scrollTop, document.getElementById("voice-list").clientHeight);
                    if (sum <= this.scrollTop + this.clientHeight) {
                      console.log("拖动到底，执行加载", EZUIKit.state.page);
                      fetchVoiceList(++EZUIKit.state.page);
                    }

                  }
                  // $("#voice-list").unbind("scroll").bind("scroll", function (e) {
                  //   // console.log("e",e,this.scrollHeight, $(this).scrollTop() + $(this).height())
                  //   var sum = this.scrollHeight;
                  //   if (sum <= $(this).scrollTop() + $(this).height()) {
                  //     console.log("拖动到底，执行加载", page);
                  //     fetchVoiceList(++page);
                  //   }
                  //   loading = false;
                  // });
                  // time-area 
                  var timeAreaDOM = document.createElement('div');
                  timeAreaDOM.setAttribute('class', 'time-area');
                  timeAreaDOM.setAttribute('id', 'time-area');
                  timeAreaDOM.innerHTML = '00:00';
                  footerContainer.appendChild(timeAreaDOM);

                  // 按住说话
                  var recorder;
                  document.getElementById('startSpeak').onmousedown = function () {
                    if (EZUIKit.state.countTimer) {
                      window.layer.msg("语音设备正忙，请稍后重试")
                      return false;
                    }
                    console.log("按住说话");
                    startSpeakDOM.setAttribute('class', 'speak off hide');
                    stopSpeakDOM.setAttribute('class', 'speak on');
                    // console.log("startRecording",startRecording);
                    // startRecording();
                    voiceInit();
                    countTime('add', 0);
                    setTimeout(() => {
                      EZUIKit.state.recodeTime = 0;
                      startRecording();
                    }, 1000)
                    if (EZUIKit.state.recodeTimer) { // 先清空计数器
                      clearInterval(EZUIKit.state.recodeTimer);
                    }
                    EZUIKit.state.recodeTimer = setInterval(function () {
                      if (EZUIKit.state.recodeTime >= 59) {
                        _this.stopTalk();
                        countTime('destory', 0);
                        this.setAttribute("class", "ptp-talk on hide");
                        startTalkDOM.setAttribute("class", "ptp-talk off");
                        window.layer.msg("不超过1分钟")
                      } else {
                        EZUIKit.state.recodeTime = EZUIKit.state.recodeTime + 1;
                      }
                    }, 1000);
                    /** 录音控制 */
                    var audio_context;
                    function startUserMedia(stream) {
                      var input = audio_context.createMediaStreamSource(stream);
                      recorder = new window.Recorder(input);
                    }
                    function startRecording() {
                      recorder && recorder.record();
                    }
                    function stopRecording() {
                      recorder && recorder.stop();
                      recorder.clear();
                    }
                    function voiceInit() {
                      console.log("run init")
                      try {
                        // webkit shim
                        window.AudioContext = window.AudioContext || window.webkitAudioContext;
                        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
                        window.URL = window.URL || window.webkitURL;
                        audio_context = new AudioContext;
                        console.log('Audio context set up.');
                        console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
                      } catch (e) {
                        console.log("err", e)
                        window.layer.msg('No web audio support in this browser!');
                      }
                      navigator.getUserMedia({ audio: true }, startUserMedia, function (e) {
                        console.log('No live audio input: ' + e);
                      });
                    };
                  }
                  // 松开发送
                  document.getElementById('stopSpeak').onmouseup = function () {
                    console.log("松开发送")
                    stopSpeakDOM.setAttribute('class', 'speak on hide');
                    stopSpeakFun()
                    function stopSpeakFun() {
                      countTime('destory', 0);
                      if (EZUIKit.state.recodeTime < 1) {
                        window.layer.msg("说话时间过短");
                        clearInterval(EZUIKit.state.recodeTimer);
                        return false;
                      }
                      clearInterval(EZUIKit.state.recodeTimer);
                      wavUpload();
                    }
                    function wavUpload() {
                      try {
                        recorder && recorder.stop();
                        // createAudioDom();
                        recorder && recorder.exportWAV(function (wav_file) {
                          console.log("wav_file", wav_file);
                          if (wav_file.size < 1000) {
                            window.layer.msg("录音失败，请重试");
                            // recodeTime = 0;
                            EZUIKit.state.recodeTime = 0
                            return false;
                          }
                          // 测试
                          countTime('sub', EZUIKit.state.recodeTime + 2); // 延时
                          var formdata = new FormData(); // form 表单 {key:value}
                          formdata.append("voiceFile", wav_file); // form input type="file"
                          formdata.append("accessToken", EZUIKit.opt.accessToken);
                          formdata.append("deviceSerial", EZUIKit.opt.deviceSerial);
                          formdata.append("channelNo", EZUIKit.opt.channelNo);
                          // padding = true;

                          function apiSuccess(data) {
                            console.log("data.data", data.data)
                            if (data.code == 200) {
                              // $("#startBroadcast").show();
                              // $("#stopBroadcast").hide();
                              countTime('sub', EZUIKit.state.recodeTime + 2);
                            } else if (data.code == "10001") {
                              window.layer.msg("未找到当前语音")
                            } else {
                              window.layer.msg(data.msg || '发送失败，请稍后再试')
                            }
                            // padding = false;
                          }
                          function apiError(err) {
                            console.log("err", err)
                          }
                          request(
                            'https://open.ys7.com/api/lapp/voice/sendonce',
                            'POST',
                            {
                              voiceFile: wav_file,
                              accessToken: EZUIKit.opt.accessToken,
                              deviceSerial: EZUIKit.opt.deviceSerial,
                              channelNo: EZUIKit.opt.channelNo,
                            },
                            '',
                            apiSuccess,
                            apiError
                          );
                        });
                        recorder && recorder.clear();
                      } catch (err) {
                        console.log(err);
                      }
                    }
                  }
                }
                /* 时间计数 */
                function countTime(type, start = 0) {
                  clearInterval(EZUIKit.state.countTimer);
                  if (type === 'add') {
                    var i = start;
                    EZUIKit.state.countTimer = setInterval(function () {
                      ++i;
                      document.getElementById("time-area").innerHTML = formatSeconds(i);
                    }, 1000);

                  } else if (type === 'sub') {
                    var i = start;
                    EZUIKit.state.countTimer = setInterval(function () {
                      if (i > 0) {
                        i--;
                        document.getElementById("time-area").innerHTML = formatSeconds(i);
                      } else {
                        clearInterval(EZUIKit.state.countTimer);
                        EZUIKit.state.countTimer = undefined;
                        console.log("倒计时结束，开启声音");
                        // decoder.openSound(0);
                      }
                    }, 1000);
                  } else if (type === 'destory') {
                    clearInterval(EZUIKit.state.countTimer);
                    EZUIKit.state.countTimer = undefined;
                    document.getElementById("time-area").innerHTML = '00:00';
                  }
                  //将秒数转换为时分秒格式
                  function formatSeconds(value) {
                    var theTime = parseInt(value);// 秒
                    var middle = 0;// 分
                    var hour = 0;// 小时
                    var secondV = '00';
                    var minV = '00';
                    var hourV = '00'

                    if (theTime > 59) {
                      middle = parseInt(theTime / 60);
                      theTime = parseInt(theTime % 60);
                      if (middle > 59) {
                        hour = parseInt(middle / 60);
                        middle = parseInt(middle % 60);
                      }
                    }
                    secondV = parseInt(theTime) > 9 ? parseInt(theTime) : ('0' + parseInt(theTime));
                    minV = parseInt(middle) > 9 ? parseInt(middle) : ('0' + parseInt(middle));
                    hourV = (parseInt(hour) > 9 ? parseInt(hour) : ('0' + parseInt(hour)));
                    if (hour > 0) {
                      return hourV + ':' + minV + ':' + secondV;
                    } else if (middle > 0) {
                      return minV + ':' + secondV;
                    } else {
                      return '00:' + secondV;
                    }
                  }
                }
                /* 将秒数转换为时分秒格式 */
                function formatSeconds(value) {
                  var theTime = parseInt(value);// 秒
                  var middle = 0;// 分
                  var hour = 0;// 小时
                  var secondV = '00';
                  var minV = '00';
                  var hourV = '00'

                  if (theTime > 59) {
                    middle = parseInt(theTime / 60);
                    theTime = parseInt(theTime % 60);
                    if (middle > 59) {
                      hour = parseInt(middle / 60);
                      middle = parseInt(middle % 60);
                    }
                  }
                  secondV = parseInt(theTime) > 9 ? parseInt(theTime) : ('0' + parseInt(theTime));
                  minV = parseInt(middle) > 9 ? parseInt(middle) : ('0' + parseInt(middle));
                  hourV = (parseInt(hour) > 9 ? parseInt(hour) : ('0' + parseInt(hour)));
                  if (hour > 0) {
                    return hourV + ':' + minV + ':' + secondV;
                  } else if (middle > 0) {
                    return minV + ':' + secondV;
                  } else {
                    return '00:' + secondV;
                  }
                }
              });
            });
            // });
          })
        }
      })
    })
    var _this = this;
    function apiSuccess(data) {
      console.log("data", data);
      if (data.code == 200) {
        var apiResult = data.data;
        if (apiResult) {

        }
      }
    }
    function apiError(err) {
      if (params.handleError) {
        params.handleError(err);
      }

    }
    request(
      EZUIKit.opt.apiDomain,
      'POST',
      {
        accessToken: EZUIKit.opt.accessToken,
        deviceSerial: EZUIKit.opt.deviceSerial,
        channelNo: EZUIKit.opt.channelNo
      },
      '',
      apiSuccess,
      apiError
    );

    console.log("EZUIKit.opt", EZUIKit.opt)
    // iframe 传递数据
    window.addEventListener(
      "message",
      function (event) {
        console.log("EZUIKitPlayer收到反馈", event);
        var origin = event.origin;
        if (event.data.type) {
          switch (event.data.type) {
            case 'openSound':
              if (params.openSoundCallBack) {
                params.openSoundCallBack(event.data)
              }
              break;
            case 'closeSound':
              if (params.closeSoundCallBack) {
                params.closeSoundCallBack(event.data)
              }
              break;
            case 'capturePicture':
              if (params.capturePictureCallBack) {
                params.capturePictureCallBack(event.data)
              }
              break;
            case 'startSave':
              if (params.startSaveCallBack) {
                params.startSaveCallBack(event.data)
              }
              break;
            case 'stopSave':
              if (params.stopSaveCallBack) {
                params.stopSaveCallBack(event.data)
              }
              break;
            case 'fullScreen':
              if (params.fullScreenCallBack) {
                params.fullScreenCallBack(event.data)
              }
              break;
            case 'getOSDTime':
              if (params.getOSDTimeCallBack) {
                params.getOSDTimeCallBack(event.data)
              }
              break;
          }
        }
      })
    /**
     * 
     * 对讲模块
     */

    function apiSuccess(data) {
      console.log("data", data);
      if (data.code == 200) {
        var apiResult = data.data;
        if (apiResult) {
          // 临时将https转换为websocket
          var rtcTrunk = apiResult.rtcUrl;
          if (rtcTrunk.indexOf("ws") === -1) {
            rtcTrunk = rtcTrunk.replace("https", "wss").replace("rtcgw", "rtcgw-ws");
          }
          EZUIKit.opt.rtcUrl = rtcTrunk;
          EZUIKit.opt.ttsUrl = "tts://" + apiResult.ttsUrl;
          var talk = "talk://" + EZUIKit.opt.deviceSerial + ":0:" + EZUIKit.opt.channelNo + ":cas.ys7.com:6500";
          EZUIKit.opt.talkLink = EZUIKit.opt.ttsUrl + "/" + talk;
          EZUIKit.opt.stream = apiResult.stream;
          console.log("EZUIKit.opt", EZUIKit.opt)
          // 加载依赖
          if (!EZUIKit.opt.isReliesReady) {
            var adapeterJS = EZUIKit.opt.filePath + '/npm/js/adapeter.js';
            var janusJS = EZUIKit.opt.filePath + '/npm/js/janus.js';
            var ttsJS = EZUIKit.opt.filePath + '/npm/js/tts.js';
            console.log("加载jquery.js");
            addJs(adapeterJS, function () {
              console.log("加载adapeter.js");
              addJs(janusJS, function () {
                console.log("加载janus.js");
                addJs(ttsJS, function () {
                  console.log("加载tts.js");
                  // 文件加载完毕;
                  EZUIKit.opt.isReliesReady = true;
                })
              })
            })
          }
          // 创建DOM
          if (!document.getElementById("audioleft")) {
            var audioleft = document.createElement('div');
            audioleft.style.display = 'none';
            audioleft.id = 'audioleft';
            document.body.appendChild(audioleft)
          }
          if (!document.getElementById("audioright")) {
            var audioright = document.createElement('div');
            audioright.style.display = 'none';
            audioright.id = 'audioright';
            document.body.appendChild(audioright)
          }
        }

      }
    }
    function apiError(err) {
      if (params.handleError) {
        params.handleError(err);
      }

    }
    request(
      EZUIKit.opt.apiDomain,
      'POST',
      {
        accessToken: EZUIKit.opt.accessToken,
        deviceSerial: EZUIKit.opt.deviceSerial,
        channelNo: EZUIKit.opt.channelNo
      },
      '',
      apiSuccess,
      apiError
    );


  }

  // 播放相关API
  EZUIKitPlayer.prototype.stop = function () {
    var id = 'EZUIKitPlayer-' + EZUIKit.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage("stop", domain + "/ezopen/h5/iframe")
  }
  EZUIKitPlayer.prototype.openSound = function () {
    var id = 'EZUIKitPlayer-' + EZUIKit.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage("openSound", domain + "/ezopen/h5/iframe");
  }
  EZUIKitPlayer.prototype.closeSound = function () {
    var id = 'EZUIKitPlayer-' + EZUIKit.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage("closeSound", domain + "/ezopen/h5/iframe")
  }
  EZUIKitPlayer.prototype.startSave = function () {
    var id = 'EZUIKitPlayer-' + EZUIKit.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage("startSave", domain + "/ezopen/h5/iframe")
  }
  EZUIKitPlayer.prototype.stopSave = function () {
    var id = 'EZUIKitPlayer-' + EZUIKit.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage("stopSave", domain + "/ezopen/h5/iframe")
  }
  EZUIKitPlayer.prototype.fullScreen = function () {
    var id = 'EZUIKitPlayer-' + EZUIKit.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage("fullScreen", domain + "/ezopen/h5/iframe")
  }
  EZUIKitPlayer.prototype.capturePicture = function () {
    var id = 'EZUIKitPlayer-' + EZUIKit.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage("capturePicture", domain + "/ezopen/h5/iframe")
  }
  EZUIKitPlayer.prototype.enableZoom = function () {
    var id = 'EZUIKitPlayer-' + EZUIKit.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage("enableZoom", domain + "/ezopen/h5/iframe")
  }
  EZUIKitPlayer.prototype.closeZoom = function () {
    var id = 'EZUIKitPlayer-' + EZUIKit.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage("closeZoom", domain + "/ezopen/h5/iframe")
  }
  EZUIKitPlayer.prototype.getOSDTime = function () {
    var id = 'EZUIKitPlayer-' + EZUIKit.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage("getOSDTime", domain + "/ezopen/h5/iframe")
  }
  EZUIKitPlayer.prototype.startTalk = function () {
    console.log("执行开始对讲")
    window.startTalk();
  }
  EZUIKitPlayer.prototype.stopTalk = function () {
    console.log("执行结束对讲")
    window.stopTalk();
  }
  /**
   * 视频播放器-结束
   */
  EZUIKit.EZUIKitPlayer = EZUIKitPlayer;
  window.EZUIKit = EZUIKit;
  if (!noGlobal) {
    window.EZUIKit = EZUIKit;
  }

  return EZUIKit;

})