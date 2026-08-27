---
inclusion: manual
name: ezuikit-native
description: 使用 EZUIKitNative（本地插件播放器）做多路视频墙接入或排查时使用。覆盖场景：多路视频墙 / 25 路画面 / 插件唤起失败 / launchFailed / 插件未安装 / 播放窗口位置偏移 / 多屏不同缩放 / cellTemplate 自定义渲染 / 画面角标与选中态 / cell() 操作 / handle 回调不触发 / 布局切换 / destroyPlayer 与 destroy 区别。触发词：EZUIKitNative、本地插件播放器、视频墙。
---

# EZUIKitNative 本地插件播放器

## 概述

在浏览器页面上叠一个**独立的本地播放窗口**来播视频，最多 5×5 = 25 路。绕开浏览器的解码与内存上限。

代价是三点约束，接入前先确认能接受：

1. **需要用户本机安装播放插件**，SDK 只负责唤起，装不上就播不了。
2. **画面不在你的页面 DOM 里**，是叠在页面之上的本地窗口。想在画面上加角标、边框、按钮，走 SDK 提供的 `render` 配置，不能用你页面里的元素去覆盖。
3. **目前仅支持 Chrome**。同一台机器同时只有一个活跃的插件跟随连接。

## 能力边界自查

动手前先判断需求落在哪一格。最常见的误判是把「画面上加角标 / 边框 / 点击高亮」当成 SDK 做不到的事 —— 这类需求纯配置就能完成。

| 需求                                                  | 怎么做                                               |
| ----------------------------------------------------- | ---------------------------------------------------- |
| 画面上的角标 / 标题 / 边框 / 选中态 / 按钮 / 点击响应 | `render.cellTemplate` + `cell()` API，纯配置         |
| 播放控制：播 / 停 / 抓图 / 声音 / 对讲 / 云台 / 回放  | 直接调 `native.xxx(id, ...)`，方法名与单路播放器一致 |
| 布局切换、全屏、销毁重建                              | `switchLayout` / `fullscreen` / `destroyPlayer`      |
| 容器背景、间距、内边距                                | `render.containerStyle` 或 `setContainerStyle`       |
| 画面内的鼠标坐标、自定义右键菜单、画面区域框选        | 当前不支持，可通过开放平台工单提需求                 |

判断依据：**cell 内部是一个完整的 DOM 环境**，SDK 已经把「下发模板」「操作 DOM」「回传点击」三条通路都做好了。角标和视频画面在同一个文档里，不需要额外手段绘制。

## 安装与引入

插件安装包与安装指引通过萤石开放平台渠道获取。SDK 侧只做两件事：尝试连接本地插件，连不上就唤起。

```js
import EZUIKit from 'ezuikit-js';

const native = new EZUIKit.EZUIKitNative({
  container: 'players-container', // 容器 DOM 或其 id
  mode: 2, // 0 不用插件 / 1 自动（>9 路才用）/ 2 强制用插件
});
```

**只能这样引入。** `import { EZUIKitNative } from 'ezuikit-js'` 拿到的是 `undefined` —— 它挂在默认导出对象上，不是具名导出。

`mode: 0` 走浏览器内播放，**最多 9 路**，超了会 emit `init` code=-1。

## 实例 API

| API                         | 说明                                                            |
| --------------------------- | --------------------------------------------------------------- |
| `init(options)`             | 下发 deviceList + layout + render。插件端未就绪时自动等就绪重发 |
| `play(id?, params?)`        | id 为下标 / deviceId / 不传（全部）                             |
| `stop(id?, params?)`        | 同上                                                            |
| `switchLayout({col, row})`  | 增量增减画面，已有流不中断。col/row ∈ [1, 5]                    |
| `fullscreen(id?)`           | 不传 = 整体全屏；传 id = 单画面全屏                             |
| `exitfullscreen(id?)`       | 同上。Esc 键 SDK 已自动接管                                     |
| `destroyPlayer(id?)`        | 销毁播放器，**插件保持常驻**，之后可再 `init` 恢复              |
| `destroy()`                 | 彻底销毁：关插件窗口 + 断连接                                   |
| `reload()`                  | 只重载播放窗口内容，连接不断                                    |
| `launch()`                  | 手动唤起插件（仅未连接状态下生效）                              |
| `cell(target)`              | 取 cell 操作句柄，target = 下标 / deviceId / `'all'`            |
| `setContainerStyle(css)`    | 动态改容器样式，不重建播放器                                    |
| `indexOf(deviceId)`         | deviceId → 下标，找不到返回 -1                                  |
| `getPlayerVersion(ms=3000)` | Promise，查插件内置的播放端版本；未就绪 / 超时 / 断连返回 `''`  |
| **其他播放器方法名**        | 自动转发到插件端的播放器实例，第一个参数固定是 id               |

