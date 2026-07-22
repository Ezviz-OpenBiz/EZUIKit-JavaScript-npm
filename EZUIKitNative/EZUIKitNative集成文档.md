# EZUIKitNative

> 最新更新时间：2026.06.24 | 版本：v9.0.12
> 本地修订：2026.07.17，修正自定义 render 示例的画格根布局、视频槽位和覆盖层样式，避免组合使用 `containerStyle` 与 `cellTemplate` 时视频黑屏。
> 原始来源：[Ezviz-OpenBiz/EZUIKit-JavaScript-npm](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/EZUIKitNative/EZUIKitNative%E9%9B%86%E6%88%90%E6%96%87%E6%A1%A3.md)

## 一、EZUIKitNative 介绍

EZUIKitNative 是一个基于本地插件的多画面视频播放器解决方案，专为需要同时播放大量视频流的场景设计。它通过 WebSocket 与本地 CEF（Chromium Embedded Framework）桌面插件进程通信，实现在浏览器页面上叠加一个独立的本地窗口来承载多路视频播放，支持最多 **25 路**视频同时播放。

### 主要特性

- **能力升级**：提供插件、无插件两种模式，插件模式最多支持 25 屏同时播放
- **快速接入**：完整封装插件交互逻辑，纯前端低成本集成
- **平滑升级**：基于 EZUIKitPlayer 扩展升级，参数、功能、事件等 100% 向前兼容
- **灵活跟随**：插件窗口随浏览器位置、大小、可见性自适应变化,支持自由指定布局行列数
- **自定义渲染（v9.0.10 新增）**：通过 HTML 模板 + CSS 注入叠加自定义 DOM（菜单/控件/序号等），通过三层链式 Handle API 操作 cell 状态
- **缩放适配（v9.0.10 修复）**：内置浏览器 DPI 监听（matchMedia），与系统缩放综合适配，100/125/150/175% 缩放下画格无错位

### 适用场景

- 无人值守监控
- 直播大屏展示
- 视频巡检平台
- 其他多屏需求

### 集成环境说明

| 项目     | 推荐配置                                            |
| -------- | --------------------------------------------------- |
| 操作系统 | Windows 10（64位）、Windows 11（64位）              |
| CPU      | 处理器 i7-12700K 或以上                             |
| 内存     | 16G                                                 |
| 显卡     | GTX1060 或以上独立显卡,或 Graphics 770 以上集成显卡 |
| 网卡     | 25 路并发 1080P 情况下,1000Mbps 或以上              |
| 浏览器   | Chrome V127 或以上版本                              |

## 二、快速开始

### 2.0 准备工作

- 访问 [GitHub - 轻应用 EZUIKit](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/tree/master/EZUIKitNative)，获取本地插件安装包【CEFBrowserSetup.exe】并完成安装
- 或直接[下载插件安装包](https://izhstatic.ys7.com/vasp-openweb/1782457199500_CEFBrowserSetup.exe)，并完成安装
- 确保轻应用升级到 v9.0.12 及以上版本

### 2.1 引入 SDK

**NPM 安装：**

```bash
# npm
npm install ezuikit-js

# yarn
yarn add ezuikit-js
```

**页面引入：**

```html
<!-- script 标签引入 -->
<script src="./ezuikit.js"></script>
```

```javascript
// 或 ES Module 引入
import EZUIKit from 'ezuikit-js';
```

### 2.2 容器准备

在页面中创建一个容器元素作为插件的跟随锚点：

```html
<div id="players-container"></div>
```

> **重要：** 在 HTML 的 `<head>` 标签中必须设置 `<title>` 标签。本地插件通过 title 确认目标页面，否则会导致插件无法正常显示。

### 2.3 创建实例

```javascript
// 通过 id 确定跟随锚点
const native = new EZUIKit.EZUIKitNative({
  container: 'players-container',
});

// 通过 DOM 元素确定跟随锚点
const native = new EZUIKit.EZUIKitNative({
  container: document.getElementById('players-container'),
});
```

### 2.4 初始化播放器

> **注意：** 初始化播放需要在插件连接成功之后执行，否则指令无法成功发送给插件。SDK 内部支持就绪检测：如果插件端尚未就绪，参数会被缓存，就绪后自动发送。

```javascript
native.on('connect', (res) => {
  if (res.code !== 0) {
    console.log(`插件连接断开: ${JSON.stringify(res)}`);
  } else {
    console.log('插件连接成功');
    // 初始化播放器
    native.init({
      layout: { col: 2, row: 2 },
      deviceList: [
        {
          id: 'player0',
          width: '100%',
          height: '100%',
          template: 'pcLive',
          url: 'ezopen://open.ys7.com/设备序列号/1.live',
          accessToken: 'your_access_token',
          staticPath: './ezuikit_static',
        },
      ],
    });
  }
});
```

### 2.5 完整示例

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <!-- 必须添加 title -->
    <title>EZUIKitNative 示例</title>
    <script src="./ezuikit.js"></script>
    <style>
      #players-container {
        width: 100vw;
        height: 100vh;
        background-color: #000;
      }
    </style>
  </head>
  <body>
    <div id="players-container"></div>

    <script>
      const native = new EZUIKit.EZUIKitNative({
        container: 'players-container',
      });

      native.on('connect', (res) => {
        if (res.code === 0) {
          console.log('插件连接成功');
          native.init({
            layout: { col: 2, row: 2 },
            deviceList: [
              {
                id: 'player0',
                width: '100%',
                height: '100%',
                template: 'pcLive',
                url: 'ezopen://open.ys7.com/设备序列号/1.live',
                accessToken: 'your_access_token',
                staticPath: './ezuikit_static',
              },
            ],
          });
        }
      });

      native.on('launchFailed', (res) => {
        console.error(`插件唤起失败,已重试 ${res.attempts} 次`);
      });
    </script>
  </body>
