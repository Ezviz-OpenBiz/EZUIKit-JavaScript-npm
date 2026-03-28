# [EZUIKit-JavaScript-npm][ezuikit-js]

![Download](https://img.shields.io/npm/dm/ezuikit-js.svg) ![Version](https://img.shields.io/npm/v/ezuikit-js.svg) ![License](https://img.shields.io/npm/l/ezuikit-js.svg) ![Build Demos](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/workflows/build-demos/badge.svg)

> 轻应用 npm 版本，降低接入难度，适配自定义 UI，适配主流框架

> 低延时预览，云存储回放，SD 卡回放

> 功能 API 丰富，如：播放控制，音频控制，视频截图，实时获取视频 OSDTime，视频录制，设备对讲，电子放大，全屏等

<p style="color: yellow;">hls和flv 不在维护更新，后续版本中会被移除， flv 可以使用 <a href="https://www.npmjs.com/package/ezuikit-flv" block="_target">ezuikit-flv</a>, hls 可以使用 <a href="https://www.npmjs.com/package/@ezuikit/player-hls" block="_target">@ezuikit/player-hls</a></p>
<p style="color: yellow;">hls和flv 不在维护更新，后续版本中会被移除， flv 可以使用 <a href="https://www.npmjs.com/package/ezuikit-flv" block="_target">ezuikit-flv</a>, hls 可以使用 <a href="https://www.npmjs.com/package/@ezuikit/player-hls" block="_target">@ezuikit/player-hls</a></p>
<p style="color: yellow;">hls和flv 不在维护更新，后续版本中会被移除， flv 可以使用 <a href="https://www.npmjs.com/package/ezuikit-flv" block="_target">ezuikit-flv</a>, hls 可以使用 <a href="https://www.npmjs.com/package/@ezuikit/player-hls" block="_target">@ezuikit/player-hls</a></p>

### 获取 ezuikit-js

```bash
# npm
npm install ezuikit-js

# yarn

yarn add ezuikit-js

# pnpm

pnpm add ezuikit-js
```

### 引入 ezuikit-js

```js
// >= v8.1.2  ESM
import { EZUIKitPlayer } from "ezuikit-js";

// < v8.1.2
import EZUIKit from "ezuikit-js";
```

#### 不支持 ESM (not support ESM)

```js
// UMD
import EZUIKit from "ezuikit-js/ezuikit.js";

// >= v8.1.2  CommonJS
import { EZUIKitPlayer } from "ezuikit-js/index.js";

// < v8.1.2 CommonJS
import EZUIKit from "ezuikit-js/index.js";
```

#### 如果你使用原生方法,可以通过标签引用

```html
<!-- umd -->
<script src="./ezuikit.js"></script>
```

### 开始使用 - 初始化

> 基本使用

创建 DOM

```html
<div id="video-container"></div>
```

## 播放器初始化

### 直播

```js
import { EZUIKitPlayer } from "ezuikit-js";
const player = new EZUIKitPlayer({
  id: "video-container", // 视频容器ID
  accessToken:
    "at.3bvmj4ycamlgdwgw1ig1jruma0wpohl6-48zifyb39c-13t5am6-yukyi86mz",
  url: "ezopen://open.ys7.com/BC7900686/1.live",
  width: 600,
  height: 400,
  scaleMode: 1, // 默认 0 完全填充窗口，会有拉伸 1: 等比适配 2: 等比完全填充窗口, 超出隐藏 @sine 8.2.0
  handleError: (err) => {
    if (err.type === "handleRunTimeInfoError" && err.data.nErrorCode === 5) {
      // 加密设备密码错误
    }
  },
});
```

### 回放

```js
import { EZUIKitPlayer } from "ezuikit-js";
const player = new EZUIKitPlayer({
  id: "video-container", // 视频容器ID
  width: 600,
  height: 400,
  scaleMode: 1, // 默认 0 完全填充窗口，会有拉伸 1: 等比适配 2: 等比完全填充窗口, 超出隐藏 @sine 8.2.0
  accessToken:
    "at.3bvmj4ycamlgdwgw1ig1jruma0wpohl6-48zifyb39c-13t5am6-yukyi86mz",
  url: "ezopen://open.ys7.com/BC7900686/1.rec",
});
```

#### 非正式版说明

alpha（功能测试）、beta（集成测试）为我们的非正式版本，可能存在功能或使用上的问题，若您遇到了任何问题，欢迎向我们反馈。

非正式版本没有 CDN 资源，使用时需要配置 `staticPath`，引用本地的解码库资源。

### 使用示例

> 如果使用原生 js，可参考 demos => [base-demo](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/tree/master/demos/base-demo)

> 如果使用 react，可参考 demos => [react-demo](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/tree/master/demos/react-demo)

> 如果使用 react + vite，可参考 demos => [with-react-vite](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/tree/master/demos/with-react-vite)

> 如果使用 next.js，可参考 demos => [with-next](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/tree/master/demos/with-next)

> 如果使用 electron，可参考 demos => [with-electron](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/tree/master/demos/with-electron)

> 如果使用 vue3，可参考 demos => [vue3-demo](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/tree/master/demos/vue3-demo)

> 如果使用 vue2.7，可参考 demos => [vue-demo](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/tree/master/demos/vue-demo)

> 如果使用 vue2.6，可参考 demos => [with-vue2.6](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/tree/master/demos/with-vue2.6)
>
> 如果使用 uniapp + vue3 ，可参考 demos => [with-uniapp-vue3](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/tree/master/demos/with-uniapp-vue3)

> 如果使用 uniapp + vue2 ，可参考 demos => [with-uniapp-vue2](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/tree/master/demos/with-uniapp-vue2)
 
> 如果使用 docker + nginx ，可参考 demos => [with-docker-nginx](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/tree/master/demos/with-docker-nginx)

#### tips

为方便开发者快速接入

我们提供了测试 accessToken,测试播放地址，并提供了几种常用场景使用示例。你可以通过使用示例，使用测试播放地址，测试 accessToken，在你的应用快速接入。

<b>测试播放地址：</b> ezopen://open.ys7.com/BC7900686/1.live

你可以通过以下地址获取到测试 accessToken <a href="https://open.ys7.com/jssdk/ezopen/demo/token" target="_blank">获取测试 accessToken</a> 用来播放上述测试播放地址。当前设备有可能下线或被移除了， 如果自己有设备优先使用自己的设备进行测试。

### 轻应用 - 海外版本

> 轻应用支持向接入萤石云海外环境的设备发起取流播放，需要在初始化时配置海外服务域名，示例：

```js
import { EZUIKitPlayer } from "ezuikit-js";
const player = new EZUIKitPlayer({
  id: "playWind",
  width: 600,
  height: 400,
  template: "pcLive",
  url: "...",
  accessToken: "...",
  env: {
    domain: "https://iusopen.ezvizlife.com", // 北美地区
  },
});
```

各地区的域名分别为：

| 区域   | 域名                             |
| ------ | -------------------------------- |
| 北美   | https://iusopen.ezvizlife.com    |
| 南美   | https://isaopen.ezvizlife.com    |
| 欧洲   | https://ieuopen.ezvizlife.com    |
| 新加坡 | https://isgpopen.ezvizlife.com   |
| 印度   | https://iindiaopen.ezvizlife.com |

#### 最佳实践 tips

1. 我们在 v0.6.2 及以上版本持用户通过开启谷歌实验室特性启动多线程解码，多线程模式将大大提升解码效率，降低解码内存消耗。

> [开启多线程方式 1](https://open.ys7.com/help/384)(https://open.ys7.com/help/384)

> [开启多线程方式 2](https://open.ys7.com/help/385)(https://open.ys7.com/help/385)

2. 视频解码库默认从开放平台远程拉取，你可以将解码库放到本地或者你的服务内，可以提升加载解码库速度。

> <b>使用本地解码库提升加载速度</b> 开发者需要自己设置静态资源文件地址， 参考 `staticPath`的配置

### 使用示例

#### 快速创建视频播放页面

&emsp;&emsp;&emsp;&emsp;<b>基本使用：</b> <a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/index.html" target="_blank">基本使用示例</a>

#### 前往[开放平台轻应用模板管理页](https://open.ys7.com/console/ezuikit/template.html)创建一个主题，可以动态配置你的播放主题，控件，示例展示了获取一个主题后使用示例。

&emsp;&emsp;&emsp;&emsp;<b>自定义主题：</b> <a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/template.html" target="_blank">自定义主题示例</a>

#### 你可以本地创建一个主题配置，可以本地配置你的播放主题，控件，示例展示了本地配置项使用示例。

&emsp;&emsp;&emsp;&emsp;<b>本地主题配置：</b> <a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/themeData.html" target="_blank">本地主题配置示例</a>

#### 我们提供了一些通用场景的主题，PC 端预览，PC 端回放，移动端预览，移动端回放，你也可以直接使用。

&emsp;&emsp;&emsp;&emsp;<b>PC 端预览-固定主题：</b> <a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/pcLive.html" target="_blank">PC 端预览-固定主题示例</a>

&emsp;&emsp;&emsp;&emsp;<b>PC 端回放-固定主题：</b> <a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/pcRec.html" target="_blank">PC 端回放-固定主题示例</a>

&emsp;&emsp;&emsp;&emsp;<b>移动端预览-固定主题：</b> <a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/mobileLive.html" target="_blank">移动端预览-固定主题示例</a>

&emsp;&emsp;&emsp;&emsp;<b>移动端回放-固定主题：</b> <a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/mobileRec.html" target="_blank">移动端回放-固定主题示例</a>

#### 同一个页面播放多个视频，可以参考：

&emsp;&emsp;&emsp;&emsp;<b>单页面多实例(视频多窗口)：</b> <a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/multi.html" target="_blank">单页面多实例(视频多窗口)示例</a>

#### 附录： 初始化参数说明

<table>
<tr><th>参数名</th><th>类型</th><th>描述</th><th>是否必选</th></tr>
<tr><td>id</td><td>String</td><td>播放器容器DOM的id</td><td>Y</td></tr>
<tr><td>accessToken</td><td>String</td><td>授权过程获取的access_token</td><td>Y</td></tr>
<tr><td>url</td><td>String</td><td>

#### 直播

##### 标清

ezopen://open.ys7.com/${设备序列号}/{通道号}.live<br/>

##### 高清

ezopen://open.ys7.com/${设备序列号}/{通道号}.hd.live<br/>

#### 回放

##### sd 卡回放

初始化参数 url 值为：<br/> ezopen://open.ys7.com/${设备序列号}/{通道号}.rec?begin=yyyyMMddhhmmss

##### 云存储回放

初始化参数 url 值为：<br/> ezopen://open.ys7.com/${设备序列号}/{通道号}.cloud.rec?begin=yyyyMMddhhmmss 视频 ezopen 协议播放地址 详见：<a href="https://open.ys7.com/help/23" target="_blank">ezopen 协议</a> </td><td>Y</td></tr>

<tr><td>audio</td><td>boolean</td><td>是否默认开启声音 true：打开（默认） false：关闭    </td><td>N</td></tr>
<tr><td>width</td><td>int</td><td>视频宽度，默认值为容器容器DOM宽度    </td><td>Y</td></tr>
<tr><td>height</td><td>int</td><td>视频高度，默认值为容器容器DOM高度</td><td>Y</td></tr>
<tr><td>staticPath</td><td>string</td><td>设置静态资源地址, 自定义可以自行下载 `ezuikit_static`放置在自己的服务器下， 设置 {staticPath: "/ezuikit_static"} </td><td>N</td></tr>
<tr><td>template</td><td>String</td><td>

<table style="display:inline-block;width:700px">
<tr><th>模板值</th><th>描述</th></tr>

<tr><td>simple</td><td>极简版 *固定模板 仅包含视频播放窗口，创建实例后通过方法集控制视频播<br />放相关功能</td></tr>


<tr><td>security</td><td>安防版(预览回放);  *固定模板 包含视频窗口，叠加了录制，全屏控件，<br />标清/高清切换，预览录制切换控件*</td></tr>
<tr><td>voice</td><td>语音版;  *固定模板 包含视频窗口，叠加了录制，全屏控件，语音播报，语音<br />对讲控件*</td></tr>
<tr><td>pcLive</td><td>    *固定模板 按钮列表，颜色，底部头部背景色固定，可用于pc端预览，如需<br />修改按钮配置，头部底部背景色，可参考 {{自定义themeId}}，或者使用<br />themeData本地配置*</td></tr>
<tr><td>pcRec</td><td>    *固定模板 按钮列表，颜色，底部头部背景色固定， 可用于pc端回放，如需<br />修改按钮配置，头部底部背景色，可参考 {{自定义themeId}}，或者使用themeData<br />本地配置*</td></tr>
<tr><td>mobileLive</td><td>    *固定模板  按钮列表，颜色，底部头部背景色固定，可用于移动端预<br />览，如需修改按钮配置，头部底部背景色，可参考 {{自定义themeId}}，或者使用themeData<br />本地配置*</td></tr>
<tr><td>mobileRec</td><td>*固定模板 按钮列表，颜色，底部头部背景色固定， 可用于移动端回放，<br />如需修改按钮配置，头部底部背景色，可参考 {{自定义themeId}}，或者使用themeData<br />本地配置*</td></tr>
<tr><td>自定义themeId</td><td>自定义主题，<a href="https://open.ys7.com/console/ezuikit/template.html" target="_blank">前往开放平台控制台配置页面获取</a><br />（v0.6.2版本及以上支持，建议使用 自定义themeId，或者使用themeData本地<br />配置）;</td></tr>
</table>

</td><td>N</td></tr>
<tr><td><a href="./themeData.md" target="_blank">themeData</a></td><td><a href="./themeData.md" target="_blank">ThemeData</a></td><td>
themeData将主题数据本地化，设置本地数据，需要删除template参数 <br />
你可以通过themeData修改按钮位置，颜色，头部底部颜色等配置。

配置示例：<a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/themeData.html" target="_blank">本地主题配置示例</a>

</td><td>N</td></tr>

<tr><td>handleSuccess</td><td>function</td><td>自动播放成功回调</td><td>N</td></tr>
<tr><td>handleError</td><td>function</td><td>错误回调</td><td>N</td></tr>
<!-- <tr><td>seekFrequency </td><td>function</td><td>为避免频繁拖动播放异常，可设置模板回放时间轴拖动防抖间隔，默认值为2000（2秒），可取2000（2秒），3000（3秒），4000（4秒），5000（5秒）</td><td>N</td></tr> -->
<tr><td>language</td><td>String</td><td>多语言 （zh | en）, 默认zh (v8.0.8版本及以上支持)</td><td>N</td></tr>
<tr><td>debugDownloadData</td><td>boolean</td><td>下载原始码流， 调试码流使用, 默认 false (v8.1.1版本及以上支持)</td><td>N</td></tr>
<tr><td>disableRenderPrivateData</td><td>boolean</td><td>禁止渲染私有数据(如智能分析， 移动侦测， 火点信息等), 默认 false (v8.1.1 - v.8.1.3 版本及以上支持)v.8.1.4 开始 默认 true</td><td>N</td></tr>
<tr><td>quality</td><td>0 | 1 | 2 | 3 | 4 | 5 | 6 | pp | qp</td><td>预览初始化支持指定清晰度进行播放, 默认 undefined (v8.1.5版本及以上支持)， 0: 流畅； 1: 标清; 2: 高清; 3: 超清; 4: 极清; 5: 3K; 6: 4K ; "pp"： "性能优先 (Performance Priority)"; "qp": "画质优先(Quality Priority)"。 如果没有命中，默认取数组的第一个值</td><td>N</td></tr>
<tr><td>loggerOptions</td><td> {name: string, level: "INFO" | "LOG" | "WARN" | "ERROR" , showTime: boolean}</td><td>本地日志设置， 默认值 {name: "ezuikit", level: "INFO", showTime: true}, 支持动态设置请参考 <a href="#日志设置">setLoggerOptions(options)</a> (v8.1.9版本及以上支持)</td><td>N</td></tr>
<tr><td>streamInfoCBType</td><td>  0 | 1 </td><td>  流信息回调类型，监听 streamInfoCB 事件, 0 : 每次都回调（会影响性能）, 1 : 只回调一次, 默认值 1 (v8.1.9版本及以上支持)</td><td>N</td></tr>

<tr><td>isCloudRecord</td><td> boolean </td><td>适用 8.1.x 云录制，8.2.x 已移除并默认支持云录制</td><td>N</td></tr>

<tr><td><a href="./videoLevelList.md" target="_blank">videoLevelList</a></td><td> <span>Array<{ </br>/** 清晰度 */</br>level: number, </br>/** 名称 */ </br>name: string, </br> /**1: 主码流,2: 子码流*/</br>streamTypeIn: 1 | 2 }> <span>| null </td><td>  自定义清晰度列表，默认null, 如果有值 sdk 内部不在进行获取, 为 null 使用接口获取的清晰度列表, videoLevelList.length === 0 不展示清晰度控件 sdk 内部不在进行获取, videoLevelList.length > 0 展示控件 sdk 内部不在进行获取 (v8.1.10版本及以上支持);
8.1.17 开始 当 level 的值小于 0时， 不在向设备发送指令，仅根据 streamTypeIn 切换码流 （请保证 streamTypeIn 对应的码流存在）
</td><td>N</td></tr>

<tr><td>scaleMode</td><td> 0 | 1 | 2</td><td> 默认 0 完全填充窗口，会有拉伸 1: 等比适配 2: 等比完全填充窗口, 超出隐藏 @sine 8.2.0 </td><td>N</td></tr>

<tr><td><a href="./cloudRecord.md">spaceId</a></td><td> number</td><td> 云录制空间 ID (仅云录制生效) @sine 8.2.0 </td><td>N</td></tr>
<tr><td>timeLineOptions</td><td> Object </td><td><code>{ 
              showCoverFold: true, // 是否展示移动端卡片 默认 true @sine 8.2.1 <br/>
              showTimeWidthBtn: true, // 是否展示移动端时间刻度宽度 默认 true @sine 8.2.1
}</code></td><td>N</td></tr>

<tr><td>speedOptions</td><td> Object </td><td><code>
 {
    // 自定义倍速列表 @sine 8.2.4 <br/>
    list: Array<{label: string, value: 0.5 | 1 | 2 | 4 | 8 | 16}>
  <br/>
 }
</code></td><td>N</td></tr>
</table>

### 方法调用

> 同步方法（方式 1）方法支持通过 promise 回调，可通过回调方式执行下一步动作（方式 2）。

#### 开始播放

```js
// 方式1
player.play();
// 方式2
player.play().then(() => {
  console.log("执行播放成功后其他动作");
});
```

#### 停止播放

```js
// 方式1
player.stop();
// 方式2
player.stop().then(() => {
  console.log("执行停止成功后其他动作");
});
```

#### 开启声音

```js
// 方式1
player.openSound();
// 方式2
player.openSound().then(() => {
  console.log("执行开启声音成功后其他动作");
});
```

#### 关闭声音

```js
// 方式1
player.closeSound();
```

#### 开始录制

> 因录制解码库加载限制，录制库加载需要 3S 秒左右，请保证录制时长需要大于 5 秒。录制文件需要使用播放器，播放器下载地址 <a href="https://service.ys7.com/downloadInfoSite/admin">播放器下载</a>

```js
// 方式1
player.startSave("唯一文件名");
// 方式2
player.startSave("唯一文件名").then(() => {
  console.log("执行开始录制成功后其他动作");
});
```

#### 停止录制并下载文件

```js
// 方式1
player.stopSave();
// 方式2
player.stopSave().then(() => {
  console.log("执行停止录制成功后其他动作");
});
```

#### 抓图

```js
// 方式1 - 下载到本地
player.capturePicture("文件名");
// 方式2 - 返回base64格式
const capCallback = (data) => {
  console.log("data", data);
};
player.capturePicture("default", capCallback);
```

#### 开始对讲

```js
player.startTalk();
```

#### 结束对讲

```js
player.stopTalk();
```

#### 对讲设置麦克风增益

```js
// 设置音频增益系数 0 ~ 10
player.setVolumeGain(volume);
```

#### 获取麦克风权限

```js
player.getMicrophonePermission().then((data) => {
  if (data.code === 0) {
    // 成功....
  }
});
```

#### 获取麦克风列表

```js
// 需要在麦克风已授权的情况下调用，才能获取到麦克风列表，可以和getMicrophonePermission配合使用，或在初始化后先调用getMicrophonePermission获取授权
player.getMicrophonesList().then((data) => {
  if (data.code === 0) {
    // 成功....
  }
});
```

#### 切换麦克风

```js
// microphoneId 为获取到的麦克风列表中的deviceId，如果当前处于对讲中，调用setProfile会先关闭，重新发起对讲
player.setProfile({ microphoneId });
```

#### 监听麦克风音量变化

```js
player.eventEmitter.on("volumeChange", ({ data }) => {
  // 动态显示音柱,100ms触发一次
  console.log(`${data * 100}%`);
});
```

#### 全屏

```js
player.fullScreen(); // 8.2.0 开始移除 
player.fullscreen(); // 8.2.0 新增
```

#### 取消全屏

```js
player.cancelFullScreen(); // 8.2.0 开始移除 
player.exitFullscreen(); // 8.2.0 新增
```

#### 获取 OSD 时间

```js
player.getOSDTime().then((time) => {
  console.log("获取到的当前播放时间", time);
});
```

#### 切换地址播放

> 可用于在播放中切换设备，切换播放参数，以及直播切换回放等。请注意，频繁切换可能导致异常，切换间隔至少需要 1 秒

```js
player.changePlayUrl(options).then(() => {
  console.log("切换成功");
});
```

options 参数说明

| 参数名       | 类型    | 是否必选 | 默认值       | 描述                                                            |
| :----------- | :------ | :------- | :----------- | :-------------------------------------------------------------- |
| type         | String  | Y        | 无           | 播放地址类型，"live":预览，"rec"：回放；“cloud.rec”：云存储回放 |
| deviceSerial | String  | Y        | 无           | 设备序列号,存在英文字母的设备序列号，字母需为大写               |
| channelNo    | int     | Y        | 无           | 通道号                                                          |
| accessToken  | String  | N        | 初始化时获取 | 授权过程获取的 access_token                                     |
| hd           | boolean | N        | 初始化时获取 | 是否为高清 true-主码流（高清） false-子码流(标清)               |
| validCode    | String  | N        | 初始化时获取 | 设备验证码（加密设备播放需要输入验证码）                        |
| begin        | String  | N        | 初始化时获取 | type 类型为回放有效，开始时间 格式为“YYYYMMDDHHmmss”            |
| end          | String  | N        | 初始化时获取 | type 类型为回放有效，结束时间 格式为 “YYYYMMDDHHmmss”           |

#### 切换模板主题

> 可用于在播放中切换模板主题，请切换播放地址成功后调用

```js
player.Theme.changeTheme(template); // 8.2.0 开始移除 

player.changeTheme(template); // 8.2.0 新增

// 预览切回放场景示例
player.changePlayUrl({ type: "rec" }).then(() => {
  console.log("地址切换成功，开始切换模板主题");
  // player.Theme.changeTheme("pcRec"); // 8.2.0 开始移除
  player.changeTheme("pcRec"); // 8.2.0 新增
});
```

template 参数说明

| 参数名 | 类型   | 描述                              | 是否必选 |
| :----- | :----- | :-------------------------------- | :------- |
| type   | String | 模板名称，详见初始化参数 template | Y        |

#### 开启电子放大

> 建议使用模板，模板中的电子放大功能更全

```js
// 方式1
player.enableZoom();
// 方式2
player.enableZoom().then(() => {
  console.log("开启电子放大成功");
});
```

#### 关闭电子放大

```js
// 方式1
player.closeZoom();
// 方式2
player.closeZoom().then(() => {
  console.log("关闭电子放大成功");
});
```

#### 重置画面宽高

```js
player.resize(width, height); // 8.2.0 开始支持宽高参数为字符串（如 100% , 100vw , 100vh 10em, 10rem 等）
```

#### 鱼眼矫正（软解 开启 [SharedArrayBuffer](https://open.ys7.com/help/1772?h=SharedArrayBuffer)）

```js
// {1, 0}  壁装鱼眼 不矫正
// {1, 1}  壁装360°全景
// {1, 2}  壁装4分屏
// {1, 4}  壁装广角
// {3, 0}  顶装鱼眼 不矫正
// {3, 1}  顶装360°全景
// {3, 4}  顶装4分屏
// {3, 5}  顶装柱状
// 顶装4分屏
player.setFECCorrectType({place: 3 , type：4}, "cavnas1,canvas2,canvas3") // cavnas1,canvas2,canvas3 是分屏是需要的
```

#### 日志设置

```ts
//  interface LoggerOptions {
//   name?: string
//   level?: 'INFO' | 'LOG' | 'WARN' | 'ERROR',
//   showTime?: boolean
//  }
player.setLoggerOptions(options);
```

options 参数说明

| 参数名   | 类型    | 是否必选 | 默认值 | 描述                                                      |
| :------- | :------ | :------- | :----- | :-------------------------------------------------------- |
| name     | string  | N        | 无     | 日志名称标签                                              |
| level    | string  | N        | 无     | 日志等级， 支持 'INFO', 'LOG' , 'WARN' , 'ERROR' 四个等级 |
| showTime | boolean | N        | 无     | 是否展示时间                                              |

## 事件

所有事件名 `EZUIKitPlayer.EVENTS`, 事件监听 player.eventEmitter.on() 和事件取消 player.eventEmitter.off()

#### 流信息事件

流信息事件 `EZUIKitPlayer.EVENTS.streamInfoCB`， 当初始化 streamInfoCBType = 1 时， 流信息事件只在获取到流时触发两次， 当初始化 streamInfoCBType = 0 时，会不停触发返回流信息（会影响性能）

```js
// 监听流信息事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.streamInfoCB, (info) => {
  // 包括 视频信息 音频信息
  console.log("streamInfoCB", info);
});
```

#### 音频信息事件

音频信息事件 `EZUIKitPlayer.EVENTS.audioInfo`

```js
// interface AudioInfo {
//   audioFormatName：string // 音频格式名称
//   audioChannels：number // 音频通道数
//   audioBitsPerSample: number  // 音频采样位数
//   audioSamplesRate：number // 音频采样率
//   audioBitRate: number // 音频码率
// }
// 监听音频信息变化
player.eventEmitter.on(EZUIKitPlayer.EVENTS.audioInfo, (info) => {
  // {"audioFormat":8193,"audioFormatName":"AAC","audioChannels":1,"audioBitsPerSample":16,"audioSamplesRate":16000,"audioBitRate":32000}
  console.log("audioInfo", info);
});
```

备注：如果想一直获取音频信息是否变化，在初始化时这是 streamInfoCBType = 0

#### 视频信息事件

音频信息事件 `EZUIKitPlayer.EVENTS.videoInfo`

```js
// interface VideoInfo {
//   videoFormatName：string // 视频格式名称
//   width：number // 视频宽
//   height: number  // 视频高
//   frameRate：number // 帧率
//   intervalOfIFrame: number // IFrame间隔 （统计最近 5 个 GOP 的平均大小）
// }
// 监听视频信息变化
player.eventEmitter.on(EZUIKitPlayer.EVENTS.videoInfo, (info) => {
  // {"videoFormat":5,"videoFormatName":"H265","width":3840,"height":2160,"frameRate":15,"intervalOfIFrame":0}
  console.log("videoInfo", info);
});
```

备注：如果想一直获取视频信息是否变化，在初始化时这是 streamInfoCBType = 0

#### 截图事件

截图事件 `EZUIKitPlayer.EVENTS.capturePicture`

```js
// interface CapturePictureInfoDate {
//   fileName: string // 图片文件名称
//   base64： string // base64图片字符串
// }

// 监听截图事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.capturePicture, (info) => {
  // {data: CapturePictureInfoDate}
  console.log("capturePictureInfo", info);
});
```

#### 截图事件

截图事件 `EZUIKitPlayer.EVENTS.capturePicture`

```js
// interface CapturePictureInfoData {
//   fileName: string // 图片文件名称
//   base64： string // base64图片字符串
// }

// 监听截图事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.capturePicture, (info) => {
  // {data: CapturePictureInfoData}
  console.log("capturePictureInfo", info);
});
```

#### 清晰度切换事件

截图事件 `EZUIKitPlayer.EVENTS.changeVideoLevel`

```js
// interface VideoLevelData {
//   "name": string, // 清晰度名称
//   "level":2,   // 清晰度级别  0 | 1 | 2 | 3 | 4 | 5 | 6
//   "streamTypeIn":2  // 主子码流  1：主码流 2：子码流
// }
// 监听截图事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.changeVideoLevel, (info) => {
  // {data: VideoLevelData}
  console.log("changeVideoLevel", info);
});
```

#### 打开关闭声音事件

打开声音事件 `EZUIKitPlayer.EVENTS.openSound`

```js
// 监听打开声音事件, 默认音量是 0.8  暂时不支持更改
player.eventEmitter.on(EZUIKitPlayer.EVENTS.openSound, () => {
  // ...
});
```

关闭声音事件 `EZUIKitPlayer.EVENTS.closeSound`

```js
// 监听关闭声音事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.closeSound, () => {
  // ...
});
```

#### 解码资源加载事件

解码资源开始加载事件 `EZUIKitPlayer.EVENTS.decoderLoad`和解码资源加载完成事件 `EZUIKitPlayer.EVENTS.decoderLoaded`

```js
// 监听解码资源开始加载事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.decoderLoad, () => {
  // ...
});
// 监听解码资源加载完成事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.decoderLoaded, () => {
  // ...
});
```

#### 销毁事件

销毁事件 `EZUIKitPlayer.EVENTS.destroy`

```js
// 监听销毁事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.destroy, () => {
  // ...
});
```

#### 全屏相关事件

全屏事件 `EZUIKitPlayer.EVENTS.fullscreen`

```js
// 监听全屏事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.fullscreen, () => {
  // ...
});
```

退出全屏事件 `EZUIKitPlayer.EVENTS.exitFullscreen`

```js
// 监听退出全屏事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.exitFullscreen, () => {
  // ...
});
```

全屏变化事件 `EZUIKitPlayer.EVENTS.fullscreenChange`

```js
// 8.2.0 移除
// interface FullscreenChangeData {
//   "isCurrentFullscreen": boolean, // 全局全屏
//   "isCurrentBrowserFullscreen":boolean // 全局全屏和web 全屏
// }
// 监听全屏变化事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.fullscreenChange, (info) => {
  // {data: FullscreenChangeData}
  console.log("fullscreenChange", info);
});
```

```js
// 8.2.0 新增
// interface FullscreenChangeData {
//    "isCurrentFullscreen":true, // 当前窗口是否全屏
//    "isFullscreen":true, // 页面是否有全屏
//    "isMobile":false,  // 是否是移动端
//    "orientationAngle":0 // 屏幕旋转角度（适用移动端和pad ）
// }
// 监听全屏变化事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.fullscreenChange, (info) => {
  // {data: FullscreenChangeData}
  console.log("fullscreenChange", info);
});
```



#### 首帧渲染事件

首帧渲染事件 `EZUIKitPlayer.EVENTS.firstFrameDisplay`

```js
// 监听首帧渲染事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.firstFrameDisplay, () => {
  // ...
});
```

#### 初始化事件

初始化事件 `EZUIKitPlayer.EVENTS.init`

```js
// 监听初始化事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.init, () => {
  // ...
});
```

#### resize 事件

resize 事件事件 `EZUIKitPlayer.EVENTS.resize`

```js
// 监听resize事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.resize, (data) => {
  // {data: {"width": number,"height":number}} // 8.2.0 开始移除
  // {"width":number,"height":number,"isCurrentFullscreen":true,"orientationAngle":0} // 8.2.0 开始添加
  console.log("resize", data);
});
```

#### 暂停事件

暂停事件 `EZUIKitPlayer.EVENTS.pause`

```js
// 监听暂停事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.pause, () => {
  // ...
});
```

#### 播放事件

播放事件 `EZUIKitPlayer.EVENTS.play`

```js
// 监听播放事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.play, () => {
  // ...
});
```

#### 恢复播放事件

恢复播放事件 `EZUIKitPlayer.EVENTS.resume`， 仅支持回放

```js
// 监听恢复播放事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.resume, () => {
  // ...
});
```

#### seek 事件

seek 事件 `EZUIKitPlayer.EVENTS.seek`， 仅支持回放

```js
// 监听seek事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.seek, () => {
  // ...
});
```

#### 停止播放事件

停止播放事件 `EZUIKitPlayer.EVENTS.stop`

```js
// 监听停止播放事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.stop, () => {
  // ...
});
```

#### 设置封面事件

设置封面事件 `EZUIKitPlayer.EVENTS.setPoster`

```js
// 监听设置封面事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.setPoster, () => {
  // ...
});
```

#### 设置镜像反转事件

设置镜像反转事件 `EZUIKitPlayer.EVENTS.setMirrorFlip`

```js
// 监听设置镜像反转事件, 不判断是否成功
player.eventEmitter.on(EZUIKitPlayer.EVENTS.setMirrorFlip, (data) => {
  // ...
});
```

#### 主题重置事件

主题重置事件 `EZUIKitPlayer.EVENTS.reSetTheme`

```js
// 监听主题重置事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.reSetTheme, () => {
  // ...
});
```

8.2.0 开始不在支持

#### 回放时间变化事件

回放时间变化事件 `EZUIKitPlayer.EVENTS.recTimeChange`

```js
// 监听回放时间变化事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.recTimeChange, () => {
  // ...
});
```

#### http 接口相关事件

获取云存储回片段事件 `EZUIKitPlayer.EVENTS.http.getCloudRecTimes`

```js
// 监听获取云存储回片段事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.http.getCloudRecTimes, (list) => {
  // {data: {"width": number,"height":number}}
  console.log("list", list);
});
```

获取云录制回片段事件 `EZUIKitPlayer.EVENTS.http.getCloudRecordTimes`

```js
// 监听获取云录制回片段事件
player.eventEmitter.on(
  EZUIKitPlayer.EVENTS.http.getCloudRecordTimes,
  (list) => {
    // {data: {"width": number,"height":number}}
    console.log("list", list);
  }
);
```

获取本地录制回片段事件 `EZUIKitPlayer.EVENTS.http.getLocalRecTimes`

```js
// 监听获取本地录制回片段事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.http.getLocalRecTimes, (list) => {
  // {data: {"width": number,"height":number}}
  console.log("list", list);
});
```

获取设备信息事件 `EZUIKitPlayer.EVENTS.http.getDeviceInfo`

```js
// 监听获取设备信息事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.http.getDeviceInfo, (info) => {
  // {"deviceSerial":"BC7799091","deviceName":"前端设备勿动 C6Wi(BC7799091)","localName":"C6Wi(BC7799091)","model":"CS-C6Wi-8D8W2DF","status":1,"defence":0,"isEncrypt":0,"alarmSoundMode":2,"offlineNotify":0,"category":"C6Wi","parentCategory":"IPC","updateTime":1741763026000,"netType":"wireless","signal":"0%","riskLevel":0,"netAddress":"125.121.197.61"}
  console.log("info", info);
});
```

获取设备通道信息事件 `EZUIKitPlayer.EVENTS.http.getDeviceList`

```js
// 监听获取设备信息事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.http.getDeviceList, (info) => {
  // {"deviceSerial":"BC7799091","deviceName":"前端设备勿动 C6Wi(BC7799091)","localName":"C6Wi(BC7799091)","model":"CS-C6Wi-8D8W2DF","status":1,"defence":0,"isEncrypt":0,"alarmSoundMode":2,"offlineNotify":0,"category":"C6Wi","parentCategory":"IPC","updateTime":1741763026000,"netType":"wireless","signal":"0%","riskLevel":0,"netAddress":"125.121.197.61"}
  console.log("info", info);
});
```

设置清晰度事件 `EZUIKitPlayer.EVENTS.http.setVideoLevel`

```js
// 监听设置清晰度事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.http.setVideoLevel, () => {
  // ....
});
```

#### 倍速相关事件

倍速增加事件 `EZUIKitPlayer.EVENTS.fast`

```js
// 监听倍速增加事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.fast, ({ data }) => {
  console.log(data);
});
```

倍速下降事件 `EZUIKitPlayer.EVENTS.slow`

```js
// 监听倍速下降事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.slow, ({ data }) => {
  console.log(data);
});
```

倍速变化事件 `EZUIKitPlayer.EVENTS.speedChange`

```js
// 监听倍速变化事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.speedChange, (speed) => {
  console.log(speed);
});
```

#### 对讲相关事件

开启对讲事件 `EZUIKitPlayer.EVENTS.startTalk`

```js
// 监听开启对讲事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.startTalk, () => {
  // ...
});
```

关闭对讲事件 `EZUIKitPlayer.EVENTS.stopTalk`

```js
// 监听关闭对讲事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.stopTalk, () => {
  // ...
});
```

对讲音量变化事件 `EZUIKitPlayer.EVENTS.volumeChange`

```js
// 监听对讲音量变化事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.volumeChange, () => {
  // ...
});
```

对讲开启成功事件 `EZUIKitPlayer.EVENTS.talkSuccess`

```js
// 监听对讲开启成功事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.talkSuccess, () => {
  // ...
});
```

对讲开启失败事件 `EZUIKitPlayer.EVENTS.talkError`

```js
// 监听对讲开启失败事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.talkError, (error) => {
  // ...
  console.error("talkError", error);
});
```

#### 录制相关事件

开启录制事件 `EZUIKitPlayer.EVENTS.startSave`

```js
// 监听开启录制事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.startSave, () => {
  // ...
});
```

结束录制事件 `EZUIKitPlayer.EVENTS.stopSave`

```js
// 监听结束录制事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.stopSave, ({ data }) => {
  // {"url":"blob:https://test12openstatic.ezv-test.com/80401d8c-3b5b-45d9-ba47-a79153fabbe9","file":{}}
  console.log(data);
});
```

#### 电子放大相关事件

打开电子放大事件 `EZUIKitPlayer.EVENTS.zoom.openZoom`

```js
// 监听打开电子放大事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.zoom.openZoom, () => {
  // ....
});
```

关闭电子放大事件 `EZUIKitPlayer.EVENTS.zoom.closeZoom`

```js
// 监听关闭电子放大事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.zoom.closeZoom, () => {
  // ....
});
```

电子放大变化事件 `EZUIKitPlayer.EVENTS.zoom.onZoomChange`

```js
// 监听电子放大变化事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.zoom.onZoomChange, (info) => {
  // {"zoom": string,"reset"?:boolean}
  console.log("onZoomChange", info);
});
```

#### 云台控制相关事件

打开云台控制控件事件 `EZUIKitPlayer.EVENTS.ptz.openPtz`

```js
// 监听开云台控制控件事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.ptz.openPtz, () => {
  // ...
});
```

关闭云台控制控件事件 `EZUIKitPlayer.EVENTS.ptz.openPtz`

```js
// 监听关闭云台控制控件事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.ptz.closePtz, () => {
  // ...
});
```

云台控制速度变化事件 `EZUIKitPlayer.EVENTS.ptz.ptzSpeedChange`

```js
// 监听关闭云台控制控件事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.ptz.ptzSpeedChange, () => {
  // ...
});
```

点击云台控制控件按钮事件 `EZUIKitPlayer.EVENTS.ptz.ptzBtnClick`

```js
// 监听点击云台控制控件按钮事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.ptz.ptzBtnClick, () => {
  // ...
});
```

点击云台控制控件方向事件 `EZUIKitPlayer.EVENTS.ptz.ptzDirection`

```js
// 监听点击云台控制控件方向事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.ptz.ptzDirection, () => {
  // ...
});
```

#### 时间轴

时间轴控件刻度宽度变化事件 `EZUIKitPlayer.EVENTS.timeLine.timeWidthChange`

```js
// 监听时间轴刻度宽度变化事件
player.eventEmitter.on(
  EZUIKitPlayer.EVENTS.timeLine.timeWidthChange,
  (widthType) => {
    // ...
    console.log("timeWidthChange", widthType); // 0 | 1 | 2 | 3
  }
);
```

#### 日期选择器相关事件

日期选择器打开事件 `EZUIKitPlayer.EVENTS.date.openDatePanel`

```js
// 监听日期选择器打开事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.date.openDatePanel, () => {
  // ...
});
```

日期选择器关闭事件 `EZUIKitPlayer.EVENTS.date.closeDatePanel`

```js
// 监听日期选择器关闭事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.date.closeDatePanel, () => {
  // ...
});
```

日期选择器日期切换事件 `EZUIKitPlayer.EVENTS.date.recStartTimeChange`

```js
// 监听日期选择器日期切换事件
player.eventEmitter.on(EZUIKitPlayer.EVENTS.date.recStartTimeChange, () => {
  // ...
});
```

<!-- | 事件名 （Event）    | 返回值                                                                                                    | 描述 Description         |
| :------------------ | :-------------------------------------------------------------------------------------------------------- | :----------------------- | -->
<!-- | changePlayUrl       | boolean                                                                                                   | N 示时间                 | -->
<!-- | changeZoomType      | boolean                                                                                                   | N 示时间                 | -->
<!-- | close3DZoom         | boolean                                                                                                   | N 示时间                 | -->
<!-- | enable3DZoom        | boolean                                                                                                   | N 示时间                 | -->
<!-- | getDeviceCapacity   | boolean                                                                                                   | N 示时间                 | -->
<!-- | getOSDTime          | boolean                                                                                                   | N 示时间                 | -->
<!-- | getPlayRate         | boolean                                                                                                   | N 示时间                 | -->
<!-- | getPtzStatus        | boolean                                                                                                   | N 示时间                 | -->
<!-- | getVideoLevel       | boolean                                                                                                   | N 示时间                 | -->
<!-- | getVideoLevelList   | boolean                                                                                                   | N 示时间                 | -->
