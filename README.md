# [EZUIKit-JavaScript-npm][ezuikit-js]

![Download](https://img.shields.io/npm/dm/ezuikit-js.svg)
![Version](https://img.shields.io/npm/v/ezuikit-js.svg)
![License](https://img.shields.io/npm/l/ezuikit-js.svg)
![Build Demos](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/workflows/build-demos/badge.svg)

> 轻应用 npm 版本，降低接入难度，适配自定义 UI，适配主流框架

> 低延时预览，云存储回放，SD 卡回放

> 功能 API 丰富，如：播放控制，音频控制，视频截图，实时获取视频 OSDTime，视频录制，设备对讲，电子放大，全屏等

> 从 v8.1.2 开始支持 ESM, 支持按需加载

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
  url: "ezopen://open.ys7.com/BD3957004/1.live",
  width: 600,
  height: 400,
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
  accessToken:
    "at.3bvmj4ycamlgdwgw1ig1jruma0wpohl6-48zifyb39c-13t5am6-yukyi86mz",
  url: "ezopen://open.ys7.com/BD3957004/1.rec",
});
```

#### 非正式版说明

alpha（功能测试）、beta（集成测试）为我们的非正式版本，可能存在功能或使用上的问题，若您遇到了任何问题，欢迎向我们反馈。

非正式版本没有 CDN 资源，使用时需要配置 `staticPath`，引用本地的解码库资源。

### 使用示例

> 如果使用原生 js，可参考 demos => [base-demo](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/tree/master/demos/base-demo)

> 如果使用 react，可参考 demos => [react-demo](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/tree/master/demos/react-demo)

> 如果使用 react + vite，可参考 demos => [with-react-vite](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/tree/master/demos/with-react-vite)

> 如果使用 vue2，可参考 demos => [vue-demo](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/tree/master/demos/vue-demo)

> 如果使用 vue3，可参考 demos => [vue3-demo](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/tree/master/demos/vue3-demo)

#### tips

为方便开发者快速接入

我们提供了测试 accessToken,测试播放地址，并提供了几种常用场景使用示例。你可以通过使用示例，使用测试播放地址，测试 accessToken，在你的应用快速接入。

<b>测试播放地址：</b> ezopen://open.ys7.com/BD3957004/1.live

你可以通过以下地址获取到测试 accessToken <a href="https://open.ys7.com/jssdk/ezopen/demo/token" target="_blank">获取测试 accessToken</a> 用来播放上述测试播放地址。
当前设备有可能下线或被移除了， 如果自己有设备优先使用自己的设备进行测试。

### 轻应用 - 海外版本

> 轻应用支持向接入萤石云海外环境的设备发起取流播放，需要在初始化时配置海外服务域名，示例：

```js
import { EZUIKitPlayer } from "ezuikit-js";

const player = new EZUIKitPlayer({
  id: "playWind",
  width: 600,
  height: 400,
  template: "pcLive",
  url: "",
  accessToken: "",
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

> 1. 快速创建视频播放页面

&emsp;&emsp;&emsp;&emsp;<b>基本使用：</b> <a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/index.html" target="_blank">基本使用示例</a>

> 2. 前往[开放平台轻应用模板管理页](https://open.ys7.com/console/ezuikit/template.html)创建一个主题，可以动态配置你的播放主题，控件，示例展示了获取一个主题后使用示例。

&emsp;&emsp;&emsp;&emsp;<b>自定义主题：</b> <a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/template.html" target="_blank">自定义主题示例</a>

> 3. 你可以本地创建一个主题配置，可以本地配置你的播放主题，控件，示例展示了本地配置项使用示例。

&emsp;&emsp;&emsp;&emsp;<b>本地主题配置：</b> <a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/themeData.html" target="_blank">本地主题配置示例</a>

> 4. 我们提供了一些通用场景的主题，PC 端预览，PC 端回放，移动端预览，移动端回放，你也可以直接使用。

&emsp;&emsp;&emsp;&emsp;<b>PC 端预览-固定主题：</b>
<a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/pcLive.html" target="_blank">PC 端预览-固定主题示例</a>

&emsp;&emsp;&emsp;&emsp;<b>PC 端回放-固定主题：</b>
<a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/pcRec.html" target="_blank">PC 端回放-固定主题示例</a>

&emsp;&emsp;&emsp;&emsp;<b>移动端预览-固定主题：</b>
<a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/mobileLive.html" target="_blank">移动端预览-固定主题示例</a>

&emsp;&emsp;&emsp;&emsp;<b>移动端回放-固定主题：</b>
<a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/mobileRec.html" target="_blank">移动端回放-固定主题示例</a>

> 同一个页面播放多个视频，可以参考：

&emsp;&emsp;&emsp;&emsp;<b>单页面多实例(视频多窗口)：</b>
<a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/multi.html" target="_blank">单页面多实例(视频多窗口)示例</a>

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

初始化参数 url 值为：<br/>
ezopen://open.ys7.com/${设备序列号}/{通道号}.rec?begin=yyyyMMddhhmmss

##### 云存储回放

初始化参数 url 值为：<br/>
ezopen://open.ys7.com/${设备序列号}/{通道号}.cloud.rec?begin=yyyyMMddhhmmss
视频 ezopen 协议播放地址 详见：<a href="https://open.ys7.com/help/23" target="_blank">ezopen 协议</a> </td><td>Y</td></tr>

<tr><td>audio</td><td>boolean</td><td>是否默认开启声音 true：打开（默认） false：关闭    </td><td>N</td></tr>
<tr><td>width</td><td>int</td><td>视频宽度，默认值为容器容器DOM宽度    </td><td>Y</td></tr>
<tr><td>height</td><td>int</td><td>视频高度，默认值为容器容器DOM高度</td><td>Y</td></tr>
<tr><td>staticPath</td><td>string</td><td>设置静态资源地址, 自定义可以自行下载 `ezuikit_static`放置在自己的服务器下， 设置 {staticPath: "/ezuikit_static"} </td><td>N</td></tr>
<tr><td>template</td><td>String</td><td>

<table style="display:inline-block;width:700px">
<tr><th>模板值</th><th>描述</th></tr>

<tr><td>simple</td><td>极简版 *固定模板 仅包含视频播放窗口，创建实例后通过方法集控制视频播<br />放相关功能</td></tr>

<tr><td>standard</td><td>标准版;   *固定模板 包含视频窗口，叠加了停止，录制，全屏控件（通过<br />控件快捷调用方法集合控制视频播放相关功能，但你仍然可以通过方法集直接控制视频播放相关功<br />能。下同）</td></tr>

<tr><td>security</td><td>安防版(预览回放);  *固定模板 包含视频窗口，叠加了录制，全屏控件，<br />标清/高清切换，预览录制切换控件*</td></tr>
<tr><td>voice</td><td>语音版;  *固定模板 包含视频窗口，叠加了录制，全屏控件，语音播报，语音<br />对讲控件*</td></tr>
<tr><td>pcLive</td><td>    *固定模板 按钮列表，颜色，底部头部背景色固定，可用于pc端预览，如需<br />修改按钮配置，头部底部背景色，可参考 {{自定义themeId}}，或者使用<br />themeData本地配置*</td></tr>
<tr><td>pcRec</td><td>    *固定模板 按钮列表，颜色，底部头部背景色固定， 可用于pc端回放，如需<br />修改按钮配置，头部底部背景色，可参考 {{自定义themeId}}，或者使用themeData<br />本地配置*</td></tr>
<tr><td>mobileLive</td><td>    *固定模板  按钮列表，颜色，底部头部背景色固定，可用于移动端预<br />览，如需修改按钮配置，头部底部背景色，可参考 {{自定义themeId}}，或者使用themeData<br />本地配置*</td></tr>
<tr><td>mobileRec</td><td>*固定模板 按钮列表，颜色，底部头部背景色固定， 可用于移动端回放，<br />如需修改按钮配置，头部底部背景色，可参考 {{自定义themeId}}，或者使用themeData<br />本地配置*</td></tr>
<tr><td>自定义themeId</td><td>自定义主题，<a href="https://open.ys7.com/console/ezuikit/template.html" target="_blank">前往开放平台控制台配置页面获取</a><br />（v0.6.2版本及以上支持，建议使用 自定义themeId，或者使用themeData本地<br />配置）;</td></tr>
</table>

</td><td>N</td></tr>
<tr><td>themeData</td><td>Object</td><td>
themeData将主题数据本地化，设置本地数据，需要删除template参数 <br /> 
你可以通过themeData修改按钮位置，颜色，头部底部颜色等配置。

配置示例：

<pre><code>

{
    "autoFocus": 5,
    "poster":"https://resource.eziot.com/group1/M00/00/89/CtwQEmLl8r-AZU7wAAETKlvgerU237.png",
    "header": {
        "color": "#1890ff",
        "activeColor": "#FFFFFF",
        "backgroundColor": "#000000",
        "btnList": [
            {
                "iconId": "deviceID",
                "part": "left",
                "defaultActive": 0,
                "memo": "顶部设备名称",
                "isrender": 1
            },
            {
                "iconId": "deviceName",
                "part": "left",
                "defaultActive": 0,
                "memo": "顶部设备ID",
                "isrender": 1
            },
            {
                "iconId": "cloudRec",
                "part": "right",
                "defaultActive": 0,
                "memo": "头部云存储回放",
                "isrender": 0
            },
            {
                "iconId": "rec",
                "part": "right",
                "defaultActive": 0,
                "memo": "头部本地回放",
                "isrender": 0
            }
        ]
    },
    "footer": {
        "color": "#FFFFFF",
        "activeColor": "#1890FF",
        "backgroundColor": "#00000021",
        "btnList": [
            {
                "iconId": "play",
                "part": "left",
                "defaultActive": 1,
                "memo": "播放",
                "isrender": 1
            },
            {
                "iconId": "capturePicture",
                "part": "left",
                "defaultActive": 0,
                "memo": "截屏按钮",
                "isrender": 1
            },
            {
                "iconId": "sound",
                "part": "left",
                "defaultActive": 0,
                "memo": "声音按钮",
                "isrender": 1
            },
            {
                "iconId": "pantile",
                "part": "left",
                "defaultActive": 0,
                "memo": "云台控制按钮",
                "isrender": 1
            },
            {
                "iconId": "recordvideo",
                "part": "left",
                "defaultActive": 0,
                "memo": "录制按钮",
                "isrender": 1
            },
            {
                "iconId": "talk",
                "part": "left",
                "defaultActive": 0,
                "memo": "对讲按钮",
                "isrender": 1
            },
            {
                "iconId": "zoom",
                "part": "left",
                "defaultActive": 0,
                "memo": "电子放大",
                "isrender": 1
            },
            {
                "iconId": "hd",
                "part": "right",
                "defaultActive": 0,
                "memo": "清晰度切换按钮",
                "isrender": 1
            },
            {
                "iconId": "webExpend",
                "part": "right",
                "defaultActive": 0,
                "memo": "网页全屏按钮",
                "isrender": 1
            },
            {
                "iconId": "expend",
                "part": "right",
                "defaultActive": 0,
                "memo": "全局全屏按钮",
                "isrender": 1
            }
        ]
    }
}
</code></pre>

</td><td>N</td></tr>
<tr><td>plugin</td><td>String</td><td>按需加载插件，可选值： talk：对讲，示例：plugin:["talk"] </td><td>N</td></tr>
<tr><td>handleSuccess</td><td>function</td><td>自动播放成功回调</td><td>N</td></tr>
<tr><td>handleError</td><td>function</td><td>错误回调</td><td>N</td></tr>
<tr><td>seekFrequency </td><td>function</td><td>为避免频繁拖动播放异常，可设置模板回放时间轴拖动防抖间隔，默认值为2000（2秒），可取2000（2秒），3000（3秒），4000（4秒），5000（5秒）</td><td>N</td></tr>
<tr><td>language</td><td>String</td><td>多语言 （zh | en）, 默认zh (v8.0.8版本及以上支持)</td><td>N</td></tr>
<tr><td>debugDownloadData</td><td>boolean</td><td>下载原始码流， 调试码流使用, 默认 false (v8.1.1版本及以上支持)</td><td>N</td></tr>
<tr><td>disableRenderPrivateData</td><td>boolean</td><td>禁止渲染私有数据(如智能分析， 移动侦测， 火点信息等), 默认 false (v8.1.1版本及以上支持)</td><td>N</td></tr>
</table>

### 方法调用

> 同步方法（方式 1）
> 方法支持通过 promise 回调，可通过回调方式执行下一步动作（方式 2）。

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

> 因录制解码库加载限制，录制库加载需要 3S 秒左右，请保证录制时长需要大于 5 秒。
> 录制文件需要使用播放器，播放器下载地址 <a href="https://service.ys7.com/downloadInfoSite/admin">播放器下载</a>

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
player.fullScreen();
```

#### 取消全屏

```js
player.cancelFullScreen();
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
player.Theme.changeTheme(template);

// 预览切回放场景示例
player.changePlayUrl({ type: "rec" }).then(() => {
  console.log("地址切换成功，开始切换模板主题");
  player.Theme.changeTheme("pcRec");
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
player.reSize(width, height);
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