</html>
```

## 三、播放模式

EZUIKitNative 是对 EZUIKitPlayer 的扩展升级,提供无插件、插件两种模式,可根据业务场景按需使用。

### 3.1 模式说明

| 模式               | 说明                                    | 最大画面数 | 适用场景                             |
| ------------------ | --------------------------------------- | ---------- | ------------------------------------ |
| 无插件模式(mode=0) | 批量初始化 EZUIKitPlayer 创建多个播放器 | 9 路       | 并发数不多,或 UI 交互/布局需求较复杂 |
| 自动模式(mode=1)   | 根据设备数量自动判断使用插件/无插件模式 | -          | 通用场景                             |
| 插件模式(mode=2)   | 与本地 CEF 插件通信,突破浏览器资源限制  | 25 路      | 多屏巡检、大屏展示                   |

### 3.2 无插件模式示例

```javascript
const native = new EZUIKit.EZUIKitNative({
  container: 'players-container',
  mode: 0, // 0:不使用插件,1:自动,2:强制使用插件
  deviceList: [
    {
      id: 'player0',
      width: '100%',
      height: '100%',
      template: 'pcLive',
      url: 'ezopen://open.ys7.com/设备序列号/通道号.live',
      accessToken: 'at.xxx',
      handleSuccess: () => {
        console.log('播放成功');
      },
      handleError: (res) => {
        console.error('播放失败', res);
      },
    },
  ],
});

// 无插件模式下,播放器实例托管在 native.players 中
native.players[0].changePlayUrl({ url: 'ezopen://open.ys7.com/设备序列号/通道号.live' });
```

## 四、EZUIKitNative - 插件模式 API

### 4.1 构造函数

```
new EZUIKit.EZUIKitNative(options)
```

创建 EZUIKitNative 实例。

| 参数       | 说明                                           | 类型                           | 默认值             | 必填 |
| ---------- | ---------------------------------------------- | ------------------------------ | ------------------ | ---- |
| container  | 插件跟随锚点                                   | `HTMLElement \| string`        | -                  | 是   |
| mode       | 播放模式：0-不使用插件,1-自动,2-强制使用插件   | `number`                       | 2                  | 否   |
| autoPlay   | 是否自动播放                                   | `boolean`                      | false              | 否   |
| layout     | 布局配置                                       | `{ col: number, row: number }` | { col: 4, row: 4 } | 否   |
| deviceList | 设备列表                                       | `Array`                        | []                 | 否   |
| **render** | **自定义渲染配置（v9.0.10 新增），详见第五章** | `RenderOptions`                | undefined          | 否   |

```javascript
const native = new EZUIKit.EZUIKitNative({
  container: 'players-container',
  mode: 2,
});
```

### 4.2 init(options) - 初始化播放器

```
native.init(options)
```

初始化播放器并配置设备列表。支持就绪检测：如果插件端尚未就绪,参数会被缓存,就绪后自动发送。

| 参数       | 说明                              | 类型                           | 必填 |
| ---------- | --------------------------------- | ------------------------------ | ---- |
| deviceList | 设备列表                          | `Array<EZUIKitPlayerParams>`   | 是   |
| layout     | 布局配置,优先级高于构造时传入的值 | `{ col: number, row: number }` | 否   |
| render     | 自定义渲染配置（v9.0.10 新增）    | `RenderOptions`                | 否   |

> **注意：** 当 deviceList 数量大于布局总数时,只会初始化前 `col × row` 个元素。

**EZUIKitPlayerParams 配置项：**

| 参数              | 类型       | 必填 | 说明                                |
| ----------------- | ---------- | ---- | ----------------------------------- |
| id                | `string`   | 是   | 播放器唯一标识                      |
| width             | `string`   | 是   | 播放器宽度                          |
| height            | `string`   | 是   | 播放器高度                          |
| template          | `string`   | 是   | 模板类型：pcLive(直播)、pcRec(回放) |
| url               | `string`   | 是   | 播放地址(ezopen 协议)               |
| accessToken       | `string`   | 是   | 访问令牌                            |
| handleSuccess     | `Function` | 否   | 播放成功回调（V1 老命名兼容）       |
| handleError       | `Function` | 否   | 播放失败回调                        |
| handleInitSuccess | `Function` | 否   | 初始化成功回调（V1 老命名兼容）     |

更多参数详见：[EZUIKitPlayer 初始化参数说明](https://open.ys7.com/help/4294)

```javascript
native.init({
  layout: { col: 4, row: 4 },
  deviceList: [
    {
      id: 'player0',
      width: '100%',
      height: '100%',
      template: 'pcLive',
      url: 'ezopen://open.ys7.com/设备序列号/通道号.live',
      accessToken: 'at.xxx',
      handleSuccess: () => {
        console.log('播放成功');
      },
      handleError: (res) => {
        console.error('播放失败', res);
      },
    },
  ],
});
```

### 4.3 play(id?, params?) - 播放视频

```
native.play(id?, params?)
```

开始播放指定的视频或所有视频。

| 参数   | 类型               | 必填 | 说明                                    |
| ------ | ------------------ | ---- | --------------------------------------- |
| id     | `string \| number` | 否   | 播放器 id 或下标,不传则对所有播放器执行 |
| params | `any`              | 否   | 播放参数                                |

```javascript
// 播放指定播放器(通过下标)
native.play(0);

