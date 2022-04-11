#  [EZUIKit-JavaScript-npm][ezuikit-js]
>轻应用npm版本，降低接入难度，适配自定义UI，适配主流框架

> 低延时预览，云存储回放，SD卡回放

> 功能API丰富，如：播放控制，音频控制，视频截图，实时获取视频OSDTime，视频录制，设备对讲，电子放大，全屏等



### 获取ezuikit-js

```
$ npm install ezuikit-js
```
### 引入ezuikit-js

```
import  EZUIKit from 'ezuikit-js';
```

#### 如果你使用原生方法,可以通过标签引用
```
  <script src="./ezuikit.js"></script>
```

### 开始使用 - 初始化
>基本使用

创建DOM

```
  <div id="video-container"></div>
```

## 播放器初始化
### 直播
```
    var player = new EZUIKit.EZUIKitPlayer({
      id: 'video-container', // 视频容器ID
      accessToken: 'at.3bvmj4ycamlgdwgw1ig1jruma0wpohl6-48zifyb39c-13t5am6-yukyi86mz',
      url: 'ezopen://open.ys7.com/G39444019/1.live',
      width: 600,
      height: 400,
    })
```
### 回放
```
    var player = new EZUIKit.EZUIKitPlayer({
      id: 'video-container', // 视频容器ID
      width: 600,
      height: 400,
      accessToken: 'at.3bvmj4ycamlgdwgw1ig1jruma0wpohl6-48zifyb39c-13t5am6-yukyi86mz',
      url: 'ezopen://open.ys7.com/G39444019/1.rec'
    })
```
#### tips
为方便开发者快速接入  

我们提供了测试accessToken,测试播放地址，并提供了几种常用场景使用示例。你可以通过使用示例，使用测试播放地址，测试accessToken，在你的应用快速接入。  

<b>测试播放地址：</b> ezopen://open.ys7.com/G39444019/1.live  

你可以通过以下地址获取到测试accessToken <a href="https://open.ys7.com/jssdk/ezopen/demo/token" target="_blank">获取测试accessToken</a> 用来播放上述测试播放地址。 

### 使用示例
<b>基本使用：</b>  <a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/base.html" target="_blank">基本使用示例</a>  

<b>自定义主题：</b>  <a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/template.html" target="_blank">自定义主题示例</a>  

<b>本地主题配置：</b>  <a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/themeData.html" target="_blank">本地主题配置示例</a>  

<b>PC端预览-固定主题：</b>
<a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/pcLive.html" target="_blank">PC端预览-固定主题示例</a>  

<b>PC端回放-固定主题：</b>
<a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/pcRec.html" target="_blank">PC端回放-固定主题示例</a>  

<b>移动端预览-固定主题：</b>
<a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/mobileLive.html" target="_blank">移动端预览-固定主题示例</a>  

<b>移动端回放-固定主题：</b>
<a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/mobileRec.html" target="_blank">移动端回放-固定主题示例</a>  

<b>单页面多实例(视频多窗口)：</b>
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
##### sd卡回放
初始化参数 url值为：<br/>
ezopen://open.ys7.com/${设备序列号}/{通道号}.rec?begin=yyyyMMddhhmmss
##### 云存储回放
初始化参数 url值为：<br/>
ezopen://open.ys7.com/${设备序列号}/{通道号}.cloud.rec?begin=yyyyMMddhhmmss
视频ezopen协议播放地址 详见：<a href="http://open.ys7.com/doc/zh/readme/ezopen.html" target="_blank">ezopen协议</a>	</td><td>Y</td></tr>
<tr><td>audio</td><td>int</td><td>是否默认开启声音 1：打开（默认） 0：关闭	</td><td>N</td></tr>
<tr><td>width</td><td>int</td><td>视频宽度，默认值为容器容器DOM宽度	</td><td>Y</td></tr>
<tr><td>height</td><td>int</td><td>视频高度，默认值为容器容器DOM高度</td><td>Y</td></tr>
<tr><td>template</td><td>String</td><td>  


<table style="display:inline-block;width:700px">
<tr><th>模板值</th><th>描述</th></tr>

<tr><td>simple</td><td>极简版 *固定模板 仅包含视频播放窗口，创建实例后通过方法集控制视频播<br />放相关功能</td></tr>

<tr><td>standard</td><td>标准版;   *固定模板 包含视频窗口，叠加了停止，录制，全屏控件（通过<br />控件快捷调用方法集合控制视频播放相关功能，但你仍然可以通过方法集直接控制视频播放相关功<br />能。下同）</td></tr>

