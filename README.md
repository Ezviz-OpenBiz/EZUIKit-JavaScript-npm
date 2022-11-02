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
import EZUIKit from 'ezuikit-js';
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

#### 最佳实践tips

1. 我们在v0.6.2及以上版本持用户通过开启谷歌实验室特性启动多线程解码，多线程模式将大大提升解码效率，降低解码内存消耗。  

>>[开启多线程方式1](https://open.ys7.com/help/384)  (https://open.ys7.com/help/384)

>>[开启多线程方式2](https://open.ys7.com/help/385)(https://open.ys7.com/help/385)  

2. 视频解码库默认从开放平台远程拉取，你可以将解码库放到本地或者你的服务内，可以提升加载解码库速度。 

 >> <b>使用本地解码库提升加载速度</b>  <a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/localDecoder.html" target="_blank">本地解码库示例</a> 

### 使用示例
> 1. 快速创建视频播放页面  

&emsp;&emsp;&emsp;&emsp;<b>基本使用：</b>  <a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/base.html" target="_blank">基本使用示例</a>  

> 2. 前往[开放平台轻应用模板管理页](https://open.ys7.com/console/ezuikit/template.html)创建一个主题，可以动态配置你的播放主题，控件，示例展示了获取一个主题后使用示例。  

&emsp;&emsp;&emsp;&emsp;<b>自定义主题：</b>  <a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/template.html" target="_blank">自定义主题示例</a>  

> 3. 你可以本地创建一个主题配置，可以本地配置你的播放主题，控件，示例展示了本地配置项使用示例。  

&emsp;&emsp;&emsp;&emsp;<b>本地主题配置：</b>  <a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/themeData.html" target="_blank">本地主题配置示例</a>  

> 4. 我们提供了一些通用场景的主题，PC端预览，PC端回放，移动端预览，移动端回放，你也可以直接使用。  


&emsp;&emsp;&emsp;&emsp;<b>PC端预览-固定主题：</b>
<a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/pcLive.html" target="_blank">PC端预览-固定主题示例</a>  

&emsp;&emsp;&emsp;&emsp;<b>PC端回放-固定主题：</b>
<a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/pcRec.html" target="_blank">PC端回放-固定主题示例</a>  

&emsp;&emsp;&emsp;&emsp;<b>移动端预览-固定主题：</b>
<a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/mobileLive.html" target="_blank">移动端预览-固定主题示例</a>  

&emsp;&emsp;&emsp;&emsp;<b>移动端回放-固定主题：</b>
<a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/mobileRec.html" target="_blank">移动端回放-固定主题示例</a>  

>同一个页面播放多个视频，可以参考：  

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
##### sd卡回放
初始化参数 url值为：<br/>
ezopen://open.ys7.com/${设备序列号}/{通道号}.rec?begin=yyyyMMddhhmmss
##### 云存储回放
初始化参数 url值为：<br/>
ezopen://open.ys7.com/${设备序列号}/{通道号}.cloud.rec?begin=yyyyMMddhhmmss
视频ezopen协议播放地址 详见：<a href="http://open.ys7.com/doc/zh/readme/ezopen.html" target="_blank">ezopen协议</a>	</td><td>Y</td></tr>
<tr><td>audio</td><td>boolean</td><td>是否默认开启声音 true：打开（默认） false：关闭	</td><td>N</td></tr>
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
<tr><td>自定义themeId</td><td>自定义主题，<a href="https://open.ys7.com/console/ezuikit/template.html" target="_blank">前往开放平台控制台配置页面获取</a><br />（v0.6.2版本及以上支持，建议使用 自定义themeId，或者使用themeData本地<br />配置）;</td></tr>
</table>

</td></tr>
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
<tr><td>seekFrequency </td><td>function</td><td>为避免频繁拖动播放异常，可设置模板回放时间轴拖动防抖间隔，默认值为2000（2秒），可取2000（2秒），3000（3秒），4000（4秒），5000（5秒）</td><td>N</td></tr>
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
> 因录制解码库加载限制，录制库加载需要3S秒左右，请保证录制时长需要大于5秒。
> 录制文件需要使用播放器，播放器下载地址 <a href="https://service.ys7.com/downloadInfoSite/admin">播放器下载</a>
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

> 可用于在播放中切换设备，切换播放参数，以及直播切换回放等。请注意，频繁切换可能导致异常，切换间隔至少需要1秒

```
  player.changePlayUrl(options)
  .then(()=>{
    console.log("切换成功")
  });
```
options参数说明

|参数名|类型|是否必选|默认值|描述|
|:--|:--|:--|:--|:--|
|type|	String|	Y|无|播放地址类型，"live":预览，"rec"：回放；“cloud.rec”：云存储回放|
|deviceSerial | String | Y |无|设备序列号,存在英文字母的设备序列号，字母需为大写|
|channelNo    | int    | Y | 无 | 通道号|
|accessToken|	String|	N | 初始化时获取 | 授权过程获取的access_token|
|hd    | boolean    |  N |初始化时获取|是否为高清 true-主码流（高清） false-子码流(标清)   |
|validCode	|String	|N| 初始化时获取 |	设备验证码（加密设备播放需要输入验证码）|
|validCode	|String	|N| 初始化时获取 |	设备验证码（加密设备播放需要输入验证码）|
|begin|	String	|N|初始化时获取|type类型为回放有效，开始时间 格式为“YYYYMMDDHHmmss”	|
|end|	String	| N| 初始化时获取|type类型为回放有效，结束时间 格式为 “YYYYMMDDHHmmss”	|


  

#### 切换模板主题  
> 可用于在播放中切换模板主题，请切换播放地址成功后调用

```
  player.Theme.changeTheme(template)

  // 预览切回放场景示例
  player.changePlayUrl({type:"rec"});
  .then(()=>{
    console.log("地址切换成功，开始切换模板主题");
    player.Theme.changeTheme("pcRec");
  });
  

```
template参数说明

|参数名|类型|描述|是否必选|
|:--|:--|:--|:--|
|type|	String| 模板名称，详见初始化参数template|	Y|


#### 开启电子放大
>建议使用模板，模板中的电子放大功能更全

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
