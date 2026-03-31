# ezuikit-js 接入指南

> ezuikit-js 萤石云视频播放器 SDK 接入指南，包含初始化、API 调用、事件监听、多框架集成等完整知识。

当需要接入萤石云视频播放器（ezuikit-js）时，请遵循以下指南。

## 一、安装与引入

### 安装

```bash
npm install ezuikit-js
# 或
yarn add ezuikit-js
# 或
pnpm add ezuikit-js
```

### ESM 引入（v8.1.2+，推荐）

```js
import { EZUIKitPlayer } from "ezuikit-js";
```

### CommonJS 引入

```js
// v8.1.2+
import { EZUIKitPlayer } from "ezuikit-js/index.js";
// v8.1.2 以下
import EZUIKit from "ezuikit-js/index.js";
```

### UMD / Script 标签引入

```html
<script src="./ezuikit.js"></script>
<!-- 使用 EZUIKit.EZUIKitPlayer -->
```

## 二、初始化参数

创建播放器前需要一个容器 DOM：

```html
<div id="video-container"></div>
```

### 必选参数

| 参数 | 类型 | 说明 |
|------|------|------|
| id | String | 播放器容器 DOM 的 id |
| accessToken | String | 授权获取的 access_token |
| url | String | ezopen 协议播放地址 |

### URL 格式

- 标清直播: `ezopen://open.ys7.com/${设备序列号}/${通道号}.live`
- 高清直播: `ezopen://open.ys7.com/${设备序列号}/${通道号}.hd.live`
- SD 卡回放: `ezopen://open.ys7.com/${设备序列号}/${通道号}.rec?begin=yyyyMMddhhmmss`
- 云存储回放: `ezopen://open.ys7.com/${设备序列号}/${通道号}.cloud.rec?begin=yyyyMMddhhmmss`
- 云录制回放: `ezopen://open.ys7.com/${设备序列号}/${通道号}.cloud.rec?busType=7&spaceId=${spaceId}`

### 常用可选参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number/string | 容器宽度 | 视频窗口宽度，8.2.x 起支持字符串如 "100%" |
| height | number/string | 容器高度 | 视频窗口高度 |
| template | String | - | 模板：simple/pcLive/pcRec/mobileLive/mobileRec/自定义themeId |
| audio | boolean | true | 是否默认开启声音 |
| language | String | "zh" | 多语言 zh/en |
| scaleMode | 0/1/2 | 0 | 0:拉伸填充 1:等比适配 2:等比填充超出隐藏 (8.2.0+) |
| staticPath | string | - | 本地解码库静态资源路径，如 "/ezuikit_static" |
| handleSuccess | function | - | 自动播放成功回调 |
| handleError | function | - | 错误回调，参数 err 含 type 和 data |
| quality | 0-6/"pp"/"qp" | - | 预览初始清晰度 (8.1.5+) |
| dblClickFullscreen | boolean | true | 是否支持双击全屏 (8.2.0+) |
| streamInfoCBType | 0/1 | 1 | 流信息回调类型，0:每次回调(影响性能) 1:只回调一次 |
| spaceId | number | - | 云录制空间 ID (8.2.0+) |

### env 配置（海外/私有化部署）

```js
env: {
  domain: "https://open.ys7.com" // 默认值，海外需替换
}
```

海外域名：北美 `https://iusopen.ezvizlife.com` | 南美 `https://isaopen.ezvizlife.com` | 欧洲 `https://ieuopen.ezvizlife.com` | 新加坡 `https://isgpopen.ezvizlife.com` | 印度 `https://iindiaopen.ezvizlife.com`

### loggerOptions 配置

```js
loggerOptions: {
  level: "INFO", // INFO | LOG | WARN | ERROR
  name: "ezuikit",
  showTime: true
}
```

### themeData 本地主题配置

使用 themeData 时需删除 template 参数。可配置 header/footer 的颜色、按钮列表等。