方法名转发意味着 `native.capturePicture(0, { download: true })`、`native.openSound(0)` 这类可以直接调，参数与单路播放器一致。

**转发调用是 fire-and-forget，返回 `undefined`，不能 `await`。** 跨进程只把方法名和参数送过去，不回传返回值。要拿结果走回调（抓图用 `capturePictureCallBack`）或全局事件订阅。`getPlayerVersion` 是唯一返回 Promise 的查询接口。

**`destroyPlayer` 和 `destroy` 别混**：想清画面用 `destroyPlayer()`，想关插件才用 `destroy()`。`destroy(id)` 这种传参形式已废弃，会打 warn 并转发到 `destroyPlayer(id)`。

## 自定义渲染

一个完整可用的视频墙：设备名角标 + 单选高亮（Ctrl+点击多选）。

```js
const native = new EZUIKit.EZUIKitNative({ container: 'players-container' });

native.init({
  layout: { col: 3, row: 3 },
  autoplay: true,
  deviceList: devices.map((d) => ({
    id: d.id, // 必须全局唯一
    url: d.url, // ezopen://...
    accessToken: d.accessToken,
    template: 'pcLive',
    handleError: (e) => console.error(d.id, e.code, e.msg), // 命名有规则，见下一节
  })),
  render: {
    containerStyle: 'background:#000; gap:2px;',
    cellTemplate: {
      // [data-ezuikit-video] 是视频槽位；不写则视频追加到 cell 末尾
      // 占位符只支持 {index} 和 {id}，自动 HTML escape
      template: `
        <div class="surface">
          <div data-ezuikit-video></div>
          <div class="title" data-action="select"></div>
        </div>`,
      css: `
        .ezuikit-cell .title {
          position:absolute; top:8px; left:10px; z-index:11;
          padding:2px 8px; border-radius:4px;
          background:rgba(0,0,0,.45); color:#7dd3fc; cursor:pointer;
        }
        /* 边框用 ::before 浮在视频上层：直接写 border 会被 cell 裁掉，
           inset box-shadow 会被铺满的视频元素盖住 */
        .ezuikit-cell.selected::before {
          content:''; position:absolute; inset:0; z-index:10;
          border:2px solid #1890ff; box-sizing:border-box; pointer-events:none;
        }`,
      action: {
        'select:click': ({ index, id, event, cell }) => {
          if (event.ctrlKey || event.metaKey) cell.toggleClass('selected');
          else cell.selectOnly('selected'); // 原子单选
        },
      },
    },
  },
});

// 设备名后置写入（占位符只支持 index / id，其他字段这样写）
native.on('websocket', ({ code }) => {
  if (code !== 0) return;
  devices.forEach((d, i) => native.cell(i).setText('.title', d.name));
});
```

### 模板契约

写 CSS 时可以依赖这套结构，它是稳定的公开约定：

```
#player-container            grid 容器，行列由 SDK 控制
└── .ezuikit-cell            一个画面格子，带 data-index / data-id
    ├── [data-ezuikit-video] 视频槽位（你在模板里声明的位置）
    │   或 .player-item      未声明槽位时 SDK 追加的兜底元素
    └── 你的模板内容
```

视频槽位是 `absolute` 铺满 cell 的，所以叠在它上面的元素要给 `z-index` 才可见。

### 要点

**两种 `cellTemplate` 形式**：对象（所有 cell 共享）或函数 `(item, index) => CellTemplate`（每 cell 独立返回）。函数形式有体积上限：编译后的 HTML + CSS 合计超 256KB 会在 `init()` 调用栈里同步 throw。

**要接收点击的元素不能设 `pointer-events:none`。** 纯展示的角标建议设上，避免挡住视频区域交互；挂了 `data-action` 的元素设了就永远点不到。

**`action` key 后缀**决定响应哪种点击：`:click` 只单击、`:dblclick` 只双击、无后缀单双击都响应。无后缀时一次双击会触发 3 次（click / click / dblclick，浏览器原生行为），要区分就加后缀。

**handler 收到的 `ctx` 只有这些字段。** 点击发生在插件进程，事件经序列化回传，**不是原生 `MouseEvent`** —— 没有 `target`、`clientX`、`offsetX`：

