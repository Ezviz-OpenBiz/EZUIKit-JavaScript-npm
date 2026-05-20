---
name: e-f-ezuikit-native
description: EZUIKitNative 是 EZUIKit SDK 中的本地插件播放器模块，通过 WebSocket 与本地 CEF（Chromium Embedded Framework）桌面插件进程通信，实现在浏览器页面上叠加一个独立的本地窗口来承载多路视频播放。支持最大 5×5 = 25 路画面同时播放。
---

# EZUIKitNative 本地插件播放器 - AI Skill 文档

## 模块概述

EZUIKitNative 是 EZUIKit SDK 中的本地插件播放器模块，通过 WebSocket 与本地 CEF（Chromium Embedded Framework）桌面插件进程通信，实现在浏览器页面上叠加一个独立的本地窗口来承载多路视频播放。支持最大 5×5 = 25 路画面同时播放。

## 引入方式

### NPM 包

```typescript
import EZUIKit from '@ezviz/ezuikit-js';

const native = new EZUIKit.EZUIKitNative({ container: 'player-container' });
```

### UMD（script 标签）

```html
<script src="./ezuikit.js"></script>
<script>
  const native = new EZUIKit.EZUIKitNative({ container: 'player-container' });
</script>
```

### 包入口

| 格式     | 入口文件          | 全局变量                       |
| -------- | ----------------- | ------------------------------ |
| ESM      | `dist/index.mjs`  | -                              |
| CommonJS | `dist/index.js`   | -                              |
| UMD      | `dist/ezuikit.js` | `window.EZUIKit.EZUIKitNative` |

### 暴露路径

```
player/src/index.ts
  → import EZUIKitNative from './EZUIKitNative/EZUIKitNative'
  → export default { EZUIKitNative, ... }  // default export 对象属性

player/src/ezuikit.ts
  → window.EZUIKit = EZUIKit          // UMD 全局挂载
```

## 架构

```
用户页面 (Controller)
    ↕ WebSocket ws://localhost:18082
CEF 本地插件进程
    ↕ WebSocket ws://localhost:18082
内嵌播放页面 (Player, EZUIKitPlayer.html)
```

- **Controller**：运行在用户页面，负责发送控制指令、窗口位置跟随、事件监听
- **Player**：运行在 CEF 内嵌页面，负责接收指令、创建/管理 EZUIKitPlayer 实例、事件回传
- **CEF 插件**：本地桌面进程，提供 WebSocket 服务端、窗口管理、消息广播中转

## 继承体系

```
EventBus<T>
  └── EZUIKitNativeBase<T, S>     // 抽象基类：WebSocket 连接、消息发送、状态管理
        ├── EZUIKitNativeController  // 用户端（T = ControllerEvents, S = ControllerStatus）
        └── EZUIKitNativePlayer      // 内嵌端（T = PlayerEvents, S = BaseStatus）
```

基类通过两个泛型参数实现类型安全：

- `T extends Record<string, (...args: any[]) => void>`：事件类型
- `S extends BaseStatus`：状态类型，基类持有 `protected status: S`，子类通过构造函数传入初始值

工厂入口 `EZUIKitNative.ts` 通过 `role` 参数决定实例化哪个子类：

- `new EZUIKitNative({ container: 'xxx' })` → Controller（默认）
- `new EZUIKitNative({ role: 'player', container: 'xxx' })` → Player

## 源码文件

| 文件                                                  | 说明                                                                            |
| ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| `player/src/EZUIKitNative/EZUIKitNative.ts`           | 工厂入口 + 构造签名重载                                                         |
| `player/src/EZUIKitNative/EZUIKitNativeBase.ts`       | 抽象基类，继承 EventBus，提供 sendCommand / \_sendBroadcast                     |
| `player/src/EZUIKitNative/EZUIKitNativeController.ts` | Controller 子类                                                                 |
| `player/src/EZUIKitNative/EZUIKitNativePlayer.ts`     | Player 子类                                                                     |
| `player/src/EZUIKitNative/types.ts`                   | 业务类型定义（Layout, BaseStatus, ControllerStatus, ConnectStatus, Options 等） |
| `player/src/EZUIKitNative/messages.ts`                | 通信消息类型（PluginCommandMap, BroadcastMessageMap）                           |
| `player/src/EZUIKitNative/helper.ts`                  | 工具函数（getControllerState, awakeCEF）                                        |
| `examples/base/EZUIKitPlayerNative.html`              | Controller 端 Demo 页面                                                         |
| `examples/base/EZUIKitPlayer.html`                    | Player 端内嵌页面（简化版）                                                     |

