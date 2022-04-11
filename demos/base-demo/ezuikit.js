'use strict';

class Core {
  constructor(x, y) {
    this.coreX = x;
    this.coreY = y;
  }
  toString() {
    return `${this.coreX}-${this.coreY}`;
  }
}

// eslint-disable-next-line no-extend-native
Date.prototype.Format = function (fmt) { var o = { "M+": this.getMonth() + 1, "d+": this.getDate(), "h+": this.getHours(), "m+": this.getMinutes(), "s+": this.getSeconds(), "q+": Math.floor((this.getMonth() + 3) / 3), "S": this.getMilliseconds() }; if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)); } for (var k in o) { if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))); } return fmt };

// 加载js
const addJs = (filepath, callback, isReadyFun) => {
  var headerScript = document.getElementsByTagName('head')[0].getElementsByTagName("script");
  var isReady = false;
  if(isReadyFun) {
    isReady = isReadyFun();
  } else {
    for (var i = 0; i < headerScript.length; i++) {
      if (headerScript[i].getAttribute("src") == filepath) {
        isReady = true;
        callback();
      }
    }
  }
  if (!isReady) {
    var oJs = document.createElement("script");
    oJs.setAttribute("src", filepath);
    oJs.onload = callback;
    document.getElementsByTagName("head")[0].appendChild(oJs);
  } else {
    callback();
  }
};
const addCss = (filepath, callback) => {
  var headerLink = document.getElementsByTagName('head')[0].getElementsByTagName("link");
  var isReady = false;

  for (var i = 0; i < headerLink.length; i++) {
    if (headerLink[i].getAttribute("href") == filepath) {
      isReady = true;
    }
  }

  if (!isReady) {
    var oJs = document.createElement('link');
    oJs.rel = 'stylesheet';
    oJs.type = 'text/css';
    oJs.href = filepath;
    oJs.onload = callback;
    document.getElementsByTagName("head")[0].appendChild(oJs);
  }
};

const isPromise = (obj) => {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
};

const getQueryString = (name, url) => {
  var r = new RegExp("(\\?|#|&)" + name + "=(.*?)(#|&|$)"); var m = (url || window.location.href).match(r); return decodeURIComponent(m ? m[2] : '');
};

const insertAfter$1 = (newElement, targetElement) => {
  var parent = targetElement.parentNode; if (parent.lastChild == targetElement) { parent.appendChild(newElement); } else { parent.insertBefore(newElement, targetElement.nextSibling); }
};

const requestFullScreen = (element) => {
  console.log("requestFullScreen", document.getElementById(element));
  var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
  if (requestMethod) {
    requestMethod.call(element);
  } else if (typeof window.ActiveXObject !== "undefined") {
    var wscript = new window.ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
};
const requestMobileFullScreen = (element) => {
  var width = document.documentElement.clientWidth;
  var height = document.documentElement.clientHeight;
  var wrapper = element;
  var style = "";
  style += "width:" + height + "px;";// 注意旋转后的宽高切换
  style += "height:" + width + "px;";
  style += "-webkit-transform: rotate(90.001deg); transform: rotate(90.001deg);";
  // 注意旋转中点的处理
  style += "-webkit-transform-origin: " + width / 2 + "px " + width / 2 + "px;";
  style += "transform-origin: " + width / 2 + "px " + width / 2 + "px;";
  style += 'position: fixed;top: 0;left: 0;z-index:10';
  wrapper.style.cssText = style;
};
const requestFullScreenPromise = (element) => {
  requestFullScreen(element);
  var promise = new Promise(function (resolve, reject) {
    var timeInterval = setInterval(() => {
      let isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
      if (isFullScreen) {
        clearInterval(timeInterval);
        return resolve(true);
      }
    }, 100);
    var timeOut = setTimeout(() => {
      let isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
      if (!isFullScreen) {
        reject(false);
      }
      clearTimeout(timeOut);
    }, 2000);
  });
  return promise;
};
const cancelMobileFullScreen = (element, width, height) => {
  var style = "";
  style += "width:" + width + "px;";
  style += "height:" + height + "px;";
  style += "-webkit-transform: rotate(0); transform: rotate(0);";
  style += "-webkit-transform-origin: 0 0;";
  style += "transform-origin: 0 0;";
  element.style.cssText = style;
};
const cancelFullScreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  }
};
const cancelFullScreenPromise = (element) => {
  cancelFullScreen();
  var promise = new Promise(function (resolve, reject) {
    var timeInterval = setInterval(() => {
      let isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
      if (!isFullScreen) {
        clearInterval(timeInterval);
        return resolve(true);
      }
    }, 50);
    var timeOut = setTimeout(() => {
      let isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
      if (isFullScreen) {
        reject(false);
      }
      clearTimeout(timeOut);
    }, 2000);
  });
  return promise;
};

const matchEzopenUrl = (ezopenUrl) => {
  const deviceSerial = ezopenUrl.split("/")[3];
  const channelNo = ezopenUrl.split("/")[4].split(".")[0];
  const validCode = ezopenUrl.split("/")[2].split("@").length === 2 ? ezopenUrl.split("/")[2].split("@")[0] : "";
  const hd = ezopenUrl.indexOf('.hd') !== -1;
  let type = ezopenUrl.split("/")[4].split(".")[ezopenUrl.split("/")[4].split(".").length - 1].split("?")[0];
  if (type === 'rec' && ezopenUrl.indexOf(".cloud.rec") !== -1) {
    type = 'cloud.rec';
  }
  return {
    deviceSerial,
    channelNo,
    validCode,
    hd,
    type
  };
};
function isJSON(str) {
  if (typeof str === 'string') {
    try {
      var obj = JSON.parse(str); if (typeof obj === 'object' && obj) {
        return true;
      } return false;
    } catch (e) {
      return false;
    }
  } console.log('It is not a string!');
}
const request = (url, method, params, header, success, error) => {
  var _url = url;
  var http_request = new XMLHttpRequest();
  http_request.onreadystatechange = function () {
    if (http_request.readyState == 4) {
      if (http_request.status == 200) {
        if (isJSON(http_request.responseText)) {
          var _data = JSON.parse(http_request.responseText);
          success(_data);
        } else {
          success(http_request.responseText);
        }
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

class HLS {
  constructor(videoId, url) {
    addJs("https://open.ys7.com/sdk/js/2.0/js/hls.min.js", () => {
      console.log("加载hls.min.js成功", window.Hls);
      console.log("isSupportHls", window.Hls.isSupported());
      if (window.Hls.isSupported()) {
        this.initHLS(videoId, url);
      }
    });
  }
  toString() {
    return `hls ${this.coreX}-${this.coreY}`;
  }
  initHLS(videoId, hlsUrl) {
    var video = document.getElementById(videoId);
    var hls = new window.Hls({ defaultAudioCodec: 'mp4a.40.2' }); // 萤石设备默认使用 AAC LC 音频编码
    hls.loadSource(hlsUrl);
    hls.attachMedia(video);
    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
      video.play();
    });
    hls.on(window.Hls.Events.ERROR, function (event, data) {
      if (data.fatal) {
        switch (data.type) {
        case window.Hls.ErrorTypes.NETWORK_ERROR:
          // try to recover network error
          console.log("fatal network error encountered, try to recover");
          hls.startLoad();
          break;
        case window.Hls.ErrorTypes.MEDIA_ERROR:
          console.log("fatal media error encountered, try to recover");
          hls.recoverMediaError();
          break;
        default:
          // cannot recover
          hls.destroy();
          break;
        }
      }
    });
    this.hls = hls;
    this.video = video;
    this.hlsUrl = hlsUrl;
  }
  play() {
    console.log("执行hls播放", this.video);
    this.hls.startLoad();
    // this.video.src = this.hlsUrl;
    this.video.play();
  }
  stop() {
    // 通过暂停停止播放
    // this.video.pause();
    // this.video.src = "";
    this.video.pause();
    // 停止取流
    this.hls.stopLoad();
    // this.hls.destroy();
  }
}

class FLV {
  constructor(videoId, url) {
    addJs("https://open.ys7.com/sdk/js/2.0/js/flv.min.js", () => {
      console.log("加载flv.min.js成功", window.flvjs);
      console.log("isSupportFlv", window.flvjs.isSupported());
      if (window.flvjs.isSupported()) {
        this.initFLV(videoId, url);
      }
    });
  }
  toString() {
    return `Flv ${this.coreX}-${this.coreY}`;
  }
  initFLV(videoId, flvUrl) {
    var video = document.getElementById(videoId);
    var hasControls = video.getAttribute('controls');
    if (!hasControls) {
      video.setAttribute('controls', true);
    }
    var flvPlayer = window.flvjs.createPlayer({
      type: 'flv',
      url: flvUrl,
      isLive: true,
    }, {
      enableStashBuffer: true,
      stashInitialSize: 128,
      enableWorker: true
    });

    flvPlayer.attachMediaElement(video);
    flvPlayer.load();
    flvPlayer.play();
    this.flvUrl = flvUrl;
    this.flv = flvPlayer;
    this.video = video;
  }
  play() {
    console.log("执行flv播放", this.video);
    this.video.play();
  }
  stop() {
    // 通过暂停停止播放
    // this.video.pause();
    // this.video.src = "";
    this.video.pause();
    // 停止取流
    this.flv.unload();
    // this.hls.destroy();

  }
}

/* eslint-disable valid-jsdoc */
/** insertAfter */
function insertAfter(newElement, targetElement) { var parent = targetElement.parentNode; if (parent.lastChild == targetElement) { parent.appendChild(newElement); } else { parent.insertBefore(newElement, targetElement.nextSibling); } }

class Status {
  constructor(jSPlugin,id) {
    this.id = id;
    this.jSPlugin = jSPlugin;
    this.state = {
      play: false,
      loading: false,
    };
  }
  toString() {
    return `${this.coreX}-${this.coreY}`;
  }
  setPlayStatus(options) {
    this.state = Object.assign(this.state, options);
  }
  loadingStart(id) {
    var oS = document.createElement('style');
    document.getElementsByTagName("head")[0].appendChild(oS);
    oS.innerHTML = '@keyframes antRotate {to {transform: rotate(400deg);transform-origin:50% 50%;}} .loading {display: inline-block;z-index: 1000;-webkit-animation: antRotate 1s infinite linear;animation: antRotate 1s infinite linear;}';
    var domId = id;
    var domElement = document.getElementById(domId);
    var windowWidth = domElement.offsetWidth;
    var windowHeight = domElement.offsetHeight;
    var offsetTop = 0;//`calc(50% - ${(domElement.offsetTop / 2)}px)`;//domElement.offsetTop; // `calc(50% - ${domElement.offsetTop / 2}px)`
    var offsetLeft = domElement.offsetLeft;
    // 先执行清空loading
    if (document.getElementById(`${id}-loading-id-0`)) {
      document.getElementById(`${id}-loading-id-0`).parentNode.removeChild(document.getElementById(`${id}-loading-id-0`));
    }
    var loadingContainerDOM = document.createElement('div');
    loadingContainerDOM.setAttribute('id', `${id}-loading-id-0`);
    var style = 'position:absolute;outline:none;pointer-events:none;';
    console.log("this.jSPlugin",this.jSPlugin);
    if(typeof this.jSPlugin.poster === 'string') {
      style += `background: url(${this.jSPlugin.poster}) no-repeat;background-size: cover;`;
    }
    style += 'width: 100%;';
    style += 'height: 100%;';
    style += 'top:' + offsetTop + ';';
    style += 'left:' + offsetLeft + 'px;';

    loadingContainerDOM.setAttribute('style', style);
    loadingContainerDOM.style.height = windowHeight;

    loadingContainerDOM.setAttribute('class', 'loading-container');
    // loadingContainerDOM.innerHTML= loading;
    insertAfter(loadingContainerDOM, domElement);
    var splitBasis = 1;
    var loadingItemContainer = document.createElement('div');
    var loadingStatusDOM = document.createElement('div');
    loadingItemContainer.setAttribute('class', 'loading-item');
    loadingItemContainer.setAttribute('id', `${id}-loading-item-0`);
    //loadingContainer.setAttribute('style','display:inline-flex;flex-direction:column;justify-content:center;align-items: center;width:'+(windowWidth / splitBasis)+'px;height:'+(windowHeight /splitBasis )+'px;outline:none;vertical-align: top;position:absolute');
    var style = 'display:inline-flex;pointer-events:none;flex-direction:column;justify-content:center;align-items: center;width:100%;height:' + (windowHeight) + 'px;outline:none;vertical-align: top;position:absolute;';
    style += ('left:' + calLoadingPostion(windowHeight, windowWidth, splitBasis, 0).left + 'px;');
    style += ('top:' + calLoadingPostion(windowHeight, windowWidth, splitBasis, 0).top + 'px;');
    loadingItemContainer.setAttribute('style', style);
    function calLoadingPostion(windowHeight, windowWidth, splitBasis, i) {
      var top = parseInt(i / splitBasis, 10) * (windowHeight / splitBasis);
      var left = (i % splitBasis) * (windowWidth / splitBasis);
      return {
        top: top,
        left: left
      };
    }
    var loadingDOM = document.createElement('div');
    loadingStatusDOM.innerHTML = "";
    loadingStatusDOM.style.color = "#fff";
    loadingDOM.setAttribute('class', 'loading');
    var loading = '<svg t="1567069979438" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2399" width="32" height="32"><path d="M538.5344 266.4448a133.12 133.12 0 1 1 133.12-133.12 133.4272 133.4272 0 0 1-133.12 133.12zM255.0144 372.1984a121.6768 121.6768 0 1 1 121.6768-121.6768 121.856 121.856 0 0 1-121.6768 121.6768zM134.72 647.424a107.3664 107.3664 0 1 1 107.3664-107.264A107.52 107.52 0 0 1 134.72 647.424z m120.32 272.4608a90.9824 90.9824 0 1 1 90.9824-90.9824A91.1616 91.1616 0 0 1 255.04 919.8848zM538.5344 1024a79.36 79.36 0 1 1 79.36-79.36 79.36 79.36 0 0 1-79.36 79.36z m287.6928-134.144a64.1792 64.1792 0 1 1 64.1792-64.1792 64.3584 64.3584 0 0 1-64.1792 64.1792z m117.76-296.704a52.6336 52.6336 0 1 1 52.6592-52.6336 52.608 52.608 0 0 1-52.6336 52.6336z m-158.72-338.7136a40.96 40.96 0 1 1 12.0064 28.8512 40.5248 40.5248 0 0 1-12.0064-28.8512z" fill="#ffffff" p-id="2400"></path></svg>';
    loadingDOM.innerHTML = loading;
    loadingItemContainer.appendChild(loadingDOM);
    // loadingContainer.appendChild(loading);
    loadingItemContainer.appendChild(loadingStatusDOM);
    loadingContainerDOM.appendChild(loadingItemContainer);
  }
  loadingSetText(opt) {
    this.loadingClearText();
    if (document.getElementById(`${this.id}-loading-item-0`)) {
      var textElement = document.getElementById(`${this.id}-loading-item-0`).childNodes[1];
      if(!textElement) {
        var loadingItemContainer = document.getElementById(`${this.id}-loading-item-0`);
        textElement = document.createElement('div');
        textElement.innerHTML = opt.text;
        loadingItemContainer.appendChild(textElement);
      }
      textElement.innerHTML = opt.text;
      textElement.style.color = opt.color || "#FFFFFF";
    }
  }
  loadingClearText() {
    var elements = document.getElementById(`${this.id}-loading-item-0`).childNodes;
    if(elements.length > 1) {
      elements[1].parentNode.removeChild(elements[1]);
    }
  }
  loadingClear() {
    var elements = document.getElementById(`${this.id}-loading-item-0`).childNodes;
    for (var i = elements.length - 1; i >= 0; i--) {
      elements[i].parentNode.removeChild(elements[i]);
    }
    if(document.getElementById(`${this.id}-loading-id-0`)) {
      document.getElementById(`${this.id}-loading-id-0`).style.background = 'none';
    }
  }
  setPoster(pic) {
    if(document.getElementById(`${this.id}-loading-id-0`)) {
      document.getElementById(`${this.id}-loading-id-0`).style.backgroundImage = `url(${pic})`;
    }
  }
  loadingEnd() {
    var loadingItemContainerDOM = document.getElementById(`${this.id}-loading-item-0`);
    if (loadingItemContainerDOM) {
      loadingItemContainerDOM.parentNode.removeChild(loadingItemContainerDOM);
      var loadingContainerDOM = document.getElementById(`${this.id}-loading-id-0`);
      if (loadingContainerDOM && loadingContainerDOM.children.length === 0) {
        loadingContainerDOM.parentNode.removeChild(loadingContainerDOM);
      }
    }
    document.getElementById(`${this.id}-loading-item-0`).style.background = 'none';
  }
}

var data$5 = [
	{
		moduleCode: "",
		detailCode: "405984",
		description: "",
		solution: "",
		updateTime: 1559564188000
	},
	{
		moduleCode: "",
		detailCode: "10035",
		description: "获取子账户AccessToken异常,子账户不存在或子账户不属于该开发者",
		solution: "",
		updateTime: 1559551958000
	},
	{
		moduleCode: "",
		detailCode: "1052674",
		description: "获取本地录像失败",
		solution: "",
		updateTime: 1558579653000
	},
	{
		moduleCode: "",
		detailCode: "395547",
		description: "",
		solution: "",
		updateTime: 1557367296000
	},
	{
		moduleCode: "",
		detailCode: "12",
		description: "",
		solution: "",
		updateTime: 1557229476000
	},
	{
		moduleCode: "",
		detailCode: "10052",
		description: "余额不足",
		solution: "",
		updateTime: 1557121463000
	},
	{
		moduleCode: "",
		detailCode: "20108",
		description: "当前用户和所添加用户不是好友关系",
		solution: "",
		updateTime: 1556541725000
	},
	{
		moduleCode: "",
		detailCode: "10009",
		description: "",
		solution: "",
		updateTime: 1556422452000
	},
	{
		moduleCode: "",
		detailCode: "320001",
		description: "通道不存在",
		solution: "请检查录像机的关联状态是否正常，没有摄像头的通道无法播放",
		updateTime: 1556419044000
	},
	{
		moduleCode: "",
		detailCode: "120001",
		description: "通道不存在",
		solution: "请检查录像机的关联状态是否正常，没有摄像头的通道无法播放",
		updateTime: 1556419030000
	},
	{
		moduleCode: "",
		detailCode: "320049",
		description: "",
		solution: "",
		updateTime: 1556272984000
	},
	{
		moduleCode: "",
		detailCode: "380227",
		description: "",
		solution: "",
		updateTime: 1556264379000
	},
	{
		moduleCode: "",
		detailCode: "10033",
		description: "policy参数信息异常",
		solution: "",
		updateTime: 1555922124000
	},
	{
		moduleCode: "",
		detailCode: "10065",
		description: "weakAppKey 不属于accessToken对应的用户",
		solution: "",
		updateTime: 1555497522000
	},
	{
		moduleCode: "",
		detailCode: "395416",
		description: "设备达到最大连接数，无法建立连接",
		solution: "请升级设备固件版本",
		updateTime: 1555394722000
	},
	{
		moduleCode: "",
		detailCode: "100001",
		description: "",
		solution: "",
		updateTime: 1555141776000
	},
	{
		moduleCode: "",
		detailCode: "395558",
		description: "",
		solution: "",
		updateTime: 1554987121000
	},
	{
		moduleCode: "",
		detailCode: "70001",
		description: "智能家居买断用户设备受到限制,建议合理选择pagestart和pageSize",
		solution: "",
		updateTime: 1554691023000
	},
	{
		moduleCode: "",
		detailCode: "170001",
		description: "",
		solution: "",
		updateTime: 1554691023000
	},
	{
		moduleCode: "",
		detailCode: "1012",
		description: "重置失败",
		solution: "",
		updateTime: 1554645841000
	},
	{
		moduleCode: "",
		detailCode: "1043",
		description: "重置失败",
		solution: "",
		updateTime: 1554645834000
	},
	{
		moduleCode: "",
		detailCode: "60060",
		description: "直播功能未开通",
		solution: "通道未开通直播功能，请先开通直播",
		updateTime: 1554346018000
	},
	{
		moduleCode: "",
		detailCode: "380203",
		description: "",
		solution: "",
		updateTime: 1554093666000
	},
	{
		moduleCode: "",
		detailCode: "399048",
		description: "免费版并发数达到上限，请升级企业版使用多并发能力",
		solution: "升级成为企业版套餐即可取消并发数限制",
		updateTime: 1553839878000
	},
	{
		moduleCode: "",
		detailCode: "60007",
		description: "预置点个数超过最大值",
		solution: "",
		updateTime: 1553671316000
	},
	{
		moduleCode: "",
		detailCode: "1005",
		description: "",
		solution: "",
		updateTime: 1553513701000
	},
	{
		moduleCode: "",
		detailCode: "20605",
		description: "其他用户正在认证中",
		solution: "",
		updateTime: 1552976317000
	},
	{
		moduleCode: "",
		detailCode: "90004",
		description: "当前型号设备暂时不支持AI任务：CS-C3W-3B1WFR-YGL",
		solution: "",
		updateTime: 1552898525000
	},
	{
		moduleCode: "",
		detailCode: "60046",
		description: "添加的设备的IP和本设备的IP冲突",
		solution: "",
		updateTime: 1552872372000
	},
	{
		moduleCode: "",
		detailCode: "3",
		description: "修改视频清晰度失败!",
		solution: "",
		updateTime: 1552440229000
	},
	{
		moduleCode: "",
		detailCode: "1013",
		description: "",
		solution: "",
		updateTime: 1552035069000
	},
	{
		moduleCode: "",
		detailCode: "370007",
		description: "",
		solution: "",
		updateTime: 1551852327000
	},
	{
		moduleCode: "",
		detailCode: "-1",
		description: "",
		solution: "",
		updateTime: 1551752889000
	},
	{
		moduleCode: "",
		detailCode: "30005",
		description: "弱账户不存在",
		solution: "",
		updateTime: 1551422358000
	},
	{
		moduleCode: "",
		detailCode: "90006",
		description: "用户操作AI任务受限",
		solution: "",
		updateTime: 1551073320000
	},
	{
		moduleCode: "",
		detailCode: "60203",
		description: "未开通相关服务",
		solution: "",
		updateTime: 1550623070000
	},
	{
		moduleCode: "",
		detailCode: "10002",
		description: "accessToken过期或异常",
		solution: "",
		updateTime: 1550300346000
	},
	{
		moduleCode: "",
		detailCode: "380339",
		description: "",
		solution: "",
		updateTime: 1549889458000
	},
	{
		moduleCode: "",
		detailCode: "90002",
		description: "AI任务设备配置数达到上限：3",
		solution: "",
		updateTime: 1549071664000
	},
	{
		moduleCode: "",
		detailCode: "380008",
		description: "",
		solution: "",
		updateTime: 1549005979000
	},
	{
		moduleCode: "",
		detailCode: "320227",
		description: "",
		solution: "",
		updateTime: 1548739731000
	},
	{
		moduleCode: "",
		detailCode: "60059",
		description: "ezopen地址均不可用",
		solution: "",
		updateTime: 1548395350000
	},
	{
		moduleCode: "",
		detailCode: "10005",
		description: "appKey异常",
		solution: "",
		updateTime: 1548317858000
	},
	{
		moduleCode: "",
		detailCode: "60045",
		description: "添加的设备的IP和其他通道的IP冲突",
		solution: "",
		updateTime: 1548155085000
	},
	{
		moduleCode: "",
		detailCode: "60047",
		description: "码流类型不支持",
		solution: "",
		updateTime: 1547962108000
	},
	{
		moduleCode: "",
		detailCode: "60041",
		description: "添加的设备被其他设备关联或响应超时",
		solution: "",
		updateTime: 1547960980000
	},
	{
		moduleCode: "",
		detailCode: "110029",
		description: "个人用户接口调用频率超限",
		solution: "请升级企业版：https://open.ys7.com/price.html",
		updateTime: 1547606859000
	},
	{
		moduleCode: "",
		detailCode: "380355",
		description: "设备直连推流异常结束",
		solution: "",
		updateTime: 1547106294000
	},
	{
		moduleCode: "",
		detailCode: "320081",
		description: "",
		solution: "",
		updateTime: 1547106279000
	},
	{
		moduleCode: "",
		detailCode: "60035",
		description: "购买云存储服务失败",
		solution: "",
		updateTime: 1547026959000
	},
	{
		moduleCode: "",
		detailCode: "90005",
		description: "设备已存在：C75714141",
		solution: "",
		updateTime: 1546940622000
	},
	{
		moduleCode: "",
		detailCode: "1053445",
		description: "该时间段没有录像片段",
		solution: "",
		updateTime: 1546935727000
	},
	{
		moduleCode: "",
		detailCode: "90007",
		description: "设备未加入到AI任务",
		solution: "",
		updateTime: 1546932948000
	},
	{
		moduleCode: "",
		detailCode: "326000",
		description: "",
		solution: "",
		updateTime: 1546823143000
	},
	{
		moduleCode: "",
		detailCode: "1021",
		description: "重置失败",
		solution: "",
		updateTime: 1546781152000
	},
	{
		moduleCode: "",
		detailCode: "2001",
		description: "删除设备失败!",
		solution: "",
		updateTime: 1546422886000
	},
	{
		moduleCode: "",
		detailCode: "380425",
		description: "",
		solution: "",
		updateTime: 1546407694000
	},
	{
		moduleCode: "",
		detailCode: "120097",
		description: "",
		solution: "",
		updateTime: 1546085995000
	},
	{
		moduleCode: "",
		detailCode: "10059",
		description: "requestId已存在",
		solution: "",
		updateTime: 1545824509000
	},
	{
		moduleCode: "",
		detailCode: "1154723",
		description: "",
		solution: "",
		updateTime: 1545795209000
	},
	{
		moduleCode: "",
		detailCode: "60043",
		description: "添加的设备超出最大数量",
		solution: "",
		updateTime: 1545493607000
	},
	{
		moduleCode: "",
		detailCode: "1152677",
		description: "",
		solution: "",
		updateTime: 1545313404000
	},
	{
		moduleCode: "",
		detailCode: "20097",
		description: "设备添加异常,设备验证码为ABCDEF或设备被N1，R1关联",
		solution: "",
		updateTime: 1545310795000
	},
	{
		moduleCode: "",
		detailCode: "10060",
		description: "设备不支持该云存储类型",
		solution: "",
		updateTime: 1545309064000
	},
	{
		moduleCode: "",
		detailCode: "20102",
		description: "无相应邀请信息，无法接受邀请",
		solution: "",
		updateTime: 1545204966000
	},
	{
		moduleCode: "",
		detailCode: "10053",
		description: "云存储开通中",
		solution: "",
		updateTime: 1545100293000
	},
	{
		moduleCode: "",
		detailCode: "20401",
		description: "用户云空间信息不存在",
		solution: "",
		updateTime: 1545017880000
	},
	{
		moduleCode: "",
		detailCode: "20600",
		description: "临时密码数已达上限",
		solution: "",
		updateTime: 1544873457000
	},
	{
		moduleCode: "",
		detailCode: "901",
		description: "",
		solution: "",
		updateTime: 1544693519000
	},
	{
		moduleCode: "",
		detailCode: "60210",
		description: "图片数据错误",
		solution: "",
		updateTime: 1544604457000
	},
	{
		moduleCode: "",
		detailCode: "10013",
		description: "您的应用没有权限调用",
		solution: "",
		updateTime: 1544416237000
	},
	{
		moduleCode: "",
		detailCode: "70007",
		description: "授权码不存在",
		solution: "",
		updateTime: 1544179533000
	},
	{
		moduleCode: "",
		detailCode: "10015",
		description: "授权地址不存在",
		solution: "",
		updateTime: 1544163240000
	},
	{
		moduleCode: "",
		detailCode: "320423",
		description: "",
		solution: "",
		updateTime: 1544100685000
	},
	{
		moduleCode: "",
		detailCode: "370009",
		description: "",
		solution: "",
		updateTime: 1544077151000
	},
	{
		moduleCode: "",
		detailCode: "10031",
		description: "子账户或萤石用户没有权限",
		solution: "",
		updateTime: 1543990462000
	},
	{
		moduleCode: "",
		detailCode: "10055",
		description: "设备不支持试用云存储服务",
		solution: "",
		updateTime: 1543986292000
	},
	{
		moduleCode: "",
		detailCode: "60042",
		description: "添加的设备密码错误",
		solution: "",
		updateTime: 1543710913000
	},
	{
		moduleCode: "",
		detailCode: "60082",
		description: "设备正在响应本次声源定位",
		solution: "",
		updateTime: 1543647426000
	},
	{
		moduleCode: "",
		detailCode: "10056",
		description: "设备不支持云存储服务转出",
		solution: "",
		updateTime: 1543558342000
	},
	{
		moduleCode: "",
		detailCode: "20104",
		description: "好友不存在",
		solution: "",
		updateTime: 1543492403000
	},
	{
		moduleCode: "",
		detailCode: "20111",
		description: "好友不是等待验证状态，无法接受邀请",
		solution: "",
		updateTime: 1543492365000
	},
	{
		moduleCode: "",
		detailCode: "20107",
		description: "不能添加自己为好友",
		solution: "",
		updateTime: 1543480986000
	},
	{
		moduleCode: "",
		detailCode: "1",
		description: "设备返回其他错误",
		solution: "",
		updateTime: 1543459921000
	},
	{
		moduleCode: "",
		detailCode: "60084",
		description: "当前正在关闭隐私遮蔽",
		solution: "",
		updateTime: 1543456515000
	},
	{
		moduleCode: "",
		detailCode: "380255",
		description: "",
		solution: "",
		updateTime: 1543411652000
	},
	{
		moduleCode: "",
		detailCode: "20015",
		description: "设备不支持",
		solution: "",
		updateTime: 1543390936000
	},
	{
		moduleCode: "",
		detailCode: "30003",
		description: "手机验证码错误",
		solution: "",
		updateTime: 1543389137000
	},
	{
		moduleCode: "",
		detailCode: "20615",
		description: "锁用户已存在",
		solution: "",
		updateTime: 1543388325000
	},
	{
		moduleCode: "",
		detailCode: "60061",
		description: "账户流量已超出或未购买，限制开通",
		solution: "",
		updateTime: 1543372581000
	},
	{
		moduleCode: "",
		detailCode: "60020",
		description: "设备不支持该信令",
		solution: "",
		updateTime: 1543321636000
	},
	{
		moduleCode: "",
		detailCode: "320146",
		description: "",
		solution: "",
		updateTime: 1543318472000
	},
	{
		moduleCode: "",
		detailCode: "60018",
		description: "设备升级失败",
		solution: "",
		updateTime: 1543304928000
	},
	{
		moduleCode: "",
		detailCode: "60044",
		description: "添加的设备网络不可达超时",
		solution: "",
		updateTime: 1543304102000
	},
	{
		moduleCode: "",
		detailCode: "20619",
		description: "主用户无法删除",
		solution: "",
		updateTime: 1543290219000
	},
	{
		moduleCode: "",
		detailCode: "20608",
		description: "锁用户不存在",
		solution: "",
		updateTime: 1543281950000
	},
	{
		moduleCode: "",
		detailCode: "20609",
		description: "设备响应超时,门锁通信故障或者电量不足,请重试.",
		solution: "",
		updateTime: 1543281601000
	},
	{
		moduleCode: "",
		detailCode: "1049954",
		description: "升级设备失败",
		solution: "",
		updateTime: 1543279264000
	},
	{
		moduleCode: "",
		detailCode: "60009",
		description: "正在调用预置点",
		solution: "",
		updateTime: 1543238114000
	},
	{
		moduleCode: "",
		detailCode: "1052677",
		description: "获取本地录像失败",
		solution: "",
		updateTime: 1543207604000
	},
	{
		moduleCode: "",
		detailCode: "327000",
		description: "",
		solution: "",
		updateTime: 1543196609000
	},
	{
		moduleCode: "",
		detailCode: "20021",
		description: "设备在线，未被用户添加",
		solution: "",
		updateTime: 1543193436000
	},
	{
		moduleCode: "",
		detailCode: "20202",
		description: "操作留言信息失败",
		solution: "",
		updateTime: 1543191562000
	},
	{
		moduleCode: "",
		detailCode: "1052678",
		description: "获取本地录像失败",
		solution: "",
		updateTime: 1543132218000
	},
	{
		moduleCode: "",
		detailCode: "1054723",
		description: "格式化设备失败",
		solution: "",
		updateTime: 1543129833000
	},
	{
		moduleCode: "",
		detailCode: "20109",
		description: "对应分享不存在",
		solution: "",
		updateTime: 1543129111000
	},
	{
		moduleCode: "",
		detailCode: "60026",
		description: "设备处于隐私遮蔽状态",
		solution: "",
		updateTime: 1543110403000
	},
	{
		moduleCode: "",
		detailCode: "60083",
		description: "当前正在开启隐私遮蔽",
		solution: "",
		updateTime: 1543071148000
	},
	{
		moduleCode: "",
		detailCode: "60001",
		description: "用户无云台控制权限",
		solution: "",
		updateTime: 1543059167000
	},
	{
		moduleCode: "",
		detailCode: "2003",
		description: "设备不在线",
		solution: "",
		updateTime: 1543051046000
	},
	{
		moduleCode: "",
		detailCode: "-24",
		description: "设置设备enable错误",
		solution: "",
		updateTime: 1543042701000
	},
	{
		moduleCode: "",
		detailCode: "10018",
		description: "",
		solution: "",
		updateTime: 1543041564000
	},
	{
		moduleCode: "",
		detailCode: "20103",
		description: "好友已存在",
		solution: "",
		updateTime: 1543038430000
	},
	{
		moduleCode: "",
		detailCode: "70010",
		description: "授权异常请重试",
		solution: "",
		updateTime: 1543035590000
	},
	{
		moduleCode: "",
		detailCode: "60056",
		description: "删除设备失败",
		solution: "",
		updateTime: 1543031275000
	},
	{
		moduleCode: "",
		detailCode: "60040",
		description: "添加的设备不在同一局域网",
		solution: "",
		updateTime: 1543031210000
	},
	{
		moduleCode: "",
		detailCode: "60019",
		description: "加密已开启",
		solution: "",
		updateTime: 1543029931000
	},
	{
		moduleCode: "",
		detailCode: "1054722",
		description: "格式化设备失败",
		solution: "",
		updateTime: 1543028537000
	},
	{
		moduleCode: "",
		detailCode: "20016",
		description: "当前设备正在格式化",
		solution: "",
		updateTime: 1543028537000
	},
	{
		moduleCode: "",
		detailCode: "10024",
		description: "透明通道权限校验不通过",
		solution: "",
		updateTime: 1543025540000
	},
	{
		moduleCode: "",
		detailCode: "6002",
		description: "删除设备失败!",
		solution: "",
		updateTime: 1543025026000
	},
	{
		moduleCode: "",
		detailCode: "1011",
		description: "验证码错误！",
		solution: "",
		updateTime: 1543016865000
	},
	{
		moduleCode: "",
		detailCode: "60032",
		description: "卡密已使用",
		solution: "",
		updateTime: 1543006668000
	},
	{
		moduleCode: "",
		detailCode: "10034",
		description: "子账号已存在",
		solution: "",
		updateTime: 1542989194000
	},
	{
		moduleCode: "",
		detailCode: "20301",
		description: "根据uuid查询联动信息不存在",
		solution: "",
		updateTime: 1542988651000
	},
	{
		moduleCode: "",
		detailCode: "1041",
		description: "获取验证码过于频繁",
		solution: "",
		updateTime: 1542980953000
	},
	{
		moduleCode: "",
		detailCode: "10012",
		description: "该appkey下已绑定重复的phone！",
		solution: "",
		updateTime: 1542980800000
	},
	{
		moduleCode: "",
		detailCode: "1008",
		description: "phone不合法！",
		solution: "",
		updateTime: 1542979812000
	},
	{
		moduleCode: "",
		detailCode: "60023",
		description: "订阅操作失败",
		solution: "",
		updateTime: 1542979006000
	},
	{
		moduleCode: "",
		detailCode: "5",
		description: "设备返回其他错误",
		solution: "",
		updateTime: 1542977828000
	},
	{
		moduleCode: "",
		detailCode: "60006",
		description: "云台当前操作失败",
		solution: "",
		updateTime: 1542977598000
	},
	{
		moduleCode: "",
		detailCode: "131",
		description: "修改视频清晰度失败!",
		solution: "",
		updateTime: 1542977246000
	},
	{
		moduleCode: "",
		detailCode: "10019",
		description: "密码错误",
		solution: "",
		updateTime: 1542976628000
	},
	{
		moduleCode: "",
		detailCode: "10004",
		description: "用户不存在",
		solution: "",
		updateTime: 1542976268000
	},
	{
		moduleCode: "",
		detailCode: "20201",
		description: "操作报警信息失败",
		solution: "",
		updateTime: 1542975906000
	},
	{
		moduleCode: "",
		detailCode: "20024",
		description: "设备不在线，已经被别的用户添加",
		solution: "",
		updateTime: 1542975858000
	},
	{
		moduleCode: "",
		detailCode: "60004",
		description: "设备云台旋转达到左限位",
		solution: "",
		updateTime: 1542975207000
	},
	{
		moduleCode: "",
		detailCode: "1052679",
		description: "修改视频清晰度失败!",
		solution: "",
		updateTime: 1542974886000
	},
	{
		moduleCode: "",
		detailCode: "20031",
		description: "请在萤石客户端关闭终端绑定",
		solution: "",
		updateTime: 1542974756000
	},
	{
		moduleCode: "",
		detailCode: "1053825",
		description: "获取本地录像失败",
		solution: "",
		updateTime: 1542974692000
	},
	{
		moduleCode: "",
		detailCode: "60011",
		description: "预置点不存在",
		solution: "",
		updateTime: 1542974414000
	},
	{
		moduleCode: "",
		detailCode: "1052936",
		description: "修改视频清晰度失败!",
		solution: "",
		updateTime: 1542974390000
	},
	{
		moduleCode: "",
		detailCode: "1016",
		description: "",
		solution: "",
		updateTime: 1542974273000
	},
	{
		moduleCode: "",
		detailCode: "10032",
		description: "子账号不存在",
		solution: "",
		updateTime: 1542973906000
	},
	{
		moduleCode: "",
		detailCode: "20013",
		description: "设备已被别人添加",
		solution: "",
		updateTime: 1542973817000
	},
	{
		moduleCode: "",
		detailCode: "50000",
		description: "服务器错误!",
		solution: "",
		updateTime: 1542973801000
	},
	{
		moduleCode: "",
		detailCode: "60010",
		description: "该预置点已经是当前位置",
		solution: "",
		updateTime: 1542973800000
	},
	{
		moduleCode: "",
		detailCode: "60003",
		description: "设备云台旋转达到下限位",
		solution: "",
		updateTime: 1542973770000
	},
	{
		moduleCode: "",
		detailCode: "4",
		description: "设备返回其他错误",
		solution: "",
		updateTime: 1542973755000
	},
	{
		moduleCode: "",
		detailCode: "60016",
		description: "加密未开启，无需关闭",
		solution: "",
		updateTime: 1542973753000
	},
	{
		moduleCode: "",
		detailCode: "60002",
		description: "设备云台旋转达到上限位",
		solution: "",
		updateTime: 1542973742000
	},
	{
		moduleCode: "",
		detailCode: "20023",
		description: "设备不在线，未被用户添加",
		solution: "",
		updateTime: 1542973685000
	},
	{
		moduleCode: "",
		detailCode: "10008",
		description: "",
		solution: "",
		updateTime: 1542973676000
	},
	{
		moduleCode: "",
		detailCode: "20010",
		description: "设备验证码错误",
		solution: "",
		updateTime: 1542973658000
	},
	{
		moduleCode: "",
		detailCode: "60005",
		description: "设备云台旋转达到右限位",
		solution: "",
		updateTime: 1542973657000
	},
	{
		moduleCode: "",
		detailCode: "20017",
		description: "设备已经被自己添加",
		solution: "",
		updateTime: 1542973648000
	},
	{
		moduleCode: "",
		detailCode: "20020",
		description: "设备在线，已经被自己添加",
		solution: "",
		updateTime: 1542973533000
	},
	{
		moduleCode: "",
		detailCode: "20029",
		description: "设备不在线，已经被自己添加",
		solution: "",
		updateTime: 1542973530000
	},
	{
		moduleCode: "",
		detailCode: "10014",
		description: "APPKEY下对应的第三方userId和phone未绑定！",
		solution: "",
		updateTime: 1542973499000
	},
	{
		moduleCode: "",
		detailCode: "20002",
		description: "设备不存在",
		solution: "",
		updateTime: 1542973499000
	},
	{
		moduleCode: "",
		detailCode: "10030",
		description: "appkey和appsecret不匹配",
		solution: "",
		updateTime: 1542973490000
	},
	{
		moduleCode: "",
		detailCode: "20022",
		description: "设备在线，已经被别的用户添加",
		solution: "",
		updateTime: 1542973486000
	},
	{
		moduleCode: "",
		detailCode: "20008",
		description: "设备响应超时",
		solution: "",
		updateTime: 1542973484000
	},
	{
		moduleCode: "",
		detailCode: "20032",
		description: "该用户下通道不存在",
		solution: "",
		updateTime: 1542973481000
	},
	{
		moduleCode: "",
		detailCode: "20006",
		description: "网络异常",
		solution: "",
		updateTime: 1542973475000
	},
	{
		moduleCode: "",
		detailCode: "20014",
		description: "deviceSerial不合法!",
		solution: "",
		updateTime: 1542973454000
	},
	{
		moduleCode: "",
		detailCode: "20007",
		description: "设备不在线",
		solution: "",
		updateTime: 1542973454000
	},
	{
		moduleCode: "",
		detailCode: "20018",
		description: "该用户不拥有该设备",
		solution: "",
		updateTime: 1542973453000
	},
	{
		moduleCode: "",
		detailCode: "10010",
		description: "",
		solution: "",
		updateTime: 1542973453000
	},
	{
		moduleCode: "",
		detailCode: "10011",
		description: "未绑定！",
		solution: "",
		updateTime: 1542973453000
	},
	{
		moduleCode: "",
		detailCode: "20001",
		description: "通道不存在!",
		solution: "",
		updateTime: 1542973452000
	},
	{
		moduleCode: "",
		detailCode: "10017",
		description: "appKey不存在",
		solution: "",
		updateTime: 1542973451000
	},
	{
		moduleCode: "",
		detailCode: "400259",
		description: "",
		solution: "",
		updateTime: 1542875643000
	},
	{
		moduleCode: "",
		detailCode: "400004",
		description: "",
		solution: "",
		updateTime: 1542873364000
	},
	{
		moduleCode: "",
		detailCode: "3840",
		description: "",
		solution: "",
		updateTime: 1541860000000
	},
	{
		moduleCode: "",
		detailCode: "-1017",
		description: "",
		solution: "",
		updateTime: 1541733663000
	},
	{
		moduleCode: "",
		detailCode: "320025",
		description: "",
		solution: "",
		updateTime: 1541078281000
	},
	{
		moduleCode: "",
		detailCode: "320024",
		description: "",
		solution: "",
		updateTime: 1540801374000
	},
	{
		moduleCode: "",
		detailCode: "321002",
		description: "",
		solution: "",
		updateTime: 1540631734000
	},
	{
		moduleCode: "",
		detailCode: "321000",
		description: "",
		solution: "",
		updateTime: 1540609178000
	},
	{
		moduleCode: "",
		detailCode: "321022",
		description: "",
		solution: "",
		updateTime: 1540548345000
	},
	{
		moduleCode: "",
		detailCode: "321016",
		description: "",
		solution: "",
		updateTime: 1540287187000
	},
	{
		moduleCode: "",
		detailCode: "320023",
		description: "",
		solution: "",
		updateTime: 1539825993000
	},
	{
		moduleCode: "",
		detailCode: "-1016",
		description: "",
		solution: "",
		updateTime: 1539584931000
	},
	{
		moduleCode: "",
		detailCode: "8",
		description: "",
		solution: "",
		updateTime: 1539391812000
	},
	{
		moduleCode: "",
		detailCode: "1075127593",
		description: "",
		solution: "",
		updateTime: 1538959251000
	},
	{
		moduleCode: "",
		detailCode: "380421",
		description: "",
		solution: "",
		updateTime: 1537288465000
	},
	{
		moduleCode: "",
		detailCode: "322000",
		description: "麦克风权限未开启",
		solution: "",
		updateTime: 1536820136000
	},
	{
		moduleCode: "",
		detailCode: "1152678",
		description: "",
		solution: "",
		updateTime: 1536738348000
	},
	{
		moduleCode: "",
		detailCode: "320047",
		description: "",
		solution: "",
		updateTime: 1536664472000
	},
	{
		moduleCode: "",
		detailCode: "327006",
		description: "",
		solution: "",
		updateTime: 1536136120000
	},
	{
		moduleCode: "",
		detailCode: "1074807593",
		description: "",
		solution: "",
		updateTime: 1536135035000
	},
	{
		moduleCode: "",
		detailCode: "320291",
		description: "",
		solution: "",
		updateTime: 1536110836000
	},
	{
		moduleCode: "",
		detailCode: "320045",
		description: "",
		solution: "",
		updateTime: 1535963775000
	},
	{
		moduleCode: "",
		detailCode: "370004",
		description: "",
		solution: "",
		updateTime: 1535883699000
	},
	{
		moduleCode: "",
		detailCode: "1149954",
		description: "",
		solution: "",
		updateTime: 1535700674000
	},
	{
		moduleCode: "",
		detailCode: "320053",
		description: "",
		solution: "",
		updateTime: 1535681079000
	},
	{
		moduleCode: "",
		detailCode: "400000",
		description: "",
		solution: "",
		updateTime: 1535532332000
	},
	{
		moduleCode: "",
		detailCode: "110028",
		description: "个人版抓图接口日调用次数超出限制",
		solution: "请升级企业版：https://open.ys7.com/price.html",
		updateTime: 1535348756000
	},
	{
		moduleCode: "",
		detailCode: "110027",
		description: "个人版帐号数量超出安全限制，无法调用",
		solution: "请升级企业版：https://open.ys7.com/price.html",
		updateTime: 1535348734000
	},
	{
		moduleCode: "",
		detailCode: "110026",
		description: "设备数量超出个人版限制，当前设备无法操作",
		solution: "请升级企业版：https://open.ys7.com/price.html",
		updateTime: 1535348588000
	},
	{
		moduleCode: "",
		detailCode: "100000",
		description: "",
		solution: "",
		updateTime: 1534980008000
	},
	{
		moduleCode: "",
		detailCode: "324004",
		description: "",
		solution: "",
		updateTime: 1534927762000
	},
	{
		moduleCode: "",
		detailCode: "360104",
		description: "",
		solution: "",
		updateTime: 1534761006000
	},
	{
		moduleCode: "",
		detailCode: "320204",
		description: "",
		solution: "",
		updateTime: 1534584221000
	},
	{
		moduleCode: "",
		detailCode: "380001",
		description: "",
		solution: "",
		updateTime: 1534404715000
	},
	{
		moduleCode: "",
		detailCode: "380204",
		description: "",
		solution: "",
		updateTime: 1534401682000
	},
	{
		moduleCode: "",
		detailCode: "328006",
		description: "",
		solution: "",
		updateTime: 1534144407000
	},
	{
		moduleCode: "",
		detailCode: "321703",
		description: "",
		solution: "",
		updateTime: 1534127274000
	},
	{
		moduleCode: "",
		detailCode: "321510",
		description: "",
		solution: "",
		updateTime: 1533428892000
	},
	{
		moduleCode: "",
		detailCode: "321006",
		description: "",
		solution: "",
		updateTime: 1533036916000
	},
	{
		moduleCode: "",
		detailCode: "50009",
		description: "",
		solution: "",
		updateTime: 1532078548000
	},
	{
		moduleCode: "",
		detailCode: "50007",
		description: "",
		solution: "",
		updateTime: 1531991720000
	},
	{
		moduleCode: "",
		detailCode: "50018",
		description: "",
		solution: "",
		updateTime: 1531912829000
	},
	{
		moduleCode: "",
		detailCode: "380451",
		description: "",
		solution: "",
		updateTime: 1531615700000
	},
	{
		moduleCode: "",
		detailCode: "380336",
		description: "",
		solution: "",
		updateTime: 1531231721000
	},
	{
		moduleCode: "",
		detailCode: "360020",
		description: "",
		solution: "",
		updateTime: 1531117554000
	},
	{
		moduleCode: "",
		detailCode: "380418",
		description: "",
		solution: "",
		updateTime: 1531107070000
	},
	{
		moduleCode: "",
		detailCode: "1153445",
		description: "设备在该时间段内没有录像",
		solution: "",
		updateTime: 1530944007000
	},
	{
		moduleCode: "",
		detailCode: "110007",
		description: "调用接口总次数达到上限",
		solution: "请升级企业版，获取更高能力",
		updateTime: 1530935584000
	},
	{
		moduleCode: "",
		detailCode: "360019",
		description: "",
		solution: "",
		updateTime: 1530869771000
	},
	{
		moduleCode: "",
		detailCode: "360100",
		description: "",
		solution: "",
		updateTime: 1530786188000
	},
	{
		moduleCode: "",
		detailCode: "380042",
		description: "",
		solution: "",
		updateTime: 1530775199000
	},
	{
		moduleCode: "",
		detailCode: "320355",
		description: "",
		solution: "",
		updateTime: 1530716074000
	},
	{
		moduleCode: "",
		detailCode: "100003",
		description: "",
		solution: "",
		updateTime: 1530232541000
	},
	{
		moduleCode: "",
		detailCode: "371026",
		description: "",
		solution: "",
		updateTime: 1530192600000
	},
	{
		moduleCode: "",
		detailCode: "102",
		description: "",
		solution: "",
		updateTime: 1529895641000
	},
	{
		moduleCode: "",
		detailCode: "380201",
		description: "",
		solution: "",
		updateTime: 1529740929000
	},
	{
		moduleCode: "",
		detailCode: "320054",
		description: "",
		solution: "",
		updateTime: 1529544875000
	},
	{
		moduleCode: "",
		detailCode: "500101",
		description: "",
		solution: "",
		updateTime: 1529485953000
	},
	{
		moduleCode: "",
		detailCode: "321001",
		description: "",
		solution: "",
		updateTime: 1529411048000
	},
	{
		moduleCode: "",
		detailCode: "321508",
		description: "",
		solution: "",
		updateTime: 1529393279000
	},
	{
		moduleCode: "",
		detailCode: "405991",
		description: "",
		solution: "",
		updateTime: 1529380238000
	},
	{
		moduleCode: "",
		detailCode: "380461",
		description: "",
		solution: "",
		updateTime: 1529130941000
	},
	{
		moduleCode: "",
		detailCode: "-1019",
		description: "",
		solution: "",
		updateTime: 1529057245000
	},
	{
		moduleCode: "",
		detailCode: "322009",
		description: "",
		solution: "",
		updateTime: 1528965717000
	},
	{
		moduleCode: "",
		detailCode: "324005",
		description: "",
		solution: "",
		updateTime: 1528950153000
	},
	{
		moduleCode: "",
		detailCode: "325000",
		description: "",
		solution: "",
		updateTime: 1528947143000
	},
	{
		moduleCode: "",
		detailCode: "326032",
		description: "",
		solution: "",
		updateTime: 1528872971000
	},
	{
		moduleCode: "",
		detailCode: "325032",
		description: "",
		solution: "",
		updateTime: 1528863189000
	},
	{
		moduleCode: "",
		detailCode: "328000",
		description: "",
		solution: "",
		updateTime: 1528794505000
	},
	{
		moduleCode: "",
		detailCode: "53",
		description: "",
		solution: "",
		updateTime: 1528693249000
	},
	{
		moduleCode: "",
		detailCode: "-1020",
		description: "",
		solution: "",
		updateTime: 1528499440000
	},
	{
		moduleCode: "",
		detailCode: "329032",
		description: "",
		solution: "",
		updateTime: 1528446301000
	},
	{
		moduleCode: "",
		detailCode: "-1202",
		description: "",
		solution: "",
		updateTime: 1528439820000
	},
	{
		moduleCode: "",
		detailCode: "2",
		description: "",
		solution: "",
		updateTime: 1528434175000
	},
	{
		moduleCode: "",
		detailCode: "1152936",
		description: "",
		solution: "",
		updateTime: 1528345986000
	},
	{
		moduleCode: "",
		detailCode: "328011",
		description: "",
		solution: "",
		updateTime: 1528338600000
	},
	{
		moduleCode: "",
		detailCode: "28",
		description: "",
		solution: "",
		updateTime: 1528337530000
	},
	{
		moduleCode: "",
		detailCode: "320356",
		description: "",
		solution: "",
		updateTime: 1528188693000
	},
	{
		moduleCode: "",
		detailCode: "320357",
		description: "",
		solution: "",
		updateTime: 1528188517000
	},
	{
		moduleCode: "",
		detailCode: "405800",
		description: "",
		solution: "",
		updateTime: 1528168732000
	},
	{
		moduleCode: "",
		detailCode: "405996",
		description: "",
		solution: "",
		updateTime: 1528168686000
	},
	{
		moduleCode: "",
		detailCode: "380357",
		description: "",
		solution: "",
		updateTime: 1528011565000
	},
	{
		moduleCode: "",
		detailCode: "328022",
		description: "",
		solution: "",
		updateTime: 1527929065000
	},
	{
		moduleCode: "",
		detailCode: "380003",
		description: "",
		solution: "",
		updateTime: 1527927819000
	},
	{
		moduleCode: "",
		detailCode: "50004",
		description: "",
		solution: "",
		updateTime: 1527770643000
	},
	{
		moduleCode: "",
		detailCode: "50011",
		description: "",
		solution: "",
		updateTime: 1527770635000
	},
	{
		moduleCode: "",
		detailCode: "370017",
		description: "",
		solution: "",
		updateTime: 1527739514000
	},
	{
		moduleCode: "",
		detailCode: "327032",
		description: "",
		solution: "",
		updateTime: 1527726704000
	},
	{
		moduleCode: "",
		detailCode: "324001",
		description: "",
		solution: "",
		updateTime: 1527681892000
	},
	{
		moduleCode: "",
		detailCode: "405997",
		description: "",
		solution: "",
		updateTime: 1527653408000
	},
	{
		moduleCode: "",
		detailCode: "405995",
		description: "",
		solution: "",
		updateTime: 1527647283000
	},
	{
		moduleCode: "",
		detailCode: "1153825",
		description: "",
		solution: "",
		updateTime: 1527601747000
	},
	{
		moduleCode: "",
		detailCode: "328002",
		description: "",
		solution: "",
		updateTime: 1527495292000
	},
	{
		moduleCode: "",
		detailCode: "1152679",
		description: "",
		solution: "",
		updateTime: 1527486665000
	},
	{
		moduleCode: "",
		detailCode: "380356",
		description: "",
		solution: "",
		updateTime: 1527125669000
	},
	{
		moduleCode: "",
		detailCode: "328032",
		description: "",
		solution: "",
		updateTime: 1527069382000
	},
	{
		moduleCode: "",
		detailCode: "22",
		description: "",
		solution: "",
		updateTime: 1527049826000
	},
	{
		moduleCode: "",
		detailCode: "9",
		description: "",
		solution: "",
		updateTime: 1527006778000
	},
	{
		moduleCode: "",
		detailCode: "89",
		description: "",
		solution: "",
		updateTime: 1526622784000
	},
	{
		moduleCode: "",
		detailCode: "328016",
		description: "",
		solution: "",
		updateTime: 1526452365000
	},
	{
		moduleCode: "",
		detailCode: "368005",
		description: "",
		solution: "",
		updateTime: 1525921264000
	},
	{
		moduleCode: "",
		detailCode: "0",
		description: "",
		solution: "",
		updateTime: 1525920242000
	},
	{
		moduleCode: "",
		detailCode: "380006",
		description: "",
		solution: "",
		updateTime: 1525918868000
	},
	{
		moduleCode: "",
		detailCode: "310",
		description: "",
		solution: "",
		updateTime: 1525834436000
	},
	{
		moduleCode: "",
		detailCode: "360011",
		description: "",
		solution: "",
		updateTime: 1525681552000
	},
	{
		moduleCode: "",
		detailCode: "170005",
		description: "",
		solution: "",
		updateTime: 1525433900000
	},
	{
		moduleCode: "",
		detailCode: "50023",
		description: "",
		solution: "",
		updateTime: 1525403338000
	},
	{
		moduleCode: "",
		detailCode: "100131",
		description: "",
		solution: "",
		updateTime: 1525229691000
	},
	{
		moduleCode: "",
		detailCode: "-1018",
		description: "",
		solution: "",
		updateTime: 1525142341000
	},
	{
		moduleCode: "",
		detailCode: "362026",
		description: "",
		solution: "",
		updateTime: 1524882677000
	},
	{
		moduleCode: "",
		detailCode: "368007",
		description: "",
		solution: "",
		updateTime: 1524832269000
	},
	{
		moduleCode: "",
		detailCode: "54",
		description: "",
		solution: "",
		updateTime: 1524793646000
	},
	{
		moduleCode: "",
		detailCode: "1154722",
		description: "",
		solution: "",
		updateTime: 1524620807000
	},
	{
		moduleCode: "",
		detailCode: "320229",
		description: "",
		solution: "",
		updateTime: 1524551682000
	},
	{
		moduleCode: "",
		detailCode: "360012",
		description: "",
		solution: "",
		updateTime: 1524472094000
	},
	{
		moduleCode: "",
		detailCode: "380229",
		description: "",
		solution: "",
		updateTime: 1524110755000
	},
	{
		moduleCode: "",
		detailCode: "360016",
		description: "",
		solution: "",
		updateTime: 1523933518000
	},
	{
		moduleCode: "",
		detailCode: "-1003",
		description: "",
		solution: "",
		updateTime: 1523584804000
	},
	{
		moduleCode: "",
		detailCode: "410026",
		description: "",
		solution: "",
		updateTime: 1523517430000
	},
	{
		moduleCode: "",
		detailCode: "360102",
		description: "TTS初始化失败",
		solution: "",
		updateTime: 1523503528000
	},
	{
		moduleCode: "",
		detailCode: "360013",
		description: "设备开启了隐私保护",
		solution: "",
		updateTime: 1523503507000
	},
	{
		moduleCode: "",
		detailCode: "360010",
		description: "设备正在对讲中",
		solution: "",
		updateTime: 1523503491000
	},
	{
		moduleCode: "",
		detailCode: "360007",
		description: "TTS关闭了与客户端的连接",
		solution: "",
		updateTime: 1523503475000
	},
	{
		moduleCode: "",
		detailCode: "360006",
		description: "客户端接收发生错误",
		solution: "",
		updateTime: 1523503457000
	},
	{
		moduleCode: "",
		detailCode: "360005",
		description: "客户端发送的消息错误",
		solution: "",
		updateTime: 1523503437000
	},
	{
		moduleCode: "",
		detailCode: "360004",
		description: "TTS内部发生错误",
		solution: "",
		updateTime: 1523503421000
	},
	{
		moduleCode: "",
		detailCode: "360003",
		description: "TTS的设备端发生错误",
		solution: "",
		updateTime: 1523503397000
	},
	{
		moduleCode: "",
		detailCode: "360002",
		description: "对讲发起超时",
		solution: "",
		updateTime: 1523503376000
	},
	{
		moduleCode: "",
		detailCode: "360001",
		description: "客户端请求超时",
		solution: "",
		updateTime: 1523503357000
	},
	{
		moduleCode: "",
		detailCode: "320077",
		description: "",
		solution: "",
		updateTime: 1523444274000
	},
	{
		moduleCode: "",
		detailCode: "370047",
		description: "",
		solution: "",
		updateTime: 1523440480000
	},
	{
		moduleCode: "",
		detailCode: "100002",
		description: "",
		solution: "",
		updateTime: 1523413964000
	},
	{
		moduleCode: "",
		detailCode: "-1004",
		description: "",
		solution: "",
		updateTime: 1523336653000
	},
	{
		moduleCode: "",
		detailCode: "380000",
		description: "",
		solution: "",
		updateTime: 1523180856000
	},
	{
		moduleCode: "",
		detailCode: "380213",
		description: "",
		solution: "",
		updateTime: 1523180623000
	},
	{
		moduleCode: "",
		detailCode: "380101",
		description: "",
		solution: "",
		updateTime: 1522834231000
	},
	{
		moduleCode: "",
		detailCode: "50047",
		description: "",
		solution: "",
		updateTime: 1522833243000
	},
	{
		moduleCode: "",
		detailCode: "-999",
		description: "",
		solution: "",
		updateTime: 1522831034000
	},
	{
		moduleCode: "",
		detailCode: "320418",
		description: "",
		solution: "",
		updateTime: 1522829072000
	},
	{
		moduleCode: "",
		detailCode: "-1009",
		description: "",
		solution: "",
		updateTime: 1522746247000
	},
	{
		moduleCode: "",
		detailCode: "320209",
		description: "",
		solution: "",
		updateTime: 1522744395000
	},
	{
		moduleCode: "",
		detailCode: "368006",
		description: "",
		solution: "",
		updateTime: 1522744300000
	},
	{
		moduleCode: "",
		detailCode: "369003",
		description: "",
		solution: "",
		updateTime: 1522736355000
	},
	{
		moduleCode: "",
		detailCode: "405989",
		description: "",
		solution: "",
		updateTime: 1522726571000
	},
	{
		moduleCode: "",
		detailCode: "-1012",
		description: "",
		solution: "",
		updateTime: 1522726203000
	},
	{
		moduleCode: "",
		detailCode: "322016",
		description: "",
		solution: "",
		updateTime: 1522722918000
	},
	{
		moduleCode: "",
		detailCode: "500103",
		description: "",
		solution: "",
		updateTime: 1522655556000
	},
	{
		moduleCode: "",
		detailCode: "405999",
		description: "",
		solution: "",
		updateTime: 1522654716000
	},
	{
		moduleCode: "",
		detailCode: "321032",
		description: "",
		solution: "",
		updateTime: 1522647732000
	},
	{
		moduleCode: "",
		detailCode: "381101",
		description: "",
		solution: "",
		updateTime: 1522392414000
	},
	{
		moduleCode: "",
		detailCode: "399999",
		description: "",
		solution: "",
		updateTime: 1522379834000
	},
	{
		moduleCode: "",
		detailCode: "380103",
		description: "",
		solution: "",
		updateTime: 1522312724000
	},
	{
		moduleCode: "",
		detailCode: "360014",
		description: "",
		solution: "",
		updateTime: 1522304341000
	},
	{
		moduleCode: "",
		detailCode: "-1005",
		description: "",
		solution: "",
		updateTime: 1522288195000
	},
	{
		moduleCode: "",
		detailCode: "395454",
		description: "",
		solution: "",
		updateTime: 1522220180000
	},
	{
		moduleCode: "",
		detailCode: "100005",
		description: "",
		solution: "",
		updateTime: 1522218849000
	},
	{
		moduleCode: "",
		detailCode: "100004",
		description: "",
		solution: "",
		updateTime: 1522209053000
	},
	{
		moduleCode: "",
		detailCode: "106002",
		description: "",
		solution: "",
		updateTime: 1522206200000
	},
	{
		moduleCode: "",
		detailCode: "410030",
		description: "",
		solution: "",
		updateTime: 1522162252000
	},
	{
		moduleCode: "",
		detailCode: "-1002",
		description: "",
		solution: "",
		updateTime: 1522150690000
	},
	{
		moduleCode: "",
		detailCode: "-1200",
		description: "",
		solution: "",
		updateTime: 1522139025000
	},
	{
		moduleCode: "",
		detailCode: "-1001",
		description: "",
		solution: "",
		updateTime: 1522046436000
	},
	{
		moduleCode: "",
		detailCode: "-1011",
		description: "",
		solution: "",
		updateTime: 1522045931000
	},
	{
		moduleCode: "",
		detailCode: "381102",
		description: "",
		solution: "",
		updateTime: 1522044953000
	},
	{
		moduleCode: "",
		detailCode: "381103",
		description: "",
		solution: "",
		updateTime: 1522044953000
	},
	{
		moduleCode: "",
		detailCode: "391205",
		description: "vtdu解析服务器ip失败",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "391206",
		description: "vtdu描述符select失败",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "391207",
		description: "vtdu文件描述符不在可读中",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "391208",
		description: "vtdu网络发生错误getsockopt",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "391209",
		description: "vtdu描述符select超时",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395000",
		description: "cas回复信令，发现内存已经释放（和设备之间异常断开）",
		solution: "检查设备网络；刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395400",
		description: "私有化协议vtm检测私有化协议中码流类型小于0或者设备序列号为空等非法参数场景返回(app不重试取流)",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395402",
		description: "回放找不到录像文件",
		solution: "检查是否有存储卡并且接触良好",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395403",
		description: "操作码或信令密钥与设备不匹配",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395404",
		description: "设备不在线",
		solution: "检查设备网络；重启设备接入萤石云",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395405",
		description: "流媒体向设备发送或接受信令超时/cas响应超时",
		solution: "检查设备网络；重启设备",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395406",
		description: "token失效",
		solution: "刷新重试或者重启设备",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395407",
		description: "客户端的URL格式错误",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395409",
		description: "预览开启隐私保护",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395410",
		description: "设备达到最大连接数",
		solution: "请升级设备固件版本",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395411",
		description: "token无权限",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395412",
		description: "session不存在 ",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395413",
		description: "验证token的他异常（不具体） ",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395415",
		description: "设备通道错",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395451",
		description: "设备不支持的码流类型",
		solution: "刷新重试或者切换到高清模式",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395452",
		description: "设备链接流媒体服务器失败 ",
		solution: "检查设备网络，重启设备，刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395500",
		description: "服务器处理失败 ",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395501",
		description: "流媒体vtdu达到最大负载，请扩容",
		solution: "服务器负载达到上限，请稍后重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395503",
		description: "vtm返回分配vtdu失败",
		solution: "服务器负载达到上限，请稍后重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395544",
		description: "设备返回无视频源 ",
		solution: "设备是否接触良好；",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395545",
		description: "视频分享时间已经结束",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395546",
		description: "vtdu返回达到取流并发路数限制",
		solution: "请升级为企业版，放开并发限制",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395560",
		description: "蚁兵代理不支持的用户取流类型，会重定向到vtdu取流",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395557",
		description: "回放服务器等待流头超时",
		solution: "刷新重试，检测设备网络，重启设备",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395600",
		description: "分享设备不在分享时间内",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395601",
		description: "群组分享用户没权限",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395602",
		description: "群组分享权限变更",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395556",
		description: "ticket取流验证失败",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395530",
		description: "机房故障不可用",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "395701",
		description: "cas信令返回格式错误",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396001",
		description: "客户端参数出错",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396099",
		description: "客户端默认错误",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396101",
		description: "不支持的命令",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396102",
		description: "设备流头发送失败",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396103",
		description: "cas/设备返回错误1",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396104",
		description: "cas/设备返回错误-1",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396105",
		description: "设备返回错误码3",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396106",
		description: "设备返回错误码4",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396107",
		description: "设备返回错误码5",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396108",
		description: "cas信令回应重复",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396109",
		description: "视频广场取消分享",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396110",
		description: "设备信令默认错误",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396501",
		description: "设备数据链路和实际链路不匹配",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396502",
		description: "设备数据链路重复建立连接",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396503",
		description: "设备数据链路端口不匹配",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396504",
		description: "缓存设备数据链路失败(内存块不足)",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396505",
		description: "设备发送确认头消息重复",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396506",
		description: "设备数据先于确定头部到达",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396508",
		description: "设备数据头部长度非法",
		solution: "刷新重试，或者重启设备",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396509",
		description: "索引找不到设备数据管理块",
		solution: "刷新重试",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396510",
		description: "设备数据链路vtdu内存块协议状态不匹配",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396511",
		description: "设备数据头部没有streamkey错误",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396512",
		description: "设备数据头部非法(较笼统)",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396513",
		description: "设备数据长度过小",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396514",
		description: "设备老协议推流头部没有streamkey错误",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396515",
		description: "设备老协议推流数据非法",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396516",
		description: "设备老协议索引找不到内存管理块",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396517",
		description: "设备老协议推流数据非法",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396518",
		description: "设备数据包过大",
		solution: "刷新重试，或者重启设备",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396519",
		description: "设备推流链路网络不稳定",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "396520",
		description: "设备推流链路网络不稳定(默认)",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "170003",
		description: "refreshToken不存在",
		solution: "建议用户重新调用logout接口，然后调用openLoginPage接口重新启动登录页面登录",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "170004",
		description: "refreshToken已过期",
		solution: "建议用户重新调用logout接口，然后调用openLoginPage接口重新启动登录页面登录",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "380011",
		description: "设备隐私保护中",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "380045",
		description: "设备直连取流连接数量过大",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "380047",
		description: "设备不支持该命令",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "380077",
		description: "设备正在对讲中",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "380102",
		description: "数据接收异常",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "380205",
		description: "设备检测入参异常",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "380209",
		description: "网络连接超时",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "380212",
		description: "设备端网络连接超时",
		solution: "",
		updateTime: 1522034841000
	},
	{
		moduleCode: "",
		detailCode: "101007",
		description: "手机号未注册",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120503",
		description: "正在响铃",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390016",
		description: "vtdu成功响应未携带流头",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "101008",
		description: "手机号码不合法",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120504",
		description: "室内机正在通话",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390017",
		description: "无数据流，尚未使用",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "101009",
		description: "用户名与手机不匹配",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120505",
		description: "设备操作失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390018",
		description: "信令消息体PB解析失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "101010",
		description: "获取验证码失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120506",
		description: "非法命令",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390019",
		description: "信令消息体PB封装失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "101011",
		description: "验证码错误",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120507",
		description: "智能锁密码错误",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390020",
		description: "申请系统内存资源失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "101012",
		description: "验证码失效",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120508",
		description: "开关锁失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390021",
		description: "vtdu地址尚未获取到",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "101013",
		description: "用户不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120509",
		description: "开关锁超时",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390022",
		description: "客户端尚未支持",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "101014",
		description: "密码不正确或者appKey不正确",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120510",
		description: "智能锁设备繁忙",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390023",
		description: "获取系统socket资源失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "101015",
		description: "用户被锁住",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120511",
		description: "远程开锁功能未打开",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390024",
		description: "上层填充的StreamSsnId不匹配",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "101021",
		description: "验证参数异常",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120600",
		description: "临时密码数已达上限",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390025",
		description: "链接服务器失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "101026",
		description: "邮箱已经被注册",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120601",
		description: "添加临时密码失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390026",
		description: "客户端请求未收到服务端应答",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "101031",
		description: "邮箱未注册",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120602",
		description: "删除临时密码失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390027",
		description: "链路断开",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "101032",
		description: "邮箱不合法",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120603",
		description: "该临时密码不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390028",
		description: "没有取流链接",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "101041",
		description: "获取验证码过于频繁",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120604",
		description: "指纹锁射频通信失败,请稍后再试",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390029",
		description: "流成功停止",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "101043",
		description: "手机验证码输入错误超过规定次数",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120605",
		description: "其他用户正在认证中",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390030",
		description: "客户端防串流校验失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "102000",
		description: "设备不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120606",
		description: "验证已启动,请在120s内进行本地验证和调用添加设备接口",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390031",
		description: "应用层tcp粘包处理缓冲区满",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "102001",
		description: "摄像机不存在",
		solution: "摄像机未注册到萤石云平台，请仔细检查摄像机的网络配置，确保连接到网络",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120607",
		description: "删除用户失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390032",
		description: "无效状态迁移",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "102003",
		description: "设备不在线",
		solution: "参考服务中心排查方法",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120608",
		description: "用户不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390033",
		description: "无效客户端状态",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "102004",
		description: "设备异常",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120609",
		description: "设备响应超时,门锁通信故障或者电量不足,请重试.",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390034",
		description: "向vtm取流流媒体信息请求超时",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "102007",
		description: "设备序列号不正确",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120610",
		description: "获取临时密码列表失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390035",
		description: "向代理取流请求超时",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "102009",
		description: "设备请求响应超时异常",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "130001",
		description: "用户不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390036",
		description: "向代理保活取流请求超时",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "105000",
		description: "设备已被自己添加",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "130002",
		description: "手机号码已经注册",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390037",
		description: "向vtdu取流请求超时",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "105001",
		description: "设备已被别人添加",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "130003",
		description: "手机验证码错误",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390038",
		description: "向vtdu保活取流请求超时",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "105002",
		description: "设备验证码错误",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "130004",
		description: "终端绑定操作失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "391001",
		description: "vtm地址或端口非法",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "107001",
		description: "邀请不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "149999",
		description: "数据异常",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "391002",
		description: "vtm生成文件描述符失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "107002",
		description: "邀请验证失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "150000",
		description: "服务器异常",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "391003",
		description: "vtm设置文件描述符非阻塞失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "107003",
		description: "邀请用户不匹配",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160000",
		description: "设备不支持云台控制",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "391004",
		description: "vtm设置文件描述符阻塞失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "107004",
		description: "云存储连接失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160001",
		description: "用户无云台控制权限",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "391005",
		description: "vtm解析服务器ip失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "7005",
		description: "VTDU主动断开连接",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "107005",
		description: "VTDU主动断开连接",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160002",
		description: "设备云台旋转达到上限位",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "391006",
		description: "vtm描述符select失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "107006",
		description: "不能邀请自己",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160003",
		description: "设备云台旋转达到下限位",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "391007",
		description: "vtm文件描述符不在可读中",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "107007",
		description: "重复邀请",
		solution: "分享和删除分享必须全部由接口形式操作，如果与萤石客户端混用会造成这个问题，解决办法：在萤石客户端清空所有相关分享数据并重新添加设备，再通过接口操作即可",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160004",
		description: "设备云台旋转达到左限位",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "391008",
		description: "vtm网络发生错误getsockopt",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110001",
		description: "参数错误",
		solution: "参数为空或者格式不对",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160005",
		description: "设备云台旋转达到右限位",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "391009",
		description: "vtm描述符select超时",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110002",
		description: "accessToken异常或过期",
		solution: "accessToken有效期为七天，建议在accessToken即将过期或者出现10002错误码的时候重新获取accessToken",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160006",
		description: "云台当前操作失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "391101",
		description: "proxy地址或端口非法",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110004",
		description: "用户不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160007",
		description: "预置点个数超过最大值",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "391102",
		description: "proxy生成文件描述符失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110005",
		description: "appKey异常",
		solution: "确认appKey状态，不通过或者冻结状态会返回该错误码",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160009",
		description: "正在调用预置点",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "391103",
		description: "proxy设置文件描述符非阻塞失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110006",
		description: "ip受限",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160010",
		description: "该预置点已经是当前位置",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "391104",
		description: "proxy设置文件描述符阻塞失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160011",
		description: "预置点不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "391105",
		description: "proxy解析服务器ip失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110008",
		description: "签名错误",
		solution: "①获取签名方式详见apidemo及[旧]API文档 ②注意编码格式为UTF-8",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160013",
		description: "设备版本已是最新",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "391106",
		description: "proxy描述符select失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110009",
		description: "签名参数错误",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160014",
		description: "设备正在升级",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "391107",
		description: "proxy文件描述符不在可读中",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110010",
		description: "签名超时",
		solution: "请调用同步服务器时间接口进行校时",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160015",
		description: "设备正在重启",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "391108",
		description: "proxy网络发生错误getsockopt",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110011",
		description: "未开通萤石云服务",
		solution: "参照绑定流程",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160016",
		description: "加密未开启，无须关闭",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "391109",
		description: "proxy描述符select超时",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110012",
		description: "第三方账户与萤石账号已经绑定",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160017",
		description: "设备抓图失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "391201",
		description: "vtdu地址或端口非法",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110013",
		description: "应用没有权限调用此接口",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160018",
		description: "设备升级失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "391202",
		description: "vtdu生成文件描述符失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110014",
		description: "APPKEY下对应的第三方userId和phone未绑定",
		solution: "获取AccessToken时所用appKey与SDK所用appKey不一致",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160019",
		description: "加密已开启",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "391203",
		description: "vtdu设置文件描述符非阻塞失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110017",
		description: "appKey不存在",
		solution: "请填写在官网申请的应用秘钥",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160020",
		description: "不支持该命令",
		solution: "请确认设备是否支持该命令",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "391204",
		description: "vtdu设置文件描述符阻塞失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110018",
		description: "AccessToken与Appkey不匹配",
		solution: "请检查获取accessToken对应的appKey和SDK中设置的appKey是否一致",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160023",
		description: "订阅操作失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110019",
		description: "密码错误",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160024",
		description: "取消订阅操作失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110020",
		description: "请求方法为空",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160025",
		description: "客流统计配置失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110021",
		description: "ticket校验失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160026",
		description: "设备处于隐私遮蔽状态",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110022",
		description: "透传目的地非法",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160027",
		description: "设备正在镜像操作",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110024",
		description: "无透传权限",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160028",
		description: "设备正在键控动作",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110025",
		description: "appKey被禁止使用通明通道",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160029",
		description: "设备处于语音对讲状态",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160030",
		description: "卡密输入错误次数过多，24小时后再输入",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160031",
		description: "卡密信息不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160032",
		description: "卡密状态不对或已过期",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160033",
		description: "卡密非卖品，只能开通对应的绑定设备",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110030",
		description: "appKey和appSecret不匹配",
		solution: "请检查appKey和appSecret是否对应",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160035",
		description: "购买云存储服务失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110031",
		description: "子账户或萤石用户没有权限",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160040",
		description: "添加的设备不在同一局域网",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110032",
		description: "子账户不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160041",
		description: "添加的设备被其他设备关联或响应超时",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110033",
		description: "子账户未设置授权策略",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160042",
		description: "添加的设备密码错误",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110034",
		description: "子账户已存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160043",
		description: "添加的设备超出最大数量",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110035",
		description: "获取子账户AccessToken异常",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160044",
		description: "添加的设备网络不可达超时",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110036",
		description: "子账户被禁用",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160045",
		description: "添加的设备的IP和其他通道的IP冲突",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "110051",
		description: "无权限进行抓图",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160046",
		description: "添加的设备的IP和本设备的IP冲突",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160047",
		description: "码流类型不支持",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120002",
		description: "设备不存在",
		solution: "①设备没有注册到萤石云平台，请检查下设备网络参数，确保能正常连接网络②设备序列号不存在",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160048",
		description: "带宽超出系统接入带宽",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120003",
		description: "参数异常，SDK版本过低",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160049",
		description: "IP或者端口不合法",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120004",
		description: "参数异常，SDK版本过低",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160050",
		description: "添加的设备版本不支持需要升级才能接入",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120005",
		description: "安全认证失败，需进行SDK安全认证",
		solution: "已去掉安全验证",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160051",
		description: "添加的设备不支持接入",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120006",
		description: "网络异常",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160052",
		description: "添加的设备通道号出错",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120007",
		description: "设备不在线",
		solution: "参考服务中心排查方法",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160053",
		description: "添加的设备分辨率不支持",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120008",
		description: "设备响应超时",
		solution: "设备响应超时，请检测设备网络或重试",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160054",
		description: "添加的设备账号被锁定",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120009",
		description: "子账号不能添加设备",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160055",
		description: "添加的设备取码流出错",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120010",
		description: "设备验证码错误",
		solution: "验证码在设备标签上，六位大写字母，注意大小写",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160056",
		description: "删除设备失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120012",
		description: "设备添加失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160057",
		description: "删除的设备未关联",
		solution: "检查IPC与NVR是否有关联关系",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120013",
		description: "设备已被别人添加",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160060",
		description: "地址未绑定",
		solution: "请前往官网设置直播",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120014",
		description: "设备序列号不正确",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160061",
		description: "账户流量已超出或未购买，限制开通",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120015",
		description: "设备不支持该功能",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160062",
		description: "该通道直播已开通",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120016",
		description: "当前设备正在格式化",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160063",
		description: "直播未使用或直播已关闭",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120017",
		description: "设备已被自己添加",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160070",
		description: "设备不能转移给自己",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120018",
		description: "该用户不拥有该设备",
		solution: "确认设备是否属于用户",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160071",
		description: "设备不能转移，设备与其他设备存在关联关系",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "400001",
		description: "参数为空",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120019",
		description: "设备不支持云存储服务",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160072",
		description: "设备不能转移，通道被分享给其他用户或者分享到视频广场",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "400002",
		description: "参数错误",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120020",
		description: "设备在线，被自己添加",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160073",
		description: "云存储转移失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "400025",
		description: "设备不支持对讲",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120021",
		description: "设备在线，但是未被用户添加",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160080",
		description: "当前正在声源定位",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "400029",
		description: "没有初始化或资源被释放",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120022",
		description: "设备在线，但是已经被别的用户添加",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160081",
		description: "当前正在轨迹巡航",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "400030",
		description: "json解析异常",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120023",
		description: "设备不在线，未被用户添加",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160082",
		description: "设备正在响应本次声源定位",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "400031",
		description: "网络异常",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120024",
		description: "设备不在线，但是已经被别的用户添加",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160083",
		description: "当前正在开启隐私遮蔽",
		solution: "设备正在操作隐私遮蔽，无法进行当前操作",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "400032",
		description: "设备信息异常为空",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120025",
		description: "重复申请分享",
		solution: "确认设备是否由添加过该设备且申请过分享的账户下是否还存在分享记录",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "160084",
		description: "当前正在关闭隐私遮蔽",
		solution: "设备正在操作隐私遮蔽，无法进行当前操作",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "400034",
		description: "取流超时",
		solution: "一般是由于网络状况不好导致，可以尝试下让用户重新播放",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120026",
		description: "视频广场不存在该视频",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "380290",
		description: "　连接CAS服务器失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "400035",
		description: "设备已加密，需要输入验证码",
		solution: "收到此错误码，需要让用户输入验证码后，调用EZPlayer.setPlayKey传入验证码，并重新调用播放函数",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120027",
		description: "视频转码失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361001",
		description: "对讲服务端排队超时",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "400036",
		description: "播放验证码错误",
		solution: "收到此错误码，需要让用户输入验证码后，调用EZPlayer.setPlayKey传入验证码，并重新调用播放函数",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120028",
		description: "设备固件升级包不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361002",
		description: "对讲服务端处理超时",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "400037",
		description: "surfacehold错误",
		solution: "请检查是否是播放之前销毁了surface，收到此错误也可以重新建立surface后播放",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120029",
		description: "设备不在线，但是已经被自己添加",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361003",
		description: "设备链接对讲服务器超时",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "400100",
		description: "未知错误",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120030",
		description: "该用户不拥有该视频广场视频",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361004",
		description: "服务器内部错误",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "400200",
		description: "player sdk出错，这种错误一般开发者也是无法解决，不具体分类传出，传一个统一的inner错误码出去",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120031",
		description: "开启终端绑定，硬件特征码验证失败",
		solution: "请在萤石客户端关闭终端绑定，参考此步骤",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361005",
		description: "解析消息失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "400300",
		description: "内存溢出",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120032",
		description: "该用户下通道不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361006",
		description: "请求重定向--需要向其他服务申请对讲",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "400901",
		description: "设备不在线，可以提示用户",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120033",
		description: "无法收藏自己分享的视频",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361007",
		description: "请求url非法",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "400902",
		description: "accesstoken异常或失效，需要重新获取accesstoken，并传入到sdk",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120034",
		description: "该用户下无设备",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361008",
		description: "token失效",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "400903",
		description: "当前账号开启了终端绑定，只允许指定设备登录操作，提示用户登录i.ys7.com解除终端绑定",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120090",
		description: "用户反馈失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361009",
		description: "设备验证码或者通信秘钥不匹配",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "400904",
		description: "设备正在对讲中",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120095",
		description: "APP包下载失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361010",
		description: "设备已经在对讲",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "400905",
		description: "设备开启了隐私保护，不允许预览、对讲等",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120096",
		description: "APP包信息删除失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361011",
		description: "设备10s响应超时",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120101",
		description: "视频不支持分享给本人",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361012",
		description: "设备不在线",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "320002",
		description: "参数无效",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120102",
		description: "无相应邀请信息",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361013",
		description: "设备开启隐私保护拒绝对讲",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "320003",
		description: "暂不支持此操作",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120103",
		description: "好友已存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361014",
		description: "token无权限",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "320004",
		description: "内存溢出",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120104",
		description: "好友不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361015",
		description: "设备返回session不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "320005",
		description: "创建CAS session失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120105",
		description: "好友状态错误",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361016",
		description: "验证token其他异常错误",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "320006",
		description: "创建cloud session失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120106",
		description: "对应群组不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361017",
		description: "服务端监听设备建立端口超时",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "320007",
		description: "token失效",
		solution: "重新设置token后再重试",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120107",
		description: "不能添加自己为好友",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361018",
		description: "设备链路异常",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "320008",
		description: "token池里面没有token,请传入token",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120108",
		description: "当前用户和所添加用户不是好友关系",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361019",
		description: "对讲服务端不支持的信令消息",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "320009",
		description: "传入新的INIT_PARAM并reset(保留，目前未用)",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120109",
		description: "对应分享不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361020",
		description: "对讲服务端解析对讲请求未携带会话描述能力集",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "320010",
		description: "请重试",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120110",
		description: "好友群组不属于当前用户",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361021",
		description: "对讲服务端优先能力集结果为空",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "320011",
		description: "500毫秒后请重试",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120111",
		description: "好友不是等待验证状态",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361022",
		description: "cas链路异常",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "320012",
		description: "token池已满",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120112",
		description: "添加应用下的用户为好友失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361023",
		description: "对讲服务端分配对讲会话资源失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "320013",
		description: "P2P client超过限制",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120201",
		description: "操作报警信息失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "361024",
		description: "对讲服务端解析信令消息失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "320014",
		description: "sdk未初始化",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120202",
		description: "操作留言信息失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390001",
		description: "通用错误返回",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "320015",
		description: "超时",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120301",
		description: "根据UUID查询报警消息不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390002",
		description: "入参为空指针",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "320016",
		description: "正在打洞中",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120302",
		description: "根据UUID查询图片不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390003",
		description: "入参值无效",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "320017",
		description: "没有视频文件头(播放器层面产生和处理此错误)",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120303",
		description: "根据FID查询图片不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390004",
		description: "信令消息解析非法",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "320018",
		description: "解码错误/超时(播放器层面产生和处理此错误)",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120305",
		description: "设备ip解析错误",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390005",
		description: "内存资源不足",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "320019",
		description: "取消(保留，用户不用处理)",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120401",
		description: "用户云空间信息不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390006",
		description: "协议格式不对或者消息体长度超过STREAM_MAX_MSGBODY_LEN",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "320020",
		description: "播放过程中预连接被用户清除预操作信息",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120402",
		description: "云空间操作失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390007",
		description: "设备序列号长度不合法",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "320021",
		description: "流加密码不对",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120403",
		description: "用户目录不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390008",
		description: "取流url长度不合法",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "320022",
		description: "未传入播放窗口",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120404",
		description: "要操作的目标目录不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390009",
		description: "解析vtm返回vtdu地址不合法",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "100200",
		description: "操作成功",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120405",
		description: "要删除的文件信息不存在",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390010",
		description: "解析vtm返回级联vtdu地址不合法",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "101001",
		description: "用户名不合法",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120406",
		description: "已开通云存储",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390011",
		description: "解析vtm返回会话标识长度不合法",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "101002",
		description: "用户名已被占用",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120407",
		description: "开通记录失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390012",
		description: "vtdu返回流头长度不合法",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "101003",
		description: "密码不合法",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120500",
		description: "获取数据错误",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390013",
		description: "vtdu会话长度非法",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "101004",
		description: "密码为同一字符",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120501",
		description: "开锁失败",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390014",
		description: "回调函数未注册",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "101006",
		description: "手机号码已经被注册",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "120502",
		description: "室内机未收到呼叫",
		solution: "",
		updateTime: 1522034840000
	},
	{
		moduleCode: "",
		detailCode: "390015",
		description: "vtdu成功响应未携带会话标识",
		solution: "",
		updateTime: 1522034840000
	}
];
var code = "200";
var msg$5 = "操作成功!";
var errorCode = {
	data: data$5,
	code: code,
	msg: msg$5
};

class Code {
  constructor(x, y) {
    this.coreX = x;
    this.coreY = y;
    console.log("ErrorCode", errorCode);
  }
  toString() {
    return `${this.coreX}-${this.coreY}`;
  }
  matchErrorInfo(code) {
    return errorCode.data.find(function (item) {
      return item.detailCode.substr(-4) == code;
    });
  }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var lodash = createCommonjsModule(function (module, exports) {
(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined$1;

  /** Used as the semantic version number. */
  var VERSION = '4.17.21';

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Error message constants. */
  var CORE_ERROR_TEXT = 'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.',
      FUNC_ERROR_TEXT = 'Expected a function',
      INVALID_TEMPL_VAR_ERROR_TEXT = 'Invalid `variable` option passed into `_.template`';

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used as the maximum memoize cache size. */
  var MAX_MEMOIZE_SIZE = 500;

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** Used to compose bitmasks for cloning. */
  var CLONE_DEEP_FLAG = 1,
      CLONE_FLAT_FLAG = 2,
      CLONE_SYMBOLS_FLAG = 4;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;

  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_FLAG = 1,
      WRAP_BIND_KEY_FLAG = 2,
      WRAP_CURRY_BOUND_FLAG = 4,
      WRAP_CURRY_FLAG = 8,
      WRAP_CURRY_RIGHT_FLAG = 16,
      WRAP_PARTIAL_FLAG = 32,
      WRAP_PARTIAL_RIGHT_FLAG = 64,
      WRAP_ARY_FLAG = 128,
      WRAP_REARG_FLAG = 256,
      WRAP_FLIP_FLAG = 512;

  /** Used as default options for `_.truncate`. */
  var DEFAULT_TRUNC_LENGTH = 30,
      DEFAULT_TRUNC_OMISSION = '...';

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 800,
      HOT_SPAN = 16;

  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG = 2,
      LAZY_WHILE_FLAG = 3;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0,
      MAX_SAFE_INTEGER = 9007199254740991,
      MAX_INTEGER = 1.7976931348623157e+308,
      NAN = 0 / 0;

  /** Used as references for the maximum length and index of an array. */
  var MAX_ARRAY_LENGTH = 4294967295,
      MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
      HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

  /** Used to associate wrap methods with their bit flags. */
  var wrapFlags = [
    ['ary', WRAP_ARY_FLAG],
    ['bind', WRAP_BIND_FLAG],
    ['bindKey', WRAP_BIND_KEY_FLAG],
    ['curry', WRAP_CURRY_FLAG],
    ['curryRight', WRAP_CURRY_RIGHT_FLAG],
    ['flip', WRAP_FLIP_FLAG],
    ['partial', WRAP_PARTIAL_FLAG],
    ['partialRight', WRAP_PARTIAL_RIGHT_FLAG],
    ['rearg', WRAP_REARG_FLAG]
  ];

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      asyncTag = '[object AsyncFunction]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      domExcTag = '[object DOMException]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      nullTag = '[object Null]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      proxyTag = '[object Proxy]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]',
      undefinedTag = '[object Undefined]',
      weakMapTag = '[object WeakMap]',
      weakSetTag = '[object WeakSet]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match empty string literals in compiled template source. */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
      reUnescapedHtml = /[&<>"']/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to match template delimiters. */
  var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
      reHasRegExpChar = RegExp(reRegExpChar.source);

  /** Used to match leading whitespace. */
  var reTrimStart = /^\s+/;

  /** Used to match a single whitespace character. */
  var reWhitespace = /\s/;

  /** Used to match wrap detail comments. */
  var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
      reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
      reSplitDetails = /,? & /;

  /** Used to match words composed of alphanumeric characters. */
  var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

  /**
   * Used to validate the `validate` option in `_.template` variable.
   *
   * Forbids characters which could potentially change the meaning of the function argument definition:
   * - "()," (modification of function parameters)
   * - "=" (default value)
   * - "[]{}" (destructuring of function parameters)
   * - "/" (beginning of a comment)
   * - whitespace
   */
  var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Used to match
   * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
   */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /** Used to match Latin Unicode letters (excluding mathematical operators). */
  var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

  /** Used to ensure capturing order of template delimiters. */
  var reNoMatch = /($^)/;

  /** Used to match unescaped characters in compiled string literals. */
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

  /** Used to compose unicode character classes. */
  var rsAstralRange = '\\ud800-\\udfff',
      rsComboMarksRange = '\\u0300-\\u036f',
      reComboHalfMarksRange = '\\ufe20-\\ufe2f',
      rsComboSymbolsRange = '\\u20d0-\\u20ff',
      rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
      rsDingbatRange = '\\u2700-\\u27bf',
      rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
      rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
      rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
      rsPunctuationRange = '\\u2000-\\u206f',
      rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
      rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
      rsVarRange = '\\ufe0e\\ufe0f',
      rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

  /** Used to compose unicode capture groups. */
  var rsApos = "['\u2019]",
      rsAstral = '[' + rsAstralRange + ']',
      rsBreak = '[' + rsBreakRange + ']',
      rsCombo = '[' + rsComboRange + ']',
      rsDigits = '\\d+',
      rsDingbat = '[' + rsDingbatRange + ']',
      rsLower = '[' + rsLowerRange + ']',
      rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
      rsFitz = '\\ud83c[\\udffb-\\udfff]',
      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
      rsNonAstral = '[^' + rsAstralRange + ']',
      rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
      rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
      rsUpper = '[' + rsUpperRange + ']',
      rsZWJ = '\\u200d';

  /** Used to compose unicode regexes. */
  var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
      rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
      rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
      rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
      reOptMod = rsModifier + '?',
      rsOptVar = '[' + rsVarRange + ']?',
      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
      rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
      rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
      rsSeq = rsOptVar + reOptMod + rsOptJoin,
      rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

  /** Used to match apostrophes. */
  var reApos = RegExp(rsApos, 'g');

  /**
   * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
   * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
   */
  var reComboMark = RegExp(rsCombo, 'g');

  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
  var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

  /** Used to match complex or compound words. */
  var reUnicodeWord = RegExp([
    rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
    rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
    rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
    rsUpper + '+' + rsOptContrUpper,
    rsOrdUpper,
    rsOrdLower,
    rsDigits,
    rsEmoji
  ].join('|'), 'g');

  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
  var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

  /** Used to detect strings that need a more robust regexp to match words. */
  var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

  /** Used to assign default `context` object properties. */
  var contextProps = [
    'Array', 'Buffer', 'DataView', 'Date', 'Error', 'Float32Array', 'Float64Array',
    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Object',
    'Promise', 'RegExp', 'Set', 'String', 'Symbol', 'TypeError', 'Uint8Array',
    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap',
    '_', 'clearTimeout', 'isFinite', 'parseInt', 'setTimeout'
  ];

  /** Used to make template sourceURLs easier to identify. */
  var templateCounter = -1;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  typedArrayTags[errorTag] = typedArrayTags[funcTag] =
  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
  typedArrayTags[setTag] = typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
  cloneableTags[boolTag] = cloneableTags[dateTag] =
  cloneableTags[float32Tag] = cloneableTags[float64Tag] =
  cloneableTags[int8Tag] = cloneableTags[int16Tag] =
  cloneableTags[int32Tag] = cloneableTags[mapTag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[setTag] =
  cloneableTags[stringTag] = cloneableTags[symbolTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to map Latin Unicode letters to basic Latin letters. */
  var deburredLetters = {
    // Latin-1 Supplement block.
    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'C',  '\xe7': 'c',
    '\xd0': 'D',  '\xf0': 'd',
    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
    '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'N',  '\xf1': 'n',
    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
    '\xc6': 'Ae', '\xe6': 'ae',
    '\xde': 'Th', '\xfe': 'th',
    '\xdf': 'ss',
    // Latin Extended-A block.
    '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
    '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
    '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
    '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
    '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
    '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
    '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
    '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
    '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
    '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
    '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
    '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
    '\u0134': 'J',  '\u0135': 'j',
    '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
    '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
    '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
    '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
    '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
    '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
    '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
    '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
    '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
    '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
    '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
    '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
    '\u0163': 't',  '\u0165': 't', '\u0167': 't',
    '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
    '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
    '\u0174': 'W',  '\u0175': 'w',
    '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
    '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
    '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
    '\u0132': 'IJ', '\u0133': 'ij',
    '\u0152': 'Oe', '\u0153': 'oe',
    '\u0149': "'n", '\u017f': 's'
  };

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  };

  /** Used to escape characters for inclusion in compiled string literals. */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Built-in method references without a dependency on `root`. */
  var freeParseFloat = parseFloat,
      freeParseInt = parseInt;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Detect free variable `exports`. */
  var freeExports = exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports && freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule && freeModule.require && freeModule.require('util').types;

      if (types) {
        return types;
      }

      // Legacy `process.binding('util')` for Node.js < 10.
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }());

  /* Node.js helper references. */
  var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer,
      nodeIsDate = nodeUtil && nodeUtil.isDate,
      nodeIsMap = nodeUtil && nodeUtil.isMap,
      nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,
      nodeIsSet = nodeUtil && nodeUtil.isSet,
      nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

  /*--------------------------------------------------------------------------*/

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  /**
   * A specialized version of `baseAggregator` for arrays.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} setter The function to set `accumulator` values.
   * @param {Function} iteratee The iteratee to transform keys.
   * @param {Object} accumulator The initial aggregated object.
   * @returns {Function} Returns `accumulator`.
   */
  function arrayAggregator(array, setter, iteratee, accumulator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      var value = array[index];
      setter(accumulator, value, iteratee(value), array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.forEachRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEachRight(array, iteratee) {
    var length = array == null ? 0 : array.length;

    while (length--) {
      if (iteratee(array[length], length, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.every` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if all elements pass the predicate check,
   *  else `false`.
   */
  function arrayEvery(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (!predicate(array[index], index, array)) {
        return false;
      }
    }
    return true;
  }

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  /**
   * A specialized version of `_.includes` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludes(array, value) {
    var length = array == null ? 0 : array.length;
    return !!length && baseIndexOf(array, value, 0) > -1;
  }

  /**
   * This function is like `arrayIncludes` except that it accepts a comparator.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludesWith(array, value, comparator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }
    return false;
  }

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /**
   * A specialized version of `_.reduce` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the first element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1,
        length = array == null ? 0 : array.length;

    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.reduceRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the last element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduceRight(array, iteratee, accumulator, initAccum) {
    var length = array == null ? 0 : array.length;
    if (initAccum && length) {
      accumulator = array[--length];
    }
    while (length--) {
      accumulator = iteratee(accumulator, array[length], length, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Gets the size of an ASCII `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */
  var asciiSize = baseProperty('length');

  /**
   * Converts an ASCII `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function asciiToArray(string) {
    return string.split('');
  }

  /**
   * Splits an ASCII `string` into an array of its words.
   *
   * @private
   * @param {string} The string to inspect.
   * @returns {Array} Returns the words of `string`.
   */
  function asciiWords(string) {
    return string.match(reAsciiWord) || [];
  }

  /**
   * The base implementation of methods like `_.findKey` and `_.findLastKey`,
   * without support for iteratee shorthands, which iterates over `collection`
   * using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the found element or its key, else `undefined`.
   */
  function baseFindKey(collection, predicate, eachFunc) {
    var result;
    eachFunc(collection, function(value, key, collection) {
      if (predicate(value, key, collection)) {
        result = key;
        return false;
      }
    });
    return result;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    return value === value
      ? strictIndexOf(array, value, fromIndex)
      : baseFindIndex(array, baseIsNaN, fromIndex);
  }

  /**
   * This function is like `baseIndexOf` except that it accepts a comparator.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOfWith(array, value, fromIndex, comparator) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (comparator(array[index], value)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.isNaN` without support for number objects.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   */
  function baseIsNaN(value) {
    return value !== value;
  }

  /**
   * The base implementation of `_.mean` and `_.meanBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the mean.
   */
  function baseMean(array, iteratee) {
    var length = array == null ? 0 : array.length;
    return length ? (baseSum(array, iteratee) / length) : NAN;
  }

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined$1 : object[key];
    };
  }

  /**
   * The base implementation of `_.propertyOf` without support for deep paths.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyOf(object) {
    return function(key) {
      return object == null ? undefined$1 : object[key];
    };
  }

  /**
   * The base implementation of `_.reduce` and `_.reduceRight`, without support
   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} accumulator The initial value.
   * @param {boolean} initAccum Specify using the first or last element of
   *  `collection` as the initial value.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the accumulated value.
   */
  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
    eachFunc(collection, function(value, index, collection) {
      accumulator = initAccum
        ? (initAccum = false, value)
        : iteratee(accumulator, value, index, collection);
    });
    return accumulator;
  }

  /**
   * The base implementation of `_.sortBy` which uses `comparer` to define the
   * sort order of `array` and replaces criteria objects with their corresponding
   * values.
   *
   * @private
   * @param {Array} array The array to sort.
   * @param {Function} comparer The function to define sort order.
   * @returns {Array} Returns `array`.
   */
  function baseSortBy(array, comparer) {
    var length = array.length;

    array.sort(comparer);
    while (length--) {
      array[length] = array[length].value;
    }
    return array;
  }

  /**
   * The base implementation of `_.sum` and `_.sumBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the sum.
   */
  function baseSum(array, iteratee) {
    var result,
        index = -1,
        length = array.length;

    while (++index < length) {
      var current = iteratee(array[index]);
      if (current !== undefined$1) {
        result = result === undefined$1 ? current : (result + current);
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /**
   * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
   * of key-value pairs for `object` corresponding to the property names of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the key-value pairs.
   */
  function baseToPairs(object, props) {
    return arrayMap(props, function(key) {
      return [key, object[key]];
    });
  }

  /**
   * The base implementation of `_.trim`.
   *
   * @private
   * @param {string} string The string to trim.
   * @returns {string} Returns the trimmed string.
   */
  function baseTrim(string) {
    return string
      ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
      : string;
  }

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  /**
   * The base implementation of `_.values` and `_.valuesIn` which creates an
   * array of `object` property values corresponding to the property names
   * of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the array of property values.
   */
  function baseValues(object, props) {
    return arrayMap(props, function(key) {
      return object[key];
    });
  }

  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function cacheHas(cache, key) {
    return cache.has(key);
  }

  /**
   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the first unmatched string symbol.
   */
  function charsStartIndex(strSymbols, chrSymbols) {
    var index = -1,
        length = strSymbols.length;

    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the last unmatched string symbol.
   */
  function charsEndIndex(strSymbols, chrSymbols) {
    var index = strSymbols.length;

    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Gets the number of `placeholder` occurrences in `array`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} placeholder The placeholder to search for.
   * @returns {number} Returns the placeholder count.
   */
  function countHolders(array, placeholder) {
    var length = array.length,
        result = 0;

    while (length--) {
      if (array[length] === placeholder) {
        ++result;
      }
    }
    return result;
  }

  /**
   * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
   * letters to basic Latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */
  var deburrLetter = basePropertyOf(deburredLetters);

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  var escapeHtmlChar = basePropertyOf(htmlEscapes);

  /**
   * Used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(chr) {
    return '\\' + stringEscapes[chr];
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined$1 : object[key];
  }

  /**
   * Checks if `string` contains Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a symbol is found, else `false`.
   */
  function hasUnicode(string) {
    return reHasUnicode.test(string);
  }

  /**
   * Checks if `string` contains a word composed of Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a word is found, else `false`.
   */
  function hasUnicodeWord(string) {
    return reHasUnicodeWord.test(string);
  }

  /**
   * Converts `iterator` to an array.
   *
   * @private
   * @param {Object} iterator The iterator to convert.
   * @returns {Array} Returns the converted array.
   */
  function iteratorToArray(iterator) {
    var data,
        result = [];

    while (!(data = iterator.next()).done) {
      result.push(data.value);
    }
    return result;
  }

  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */
  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);

    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value === placeholder || value === PLACEHOLDER) {
        array[index] = PLACEHOLDER;
        result[resIndex++] = index;
      }
    }
    return result;
  }

  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */
  function setToArray(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  /**
   * Converts `set` to its value-value pairs.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the value-value pairs.
   */
  function setToPairs(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = [value, value];
    });
    return result;
  }

  /**
   * A specialized version of `_.indexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictIndexOf(array, value, fromIndex) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * A specialized version of `_.lastIndexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictLastIndexOf(array, value, fromIndex) {
    var index = fromIndex + 1;
    while (index--) {
      if (array[index] === value) {
        return index;
      }
    }
    return index;
  }

  /**
   * Gets the number of symbols in `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the string size.
   */
  function stringSize(string) {
    return hasUnicode(string)
      ? unicodeSize(string)
      : asciiSize(string);
  }

  /**
   * Converts `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function stringToArray(string) {
    return hasUnicode(string)
      ? unicodeToArray(string)
      : asciiToArray(string);
  }

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */
  function trimmedEndIndex(string) {
    var index = string.length;

    while (index-- && reWhitespace.test(string.charAt(index))) {}
    return index;
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  var unescapeHtmlChar = basePropertyOf(htmlUnescapes);

  /**
   * Gets the size of a Unicode `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */
  function unicodeSize(string) {
    var result = reUnicode.lastIndex = 0;
    while (reUnicode.test(string)) {
      ++result;
    }
    return result;
  }

  /**
   * Converts a Unicode `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function unicodeToArray(string) {
    return string.match(reUnicode) || [];
  }

  /**
   * Splits a Unicode `string` into an array of its words.
   *
   * @private
   * @param {string} The string to inspect.
   * @returns {Array} Returns the words of `string`.
   */
  function unicodeWords(string) {
    return string.match(reUnicodeWord) || [];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new pristine `lodash` function using the `context` object.
   *
   * @static
   * @memberOf _
   * @since 1.1.0
   * @category Util
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isFunction(_.foo);
   * // => true
   * _.isFunction(_.bar);
   * // => false
   *
   * lodash.isFunction(lodash.foo);
   * // => false
   * lodash.isFunction(lodash.bar);
   * // => true
   *
   * // Create a suped-up `defer` in Node.js.
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */
  var runInContext = (function runInContext(context) {
    context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));

    /** Built-in constructor references. */
    var Array = context.Array,
        Date = context.Date,
        Error = context.Error,
        Function = context.Function,
        Math = context.Math,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /** Used for built-in method references. */
    var arrayProto = Array.prototype,
        funcProto = Function.prototype,
        objectProto = Object.prototype;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = context['__core-js_shared__'];

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to generate unique IDs. */
    var idCounter = 0;

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /** Used to infer the `Object` constructor. */
    var objectCtorString = funcToString.call(Object);

    /** Used to restore the original `_` reference in `_.noConflict`. */
    var oldDash = root._;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Built-in value references. */
    var Buffer = moduleExports ? context.Buffer : undefined$1,
        Symbol = context.Symbol,
        Uint8Array = context.Uint8Array,
        allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined$1,
        getPrototype = overArg(Object.getPrototypeOf, Object),
        objectCreate = Object.create,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        splice = arrayProto.splice,
        spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined$1,
        symIterator = Symbol ? Symbol.iterator : undefined$1,
        symToStringTag = Symbol ? Symbol.toStringTag : undefined$1;

    var defineProperty = (function() {
      try {
        var func = getNative(Object, 'defineProperty');
        func({}, '', {});
        return func;
      } catch (e) {}
    }());

    /** Mocked built-ins. */
    var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout,
        ctxNow = Date && Date.now !== root.Date.now && Date.now,
        ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil,
        nativeFloor = Math.floor,
        nativeGetSymbols = Object.getOwnPropertySymbols,
        nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined$1,
        nativeIsFinite = context.isFinite,
        nativeJoin = arrayProto.join,
        nativeKeys = overArg(Object.keys, Object),
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeNow = Date.now,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random,
        nativeReverse = arrayProto.reverse;

    /* Built-in method references that are verified to be native. */
    var DataView = getNative(context, 'DataView'),
        Map = getNative(context, 'Map'),
        Promise = getNative(context, 'Promise'),
        Set = getNative(context, 'Set'),
        WeakMap = getNative(context, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');

    /** Used to store function metadata. */
    var metaMap = WeakMap && new WeakMap;

    /** Used to lookup unminified function names. */
    var realNames = {};

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map),
        promiseCtorString = toSource(Promise),
        setCtorString = toSource(Set),
        weakMapCtorString = toSource(WeakMap);

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol ? Symbol.prototype : undefined$1,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined$1,
        symbolToString = symbolProto ? symbolProto.toString : undefined$1;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps `value` to enable implicit method
     * chain sequences. Methods that operate on and return arrays, collections,
     * and functions can be chained together. Methods that retrieve a single value
     * or may return a primitive value will automatically end the chain sequence
     * and return the unwrapped value. Otherwise, the value must be unwrapped
     * with `_#value`.
     *
     * Explicit chain sequences, which must be unwrapped with `_#value`, may be
     * enabled using `_.chain`.
     *
     * The execution of chained methods is lazy, that is, it's deferred until
     * `_#value` is implicitly or explicitly called.
     *
     * Lazy evaluation allows several methods to support shortcut fusion.
     * Shortcut fusion is an optimization to merge iteratee calls; this avoids
     * the creation of intermediate arrays and can greatly reduce the number of
     * iteratee executions. Sections of a chain sequence qualify for shortcut
     * fusion if the section is applied to an array and iteratees accept only
     * one argument. The heuristic for whether a section qualifies for shortcut
     * fusion is subject to change.
     *
     * Chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * In addition to lodash methods, wrappers have `Array` and `String` methods.
     *
     * The wrapper `Array` methods are:
     * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
     *
     * The wrapper `String` methods are:
     * `replace` and `split`
     *
     * The wrapper methods that support shortcut fusion are:
     * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
     * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
     * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
     *
     * The chainable wrapper methods are:
     * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
     * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
     * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
     * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
     * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
     * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
     * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
     * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
     * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
     * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
     * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
     * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
     * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
     * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
     * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
     * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
     * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
     * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
     * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
     * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
     * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
     * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
     * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
     * `zipObject`, `zipObjectDeep`, and `zipWith`
     *
     * The wrapper methods that are **not** chainable by default are:
     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
     * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
     * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
     * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
     * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
     * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
     * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
     * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
     * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
     * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
     * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
     * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
     * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
     * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
     * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
     * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
     * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
     * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
     * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
     * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
     * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
     * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
     * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
     * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
     * `upperFirst`, `value`, and `words`
     *
     * @name _
     * @constructor
     * @category Seq
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // Returns an unwrapped value.
     * wrapped.reduce(_.add);
     * // => 6
     *
     * // Returns a wrapped value.
     * var squares = wrapped.map(square);
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
        if (value instanceof LodashWrapper) {
          return value;
        }
        if (hasOwnProperty.call(value, '__wrapped__')) {
          return wrapperClone(value);
        }
      }
      return new LodashWrapper(value);
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} proto The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    var baseCreate = (function() {
      function object() {}
      return function(proto) {
        if (!isObject(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object;
        object.prototype = undefined$1;
        return result;
      };
    }());

    /**
     * The function whose prototype chain sequence wrappers inherit from.
     *
     * @private
     */
    function baseLodash() {
      // No operation performed.
    }

    /**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable explicit method chain sequences.
     */
    function LodashWrapper(value, chainAll) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__chain__ = !!chainAll;
      this.__index__ = 0;
      this.__values__ = undefined$1;
    }

    /**
     * By default, the template delimiters used by lodash are like those in
     * embedded Ruby (ERB) as well as ES2015 template strings. Change the
     * following template settings to use alternative delimiters.
     *
     * @static
     * @memberOf _
     * @type {Object}
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'escape': reEscape,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'evaluate': reEvaluate,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type {string}
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type {Object}
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type {Function}
         */
        '_': lodash
      }
    };

    // Ensure wrappers are instances of `baseLodash`.
    lodash.prototype = baseLodash.prototype;
    lodash.prototype.constructor = lodash;

    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
    LodashWrapper.prototype.constructor = LodashWrapper;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @constructor
     * @param {*} value The value to wrap.
     */
    function LazyWrapper(value) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__dir__ = 1;
      this.__filtered__ = false;
      this.__iteratees__ = [];
      this.__takeCount__ = MAX_ARRAY_LENGTH;
      this.__views__ = [];
    }

    /**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */
    function lazyClone() {
      var result = new LazyWrapper(this.__wrapped__);
      result.__actions__ = copyArray(this.__actions__);
      result.__dir__ = this.__dir__;
      result.__filtered__ = this.__filtered__;
      result.__iteratees__ = copyArray(this.__iteratees__);
      result.__takeCount__ = this.__takeCount__;
      result.__views__ = copyArray(this.__views__);
      return result;
    }

    /**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */
    function lazyReverse() {
      if (this.__filtered__) {
        var result = new LazyWrapper(this);
        result.__dir__ = -1;
        result.__filtered__ = true;
      } else {
        result = this.clone();
        result.__dir__ *= -1;
      }
      return result;
    }

    /**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */
    function lazyValue() {
      var array = this.__wrapped__.value(),
          dir = this.__dir__,
          isArr = isArray(array),
          isRight = dir < 0,
          arrLength = isArr ? array.length : 0,
          view = getView(0, arrLength, this.__views__),
          start = view.start,
          end = view.end,
          length = end - start,
          index = isRight ? end : (start - 1),
          iteratees = this.__iteratees__,
          iterLength = iteratees.length,
          resIndex = 0,
          takeCount = nativeMin(length, this.__takeCount__);

      if (!isArr || (!isRight && arrLength == length && takeCount == length)) {
        return baseWrapperValue(array, this.__actions__);
      }
      var result = [];

      outer:
      while (length-- && resIndex < takeCount) {
        index += dir;

        var iterIndex = -1,
            value = array[index];

        while (++iterIndex < iterLength) {
          var data = iteratees[iterIndex],
              iteratee = data.iteratee,
              type = data.type,
              computed = iteratee(value);

          if (type == LAZY_MAP_FLAG) {
            value = computed;
          } else if (!computed) {
            if (type == LAZY_FILTER_FLAG) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        result[resIndex++] = value;
      }
      return result;
    }

    // Ensure `LazyWrapper` is an instance of `baseLodash`.
    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
    LazyWrapper.prototype.constructor = LazyWrapper;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined$1 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : undefined$1;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? (data[key] !== undefined$1) : hasOwnProperty.call(data, key);
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (nativeCreate && value === undefined$1) ? HASH_UNDEFINED : value;
      return this;
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      return index < 0 ? undefined$1 : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map || ListCache),
        'string': new Hash
      };
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      var result = getMapData(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      var data = getMapData(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /*------------------------------------------------------------------------*/

    /**
     *
     * Creates an array cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var index = -1,
          length = values == null ? 0 : values.length;

      this.__data__ = new MapCache;
      while (++index < length) {
        this.add(values[index]);
      }
    }

    /**
     * Adds `value` to the array cache.
     *
     * @private
     * @name add
     * @memberOf SetCache
     * @alias push
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache instance.
     */
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }

    /**
     * Checks if `value` is in the array cache.
     *
     * @private
     * @name has
     * @memberOf SetCache
     * @param {*} value The value to search for.
     * @returns {number} Returns `true` if `value` is found, else `false`.
     */
    function setCacheHas(value) {
      return this.__data__.has(value);
    }

    // Add methods to `SetCache`.
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new ListCache;
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      var data = this.__data__,
          result = data['delete'](key);

      this.size = data.size;
      return result;
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = stackClear;
    Stack.prototype['delete'] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value),
          isArg = !isArr && isArguments(value),
          isBuff = !isArr && !isArg && isBuffer(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? baseTimes(value.length, String) : [],
          length = result.length;

      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) &&
            !(skipIndexes && (
               // Safari 9 has enumerable `arguments.length` in strict mode.
               key == 'length' ||
               // Node.js 0.10 has enumerable non-index properties on buffers.
               (isBuff && (key == 'offset' || key == 'parent')) ||
               // PhantomJS 2 has enumerable non-index properties on typed arrays.
               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
               // Skip index properties.
               isIndex(key, length)
            ))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.sample` for arrays.
     *
     * @private
     * @param {Array} array The array to sample.
     * @returns {*} Returns the random element.
     */
    function arraySample(array) {
      var length = array.length;
      return length ? array[baseRandom(0, length - 1)] : undefined$1;
    }

    /**
     * A specialized version of `_.sampleSize` for arrays.
     *
     * @private
     * @param {Array} array The array to sample.
     * @param {number} n The number of elements to sample.
     * @returns {Array} Returns the random elements.
     */
    function arraySampleSize(array, n) {
      return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
    }

    /**
     * A specialized version of `_.shuffle` for arrays.
     *
     * @private
     * @param {Array} array The array to shuffle.
     * @returns {Array} Returns the new shuffled array.
     */
    function arrayShuffle(array) {
      return shuffleSelf(copyArray(array));
    }

    /**
     * This function is like `assignValue` except that it doesn't assign
     * `undefined` values.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignMergeValue(object, key, value) {
      if ((value !== undefined$1 && !eq(object[key], value)) ||
          (value === undefined$1 && !(key in object))) {
        baseAssignValue(object, key, value);
      }
    }

    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
          (value === undefined$1 && !(key in object))) {
        baseAssignValue(object, key, value);
      }
    }

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * Aggregates elements of `collection` on `accumulator` with keys transformed
     * by `iteratee` and values set by `setter`.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform keys.
     * @param {Object} accumulator The initial aggregated object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseAggregator(collection, setter, iteratee, accumulator) {
      baseEach(collection, function(value, key, collection) {
        setter(accumulator, value, iteratee(value), collection);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }

    /**
     * The base implementation of `_.assignIn` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssignIn(object, source) {
      return object && copyObject(source, keysIn(source), object);
    }

    /**
     * The base implementation of `assignValue` and `assignMergeValue` without
     * value checks.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function baseAssignValue(object, key, value) {
      if (key == '__proto__' && defineProperty) {
        defineProperty(object, key, {
          'configurable': true,
          'enumerable': true,
          'value': value,
          'writable': true
        });
      } else {
        object[key] = value;
      }
    }

    /**
     * The base implementation of `_.at` without support for individual paths.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {string[]} paths The property paths to pick.
     * @returns {Array} Returns the picked elements.
     */
    function baseAt(object, paths) {
      var index = -1,
          length = paths.length,
          result = Array(length),
          skip = object == null;

      while (++index < length) {
        result[index] = skip ? undefined$1 : get(object, paths[index]);
      }
      return result;
    }

    /**
     * The base implementation of `_.clamp` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     */
    function baseClamp(number, lower, upper) {
      if (number === number) {
        if (upper !== undefined$1) {
          number = number <= upper ? number : upper;
        }
        if (lower !== undefined$1) {
          number = number >= lower ? number : lower;
        }
      }
      return number;
    }

    /**
     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Deep clone
     *  2 - Flatten inherited properties
     *  4 - Clone symbols
     * @param {Function} [customizer] The function to customize cloning.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The parent object of `value`.
     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, bitmask, customizer, key, object, stack) {
      var result,
          isDeep = bitmask & CLONE_DEEP_FLAG,
          isFlat = bitmask & CLONE_FLAT_FLAG,
          isFull = bitmask & CLONE_SYMBOLS_FLAG;

      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== undefined$1) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value),
            isFunc = tag == funcTag || tag == genTag;

        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          result = (isFlat || isFunc) ? {} : initCloneObject(value);
          if (!isDeep) {
            return isFlat
              ? copySymbolsIn(value, baseAssignIn(result, value))
              : copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, tag, isDeep);
        }
      }
      // Check for circular references and return its corresponding clone.
      stack || (stack = new Stack);
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);

      if (isSet(value)) {
        value.forEach(function(subValue) {
          result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
        });
      } else if (isMap(value)) {
        value.forEach(function(subValue, key) {
          result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
        });
      }

      var keysFunc = isFull
        ? (isFlat ? getAllKeysIn : getAllKeys)
        : (isFlat ? keysIn : keys);

      var props = isArr ? undefined$1 : keysFunc(value);
      arrayEach(props || value, function(subValue, key) {
        if (props) {
          key = subValue;
          subValue = value[key];
        }
        // Recursively populate clone (susceptible to call stack limits).
        assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
      });
      return result;
    }

    /**
     * The base implementation of `_.conforms` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new spec function.
     */
    function baseConforms(source) {
      var props = keys(source);
      return function(object) {
        return baseConformsTo(object, source, props);
      };
    }

    /**
     * The base implementation of `_.conformsTo` which accepts `props` to check.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property predicates to conform to.
     * @returns {boolean} Returns `true` if `object` conforms, else `false`.
     */
    function baseConformsTo(object, source, props) {
      var length = props.length;
      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (length--) {
        var key = props[length],
            predicate = source[key],
            value = object[key];

        if ((value === undefined$1 && !(key in object)) || !predicate(value)) {
          return false;
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.delay` and `_.defer` which accepts `args`
     * to provide to `func`.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Array} args The arguments to provide to `func`.
     * @returns {number|Object} Returns the timer id or timeout object.
     */
    function baseDelay(func, wait, args) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return setTimeout(function() { func.apply(undefined$1, args); }, wait);
    }

    /**
     * The base implementation of methods like `_.difference` without support
     * for excluding multiple arrays or iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          isCommon = true,
          length = array.length,
          result = [],
          valuesLength = values.length;

      if (!length) {
        return result;
      }
      if (iteratee) {
        values = arrayMap(values, baseUnary(iteratee));
      }
      if (comparator) {
        includes = arrayIncludesWith;
        isCommon = false;
      }
      else if (values.length >= LARGE_ARRAY_SIZE) {
        includes = cacheHas;
        isCommon = false;
        values = new SetCache(values);
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee == null ? value : iteratee(value);

        value = (comparator || value !== 0) ? value : 0;
        if (isCommon && computed === computed) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === computed) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (!includes(values, computed, comparator)) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.forEach` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEach = createBaseEach(baseForOwn);

    /**
     * The base implementation of `_.forEachRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEachRight = createBaseEach(baseForOwnRight, true);

    /**
     * The base implementation of `_.every` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`
     */
    function baseEvery(collection, predicate) {
      var result = true;
      baseEach(collection, function(value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }

    /**
     * The base implementation of methods like `_.max` and `_.min` which accepts a
     * `comparator` to determine the extremum value.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The iteratee invoked per iteration.
     * @param {Function} comparator The comparator used to compare values.
     * @returns {*} Returns the extremum value.
     */
    function baseExtremum(array, iteratee, comparator) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        var value = array[index],
            current = iteratee(value);

        if (current != null && (computed === undefined$1
              ? (current === current && !isSymbol(current))
              : comparator(current, computed)
            )) {
          var computed = current,
              result = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.fill` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     */
    function baseFill(array, value, start, end) {
      var length = array.length;

      start = toInteger(start);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined$1 || end > length) ? length : toInteger(end);
      if (end < 0) {
        end += length;
      }
      end = start > end ? 0 : toLength(end);
      while (start < end) {
        array[start++] = value;
      }
      return array;
    }

    /**
     * The base implementation of `_.filter` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function(value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.flatten` with support for restricting flattening.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {number} depth The maximum recursion depth.
     * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
     * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, depth, predicate, isStrict, result) {
      var index = -1,
          length = array.length;

      predicate || (predicate = isFlattenable);
      result || (result = []);

      while (++index < length) {
        var value = array[index];
        if (depth > 0 && predicate(value)) {
          if (depth > 1) {
            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, depth - 1, predicate, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `baseForOwn` which iterates over `object`
     * properties returned by `keysFunc` and invokes `iteratee` for each property.
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor = createBaseFor();

    /**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseForRight = createBaseFor(true);

    /**
     * The base implementation of `_.forOwn` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
      return object && baseFor(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.forOwnRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwnRight(object, iteratee) {
      return object && baseForRight(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from `props`.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} props The property names to filter.
     * @returns {Array} Returns the function names.
     */
    function baseFunctions(object, props) {
      return arrayFilter(props, function(key) {
        return isFunction(object[key]);
      });
    }

    /**
     * The base implementation of `_.get` without support for default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path) {
      path = castPath(path, object);

      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[toKey(path[index++])];
      }
      return (index && index == length) ? object : undefined$1;
    }

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined$1 ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    /**
     * The base implementation of `_.gt` which doesn't coerce arguments.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`,
     *  else `false`.
     */
    function baseGt(value, other) {
      return value > other;
    }

    /**
     * The base implementation of `_.has` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHas(object, key) {
      return object != null && hasOwnProperty.call(object, key);
    }

    /**
     * The base implementation of `_.hasIn` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHasIn(object, key) {
      return object != null && key in Object(object);
    }

    /**
     * The base implementation of `_.inRange` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number The number to check.
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     */
    function baseInRange(number, start, end) {
      return number >= nativeMin(start, end) && number < nativeMax(start, end);
    }

    /**
     * The base implementation of methods like `_.intersection`, without support
     * for iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of shared values.
     */
    function baseIntersection(arrays, iteratee, comparator) {
      var includes = comparator ? arrayIncludesWith : arrayIncludes,
          length = arrays[0].length,
          othLength = arrays.length,
          othIndex = othLength,
          caches = Array(othLength),
          maxLength = Infinity,
          result = [];

      while (othIndex--) {
        var array = arrays[othIndex];
        if (othIndex && iteratee) {
          array = arrayMap(array, baseUnary(iteratee));
        }
        maxLength = nativeMin(array.length, maxLength);
        caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
          ? new SetCache(othIndex && array)
          : undefined$1;
      }
      array = arrays[0];

      var index = -1,
          seen = caches[0];

      outer:
      while (++index < length && result.length < maxLength) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (!(seen
              ? cacheHas(seen, computed)
              : includes(result, computed, comparator)
            )) {
          othIndex = othLength;
          while (--othIndex) {
            var cache = caches[othIndex];
            if (!(cache
                  ? cacheHas(cache, computed)
                  : includes(arrays[othIndex], computed, comparator))
                ) {
              continue outer;
            }
          }
          if (seen) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.invert` and `_.invertBy` which inverts
     * `object` with values transformed by `iteratee` and set by `setter`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform values.
     * @param {Object} accumulator The initial inverted object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseInverter(object, setter, iteratee, accumulator) {
      baseForOwn(object, function(value, key, object) {
        setter(accumulator, iteratee(value), key, object);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.invoke` without support for individual
     * method arguments.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {Array} args The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     */
    function baseInvoke(object, path, args) {
      path = castPath(path, object);
      object = parent(object, path);
      var func = object == null ? object : object[toKey(last(path))];
      return func == null ? undefined$1 : apply(func, object, args);
    }

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }

    /**
     * The base implementation of `_.isArrayBuffer` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
     */
    function baseIsArrayBuffer(value) {
      return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
    }

    /**
     * The base implementation of `_.isDate` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
     */
    function baseIsDate(value) {
      return isObjectLike(value) && baseGetTag(value) == dateTag;
    }

    /**
     * The base implementation of `_.isEqual` which supports partial comparisons
     * and tracks traversed objects.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Unordered comparison
     *  2 - Partial comparison
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = objIsArr ? arrayTag : getTag(object),
          othTag = othIsArr ? arrayTag : getTag(other);

      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;

      var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack);
        return (objIsArr || isTypedArray(object))
          ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
          : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object,
              othUnwrapped = othIsWrapped ? other.value() : other;

          stack || (stack = new Stack);
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack);
      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }

    /**
     * The base implementation of `_.isMap` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     */
    function baseIsMap(value) {
      return isObjectLike(value) && getTag(value) == mapTag;
    }

    /**
     * The base implementation of `_.isMatch` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Array} matchData The property names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, source, matchData, customizer) {
      var index = matchData.length,
          length = index,
          noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
            ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined$1 && !(key in object)) {
            return false;
          }
        } else {
          var stack = new Stack;
          if (customizer) {
            var result = customizer(objValue, srcValue, key, object, source, stack);
          }
          if (!(result === undefined$1
                ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
                : result
              )) {
            return false;
          }
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * The base implementation of `_.isRegExp` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
     */
    function baseIsRegExp(value) {
      return isObjectLike(value) && baseGetTag(value) == regexpTag;
    }

    /**
     * The base implementation of `_.isSet` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     */
    function baseIsSet(value) {
      return isObjectLike(value) && getTag(value) == setTag;
    }

    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */
    function baseIsTypedArray(value) {
      return isObjectLike(value) &&
        isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }

    /**
     * The base implementation of `_.iteratee`.
     *
     * @private
     * @param {*} [value=_.identity] The value to convert to an iteratee.
     * @returns {Function} Returns the iteratee.
     */
    function baseIteratee(value) {
      // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
      // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
      if (typeof value == 'function') {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (typeof value == 'object') {
        return isArray(value)
          ? baseMatchesProperty(value[0], value[1])
          : baseMatches(value);
      }
      return property(value);
    }

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeysIn(object) {
      if (!isObject(object)) {
        return nativeKeysIn(object);
      }
      var isProto = isPrototype(object),
          result = [];

      for (var key in object) {
        if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.lt` which doesn't coerce arguments.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`,
     *  else `false`.
     */
    function baseLt(value, other) {
      return value < other;
    }

    /**
     * The base implementation of `_.map` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function baseMap(collection, iteratee) {
      var index = -1,
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }

    /**
     * The base implementation of `_.matches` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        return matchesStrictComparable(matchData[0][0], matchData[0][1]);
      }
      return function(object) {
        return object === source || baseIsMatch(object, source, matchData);
      };
    }

    /**
     * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatchesProperty(path, srcValue) {
      if (isKey(path) && isStrictComparable(srcValue)) {
        return matchesStrictComparable(toKey(path), srcValue);
      }
      return function(object) {
        var objValue = get(object, path);
        return (objValue === undefined$1 && objValue === srcValue)
          ? hasIn(object, path)
          : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
      };
    }

    /**
     * The base implementation of `_.merge` without support for multiple sources.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     */
    function baseMerge(object, source, srcIndex, customizer, stack) {
      if (object === source) {
        return;
      }
      baseFor(source, function(srcValue, key) {
        stack || (stack = new Stack);
        if (isObject(srcValue)) {
          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
        }
        else {
          var newValue = customizer
            ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
            : undefined$1;

          if (newValue === undefined$1) {
            newValue = srcValue;
          }
          assignMergeValue(object, key, newValue);
        }
      }, keysIn);
    }

    /**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {string} key The key of the value to merge.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     */
    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
      var objValue = safeGet(object, key),
          srcValue = safeGet(source, key),
          stacked = stack.get(srcValue);

      if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
      }
      var newValue = customizer
        ? customizer(objValue, srcValue, (key + ''), object, source, stack)
        : undefined$1;

      var isCommon = newValue === undefined$1;

      if (isCommon) {
        var isArr = isArray(srcValue),
            isBuff = !isArr && isBuffer(srcValue),
            isTyped = !isArr && !isBuff && isTypedArray(srcValue);

        newValue = srcValue;
        if (isArr || isBuff || isTyped) {
          if (isArray(objValue)) {
            newValue = objValue;
          }
          else if (isArrayLikeObject(objValue)) {
            newValue = copyArray(objValue);
          }
          else if (isBuff) {
            isCommon = false;
            newValue = cloneBuffer(srcValue, true);
          }
          else if (isTyped) {
            isCommon = false;
            newValue = cloneTypedArray(srcValue, true);
          }
          else {
            newValue = [];
          }
        }
        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          newValue = objValue;
          if (isArguments(objValue)) {
            newValue = toPlainObject(objValue);
          }
          else if (!isObject(objValue) || isFunction(objValue)) {
            newValue = initCloneObject(srcValue);
          }
        }
        else {
          isCommon = false;
        }
      }
      if (isCommon) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        stack.set(srcValue, newValue);
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
        stack['delete'](srcValue);
      }
      assignMergeValue(object, key, newValue);
    }

    /**
     * The base implementation of `_.nth` which doesn't coerce arguments.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {number} n The index of the element to return.
     * @returns {*} Returns the nth element of `array`.
     */
    function baseNth(array, n) {
      var length = array.length;
      if (!length) {
        return;
      }
      n += n < 0 ? length : 0;
      return isIndex(n, length) ? array[n] : undefined$1;
    }

    /**
     * The base implementation of `_.orderBy` without param guards.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {string[]} orders The sort orders of `iteratees`.
     * @returns {Array} Returns the new sorted array.
     */
    function baseOrderBy(collection, iteratees, orders) {
      if (iteratees.length) {
        iteratees = arrayMap(iteratees, function(iteratee) {
          if (isArray(iteratee)) {
            return function(value) {
              return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
            }
          }
          return iteratee;
        });
      } else {
        iteratees = [identity];
      }

      var index = -1;
      iteratees = arrayMap(iteratees, baseUnary(getIteratee()));

      var result = baseMap(collection, function(value, key, collection) {
        var criteria = arrayMap(iteratees, function(iteratee) {
          return iteratee(value);
        });
        return { 'criteria': criteria, 'index': ++index, 'value': value };
      });

      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }

    /**
     * The base implementation of `_.pick` without support for individual
     * property identifiers.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} paths The property paths to pick.
     * @returns {Object} Returns the new object.
     */
    function basePick(object, paths) {
      return basePickBy(object, paths, function(value, path) {
        return hasIn(object, path);
      });
    }

    /**
     * The base implementation of  `_.pickBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} paths The property paths to pick.
     * @param {Function} predicate The function invoked per property.
     * @returns {Object} Returns the new object.
     */
    function basePickBy(object, paths, predicate) {
      var index = -1,
          length = paths.length,
          result = {};

      while (++index < length) {
        var path = paths[index],
            value = baseGet(object, path);

        if (predicate(value, path)) {
          baseSet(result, castPath(path, object), value);
        }
      }
      return result;
    }

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     */
    function basePropertyDeep(path) {
      return function(object) {
        return baseGet(object, path);
      };
    }

    /**
     * The base implementation of `_.pullAllBy` without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     */
    function basePullAll(array, values, iteratee, comparator) {
      var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
          index = -1,
          length = values.length,
          seen = array;

      if (array === values) {
        values = copyArray(values);
      }
      if (iteratee) {
        seen = arrayMap(array, baseUnary(iteratee));
      }
      while (++index < length) {
        var fromIndex = 0,
            value = values[index],
            computed = iteratee ? iteratee(value) : value;

        while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
          if (seen !== array) {
            splice.call(seen, fromIndex, 1);
          }
          splice.call(array, fromIndex, 1);
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.pullAt` without support for individual
     * indexes or capturing the removed elements.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns `array`.
     */
    function basePullAt(array, indexes) {
      var length = array ? indexes.length : 0,
          lastIndex = length - 1;

      while (length--) {
        var index = indexes[length];
        if (length == lastIndex || index !== previous) {
          var previous = index;
          if (isIndex(index)) {
            splice.call(array, index, 1);
          } else {
            baseUnset(array, index);
          }
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.random` without support for returning
     * floating-point numbers.
     *
     * @private
     * @param {number} lower The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the random number.
     */
    function baseRandom(lower, upper) {
      return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
    }

    /**
     * The base implementation of `_.range` and `_.rangeRight` which doesn't
     * coerce arguments.
     *
     * @private
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @param {number} step The value to increment or decrement by.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the range of numbers.
     */
    function baseRange(start, end, step, fromRight) {
      var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (length--) {
        result[fromRight ? length : ++index] = start;
        start += step;
      }
      return result;
    }

    /**
     * The base implementation of `_.repeat` which doesn't coerce arguments.
     *
     * @private
     * @param {string} string The string to repeat.
     * @param {number} n The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     */
    function baseRepeat(string, n) {
      var result = '';
      if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
        return result;
      }
      // Leverage the exponentiation by squaring algorithm for a faster repeat.
      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
      do {
        if (n % 2) {
          result += string;
        }
        n = nativeFloor(n / 2);
        if (n) {
          string += string;
        }
      } while (n);

      return result;
    }

    /**
     * The base implementation of `_.rest` which doesn't validate or coerce arguments.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     */
    function baseRest(func, start) {
      return setToString(overRest(func, start, identity), func + '');
    }

    /**
     * The base implementation of `_.sample`.
     *
     * @private
     * @param {Array|Object} collection The collection to sample.
     * @returns {*} Returns the random element.
     */
    function baseSample(collection) {
      return arraySample(values(collection));
    }

    /**
     * The base implementation of `_.sampleSize` without param guards.
     *
     * @private
     * @param {Array|Object} collection The collection to sample.
     * @param {number} n The number of elements to sample.
     * @returns {Array} Returns the random elements.
     */
    function baseSampleSize(collection, n) {
      var array = values(collection);
      return shuffleSelf(array, baseClamp(n, 0, array.length));
    }

    /**
     * The base implementation of `_.set`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseSet(object, path, value, customizer) {
      if (!isObject(object)) {
        return object;
      }
      path = castPath(path, object);

      var index = -1,
          length = path.length,
          lastIndex = length - 1,
          nested = object;

      while (nested != null && ++index < length) {
        var key = toKey(path[index]),
            newValue = value;

        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          return object;
        }

        if (index != lastIndex) {
          var objValue = nested[key];
          newValue = customizer ? customizer(objValue, key, nested) : undefined$1;
          if (newValue === undefined$1) {
            newValue = isObject(objValue)
              ? objValue
              : (isIndex(path[index + 1]) ? [] : {});
          }
        }
        assignValue(nested, key, newValue);
        nested = nested[key];
      }
      return object;
    }

    /**
     * The base implementation of `setData` without support for hot loop shorting.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var baseSetData = !metaMap ? identity : function(func, data) {
      metaMap.set(func, data);
      return func;
    };

    /**
     * The base implementation of `setToString` without support for hot loop shorting.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var baseSetToString = !defineProperty ? identity : function(func, string) {
      return defineProperty(func, 'toString', {
        'configurable': true,
        'enumerable': false,
        'value': constant(string),
        'writable': true
      });
    };

    /**
     * The base implementation of `_.shuffle`.
     *
     * @private
     * @param {Array|Object} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     */
    function baseShuffle(collection) {
      return shuffleSelf(values(collection));
    }

    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice(array, start, end) {
      var index = -1,
          length = array.length;

      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : ((end - start) >>> 0);
      start >>>= 0;

      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    /**
     * The base implementation of `_.some` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function baseSome(collection, predicate) {
      var result;

      baseEach(collection, function(value, index, collection) {
        result = predicate(value, index, collection);
        return !result;
      });
      return !!result;
    }

    /**
     * The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
     * performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndex(array, value, retHighest) {
      var low = 0,
          high = array == null ? low : array.length;

      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
        while (low < high) {
          var mid = (low + high) >>> 1,
              computed = array[mid];

          if (computed !== null && !isSymbol(computed) &&
              (retHighest ? (computed <= value) : (computed < value))) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return high;
      }
      return baseSortedIndexBy(array, value, identity, retHighest);
    }

    /**
     * The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
     * which invokes `iteratee` for `value` and each element of `array` to compute
     * their sort ranking. The iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} iteratee The iteratee invoked per element.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndexBy(array, value, iteratee, retHighest) {
      var low = 0,
          high = array == null ? 0 : array.length;
      if (high === 0) {
        return 0;
      }

      value = iteratee(value);
      var valIsNaN = value !== value,
          valIsNull = value === null,
          valIsSymbol = isSymbol(value),
          valIsUndefined = value === undefined$1;

      while (low < high) {
        var mid = nativeFloor((low + high) / 2),
            computed = iteratee(array[mid]),
            othIsDefined = computed !== undefined$1,
            othIsNull = computed === null,
            othIsReflexive = computed === computed,
            othIsSymbol = isSymbol(computed);

        if (valIsNaN) {
          var setLow = retHighest || othIsReflexive;
        } else if (valIsUndefined) {
          setLow = othIsReflexive && (retHighest || othIsDefined);
        } else if (valIsNull) {
          setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
        } else if (valIsSymbol) {
          setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
        } else if (othIsNull || othIsSymbol) {
          setLow = false;
        } else {
          setLow = retHighest ? (computed <= value) : (computed < value);
        }
        if (setLow) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return nativeMin(high, MAX_ARRAY_INDEX);
    }

    /**
     * The base implementation of `_.sortedUniq` and `_.sortedUniqBy` without
     * support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseSortedUniq(array, iteratee) {
      var index = -1,
          length = array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        if (!index || !eq(computed, seen)) {
          var seen = computed;
          result[resIndex++] = value === 0 ? 0 : value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.toNumber` which doesn't ensure correct
     * conversions of binary, hexadecimal, or octal string values.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     */
    function baseToNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      return +value;
    }

    /**
     * The base implementation of `_.toString` which doesn't convert nullish
     * values to empty strings.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     */
    function baseToString(value) {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value;
      }
      if (isArray(value)) {
        // Recursively convert values (susceptible to call stack limits).
        return arrayMap(value, baseToString) + '';
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : '';
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * The base implementation of `_.uniqBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseUniq(array, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          length = array.length,
          isCommon = true,
          result = [],
          seen = result;

      if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
      }
      else if (length >= LARGE_ARRAY_SIZE) {
        var set = iteratee ? null : createSet(array);
        if (set) {
          return setToArray(set);
        }
        isCommon = false;
        includes = cacheHas;
        seen = new SetCache;
      }
      else {
        seen = iteratee ? [] : result;
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (isCommon && computed === computed) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        }
        else if (!includes(seen, computed, comparator)) {
          if (seen !== result) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.unset`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The property path to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     */
    function baseUnset(object, path) {
      path = castPath(path, object);
      object = parent(object, path);
      return object == null || delete object[toKey(last(path))];
    }

    /**
     * The base implementation of `_.update`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to update.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseUpdate(object, path, updater, customizer) {
      return baseSet(object, path, updater(baseGet(object, path)), customizer);
    }

    /**
     * The base implementation of methods like `_.dropWhile` and `_.takeWhile`
     * without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {Function} predicate The function invoked per iteration.
     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseWhile(array, predicate, isDrop, fromRight) {
      var length = array.length,
          index = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length) &&
        predicate(array[index], index, array)) {}

      return isDrop
        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
    }

    /**
     * The base implementation of `wrapperValue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value The unwrapped value.
     * @param {Array} actions Actions to perform to resolve the unwrapped value.
     * @returns {*} Returns the resolved value.
     */
    function baseWrapperValue(value, actions) {
      var result = value;
      if (result instanceof LazyWrapper) {
        result = result.value();
      }
      return arrayReduce(actions, function(result, action) {
        return action.func.apply(action.thisArg, arrayPush([result], action.args));
      }, result);
    }

    /**
     * The base implementation of methods like `_.xor`, without support for
     * iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of values.
     */
    function baseXor(arrays, iteratee, comparator) {
      var length = arrays.length;
      if (length < 2) {
        return length ? baseUniq(arrays[0]) : [];
      }
      var index = -1,
          result = Array(length);

      while (++index < length) {
        var array = arrays[index],
            othIndex = -1;

        while (++othIndex < length) {
          if (othIndex != index) {
            result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
          }
        }
      }
      return baseUniq(baseFlatten(result, 1), iteratee, comparator);
    }

    /**
     * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
     *
     * @private
     * @param {Array} props The property identifiers.
     * @param {Array} values The property values.
     * @param {Function} assignFunc The function to assign values.
     * @returns {Object} Returns the new object.
     */
    function baseZipObject(props, values, assignFunc) {
      var index = -1,
          length = props.length,
          valsLength = values.length,
          result = {};

      while (++index < length) {
        var value = index < valsLength ? values[index] : undefined$1;
        assignFunc(result, props[index], value);
      }
      return result;
    }

    /**
     * Casts `value` to an empty array if it's not an array like object.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Array|Object} Returns the cast array-like object.
     */
    function castArrayLikeObject(value) {
      return isArrayLikeObject(value) ? value : [];
    }

    /**
     * Casts `value` to `identity` if it's not a function.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Function} Returns cast function.
     */
    function castFunction(value) {
      return typeof value == 'function' ? value : identity;
    }

    /**
     * Casts `value` to a path array if it's not one.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {Object} [object] The object to query keys on.
     * @returns {Array} Returns the cast property path array.
     */
    function castPath(value, object) {
      if (isArray(value)) {
        return value;
      }
      return isKey(value, object) ? [value] : stringToPath(toString(value));
    }

    /**
     * A `baseRest` alias which can be replaced with `identity` by module
     * replacement plugins.
     *
     * @private
     * @type {Function}
     * @param {Function} func The function to apply a rest parameter to.
     * @returns {Function} Returns the new function.
     */
    var castRest = baseRest;

    /**
     * Casts `array` to a slice if it's needed.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {number} start The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the cast slice.
     */
    function castSlice(array, start, end) {
      var length = array.length;
      end = end === undefined$1 ? length : end;
      return (!start && end >= length) ? array : baseSlice(array, start, end);
    }

    /**
     * A simple wrapper around the global [`clearTimeout`](https://mdn.io/clearTimeout).
     *
     * @private
     * @param {number|Object} id The timer id or timeout object of the timer to clear.
     */
    var clearTimeout = ctxClearTimeout || function(id) {
      return root.clearTimeout(id);
    };

    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length,
          result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

      buffer.copy(result);
      return result;
    }

    /**
     * Creates a clone of `arrayBuffer`.
     *
     * @private
     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }

    /**
     * Creates a clone of `dataView`.
     *
     * @private
     * @param {Object} dataView The data view to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned data view.
     */
    function cloneDataView(dataView, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }

    /**
     * Creates a clone of `regexp`.
     *
     * @private
     * @param {Object} regexp The regexp to clone.
     * @returns {Object} Returns the cloned regexp.
     */
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }

    /**
     * Creates a clone of the `symbol` object.
     *
     * @private
     * @param {Object} symbol The symbol object to clone.
     * @returns {Object} Returns the cloned symbol object.
     */
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }

    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }

    /**
     * Compares values to sort them in ascending order.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {number} Returns the sort order indicator for `value`.
     */
    function compareAscending(value, other) {
      if (value !== other) {
        var valIsDefined = value !== undefined$1,
            valIsNull = value === null,
            valIsReflexive = value === value,
            valIsSymbol = isSymbol(value);

        var othIsDefined = other !== undefined$1,
            othIsNull = other === null,
            othIsReflexive = other === other,
            othIsSymbol = isSymbol(other);

        if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
            (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
            (valIsNull && othIsDefined && othIsReflexive) ||
            (!valIsDefined && othIsReflexive) ||
            !valIsReflexive) {
          return 1;
        }
        if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
            (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
            (othIsNull && valIsDefined && valIsReflexive) ||
            (!othIsDefined && valIsReflexive) ||
            !othIsReflexive) {
          return -1;
        }
      }
      return 0;
    }

    /**
     * Used by `_.orderBy` to compare multiple properties of a value to another
     * and stable sort them.
     *
     * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
     * specify an order of "desc" for descending or "asc" for ascending sort order
     * of corresponding values.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {boolean[]|string[]} orders The order to sort by for each property.
     * @returns {number} Returns the sort order indicator for `object`.
     */
    function compareMultiple(object, other, orders) {
      var index = -1,
          objCriteria = object.criteria,
          othCriteria = other.criteria,
          length = objCriteria.length,
          ordersLength = orders.length;

      while (++index < length) {
        var result = compareAscending(objCriteria[index], othCriteria[index]);
        if (result) {
          if (index >= ordersLength) {
            return result;
          }
          var order = orders[index];
          return result * (order == 'desc' ? -1 : 1);
        }
      }
      // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
      // that causes it, under certain circumstances, to provide the same value for
      // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
      // for more details.
      //
      // This also ensures a stable sort in V8 and other engines.
      // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
      return object.index - other.index;
    }

    /**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array} args The provided arguments.
     * @param {Array} partials The arguments to prepend to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgs(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersLength = holders.length,
          leftIndex = -1,
          leftLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(leftLength + rangeLength),
          isUncurried = !isCurried;

      while (++leftIndex < leftLength) {
        result[leftIndex] = partials[leftIndex];
      }
      while (++argsIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[holders[argsIndex]] = args[argsIndex];
        }
      }
      while (rangeLength--) {
        result[leftIndex++] = args[argsIndex++];
      }
      return result;
    }

    /**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array} args The provided arguments.
     * @param {Array} partials The arguments to append to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgsRight(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersIndex = -1,
          holdersLength = holders.length,
          rightIndex = -1,
          rightLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(rangeLength + rightLength),
          isUncurried = !isCurried;

      while (++argsIndex < rangeLength) {
        result[argsIndex] = args[argsIndex];
      }
      var offset = argsIndex;
      while (++rightIndex < rightLength) {
        result[offset + rightIndex] = partials[rightIndex];
      }
      while (++holdersIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[offset + holders[holdersIndex]] = args[argsIndex++];
        }
      }
      return result;
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function copyArray(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property identifiers to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} Returns `object`.
     */
    function copyObject(source, props, object, customizer) {
      var isNew = !object;
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];

        var newValue = customizer
          ? customizer(object[key], source[key], key, object, source)
          : undefined$1;

        if (newValue === undefined$1) {
          newValue = source[key];
        }
        if (isNew) {
          baseAssignValue(object, key, newValue);
        } else {
          assignValue(object, key, newValue);
        }
      }
      return object;
    }

    /**
     * Copies own symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }

    /**
     * Copies own and inherited symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbolsIn(source, object) {
      return copyObject(source, getSymbolsIn(source), object);
    }

    /**
     * Creates a function like `_.groupBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} [initializer] The accumulator object initializer.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter, initializer) {
      return function(collection, iteratee) {
        var func = isArray(collection) ? arrayAggregator : baseAggregator,
            accumulator = initializer ? initializer() : {};

        return func(collection, setter, getIteratee(iteratee, 2), accumulator);
      };
    }

    /**
     * Creates a function like `_.assign`.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */
    function createAssigner(assigner) {
      return baseRest(function(object, sources) {
        var index = -1,
            length = sources.length,
            customizer = length > 1 ? sources[length - 1] : undefined$1,
            guard = length > 2 ? sources[2] : undefined$1;

        customizer = (assigner.length > 3 && typeof customizer == 'function')
          ? (length--, customizer)
          : undefined$1;

        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined$1 : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }

    /**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        if (collection == null) {
          return collection;
        }
        if (!isArrayLike(collection)) {
          return eachFunc(collection, iteratee);
        }
        var length = collection.length,
            index = fromRight ? length : -1,
            iterable = Object(collection);

        while ((fromRight ? index-- : ++index < length)) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }

    /**
     * Creates a base function for methods like `_.forIn` and `_.forOwn`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1,
            iterable = Object(object),
            props = keysFunc(object),
            length = props.length;

        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    /**
     * Creates a function that wraps `func` to invoke it with the optional `this`
     * binding of `thisArg`.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createBind(func, bitmask, thisArg) {
      var isBind = bitmask & WRAP_BIND_FLAG,
          Ctor = createCtor(func);

      function wrapper() {
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(isBind ? thisArg : this, arguments);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.lowerFirst`.
     *
     * @private
     * @param {string} methodName The name of the `String` case method to use.
     * @returns {Function} Returns the new case function.
     */
    function createCaseFirst(methodName) {
      return function(string) {
        string = toString(string);

        var strSymbols = hasUnicode(string)
          ? stringToArray(string)
          : undefined$1;

        var chr = strSymbols
          ? strSymbols[0]
          : string.charAt(0);

        var trailing = strSymbols
          ? castSlice(strSymbols, 1).join('')
          : string.slice(1);

        return chr[methodName]() + trailing;
      };
    }

    /**
     * Creates a function like `_.camelCase`.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */
    function createCompounder(callback) {
      return function(string) {
        return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
      };
    }

    /**
     * Creates a function that produces an instance of `Ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {Function} Ctor The constructor to wrap.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCtor(Ctor) {
      return function() {
        // Use a `switch` statement to work with class constructors. See
        // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
        // for more details.
        var args = arguments;
        switch (args.length) {
          case 0: return new Ctor;
          case 1: return new Ctor(args[0]);
          case 2: return new Ctor(args[0], args[1]);
          case 3: return new Ctor(args[0], args[1], args[2]);
          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        var thisBinding = baseCreate(Ctor.prototype),
            result = Ctor.apply(thisBinding, args);

        // Mimic the constructor's `return` behavior.
        // See https://es5.github.io/#x13.2.2 for more details.
        return isObject(result) ? result : thisBinding;
      };
    }

    /**
     * Creates a function that wraps `func` to enable currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {number} arity The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCurry(func, bitmask, arity) {
      var Ctor = createCtor(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length,
            placeholder = getHolder(wrapper);

        while (index--) {
          args[index] = arguments[index];
        }
        var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
          ? []
          : replaceHolders(args, placeholder);

        length -= holders.length;
        if (length < arity) {
          return createRecurry(
            func, bitmask, createHybrid, wrapper.placeholder, undefined$1,
            args, holders, undefined$1, undefined$1, arity - length);
        }
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return apply(fn, this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.find` or `_.findLast` function.
     *
     * @private
     * @param {Function} findIndexFunc The function to find the collection index.
     * @returns {Function} Returns the new find function.
     */
    function createFind(findIndexFunc) {
      return function(collection, predicate, fromIndex) {
        var iterable = Object(collection);
        if (!isArrayLike(collection)) {
          var iteratee = getIteratee(predicate, 3);
          collection = keys(collection);
          predicate = function(key) { return iteratee(iterable[key], key, iterable); };
        }
        var index = findIndexFunc(collection, predicate, fromIndex);
        return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined$1;
      };
    }

    /**
     * Creates a `_.flow` or `_.flowRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new flow function.
     */
    function createFlow(fromRight) {
      return flatRest(function(funcs) {
        var length = funcs.length,
            index = length,
            prereq = LodashWrapper.prototype.thru;

        if (fromRight) {
          funcs.reverse();
        }
        while (index--) {
          var func = funcs[index];
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
            var wrapper = new LodashWrapper([], true);
          }
        }
        index = wrapper ? index : length;
        while (++index < length) {
          func = funcs[index];

          var funcName = getFuncName(func),
              data = funcName == 'wrapper' ? getData(func) : undefined$1;

          if (data && isLaziable(data[0]) &&
                data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) &&
                !data[4].length && data[9] == 1
              ) {
            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
          } else {
            wrapper = (func.length == 1 && isLaziable(func))
              ? wrapper[funcName]()
              : wrapper.thru(func);
          }
        }
        return function() {
          var args = arguments,
              value = args[0];

          if (wrapper && args.length == 1 && isArray(value)) {
            return wrapper.plant(value).value();
          }
          var index = 0,
              result = length ? funcs[index].apply(this, args) : value;

          while (++index < length) {
            result = funcs[index].call(this, result);
          }
          return result;
        };
      });
    }

    /**
     * Creates a function that wraps `func` to invoke it with optional `this`
     * binding of `thisArg`, partial application, and currying.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to
     *  the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [partialsRight] The arguments to append to those provided
     *  to the new function.
     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
      var isAry = bitmask & WRAP_ARY_FLAG,
          isBind = bitmask & WRAP_BIND_FLAG,
          isBindKey = bitmask & WRAP_BIND_KEY_FLAG,
          isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),
          isFlip = bitmask & WRAP_FLIP_FLAG,
          Ctor = isBindKey ? undefined$1 : createCtor(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length;

        while (index--) {
          args[index] = arguments[index];
        }
        if (isCurried) {
          var placeholder = getHolder(wrapper),
              holdersCount = countHolders(args, placeholder);
        }
        if (partials) {
          args = composeArgs(args, partials, holders, isCurried);
        }
        if (partialsRight) {
          args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
        }
        length -= holdersCount;
        if (isCurried && length < arity) {
          var newHolders = replaceHolders(args, placeholder);
          return createRecurry(
            func, bitmask, createHybrid, wrapper.placeholder, thisArg,
            args, newHolders, argPos, ary, arity - length
          );
        }
        var thisBinding = isBind ? thisArg : this,
            fn = isBindKey ? thisBinding[func] : func;

        length = args.length;
        if (argPos) {
          args = reorder(args, argPos);
        } else if (isFlip && length > 1) {
          args.reverse();
        }
        if (isAry && ary < length) {
          args.length = ary;
        }
        if (this && this !== root && this instanceof wrapper) {
          fn = Ctor || createCtor(fn);
        }
        return fn.apply(thisBinding, args);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.invertBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} toIteratee The function to resolve iteratees.
     * @returns {Function} Returns the new inverter function.
     */
    function createInverter(setter, toIteratee) {
      return function(object, iteratee) {
        return baseInverter(object, setter, toIteratee(iteratee), {});
      };
    }

    /**
     * Creates a function that performs a mathematical operation on two values.
     *
     * @private
     * @param {Function} operator The function to perform the operation.
     * @param {number} [defaultValue] The value used for `undefined` arguments.
     * @returns {Function} Returns the new mathematical operation function.
     */
    function createMathOperation(operator, defaultValue) {
      return function(value, other) {
        var result;
        if (value === undefined$1 && other === undefined$1) {
          return defaultValue;
        }
        if (value !== undefined$1) {
          result = value;
        }
        if (other !== undefined$1) {
          if (result === undefined$1) {
            return other;
          }
          if (typeof value == 'string' || typeof other == 'string') {
            value = baseToString(value);
            other = baseToString(other);
          } else {
            value = baseToNumber(value);
            other = baseToNumber(other);
          }
          result = operator(value, other);
        }
        return result;
      };
    }

    /**
     * Creates a function like `_.over`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over iteratees.
     * @returns {Function} Returns the new over function.
     */
    function createOver(arrayFunc) {
      return flatRest(function(iteratees) {
        iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
        return baseRest(function(args) {
          var thisArg = this;
          return arrayFunc(iteratees, function(iteratee) {
            return apply(iteratee, thisArg, args);
          });
        });
      });
    }

    /**
     * Creates the padding for `string` based on `length`. The `chars` string
     * is truncated if the number of characters exceeds `length`.
     *
     * @private
     * @param {number} length The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padding for `string`.
     */
    function createPadding(length, chars) {
      chars = chars === undefined$1 ? ' ' : baseToString(chars);

      var charsLength = chars.length;
      if (charsLength < 2) {
        return charsLength ? baseRepeat(chars, length) : chars;
      }
      var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
      return hasUnicode(chars)
        ? castSlice(stringToArray(result), 0, length).join('')
        : result.slice(0, length);
    }

    /**
     * Creates a function that wraps `func` to invoke it with the `this` binding
     * of `thisArg` and `partials` prepended to the arguments it receives.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} partials The arguments to prepend to those provided to
     *  the new function.
     * @returns {Function} Returns the new wrapped function.
     */
    function createPartial(func, bitmask, thisArg, partials) {
      var isBind = bitmask & WRAP_BIND_FLAG,
          Ctor = createCtor(func);

      function wrapper() {
        var argsIndex = -1,
            argsLength = arguments.length,
            leftIndex = -1,
            leftLength = partials.length,
            args = Array(leftLength + argsLength),
            fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

        while (++leftIndex < leftLength) {
          args[leftIndex] = partials[leftIndex];
        }
        while (argsLength--) {
          args[leftIndex++] = arguments[++argsIndex];
        }
        return apply(fn, isBind ? thisArg : this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.range` or `_.rangeRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new range function.
     */
    function createRange(fromRight) {
      return function(start, end, step) {
        if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
          end = step = undefined$1;
        }
        // Ensure the sign of `-0` is preserved.
        start = toFinite(start);
        if (end === undefined$1) {
          end = start;
          start = 0;
        } else {
          end = toFinite(end);
        }
        step = step === undefined$1 ? (start < end ? 1 : -1) : toFinite(step);
        return baseRange(start, end, step, fromRight);
      };
    }

    /**
     * Creates a function that performs a relational operation on two values.
     *
     * @private
     * @param {Function} operator The function to perform the operation.
     * @returns {Function} Returns the new relational operation function.
     */
    function createRelationalOperation(operator) {
      return function(value, other) {
        if (!(typeof value == 'string' && typeof other == 'string')) {
          value = toNumber(value);
          other = toNumber(other);
        }
        return operator(value, other);
      };
    }

    /**
     * Creates a function that wraps `func` to continue currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {Function} wrapFunc The function to create the `func` wrapper.
     * @param {*} placeholder The placeholder value.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to
     *  the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
      var isCurry = bitmask & WRAP_CURRY_FLAG,
          newHolders = isCurry ? holders : undefined$1,
          newHoldersRight = isCurry ? undefined$1 : holders,
          newPartials = isCurry ? partials : undefined$1,
          newPartialsRight = isCurry ? undefined$1 : partials;

      bitmask |= (isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG);
      bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);

      if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
        bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
      }
      var newData = [
        func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
        newHoldersRight, argPos, ary, arity
      ];

      var result = wrapFunc.apply(undefined$1, newData);
      if (isLaziable(func)) {
        setData(result, newData);
      }
      result.placeholder = placeholder;
      return setWrapToString(result, func, bitmask);
    }

    /**
     * Creates a function like `_.round`.
     *
     * @private
     * @param {string} methodName The name of the `Math` method to use when rounding.
     * @returns {Function} Returns the new round function.
     */
    function createRound(methodName) {
      var func = Math[methodName];
      return function(number, precision) {
        number = toNumber(number);
        precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
        if (precision && nativeIsFinite(number)) {
          // Shift with exponential notation to avoid floating-point issues.
          // See [MDN](https://mdn.io/round#Examples) for more details.
          var pair = (toString(number) + 'e').split('e'),
              value = func(pair[0] + 'e' + (+pair[1] + precision));

          pair = (toString(value) + 'e').split('e');
          return +(pair[0] + 'e' + (+pair[1] - precision));
        }
        return func(number);
      };
    }

    /**
     * Creates a set object of `values`.
     *
     * @private
     * @param {Array} values The values to add to the set.
     * @returns {Object} Returns the new set.
     */
    var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
      return new Set(values);
    };

    /**
     * Creates a `_.toPairs` or `_.toPairsIn` function.
     *
     * @private
     * @param {Function} keysFunc The function to get the keys of a given object.
     * @returns {Function} Returns the new pairs function.
     */
    function createToPairs(keysFunc) {
      return function(object) {
        var tag = getTag(object);
        if (tag == mapTag) {
          return mapToArray(object);
        }
        if (tag == setTag) {
          return setToPairs(object);
        }
        return baseToPairs(object, keysFunc(object));
      };
    }

    /**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask flags.
     *    1 - `_.bind`
     *    2 - `_.bindKey`
     *    4 - `_.curry` or `_.curryRight` of a bound function
     *    8 - `_.curry`
     *   16 - `_.curryRight`
     *   32 - `_.partial`
     *   64 - `_.partialRight`
     *  128 - `_.rearg`
     *  256 - `_.ary`
     *  512 - `_.flip`
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
      if (!isBindKey && typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = partials ? partials.length : 0;
      if (!length) {
        bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
        partials = holders = undefined$1;
      }
      ary = ary === undefined$1 ? ary : nativeMax(toInteger(ary), 0);
      arity = arity === undefined$1 ? arity : toInteger(arity);
      length -= holders ? holders.length : 0;

      if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
        var partialsRight = partials,
            holdersRight = holders;

        partials = holders = undefined$1;
      }
      var data = isBindKey ? undefined$1 : getData(func);

      var newData = [
        func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
        argPos, ary, arity
      ];

      if (data) {
        mergeData(newData, data);
      }
      func = newData[0];
      bitmask = newData[1];
      thisArg = newData[2];
      partials = newData[3];
      holders = newData[4];
      arity = newData[9] = newData[9] === undefined$1
        ? (isBindKey ? 0 : func.length)
        : nativeMax(newData[9] - length, 0);

      if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
        bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
      }
      if (!bitmask || bitmask == WRAP_BIND_FLAG) {
        var result = createBind(func, bitmask, thisArg);
      } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
        result = createCurry(func, bitmask, arity);
      } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
        result = createPartial(func, bitmask, thisArg, partials);
      } else {
        result = createHybrid.apply(undefined$1, newData);
      }
      var setter = data ? baseSetData : setData;
      return setWrapToString(setter(result, newData), func, bitmask);
    }

    /**
     * Used by `_.defaults` to customize its `_.assignIn` use to assign properties
     * of source objects to the destination object for all destination properties
     * that resolve to `undefined`.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to assign.
     * @param {Object} object The parent object of `objValue`.
     * @returns {*} Returns the value to assign.
     */
    function customDefaultsAssignIn(objValue, srcValue, key, object) {
      if (objValue === undefined$1 ||
          (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
        return srcValue;
      }
      return objValue;
    }

    /**
     * Used by `_.defaultsDeep` to customize its `_.merge` use to merge source
     * objects into destination objects that are passed thru.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to merge.
     * @param {Object} object The parent object of `objValue`.
     * @param {Object} source The parent object of `srcValue`.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     * @returns {*} Returns the value to assign.
     */
    function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
      if (isObject(objValue) && isObject(srcValue)) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        stack.set(srcValue, objValue);
        baseMerge(objValue, srcValue, undefined$1, customDefaultsMerge, stack);
        stack['delete'](srcValue);
      }
      return objValue;
    }

    /**
     * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
     * objects.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {string} key The key of the property to inspect.
     * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
     */
    function customOmitClone(value) {
      return isPlainObject(value) ? undefined$1 : value;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `array` and `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      // Check that cyclic values are equal.
      var arrStacked = stack.get(array);
      var othStacked = stack.get(other);
      if (arrStacked && othStacked) {
        return arrStacked == other && othStacked == array;
      }
      var index = -1,
          result = true,
          seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined$1;

      stack.set(array, other);
      stack.set(other, array);

      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, arrValue, index, other, array, stack)
            : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== undefined$1) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (seen) {
          if (!arraySome(other, function(othValue, othIndex) {
                if (!cacheHas(seen, othIndex) &&
                    (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                  return seen.push(othIndex);
                }
              })) {
            result = false;
            break;
          }
        } else if (!(
              arrValue === othValue ||
                equalFunc(arrValue, othValue, bitmask, customizer, stack)
            )) {
          result = false;
          break;
        }
      }
      stack['delete'](array);
      stack['delete'](other);
      return result;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag:
          if ((object.byteLength != other.byteLength) ||
              (object.byteOffset != other.byteOffset)) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;

        case arrayBufferTag:
          if ((object.byteLength != other.byteLength) ||
              !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
            return false;
          }
          return true;

        case boolTag:
        case dateTag:
        case numberTag:
          // Coerce booleans to `1` or `0` and dates to milliseconds.
          // Invalid dates are coerced to `NaN`.
          return eq(+object, +other);

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings, primitives and objects,
          // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
          // for more details.
          return object == (other + '');

        case mapTag:
          var convert = mapToArray;

        case setTag:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
          convert || (convert = setToArray);

          if (object.size != other.size && !isPartial) {
            return false;
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG;

          // Recursively compare objects (susceptible to call stack limits).
          stack.set(object, other);
          var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack['delete'](object);
          return result;

        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          objProps = getAllKeys(object),
          objLength = objProps.length,
          othProps = getAllKeys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      // Check that cyclic values are equal.
      var objStacked = stack.get(object);
      var othStacked = stack.get(other);
      if (objStacked && othStacked) {
        return objStacked == other && othStacked == object;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);

      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, objValue, key, other, object, stack)
            : customizer(objValue, othValue, key, object, other, stack);
        }
        // Recursively compare objects (susceptible to call stack limits).
        if (!(compared === undefined$1
              ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
              : compared
            )) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack['delete'](object);
      stack['delete'](other);
      return result;
    }

    /**
     * A specialized version of `baseRest` which flattens the rest array.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @returns {Function} Returns the new function.
     */
    function flatRest(func) {
      return setToString(overRest(func, undefined$1, flatten), func + '');
    }

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }

    /**
     * Creates an array of own and inherited enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeysIn(object) {
      return baseGetAllKeys(object, keysIn, getSymbolsIn);
    }

    /**
     * Gets metadata for `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {*} Returns the metadata for `func`.
     */
    var getData = !metaMap ? noop : function(func) {
      return metaMap.get(func);
    };

    /**
     * Gets the name of `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {string} Returns the function name.
     */
    function getFuncName(func) {
      var result = (func.name + ''),
          array = realNames[result],
          length = hasOwnProperty.call(realNames, result) ? array.length : 0;

      while (length--) {
        var data = array[length],
            otherFunc = data.func;
        if (otherFunc == null || otherFunc == func) {
          return data.name;
        }
      }
      return result;
    }

    /**
     * Gets the argument placeholder value for `func`.
     *
     * @private
     * @param {Function} func The function to inspect.
     * @returns {*} Returns the placeholder value.
     */
    function getHolder(func) {
      var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;
      return object.placeholder;
    }

    /**
     * Gets the appropriate "iteratee" function. If `_.iteratee` is customized,
     * this function returns the custom method, otherwise it returns `baseIteratee`.
     * If arguments are provided, the chosen function is invoked with them and
     * its result is returned.
     *
     * @private
     * @param {*} [value] The value to convert to an iteratee.
     * @param {number} [arity] The arity of the created iteratee.
     * @returns {Function} Returns the chosen function or its result.
     */
    function getIteratee() {
      var result = lodash.iteratee || iteratee;
      result = result === iteratee ? baseIteratee : result;
      return arguments.length ? result(arguments[0], arguments[1]) : result;
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * Gets the property names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData(object) {
      var result = keys(object),
          length = result.length;

      while (length--) {
        var key = result[length],
            value = object[key];

        result[length] = [key, value, isStrictComparable(value)];
      }
      return result;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined$1;
    }

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag),
          tag = value[symToStringTag];

      try {
        value[symToStringTag] = undefined$1;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }

    /**
     * Creates an array of the own enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };

    /**
     * Creates an array of the own and inherited enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
      var result = [];
      while (object) {
        arrayPush(result, getSymbols(object));
        object = getPrototype(object);
      }
      return result;
    };

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
        (Map && getTag(new Map) != mapTag) ||
        (Promise && getTag(Promise.resolve()) != promiseTag) ||
        (Set && getTag(new Set) != setTag) ||
        (WeakMap && getTag(new WeakMap) != weakMapTag)) {
      getTag = function(value) {
        var result = baseGetTag(value),
            Ctor = result == objectTag ? value.constructor : undefined$1,
            ctorString = Ctor ? toSource(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag;
            case mapCtorString: return mapTag;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag;
            case weakMapCtorString: return weakMapTag;
          }
        }
        return result;
      };
    }

    /**
     * Gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start The start of the view.
     * @param {number} end The end of the view.
     * @param {Array} transforms The transformations to apply to the view.
     * @returns {Object} Returns an object containing the `start` and `end`
     *  positions of the view.
     */
    function getView(start, end, transforms) {
      var index = -1,
          length = transforms.length;

      while (++index < length) {
        var data = transforms[index],
            size = data.size;

        switch (data.type) {
          case 'drop':      start += size; break;
          case 'dropRight': end -= size; break;
          case 'take':      end = nativeMin(end, start + size); break;
          case 'takeRight': start = nativeMax(start, end - size); break;
        }
      }
      return { 'start': start, 'end': end };
    }

    /**
     * Extracts wrapper details from the `source` body comment.
     *
     * @private
     * @param {string} source The source to inspect.
     * @returns {Array} Returns the wrapper details.
     */
    function getWrapDetails(source) {
      var match = source.match(reWrapDetails);
      return match ? match[1].split(reSplitDetails) : [];
    }

    /**
     * Checks if `path` exists on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @param {Function} hasFunc The function to check properties.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     */
    function hasPath(object, path, hasFunc) {
      path = castPath(path, object);

      var index = -1,
          length = path.length,
          result = false;

      while (++index < length) {
        var key = toKey(path[index]);
        if (!(result = object != null && hasFunc(object, key))) {
          break;
        }
        object = object[key];
      }
      if (result || ++index != length) {
        return result;
      }
      length = object == null ? 0 : object.length;
      return !!length && isLength(length) && isIndex(key, length) &&
        (isArray(object) || isArguments(object));
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = new array.constructor(length);

      // Add properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      return (typeof object.constructor == 'function' && !isPrototype(object))
        ? baseCreate(getPrototype(object))
        : {};
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return cloneArrayBuffer(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case dataViewTag:
          return cloneDataView(object, isDeep);

        case float32Tag: case float64Tag:
        case int8Tag: case int16Tag: case int32Tag:
        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
          return cloneTypedArray(object, isDeep);

        case mapTag:
          return new Ctor;

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          return cloneRegExp(object);

        case setTag:
          return new Ctor;

        case symbolTag:
          return cloneSymbol(object);
      }
    }

    /**
     * Inserts wrapper `details` in a comment at the top of the `source` body.
     *
     * @private
     * @param {string} source The source to modify.
     * @returns {Array} details The details to insert.
     * @returns {string} Returns the modified source.
     */
    function insertWrapDetails(source, details) {
      var length = details.length;
      if (!length) {
        return source;
      }
      var lastIndex = length - 1;
      details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
      details = details.join(length > 2 ? ', ' : ' ');
      return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
    }

    /**
     * Checks if `value` is a flattenable `arguments` object or array.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
     */
    function isFlattenable(value) {
      return isArray(value) || isArguments(value) ||
        !!(spreadableSymbol && value && value[spreadableSymbol]);
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER : length;

      return !!length &&
        (type == 'number' ||
          (type != 'symbol' && reIsUint.test(value))) &&
            (value > -1 && value % 1 == 0 && value < length);
    }

    /**
     * Checks if the given arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
     *  else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
            ? (isArrayLike(object) && isIndex(index, object.length))
            : (type == 'string' && index in object)
          ) {
        return eq(object[index], value);
      }
      return false;
    }

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      if (isArray(value)) {
        return false;
      }
      var type = typeof value;
      if (type == 'number' || type == 'symbol' || type == 'boolean' ||
          value == null || isSymbol(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
        (object != null && value in Object(object));
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * Checks if `func` has a lazy counterpart.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
     *  else `false`.
     */
    function isLaziable(func) {
      var funcName = getFuncName(func),
          other = lodash[funcName];

      if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
        return false;
      }
      if (func === other) {
        return true;
      }
      var data = getData(other);
      return !!data && func === data[0];
    }

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    /**
     * Checks if `func` is capable of being masked.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `func` is maskable, else `false`.
     */
    var isMaskable = coreJsData ? isFunction : stubFalse;

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

      return value === proto;
    }

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }

    /**
     * A specialized version of `matchesProperty` for source values suitable
     * for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function matchesStrictComparable(key, srcValue) {
      return function(object) {
        if (object == null) {
          return false;
        }
        return object[key] === srcValue &&
          (srcValue !== undefined$1 || (key in Object(object)));
      };
    }

    /**
     * A specialized version of `_.memoize` which clears the memoized function's
     * cache when it exceeds `MAX_MEMOIZE_SIZE`.
     *
     * @private
     * @param {Function} func The function to have its output memoized.
     * @returns {Function} Returns the new memoized function.
     */
    function memoizeCapped(func) {
      var result = memoize(func, function(key) {
        if (cache.size === MAX_MEMOIZE_SIZE) {
          cache.clear();
        }
        return key;
      });

      var cache = result.cache;
      return result;
    }

    /**
     * Merges the function metadata of `source` into `data`.
     *
     * Merging metadata reduces the number of wrappers used to invoke a function.
     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. Methods like `_.ary` and
     * `_.rearg` modify function arguments, making the order in which they are
     * executed important, preventing the merging of metadata. However, we make
     * an exception for a safe combined case where curried functions have `_.ary`
     * and or `_.rearg` applied.
     *
     * @private
     * @param {Array} data The destination metadata.
     * @param {Array} source The source metadata.
     * @returns {Array} Returns `data`.
     */
    function mergeData(data, source) {
      var bitmask = data[1],
          srcBitmask = source[1],
          newBitmask = bitmask | srcBitmask,
          isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);

      var isCombo =
        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_CURRY_FLAG)) ||
        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_REARG_FLAG) && (data[7].length <= source[8])) ||
        ((srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG)) && (source[7].length <= source[8]) && (bitmask == WRAP_CURRY_FLAG));

      // Exit early if metadata can't be merged.
      if (!(isCommon || isCombo)) {
        return data;
      }
      // Use source `thisArg` if available.
      if (srcBitmask & WRAP_BIND_FLAG) {
        data[2] = source[2];
        // Set when currying a bound function.
        newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
      }
      // Compose partial arguments.
      var value = source[3];
      if (value) {
        var partials = data[3];
        data[3] = partials ? composeArgs(partials, value, source[4]) : value;
        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
      }
      // Compose partial right arguments.
      value = source[5];
      if (value) {
        partials = data[5];
        data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
      }
      // Use source `argPos` if available.
      value = source[7];
      if (value) {
        data[7] = value;
      }
      // Use source `ary` if it's smaller.
      if (srcBitmask & WRAP_ARY_FLAG) {
        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
      }
      // Use source `arity` if one is not provided.
      if (data[9] == null) {
        data[9] = source[9];
      }
      // Use source `func` and merge bitmasks.
      data[0] = source[0];
      data[1] = newBitmask;

      return data;
    }

    /**
     * This function is like
     * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * except that it includes inherited enumerable properties.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }

    /**
     * A specialized version of `baseRest` which transforms the rest array.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @param {Function} transform The rest array transform.
     * @returns {Function} Returns the new function.
     */
    function overRest(func, start, transform) {
      start = nativeMax(start === undefined$1 ? (func.length - 1) : start, 0);
      return function() {
        var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            array = Array(length);

        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = transform(array);
        return apply(func, this, otherArgs);
      };
    }

    /**
     * Gets the parent value at `path` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} path The path to get the parent value of.
     * @returns {*} Returns the parent value.
     */
    function parent(object, path) {
      return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
    }

    /**
     * Reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {Array} array The array to reorder.
     * @param {Array} indexes The arranged array indexes.
     * @returns {Array} Returns `array`.
     */
    function reorder(array, indexes) {
      var arrLength = array.length,
          length = nativeMin(indexes.length, arrLength),
          oldArray = copyArray(array);

      while (length--) {
        var index = indexes[length];
        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined$1;
      }
      return array;
    }

    /**
     * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function safeGet(object, key) {
      if (key === 'constructor' && typeof object[key] === 'function') {
        return;
      }

      if (key == '__proto__') {
        return;
      }

      return object[key];
    }

    /**
     * Sets metadata for `func`.
     *
     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity
     * function to avoid garbage collection pauses in V8. See
     * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
     * for more details.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var setData = shortOut(baseSetData);

    /**
     * A simple wrapper around the global [`setTimeout`](https://mdn.io/setTimeout).
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @returns {number|Object} Returns the timer id or timeout object.
     */
    var setTimeout = ctxSetTimeout || function(func, wait) {
      return root.setTimeout(func, wait);
    };

    /**
     * Sets the `toString` method of `func` to return `string`.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var setToString = shortOut(baseSetToString);

    /**
     * Sets the `toString` method of `wrapper` to mimic the source of `reference`
     * with wrapper details in a comment at the top of the source body.
     *
     * @private
     * @param {Function} wrapper The function to modify.
     * @param {Function} reference The reference function.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @returns {Function} Returns `wrapper`.
     */
    function setWrapToString(wrapper, reference, bitmask) {
      var source = (reference + '');
      return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
    }

    /**
     * Creates a function that'll short out and invoke `identity` instead
     * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
     * milliseconds.
     *
     * @private
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new shortable function.
     */
    function shortOut(func) {
      var count = 0,
          lastCalled = 0;

      return function() {
        var stamp = nativeNow(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(undefined$1, arguments);
      };
    }

    /**
     * A specialized version of `_.shuffle` which mutates and sets the size of `array`.
     *
     * @private
     * @param {Array} array The array to shuffle.
     * @param {number} [size=array.length] The size of `array`.
     * @returns {Array} Returns `array`.
     */
    function shuffleSelf(array, size) {
      var index = -1,
          length = array.length,
          lastIndex = length - 1;

      size = size === undefined$1 ? length : size;
      while (++index < size) {
        var rand = baseRandom(index, lastIndex),
            value = array[rand];

        array[rand] = array[index];
        array[index] = value;
      }
      array.length = size;
      return array;
    }

    /**
     * Converts `string` to a property path array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the property path array.
     */
    var stringToPath = memoizeCapped(function(string) {
      var result = [];
      if (string.charCodeAt(0) === 46 /* . */) {
        result.push('');
      }
      string.replace(rePropName, function(match, number, quote, subString) {
        result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    });

    /**
     * Converts `value` to a string key if it's not a string or symbol.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {string|symbol} Returns the key.
     */
    function toKey(value) {
      if (typeof value == 'string' || isSymbol(value)) {
        return value;
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * Updates wrapper `details` based on `bitmask` flags.
     *
     * @private
     * @returns {Array} details The details to modify.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @returns {Array} Returns `details`.
     */
    function updateWrapDetails(details, bitmask) {
      arrayEach(wrapFlags, function(pair) {
        var value = '_.' + pair[0];
        if ((bitmask & pair[1]) && !arrayIncludes(details, value)) {
          details.push(value);
        }
      });
      return details.sort();
    }

    /**
     * Creates a clone of `wrapper`.
     *
     * @private
     * @param {Object} wrapper The wrapper to clone.
     * @returns {Object} Returns the cloned wrapper.
     */
    function wrapperClone(wrapper) {
      if (wrapper instanceof LazyWrapper) {
        return wrapper.clone();
      }
      var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
      result.__actions__ = copyArray(wrapper.__actions__);
      result.__index__  = wrapper.__index__;
      result.__values__ = wrapper.__values__;
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements split into groups the length of `size`.
     * If `array` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to process.
     * @param {number} [size=1] The length of each chunk
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the new array of chunks.
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */
    function chunk(array, size, guard) {
      if ((guard ? isIterateeCall(array, size, guard) : size === undefined$1)) {
        size = 1;
      } else {
        size = nativeMax(toInteger(size), 0);
      }
      var length = array == null ? 0 : array.length;
      if (!length || size < 1) {
        return [];
      }
      var index = 0,
          resIndex = 0,
          result = Array(nativeCeil(length / size));

      while (index < length) {
        result[resIndex++] = baseSlice(array, index, (index += size));
      }
      return result;
    }

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /**
     * Creates a new array concatenating `array` with any additional arrays
     * and/or values.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to concatenate.
     * @param {...*} [values] The values to concatenate.
     * @returns {Array} Returns the new concatenated array.
     * @example
     *
     * var array = [1];
     * var other = _.concat(array, 2, [3], [[4]]);
     *
     * console.log(other);
     * // => [1, 2, 3, [4]]
     *
     * console.log(array);
     * // => [1]
     */
    function concat() {
      var length = arguments.length;
      if (!length) {
        return [];
      }
      var args = Array(length - 1),
          array = arguments[0],
          index = length;

      while (index--) {
        args[index - 1] = arguments[index];
      }
      return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
    }

    /**
     * Creates an array of `array` values not included in the other given arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. The order and references of result values are
     * determined by the first array.
     *
     * **Note:** Unlike `_.pullAll`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.without, _.xor
     * @example
     *
     * _.difference([2, 1], [2, 3]);
     * // => [1]
     */
    var difference = baseRest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `iteratee` which
     * is invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. The order and references of result values are
     * determined by the first array. The iteratee is invoked with one argument:
     * (value).
     *
     * **Note:** Unlike `_.pullAllBy`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var differenceBy = baseRest(function(array, values) {
      var iteratee = last(values);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined$1;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), getIteratee(iteratee, 2))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `comparator`
     * which is invoked to compare elements of `array` to `values`. The order and
     * references of result values are determined by the first array. The comparator
     * is invoked with two arguments: (arrVal, othVal).
     *
     * **Note:** Unlike `_.pullAllWith`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     *
     * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }]
     */
    var differenceWith = baseRest(function(array, values) {
      var comparator = last(values);
      if (isArrayLikeObject(comparator)) {
        comparator = undefined$1;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined$1, comparator)
        : [];
    });

    /**
     * Creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function drop(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined$1) ? 1 : toInteger(n);
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRight([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function dropRight(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined$1) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.dropRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropRightWhile(users, ['active', false]);
     * // => objects for ['barney']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropRightWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true, true)
        : [];
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the beginning.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.dropWhile(users, function(o) { return !o.active; });
     * // => objects for ['pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropWhile(users, ['active', false]);
     * // => objects for ['pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true)
        : [];
    }

    /**
     * Fills elements of `array` with `value` from `start` up to, but not
     * including, `end`.
     *
     * **Note:** This method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Array
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.fill(array, 'a');
     * console.log(array);
     * // => ['a', 'a', 'a']
     *
     * _.fill(Array(3), 2);
     * // => [2, 2, 2]
     *
     * _.fill([4, 6, 8, 10], '*', 1, 3);
     * // => [4, '*', '*', 10]
     */
    function fill(array, value, start, end) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
        start = 0;
        end = length;
      }
      return baseFill(array, value, start, end);
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.findIndex(users, function(o) { return o.user == 'barney'; });
     * // => 0
     *
     * // The `_.matches` iteratee shorthand.
     * _.findIndex(users, { 'user': 'fred', 'active': false });
     * // => 1
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findIndex(users, ['active', false]);
     * // => 0
     *
     * // The `_.property` iteratee shorthand.
     * _.findIndex(users, 'active');
     * // => 2
     */
    function findIndex(array, predicate, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = fromIndex == null ? 0 : toInteger(fromIndex);
      if (index < 0) {
        index = nativeMax(length + index, 0);
      }
      return baseFindIndex(array, getIteratee(predicate, 3), index);
    }

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
     * // => 2
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
     * // => 0
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastIndex(users, ['active', false]);
     * // => 2
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastIndex(users, 'active');
     * // => 0
     */
    function findLastIndex(array, predicate, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = length - 1;
      if (fromIndex !== undefined$1) {
        index = toInteger(fromIndex);
        index = fromIndex < 0
          ? nativeMax(length + index, 0)
          : nativeMin(index, length - 1);
      }
      return baseFindIndex(array, getIteratee(predicate, 3), index, true);
    }

    /**
     * Flattens `array` a single level deep.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2, [3, [4]], 5]]);
     * // => [1, 2, [3, [4]], 5]
     */
    function flatten(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseFlatten(array, 1) : [];
    }

    /**
     * Recursively flattens `array`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flattenDeep([1, [2, [3, [4]], 5]]);
     * // => [1, 2, 3, 4, 5]
     */
    function flattenDeep(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseFlatten(array, INFINITY) : [];
    }

    /**
     * Recursively flatten `array` up to `depth` times.
     *
     * @static
     * @memberOf _
     * @since 4.4.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @param {number} [depth=1] The maximum recursion depth.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * var array = [1, [2, [3, [4]], 5]];
     *
     * _.flattenDepth(array, 1);
     * // => [1, 2, [3, [4]], 5]
     *
     * _.flattenDepth(array, 2);
     * // => [1, 2, 3, [4], 5]
     */
    function flattenDepth(array, depth) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      depth = depth === undefined$1 ? 1 : toInteger(depth);
      return baseFlatten(array, depth);
    }

    /**
     * The inverse of `_.toPairs`; this method returns an object composed
     * from key-value `pairs`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} pairs The key-value pairs.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.fromPairs([['a', 1], ['b', 2]]);
     * // => { 'a': 1, 'b': 2 }
     */
    function fromPairs(pairs) {
      var index = -1,
          length = pairs == null ? 0 : pairs.length,
          result = {};

      while (++index < length) {
        var pair = pairs[index];
        result[pair[0]] = pair[1];
      }
      return result;
    }

    /**
     * Gets the first element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @alias first
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the first element of `array`.
     * @example
     *
     * _.head([1, 2, 3]);
     * // => 1
     *
     * _.head([]);
     * // => undefined
     */
    function head(array) {
      return (array && array.length) ? array[0] : undefined$1;
    }

    /**
     * Gets the index at which the first occurrence of `value` is found in `array`
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it's used as the
     * offset from the end of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexOf([1, 2, 1, 2], 2);
     * // => 1
     *
     * // Search from the `fromIndex`.
     * _.indexOf([1, 2, 1, 2], 2, 2);
     * // => 3
     */
    function indexOf(array, value, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = fromIndex == null ? 0 : toInteger(fromIndex);
      if (index < 0) {
        index = nativeMax(length + index, 0);
      }
      return baseIndexOf(array, value, index);
    }

    /**
     * Gets all but the last element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */
    function initial(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseSlice(array, 0, -1) : [];
    }

    /**
     * Creates an array of unique values that are included in all given arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. The order and references of result values are
     * determined by the first array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersection([2, 1], [2, 3]);
     * // => [2]
     */
    var intersection = baseRest(function(arrays) {
      var mapped = arrayMap(arrays, castArrayLikeObject);
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped)
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `iteratee`
     * which is invoked for each element of each `arrays` to generate the criterion
     * by which they're compared. The order and references of result values are
     * determined by the first array. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [2.1]
     *
     * // The `_.property` iteratee shorthand.
     * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }]
     */
    var intersectionBy = baseRest(function(arrays) {
      var iteratee = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);

      if (iteratee === last(mapped)) {
        iteratee = undefined$1;
      } else {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, getIteratee(iteratee, 2))
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `comparator`
     * which is invoked to compare elements of `arrays`. The order and references
     * of result values are determined by the first array. The comparator is
     * invoked with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.intersectionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }]
     */
    var intersectionWith = baseRest(function(arrays) {
      var comparator = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);

      comparator = typeof comparator == 'function' ? comparator : undefined$1;
      if (comparator) {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, undefined$1, comparator)
        : [];
    });

    /**
     * Converts all elements in `array` into a string separated by `separator`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to convert.
     * @param {string} [separator=','] The element separator.
     * @returns {string} Returns the joined string.
     * @example
     *
     * _.join(['a', 'b', 'c'], '~');
     * // => 'a~b~c'
     */
    function join(array, separator) {
      return array == null ? '' : nativeJoin.call(array, separator);
    }

    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array) {
      var length = array == null ? 0 : array.length;
      return length ? array[length - 1] : undefined$1;
    }

    /**
     * This method is like `_.indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 1, 2], 2);
     * // => 3
     *
     * // Search from the `fromIndex`.
     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
     * // => 1
     */
    function lastIndexOf(array, value, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = length;
      if (fromIndex !== undefined$1) {
        index = toInteger(fromIndex);
        index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
      }
      return value === value
        ? strictLastIndexOf(array, value, index)
        : baseFindIndex(array, baseIsNaN, index, true);
    }

    /**
     * Gets the element at index `n` of `array`. If `n` is negative, the nth
     * element from the end is returned.
     *
     * @static
     * @memberOf _
     * @since 4.11.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=0] The index of the element to return.
     * @returns {*} Returns the nth element of `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'd'];
     *
     * _.nth(array, 1);
     * // => 'b'
     *
     * _.nth(array, -2);
     * // => 'c';
     */
    function nth(array, n) {
      return (array && array.length) ? baseNth(array, toInteger(n)) : undefined$1;
    }

    /**
     * Removes all given values from `array` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
     * to remove elements from an array by predicate.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...*} [values] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
     *
     * _.pull(array, 'a', 'c');
     * console.log(array);
     * // => ['b', 'b']
     */
    var pull = baseRest(pullAll);

    /**
     * This method is like `_.pull` except that it accepts an array of values to remove.
     *
     * **Note:** Unlike `_.difference`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
     *
     * _.pullAll(array, ['a', 'c']);
     * console.log(array);
     * // => ['b', 'b']
     */
    function pullAll(array, values) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values)
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `iteratee` which is
     * invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. The iteratee is invoked with one argument: (value).
     *
     * **Note:** Unlike `_.differenceBy`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
     *
     * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
     * console.log(array);
     * // => [{ 'x': 2 }]
     */
    function pullAllBy(array, values, iteratee) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, getIteratee(iteratee, 2))
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `comparator` which
     * is invoked to compare elements of `array` to `values`. The comparator is
     * invoked with two arguments: (arrVal, othVal).
     *
     * **Note:** Unlike `_.differenceWith`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
     *
     * _.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
     * console.log(array);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
     */
    function pullAllWith(array, values, comparator) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, undefined$1, comparator)
        : array;
    }

    /**
     * Removes elements from `array` corresponding to `indexes` and returns an
     * array of removed elements.
     *
     * **Note:** Unlike `_.at`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...(number|number[])} [indexes] The indexes of elements to remove.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = ['a', 'b', 'c', 'd'];
     * var pulled = _.pullAt(array, [1, 3]);
     *
     * console.log(array);
     * // => ['a', 'c']
     *
     * console.log(pulled);
     * // => ['b', 'd']
     */
    var pullAt = flatRest(function(array, indexes) {
      var length = array == null ? 0 : array.length,
          result = baseAt(array, indexes);

      basePullAt(array, arrayMap(indexes, function(index) {
        return isIndex(index, length) ? +index : index;
      }).sort(compareAscending));

      return result;
    });

    /**
     * Removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. The predicate is invoked
     * with three arguments: (value, index, array).
     *
     * **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
     * to pull elements from an array by value.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */
    function remove(array, predicate) {
      var result = [];
      if (!(array && array.length)) {
        return result;
      }
      var index = -1,
          indexes = [],
          length = array.length;

      predicate = getIteratee(predicate, 3);
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          indexes.push(index);
        }
      }
      basePullAt(array, indexes);
      return result;
    }

    /**
     * Reverses `array` so that the first element becomes the last, the second
     * element becomes the second to last, and so on.
     *
     * **Note:** This method mutates `array` and is based on
     * [`Array#reverse`](https://mdn.io/Array/reverse).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.reverse(array);
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function reverse(array) {
      return array == null ? array : nativeReverse.call(array);
    }

    /**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * **Note:** This method is used instead of
     * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
     * returned.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function slice(array, start, end) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
        start = 0;
        end = length;
      }
      else {
        start = start == null ? 0 : toInteger(start);
        end = end === undefined$1 ? length : toInteger(end);
      }
      return baseSlice(array, start, end);
    }

    /**
     * Uses a binary search to determine the lowest index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([30, 50], 40);
     * // => 1
     */
    function sortedIndex(array, value) {
      return baseSortedIndex(array, value);
    }

    /**
     * This method is like `_.sortedIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * var objects = [{ 'x': 4 }, { 'x': 5 }];
     *
     * _.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
     * // => 0
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedIndexBy(objects, { 'x': 4 }, 'x');
     * // => 0
     */
    function sortedIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee, 2));
    }

    /**
     * This method is like `_.indexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedIndexOf([4, 5, 5, 5, 6], 5);
     * // => 1
     */
    function sortedIndexOf(array, value) {
      var length = array == null ? 0 : array.length;
      if (length) {
        var index = baseSortedIndex(array, value);
        if (index < length && eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.sortedIndex` except that it returns the highest
     * index at which `value` should be inserted into `array` in order to
     * maintain its sort order.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedLastIndex([4, 5, 5, 5, 6], 5);
     * // => 4
     */
    function sortedLastIndex(array, value) {
      return baseSortedIndex(array, value, true);
    }

    /**
     * This method is like `_.sortedLastIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * var objects = [{ 'x': 4 }, { 'x': 5 }];
     *
     * _.sortedLastIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
     * // => 1
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedLastIndexBy(objects, { 'x': 4 }, 'x');
     * // => 1
     */
    function sortedLastIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee, 2), true);
    }

    /**
     * This method is like `_.lastIndexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedLastIndexOf([4, 5, 5, 5, 6], 5);
     * // => 3
     */
    function sortedLastIndexOf(array, value) {
      var length = array == null ? 0 : array.length;
      if (length) {
        var index = baseSortedIndex(array, value, true) - 1;
        if (eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.uniq` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniq([1, 1, 2]);
     * // => [1, 2]
     */
    function sortedUniq(array) {
      return (array && array.length)
        ? baseSortedUniq(array)
        : [];
    }

    /**
     * This method is like `_.uniqBy` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
     * // => [1.1, 2.3]
     */
    function sortedUniqBy(array, iteratee) {
      return (array && array.length)
        ? baseSortedUniq(array, getIteratee(iteratee, 2))
        : [];
    }

    /**
     * Gets all but the first element of `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.tail([1, 2, 3]);
     * // => [2, 3]
     */
    function tail(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseSlice(array, 1, length) : [];
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */
    function take(array, n, guard) {
      if (!(array && array.length)) {
        return [];
      }
      n = (guard || n === undefined$1) ? 1 : toInteger(n);
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRight([1, 2, 3]);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */
    function takeRight(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined$1) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with elements taken from the end. Elements are
     * taken until `predicate` returns falsey. The predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.takeRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeRightWhile(users, ['active', false]);
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeRightWhile(users, 'active');
     * // => []
     */
    function takeRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), false, true)
        : [];
    }

    /**
     * Creates a slice of `array` with elements taken from the beginning. Elements
     * are taken until `predicate` returns falsey. The predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.takeWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeWhile(users, ['active', false]);
     * // => objects for ['barney', 'fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeWhile(users, 'active');
     * // => []
     */
    function takeWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3))
        : [];
    }

    /**
     * Creates an array of unique values, in order, from all given arrays using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.union([2], [1, 2]);
     * // => [2, 1]
     */
    var union = baseRest(function(arrays) {
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
    });

    /**
     * This method is like `_.union` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by
     * which uniqueness is computed. Result values are chosen from the first
     * array in which the value occurs. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.unionBy([2.1], [1.2, 2.3], Math.floor);
     * // => [2.1, 1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    var unionBy = baseRest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined$1;
      }
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee, 2));
    });

    /**
     * This method is like `_.union` except that it accepts `comparator` which
     * is invoked to compare elements of `arrays`. Result values are chosen from
     * the first array in which the value occurs. The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.unionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var unionWith = baseRest(function(arrays) {
      var comparator = last(arrays);
      comparator = typeof comparator == 'function' ? comparator : undefined$1;
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined$1, comparator);
    });

    /**
     * Creates a duplicate-free version of an array, using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons, in which only the first occurrence of each element
     * is kept. The order of result values is determined by the order they occur
     * in the array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     */
    function uniq(array) {
      return (array && array.length) ? baseUniq(array) : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * uniqueness is computed. The order of result values is determined by the
     * order they occur in the array. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
     * // => [2.1, 1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniqBy(array, iteratee) {
      return (array && array.length) ? baseUniq(array, getIteratee(iteratee, 2)) : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `comparator` which
     * is invoked to compare elements of `array`. The order of result values is
     * determined by the order they occur in the array.The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.uniqWith(objects, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
     */
    function uniqWith(array, comparator) {
      comparator = typeof comparator == 'function' ? comparator : undefined$1;
      return (array && array.length) ? baseUniq(array, undefined$1, comparator) : [];
    }

    /**
     * This method is like `_.zip` except that it accepts an array of grouped
     * elements and creates an array regrouping the elements to their pre-zip
     * configuration.
     *
     * @static
     * @memberOf _
     * @since 1.2.0
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
     * // => [['a', 1, true], ['b', 2, false]]
     *
     * _.unzip(zipped);
     * // => [['a', 'b'], [1, 2], [true, false]]
     */
    function unzip(array) {
      if (!(array && array.length)) {
        return [];
      }
      var length = 0;
      array = arrayFilter(array, function(group) {
        if (isArrayLikeObject(group)) {
          length = nativeMax(group.length, length);
          return true;
        }
      });
      return baseTimes(length, function(index) {
        return arrayMap(array, baseProperty(index));
      });
    }

    /**
     * This method is like `_.unzip` except that it accepts `iteratee` to specify
     * how regrouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @param {Function} [iteratee=_.identity] The function to combine
     *  regrouped values.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
     * // => [[1, 10, 100], [2, 20, 200]]
     *
     * _.unzipWith(zipped, _.add);
     * // => [3, 30, 300]
     */
    function unzipWith(array, iteratee) {
      if (!(array && array.length)) {
        return [];
      }
      var result = unzip(array);
      if (iteratee == null) {
        return result;
      }
      return arrayMap(result, function(group) {
        return apply(iteratee, undefined$1, group);
      });
    }

    /**
     * Creates an array excluding all given values using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.pull`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...*} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.difference, _.xor
     * @example
     *
     * _.without([2, 1, 2, 3], 1, 2);
     * // => [3]
     */
    var without = baseRest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, values)
        : [];
    });

    /**
     * Creates an array of unique values that is the
     * [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
     * of the given arrays. The order of result values is determined by the order
     * they occur in the arrays.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.difference, _.without
     * @example
     *
     * _.xor([2, 1], [2, 3]);
     * // => [1, 3]
     */
    var xor = baseRest(function(arrays) {
      return baseXor(arrayFilter(arrays, isArrayLikeObject));
    });

    /**
     * This method is like `_.xor` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by
     * which by which they're compared. The order of result values is determined
     * by the order they occur in the arrays. The iteratee is invoked with one
     * argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.xorBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [1.2, 3.4]
     *
     * // The `_.property` iteratee shorthand.
     * _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var xorBy = baseRest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined$1;
      }
      return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee, 2));
    });

    /**
     * This method is like `_.xor` except that it accepts `comparator` which is
     * invoked to compare elements of `arrays`. The order of result values is
     * determined by the order they occur in the arrays. The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.xorWith(objects, others, _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var xorWith = baseRest(function(arrays) {
      var comparator = last(arrays);
      comparator = typeof comparator == 'function' ? comparator : undefined$1;
      return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined$1, comparator);
    });

    /**
     * Creates an array of grouped elements, the first of which contains the
     * first elements of the given arrays, the second of which contains the
     * second elements of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zip(['a', 'b'], [1, 2], [true, false]);
     * // => [['a', 1, true], ['b', 2, false]]
     */
    var zip = baseRest(unzip);

    /**
     * This method is like `_.fromPairs` except that it accepts two arrays,
     * one of property identifiers and one of corresponding values.
     *
     * @static
     * @memberOf _
     * @since 0.4.0
     * @category Array
     * @param {Array} [props=[]] The property identifiers.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObject(['a', 'b'], [1, 2]);
     * // => { 'a': 1, 'b': 2 }
     */
    function zipObject(props, values) {
      return baseZipObject(props || [], values || [], assignValue);
    }

    /**
     * This method is like `_.zipObject` except that it supports property paths.
     *
     * @static
     * @memberOf _
     * @since 4.1.0
     * @category Array
     * @param {Array} [props=[]] The property identifiers.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
     * // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
     */
    function zipObjectDeep(props, values) {
      return baseZipObject(props || [], values || [], baseSet);
    }

    /**
     * This method is like `_.zip` except that it accepts `iteratee` to specify
     * how grouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @param {Function} [iteratee=_.identity] The function to combine
     *  grouped values.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
     *   return a + b + c;
     * });
     * // => [111, 222]
     */
    var zipWith = baseRest(function(arrays) {
      var length = arrays.length,
          iteratee = length > 1 ? arrays[length - 1] : undefined$1;

      iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined$1;
      return unzipWith(arrays, iteratee);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` wrapper instance that wraps `value` with explicit method
     * chain sequences enabled. The result of such sequences must be unwrapped
     * with `_#value`.
     *
     * @static
     * @memberOf _
     * @since 1.3.0
     * @category Seq
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _
     *   .chain(users)
     *   .sortBy('age')
     *   .map(function(o) {
     *     return o.user + ' is ' + o.age;
     *   })
     *   .head()
     *   .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      var result = lodash(value);
      result.__chain__ = true;
      return result;
    }

    /**
     * This method invokes `interceptor` and returns `value`. The interceptor
     * is invoked with one argument; (value). The purpose of this method is to
     * "tap into" a method chain sequence in order to modify intermediate results.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) {
     *    // Mutate input array.
     *    array.pop();
     *  })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }

    /**
     * This method is like `_.tap` except that it returns the result of `interceptor`.
     * The purpose of this method is to "pass thru" values replacing intermediate
     * results in a method chain sequence.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns the result of `interceptor`.
     * @example
     *
     * _('  abc  ')
     *  .chain()
     *  .trim()
     *  .thru(function(value) {
     *    return [value];
     *  })
     *  .value();
     * // => ['abc']
     */
    function thru(value, interceptor) {
      return interceptor(value);
    }

    /**
     * This method is the wrapper version of `_.at`.
     *
     * @name at
     * @memberOf _
     * @since 1.0.0
     * @category Seq
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _(object).at(['a[0].b.c', 'a[1]']).value();
     * // => [3, 4]
     */
    var wrapperAt = flatRest(function(paths) {
      var length = paths.length,
          start = length ? paths[0] : 0,
          value = this.__wrapped__,
          interceptor = function(object) { return baseAt(object, paths); };

      if (length > 1 || this.__actions__.length ||
          !(value instanceof LazyWrapper) || !isIndex(start)) {
        return this.thru(interceptor);
      }
      value = value.slice(start, +start + (length ? 1 : 0));
      value.__actions__.push({
        'func': thru,
        'args': [interceptor],
        'thisArg': undefined$1
      });
      return new LodashWrapper(value, this.__chain__).thru(function(array) {
        if (length && !array.length) {
          array.push(undefined$1);
        }
        return array;
      });
    });

    /**
     * Creates a `lodash` wrapper instance with explicit method chain sequences enabled.
     *
     * @name chain
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // A sequence without explicit chaining.
     * _(users).head();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // A sequence with explicit chaining.
     * _(users)
     *   .chain()
     *   .head()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */
    function wrapperChain() {
      return chain(this);
    }

    /**
     * Executes the chain sequence and returns the wrapped result.
     *
     * @name commit
     * @memberOf _
     * @since 3.2.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).push(3);
     *
     * console.log(array);
     * // => [1, 2]
     *
     * wrapped = wrapped.commit();
     * console.log(array);
     * // => [1, 2, 3]
     *
     * wrapped.last();
     * // => 3
     *
     * console.log(array);
     * // => [1, 2, 3]
     */
    function wrapperCommit() {
      return new LodashWrapper(this.value(), this.__chain__);
    }

    /**
     * Gets the next value on a wrapped object following the
     * [iterator protocol](https://mdn.io/iteration_protocols#iterator).
     *
     * @name next
     * @memberOf _
     * @since 4.0.0
     * @category Seq
     * @returns {Object} Returns the next iterator value.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 1 }
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 2 }
     *
     * wrapped.next();
     * // => { 'done': true, 'value': undefined }
     */
    function wrapperNext() {
      if (this.__values__ === undefined$1) {
        this.__values__ = toArray(this.value());
      }
      var done = this.__index__ >= this.__values__.length,
          value = done ? undefined$1 : this.__values__[this.__index__++];

      return { 'done': done, 'value': value };
    }

    /**
     * Enables the wrapper to be iterable.
     *
     * @name Symbol.iterator
     * @memberOf _
     * @since 4.0.0
     * @category Seq
     * @returns {Object} Returns the wrapper object.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped[Symbol.iterator]() === wrapped;
     * // => true
     *
     * Array.from(wrapped);
     * // => [1, 2]
     */
    function wrapperToIterator() {
      return this;
    }

    /**
     * Creates a clone of the chain sequence planting `value` as the wrapped value.
     *
     * @name plant
     * @memberOf _
     * @since 3.2.0
     * @category Seq
     * @param {*} value The value to plant.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2]).map(square);
     * var other = wrapped.plant([3, 4]);
     *
     * other.value();
     * // => [9, 16]
     *
     * wrapped.value();
     * // => [1, 4]
     */
    function wrapperPlant(value) {
      var result,
          parent = this;

      while (parent instanceof baseLodash) {
        var clone = wrapperClone(parent);
        clone.__index__ = 0;
        clone.__values__ = undefined$1;
        if (result) {
          previous.__wrapped__ = clone;
        } else {
          result = clone;
        }
        var previous = clone;
        parent = parent.__wrapped__;
      }
      previous.__wrapped__ = value;
      return result;
    }

    /**
     * This method is the wrapper version of `_.reverse`.
     *
     * **Note:** This method mutates the wrapped array.
     *
     * @name reverse
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function wrapperReverse() {
      var value = this.__wrapped__;
      if (value instanceof LazyWrapper) {
        var wrapped = value;
        if (this.__actions__.length) {
          wrapped = new LazyWrapper(this);
        }
        wrapped = wrapped.reverse();
        wrapped.__actions__.push({
          'func': thru,
          'args': [reverse],
          'thisArg': undefined$1
        });
        return new LodashWrapper(wrapped, this.__chain__);
      }
      return this.thru(reverse);
    }

    /**
     * Executes the chain sequence to resolve the unwrapped value.
     *
     * @name value
     * @memberOf _
     * @since 0.1.0
     * @alias toJSON, valueOf
     * @category Seq
     * @returns {*} Returns the resolved unwrapped value.
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */
    function wrapperValue() {
      return baseWrapperValue(this.__wrapped__, this.__actions__);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The corresponding value of
     * each key is the number of times the key was returned by `iteratee`. The
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': 1, '6': 2 }
     *
     * // The `_.property` iteratee shorthand.
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        ++result[key];
      } else {
        baseAssignValue(result, key, 1);
      }
    });

    /**
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * Iteration is stopped once `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * **Note:** This method returns `true` for
     * [empty collections](https://en.wikipedia.org/wiki/Empty_set) because
     * [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of
     * elements of empty collections.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.every(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.every(users, 'active');
     * // => false
     */
    function every(collection, predicate, guard) {
      var func = isArray(collection) ? arrayEvery : baseEvery;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined$1;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. The predicate is invoked with three
     * arguments: (value, index|key, collection).
     *
     * **Note:** Unlike `_.remove`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @see _.reject
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.filter(users, { 'age': 36, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.filter(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.filter(users, 'active');
     * // => objects for ['barney']
     *
     * // Combining several predicates using `_.overEvery` or `_.overSome`.
     * _.filter(users, _.overSome([{ 'age': 36 }, ['age', 40]]));
     * // => objects for ['fred', 'barney']
     */
    function filter(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. The predicate is invoked with three
     * arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * _.find(users, function(o) { return o.age < 40; });
     * // => object for 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.find(users, { 'age': 1, 'active': true });
     * // => object for 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.find(users, ['active', false]);
     * // => object for 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.find(users, 'active');
     * // => object for 'barney'
     */
    var find = createFind(findIndex);

    /**
     * This method is like `_.find` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=collection.length-1] The index to search from.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(n) {
     *   return n % 2 == 1;
     * });
     * // => 3
     */
    var findLast = createFind(findLastIndex);

    /**
     * Creates a flattened array of values by running each element in `collection`
     * thru `iteratee` and flattening the mapped results. The iteratee is invoked
     * with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [n, n];
     * }
     *
     * _.flatMap([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMap(collection, iteratee) {
      return baseFlatten(map(collection, iteratee), 1);
    }

    /**
     * This method is like `_.flatMap` except that it recursively flattens the
     * mapped results.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [[[n, n]]];
     * }
     *
     * _.flatMapDeep([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMapDeep(collection, iteratee) {
      return baseFlatten(map(collection, iteratee), INFINITY);
    }

    /**
     * This method is like `_.flatMap` except that it recursively flattens the
     * mapped results up to `depth` times.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {number} [depth=1] The maximum recursion depth.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [[[n, n]]];
     * }
     *
     * _.flatMapDepth([1, 2], duplicate, 2);
     * // => [[1, 1], [2, 2]]
     */
    function flatMapDepth(collection, iteratee, depth) {
      depth = depth === undefined$1 ? 1 : toInteger(depth);
      return baseFlatten(map(collection, iteratee), depth);
    }

    /**
     * Iterates over elements of `collection` and invokes `iteratee` for each element.
     * The iteratee is invoked with three arguments: (value, index|key, collection).
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * **Note:** As with other "Collections" methods, objects with a "length"
     * property are iterated like arrays. To avoid this behavior use `_.forIn`
     * or `_.forOwn` for object iteration.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @alias each
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @see _.forEachRight
     * @example
     *
     * _.forEach([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => Logs `1` then `2`.
     *
     * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a' then 'b' (iteration order is not guaranteed).
     */
    function forEach(collection, iteratee) {
      var func = isArray(collection) ? arrayEach : baseEach;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.forEach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @alias eachRight
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @see _.forEach
     * @example
     *
     * _.forEachRight([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => Logs `2` then `1`.
     */
    function forEachRight(collection, iteratee) {
      var func = isArray(collection) ? arrayEachRight : baseEachRight;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The order of grouped values
     * is determined by the order they occur in `collection`. The corresponding
     * value of each key is an array of elements responsible for generating the
     * key. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': [4.2], '6': [6.1, 6.3] }
     *
     * // The `_.property` iteratee shorthand.
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        baseAssignValue(result, key, [value]);
      }
    });

    /**
     * Checks if `value` is in `collection`. If `collection` is a string, it's
     * checked for a substring of `value`, otherwise
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * is used for equality comparisons. If `fromIndex` is negative, it's used as
     * the offset from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {boolean} Returns `true` if `value` is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'a': 1, 'b': 2 }, 1);
     * // => true
     *
     * _.includes('abcd', 'bc');
     * // => true
     */
    function includes(collection, value, fromIndex, guard) {
      collection = isArrayLike(collection) ? collection : values(collection);
      fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

      var length = collection.length;
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return isString(collection)
        ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
        : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
    }

    /**
     * Invokes the method at `path` of each element in `collection`, returning
     * an array of the results of each invoked method. Any additional arguments
     * are provided to each invoked method. If `path` is a function, it's invoked
     * for, and `this` bound to, each element in `collection`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|string} path The path of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] The arguments to invoke each method with.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invokeMap([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    var invokeMap = baseRest(function(collection, path, args) {
      var index = -1,
          isFunc = typeof path == 'function',
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value) {
        result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
      });
      return result;
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The corresponding value of
     * each key is the last element responsible for generating the key. The
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var array = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.keyBy(array, function(o) {
     *   return String.fromCharCode(o.code);
     * });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.keyBy(array, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     */
    var keyBy = createAggregator(function(result, value, key) {
      baseAssignValue(result, key, value);
    });

    /**
     * Creates an array of values by running each element in `collection` thru
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
     *
     * The guarded methods are:
     * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
     * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
     * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
     * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * _.map([4, 8], square);
     * // => [16, 64]
     *
     * _.map({ 'a': 4, 'b': 8 }, square);
     * // => [16, 64] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // The `_.property` iteratee shorthand.
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */
    function map(collection, iteratee) {
      var func = isArray(collection) ? arrayMap : baseMap;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.sortBy` except that it allows specifying the sort
     * orders of the iteratees to sort by. If `orders` is unspecified, all values
     * are sorted in ascending order. Otherwise, specify an order of "desc" for
     * descending or "asc" for ascending sort order of corresponding values.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array[]|Function[]|Object[]|string[]} [iteratees=[_.identity]]
     *  The iteratees to sort by.
     * @param {string[]} [orders] The sort orders of `iteratees`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 40 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // Sort by `user` in ascending order and by `age` in descending order.
     * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
     */
    function orderBy(collection, iteratees, orders, guard) {
      if (collection == null) {
        return [];
      }
      if (!isArray(iteratees)) {
        iteratees = iteratees == null ? [] : [iteratees];
      }
      orders = guard ? undefined$1 : orders;
      if (!isArray(orders)) {
        orders = orders == null ? [] : [orders];
      }
      return baseOrderBy(collection, iteratees, orders);
    }

    /**
     * Creates an array of elements split into two groups, the first of which
     * contains elements `predicate` returns truthy for, the second of which
     * contains elements `predicate` returns falsey for. The predicate is
     * invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * _.partition(users, function(o) { return o.active; });
     * // => objects for [['fred'], ['barney', 'pebbles']]
     *
     * // The `_.matches` iteratee shorthand.
     * _.partition(users, { 'age': 1, 'active': false });
     * // => objects for [['pebbles'], ['barney', 'fred']]
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.partition(users, ['active', false]);
     * // => objects for [['barney', 'pebbles'], ['fred']]
     *
     * // The `_.property` iteratee shorthand.
     * _.partition(users, 'active');
     * // => objects for [['fred'], ['barney', 'pebbles']]
     */
    var partition = createAggregator(function(result, value, key) {
      result[key ? 0 : 1].push(value);
    }, function() { return [[], []]; });

    /**
     * Reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` thru `iteratee`, where each successive
     * invocation is supplied the return value of the previous. If `accumulator`
     * is not given, the first element of `collection` is used as the initial
     * value. The iteratee is invoked with four arguments:
     * (accumulator, value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.reduce`, `_.reduceRight`, and `_.transform`.
     *
     * The guarded methods are:
     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
     * and `sortBy`
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @see _.reduceRight
     * @example
     *
     * _.reduce([1, 2], function(sum, n) {
     *   return sum + n;
     * }, 0);
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     *   return result;
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
     */
    function reduce(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduce : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
    }

    /**
     * This method is like `_.reduce` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @see _.reduce
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     *
     * _.reduceRight(array, function(flattened, other) {
     *   return flattened.concat(other);
     * }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduceRight : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
    }

    /**
     * The opposite of `_.filter`; this method returns the elements of `collection`
     * that `predicate` does **not** return truthy for.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @see _.filter
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * _.reject(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.reject(users, { 'age': 40, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.reject(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.reject(users, 'active');
     * // => objects for ['barney']
     */
    function reject(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, negate(getIteratee(predicate, 3)));
    }

    /**
     * Gets a random element from `collection`.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @returns {*} Returns the random element.
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     */
    function sample(collection) {
      var func = isArray(collection) ? arraySample : baseSample;
      return func(collection);
    }

    /**
     * Gets `n` random elements at unique keys from `collection` up to the
     * size of `collection`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @param {number} [n=1] The number of elements to sample.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the random elements.
     * @example
     *
     * _.sampleSize([1, 2, 3], 2);
     * // => [3, 1]
     *
     * _.sampleSize([1, 2, 3], 4);
     * // => [2, 3, 1]
     */
    function sampleSize(collection, n, guard) {
      if ((guard ? isIterateeCall(collection, n, guard) : n === undefined$1)) {
        n = 1;
      } else {
        n = toInteger(n);
      }
      var func = isArray(collection) ? arraySampleSize : baseSampleSize;
      return func(collection, n);
    }

    /**
     * Creates an array of shuffled values, using a version of the
     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */
    function shuffle(collection) {
      var func = isArray(collection) ? arrayShuffle : baseShuffle;
      return func(collection);
    }

    /**
     * Gets the size of `collection` by returning its length for array-like
     * values or the number of own enumerable string keyed properties for objects.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns the collection size.
     * @example
     *
     * _.size([1, 2, 3]);
     * // => 3
     *
     * _.size({ 'a': 1, 'b': 2 });
     * // => 2
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      if (collection == null) {
        return 0;
      }
      if (isArrayLike(collection)) {
        return isString(collection) ? stringSize(collection) : collection.length;
      }
      var tag = getTag(collection);
      if (tag == mapTag || tag == setTag) {
        return collection.size;
      }
      return baseKeys(collection).length;
    }

    /**
     * Checks if `predicate` returns truthy for **any** element of `collection`.
     * Iteration is stopped once `predicate` returns truthy. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'active': true },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.some(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.some(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.some(users, 'active');
     * // => true
     */
    function some(collection, predicate, guard) {
      var func = isArray(collection) ? arraySome : baseSome;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined$1;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection thru each iteratee. This method
     * performs a stable sort, that is, it preserves the original sort order of
     * equal elements. The iteratees are invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {...(Function|Function[])} [iteratees=[_.identity]]
     *  The iteratees to sort by.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 30 },
     *   { 'user': 'barney', 'age': 34 }
     * ];
     *
     * _.sortBy(users, [function(o) { return o.user; }]);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 30]]
     *
     * _.sortBy(users, ['user', 'age']);
     * // => objects for [['barney', 34], ['barney', 36], ['fred', 30], ['fred', 48]]
     */
    var sortBy = baseRest(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var length = iteratees.length;
      if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
        iteratees = [];
      } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
        iteratees = [iteratees[0]];
      }
      return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Gets the timestamp of the number of milliseconds that have elapsed since
     * the Unix epoch (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Date
     * @returns {number} Returns the timestamp.
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => Logs the number of milliseconds it took for the deferred invocation.
     */
    var now = ctxNow || function() {
      return root.Date.now();
    };

    /*------------------------------------------------------------------------*/

    /**
     * The opposite of `_.before`; this method creates a function that invokes
     * `func` once it's called `n` or more times.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {number} n The number of calls before `func` is invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => Logs 'done saving!' after the two async saves have completed.
     */
    function after(n, func) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that invokes `func`, with up to `n` arguments,
     * ignoring any additional arguments.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @param {number} [n=func.length] The arity cap.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new capped function.
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
     * // => [6, 8, 10]
     */
    function ary(func, n, guard) {
      n = guard ? undefined$1 : n;
      n = (func && n == null) ? func.length : n;
      return createWrap(func, WRAP_ARY_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, n);
    }

    /**
     * Creates a function that invokes `func`, with the `this` binding and arguments
     * of the created function, while it's called less than `n` times. Subsequent
     * calls to the created function return the result of the last `func` invocation.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {number} n The number of calls at which `func` is no longer invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * jQuery(element).on('click', _.before(5, addContactToList));
     * // => Allows adding up to 4 contacts to the list.
     */
    function before(n, func) {
      var result;
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = undefined$1;
        }
        return result;
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and `partials` prepended to the arguments it receives.
     *
     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for partially applied arguments.
     *
     * **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
     * property of bound functions.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * function greet(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * }
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */
    var bind = baseRest(function(func, thisArg, partials) {
      var bitmask = WRAP_BIND_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getHolder(bind));
        bitmask |= WRAP_PARTIAL_FLAG;
      }
      return createWrap(func, bitmask, thisArg, partials, holders);
    });

    /**
     * Creates a function that invokes the method at `object[key]` with `partials`
     * prepended to the arguments it receives.
     *
     * This method differs from `_.bind` by allowing bound functions to reference
     * methods that may be redefined or don't yet exist. See
     * [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * @static
     * @memberOf _
     * @since 0.10.0
     * @category Function
     * @param {Object} object The object to invoke the method on.
     * @param {string} key The key of the method.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindKey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bindKey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */
    var bindKey = baseRest(function(object, key, partials) {
      var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getHolder(bindKey));
        bitmask |= WRAP_PARTIAL_FLAG;
      }
      return createWrap(key, bitmask, object, partials, holders);
    });

    /**
     * Creates a function that accepts arguments of `func` and either invokes
     * `func` returning its result, if at least `arity` number of arguments have
     * been provided, or returns a function that accepts the remaining `func`
     * arguments, and so on. The arity of `func` may be specified if `func.length`
     * is not sufficient.
     *
     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */
    function curry(func, arity, guard) {
      arity = guard ? undefined$1 : arity;
      var result = createWrap(func, WRAP_CURRY_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, undefined$1, arity);
      result.placeholder = curry.placeholder;
      return result;
    }

    /**
     * This method is like `_.curry` except that arguments are applied to `func`
     * in the manner of `_.partialRight` instead of `_.partial`.
     *
     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryRight(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */
    function curryRight(func, arity, guard) {
      arity = guard ? undefined$1 : arity;
      var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, undefined$1, arity);
      result.placeholder = curryRight.placeholder;
      return result;
    }

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed `func` invocations and a `flush` method to immediately invoke them.
     * Provide `options` to indicate whether `func` should be invoked on the
     * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
     * with the last arguments provided to the debounced function. Subsequent
     * calls to the debounced function return the result of the last `func`
     * invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the debounced function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=false]
     *  Specify invoking on the leading edge of the timeout.
     * @param {number} [options.maxWait]
     *  The maximum time `func` is allowed to be delayed before it's invoked.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // Avoid costly calculations while the window size is in flux.
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
     * jQuery(element).on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', debounced);
     *
     * // Cancel the trailing debounced invocation.
     * jQuery(window).on('popstate', debounced.cancel);
     */
    function debounce(func, wait, options) {
      var lastArgs,
          lastThis,
          maxWait,
          result,
          timerId,
          lastCallTime,
          lastInvokeTime = 0,
          leading = false,
          maxing = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = toNumber(wait) || 0;
      if (isObject(options)) {
        leading = !!options.leading;
        maxing = 'maxWait' in options;
        maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function invokeFunc(time) {
        var args = lastArgs,
            thisArg = lastThis;

        lastArgs = lastThis = undefined$1;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
      }

      function leadingEdge(time) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = setTimeout(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
      }

      function remainingWait(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime,
            timeWaiting = wait - timeSinceLastCall;

        return maxing
          ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
          : timeWaiting;
      }

      function shouldInvoke(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime;

        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (lastCallTime === undefined$1 || (timeSinceLastCall >= wait) ||
          (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
      }

      function timerExpired() {
        var time = now();
        if (shouldInvoke(time)) {
          return trailingEdge(time);
        }
        // Restart the timer.
        timerId = setTimeout(timerExpired, remainingWait(time));
      }

      function trailingEdge(time) {
        timerId = undefined$1;

        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) {
          return invokeFunc(time);
        }
        lastArgs = lastThis = undefined$1;
        return result;
      }

      function cancel() {
        if (timerId !== undefined$1) {
          clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined$1;
      }

      function flush() {
        return timerId === undefined$1 ? result : trailingEdge(now());
      }

      function debounced() {
        var time = now(),
            isInvoking = shouldInvoke(time);

        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
          if (timerId === undefined$1) {
            return leadingEdge(lastCallTime);
          }
          if (maxing) {
            // Handle invocations in a tight loop.
            clearTimeout(timerId);
            timerId = setTimeout(timerExpired, wait);
            return invokeFunc(lastCallTime);
          }
        }
        if (timerId === undefined$1) {
          timerId = setTimeout(timerExpired, wait);
        }
        return result;
      }
      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
    }

    /**
     * Defers invoking the `func` until the current call stack has cleared. Any
     * additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to defer.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) {
     *   console.log(text);
     * }, 'deferred');
     * // => Logs 'deferred' after one millisecond.
     */
    var defer = baseRest(function(func, args) {
      return baseDelay(func, 1, args);
    });

    /**
     * Invokes `func` after `wait` milliseconds. Any additional arguments are
     * provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) {
     *   console.log(text);
     * }, 1000, 'later');
     * // => Logs 'later' after one second.
     */
    var delay = baseRest(function(func, wait, args) {
      return baseDelay(func, toNumber(wait) || 0, args);
    });

    /**
     * Creates a function that invokes `func` with arguments reversed.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to flip arguments for.
     * @returns {Function} Returns the new flipped function.
     * @example
     *
     * var flipped = _.flip(function() {
     *   return _.toArray(arguments);
     * });
     *
     * flipped('a', 'b', 'c', 'd');
     * // => ['d', 'c', 'b', 'a']
     */
    function flip(func) {
      return createWrap(func, WRAP_FLIP_FLAG);
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided, it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is used as the map cache key. The `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the
     * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `clear`, `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoized function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // Modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // Replace `_.memoize.Cache`.
     * _.memoize.Cache = WeakMap;
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result) || cache;
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache);
      return memoized;
    }

    // Expose `MapCache`.
    memoize.Cache = MapCache;

    /**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new negated function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */
    function negate(predicate) {
      if (typeof predicate != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function() {
        var args = arguments;
        switch (args.length) {
          case 0: return !predicate.call(this);
          case 1: return !predicate.call(this, args[0]);
          case 2: return !predicate.call(this, args[0], args[1]);
          case 3: return !predicate.call(this, args[0], args[1], args[2]);
        }
        return !predicate.apply(this, args);
      };
    }

    /**
     * Creates a function that is restricted to invoking `func` once. Repeat calls
     * to the function return the value of the first invocation. The `func` is
     * invoked with the `this` binding and arguments of the created function.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // => `createApplication` is invoked once
     */
    function once(func) {
      return before(2, func);
    }

    /**
     * Creates a function that invokes `func` with its arguments transformed.
     *
     * @static
     * @since 4.0.0
     * @memberOf _
     * @category Function
     * @param {Function} func The function to wrap.
     * @param {...(Function|Function[])} [transforms=[_.identity]]
     *  The argument transforms.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function doubled(n) {
     *   return n * 2;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var func = _.overArgs(function(x, y) {
     *   return [x, y];
     * }, [square, doubled]);
     *
     * func(9, 3);
     * // => [81, 6]
     *
     * func(10, 5);
     * // => [100, 10]
     */
    var overArgs = castRest(function(func, transforms) {
      transforms = (transforms.length == 1 && isArray(transforms[0]))
        ? arrayMap(transforms[0], baseUnary(getIteratee()))
        : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));

      var funcsLength = transforms.length;
      return baseRest(function(args) {
        var index = -1,
            length = nativeMin(args.length, funcsLength);

        while (++index < length) {
          args[index] = transforms[index].call(this, args[index]);
        }
        return apply(func, this, args);
      });
    });

    /**
     * Creates a function that invokes `func` with `partials` prepended to the
     * arguments it receives. This method is like `_.bind` except it does **not**
     * alter the `this` binding.
     *
     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @since 0.2.0
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * function greet(greeting, name) {
     *   return greeting + ' ' + name;
     * }
     *
     * var sayHelloTo = _.partial(greet, 'hello');
     * sayHelloTo('fred');
     * // => 'hello fred'
     *
     * // Partially applied with placeholders.
     * var greetFred = _.partial(greet, _, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     */
    var partial = baseRest(function(func, partials) {
      var holders = replaceHolders(partials, getHolder(partial));
      return createWrap(func, WRAP_PARTIAL_FLAG, undefined$1, partials, holders);
    });

    /**
     * This method is like `_.partial` except that partially applied arguments
     * are appended to the arguments it receives.
     *
     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * function greet(greeting, name) {
     *   return greeting + ' ' + name;
     * }
     *
     * var greetFred = _.partialRight(greet, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     *
     * // Partially applied with placeholders.
     * var sayHelloTo = _.partialRight(greet, 'hello', _);
     * sayHelloTo('fred');
     * // => 'hello fred'
     */
    var partialRight = baseRest(function(func, partials) {
      var holders = replaceHolders(partials, getHolder(partialRight));
      return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined$1, partials, holders);
    });

    /**
     * Creates a function that invokes `func` with arguments arranged according
     * to the specified `indexes` where the argument value at the first index is
     * provided as the first argument, the argument value at the second index is
     * provided as the second argument, and so on.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to rearrange arguments for.
     * @param {...(number|number[])} indexes The arranged argument indexes.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, [2, 0, 1]);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     */
    var rearg = flatRest(function(func, indexes) {
      return createWrap(func, WRAP_REARG_FLAG, undefined$1, undefined$1, undefined$1, indexes);
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * created function and arguments from `start` and beyond provided as
     * an array.
     *
     * **Note:** This method is based on the
     * [rest parameter](https://mdn.io/rest_parameters).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.rest(function(what, names) {
     *   return what + ' ' + _.initial(names).join(', ') +
     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
     * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */
    function rest(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = start === undefined$1 ? start : toInteger(start);
      return baseRest(func, start);
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * create function and an array of arguments much like
     * [`Function#apply`](http://www.ecma-international.org/ecma-262/7.0/#sec-function.prototype.apply).
     *
     * **Note:** This method is based on the
     * [spread operator](https://mdn.io/spread_operator).
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Function
     * @param {Function} func The function to spread arguments over.
     * @param {number} [start=0] The start position of the spread.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.spread(function(who, what) {
     *   return who + ' says ' + what;
     * });
     *
     * say(['fred', 'hello']);
     * // => 'fred says hello'
     *
     * var numbers = Promise.all([
     *   Promise.resolve(40),
     *   Promise.resolve(36)
     * ]);
     *
     * numbers.then(_.spread(function(x, y) {
     *   return x + y;
     * }));
     * // => a Promise of 76
     */
    function spread(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = start == null ? 0 : nativeMax(toInteger(start), 0);
      return baseRest(function(args) {
        var array = args[start],
            otherArgs = castSlice(args, 0, start);

        if (array) {
          arrayPush(otherArgs, array);
        }
        return apply(func, this, otherArgs);
      });
    }

    /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed `func` invocations and a `flush` method to
     * immediately invoke them. Provide `options` to indicate whether `func`
     * should be invoked on the leading and/or trailing edge of the `wait`
     * timeout. The `func` is invoked with the last arguments provided to the
     * throttled function. Subsequent calls to the throttled function return the
     * result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the throttled function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=true]
     *  Specify invoking on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // Avoid excessively updating the position while scrolling.
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
     * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
     * jQuery(element).on('click', throttled);
     *
     * // Cancel the trailing throttled invocation.
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, {
        'leading': leading,
        'maxWait': wait,
        'trailing': trailing
      });
    }

    /**
     * Creates a function that accepts up to one argument, ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     * @example
     *
     * _.map(['6', '8', '10'], _.unary(parseInt));
     * // => [6, 8, 10]
     */
    function unary(func) {
      return ary(func, 1);
    }

    /**
     * Creates a function that provides `value` to `wrapper` as its first
     * argument. Any additional arguments provided to the function are appended
     * to those provided to the `wrapper`. The wrapper is invoked with the `this`
     * binding of the created function.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {*} value The value to wrap.
     * @param {Function} [wrapper=identity] The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */
    function wrap(value, wrapper) {
      return partial(castFunction(wrapper), value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Casts `value` as an array if it's not one.
     *
     * @static
     * @memberOf _
     * @since 4.4.0
     * @category Lang
     * @param {*} value The value to inspect.
     * @returns {Array} Returns the cast array.
     * @example
     *
     * _.castArray(1);
     * // => [1]
     *
     * _.castArray({ 'a': 1 });
     * // => [{ 'a': 1 }]
     *
     * _.castArray('abc');
     * // => ['abc']
     *
     * _.castArray(null);
     * // => [null]
     *
     * _.castArray(undefined);
     * // => [undefined]
     *
     * _.castArray();
     * // => []
     *
     * var array = [1, 2, 3];
     * console.log(_.castArray(array) === array);
     * // => true
     */
    function castArray() {
      if (!arguments.length) {
        return [];
      }
      var value = arguments[0];
      return isArray(value) ? value : [value];
    }

    /**
     * Creates a shallow clone of `value`.
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
     * and supports cloning arrays, array buffers, booleans, date objects, maps,
     * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
     * arrays. The own enumerable properties of `arguments` objects are cloned
     * as plain objects. An empty object is returned for uncloneable values such
     * as error objects, functions, DOM nodes, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to clone.
     * @returns {*} Returns the cloned value.
     * @see _.cloneDeep
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var shallow = _.clone(objects);
     * console.log(shallow[0] === objects[0]);
     * // => true
     */
    function clone(value) {
      return baseClone(value, CLONE_SYMBOLS_FLAG);
    }

    /**
     * This method is like `_.clone` except that it accepts `customizer` which
     * is invoked to produce the cloned value. If `customizer` returns `undefined`,
     * cloning is handled by the method instead. The `customizer` is invoked with
     * up to four arguments; (value [, index|key, object, stack]).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the cloned value.
     * @see _.cloneDeepWith
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(false);
     *   }
     * }
     *
     * var el = _.cloneWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 0
     */
    function cloneWith(value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined$1;
      return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
    }

    /**
     * This method is like `_.clone` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @returns {*} Returns the deep cloned value.
     * @see _.clone
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var deep = _.cloneDeep(objects);
     * console.log(deep[0] === objects[0]);
     * // => false
     */
    function cloneDeep(value) {
      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
    }

    /**
     * This method is like `_.cloneWith` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the deep cloned value.
     * @see _.cloneWith
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(true);
     *   }
     * }
     *
     * var el = _.cloneDeepWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 20
     */
    function cloneDeepWith(value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined$1;
      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
    }

    /**
     * Checks if `object` conforms to `source` by invoking the predicate
     * properties of `source` with the corresponding property values of `object`.
     *
     * **Note:** This method is equivalent to `_.conforms` when `source` is
     * partially applied.
     *
     * @static
     * @memberOf _
     * @since 4.14.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property predicates to conform to.
     * @returns {boolean} Returns `true` if `object` conforms, else `false`.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     *
     * _.conformsTo(object, { 'b': function(n) { return n > 1; } });
     * // => true
     *
     * _.conformsTo(object, { 'b': function(n) { return n > 2; } });
     * // => false
     */
    function conformsTo(object, source) {
      return source == null || baseConformsTo(object, source, keys(source));
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Checks if `value` is greater than `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`,
     *  else `false`.
     * @see _.lt
     * @example
     *
     * _.gt(3, 1);
     * // => true
     *
     * _.gt(3, 3);
     * // => false
     *
     * _.gt(1, 3);
     * // => false
     */
    var gt = createRelationalOperation(baseGt);

    /**
     * Checks if `value` is greater than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than or equal to
     *  `other`, else `false`.
     * @see _.lte
     * @example
     *
     * _.gte(3, 1);
     * // => true
     *
     * _.gte(3, 3);
     * // => true
     *
     * _.gte(1, 3);
     * // => false
     */
    var gte = createRelationalOperation(function(value, other) {
      return value >= other;
    });

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
        !propertyIsEnumerable.call(value, 'callee');
    };

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * Checks if `value` is classified as an `ArrayBuffer` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
     * @example
     *
     * _.isArrayBuffer(new ArrayBuffer(2));
     * // => true
     *
     * _.isArrayBuffer(new Array(2));
     * // => false
     */
    var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    /**
     * This method is like `_.isArrayLike` except that it also checks if `value`
     * is an object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array-like object,
     *  else `false`.
     * @example
     *
     * _.isArrayLikeObject([1, 2, 3]);
     * // => true
     *
     * _.isArrayLikeObject(document.body.children);
     * // => true
     *
     * _.isArrayLikeObject('abc');
     * // => false
     *
     * _.isArrayLikeObject(_.noop);
     * // => false
     */
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false ||
        (isObjectLike(value) && baseGetTag(value) == boolTag);
    }

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse;

    /**
     * Checks if `value` is classified as a `Date` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Mon April 23 2012');
     * // => false
     */
    var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;

    /**
     * Checks if `value` is likely a DOM element.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */
    function isElement(value) {
      return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
    }

    /**
     * Checks if `value` is an empty object, collection, map, or set.
     *
     * Objects are considered empty if they have no own enumerable string keyed
     * properties.
     *
     * Array-like values such as `arguments` objects, arrays, buffers, strings, or
     * jQuery-like collections are considered empty if they have a `length` of `0`.
     * Similarly, maps and sets are considered empty if they have a `size` of `0`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */
    function isEmpty(value) {
      if (value == null) {
        return true;
      }
      if (isArrayLike(value) &&
          (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
            isBuffer(value) || isTypedArray(value) || isArguments(value))) {
        return !value.length;
      }
      var tag = getTag(value);
      if (tag == mapTag || tag == setTag) {
        return !value.size;
      }
      if (isPrototype(value)) {
        return !baseKeys(value).length;
      }
      for (var key in value) {
        if (hasOwnProperty.call(value, key)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent.
     *
     * **Note:** This method supports comparing arrays, array buffers, booleans,
     * date objects, error objects, maps, numbers, `Object` objects, regexes,
     * sets, strings, symbols, and typed arrays. `Object` objects are compared
     * by their own, not inherited, enumerable properties. Functions and DOM
     * nodes are compared by strict equality, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.isEqual(object, other);
     * // => true
     *
     * object === other;
     * // => false
     */
    function isEqual(value, other) {
      return baseIsEqual(value, other);
    }

    /**
     * This method is like `_.isEqual` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
     * are handled by the method instead. The `customizer` is invoked with up to
     * six arguments: (objValue, othValue [, index|key, object, other, stack]).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, othValue) {
     *   if (isGreeting(objValue) && isGreeting(othValue)) {
     *     return true;
     *   }
     * }
     *
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqualWith(array, other, customizer);
     * // => true
     */
    function isEqualWith(value, other, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined$1;
      var result = customizer ? customizer(value, other) : undefined$1;
      return result === undefined$1 ? baseIsEqual(value, other, undefined$1, customizer) : !!result;
    }

    /**
     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
     * `SyntaxError`, `TypeError`, or `URIError` object.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
     * @example
     *
     * _.isError(new Error);
     * // => true
     *
     * _.isError(Error);
     * // => false
     */
    function isError(value) {
      if (!isObjectLike(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == errorTag || tag == domExcTag ||
        (typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value));
    }

    /**
     * Checks if `value` is a finite primitive number.
     *
     * **Note:** This method is based on
     * [`Number.isFinite`](https://mdn.io/Number/isFinite).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
     * @example
     *
     * _.isFinite(3);
     * // => true
     *
     * _.isFinite(Number.MIN_VALUE);
     * // => true
     *
     * _.isFinite(Infinity);
     * // => false
     *
     * _.isFinite('3');
     * // => false
     */
    function isFinite(value) {
      return typeof value == 'number' && nativeIsFinite(value);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    /**
     * Checks if `value` is an integer.
     *
     * **Note:** This method is based on
     * [`Number.isInteger`](https://mdn.io/Number/isInteger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
     * @example
     *
     * _.isInteger(3);
     * // => true
     *
     * _.isInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isInteger(Infinity);
     * // => false
     *
     * _.isInteger('3');
     * // => false
     */
    function isInteger(value) {
      return typeof value == 'number' && value == toInteger(value);
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    /**
     * Checks if `value` is classified as a `Map` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     * @example
     *
     * _.isMap(new Map);
     * // => true
     *
     * _.isMap(new WeakMap);
     * // => false
     */
    var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

    /**
     * Performs a partial deep comparison between `object` and `source` to
     * determine if `object` contains equivalent property values.
     *
     * **Note:** This method is equivalent to `_.matches` when `source` is
     * partially applied.
     *
     * Partial comparisons will match empty array and empty object `source`
     * values against any array or object value, respectively. See `_.isEqual`
     * for a list of supported value comparisons.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     *
     * _.isMatch(object, { 'b': 2 });
     * // => true
     *
     * _.isMatch(object, { 'b': 1 });
     * // => false
     */
    function isMatch(object, source) {
      return object === source || baseIsMatch(object, source, getMatchData(source));
    }

    /**
     * This method is like `_.isMatch` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
     * are handled by the method instead. The `customizer` is invoked with five
     * arguments: (objValue, srcValue, index|key, object, source).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, srcValue) {
     *   if (isGreeting(objValue) && isGreeting(srcValue)) {
     *     return true;
     *   }
     * }
     *
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.isMatchWith(object, source, customizer);
     * // => true
     */
    function isMatchWith(object, source, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined$1;
      return baseIsMatch(object, source, getMatchData(source), customizer);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * **Note:** This method is based on
     * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
     * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
     * `undefined` and other non-number values.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // An `NaN` primitive is the only value that is not equal to itself.
      // Perform the `toStringTag` check first to avoid errors with some
      // ActiveX objects in IE.
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is a pristine native function.
     *
     * **Note:** This method can't reliably detect native functions in the presence
     * of the core-js package because core-js circumvents this kind of detection.
     * Despite multiple requests, the core-js maintainer has made it clear: any
     * attempt to fix the detection will be obstructed. As a result, we're left
     * with little choice but to throw an error. Unfortunately, this also affects
     * packages, like [babel-polyfill](https://www.npmjs.com/package/babel-polyfill),
     * which rely on core-js.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */
    function isNative(value) {
      if (isMaskable(value)) {
        throw new Error(CORE_ERROR_TEXT);
      }
      return baseIsNative(value);
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is `null` or `undefined`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
     * @example
     *
     * _.isNil(null);
     * // => true
     *
     * _.isNil(void 0);
     * // => true
     *
     * _.isNil(NaN);
     * // => false
     */
    function isNil(value) {
      return value == null;
    }

    /**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
     * classified as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a number, else `false`.
     * @example
     *
     * _.isNumber(3);
     * // => true
     *
     * _.isNumber(Number.MIN_VALUE);
     * // => true
     *
     * _.isNumber(Infinity);
     * // => true
     *
     * _.isNumber('3');
     * // => false
     */
    function isNumber(value) {
      return typeof value == 'number' ||
        (isObjectLike(value) && baseGetTag(value) == numberTag);
    }

    /**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * @static
     * @memberOf _
     * @since 0.8.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    function isPlainObject(value) {
      if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
      return typeof Ctor == 'function' && Ctor instanceof Ctor &&
        funcToString.call(Ctor) == objectCtorString;
    }

    /**
     * Checks if `value` is classified as a `RegExp` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */
    var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;

    /**
     * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
     * double precision number which isn't the result of a rounded unsafe integer.
     *
     * **Note:** This method is based on
     * [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
     * @example
     *
     * _.isSafeInteger(3);
     * // => true
     *
     * _.isSafeInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isSafeInteger(Infinity);
     * // => false
     *
     * _.isSafeInteger('3');
     * // => false
     */
    function isSafeInteger(value) {
      return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is classified as a `Set` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     * @example
     *
     * _.isSet(new Set);
     * // => true
     *
     * _.isSet(new WeakSet);
     * // => false
     */
    var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

    /**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a string, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString(value) {
      return typeof value == 'string' ||
        (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
    }

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && baseGetTag(value) == symbolTag);
    }

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */
    function isUndefined(value) {
      return value === undefined$1;
    }

    /**
     * Checks if `value` is classified as a `WeakMap` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
     * @example
     *
     * _.isWeakMap(new WeakMap);
     * // => true
     *
     * _.isWeakMap(new Map);
     * // => false
     */
    function isWeakMap(value) {
      return isObjectLike(value) && getTag(value) == weakMapTag;
    }

    /**
     * Checks if `value` is classified as a `WeakSet` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a weak set, else `false`.
     * @example
     *
     * _.isWeakSet(new WeakSet);
     * // => true
     *
     * _.isWeakSet(new Set);
     * // => false
     */
    function isWeakSet(value) {
      return isObjectLike(value) && baseGetTag(value) == weakSetTag;
    }

    /**
     * Checks if `value` is less than `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`,
     *  else `false`.
     * @see _.gt
     * @example
     *
     * _.lt(1, 3);
     * // => true
     *
     * _.lt(3, 3);
     * // => false
     *
     * _.lt(3, 1);
     * // => false
     */
    var lt = createRelationalOperation(baseLt);

    /**
     * Checks if `value` is less than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than or equal to
     *  `other`, else `false`.
     * @see _.gte
     * @example
     *
     * _.lte(1, 3);
     * // => true
     *
     * _.lte(3, 3);
     * // => true
     *
     * _.lte(3, 1);
     * // => false
     */
    var lte = createRelationalOperation(function(value, other) {
      return value <= other;
    });

    /**
     * Converts `value` to an array.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Array} Returns the converted array.
     * @example
     *
     * _.toArray({ 'a': 1, 'b': 2 });
     * // => [1, 2]
     *
     * _.toArray('abc');
     * // => ['a', 'b', 'c']
     *
     * _.toArray(1);
     * // => []
     *
     * _.toArray(null);
     * // => []
     */
    function toArray(value) {
      if (!value) {
        return [];
      }
      if (isArrayLike(value)) {
        return isString(value) ? stringToArray(value) : copyArray(value);
      }
      if (symIterator && value[symIterator]) {
        return iteratorToArray(value[symIterator]());
      }
      var tag = getTag(value),
          func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);

      return func(value);
    }

    /**
     * Converts `value` to a finite number.
     *
     * @static
     * @memberOf _
     * @since 4.12.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted number.
     * @example
     *
     * _.toFinite(3.2);
     * // => 3.2
     *
     * _.toFinite(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toFinite(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toFinite('3.2');
     * // => 3.2
     */
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }

    /**
     * Converts `value` to an integer.
     *
     * **Note:** This method is loosely based on
     * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toInteger(3.2);
     * // => 3
     *
     * _.toInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toInteger(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toInteger('3.2');
     * // => 3
     */
    function toInteger(value) {
      var result = toFinite(value),
          remainder = result % 1;

      return result === result ? (remainder ? result - remainder : result) : 0;
    }

    /**
     * Converts `value` to an integer suitable for use as the length of an
     * array-like object.
     *
     * **Note:** This method is based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toLength(3.2);
     * // => 3
     *
     * _.toLength(Number.MIN_VALUE);
     * // => 0
     *
     * _.toLength(Infinity);
     * // => 4294967295
     *
     * _.toLength('3.2');
     * // => 3
     */
    function toLength(value) {
      return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
    }

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
    function toNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = baseTrim(value);
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }

    /**
     * Converts `value` to a plain object flattening inherited enumerable string
     * keyed properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Object} Returns the converted plain object.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */
    function toPlainObject(value) {
      return copyObject(value, keysIn(value));
    }

    /**
     * Converts `value` to a safe integer. A safe integer can be compared and
     * represented correctly.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toSafeInteger(3.2);
     * // => 3
     *
     * _.toSafeInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toSafeInteger(Infinity);
     * // => 9007199254740991
     *
     * _.toSafeInteger('3.2');
     * // => 3
     */
    function toSafeInteger(value) {
      return value
        ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER)
        : (value === 0 ? value : 0);
    }

    /**
     * Converts `value` to a string. An empty string is returned for `null`
     * and `undefined` values. The sign of `-0` is preserved.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.toString(null);
     * // => ''
     *
     * _.toString(-0);
     * // => '-0'
     *
     * _.toString([1, 2, 3]);
     * // => '1,2,3'
     */
    function toString(value) {
      return value == null ? '' : baseToString(value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Assigns own enumerable string keyed properties of source objects to the
     * destination object. Source objects are applied from left to right.
     * Subsequent sources overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object` and is loosely based on
     * [`Object.assign`](https://mdn.io/Object/assign).
     *
     * @static
     * @memberOf _
     * @since 0.10.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.assignIn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * function Bar() {
     *   this.c = 3;
     * }
     *
     * Foo.prototype.b = 2;
     * Bar.prototype.d = 4;
     *
     * _.assign({ 'a': 0 }, new Foo, new Bar);
     * // => { 'a': 1, 'c': 3 }
     */
    var assign = createAssigner(function(object, source) {
      if (isPrototype(source) || isArrayLike(source)) {
        copyObject(source, keys(source), object);
        return;
      }
      for (var key in source) {
        if (hasOwnProperty.call(source, key)) {
          assignValue(object, key, source[key]);
        }
      }
    });

    /**
     * This method is like `_.assign` except that it iterates over own and
     * inherited source properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias extend
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.assign
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * function Bar() {
     *   this.c = 3;
     * }
     *
     * Foo.prototype.b = 2;
     * Bar.prototype.d = 4;
     *
     * _.assignIn({ 'a': 0 }, new Foo, new Bar);
     * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
     */
    var assignIn = createAssigner(function(object, source) {
      copyObject(source, keysIn(source), object);
    });

    /**
     * This method is like `_.assignIn` except that it accepts `customizer`
     * which is invoked to produce the assigned values. If `customizer` returns
     * `undefined`, assignment is handled by the method instead. The `customizer`
     * is invoked with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias extendWith
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @see _.assignWith
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignInWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObject(source, keysIn(source), object, customizer);
    });

    /**
     * This method is like `_.assign` except that it accepts `customizer`
     * which is invoked to produce the assigned values. If `customizer` returns
     * `undefined`, assignment is handled by the method instead. The `customizer`
     * is invoked with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @see _.assignInWith
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObject(source, keys(source), object, customizer);
    });

    /**
     * Creates an array of values corresponding to `paths` of `object`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Array} Returns the picked values.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _.at(object, ['a[0].b.c', 'a[1]']);
     * // => [3, 4]
     */
    var at = flatRest(baseAt);

    /**
     * Creates an object that inherits from the `prototype` object. If a
     * `properties` object is given, its own enumerable string keyed properties
     * are assigned to the created object.
     *
     * @static
     * @memberOf _
     * @since 2.3.0
     * @category Object
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, {
     *   'constructor': Circle
     * });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties) {
      var result = baseCreate(prototype);
      return properties == null ? result : baseAssign(result, properties);
    }

    /**
     * Assigns own and inherited enumerable string keyed properties of source
     * objects to the destination object for all destination properties that
     * resolve to `undefined`. Source objects are applied from left to right.
     * Once a property is set, additional values of the same property are ignored.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.defaultsDeep
     * @example
     *
     * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var defaults = baseRest(function(object, sources) {
      object = Object(object);

      var index = -1;
      var length = sources.length;
      var guard = length > 2 ? sources[2] : undefined$1;

      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        length = 1;
      }

      while (++index < length) {
        var source = sources[index];
        var props = keysIn(source);
        var propsIndex = -1;
        var propsLength = props.length;

        while (++propsIndex < propsLength) {
          var key = props[propsIndex];
          var value = object[key];

          if (value === undefined$1 ||
              (eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))) {
            object[key] = source[key];
          }
        }
      }

      return object;
    });

    /**
     * This method is like `_.defaults` except that it recursively assigns
     * default properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.defaults
     * @example
     *
     * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
     * // => { 'a': { 'b': 2, 'c': 3 } }
     */
    var defaultsDeep = baseRest(function(args) {
      args.push(undefined$1, customDefaultsMerge);
      return apply(mergeWith, undefined$1, args);
    });

    /**
     * This method is like `_.find` except that it returns the key of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element,
     *  else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findKey(users, function(o) { return o.age < 40; });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * // The `_.matches` iteratee shorthand.
     * _.findKey(users, { 'age': 1, 'active': true });
     * // => 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findKey(users, 'active');
     * // => 'barney'
     */
    function findKey(object, predicate) {
      return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
    }

    /**
     * This method is like `_.findKey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element,
     *  else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findLastKey(users, function(o) { return o.age < 40; });
     * // => returns 'pebbles' assuming `_.findKey` returns 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastKey(users, { 'age': 36, 'active': true });
     * // => 'barney'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastKey(users, 'active');
     * // => 'pebbles'
     */
    function findLastKey(object, predicate) {
      return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
    }

    /**
     * Iterates over own and inherited enumerable string keyed properties of an
     * object and invokes `iteratee` for each property. The iteratee is invoked
     * with three arguments: (value, key, object). Iteratee functions may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 0.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forInRight
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forIn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
     */
    function forIn(object, iteratee) {
      return object == null
        ? object
        : baseFor(object, getIteratee(iteratee, 3), keysIn);
    }

    /**
     * This method is like `_.forIn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forIn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forInRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'.
     */
    function forInRight(object, iteratee) {
      return object == null
        ? object
        : baseForRight(object, getIteratee(iteratee, 3), keysIn);
    }

    /**
     * Iterates over own enumerable string keyed properties of an object and
     * invokes `iteratee` for each property. The iteratee is invoked with three
     * arguments: (value, key, object). Iteratee functions may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 0.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forOwnRight
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a' then 'b' (iteration order is not guaranteed).
     */
    function forOwn(object, iteratee) {
      return object && baseForOwn(object, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.forOwn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forOwn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwnRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'.
     */
    function forOwnRight(object, iteratee) {
      return object && baseForOwnRight(object, getIteratee(iteratee, 3));
    }

    /**
     * Creates an array of function property names from own enumerable properties
     * of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the function names.
     * @see _.functionsIn
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functions(new Foo);
     * // => ['a', 'b']
     */
    function functions(object) {
      return object == null ? [] : baseFunctions(object, keys(object));
    }

    /**
     * Creates an array of function property names from own and inherited
     * enumerable properties of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the function names.
     * @see _.functions
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functionsIn(new Foo);
     * // => ['a', 'b', 'c']
     */
    function functionsIn(object) {
      return object == null ? [] : baseFunctions(object, keysIn(object));
    }

    /**
     * Gets the value at `path` of `object`. If the resolved value is
     * `undefined`, the `defaultValue` is returned in its place.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined$1 : baseGet(object, path);
      return result === undefined$1 ? defaultValue : result;
    }

    /**
     * Checks if `path` is a direct property of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = { 'a': { 'b': 2 } };
     * var other = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b');
     * // => true
     *
     * _.has(object, ['a', 'b']);
     * // => true
     *
     * _.has(other, 'a');
     * // => false
     */
    function has(object, path) {
      return object != null && hasPath(object, path, baseHas);
    }

    /**
     * Checks if `path` is a direct or inherited property of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.hasIn(object, 'a');
     * // => true
     *
     * _.hasIn(object, 'a.b');
     * // => true
     *
     * _.hasIn(object, ['a', 'b']);
     * // => true
     *
     * _.hasIn(object, 'b');
     * // => false
     */
    function hasIn(object, path) {
      return object != null && hasPath(object, path, baseHasIn);
    }

    /**
     * Creates an object composed of the inverted keys and values of `object`.
     * If `object` contains duplicate values, subsequent values overwrite
     * property assignments of previous values.
     *
     * @static
     * @memberOf _
     * @since 0.7.0
     * @category Object
     * @param {Object} object The object to invert.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invert(object);
     * // => { '1': 'c', '2': 'b' }
     */
    var invert = createInverter(function(result, value, key) {
      if (value != null &&
          typeof value.toString != 'function') {
        value = nativeObjectToString.call(value);
      }

      result[value] = key;
    }, constant(identity));

    /**
     * This method is like `_.invert` except that the inverted object is generated
     * from the results of running each element of `object` thru `iteratee`. The
     * corresponding inverted value of each inverted key is an array of keys
     * responsible for generating the inverted value. The iteratee is invoked
     * with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.1.0
     * @category Object
     * @param {Object} object The object to invert.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invertBy(object);
     * // => { '1': ['a', 'c'], '2': ['b'] }
     *
     * _.invertBy(object, function(value) {
     *   return 'group' + value;
     * });
     * // => { 'group1': ['a', 'c'], 'group2': ['b'] }
     */
    var invertBy = createInverter(function(result, value, key) {
      if (value != null &&
          typeof value.toString != 'function') {
        value = nativeObjectToString.call(value);
      }

      if (hasOwnProperty.call(result, value)) {
        result[value].push(key);
      } else {
        result[value] = [key];
      }
    }, getIteratee);

    /**
     * Invokes the method at `path` of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
     *
     * _.invoke(object, 'a[0].b.c.slice', 1, 3);
     * // => [2, 3]
     */
    var invoke = baseRest(baseInvoke);

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn(object) {
      return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
    }

    /**
     * The opposite of `_.mapValues`; this method creates an object with the
     * same values as `object` and keys generated by running each own enumerable
     * string keyed property of `object` thru `iteratee`. The iteratee is invoked
     * with three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @see _.mapValues
     * @example
     *
     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */
    function mapKeys(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        baseAssignValue(result, iteratee(value, key, object), value);
      });
      return result;
    }

    /**
     * Creates an object with the same keys as `object` and values generated
     * by running each own enumerable string keyed property of `object` thru
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @see _.mapKeys
     * @example
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * _.mapValues(users, function(o) { return o.age; });
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     *
     * // The `_.property` iteratee shorthand.
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */
    function mapValues(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        baseAssignValue(result, key, iteratee(value, key, object));
      });
      return result;
    }

    /**
     * This method is like `_.assign` except that it recursively merges own and
     * inherited enumerable string keyed properties of source objects into the
     * destination object. Source properties that resolve to `undefined` are
     * skipped if a destination value exists. Array and plain object properties
     * are merged recursively. Other objects and value types are overridden by
     * assignment. Source objects are applied from left to right. Subsequent
     * sources overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {
     *   'a': [{ 'b': 2 }, { 'd': 4 }]
     * };
     *
     * var other = {
     *   'a': [{ 'c': 3 }, { 'e': 5 }]
     * };
     *
     * _.merge(object, other);
     * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
     */
    var merge = createAssigner(function(object, source, srcIndex) {
      baseMerge(object, source, srcIndex);
    });

    /**
     * This method is like `_.merge` except that it accepts `customizer` which
     * is invoked to produce the merged values of the destination and source
     * properties. If `customizer` returns `undefined`, merging is handled by the
     * method instead. The `customizer` is invoked with six arguments:
     * (objValue, srcValue, key, object, source, stack).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   if (_.isArray(objValue)) {
     *     return objValue.concat(srcValue);
     *   }
     * }
     *
     * var object = { 'a': [1], 'b': [2] };
     * var other = { 'a': [3], 'b': [4] };
     *
     * _.mergeWith(object, other, customizer);
     * // => { 'a': [1, 3], 'b': [2, 4] }
     */
    var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
      baseMerge(object, source, srcIndex, customizer);
    });

    /**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable property paths of `object` that are not omitted.
     *
     * **Note:** This method is considerably slower than `_.pick`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [paths] The property paths to omit.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omit(object, ['a', 'c']);
     * // => { 'b': '2' }
     */
    var omit = flatRest(function(object, paths) {
      var result = {};
      if (object == null) {
        return result;
      }
      var isDeep = false;
      paths = arrayMap(paths, function(path) {
        path = castPath(path, object);
        isDeep || (isDeep = path.length > 1);
        return path;
      });
      copyObject(object, getAllKeysIn(object), result);
      if (isDeep) {
        result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
      }
      var length = paths.length;
      while (length--) {
        baseUnset(result, paths[length]);
      }
      return result;
    });

    /**
     * The opposite of `_.pickBy`; this method creates an object composed of
     * the own and inherited enumerable string keyed properties of `object` that
     * `predicate` doesn't return truthy for. The predicate is invoked with two
     * arguments: (value, key).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The source object.
     * @param {Function} [predicate=_.identity] The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omitBy(object, _.isNumber);
     * // => { 'b': '2' }
     */
    function omitBy(object, predicate) {
      return pickBy(object, negate(getIteratee(predicate)));
    }

    /**
     * Creates an object composed of the picked `object` properties.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pick(object, ['a', 'c']);
     * // => { 'a': 1, 'c': 3 }
     */
    var pick = flatRest(function(object, paths) {
      return object == null ? {} : basePick(object, paths);
    });

    /**
     * Creates an object composed of the `object` properties `predicate` returns
     * truthy for. The predicate is invoked with two arguments: (value, key).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The source object.
     * @param {Function} [predicate=_.identity] The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pickBy(object, _.isNumber);
     * // => { 'a': 1, 'c': 3 }
     */
    function pickBy(object, predicate) {
      if (object == null) {
        return {};
      }
      var props = arrayMap(getAllKeysIn(object), function(prop) {
        return [prop];
      });
      predicate = getIteratee(predicate);
      return basePickBy(object, props, function(value, path) {
        return predicate(value, path[0]);
      });
    }

    /**
     * This method is like `_.get` except that if the resolved value is a
     * function it's invoked with the `this` binding of its parent object and
     * its result is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to resolve.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
     *
     * _.result(object, 'a[0].b.c1');
     * // => 3
     *
     * _.result(object, 'a[0].b.c2');
     * // => 4
     *
     * _.result(object, 'a[0].b.c3', 'default');
     * // => 'default'
     *
     * _.result(object, 'a[0].b.c3', _.constant('default'));
     * // => 'default'
     */
    function result(object, path, defaultValue) {
      path = castPath(path, object);

      var index = -1,
          length = path.length;

      // Ensure the loop is entered when path is empty.
      if (!length) {
        length = 1;
        object = undefined$1;
      }
      while (++index < length) {
        var value = object == null ? undefined$1 : object[toKey(path[index])];
        if (value === undefined$1) {
          index = length;
          value = defaultValue;
        }
        object = isFunction(value) ? value.call(object) : value;
      }
      return object;
    }

    /**
     * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
     * it's created. Arrays are created for missing index properties while objects
     * are created for all other missing properties. Use `_.setWith` to customize
     * `path` creation.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, ['x', '0', 'y', 'z'], 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */
    function set(object, path, value) {
      return object == null ? object : baseSet(object, path, value);
    }

    /**
     * This method is like `_.set` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.setWith(object, '[0][1]', 'a', Object);
     * // => { '0': { '1': 'a' } }
     */
    function setWith(object, path, value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined$1;
      return object == null ? object : baseSet(object, path, value, customizer);
    }

    /**
     * Creates an array of own enumerable string keyed-value pairs for `object`
     * which can be consumed by `_.fromPairs`. If `object` is a map or set, its
     * entries are returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias entries
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairs(new Foo);
     * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
     */
    var toPairs = createToPairs(keys);

    /**
     * Creates an array of own and inherited enumerable string keyed-value pairs
     * for `object` which can be consumed by `_.fromPairs`. If `object` is a map
     * or set, its entries are returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias entriesIn
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairsIn(new Foo);
     * // => [['a', 1], ['b', 2], ['c', 3]] (iteration order is not guaranteed)
     */
    var toPairsIn = createToPairs(keysIn);

    /**
     * An alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own
     * enumerable string keyed properties thru `iteratee`, with each invocation
     * potentially mutating the `accumulator` object. If `accumulator` is not
     * provided, a new object with the same `[[Prototype]]` will be used. The
     * iteratee is invoked with four arguments: (accumulator, value, key, object).
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 1.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.transform([2, 3, 4], function(result, n) {
     *   result.push(n *= n);
     *   return n % 2 == 0;
     * }, []);
     * // => [4, 9]
     *
     * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */
    function transform(object, iteratee, accumulator) {
      var isArr = isArray(object),
          isArrLike = isArr || isBuffer(object) || isTypedArray(object);

      iteratee = getIteratee(iteratee, 4);
      if (accumulator == null) {
        var Ctor = object && object.constructor;
        if (isArrLike) {
          accumulator = isArr ? new Ctor : [];
        }
        else if (isObject(object)) {
          accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
        }
        else {
          accumulator = {};
        }
      }
      (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
        return iteratee(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * Removes the property at `path` of `object`.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 7 } }] };
     * _.unset(object, 'a[0].b.c');
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     *
     * _.unset(object, ['a', '0', 'b', 'c']);
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     */
    function unset(object, path) {
      return object == null ? true : baseUnset(object, path);
    }

    /**
     * This method is like `_.set` except that accepts `updater` to produce the
     * value to set. Use `_.updateWith` to customize `path` creation. The `updater`
     * is invoked with one argument: (value).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.update(object, 'a[0].b.c', function(n) { return n * n; });
     * console.log(object.a[0].b.c);
     * // => 9
     *
     * _.update(object, 'x[0].y.z', function(n) { return n ? n + 1 : 0; });
     * console.log(object.x[0].y.z);
     * // => 0
     */
    function update(object, path, updater) {
      return object == null ? object : baseUpdate(object, path, castFunction(updater));
    }

    /**
     * This method is like `_.update` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.updateWith(object, '[0][1]', _.constant('a'), Object);
     * // => { '0': { '1': 'a' } }
     */
    function updateWith(object, path, updater, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined$1;
      return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
    }

    /**
     * Creates an array of the own enumerable string keyed property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.values(new Foo);
     * // => [1, 2] (iteration order is not guaranteed)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */
    function values(object) {
      return object == null ? [] : baseValues(object, keys(object));
    }

    /**
     * Creates an array of the own and inherited enumerable string keyed property
     * values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.valuesIn(new Foo);
     * // => [1, 2, 3] (iteration order is not guaranteed)
     */
    function valuesIn(object) {
      return object == null ? [] : baseValues(object, keysIn(object));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Clamps `number` within the inclusive `lower` and `upper` bounds.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Number
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     * @example
     *
     * _.clamp(-10, -5, 5);
     * // => -5
     *
     * _.clamp(10, -5, 5);
     * // => 5
     */
    function clamp(number, lower, upper) {
      if (upper === undefined$1) {
        upper = lower;
        lower = undefined$1;
      }
      if (upper !== undefined$1) {
        upper = toNumber(upper);
        upper = upper === upper ? upper : 0;
      }
      if (lower !== undefined$1) {
        lower = toNumber(lower);
        lower = lower === lower ? lower : 0;
      }
      return baseClamp(toNumber(number), lower, upper);
    }

    /**
     * Checks if `n` is between `start` and up to, but not including, `end`. If
     * `end` is not specified, it's set to `start` with `start` then set to `0`.
     * If `start` is greater than `end` the params are swapped to support
     * negative ranges.
     *
     * @static
     * @memberOf _
     * @since 3.3.0
     * @category Number
     * @param {number} number The number to check.
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     * @see _.range, _.rangeRight
     * @example
     *
     * _.inRange(3, 2, 4);
     * // => true
     *
     * _.inRange(4, 8);
     * // => true
     *
     * _.inRange(4, 2);
     * // => false
     *
     * _.inRange(2, 2);
     * // => false
     *
     * _.inRange(1.2, 2);
     * // => true
     *
     * _.inRange(5.2, 4);
     * // => false
     *
     * _.inRange(-3, -2, -6);
     * // => true
     */
    function inRange(number, start, end) {
      start = toFinite(start);
      if (end === undefined$1) {
        end = start;
        start = 0;
      } else {
        end = toFinite(end);
      }
      number = toNumber(number);
      return baseInRange(number, start, end);
    }

    /**
     * Produces a random number between the inclusive `lower` and `upper` bounds.
     * If only one argument is provided a number between `0` and the given number
     * is returned. If `floating` is `true`, or either `lower` or `upper` are
     * floats, a floating-point number is returned instead of an integer.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @memberOf _
     * @since 0.7.0
     * @category Number
     * @param {number} [lower=0] The lower bound.
     * @param {number} [upper=1] The upper bound.
     * @param {boolean} [floating] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(lower, upper, floating) {
      if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
        upper = floating = undefined$1;
      }
      if (floating === undefined$1) {
        if (typeof upper == 'boolean') {
          floating = upper;
          upper = undefined$1;
        }
        else if (typeof lower == 'boolean') {
          floating = lower;
          lower = undefined$1;
        }
      }
      if (lower === undefined$1 && upper === undefined$1) {
        lower = 0;
        upper = 1;
      }
      else {
        lower = toFinite(lower);
        if (upper === undefined$1) {
          upper = lower;
          lower = 0;
        } else {
          upper = toFinite(upper);
        }
      }
      if (lower > upper) {
        var temp = lower;
        lower = upper;
        upper = temp;
      }
      if (floating || lower % 1 || upper % 1) {
        var rand = nativeRandom();
        return nativeMin(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);
      }
      return baseRandom(lower, upper);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar--');
     * // => 'fooBar'
     *
     * _.camelCase('__FOO_BAR__');
     * // => 'fooBar'
     */
    var camelCase = createCompounder(function(result, word, index) {
      word = word.toLowerCase();
      return result + (index ? capitalize(word) : word);
    });

    /**
     * Converts the first character of `string` to upper case and the remaining
     * to lower case.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('FRED');
     * // => 'Fred'
     */
    function capitalize(string) {
      return upperFirst(toString(string).toLowerCase());
    }

    /**
     * Deburrs `string` by converting
     * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
     * letters to basic Latin letters and removing
     * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @example
     *
     * _.deburr('déjà vu');
     * // => 'deja vu'
     */
    function deburr(string) {
      string = toString(string);
      return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
    }

    /**
     * Checks if `string` ends with the given target string.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {string} [target] The string to search for.
     * @param {number} [position=string.length] The position to search up to.
     * @returns {boolean} Returns `true` if `string` ends with `target`,
     *  else `false`.
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */
    function endsWith(string, target, position) {
      string = toString(string);
      target = baseToString(target);

      var length = string.length;
      position = position === undefined$1
        ? length
        : baseClamp(toInteger(position), 0, length);

      var end = position;
      position -= target.length;
      return position >= 0 && string.slice(position, end) == target;
    }

    /**
     * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
     * corresponding HTML entities.
     *
     * **Note:** No other characters are escaped. To escape additional
     * characters use a third-party library like [_he_](https://mths.be/he).
     *
     * Though the ">" character is escaped for symmetry, characters like
     * ">" and "/" don't need escaping in HTML and have no special meaning
     * unless they're part of a tag or unquoted attribute value. See
     * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") for more details.
     *
     * When working with HTML you should always
     * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
     * XSS vectors.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */
    function escape(string) {
      string = toString(string);
      return (string && reHasUnescapedHtml.test(string))
        ? string.replace(reUnescapedHtml, escapeHtmlChar)
        : string;
    }

    /**
     * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
     * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escapeRegExp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https://lodash\.com/\)'
     */
    function escapeRegExp(string) {
      string = toString(string);
      return (string && reHasRegExpChar.test(string))
        ? string.replace(reRegExpChar, '\\$&')
        : string;
    }

    /**
     * Converts `string` to
     * [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the kebab cased string.
     * @example
     *
     * _.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * _.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * _.kebabCase('__FOO_BAR__');
     * // => 'foo-bar'
     */
    var kebabCase = createCompounder(function(result, word, index) {
      return result + (index ? '-' : '') + word.toLowerCase();
    });

    /**
     * Converts `string`, as space separated words, to lower case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.lowerCase('--Foo-Bar--');
     * // => 'foo bar'
     *
     * _.lowerCase('fooBar');
     * // => 'foo bar'
     *
     * _.lowerCase('__FOO_BAR__');
     * // => 'foo bar'
     */
    var lowerCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toLowerCase();
    });

    /**
     * Converts the first character of `string` to lower case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.lowerFirst('Fred');
     * // => 'fred'
     *
     * _.lowerFirst('FRED');
     * // => 'fRED'
     */
    var lowerFirst = createCaseFirst('toLowerCase');

    /**
     * Pads `string` on the left and right sides if it's shorter than `length`.
     * Padding characters are truncated if they can't be evenly divided by `length`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */
    function pad(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      if (!length || strLength >= length) {
        return string;
      }
      var mid = (length - strLength) / 2;
      return (
        createPadding(nativeFloor(mid), chars) +
        string +
        createPadding(nativeCeil(mid), chars)
      );
    }

    /**
     * Pads `string` on the right side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padEnd('abc', 6);
     * // => 'abc   '
     *
     * _.padEnd('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padEnd('abc', 3);
     * // => 'abc'
     */
    function padEnd(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      return (length && strLength < length)
        ? (string + createPadding(length - strLength, chars))
        : string;
    }

    /**
     * Pads `string` on the left side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padStart('abc', 6);
     * // => '   abc'
     *
     * _.padStart('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padStart('abc', 3);
     * // => 'abc'
     */
    function padStart(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      return (length && strLength < length)
        ? (createPadding(length - strLength, chars) + string)
        : string;
    }

    /**
     * Converts `string` to an integer of the specified radix. If `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a
     * hexadecimal, in which case a `radix` of `16` is used.
     *
     * **Note:** This method aligns with the
     * [ES5 implementation](https://es5.github.io/#x15.1.2.2) of `parseInt`.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category String
     * @param {string} string The string to convert.
     * @param {number} [radix=10] The radix to interpret `value` by.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseInt);
     * // => [6, 8, 10]
     */
    function parseInt(string, radix, guard) {
      if (guard || radix == null) {
        radix = 0;
      } else if (radix) {
        radix = +radix;
      }
      return nativeParseInt(toString(string).replace(reTrimStart, ''), radix || 0);
    }

    /**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=1] The number of times to repeat the string.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */
    function repeat(string, n, guard) {
      if ((guard ? isIterateeCall(string, n, guard) : n === undefined$1)) {
        n = 1;
      } else {
        n = toInteger(n);
      }
      return baseRepeat(toString(string), n);
    }

    /**
     * Replaces matches for `pattern` in `string` with `replacement`.
     *
     * **Note:** This method is based on
     * [`String#replace`](https://mdn.io/String/replace).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to modify.
     * @param {RegExp|string} pattern The pattern to replace.
     * @param {Function|string} replacement The match replacement.
     * @returns {string} Returns the modified string.
     * @example
     *
     * _.replace('Hi Fred', 'Fred', 'Barney');
     * // => 'Hi Barney'
     */
    function replace() {
      var args = arguments,
          string = toString(args[0]);

      return args.length < 3 ? string : string.replace(args[1], args[2]);
    }

    /**
     * Converts `string` to
     * [snake case](https://en.wikipedia.org/wiki/Snake_case).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--FOO-BAR--');
     * // => 'foo_bar'
     */
    var snakeCase = createCompounder(function(result, word, index) {
      return result + (index ? '_' : '') + word.toLowerCase();
    });

    /**
     * Splits `string` by `separator`.
     *
     * **Note:** This method is based on
     * [`String#split`](https://mdn.io/String/split).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to split.
     * @param {RegExp|string} separator The separator pattern to split by.
     * @param {number} [limit] The length to truncate results to.
     * @returns {Array} Returns the string segments.
     * @example
     *
     * _.split('a-b-c', '-', 2);
     * // => ['a', 'b']
     */
    function split(string, separator, limit) {
      if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
        separator = limit = undefined$1;
      }
      limit = limit === undefined$1 ? MAX_ARRAY_LENGTH : limit >>> 0;
      if (!limit) {
        return [];
      }
      string = toString(string);
      if (string && (
            typeof separator == 'string' ||
            (separator != null && !isRegExp(separator))
          )) {
        separator = baseToString(separator);
        if (!separator && hasUnicode(string)) {
          return castSlice(stringToArray(string), 0, limit);
        }
      }
      return string.split(separator, limit);
    }

    /**
     * Converts `string` to
     * [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
     *
     * @static
     * @memberOf _
     * @since 3.1.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the start cased string.
     * @example
     *
     * _.startCase('--foo-bar--');
     * // => 'Foo Bar'
     *
     * _.startCase('fooBar');
     * // => 'Foo Bar'
     *
     * _.startCase('__FOO_BAR__');
     * // => 'FOO BAR'
     */
    var startCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + upperFirst(word);
    });

    /**
     * Checks if `string` starts with the given target string.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] The position to search from.
     * @returns {boolean} Returns `true` if `string` starts with `target`,
     *  else `false`.
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */
    function startsWith(string, target, position) {
      string = toString(string);
      position = position == null
        ? 0
        : baseClamp(toInteger(position), 0, string.length);

      target = baseToString(target);
      return string.slice(position, position + target.length) == target;
    }

    /**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escape interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
     * properties may be accessed as free variables in the template. If a setting
     * object is given, it takes precedence over `_.templateSettings` values.
     *
     * **Note:** In the development build `_.template` utilizes
     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for easier debugging.
     *
     * For more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category String
     * @param {string} [string=''] The template string.
     * @param {Object} [options={}] The options object.
     * @param {RegExp} [options.escape=_.templateSettings.escape]
     *  The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
     *  The "evaluate" delimiter.
     * @param {Object} [options.imports=_.templateSettings.imports]
     *  An object to import into the template as free variables.
     * @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
     *  The "interpolate" delimiter.
     * @param {string} [options.sourceURL='lodash.templateSources[n]']
     *  The sourceURL of the compiled template.
     * @param {string} [options.variable='obj']
     *  The data object variable name.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the compiled template function.
     * @example
     *
     * // Use the "interpolate" delimiter to create a compiled template.
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // Use the HTML "escape" delimiter to escape data property values.
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the internal `print` function in "evaluate" delimiters.
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // Use the ES template literal delimiter as an "interpolate" delimiter.
     * // Disable support by replacing the "interpolate" delimiter.
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // Use backslashes to treat delimiters as plain text.
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // Use the `imports` option to import `jQuery` as `jq`.
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the `sourceURL` option to specify a custom sourceURL for the template.
     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
     *
     * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     * //   var __t, __p = '';
     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     * //   return __p;
     * // }
     *
     * // Use custom template delimiters.
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // Use the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and stack traces.
     * fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(string, options, guard) {
      // Based on John Resig's `tmpl` implementation
      // (http://ejohn.org/blog/javascript-micro-templating/)
      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
      var settings = lodash.templateSettings;

      if (guard && isIterateeCall(string, options, guard)) {
        options = undefined$1;
      }
      string = toString(string);
      options = assignInWith({}, options, settings, customDefaultsAssignIn);

      var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn),
          importsKeys = keys(imports),
          importsValues = baseValues(imports, importsKeys);

      var isEscaping,
          isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // Compile the regexp to match each delimiter.
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      // Use a sourceURL for easier debugging.
      // The sourceURL gets injected into the source that's eval-ed, so be careful
      // to normalize all kinds of whitespace, so e.g. newlines (and unicode versions of it) can't sneak in
      // and escape the comment, thus injecting code that gets evaled.
      var sourceURL = '//# sourceURL=' +
        (hasOwnProperty.call(options, 'sourceURL')
          ? (options.sourceURL + '').replace(/\s/g, ' ')
          : ('lodash.templateSources[' + (++templateCounter) + ']')
        ) + '\n';

      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // Escape characters that can't be included in string literals.
        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // Replace delimiters with snippets.
        if (escapeValue) {
          isEscaping = true;
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // The JS engine embedded in Adobe products needs `match` returned in
        // order to produce the correct `offset` value.
        return match;
      });

      source += "';\n";

      // If `variable` is not specified wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain.
      var variable = hasOwnProperty.call(options, 'variable') && options.variable;
      if (!variable) {
        source = 'with (obj) {\n' + source + '\n}\n';
      }
      // Throw an error if a forbidden character was found in `variable`, to prevent
      // potential command injection attacks.
      else if (reForbiddenIdentifierChars.test(variable)) {
        throw new Error(INVALID_TEMPL_VAR_ERROR_TEXT);
      }

      // Cleanup code by stripping empty strings.
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // Frame code as the function body.
      source = 'function(' + (variable || 'obj') + ') {\n' +
        (variable
          ? ''
          : 'obj || (obj = {});\n'
        ) +
        "var __t, __p = ''" +
        (isEscaping
           ? ', __e = _.escape'
           : ''
        ) +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      var result = attempt(function() {
        return Function(importsKeys, sourceURL + 'return ' + source)
          .apply(undefined$1, importsValues);
      });

      // Provide the compiled function's source by its `toString` method or
      // the `source` property as a convenience for inlining compiled templates.
      result.source = source;
      if (isError(result)) {
        throw result;
      }
      return result;
    }

    /**
     * Converts `string`, as a whole, to lower case just like
     * [String#toLowerCase](https://mdn.io/toLowerCase).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.toLower('--Foo-Bar--');
     * // => '--foo-bar--'
     *
     * _.toLower('fooBar');
     * // => 'foobar'
     *
     * _.toLower('__FOO_BAR__');
     * // => '__foo_bar__'
     */
    function toLower(value) {
      return toString(value).toLowerCase();
    }

    /**
     * Converts `string`, as a whole, to upper case just like
     * [String#toUpperCase](https://mdn.io/toUpperCase).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.toUpper('--foo-bar--');
     * // => '--FOO-BAR--'
     *
     * _.toUpper('fooBar');
     * // => 'FOOBAR'
     *
     * _.toUpper('__foo_bar__');
     * // => '__FOO_BAR__'
     */
    function toUpper(value) {
      return toString(value).toUpperCase();
    }

    /**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */
    function trim(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined$1)) {
        return baseTrim(string);
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          chrSymbols = stringToArray(chars),
          start = charsStartIndex(strSymbols, chrSymbols),
          end = charsEndIndex(strSymbols, chrSymbols) + 1;

      return castSlice(strSymbols, start, end).join('');
    }

    /**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimEnd('  abc  ');
     * // => '  abc'
     *
     * _.trimEnd('-_-abc-_-', '_-');
     * // => '-_-abc'
     */
    function trimEnd(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined$1)) {
        return string.slice(0, trimmedEndIndex(string) + 1);
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;

      return castSlice(strSymbols, 0, end).join('');
    }

    /**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimStart('  abc  ');
     * // => 'abc  '
     *
     * _.trimStart('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */
    function trimStart(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined$1)) {
        return string.replace(reTrimStart, '');
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          start = charsStartIndex(strSymbols, stringToArray(chars));

      return castSlice(strSymbols, start).join('');
    }

    /**
     * Truncates `string` if it's longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to truncate.
     * @param {Object} [options={}] The options object.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.truncate('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': ' '
     * });
     * // => 'hi-diddly-ho there,...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': /,? +/
     * });
     * // => 'hi-diddly-ho there...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'omission': ' [...]'
     * });
     * // => 'hi-diddly-ho there, neig [...]'
     */
    function truncate(string, options) {
      var length = DEFAULT_TRUNC_LENGTH,
          omission = DEFAULT_TRUNC_OMISSION;

      if (isObject(options)) {
        var separator = 'separator' in options ? options.separator : separator;
        length = 'length' in options ? toInteger(options.length) : length;
        omission = 'omission' in options ? baseToString(options.omission) : omission;
      }
      string = toString(string);

      var strLength = string.length;
      if (hasUnicode(string)) {
        var strSymbols = stringToArray(string);
        strLength = strSymbols.length;
      }
      if (length >= strLength) {
        return string;
      }
      var end = length - stringSize(omission);
      if (end < 1) {
        return omission;
      }
      var result = strSymbols
        ? castSlice(strSymbols, 0, end).join('')
        : string.slice(0, end);

      if (separator === undefined$1) {
        return result + omission;
      }
      if (strSymbols) {
        end += (result.length - end);
      }
      if (isRegExp(separator)) {
        if (string.slice(end).search(separator)) {
          var match,
              substring = result;

          if (!separator.global) {
            separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
          }
          separator.lastIndex = 0;
          while ((match = separator.exec(substring))) {
            var newEnd = match.index;
          }
          result = result.slice(0, newEnd === undefined$1 ? end : newEnd);
        }
      } else if (string.indexOf(baseToString(separator), end) != end) {
        var index = result.lastIndexOf(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }

    /**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to
     * their corresponding characters.
     *
     * **Note:** No other HTML entities are unescaped. To unescape additional
     * HTML entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @since 0.6.0
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */
    function unescape(string) {
      string = toString(string);
      return (string && reHasEscapedHtml.test(string))
        ? string.replace(reEscapedHtml, unescapeHtmlChar)
        : string;
    }

    /**
     * Converts `string`, as space separated words, to upper case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.upperCase('--foo-bar');
     * // => 'FOO BAR'
     *
     * _.upperCase('fooBar');
     * // => 'FOO BAR'
     *
     * _.upperCase('__foo_bar__');
     * // => 'FOO BAR'
     */
    var upperCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toUpperCase();
    });

    /**
     * Converts the first character of `string` to upper case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.upperFirst('fred');
     * // => 'Fred'
     *
     * _.upperFirst('FRED');
     * // => 'FRED'
     */
    var upperFirst = createCaseFirst('toUpperCase');

    /**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */
    function words(string, pattern, guard) {
      string = toString(string);
      pattern = guard ? undefined$1 : pattern;

      if (pattern === undefined$1) {
        return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
      }
      return string.match(pattern) || [];
    }

    /*------------------------------------------------------------------------*/

    /**
     * Attempts to invoke `func`, returning either the result or the caught error
     * object. Any additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Function} func The function to attempt.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {*} Returns the `func` result or error object.
     * @example
     *
     * // Avoid throwing errors for invalid selectors.
     * var elements = _.attempt(function(selector) {
     *   return document.querySelectorAll(selector);
     * }, '>_>');
     *
     * if (_.isError(elements)) {
     *   elements = [];
     * }
     */
    var attempt = baseRest(function(func, args) {
      try {
        return apply(func, undefined$1, args);
      } catch (e) {
        return isError(e) ? e : new Error(e);
      }
    });

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method.
     *
     * **Note:** This method doesn't set the "length" property of bound functions.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...(string|string[])} methodNames The object method names to bind.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'click': function() {
     *     console.log('clicked ' + this.label);
     *   }
     * };
     *
     * _.bindAll(view, ['click']);
     * jQuery(element).on('click', view.click);
     * // => Logs 'clicked docs' when clicked.
     */
    var bindAll = flatRest(function(object, methodNames) {
      arrayEach(methodNames, function(key) {
        key = toKey(key);
        baseAssignValue(object, key, bind(object[key], object));
      });
      return object;
    });

    /**
     * Creates a function that iterates over `pairs` and invokes the corresponding
     * function of the first predicate to return truthy. The predicate-function
     * pairs are invoked with the `this` binding and arguments of the created
     * function.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {Array} pairs The predicate-function pairs.
     * @returns {Function} Returns the new composite function.
     * @example
     *
     * var func = _.cond([
     *   [_.matches({ 'a': 1 }),           _.constant('matches A')],
     *   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
     *   [_.stubTrue,                      _.constant('no match')]
     * ]);
     *
     * func({ 'a': 1, 'b': 2 });
     * // => 'matches A'
     *
     * func({ 'a': 0, 'b': 1 });
     * // => 'matches B'
     *
     * func({ 'a': '1', 'b': '2' });
     * // => 'no match'
     */
    function cond(pairs) {
      var length = pairs == null ? 0 : pairs.length,
          toIteratee = getIteratee();

      pairs = !length ? [] : arrayMap(pairs, function(pair) {
        if (typeof pair[1] != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        return [toIteratee(pair[0]), pair[1]];
      });

      return baseRest(function(args) {
        var index = -1;
        while (++index < length) {
          var pair = pairs[index];
          if (apply(pair[0], this, args)) {
            return apply(pair[1], this, args);
          }
        }
      });
    }

    /**
     * Creates a function that invokes the predicate properties of `source` with
     * the corresponding property values of a given object, returning `true` if
     * all predicates return truthy, else `false`.
     *
     * **Note:** The created function is equivalent to `_.conformsTo` with
     * `source` partially applied.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 2, 'b': 1 },
     *   { 'a': 1, 'b': 2 }
     * ];
     *
     * _.filter(objects, _.conforms({ 'b': function(n) { return n > 1; } }));
     * // => [{ 'a': 1, 'b': 2 }]
     */
    function conforms(source) {
      return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new constant function.
     * @example
     *
     * var objects = _.times(2, _.constant({ 'a': 1 }));
     *
     * console.log(objects);
     * // => [{ 'a': 1 }, { 'a': 1 }]
     *
     * console.log(objects[0] === objects[1]);
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * Checks `value` to determine whether a default value should be returned in
     * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
     * or `undefined`.
     *
     * @static
     * @memberOf _
     * @since 4.14.0
     * @category Util
     * @param {*} value The value to check.
     * @param {*} defaultValue The default value.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * _.defaultTo(1, 10);
     * // => 1
     *
     * _.defaultTo(undefined, 10);
     * // => 10
     */
    function defaultTo(value, defaultValue) {
      return (value == null || value !== value) ? defaultValue : value;
    }

    /**
     * Creates a function that returns the result of invoking the given functions
     * with the `this` binding of the created function, where each successive
     * invocation is supplied the return value of the previous.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {...(Function|Function[])} [funcs] The functions to invoke.
     * @returns {Function} Returns the new composite function.
     * @see _.flowRight
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flow([_.add, square]);
     * addSquare(1, 2);
     * // => 9
     */
    var flow = createFlow();

    /**
     * This method is like `_.flow` except that it creates a function that
     * invokes the given functions from right to left.
     *
     * @static
     * @since 3.0.0
     * @memberOf _
     * @category Util
     * @param {...(Function|Function[])} [funcs] The functions to invoke.
     * @returns {Function} Returns the new composite function.
     * @see _.flow
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flowRight([square, _.add]);
     * addSquare(1, 2);
     * // => 9
     */
    var flowRight = createFlow(true);

    /**
     * This method returns the first argument it receives.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'a': 1 };
     *
     * console.log(_.identity(object) === object);
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Creates a function that invokes `func` with the arguments of the created
     * function. If `func` is a property name, the created function returns the
     * property value for a given element. If `func` is an array or object, the
     * created function returns `true` for elements that contain the equivalent
     * source properties, otherwise it returns `false`.
     *
     * @static
     * @since 4.0.0
     * @memberOf _
     * @category Util
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @returns {Function} Returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
     * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.filter(users, _.iteratee(['user', 'fred']));
     * // => [{ 'user': 'fred', 'age': 40 }]
     *
     * // The `_.property` iteratee shorthand.
     * _.map(users, _.iteratee('user'));
     * // => ['barney', 'fred']
     *
     * // Create custom iteratee shorthands.
     * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
     *   return !_.isRegExp(func) ? iteratee(func) : function(string) {
     *     return func.test(string);
     *   };
     * });
     *
     * _.filter(['abc', 'def'], /ef/);
     * // => ['def']
     */
    function iteratee(func) {
      return baseIteratee(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that performs a partial deep comparison between a given
     * object and `source`, returning `true` if the given object has equivalent
     * property values, else `false`.
     *
     * **Note:** The created function is equivalent to `_.isMatch` with `source`
     * partially applied.
     *
     * Partial comparisons will match empty array and empty object `source`
     * values against any array or object value, respectively. See `_.isEqual`
     * for a list of supported value comparisons.
     *
     * **Note:** Multiple values can be checked by combining several matchers
     * using `_.overSome`
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 1, 'b': 2, 'c': 3 },
     *   { 'a': 4, 'b': 5, 'c': 6 }
     * ];
     *
     * _.filter(objects, _.matches({ 'a': 4, 'c': 6 }));
     * // => [{ 'a': 4, 'b': 5, 'c': 6 }]
     *
     * // Checking for several possible values
     * _.filter(objects, _.overSome([_.matches({ 'a': 1 }), _.matches({ 'a': 4 })]));
     * // => [{ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 4, 'b': 5, 'c': 6 }]
     */
    function matches(source) {
      return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that performs a partial deep comparison between the
     * value at `path` of a given object to `srcValue`, returning `true` if the
     * object value is equivalent, else `false`.
     *
     * **Note:** Partial comparisons will match empty array and empty object
     * `srcValue` values against any array or object value, respectively. See
     * `_.isEqual` for a list of supported value comparisons.
     *
     * **Note:** Multiple values can be checked by combining several matchers
     * using `_.overSome`
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 1, 'b': 2, 'c': 3 },
     *   { 'a': 4, 'b': 5, 'c': 6 }
     * ];
     *
     * _.find(objects, _.matchesProperty('a', 4));
     * // => { 'a': 4, 'b': 5, 'c': 6 }
     *
     * // Checking for several possible values
     * _.filter(objects, _.overSome([_.matchesProperty('a', 1), _.matchesProperty('a', 4)]));
     * // => [{ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 4, 'b': 5, 'c': 6 }]
     */
    function matchesProperty(path, srcValue) {
      return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that invokes the method at `path` of a given object.
     * Any additional arguments are provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Util
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new invoker function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': _.constant(2) } },
     *   { 'a': { 'b': _.constant(1) } }
     * ];
     *
     * _.map(objects, _.method('a.b'));
     * // => [2, 1]
     *
     * _.map(objects, _.method(['a', 'b']));
     * // => [2, 1]
     */
    var method = baseRest(function(path, args) {
      return function(object) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * The opposite of `_.method`; this method creates a function that invokes
     * the method at a given path of `object`. Any additional arguments are
     * provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Util
     * @param {Object} object The object to query.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new invoker function.
     * @example
     *
     * var array = _.times(3, _.constant),
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
     * // => [2, 0]
     */
    var methodOf = baseRest(function(object, args) {
      return function(path) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * Adds all own enumerable string keyed function properties of a source
     * object to the destination object. If `object` is a function, then methods
     * are added to its prototype as well.
     *
     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
     * avoid conflicts caused by modifying the original.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {Function|Object} [object=lodash] The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.chain=true] Specify whether mixins are chainable.
     * @returns {Function|Object} Returns `object`.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */
    function mixin(object, source, options) {
      var props = keys(source),
          methodNames = baseFunctions(source, props);

      if (options == null &&
          !(isObject(source) && (methodNames.length || !props.length))) {
        options = source;
        source = object;
        object = this;
        methodNames = baseFunctions(source, keys(source));
      }
      var chain = !(isObject(options) && 'chain' in options) || !!options.chain,
          isFunc = isFunction(object);

      arrayEach(methodNames, function(methodName) {
        var func = source[methodName];
        object[methodName] = func;
        if (isFunc) {
          object.prototype[methodName] = function() {
            var chainAll = this.__chain__;
            if (chain || chainAll) {
              var result = object(this.__wrapped__),
                  actions = result.__actions__ = copyArray(this.__actions__);

              actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
              result.__chain__ = chainAll;
              return result;
            }
            return func.apply(object, arrayPush([this.value()], arguments));
          };
        }
      });

      return object;
    }

    /**
     * Reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      if (root._ === this) {
        root._ = oldDash;
      }
      return this;
    }

    /**
     * This method returns `undefined`.
     *
     * @static
     * @memberOf _
     * @since 2.3.0
     * @category Util
     * @example
     *
     * _.times(2, _.noop);
     * // => [undefined, undefined]
     */
    function noop() {
      // No operation performed.
    }

    /**
     * Creates a function that gets the argument at index `n`. If `n` is negative,
     * the nth argument from the end is returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {number} [n=0] The index of the argument to return.
     * @returns {Function} Returns the new pass-thru function.
     * @example
     *
     * var func = _.nthArg(1);
     * func('a', 'b', 'c', 'd');
     * // => 'b'
     *
     * var func = _.nthArg(-2);
     * func('a', 'b', 'c', 'd');
     * // => 'c'
     */
    function nthArg(n) {
      n = toInteger(n);
      return baseRest(function(args) {
        return baseNth(args, n);
      });
    }

    /**
     * Creates a function that invokes `iteratees` with the arguments it receives
     * and returns their results.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [iteratees=[_.identity]]
     *  The iteratees to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.over([Math.max, Math.min]);
     *
     * func(1, 2, 3, 4);
     * // => [4, 1]
     */
    var over = createOver(arrayMap);

    /**
     * Creates a function that checks if **all** of the `predicates` return
     * truthy when invoked with the arguments it receives.
     *
     * Following shorthands are possible for providing predicates.
     * Pass an `Object` and it will be used as an parameter for `_.matches` to create the predicate.
     * Pass an `Array` of parameters for `_.matchesProperty` and the predicate will be created using them.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [predicates=[_.identity]]
     *  The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overEvery([Boolean, isFinite]);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => false
     *
     * func(NaN);
     * // => false
     */
    var overEvery = createOver(arrayEvery);

    /**
     * Creates a function that checks if **any** of the `predicates` return
     * truthy when invoked with the arguments it receives.
     *
     * Following shorthands are possible for providing predicates.
     * Pass an `Object` and it will be used as an parameter for `_.matches` to create the predicate.
     * Pass an `Array` of parameters for `_.matchesProperty` and the predicate will be created using them.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [predicates=[_.identity]]
     *  The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overSome([Boolean, isFinite]);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => true
     *
     * func(NaN);
     * // => false
     *
     * var matchesFunc = _.overSome([{ 'a': 1 }, { 'a': 2 }])
     * var matchesPropertyFunc = _.overSome([['a', 1], ['a', 2]])
     */
    var overSome = createOver(arraySome);

    /**
     * Creates a function that returns the value at `path` of a given object.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': 2 } },
     *   { 'a': { 'b': 1 } }
     * ];
     *
     * _.map(objects, _.property('a.b'));
     * // => [2, 1]
     *
     * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
     * // => [1, 2]
     */
    function property(path) {
      return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
    }

    /**
     * The opposite of `_.property`; this method creates a function that returns
     * the value at a given path of `object`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Object} object The object to query.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var array = [0, 1, 2],
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
     * // => [2, 0]
     */
    function propertyOf(object) {
      return function(path) {
        return object == null ? undefined$1 : baseGet(object, path);
      };
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. A step of `-1` is used if a negative
     * `start` is specified without an `end` or `step`. If `end` is not specified,
     * it's set to `start` with `start` then set to `0`.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.rangeRight
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(-4);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    var range = createRange();

    /**
     * This method is like `_.range` except that it populates values in
     * descending order.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.range
     * @example
     *
     * _.rangeRight(4);
     * // => [3, 2, 1, 0]
     *
     * _.rangeRight(-4);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 5);
     * // => [4, 3, 2, 1]
     *
     * _.rangeRight(0, 20, 5);
     * // => [15, 10, 5, 0]
     *
     * _.rangeRight(0, -4, -1);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.rangeRight(0);
     * // => []
     */
    var rangeRight = createRange(true);

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubArray() {
      return [];
    }

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    /**
     * This method returns a new empty object.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Object} Returns the new empty object.
     * @example
     *
     * var objects = _.times(2, _.stubObject);
     *
     * console.log(objects);
     * // => [{}, {}]
     *
     * console.log(objects[0] === objects[1]);
     * // => false
     */
    function stubObject() {
      return {};
    }

    /**
     * This method returns an empty string.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {string} Returns the empty string.
     * @example
     *
     * _.times(2, _.stubString);
     * // => ['', '']
     */
    function stubString() {
      return '';
    }

    /**
     * This method returns `true`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `true`.
     * @example
     *
     * _.times(2, _.stubTrue);
     * // => [true, true]
     */
    function stubTrue() {
      return true;
    }

    /**
     * Invokes the iteratee `n` times, returning an array of the results of
     * each invocation. The iteratee is invoked with one argument; (index).
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.times(3, String);
     * // => ['0', '1', '2']
     *
     *  _.times(4, _.constant(0));
     * // => [0, 0, 0, 0]
     */
    function times(n, iteratee) {
      n = toInteger(n);
      if (n < 1 || n > MAX_SAFE_INTEGER) {
        return [];
      }
      var index = MAX_ARRAY_LENGTH,
          length = nativeMin(n, MAX_ARRAY_LENGTH);

      iteratee = getIteratee(iteratee);
      n -= MAX_ARRAY_LENGTH;

      var result = baseTimes(length, iteratee);
      while (++index < n) {
        iteratee(index);
      }
      return result;
    }

    /**
     * Converts `value` to a property path array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {*} value The value to convert.
     * @returns {Array} Returns the new property path array.
     * @example
     *
     * _.toPath('a.b.c');
     * // => ['a', 'b', 'c']
     *
     * _.toPath('a[0].b.c');
     * // => ['a', '0', 'b', 'c']
     */
    function toPath(value) {
      if (isArray(value)) {
        return arrayMap(value, toKey);
      }
      return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
    }

    /**
     * Generates a unique ID. If `prefix` is given, the ID is appended to it.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {string} [prefix=''] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return toString(prefix) + id;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Adds two numbers.
     *
     * @static
     * @memberOf _
     * @since 3.4.0
     * @category Math
     * @param {number} augend The first number in an addition.
     * @param {number} addend The second number in an addition.
     * @returns {number} Returns the total.
     * @example
     *
     * _.add(6, 4);
     * // => 10
     */
    var add = createMathOperation(function(augend, addend) {
      return augend + addend;
    }, 0);

    /**
     * Computes `number` rounded up to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round up.
     * @param {number} [precision=0] The precision to round up to.
     * @returns {number} Returns the rounded up number.
     * @example
     *
     * _.ceil(4.006);
     * // => 5
     *
     * _.ceil(6.004, 2);
     * // => 6.01
     *
     * _.ceil(6040, -2);
     * // => 6100
     */
    var ceil = createRound('ceil');

    /**
     * Divide two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {number} dividend The first number in a division.
     * @param {number} divisor The second number in a division.
     * @returns {number} Returns the quotient.
     * @example
     *
     * _.divide(6, 4);
     * // => 1.5
     */
    var divide = createMathOperation(function(dividend, divisor) {
      return dividend / divisor;
    }, 1);

    /**
     * Computes `number` rounded down to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round down.
     * @param {number} [precision=0] The precision to round down to.
     * @returns {number} Returns the rounded down number.
     * @example
     *
     * _.floor(4.006);
     * // => 4
     *
     * _.floor(0.046, 2);
     * // => 0.04
     *
     * _.floor(4060, -2);
     * // => 4000
     */
    var floor = createRound('floor');

    /**
     * Computes the maximum value of `array`. If `array` is empty or falsey,
     * `undefined` is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => undefined
     */
    function max(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, baseGt)
        : undefined$1;
    }

    /**
     * This method is like `_.max` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.maxBy(objects, function(o) { return o.n; });
     * // => { 'n': 2 }
     *
     * // The `_.property` iteratee shorthand.
     * _.maxBy(objects, 'n');
     * // => { 'n': 2 }
     */
    function maxBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee, 2), baseGt)
        : undefined$1;
    }

    /**
     * Computes the mean of the values in `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the mean.
     * @example
     *
     * _.mean([4, 2, 8, 6]);
     * // => 5
     */
    function mean(array) {
      return baseMean(array, identity);
    }

    /**
     * This method is like `_.mean` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be averaged.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the mean.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.meanBy(objects, function(o) { return o.n; });
     * // => 5
     *
     * // The `_.property` iteratee shorthand.
     * _.meanBy(objects, 'n');
     * // => 5
     */
    function meanBy(array, iteratee) {
      return baseMean(array, getIteratee(iteratee, 2));
    }

    /**
     * Computes the minimum value of `array`. If `array` is empty or falsey,
     * `undefined` is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => undefined
     */
    function min(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, baseLt)
        : undefined$1;
    }

    /**
     * This method is like `_.min` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.minBy(objects, function(o) { return o.n; });
     * // => { 'n': 1 }
     *
     * // The `_.property` iteratee shorthand.
     * _.minBy(objects, 'n');
     * // => { 'n': 1 }
     */
    function minBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee, 2), baseLt)
        : undefined$1;
    }

    /**
     * Multiply two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {number} multiplier The first number in a multiplication.
     * @param {number} multiplicand The second number in a multiplication.
     * @returns {number} Returns the product.
     * @example
     *
     * _.multiply(6, 4);
     * // => 24
     */
    var multiply = createMathOperation(function(multiplier, multiplicand) {
      return multiplier * multiplicand;
    }, 1);

    /**
     * Computes `number` rounded to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round.
     * @param {number} [precision=0] The precision to round to.
     * @returns {number} Returns the rounded number.
     * @example
     *
     * _.round(4.006);
     * // => 4
     *
     * _.round(4.006, 2);
     * // => 4.01
     *
     * _.round(4060, -2);
     * // => 4100
     */
    var round = createRound('round');

    /**
     * Subtract two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {number} minuend The first number in a subtraction.
     * @param {number} subtrahend The second number in a subtraction.
     * @returns {number} Returns the difference.
     * @example
     *
     * _.subtract(6, 4);
     * // => 2
     */
    var subtract = createMathOperation(function(minuend, subtrahend) {
      return minuend - subtrahend;
    }, 0);

    /**
     * Computes the sum of the values in `array`.
     *
     * @static
     * @memberOf _
     * @since 3.4.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.sum([4, 2, 8, 6]);
     * // => 20
     */
    function sum(array) {
      return (array && array.length)
        ? baseSum(array, identity)
        : 0;
    }

    /**
     * This method is like `_.sum` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be summed.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the sum.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.sumBy(objects, function(o) { return o.n; });
     * // => 20
     *
     * // The `_.property` iteratee shorthand.
     * _.sumBy(objects, 'n');
     * // => 20
     */
    function sumBy(array, iteratee) {
      return (array && array.length)
        ? baseSum(array, getIteratee(iteratee, 2))
        : 0;
    }

    /*------------------------------------------------------------------------*/

    // Add methods that return wrapped values in chain sequences.
    lodash.after = after;
    lodash.ary = ary;
    lodash.assign = assign;
    lodash.assignIn = assignIn;
    lodash.assignInWith = assignInWith;
    lodash.assignWith = assignWith;
    lodash.at = at;
    lodash.before = before;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.castArray = castArray;
    lodash.chain = chain;
    lodash.chunk = chunk;
    lodash.compact = compact;
    lodash.concat = concat;
    lodash.cond = cond;
    lodash.conforms = conforms;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.curry = curry;
    lodash.curryRight = curryRight;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defaultsDeep = defaultsDeep;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.differenceBy = differenceBy;
    lodash.differenceWith = differenceWith;
    lodash.drop = drop;
    lodash.dropRight = dropRight;
    lodash.dropRightWhile = dropRightWhile;
    lodash.dropWhile = dropWhile;
    lodash.fill = fill;
    lodash.filter = filter;
    lodash.flatMap = flatMap;
    lodash.flatMapDeep = flatMapDeep;
    lodash.flatMapDepth = flatMapDepth;
    lodash.flatten = flatten;
    lodash.flattenDeep = flattenDeep;
    lodash.flattenDepth = flattenDepth;
    lodash.flip = flip;
    lodash.flow = flow;
    lodash.flowRight = flowRight;
    lodash.fromPairs = fromPairs;
    lodash.functions = functions;
    lodash.functionsIn = functionsIn;
    lodash.groupBy = groupBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.intersectionBy = intersectionBy;
    lodash.intersectionWith = intersectionWith;
    lodash.invert = invert;
    lodash.invertBy = invertBy;
    lodash.invokeMap = invokeMap;
    lodash.iteratee = iteratee;
    lodash.keyBy = keyBy;
    lodash.keys = keys;
    lodash.keysIn = keysIn;
    lodash.map = map;
    lodash.mapKeys = mapKeys;
    lodash.mapValues = mapValues;
    lodash.matches = matches;
    lodash.matchesProperty = matchesProperty;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.mergeWith = mergeWith;
    lodash.method = method;
    lodash.methodOf = methodOf;
    lodash.mixin = mixin;
    lodash.negate = negate;
    lodash.nthArg = nthArg;
    lodash.omit = omit;
    lodash.omitBy = omitBy;
    lodash.once = once;
    lodash.orderBy = orderBy;
    lodash.over = over;
    lodash.overArgs = overArgs;
    lodash.overEvery = overEvery;
    lodash.overSome = overSome;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.partition = partition;
    lodash.pick = pick;
    lodash.pickBy = pickBy;
    lodash.property = property;
    lodash.propertyOf = propertyOf;
    lodash.pull = pull;
    lodash.pullAll = pullAll;
    lodash.pullAllBy = pullAllBy;
    lodash.pullAllWith = pullAllWith;
    lodash.pullAt = pullAt;
    lodash.range = range;
    lodash.rangeRight = rangeRight;
    lodash.rearg = rearg;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.reverse = reverse;
    lodash.sampleSize = sampleSize;
    lodash.set = set;
    lodash.setWith = setWith;
    lodash.shuffle = shuffle;
    lodash.slice = slice;
    lodash.sortBy = sortBy;
    lodash.sortedUniq = sortedUniq;
    lodash.sortedUniqBy = sortedUniqBy;
    lodash.split = split;
    lodash.spread = spread;
    lodash.tail = tail;
    lodash.take = take;
    lodash.takeRight = takeRight;
    lodash.takeRightWhile = takeRightWhile;
    lodash.takeWhile = takeWhile;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.thru = thru;
    lodash.toArray = toArray;
    lodash.toPairs = toPairs;
    lodash.toPairsIn = toPairsIn;
    lodash.toPath = toPath;
    lodash.toPlainObject = toPlainObject;
    lodash.transform = transform;
    lodash.unary = unary;
    lodash.union = union;
    lodash.unionBy = unionBy;
    lodash.unionWith = unionWith;
    lodash.uniq = uniq;
    lodash.uniqBy = uniqBy;
    lodash.uniqWith = uniqWith;
    lodash.unset = unset;
    lodash.unzip = unzip;
    lodash.unzipWith = unzipWith;
    lodash.update = update;
    lodash.updateWith = updateWith;
    lodash.values = values;
    lodash.valuesIn = valuesIn;
    lodash.without = without;
    lodash.words = words;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.xorBy = xorBy;
    lodash.xorWith = xorWith;
    lodash.zip = zip;
    lodash.zipObject = zipObject;
    lodash.zipObjectDeep = zipObjectDeep;
    lodash.zipWith = zipWith;

    // Add aliases.
    lodash.entries = toPairs;
    lodash.entriesIn = toPairsIn;
    lodash.extend = assignIn;
    lodash.extendWith = assignInWith;

    // Add methods to `lodash.prototype`.
    mixin(lodash, lodash);

    /*------------------------------------------------------------------------*/

    // Add methods that return unwrapped values in chain sequences.
    lodash.add = add;
    lodash.attempt = attempt;
    lodash.camelCase = camelCase;
    lodash.capitalize = capitalize;
    lodash.ceil = ceil;
    lodash.clamp = clamp;
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.cloneDeepWith = cloneDeepWith;
    lodash.cloneWith = cloneWith;
    lodash.conformsTo = conformsTo;
    lodash.deburr = deburr;
    lodash.defaultTo = defaultTo;
    lodash.divide = divide;
    lodash.endsWith = endsWith;
    lodash.eq = eq;
    lodash.escape = escape;
    lodash.escapeRegExp = escapeRegExp;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.floor = floor;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.get = get;
    lodash.gt = gt;
    lodash.gte = gte;
    lodash.has = has;
    lodash.hasIn = hasIn;
    lodash.head = head;
    lodash.identity = identity;
    lodash.includes = includes;
    lodash.indexOf = indexOf;
    lodash.inRange = inRange;
    lodash.invoke = invoke;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isArrayBuffer = isArrayBuffer;
    lodash.isArrayLike = isArrayLike;
    lodash.isArrayLikeObject = isArrayLikeObject;
    lodash.isBoolean = isBoolean;
    lodash.isBuffer = isBuffer;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isEqualWith = isEqualWith;
    lodash.isError = isError;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isInteger = isInteger;
    lodash.isLength = isLength;
    lodash.isMap = isMap;
    lodash.isMatch = isMatch;
    lodash.isMatchWith = isMatchWith;
    lodash.isNaN = isNaN;
    lodash.isNative = isNative;
    lodash.isNil = isNil;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isObjectLike = isObjectLike;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isSafeInteger = isSafeInteger;
    lodash.isSet = isSet;
    lodash.isString = isString;
    lodash.isSymbol = isSymbol;
    lodash.isTypedArray = isTypedArray;
    lodash.isUndefined = isUndefined;
    lodash.isWeakMap = isWeakMap;
    lodash.isWeakSet = isWeakSet;
    lodash.join = join;
    lodash.kebabCase = kebabCase;
    lodash.last = last;
    lodash.lastIndexOf = lastIndexOf;
    lodash.lowerCase = lowerCase;
    lodash.lowerFirst = lowerFirst;
    lodash.lt = lt;
    lodash.lte = lte;
    lodash.max = max;
    lodash.maxBy = maxBy;
    lodash.mean = mean;
    lodash.meanBy = meanBy;
    lodash.min = min;
    lodash.minBy = minBy;
    lodash.stubArray = stubArray;
    lodash.stubFalse = stubFalse;
    lodash.stubObject = stubObject;
    lodash.stubString = stubString;
    lodash.stubTrue = stubTrue;
    lodash.multiply = multiply;
    lodash.nth = nth;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.pad = pad;
    lodash.padEnd = padEnd;
    lodash.padStart = padStart;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.repeat = repeat;
    lodash.replace = replace;
    lodash.result = result;
    lodash.round = round;
    lodash.runInContext = runInContext;
    lodash.sample = sample;
    lodash.size = size;
    lodash.snakeCase = snakeCase;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.sortedIndexBy = sortedIndexBy;
    lodash.sortedIndexOf = sortedIndexOf;
    lodash.sortedLastIndex = sortedLastIndex;
    lodash.sortedLastIndexBy = sortedLastIndexBy;
    lodash.sortedLastIndexOf = sortedLastIndexOf;
    lodash.startCase = startCase;
    lodash.startsWith = startsWith;
    lodash.subtract = subtract;
    lodash.sum = sum;
    lodash.sumBy = sumBy;
    lodash.template = template;
    lodash.times = times;
    lodash.toFinite = toFinite;
    lodash.toInteger = toInteger;
    lodash.toLength = toLength;
    lodash.toLower = toLower;
    lodash.toNumber = toNumber;
    lodash.toSafeInteger = toSafeInteger;
    lodash.toString = toString;
    lodash.toUpper = toUpper;
    lodash.trim = trim;
    lodash.trimEnd = trimEnd;
    lodash.trimStart = trimStart;
    lodash.truncate = truncate;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;
    lodash.upperCase = upperCase;
    lodash.upperFirst = upperFirst;

    // Add aliases.
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.first = head;

    mixin(lodash, (function() {
      var source = {};
      baseForOwn(lodash, function(func, methodName) {
        if (!hasOwnProperty.call(lodash.prototype, methodName)) {
          source[methodName] = func;
        }
      });
      return source;
    }()), { 'chain': false });

    /*------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type {string}
     */
    lodash.VERSION = VERSION;

    // Assign default placeholders.
    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
      lodash[methodName].placeholder = lodash;
    });

    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
    arrayEach(['drop', 'take'], function(methodName, index) {
      LazyWrapper.prototype[methodName] = function(n) {
        n = n === undefined$1 ? 1 : nativeMax(toInteger(n), 0);

        var result = (this.__filtered__ && !index)
          ? new LazyWrapper(this)
          : this.clone();

        if (result.__filtered__) {
          result.__takeCount__ = nativeMin(n, result.__takeCount__);
        } else {
          result.__views__.push({
            'size': nativeMin(n, MAX_ARRAY_LENGTH),
            'type': methodName + (result.__dir__ < 0 ? 'Right' : '')
          });
        }
        return result;
      };

      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
        return this.reverse()[methodName](n).reverse();
      };
    });

    // Add `LazyWrapper` methods that accept an `iteratee` value.
    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
      var type = index + 1,
          isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;

      LazyWrapper.prototype[methodName] = function(iteratee) {
        var result = this.clone();
        result.__iteratees__.push({
          'iteratee': getIteratee(iteratee, 3),
          'type': type
        });
        result.__filtered__ = result.__filtered__ || isFilter;
        return result;
      };
    });

    // Add `LazyWrapper` methods for `_.head` and `_.last`.
    arrayEach(['head', 'last'], function(methodName, index) {
      var takeName = 'take' + (index ? 'Right' : '');

      LazyWrapper.prototype[methodName] = function() {
        return this[takeName](1).value()[0];
      };
    });

    // Add `LazyWrapper` methods for `_.initial` and `_.tail`.
    arrayEach(['initial', 'tail'], function(methodName, index) {
      var dropName = 'drop' + (index ? '' : 'Right');

      LazyWrapper.prototype[methodName] = function() {
        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
      };
    });

    LazyWrapper.prototype.compact = function() {
      return this.filter(identity);
    };

    LazyWrapper.prototype.find = function(predicate) {
      return this.filter(predicate).head();
    };

    LazyWrapper.prototype.findLast = function(predicate) {
      return this.reverse().find(predicate);
    };

    LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
      if (typeof path == 'function') {
        return new LazyWrapper(this);
      }
      return this.map(function(value) {
        return baseInvoke(value, path, args);
      });
    });

    LazyWrapper.prototype.reject = function(predicate) {
      return this.filter(negate(getIteratee(predicate)));
    };

    LazyWrapper.prototype.slice = function(start, end) {
      start = toInteger(start);

      var result = this;
      if (result.__filtered__ && (start > 0 || end < 0)) {
        return new LazyWrapper(result);
      }
      if (start < 0) {
        result = result.takeRight(-start);
      } else if (start) {
        result = result.drop(start);
      }
      if (end !== undefined$1) {
        end = toInteger(end);
        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
      }
      return result;
    };

    LazyWrapper.prototype.takeRightWhile = function(predicate) {
      return this.reverse().takeWhile(predicate).reverse();
    };

    LazyWrapper.prototype.toArray = function() {
      return this.take(MAX_ARRAY_LENGTH);
    };

    // Add `LazyWrapper` methods to `lodash.prototype`.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
          isTaker = /^(?:head|last)$/.test(methodName),
          lodashFunc = lodash[isTaker ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName],
          retUnwrapped = isTaker || /^find/.test(methodName);

      if (!lodashFunc) {
        return;
      }
      lodash.prototype[methodName] = function() {
        var value = this.__wrapped__,
            args = isTaker ? [1] : arguments,
            isLazy = value instanceof LazyWrapper,
            iteratee = args[0],
            useLazy = isLazy || isArray(value);

        var interceptor = function(value) {
          var result = lodashFunc.apply(lodash, arrayPush([value], args));
          return (isTaker && chainAll) ? result[0] : result;
        };

        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
          // Avoid lazy use if the iteratee has a "length" value other than `1`.
          isLazy = useLazy = false;
        }
        var chainAll = this.__chain__,
            isHybrid = !!this.__actions__.length,
            isUnwrapped = retUnwrapped && !chainAll,
            onlyLazy = isLazy && !isHybrid;

        if (!retUnwrapped && useLazy) {
          value = onlyLazy ? value : new LazyWrapper(this);
          var result = func.apply(value, args);
          result.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined$1 });
          return new LodashWrapper(result, chainAll);
        }
        if (isUnwrapped && onlyLazy) {
          return func.apply(this, args);
        }
        result = this.thru(interceptor);
        return isUnwrapped ? (isTaker ? result.value()[0] : result.value()) : result;
      };
    });

    // Add `Array` methods to `lodash.prototype`.
    arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
      var func = arrayProto[methodName],
          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
          retUnwrapped = /^(?:pop|shift)$/.test(methodName);

      lodash.prototype[methodName] = function() {
        var args = arguments;
        if (retUnwrapped && !this.__chain__) {
          var value = this.value();
          return func.apply(isArray(value) ? value : [], args);
        }
        return this[chainName](function(value) {
          return func.apply(isArray(value) ? value : [], args);
        });
      };
    });

    // Map minified method names to their real names.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var lodashFunc = lodash[methodName];
      if (lodashFunc) {
        var key = lodashFunc.name + '';
        if (!hasOwnProperty.call(realNames, key)) {
          realNames[key] = [];
        }
        realNames[key].push({ 'name': methodName, 'func': lodashFunc });
      }
    });

    realNames[createHybrid(undefined$1, WRAP_BIND_KEY_FLAG).name] = [{
      'name': 'wrapper',
      'func': undefined$1
    }];

    // Add methods to `LazyWrapper`.
    LazyWrapper.prototype.clone = lazyClone;
    LazyWrapper.prototype.reverse = lazyReverse;
    LazyWrapper.prototype.value = lazyValue;

    // Add chain sequence methods to the `lodash` wrapper.
    lodash.prototype.at = wrapperAt;
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.commit = wrapperCommit;
    lodash.prototype.next = wrapperNext;
    lodash.prototype.plant = wrapperPlant;
    lodash.prototype.reverse = wrapperReverse;
    lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

    // Add lazy aliases.
    lodash.prototype.first = lodash.prototype.head;

    if (symIterator) {
      lodash.prototype[symIterator] = wrapperToIterator;
    }
    return lodash;
  });

  /*--------------------------------------------------------------------------*/

  // Export lodash.
  var _ = runInContext();

  // Some AMD build optimizers, like r.js, check for condition patterns like:
  if (freeModule) {
    // Export for Node.js.
    (freeModule.exports = _)._ = _;
    // Export for CommonJS support.
    freeExports._ = _;
  }
  else {
    // Export to the global object.
    root._ = _;
  }
}.call(commonjsGlobal));
});

var header = {
	color: "red",
	backgroundColor: "red",
	activeColor: "red",
	btnList: [
		{
			btnKey: "ade5d065a113432e8091a1c5bc819c57-934f270c08b14e928bf0c2ae8e1a937d-header-0",
			iconId: "deviceID",
			part: "left",
			defaultActive: 1,
			isrender: 1,
			themeId: "934f270c08b14e928bf0c2ae8e1a937d"
		},
		{
			btnKey: "ade5d065a113432e8091a1c5bc819c57-934f270c08b14e928bf0c2ae8e1a937d-header-1",
			iconId: "deviceName",
			part: "left",
			defaultActive: 1,
			isrender: 1,
			themeId: "934f270c08b14e928bf0c2ae8e1a937d"
		}
	]
};
var footer = {
	color: "blue",
	backgroundColor: "blue",
	activeColor: "blue",
	btnList: [
		{
			btnKey: "ade5d065a113432e8091a1c5bc819c57-934f270c08b14e928bf0c2ae8e1a937d-footer-0",
			iconId: "play",
			part: "left",
			defaultActive: 0,
			isrender: 0,
			themeId: "934f270c08b14e928bf0c2ae8e1a937d"
		}
	]
};
var defaultTheme = {
	header: header,
	footer: footer
};

var TimeLine$1 = function (jsPlugin) {
        this.jsPlugin = jsPlugin;
        var status = {
            isMouseDown: false, // 鼠标是否按下
            isOver: false, // 鼠标是否悬浮在进度条上
            mousePosition: null,
            oldTime: null,
            nowTime: null,
            moved: null,
            hoverTime: '2018-12-07 12:00:00',
            hoverLeft: 0,
            timeTipShow: false,
            randomNum: 123,
            timeWidthTbls: [60, 1800, 3600, 86400, 259200], // 时间宽度单位（秒）
            timeUnits: [
                '范围: 1分钟; 单位: 秒',
                '范围: 30分钟; 单位: 分钟',
                '范围: 1小时; 单位: 分钟',
                '范围: 1天; 单位: 小时',
                '范围: 3天; 单位: 小时'
            ], // 时间单位
            drawPen: null,
            timeSection: [],
            canvasWidth: null,
            canvasHeight: null,
            timeTips: null
        };
        // Object.keys(status).forEach(element => {
        //     this[element] = status[element];
        // });
        var _this = this;
        Object.keys(status).forEach(function(element){
            _this[element] = status[element];
        });
        this.options = {
            width: this.canvasWidth, 
            height: 48,
            time: new Date().getTime(), //new Date("2019-10-31 00:00:00"),//
            timeSection: [],
            timeWidth: 0 // 0-3
        };
        TimeLine$1.prototype.subTime = function (time) {
            if (time < 10) {
                return '0' + time;
            } else {
                return time;
            }
        };
        TimeLine$1.prototype.tranTime = function(time) {
            var stringTime = time;
            if (time) {
                var newDate = new Date(time);
                stringTime =
                    newDate.getFullYear() +
                    '/' +
                    (newDate.getMonth() + 1) +
                    '/' +
                    newDate.getDate() +
                    ' ' +
                    this.subTime(newDate.getHours()) +
                    ':' +
                    this.subTime(newDate.getMinutes()) +
                    ':' +
                    this.subTime(newDate.getSeconds());
            }
            return stringTime;
        };
        TimeLine$1.prototype.init = function (params) {
            // document.getElementsByTagName("html")[0].addEventListener("mouseup", this.mouseUpFn(e,params.));
            if(params.width) {
                document.getElementById(params.id).setAttribute("width", parseInt(params.width,10) + 'px');
            }
            var that = this;
            var opts = this.options;
            that.randomNum = (Math.random() + '').split('.').join('');
            that.timeWidthTblIndex = opts.timeWidth; // 当前使用时间宽度索引

            // 12-10
            //that.drawPanal = this.$refs.drawPanal;
            var canvas = document.querySelector(`#${this.jsPlugin.id}-canvas`);
            that.drawPen = canvas.getContext('2d');
            that.nowTime = opts.time || Date.now(); // 当前时间点
            that.timeSection = opts.timeSection || []; // 时间段记录区间
            that.canvasWidth = canvas.offsetWidth;
            that.canvasHeight = canvas.offsetHeight;
            that.updata(); // 展示进度条
            // 事件监听
            document.getElementById(`${this.jsPlugin.id}-canvas`).addEventListener('mousemove', function(e){
                if(that.options.readOnly){ 
                    return;
                }
                that.mousemove(e);
            });
            document.getElementById(`${this.jsPlugin.id}-canvas`).addEventListener('mouseover',function(e){
                if(that.options.readOnly){ 
                    return;
                }
                that.mouseover(e);
            });
            document.getElementById(`${this.jsPlugin.id}-canvas`).addEventListener('mouseleave',function(e){
                if(that.options.readOnly){ 
                    return;
                }
                that.mouseleave(e);
            });
            document.getElementById(`${this.jsPlugin.id}-canvas`).addEventListener('mousedown',function(e){
                if(that.options.readOnly){ 
                    return;
                }
                that.mousedown(e);
            });
            document.getElementById(`${this.jsPlugin.id}-canvas`).addEventListener('mouseup',function(e){
                if(that.options.readOnly){ 
                    return;
                }
                //debugger
                var callback = params.onChange;
                that.mouseUpFn(e,callback);
            });
        };
        TimeLine$1.prototype.mousemove = function (e) {
            //  console.log("鼠标移动",e)
            if (this.isMouseDown && this.isOver) {
                var mouseOffset = this.mousePosition - e.pageX;
                // fix点击引起mousemove的问题
                if (mouseOffset === 0) {
                    return;
                }
                var timeOffsetUnit = 0;
                switch(this.timeWidth){
                    case 60:
                        timeOffsetUnit = 1 / 10;
                        break;
                    case 1800:
                        timeOffsetUnit = 1 / 20 * 60;
                        break;
                    case 3600:
                        timeOffsetUnit = 1 / 20 * 60;
                        break;
                    case 86400:
                        //timeOffset = 
                        timeOffsetUnit = 1 / 30 * 60 * 60;
                        break;
                }
                var currentTime = new Date(this.oldTime).getTime() +(mouseOffset * timeOffsetUnit * 1000);
                //console.log("rurrentTime",this.oldTime,mouseOffset,currentTime,new Date(currentTime))
                //console.log("currentTime", new Date(currentTime))
                // var currentTime =
                //     this.oldTime +
                //     (mouseOffset / this.canvasWidth) *
                //     this.timeWidth *
                //     1000;
                   // console.log("currentTime",new Date(this.oldTime), new Date(currentTime))
                this.updata({ time: currentTime });
                this.moved = true;
            } else {
                // 12-10
                //var { left, top } = this.$utils.getOffset(this.$refs.drawPanal);
                
                var left = parseInt(document.getElementById(`${this.jsPlugin.id}-canvas-container`).offsetLeft,10);
                //12 -10
                this.mousePosition = e.pageX - left;
                this.updata(); // 更新画面
            }
        };
        TimeLine$1.prototype.mousedown = function (e) {
            this.isMouseDown = true;
            this.mousePosition = e.pageX;
            this.oldTime = this.nowTime;
            // this.$emit('drag', true);
        };
        TimeLine$1.prototype.mouseover = function (e) {
            this.isOver = true;
        };
        TimeLine$1.prototype.mouseleave = function (e) {
            this.isOver = false;
            this.isMouseDown = false;
            this.updata();
        };
        TimeLine$1.prototype.changeSize = function (timeWidth) {
            console.log("changeSize",timeWidth);
            // if (w) {
            //     this.options.width = w;
            //     this.canvasWidth = w;
            // }
            // if (h) {
            //     this.options.height = h;
            //     this.canvasHeight = h;
            // }
            // console.log("tehis.optiosn",this.options)
            this.options.timeWidth = timeWidth;
            this.updata({timeWidth: timeWidth});
            // this.$nextTick(() => {
            //     this.updata();
            // });
        };
        TimeLine$1.prototype.mouseUpFn = function (e,callback) {
            if (this.isMouseDown) {
                this.isMouseDown = false;
                if (this.moved) {
                    this.moved = false;
                    //12 -10
                    // this.$emit('change', [
                    //     parseInt(this.nowTime),
                    //     parseInt(this.oldTime)
                    // ]);
                    this.updata({ time: this.nowTime });
                    this.oldTime = this.nowTime;
                    callback(this.nowTime);
                }
            }
        };
        TimeLine$1.prototype.readOnly = function (data) {
            console.log("更改为只读");
            this.options.readOnly = true;
            document.getElementById(`${this.jsPlugin.id}-canvas`).style.cursor = "not-allowed";
        };
        TimeLine$1.prototype.unReadOnly = function (data) {
            console.log("更改为只读");
            this.options.readOnly = false;
            document.getElementById(`${this.jsPlugin.id}-canvas`).style.cursor = "pointer";
        };
        TimeLine$1.prototype.run = function (data) {
            if (!this.isMouseDown) {
                this.updata(data);
            }
        };
        TimeLine$1.prototype.getTime = function (data) {
            console.log("this",this);
            console.log("当前时间",new Date(this.nowTime));
        };
        TimeLine$1.prototype.updata = function (data) {
            var that = this;
            data = data || {};
            that.nowTime = data.time || that.nowTime;
            that.timeSection = data.timeSection || that.timeSection;
            that.timeWidthTblIndex = data.timeWidth || that.timeWidthTblIndex;
            that.timeWidth = that.timeWidthTbls[data.timeWidth || that.timeWidthTblIndex];
            that.timeUnit = that.timeUnits[data.timeWidth || that.timeWidthTblIndex];
            if (data.timeWidth === 0) {
                that.timeWidthTblIndex = 0;
                that.timeWidth = that.timeWidthTbls[0];
                that.timeUnit = that.timeUnits[0];
            }
            that.drawPen.fillStyle = '#000000';
            that.drawPen.fillRect(0, 0, that.canvasWidth, that.canvasHeight);
            that.drawScale(); // 画刻度
            that.drawRecord(); // 画录像区间
            that.drawOtherMsg(); // 画录像的其他信息
            // 12-10
            //that.$emit('update-time', that.nowTime);
            document.getElementById(`${this.jsPlugin.id}-canvas-container`).style.width = this.options.width + 'px';
            document.getElementById(`${this.jsPlugin.id}-canvas`).style.width = this.options.width + 'px';
            document.getElementById(`${this.jsPlugin.id}-canvas-container`).style.height = this.options.height + 'px';
            document.getElementById(`${this.jsPlugin.id}-canvas`).style.height = this.options.height + 'px';
        };
        TimeLine$1.prototype.drawSolidLine = function (startX, startY, endX, endY, lineWidth, color) {
            this.drawPen.save();
            this.drawPen.strokeStyle = color;
            this.drawPen.lineWidth = lineWidth;
            this.drawPen.beginPath();
            this.drawPen.moveTo(startX, startY);
            this.drawPen.lineTo(endX, endY);
            this.drawPen.stroke();
            this.drawPen.restore();
        };
        TimeLine$1.prototype.drawString = function (text, x, y, aling, color) {
            this.drawPen.font = '12px serif';
            this.drawPen.fillStyle = '#ffffff';
            this.drawPen.textAlign = aling || 'left';
            this.drawPen.fillText(text, x, y + 10);
        };
        TimeLine$1.prototype.drawScale = function () {
            // console.log("drawScale",new Date(this.nowTime))
            var that = this;
            var lineColor = 'rgba(255,255,255)';
            //that.nowTime = new Date("2019-12-31 01:50:00")
            var startDate = new Date(that.nowTime); // 开始时间
            var startYears = startDate.getFullYear(); // 起始的秒数
            var starSecond = startDate.getSeconds(); // 起始的秒数
            var starMin = startDate.getMinutes(); // 起始的分钟数
            var startHours = startDate.getHours(); // 起始的小时
            var startDay = startDate.getDate(); // 起始的日期
            //console.log("startDay",startDay)
            var OffsetLeft = starMin * 60 + starSecond; // 偏移量
           // debugger;
            var curScale = 0; // 计算时间点
            switch (that.timeWidth) {
                case 60: {
                    // debugger
                    var dotNum = parseInt(that.canvasWidth / 10); // 每10像素一个点
                    startDate.setSeconds(startDate.getSeconds() - parseInt(dotNum /2,10)); // 从现在时间的一半开始画起
                    startDay = startDate.getDate();
                    startHours = startDate.getHours();
                    starMin = startDate.getMinutes();
                    starSecond = startDate.getSeconds();
                    // console.log("domNum",dotNum);
                    // console.log("starSecond",starSecond)
                    for (var i = 0; i < dotNum; i++) {
                        // debugger;
                        // debugger;
                        // console.log("starSecond",starSecond,curScale)
                        curScale = starSecond + i;
                        startDate.setSeconds(curScale);
                        // debugger;
                        //debugger;
                       // console.log("startDate",startDate,curScale)
                        // 每一个整10秒画一次线和文字
                        if (curScale % 10 === 0) {
                            that.drawSolidLine(
                                (i * that.canvasWidth) / dotNum,
                                8,
                                (i * that.canvasWidth) / dotNum ,
                                (that.canvasHeight / 5) + 8,
                                1,
                                lineColor
                            );
                            var timeString =
                                this.subTime(startDate.getHours()) +
                                ':' +
                                this.subTime(startDate.getMinutes()) +
                                ':' +
                                this.subTime(startDate.getSeconds());
                            that.drawString(
                                timeString,
                                (i * that.canvasWidth) / dotNum,
                                (that.canvasHeight / 5) * 2.5,
                                'center',
                                'rgba(255,255,255,0.3)'
                            );
                           // console.log("timeString",timeString)
                        } else {
                           // console.log("画短线",(i * that.canvasWidth) / 60,0,(i * that.canvasWidth) / 60,(that.canvasHeight / 5) * 0.5,1)
                            // 只画一次线
                            that.drawSolidLine(
                                (i * that.canvasWidth) / dotNum,
                                8,
                                (i * that.canvasWidth) / dotNum,
                                (that.canvasHeight / 5) * 0.5 + 8,
                                1,
                                lineColor
                            );
                        }
                        /**
                         * 偏移距离超过60，setSeconds会每次累加1到分钟，因此绘图完成后需要复原到当前分钟，再次计算偏移
                         */
                        startDate.setDate(startDay);
                        startDate.setHours(startHours);
                        startDate.setMinutes(starMin);
                    }
                    // for (var i = 0; i < 60; i++) {
                    //     curScale = starSecond + i;
                    //     if (curScale > 60) {
                    //         curScale = curScale - 60;
                    //     }
                    //     startDate.setSeconds(curScale);
                    //     // 每一个整10秒画一次线和文字
                    //     if (curScale % 10 === 0) {
                    //         that.drawSolidLine(
                    //             (i * that.canvasWidth) / 60,
                    //             0,
                    //             (i * that.canvasWidth) / 60,
                    //             (that.canvasHeight / 5) * 1.5,
                    //             1,
                    //             lineColor
                    //         );
                    //         var timeString =
                    //             this.subTime(startDate.getHours()) +
                    //             ':' +
                    //             this.subTime(startDate.getMinutes()) +
                    //             ':' +
                    //             this.subTime(startDate.getSeconds());
                    //         that.drawString(
                    //             timeString,
                    //             (i * that.canvasWidth) / 60,
                    //             (that.canvasHeight / 5) * 2.5,
                    //             'center',
                    //             'rgba(255,255,255,0.3)'
                    //         );
                    //     } else {
                    //         // 只画一次线
                    //         that.drawSolidLine(
                    //             (i * that.canvasWidth) / 60,
                    //             0,
                    //             (i * that.canvasWidth) / 60,
                    //             (that.canvasHeight / 5) * 0.5,
                    //             1,
                    //             lineColor
                    //         );
                    //     }
                    // }
                    break;
                }
                case 1800: {
                    // 30分钟
                    var dotNum = parseInt(that.canvasWidth / 20); // 每10像素一个点
                    startDate.setMinutes(startDate.getMinutes() - parseInt(dotNum / 2,10));
                    // starSecond = startDate.getSeconds();
                    startHours = startDate.getHours();
                    starMin = startDate.getMinutes();
                    //console.log("dotNum",dotNum,starMin)
                    for (var i = 0; i <= dotNum; i++) {
                        curScale = starMin + i;
                        //console.log("curScale",curScale)
                        // if (curScale > 60) {
                        //     curScale = curScale - 60;
                        // }
                        startDate.setMinutes(curScale);
                        if (curScale % 5 === 0) {
                            that.drawSolidLine(
                                (i * that.canvasWidth) / dotNum,
                                8,
                                (i * that.canvasWidth) / dotNum,
                                (that.canvasHeight / 5) * 1.5 + 8,
                                1,
                                lineColor
                            );

                            var timeString =
                                this.subTime(startDate.getHours()) +
                                ':' +
                                this.subTime(startDate.getMinutes());
                            that.drawString(
                                timeString,
                                (i * that.canvasWidth) / dotNum,
                                (that.canvasHeight / 5) * 2.5,
                                'center',
                                'rgba(255,255,255,0.3)'
                            );
                        } else {
                            // console.log("画短线",((i - starMin) * that.canvasWidth) / dotNum)
                            that.drawSolidLine(
                                (i * that.canvasWidth) / dotNum,
                                8,
                                (i * that.canvasWidth) / dotNum,
                                (that.canvasHeight / 5) * 0.5 + 8,
                                1,
                                lineColor
                            );
                        }
                        startDate.setHours(startHours);
                        // startDate.setMinutes(starMin);
                    }
                    // for (var i = 0; i <= 30; i++) {
                    //     curScale = starMin + i;
                    //     if (curScale > 60) {
                    //         curScale = curScale - 60;
                    //     }
                    //     startDate.setMinutes(curScale);
                    //     if (curScale % 5 === 0) {
                    //         that.drawSolidLine(
                    //             ((i * 60 - starSecond) * that.canvasWidth) / 1800,
                    //             0,
                    //             ((i * 60 - starSecond) * that.canvasWidth) / 1800,
                    //             (that.canvasHeight / 5) * 1.5,
                    //             1,
                    //             lineColor
                    //         );

                    //         var timeString =
                    //             this.subTime(startDate.getHours()) +
                    //             ':' +
                    //             this.subTime(startDate.getMinutes());
                    //         that.drawString(
                    //             timeString,
                    //             ((i * 60 - starSecond) * that.canvasWidth) / 1800,
                    //             (that.canvasHeight / 5) * 2.5,
                    //             'center',
                    //             'rgba(255,255,255,0.3)'
                    //         );
                    //     } else {
                    //         that.drawSolidLine(
                    //             ((i * 60 - starSecond) * that.canvasWidth) / 1800,
                    //             0,
                    //             ((i * 60 - starSecond) * that.canvasWidth) / 1800,
                    //             (that.canvasHeight / 5) * 0.5,
                    //             1,
                    //             lineColor
                    //         );
                    //     }
                    // }
                    break;
                }
                case 3600: {
                    // 60分钟
                    var dotNum = parseInt(that.canvasWidth / 20); // 每10像素一个点
                    startDate.setMinutes(startDate.getMinutes() - parseInt(dotNum / 2,10));
                    startHours = startDate.getHours();
                    starMin = startDate.getMinutes();
                    for (var i = 0; i <= dotNum; i++) {
                        curScale = starMin + i;
                        // if (curScale > 60) {
                        //     curScale = curScale - 60;
                        // }
                        startDate.setMinutes(curScale);
                        if (curScale % 10 === 0) {
                            that.drawSolidLine(
                                ((i ) * that.canvasWidth) / dotNum,
                                8,
                                ((i ) * that.canvasWidth) / dotNum,
                                (that.canvasHeight / 5) * 1.5 + 8,
                                1,
                                lineColor
                            );

                            var timeString =
                                this.subTime(startDate.getHours()) +
                                ':' +
                                this.subTime(startDate.getMinutes());
                            that.drawString(
                                timeString,
                                ((i  ) * that.canvasWidth) / dotNum,
                                (that.canvasHeight / 5) * 2.5,
                                'center',
                                'rgba(255,255,255,0.3)'
                            );
                        } else {
                            that.drawSolidLine(
                                ((i) * that.canvasWidth) / dotNum,
                                8,
                                ((i) * that.canvasWidth) / dotNum,
                                (that.canvasHeight / 5) * 0.5 + 8,
                                1,
                                lineColor
                            );
                        }
                        startDate.setHours(startHours);
                    }
                    break;
                }
                case 86400: {
                    var dotNum = parseInt(that.canvasWidth / 30); // 每10像素一个点
                    // 1天，24小时
                    //console.log("dotNum",dotNum);
                    //startDate.setDate(startDay  - parseInt(dotNum / 2,10));
                    startDate.setHours(startDate.getHours()  - parseInt(dotNum / 2,10));
                    // console.log("startDat111e",startDate);

                    // debugger;
                    starSecond = startDate.getSeconds();
                    starMin = startDate.getMinutes();
                    startHours = startDate.getHours();
                    startDay = startDate.getDate();
                    startYears = startDate.getFullYear();
                    for (var i = 0; i <= dotNum; i++) {
                        curScale = startHours + i;
                        // if (curScale >= 24) {
                        //     curScale = curScale - 24;
                        // }
                        startDate.setHours(curScale);
                        var timeString;
                        // 不等于24的时候，画短线
                        //console.log("curScale",curScale)
                        if (curScale % 24 !=0) {
                          //  console.log("curScale",curScale)
                            timeString = this.subTime(startDate.getHours()) + ":00";
                           // timeString = startDate.toLocaleDateString();
                           // debugger
                            that.drawSolidLine(
                                ((i ) * that.canvasWidth) /
                                dotNum,
                                8,
                                ((i ) * that.canvasWidth) /
                                dotNum,
                                (that.canvasHeight / 5) * 0.5 + 8,
                                1,
                                lineColor
                            );
                        } else {
                            // debugger;
                            // console.log("画图")
                            // 不等于24的时候，画长线
                            timeString = startDate.toLocaleDateString();
                            // console.log("startDatestartDate",startDate,i)
                            // debugger;
                            that.drawSolidLine(
                                ((i ) * that.canvasWidth) /
                                dotNum,
                                8,
                                ((i) * that.canvasWidth) /
                                dotNum,
                                (that.canvasHeight / 5) * 1 + 8,
                                1,
                                lineColor
                            );
                        }
                        // 每2个小时一个时间文字
                        if (curScale % 2 === 0) {
                            that.drawString(
                                timeString,
                                ((i) * that.canvasWidth) /
                                dotNum,
                                (that.canvasHeight / 5) * 2,
                                'center',
                                'rgba(255,255,255,0.3)'
                            );
                        }
                       // console.log("startDay",startDay)
                    //    startDate.setDate(startDay);
                      startDate.setFullYear(startYears);
                      startDate.setDate(startDay);
                      startDate.setHours(startHours);
                    //   startDate.setTime(that.nowTime);
                    //   console.log("haha21",startDay,that.nowTime)
                    //   console.log("haha",startDate)
                    }
                    break;
                }
                case 259200: {
                    // 3天
                    startDate.setHours(startDate.getHours() - 36);
                    starSecond = startDate.getSeconds();
                    starMin = startDate.getMinutes();
                    startHours = startDate.getHours();
                    OffsetLeft = starMin * 60 + starSecond;
                    for (var i = 0; i <= 72; i++) {
                        curScale = startHours + i;
                        if (curScale >= 24) {
                            curScale = curScale % 24;
                        }
                        if (curScale === 0) {
                            startDate.setHours(24);
                        } else {
                            startDate.setHours(curScale);
                        }

                        var timeString = this.subTime(startDate.getHours());

                        if (curScale % 3 === 0) {
                            // 每3天一个时间文字和刻度
                            if (!curScale) {
                                timeString = startDate.toLocaleDateString();
                            }
                            that.drawString(
                                timeString,
                                ((i * 3600 - OffsetLeft) * that.canvasWidth) /
                                259200,
                                (that.canvasHeight / 5) * 2.5,
                                'center',
                                'rgba(255,255,255,0.3)'
                            );

                            that.drawSolidLine(
                                ((i * 3600 - OffsetLeft) * that.canvasWidth) /
                                259200,
                                0,
                                ((i * 3600 - OffsetLeft) * that.canvasWidth) /
                                259200,
                                (that.canvasHeight / 5) * 1,
                                1,
                                lineColor
                            );
                        } else {
                            that.drawSolidLine(
                                ((i * 3600 - OffsetLeft) * that.canvasWidth) /
                                259200,
                                0,
                                ((i * 3600 - OffsetLeft) * that.canvasWidth) /
                                259200,
                                (that.canvasHeight / 5) * 0.5,
                                1,
                                lineColor
                            );
                        }
                    }
                    break;
                }
            }
        };
        TimeLine$1.prototype.getRecord = function (timeArr,startTime,endTime) {
            console.log("timeArr,startTime,endTime",timeArr,startTime,endTime);
            // if(timeArr.length > 0 && startTime) {
            //     if(timeArr[0].startTime < startTime) {
            //         timeArr[0].startTime = startTime;
            //     }
            // }
            // if(timeArr.length > 0 && endTime) {
            //     if(timeArr[timeArr.length-1].endTime > endTime) {
            //         timeArr[timeArr.length-1].endTime = endTime;
            //     }
            // }
            this.timeSection = timeArr;
            this.drawRecord();
        };
        TimeLine$1.prototype.drawRecord = function () {
            var timeArr = this.timeSection || [];
            var that = this;
            var drawPen = that.drawPen;

            // var startDate = new Date(that.nowTime);
            // var timeScale = that.canvasWidth / that.timeWidth;

            // 根据时间查找当前位置
            for(var i =0;i<timeArr.length;i++){
                //console.log("timeArr[i]",timeArr[i],findPosition(timeArr[i].startTime),findPosition(timeArr[i].endTime))
                var startPosition = findPosition(timeArr[i].startTime);
                var endPosition = findPosition(timeArr[i].endTime);
                drawPen.fillStyle = '#1890ff80';
                drawPen.fillRect(
                    startPosition,
                    0,
                    endPosition-startPosition,
                    48
                );
            }

            function findPosition(time){
               var scale = 10;
               switch(that.timeWidth){
                   case 60: 
                   scale = 10;
                   break;
                   case 1800: 
                   scale = 20 / 60;
                   break;
                   case 3600: 
                   scale = 20 / 60;
                   break;
                   case 86400: 
                   scale = 20 / 60 /60;
                   break;
               }
               var nowTimePostion = that.canvasWidth/2; //总宽度一半
               var position =  nowTimePostion + (time - that.nowTime) / 1000 * scale;
               if(position > that.canvasWidth){
                   position = that.canvasWidth;
               }
               if(position <=0){
                   position = 0;
               }
               return position;
            }
            // switch (that.timeWidth) {
            //     case 60: {
            //         startDate.setSeconds(startDate.getSeconds() - 30);
            //         break;
            //     }
            //     case 1800: {
            //         startDate.setMinutes(startDate.getMinutes() - 15);
            //         break;
            //     }
            //     case 3600: {
            //         startDate.setMinutes(startDate.getMinutes() - 30);
            //         break;
            //     }
            //     case 86400: {
            //         startDate.setHours(startDate.getHours() - 12);
            //         break;
            //     }
            //     case 259200: {
            //         startDate.setHours(startDate.getHours() - 36);
            //         break;
            //     }
            // }
            // that.timeSection.forEach(function (item, i) {
            //     // 蓝色片段条
            //     drawPen.fillStyle = '#4E6FAE';
            //     var x = ((item.time[0] - startDate.getTime()) * timeScale) / 1000;
            //     var w = ((item.time[1] - item.time[0]) * timeScale) / 1000;
            //     drawPen.fillRect(
            //         x,
            //         (that.canvasHeight / 5) * 3,
            //         w,
            //         (that.canvasHeight / 5) * 1.5
            //     );
            // });
        };
        TimeLine$1.prototype.drawOtherMsg = function () {
            // 画中心线阴影
            // this.drawPen.shadowColor = '#1890FF';
            // this.drawPen.shadowOffsetX = 0;
            // this.drawPen.shadowOffsetY = 0;
            // this.drawPen.shadowBlur = 10;
            // // 绘制中心线上方的三角形
            // this.drawPen.beginPath();
            // this.drawPen.moveTo(this.canvasWidth / 2 - 4.5, 0);
            // this.drawPen.lineTo(this.canvasWidth / 2 + 4.5, 0);
            // this.drawPen.lineTo(this.canvasWidth / 2, 4.5);
            // this.drawPen.fillStyle = '#fff';
            // this.drawPen.closePath();
            // this.drawPen.fill();

            // // 绘制中心线下方的三角形
            // this.drawPen.beginPath();
            // this.drawPen.moveTo(this.canvasWidth / 2 - 4.5, this.canvasHeight);
            // this.drawPen.lineTo(this.canvasWidth / 2 + 4.5, this.canvasHeight);
            // this.drawPen.lineTo(this.canvasWidth / 2, this.canvasHeight - 4.5);
            // this.drawPen.fillStyle = '#fff';
            // this.drawPen.closePath();
            // this.drawPen.fill();

            // 画中心线
            this.drawSolidLine(
                this.canvasWidth / 2,
                0,
                this.canvasWidth / 2,
                this.canvasHeight,
                2,
                '#1890FF'
            );

            this.drawPen.shadowBlur = 0;

            if (this.isOver && !this.isMouseDown) {
                this.mouseTime =
                    (this.mousePosition / this.canvasWidth) *
                    this.timeWidth *
                    1000 +
                    this.nowTime -
                    (this.timeWidth / 2) * 1000; // 鼠标的悬浮点对应的时间

                this.mouseString = this.tranTime(this.mouseTime); // 鼠标悬浮点显示的文字
                this.hoverTime = this.mouseString;
                this.hoverLeft = this.mousePosition - 60;
                this.timeTipShow = true;

            } else {
                this.timeTipShow = false;
            }
        };

    };

class Rec {
  constructor(jSPlugin) {
    this.jSPlugin = jSPlugin;
    if(!document.getElementById(`${this.jSPlugin.id}-audioControls`)) {
      return false;
    }
    this.currentTimeWidth = 1; //回放时间轴尺度 1~4
    this.timer = null;
    this.date = new Date();
    this.datepickerVisible = false;
    const canvasItemWidth = parseInt(getComputedStyle(document.getElementById(jSPlugin.id)).width, 10) - 100;
    const canvasContainer = document.createElement('div');
    canvasContainer.style = `display:inline-block;width:${canvasItemWidth}px;height:48px;`;
    canvasContainer.id = this.jSPlugin.id + "-canvas-container";
    const canvasItem = document.createElement('canvas');
    canvasItem.id = this.jSPlugin.id + "-canvas";
    canvasItem.className = "time-line-body";
    canvasItem.height = "48";
    canvasItem.width = canvasItemWidth;
    canvasItem.style = "display:inline-block;";
    canvasItem.innerHTML = "该浏览器不支持canvas";
    canvasContainer.appendChild(canvasItem);
    insertAfter$1(canvasContainer, document.getElementById(`${this.jSPlugin.id}-audioControls`));
    const timeLineControlsContainer = document.createElement('div');
    timeLineControlsContainer.className = "timeline-controls";
    timeLineControlsContainer.style = "display:flex;width:100px;height:48px;text-align:center;line-height: 48px;vertical-align: top;background: #000000;";
    const timeLineControls = `
<div class="timeline-controls-scale" style="display: inline-flex;flex-direction: column;justify-content: center;vertical-align: top;padding: 0 20px;">
  <span style="vertical-Align: middle;line-height: 14px;height: 18px; width: 18px;" id="${this.jSPlugin.id}-timeline-scale-add">
    <svg fill="#2C2C2C" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
      viewBox="0 0 20 20">
      <title>add</title>
      <g>
        <polygon points="0.1,0.5 15,0.5 15,15.4 0.1,15.4 	" />
      </g>
      <g>
        <path
          fill="#FFFFFF";
          d="M7.6,12.4c-0.3,0-0.5-0.2-0.5-0.5v-8c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5v8C8.1,12.2,7.9,12.4,7.6,12.4z" />
      </g>
      <g>
        <path
          fill="#FFFFFF";
          d="M11.6,8.4h-8c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h8c0.3,0,0.5,0.2,0.5,0.5S11.8,8.4,11.6,8.4z" />
      </g>
    </svg>
  </span>
  <span style="vertical-Align: middle;line-height: 14px;height: 18px; width: 18px;" id="${this.jSPlugin.id}-timeline-scale-sub">
    <svg fill="#2C2C2C" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
      viewBox="0 0 20 20">
      <title>reduce</title>
      <g>
        <polygon class="st0" points="1,0.8 15.2,0.8 15.2,15 1,15 	" />
      </g>
      <g>
        <path class="st1"
          fill="#FFFFFF";
          d="M12.1,8.4h-8c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h8c0.3,0,0.5,0.2,0.5,0.5S12.4,8.4,12.1,8.4z" />
      </g>
    </svg>
  </span>
</div>
<label for="${this.jSPlugin.id}-datepicker">
  <div class="timeline-controls-date">
    <span>
      <svg fill="#2C2C2C" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
        viewBox="0 0 20 20">
        <title>ifttt</title>
        <g id="Rectangle">
          <rect x="0.6" y="0.9" class="st0" width="20" height="20" />
        </g>
        <g id="Stroke-1">
          <path fill="#FFFFFF"; class="st1"
            d="M14,7.2c-0.3,0-0.5-0.2-0.5-0.5V3.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5v3.3C14.5,7,14.2,7.2,14,7.2z" />
        </g>
        <g id="Stroke-3">
          <path fill="#FFFFFF"; class="st1"
            d="M7.3,7.2C7,7.2,6.8,7,6.8,6.7V3.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5v3.3C7.8,7,7.6,7.2,7.3,7.2z" />
        </g>
        <g id="Stroke-5">
          <path fill="#FFFFFF"; class="st1"
            d="M18.1,9.7h-15c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h15c0.3,0,0.5,0.2,0.5,0.5S18.4,9.7,18.1,9.7z" />
        </g>
        <g id="Stroke-7">
          <path fill="#FFFFFF"; class="st1" d="M16.5,19.7H4.8c-1.2,0-2.2-1-2.2-2.2V6.7c0-1.2,1-2.2,2.2-2.2h11.7c1.2,0,2.2,1,2.2,2.2v10.8
C18.6,18.8,17.7,19.7,16.5,19.7z M4.8,5.6c-0.6,0-1.2,0.5-1.2,1.2v10.8c0,0.6,0.5,1.2,1.2,1.2h11.7c0.6,0,1.2-0.5,1.2-1.2V6.7
c0-0.6-0.5-1.2-1.2-1.2H4.8z" />
        </g>
        <g id="Stroke-9">
          <path fill="#FFFFFF"; class="st1" d="M10.6,13.3c-0.4,0-0.7-0.3-0.7-0.7c0-0.2,0.1-0.4,0.2-0.5s0.3-0.2,0.5-0.2h0h0c0.4,0,0.7,0.3,0.7,0.7
S11,13.3,10.6,13.3z" />
        </g>
        <g id="Stroke-11">
          <path fill="#FFFFFF"; class="st1" d="M14.8,13.3c-0.4,0-0.7-0.3-0.7-0.7c0-0.2,0.1-0.4,0.2-0.5c0.1-0.1,0.3-0.2,0.5-0.2c0.4,0,0.7,0.3,0.7,0.7
S15.2,13.3,14.8,13.3z M14.8,12.3c-0.2,0-0.3,0.1-0.3,0.3c0,0.2,0.3,0.4,0.5,0.2c0.1-0.1,0.1-0.1,0.1-0.2
C15.1,12.4,15,12.3,14.8,12.3z" />
        </g>
        <g id="Stroke-13">
          <path fill="#FFFFFF"; class="st1" d="M6.5,16.6c-0.4,0-0.7-0.3-0.7-0.7c0-0.2,0.1-0.4,0.2-0.5c0.1-0.1,0.3-0.2,0.5-0.2h0h0c0.4,0,0.7,0.3,0.7,0.7
C7.2,16.3,6.9,16.6,6.5,16.6z" />
        </g>
        <g id="Stroke-15">
          <path fill="#FFFFFF"; class="st1" d="M10.6,16.6c-0.4,0-0.7-0.3-0.7-0.7c0-0.2,0.1-0.4,0.2-0.5c0.1-0.1,0.3-0.2,0.5-0.2h0h0c0.4,0,0.7,0.3,0.7,0.7
C11.4,16.3,11,16.6,10.6,16.6z" />
        </g>
      </svg>
    </span>
  </div>
</label>
<input data-toggle="${this.jSPlugin.id}-datepicker" id="${this.jSPlugin.id}-datepicker" name="${this.jSPlugin.id}-datepicker" style="opacity:0;width:0;margin-left:-4" />
`;
    timeLineControlsContainer.innerHTML = timeLineControls;
    insertAfter$1(timeLineControlsContainer, canvasContainer);
    this.timeLine = new TimeLine$1(this.jSPlugin);
    this.timeLine.init({
      id: this.jSPlugin.id + '-canvas',
      width: canvasItemWidth,
      onChange: (time) => {
        console.log("time", time, new Date(time).Format('yyyyMMddhhmmss'));
        console.log("jSPlugin", this.jSPlugin);
        var newBegin = new Date(time).Format('yyyyMMddhhmmss');
        this.jSPlugin.changePlayUrl({ begin: newBegin });
      }
    });
    this.syncTimeLine();
    // 加载日期选择器
    addCss(`${this.jSPlugin.staticPath}/rec/datepicker.min.css`);
    addJs(`${this.jSPlugin.staticPath}/rec/jquery.min.js`, () => {
      addJs(`${this.jSPlugin.staticPath}/rec/datepicker.js`, () => {
        addJs(`${this.jSPlugin.staticPath}/rec/datepicker.zh-CN.js`, () => {
          // 日期选择：
          $(`#${this.jSPlugin.id}-datepicker`).datepicker({
            autoShow: false,
            autoHide: true,
            autoPick: true,
            language: 'zh-CN',
            defaultDate: new Date(),
            format: 'yyyy-mm-dd',
            endDate: new Date()
          });
          $(`#${this.jSPlugin.id}-datepicker`).on('pick.datepicker', (e) => {
            console.log("重新选择日期", e.date, new Date(e.date).Format('yyyyMMdd'), new Date(document.getElementById(`${this.jSPlugin.id}-datepicker`).value).Format('yyyyMMdd'));
            if (e.date > new Date() || (new Date(e.date).Format('yyyyMMdd') === new Date(document.getElementById(`${this.jSPlugin.id}-datepicker`).value).Format('yyyyMMdd'))) {
              e.preventDefault(); // Prevent to pick the date
            } else {
              this.renderRec(e.date);
              this.jSPlugin.changePlayUrl({ begin: new Date(e.date).Format('yyyyMMdd') });
            }
            $('#datepicker').datepicker('hide');
            this.datepickerVisible = false;
          });
          $(`#${this.jSPlugin.id}-datepicker`).bind("click", (e) => {
            if (this.datepickerVisible) {
              $(`#${this.jSPlugin.id}-datepicker`).datepicker('hide');
            } else {
              $(`#${this.jSPlugin.id}-datepicker`).datepicker('show');
            }
            this.datepickerVisible = !this.datepickerVisible;
          });
        });
      });
    });
    // 尺度变化监听
    document.getElementById(`${this.jSPlugin.id}-timeline-scale-add`).onclick = () => {
      var currentTimeWidth = this.currentTimeWidth;
      if (currentTimeWidth < 3) {
        this.timeLine.changeSize(++this.currentTimeWidth);
      }
    };
    document.getElementById(`${this.jSPlugin.id}-timeline-scale-sub`).onclick = () => {
      var currentTimeWidth = this.currentTimeWidth;
      if (currentTimeWidth > 0) {
        this.timeLine.changeSize(--this.currentTimeWidth);
      }
    };
    // 渲染回放
    var initDate = getQueryString("begin", this.jSPlugin.url) || new Date().Format('yyyyMMdd');
    this.renderRec(`${initDate.slice(0, 4)}-${initDate.slice(4, 6)}-${initDate.slice(6, 8)}`);
    var observer = new MutationObserver((mutations, observer) => {
      mutations.forEach((mutation) => {
        console.log(mutation);
        this.recAutoSize();
      });
    });
    var config = {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: [
        'style'
      ]
    };
    var el = document.getElementById(this.jSPlugin.id);
    observer.observe(el, config);
  }
  recAutoSize() {
    const canvasItemWidth = parseInt(getComputedStyle(document.getElementById(this.jSPlugin.id)).width, 10) - 100;
    document.getElementById(`${this.jSPlugin.id}-canvas`).width = canvasItemWidth;
    this.timeLine.init({
      id: `${this.jSPlugin.id}-canvas`,
      width: canvasItemWidth,
      onChange: (time) => {
        console.log("time", time, new Date(time).Format('yyyyMMddhhmmss'));
        console.log("jSPlugin", this.jSPlugin);
        var newBegin = new Date(time).Format('yyyyMMddhhmmss');
        this.jSPlugin.changePlayUrl({ begin: newBegin });
      }
    });
    this.renderRec(this.date);
  }
  renderRec(date) {
    this.date = date;
    var dateStart = new Date(new Date(date).Format('yyyy-MM-dd 00:00:00')).getTime();
    var dateEnd = new Date(new Date(date).Format('yyyy-MM-dd 23:59:59')).getTime();
    var recSliceParams = {
      accessToken: this.jSPlugin.accessToken,
      recType: matchEzopenUrl(this.jSPlugin.url).type === 'cloud.rec' ? 1 : 2,
      deviceSerial: matchEzopenUrl(this.jSPlugin.url).deviceSerial,
      channelNo: matchEzopenUrl(this.jSPlugin.url).channelNo,
      startTime: dateStart,
      endTime: dateEnd,
      version: '2.0'
    };
    const recAPISuccess = (data) => {
      if (data.data && data.data.files && data.data.files.length > 0) {
        var dataArr = data.data.files;
        var nextFileTime = new Date().getTime();
        var isAll = data.data.isAll;
        if (isAll) {
          this.timeLine.getRecord(dataArr, dateStart, dateEnd);
        } else {
          recTransaction();
          // 云存储回调事务
          function recTransaction() {
            function recAPIV2Success(data) {
              if (data.data && data.data.files && data.data.files.length > 0) {
                if (data.data.isAll == false) {
                  if (data.data.files) {
                    dataArr = dataArr.concat(data.data.files);
                  }
                  nextFileTime = data.data.nextFileTime > 0 ? data.data.nextFileTime : new Date().getTime();
                  recTransaction();
                } else {
                  console.log("云存储执行渲染片段");
                  this.timeLine.getRecord(dataArr, dateStart, dateEnd);
                }
              } else {
                this.timeLine.getRecord(dataArr, dateStart, dateEnd);
              }
            }
            recSliceParams.startTime = nextFileTime;
            request(this.jSPlugin.env.domain + "/api/lapp/video/by/time", 'POST', recSliceParams, '', recAPIV2Success);
          }
        }
      } else if (data.data && data.data.length > 0) {
        console.log("获取本地录像片段成功", data);
        this.timeLine.getRecord(data.data, dateStart, dateEnd);
      } else ;
    };
    var recAPIUrl = this.jSPlugin.env.domain + "/api/lapp/video/by/time";
    request(recAPIUrl, 'POST', recSliceParams, '', recAPISuccess);
  }
  syncTimeLine() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      var getOSDTimePromise = this.jSPlugin.getOSDTime();
      getOSDTimePromise.then((data) => {
        var v = data.data;
        if (v === -1) {
          console.log("获取播放时间错误");
        } else {
          if (v > 0) {
            //console.log("获取播放时间", v, this.timeLine.run);
            this.timeLine.run({ time: new Date(v > 1000000000000 ? v : v * 1000) });
            //$(".current-time").text(new Date(new Date(v > 1000000000000 ? v : v * 1000)).Format('yyyy-MM-dd hh:mm:ss'))
          }
        }
      })
        .catch((err) => {
        });
    }, 1000);
  }
  unSyncTimeLine() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}

var TimeLine = function TimeLine(params) {
  console.log("执行TimeLine - params", params);
  this.state = {
    id: params.id,
    start: '00:00:00', // 传入最近片段起始时刻
    end: '24:00:00', // 传入最近片段结束时刻 默认结束时间为24：00：00, 1440  24
    current: 0, // 当前播放时刻
    // rate: 1, // 1：2小时， 2：1小时， 3：半小时， 4：10分钟， 5：1分钟
    timelag: 30, // 120: 2小时， 60：1小时， 30：半小时，10：10分钟，1：1分钟
    timeArr: [], // 时间轴列表
    availTimeLine: [], // 由实际存在视频片段的时间组成，[{st: '', et: ''}, {st: '', et: ''}, ...]
    scrollTop: 0, // 页面滚动偏移量 页面偏移量由传入时刻决定
    // currentTimer: '', // 时刻定时器
    // timelineTimer: '', //时间轴定时器,
    index: 0, // 初始时刻在availtimeLine中的index
    // playCode: 0, // 当前播放状态值
    date: '',
    noTimeLineTxt: '',
    disabled: false, // 禁用拖动轴
  };
  var _this = this;
  this.setState = function (obj) {
    Object.keys(obj).forEach(function (key) {
      _this.state[key] = obj[key];
      if (key === 'scrollTop') {
        document.getElementById('time-line-item').parentNode.scrollTo(0, obj[key]);
      }
      if (key === 'current') {
        document.getElementById('time-line-current').innerHTML = obj[key];
      }
    });
  };
  this.setDisabled = function (value) {
    this.setState({
      disabled: value
    });
    document.getElementById('time-line-item').parentNode.style.overflowY = value ? 'hidden' : 'scroll';
    // console.log(" document.getElementById('time-line-item').parentNode.style", document.getElementById('time-line-item').parentNode)
  };
  this.timeToSecond = function (time) {
    const e = time.split(':');
    let h = Number(e[0]);
    const m = Number(e[1]);
    const s = Number(e[2]);
    return h * 60 * 60 + m * 60 + (s ? s : 0)
  };
  this.minuteToTime = function (minute) {
    let hour = Math.floor(minute / 60);
    let m = minute % 60;
    return (hour > 9 ? hour : '0' + hour) + ':' + (m > 9 ? m : '0' + m)
  };
  this.timeToMinute = function (time) {
    const e = time.split(':');
    let h = Number(e[0]);
    const m = Number(e[1]);
    // const s = Number(e[2]);
    return h * 60 + m
  };
  this.getPalyParam = params.getPalyParam;
  // 监听手动滚动时间轴时，停止时间轴滚动，时刻仍然变化
  document.getElementById('time-line-item').parentNode.ontouchstart = function () {
    if (_this.state.disabled) {
      return false;
    }
    params.ontouchstart();
  };
  // 监听手动滚动时间轴时，停止时间轴滚动，时刻仍然变化
  document.getElementById('time-line-item').parentNode.ontouchmove = function () {
    if (_this.state.disabled) {
      return false;
    }
    params.ontouchmove();
  };
  // 手动滚动停止，选定时刻自动播放
  document.getElementById('time-line-item').parentNode.ontouchend = function () {
    // var _this = this;
    if (_this.state.disabled) {
      return false;
    }
    //
    var timer;
    const scollPromise = new Promise(function (resolve, reject) {
      let preTop = -1;
      timer = setInterval(() => {
        // debugger
        let reactTop = document.getElementById('time-line-item').parentNode.scrollTop; // 实际偏移高度
        if (reactTop !== preTop) {
          console.log("scolling", reactTop, preTop);
          preTop = reactTop;
        } else {
          console.log("scoll stop", reactTop, preTop);
          clearInterval(timer);
          resolve(reactTop);
        }
      }, 100);
    });

    //
    scollPromise.then((reactTop) => {
      console.log("scollPromise: then", reactTop, _this);
      _this.rectTopTotime(reactTop);
      console.log('页面滚动实际高度', reactTop, _this.state);
      _this.getPalyParam({ current: _this.state.current });
    });
    params.ontouchend();
  };
  this.matchTimeDot();
};
TimeLine.prototype.changeScale = function (value) {
  this.setState({
    timelag: value, // 120: 2小时， 60：1小时， 30：半小时，10：10分钟，1：1分钟
  });
  this.matchTimeDot();

};
TimeLine.prototype.setDateLine = function (news, defaultIndex) {
  // if( news.length > 0 ){
  //   if(!defaultIndex){
  //     defaultIndex = 0;
  //   }
  //   this.setState({
  //     availTimeLine: news,
  //     start: news[defaultIndex].st,
  //     end: news[defaultIndex].et,
  //     current: news[defaultIndex].st,
  //   })
  //   console.log("this.state", this.state);
  //   this.matchTimeDot();

  //   this.primaryOffsetH();
  //   // 将当前播放时间片段传给父组件
  //   this.getPalyParam(news[defaultIndex]);
  // }
  if (news.length > 0) {
    if (typeof defaultIndex === 'undefined') {
      defaultIndex = news.length - 1;
    }
    this.setState({
      availTimeLine: news,
      start: news[defaultIndex].st,
      end: news[defaultIndex].et,
      current: news[defaultIndex].st,
    });
    console.log("this.state", this.state);
    this.matchRecTimeDot();

    this.primaryOffsetH();
    // 将当前播放时间片段传给父组件
    //this.getPalyParam({ current: news[defaultIndex].st });
  } else {
    this.setState({
      availTimeLine: []
    });
    console.log("this.state", this.state);
    this.matchRecTimeDot();
  }

};
TimeLine.prototype.matchTimeDot = function () {
  const { start, end, timelag, availTimeLine } = this.state;
  console.log("start", start, 'end', end);
  var timeArr = [];
  // // 播放时间片段时刻转分钟
  // let availArr = [];
  // let len = availTimeLine.length;
  // for (let i = 0; i < len; i++) {
  //   const temp = availTimeLine[i];
  //   let st = this.timeToSecond(temp.st);
  //   let et = this.timeToSecond(temp.et);
  //   // console.log('st: ', st, 'et:', et);
  //   let stminute;
  //   let etminute;
  //   let stAvailPercent = 0;
  //   let etAvailPercent = 0;
  //   stminute = Math.floor(st / (timelag * 60)) * timelag;
  //   stAvailPercent = (st - (stminute * 60)) / timelag;
  //   etminute = Math.floor(et / (timelag * 60)) * timelag;
  //   etAvailPercent = (et - (etminute * 60)) / timelag;
  //   availArr[i] = {
  //     st: stminute,
  //     et: etminute,
  //     stAvailPercent: stAvailPercent,
  //     etAvailPercent: etAvailPercent
  //   }
  // }
  // console.log('availArr: ', availArr);
  // 时间转分钟
  let minute = this.timeToMinute(end);
  // // 检测是否包含秒,则实际分钟加1
  // const e = end.split(':');
  // const s = Number(e[2]);
  // if (s > 0) {
  //   minute = minute + 1
  // }
  minute = Math.floor(minute / timelag) * timelag;
  for (let i = minute; i >= 0;) {
    let marginTop = 0;
    let marginBottom = 0;
    // 视频片段
    let recArr = [];
    if (i == minute) {
      marginTop = 70;
    }
    if (i == 0) {
      marginBottom = 230;
    }
    // for (let j = 0; j < len; j++) {
    //   if (i >= availArr[j].st && i <= availArr[j].et) {
    //     // borderColor = '#f7a670';
    //     // console.log("i",i,availArr[j])
    //     if (i == availArr[j].st && i == availArr[j].et) {
    //       var height = availArr[j].etAvailPercent - availArr[j].stAvailPercent;
    //       var top = 60 - availArr[j].etAvailPercent;
    //       recArr.push({
    //         height: height,
    //         top: top
    //       })
    //     } else {
    //       if (i == availArr[j].st) {
    //         recArr.push({
    //           height: 60 - availArr[j].stAvailPercent,
    //           top: 0
    //         })
    //       } else if (i == availArr[j].et) {
    //         recArr.push({
    //           height: availArr[j].etAvailPercent,
    //           top: 60 - availArr[j].etAvailPercent,
    //         })
    //       } else if (i > availArr[j].st && i < availArr[j].et) {
    //         // 跨越多个区域
    //         recArr.push({
    //           height: 60,
    //           top: 0,
    //         })
    //       }
    //     }
    //   }

    // }
    let time = this.minuteToTime(i);
    timeArr.push({
      id: i,
      current: time,
      label: "a" + i,
      marginTop: marginTop,
      marginBottom: marginBottom,
      recArr: recArr,
    });
    i = i - timelag;
  }
  this.setState({
    timeArr: timeArr
  });
  this.renderDateLine();
};
TimeLine.prototype.matchRecTimeDot = function () {
  const { start, end, timelag, availTimeLine, timeArr } = this.state;
  console.log("start", start, 'end', end);
  // 播放时间片段时刻转分钟
  let availArr = [];
  let len = availTimeLine.length;
  if (len === 0) {
    for (var j = 0; j < timeArr.length; j++) {
      timeArr[j].recArr = [];
    }
  } else {
    for (let i = 0; i < len; i++) {
      const temp = availTimeLine[i];
      let st = this.timeToSecond(temp.st);
      let et = this.timeToSecond(temp.et);
      // console.log('st: ', st, 'et:', et);
      let stminute;
      let etminute;
      let stAvailPercent = 0;
      let etAvailPercent = 0;
      stminute = Math.floor(st / (timelag * 60)) * timelag;
      stAvailPercent = (st - (stminute * 60)) / timelag;
      etminute = Math.floor(et / (timelag * 60)) * timelag;
      etAvailPercent = (et - (etminute * 60)) / timelag;
      availArr[i] = {
        st: stminute,
        et: etminute,
        stAvailPercent: stAvailPercent,
        etAvailPercent: etAvailPercent
      };
      for (var j = 0; j < timeArr.length; j++) {
        if (timeArr[j].id == stminute && timeArr[j].id == etminute) {
          var height = etAvailPercent - stAvailPercent;
          var top = 60 - etAvailPercent;
          timeArr[j].recArr.push({
            height: height,
            top: top
          });
        } else {
          if (timeArr[j].id == stminute) {
            timeArr[j].recArr.push({
              height: 60 - stAvailPercent,
              top: 0
            });
          } else if (timeArr[j].id == etminute) {
            timeArr[j].recArr.push({
              height: etAvailPercent,
              top: 60 - etAvailPercent
            });
          } else if (timeArr[j].id > stminute && timeArr[j].id < etminute) {
            timeArr[j].recArr.push({
              height: 60,
              top: 0
            });
          }
        }
      }
    }
  }

  console.log('availArr: ', availArr);
  this.setState({
    timeArr: timeArr,
  });
  console.log('timeArr:', this.state);
  this.renderDateLine();
};
TimeLine.prototype.renderDateLine = function () {
  const { id, timeArr } = this.state;
  console.log("id,timeArr", id, timeArr);
  var container = document.getElementById("time-line-item");
  container.innerHTML = "";
  timeArr.forEach((item, index) => {
    var timeItemDOM = document.createElement('div');
    timeItemDOM.setAttribute("class", "time-item");
    timeItemDOM.style = `margin-top: ${item.marginTop}px; margin-bottom: ${item.marginBottom}px; border-right-color: ${item.borderColor};`;
    var scaleDOM = document.createElement('div');
    scaleDOM.setAttribute("class", "scale");
    var timeItemHtml = '<div class="scale"></div><div class="scale"></div><div class="scale"></div><div class="scale"></div><div class="scale"></div><div class="scale" style="width:10px"></div>';
    item.recArr.forEach((i, j) => {
      timeItemHtml += `<div class="item-unavail" style="height: ${i.height}px;background-color:#A8B9ED; top: ${i.top}px"></div>`;
    });
    //timeItemHtml += `<div class="item-unavail" style="height: ${item.availPercent}px; top: ${item.availTop}px"></div>`
    timeItemHtml += `<div id=${item.label} style="position: relative; top: 51px; left: 40%"> ${item.current}</div>`;
    timeItemDOM.innerHTML = timeItemHtml;

    container.appendChild(timeItemDOM);
  });
};
// 计算初始偏移量
TimeLine.prototype.primaryOffsetH = function () {
  const { start, timelag, timeArr } = this.state;
  const currentItem = timeArr[0].current;
  const currentTime = this.timeToSecond(currentItem);
  const startSecond = this.timeToSecond(start);
  const offsetS = currentTime - startSecond;
  const offsetH = Math.ceil(offsetS / timelag) + 60; // offsetS / (timelag * 60) * 60
  this.setState({
    scrollTop: offsetH
  });
  console.log('起始偏移量', offsetH);

};
// 计算当前偏移量
TimeLine.prototype.currentOffsetH = function () {
  const { current, timelag, timeArr } = this.state;
  const startItem = timeArr[0].current;
  const startSecond = this.timeToSecond(startItem);
  const currentSecond = this.timeToSecond(current);
  const offsetS = startSecond - currentSecond;
  const offsetH = Math.ceil(offsetS / timelag) + 60; // offsetS / (timelag * 60) * 60
  this.setState({
    scrollTop: offsetH
  });
};
// 通过时间轴位置获取当前时间
TimeLine.prototype.rectTopTotime = function (reactTop) {
  let { timelag } = this.state;
  // let rectTop = rect.top; // 获取当前元素距离父元素顶部的高度
  // let reactTop = 0 - rectTop; // 实际偏移高度
  let index = Math.floor(reactTop / 60); // 以分钟为刻度时，每个元素初始高度为60px, 向下取整并除以时刻倍数得出偏移item;
  let offsetH = reactTop - (index * 60); // 偏移高度
  let current;
  let offsetSecond;
  console.log('index：', index, 'offsetH:', offsetH);
  if (offsetH == 0) {
    current = this.state.timeArr[index - 1].current;
    offsetSecond = 0;
  } else {
    // 当timelag==120,timelag==60,timelag==30,timelag==10,timelag==1
    const time = this.state.timeArr[index].current;
    let minute = this.timeToMinute(time);
    // 相对于下一元素偏移
    const offsetY = 60 - offsetH;
    const offsetS = (offsetY * timelag); // offsetY / 60 * timelag * 60
    const offsetM = Math.floor(offsetS / 60) + minute;
    const second = (Math.floor(offsetS / 60) * 60);
    offsetSecond = Math.ceil(offsetS - second); // 保留两位小数
    current = this.minuteToTime(offsetM);
  }
  this.setState({
    current: current + ':' + (offsetSecond > 9 ? offsetSecond : '0' + offsetSecond),
    scrollTop: reactTop
  });
  // console.log("rectLeft", reactTop);
  // console.log("currentTime", current + ':' + (offsetSecond > 9 ? offsetSecond : '0' + offsetSecond));
};
// 时间轴滚动，根据传参变化
TimeLine.prototype.stepScrollTimeLine = function (time) {
  this.setState({
    current: time,
  });
  this.currentOffsetH();
};

TimeLine.prototype.secondCountDown = function (time) {
  const { current } = this.state;
  // console.log('currentTime', current);
  const temp = current.split(':');
  let hour = Number(temp[0]);
  let minute = Number(temp[1]);
  let second = Number(temp[2]);
  let t = hour * 60 * 60 + minute * 60 + second + 1;
  let h = Math.floor(t / 3600);
  let m = Math.floor((t - h * 3600) / 60);
  let s = t - h * 3600 - m * 60;
  this.setState({
    current: (h > 9 ? h : '0' + h) + ':' + (m > 9 ? m : '0' + m) + ':' + (s > 9 ? s : '0' + s)
  });
};
const MobileTimeLine = TimeLine;

Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));}
  for (var k in o)
    {if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));}
  return fmt;
};

function format(now) {
  var time = new Date(now);
  var h = time.getHours();     //返回日期中的小时数（0到23）
  var m = time.getMinutes(); //返回日期中的分钟数（0到59）
  var s = time.getSeconds(); //返回日期中的秒数（0到59）
  return (h > 9 ? h : '0' + h) + ':' + (m > 9 ? m : '0' + m) + ':' + (s > 9 ? s : '0' + s);
}

class MobileRec {
  constructor(jSPlugin) {
    this.jSPlugin = jSPlugin;
    this.timer = null;
    this.date = new Date().Format('yyyy-MM-dd');
    this.begin = new Date().Format('yyyy-MM-dd') + ' 00:00:00';
    this.end = new Date().Format('yyyy-MM-dd') + ' 23:59:59';
    this.type = matchEzopenUrl(this.jSPlugin.url).type;
    this.operating = false;
    var oS = document.createElement('style');
    oS.innerHTML = `
    body{
      padding: 0;
      margin: 0;
    }
    .time-line-container {
      height: 300px;
      /* outline: 1px solid red; */
      /* background: gray; */
      position: relative;
      /* padding-top: 60px; */
      margin-top: 20px;
    }

    .time-line-container .time-line-item-container {
      display: inline-block;
      /* height: 400px; */
      width: 30%;
      /* background: indianred; */
      overflow-y: scroll;
      overflow-x: hidden;
      /* padding-top: 60px; */
      height: 300px;
      box-sizing: border-box;
      white-space: nowrap;
      position: relative;
    }

    .time-line-container .time-line-item-container::-webkit-scrollbar {
      width: 0px;
      /*滚动条宽度*/
      height: 0px;
      /*滚动条高度*/
    }

    .time-line-item .time-item {
      position: relative;
      box-sizing: border-box;
      height: 60px;
      font-size: 12px;
      color: rgb(150, 150, 150);
      border-right: 6px solid;
      border-right-color: #ddd;
    }

    .time-line-item .time-item .scale {
      width: 6px;
      height: 9px;
      border-bottom: 1px solid #ccc;
      float: right;
      clear: both;
    }

    .time-line-item .time-item .item-unavail {
      width: 6px;
      position: absolute;
      left: 100%;
      background-color: #ddd;
    }

    .time-line-container .current-time {
      position: absolute;
      left: 0;
      top: 40px;
      height: 29px;
      /* line-height: 58px; */
      border-bottom: 1px solid #648FFC;
      width: 60%;
      margin-left: 26%;
    }

    .time-line-container .current-time .current-time-bg {
      position: relative;
      top: 15px;
      width: 100px;
      height: 29px;
      line-height: 29px;
      left: -70px;
      font-size: 12px;
      color: #2C2C2C;
    }

    .time-line-container .current-time .current-time-bg::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 100%;
      background: #648FFC;
      top: 11px;
      position: absolute;
      right: 30px;
    }

    .date-switch-container {
      height: 40px;
      position: relative;
      text-align: center;
      margin: 20px 10px;
    }

    .date-switch-container .current-date {
      line-height: 40px;
      height: 22px;
      font-size: 16px;
      color: #2C2C2C;
      text-align: center;
      font-weight: bold;
    }

    .date-container {
      width: 40px;
      height: 40px;
      position: absolute;
      right: 0;
      top: 0;
    }

    .rec-type-container {
      display: flex;
      justify-content: space-between;
    }

    .rec-type-container .rec-type-text {
      padding: 0 15px;
      font-size: 12px;
      color: #2C2C2C;
    }

    .rec-type-container .rec-type-switch {
      padding: 0 15px;
    }

    .date-container input {
      position: absolute;
      opacity: 0;
      display: inline-block;
      width: 40px;
      height: 40px;
      z-index: 10;
      left: 0;
    }

    .date-container label {
      position: absolute;
      left: 0;
      top: 0;
      /* display: none; */
      z-index: 0;
    }

    .date-icon {
      display: inline-block;
      width: 40px;
      height: 40px;
      background: url('https://resource.eziot.com/group2/M00/00/6A/CtwQF2F6VieAQrU9AAABP-_Nsqo949.png') no-repeat 100% 100%;
    }
    .select-container {
      padding: 10px;
      display: flex;
      justify-content: space-between;
    }

    .advice {
      height: 24px;
      width: 82px;
      display: flex;
      justify-content: space-between;
      line-height: 24px;
    }

    .advice span {
      width: 40px;
      display: inline-block;
    }

    input[type="checkbox"]:not(:checked)+.advice span:first-child {
      box-shadow: 0px 2px 5px 0px rgb(23 45 101 / 20%);
      border-radius: 8px;
      text-align: center;

    }

    input[type="checkbox"]:checked+.advice span:last-child {
      box-shadow: 0px 2px 5px 0px rgb(23 45 101 / 20%);
      border-radius: 8px;
      text-align: center;
    }

    input[type="checkbox"]:not(:checked)+.advice span:first-child svg {
      fill: #648FFC !important;
    }

    input[type="checkbox"]:checked+.advice span:last-child svg {
      fill: #648FFC !important;
    }`;
    document.getElementsByTagName("head")[0].appendChild(oS);
    if (getQueryString("begin", this.jSPlugin.url)) {
      var begin = getQueryString("begin", this.jSPlugin.url);
      this.date = begin.slice(0, 4) + '-' + begin.slice(4, 6) + '-' + begin.slice(6, 8);
      this.begin = this.date + ' 00:00:00';
      this.end = this.date + ' 23:59:59';
    }
    // 回放时间标题
    const mobileRecTitleWrap = document.createElement('div');
    mobileRecTitleWrap.id = "date-switch-container-wrap";
    mobileRecTitleWrap.className = "date-switch-container-wrap";
    mobileRecTitleWrap.style = "";
    mobileRecTitleWrap.innerHTML = (`
      <div class="date-switch-container">
      <div class="current-date" id="current-date">今日录像</div>
      <div class="date-container">
        <label for="date">
          <div class="date-icon"></div>
        </label>
        <input type="date" name="date" id="date" />
      </div>
    </div>
        `);
    insertAfter$1(mobileRecTitleWrap, document.getElementById(`${this.jSPlugin.id}-wrap`));
    // 回放时间类型选择
    const mobileRecSwitchWrap = document.createElement('div');
    mobileRecSwitchWrap.id = "rec-type-container-wrap";
    mobileRecSwitchWrap.className = "rec-type-container-wrap";
    mobileRecSwitchWrap.style = "";
    mobileRecSwitchWrap.innerHTML = (`
    <div class="rec-type-container">
    <div class="rec-type-text">共个<span id="recCount">0</span>录像</div>
    <div class="rec-type-switch">
      <label>
        <input type="checkbox" name="type" id="cloudType" value="1" hidden />
        <label for="cloudType" class="advice">
          <span>
          <svg fill="#CCCCCC" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="2 0 20 20">
            <path class="st0" d="M12.6,5c-2.3,0.1-4.3,1.4-5.3,3.3L7.2,8.6c-2.4,0.5-4.1,2.5-4.1,4.9c0,2.8,2.4,5,5.2,5h9.9
            c2.4,0,4.3-1.9,4.3-4.2l0-0.2c-0.1-2-1.6-3.5-3.5-3.9l-0.1,0l0-0.2c-0.4-2.8-3-5-6.1-5L12.6,5z"/>
          </svg>
        </span>
        <span>
          <svg fill="#CCCCCC" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="2 0 20 20">
            <path id="形状结合" class="st0" d="M14.3,4c0.6,0,1.2,0.2,1.7,0.7l0,0L18.3,7C18.7,7.4,19,8,19,8.6l0,0v9c0,1.3-1.1,2.3-2.4,2.3
	l0,0H8.4C7.1,20,6,19,6,17.7l0,0V6.3C6,5,7.1,4,8.4,4l0,0H14.3z M9.7,7.2C9.3,7.2,8.9,7.6,8.9,8l0,0v2.5l0,0.1
	c0,0.4,0.4,0.6,0.7,0.6c0.4,0,0.8-0.3,0.8-0.8l0,0V8l0-0.1C10.4,7.5,10,7.2,9.7,7.2z M12.2,7.2c-0.4,0-0.8,0.3-0.8,0.8l0,0v2.5
	l0,0.1c0,0.4,0.4,0.6,0.7,0.6c0.4,0,0.8-0.3,0.8-0.8l0,0V8l0-0.1C12.9,7.5,12.5,7.2,12.2,7.2z M14.7,7.2c-0.4,0-0.8,0.3-0.8,0.8l0,0
	v2.5l0,0.1c0,0.4,0.4,0.6,0.7,0.6c0.4,0,0.8-0.3,0.8-0.8l0,0V8l0-0.1C15.4,7.5,15,7.2,14.7,7.2z"/>
          </svg>
        </span>
        </label>
      </label>
    </div>
  </div>
        `);
    insertAfter$1(mobileRecSwitchWrap, mobileRecTitleWrap);
    // 回放时间轴
    const mobileRecWrap = document.createElement('div');
    mobileRecWrap.id = "mobile-rec-wrap";
    mobileRecWrap.className = "mobileRec-wrap";
    mobileRecWrap.style = "";
    mobileRecWrap.innerHTML = (`
    <div class="time-line-container">
    <div class="current-time">
      <div class="current-time-bg" id="time-line-current">2020-01-01 00:00:00</div>
    </div>
    <div class="time-line-item-container">
      <div class="time-line-item" id="time-line-item">
      </div>
    </div>
    </div>
      `);
    insertAfter$1(mobileRecWrap, mobileRecSwitchWrap);
    const getPalyParam = (data) => {
      console.log("子组件传值到父组件", data, data.current);
      var st = data.current;
      var date = new Date(this.date).Format('yyyyMMdd').substr(0, 8) + (data.current ? st.replace(/:/g, "") : data.current.replace(/:/g, ""));
      this.jSPlugin.changePlayUrl({
        begin: date,
        type: this.type
      }).then(()=> {
        this.syncTimeLine();
      });
    };
    const ontouchstart = () => {
      this.operating = true;
      this.unSyncTimeLine();
      // if (currentTimer) {
      //   clearInterval(currentTimer)
      // }
      // if (decoder) {
      //   var stopPromise = decoder.stop();
      //   stopPromise.then(() => {
      //     console.log("停止成功")
      //   });
      // }
    };
    const ontouchmove = () => {
      // if (currentTimer) {
      //   clearInterval(currentTimer)
      // }
    };
    const ontouchend = () => {
      this.operating = false;
      console.log("ontouchend");
      // if (currentTimer) {
      //   clearInterval(currentTimer)
      // }
    };
    this.TimeLineOBJ = new MobileTimeLine({
      id: "time-line-item",
      getPalyParam: getPalyParam,
      ontouchstart: ontouchstart,
      ontouchmove: ontouchmove,
      ontouchend: ontouchend
    });
    this.fetchDeviceRec();
    // 监听日期变化
    document.getElementById("date").addEventListener('change', (e) => {
      console.log("日期变化", e.target.value);
      this.date = new Date(e.target.value).Format("yyyy-MM-dd");
      this.fetchDeviceRec();
    });
    document.getElementById("cloudType").checked = (this.type === 'rec');
    document.getElementById("cloudType").addEventListener('change', (e) => {
      var recType = e.target.checked ? 2 : 1;
      this.type = e.target.checked ? "rec" : 'cloud.rec';
      console.log("recType", recType);
      this.fetchDeviceRec();
      this.jSPlugin.changePlayUrl({
        type: this.type,
        begin: `${new Date(this.date).Format('yyyyMMdd')}000000`
      })
      .then(()=>{
        console.log("切换类型成功");
        this.syncTimeLine();
      },(err)=>{
        console.log("err",err);
      })
      .catch(err=>{
        console.log(err);
      });
      // document.getElementById("cloudType").setAttribute("checked", true);
      // $("#cloudType").attr("checked", recType == '2');
      // $("#cloudType .device svg").attr("checked", recType == '2');
    });
    this.syncTimeLine();
  }
  fetchDeviceRec() {
    const doRender = (result) => {
      const len = result.length;
      document.getElementById("recCount").innerHTML = len;
      let availArr = [];
      for (let i = len - 1; i >= 0; i--) {
        let res = result[i];
        let et = format(res.endTime);
        let st = format(res.startTime);
        availArr.push({
          st: st,
          et: et
        });
      }
      // document.getElementById("time-line-item").style.display = "block";
      {
        this.TimeLineOBJ.setDateLine(availArr);
      }
    };
    var data = new FormData();
    data.append("deviceSerial", matchEzopenUrl(this.jSPlugin.url).deviceSerial);
    data.append("channelNo", matchEzopenUrl(this.jSPlugin.url).channelNo);
    data.append("accessToken", this.jSPlugin.accessToken);
    data.append("recType", this.type === 'cloud.rec' ? 1 : 2);
    data.append("startTime", new Date(this.date + ' 00:00:00').getTime());
    data.append("endTime", new Date(this.date + ' 23:59:59').getTime());
    fetch(this.jSPlugin.env.domain + '/api/lapp/video/by/time', {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then((res) => {
        // 本地回放
        if (res.code == 200 && res.data) {
          var result = [];
          result = res.data;
          doRender(result);
        } else {
          doRender([]);
        }
      });
  }

  syncTimeLine() {
    var dateFormat = function (now) {
      var time = new Date(now);
      var h = time.getHours();     //返回日期中的小时数（0到23）
      var m = time.getMinutes(); //返回日期中的分钟数（0到59）
      var s = time.getSeconds(); //返回日期中的秒数（0到59）
      return (h > 9 ? h : '0' + h) + ':' + (m > 9 ? m : '0' + m) + ':' + (s > 9 ? s : '0' + s);
    };
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      // 定时器
      if (this.operating) {
        console.log("操作中");
        return false;
      }
      this.jSPlugin.getOSDTime()
        .then((res)=>{
          if (res.data > 0) {
            this.TimeLineOBJ.stepScrollTimeLine(dateFormat(res.data * 1000));
          } else {
            console.log("未找到当前获取播放时间，等待中...");
          }
        })
        .catch((err)=>{
          console.log("未找到当前获取播放时间，等待中...");
        });
    }, 1000);
  }
  unSyncTimeLine() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}

class Ptz {
  constructor(jSPlugin) {
    this.jSPlugin = jSPlugin;
    const ptzWrap = document.createElement('div');
    ptzWrap.id = this.jSPlugin.id + "-ez-ptz-item";
    ptzWrap.className = "ez-ptz-wrap";
    ptzWrap.style = "display:none";
    var oS = document.createElement('style');
    oS.innerHTML = `
    .ez-ptz-container {
      position: relative;
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.80);
      box-shadow: 0px 0px 33px 4px rgb(0 0 0 / 15%);
      border: 1px solid rgba(255, 255, 255, 0.80);
      border-radius: 100%;
      cursor: pointer;
      overflow: hidden;
      user-select: none;
    }
    .ez-ptz-container .ez-ptz-icon.top {
      width: 0;
      height: 0;
      border-left: 3px solid transparent;
      border-right: 3px solid transparent;
      border-bottom: 6px solid #333333;
      position: absolute;
      display: inline-block;
      left: calc(50% - 3px);
      top: 2px;
    }

    .ez-ptz-container .ez-ptz-icon.top.active {
      border-bottom-color: #1890FF;
    }

    .ez-ptz-container .ez-ptz-icon.bottom {
      width: 0;
      height: 0;
      border-left: 3px solid transparent;
      border-right: 3px solid transparent;
      border-top: 6px solid #333333;
      position: absolute;
      display: inline-block;
      left: calc(50% - 3px);
      bottom: 2px;
    }

    .ez-ptz-container .ez-ptz-icon.bottom.active {
      border-top-color: #1890FF;
    }

    .ez-ptz-container .ez-ptz-icon.right {
      width: 0;
      height: 0;
      border-top: 3px solid transparent;
      border-bottom: 3px solid transparent;
      border-left: 6px solid #333333;
      position: absolute;
      display: inline-block;
      top: calc(50% - 3px);
      right: 2px;
    }

    .ez-ptz-container .ez-ptz-icon.right.active {
      border-left-color: #1890FF;
    }

    .ez-ptz-container .ez-ptz-icon.left {
      width: 0;
      height: 0;
      border-top: 3px solid transparent;
      border-bottom: 3px solid transparent;
      border-right: 6px solid #333333;
      position: absolute;
      display: inline-block;
      top: calc(50% - 3px);
      left: 2px;
    }

    .ez-ptz-container .ez-ptz-icon.left.active {
      border-right-color: #1890FF;
    }

    .ez-ptz-container .ez-ptz-main.center {
      width: 23px;
      height: 23px;
      background: #1890FF;
      border-radius: 100%;
      top: calc(50% - 12.3px);
      left: calc(50% - 12.3px);
      position: absolute;
    }

    .ez-ptz-wrap {
      position: absolute;
      right: 20px;
      top: calc(50% - 50px);
      width: 100px;
      height: 100px;
      z-index: 999;
    }

    .ez-ptz-close {
      position: absolute;
      color: #FFFFFF;
      top: 0;
      right: 0px;
    }`;
    document.getElementsByTagName("head")[0].appendChild(oS);
    ptzWrap.innerHTML = (`
      <div class="ez-ptz-container" id="${this.jSPlugin.id}-ez-ptz-container" style="position: relative;width: 80px;height: 80px;background: rgba(255, 255, 255, 0.80);box-shadow: 0px 0px 33px 4px rgba(0, 0, 0, 0.15);border: 1px solid rgba(255, 255, 255, 0.80);border-radius: 100%;cursor: pointer;overflow: hidden;user-select: none;">
        <div class="ez-ptz-main center"></div>
        <div class="ez-ptz-icon top active"></div>
        <div class="ez-ptz-icon left active"></div>
        <div class="ez-ptz-icon bottom active"></div>
        <div class="ez-ptz-icon right active"></div>
      `);
    document.getElementById(jSPlugin.id).appendChild(ptzWrap);
    // 云台控制事件绑定
    // 云台控制
    document.getElementById(`${this.jSPlugin.id}-ez-ptz-container`).onmousedown = (e) => {
      e.preventDefault();
      console.log("触摸开始");
      this._handlePtzTouch(e, 'start');
    };
    document.getElementById(`${this.jSPlugin.id}-ez-ptz-container`).onmouseup = (e) => {
      e.preventDefault();
      console.log("触摸结束");
      this._handlePtzTouch(e, 'stop');
    };

    document.getElementById(`${this.jSPlugin.id}-ez-ptz-container`).ontouchstart = (e) => {
      e.preventDefault();
      console.log("触摸开始");
      this._handlePtzTouch(e, 'start');
    };
    document.getElementById(`${this.jSPlugin.id}-ez-ptz-container`).ontouchend = (e) => {
      e.preventDefault();
      console.log("触摸结束", e);
      this._handlePtzTouch(e, 'stop');
    };
  }
  show() {
    document.getElementById(`${this.jSPlugin.id}-ez-ptz-item`).style = "display: inline-block";
  }
  hide() {
    document.getElementById(`${this.jSPlugin.id}-ez-ptz-item`).style = "display: none";
  }
  _handlePtzTouch(e, type) {
    var container = document.getElementById(`${this.jSPlugin.id}-ez-ptz-container`).getBoundingClientRect();
    var containerCenterX = container.left + 41;
    var containerCenterY = container.top + 41;
    var eventX = e.x || e.changedTouches[0].clientX;
    var eventY = e.y || e.changedTouches[0].clientY;
    var left = eventX - containerCenterX;
    var top = eventY - containerCenterY;
    var direction = 0; //操作命令：0-上，1-下，2-左，3-右，4-左上，5-左下，6-右上，7-右下，8-放大，9-缩小，10-近焦距，11-远焦距


    var url = this.jSPlugin.env.domain + "/api/lapp/device/ptz/start";
    // var nextPtzImg = ptzNormalImg;
    // var nextPtzImgFailed = ptzNormalImg;
    // 判读方位
    if (Math.abs(left) > Math.abs(top)) {
      if (left > 0) {
        direction = 3;
        // nextPtzImg = ptzRightImgSuccess;
        // nextPtzImgFailed = ptzRightImgFailed;
      } else {
        direction = 2;
        // nextPtzImg = ptzLeftImgSuccess;
        // nextPtzImgFailed = ptzLeftImgFailed;
      }
    } else {
      if (top > 0) {
        direction = 1;
        // nextPtzImg = ptzDownImgSuccess;
        // nextPtzImgFailed = ptzDownImgFailed;
      } else {
        direction = 0;
        // nextPtzImg = ptzTopImgSuccess;
        // nextPtzImgFailed = ptzTopImgFailed;
      }
    }
    // 兼容画面旋转90度
    if (/^rotate\(90/.test(document.getElementById(`${this.jSPlugin.id}-wrap`).style.transform)) {
      switch (direction) {
      case 0:
        direction = 2; // 上转化为左
        break;
      case 1:
        direction = 3; // 下转化为右
        break;
      case 2:
        direction = 1; // 左转化为下
        break;
      case 3:
        direction = 0; // 右转化为上
        break;
      }
    }
    document.getElementById(`${this.jSPlugin.id}-ez-ptz-container`).style = `background-image:linear-gradient(${direction === 0 ? 180 : (direction === 1 ? 0 : (direction === 2 ? 90 : 270))}deg, #1d8dd8 0%, rgba(100,143,252,0.00) 30%)`;
    if (type === 'stop') {
      url = this.jSPlugin.env.domain + '/api/lapp/device/ptz/stop';
      document.getElementById(`${this.jSPlugin.id}-ez-ptz-container`).style = "";
    }

    var data = new FormData();
    data.append("deviceSerial", matchEzopenUrl(this.jSPlugin.url).deviceSerial);
    data.append("channelNo", matchEzopenUrl(this.jSPlugin.url).channelNo);
    data.append("speed", 1);
    data.append("direction", direction);
    data.append("accessToken", this.jSPlugin.accessToken);
    fetch(url, {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then((rt) => {
        if (rt.code == 200) ; else {
          //document.getElementById('ptz-img-container').childNodes[0].src = nextPtzImgFailed;
          // layer.msg(data.msg);
          if (rt.code == 60005 || rt.code == 60002 || rt.code == 60003 || rt.code == 60004) {
            document.getElementById(`${this.jSPlugin.id}-ez-ptz-container`).style = `background-image:linear-gradient(${direction === 0 ? 180 : (direction === 1 ? 0 : (direction === 2 ? 90 : 270))}deg, #f45656 0%, rgba(100,143,252,0.00) 30%)`;
          }
        }
      });
  }
}

class Talk {
  constructor(jSPlugin) {
    this.jSPlugin = jSPlugin;
    const audioLeft = document.createElement('div');
    audioLeft.id = "audioleft";
    const audioRight = document.createElement('div');
    audioRight.id = "audioright";
    audioRight.style = "display:none;";
    const audioLeftDOM = document.createElement('audio');
    audioLeftDOM.id = "myaudio";
    audioLeftDOM.muted = true;
    audioLeftDOM.setAttribute("autoplay", true);
    audioLeftDOM.setAttribute("controls", true);
    audioLeft.appendChild(audioLeftDOM);
    audioLeft.style = "display:none;";

    const audioRightDOM = document.createElement('audio');
    audioRightDOM.id = "peeraudio";
    audioRightDOM.setAttribute("autoplay", true);
    audioRightDOM.setAttribute("controls", true);
    audioRight.appendChild(audioRightDOM);
    
    addJs(`${this.jSPlugin.staticPath}/talk/adapeter.js`, () => {
      addJs(`${this.jSPlugin.staticPath}/talk/janus.js`, () => {
        addJs(`${this.jSPlugin.staticPath}/talk/tts-v4.js`, () => {
          // 临时处理
          window.EZUIKit["handleTalkError"] = {
            handleTalkError: (err)=>{
              console.log("talk err", err);
            }
          };
          window.EZUIKit.opt = {
            rtcUrl: "",
            talkLink: "",
            ttsUrl: "",
            stream: "",
            deviceSerial: matchEzopenUrl(this.jSPlugin.url).deviceSerial,
            channelNo: matchEzopenUrl(this.jSPlugin.url).channelNo
          };
          document.body.appendChild(audioLeft);
          document.body.appendChild(audioRight);
        });
      });
    });
  }
  toString() {
    return `${this.coreX}-${this.coreY}`;
  }
  startTalk() {
    var formData = new FormData();
    formData.append("accessToken", this.jSPlugin.accessToken);
    formData.append("deviceSerial", matchEzopenUrl(this.jSPlugin.url).deviceSerial);
    formData.append("channelNo", matchEzopenUrl(this.jSPlugin.url).channelNo);
    fetch(this.jSPlugin.env.domain + "/api/lapp/live/talk/url", {
      method: "POST",
      // headers: {
      //   'Content-Type': 'application/json'
      // },
      body: formData
    })
      .then(response => response.json())
      .then((data) => {
        if (data.code == 200) {
          var apiResult = data.data;
          if (apiResult) {
            // 临时将https转换为websocket
            var rtcTrunk = apiResult.rtcUrl;
            if (rtcTrunk.indexOf("ws") === -1) {
              rtcTrunk = rtcTrunk.replace("https", "wss").replace("rtcgw", "rtcgw-ws");
            }
            window.EZUIKit.opt.rtcUrl = rtcTrunk;
            window.EZUIKit.opt.ttsUrl = "tts://" + apiResult.ttsUrl;
            var talk = "talk://" + window.EZUIKit.opt.deviceSerial + ":0:" + window.EZUIKit.opt.channelNo + ":cas.ys7.com:6500";
            window.EZUIKit.opt.talkLink = window.EZUIKit.opt.ttsUrl + "/" + talk;
            window.EZUIKit.opt.stream = apiResult.stream;
            window.startTalk();
          }
        }
      }).catch((err)=>{
        console.log("err", err);
      });
  }
  stopTalk() {
    window.stopTalk();
  }
}

class MobilePtz {
  constructor(jSPlugin) {
    this.jSPlugin = jSPlugin;
    var oS = document.createElement('style');
    oS.innerHTML = `
    body{
      padding: 0;
      margin: 0;
    }
    #mobile-ez-ptz-container {
      display: inline-block;
      width: 375px;
      text-align: center;
    }
    .live-ptz-title{
      height: 25px;
      font-size: 18px;
      color: #2c2c2c;
      text-align: center;
      font-weight: 700;
      margin: 24px 0;
    }
    #mobile-ez-ptz-container .mobile-ez-ptz-container {
      position: relative;
      width: 260px;
      height: 260px;
      background: rgba(255, 255, 255, 0.80);
      box-shadow: 0px 0px 33px 4px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.80);
      border-radius: 100%;
      cursor: pointer;
      overflow: hidden;
      margin: auto;
      /* background-image:linear-gradient(180deg, #d5e7f3 0%, rgba(100,143,252,0.00) 54%); */
    }

    #mobile-ez-ptz-container .mobile-ez-ptz-container .mobile-ez-ptz-icon.top {
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 6px solid #333333;
      position: absolute;
      display: inline-block;
      left: calc(50% - 6px);
      top: 10px;
    }

    #mobile-ez-ptz-container .mobile-ez-ptz-container .mobile-ez-ptz-icon.top.active {
      border-bottom-color: #1890FF;
    }

    #mobile-ez-ptz-container .mobile-ez-ptz-container .mobile-ez-ptz-icon.bottom {
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid #333333;
      position: absolute;
      display: inline-block;
      left: calc(50% - 6px);
      bottom: 10px;
    }

    #mobile-ez-ptz-container .mobile-ez-ptz-container .mobile-ez-ptz-icon.bottom.active {
      border-top-color: #1890FF;

    }

    #mobile-ez-ptz-container .mobile-ez-ptz-container .mobile-ez-ptz-icon.right {
      width: 0;
      height: 0;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-left: 6px solid #333333;
      position: absolute;
      display: inline-block;
      top: calc(50% - 6px);
      right: 10px;
    }

    #mobile-ez-ptz-container .mobile-ez-ptz-container .mobile-ez-ptz-icon.right.active {
      border-left-color: #1890FF;

    }

    #mobile-ez-ptz-container .mobile-ez-ptz-container .mobile-ez-ptz-icon.left {
      width: 0;
      height: 0;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-right: 6px solid #333333;
      position: absolute;
      display: inline-block;
      top: calc(50% - 6px);
      left: 10px;
    }

    #mobile-ez-ptz-container .mobile-ez-ptz-container .mobile-ez-ptz-icon.left.active {
      border-right-color: #1890FF;

    }

    #mobile-ez-ptz-container .mobile-ez-ptz-container .ez-ptz-main.center {
      width: 52px;
      height: 52px;
      background: #FFFFFF;
      border: 2px solid #eee;
      border-radius: 100%;
      top: calc(50% - 26px);
      left: calc(50% - 26px);
      position: absolute;
      /* box-shadow: 0px -39px 40px 6px #1890ff; */
    }

    #mobile-ez-ptz-container .mobile-ez-ptz-wrap {
      display: inline-block;
      padding: 12px 24px;
      border-radius: 100%;
      overflow: hidden;
    }

    #mobile-ez-ptz-container .ez-ptz-close {
      position: absolute;
      color: #FFFFFF;
      top: 0;
      right: 0px;
    }`;
    document.getElementsByTagName("head")[0].appendChild(oS);
    const mobileContainer = document.createElement('div');
    mobileContainer.className = "mobile-ez-ptz-container";
    mobileContainer.id = "mobile-ez-ptz-container";
    mobileContainer.style = `display:inline-block;width: ${this.jSPlugin.width}px;text-align:center;`;
    var mobileContainerTitle = document.createElement('div');
    mobileContainerTitle.className = "live-ptz-title";
    mobileContainerTitle.id = "live-ptz-title";
    mobileContainerTitle.innerHTML = "云台控制";
    const ptzWrap = document.createElement('div');
    ptzWrap.id = "mobile-ez-ptz-item";
    ptzWrap.className = "mobile-ez-ptz-wrap";
    ptzWrap.innerHTML = (`
    <div class="mobile-ez-ptz-container" id="mobile-ez-ptz-container">
      <div class="ez-ptz-main center"></div>
      <div class="mobile-ez-ptz-icon top active"></div>
      <div class="mobile-ez-ptz-icon left active"></div>
      <div class="mobile-ez-ptz-icon bottom active"></div>
      <div class="mobile-ez-ptz-icon right active"></div>
    </div>
      `);
    mobileContainer.appendChild(ptzWrap);
    //document.getElementById(jSPlugin.id).appendChild(mobileContainer);
    insertAfter$1(mobileContainer, document.getElementById(`${this.jSPlugin.id}-wrap`));
    mobileContainer.parentElement.insertBefore(mobileContainerTitle, mobileContainer);
    // 云台控制事件绑定
    // 云台控制
    document.getElementById("mobile-ez-ptz-item").ontouchstart = (e) => {
      e.preventDefault();
      console.log("触摸开始");
      this._handlePtzTouch(e, 'start');
    };
    document.getElementById("mobile-ez-ptz-item").ontouchend = (e) => {
      e.preventDefault();
      console.log("触摸结束", e);
      this._handlePtzTouch(e, 'stop');
    };
    // 云台控制
    document.getElementById("mobile-ez-ptz-item").onmousedown = (e) => {
      e.preventDefault();
      console.log("触摸开始");
      this._handlePtzTouch(e, 'start');
    };
    document.getElementById("mobile-ez-ptz-item").onmouseup = (e) => {
      e.preventDefault();
      console.log("触摸结束", e);
      this._handlePtzTouch(e, 'stop');
    };
  }
  show() {
    document.getElementById("mobile-ez-ptz-item").style = "display: inline-block";
  }
  hide() {
    document.getElementById("mobile-ez-ptz-item").style = "display: none";
  }
  _handlePtzTouch(e, type) {
    var container = document.getElementById('mobile-ez-ptz-item').getBoundingClientRect();
    var containerCenterX = container.left + 130;
    var containerCenterY = container.top + 130;
    var eventX = e.x || e.changedTouches[0].clientX;
    var eventY = e.y || e.changedTouches[0].clientY;
    var left = eventX - containerCenterX;
    var top = eventY - containerCenterY;
    var direction = 0; //操作命令：0-上，1-下，2-左，3右，4-左上，5-左下，6-右上，7-右下，8-放大，9-缩小，10-近焦距，11-远焦距


    var url = this.jSPlugin.env.domain + "/api/lapp/device/ptz/start";
    // var nextPtzImg = ptzNormalImg;
    // var nextPtzImgFailed = ptzNormalImg;
    // 判读方位
    if (Math.abs(left) > Math.abs(top)) {
      if (left > 0) {
        direction = 3;
        // nextPtzImg = ptzRightImgSuccess;
        // nextPtzImgFailed = ptzRightImgFailed;
      } else {
        direction = 2;
        // nextPtzImg = ptzLeftImgSuccess;
        // nextPtzImgFailed = ptzLeftImgFailed;
      }
    } else {
      if (top > 0) {
        direction = 1;
        // nextPtzImg = ptzDownImgSuccess;
        // nextPtzImgFailed = ptzDownImgFailed;
      } else {
        direction = 0;
        // nextPtzImg = ptzTopImgSuccess;
        // nextPtzImgFailed = ptzTopImgFailed;
      }
    }
    console.log("direction",direction);
    document.getElementById("mobile-ez-ptz-item").style = `background-image:linear-gradient(${direction === 0 ? 180 : (direction === 1 ? 0 : (direction === 2 ? 90 : 270))}deg, #1d8dd8 0%, rgba(100,143,252,0.00) 30%)`;
    if (type === 'stop') {
      url = this.jSPlugin.env.domain + '/api/lapp/device/ptz/stop';
      document.getElementById("mobile-ez-ptz-item").style = "";
    }

    var data = new FormData();
    data.append("deviceSerial", matchEzopenUrl(this.jSPlugin.url).deviceSerial);
    data.append("channelNo", matchEzopenUrl(this.jSPlugin.url).channelNo);
    data.append("speed", 1);
    data.append("direction", direction);
    data.append("accessToken", this.jSPlugin.accessToken);
    fetch(url, {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then((rt) => {
        if (rt.code == 200) ; else {
          //document.getElementById('ptz-img-container').childNodes[0].src = nextPtzImgFailed;
          // layer.msg(data.msg);
          if (rt.code == 60005 || rt.code == 60002 || rt.code == 60003 || rt.code == 60004) {
            document.getElementById("mobile-ez-ptz-item").style = `background-image:linear-gradient(${direction === 0 ? 180 : (direction === 1 ? 0 : (direction === 2 ? 90 : 270))}deg, #f45656 0%, rgba(100,143,252,0.00) 30%)`;
          }
        }
      });
  }
}

var retcode$4 = 0;
var msg$4 = "成功";
var data$4 = {
	header: {
		color: "#FFFFFF",
		backgroundColor: "#000000",
		activeColor: "#FFFFFF",
		btnList: [
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-header-0",
				iconId: "deviceID",
				part: "left",
				defaultActive: 0,
				isrender: 0,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-header-1",
				iconId: "deviceName",
				part: "left",
				defaultActive: 0,
				isrender: 0,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-header-2",
				iconId: "cloudRec",
				part: "right",
				defaultActive: 0,
				isrender: 0,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-header-3",
				iconId: "rec",
				part: "right",
				defaultActive: 0,
				isrender: 0,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			}
		]
	},
	footer: {
		color: "#FFFFFF",
		backgroundColor: "rgb(0 0 0 / 0%)",
		activeColor: "#FFFFFF",
		btnList: [
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-footer-0",
				iconId: "play",
				part: "left",
				defaultActive: 1,
				isrender: 0,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-footer-1",
				iconId: "capturePicture",
				part: "left",
				defaultActive: 0,
				isrender: 0,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-footer-2",
				iconId: "sound",
				part: "left",
				defaultActive: 0,
				isrender: 0,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-footer-3",
				iconId: "pantile",
				part: "left",
				defaultActive: 0,
				isrender: 0,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-footer-4",
				iconId: "recordvideo",
				part: "left",
				defaultActive: 0,
				isrender: 0,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-footer-5",
				iconId: "talk",
				part: "left",
				defaultActive: 0,
				isrender: 0,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-footer-6",
				iconId: "hd",
				part: "right",
				defaultActive: 0,
				isrender: 0,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-footer-7",
				iconId: "webExpend",
				part: "right",
				defaultActive: 0,
				isrender: 0,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-footer-8",
				iconId: "expend",
				part: "right",
				defaultActive: 0,
				isrender: 0,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			}
		]
	}
};
var emptyData = {
	retcode: retcode$4,
	msg: msg$4,
	data: data$4
};

var retcode$3 = 0;
var msg$3 = "成功";
var data$3 = {
	header: {
		color: "#FFFFFF",
		backgroundColor: "#000000",
		activeColor: "#FFFFFF",
		btnList: [
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-header-0",
				iconId: "deviceID",
				part: "left",
				defaultActive: 1,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-header-1",
				iconId: "deviceName",
				part: "left",
				defaultActive: 1,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			}
		]
	},
	footer: {
		color: "#FFFFFF",
		backgroundColor: "rgb(0 0 0 / 0%)",
		activeColor: "#FFFFFF",
		btnList: [
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-footer-0",
				iconId: "play",
				part: "left",
				defaultActive: 1,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-footer-1",
				iconId: "capturePicture",
				part: "left",
				defaultActive: 0,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-footer-2",
				iconId: "sound",
				part: "left",
				defaultActive: 0,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-footer-3",
				iconId: "pantile",
				part: "left",
				defaultActive: 0,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-footer-4",
				iconId: "recordvideo",
				part: "left",
				defaultActive: 0,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-footer-5",
				iconId: "talk",
				part: "left",
				defaultActive: 0,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-footer-6",
				iconId: "hd",
				part: "right",
				defaultActive: 0,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-footer-7",
				iconId: "webExpend",
				part: "right",
				defaultActive: 0,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-footer-8",
				iconId: "expend",
				part: "right",
				defaultActive: 0,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			}
		]
	}
};
var pcLiveData = {
	retcode: retcode$3,
	msg: msg$3,
	data: data$3
};

var retcode$2 = 0;
var msg$2 = "成功";
var data$2 = {
	header: {
		color: "#FFFFFF",
		backgroundColor: "#000000",
		activeColor: "#FFFFFF",
		btnList: [
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-header-0",
				iconId: "deviceID",
				part: "left",
				defaultActive: 0,
				isrender: 1,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-header-1",
				iconId: "deviceName",
				part: "left",
				defaultActive: 0,
				isrender: 1,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-header-2",
				iconId: "cloudRec",
				part: "right",
				defaultActive: 0,
				isrender: 1,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-header-3",
				iconId: "rec",
				part: "right",
				defaultActive: 0,
				isrender: 1,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			}
		]
	},
	footer: {
		color: "#FFFFFF",
		backgroundColor: "rgba(0 0 0 / 0%)",
		activeColor: "#FFFFFF",
		btnList: [
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-footer-0",
				iconId: "play",
				part: "left",
				defaultActive: 1,
				isrender: 1,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-footer-1",
				iconId: "capturePicture",
				part: "left",
				defaultActive: 0,
				isrender: 1,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-footer-2",
				iconId: "sound",
				part: "left",
				defaultActive: 0,
				isrender: 1,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-footer-4",
				iconId: "recordvideo",
				part: "left",
				defaultActive: 0,
				isrender: 1,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-footer-7",
				iconId: "webExpend",
				part: "right",
				defaultActive: 0,
				isrender: 1,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f7896c8942c9476fb439370dd974f1c0-footer-8",
				iconId: "expend",
				part: "right",
				defaultActive: 0,
				isrender: 1,
				themeId: "f7896c8942c9476fb439370dd974f1c0"
			}
		]
	}
};
var pcRecData = {
	retcode: retcode$2,
	msg: msg$2,
	data: data$2
};

var retcode$1 = 0;
var msg$1 = "成功";
var data$1 = {
	header: {
		color: "#FFFFFF",
		backgroundColor: "#000000",
		activeColor: "#FFFFFF",
		btnList: [
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-header-0",
				iconId: "deviceID",
				part: "left",
				defaultActive: 1,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-header-1",
				iconId: "deviceName",
				part: "left",
				defaultActive: 1,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			}
		]
	},
	footer: {
		color: "#FFFFFF",
		backgroundColor: "rgb(0 0 0 / 0%)",
		activeColor: "#FFFFFF",
		btnList: [
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-footer-0",
				iconId: "play",
				part: "left",
				defaultActive: 1,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-footer-2",
				iconId: "sound",
				part: "left",
				defaultActive: 0,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-footer-3",
				iconId: "pantile",
				part: "left",
				defaultActive: 0,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-footer-5",
				iconId: "talk",
				part: "left",
				defaultActive: 0,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-footer-6",
				iconId: "hd",
				part: "right",
				defaultActive: 0,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-footer-7",
				iconId: "expend",
				part: "right",
				defaultActive: 0,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			}
		]
	}
};
var mobileLiveData = {
	retcode: retcode$1,
	msg: msg$1,
	data: data$1
};

var retcode = 0;
var msg = "成功";
var data = {
	header: {
		color: "#FFFFFF",
		backgroundColor: "#000000",
		activeColor: "#FFFFFF",
		btnList: [
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-header-0",
				iconId: "deviceID",
				part: "left",
				defaultActive: 1,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-header-1",
				iconId: "deviceName",
				part: "left",
				defaultActive: 1,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			}
		]
	},
	footer: {
		color: "#FFFFFF",
		backgroundColor: "rgb(0 0 0 / 0%)",
		activeColor: "#FFFFFF",
		btnList: [
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-footer-0",
				iconId: "play",
				part: "left",
				defaultActive: 1,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-footer-2",
				iconId: "sound",
				part: "left",
				defaultActive: 0,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			},
			{
				btnKey: "c1cbc1d4e86d49a0981f54beea95280a-f9a70c9a4fde425c9c7ec7815b9fec4b-footer-7",
				iconId: "expend",
				part: "right",
				defaultActive: 0,
				isrender: 1,
				themeId: "f9a70c9a4fde425c9c7ec7815b9fec4b"
			}
		]
	}
};
var mobileRecData = {
	retcode: retcode,
	msg: msg,
	data: data
};

const styleToString = (obj) => {
  let styleString = "";
  Object.keys(obj).map((item, index) => {
    styleString += `${item}:${obj[item]}${index < Object.keys(obj).length - 1 ? ';' : ""}`;
  });
  return styleString;
};

class Theme {
  constructor(jSPlugin) {
    this.jSPlugin = jSPlugin;
    this.isNeedRenderHeader = false;
    this.isNeedRenderFooter = false;
    this.decoderState = {
      state: {
        isEditing: false,
        play: true,
        sound: true,
        recordvideo: false,
        recordTimer: null,
        recordCount: "00:00",
        talk: false,
        pantile: false,
        hd: false,
        expend: false,
        webExpend: false,
        cloudRec: matchEzopenUrl(jSPlugin.url).type === 'cloud.rec',
        rec: matchEzopenUrl(jSPlugin.url).type === 'rec',
        type: matchEzopenUrl(jSPlugin.url).type
      }
    };
    this.inited = false;
    this.isMobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    // 默认主题 - 按钮全部展示
    this.themeData = emptyData.data;
    // 自适应主题数据
    /*
     移动端 & 直播 =》 mobileLive
     移动端 & 回放地址 => mobileRec
     PC端 & 直播 =》 pcLive
     PC端 & 回放地址 => pcRec
    */
    if (this.jSPlugin.themeId) {
      switch (this.jSPlugin.themeId) {
      case 'pcLive':
        this.themeData = pcLiveData.data;
        this.initThemeData();
        this.renderThemeData();
        break;
      case 'pcRec':
        this.themeData = pcRecData.data;
        this.initThemeData();
        this.renderThemeData();
        break;
      case 'mobileLive':
        this.themeData = mobileLiveData.data;
        this.initThemeData();
        this.renderThemeData();
        break;
      case 'mobileRec':
        this.themeData = mobileRecData.data;
        this.initThemeData();
        this.renderThemeData();
        break;
      case 'themeData':
        this.themeData = this.jSPlugin.params.themeData;
        this.initThemeData();
        this.renderThemeData();
        break;
      default:
        this.fetchThemeData(this.jSPlugin.themeId);
        break;
      }
    }
    if (!this.jSPlugin.Talk) {
      this.jSPlugin.Talk = new Talk(this.jSPlugin);
    }
  }
  fetchThemeData(themeId) {
    const url = `${this.jSPlugin.env.domain}/jssdk/ezopen/template/getDetail?accessToken=${this.jSPlugin.accessToken}&id=${themeId}`;
    fetch(url, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        console.log("get theme data", data);
        if (data.meta.code === 0 && data.data) {
          if (data.data.header) {
            this.themeData.header = data.data.header;
          }
          if (data.data.footer) {
            this.themeData.footer = data.data.footer;
          }
          // // 判断是否自动隐藏控件
          // if (themeData[0].autoFocus > 0) {
          //   autoFocus = parseInt(themeData[0].autoFocus);
          // }
          this.initThemeData();
          this.renderThemeData();
        }
      })
      .catch(error => {
        this.renderThemeData();
      });
  }
  changeTheme(options) {
    if(typeof options === 'string') {
      this.jSPlugin.themeId = options;
      switch (this.jSPlugin.themeId) {
        case 'pcLive':
          this.themeData = pcLiveData.data;
          this.initThemeData();
          this.renderThemeData();
          break;
        case 'pcRec':
          this.themeData = pcRecData.data;
          this.initThemeData();
          this.renderThemeData();
          break;
        case 'mobileLive':
          this.themeData = mobileLiveData.data;
          this.initThemeData();
          this.renderThemeData();
          break;
        case 'mobileRec':
          this.themeData = mobileRecData.data;
          this.initThemeData();
          this.renderThemeData();
          break;
        case 'themeData':
          this.themeData = this.jSPlugin.params.themeData;
          this.initThemeData();
          this.renderThemeData();
          break;
        default:
          this.fetchThemeData(options);
          break;
        }
    } else if (typeof options === 'object') {
      this.themeData = options;
      this.initThemeData();
      this.renderThemeData();
    }
  }
  renderThemeData() {
    const { header, footer } = this.themeData;
    if (this.isNeedRenderHeader && header) {
      document.getElementById(`${this.jSPlugin.id}-headControl`).style.background = header.backgroundColor.replace("-diy", "");
      document.getElementById(`${this.jSPlugin.id}-headControl`).style.color = header.color.replace("-diy", "");
      header.btnList.map((item, index) => {
        if (item.isrender) {
          this.setDecoderState({ [item.iconId]: this.decoderState[item.iconId] });
        }
      });
    }
    if (this.isNeedRenderFooter && footer) {
      document.getElementById(`${this.jSPlugin.id}-audioControls`).style.background = footer.backgroundColor.replace("-diy", "");
      document.getElementById(`${this.jSPlugin.id}-audioControls`).style.color = footer.color.replace("-diy", "");
      footer.btnList.map((item, index) => {
        if (item.isrender) {
          this.setDecoderState({ [item.iconId]: this.decoderState[item.iconId] });
        }
      });
    }
  }
  setDecoderState(options) {
    const { header, footer } = this.themeData;
    Object.keys(options).map((item, index) => {
      var color = "#FFFFFF";
      var activeColor = "#FFFFFF";
      var _index = header.btnList.findIndex((i) => {
        return i.iconId === item;
      });
      if (_index === -1) {
        color = footer.color.replace("-diy", "");
        activeColor = footer.activeColor.replace("-diy", "");
      } else {
        color = header.color.replace("-diy", "");
        activeColor = header.activeColor.replace("-diy", "");
      }
      switch (item) {
      case 'play':
        if (options[item]) {
          if (document.getElementById(`${this.jSPlugin.id}-play`)) {
            document.getElementById(`${this.jSPlugin.id}-play-content`).children[0].children[0].style = "display:inline-block";
            document.getElementById(`${this.jSPlugin.id}-play-content`).children[0].children[1].style = "display:none";
            document.getElementById(`${this.jSPlugin.id}-play`).className = options[item] ? 'active' : '';
            document.getElementById(`${this.jSPlugin.id}-play-content`).childNodes[0].children[0].style.fill = options[item] ? activeColor : color;
          }
        } else {
          if (document.getElementById(`${this.jSPlugin.id}-play`)) {
            document.getElementById(`${this.jSPlugin.id}-play-content`).children[0].children[1].style = "display:inline-block";
            document.getElementById(`${this.jSPlugin.id}-play-content`).children[0].children[0].style = "display:none";
            document.getElementById(`${this.jSPlugin.id}-play`).className = options[item] ? 'active' : '';
            document.getElementById(`${this.jSPlugin.id}-play-content`).childNodes[0].children[1].style.fill = options[item] ? activeColor : color;
          }
        }
        break;
      case 'sound':
        if (document.getElementById(`${this.jSPlugin.id}-sound`)) {
          if (options[item]) {
            document.getElementById(`${this.jSPlugin.id}-sound-content`).children[0].children[1].style = "display:inline-block";
            document.getElementById(`${this.jSPlugin.id}-sound-content`).children[0].children[0].style = "display:none";
            document.getElementById(`${this.jSPlugin.id}-sound`).className = options[item] ? 'active' : '';
            document.getElementById(`${this.jSPlugin.id}-sound-content`).childNodes[0].children[1].style.fill = options[item] ? activeColor : color;
          } else {
            document.getElementById(`${this.jSPlugin.id}-sound-content`).children[0].children[0].style = "display:inline-block";
            document.getElementById(`${this.jSPlugin.id}-sound-content`).children[0].children[1].style = "display:none";
            document.getElementById(`${this.jSPlugin.id}-sound`).className = options[item] ? 'active' : '';
            document.getElementById(`${this.jSPlugin.id}-sound-content`).childNodes[0].children[0].style.fill = options[item] ? activeColor : color;
          }
        }
        break;
      case 'recordvideo':
        if (document.getElementById(`${this.jSPlugin.id}-recordvideo`)) {
          document.getElementById(`${this.jSPlugin.id}-recordvideo`).className = options[item] ? 'active' : '';
          document.getElementById(`${this.jSPlugin.id}-recordvideo-content`).childNodes[0].style.fill = options[item] ? activeColor : color;
        }
        break;
      case 'talk':
        if (document.getElementById(`${this.jSPlugin.id}-talk`)) {
          document.getElementById(`${this.jSPlugin.id}-talk`).className = options[item] ? 'active' : '';
          document.getElementById(`${this.jSPlugin.id}-talk-content`).childNodes[1].style.fill = options[item] ? activeColor : color;
        }
        break;
      case 'pantile':
        if (document.getElementById(`${this.jSPlugin.id}-pantile`)) {
          document.getElementById(`${this.jSPlugin.id}-pantile`).className = options[item] ? 'active' : '';
          document.getElementById(`${this.jSPlugin.id}-pantile-content`).childNodes[0].style.fill = options[item] ? activeColor : color;
        }
        break;
      case 'webExpend':
        if (options[item]) {
          if (document.getElementById(`${this.jSPlugin.id}-webExpend`)) {
            document.getElementById(`${this.jSPlugin.id}-webExpend-content`).children[0].children[1].style = "display:inline-block";
            document.getElementById(`${this.jSPlugin.id}-webExpend-content`).children[0].children[0].style = "display:none";
          }
          // 全屏置灰
          if (document.getElementById(`${this.jSPlugin.id}-expend`)) {
            document.getElementById(`${this.jSPlugin.id}-expend`).className = "disabled";
          }
        } else {
          if (document.getElementById(`${this.jSPlugin.id}-webExpend`)) {
            document.getElementById(`${this.jSPlugin.id}-webExpend-content`).children[0].children[0].style = "display:inline-block";
            document.getElementById(`${this.jSPlugin.id}-webExpend-content`).children[0].children[1].style = "display:none";
          }
          // 全屏置灰
          if (document.getElementById(`${this.jSPlugin.id}-expend`)) {
            document.getElementById(`${this.jSPlugin.id}-expend`).className = "";
          }
        }
        if (document.getElementById(`${this.jSPlugin.id}-webExpend`)) {
          document.getElementById(`${this.jSPlugin.id}-webExpend`).className = options[item] ? 'active' : '';
          document.getElementById(`${this.jSPlugin.id}-webExpend-content`).childNodes[0].childNodes[0].style.fill = options[item] ? activeColor : color;
          document.getElementById(`${this.jSPlugin.id}-webExpend-content`).childNodes[0].childNodes[1].style.fill = options[item] ? activeColor : color;
        }
        break;
      case 'capturePicture':
        if (document.getElementById(`${this.jSPlugin.id}-capturePicture`)) {
          document.getElementById(`${this.jSPlugin.id}-capturePicture`).className = options[item] ? 'active' : '';
          document.getElementById(`${this.jSPlugin.id}-capturePicture-content`).childNodes[0].style.fill = options[item] ? activeColor : color;
        }
        break;
      case 'expend':
        if (options[item]) {
          if (document.getElementById(`${this.jSPlugin.id}-expend`)) {
            document.getElementById(`${this.jSPlugin.id}-expend-content`).children[0].children[1].style = "display:inline-block";
            document.getElementById(`${this.jSPlugin.id}-expend-content`).children[0].children[0].style = "display:none";
          }
          // 网站全屏置灰
          if (document.getElementById(`${this.jSPlugin.id}-webExpend`)) {
            document.getElementById(`${this.jSPlugin.id}-webExpend`).className = "disabled";
          }
        } else {
          if (document.getElementById(`${this.jSPlugin.id}-expend`)) {
            document.getElementById(`${this.jSPlugin.id}-expend-content`).children[0].children[0].style = "display:inline-block";
            document.getElementById(`${this.jSPlugin.id}-expend-content`).children[0].children[1].style = "display:none";
          }
          // 网站全屏置灰
          if (document.getElementById(`${this.jSPlugin.id}-webExpend`)) {
            document.getElementById(`${this.jSPlugin.id}-webExpend`).className = "";
          }
        }
        if (document.getElementById(`${this.jSPlugin.id}-expend`)) {
          document.getElementById(`${this.jSPlugin.id}-expend`).className = options[item] ? 'active' : '';
          document.getElementById(`${this.jSPlugin.id}-expend-content`).childNodes[0].childNodes[0].style.fill = options[item] ? activeColor : color;
          document.getElementById(`${this.jSPlugin.id}-expend-content`).childNodes[0].childNodes[1].style.fill = options[item] ? activeColor : color;
        }
        break;
      case 'hd':
        if (options[item]) {
          if(document.getElementById(`${this.jSPlugin.id}-hd`)) {
            document.getElementById(`${this.jSPlugin.id}-hd-content`).children[1].children[0].style = "display:block";
            document.getElementById(`${this.jSPlugin.id}-hd-content`).children[1].children[1].style = "display:none";
          }
        } else {
          if(document.getElementById(`${this.jSPlugin.id}-hd`)) {
            document.getElementById(`${this.jSPlugin.id}-hd-content`).children[1].children[1].style = "display:block";
            document.getElementById(`${this.jSPlugin.id}-hd-content`).children[1].children[0].style = "display:none";
          }
        }
        break;
      case 'cloudRec':
        if (document.getElementById(`${this.jSPlugin.id}-cloudRec`)) {
          document.getElementById(`${this.jSPlugin.id}-cloudRec`).className = options[item] ? 'active' : '';
          document.getElementById(`${this.jSPlugin.id}-cloudRec-content`).children[0].children[0].style.fill = options[item] ? activeColor : color;
        }
        if (document.getElementById(`${this.jSPlugin.id}-rec`)) {
          document.getElementById(`${this.jSPlugin.id}-rec`).className = options[item] ? 'active' : '';
          document.getElementById(`${this.jSPlugin.id}-rec-content`).children[0].children[0].style.fill = options[item] ? color : activeColor;
        }
        break;
      case 'rec':
        if (document.getElementById(`${this.jSPlugin.id}-cloudRec`)) {
          document.getElementById(`${this.jSPlugin.id}-cloudRec`).className = options[item] ? 'active' : '';
          document.getElementById(`${this.jSPlugin.id}-cloudRec-content`).children[0].children[0].style.fill = options[item] ? color : activeColor;
        }
        if (document.getElementById(`${this.jSPlugin.id}-rec`)) {
          document.getElementById(`${this.jSPlugin.id}-rec`).className = options[item] ? 'active' : '';
          document.getElementById(`${this.jSPlugin.id}-rec-content`).children[0].children[0].style.fill = options[item] ? activeColor : color;
        }
        break;
      }
      this.decoderState.state = Object.assign(this.decoderState.state, options);
    });
  }
  toString() {
    return `${this.coreX}-${this.coreY}`;
  }
  renderFooter(id, part) {
    // 播放停止
    var objItem = this.matchBtn(id);
    var objDOM = document.createElement('div');
    objDOM.innerHTML = `${`<span id="${this.jSPlugin.id}-${objItem.id}" style="position:relative;${objItem.part === 'left' ? 'margin-right: 12px;' : 'margin-left: 12px;'}">`
      + `<span id="${this.jSPlugin.id}-${objItem.id}-content" title="${objItem.title}" style="display:inline-block;min-height:48px;max-height:96px;">`}${objItem.domString
    }</span>`
      + `<span id="${objItem.id}-remove" title="移除" style="position: absolute;top: -10px;left: 38px;display: none;">`
      + '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 15 15">'
      + '<circle style="fill-rule:evenodd;clip-rule:evenodd;fill-opacity:0.8011;" cx="7.5" cy="7.6" r="7" />'
      + '<rect x="3.9" y="3.5" class="st1" style="fill:none;" width="8.1" height="8.1" />'
      + '<line style="fill:none;stroke:#ffffff;stroke-width:0.5833;stroke-linecap:round;" x1="4.9" y1="5" x2="10" y2="10.1" />'
      + '<line style="fill:none;stroke:#ffffff;stroke-width:0.5833;stroke-linecap:round;" x1="4.9" y1="10.1" x2="10" y2="5" />'
      + '</svg>'
      + '</span>'
      + '</span>';
    objDOM.onclick = objItem.onclick;
    if (part === 'left') {
      document.getElementById(`${this.jSPlugin.id}-audioControls`).childNodes[0].appendChild(objDOM);
    } else {
      document.getElementById(`${this.jSPlugin.id}-audioControls`).childNodes[1].appendChild(objDOM);
    }
    // 截图
  }
  renderHeader(id, part) {
    // 播放停止
    var objItem = this.matchBtn(id);
    var objDOM = document.createElement('div');
    objDOM.innerHTML = `${`<span id="${this.jSPlugin.id}-${objItem.id}" style="position:relative;${objItem.part === 'left' ? 'margin-right: 12px;' : 'margin-left: 12px;'}">`
      + `<span id="${this.jSPlugin.id}-${objItem.id}-content" title="${objItem.title}" style="display:inline-block;height:48px;">`}${objItem.domString
    }</span>`
      + `<span id="${this.jSPlugin.id}-${objItem.id}-remove" title="移除" style="position: absolute;top: -10px;left: 38px;display: none;">`
      + '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 15 15">'
      + '<circle style="fill-rule:evenodd;clip-rule:evenodd;fill-opacity:0.8011;" cx="7.5" cy="7.6" r="7" />'
      + '<rect x="3.9" y="3.5" class="st1" style="fill:none;" width="8.1" height="8.1" />'
      + '<line style="fill:none;stroke:#ffffff;stroke-width:0.5833;stroke-linecap:round;" x1="4.9" y1="5" x2="10" y2="10.1" />'
      + '<line style="fill:none;stroke:#ffffff;stroke-width:0.5833;stroke-linecap:round;" x1="4.9" y1="10.1" x2="10" y2="5" />'
      + '</svg>'
      + '</span>'
      + '</span>';
    objDOM.onclick = objItem.onclick;
    if (part === 'left') {
      document.getElementById(`${this.jSPlugin.id}-headControl`).childNodes[0].appendChild(objDOM);
    } else {
      document.getElementById(`${this.jSPlugin.id}-headControl`).childNodes[1].appendChild(objDOM);
    }
  }
  matchBtn(btnId) {
    const { header, footer } = this.themeData;
    const btnItem = {
      title: "",
      id: "",
      domString: "",
      color: "#FFFFFF",
      activeColor: "#FFFFFF",
      onclick: () => { },
      onmoveleft: () => { },
      onmoveright: () => { },
      onremove: () => { }
    };
    var _index = header.btnList.findIndex((item) => {
      return item.iconId === btnId;
    });
    if (_index === -1) {
      btnItem.color = footer.color;
      btnItem.backgroundColor = footer.backgroundColor;
      btnItem.activeColor = footer.activeColor;
    } else {
      btnItem.color = header.color;
      btnItem.backgroundColor = header.backgroundColor;
      btnItem.activeColor = header.activeColor;
    }
    switch (btnId) {
    case 'play':
      btnItem.title = "播放/结束播放";
      btnItem.id = btnId;
      btnItem.domString = (
        '<span>'
          + `<svg style="display:none" width="48" height="48" fill="${btnItem.color}" viewBox="-6 -6 32 32">
            <path id="Stroke-1" class="st1" d="M10.5,1.7c-4.9,0-8.8,4-8.8,8.8s4,8.8,8.8,8.8s8.8-4,8.8-8.8S15.4,1.7,10.5,1.7z M10.5,2.7
              c4.3,0,7.8,3.5,7.8,7.8s-3.5,7.8-7.8,7.8s-7.8-3.5-7.8-7.8S6.2,2.7,10.5,2.7z"/>
            <path class="st2" d="M8.7,8C9,8,9.3,8.3,9.3,8.6v3.8C9.3,12.7,9,13,8.7,13C8.3,13,8,12.7,8,12.4V8.6C8,8.3,8.3,8,8.7,8z"/>
            <path id="Rectangle-Copy-10" class="st2" d="M12.8,8c0.3,0,0.6,0.3,0.6,0.6v3.8c0,0.3-0.3,0.6-0.6,0.6c-0.3,0-0.6-0.3-0.6-0.6V8.6
              C12.2,8.3,12.5,8,12.8,8z"/>
          </svg>`
          + `<svg fill="${btnItem.color}" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="-6 -6 32 32">`
          + '<path d="M13,9.8L10.1,8C9.9,7.9,9.7,7.9,9.5,7.9c-0.6,0-1,0.4-1,1v3.7c0,0.2,0.1,0.4,0.2,0.5c0.3,0.5,0.9,0.6,1.4,0.3 l2.9-1.8c0.1-0.1,0.2-0.2,0.3-0.3C13.6,10.7,13.4,10.1,13,9.8z" />'
          + '<path d="M10.5,1.9c-4.9,0-8.8,4-8.8,8.8c0,4.9,4,8.8,8.8,8.8s8.8-4,8.8-8.8C19.4,5.8,15.4,1.9,10.5,1.9z M10.5,18.5 c-4.3,0-7.8-3.5-7.8-7.8s3.5-7.8,7.8-7.8c4.3,0,7.8,3.5,7.8,7.8S14.9,18.5,10.5,18.5z" />'
          + '</svg>'
          + '</span>'
      );
      btnItem.onclick = () => {
        const { play } = this.decoderState.state;
        if (play) {
          this.jSPlugin.stop();
        } else {
          this.jSPlugin.play();
        }
        this.setDecoderState({ play: !play });
      };
      return btnItem;
    case 'sound':
      btnItem.title = "声音";
      btnItem.id = btnId;
      btnItem.domString = (
        '<span>'
          + `<svg style="display:none" fill="${btnItem.color}" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="-6 -6 32 32">
            <path d="M8.5,4.2c0.8-0.7,2.1-0.2,2.2,0.9l0,0.1v10c0,1.1-1.2,1.7-2.1,1.1l-0.1-0.1l-3.3-2.8C5,13.2,5,12.9,5.1,12.7 c0.2-0.2,0.4-0.2,0.6-0.1l0.1,0.1l3.3,2.8c0.2,0.2,0.5,0.1,0.5-0.2l0-0.1v-10c0-0.3-0.3-0.4-0.5-0.3L9.2,5L5.9,7.8 C5.6,7.9,5.3,7.9,5.1,7.7C5,7.5,5,7.3,5.1,7.1L5.2,7L8.5,4.2z"/>
            <path d="M5.5,6.9C5.8,6.9,6,7.1,6,7.4c0,0.2-0.2,0.4-0.4,0.5l-0.1,0h-2C3.4,7.9,3.3,8,3.2,8.2l0,0.1v4 c0,0.2,0.1,0.3,0.3,0.3l0.1,0h2C5.8,12.5,6,12.7,6,13c0,0.2-0.2,0.4-0.4,0.5l-0.1,0h-2c-0.7,0-1.3-0.5-1.3-1.2l0-0.1v-4 c0-0.7,0.5-1.3,1.2-1.3l0.1,0H5.5z"/>
            <path d="M17.4,7.9c0.2-0.2,0.5-0.2,0.7,0c0.2,0.2,0.2,0.4,0.1,0.6l-0.1,0.1l-3.8,3.8c-0.2,0.2-0.5,0.2-0.7,0 c-0.2-0.2-0.2-0.4-0.1-0.6l0.1-0.1L17.4,7.9z"/>
            <path d="M13.7,7.9c0.2-0.2,0.4-0.2,0.6-0.1l0.1,0.1l3.8,3.8c0.2,0.2,0.2,0.5,0,0.7c-0.2,0.2-0.4,0.2-0.6,0.1l-0.1-0.1 l-3.7-3.8C13.5,8.4,13.5,8.1,13.7,7.9z"/>
            </svg>`
          + `<svg style="display:inline-block" width="48" height="48" fill="${btnItem.color}" viewBox="-6 -6 32 32">
              <path d="M13.2,7.1c0.1-0.2,0.5-0.3,0.7-0.2c1.1,0.7,1.9,2.2,1.9,3.7c0,1.6-0.7,3-1.9,3.7
                c-0.2,0.1-0.5,0.1-0.7-0.2c-0.1-0.2-0.1-0.5,0.2-0.7c0.8-0.5,1.4-1.6,1.4-2.9c0-1.3-0.6-2.4-1.4-2.9C13.1,7.6,13,7.3,13.2,7.1z"/>
              <path d="M15.7,4.5c0.2-0.2,0.5-0.2,0.7-0.1C18,5.8,19,8.2,19,10.7c0,2.5-1,4.8-2.7,6.3
                c-0.2,0.2-0.5,0.2-0.7-0.1c-0.2-0.2-0.2-0.5,0.1-0.7c1.4-1.2,2.3-3.3,2.3-5.5c0-2.2-0.9-4.3-2.3-5.5C15.5,5,15.5,4.7,15.7,4.5z"/>
              <path id="Stroke-5" class="st1" d="M8.5,4.7c0.8-0.7,2.1-0.2,2.2,0.9l0,0.1v10c0,1.1-1.2,1.7-2.1,1.1l-0.1-0.1l-3.3-2.8
                C5,13.7,5,13.4,5.1,13.2c0.2-0.2,0.4-0.2,0.6-0.1l0.1,0.1l3.3,2.8c0.2,0.2,0.5,0.1,0.5-0.2l0-0.1v-10c0-0.3-0.3-0.4-0.5-0.3l-0.1,0
                L5.9,8.3C5.6,8.4,5.3,8.4,5.1,8.2C5,8,5,7.7,5.1,7.6l0.1-0.1L8.5,4.7z"/>
              <path  d="M5.5,7.4C5.8,7.4,6,7.6,6,7.9c0,0.2-0.2,0.4-0.4,0.5l-0.1,0h-2c-0.2,0-0.3,0.1-0.3,0.3l0,0.1v4
                c0,0.2,0.1,0.3,0.3,0.3l0.1,0h2C5.8,13,6,13.2,6,13.5c0,0.2-0.2,0.4-0.4,0.5l-0.1,0h-2c-0.7,0-1.3-0.5-1.3-1.2l0-0.1v-4
                c0-0.7,0.5-1.3,1.2-1.3l0.1,0H5.5z"/>
            </svg>`
          + '</span>'
      );
      btnItem.onclick = () => {
        const { play, sound } = this.decoderState.state;
        if (play) {
          if (sound) {
            this.jSPlugin.closeSound();
            this.setDecoderState({ sound: false });
          } else {
            this.jSPlugin.openSound();
            this.setDecoderState({ sound: true });
          }
        }
      };
      return btnItem;
    case 'recordvideo':
      btnItem.title = "录屏";
      btnItem.id = btnId;
      btnItem.domString = (
        `<svg fill="${btnItem.color}" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="-6 -6 32 32">`
          + '<path d="M11.6,5.3H4.7c-1.4,0-2.5,1.1-2.5,2.5v5.9c0,1.4,1.1,2.5,2.5,2.5h6.9c1.4,0,2.5-1.1,2.5-2.5V7.7 C14.1,6.4,13,5.3,11.6,5.3z M4.7,6.3h6.9c0.8,0,1.5,0.7,1.5,1.5v5.9c0,0.8-0.7,1.5-1.5,1.5H4.7c-0.8,0-1.5-0.7-1.5-1.5V7.7 C3.3,6.9,3.9,6.3,4.7,6.3z" />'
          + '<path d="M16.6,6.7c0.9-0.8,2.3-0.1,2.4,1l0,0.1v5.7c0,1.2-1.3,1.9-2.3,1.2l-0.1-0.1L13.3,12 c-0.2-0.2-0.2-0.5-0.1-0.7c0.2-0.2,0.4-0.2,0.6-0.1l0.1,0.1l3.3,2.7c0.3,0.2,0.7,0.1,0.8-0.3l0-0.1V7.8c0-0.4-0.4-0.6-0.7-0.4 l-0.1,0l-3.3,2.7c-0.2,0.2-0.5,0.1-0.7-0.1c-0.2-0.2-0.1-0.5,0-0.6l0.1-0.1L16.6,6.7z" />'
          + '</svg>'
      );
      btnItem.onclick = () => {
        const { play, recordvideo } = this.decoderState.state;
        if (play) {
          if (recordvideo) {
            this.jSPlugin.stopSave();
            this.setDecoderState({ recordvideo: false });
          } else {
            this.jSPlugin.startSave(`${new Date().getTime()}`);
            this.setDecoderState({ recordvideo: true });
          }
        }
      };
      return btnItem;
    case 'capturePicture':
      btnItem.title = "截图";
      btnItem.id = btnId;
      btnItem.domString = (
        `<svg fill="${btnItem.color}" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="-6 -6 32 32">`
          + '<path d="M10.8,7.7c-2,0-3.7,1.6-3.7,3.7S8.7,15,10.8,15c2,0,3.7-1.6,3.7-3.7S12.8,7.7,10.8,7.7z M10.8,8.7c1.5,0,2.7,1.2,2.7,2.7S12.2,14,10.8,14c-1.5,0-2.7-1.2-2.7-2.7S9.3,8.7,10.8,8.7z" />'
          + '<path d="M8.6,3.7l-0.1,0C8,3.7,7.7,4,7.5,4.3l-1,1.7l-1.3,0C4,6.1,3.1,7,3.1,8.2v7.1 c0,1.2,0.9,2.1,2.1,2.1h11.1c1.2,0,2.1-0.9,2.1-2.1V8.2l0-0.1c-0.1-1.1-1-1.9-2.1-1.9l-1.3,0l-1.1-1.8c-0.2-0.4-0.7-0.6-1.1-0.6H8.6 z M8.6,4.7h4.2c0.1,0,0.2,0.1,0.3,0.1l1.2,2c0.1,0.2,0.3,0.2,0.4,0.2h1.6c0.6,0,1.1,0.5,1.1,1.1v7.1c0,0.6-0.5,1.1-1.1,1.1H5.1 c-0.6,0-1.1-0.5-1.1-1.1V8.2c0-0.6,0.5-1.1,1.1-1.1h1.6c0.2,0,0.3-0.1,0.4-0.2l1.2-2C8.4,4.7,8.5,4.7,8.6,4.7z" />'
          + '</svg>'
      );
      btnItem.onclick = () => {
        const { play } = this.decoderState.state;
        if (play) {
          this.jSPlugin.capturePicture(`${new Date().getTime()}`);
        } else {
          console.log("视频未播放，无法截图");
        }
      };
      return btnItem;
    case 'talk':
      btnItem.title = "对讲";
      btnItem.id = btnId;
      btnItem.domString = (
        '<div></div>'
          + `<svg fill="${btnItem.color}" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="-6 -6 32 32">`
          + '<path d="M10.1,2.7C8.5,2.7,7.2,4,7.2,5.6v5.2c0,1.6,1.3,2.9,2.9,2.9l0.2,0c1.5-0.1,2.7-1.4,2.7-2.9V5.6	C13,4,11.7,2.7,10.1,2.7z M10.1,3.7c1.1,0,1.9,0.9,1.9,1.9v5.2c0,1-0.8,1.8-1.8,1.9l-0.1,0c-1,0-1.9-0.9-1.9-1.9V5.6 C8.2,4.5,9,3.7,10.1,3.7z" />'
          + '<path d="M15.1,8.5c0.2,0,0.4,0.2,0.5,0.4l0,0.1v1.7c0,3-2.5,5.5-5.5,5.5c-3,0-5.4-2.3-5.5-5.3l0-0.2V9 c0-0.3,0.2-0.5,0.5-0.5c0.2,0,0.4,0.2,0.5,0.4l0,0.1v1.7c0,2.5,2,4.5,4.5,4.5c2.4,0,4.4-1.9,4.5-4.3l0-0.2V9 C14.6,8.7,14.8,8.5,15.1,8.5z" />'
          + '<path d="M13.5,17.7c0.3,0,0.5,0.2,0.5,0.5c0,0.2-0.2,0.4-0.4,0.5l-0.1,0h-7c-0.3,0-0.5-0.2-0.5-0.5 c0-0.2,0.2-0.4,0.4-0.5l0.1,0H13.5z" />'
          + '<path d="M10.1,15.2c0.2,0,0.4,0.2,0.5,0.4l0,0.1v2.5c0,0.3-0.2,0.5-0.5,0.5c-0.2,0-0.4-0.2-0.5-0.4l0-0.1 v-2.5C9.6,15.4,9.8,15.2,10.1,15.2z" />'
          + '</svg>'
      );
      btnItem.onclick = () => {
        const { talk, sound } = this.decoderState.state;
        if (talk) {
          console.log('结束对讲');
          this.setDecoderState({ talk: false });
          this.jSPlugin.Talk.stopTalk();
        } else {
          console.log('开始对讲');
          this.setDecoderState({ talk: true });
          if (sound) {
            this.jSPlugin.closeSound();
            this.setDecoderState({ sound: false });
          }
          this.jSPlugin.Talk.startTalk();
        }
      };
      return btnItem;
    case 'pantile':
      btnItem.title = "云台控制";
      btnItem.id = btnId;
      btnItem.domString = (
        `<svg fill="${btnItem.color}" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="-6 -6 32 32">`
          + '<path d="M10.2,7.8c1.6,0,2.9,1.3,2.9,2.9s-1.3,2.9-2.9,2.9s-2.9-1.3-2.9-2.9S8.5,7.8,10.2,7.8z M10.2,8.8c-1.1,0-1.9,0.9-1.9,1.9s0.9,1.9,1.9,1.9s1.9-0.9,1.9-1.9S11.2,8.8,10.2,8.8z" />'
          + '<path d="M8.8,3.5c0.7-0.6,1.8-0.6,2.5-0.1l0.1,0.1l1.4,1.1c0.2,0.2,0.3,0.5,0.1,0.7 c-0.2,0.2-0.4,0.2-0.6,0.1l-0.1,0l-1.4-1.1C10.5,3.9,10,3.9,9.6,4.2L9.4,4.3L8,5.4C7.8,5.5,7.5,5.5,7.3,5.3c-0.2-0.2-0.1-0.5,0-0.6 l0.1-0.1L8.8,3.5z" />'
          + '<path d="M2.5,12.3c-0.6-0.7-0.6-1.8-0.1-2.5l0.1-0.1l1.1-1.4c0.2-0.2,0.5-0.3,0.7-0.1 c0.2,0.2,0.2,0.4,0.1,0.6l0,0.1l-1.1,1.4C3,10.6,3,11.1,3.2,11.5l0.1,0.1L4.4,13c0.2,0.2,0.1,0.5-0.1,0.7c-0.2,0.2-0.5,0.1-0.6,0 l-0.1-0.1L2.5,12.3z" />'
          + '<path d="M17.7,12.3c0.6-0.7,0.6-1.8,0.1-2.5l-0.1-0.1l-1.1-1.4c-0.2-0.2-0.5-0.3-0.7-0.1 c-0.2,0.2-0.2,0.4-0.1,0.6l0,0.1l1.1,1.4c0.3,0.4,0.3,0.9,0.1,1.3l-0.1,0.1L15.8,13c-0.2,0.2-0.1,0.5,0.1,0.7c0.2,0.2,0.5,0.1,0.6,0 l0.1-0.1L17.7,12.3z" />'
          + '<path d="M8.8,18.2c0.7,0.6,1.8,0.6,2.5,0.1l0.1-0.1l1.4-1.1c0.2-0.2,0.3-0.5,0.1-0.7 c-0.2-0.2-0.4-0.2-0.6-0.1l-0.1,0l-1.4,1.1c-0.4,0.3-0.9,0.3-1.3,0.1l-0.1-0.1L8,16.3c-0.2-0.2-0.5-0.1-0.7,0.1 c-0.2,0.2-0.1,0.5,0,0.6l0.1,0.1L8.8,18.2z" />'
          + '</svg>'
      );
      btnItem.onclick = () => {
        const { pantile } = this.decoderState.state;
        if (!pantile) {
          console.log('显示云台');
          this.Ptz.show();
          this.setDecoderState({ pantile: true });
        } else {
          console.log('隐藏云台');
          this.Ptz.hide();
          this.setDecoderState({ pantile: false });
        }
      };
      return btnItem;
    case 'expend':
      btnItem.title = "全局全屏";
      btnItem.id = btnId;
      btnItem.domString = (
        `<span><svg fill="${btnItem.color}" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="-6 -6 32 32">`
          + '<path d="M3.4,7.6c-0.3,0-0.5-0.2-0.5-0.5V5.3c0-1.2,1-2.3,2.2-2.3h1.8c0.3,0,0.5,0.2,0.5,0.5S7.2,4.1,6.9,4.1H5.2 c-0.7,0-1.2,0.6-1.2,1.3v1.8C3.9,7.4,3.7,7.6,3.4,7.6z" />'
          + '<path d="M6.9,18.1H5.2c-1.2,0-2.2-1-2.2-2.2v-1.8c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5v1.8c0,0.7,0.6,1.2,1.2,1.2 h1.8c0.3,0,0.5,0.2,0.5,0.5S7.2,18.1,6.9,18.1z" />'
          + '<path d="M15.7,18.1h-1.8c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h1.8c0.7,0,1.2-0.6,1.2-1.2v-1.8 c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5v1.8C17.9,17.1,16.9,18.1,15.7,18.1z" />'
          + '<path d="M17.4,7.6c-0.3,0-0.5-0.2-0.5-0.5V5.3c0-0.7-0.6-1.3-1.2-1.3h-1.8c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h1.8 c1.2,0,2.2,1,2.2,2.3v1.8C17.9,7.4,17.7,7.6,17.4,7.6z" />'
          + '</svg>'
          + `<svg style="display:none" width="48" height="48" fill="${btnItem.color}" viewBox="-6 -6 32 32">
            <path class="st1" d="M5.7,8.1H3.9c-0.3,0-0.6-0.2-0.6-0.6S3.6,7,3.9,7h1.9c0.7,0,1.3-0.6,1.3-1.3V3.8c0-0.3,0.2-0.6,0.6-0.6
              s0.6,0.2,0.6,0.6v1.9C8.2,7,7.1,8.1,5.7,8.1z"/>
            <path class="st1" d="M7.6,17.7c-0.3,0-0.6-0.2-0.6-0.6v-1.9c0-0.7-0.6-1.3-1.3-1.3H3.9c-0.3,0-0.6-0.2-0.6-0.6s0.2-0.6,0.6-0.6h1.9
              c1.3,0,2.4,1.1,2.4,2.4v1.9C8.2,17.5,7.9,17.7,7.6,17.7z"/>
            <path class="st1" d="M13.4,17.7c-0.3,0-0.6-0.2-0.6-0.6v-1.9c0-1.3,1.1-2.4,2.4-2.4h1.9c0.3,0,0.6,0.2,0.6,0.6S17.5,14,17.2,14
              h-1.9c-0.7,0-1.3,0.6-1.3,1.3v1.9C14,17.5,13.8,17.7,13.4,17.7z"/>
            <path class="st1" d="M17.2,8.1h-1.9c-1.3,0-2.4-1.1-2.4-2.4V3.8c0-0.3,0.2-0.6,0.6-0.6S14,3.5,14,3.8v1.9C14,6.4,14.6,7,15.3,7h1.9
              c0.3,0,0.6,0.2,0.6,0.6S17.5,8.1,17.2,8.1z"/>
          </svg>
          </span>`
      );
      btnItem.onclick = () => {
        const { webExpend, expend, play } = this.decoderState.state;
        if (!play) {
          return false;
        }
        if (webExpend) {
          console.log("正在网站全屏");
          return false;
        }
        if (!expend) {
          console.log("执行全局全屏");
          if (this.isMobile) {
            var heightIntercept = parseInt(getComputedStyle(document.getElementById(`${this.jSPlugin.id}-wrap`)).height, 10) - parseInt(getComputedStyle(document.getElementById(this.jSPlugin.id)).height, 10);
            requestMobileFullScreen(document.getElementById(`${this.jSPlugin.id}-wrap`));
            setTimeout(() => {
              var width = document.documentElement.clientWidth;
              var height = document.documentElement.clientHeight;
              this.jSPlugin.jSPlugin.JS_Resize(height, width - heightIntercept);
            }, 100);
          } else {
            var promise = requestFullScreenPromise(document.getElementById(`${this.jSPlugin.id}`));
            promise.then((data) => {
              console.log("全屏promise", window.screen.availWidth);
              this.jSPlugin.jSPlugin.JS_Resize(window.screen.availWidth, window.screen.availHeight);
            })
              .catch(err => {
                console.log(err);
              });
          }
        } else {
          if (this.isMobile) {
            var heightIntercept = parseInt(getComputedStyle(document.getElementById(`${this.jSPlugin.id}-wrap`)).height, 10) - parseInt(getComputedStyle(document.getElementById(this.jSPlugin.id)).height, 10);
            cancelMobileFullScreen(document.getElementById(`${this.jSPlugin.id}-wrap`), this.jSPlugin.width, this.jSPlugin.height + heightIntercept);
            this.jSPlugin.jSPlugin.JS_Resize(this.jSPlugin.width, this.jSPlugin.height);
          } else {
            console.log("取消全局全屏");
            var cancelPromise = cancelFullScreenPromise();
            cancelPromise.then((data) => {
              console.log("取消全屏", data, this.jSPlugin);
              this.jSPlugin.jSPlugin.JS_Resize(this.jSPlugin.width, this.jSPlugin.height);
            });
          }
        }
        this.setDecoderState({
          expend: !expend
        });
      };
      return btnItem;
    case 'webExpend':
      btnItem.title = "网页全屏";
      btnItem.id = btnId;
      btnItem.domString = (
        `<span><svg fill="${btnItem.color}" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="-6 -6 32 32">`
          + '<path d="M3.1,7.6c-0.3,0-0.5-0.2-0.5-0.5V5.3c0-1.2,1-2.3,2.2-2.3h1.8c0.3,0,0.5,0.2,0.5,0.5S6.8,4.1,6.6,4.1H4.8 c-0.7,0-1.2,0.6-1.2,1.3v1.8C3.6,7.4,3.3,7.6,3.1,7.6z" />'
          + '<path d="M15.3,18.1h-1.8c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h1.8c0.7,0,1.2-0.6,1.2-1.2v-1.8 c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5v1.8C17.6,17.1,16.6,18.1,15.3,18.1z" />'
          + '<circle class="st2" cx="10.2" cy="10.4" r="1.1"/>'
          + '</svg>'
          + `<svg fill="${btnItem.color}" style="display:none;" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="-6 -6 32 32">
          <path class="st1" d="M5.4,8.1H3.5C3.2,8.1,3,7.9,3,7.6s0.2-0.5,0.5-0.5h1.9c0.8,0,1.4-0.6,1.4-1.4V3.8c0-0.3,0.2-0.5,0.5-0.5
            s0.5,0.2,0.5,0.5v1.9C7.7,7,6.7,8.1,5.4,8.1z"/>
          <path class="st1" d="M13.1,17.7c-0.3,0-0.5-0.2-0.5-0.5v-1.9c0-1.3,1.1-2.4,2.4-2.4h1.9c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5H15
            c-0.8,0-1.4,0.6-1.4,1.4v1.9C13.6,17.4,13.4,17.7,13.1,17.7z"/>
            <circle class="st2" cx="10.2" cy="10.4" r="1.1"/>
          `
          + '</svg></span>'
      );
      btnItem.onclick = () => {
        const { webExpend, expend, play } = this.decoderState.state;
        if (!play) {
          return false;
        }
        if (expend) {
          console.log("正在全局全屏");
          return false;
        }
        if (!webExpend) {
          console.log("执行网页全屏");
          var footerDOMHeight = 0;
          var headerDOMHeight = 0;
          // ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange'].forEach((item) => {
          //   window.addEventListener(item, (data) => fullscreenchange("fullscreenchange", data));
          // });
          // //  监听全屏事件触发
          // function fullscreenchange() {
          //   let isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
          //   return isFullScreen;
          // }
          var promise = requestFullScreenPromise(document.getElementById(`${this.jSPlugin.id}-wrap`));
          promise.then((data) => {
            console.log("全屏promise", window.screen.availWidth);
            if (document.getElementById(`${this.jSPlugin.id}-ez-iframe-footer-container`)) {
              footerDOMHeight = parseInt(window.getComputedStyle(document.getElementById(`${this.jSPlugin.id}-ez-iframe-footer-container`)).height, 10);
            }
            if (document.getElementById(`${this.jSPlugin.id}-headControl`)) {
              headerDOMHeight = parseInt(window.getComputedStyle(document.getElementById(`${this.jSPlugin.id}-headControl`)).height, 10);
            }
            console.log("this.jSPlugin.JS_Resiz", footerDOMHeight, headerDOMHeight, document.body.clientWidth);
            this.jSPlugin.jSPlugin.JS_Resize(window.screen.availWidth, window.screen.availHeight - footerDOMHeight - headerDOMHeight);
          })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("取消网页全屏");
          var cancelPromise = cancelFullScreenPromise();
          cancelPromise.then((data) => {
            this.jSPlugin.jSPlugin.JS_Resize(this.jSPlugin.width, this.jSPlugin.height);
          });
        }
        this.setDecoderState({
          webExpend: !webExpend
        });
      };
      return btnItem;
    case 'hd':
      btnItem.title = "画面清晰度";
      btnItem.id = btnId;
      btnItem.domString = (
        `<ul id="${this.jSPlugin.id}-hdSelect" class="select" style="display:none;width: 60px;background: #fff;box-shadow: 0 3px 20px 0 rgb(0 0 0 / 10%);border-radius: 2px;padding: 6px 0;position: absolute;top: -120px;">`
          + `<li class="selectOption" style="width: 60px;height: 32px;text-align: center;line-height: 32px;list-style: none;cursor: pointer;font-size: 13px;color: rgba(0, 0, 0, .85);" name="option" id="${this.jSPlugin.id}-select-hd">高清</li>`
          + `<li class="selectOption" style="width: 60px;height: 32px;text-align: center;line-height: 32px;list-style: none;cursor: pointer;font-size: 13px;color: rgba(0, 0, 0, .85);" name="option" id="${this.jSPlugin.id}-select-sd">标清</li>`
          + '</ul>'
          + `<span><svg fill="${btnItem.color}" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="-6 -6 32 32">`
          + '<path d="M17.4,16.5H3.1c-0.8,0-1.4-0.6-1.4-1.4V5.4c0-0.9,0.7-1.6,1.6-1.6h14.1c0.8,0,1.4,0.6,1.4,1.4v9.8 C18.8,15.9,18.2,16.5,17.4,16.5z M3.3,5C3.1,5,2.9,5.2,2.9,5.4v9.7c0,0.2,0.1,0.3,0.3,0.3h14.3c0.2,0,0.3-0.1,0.3-0.3V5.3 c0-0.2-0.1-0.3-0.3-0.3H3.3z" />'
          + '<path d="M13.3,13.6h-1.6c-0.4,0-0.7-0.3-0.7-0.7V7.4c0-0.4,0.3-0.7,0.7-0.7h1.6c1.2,0,2.2,1,2.2,2.2v2.4 C15.6,12.6,14.6,13.6,13.3,13.6z M12.2,12.5h1.1c0.6,0,1.1-0.5,1.1-1.1V9c0-0.6-0.5-1.1-1.1-1.1h-1.1V12.5z" />'
          + '<path d="M5.5,13.6c-0.3,0-0.6-0.2-0.6-0.6V7.3C5,7,5.2,6.8,5.5,6.8S6.1,7,6.1,7.3v5.7C6.1,13.4,5.8,13.6,5.5,13.6z" />'
          + '<path d="M9.2,13.6c-0.3,0-0.6-0.2-0.6-0.6V7.3c0-0.3,0.2-0.6,0.6-0.6S9.8,7,9.8,7.3v5.7C9.8,13.4,9.5,13.6,9.2,13.6z" />'
          + '<rect x="5.6" y="9.6" width="3.6" height="1.1" />'
          + '</svg>'
          + `<svg style="display:none" fill="${btnItem.color}" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="-6 -8 40 44">
                <path d="M24.1,23.8h-20c-1.1,0-1.9-0.9-1.9-1.9V8.4c0-1.2,1-2.2,2.1-2.2h19.7c1.1,0,1.9,0.9,1.9,1.9v13.8
                    C26,23,25.1,23.8,24.1,23.8z M4.3,7.7C4,7.7,3.7,8,3.7,8.4v13.5c0,0.2,0.2,0.4,0.4,0.4h20c0.2,0,0.4-0.2,0.4-0.4V8.2
                    c0-0.2-0.2-0.4-0.4-0.4H4.3z"/>
                <path d="M18.4,19.8h-2.2c-0.5,0-0.9-0.4-0.9-0.9v-7.8c0-0.5,0.4-0.9,0.9-0.9h2.2c1.7,0,3.1,1.4,3.1,3.1v3.3
                C21.5,18.4,20.1,19.8,18.4,19.8z M16.7,18.3h1.6c0.9,0,1.6-0.7,1.6-1.6v-3.3c0-0.9-0.7-1.6-1.6-1.6h-1.6V18.3z"/>
                <path d="M10.5,19.8c1.2,0,2.1-0.3,2.7-0.9c0.6-0.6,0.9-1.3,0.9-2.1c0-0.8-0.3-1.4-0.9-1.8c-0.4-0.2-1.1-0.5-2.2-0.8
                    l0,0l-1-0.2c-0.4-0.1-0.8-0.2-1-0.4c-0.4-0.2-0.6-0.5-0.6-0.9c0-0.4,0.1-0.6,0.4-0.9s0.7-0.3,1.3-0.3c0.8,0,1.4,0.2,1.8,0.6
                    c0.2,0.3,0.3,0.6,0.4,0.9l0,0h1.4c0-0.6-0.2-1.1-0.5-1.6c-0.6-0.8-1.6-1.2-2.9-1.2c-1,0-1.8,0.3-2.4,0.8c-0.6,0.5-0.9,1.2-0.9,2
                    c0,0.7,0.3,1.3,1,1.7c0.4,0.2,0.9,0.4,1.7,0.6l0,0l1.2,0.3c0.6,0.2,1.1,0.3,1.3,0.4c0.3,0.2,0.5,0.5,0.5,0.9c0,0.5-0.2,0.9-0.6,1.1
                    s-0.9,0.4-1.5,0.4c-0.9,0-1.6-0.2-2-0.7c-0.2-0.3-0.3-0.6-0.4-1.1l0,0H6.8c0,0.9,0.3,1.6,0.9,2.2C8.2,19.5,9.2,19.8,10.5,19.8z"/>
                <defs>
                  <filter id="Adobe_OpacityMaskFilter" filterUnits="userSpaceOnUse" x="15.2" y="10.3" width="6.2" height="9.5">
                    <feColorMatrix  type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"/>
                  </filter>
                </defs>
                <mask maskUnits="userSpaceOnUse" x="15.2" y="10.3" width="6.2" height="9.5" id="mask-2_2_">
                  <g class="st2">
                    <path id="path-1_2_" class="st3" d="M24.1,23.1h-20c-0.6,0-1.2-0.5-1.2-1.2V8.2C2.9,7.5,3.5,7,4.1,7h19.7c0.8,0,1.4,0.6,1.4,1.4
                      v13.5C25.2,22.6,24.7,23.1,24.1,23.1z"/>
                  </g>
                </mask>
                <defs>
                  <filter id="Adobe_OpacityMaskFilter_1_" filterUnits="userSpaceOnUse" x="6.8" y="10.3" width="7.3" height="9.5">
                    <feColorMatrix  type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"/>
                  </filter>
                </defs>
                <mask maskUnits="userSpaceOnUse" x="6.8" y="10.3" width="7.3" height="9.5" id="mask-2_3_">
                  <g class="st5">
                    <path id="path-1_3_" class="st3" d="M24.1,23.1h-20c-0.6,0-1.2-0.5-1.2-1.2V8.2C2.9,7.5,3.5,7,4.1,7h19.7c0.8,0,1.4,0.6,1.4,1.4
                      v13.5C25.2,22.6,24.7,23.1,24.1,23.1z"/>
                  </g>
                </mask>
                </svg>
                `
          + '</span>'
      );
      btnItem.onclick = (e) => {
        const { hd } = this.decoderState.state;
        // 选择清晰度选项时才触发事件
        if (hd && e.target.id ===  `${this.jSPlugin.id}-select-sd`) {
          //decoder.changePlayUrl({ hd: false });
          console.log("切换到标清");
          this.jSPlugin.changePlayUrl({ hd: false });
          this.setDecoderState({
            hd: false
          });
        } else if (!hd && e.target.id === `${this.jSPlugin.id}-select-hd`) {
          this.jSPlugin.changePlayUrl({ hd: true });
          this.setDecoderState({
            hd: true
          });
        }
        if (document.getElementById(`${this.jSPlugin.id}-hdSelect`)) {
          document.getElementById(`${this.jSPlugin.id}-hdSelect`).style.display = document.getElementById(`${this.jSPlugin.id}-hdSelect`).style.display === 'none' ? 'block' : 'none';
        }
      };
      return btnItem;
    case 'deviceName':
      btnItem.title = "设备名称";
      btnItem.id = btnId;
      btnItem.domString = (
        '<span>设备名称</span>'
      );
      btnItem.onclick = () => {
      };
      return btnItem;
    case 'deviceID':
      btnItem.title = "设备序列号";
      btnItem.id = btnId;
      btnItem.domString = (
        '<span>设备序列号</span>'
      );
      btnItem.onclick = () => {
      };
      return btnItem;
    case 'cloudRec':
      btnItem.title = "云存储回放";
      btnItem.id = btnId;
      btnItem.domString = (
        `
        <span>
          <svg fill="${btnItem.color}" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="2 0 20 20">
	<path d="M9.5,13.1c-0.3,0-0.5-0.2-0.5-0.5V8.8c0-0.3,0.2-0.5,0.5-0.5S10,8.5,10,8.8v3.8C10,12.8,9.8,13.1,9.5,13.1z"/>
	<path d="M7.6,10.6c-0.1,0-0.3-0.1-0.4-0.2C7,10.2,7,9.9,7.3,9.7l1.9-1.7c0.2-0.2,0.5-0.2,0.7,0l1.8,1.7
		c0.2,0.2,0.2,0.5,0,0.7c-0.2,0.2-0.5,0.2-0.7,0L9.5,9.1l-1.6,1.4C7.8,10.6,7.7,10.6,7.6,10.6z"/>
	<path d="M13.2,15.7H5.6c-2.1-0.1-3.8-1.8-3.8-3.9c0-1.8,1.3-3.4,3-3.8c0.4-2.2,2.3-3.9,4.6-3.9c2.3,0,4.2,1.7,4.6,3.8
		c1.8,0.4,3.1,1.9,3.1,3.8C17.1,13.9,15.4,15.7,13.2,15.7z M5.6,14.7h7.6c1.6,0,2.9-1.3,2.9-2.9c0-1.5-1.1-2.7-2.6-2.9l-0.4,0l0-0.4
		c-0.2-1.9-1.7-3.3-3.6-3.3C7.5,5.1,6,6.6,5.8,8.5l0,0.4l-0.4,0c-1.4,0.2-2.5,1.4-2.5,2.9C2.8,13.3,4.1,14.6,5.6,14.7z"/>
          </svg>
        </span>
        `
      );
      btnItem.onclick = () => {
        console.log("点击云回放");
        this.setDecoderState({
          type: 'cloud.rec',
          cloudRec: true,
          rec: false
        });
        this.jSPlugin.changePlayUrl({
          type: 'cloud.rec'
        });
        console.log(this.jSPlugin);
        var initDate = getQueryString("begin", this.jSPlugin.url) || new Date().Format('yyyyMMdd');
        this.Rec.renderRec(`${initDate.slice(0, 4)}-${initDate.slice(4, 6)}-${initDate.slice(6, 8)}`);
      };
      return btnItem;
    case 'rec':
      btnItem.title = "本地存储";
      btnItem.id = btnId;
      btnItem.domString = (
        `
        <span>
        <svg fill=${btnItem.color} version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="2 0 20 20">
          <path d="M13,16.3H5.5c-1.1,0-2-0.9-2-2V3.8c0-1.1,0.9-2,2-2h5.4c0.5,0,1,0.2,1.4,0.6l2.1,2.1C14.8,4.8,15,5.3,15,5.9
  v8.4C15,15.4,14.1,16.3,13,16.3z M5.5,2.8c-0.6,0-1,0.4-1,1v10.5c0,0.6,0.4,1,1,1H13c0.6,0,1-0.4,1-1V5.9c0-0.3-0.1-0.5-0.3-0.7
  L11.6,3c-0.2-0.2-0.4-0.3-0.7-0.3H5.5z"/>
<path d="M6.3,7.3C6,7.3,5.8,7,5.8,6.8V4.5C5.8,4.2,6,4,6.3,4s0.5,0.2,0.5,0.5v2.2C6.8,7,6.6,7.3,6.3,7.3z"/>
<path d="M8.5,7.3C8.3,7.3,8,7,8,6.8V4.5C8,4.2,8.3,4,8.5,4S9,4.2,9,4.5v2.2C9,7,8.8,7.3,8.5,7.3z"/>
<path d="M10.8,7.3c-0.3,0-0.5-0.2-0.5-0.5V4.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5v2.2C11.3,7,11.1,7.3,10.8,7.3z"
  />
        </svg>
      </span>
        `
      );
      btnItem.onclick = () => {
        console.log("点击本地回放");
        this.setDecoderState({
          type: 'rec',
          cloudRec: false,
          rec: true
        });
        this.jSPlugin.changePlayUrl({
          type: 'rec'
        });
        console.log(this.jSPlugin);
        var initDate = getQueryString("begin", this.jSPlugin.url) || new Date().Format('yyyyMMdd');
        this.Rec.renderRec(`${initDate.slice(0, 4)}-${initDate.slice(4, 6)}-${initDate.slice(6, 8)}`);
      };
      return btnItem;
    default:
      return btnItem;
    }
  }
  initThemeData() {
    const { header, footer } = this.themeData;
    const videoId = this.jSPlugin.id;
    this.header = defaultTheme.header;
    this.footer = defaultTheme.footer;
    this.isNeedRenderHeader = lodash.findIndex(header.btnList, (v)=>{
      return v.isrender > 0;
    }) >= 0;
    this.isNeedRenderFooter = lodash.findIndex(footer.btnList, (v)=>{
      return v.isrender > 0;
    }) >= 0;
    ["date-switch-container-wrap","rec-type-container-wrap","mobile-rec-wrap","mobile-ez-ptz-container"].forEach((item,index)=> {
      if(document.getElementById(item)) {
        document.getElementById(item).parentElement.removeChild(document.getElementById(item));
      }
    });
    if (this.isNeedRenderHeader) {
      if (!document.getElementById(`${this.jSPlugin.id}-headControl`)) {
        const headerContainer = document.createElement('div');
        headerContainer.setAttribute('id', `${this.jSPlugin.id}-headControl`);
        headerContainer.setAttribute('class', 'head-message');
        headerContainer.innerHTML = `<div id='${this.jSPlugin.id}}-headControl-left' style='display:flex'></div><div id='${this.jSPlugin.id}}-headControl-right' style='display:flex'></div>`;
        var headerStyle = {
          height: "48px",
          "line-height": "48px",
          display: "flex",
          "justify-content": "space-between",
          top: 0,
          "z-index": 1,
          background: "#000000",
          color: "#FFFFFF",
          width: "100%"
        };
        headerContainer.style = styleToString(headerStyle);
        document.getElementById(`${videoId}-wrap`).insertBefore(headerContainer, document.getElementById(videoId));
      } else {
        document.getElementById(`${this.jSPlugin.id}-headControl`).innerHTML =  `<div id='${this.jSPlugin.id}}-headControl-left' style='display:flex'></div><div id='${this.jSPlugin.id}}-headControl-right' style='display:flex'></div>`;
      }
    } else {
      if (document.getElementById(`${this.jSPlugin.id}-headControl`)) {
        document.getElementById(`${this.jSPlugin.id}-headControl`).parentElement.removeChild(document.getElementById(`${this.jSPlugin.id}-headControl`));
      }
    }
    if (this.isNeedRenderFooter) {
      if (!document.getElementById(`${this.jSPlugin.id}-ez-iframe-footer-container`)) {
        const footerContainer = document.createElement('div');
        footerContainer.setAttribute('id', `${this.jSPlugin.id}-ez-iframe-footer-container`);
        footerContainer.setAttribute('class', 'ez-iframe-footer-container');
        var footerStyle = {
          "min-height": "48px",
          "max-height": "96px",
          "position": "relative",
          "margin-top": "-48px",
          display: "flex",
          "flex-wrap": "wrap",
          "justify-content": "space-between",
          top: 0,
          "z-index": 1,
          color: "#FFFFFF",
          width: "100%"
        };
        footerContainer.style = styleToString(footerStyle);
        footerContainer.innerHTML = `<div id="${this.jSPlugin.id}-audioControls" style='display:flex;justify-content: space-between;height: 48px;width:100%;'><div id='${this.jSPlugin.id}-audioControls-left' style='display:flex'></div><div id='${this.jSPlugin.id}-audioControls-right' style='display:flex'></div></div>`;
        insertAfter$1(footerContainer, document.getElementById(videoId));
      } else {
        if (document.getElementById(`${this.jSPlugin.id}-ez-iframe-footer-container`)) {
          document.getElementById(`${this.jSPlugin.id}-ez-iframe-footer-container`).innerHTML =`<div id="${this.jSPlugin.id}-audioControls" style='display:flex;justify-content: space-between;height: 48px;width:100%;'><div id='${this.jSPlugin.id}-audioControls-left' style='display:flex'></div><div id='${this.jSPlugin.id}-audioControls-right' style='display:flex'></div></div>`;
        }
      }
    } else {
      if (document.getElementById(`${this.jSPlugin.id}-ez-iframe-footer-container`)) {
        document.getElementById(`${this.jSPlugin.id}-ez-iframe-footer-container`).parentElement.removeChild(document.getElementById(`${this.jSPlugin.id}-ez-iframe-footer-container`));
      }
    }

    if (this.isNeedRenderHeader && document.getElementById(`${this.jSPlugin.id}-headControl`)) {
      document.getElementById(`${this.jSPlugin.id}-headControl`).style.background = header.backgroundColor;
      document.getElementById(`${this.jSPlugin.id}-headControl`).style.color = header.color;
      header.btnList.map((item, index) => {
        if (item.isrender) {
          this.renderHeader(item.iconId, item.part);
        }
      });
    }
    if (this.isNeedRenderFooter && document.getElementById(`${this.jSPlugin.id}-audioControls`)) {
      document.getElementById(`${this.jSPlugin.id}-audioControls`).style.background = footer.backgroundColor;
      document.getElementById(`${this.jSPlugin.id}-audioControls`).style.color = footer.color;
      footer.btnList.map((item, index) => {
        if (item.isrender) {
          this.renderFooter(item.iconId, item.part);
        }
      });
    }
    var isNeedRenderTimeLine = (lodash.findIndex(this.themeData.header.btnList, (v)=>{
      return (v.iconId === 'cloudRec' && v.isrender === 1) ||  (v.iconId === 'rec' && v.isrender === 1) ;
    }) >= 0 || (this.isMobile && matchEzopenUrl(this.jSPlugin.url).type.indexOf('rec') !== -1)) && !this.jSPlugin.disabledTimeLine;
    if (isNeedRenderTimeLine) {
      if (this.isMobile) {
        this.Rec = new MobileRec(this.jSPlugin);
      } else {
        this.Rec = new Rec(this.jSPlugin);
      }
    }
    var isNeedRenderPTZ = (lodash.findIndex(this.themeData.header.btnList, (v)=>{
      return (v.iconId === 'pantile' && v.isrender === 1);
    }) >= 0 || (this.isMobile && matchEzopenUrl(this.jSPlugin.url).type.indexOf('live') !== -1)) && !this.jSPlugin.disabledPTZ;
    if (isNeedRenderPTZ) {
      this.MobilePtz = new MobilePtz(this.jSPlugin);
      this.Ptz = new Ptz(this.jSPlugin);
    } else {
      this.Ptz = new Ptz(this.jSPlugin);
    }
    //  监听全屏事件触发
    const fullscreenchange = () => {
      const { expend, webExpend } = this.decoderState.state;
      let isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
      if (!isFullScreen) {
        this.jSPlugin.jSPlugin.JS_Resize(this.jSPlugin.width, this.jSPlugin.height);
        if (expend) {
          this.setDecoderState({ expend: false });
        }
        if (webExpend) {
          this.setDecoderState({ webExpend: false });
        }
      }
    };
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange'].forEach((item) => {
      window.addEventListener(item, (data) => fullscreenchange());
    });
    this.inited = true;
    //设备信息
    this.getDeviceInfo();
  }
  getDeviceInfo() {
    const deviceAPISuccess = (data) => {
      if (data.code == 200 && data.data) {
        // 设备序列号
        if (document.getElementById(`${this.jSPlugin.id}-deviceName-content`)) {
          document.getElementById(`${this.jSPlugin.id}-deviceName-content`).innerHTML = data.data.deviceName;
        }
        // 设备序列号
        if (document.getElementById(`${this.jSPlugin.id}-deviceID-content`)) {
          document.getElementById(`${this.jSPlugin.id}-deviceID-content`).innerHTML = matchEzopenUrl(this.jSPlugin.url).deviceSerial;
        }
      }
    };
    request(this.jSPlugin.env.domain + '/api/lapp/device/info',
      'POST',
      {
        accessToken: this.jSPlugin.accessToken,
        deviceSerial: matchEzopenUrl(this.jSPlugin.url).deviceSerial
      }, '', deviceAPISuccess);
  }
}

class Monitor {
  constructor(params) {
    this.params = params;
    this.state = {
    };
  }
  dclog(dclogObj) {
    const { params } = this;
    var url = "https://log.ys7.com/statistics.do?";
    if(params.env) {
      switch(params.env){
        case 'test12':
          url = "https://test12dclog.ys7.com/statistics.do?";
          break;
        case 'online':
          break;
        default:
          url = params.env;
          break;
      }
    }
    var obj = Object.assign({}, { systemName: "open_website_monitor" }, { bn: "ezuikit-js" }, dclogObj, {un:dclogObj.url}, { st: new Date().getTime(), h: window.location.pathname }); // usr_name 更改为un，兼容旧
    Object.keys(obj).forEach(function(item, index){
      var value = obj[item];
      if (typeof (obj[item]) === 'string') {
        value = obj[item].replace('%', '%25'); // decodeURIComponent 无法解析%
      }
      if (typeof (obj[item]) === 'undefined') {
        return;
      }
      url += "".concat(index === 0 ? '' : '&').concat(item, "=").concat(encodeURIComponent(value));
    });
    var img = new Image();
    img.src = url;
  }
}

/**
 * EZUIKitPlayer for npm
 */
(function (global, factory) {

  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = global.document ? factory(global, true) : function (w) {
      if (!w.document) {
        throw new Error("EZUIPlayer requires a window with a document");
      }

      return factory(w);
    };
  } else {
    factory(global);
  } // Pass this if window is not defined yet

})(typeof window !== "undefined" ? window : void 0, function (window, noGlobal) {
  // 加载js
  function addJs(filepath, callback) {
    var headerScript = document.getElementsByTagName('head')[0].getElementsByTagName("script");
    var isReady = false;

    for (var i = 0; i < headerScript.length; i++) {
      if (headerScript[i].getAttribute("src") == filepath) {
        isReady = true;
        callback();
      }
    }

    if (!isReady) {
      var oJs = document.createElement("script");
      oJs.setAttribute("src", filepath);
      oJs.onload = callback;
      document.getElementsByTagName("head")[0].appendChild(oJs);
    }
  } // 加载css


  function addCss(filepath, callback) {
    var headerLink = document.getElementsByTagName('head')[0].getElementsByTagName("link");
    var isReady = false;

    for (var i = 0; i < headerLink.length; i++) {
      if (headerLink[i].getAttribute("href") == filepath) {
        isReady = true;
        callback();
      }
    }

    if (!isReady) {
      var oJs = document.createElement('link');
      oJs.rel = 'stylesheet';
      oJs.type = 'text/css';
      oJs.href = filepath;
      oJs.onload = callback;
      document.getElementsByTagName("head")[0].appendChild(oJs);
    }
  } // 通用请求方法


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

    http_request.open(method, _url, true); // http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    var data = new FormData();

    for (var i in params) {
      data.append(i, params[i]);
    }

    http_request.send(data);
  }

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
      plugin: [],
      // 加载插件，talk-对讲
      audio: 1,
      // 声音id  0-不开启 1-开启
      autoplay: 1,
      videoLoading: false,
    },
    state: {
      countTimer: undefined,
      // countTime 计时器
      recodeTime: 0,
      // 录音时间
      recodeTimer: undefined,
      //录音时长 计时器
      recodeTime: 0,
      fetchDefaultList: false,
      // 是否拉取默认语音-当用户语音为空
      page: 0,
      // 语音当前页
      pageSize: 5
    },
    handleTalkSuccess: function(){},
    handleTalkError: function(){},
  };
  /**
   * 视频播放器-开始
   */

  var domain = "https://open.ys7.com";
  var filePathDomain = domain;

  var EZUIKitPlayer = function EZUIKitPlayer(params) {
    var _this = this;
    this.opt = {
      id: params.id,
      apiDomain:  domain + '/api/lapp/live/talk/url',
      filePath:  filePathDomain + '/assets/ezuikit_v2.6.4',
      decoderVersion: '',
      accessToken: '',
      url: '',
      deviceSerial: '',
      channelNo: '',
      talkLink: '',
      rtcUrl: '',
      ttsUrl: '',
      stream: '',
      // 对讲插件依赖
      isReliesReady: false,
      template: 'simple',
      plugin: [],
      // 加载插件，talk-对讲
      audio: 1,
      // 声音id  0-不开启 1-开启
      autoplay: 1,
      fullScreenStatus: 0,
      bSupporDoubleClickFull: true,
      videoLoading: false,
    };
    this.params = params;

    if (params.id) {
      this.opt.id = params.id;
    }

    if (params.accessToken) {
      this.opt.accessToken = params.accessToken;
    }

    if (typeof params.audio !== 'undefined') {
      this.opt.audio = params.audio;
    }
    if (typeof params.decoderVersion !== 'undefined') {
      this.opt.decoderVersion = params.decoderVersion;
    }
    if (typeof params.env !== 'undefined') {
      if(typeof params.env.domain !== 'undefined'){
        domain = params.env.domain;
        this.opt.apiDomain = domain + '/api/lapp/live/talk/url';
      }
      if(typeof params.env.filePathDomain !== 'undefined'){
        filePathDomain = params.env.filePathDomain;
        this.opt.filePathDomain =  params.env.filePathDomain;
      }
    }
    // if(typeof params.domain !== 'undefined'){
    //   this.opt.apiDomain = params.domain + '/api/lapp/live/talk/url';
    // }

    if (params.url) {
      this.opt.url = params.url;
      this.opt.deviceSerial = params.url.split("/")[3];
      this.opt.channelNo = params.url.split("/")[4].split(".")[0];
    }

    if (typeof params.template !== 'undefined') {
      this.opt.template = params.template;
    }

    if (params.plugin) {
      this.opt.plugin = params.plugin;
    }

    if (typeof params.autoplay !== 'undefined') {
      this.opt.autoplay = params.autoplay ? 1 : 0;
    }
    if (typeof params.bSupporDoubleClickFull !== 'undefined') {
      this.opt.bSupporDoubleClickFull = params.bSupporDoubleClickFull;
    }


    if (typeof params.handleTalkSuccess !== 'undefined') {
      window.EZUIKit.handleTalkSuccess = params.handleTalkSuccess;
    }
    if (typeof params.handleTalkError !== 'undefined') {
      window.EZUIKit.handleTalkError = params.handleTalkError;
    }
    

    var id = this.opt.id;
    var domElement = document.getElementById(id); // 间隙

    domElement.style.fontSize = 0;
    domElement.style.overflowY = 'auto';
    domElement.style.position = 'relative';
    /**
     * 渲染iframe视频框
     */

    var iframe = document.createElement('iframe');

    function matchIframeUrl() {
      switch (_this.opt.template) {
        case 'simple':
          var iframeUrl = domain + "/ezopen/h5/iframe?bSupporDoubleClickFull=0&url=" + _this.opt.url.replace("?","&") + "&autoplay=" + _this.opt.autoplay + "&audio=" + _this.opt.audio + "&accessToken=" + params.accessToken + "&templete=0" + "&id=" + id + "&decoderVersion=" + _this.opt.decoderVersion;
          var controlsValue = "";
          if(typeof params.controls !== 'undefined' && params.controls){
            console.log("typeof" ,typeof params.controls);
            controlsValue = "play,voice,hd,fullScreen";
            if(params.controls.length > 0){
              controlsValue = params.controls.join(",");
              iframeUrl += ('&controls=' + controlsValue);
            }
          }
          if (params.websocketParams) {
            iframeUrl += ('&websocketParams=' + JSON.stringify(params.websocketParams));
          }
          return iframeUrl;
        case 'standard':
          return domain + "/ezopen/h5/iframe?bSupporDoubleClickFull=0&url=" + _this.opt.url.replace("?","&") + "&autoplay=" + _this.opt.autoplay + "&audio=" + _this.opt.audio + "&accessToken=" + params.accessToken + "&templete=1" + "&id=" + id + "&decoderVersion=" + _this.opt.decoderVersion;

        case 'security':
          return domain + "/ezopen/h5/iframe_se?bSupporDoubleClickFull=0&url=" + _this.opt.url.replace("?","&") + "&autoplay=" + _this.opt.autoplay + "&audio=" + _this.opt.audio + "&accessToken=" + params.accessToken + "&templete=0" + "&id=" + id + "&decoderVersion=" + _this.opt.decoderVersion;

        case 'theme':
          iframeUrl = domain +`/jssdk/theme.html?url=${params.url}&accessToken=${params.accessToken}&id=${id}&isMobile=${params.isMobile}`;
          if(typeof params.isMobile !== 'undefined') {
            iframeUrl += '&isMobile=' + params.isMobile;
          } 
          if(typeof params.autoplay !== 'undefined') {
            iframeUrl += '&autoplay=' + params.autoplay;
          } 
          if(typeof params.domain !== 'undefined') {
            if(params.domain == 'https://test12open.ys7.com')
            iframeUrl += '&env=' + 'test12';
          }
          if (typeof params.env !== 'undefined') {
            if(typeof params.env.domain !== 'undefined'){
              if(params.env.domain == 'https://test12open.ys7.com'){
              iframeUrl += '&env=' + 'test12';
            }
            }
          }
          if(typeof params.header !== 'undefined') {
            iframeUrl += '&header=' + params.header;
          }
          return iframeUrl;

        default:
          return domain + "/ezopen/h5/iframe?bSupporDoubleClickFull=0&url=" + _this.opt.url.replace("?","&") + "&autoplay=" + _this.opt.autoplay + "&audio=" + _this.opt.audio + "&accessToken=" + params.accessToken + "&templete=0" + "&id=" + id + "&decoderVersion=" + _this.opt.decoderVersion;
      }
    }

    iframe.src = matchIframeUrl(); // 默认取容器宽高

    var iframeHeight = document.getElementById(id).offsetHeight;
    var iframeWidth = document.getElementById(id).offsetWidth;

    if (params.height) {
      iframeHeight = parseInt(params.height);
      if(/\%$/.test(params.height)) {
        iframeWidth = document.getElementById(id).offsetWidth * (parseInt(params.height) /100);
      }
    }

    if (params.width) {
      iframeWidth = parseInt(params.width);
      if(/\%$/.test(params.width)) {
        iframeWidth = document.getElementById(id).offsetWidth * (parseInt(params.width) /100);
      }
    }

    iframe.width = iframeWidth;
    iframe.height = iframeHeight;
    iframe.id = 'EZUIKitPlayer-' + id; // 部分iframe属性

    iframe.setAttribute("allowfullscreen", true);
    iframe.setAttribute("allow", "autoplay");
    iframe.setAttribute("frameborder", 0);
    domElement.appendChild(iframe);
    var jqueryJS = _this.opt.filePath + '/js/jquery.js';
    var layerJs = 'https://open.ys7.com/assets/layer/layer.js';
    addJs(jqueryJS, function () {
      addJs(layerJs, function () {
        //   });
        // });
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
            capturePictureDOM.innerHTML = '<span title="截图">' + '<svg id="capturePicture" title="截图" t="1578882764585" class="icon" viewBox="0 0 1024 1024" version="1.1"' + '  xmlns="http://www.w3.org/2000/svg" p-id="5958" width="24" height="24">' + '  <path' + '    d="M887.296 315.904h-153.6c-51.2 0-68.096-102.4-119.296-102.4H392.704c-34.304 0-51.2 102.4-102.4 102.4h-153.6c-29.696 0-51.2 21.504-51.2 51.2v439.296c0 25.6 21.504 47.104 51.2 47.104h751.104c29.696 0 51.2-21.504 51.2-51.2v-435.2c-0.512-30.208-21.504-51.2-51.712-51.2zM512 768c-115.2 0-204.8-89.6-204.8-200.704s89.6-200.704 204.8-200.704 204.8 89.6 204.8 200.704-93.696 200.704-204.8 200.704z m247.296-354.304c-12.8 0-25.6-12.8-25.6-25.6s12.8-25.6 25.6-25.6 25.6 12.8 25.6 25.6c0 17.408-12.8 25.6-25.6 25.6zM256 264.704c0-8.704-8.704-16.896-16.896-16.896h-51.2c-8.704 0-16.896 8.704-16.896 16.896V281.6H256v-16.896z m256 148.992c-85.504 0-153.6 68.096-153.6 153.6s68.096 153.6 153.6 153.6 153.6-68.096 153.6-153.6-68.096-153.6-153.6-153.6z"' + '    fill="#ffffff" p-id="5959"></path>' + '</svg>' + '</span>';

            capturePictureDOM.onclick = function () {
              _this.capturePicture();
            };

            controsDOM.appendChild(capturePictureDOM);
          }

          console.log("matchHeaderOpt().saveModule", matchHeaderOpt().saveModule);

          if (matchHeaderOpt().saveModule) {
            var startSaveDOM = document.createElement('span');
            startSaveDOM.innerHTML = '<span title="开始录像">' + '  <svg id="startSave" t="1578882716693" class="icon" viewBox="0 0 1024 1024" version="1.1"' + '    xmlns="http://www.w3.org/2000/svg" p-id="3782" width="24" height="24">' + '    <path' + '      d="M915.2 729.6l-128-76.8c-25.6-12.8-44.8-32-44.8-51.2V435.2c0-25.6 19.2-38.4 44.8-51.2l128-76.8c25.6-12.8 44.8 0 44.8 19.2V704c0 32-19.2 38.4-44.8 25.6z m-332.8 89.6H96c-51.2 0-89.6-38.4-89.6-89.6V332.8c0-51.2 38.4-89.6 89.6-89.6h486.4c51.2 0 89.6 38.4 89.6 89.6v396.8c0 51.2-38.4 89.6-89.6 89.6zM192 364.8c-32 6.4-57.6 32-64 64-12.8 57.6 38.4 115.2 96 102.4 32-6.4 57.6-32 64-70.4 12.8-57.6-38.4-108.8-96-96z m0 0"' + '      p-id="3783" fill="#ffffff"></path>' + '  </svg>' + '</span>';

            startSaveDOM.onclick = function () {
              _this.startSave();

              document.getElementById('startSave').setAttribute('class', 'icon hide');
              document.getElementById('stopSave').setAttribute('class', 'icon');
            };

            controsDOM.appendChild(startSaveDOM);
            var stopSaveDOM = document.createElement('span');
            stopSaveDOM.innerHTML = '<span title="结束录像">' + ' <svg id="stopSave" t="1578882716693" class="icon hide" viewBox="0 0 1024 1024" version="1.1"' + '   xmlns="http://www.w3.org/2000/svg" p-id="3782" width="24" height="24">' + '   <path' + '     d="M915.2 729.6l-128-76.8c-25.6-12.8-44.8-32-44.8-51.2V435.2c0-25.6 19.2-38.4 44.8-51.2l128-76.8c25.6-12.8 44.8 0 44.8 19.2V704c0 32-19.2 38.4-44.8 25.6z m-332.8 89.6H96c-51.2 0-89.6-38.4-89.6-89.6V332.8c0-51.2 38.4-89.6 89.6-89.6h486.4c51.2 0 89.6 38.4 89.6 89.6v396.8c0 51.2-38.4 89.6-89.6 89.6zM192 364.8c-32 6.4-57.6 32-64 64-12.8 57.6 38.4 115.2 96 102.4 32-6.4 57.6-32 64-70.4 12.8-57.6-38.4-108.8-96-96z m0 0"' + '     p-id="3783" fill="red"></path>' + ' </svg>' + ' </span>';

            stopSaveDOM.onclick = function () {
              _this.stopSave();

              document.getElementById('stopSave').setAttribute('class', 'icon hide');
              document.getElementById('startSave').setAttribute('class', 'icon');
            };

            controsDOM.appendChild(stopSaveDOM);
          }

          if (matchHeaderOpt().zoomModule) {
            var enableZoomDOM = document.createElement('span');
            enableZoomDOM.innerHTML = '<span title="开启电子放大">' + '  <svg id="enableZoom" t="1578882639834" class="icon" viewBox="0 0 1000 1000" version="1.1"' + '    xmlns="http://www.w3.org/2000/svg" p-id="2227" width="24" height="24">' + '    <path' + '      d="M830.6119 441.1089c0-193.7756-157.0939-350.8641-350.8775-350.8641S128.8559 247.3333 128.8559 441.1089 285.9508 791.972 479.7344 791.972 830.6119 634.8845 830.6119 441.1089zM483.2821 710.4863c-146.7975 0-265.8187-118.9953-265.8187-265.8088S336.4847 178.8697 483.2821 178.8697s265.8197 118.9953 265.8197 265.8078S630.0796 710.4863 483.2821 710.4863zM770.6031 653.5739l-72.6417 75.9485 141.6917 160.1814 82.0737-90.0739L770.6031 653.5739zM527.5849 267.4727h-88.60655762279428v132.90489048425167H306.0690340253259v88.60292721534799h132.90933675248866v132.9038911617923h88.60655762279428V488.9794719180395h132.90933675248866v-88.60292721534799H527.5849284006089V267.4726535408993z"' + '      p-id="2228" fill="#ffffff"></path>' + '  </svg>' + '</span>';

            enableZoomDOM.onclick = function () {
              _this.enableZoom();

              document.getElementById('enableZoom').setAttribute('class', 'icon hide');
              document.getElementById('closeZoom').setAttribute('class', 'icon');
            };

            controsDOM.appendChild(enableZoomDOM);
            var closeZoomDOM = document.createElement('span');
            closeZoomDOM.innerHTML = '<span title="关闭电子放大">' + '  <svg id="closeZoom" t="1578882639834" class="icon hide" viewBox="0 0 1000 1000" version="1.1"' + '    xmlns="http://www.w3.org/2000/svg" p-id="2227" width="24" height="24">' + '    <path' + '      d="M830.6119 441.1089c0-193.7756-157.0939-350.8641-350.8775-350.8641S128.8559 247.3333 128.8559 441.1089 285.9508 791.972 479.7344 791.972 830.6119 634.8845 830.6119 441.1089zM483.2821 710.4863c-146.7975 0-265.8187-118.9953-265.8187-265.8088S336.4847 178.8697 483.2821 178.8697s265.8197 118.9953 265.8197 265.8078S630.0796 710.4863 483.2821 710.4863zM770.6031 653.5739l-72.6417 75.9485 141.6917 160.1814 82.0737-90.0739L770.6031 653.5739zM527.5849 267.4727h-88.60655762279428v132.90489048425167H306.0690340253259v88.60292721534799h132.90933675248866v132.9038911617923h88.60655762279428V488.9794719180395h132.90933675248866v-88.60292721534799H527.5849284006089V267.4726535408993z"' + '      p-id="2228" fill="red"></path>' + '  </svg>' + '</span>';

            closeZoomDOM.onclick = function () {
              _this.closeZoom();

              document.getElementById('closeZoom').setAttribute('class', 'icon hide');
              document.getElementById('enableZoom').setAttribute('class', 'icon');
            };

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
            fullScreenModule: false
          };
          var template = _this.opt.template;

          switch (template) {
            case 'simple':
              if (params.footer && params.footer instanceof Array) {
                var footer = params.footer;
                result = {
                  footerContainer: true,
                  talkModule: footer.indexOf('talk') !== -1,
                  broadcastModule: footer.indexOf('broadcast') !== -1,
                  hdModule: footer.indexOf('hd') !== -1,
                  fullScreenModule: footer.indexOf('fullScreen') !== -1
                };
              }

              break;

            case 'standard':
              if (params.footer && params.footer instanceof Array) {
                var footer = params.footer;
                result = {
                  footerContainer: true,
                  talkModule: footer.indexOf('talk') !== -1,
                  broadcastModule: footer.indexOf('broadcast') !== -1,
                  hdModule: footer.indexOf('hd') !== -1,
                  fullScreenModule: footer.indexOf('fullScreen') !== -1
                };
              }

              break;

            case 'security':
              break;

            case 'voice':
              result = {
                footerContainer: true,
                talkModule: true,
                broadcastModule: true,
                hdModule: true,
                fullScreenModule: true
              };
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
            zoomModule: false
          };
          var template = _this.opt.template;

          switch (template) {
            case 'simple':
              if (params.header && params.header instanceof Array) {
                var header = params.header;
                result = {
                  headerContainer: true,
                  capturePictureModule: header.indexOf('capturePicture') !== -1,
                  saveModule: header.indexOf('save') !== -1,
                  zoomModule: header.indexOf('zoom') !== -1
                };
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
                zoomModule: true
              };
              break;
          }

          return result;
        }

        if (matchFooterOpt().footerContainer || _this.opt.plugin.indexOf('talk') !== -1) {
          var recoderCSS = _this.opt.filePath + '/npm/css/recoder.css';
          var recoderJs = _this.opt.filePath + '/npm/js/recoder.js';
          var recorderJs = _this.opt.filePath + '/recorder.js'; // addCss()

          addCss(recoderCSS, function () { });
          addJs(recoderJs, function () {
            addJs(recorderJs, function () { });
          }); // 对讲模块

          if (_this.opt.plugin.indexOf('talk') !== -1 || matchFooterOpt().talkModule) {
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

                  _this.opt.rtcUrl = rtcTrunk;
                  _this.opt.ttsUrl = "tts://" + apiResult.ttsUrl;
                  var talk = "talk://" + _this.opt.deviceSerial + ":0:" + _this.opt.channelNo + ":cas.ys7.com:6500";
                  _this.opt.talkLink = _this.opt.ttsUrl + "/" + talk;
                  _this.opt.stream = apiResult.stream;
                  console.log("_this.opt", _this.opt); // 加载依赖

                  if (!_this.opt.isReliesReady) {
                    var adapeterJS = _this.opt.filePath + '/npm/js/adapeter.js';
                    var janusJS = _this.opt.filePath + '/npm/js/janus.js';
                    var ttsJS = _this.opt.filePath + '/npm/js/tts.js';
                    console.log("加载jquery.js");
                    addJs(adapeterJS, function () {
                      console.log("加载adapeter.js");
                      addJs(janusJS, function () {
                        console.log("加载janus.js");
                        addJs(ttsJS, function () {
                          console.log("加载tts.js"); // 文件加载完毕;

                          _this.opt.isReliesReady = true;
                        });
                      });
                    },()=>{
                      return !!window.adapter;
                    });
                  } // 创建DOM


                  if (!document.getElementById("audioleft")) {
                    var audioleft = document.createElement('div');
                    audioleft.style.display = 'none';
                    audioleft.id = 'audioleft';
                    document.body.appendChild(audioleft);
                  }

                  if (!document.getElementById("audioright")) {
                    var audioright = document.createElement('div');
                    audioright.style.display = 'none';
                    audioright.id = 'audioright';
                    document.body.appendChild(audioright);
                  }
                }
              }
              EZUIKit.opt = _this.opt;
              if(window.EZUIKit) {
                window.EZUIKit.opt = _this.opt;
              }
            }
            request(_this.opt.apiDomain, 'POST', {
              accessToken: _this.opt.accessToken,
              deviceSerial: _this.opt.deviceSerial,
              channelNo: _this.opt.channelNo
            }, '', apiSuccess);
          }

          if (matchFooterOpt().footerContainer) {
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
                hdDom.innerHTML = _this.opt.url.indexOf('.hd') === -1 ? '标清' : '高清';

                hdDom.onclick = function () {
                  // 停止
                  if(_this.opt.videoLoading){
                    layer.msg("视频加载中，请稍后");
                    return false;
                  }else {
                  var stopPromise  = _this.stop();
                  _this.opt.videoLoading = true;
                  stopPromise.then((data)=>{
                    _this.opt.videoLoading = false;
                    if (_this.opt.url.indexOf('.hd') === -1) {
                      _this.opt.url = _this.opt.url.replace('.live', '.hd.live');
                      hdDom.innerHTML = _this.opt.url.indexOf('.hd') === -1 ? '标清' : '高清';
                    } else {
                      _this.opt.url = _this.opt.url.replace('.hd.live', '.live');
                      hdDom.innerHTML = _this.opt.url.indexOf('.hd') === -1 ? '标清' : '高清';
                    }
                    _this.play(_this.opt.url);
                  })
                  .catch((error)=>{
                    console.log("error",error);
                  });
                }
                //iframe.src = domain +"/ezopen/h5/iframe?url=" + _this.opt.url.replace('.hd.live', '.live') + "&autoplay=1&audio=" + _this.opt.audio + "&accessToken=" + _this.opt.accessToken + "&templete=" + 0;
                };

                rightContros.appendChild(hdDom);
              }

              if (matchFooterOpt().fullScreenModule) {
                // 声音控制
                var openSoundDOM = document.createElement('span');
                openSoundDOM.setAttribute('class', 'hide');
                openSoundDOM.setAttribute('id', 'ezuikit-open-sound');
                openSoundDOM.setAttribute('title', '打开声音');
                openSoundDOM.setAttribute('style', 'vertical-align: top;');
                openSoundDOM.innerHTML = '<svg t="1590476263239" class="icon" viewBox="0 0 1178 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2273" width="16" height="16"><path d="M665.6 51.2 665.6 51.2c-10.24-30.72-40.96-51.2-71.68-51.2-5.12 0-15.36 0-20.48 5.12l0 0L358.4 153.6 51.2 209.92l0 0C20.48 220.16 0 250.88 0 281.6 0 286.72 0 291.84 0 307.2l0 0 0 409.6 0 0c0 15.36 0 20.48 0 25.6 0 30.72 20.48 61.44 51.2 71.68l0 0L358.4 870.4l97.28 71.68 107.52 76.8 0 0c5.12 5.12 15.36 5.12 25.6 5.12 40.96 0 76.8-35.84 76.8-76.8 0-10.24 0-10.24 0-25.6l0 0L665.6 51.2zM563.2 870.4l-153.6-102.4-307.2-51.2L102.4 307.2l307.2-51.2 153.6-102.4L563.2 870.4z" p-id="2274" fill="#FF0000"></path><path d="M1049.6 537.6l112.64-112.64c20.48-20.48 20.48-56.32 0-76.8-20.48-20.48-56.32-20.48-76.8 0L972.8 460.8l-112.64-112.64c0 0 0 0 0 0-20.48-20.48-56.32-20.48-76.8 0 0 0 0 0 0 0-20.48 20.48-20.48 56.32 0 76.8l112.64 112.64-112.64 112.64c-20.48 20.48-20.48 56.32 0 76.8 20.48 20.48 56.32 20.48 76.8 0L972.8 614.4l112.64 112.64c20.48 20.48 56.32 20.48 76.8 0s20.48-56.32 0-76.8L1049.6 537.6z" p-id="2275" fill="#FF0000"></path></svg>';

                openSoundDOM.onclick = function () {
                  _this.openSound(0);

                  openSoundDOM.setAttribute('class', 'hide');
                  closeSoundDOM.setAttribute('class', '');
                }; // 声音控制


                var closeSoundDOM = document.createElement('span');
                openSoundDOM.setAttribute('id', 'ezuikit-close-sound');
                closeSoundDOM.setAttribute('class', 'hide');
                closeSoundDOM.setAttribute('title', '关闭声音');
                closeSoundDOM.setAttribute('style', 'vertical-align: top;');
                closeSoundDOM.innerHTML = '<svg t="1590414410633" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20545" width="16" height="16"><path d="M840.533333 98.133333c-17.066667-17.066667-42.666667-17.066667-59.733333 0-17.066667 17.066667-17.066667 42.666667 0 59.733334C883.2 256 938.666667 392.533333 938.666667 533.333333c0 140.8-55.466667 277.333333-157.866667 375.466667-17.066667 17.066667-17.066667 42.666667 0 59.733333 8.533333 8.533333 21.333333 12.8 29.866667 12.8 8.533333 0 21.333333-4.266667 29.866666-12.8 115.2-110.933333 183.466667-268.8 183.466667-435.2 0-166.4-68.266667-324.266667-183.466667-435.2zM571.733333 12.8c-17.066667-8.533333-34.133333-4.266667-46.933333 8.533333L281.6 256H42.666667c-25.6 0-42.666667 17.066667-42.666667 42.666667v426.666666c0 25.6 17.066667 42.666667 42.666667 42.666667h238.933333l243.2 234.666667c8.533333 8.533333 17.066667 12.8 29.866667 12.8 4.266667 0 12.8 0 17.066666-4.266667 17.066667-8.533333 25.6-21.333333 25.6-38.4V51.2c0-17.066667-8.533333-34.133333-25.6-38.4zM512 870.4l-183.466667-179.2c-8.533333-4.266667-17.066667-8.533333-29.866666-8.533333H85.333333V341.333333h213.333334c12.8 0 21.333333-4.266667 29.866666-12.8L512 153.6v716.8z" p-id="20546" fill="#ffffff"></path><path d="M759.466667 349.866667c-12.8-21.333333-38.4-25.6-59.733334-8.533334-21.333333 12.8-25.6 38.4-8.533333 59.733334 21.333333 29.866667 34.133333 76.8 34.133333 123.733333 0 46.933333-12.8 93.866667-34.133333 123.733333-12.8 21.333333-8.533333 46.933333 8.533333 59.733334 8.533333 4.266667 17.066667 8.533333 25.6 8.533333 12.8 0 25.6-4.266667 34.133334-17.066667 34.133333-46.933333 51.2-106.666667 51.2-174.933333 0-68.266667-17.066667-128-51.2-174.933333z" p-id="20547" fill="#ffffff"></path></svg>';

                closeSoundDOM.onclick = function () {
                  _this.closeSound(0);

                  openSoundDOM.setAttribute('class', '');
                  closeSoundDOM.setAttribute('class', 'hide');
                };

                rightContros.appendChild(openSoundDOM);
                rightContros.appendChild(closeSoundDOM);
              } // 根据当前音频配置展示


              if (_this.opt.audio == 1) {
                closeSoundDOM.setAttribute('class', '');
              } else {
                openSoundDOM.setAttribute('class', '');

                _this.closeSound(0);
              }

              if (matchFooterOpt().fullScreenModule) {
                // 全屏控制
                var fullScreenDOM = document.createElement('span');
                fullScreenDOM.setAttribute('title', '全屏');
                fullScreenDOM.setAttribute('style', 'vertical-align: top;');
                fullScreenDOM.innerHTML = '<svg id="fullScreen" t="1578020167938" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5035" width="16" height="16"> <path d="M348.373333 625.706667l-128 128-64 64v-128a33.28 33.28 0 0 0-35.413333-35.413334A33.493333 33.493333 0 0 0 85.333333 689.706667v213.333333A33.706667 33.706667 0 0 0 120.96 938.666667h213.333333a35.626667 35.626667 0 0 0 0-71.04h-128l64-64 128-128a35.2 35.2 0 0 0-49.92-49.92zM206.293333 156.373333h128a33.28 33.28 0 0 0 35.413334-35.413333A33.493333 33.493333 0 0 0 334.293333 85.333333H113.706667c-7.04 0-14.08 7.04-21.333334 14.293334a26.026667 26.026667 0 0 0-7.04 21.333333v213.333333a33.493333 33.493333 0 0 0 35.626667 35.413334 33.28 33.28 0 0 0 35.413333-35.413334v-128l192 192a35.2 35.2 0 0 0 49.92-49.92zM903.04 85.333333h-213.333333a33.493333 33.493333 0 0 0-35.413334 35.626667 33.28 33.28 0 0 0 35.413334 35.413333h128l-64 64-128 128a35.2 35.2 0 0 0 49.92 49.92l128-128 64-64v128a35.626667 35.626667 0 0 0 71.04 0v-213.333333A33.706667 33.706667 0 0 0 903.04 85.333333zM903.04 654.293333a33.28 33.28 0 0 0-35.413333 35.413334v128l-64-64-128-128a35.2 35.2 0 0 0-49.92 49.92l128 128 64 64h-128a35.626667 35.626667 0 0 0 0 71.04h213.333333A33.706667 33.706667 0 0 0 938.666667 903.04v-213.333333a33.493333 33.493333 0 0 0-35.626667-35.413334z" p-id="5036" fill="#ffffff"></path></svg>';

                fullScreenDOM.onclick = function () {
                  _this.fullScreen();
                };

                rightContros.appendChild(fullScreenDOM);
              }
            }

            if (matchFooterOpt().talkModule) {
              // 对讲
              var startTalkDOM = document.createElement('div');
              var stopTalkDOM = document.createElement('div');
              startTalkDOM.setAttribute("class", "ptp-talk off");
              startTalkDOM.innerHTML = '<span title="对讲">' + '<svg t="1581930496966" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"' + '  p-id="1641" width="16" height="16">' + '  <path' + '    d="M715.648 647.872c-30.208-22.336-61.568 39.36-100.992 77.44-39.36 38.08-34.112 31.488-123.392-17.088S311.488 540.224 280 491.648C248.448 443.072 265.472 424.704 265.472 424.704s78.72-62.976 97.152-81.344c18.368-18.368 13.12-30.208 13.12-30.208l-128.64-190.144c-23.616-5.184-64.32 5.12-128.576 57.6C54.208 233.088 30.592 353.856 151.296 575.68c120.768 221.824 347.84 330.752 485.568 374.08 137.856 43.328 228.416-61.696 249.408-103.68 21.056-41.984 13.12-85.312 13.12-85.312S745.856 670.208 715.648 647.872z"' + '    p-id="1642" fill="#ffffff"></path>' + '  <path' + '    d="M715.328 64C580.992 64 472.192 172.864 472.192 307.2s108.8 243.2 243.136 243.2 243.2-108.864 243.2-243.2S849.6 64 715.328 64zM715.328 461.056c-84.992 0-153.856-68.864-153.856-153.856s68.864-153.856 153.856-153.856 153.856 68.928 153.856 153.856S800.32 461.056 715.328 461.056z"' + '    p-id="1643" fill="#ffffff"></path>' + '  <path' + '    d="M777.472 277.376c-18.176 0-32.96-14.784-32.96-33.024 0-8.448 3.136-16.064 8.32-21.888-11.52-5.12-24.128-8-37.568-8-51.2 0-92.672 41.472-92.672 92.736s41.472 92.736 92.672 92.736S808.064 358.4 808.064 307.2c0-13.696-3.072-26.688-8.384-38.4C793.728 274.112 786.048 277.376 777.472 277.376zM715.328 340.928c-18.624 0-33.664-15.104-33.664-33.728 0-18.624 15.04-33.728 33.664-33.728 18.688 0 33.728 15.104 33.728 33.728C749.056 325.824 734.016 340.928 715.328 340.928z"' + '    p-id="1644" fill="#ffffff"></path>' + ' </svg>' + ' </span>' + ' <span>开启对讲</span>';

              startTalkDOM.onclick = function () {
                console.log("EZUIKit.state.countTimer", EZUIKit.state.countTimer);

                if (EZUIKit.state.countTimer) {
                  window.layer.msg("语音设备正忙，请稍后重试");
                  return false;
                }

                countTime('add', 0);
                console.log("开始对讲，关闭声音");

                _this.closeSound(0);

                console.log(_this.opt);

                _this.startTalk();

                this.setAttribute("class", "ptp-talk off hide");
                stopTalkDOM.setAttribute("class", "ptp-talk on");
              };

              stopTalkDOM.setAttribute("class", "ptp-talk on hide");
              stopTalkDOM.innerHTML = '<span title="对讲">' + ' <svg t="1581930496966" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"' + '    p-id="1641" width="16" height="16">' + '    <path' + '      d="M715.648 647.872c-30.208-22.336-61.568 39.36-100.992 77.44-39.36 38.08-34.112 31.488-123.392-17.088S311.488 540.224 280 491.648C248.448 443.072 265.472 424.704 265.472 424.704s78.72-62.976 97.152-81.344c18.368-18.368 13.12-30.208 13.12-30.208l-128.64-190.144c-23.616-5.184-64.32 5.12-128.576 57.6C54.208 233.088 30.592 353.856 151.296 575.68c120.768 221.824 347.84 330.752 485.568 374.08 137.856 43.328 228.416-61.696 249.408-103.68 21.056-41.984 13.12-85.312 13.12-85.312S745.856 670.208 715.648 647.872z"' + '      p-id="1642" fill="#ff0000"></path>' + '    <path' + '      d="M715.328 64C580.992 64 472.192 172.864 472.192 307.2s108.8 243.2 243.136 243.2 243.2-108.864 243.2-243.2S849.6 64 715.328 64zM715.328 461.056c-84.992 0-153.856-68.864-153.856-153.856s68.864-153.856 153.856-153.856 153.856 68.928 153.856 153.856S800.32 461.056 715.328 461.056z"' + '      p-id="1643" fill="#ff0000"></path>' + '    <path' + '      d="M777.472 277.376c-18.176 0-32.96-14.784-32.96-33.024 0-8.448 3.136-16.064 8.32-21.888-11.52-5.12-24.128-8-37.568-8-51.2 0-92.672 41.472-92.672 92.736s41.472 92.736 92.672 92.736S808.064 358.4 808.064 307.2c0-13.696-3.072-26.688-8.384-38.4C793.728 274.112 786.048 277.376 777.472 277.376zM715.328 340.928c-18.624 0-33.664-15.104-33.664-33.728 0-18.624 15.04-33.728 33.664-33.728 18.688 0 33.728 15.104 33.728 33.728C749.056 325.824 734.016 340.928 715.328 340.928z"' + '      p-id="1644" fill="#ff0000"></path>' + '  </svg>' + ' </span>' + '<span>关闭对讲</span>';

              stopTalkDOM.onclick = function () {
                console.log(_this.opt);

                _this.stopTalk();

                countTime('destory', 0);

                _this.openSound(0);

                this.setAttribute("class", "ptp-talk on hide");
                startTalkDOM.setAttribute("class", "ptp-talk off");
              };

              footerContainer.appendChild(startTalkDOM);
              footerContainer.appendChild(stopTalkDOM);
            }

            if (matchFooterOpt().broadcastModule) {
              var startBroadcastDOM = document.createElement('div');
              var stopBroadcastDOM = document.createElement('div');
              startBroadcastDOM.setAttribute("class", 'broadcast off');
              stopBroadcastDOM.setAttribute("class", "broadcast on hide");
              startBroadcastDOM.innerHTML = ' <span title="语音播报">' + '  <svg t="1583561695846" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"' + '    p-id="1126" width="16" height="16">' + '    <path' + '      d="M513.82044445 964.38044445c-8.192 0-15.47377778-2.73066667-21.84533334-8.192 0 0-46.42133333-41.87022222-99.21422222-86.47111112-89.20177778-73.728-117.41866667-88.29155555-123.79022222-90.112H35.04355555c-14.56355555 0-26.39644445-11.83288889-26.39644444-27.30666666V271.70133333c0-14.56355555 11.83288889-27.30666667 26.39644444-27.30666666H246.21511111c7.28177778-2.73066667 37.31911111-15.47377778 137.44355556-91.02222222 58.25422222-43.69066667 111.04711111-86.47111111 111.04711111-86.47111112 5.46133333-4.55111111 12.74311111-7.28177778 20.02488889-7.28177778 4.55111111 0 10.01244445 0.91022222 14.56355555 3.6408889 10.92266667 5.46133333 18.20444445 17.29422222 18.20444445 30.03733333v837.40444444c0 12.74311111-7.28177778 25.48622222-19.11466667 30.94755556-5.46133333 1.82044445-10.01244445 2.73066667-14.56355555 2.73066667zM270.79111111 724.992c19.11466667 0 48.24177778 8.192 167.48088889 106.496 16.384 13.65333333 33.67822222 28.21688889 51.88266667 43.69066667l5.46133333 4.55111111V139.71911111l-5.46133333 3.64088889c-22.75555555 17.29422222-44.60088889 34.58844445-65.536 50.06222222C293.54666667 291.72622222 264.41955555 299.008 245.30488889 299.008H82.37511111c-20.02488889 0-21.84533333 12.74311111-21.84533333 26.39644445V694.04444445c0 23.66577778 6.37155555 30.03733333 28.21688889 30.03733333h180.224l1.82044444 0.91022222z m520.64711111 162.01955555c-14.56355555 0-26.39644445-11.83288889-26.39644444-27.30666666 0-11.83288889 8.192-20.02488889 16.384-24.576 112.86755555-67.35644445 182.04444445-191.14666667 182.04444444-324.03911111 0-132.89244445-70.08711111-256.68266667-182.04444444-324.03911111-10.01244445-5.46133333-15.47377778-14.56355555-15.47377778-24.576 0-14.56355555 11.83288889-27.30666667 26.39644445-27.30666667 5.46133333 0 10.01244445 1.82044445 16.384 5.46133333 128.34133333 76.45866667 207.53066667 218.45333333 207.53066666 369.55022222 0 152.00711111-80.09955555 293.09155555-208.44088889 369.55022223-6.37155555 5.46133333-10.92266667 7.28177778-16.384 7.28177777z m-90.112-152.91733333c-14.56355555 0-26.39644445-11.83288889-26.39644444-27.30666667 0-10.01244445 4.55111111-18.20444445 12.74311111-23.66577777 61.89511111-34.58844445 100.12444445-100.12444445 100.12444444-171.12177778 0-70.08711111-37.31911111-134.71288889-96.48355555-170.21155555-8.192-4.55111111-12.74311111-13.65333333-12.74311111-23.66577778 0-14.56355555 11.83288889-27.30666667 26.39644444-27.30666667 4.55111111 0 11.83288889 2.73066667 15.47377778 4.55111111 74.63822222 44.60088889 121.96977778 127.43111111 121.96977778 215.72266667 0 90.112-48.24177778 173.85244445-125.61066667 218.45333333-1.82044445 0-9.10222222 4.55111111-15.47377778 4.55111111z"' + '      fill="#ffffff" p-id="1127"></path>' + '  </svg>' + '</span>' + '<span>语音播报</span>';

              startBroadcastDOM.onclick = function () {
                this.setAttribute("class", "broadcast off hide");
                stopBroadcastDOM.setAttribute("class", "broadcast on");
              };

              stopBroadcastDOM.innerHTML = '<div class="pop-hover">' + '  <div class="pop-hover-content">' + '    <div class="vioce-list" id="voice-list">' + '      <ul class="voice-list-ul">' + '      </ul>' + '      <div id="voice-list-end"></div>' + '    </div>' + '    <div id="voice-custom" style="text-align: center;">自定义语音</div>' + '  </div>' + '</div>' + '<span title="语音播报">' + '  <svg t="1583561695846" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"' + '    p-id="1126" width="16" height="16">' + '    <path' + '      d="M513.82044445 964.38044445c-8.192 0-15.47377778-2.73066667-21.84533334-8.192 0 0-46.42133333-41.87022222-99.21422222-86.47111112-89.20177778-73.728-117.41866667-88.29155555-123.79022222-90.112H35.04355555c-14.56355555 0-26.39644445-11.83288889-26.39644444-27.30666666V271.70133333c0-14.56355555 11.83288889-27.30666667 26.39644444-27.30666666H246.21511111c7.28177778-2.73066667 37.31911111-15.47377778 137.44355556-91.02222222 58.25422222-43.69066667 111.04711111-86.47111111 111.04711111-86.47111112 5.46133333-4.55111111 12.74311111-7.28177778 20.02488889-7.28177778 4.55111111 0 10.01244445 0.91022222 14.56355555 3.6408889 10.92266667 5.46133333 18.20444445 17.29422222 18.20444445 30.03733333v837.40444444c0 12.74311111-7.28177778 25.48622222-19.11466667 30.94755556-5.46133333 1.82044445-10.01244445 2.73066667-14.56355555 2.73066667zM270.79111111 724.992c19.11466667 0 48.24177778 8.192 167.48088889 106.496 16.384 13.65333333 33.67822222 28.21688889 51.88266667 43.69066667l5.46133333 4.55111111V139.71911111l-5.46133333 3.64088889c-22.75555555 17.29422222-44.60088889 34.58844445-65.536 50.06222222C293.54666667 291.72622222 264.41955555 299.008 245.30488889 299.008H82.37511111c-20.02488889 0-21.84533333 12.74311111-21.84533333 26.39644445V694.04444445c0 23.66577778 6.37155555 30.03733333 28.21688889 30.03733333h180.224l1.82044444 0.91022222z m520.64711111 162.01955555c-14.56355555 0-26.39644445-11.83288889-26.39644444-27.30666666 0-11.83288889 8.192-20.02488889 16.384-24.576 112.86755555-67.35644445 182.04444445-191.14666667 182.04444444-324.03911111 0-132.89244445-70.08711111-256.68266667-182.04444444-324.03911111-10.01244445-5.46133333-15.47377778-14.56355555-15.47377778-24.576 0-14.56355555 11.83288889-27.30666667 26.39644445-27.30666667 5.46133333 0 10.01244445 1.82044445 16.384 5.46133333 128.34133333 76.45866667 207.53066667 218.45333333 207.53066666 369.55022222 0 152.00711111-80.09955555 293.09155555-208.44088889 369.55022223-6.37155555 5.46133333-10.92266667 7.28177778-16.384 7.28177777z m-90.112-152.91733333c-14.56355555 0-26.39644445-11.83288889-26.39644444-27.30666667 0-10.01244445 4.55111111-18.20444445 12.74311111-23.66577777 61.89511111-34.58844445 100.12444445-100.12444445 100.12444444-171.12177778 0-70.08711111-37.31911111-134.71288889-96.48355555-170.21155555-8.192-4.55111111-12.74311111-13.65333333-12.74311111-23.66577778 0-14.56355555 11.83288889-27.30666667 26.39644444-27.30666667 4.55111111 0 11.83288889 2.73066667 15.47377778 4.55111111 74.63822222 44.60088889 121.96977778 127.43111111 121.96977778 215.72266667 0 90.112-48.24177778 173.85244445-125.61066667 218.45333333-1.82044445 0-9.10222222 4.55111111-15.47377778 4.55111111z"' + '      fill="#ff0000" p-id="1127"></path>' + '  </svg>' + '</span>' + '<span>语音播报</span>'; // //自定义语音唤起
              // document.getElementById("voice-custom").onclick = function(){
              //   console.log("显示自定义语音");
              // }

              stopBroadcastDOM.onclick = function () {
                this.setAttribute("class", "broadcast on hide");
                startBroadcastDOM.setAttribute("class", "broadcast off");
              };

              footerContainer.appendChild(startBroadcastDOM);
              footerContainer.appendChild(stopBroadcastDOM); // 召唤自定义语言

              document.getElementById("voice-custom").onclick = function () {
                console.log("显示自定义语音");
                startSpeakDOM.setAttribute('class', 'speak off');
              }; // 获取语音列表


              fetchVoiceList(0);

              function fetchVoiceList(page) {
                function apiSuccess(data) {
                  console.log("data", data);

                  if (data.code == 200) {
                    randerVoliceList(data.data);
                    EZUIKit.state.page = data.page.page; // 如果用户语音列表为空

                    if (page == 0 && data.data.length == 0 && !EZUIKit.state.fetchDefaultList) {
                      // 获取用户语音为空
                      EZUIKit.state.fetchDefaultList = true;
                      fetchVoiceList(0);
                    }
                  }
                }

                request( domain + '/api/lapp/voice/query', 'POST', {
                  accessToken: _this.opt.accessToken,
                  pageStart: page,
                  pageSize: EZUIKit.state.pageSize,
                  default: EZUIKit.state.fetchDefaultList ? 'true' : 'false'
                }, '', apiSuccess);
              }

              function randerVoliceList(data) {
                console.log("renderVoliceList", data);

                if (data && data.length > 0) {
                  for (var i = 0; i < data.length; i++) {
                    var voiceItem = document.createElement('li');
                    voiceItem.innerHTML = "<li class='voice-item' id='voice-item-" + i + "' data-time=" + (data[i]["duration"] || 20) + " data-url=" + data[i]["fileUrl"] + ">" + (data[i]["voiceName"].length > 10 ? data[i]["voiceName"].substr(0, 10) + "..." : data[i]["voiceName"]) + "</li>";
                    document.getElementsByClassName('voice-list-ul')[0].append(voiceItem); // "<li class='voice-item' id='voice-item-" + i + "' data-time=" + (data[i]["duration"] || 20) + " data-url=" + data[i]["fileUrl"] + ">" + (data[i]["voiceName"].length > 10 ? (data[i]["voiceName"].substr(0, 10) + "...") : data[i]["voiceName"]) + "</li>";
                    // $("#voice-list ul").append("<li class='voice-item' id='voice-item-" + i + "' data-time=" + (data[i]["duration"] || 20) + " data-url=" + data[i]["fileUrl"] + ">" + (data[i]["voiceName"].length > 10 ? (data[i]["voiceName"].substr(0, 10) + "...") : data[i]["voiceName"]) + "</li>");

                    voiceItem.onclick = function (e) {
                      console.log("点击元素", e.target, e.target.dataset.url);
                      var voiceUrl = e.target.dataset.url;
                      var time = e.target.dataset.time;
                      playListOfVoice(voiceUrl, time);
                    };
                  }

                  if (data.length === EZUIKit.state.pageSize) {
                    document.getElementById('voice-list-end').innerHTML = "向下滚动加载更多";
                  } else {
                    document.getElementById('voice-list-end').innerHTML = "没有更多数据了";
                  }
                }
              }

              function playListOfVoice(voiceUrl, time) {
                console.log("播放语音", voiceUrl, time); // decoder && decoder.closeSound(0);

                function apiSuccess(data) {
                  console.log("data.data", data.data);

                  if (data.code == 200) {
                    // $("#startBroadcast").show();
                    // $("#stopBroadcast").hide();
                    countTime('sub', parseInt(time));
                  } else if (data.code == "10001") {
                    window.layer.msg("未找到当前语音");
                  } else {
                    window.layer.msg(data.msg || '发送失败，请稍后再试');
                  } // padding = false;

                }

                request( domain + '/api/lapp/voice/send', 'POST', {
                  accessToken: _this.opt.accessToken,
                  deviceSerial: _this.opt.deviceSerial,
                  channelNo: _this.opt.channelNo,
                  fileUrl: voiceUrl
                }, '', apiSuccess);
              } // 自定义语音
              // 对讲


              var startSpeakDOM = document.createElement('div');
              var stopSpeakDOM = document.createElement('div');
              startSpeakDOM.setAttribute('class', 'speak off hide');
              stopSpeakDOM.setAttribute('class', 'speak on hide');
              startSpeakDOM.setAttribute('id', 'startSpeak');
              stopSpeakDOM.setAttribute('id', 'stopSpeak');
              startSpeakDOM.innerHTML = '<span title="按住说话">' + '  <svg t="1581994757678" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"' + '    p-id="1639" width="16" height="16">' + '    <path' + '      d="M757.059829 393.846154v-52.512821h262.564103v52.512821H757.059829z m-420.102564 481.367521v96.273504h175.042735a8.752137 8.752137 0 0 1 8.752137 8.752137v35.008547a8.752137 8.752137 0 0 1-8.752137 8.752137H109.401709a8.752137 8.752137 0 0 1-8.752136-8.752137v-35.008547a8.752137 8.752137 0 0 1 8.752136-8.752137h175.042735v-96.273504C129.767932 875.213675 4.376068 749.821812 4.376068 595.145299V463.863248a26.25641 26.25641 0 1 1 52.512821 0v113.777778c0 140.174222 113.637744 253.811966 253.811966 253.811965s253.811966-113.637744 253.811966-253.811965V463.863248a26.25641 26.25641 0 1 1 52.51282 0v131.282051c0 154.676513-125.391863 280.068376-280.068376 280.068376z m-26.25641-96.273504c-111.178393 0-201.299145-90.120752-201.299146-201.299145V201.299145C109.401709 90.120752 199.522462 0 310.700855 0s201.299145 90.120752 201.299145 201.299145v376.341881c0 111.178393-90.120752 201.299145-201.299145 201.299145z m691.418803-280.068376H757.059829v-52.512821h245.059829v52.512821z m-17.504273 105.025641H757.059829v-52.512821h227.555556v52.512821z m-17.504274 105.025641H757.059829v-52.512821h210.051282v52.512821z m-8.752137 105.025641H757.059829v-52.512821h201.299145v52.512821z m-17.504273 105.025641H757.059829v-52.512821h183.794872v52.512821z m-26.25641 105.025641H757.059829v-52.512821h157.538462v52.512821z"' + '      p-id="1640" fill="#ffffff"></path>' + '  </svg>' + '</span>' + '<span>按住说话</span>';
              stopSpeakDOM.innerHTML = '<span title="按住说话">' + '<svg t="1581994757678" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"' + '  p-id="1639" width="16" height="16">' + '  <path' + '    d="M757.059829 393.846154v-52.512821h262.564103v52.512821H757.059829z m-420.102564 481.367521v96.273504h175.042735a8.752137 8.752137 0 0 1 8.752137 8.752137v35.008547a8.752137 8.752137 0 0 1-8.752137 8.752137H109.401709a8.752137 8.752137 0 0 1-8.752136-8.752137v-35.008547a8.752137 8.752137 0 0 1 8.752136-8.752137h175.042735v-96.273504C129.767932 875.213675 4.376068 749.821812 4.376068 595.145299V463.863248a26.25641 26.25641 0 1 1 52.512821 0v113.777778c0 140.174222 113.637744 253.811966 253.811966 253.811965s253.811966-113.637744 253.811966-253.811965V463.863248a26.25641 26.25641 0 1 1 52.51282 0v131.282051c0 154.676513-125.391863 280.068376-280.068376 280.068376z m-26.25641-96.273504c-111.178393 0-201.299145-90.120752-201.299146-201.299145V201.299145C109.401709 90.120752 199.522462 0 310.700855 0s201.299145 90.120752 201.299145 201.299145v376.341881c0 111.178393-90.120752 201.299145-201.299145 201.299145z m691.418803-280.068376H757.059829v-52.512821h245.059829v52.512821z m-17.504273 105.025641H757.059829v-52.512821h227.555556v52.512821z m-17.504274 105.025641H757.059829v-52.512821h210.051282v52.512821z m-8.752137 105.025641H757.059829v-52.512821h201.299145v52.512821z m-17.504273 105.025641H757.059829v-52.512821h183.794872v52.512821z m-26.25641 105.025641H757.059829v-52.512821h157.538462v52.512821z"' + '    p-id="1640" fill="#ff0000"></path>' + '</svg>' + '</span>' + '<span>松开发送</span>';
              footerContainer.appendChild(startSpeakDOM);
              footerContainer.appendChild(stopSpeakDOM);

              document.getElementById("voice-list").onscroll = function (e) {
                var sum = this.scrollHeight;
                console.log("sum", sum, this.scrollTop, document.getElementById("voice-list").clientHeight);

                if (sum <= this.scrollTop + this.clientHeight) {
                  console.log("拖动到底，执行加载", EZUIKit.state.page);
                  fetchVoiceList(++EZUIKit.state.page);
                }
              }; // $("#voice-list").unbind("scroll").bind("scroll", function (e) {
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
              footerContainer.appendChild(timeAreaDOM); // 按住说话

              var recorder;

              document.getElementById('startSpeak').onmousedown = function () {
                if (EZUIKit.state.countTimer) {
                  window.layer.msg("语音设备正忙，请稍后重试");
                  return false;
                }

                console.log("按住说话");
                startSpeakDOM.setAttribute('class', 'speak off hide');
                stopSpeakDOM.setAttribute('class', 'speak on'); // console.log("startRecording",startRecording);
                // startRecording();

                voiceInit();
                countTime('add', 0);
                setTimeout(function () {
                  EZUIKit.state.recodeTime = 0;
                  startRecording();
                }, 1000);

                if (EZUIKit.state.recodeTimer) {
                  // 先清空计数器
                  clearInterval(EZUIKit.state.recodeTimer);
                }

                EZUIKit.state.recodeTimer = setInterval(function () {
                  if (EZUIKit.state.recodeTime >= 59) {
                    _this.stopTalk();

                    countTime('destory', 0);
                    this.setAttribute("class", "ptp-talk on hide");
                    startTalkDOM.setAttribute("class", "ptp-talk off");
                    window.layer.msg("不超过1分钟");
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

                function voiceInit() {
                  console.log("run init");

                  try {
                    // webkit shim
                    window.AudioContext = window.AudioContext || window.webkitAudioContext;
                    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
                    window.URL = window.URL || window.webkitURL;
                    audio_context = new AudioContext();
                    console.log('Audio context set up.');
                    console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
                  } catch (e) {
                    console.log("err", e);
                    window.layer.msg('No web audio support in this browser!');
                  }

                  navigator.getUserMedia({
                    audio: true
                  }, startUserMedia, function (e) {
                    console.log('No live audio input: ' + e);
                  });
                }
              }; // 松开发送


              document.getElementById('stopSpeak').onmouseup = function () {
                console.log("松开发送");
                stopSpeakDOM.setAttribute('class', 'speak on hide');
                stopSpeakFun();

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
                    recorder && recorder.stop(); // createAudioDom();

                    recorder && recorder.exportWAV(function (wav_file) {
                      console.log("wav_file", wav_file);

                      if (wav_file.size < 1000) {
                        window.layer.msg("录音失败，请重试"); // recodeTime = 0;

                        EZUIKit.state.recodeTime = 0;
                        return false;
                      } // 测试


                      countTime('sub', EZUIKit.state.recodeTime + 2); // 延时

                      var formdata = new FormData(); // form 表单 {key:value}

                      formdata.append("voiceFile", wav_file); // form input type="file"

                      formdata.append("accessToken", _this.opt.accessToken);
                      formdata.append("deviceSerial", _this.opt.deviceSerial);
                      formdata.append("channelNo", _this.opt.channelNo); // padding = true;

                      function apiSuccess(data) {
                        console.log("data.data", data.data);

                        if (data.code == 200) {
                          // $("#startBroadcast").show();
                          // $("#stopBroadcast").hide();
                          countTime('sub', EZUIKit.state.recodeTime + 2);
                        } else if (data.code == "10001") {
                          window.layer.msg("未找到当前语音");
                        } else {
                          window.layer.msg(data.msg || '发送失败，请稍后再试');
                        } // padding = false;

                      }

                      function apiError(err) {
                        console.log("err", err);
                      }

                      request(domain + '/api/lapp/voice/sendonce', 'POST', {
                        voiceFile: wav_file,
                        accessToken: _this.opt.accessToken,
                        deviceSerial: _this.opt.deviceSerial,
                        channelNo: _this.opt.channelNo
                      }, '', apiSuccess, apiError);
                    });
                    recorder && recorder.clear();
                  } catch (err) {
                    console.log(err);
                  }
                }
              };
            }
            /* 时间计数 */


            function countTime(type, start) {
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
                    console.log("倒计时结束，开启声音"); // decoder.openSound(0);
                  }
                }, 1000);
              } else if (type === 'destory') {
                clearInterval(EZUIKit.state.countTimer);
                EZUIKit.state.countTimer = undefined;
                document.getElementById("time-area").innerHTML = '00:00';
              } //将秒数转换为时分秒格式


              function formatSeconds(value) {
                var theTime = parseInt(value); // 秒

                var middle = 0; // 分

                var hour = 0; // 小时

                var secondV = '00';
                var minV = '00';
                var hourV = '00';

                if (theTime > 59) {
                  middle = parseInt(theTime / 60);
                  theTime = parseInt(theTime % 60);

                  if (middle > 59) {
                    hour = parseInt(middle / 60);
                    middle = parseInt(middle % 60);
                  }
                }

                secondV = parseInt(theTime) > 9 ? parseInt(theTime) : '0' + parseInt(theTime);
                minV = parseInt(middle) > 9 ? parseInt(middle) : '0' + parseInt(middle);
                hourV = parseInt(hour) > 9 ? parseInt(hour) : '0' + parseInt(hour);

                if (hour > 0) {
                  return hourV + ':' + minV + ':' + secondV;
                } else if (middle > 0) {
                  return minV + ':' + secondV;
                } else {
                  return '00:' + secondV;
                }
              }
            }
          }
        }
      });
    });
    // iframe 传递数据

    var _this = this;
    window.addEventListener("message", function (event) {
      event.origin;
      var id = _this.opt.id;
      if (event.data.type) {
        switch (event.data.type) {
          case 'openSound':
            if (id == event.data.id && params.openSoundCallBack) {
              params.openSoundCallBack(event.data);
            }

            break;

          case 'closeSound':
            if (id == event.data.id && params.closeSoundCallBack) {
              params.closeSoundCallBack(event.data);
            }

            break;

          case 'capturePicture':
            if (id == event.data.id && params.capturePictureCallBack) {
              params.capturePictureCallBack(event.data);
            }

            break;

          case 'startSave':
            if (id == event.data.id && params.startSaveCallBack) {
              params.startSaveCallBack(event.data);
            }

            break;

          case 'stopSave':
            if (id == event.data.id && params.stopSaveCallBack) {
              params.stopSaveCallBack(event.data);
            }

            break;

          case 'fullScreen':
            if (id == event.data.id && params.fullScreenCallBack) {
              params.fullScreenCallBack(event.data);
            }

            break;
          case 'getOSDTime':
            if (id == event.data.id && params.getOSDTimeCallBack) {
              params.getOSDTimeCallBack(event.data);
            }

            break;

          case 'handleSuccess':
            if (id == event.data.id && params.handleSuccess) {
              params.handleSuccess(event.data);
            }
            break;

          case 'handleError':
            if (id == event.data.id && params.handleError) {
              params.handleError(event.data);
            }
            break;
          case 'dblclick':
            if (id == event.data.id && _this.opt.bSupporDoubleClickFull) {
              if(_this.opt.fullScreenStatus === 0){
                _this.fullScreen();
              } else {
                _this.cancelFullScreen();
              }
            }
            break;
            case 'startTalk':
                _this.startTalk();
                // params.startTalk();
                _this.closeSound();
              break;
              case 'stopTalk':
                // window.stopTalk()
                _this.stopTalk();
                _this.openSound();
                break;
              case 'clickEventHandle':
                console.log("event.data",event.data);
                if(params.clickEventHandle) {
                  params.clickEventHandle(event.data);
                }
                break;
              case 'removeEventHandle':
                if(params.removeEventHandle) {
                  params.removeEventHandle(event.data);
                }
              break;
              case 'esc':
                if(params.clickEventHandle) {
                  params.clickEventHandle(event.data);
                }
              break;
        }
      }
    });
    // 全屏变化回调
    function fullscreenchange(data) {
      _this.opt.fullScreenStatus = data ? 1 : 0;
      if (params.fullScreenChangeCallBack) {
        params.fullScreenChangeCallBack({data:data,id: _this.opt.id});
      }
    }
    if (typeof document.fullScreen !== "undefined") {
      document.addEventListener("fullscreenchange", function() {
        var e = document.fullscreen || false;
        fullscreenchange(e);
      });
    } else if (typeof document.webkitIsFullScreen !== "undefined") {
      document.addEventListener("webkitfullscreenchange", function() {
        var e = document.webkitIsFullScreen || false;
        fullscreenchange(e);
      });
    } else if (typeof document.mozFullScreen !== "undefined") {
      document.addEventListener("mozfullscreenchange", function() {
        var e = document.mozFullScreen || false;
        fullscreenchange(e);
      });
    }
  }; // 播放相关API


  EZUIKitPlayer.prototype.play = function (data) {
    var id = 'EZUIKitPlayer-' + this.opt.id;
    var player = document.getElementById(id).contentWindow;

    if (typeof data === 'object' && data.url) {
      this.opt.url = data.url;
    }

    if (typeof data === 'object' && data.accessToken) {
      this.opt.accessToken = data.accessToken;
    }

    if (typeof data === 'string') {
      this.opt.url = data;
    }
    player.postMessage({
      action: "play",
      accessToken: this.opt.accessToken,
      url: this.opt.url
    }, domain + "/ezopen/h5/iframe");
    var _this = this;
    this.opt.videoLoading = true;
    var promise = new Promise(function(resolve,reject) {
      window.addEventListener("message", function (event) {
        var playId = _this.opt.id;
        if (playId == event.data.id && event.data.type === 'handleSuccess') {
          setTimeout(()=>{
            _this.opt.videoLoading = false;
          },1000);
          resolve(event.data);
        }
      });
    });
    return promise;
  };

  EZUIKitPlayer.prototype.stop = function () {
    var id = 'EZUIKitPlayer-' + this.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage("stop", domain + "/ezopen/h5/iframe");
    var _this = this;
    var promise = new Promise(function(resolve,reject) {
      window.addEventListener("message", function (event) {
        var playId = _this.opt.id;
        if (playId == event.data.id && event.data.type === 'stop') {
          resolve(event.data);
        }
      });
    });
    return promise;
  };

  EZUIKitPlayer.prototype.openSound = function () {
    var id = 'EZUIKitPlayer-' + this.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage("openSound", domain + "/ezopen/h5/iframe");
    var _this = this;
    var promise = new Promise(function(resolve,reject) {
      window.addEventListener("message", function (event) {
        var playId = _this.opt.id;
        if (playId == event.data.id && event.data.type === 'openSound') {
          resolve(event.data);
        }
      });
    });
    return promise;
  };

  EZUIKitPlayer.prototype.closeSound = function () {
    var id = 'EZUIKitPlayer-' + this.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage("closeSound", domain + "/ezopen/h5/iframe");
    var _this = this;
    var promise = new Promise(function(resolve,reject) {
      window.addEventListener("message", function (event) {
        var playId = _this.opt.id;
        if (playId == event.data.id && event.data.type === 'closeSound') {
          resolve(event.data);
        }
      });
    });
    return promise;
  };

  EZUIKitPlayer.prototype.startSave = function (fileName) {
    var id = 'EZUIKitPlayer-' + this.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage({
      action: "startSave",
      fileName: fileName || 'default'
    }, domain + "/ezopen/h5/iframe");
    var _this = this;
    var promise = new Promise(function(resolve,reject) {
      window.addEventListener("message", function (event) {
        var playId = _this.opt.id;
        if (playId == event.data.id && event.data.type === 'startSave') {
          resolve(event.data);
        }
      });
    });
    return promise;
  };

  EZUIKitPlayer.prototype.stopSave = function () {
    var id = 'EZUIKitPlayer-' + this.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage("stopSave", domain + "/ezopen/h5/iframe");
    var _this = this;
    var promise = new Promise(function(resolve,reject) {
      window.addEventListener("message", function (event) {
        var playId = _this.opt.id;
        if (playId == event.data.id && event.data.type === 'stopSave') {
          resolve(event.data);
        }
      });
    });
    return promise;
  };

  EZUIKitPlayer.prototype.fullScreen = function () {
    if(this.opt.fullScreenStatus === 1){
      return false
    }
    var id = 'EZUIKitPlayer-' + this.opt.id;
    var player = document.getElementById(id).contentWindow;
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
      // console.log('移动端全屏');
      var width = document.documentElement.clientWidth;
      var height = document.documentElement.clientHeight;
      // wrapper = document.getElementById("test"),
      var wrapper = document.body;//document.body 属性返回 <body> 元素， document.documentElement 属性返回 <html> 元素。
      wrapper =document.getElementById(id);
      var style = "";
      style += "width:" + height + "px;";// 注意旋转后的宽高切换
      style += "height:" + width + "px;";
      style += "-webkit-transform: rotate(90deg); transform: rotate(90deg);";
      // 注意旋转中点的处理
      style += "-webkit-transform-origin: " + width / 2 + "px " + width / 2 + "px;";
      style += "transform-origin: " + width / 2 + "px " + width / 2 + "px;";
      style += 'position: fixed;top: 0;left: 0;z-index:10';
      wrapper.style.cssText = style;
      // var cancelFullDOM = document.createElement('div');
      // cancelFullDOM.id = id + "cancel-full-screen"
      // var cancelFullDOMStyle="width:30px;height:"+height+"px;z-index:1000;position:fixed;top:0px;right:0px;";
      // cancelFullDOMStyle += "background-image: url(https://resource.ys7cloud.com/group1/M00/00/7E/CtwQE1-01qeAH2wAAAABOliqQ5g167.png);"
      // cancelFullDOMStyle += "background-size: contain;background-repeat:no-repeat;background-color:rgba(0,0,0,0.2)"
      // cancelFullDOM.style = cancelFullDOMStyle;
      // cancelFullDOM.onclick = function(){
      //   _this.cancelFullScreen();
      // }
      // document.body.appendChild(cancelFullDOM);
      setTimeout(function () {
        player.postMessage('autoResize', domain + "/ezopen/h5/iframe");
      }, 500);

    } else {
        // console.log('pc端全屏');
        var requestFullScreen = function (element) {
          var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
          if (requestMethod) {
            requestMethod.call(element);
          } else if (typeof window.ActiveXObject !== "undefined") {
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
              wscript.SendKeys("{F11}");
            }
          }
        };
        requestFullScreen(document.getElementById(id));
    }
    if (this.params.fullScreenCallBack) {
      this.params.fullScreenCallBack(this.opt.id);
    }
    this.opt.fullScreenStatus = 1;
  };
  EZUIKitPlayer.prototype.cancelFullScreen = function () {
    if(this.opt.fullScreenStatus === 0){
      return false
    }
    var id = 'EZUIKitPlayer-' + this.opt.id;
    var player = document.getElementById(id).contentWindow;
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
      var width = document.getElementById(id).width;
      var height = document.getElementById(id).height;
      // wrapper = document.getElementById("test"),
      var wrapper = document.body;//document.body 属性返回 <body> 元素， document.documentElement 属性返回 <html> 元素。
      wrapper =document.getElementById(id);
      var style = "";
      style += "width:" + width + "px;";
      style += "height:" + height + "px;";
      style += "-webkit-transform: rotate(0); transform: rotate(0);";
      style += "-webkit-transform-origin: 0 0;";
      style += "transform-origin: 0 0;";
      wrapper.style.cssText = style;
      setTimeout(function () {
        player.postMessage("autoResize",  domain + "/ezopen/h5/iframe");
      }, 500);
      var cancelFullDOMId = id + "cancel-full-screen";
      var cancelFullDOM = document.getElementById(cancelFullDOMId);
      if(cancelFullDOM){
        document.body.removeChild(cancelFullDOM);
      }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
    }
    if (this.params.cancelFullScreenCallBack) {
      this.params.cancelFullScreenCallBack(this.opt.id);
    }
    this.opt.fullScreenStatus = 0;
  };

  EZUIKitPlayer.prototype.capturePicture = function (fileName,isUndownload) {
    var id = 'EZUIKitPlayer-' + this.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage({
      action: "capturePicture",
      fileName: fileName || 'default',
      isUndownload: isUndownload,
    }, domain + "/ezopen/h5/iframe");
    var _this = this;
    var promise = new Promise(function(resolve,reject) {
      window.addEventListener("message", function (event) {
        var playId = _this.opt.id;
        if (playId == event.data.id && event.data.type === 'capturePicture') {
          resolve(event.data);
        }
      });
    });
    return promise;
  };

  EZUIKitPlayer.prototype.enableZoom = function () {
    var id = 'EZUIKitPlayer-' + this.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage("enableZoom", domain + "/ezopen/h5/iframe");
  };

  EZUIKitPlayer.prototype.closeZoom = function () {
    var id = 'EZUIKitPlayer-' + this.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage("closeZoom", domain + "/ezopen/h5/iframe");
  };

  EZUIKitPlayer.prototype.getOSDTime = function () {
    var id = 'EZUIKitPlayer-' + this.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage("getOSDTime", domain + "/ezopen/h5/iframe");
    var _this = this;
    var promise = new Promise(function(resolve,reject) {
      window.addEventListener("message", function (event) {
        var playId = _this.opt.id;
        if (playId == event.data.id && event.data.type === 'getOSDTime') {
          resolve(event.data);
        }
      });
    });
    return promise;
  };

  EZUIKitPlayer.prototype.autoResize = function () {
    var id = 'EZUIKitPlayer-' + this.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage("autoResize", domain + "/ezopen/h5/iframe");
  };

  EZUIKitPlayer.prototype.reSize = function (width,height) {
    var id = 'EZUIKitPlayer-' + this.opt.id;
    var player = document.getElementById(id).contentWindow;
    var containerDOM = document.getElementById(this.opt.id);
    containerDOM.style.width = width + 'px';
    containerDOM.style.height = height +  'px';
    document.getElementById(this.opt.id).style.width = width + 'px';
    document.getElementById(this.opt.id).style.height =  height +  'px';

    var playDOM  = document.getElementById(id);
    playDOM.setAttribute("width",width);
    playDOM.setAttribute("height",height);
    playDOM.style.width = width + 'px';
    playDOM.style.height = height +  'px';
    setTimeout(function(){
      player.postMessage({
        action: 'autoResize',
      }, domain + "/ezopen/h5/iframe");
    },500);
  };

  EZUIKitPlayer.prototype.startTalk = function () {
    console.log("执行开始对讲");
    console.log(this.opt);
    var _this = this;
    EZUIKit.opt = this.opt;
    if(window.EZUIKit) {
      window.EZUIKit.opt = this.opt;
    }
    var apiSuccess = function(data) {
      if (data.code == 200) {
        var apiResult = data.data;
        if (apiResult) {
          // 临时将https转换为websocket
          var rtcTrunk = apiResult.rtcUrl;
          if (rtcTrunk.indexOf("ws") === -1) {
            rtcTrunk = rtcTrunk.replace("https", "wss").replace("rtcgw", "rtcgw-ws");
          }
          _this.opt.rtcUrl = rtcTrunk;
          _this.opt.ttsUrl = "tts://" + apiResult.ttsUrl;
          var talk = "talk://" + _this.opt.deviceSerial + ":0:" + _this.opt.channelNo + ":cas.ys7.com:6500";
          _this.opt.talkLink = _this.opt.ttsUrl + "/" + talk;
          _this.opt.stream = apiResult.stream;
          window.startTalk();
        }
      }
    };
    request(_this.opt.apiDomain, 'POST', {
      accessToken: _this.opt.accessToken,
      deviceSerial: _this.opt.deviceSerial,
      channelNo: _this.opt.channelNo
    }, '', apiSuccess);
  };

  EZUIKitPlayer.prototype.stopTalk = function () {
    console.log("执行结束对讲");
    window.stopTalk();
  };
  EZUIKitPlayer.prototype.edit = function () {
    var id = 'EZUIKitPlayer-' + this.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage("edit", domain + "/ezopen/h5/iframe");
  };
  EZUIKitPlayer.prototype.btnReRender = function (data) {
    var id = 'EZUIKitPlayer-' + this.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage({action: "btnReRender",data: data}, domain + "/ezopen/h5/iframe");
  };
  EZUIKitPlayer.prototype.changePlayUrl = function (data) {
    var id = 'EZUIKitPlayer-' + this.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage({action: "changePlayUrl",data: data}, domain + "/ezopen/h5/iframe");
  };
  EZUIKitPlayer.prototype.fetchThemeData = function () {
    var id = 'EZUIKitPlayer-' + this.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage({action: "fetchThemeData"}, domain + "/ezopen/h5/iframe");
  };
  EZUIKitPlayer.prototype.setThemeData = function (accessToken, header, footer) {
    var id = 'EZUIKitPlayer-' + this.opt.id;
    var player = document.getElementById(id).contentWindow;
    player.postMessage({action: "setThemeData",data:{accessToken, header, footer}}, domain + "/ezopen/h5/iframe");
  };
  /**
   * 视频播放器-结束
   */


   EZUIKit.EZUIKitPlayer = EZUIKitPlayer;
   window.EZUIKitV3 = EZUIKit;
   
   const EZUIKitV3 = EZUIKit;

  return EZUIKitV3;
});
var EZUIKitV3$1 = EZUIKitV3;

/**
 * Created by wangweijie5 on 2016/12/16.
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __instance = function () {
    var instance = void 0;
    return function (newInstance) {
        if (newInstance) instance = newInstance;
        return instance;
    };
}();

(function () {
    function AudioRenderer() {
        _classCallCheck(this, AudioRenderer);

        if (__instance()) return __instance();

        // 确保只有单例
        if (AudioRenderer.unique !== undefined) {
            return AudioRenderer.unique;
        }

        AudioRenderer.unique = this;

        this.oAudioContext = null;
        this.currentVolume = 0.8; // 初始音量
        this.bSetVolume = false;
        this.gainNode = null;
        this.iWndNum = -1; // 窗口号
        this.mVolumes = new Map(); // 用于存储所有音量

        // Init AudioContext
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        this.oAudioContext = new AudioContext();

        this.writeString = function (view, offset, string) {
            for (var i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        this.setBufferToDataview = function (output, offset, input) {
            for (var i = 0; i < input.length; i++, offset++) {
                output.setUint8(offset, input[i]);
            }
        };

        __instance(this);
    }

    /**
     * @synopsis 音频播放
     *
     *  @param dataBuf [IN] 音频缓存
     *  @param dataLen [IN] 缓存长度
     *  @param audioInfo [IN] 音频参数
     *
     * @returns 状态码
     */


    _createClass(AudioRenderer, [{
        key: 'Play',
        value: function Play(dataBuf, dataLen, audioInfo) {
            var bufferData = new ArrayBuffer(44 + dataLen);
            var viewTalk = new DataView(bufferData);
            var sampleRates = audioInfo.samplesPerSec;
            var channels = audioInfo.channels;
            var bitsPerSample = audioInfo.bitsPerSample;

            //console.log("audiorender sampleRates"+sampleRates+"channels:"+channels+"bitsPerSample:"+bitsPerSample);

            /* RIFF identifier */
            this.writeString(viewTalk, 0, 'RIFF');
            /* file length */
            viewTalk.setUint32(4, 32 + dataLen * 2, true);
            /* RIFF type */
            this.writeString(viewTalk, 8, 'WAVE');
            /* format chunk identifier */
            this.writeString(viewTalk, 12, 'fmt ');
            /* format chunk length */
            viewTalk.setUint32(16, 16, true);
            /* sample format (raw) */
            viewTalk.setUint16(20, 1, true);
            /* channel count */
            viewTalk.setUint16(22, channels, true);
            /* sample rate */
            viewTalk.setUint32(24, sampleRates, true);
            /* byte rate (sample rate * block align) */
            viewTalk.setUint32(28, sampleRates * 2, true);
            /* block align (channel count * bytes per sample)/8 */
            viewTalk.setUint16(32, channels * bitsPerSample / 8, true);
            /* bits per sample */
            viewTalk.setUint16(34, bitsPerSample, true);
            /* data chunk identifier */
            this.writeString(viewTalk, 36, 'data');
            /* data chunk length */
            viewTalk.setUint32(40, dataLen, true);
            this.setBufferToDataview(viewTalk, 44, dataBuf);

            var self = this;
            this.oAudioContext.decodeAudioData(viewTalk.buffer, function (buffer) {

                var bufferSource = self.oAudioContext.createBufferSource();
                if (bufferSource == null) {
                    return -1;
                }

                bufferSource.buffer = buffer;
                bufferSource.start(0);

                if (self.gainNode == null || self.bSetVolume) {
                    self.gainNode = self.oAudioContext.createGain();
                    // self.gainNode.gain.value = self.currentVolume;
                    // // self.currentVolume = self.gainNode.gain.value;
                    // self.gainNode.connect(self.oAudioContext.destination);

                    self.bSetVolume = false;
                }

                self.gainNode.gain.value = self.currentVolume;
                // self.currentVolume = self.gainNode.gain.value;
                self.gainNode.connect(self.oAudioContext.destination);

                bufferSource.connect(self.gainNode);
            }, function (e) {
                console.log("decode error");
                return -1;
            });

            return 0;
        }

        /**
         * @synopsis 停止播放
         *
         * @returns 返回音量
         */

    }, {
        key: 'Stop',
        value: function Stop() {
            if (this.gainNode != null) {
                this.gainNode.disconnect();
                this.gainNode = null;
            }

            // this.oAudioContext.close();

            // AudioRenderer.unique = undefined;
            // __instance() = null;
            return true;
        }

        /**
         * @synopsis 设置音量
         *
         *  @param iVolume [IN] 音量
         *
         * @returns 状态码
         */

    }, {
        key: 'SetVolume',
        value: function SetVolume(iVolume) {
            this.bSetVolume = true;
            this.currentVolume = iVolume;

            // 储存当前窗口设置音量值
            this.mVolumes.set(this.iWndNum, iVolume);
            return true;
        }

        /**
         * @synopsis 设置窗口号
         *
         *  @param iWndNum [IN] 窗口号
         *
         * @returns 状态码
         */

    }, {
        key: 'SetWndNum',
        value: function SetWndNum(iWndNum) {
            this.iWndNum = iWndNum;

            // 获取当前窗口设置音量值
            var iVolume = this.mVolumes.get(iWndNum);
            if (iVolume == undefined) {
                iVolume = 0.8; // 默认音量
            }
            this.currentVolume = iVolume;

            return true;
        }

        /**
         * @synopsis 获取音量
         *
         * @returns 返回音量
         */

    }, {
        key: 'GetVolume',
        value: function GetVolume() {
            // 获取当前窗口设置音量值
            var iVolume = this.mVolumes.get(this.iWndNum);
            if (iVolume == undefined) {
                iVolume = 0.8; // 默认音量
            }

            return iVolume;
        }
    }]);
window.AudioRenderer = AudioRenderer;
    return AudioRenderer;
})();

//顶点着色器
//attribute修饰符用于声明由浏览器（javascript）传输给顶点着色器的变量值；
// vertexPos即我们定义的顶点坐标；
// gl_Position是一个内建的传出变量。
var vertexYUVShader = [
    'attribute vec4 vertexPos;',
    'attribute vec2 texturePos;',
    'varying vec2 textureCoord;',

    'void main()',
    '{',
        'gl_Position = vertexPos;',
        'textureCoord = texturePos;',
    '}'
    ].join('\n');
    //像素着色器(yuv->rgb)
var fragmentYUVShader = [
    'precision highp float;',
    'varying highp vec2 textureCoord;',
    'uniform sampler2D ySampler;',
    'uniform sampler2D uSampler;',
    'uniform sampler2D vSampler;',
    'const mat4 YUV2RGB = mat4',
    '(',
        '1.1643828125, 0, 1.59602734375, -.87078515625,',
        '1.1643828125, -.39176171875, -.81296875, .52959375,',
        '1.1643828125, 2.017234375, 0, -1.081390625,',
        '0, 0, 0, 1',
    ');',
  
    'void main(void) {',
        'highp float y = texture2D(ySampler,  textureCoord).r;',
        'highp float u = texture2D(uSampler,  textureCoord).r;',
        'highp float v = texture2D(vSampler,  textureCoord).r;',
        'gl_FragColor = vec4(y, u, v, 1) * YUV2RGB;',
    '}'
    ].join('\n');

(function (root, factory) {
    // root.SuperRender = factory();
    window.SuperRender = factory();
}(undefined, function () {
    
    function RenderManager(canvas) {

        this.canvasElement = document.getElementById(canvas);

        this.initContextGL();

        if(this.contextGL) {
            this.YUVProgram = this.initProgram(vertexYUVShader, fragmentYUVShader);
            this.initBuffers();
            this.initTextures();
        }
    }
    /**
     * 初始化WebGL上下文
     */
    RenderManager.prototype.initContextGL = function() {
        
        var canvas = this.canvasElement;

        var gl = null;

        try {
            gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        } catch (e) {
            gl = null;
        }

        if(!gl || typeof gl.getParameter !== "function") {
            gl = null;
        }

        this.contextGL = gl;

        console.log("WebGL1.0");
    };

    /**
     * 初始化着色器程序
     * @param vertexShaderScript    顶点着色器脚本
     * @param fragmentShaderScript  片段着色器脚本
     */
    RenderManager.prototype.initProgram = function(vertexShaderScript, fragmentShaderScript) {
        
        var gl = this.contextGL;
        
        var vertexShader = gl.createShader(gl.VERTEX_SHADER); //创建定点着色器
        gl.shaderSource(vertexShader, vertexShaderScript);
        gl.compileShader(vertexShader);
        if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.log('Vertex shader failed to compile: ' + gl.getShaderInfoLog(vertexShader));
        }

        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderScript);
        gl.compileShader(fragmentShader);
        if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.log('Fragment shader failed to compile: ' + gl.getShaderInfoLog(fragmentShader));
        }

        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.log('Program failed to compile: ' + gl.getProgramInfoLog(program));
        }
        
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        return program;
    };

    /**
     * 初始化数据缓存
     */
    RenderManager.prototype.initBuffers = function() {
        
        var gl = this.contextGL;
    
        var vertexPosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        var texturePosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texturePosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 0, 0, 0, 1, 1, 0, 1]), gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.vertexPosBuffer  = vertexPosBuffer;
        this.texturePosBuffer = texturePosBuffer;
    };

    /**
     * 创建纹理
     */
    RenderManager.prototype.initTexture = function() {

        var gl = this.contextGL;

        var textureRef = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, textureRef);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);

        return textureRef;
    };

    /**
     * 初始化YUV纹理
     */
    RenderManager.prototype.initTextures = function() {
        
        var gl = this.contextGL;
        
        var program = this.YUVProgram;
        gl.useProgram(program);
        
        var yTextureRef = this.initTexture();
        var ySamplerRef = gl.getUniformLocation(program, 'ySampler');
        gl.uniform1i(ySamplerRef, 0);
        this.yTextureRef = yTextureRef;

        var uTextureRef = this.initTexture();
        var uSamplerRef = gl.getUniformLocation(program, 'uSampler');
        gl.uniform1i(uSamplerRef, 1);
        this.uTextureRef = uTextureRef;

        var vTextureRef = this.initTexture();
        var vSamplerRef = gl.getUniformLocation(program, 'vSampler');
        gl.uniform1i(vSamplerRef, 2);
        this.vTextureRef = vTextureRef;
        
        gl.useProgram(null);
    };

    /**
     * 显示帧数据
     * @param nWidth    宽度
     * @param nHeight   高度
     * @param nHeight   帧数据
     */
    RenderManager.prototype.SR_DisplayFrameData = function(nWidth, nHeight, pData,dWidth,dHeight) {

        if(nWidth <= 0 || nHeight <= 0)
        {
            return;
        }

        var gl = this.contextGL;

        if(null == pData)
        {
            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            return;
        }

        var canvas = this.canvasElement;

        this.nWindowWidth = canvas.width;
        this.nWindowHeight = canvas.height;
        
        var nWindowWidth = this.nWindowWidth;
        var nWindowHeight = this.nWindowHeight;

        gl.clearColor(0.8, 0.8, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.viewport(0, 0, nWindowWidth, nWindowHeight);

        this.updateFrameData(nWidth, nHeight, pData,dWidth,dHeight);

        var program = this.YUVProgram;
        gl.useProgram(program);

        var vertexPosBuffer = this.vertexPosBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
        var vertexPosRef = gl.getAttribLocation(program, 'vertexPos');
        gl.enableVertexAttribArray(vertexPosRef);
        gl.vertexAttribPointer(vertexPosRef, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        var texturePosBuffer = this.texturePosBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, texturePosBuffer);
        var texturePosRef = gl.getAttribLocation(program, 'texturePos');
        gl.enableVertexAttribArray(texturePosRef);
        gl.vertexAttribPointer(texturePosRef, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); 

        gl.disableVertexAttribArray(vertexPosRef);
        gl.disableVertexAttribArray(texturePosRef);

        gl.useProgram(null);
    };

    /**
     * 上传YUV数据到纹理
     * @param nWidth    宽度
     * @param nHeight   高度
     * @param nHeight   帧数据
     */
    RenderManager.prototype.updateFrameData = function(width, height, data,dWidth,dHeight) {

        var gl = this.contextGL;

        var yTextureRef = this.yTextureRef;
        var uTextureRef = this.uTextureRef;
        var vTextureRef = this.vTextureRef;

        var i420Data = data;
        // debugger;
		if(width == dWidth && height == dHeight)
		{
			var yDataLength = width * height;
			var yData = i420Data.subarray(0, yDataLength);
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, yTextureRef);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width, height, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, yData);
			
			var cbDataLength = width/2 * height/2;
			var cbData = i420Data.subarray(width*height, width*height + cbDataLength);
			gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, uTextureRef);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width/2, height/2, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, cbData);
			
			var crDataLength = cbDataLength;
			var crData = i420Data.subarray(width*height + width*height/4, width*height + width*height/4 + crDataLength);
			gl.activeTexture(gl.TEXTURE2);
			gl.bindTexture(gl.TEXTURE_2D, vTextureRef);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width/2, height/2, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, crData);
			
		}
        else
		{
			 // //裁剪宽
			var yDataLength = dWidth * dHeight;
			var yData=new Uint8Array(yDataLength) ;
			for(var i=0;i<dHeight;i++)
			{
				//var ySonData=new Uint8Array(dWidth) ;
				var ySonData = i420Data.subarray(i*width, i*width+dWidth);
				for (var j = 0; j < dWidth; j++) {
					yData[i*dWidth + j] = ySonData[j];
				}
			}
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, yTextureRef);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, dWidth, dHeight, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, yData);
			yData=null;
			ySonData=null;

			var cbDataLength = dWidth/2 * dHeight/2;
			var cbData =new Uint8Array(cbDataLength);
			//var cbSonData=new Uint8Array(dWidth/2) ;
			for(var i=0;i<dHeight/2;i++)
			{
				 var cbSonData = i420Data.subarray(width*height+i*width/2, width*height+i*width/2+dWidth/2);
				for (var j = 0; j < dWidth/2; j++) {
					cbData[i*dWidth/2 + j] = cbSonData[j];
				}
			}
			gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, uTextureRef);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, dWidth/2, dHeight/2, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, cbData);
			cbData=null;
			cbSonData=null;

			var crDataLength = cbDataLength;
			var crData = new Uint8Array(crDataLength);
			for(var i=0;i<dHeight/2;i++)
			{
				var crSonData = i420Data.subarray(width*height*5/4+i*width/2, width*height*5/4+i*width/2+dWidth/2);
				for (var j = 0; j < dWidth/2; j++) {
					crData[i*dWidth/2 + j] = crSonData[j];
				}
			}
			gl.activeTexture(gl.TEXTURE2);
			gl.bindTexture(gl.TEXTURE_2D, vTextureRef);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, dWidth/2, dHeight/2, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, crData);
			crData=null;
			crSonData=null;
		}
       
    };

    /**
     * 设置显示区域
     * @param stDisplayRect    显示区域
     */
    RenderManager.prototype.SR_SetDisplayRect = function(stDisplayRect) {

        var gl = this.contextGL;

        var nWindowWidth = this.nWindowWidth;
        var nWindowHeight = this.nWindowHeight;
        
        var texturePosValues = null;
        
        if(stDisplayRect && nWindowWidth > 0 && nWindowHeight > 0) {
            var fLeft = stDisplayRect.left / nWindowWidth;
            var fTop = stDisplayRect.top / nWindowHeight;
            var fRight = stDisplayRect.right / nWindowWidth;
            var fBottom = stDisplayRect.bottom / nWindowHeight;

            texturePosValues = new Float32Array([fRight, fTop, fLeft, fTop, fRight, fBottom, fLeft, fBottom]);
        }
        else {
            texturePosValues = new Float32Array([1, 0, 0, 0, 1, 1, 0, 1]);
        }

        var texturePosBuffer = this.texturePosBuffer;

        gl.bindBuffer(gl.ARRAY_BUFFER, texturePosBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, texturePosValues);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };

    /**
     * 释放显示资源
     */
    RenderManager.prototype.SR_Destroy = function() {

        var gl = this.contextGL;
        
        var YUVProgram = this.YUVProgram;
        gl.deleteProgram(YUVProgram);

        var vertexPosBuffer = this.vertexPosBuffer;
        var texturePosBuffer = this.texturePosBuffer;
        
        gl.deleteBuffer(vertexPosBuffer);
        gl.deleteBuffer(texturePosBuffer);

        var yTextureRef = this.yTextureRef;
        var uTextureRef = this.uTextureRef;
        var vTextureRef = this.vTextureRef;
        gl.deleteTexture(yTextureRef);
        gl.deleteTexture(uTextureRef);
        gl.deleteTexture(vTextureRef);
    };

    return RenderManager;

}));

/* eslint-disable valid-jsdoc */
// import './jsPlugin-4.0.2.min.js';

// iframe模板 - 兼容旧版本
const matchTemplate = (templateName, params) => {
  const IFRAMETEMPLATE = ['simple', 'standard', 'security', 'voice', 'theme'];
  const LOCALTEMPLATE = ['pcLive', 'pcRec', 'mobileLive', 'mobileRec', 'noData', ''];
  if (typeof templateName === 'undefined') {
    if (params.themeData) {
      return {
        templateType: 'themeData',
        templateId: 'themeData'
      }
    }
    return {
      templateType: 'local',
      templateId: ''
    }
  }  if (typeof templateName === 'string') {

    if (templateName.length === 32) {
      return {
        templateType: 'remote',
        templateId: templateName
      }
    } else if (IFRAMETEMPLATE.indexOf(templateName) !== -1) {
      // 精简版且不使用头部，底部，仅播放视频，建议使用按需加载避免iframe内存额外消耗
      if (templateName === 'simple' && typeof params.header === 'undefined' && typeof params.footer === 'undefined') {
        return {
          templateType: 'local',
          templateId: ''
        }
      }
      return {
        templateType: 'iframe',
        templateId: templateName
      }
    } else if (LOCALTEMPLATE.indexOf(templateName) !== -1) {
      return {
        templateType: 'local',
        templateId: templateName
      }
    }
  }
};

class EZUIKitPlayer {
  constructor(params) {
    const { autoplay = true } = params;
    this.params = params;
    window.EZUIKit[params.id] = {
      state: {
        EZUIKitPlayer: {
          init: window.EZUIKit[params.id] && window.EZUIKit[params.id].state && window.EZUIKit[params.id].state.EZUIKitPlayer.init || false,
          themeInit: window.EZUIKit[params.id] && window.EZUIKit[params.id].state && window.EZUIKit[params.id].state.EZUIKitPlayer.themeInit || false,
          talkInit: window.EZUIKit[params.id] && window.EZUIKit[params.id].state && window.EZUIKit[params.id].state.EZUIKitPlayer.talkInit || false
        }
      }
    };
    if (matchTemplate(this.params.template, params).templateType !== 'iframe') {
      this.Monitor = new Monitor({
        env: !(typeof params.disableMonitor !== 'undefined' && params.disableMonitor) ? 'online' : 'test12',
      });
      this.id = params.id;
      this.width = params.width;
      this.height = params.height;
      this.url = params.url;
      this.accessToken = params.accessToken;
      this.themeId = matchTemplate(params.template, params).templateId;
      this.id = params.id;
      this.audio = true;
      this.poster = params.poster;
      this.speed = 1;
      this.disabledTimeLine = false;
      this.env = {
        domain: "https://open.ys7.com"
      };
      this.staticPath = "https://open.ys7.com/assets/ezuikit_v4.0";
      if (typeof params.staticPath === 'string') {
        this.staticPath = params.staticPath;
      }
      if (typeof params.audio !== 'undefined') {
        this.audio = params.audio;
      }
      if (typeof params.disabledTimeLine !== 'undefined') {
        this.disabledTimeLine = params.disabledTimeLine;
      }
      addJs(`${this.staticPath}/js/jsPlugin-4.0.2.min.js`, () => {
        if (autoplay) {
          this.initTime = new Date().getTime();
          this.Monitor.dclog({
            url: this.url,
            action: 0,
            text: 'startInit',
          });
          var initEZUIKitPlayerPromise = this.initEZUIKitPlayer(params);
          var getRealUrlPromise = this._getRealUrlPromise(params.accessToken, params.url);
          Promise.all([initEZUIKitPlayerPromise, getRealUrlPromise]).then(values => {
            if (values[1]) {
              this._pluginPlay(values[1],
                () => {
                  console.log("自动播放成功");
                  this.Monitor.dclog({
                    url: this.url,
                    action: 202,
                    d: new Date().getTime() - this.initTime,
                    text: 'autoPlaySuccess'
                  });
                },
                () => {
                  console.log("自动播放失败");
                  this.Monitor.dclog({
                    url: this.url,
                    action: 402,
                    d: new Date().getTime() - this.initTime,
                    text: 'autoPlayError'
                  });
                },
              );
            }
            window.EZUIKit[params.id].state.EZUIKitPlayer.init = true;
            if (document.getElementById(`${params.id}canvas_draw0`)) {
              document.getElementById(`${params.id}canvas_draw0`).style.border = "none";
            }
          });
        } else {
          this.initTime = new Date().getTime();
          this.Monitor.dclog({
            url: this.url,
            action: 0,
            text: 'startInit',
          });
          var initEZUIKitPlayerPromise = this.initEZUIKitPlayer(params);
          initEZUIKitPlayerPromise.then((data) => {
            console.log("初始化成功", data);
            window.EZUIKit[params.id].state.EZUIKitPlayer.init = true;
            if (document.getElementById(`${params.id}canvas_draw0`)) {
              document.getElementById(`${params.id}canvas_draw0`).style.border = "none";
            }
            this.Monitor.dclog({
              url: this.url,
              action: 201,
              d: new Date().getTime() - this.initTime,
              text: 'initSuccess',
            });
          });
        }
      },()=>{
        return !!window.JSPlugin;
      });
      if ((params.plugin && params.plugin.indexOf("talk") !== -1)) {
        this.Talk = new Talk(this);
        window.EZUIKit[params.id].state.EZUIKitPlayer.talkInit = true;
      }
    } else {
      return new EZUIKitV3$1.EZUIKitPlayer(params);
    }
  }
  initEZUIKitPlayer(params) {
    const { id, width = 600, height = 400 } = params;
    if (!document.getElementById(`${id}-wrap`)) {
      document.getElementById(id).style = `display:inline-block;width:${width}px;height:${height}px;`;
      var wapDom = document.createElement("div");
      wapDom.id = `${id}-wrap`;
      wapDom.style = `display:inline-block;width:${width}px;position:relative;`;
      document.getElementById(id).parentNode.insertBefore(wapDom, document.getElementById(id));
      wapDom.appendChild(document.getElementById(id));
      document.getElementById(id).style.verticalAlign = "top";
    }
    const initDecoder = (resolve, reject) => {
      var jSPlugin = new window.JSPlugin({
        szId: id,
        iType: 2,
        iWidth: width,
        iHeight: height,
        iMaxSplit: 1,
        iCurrentSplit: 1,
        szBasePath: "",
        staticPath: params.staticPath,
        oStyle: {
          border: "none",
          background: "#000000"
        }
      });
      jSPlugin.EventCallback = {
        loadEventHandler: function () {
        },
        zoomEventResponse: function (/*iMode, aPoint*/) {  //电子放大回调
        },
        windowEventSelect: function (iWndIndex) {  //插件选中窗口回调
        },
        pluginErrorHandler: (iWndIndex, iErrorCode, oError) => {  //插件错误回调
          console.log(iWndIndex, iErrorCode, oError);
          if (iErrorCode === 1003) {
            console.log("断流");
            this.pluginStatus.loadingSetText({
              text: "连接断开，请重试",
              color: 'red'
            });
            if (typeof this.params.handleError === 'function') {
              this.params.handleError({
                msg: "连接断开，请重试",
                retcode: 1003,
                id: this.params.id,
                type: "handleError"
              });
            }
          }
        },
        windowEventOver: function (iWndIndex) {
        },
        windowEventOut: function (iWndIndex) {
        },
        windowEventUp: function (iWndIndex) {
        },
        windowFullCcreenChange: function (bFull) {
        },
        firstFrameDisplay: (iWndIndex, iWidth, iHeight) => {
          console.log(iWidth, iHeight);
          jSPlugin.JS_SetCanFullScreen(false);
          this.pluginStatus.loadingClear();
        },
        performanceLack: function () {
        },
        mouseEvent: function (iMouseEventType, iMouseX, iMouseY) {
        }
      };
      // 增加视频容器
      var pluginStatus = new Status(this, id);
      pluginStatus.loadingStart(id);
      pluginStatus.loadingSetText({ text: '初始化播放器完成' });
      this.env = {
        domain: "https://open.ys7.com"
      };
      if (typeof params.env !== 'undefined') {
        this.env = Object.assign(this.env, params.env);
      }
      this.errorHander = new Code();
      this.jSPlugin = jSPlugin;
      if (this.themeId && !window.EZUIKit[params.id].state.EZUIKitPlayer.themeInit) {
        this.Theme = new Theme(this, id);
        window.EZUIKit[params.id].state.EZUIKitPlayer.themeInit = true;
      }
      this.pluginStatus = pluginStatus;
      // 待需要改造plugin，异步判断；
      resolve({
        meta: {
          retcode: 200,
          msg: "初始化成功"
        }
      });
    };
    var initDecoderPromise = new Promise(initDecoder);
    return initDecoderPromise;
  }
  _getRealUrlPromise(accessToken, url) {
    var apiDomain = this.env.domain;
    if (this.env) {
      apiDomain = this.env.domain;
    }
    var getRealUrlPromise = (resolve, reject) => {
      var realUrl = '';
      var apiUrl = apiDomain + "/api/lapp/live/url/ezopen";
      var data = new FormData();
      data.append("ezopen", url);
      data.append("isFlv", false);
      data.append("userAgent", window.navigator.userAgent);
      data.append("isHttp", false);
      data.append("accessToken", accessToken);
      fetch(apiUrl, {
        method: "POST",
        // headers: {
        //   'Content-Type': 'application/json'
        // },
        body: data
      })
        .then(response => response.json())
        .then((data) => {
          if (data.code == 200 || data.retcode == 0) {
            var playUrl = "";
            var stream = "";
            if (data.ext && data.ext.token) {
              realUrl += data.data;
              stream = data.ext.token;
              playUrl = data.data;
            } else if (data.data && data.data.token) {
              realUrl += data.data.url;
              stream = data.data.token;
              playUrl = data.data.url;
            }
            var type = url.indexOf('live') !== -1 ? 'live' : 'playback';
            if (type === 'live') {
              realUrl = realUrl + '&ssn=' + stream + '&auth=1&biz=4&cln=100';
            } else {
              realUrl = realUrl + '&ssn=' + stream + '&auth=1&cln=100';
            }
            console.log(realUrl);
            // 设置秘钥 - 如果地址中包含秘钥参数，播放前配置到JSPlugin对应实例中
            var validateCode = getQueryString('checkCode', realUrl);
            if (validateCode) {
              this.jSPlugin.JS_SetSecretKey(0, validateCode);
            }
            // 回放处理
            if (realUrl.indexOf('playback') !== -1) {
              var wsBegin = getQueryString('begin', playUrl) || getQueryString('begin', url);
              var wsEnd = getQueryString('end', playUrl) || getQueryString('end', url);
              // 兼容各种时间格式
              if (!wsBegin) {
                var defaultDate = new Date();
                realUrl = realUrl + '&begin=' + defaultDate.Format('yyyyMMdd') + 'T000000Z';
              } else {
                realUrl = realUrl.replace('&begin=' + getQueryString('begin', playUrl), '&begin=' + formatRecTime(wsBegin, '000000'));
                if (!getQueryString('begin', realUrl)) {
                  realUrl += '&begin=' + formatRecTime(wsBegin, '000000');
                }
              }
              if (!wsEnd) {
                realUrl = realUrl + '&end=' + formatRecTime(getQueryString('begin', realUrl).substr(0, 8), '235959');
              } else {
                realUrl = realUrl.replace('&end=' + getQueryString('end', playUrl), '&end=' + formatRecTime(wsEnd, '235959'));
                if (!getQueryString('end', realUrl)) {
                  realUrl += '&end=' + formatRecTime(wsEnd, '235959');
                }
              }
              // api错误处理
              if (!getQueryString('stream', playUrl)) {
                realUrl = realUrl.replace('stream', '&stream');
              }
              if (url.indexOf('.cloud') !== -1) { //云存储回放
                // 调用回放API接口获取回放片段 - start
                var recBegin = reRormatRecTime(getQueryString('begin', realUrl));
                var recEnd = reRormatRecTime(getQueryString('end', realUrl));
                var deviceSerial = getQueryString('serial', realUrl);
                var channelNo = getQueryString('chn', realUrl);

                var recSliceUrl = apiDomain + "/api/lapp/video/by/time";
                var recSliceParams = {
                  accessToken: this.accessToken,
                  recType: 1,
                  deviceSerial: deviceSerial,
                  channelNo: channelNo,
                  startTime: recBegin,
                  endTime: recEnd,
                  version: '2.0'
                };
                function recAPISuccess(data) {
                  if (data.code == 200) {
                    var recSliceArr = [];
                    if (data.data && data.data.files && data.data.files.length > 0) {
                      var dataArr = data.data.files;
                      var nextFileTime = new Date().getTime();
                      var isAll = data.data.isAll;
                      // mock
                      // var number = 0;
                      //isAll = false;
                      if (isAll) {
                        recSliceArr = recSliceArrFun(dataArr);
                        var recSliceArrJSON = JSON.stringify(recSliceArr).replace('\\', '');
                        realUrl += ('&recSlice=' + recSliceArrJSON.replace('\\', '')) + '&r=' + Math.random();
                        resolve(realUrl);
                      } else {
                        recTransaction();
                        // 云存储回调事务
                        function recTransaction() {
                          function recAPIV2Success(data) {
                            if (data.data && data.data.files && data.data.files.length > 0) {
                              //if(number < 2 ) {
                              if (data.data.isAll == false) {
                                if (data.data.files) {
                                  dataArr = dataArr.concat(data.data.files);
                                }
                                nextFileTime = data.data.nextFileTime > 0 ? data.data.nextFileTime : new Date().getTime();
                                recTransaction();
                              } else {
                                recSliceArr = recSliceArrFun(dataArr);
                                var recSliceArrJSON = JSON.stringify(recSliceArr).replace('\\', '');
                                realUrl += ('&recSlice=' + recSliceArrJSON.replace('\\', '')) + '&r=' + Math.random();
                                resolve(realUrl);
                              }
                              // mock
                              //number = number + 1;
                            } else {
                              recSliceArr = recSliceArrFun(dataArr);
                              var recSliceArrJSON = JSON.stringify(recSliceArr).replace('\\', '');
                              realUrl += ('&recSlice=' + recSliceArrJSON.replace('\\', '')) + '&r=' + Math.random();
                              resolve(realUrl);
                            }
                          }
                          recSliceParams.startTime = nextFileTime;
                          request(recSliceUrl, 'POST', recSliceParams, '', recAPIV2Success);
                        }
                      }
                    } else {
                      reject({
                        retcode: -1,
                        msg: "未找到录像片段"
                      });
                    }
                  } else {
                    reject({
                      retcode: -1,
                      msg: "未找到录像片段"
                    });
                  }
                  function recSliceArrFun(data) {
                    var downloadPathArr = [];
                    data.forEach(function (item, index) {
                      if (downloadPathArr.length == 0 || (item.downloadPath !== downloadPathArr[downloadPathArr.length - 1].downloadPath)) {
                        downloadPathArr.push({
                          downloadPath: item.downloadPath,
                          ownerId: item.ownerId,
                          iStorageVersion: item.iStorageVersion,
                          videoType: item.videoType,
                          iPlaySpeed: 0,
                          startTime: item.startTime,
                          endTime: item.endTime
                        });
                      } else {
                        downloadPathArr[downloadPathArr.length - 1].endTime = item.endTime;
                      }
                    });
                    return downloadPathArr;
                  }
                }
                request(recSliceUrl, 'POST', recSliceParams, '', recAPISuccess);
              } else { // 本地回放
                //alarm rec - start
                if (url.indexOf('alarmId') !== -1) {
                  console.log("进入alarmId回放");
                  // 调用回放API接口获取回放片段 - start
                  var alarmId = getQueryString('alarmId', realUrl);
                  var recBegin = reRormatRecTime(getQueryString('begin', realUrl));
                  var recEnd = reRormatRecTime(getQueryString('end', realUrl));
                  var deviceSerial = getQueryString('serial', realUrl);
                  var channelNo = getQueryString('chn', realUrl);

                  var recSliceUrl = apiDomain + "/api/lapp/video/by/id";
                  var recSliceParams = {
                    accessToken: this.accessToken,
                    // recType: 1,
                    deviceSerial: deviceSerial,
                    channelNo: channelNo,
                    alarmId: alarmId
                    // startTime:recBegin,
                    // endTime:recEnd
                  };
                  function recAPISuccess(data) {
                    if (data.code == 200) {
                      var recSliceArr = [];
                      if (data.data) {
                        recSliceArr = recSliceArrFun([data.data]);
                        var recSliceArrJSON = JSON.stringify(recSliceArr).replace('\\', '');
                        realUrl += ('&recSlice=' + recSliceArrJSON.replace('\\', ''));
                        console.log("realUrl", realUrl, data.data.recType);
                        if (data.data.recType == 1) {
                          realUrl = realUrl.replace('/playback', '/cloudplayback');
                        } else {
                          realUrl = realUrl.replace('/cloudplayback', '/playback');
                        }
                        // _this.opt.sources[0] = realUrl;
                        resolve(realUrl);
                        // request(nodeUrl, 'GET', '', '', nodeSuccess, nodeError);
                      }
                    }
                    function recSliceArrFun(data) {
                      var downloadPathArr = [];
                      data.forEach(function (item, index) {
                        if (downloadPathArr.length == 0 || (item.downloadPath !== downloadPathArr[downloadPathArr.length - 1].downloadPath)) {
                          downloadPathArr.push({
                            downloadPath: item.downloadPath,
                            ownerId: item.ownerId,
                            iStorageVersion: item.iStorageVersion,
                            videoType: item.videoType,
                            iPlaySpeed: 0,
                            startTime: item.startTime,
                            endTime: item.endTime
                          });
                        } else {
                          downloadPathArr[downloadPathArr.length - 1].endTime = item.endTime;
                        }
                      });
                      console.log("downloadPathArr", downloadPathArr);
                      return downloadPathArr;
                    }
                  }
                  request(recSliceUrl, 'POST', recSliceParams, '', recAPISuccess);
                } else {
                  // arlar rec - end
                  // request(nodeUrl, 'GET', '', '', nodeSuccess, nodeError);
                  resolve(realUrl);
                }
              }
            } else {
              resolve(realUrl);
            }
          } else {
            this.pluginStatus.loadingSetText({
              text: data.msg,
              color: 'red'
            });
            if (typeof this.params.handleError === 'function') {
              this.params.handleError({
                retcode: data.code,
                msg: data.msg,
                id: this.params.id,
                type: "handleError"
              });
            }
            resolve(realUrl);
          }

          // fetch real url end
        });
    };
    return new Promise(function (resolve, reject) {
      return getRealUrlPromise(resolve, reject);
    });
    // 格式化回放时间
    function formatRecTime(time, defaultTime) {
      // 用户格式 无需更改 => 20182626T000000Z
      // return time
      // 用户格式需要更改
      //用户时间长度为 14 20181226000000  =》 20181226000000
      // 用户长度为12     201812260000    =》 201812260000 + defaultTime后面2位
      // 用户长度为10     2018122600      =》 201812260000 + defaultTime后面4位
      // 用户长度为8     20181226         =》 201812260000 + defaultTime后面6位
      // 结果 20181226000000 14位
      // 插入 TZ
      var reg = /^[0-9]{8}T[0-9]{6}Z$/;
      if (reg.test(time)) { // 用户格式 无需更改 => 20182626T000000Z
        return time;
      } else if (/[0-9]{8,14}/.test(time)) {
        var start = 6 - (14 - time.length);
        var end = defaultTime.length;
        var standardTime = time + defaultTime.substring(start, end);
        return standardTime.slice(0, 8) + 'T' + standardTime.slice(8) + 'Z';
      }
      throw new Error('回放时间格式有误，请确认');
    }
    function reRormatRecTime(time) {
      var year = time.slice(0, 4);
      var month = time.slice(4, 6);
      var day = time.slice(6, 8);
      var hour = time.slice(9, 11);
      var minute = time.slice(11, 13);
      var second = time.slice(13, 15);
      var date = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
      // if (_this.opt.domain !== 'open') {
      //   return new Date(date.replace(/-/g, '/')).getTime() + (8 * 60 * 60 * 1000);
      // }
      return new Date(date.replace(/-/g, '/')).getTime();
    }
  }
  _pluginPlay(data, successCallback, errorCallback) {
    console.log("get real url result ===", data);
    function getPlayParams(url) {
      var websocketConnectUrl = url.split('?')[0].replace('/live', '').replace('/playback', '');
      var websocketStreamingParam = (url.indexOf('/live') === -1 ? (url.indexOf('cloudplayback') !== -1 ? '/cloudplayback?' : '/playback?') : '/live?') + url.split('?')[1];
      if (websocketStreamingParam.indexOf('/playback') !== -1) {
        websocketStreamingParam = websocketStreamingParam.replace("stream=2", 'stream=1');
      }
      // 本地回放仅支持主码流
      return {
        websocketConnectUrl: websocketConnectUrl,
        websocketStreamingParam: websocketStreamingParam
      };
    }
    var wsUrl = getPlayParams(data).websocketConnectUrl;
    if (this.env && this.env.wsUrl) {
      wsUrl = this.env.wsUrl;
    }
    var wsParams = {
      playURL: getPlayParams(data).websocketStreamingParam
    };

    this.jSPlugin.JS_Play(wsUrl, wsParams, 0).then(() => {
      console.log("播放成功");
      this.pluginStatus.loadingClear();
      this.pluginStatus.setPlayStatus({play: true, loading: false});
      if (this.Theme) {
        this.Theme.setDecoderState({ play: true });
      }
      if (this.audio) {
        setTimeout(() => {
          this.openSound();
        }, 500);
      }
      if (typeof this.params.handleSuccess === 'function') {
        this.params.handleSuccess({
          retcode: 0,
          id: this.params.id,
          type: "handleSuccess"
        });
      }
      successCallback();
      this.Monitor.dclog({
        url: this.url,
        action: 211,
        d: new Date().getTime() - this.playStartTime,
        text: 'startPlaySuccess'
      });
    }, (err) => {
      var errorInfo = this.errorHander.matchErrorInfo(err.oError.errorCode);
      var msg = errorInfo ? errorInfo.description : '播放失败，请检查设备及客户端网络';
      this.pluginStatus.loadingSetText({
        text: msg,
        color: 'red'
      });
      if (typeof this.params.handleError === 'function') {
        this.params.handleError({
          retcode: err.oError.errorCode,
          msg: msg,
          id: this.params.id,
          type: "handleError"
        });
      }
      errorCallback();
      this.Monitor.dclog({
        url: this.url,
        action: 411,
        d: new Date().getTime() - this.playStartTime,
        text: 'startPlayError'
      });
    });
  }
  play(options) {
    this.pluginStatus.setPlayStatus({play: false, loading: true});
    this.playStartTime = new Date().getTime();
    this.Monitor.dclog({
      url: this.url,
      action: 1,
      d: new Date().getTime() - this.initTime,
      text: 'startPlay'
    });
    if (options) {
      if (typeof options.url === 'string') {
        this.url = options.url;
      }
      if (typeof options.accessToken === 'string') {
        this.accessToken = options.accessToken;
      }
      if (this.Theme && (typeof options.url === 'string' || typeof options.accessToken === 'string')) {
        this.Theme.getDeviceInfo();
      }
    }
    const promise = new Promise((resolve, reject) => {
      this._getRealUrlPromise(this.accessToken, this.url)
        .then((data) => {
          this._pluginPlay(data, () => resolve(true), () => reject(false));
        })
        .catch((err) => {
          var msg = err.msg ? err.msg : '播放失败，请检查设备及客户端网络';
          this.pluginStatus.loadingSetText({
            text: msg,
            color: 'red'
          });
          if (typeof this.params.handleError === 'function') {
            this.params.handleError({
              retcode: err.oError.errorCode,
              msg: msg,
              id: this.params.id,
              type: "handleError"
            });
          }
          reject(false);
        });
    });
    return promise;
  }
  stop() {
    this.pluginStatus.setPlayStatus({loading: true});
    return this.jSPlugin.JS_Stop(0).then(() => {
      console.log("停止成功");
      this.pluginStatus.setPlayStatus({play: false,loading: false});
      if (this.Theme) {
        this.Theme.setDecoderState({ play: false });
      }
    });
  }
  changePlayUrl(options) {
    var initUrl = this.url;
    var url = matchUrl(initUrl, options);
    console.log("changePlayUrl", url);
    this.url = url;
    const promise = new Promise((resolve, reject) => {
      this.stop()
        .then(() => {
          if (options.accessToken) {
            this.accessToken = options.accessToken;
            return this.play({
              accessToken: options.accessToken,
              url: url
            }).then(() => {
              resolve(url);
            }).catch((err) => {
              reject(url);
            });
          }
          this.play(url)
            .then(() => {
              resolve(url);
            })
            .catch((err) => {
              reject(url);
            });
        })
        .catch((err) => {
          console.log("切换过程停止失败", err);
          if (options.accessToken) {
            this.accessToken = options.accessToken;
            return this.play({
              accessToken: options.accessToken,
              url: url
            }).then(() => {
              resolve(url);
            }).catch((err) => {
              reject(url);
            });
          }
          this.play(url)
            .then(() => {
              resolve(url);
            }).catch((err) => {
              reject(url);
            });
        });
    });
    /**
* 匹配播放地址 用户播放地址切换
* options
* type | string | live,rec
* hd | boolean | true,false
* deviceSerial
* channelNO
* begin
* end
*/
    function matchUrl(matchInitUrl, matchOptions) {
      if (matchOptions.url) {
        return matchOptions.url;
      }
      var type = matchInitUrl.split("/")[4].split(".")[matchInitUrl.split("/")[4].split(".").length - 1].split("?")[0];
      if (type === 'rec' && matchInitUrl.indexOf(".cloud.rec") !== -1) {
        type = 'cloud.rec';
      }
      if (matchOptions.type) {
        type = matchOptions.type;
      }
      var deviceSerial = matchInitUrl.split("/")[3];
      if (matchOptions.deviceSerial) {
        deviceSerial = matchOptions.deviceSerial;
      }
      var channelNo = matchInitUrl.split("/")[4].split(".")[0];
      if (matchOptions.channelNo) {
        channelNo = matchOptions.channelNo;
      }
      // 如果切换设备，之前设备有验证码，新设备无验证码，建议传空验证码,清理验证码（降低解码消耗）
      var validCode = matchInitUrl.split("/")[2].split("@").length === 2 ? matchInitUrl.split("/")[2].split("@")[0] : "";
      if (typeof matchOptions.validCode !== 'undefined') {
        validCode = matchOptions.validCode;
      }
      var hd = typeof matchOptions.hd === 'undefined' ? matchInitUrl.indexOf('.hd') !== -1 : matchOptions.hd;
      let result = `ezopen://${validCode ? `${validCode}@` : ""}open.ys7.com/${deviceSerial}/${channelNo}${hd ? '.hd' : ''}.${type}`;
      if (type === 'live') {
        return result;
      }
      result = `ezopen://${validCode ? `${validCode}@` : ""}open.ys7.com/${deviceSerial}/${channelNo}.${type}`;
      if (matchOptions.begin && matchOptions.end) {
        result += `?begin=${matchOptions.begin}&end=${matchOptions.end}`;
      } else if (matchOptions.begin) {
        result += `?begin=${matchOptions.begin}`;
      } else if (getQueryString("begin", matchInitUrl)) {
        result += `?begin=${getQueryString("begin", matchInitUrl)}`;
      }
      return result;
    }
    return promise;
  }
  getOSDTime() {
    var promise = new Promise((resolve, reject) => {
      this.jSPlugin.JS_GetOSDTime(0)
        .then((data) => {
          resolve({
            code: 0,
            retcode: 0,
            data: data
          });
          // 兼容旧版本callback
          if (typeof this.params.getOSDTimeCallBack === 'function') {
            this.params.getOSDTimeCallBack({ id: this.id, type: 'getOSDTime', code: 0, data: data });
          }
        })
        .catch(err => {
          reject({
            code: -1,
            retcode: -1,
            data: err
          });
          // 兼容旧版本callback
          if (typeof this.params.getOSDTimeCallBack === 'function') {
            this.params.getOSDTimeCallBack({ id: this.id, type: 'getOSDTime', code: -1, data: -1 });
          }
        });
    });
    return promise;
  }
  capturePicture(name, callback = false) {
    var capturePictureRT = this.jSPlugin.JS_CapturePicture(0, name, "JPEG", callback, !!callback);
    if (isPromise(capturePictureRT)) {
      // 兼容旧版本callback
      if (typeof this.params.capturePictureCallBack === 'function') {
        capturePictureRT.then(() => {
          this.params.capturePictureCallBack({ id: this.id, type: 'capturePicture', code: 0 });
        })
          .catch(() => {
            this.params.capturePictureCallBack({ id: this.id, type: 'capturePicture', code: -1 });
          });
      }
      return capturePictureRT;
    }
    return new Promise(function (resolve) {
      resolve(capturePictureRT);
    });
  }
  startSave(name) {
    var startSaveRT = this.jSPlugin.JS_StartSave(0, name);
    if (isPromise(startSaveRT)) {
      // 兼容旧版本callback
      if (typeof this.params.startSaveCallBack === 'function') {
        startSaveRT.then(() => {
          this.params.startSaveCallBack({ id: this.id, type: 'startSave', code: 0 });
        })
          .catch(() => {
            this.params.startSaveCallBack({ id: this.id, type: 'startSave', code: -1 });
          });
      }
      return startSaveRT;
    }
    if (this.Theme) {
      this.Theme.setDecoderState({ recordvideo: true });
    }
    return new Promise(function (resolve) {
      resolve(startSaveRT);
    });
  }
  stopSave() {
    var stopSaveRT = this.jSPlugin.JS_StopSave(0);
    if (isPromise(stopSaveRT)) {
      // 兼容旧版本callback
      if (typeof this.params.startSaveCallBack === 'function') {
        stopSaveRT.then(() => {
          this.params.stopSaveCallBack({ id: this.id, type: 'stopSave', code: 0 });
        })
          .catch(() => {
            this.params.stopSaveCallBack({ id: this.id, type: 'stopSave', code: -1 });
          });
      }
      return stopSaveRT;
    }
    if (this.Theme) {
      this.Theme.setDecoderState({ recordvideo: false });
    }
    return new Promise(function (resolve) {
      resolve(stopSaveRT);
    });
  }
  openSound() {
    var openSoundRT = this.jSPlugin.JS_OpenSound(0);
    console.log("打开声音", openSoundRT);
    if (isPromise(openSoundRT)) {
      return openSoundRT;
    }
    if (this.Theme) {
      this.Theme.setDecoderState({ sound: true });
    }
    // 兼容旧版本callback
    if (typeof this.params.openSoundCallBack === 'function') {
      this.params.openSoundCallBack({ id: this.id, type: 'openSound', code: openSoundRT });
    }
    return new Promise(function (resolve) {
      resolve(openSoundRT);
    });
  }
  closeSound() {
    var closeSoundRT = this.jSPlugin.JS_CloseSound(0);
    if (isPromise(closeSoundRT)) {
      return closeSoundRT;
    }
    if (this.Theme) {
      this.Theme.setDecoderState({ sound: false });
    }
    // 兼容旧版本callback
    if (typeof this.params.closeSoundCallBack === 'function') {
      this.params.closeSoundCallBack({ id: this.id, type: 'closeSound', code: closeSoundRT });
    }
    return new Promise(function (resolve) {
      resolve(closeSoundRT);
    });
  }
  enableZoom() {
    var enableZoomRT = this.jSPlugin.JS_EnableZoom(0);
    if (isPromise(enableZoomRT)) {
      return enableZoomRT;
    }
    return new Promise(function (resolve) {
      resolve(enableZoomRT);
    });
  }
  closeZoom() {
    var closeZoomRT = this.jSPlugin.JS_DisableZoom(0);
    if (isPromise(closeZoomRT)) {
      return closeZoomRT;
    }
    return new Promise(function (resolve) {
      resolve(closeZoomRT);
    });
  }
  setPoster(url) {
    this.pluginStatus.setPoster(url);
  }
  reSize(width, height) {
    this.width = width;
    this.height = height;
    document.getElementById(`${this.id}-wrap`).style = `width:${width}px;position:relative;`;
    this.jSPlugin.JS_Resize(width, height);
  }
  fast() {
    var speed = this.speed;
    if (speed === 1) {
      speed = 2;
    } else if (speed === 2) {
      speed = 4;
    } else {
      if (typeof this.params.handleError === 'function') {
        this.params.handleError({
          msg: "播放速度最大为4倍速度",
          retcode: 1003,
          id: this.id,
          type: "handleError"
        });
      }
    }
    var fastRT = this.jSPlugin.JS_Fast(0);
    if (isPromise(fastRT)) {
      this.speed = speed;
      return fastRT;
    }
    return new Promise(function (resolve) {
      this.speed = speed;
      resolve(fastRT);
    });
  }
  slow() {
    var speed = this.speed;
    if (speed === 4) {
      speed = 2;
    } else if (speed === 2) {
      speed = 1;
    } else {
      if (typeof this.params.handleError === 'function') {
        this.params.handleError({
          msg: "播放速度最小为1倍速度",
          retcode: 1003,
          id: this.id,
          type: "handleError"
        });
      }
    }
    var slowRT = this.jSPlugin.JS_Slow(0);
    console.log("slowRT", slowRT);
    if (isPromise(slowRT)) {
      this.speed = speed;
      return slowRT;
    }
    return new Promise(function (resolve) {
      this.speed = speed;
      resolve(slowRT);
    });
  }
  seek(startTime, endTime) {
    var url = this.url;
    var currentDay = (getQueryString(url, 'begin') || new Date().Format('yyyyMMdd')).substr(0, 8);
    endTime = formatRecTime(currentDay, '235959');
    if (startTime.length === 6) {
      startTime = formatRecTime(currentDay, startTime);
    } else if (startTime.length === 16) {
      if (startTime.substr(0, 8) !== currentDay) {
        this.params.handleError({
          msg: "seek时间不能跨日期",
          retcode: -1,
          id: this.id,
          type: "handleError"
        });
        return false;
      }
    } else {
      this.params.handleError({
        msg: "seek时间格式错误",
        retcode: -1,
        id: this.id,
        type: "handleError"
      });
      return false;
    }
    // 格式化回放时间
    function formatRecTime(time, defaultTime) {
      // 用户格式 无需更改 => 20182626T000000Z
      // return time
      // 用户格式需要更改
      //用户时间长度为 14 20181226000000  =》 20181226000000
      // 用户长度为12     201812260000    =》 201812260000 + defaultTime后面2位
      // 用户长度为10     2018122600      =》 201812260000 + defaultTime后面4位
      // 用户长度为8     20181226         =》 201812260000 + defaultTime后面6位
      // 结果 20181226000000 14位
      // 插入 TZ
      var reg = /^[0-9]{8}T[0-9]{6}Z$/;
      if (reg.test(time)) { // 用户格式 无需更改 => 20182626T000000Z
        return time;
      } else if (/[0-9]{8,14}/.test(time)) {
        var start = 6 - (14 - time.length);
        var end = defaultTime.length;
        var standardTime = time + defaultTime.substring(start, end);
        return standardTime.slice(0, 8) + 'T' + standardTime.slice(8) + 'Z';
      } else {
        throw new Error('回放时间格式有误，请确认');
      }
    }
    var seekRT = this.jSPlugin.JS_Seek(0, startTime, endTime);
    console.log("seekRT", seekRT);
    if (isPromise(seekRT)) {
      return seekRT;
    }
    return new Promise(function (resolve) {
      resolve(seekRT);
    });
  }
  fullScreen() {
    var promise = requestFullScreenPromise(document.getElementById(`${this.id}`));
    promise.then((data) => {
      console.log("全屏promise", window.screen.availWidth);
      this.jSPlugin.JS_Resize(window.screen.availWidth, window.screen.availHeight);
      // 兼容旧版本callback
      if (typeof this.params.fullScreenCallBack === 'function') {
        this.params.fullScreenCallBack({ id: this.id, type: 'fullScreen', code: 0 });
      }
    });
    //  监听全屏事件触发
    const fullscreenchange = () => {
      let isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
      if (!isFullScreen) {
        this.jSPlugin.JS_Resize(this.width, this.height);
      }
      // 兼容旧版本callback
      if (typeof this.params.fullScreenChangeCallBack === 'function') {
        this.params.fullScreenChangeCallBack({ id: this.id, type: 'fullScreen', code: isFullScreen });
      }
    };
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange'].forEach((item) => {
      window.addEventListener(item, (data) => fullscreenchange());
    });
  }
  cancelFullScreen() {
    var cancelPromise = cancelFullScreenPromise();
    cancelPromise.then((data) => {
      console.log("取消全屏", data, this.jSPlugin);
      this.jSPlugin.JS_Resize(this.width, this.height);
    });
  }
  startTalk() {
    this.Talk.startTalk();
  }
  stopTalk() {
    this.Talk.stopTalk();
  }
  destroy() {
    var destroyRT = this.jSPlugin.JS_DestroyWorker(0);
    if (this.Theme) {
      this.Theme = null;
      window.EZUIKit[this.params.id].state.EZUIKitPlayer.themeInit = false;
    }
    if (isPromise(destroyRT)) {
      return destroyRT;
    }
    return new Promise(function (resolve) {
      resolve(destroyRT);
    });
  }
}

(function (global, factory) {

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
})(typeof window !== "undefined" ? window : undefined, function (window, noGlobal) {
  const EZUIKit = {
    Core,
    HLS,
    FLV,
    EZUIKitPlayer
  };
  window.EZUIKit = EZUIKit;
  return EZUIKit;
});