```js
themeData: {
  poster: "封面图URL",
  autoFocus: 3, // 控件栏停驻时间(秒)
  header: {
    color: "#FFFFFF",
    activeColor: "#1890ff",
    backgroundColor: "#000000",
    btnList: [
      { iconId: "deviceID", part: "left", isrender: 1 },
      { iconId: "deviceName", part: "left", isrender: 1 }
    ]
  },
  footer: {
    color: "#FFFFFF",
    activeColor: "#1890FF",
    backgroundColor: "#000000",
    btnList: [
      { iconId: "play", part: "left", isrender: 1 },
      { iconId: "capturePicture", part: "left", isrender: 1 },
      { iconId: "sound", part: "left", isrender: 1 },
      { iconId: "pantile", part: "left", isrender: 1 },
      { iconId: "recordvideo", part: "left", isrender: 1 },
      { iconId: "talk", part: "left", isrender: 1 },
      { iconId: "zoom", part: "left", isrender: 1 },
      { iconId: "hd", part: "right", isrender: 1 },
      { iconId: "fullscreen", part: "right", isrender: 1 }
    ]
  }
}
```

### videoLevelList 自定义清晰度 (8.1.10+)

```js
videoLevelList: [
  { level: 1, name: "标清", streamTypeIn: 2 },
  { level: 2, name: "高清", streamTypeIn: 1 }
]
// level < 0 时不向设备发送指令，仅根据 streamTypeIn 切换码流 (8.1.17+)
```

### speedOptions 自定义倍速 (8.2.4+)

```js
speedOptions: {
  list: [
    { label: "0.5x", value: 0.5 },
    { label: "1x", value: 1 },
    { label: "2x", value: 2 },
    { label: "4x", value: 4 }
  ]
}
```

## 三、API 方法

所有方法返回 Promise，支持链式调用。

### 播放控制

```js
player.play();                    // 开始播放
player.stop();                    // 停止播放
player.fullscreen();              // 全屏 (8.2.0+)
player.exitFullscreen();          // 退出全屏 (8.2.0+)
player.resize(width, height);     // 重置画面宽高，8.2.0 起支持字符串
player.getOSDTime();              // 获取 OSD 时间（Promise 返回时间戳）
player.destroy();                 // 销毁播放器实例
```

### 音频控制

```js
player.openSound();               // 开启声音
player.closeSound();              // 关闭声音
```

### 录制

```js
player.startSave("文件名");       // 开始录制（录制时长需 > 5秒）
player.stopSave();                // 停止录制并下载
```

### 截图

```js
player.capturePicture("文件名");                    // 下载到本地
player.capturePicture("default", (data) => {});     // 返回 base64
```

### 对讲（仅直播）

```js
player.startTalk();                          // 开始对讲
player.stopTalk();                           // 结束对讲
player.setVolumeGain(volume);                // 设置麦克风增益 0~10
player.getMicrophonePermission();            // 获取麦克风权限
player.getMicrophonesList();                 // 获取麦克风列表
player.setProfile({ microphoneId });         // 切换麦克风
```

### 电子放大

```js
player.enableZoom();              // 开启电子放大
player.closeZoom();               // 关闭电子放大
```

### 切换地址播放

```js
player.changePlayUrl({
  type: "live",           // "live" | "rec" | "cloud.rec"
  deviceSerial: "设备序列号",
  channelNo: 1,
  accessToken: "可选",
  hd: true,               // 可选，是否高清
  begin: "YYYYMMDDHHmmss", // 回放有效
  end: "YYYYMMDDHHmmss"    // 回放有效
});
```

### 切换模板主题 (8.2.0+)

```js
// 先切换地址再切换主题
player.changePlayUrl({ type: "rec" }).then(() => {
  player.changeTheme("pcRec");
});
```

### 鱼眼矫正（需开启 SharedArrayBuffer）

```js
player.setFECCorrectType({ place: 3, type: 4 }, "canvas1,canvas2,canvas3");
```

### 日志设置

```js
player.setLoggerOptions({ level: "WARN", name: "myApp", showTime: true });
```