## Controller 公共 API

### 构造函数

```typescript
const native = new EZUIKitNative({
  container: 'player-container', // 容器 DOM 元素或 id
  mode: 2, // 0-不使用插件 1-自动 2-强制使用插件
  autoPlay: false, // 是否自动播放
  deviceList: [], // 设备列表
  layout: { col: 4, row: 4 }, // 布局配置
});
```

### init(options)

初始化播放器。支持就绪检测：如果 Player 端尚未就绪，参数会被缓存，就绪后自动发送。

```typescript
native.init({
    layout: { col: 4, row: 4 },
    deviceList: [
        { id: 'player0', url: 'ezopen://...', accessToken: '...', template: 'pcLive', ... },
        // ...
    ]
});
```

### play(id?, params?)

播放指定设备。`id` 可以是下标（number）、播放器 id（string）或不传（对所有播放器执行）。

### stop(id?, params?)

停止播放。参数同 `play`。

### switchLayout(layout)

动态切换布局。增量式增减播放器，已有播放流不中断。

```typescript
native.switchLayout({ col: 2, row: 2 });
```

约束：`col` 和 `row` 范围 [1, 5]，相同布局不重复发送。

### fullscreen(id?)

全屏。传 `id` 为单画面全屏，不传为整体全屏。

### exitfullscreen(id?)

退出全屏。参数同 `fullscreen`。

### destroy(id?, force?)

销毁。传 `id` 销毁单个播放器，不传销毁全部。`force=true` 会关闭 CEF 窗口并断开连接。

### reload()

重载内嵌播放页面。重置初始化状态。WebSocket 连接不断，只重载 CEF 内嵌页面（Player 端重启）。

### launch()

手动唤起 CEF 插件并尝试连接。仅在 `idle` 或 `closed` 状态下生效，`connected`、`connecting`、`retrying` 状态下调用会被忽略。重置唤起计数，通过 `cefbrowser://` 协议唤起后延迟连接。

```typescript
native.launch(); // 手动唤起插件
```

### sendCommand(cmd, data?)

类型安全的插件指令发送接口。根据 `cmd` 自动推导 `data` 参数类型。

```typescript
// 有参数指令
native.sendCommand('follow', { x: 100, y: 200, width: 800, height: 600 });
native.sendCommand('set_title', { title: '监控页面' });
native.sendCommand('load_url', { url: 'https://...' });

// 无参数指令
native.sendCommand('ping');
native.sendCommand('stop_follow');
native.sendCommand('close_window');
native.sendCommand('show_window');
native.sendCommand('reload');
```

支持的全部指令见 `PluginCommandMap`（`messages.ts`）。

## 事件系统

继承自 `EventBus`，直接在实例上调用 `on/off/once/emit`。

事件类型由 `ControllerEvents`（对外事件）和 `BroadcastEvents`（Broadcast 消息事件）合并而成，`on` 时有完整的事件名提示和回调参数推导。

### Controller 事件类型

**对外事件：**

| 事件名         | 触发时机                    | 回调参数                                                            |
| -------------- | --------------------------- | ------------------------------------------------------------------- |
| `init`         | 调用 init 后                | `{ eventType, code, msg }` code=0 成功, -1 失败                     |
| `connect`      | WebSocket 连接状态变化      | `{ eventType, code, msg, data? }` code=0 连接成功, -1 断开, -2 失败 |
| `error`        | 操作错误                    | `{ code, msg }` code=-1 未初始化, -2 参数非法                       |
| `launchFailed` | 插件唤起失败（重试 3 次后） | `{ code: -3, msg, attempts }`                                       |

**Broadcast 消息事件（继承自 BroadcastEvents）：**