// 播放指定播放器(通过 ID)
native.play('player0');

// 播放所有播放器
native.play();
```

### 4.4 stop(id?, params?) - 停止播放

```
native.stop(id?, params?)
```

停止播放指定的视频或所有视频。参数同 `play`。

```javascript
native.stop(0); // 停止指定播放器
native.stop(); // 停止所有播放器
```

### 4.5 switchLayout(layout) - 切换布局

```
native.switchLayout(layout)
```

动态切换布局。增量式增减播放器,已有播放流不中断。

| 参数   | 类型                           | 必填 | 说明                     |
| ------ | ------------------------------ | ---- | ------------------------ |
| layout | `{ col: number, row: number }` | 是   | col 和 row 范围为 [1, 5] |

> **提示：** 相同布局不重复发送。已有的播放流在切换布局时不会中断。

```javascript
native.switchLayout({ col: 2, row: 2 }); // 切换为 2×2 布局
native.switchLayout({ col: 5, row: 5 }); // 切换为 5×5 布局(最大)
```

### 4.6 fullscreen(id?) - 全屏播放

```
native.fullscreen(id?)
```

进入全屏模式。传 `id` 为单画面全屏,不传为整体全屏。

```javascript
native.fullscreen(); // 整体全屏
native.fullscreen('player0'); // 单画面全屏
```

### 4.7 exitfullscreen(id?) - 退出全屏

```
native.exitfullscreen(id?)
```

退出全屏模式。参数同 `fullscreen`。

```javascript
native.exitfullscreen(); // 退出全屏
```

### 4.8 destroy(id?, force?) - 销毁播放器

```
native.destroy(id?, force?)
```

销毁播放器实例。

| 参数  | 类型               | 必填 | 说明                                  |
| ----- | ------------------ | ---- | ------------------------------------- |
| id    | `string \| number` | 否   | 播放器 id 或下标,不传则销毁所有       |
| force | `boolean`          | 否   | 是否强制销毁(关闭 CEF 窗口并断开连接) |

```javascript
native.destroy(0); // 销毁指定播放器
native.destroy(); // 销毁所有播放器
native.destroy(undefined, true); // 强制销毁并关闭插件
```

### 4.9 reload() - 重新加载

```
native.reload()
```

重载内嵌播放页面。重置初始化状态,WebSocket 连接不断,只重载 CEF 内嵌页面。

```javascript
native.reload();
```

### 4.10 launch() - 手动唤起插件

```
native.launch()
```

手动唤起 CEF 插件并尝试连接。仅在 `idle` 或 `closed` 状态下生效,`connected`、`connecting`、`retrying` 状态下调用会被忽略。

> **提示：** 通常无需手动调用,SDK 在构造时会自动尝试连接和唤起。此方法适用于用户手动点击"重试"按钮的场景。

```javascript
native.launch(); // 手动唤起插件
```

### 4.11 setContainerStyle(style) - 动态更新容器样式（v9.0.10 新增）

```
native.setContainerStyle(style)
```

动态更新 `#player-container` 容器的样式（不重建 player 实例）。业务场景：切换主题色 / 背景色 / 间距等,无需付出"重新 init 闪一下"的代价。

| 参数  | 类型     | 必填 | 说明                                   |
| ----- | -------- | ---- | -------------------------------------- |
| style | `string` | 是   | CSS 属性集合（无选择器,直接 CSS 文本） |

```javascript
native.setContainerStyle('background: #1e3a8a; padding: 8px;');
```

### 4.12 cell(target) - cell 操作入口（v9.0.10 新增,核心 API）

```
native.cell(target)
```

返回指定 cell 的 `CellHandle` 链式操作句柄,用于动态修改 cellTemplate 渲染的 DOM 状态。**这是自定义渲染的核心 API**,详见第五章。

| 参数   | 类型                        | 说明                                         |
| ------ | --------------------------- | -------------------------------------------- |
| target | `number \| string \| 'all'` | 目标 cell：下标(0~24) / id(deviceId) / 'all' |

```javascript
// 给所有 cell 加 class
native.cell('all').addClass('hi');

// 给单个 cell 加 class（链式）
native.cell(2).addClass('selected').setAttr('data-status', 'alarm');

// 单选语法糖：清掉所有同类 cell 的 class,再给当前 cell 加上
native.cell(2).selectOnly('selected');

// 子元素操作（嵌套）
native.cell(2).find('.title').setText('已选中');

// 异步读
const text = await native.cell(2).find('.title').getText();
```