```ts
{
  index: number; // cell 下标
  id: string; // cell 的 deviceId
  data: Record<string, string>; // 触发元素的 data-*（已剔除 data-action 本身）
  event: {
    type: 'click' | 'dblclick';
    ctrlKey;
    shiftKey;
    altKey;
    metaKey;
  }
  cell: CellHandle; // 语法糖，等价 native.cell(index)
  native: EZUIKitNative; // SDK 实例
}
```

嵌套 `[data-action]` 时只有**最内层**响应，外层不触发 —— 需要的话在内层 handler 里手动调外层逻辑。SDK 只阻止冒泡、不阻止默认行为，要拦住 `<a>` 的跳转就用 `<button type="button">`。

## cell() 三层 Handle

```js
native
  .cell(0) // CellHandle：作用在 .ezuikit-cell 根
  .addClass('selected')
  .setText('.title', '前门摄像头') // 语法糖 = find('.title').setText(...)
  .setStyle('.badge', { color: 'red' });

native.cell('device-01').find('.badge').setHtmlUnsafe('<b>3</b>'); // ElementHandle
native.cell(0).findAll('button').at(-1).addClass('active'); // NodeListHandle → at() 得 ElementHandle

native.cell('all').removeClass('selected'); // 批量写

const on = await native.cell(0).hasClass('selected'); // 读是异步的
```

**API 全集**（没列出的方法不存在，别猜 `show` / `hide` / `setAttribute` 这类）：

| 分类          | CellHandle（cell 根）                                                        | ElementHandle / NodeListHandle（子元素）                                                           |
| ------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 写（链式）    | `addClass` `removeClass` `toggleClass` `selectOnly` `setAttr`                | `addClass` `removeClass` `toggleClass` `setAttr` `setText` `setHtmlUnsafe` `setStyle` `clearStyle` |
| 写（语法糖）  | `setText(sel,t)` `setHtmlUnsafe(sel,h)` `setStyle(sel,s)` `clearStyle(sel?)` | —                                                                                                  |
| 读（Promise） | `hasClass` `getAttr` `getText(sel)`                                          | `hasClass` `getAttr` `getText`；**NodeList 无读 API**                                              |
| 定位          | `find` `findAll`                                                             | `find` `findAll`；NodeList 另有 `at(i)` `first()` `last()`                                         |

| 规则                                                            | 原因                                           |
| --------------------------------------------------------------- | ---------------------------------------------- |
| 写 API 同步链式，读 API 返回 Promise                            | 读需要跨进程往返                               |
| `cell('all')` 只能写，读会**同步 throw** TypeError              | 多元素读语义不明确                             |
| `NodeListHandle` 无读 API，先 `.at(i)` / `.first()` / `.last()` | 同上                                           |
| 读超时 3s reject；连接未就绪立即 reject；断连批量 reject        | 防 `await` 永久悬挂                            |
| 下标越界 / deviceId 不存在：写静默跳过、读 reject，都带 warn    | 允许异步初始化期间先调而不炸                   |
| `setStyle` 是追加 + 同名覆盖，要清用 `clearStyle()`             | `clearStyle` 移除整个 style 属性，不影响 class |
| `setHtmlUnsafe` 不做 sanitize                                   | XSS 防护责任在调用方，与 Vue `v-html` 一致     |

`setStyle` 两种写法等价：对象 camelCase（`{ fontSize: '30px' }`）或 CSS 字符串 kebab-case（`'font-size:30px;'`）。

`selectOnly(name)` 是单选语法糖：先清掉容器内所有同类 cell 的该 class，再给当前 cell 加上，一次操作原子完成。不要自己维护 `selectedIndex` 再 `removeClass` + `addClass`。

嵌套 `find('.a').find('.b')` 等价于 `querySelector('.a .b')`（CSS 后代选择器语义）。

## deviceList 回调：命名必须匹配（铁律）

**只有名字匹配 `handle[A-Z]*` 或 `*CallBack` 的函数字段会生效。** 其他名字的函数被丢弃，控制台打 warn。

```js
// ✅ 生效
{ handleError: fn, handleSuccess: fn, handleInitSuccess: fn, capturePictureCallBack: fn }

// ❌ 静默失效（控制台会有 dropped non-callback function fields 警告）
{ onError: fn, errorHandler: fn, onFirstFrame: fn }
```

**为什么**：`deviceList` 要序列化后跨进程传给插件，函数过不去。SDK 的做法是把符合命名规则的函数留在页面侧，在插件端注入同名占位函数，占位函数被调用时把「事件发生了」这个信号回传，SDK 再按 deviceId 找到你本地那个函数执行。名字不匹配就进不了这条通路。