| 事件名           | 触发时机                        | 回调参数                                                   |
| ---------------- | ------------------------------- | ---------------------------------------------------------- |
| `websocket`      | Player 端连接状态变化           | `{ type, code, timestamp }` code: 0 就绪, -1 关闭, -2 异常 |
| `initParams`     | 收到初始化参数                  | `{ type, deviceList, layout }`                             |
| `apiOptions`     | 收到 API 调用指令               | `{ type, id, option, params }`                             |
| `resize`         | 收到尺寸变化                    | `{ type, width, height }`                                  |
| `switchLayout`   | 收到布局切换                    | `{ type, col, row }`                                       |
| `eventemitter`   | Player 端播放器事件回传         | `{ type, eventType, id, timestamp, ... }`                  |
| `exitfullscreen` | 退出全屏请求                    | `{ type }`                                                 |
| `queryReady`     | Controller 查询 Player 就绪状态 | `{ type }`                                                 |

### 使用示例

```typescript
native.on('connect', (data) => {
  if (data.code === 0) console.log('插件连接成功');
  if (data.code === -2) console.log('插件连接失败');
});

native.on('launchFailed', (data) => {
  console.log(`插件唤起失败，已重试 ${data.attempts} 次`);
});

native.on('websocket', (data) => {
  if (data.code === 0) console.log('内嵌页面就绪');
  if (data.code === -1) console.log('内嵌页面连接关闭');
  if (data.code === -2) console.log('内嵌页面连接异常');
});
```

## Proxy 代理

Controller 实例被 Proxy 包装，未在类上定义的方法调用会自动转发为 `apiOptions` 消息发送给 Player 端。

```typescript
// 以下调用会被 Proxy 拦截，转发为 apiOptions 消息
native.capturePicture(0, { download: true });
native.openSound(0);
```

## CEF 通信协议

WebSocket 地址：`ws://localhost:18082`

### 指令列表

| 指令              | 方向       | 说明                                         | SDK 常量             |
| ----------------- | ---------- | -------------------------------------------- | -------------------- |
| `close_window`    | Web → CEF  | 关闭 CEF 窗口                                | `CMD.closeWindow`    |
| `show_window`     | Web → CEF  | 显示 CEF 窗口                                | `CMD.showWindow`     |
| `follow`          | Web → CEF  | 窗口跟随（x, y, width, height）              | `CMD.follow`         |
| `stop_follow`     | Web → CEF  | 停止跟随                                     | `CMD.stopFollow`     |
| `set_param`       | Web → CEF  | 设置透传参数                                 | `CMD.setParam`       |
| `get_param`       | Web → CEF  | 获取透传参数                                 | `CMD.getParam`       |
| `load_url`        | Web → CEF  | 加载指定 URL                                 | -                    |
| `ping`            | Web → CEF  | 心跳（15s 间隔，30s 超时断开）               | `CMD.ping`           |
| `set_title`       | Web → CEF  | 设置标签页标题                               | `CMD.setTitle`       |
| `tab_info`        | Web → CEF  | 标签页信息（title, tabid, customidentifier） | -                    |
| `Broadcast`       | Web ↔ CEF | 广播消息（双向透传）                         | `CMD.Broadcast`      |
| `reload`          | Web → CEF  | 重载内嵌页面                                 | `CMD.reload`         |
| `minimize_window` | Web → CEF  | 最小化窗口                                   | `CMD.minimizeWindow` |

### Broadcast 消息类型

通过 `Broadcast` 指令的 `message` 字段传递 JSON，`type` 字段区分消息类型：

| type             | 方向                | 说明                                      |
| ---------------- | ------------------- | ----------------------------------------- |
| `initParams`     | Controller → Player | 初始化参数（deviceList, layout）          |
| `apiOptions`     | Controller → Player | API 调用（id, option, params）            |
| `resize`         | Controller → Player | 容器尺寸变化                              |
| `switchLayout`   | Controller → Player | 布局切换                                  |
| `queryReady`     | Controller → Player | 查询 Player 是否就绪                      |
| `websocket`      | Player → Controller | 连接状态（code=0 就绪, -1 关闭, -2 异常） |
| `eventemitter`   | Player → Controller | 播放器事件回传                            |
| `exitfullscreen` | Player → Controller | 退出全屏请求                              |

## 窗口跟随机制

Controller 端通过 `MessageChannel` 高频轮询容器位置，检测到变化（阈值 > 2px）后发送 `follow` 指令。

位置计算修正：