<tr><td>security</td><td>安防版(预览回放);  *固定模板 包含视频窗口，叠加了录制，全屏控件，<br />标清/高清切换，预览录制切换控件*</td></tr>
<tr><td>voice</td><td>语音版;  *固定模板 包含视频窗口，叠加了录制，全屏控件，语音播报，语音<br />对讲控件*</td></tr>
<tr><td>pcLive</td><td>	*固定模板 按钮列表，颜色，底部头部背景色固定，可用于pc端预览，如需<br />修改按钮配置，头部底部背景色，可参考 {{自定义themeId}}，或者使用<br />themeData本地配置*</td></tr>
<tr><td>pcRec</td><td>	*固定模板 按钮列表，颜色，底部头部背景色固定， 可用于pc端回放，如需<br />修改按钮配置，头部底部背景色，可参考 {{自定义themeId}}，或者使用themeData<br />本地配置*</td></tr>
<tr><td>mobileLive</td><td>	*固定模板  按钮列表，颜色，底部头部背景色固定，可用于移动端预<br />览，如需修改按钮配置，头部底部背景色，可参考 {{自定义themeId}}，或者使用themeData<br />本地配置*</td></tr>
<tr><td>mobileRec</td><td>*固定模板 按钮列表，颜色，底部头部背景色固定， 可用于移动端回放，<br />如需修改按钮配置，头部底部背景色，可参考 {{自定义themeId}}，或者使用themeData<br />本地配置*</td></tr>
<tr><td>{{自定义themeId}}</td><td>（建议使用）开放平台提供了查询账号下主题列表，增加主题<br />，修改主题，删除主题接口。<br />你可以通过调用开放平台提供的接口自定义创建多个主题，根据主题Id动<br />态渲染头部，底部样式，按钮隐藏显示，排布及按钮样式<br />
<a href="https://resource.eziot.com/group2/M00/00/79/CtwQFmI8d_mAC8-eAAA1PBGvsds71.json" target="_blank">接口示例下载（请导入postman查看示例）</a>
</td></tr>
<tr><td>theme</td><td>自定义主题，<a href="https://open.ys7.com/console/ezopenIframe.html" target="_blank">开放平台控制台配置</a><br />（v0.3.0版本及以上支持，建议使用 自定义themeId，或者使用themeData本地<br />配置）;</td></tr>
</table>

</td></tr>
<tr><td>themeData</td><td>Object</td><td>
themeData将主题数据本地化，设置本地数据，需要删除template参数 <br /> 
你可以通过themeData修改按钮位置，颜色，头部底部颜色等配置。  

配置示例：  

<pre><code>

{
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
                "memo": "顶部设备ID",
                "isrender": 0
            },
            {
                "iconId": "rec",
                "part": "right",
                "defaultActive": 0,
                "memo": "顶部设备ID",
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
<tr><td>poster</td><td>String</td><td>视频默认封面 版本号> v0.4.6 </td><td>N</td></tr>
</table>


### 方法调用
> 同步方法（方式1）
> 方法支持通过promise回调，可通过回调方式执行下一步动作（方式2）。

#### 开始播放
```
  // 方式1
  player.play();
  // 方式2
  player.play()
  .then(()=>{
    console.log("执行播放成功后其他动作");
  });
```
#### 停止播放

```
  // 方式1
  player.stop();
  // 方式2
  player.stop()
  .then(()=>{
    console.log("执行停止成功后其他动作");
  });
```
#### 开启声音

```
  // 方式1
  player.openSound();
  // 方式2
  player.openSound()
  .then(()=>{
    console.log("执行开启声音成功后其他动作");
  });
```
#### 开始录制

```
  // 方式1
  player.startSave("唯一文件名");
  // 方式2
  player.startSave("唯一文件名")
  .then(()=>{
    console.log("执行开始录制成功后其他动作");
  });
```
#### 停止录制并下载文件

```
  // 方式1
  player.stopSave();
  // 方式2
  player.stopSave()
  .then(()=>{
    console.log("执行停止录制成功后其他动作");
  });
```
#### 抓图

```
  // 方式1 - 下载到本地
  player.capturePicture("文件名");
  // 方式2 - 返回base64格式
  const capCallback = (data) => {
    console.log("data",data)
  }
  player.capturePicture('default',capCallback)
```
#### 开始对讲

```
  player.startTalk();
```

#### 结束对讲

```
  player.stopTalk();
```

#### 全屏

```
  player.fullScreen();
```
#### 取消全屏

```
  player.cancelFullScreen();
```
#### 获取OSD时间

```
   player.getOSDTime()
  .then((time)=>{
    console.log("获取到的当前播放时间", time);
  });
```

#### 切换地址播放

> 可用于在播放中切换设备，切换播放参数，以及直播切换回放等

```
  player.changePlayUrl(options)
  .then(()=>{
    console.log("切换成功")
  });
```
options参数说明

|参数名|类型|描述|是否必选|
|:--|:--|:--|:--|
|type|	String| 播放地址类型，"live":预览，"rec"：回放；“cloud.rec”：云存储回放|	Y|
|accessToken|	String|	授权过程获取的access_token|	Y|
|deviceSerial    | String    |  设备序列号,存在英文字母的设备序列号，字母需为大写   | Y |
|channelNo    | int    | 通道号    | Y |
|hd    | boolean    | 是否为高清 true-主码流（高清） false-子码流(标清)   | Y |
|validCode	|String|	设备验证码（加密设备播放需要输入验证码）	|Y|
|begin|	String	| type类型为回放有效，开始时间 格式为“YYYYMMDDHHmmss”	|N|
|end|	String	| type类型为回放有效，结束时间 格式为 “YYYYMMDDHHmmss”	|N|

#### 设置封面

>你可以在初始化时，通过参数poster设置默认封面
>实例初始化后可以调用设置封面方法再次更改封面

```
  player.setPoster(pictureUrl)
  .then(()=>{
    console.log("更改封面成功");
  });
```

#### 开启电子放大

```
  // 方式1
  player.enableZoom();
  // 方式2
  player.enableZoom()
  .then(()=>{
    console.log("开启电子放大成功");
  });
```
#### 关闭电子放大

```
  // 方式1
  player.closeZoom();
  // 方式2
  player.closeZoom()
  .then(()=>{
    console.log("关闭电子放大成功");
  });
```

#### 重置画面宽高

```
  player.reSize(width, height);
```

### 使用示例

> 如果使用原生js，可参考demos => base-demo

> 如果使用react，可参考demos => react-demo

> 如果使用vue，可参考demos => vue-demo