所以「函数不能跨进程，所以逐路回调不可能，只能用全局事件」这个推论是错的 —— **逐路回调可用**，只是要按命名规则写。

其他约束：

- **只识别顶层字段**。`loggerOptions: { onLog: fn }` 这种嵌套函数会被序列化丢掉，改名也救不回来。
- **`deviceList[i].id` 必须全局唯一**。它同时充当画面容器 id、视频容器 id、回调里的 id 字段。重复会导致多路渲染到同一容器、控件失效、回调分不清是哪一路。SDK 检测到会 `console.error`。
- 全局订阅是另一条路：`native.on(eventType, handler)`，不受命名规则限制，但要自己按载荷里的 id 分发。

**别把「候选名映射」当成命名规则的例外。** 两者作用在不同东西上：

| 机制       | 作用对象                         | 规则                                                                                   |
| ---------- | -------------------------------- | -------------------------------------------------------------------------------------- |
| 命名规则   | 你写在 deviceList 里的**字段名** | 只留 `handle[A-Z]*` / `*CallBack`，其余丢弃                                            |
| 候选名映射 | 回传时的**事件名**               | 事件 `startSave` 依次找 `startSave` / `handleStartSave` / `startSaveCallBack` 三个字段 |

所以事件 `startSave` 的三个候选名里，`startSave` 这个字段名本身不匹配命名规则、根本不会被保留 —— 实际能生效的只有 `handleStartSave` 和 `startSaveCallBack`。**判断一个回调能不能用，只看字段名。** 同一函数被多个候选名命中只调一次。

## 参数级联与命名

实例级（写在 `new EZUIKitNative({...})` 或 `init({...})` 顶层）的这些参数会作为 `deviceList[i]` 的默认值下发：`autoplay`、`env`、`staticPath`、`muted`、`download`。device 级显式写的值优先。

| 层级   | 正确写法   | 错误写法                                        |
| ------ | ---------- | ----------------------------------------------- |
| 实例级 | `autoplay` | `autoPlay`（兼容但打 warn，后续版本移除）       |
| device | `autoplay` | `autoPlay`（**不生效**，只 console.error 提示） |

## 窗口跟随行为

SDK 自动让播放窗口跟住你的容器，你不需要写任何跟随代码。它承诺的行为：

- 容器移动、页面滚动、窗口 resize：自动跟随。
- 浏览器缩放（Ctrl+滚轮 / Ctrl+±）：自动跟随。
- **多屏不同缩放比**（如主屏 175% + 副屏 100%）：跨屏拖动后自动重新摆位，混合 DPI 组合已支持。
- 页面切到后台标签：暂停跟随；切回来重新摆位。
- 页面刷新 / 关闭：自动清理。
- 跨屏瞬间窗口位置会短暂稳定一下再补正，是有意的防抖，不是卡顿。
- 播放窗口先摆位、画面分辨率随后重建，切换过程中有一小段画面被拉伸，属正常。

你需要保证的只有一件事：**容器必须有真实的宽高**。父链任一节点高度没收敛（如 `#app` 没设 `height:100%` 导致子元素 `calc(100% - 40px)` 塌成 0），窗口会被摆成 0 高度 —— 日志全是成功、事件全走成功路径，但画面不显示。SDK 检测到容器高度为 0 会 `console.error` 指路，但不会去改你的 DOM。

**如果确实遇到位置偏移**，先做一次算术分流：SDK 的取整误差是 1~2 物理像素量级，**几十像素的偏移不是取整问题**。反馈时请提供：SDK 版本、插件版本（`getPlayerVersion()` 的返回值）、各屏的缩放比与排列方式、浏览器缩放比、容器的 `getBoundingClientRect()` 结果。插件版本过旧是这类问题的高频原因。

**打开 DevTools 会影响窗口位置**，属于已知现象，生产环境不受影响。

## 生命周期与状态

```
idle → connecting → connected → closed
              ↘ retrying → connecting → ...（最多 3 次）→ closed
```

**唤起流程**：构造时即尝试连接 → 连不上就通过自定义协议唤起插件（浏览器可能弹出「是否打开外部应用」确认框，需用户确认）→ 等 3s 重连 → 最多 3 次。

**前两次失败 SDK 内部吃掉，不 emit 错误。** 插件冷启动时首次连接必然失败（进程还没起来），对外报错会让你误判。只有第 3 次失败才 emit `launchFailed`。