- 加入 `window.scrollX/scrollY` 修正页面滚动偏移
- 使用 `Math.round` 取整避免亚像素偏移
- 尺寸变化通过 500ms 防抖发送 `resize` 消息

窗口事件处理：

- `visibilitychange`：页面隐藏时 `stop_follow`，恢复时重新 `follow`
- `beforeunload`：发送 `reload` + `stop_follow` 并关闭 WebSocket

## 插件唤起机制

CEF 插件需要用户预先安装在本地。SDK 在 Controller 构造时自动尝试连接，如果插件未运行则触发唤起流程。

### 唤起流程

```
Controller 构造 → _initConnect() → connectSocket()
    ↓
    status.connect = 'connecting'
    ↓
    _connectWebSocket() → WebSocket 连接 ws://localhost:18082
    ↓
┌─ 连接成功 → _onOpen() → status.connect = 'connected' → 正常流程
│
└─ 连接失败 → _onError() 触发
    ↓
    status.connect = 'retrying'
    ↓
    emit('connect', { code: -2 })  // 通知用户连接失败
    ↓
    _launchAttempts++
    ↓
    awakeCEF()：创建隐藏 iframe，src = 'cefbrowser://'
    （浏览器通过自定义协议唤起本地 CEF 进程）
    ↓
    等待 3000ms（LAUNCH_RETRY_DELAY）
    ↓
    重新调用 _initConnect() 尝试连接
    ↓
┌─ 连接成功 → _onOpen() → status.connect = 'connected'，_launchAttempts 重置为 0
│
└─ 连接失败 → _onError() 再次触发
    ↓
    已达 MAX_LAUNCH_ATTEMPTS（默认 3 次）？
    ├─ 否 → status.connect = 'retrying' → 再次唤起 + 重连
    └─ 是 → status.connect = 'closed'
            emit('launchFailed', { code: -3, msg: '插件唤起失败，请检查是否已安装', attempts: 3 })
            不再重试
```

### 唤起参数

| 参数                  | 默认值 | 说明                     |
| --------------------- | ------ | ------------------------ |
| `MAX_LAUNCH_ATTEMPTS` | 3      | 最大唤起重试次数         |
| `LAUNCH_RETRY_DELAY`  | 3000ms | 每次唤起后等待重连的间隔 |

### 唤起原理

通过 `cefbrowser://` 自定义协议唤起。浏览器加载该协议时，操作系统会查找注册了该协议的本地应用（CEF 插件安装时注册），如果找到则启动该进程。

```typescript
// helper.ts 中的实现
export const awakeCEF = () => {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'cefbrowser://';
  document.body.appendChild(iframe);
  setTimeout(() => {
    if (iframe.parentNode) {
      document.body.removeChild(iframe);
    }
  }, 1000);
};
```

### 用户监听

```typescript
// 每次连接失败都会触发（包括唤起重试期间）
native.on('connect', (data) => {
  if (data.code === -2) {
    console.log('插件连接失败，正在尝试唤起...');
  }
});

// 所有重试用尽后触发一次
native.on('launchFailed', (data) => {
  console.log(`插件唤起失败，已重试 ${data.attempts} 次`);
  // 此处可展示安装引导 UI
});
```

### 连接成功后重置

连接成功时（`_onOpen`），`_launchAttempts` 自动重置为 0。如果后续连接再次断开，唤起计数从 0 重新开始。

## Player 端

Player 端运行在 CEF 内嵌页面中，职责：

1. WebSocket 连接成功后发送就绪消息（`websocket code=0`）
2. 接收 `initParams` → 清空已有播放器 → 创建新播放器网格
3. 接收 `apiOptions` → 按 id 路由到对应播放器执行方法
4. 接收 `resize` → 按 layout 重新计算每个播放器尺寸
5. 接收 `switchLayout` → 增量式增减播放器（保留已有流不中断）
6. 播放器事件通过 WebSocket 回传给 Controller

### Player 端使用

```html
<!-- EZUIKitPlayer.html -->
<script>
  new EZUIKit.EZUIKitNative({
    role: 'player',
    container: 'player-container',
  });
</script>
```

## 类型定义

### 业务类型（types.ts）