## 四、事件监听

8.2.0+ 推荐使用 `player.on()`，8.1.x 使用 `player.eventEmitter.on()`。

所有事件名通过 `EZUIKitPlayer.EVENTS` 获取。

### 核心事件

```js
// 初始化完成
player.on(EZUIKitPlayer.EVENTS.init, () => {});

// 首帧渲染
player.on(EZUIKitPlayer.EVENTS.firstFrameDisplay, () => {});

// 播放/停止/暂停/恢复
player.on(EZUIKitPlayer.EVENTS.play, () => {});
player.on(EZUIKitPlayer.EVENTS.stop, () => {});
player.on(EZUIKitPlayer.EVENTS.pause, () => {});
player.on(EZUIKitPlayer.EVENTS.resume, () => {});  // 仅回放

// 流信息
player.on(EZUIKitPlayer.EVENTS.streamInfoCB, (info) => {});
player.on(EZUIKitPlayer.EVENTS.videoInfo, (info) => {});
// videoInfo: { videoFormatName, width, height, frameRate, intervalOfIFrame }
player.on(EZUIKitPlayer.EVENTS.audioInfo, (info) => {});
// audioInfo: { audioFormatName, audioChannels, audioBitsPerSample, audioSamplesRate, audioBitRate }

// 声音开关
player.on(EZUIKitPlayer.EVENTS.openSound, () => {});
player.on(EZUIKitPlayer.EVENTS.closeSound, () => {});

// 截图
player.on(EZUIKitPlayer.EVENTS.capturePicture, (info) => {});
// info.data: { fileName, base64 }

// 清晰度切换
player.on(EZUIKitPlayer.EVENTS.changeVideoLevel, (info) => {});
// info.data: { name, level, streamTypeIn }

// 全屏
player.on(EZUIKitPlayer.EVENTS.fullscreen, () => {});
player.on(EZUIKitPlayer.EVENTS.exitFullscreen, () => {});
player.on(EZUIKitPlayer.EVENTS.fullscreenChange, (info) => {});
// 8.2.0: info.data: { isCurrentFullscreen, isFullscreen, isMobile, orientationAngle }

// resize
player.on(EZUIKitPlayer.EVENTS.resize, (data) => {});
// 8.2.0: { width, height, isCurrentFullscreen, orientationAngle }

// 解码资源加载
player.on(EZUIKitPlayer.EVENTS.decoderLoad, () => {});
player.on(EZUIKitPlayer.EVENTS.decoderLoaded, () => {});

// 销毁
player.on(EZUIKitPlayer.EVENTS.destroy, () => {});

// seek（仅回放）
player.on(EZUIKitPlayer.EVENTS.seek, () => {});

// 回放时间变化
player.on(EZUIKitPlayer.EVENTS.recTimeChange, () => {});
```

### 对讲事件

```js
player.on(EZUIKitPlayer.EVENTS.startTalk, () => {});
player.on(EZUIKitPlayer.EVENTS.stopTalk, () => {});
player.on(EZUIKitPlayer.EVENTS.talkSuccess, () => {});
player.on(EZUIKitPlayer.EVENTS.talkError, (error) => {});
player.on(EZUIKitPlayer.EVENTS.volumeChange, ({ data }) => {});
```

### 录制事件

```js
player.on(EZUIKitPlayer.EVENTS.startSave, () => {});
player.on(EZUIKitPlayer.EVENTS.stopSave, ({ data }) => {});
// data: { url, file }
```

### 倍速事件

```js
player.on(EZUIKitPlayer.EVENTS.fast, ({ data }) => {});
player.on(EZUIKitPlayer.EVENTS.slow, ({ data }) => {});
player.on(EZUIKitPlayer.EVENTS.speedChange, (speed) => {});
```

### 电子放大事件

```js
player.on(EZUIKitPlayer.EVENTS.zoom.openZoom, () => {});
player.on(EZUIKitPlayer.EVENTS.zoom.closeZoom, () => {});
player.on(EZUIKitPlayer.EVENTS.zoom.onZoomChange, (info) => {});
```