### 4.13 其他 API 透传调用

```
native[api](id, params)
```

EZUIKitNative 实例支持透传调用指定播放器的 API。未在类上定义的方法会自动转发给对应播放器实例。

```javascript
// 调用 id 为 "player2" 的播放器的 changePlayUrl 方法
native.changePlayUrl('player2', { url: 'ezopen://open.ys7.com/AZ3754171/1.live' });

// 截图
native.capturePicture(0, { download: true });

// 开启声音
native.openSound(0);
```

更多 API 详见：[EZUIKitPlayer API 文档](https://open.ys7.com/help/4275)

## 五、自定义渲染（v9.0.10 新增）

通过 HTML 模板 + CSS 注入,可在 ezuikit 已有播放画格上**叠加自定义 DOM**(菜单按钮、回放控件、头部栏、序号样式等),无需改 SDK 源码即可实现差异化外观。配合三层链式 Handle API,可在运行时动态修改 cell 状态。

> **本章 API 全部由默认实例提供**（即 `new EZUIKit.EZUIKitNative({ container })` 创建的实例）。业务方直接调用 `native.cell(...)` 等 API 即可,无需关心内部如何与 CEF 内嵌页通信。

### 5.1 核心概念

| 概念                         | 说明                                                           |
| ---------------------------- | -------------------------------------------------------------- |
| **cellTemplate**             | HTML 模板,所有 cell 共用（对象形式）或每 cell 独立（函数形式） |
| **`[data-ezuikit-video]`**   | 模板里的"视频槽位",SDK 把 ezuikit 的 canvas 嵌入到该元素       |
| **`{index}` `{id}`**         | 模板里的占位符,自动 HTML escape 防止破坏模板结构               |
| **`[data-action="<name>"]`** | 模板里的事件触发元素,被点击/双击时调用 action handler          |
| **CellHandle**               | 操作 cell 根元素的链式 API                                     |
| **ElementHandle**            | 操作 cell 内某个子元素（querySelector 命中）的链式 API         |
| **NodeListHandle**           | 操作 cell 内一组子元素（querySelectorAll 命中）的链式 API      |

> **布局约束（模板根）：** `cellTemplate` 的根元素必须是占满画格的定位容器，至少设置 `position: relative; width: 100%; height: 100%; box-sizing: border-box;`。SDK 会将视频槽位及其播放器元素绝对定位并铺满该根容器；标题、按钮等自定义内容应作为 `z-index` 大于 0 的覆盖层。
>
> **布局约束（containerStyle）：** `containerStyle` 只能放**不影响 `#player-container` grid 布局尺寸**的属性。SDK 按“父页 `#players-container` rect × dpr ÷ (col × row)”决定 canvas 内在 buffer 分辨率，如果 CEF 内嵌页的 `#player-container` 因下列属性缩小或变形，实际 cell 显示 rect 会小于 canvas 内在 buffer，视频会画到越界区被裁掉，屏幕上呈现黑屏：
>
> - 允许：`background` / `background-image` / `border-radius` / `box-shadow` / `filter`（不影响布局尺寸）
> - 禁用：`padding` / `gap` / `border` / `margin`（会让 grid 内容区缩小或撑破容器 100% 尺寸）
>
> 如果需要在画格之间做视觉分隔，请把边框/间距样式放到 `cellTemplate.css` 的 `.cell`（或自定义子元素）上，不要放到 `containerStyle`。

### 5.2 render 配置

```typescript
interface RenderOptions {
  containerStyle?: string; // 大容器 CSS 文本
  cellTemplate?: CellTemplate | CellTemplateFn; // 对象形式或函数形式
}

interface CellTemplate {
  template?: string; // HTML 模板（含视频槽位 / 占位符）
  css?: string; // 注入到 <head> 的 CSS
  action?: Record<ActionKey, ActionHandler>; // 事件处理（详见 5.4）
}

type CellTemplateFn = (item: EZUIKitPlayerParams, index: number) => CellTemplate;
```

### 5.3 cellTemplate 对象形式（所有 cell 共享模板）

> `containerStyle` 只放 background 等**不影响布局**的属性，参见 §5.1 布局约束；画格边框/间距请放到 `.cell` 上（对 SDK canvas 内在 buffer 无影响）。

```javascript
const native = new EZUIKit.EZUIKitNative({
  container: 'players-container',
  render: {
    containerStyle: 'background: #1e3a8a;',
    cellTemplate: {
      template: `
        <div class="cell">
          <header class="title">设备 {index} - {id}</header>
          <div data-ezuikit-video></div>
          <footer class="toolbar">
            <button data-action="snap" type="button">截图</button>
            <button data-action="select:click" type="button">选中</button>
          </footer>
        </div>
      `,
      css: `
        .cell {
          position: relative;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          overflow: hidden;
          border: 1px solid #333;
        }
        .cell.selected { border-color: #ff5722; }
        .cell .title,
        .cell .toolbar {
          position: absolute;
          left: 0;
          right: 0;
          z-index: 1;
          padding: 4px;
          color: #fff;
          background: rgba(34, 34, 34, 0.85);
        }
        .cell .title { top: 0; }
        .cell .toolbar { bottom: 0; }
      `,
      action: {
        snap: (ctx) => native.capturePicture(ctx.index, { download: true }),
        'select:click': (ctx) => native.cell(ctx.index).selectOnly('selected'),
      },
    },
  },
});
```

### 5.4 cellTemplate 函数形式（每 cell 独立模板）

每个 cell 调用一次 `cellTemplateFn`,返回的 CSS 相同时 SDK 会按内容自动去重,减少传输开销。

```javascript
const native = new EZUIKit.EZUIKitNative({
  container: 'players-container',
  render: {
    cellTemplate: (item, index) => ({
      template: `
        <div class="cell ${index % 2 ? 'odd' : 'even'}">
          <span class="badge">#${index}</span>
          <div data-ezuikit-video></div>
        </div>
      `,
      css: `
        .cell {
          position: relative;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }
        .odd { background: #1a1a2e; }
        .even { background: #16213e; }
        .badge {
          position: absolute;
          top: 4px;
          left: 4px;
          z-index: 1;
          color: #fff;
        }
      `,
    }),
  },
});
```

### 5.5 三层 Handle API

#### CellHandle（操作 cell 根元素）

```typescript
interface CellHandle {
  // 写 API（同步链式）
  addClass(name: string): CellHandle;
  removeClass(name: string): CellHandle;
  toggleClass(name: string, force?: boolean): CellHandle;
  selectOnly(name: string): CellHandle; // 单选语法糖（1 次原子协议）
  setAttr(name: string, value: string | null): CellHandle;

  // 读 API（异步 Promise,强制单 cell target）
  hasClass(name: string): Promise<boolean>;
  getAttr(name: string): Promise<string | null>;

  // 子元素便捷写（语法糖：等价 find(sel).setXxx）
  setText(selector: string, text: string): CellHandle;
  setHtmlUnsafe(selector: string, html: string): CellHandle;
  setStyle(selector: string, style: Record<string, string> | string): CellHandle;
  clearStyle(selector?: string): CellHandle;
  getText(selector: string): Promise<string>;

  // 子元素定位
  find(selector: string): ElementHandle; // 首个匹配
  findAll(selector: string): NodeListHandle; // 全部匹配
}
```

#### ElementHandle（操作 cell 内某个子元素）

```typescript
interface ElementHandle {
  // 写 API（链式）
  addClass(name: string): ElementHandle;
  removeClass(name: string): ElementHandle;
  toggleClass(name: string, force?: boolean): ElementHandle;
  setAttr(name: string, value: string | null): ElementHandle;
  setText(text: string): ElementHandle;
  setHtmlUnsafe(html: string): ElementHandle;
  setStyle(style: Record<string, string> | string): ElementHandle;
  clearStyle(): ElementHandle;

  // 读 API（异步）
  hasClass(name: string): Promise<boolean>;
  getAttr(name: string): Promise<string | null>;
  getText(): Promise<string>;

  // 嵌套定位
  find(selector: string): ElementHandle;
  findAll(selector: string): NodeListHandle;
}
```

#### NodeListHandle（操作一组子元素）

```typescript
interface NodeListHandle {
  // 写 API（对全集合生效,链式）
  addClass(name: string): NodeListHandle;
  removeClass(name: string): NodeListHandle;
  toggleClass(name: string, force?: boolean): NodeListHandle;
  setAttr(name: string, value: string | null): NodeListHandle;
  setText(text: string): NodeListHandle;
  setHtmlUnsafe(html: string): NodeListHandle;
  setStyle(style: Record<string, string> | string): NodeListHandle;
  clearStyle(): NodeListHandle;

  // 取单元素后再用 ElementHandle 的读 API
  at(index: number): ElementHandle; // 支持负索引：at(-1) = 最后一个
  first(): ElementHandle;
  last(): ElementHandle;
}
```

> **性能优化**：链式调用会通过 microtask 自动聚合,N 次操作合并为 1 次提交,业务方无需手动批处理。例如 `cell('all').addClass('a').removeClass('b').setAttr('data-x', '1')` 在内部只触发 1 次执行。

### 5.6 action 单双击区分

action key 支持后缀 `:click` 或 `:dblclick` 来显式区分：

| key 形式          | 触发时机         |
| ----------------- | ---------------- |
| `'open'`          | 单击和双击都触发 |
| `'open:click'`    | 仅单击触发       |
| `'open:dblclick'` | 仅双击触发       |

```javascript
render: {
  cellTemplate: {
    template: `
      <div class="cell">
        <div data-ezuikit-video></div>
        <div class="action-bar" data-action="hover" data-zone="header">
          <button data-action="select:click" type="button">单击选中</button>
          <button data-action="fullscreen:dblclick" type="button">双击全屏</button>
        </div>
      </div>
    `,
    css: `
      .cell {
        position: relative;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: hidden;
      }
      .action-bar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1;
      }
    `,
    action: {
      'select:click': (ctx) => native.cell(ctx.index).selectOnly('selected'),
      'fullscreen:dblclick': (ctx) => native.fullscreen(ctx.index),
      hover: (ctx) => console.log('zone=', ctx.data.zone, 'type=', ctx.event.type),
    },
  },
}
```

**ActionContext（handler 接收的参数）：**

```typescript
interface ActionContext {
  index: number; // cell 下标
  id: string; // cell 对应的 deviceId
  data: Record<string, string>; // 触发元素的 data-* 属性（剔除 data-action）
  event: {
    type: 'click' | 'dblclick';
    ctrlKey: boolean; // Ctrl 键状态（多选场景）
    shiftKey: boolean; // Shift 键状态（范围选择场景）
    altKey: boolean;
    metaKey: boolean;
  };
  cell: CellHandle; // 当前 cell 的操作句柄（语法糖）
  native: any; // SDK 实例
}
```

### 5.7 占位符与 escape

模板里的 `{index}` `{id}` 自动 HTML escape,**防止破坏模板结构**(不是防 XSS)。XSS 防护责任明确转给业务方（参考 Vue v-html 哲学）。

```javascript
// 假设 deviceId = '<script>alert(1)</script>'
template: '<div>设备 {id}</div>';
// 渲染后：
// <div>设备 &lt;script&gt;alert(1)&lt;/script&gt;</div>  ✅ 安全
```

> **说明：** 上述 `template` 仅用于展示占位符转义结果，不是可独立运行的完整 `cellTemplate`。完整模板仍须遵循 §5.1 的根布局约束并包含 `[data-ezuikit-video]`。
>
> **业务方需注意**：使用 `setHtmlUnsafe` 时不会 escape,要自行确保内容安全。

### 5.8 视频槽位 `[data-ezuikit-video]`

模板里**必须含 `[data-ezuikit-video]` 元素作为视频画格槽位**,SDK 把 ezuikit 创建的 canvas/video 嵌入到该位置。SDK 基础样式会将视频槽位及播放器元素绝对定位并铺满整个 cell，因此不要使用 `flex: 1`、普通文档流或 `height: calc(...)` 调整视频区域；标题、菜单、按钮应使用绝对定位覆盖在视频之上。

> **canvas 内在 buffer 尺寸契约：** SDK 用父页 `#players-container` rect × dpr ÷ (col × row) 计算 canvas 内在 buffer 分辨率（WebGL/wasm 渲染的目标尺寸），并按此值创建 `EZUIKitPlayer(width, height)`。业务方必须保证 CEF 内嵌页里 `.ezuikit-cell` 实际显示 rect 与该值一致——即**不要通过 `containerStyle` 的 padding/gap 或 `#player-container` 的 margin/border 让 grid 内容区缩小**，否则视频会画到 canvas 内在坐标系里超出 CSS 显示区的部分被裁掉，屏幕呈现黑屏。`.cell` 上的 border 只影响视频槽位在 cell 内的显示 rect（scale 会自动跟随），不影响 canvas 内在 buffer，属于安全属性。

```html
<!-- 推荐：视频铺满画格，标题作为覆盖层 -->
<div class="cell">
  <header class="cell-title">标题栏</header>
  <div data-ezuikit-video></div>
</div>

<style>
  .cell {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }
  .cell-title {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
</style>

<!-- 降级：缺失槽位时,视频元素会附加到 cell 根末尾,控制台告警 -->
<div class="cell">
  <header class="cell-title">标题栏</header>
  <!-- 没写 [data-ezuikit-video] -->
</div>
```

### 5.9 完整示例

```javascript
const native = new EZUIKit.EZUIKitNative({
  container: 'players-container',
  layout: { col: 2, row: 2 },
  deviceList: [
    { id: 'cam-0', url: 'ezopen://open.ys7.com/AZ3754171/1.live', accessToken: 'at.xxx', template: 'pcLive' },
    { id: 'cam-1', url: 'ezopen://open.ys7.com/AZ3754171/2.live', accessToken: 'at.xxx', template: 'pcLive' },
    { id: 'cam-2', url: 'ezopen://open.ys7.com/AZ3754172/1.live', accessToken: 'at.xxx', template: 'pcLive' },
    { id: 'cam-3', url: 'ezopen://open.ys7.com/AZ3754172/2.live', accessToken: 'at.xxx', template: 'pcLive' },
  ],
  render: {
    containerStyle: 'background: #0f172a;',
    cellTemplate: {
      template: `
        <div class="cell">
          <header class="cell-header">
            <span class="title">{id}</span>
            <span class="badge">#{index}</span>
          </header>
          <div data-ezuikit-video></div>
          <footer class="cell-footer">
            <button data-action="select:click" type="button">选中</button>
            <button data-action="fullscreen:dblclick" type="button">全屏</button>
            <button data-action="snap" type="button">截图</button>
          </footer>
        </div>
      `,
      css: `
        .cell {
          position: relative;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          overflow: hidden;
          border: 1px solid #334155;
          border-radius: 4px;
        }
        .cell.selected { border-color: #f59e0b; border-width: 2px; }
        .cell-header,
        .cell-footer {
          position: absolute;
          left: 0;
          right: 0;
          z-index: 1;
          display: flex;
          padding: 4px 8px;
          color: #fff;
        }
        .cell-header {
          top: 0;
          justify-content: space-between;
          background: rgba(30, 41, 59, 0.88);
        }
        .cell-footer {
          bottom: 0;
          gap: 4px;
          background: rgba(15, 23, 42, 0.88);
        }
        .cell-footer button {
          color: #fff;
          background: #334155;
          border: none;
          padding: 2px 8px;
          cursor: pointer;
        }
      `,
      action: {
        'select:click': (ctx) => {
          ctx.cell.selectOnly('selected');
          console.log('选中', ctx.id);
        },
        'fullscreen:dblclick': (ctx) => native.fullscreen(ctx.index),
        snap: (ctx) => native.capturePicture(ctx.index, { download: true }),
      },
    },
  },
});

// 运行时动态操作
setTimeout(() => {
  native.cell(0).addClass('highlight').find('.title').setText('LIVE - cam-0');
}, 3000);
```

### 5.10 设计要点

| 要点                    | 说明                                                     |
| ----------------------- | -------------------------------------------------------- |
| 批量执行                | 链式调用通过 microtask 自动合并,N 次操作合并为 1 次提交  |
| CSS 去重                | 函数式 cellTemplate 返回相同 CSS 内容时自动按内容去重    |
| action handler 本地执行 | 注册的 action 函数体在调用方进程内执行,零序列化开销      |
| 不传 render 等价旧行为  | 老用户零破坏,不传 `render` 参数时 SDK 退化到原有渲染逻辑 |
| 不操作 ezuikit 内部 DOM | 仅允许在 cell 容器层叠加,不触碰 video 元素本身           |

## 六、事件监听

EZUIKitNative 直接继承 EventBus,在实例上使用 `on` / `off` / `once` 方法监听事件。

> **变更说明(v9.0.5)：** 事件监听方式从 `native.eventEmitter.on(...)` 更新为 `native.on(...)`,直接在实例上调用。旧写法仍然兼容,但推荐使用新写法。

### 6.1 事件列表

| 事件名           | 触发时机                 | 回调参数                                                     |
| ---------------- | ------------------------ | ------------------------------------------------------------ |
| `init`           | 调用 init 后             | `{ eventType, code, msg }` code=0 成功, -1 失败              |
| `connect`        | WebSocket 连接状态变化   | `{ eventType, code, msg }` code=0 连接成功, -1 断开, -2 失败 |
| `launchFailed`   | 插件唤起失败(重试用尽后) | `{ code: -3, msg, attempts }`                                |
| `websocket`      | 内嵌播放页面连接状态变化 | `{ type, code, timestamp }` code=0 就绪, -1 关闭, -2 异常    |
| `capturePicture` | 截图完成                 | `{ code, data: { fileName, base64 } }`                       |
| `stopSave`       | 录制停止                 | `{ code, data: { url } }                                     |

更多播放器事件详见：[EZUIKitPlayer 事件文档](https://open.ys7.com/help/4275)

### 6.2 connect - 插件连接状态

```javascript
native.on('connect', (res) => {
  if (res.code === 0) {
    console.log('插件连接成功');
  } else if (res.code === -1) {
    console.log('插件连接断开');
  } else if (res.code === -2) {
    console.log('插件连接失败');
  }
});
```

### 6.3 launchFailed - 插件唤起失败

当 SDK 重试唤起插件达到最大次数（默认 3 次）后触发：

```javascript
native.on('launchFailed', (res) => {
  console.error(`插件唤起失败,已重试 ${res.attempts} 次`);
  // 此处可展示安装引导 UI
});
```

### 6.4 websocket - 内嵌页面就绪状态

```javascript
native.on('websocket', (res) => {
  if (res.code === 0) console.log('内嵌页面就绪');
  if (res.code === -1) console.log('内嵌页面连接关闭');
  if (res.code === -2) console.log('内嵌页面连接异常');
});
```

### 6.5 播放器事件监听

```javascript
// 监听截图事件
native.on('capturePicture', (res) => {
  if (res.code === 0) {
    console.log(`截图完成：${res.data.fileName}`);
    const link = document.createElement('a');
    link.download = res.data.fileName;
    link.href = res.data.base64;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
});
```

### 6.6 移除事件监听

```javascript
const handler = (data) => {
  console.log('事件触发', data);
};

// 注册监听
native.on('connect', handler);

// 移除监听
native.off('connect', handler);
```

## 七、常见问题

### 7.1 插件连接失败怎么办？

1. 确认已安装本地插件并启动
2. 检查本地 **18082** 端口是否被其他进程占用
3. 查看浏览器控制台是否有错误信息
4. 尝试重启插件服务
5. 监听 `launchFailed` 事件,引导用户安装插件

### 7.2 支持的最大画面数量？

插件模式最多支持 **25 路**(5×5 布局),无插件模式最多 **9 路**。

### 7.3 如何处理播放失败？

```javascript
{
    id: 'player0',
    url: 'ezopen://...',
    handleError: (res) => {
        console.error('播放失败', res);
        // 处理错误逻辑
    }
}
```

### 7.4 插件启动/展示异常？

1. 打开系统任务管理器 → 详细信息
2. 找到 `cefsimple.exe` 进程,并结束进程(可能有多个,需全部结束)
3. 或找到插件安装目录下的 `kill_cefsimple.bat` 文件,并双击
4. 刷新 WEB 页面,EZUIKitNative 会自动尝试拉起插件

### 7.5 switchLayout 有什么限制？

`col` 和 `row` 的范围为 [1, 5],相同布局不会重复发送,已有播放流在切换时不中断。

### 7.6 自定义渲染 cellTemplate 注意事项（v9.0.10 新增）

1. **模板必须含 `[data-ezuikit-video]` 视频槽位**,缺失时视频会降级到 cell 根末尾并控制台告警
2. **模板根元素必须占满画格并建立定位上下文**,至少设置 `position: relative; width: 100%; height: 100%; box-sizing: border-box;`
3. **视频槽位由 SDK 绝对定位并铺满模板根元素**,不要用 `flex: 1`、普通文档流或 `height: calc(...)` 控制其尺寸；标题、按钮等应使用绝对定位并设置 `z-index > 0` 作为覆盖层
4. **`containerStyle` 只能放不影响 grid 布局尺寸的属性**：允许 `background` / `background-image` / `border-radius` / `box-shadow` / `filter`；禁用 `padding` / `gap` / `border` / `margin`。SDK 按父页 rect / (col × row) 决定 canvas 内在 buffer 分辨率,这些禁用属性会让 `#player-container` grid 内容区小于父页 rect,导致视频画到越界区被裁光呈现黑屏。画格边框/间距请放到 `cellTemplate.css` 的 `.cell` 上（`.cell` 上的 border 是安全属性）
5. **HTML 模板的安全性由业务方负责**,占位符 `{index}` `{id}` 自动 escape,但 `setHtmlUnsafe` 不会 escape,业务方自行确保内容安全
6. **不要在 cellTemplate 中放 form / anchor 跳转标签**,SDK 内部对点击只阻止冒泡不阻止默认行为,如要阻止默认行为请用 `<button type="button">` 或 `href="javascript:void(0)"`
7. **action key 后缀 `:click` `:dblclick` 用于区分单双击**,无后缀时单双击都会触发
8. **读 API 是异步的**(`hasClass` / `getAttr` / `getText` 返回 Promise),写 API 是同步链式（实际通过 microtask 聚合下发）
9. **读 API 强制要求单 cell target**,`cell('all').getText(...)` 会抛错,需 `cell(0).getText(...)`

### 7.7 浏览器缩放下画格错位（v9.0.10 修复）

v9.0.10 版本起,SDK 内置浏览器 DPI 监听,与系统缩放综合适配。**升级到 v9.0.10+ 后,业务方无需自行处理缩放**。

如仍有错位,排查方向：

1. 容器 `players-container` 的 `width/height` 是否用 vw/vh 或 % 自适应单位
2. 检查 `containerStyle` 中是否硬编码了 px 尺寸
3. 确认 ezuikit-js 实际版本 ≥ 9.0.10

## 八、注意事项

- 当前仅支持 **Chrome** 浏览器
- 同一台电脑多个标签页/浏览器只能有一个活跃的 CEF 跟随连接
- 25 路画面不支持复制
- 心跳协议要求 15s 间隔,30s 空闲自动断开
- 非插件模式(mode=0)最多支持 9 路画面
- 打开 DevTools 会影响窗口位置计算,生产环境不受影响
- 当前 EZUIKitNative 为实验室特性,请结合业务场景进行充分的系统测试
- **自定义渲染**:cellTemplate 的 HTML 模板内容较大时(>10KB/cell),会增加初始化耗时,建议控制模板规模
- **action handler 本地执行**: 注册的 action 函数体在调用方进程内本地执行,零序列化开销,可放心使用闭包变量

**插件下载：** [CEFBrowserSetup.exe](https://izhstatic.ys7.com/vasp-openweb/1782457199500_CEFBrowserSetup.exe)

## 九、变更日志

### v9.0.12（2026-06-24）

- **chore**：demo 页 `EZUIKitPlayerNative-2.html` 默认 accessToken 改为优先从 `localStorage.getItem('ezuikit_accessToken')` 读取,便于 token 过期时通过 DevTools 一键替换
- **fix**：build.sh Node 18 路径配置,Jenkins 打包链路修复
- 合并 v9.0.4 SVN 改动：全屏 canvas 尺寸 / 加密设备立即 stop / socketError 增 code+msg 参数 / streamTypeIn 子码流 / inspectVideo dpr 计算 / setVideoLevel async

### v9.0.10（2026-06-16）

- **feat**：新增**自定义渲染**能力,详见第五章
  - 新增 `render` 配置：`containerStyle` + `cellTemplate`（对象/函数形式）
  - 新增 `cell(target)` 入口 + 三层 Handle API（CellHandle / ElementHandle / NodeListHandle）
  - 新增 `setContainerStyle()` API
  - 模板支持 `[data-ezuikit-video]` 视频槽位 + `{index}` `{id}` 占位符（自动 escape）
  - action 支持 `:click` `:dblclick` 后缀显式区分单双击
- **feat**：新增**浏览器缩放修复** — SDK 内置 DPI 监听,与系统缩放综合适配
- **compat**：V1 老命名回调适配（`handleSuccess` / `handleInitSuccess` / `stopSaveCallBack` / `handleError`）

### v9.0.5（2026-05-20）

- **改进**：事件监听方式从 `native.eventEmitter.on(...)` 升级为 `native.on(...)`,旧写法兼容保留
- 基础多画面播放能力（最多 25 路）

---

如有问题,请及时联系技术支持或查阅完整 API 文档

©2013-2026 萤石 ys7.com