```typescript
/** 连接状态 */
type ConnectStatus = 'idle' | 'connecting' | 'retrying' | 'connected' | 'closed';

interface Layout {
  col: number;
  row: number;
}

interface ControllerOptions {
  role?: 'controller';
  container: HTMLElement | string;
  mode?: number; // 0-不使用插件 1-自动 2-强制
  autoPlay?: boolean;
  deviceList?: Array<any>;
  layout?: Layout;
}

interface PlayerOptions {
  role: 'player';
  container: HTMLElement | string;
  layout?: Layout;
}

/** 基础状态（基类持有） */
interface BaseStatus {
  connect: ConnectStatus;
}

/** Controller 业务状态（继承基础状态） */
interface ControllerStatus extends BaseStatus {
  inited: boolean;
  innerPageReady: boolean;
  fullscreen: boolean;
  targetFullscreen: string | number | undefined;
  playing: boolean;
}

interface WindowPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}
```

### 连接状态流转

```
idle → connecting → connected → closed
                  ↘ retrying → connecting → connected
                               ↘ retrying → ... (最多 3 次后 → closed)
```

| 状态         | 含义                               | 触发时机                        |
| ------------ | ---------------------------------- | ------------------------------- |
| `idle`       | 初始状态 / reload 重置后           | 构造函数、`reload()`            |
| `connecting` | WebSocket 正在建立连接             | `_connectWebSocket()` 调用时    |
| `retrying`   | 连接失败，正在唤醒 CEF 并等待重连  | `_onError()` 中 `awakeCEF()` 后 |
| `connected`  | WebSocket 已连接                   | `_onOpen()` 回调                |
| `closed`     | 连接已关闭（正常或异常）/ 重试耗尽 | `_onClose()`、重试达上限        |

### 消息类型（messages.ts）

两层通信类型，通过映射表 + 泛型工具类型实现类型安全：

```typescript
/** 第一层：CEF 插件指令 */
interface PluginCommandMap {
  follow: { x: number; y: number; width: number; height: number };
  stop_follow: {};
  close_window: {};
  show_window: {};
  reload: {};
  set_title: { title: string };
  ping: {};
  Broadcast: { message: string };
  // ...
}

// sendCommand 根据 cmd 自动推导 data
type PluginCommand<T> = { cmd: T; timestamp: number } & PluginCommandMap[T];

/** 第二层：Broadcast 业务消息（扁平化，无 data 包装） */
interface BroadcastMessageMap {
  initParams: { deviceList: Array<EZUIKitPlayerParams>; layout?: Layout; [key: string]: any };
  apiOptions: { id?: string | number; option: string; params: any[] };
  resize: { width: number; height: number };
  switchLayout: Layout;
  websocket: { code: 0 | -1 | -2; timestamp: number };
  eventemitter: { eventType: string; id: string; timestamp: number; [key: string]: any };
  exitfullscreen: {};
  queryReady: {};
}

// 根据 type 获取完整消息结构
type BroadcastMessage<T> = { type: T } & BroadcastMessageMap[T];

// 转为 EventBus 事件签名，合并到 ControllerEvents / PlayerEvents
type BroadcastEvents = {
  [K in BroadcastMessageType]: (msg: BroadcastMessage<K>) => void;
};
```

## 注意事项

- 目前仅支持 Chrome 浏览器
- 同一台电脑多个标签页/浏览器只能有一个活跃的 CEF 跟随连接
- 25 路画面不支持复制
- 心跳协议要求 15s 间隔，30s 空闲自动断开
- 非插件模式（mode=0）最多支持 9 路画面
- `switchLayout` 的 col/row 范围为 [1, 5]
- `connect` 事件 code=-1 时区分正常关闭（`wasClean && code===1000`）和异常断开
- 打开 DevTools 会影响窗口位置计算（`outerWidth - innerWidth` 包含 DevTools 面板宽度），生产环境不受影响
- 插件下载地址：`https://izhstatic.ys7.com/vasp-openweb/1768271430453_CEFBrowserSetup.exe`
- Controller 连接成功后会主动发送 `queryReady` 查询 Player 就绪状态，解决 Player 先连接的时序问题
- `initParams` 和 `switchLayout` 消息中附带 `containerWidth/containerHeight`（通过 Layout 类型），解决 CEF 窗口未就绪时 DOM 尺寸不准确的问题