| 事件           | 时机               | 参数                                                         |
| -------------- | ------------------ | ------------------------------------------------------------ |
| `connect`      | 连接状态变化       | `code`: 0 成功 / -1 断开 / -2 最终失败                       |
| `launchFailed` | 3 次唤起全失败     | `{ code:-3, attempts:3 }` → 此时展示插件安装引导             |
| `init`         | 调用 init 后       | `{ code:0 }`；非插件模式超 9 路时 code=-1                    |
| `error`        | 操作被拒           | -1 未初始化 / -2 参数非法 / -3 播放端未就绪 / -4 cell 未找到 |
| `websocket`    | **播放端**就绪状态 | `code`: 0 就绪 / -1 关闭 / -2 异常                           |

**`websocket code=0` 才是「可以下发指令了」的信号**，`connect code=0` 只代表连上了插件进程。首次下发画面内容、写角标文本这类操作要挂在 `websocket` 上，挂在 `connect` 上会太早。

**断连后状态会被复位**（`inited` / 播放端就绪 / 播放中 / 全屏标记全部清空，pending 的读请求批量结算）。重连成功后 SDK 会自动重发一次初始化参数 —— **断线重连一般不需要你手动重新 `init`**。反过来，主动 `destroyPlayer()` 之后重连不会恢复画面，这是有意的，避免把你刚销毁的画面又拉回来。

页面 `beforeunload` 时 SDK 自动清理插件窗口和连接。

## 常见错误

| 现象                                      | 原因与修复                                                                                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 回调不触发                                | 字段名不匹配 `handle[A-Z]*` / `*CallBack`；或函数放在嵌套对象里                                                                            |
| 画面不显示但日志全是成功                  | 容器高度 0（父链 CSS 塌陷），看控制台的 error 提示                                                                                         |
| 多路画面串流 / 控件失效                   | `deviceList[i].id` 重复                                                                                                                    |
| 二次 init 后上次的配置还在                | `init()` 是合并语义，不传的字段保留上次的值。**只有 `render` 例外**：不传时 SDK 显式删除（否则上次的角标会残留）。想清其他字段要显式传新值 |
| 角标点不动                                | 挂了 `data-action` 的元素被设了 `pointer-events:none`                                                                                      |
| 角标被视频盖住                            | 视频槽位是 absolute 铺满的，叠在上面的元素要给 `z-index`                                                                                   |
| `cell(i)` 静默无反应                      | 下标越界或 deviceId 不存在，控制台有 warn，写 API 静默跳过                                                                                 |
| `await native.capturePicture(0)` 拿不到值 | 转发调用不返回值，走 `capturePictureCallBack`                                                                                              |
| `import { EZUIKitNative }` 得到 undefined | 它在默认导出对象上，不是具名导出                                                                                                           |
| 新版本的功能调不动                        | 插件内置的播放端比 npm 包旧，升插件。控制台会有 warn 精确点出缺哪项能力                                                                    |

**废弃项**：`destroy(id)` → 用 `destroyPlayer(id)`；实例级 `autoPlay` → `autoplay`；device 级 `autoPlay` 从来不生效。

## 排查入手点

- **插件端的日志会自动出现在你页面的 DevTools**，前缀 `[EZUIKit][Player]`。同一条消息 5s 内限 10 条，超出会提示已抑制。
- **版本对齐**：`getPlayerVersion()` 查插件内置的播放端版本。SDK 版本低于它时控制台提示可升级 npm（这个方向不影响现有功能，只是用不到插件的新能力）。反方向（npm 比插件新）由运行时告警精确点出缺失的能力项，不靠版本号比较 —— 多数版本并不涉及能力变更，比较会长期误报。
- **连接一直失败**：确认插件已安装且进程能被唤起；浏览器的「打开外部应用」确认框是否被拦；同机是否已有另一个标签页占用了跟随连接。
- **报错先看 `error` 事件的 code**，四个码分别对应未初始化、参数非法、播放端未就绪、cell 未找到，能直接定位是时序问题还是参数问题。

## 本文档不覆盖的

| 主题                                              | 去哪找                                                                                    |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `deviceList[i]` 的全部可用字段、`template` 可选值 | 单路播放器（EZUIKitPlayer）的参数文档 —— Native 把这些字段原样透传下去                    |
| 播放器业务事件全集（首帧、录像、对讲状态…）       | 单路播放器的事件文档。顶级事件全量桥接过来，嵌套子组（date/ptz/zoom/timeLine/http）不桥接 |
| SDK 版本与插件最低版本的对照表                    | 没有维护这张表。用 `getPlayerVersion()` 加控制台的能力缺失告警作为运行时判据              |
| 插件安装包、已装版本检测                          | 萤石开放平台渠道                                                                          |
