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

>##### 如果你使用原生方法,可以通过标签引用
```
  <script src="./ezuikit.js"></script>
```

### 开始使用 - 初始化
>基本使用

创建DOM

```
  <div id="video-container"></div>
```

播放器初始化

```
    var player = new EZUIKit.EZUIKitPlayer({
      id: 'video-container', // 视频容器ID
      accessToken: 'at.3bvmj4ycamlgdwgw1ig1jruma0wpohl6-48zifyb39c-13t5am6-yukyi86mz',
      url: 'ezopen://open.ys7.com/203751922/1.live',
    })
```

### 方法调用
> 示例： 停止播放

```
  1. player.stop();

  2. player.stop()
  .then(()=>{
    console.log("执行播放成功后其他动作");
  });

```
> 示例： 执行播放（自动播放为false,自定义触发播放/切换播放地址）

```
  player.play();
  // 切换播放地址场景（注意先执行stop方法停止上次取流）
  player.play({
   url: 'ezopen://open.ys7.com/203751922/1.rec?begin=202001000000&end=202001235959'
  });
```

切换地址播放（注意需要先执行stop方法停止上次取流）

```
  player.stop()
  .then(()=>{
    player.play('ezopen://open.ys7.com/{其他设备}/{其他通道}.live');
  });

  // 其他账号下设备
  
  player.stop()
  .then(()=>{
    player.play({url:'ezopen://open.ys7.com/{其他设备}/{其他通道}.live',accessToken: 'xxxx'});
  });
  
```

### 使用说明
#### 初始化

|参数名|类型|描述|是否必选|
|:--|:--|:--|:--|
|id|	String| 播放器容器DOM的id|	Y|
|accessToken|	String|	授权过程获取的access_token|	Y|
|url	|String|	视频ezopen协议播放地址	|Y|
|audio|	int	| 是否默认开启声音 1：打开（默认） 0：关闭	|N|
|autoplay|	int	| 是否自动播放 1：开启 0：关闭	|N|
|width |int	| 视频宽度，默认值为容器容器DOM宽度	|N|
|height |int	| 视频高度，默认值为容器容器DOM高度	|N|
|templete |string	| 播放器模板，可以通过选定模板，使用内置的播放器样式，组件 simple：极简版;standard：标准版;security：安防版(预览回放);vioce：语音版 |N|
|header |Array	| 视频头部可选UI组件，可选值：capturePicture：截图,save：录像保存,zoom：电子放大 |N|
|footer |Array	| 视频底部部可选UI组件，可选值：talk：对讲,broadcast：语音播报,hd：高清标清切换,fullScreen：全屏 |N|
|plugin |Array	| 按需加载插件，可选值： talk：对讲 |N|
|handleSuccess |function	| 播放成功回调 |N|
|handleError |function	| 播放错误回调 |N|
|openSoundCallBack |function	| 开启声音回调 |N|
|closeSoundCallBack |function	| 关闭回调 |N|
|startSaveCallBack |function	| 开始录像回调 |N|
|stopSaveCallBack |function	| 结束录像回调 |N|
|capturePictureCallBack |function	| 截图回调 |N|
|fullScreenCallBack |function	| 全屏回调 |N|
|fullScreenChangeCallBack |function	| 全屏变化回调-全局（含ESC退出全屏等） |N|
|getOSDTimeCallBack |function	| 获取OSD时间回调 |N|


#### 方法集合

|方法名|类型|描述|使用示例|
|:--|:--|:--|:--|
|stop|	function| 结束播放|	`player.stop()`|
|openSound|	String|	开启声音|`player.openSound()`|
|closeSound	|String|关闭声音	|`player.closeSound()`|
|startSave|	int	|开始录像|`player.startSave()`|
|stopSave|int	|结束录像|`player.stopSave()`|
|capturePicture|	function| 视频截图|	`player.capturePicture()`|
|fullScreen|	function| 全屏（自动适配移动端pc端全屏）|	`player.fullScreen()`|
|cancelFullScreen|	function| 取消全屏|	`player.cancelFullScreen()`|
|getOSDTime|	function| 获取播放时间回调|	`player.getOSDTime()`|
|startTalk|	function| 开始对讲|	`player.startTalk()`|
|stopTalk|	function| 结束对讲|	`player.stopTalk()`|

### 使用示例

> 如果使用原生js，可参考demos => base-demo

> 如果使用react，可参考demos => react-demo

> 如果使用vue，可参考demos => vue-demo