### 云台控制事件

```js
player.on(EZUIKitPlayer.EVENTS.ptz.openPtz, () => {});
player.on(EZUIKitPlayer.EVENTS.ptz.closePtz, () => {});
player.on(EZUIKitPlayer.EVENTS.ptz.ptzSpeedChange, () => {});
player.on(EZUIKitPlayer.EVENTS.ptz.ptzBtnClick, () => {});
player.on(EZUIKitPlayer.EVENTS.ptz.ptzDirection, () => {});
```

### HTTP 接口事件

```js
player.on(EZUIKitPlayer.EVENTS.http.getCloudRecTimes, (list) => {});
player.on(EZUIKitPlayer.EVENTS.http.getCloudRecordTimes, (list) => {});
player.on(EZUIKitPlayer.EVENTS.http.getLocalRecTimes, (list) => {});
player.on(EZUIKitPlayer.EVENTS.http.getDeviceInfo, (info) => {});
player.on(EZUIKitPlayer.EVENTS.http.getDeviceList, (info) => {});
player.on(EZUIKitPlayer.EVENTS.http.setVideoLevel, () => {});
```

## 五、框架集成示例

### 原生 HTML

```html
<div id="video-container" style="height:400px;"></div>
<script src="./ezuikit.js"></script>
<script>
  var player = new EZUIKit.EZUIKitPlayer({
    id: "video-container",
    accessToken: "your_access_token",
    url: "ezopen://open.ys7.com/设备序列号/1.live",
    template: "pcLive",
    height: 400,
    scaleMode: 1,
    env: { domain: "https://open.ys7.com" }
  });
</script>
```

### React（函数组件 + Hooks）

```jsx
import React, { useCallback, useRef } from "react";
import { EZUIKitPlayer } from "ezuikit-js";

const Player = () => {
  const player = useRef(null);

  const init = useCallback(() => {
    if (player.current) {
      player.current.destroy();
      player.current = null;
    }
    player.current = new EZUIKitPlayer({
      id: "player-container",
      accessToken: "your_access_token",
      url: "ezopen://open.ys7.com/设备序列号/1.hd.live",
      height: 400,
      template: "pcLive",
      scaleMode: 1,
      env: { domain: "https://open.ys7.com" }
    });
  }, []);

  return (
    <div>
      <div id="player-container" />
      <button onClick={init}>初始化</button>
      <button onClick={() => player.current?.play()}>播放</button>
      <button onClick={() => player.current?.stop()}>停止</button>
      <button onClick={() => { player.current?.destroy(); player.current = null; }}>销毁</button>
    </div>
  );
};
```

### Vue 3（Composition API）

```vue
<script lang="ts" setup>
import { EZUIKitPlayer } from "ezuikit-js";
import { onMounted, ref } from "vue";

let player: any = null;
const url = ref("ezopen://open.ys7.com/设备序列号/1.hd.live");
const accessToken = ref("your_access_token");

const init = () => {
  if (player) { player.destroy(); player = null; }
  player = new EZUIKitPlayer({
    id: "video-container",
    accessToken: accessToken.value,
    url: url.value,
    template: "pcLive",
    height: 400,
    scaleMode: 1,
    env: { domain: "https://open.ys7.com" }
  });
  player.on(EZUIKitPlayer.EVENTS.firstFrameDisplay, () => {
    console.log("首帧渲染成功");
  });
};

onMounted(() => init());
</script>

<template>
  <div id="video-container" style="height: 400px" />
  <button @click="init">初始化</button>
  <button @click="player?.play()">播放</button>
  <button @click="player?.stop()">停止</button>
  <button @click="() => { player?.destroy(); player = null; }">销毁</button>
</template>
```

### Vue 2（Options API）

