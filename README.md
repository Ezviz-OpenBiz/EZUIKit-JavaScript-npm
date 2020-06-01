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
>初始化参数

### 方法调用
> 示例： 停止播放

```
  player.stop();
```

### 使用说明
#### 初始化

|参数名|类型|描述|是否必选|
|:--|:--|:--|:--|
|id|	String| 播放器容器DOM的id|	Y|
|accessToken|	String|	授权过程获取的access_token|	Y|
|url	|String|	视频ezopen协议播放地址	|Y|
||	int	|通道号，IPC设备填1	|Y|
| |int	|地址过期时间：`单位秒数，最大默认2592000（即30天），最小默认300（即5分钟）`	|Y|

#### 方法集合

|方法名|类型|描述|使用示例|
|:--|:--|:--|:--|
|id|	String| 播放器容器DOM的id|	Y|
|accessToken|	String|	授权过程获取的access_token|	Y|
|url	|String|	视频ezopen协议播放地址	|Y|
||	int	|通道号，IPC设备填1	|Y|
| |int	|地址过期时间：`单位秒数，最大默认2592000（即30天），最小默认300（即5分钟）`	|Y|