```vue
<template>
  <div>
    <div id="video-container" style="height: 400px" />
    <button @click="init">初始化</button>
    <button @click="play">播放</button>
    <button @click="stop">停止</button>
    <button @click="destroy">销毁</button>
  </div>
</template>

<script>
import { EZUIKitPlayer } from "ezuikit-js";
let player = null;

export default {
  data() {
    return {
      url: "ezopen://open.ys7.com/设备序列号/1.live",
      accessToken: "your_access_token"
    };
  },
  methods: {
    init() {
      if (player) this.destroy();
      player = new EZUIKitPlayer({
        id: "video-container",
        accessToken: this.accessToken,
        url: this.url,
        template: "pcLive",
        height: 400,
        scaleMode: 1,
        env: { domain: "https://open.ys7.com" }
      });
    },
    play() { player?.play(); },
    stop() { player?.stop(); },
    destroy() { player?.destroy(); player = null; }
  }
};
</script>
```

## 六、多窗口播放

每个视频窗口需要独立的容器 DOM 和独立的 EZUIKitPlayer 实例：

```js
const player1 = new EZUIKitPlayer({ id: "container1", url: "...", accessToken: "..." });
const player2 = new EZUIKitPlayer({ id: "container2", url: "...", accessToken: "..." });
```

## 七、巡检组件（EZUIKitInspectionUI）

用于多设备分屏巡检场景，支持分页、轮询、全部播放/暂停/静音等：

```js
const inspect = new EZUIKit.EZUIKitInspectionUI(containerDOM, {
  pageSize: 4,           // 每页窗口数：1/2/4/9/12/16
  autoPlay: true,
  list: deviceList,      // 设备配置数组，每项含 url/accessToken/width/height/template/staticPath
  autoTurn: false,       // 是否自动轮询
  delay: 10000,          // 轮询间隔(ms)
  loop: true,            // 循环翻页
  imgUrl: "背景图URL",
  onScreenSelect: (index, item) => {},
  onPageChange: (res) => {}
});

// 方法
inspect.nextPage();
inspect.lastPage();
inspect.playAll();
inspect.stopAll();
inspect.muteAll();
inspect.unmuteAll();
inspect.startTurn();
inspect.stopTurn();
inspect.setDelay(30000);
inspect.setLoop(true);
inspect.setBackground("imgUrl");
inspect.initPlayer(index);  // 初始化指定设备
inspect.destroy();
```

## 八、最佳实践

1. 使用 `scaleMode: 1` 避免视频拉伸变形
2. 配置 `staticPath` 使用本地解码库可提升加载速度，将 `ezuikit_static` 目录放到你的服务器下
3. 开启多线程解码（Chrome 实验室特性）可大幅提升解码效率、降低内存消耗
4. 录制时长需大于 5 秒，录制文件需使用专用播放器播放
5. 一个页面中只能有一个对讲实例
6. `changePlayUrl` 切换间隔至少 1 秒，避免频繁切换导致异常
7. 销毁播放器时务必调用 `player.destroy()` 并将引用置为 null，避免内存泄漏
8. 错误处理：通过 `handleError` 回调捕获错误，`err.type === "handleRunTimeInfoError" && err.data.nErrorCode === 5` 表示加密设备密码错误
9. 海外或私有化部署必须配置 `env.domain`
10. `streamInfoCBType` 设为 0 会持续回调流信息，影响性能，非必要保持默认值 1

## 九、版本注意事项

- 8.2.0+: `fullscreen()` 替代 `fullScreen()`，`exitFullscreen()` 替代 `cancelFullScreen()`
- 8.2.0+: `player.changeTheme()` 替代 `player.Theme.changeTheme()`
- 8.2.0+: 推荐使用 `player.on()` 替代 `player.eventEmitter.on()`
- 8.2.0+: 默认支持云录制，不再需要 `isCloudRecord` 参数
- 8.2.0+: width/height 支持字符串值（如 "100%", "100vw"）
- 8.1.x: 云录制需要 `isCloudRecord: true`，且与云存储互斥
- flv 模式已停止维护，后续将移除，请使用 `ezuikit-flv` 或 `@ezuikit/player-hls`
