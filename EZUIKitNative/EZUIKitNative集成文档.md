# EZUIKitNative 集成文档

## 一、EZUIKitNative 介绍

EZUIKitNative 是一个基于本地插件的多画面视频播放器解决方案，专为需要同时播放大量视频流的场景设计。它通过控制本地应用插件，实现高性能的多路视频播放，支持最多 25 路视频同时播放。

### 主要特性

- **能力升级**：提供插件、无插件两种模式，插件模式最多支持25屏同时播放
- **快速接入**：完整封装插件交互逻辑，纯前端低成本集成
- **平滑升级**：基于EZUIKitPlayer扩展升级，参数、功能、监听事件等100%向前兼容
- **灵活跟随**：插件窗口随浏览器位置、大小、可见性自适应变化，支持自由指定屏幕布局的行列数

### 适用场景

- 无人值守监控
- 直播大屏展示
- 视频巡检平台
- 其他多屏需求

### 集成环境说明

**推荐电脑配置**

操作系统：Windows10（64位）

CPU：处理器i7-12700K或以上
内存：16G
显卡：GTX1060或以上独立显卡，或Graphics 770以上集成显卡

网卡： 25路并发1080P情况下，1000Mbps或以上

浏览器：Chrome V127或以上版本

---

## 二、快速开始

### 2.0 准备工作

- 访问[GitHub - 轻应用EZUIKit](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/EZUIKitNative)，获取本地插件安装包并完成安装

- 或直接[下载插件安装包](https://izhstatic.ys7.com/vasp-openweb/1768271430453_CEFBrowserSetup.exe)，并完成安装

- 确保轻应用升级到v8.2.6及以上版本

### 2.1 引入 SDK

##### 1、在项目工程中引入ezuikit依赖

```javascript
npm install ezuikit-js
```

or

```javascript
yarn add ezuikit-js
```

##### 2、在项目页面中引入 EZUIKit SDK：

```html
<script src="./ezuikit.js"></script>
```

or

```javascript
import EZUIKit from "ezuikit-js";
```

### 2.2 容器准备

##### 1、在页面中创建一个容器元素作为插件的跟随锚点：

```html
<div id="players-container"></div>
```

### 2.3 创建实例

创建实例时传入希望让插件跟随的锚点，支持节点id或DOM元素

```javascript
// 通过id确定跟随锚点
const native = new EZUIKit.EZUIKitNative({
    container: "players-container"  // 容器ID
});

// 通过DOM元素确定跟随锚点
const native = new EZUIKit.EZUIKitNative({
    container: document.getElementById("players-container")  // 容器DOM元素
});
```

### 2.4 初始化播放器

基于2.3创建的播放器示例进行初始化播放

```javascript
native.init({
    layout: {
        col: 4,  // 列数
        row: 4   // 行数
    },
    deviceList: [
        {
            id: 'player0',
            width: '100%',
            height: '100%',
            template: 'pcLive',
            url: 'ezopen://open.ys7.com/设备序列号/通道号.live',
            accessToken: 'your_access_token',
            handleSuccess: () => {
                console.log('播放成功');
            },
            handleError: (res) => {
                console.error('播放失败', res);
            }
        }
        // ... 更多设备
    ]
});
```

**完整示例**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>EZUIKitNative 示例</title>
    <script src="./ezuikit.js"></script>
    <style>
        #players-container {
            width: 100%;
            height: 100vh;
            background-color: #000;
        }
    </style>
</head>
<body>
    <div id="players-container"></div>

    <script>
        // 创建实例
        const native = new EZUIKit.EZUIKitNative({
            container: "players-container"
        });

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
                    staticPath: './ezuikit_static'
                }
            ]
        });
    </script>
</body>
</html>
```

---

## 三、播放模式

EZUIKitNative是对EZUIKitPlayer的扩展升级，提供无插件、插件两种模式，可根据业务场景按需使用

### 3.1 模式说明

无插件模式：批量初始化EZUIKitPlayer创建多个播放器，受浏览器资源限制，目前无插件模式限制了最多只能初始化9个播放器，当设备的数量大于9时，无法成功初始化

插件模式：EZUIKitNative与本地插件连接通信，突破浏览器资源限制，可初始化更多数量的播放器

自动模式：由EZUIKitNative根据设备数量自动判断使用插件/无插件模式

### 3.2 模式选择

##### 1、无插件模式

开启条件：用户强制使用无插件模式，或EZUIKitNative在自动模式下命中了无插件模式

最大画面数量：**9**

适用场景：并发播放数量不多，或UI交互、布局需求较复杂的场景

**使用说明：**

- 使用无插件模式时，会将所有播放器托管给EZUIKitNative实例的players属性

- 初始化、功能调用、事件监听方式与EZUIKitPlayer完全一致

**示例**

```javascript
// 初始化EZUIKitNative并将mode指定为无插件模式
// mode指定为自动模式，且deviceList数量≤9时，也会自动使用无插件模式
const native = new EZUIKit.EZUIKitNative({
    container: "players-container",
    mode: 0, // 0:不使用插件，1:自动，2:强制使用插件
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
            }
        }
    ]
});

// 获取播放器实例并进行功能触发
// 示例：对第一个播放器调用changePlayUrl切换播放地址
native.players[0].changePlayUrl({ url:"ezopen://open.ys7.com/设备序列号/通道号.live" });
```

##### 2、插件模式

开启条件：用户强制使用插件模式，或EZUIKitNative在自动模式下命中了插件模式

最大画面数量：**25**

适用场景：多屏巡检、大屏展示场景

**使用说明：** 见下文

--- 

## 四、EZUIKitNative - 插件模式

### 4.1 构造函数

#### `new EZUIKit.EZUIKitNative(options)`

创建 EZUIKitNative 实例。

**参数：**

| 参数        | 含义                              | 类型                    | 示例                  | 是否必填 |
| --------- | ------------------------------- | --------------------- | ------------------- | ---- |
| container | 插件跟随锚点                          | HTMLElement \| string | "players-container" | Y    |
| mode      | 播放模式，0:不使用插件，1:自动，2:强制使用插件，默认为2 | number                | 2                   | N    |
| autoPlay  | 是否自动播放，默认为true                  | boolean               | true                | N    |
| layout    | 布局，默认为4x4布局，也可以在后续初始化时修改        | object                | { col: 4, row: 4 }  | N    |

**返回值：** EZUIKitNative 实例

**示例：**

```javascript
const native = new EZUIKit.EZUIKitNative({
    container: "players-container",
    mode: 2,
    autoPlay: true
});
```

---

### 4.2 init - 初始化播放器

#### `native.init(options)`

初始化播放器并配置设备列表。

**参数：**

| 参数         | 含义                | 类型                         | 示例                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 是否必填 |
| ---------- | ----------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---- |
| deviceList | 设备列表              | array[EZUIKitPlayerParams] | {<br/>            id: 'player0',<br/>            width: '100%',<br/>            height: '100%',<br/>            template: 'pcLive',<br/>            url: 'ezopen://open.ys7.com/设备序列号/通道号.live',<br/>            accessToken: 'at.xxx',<br/>            handleSuccess: () => {<br/>                console.log('播放成功');<br/>            },<br/>            handleError: (res) => {<br/>                console.error('播放失败', res);<br/>            }<br/>        } | Y    |
| layout     | 布局，优先级比创建实例时传入的更高 | object                     | { col: 4, row: 4 }                                                                                                                                                                                                                                                                                                                                                                                                                                                 | N    |

*注意：当deviceList数量大于布局总数时，会按下标初始化前col \* row个元素。如deviceList共传入25个设备，layout设置为{ col: 4, row: 4 }，此时只会初始化前16个设备*

**EZUIKitPlayerParams 配置项：**

| 参数名               | 类型       | 必填  | 说明                        |
| ----------------- | -------- |:--- | ------------------------- |
| id                | string   | 是   | 播放器唯一标识                   |
| width             | string   | 是   | 播放器宽度                     |
| height            | string   | 是   | 播放器高度                     |
| template          | string   | 是   | 模板类型：pcLive（直播）、pcRec（回放） |
| url               | string   | 是   | 播放地址（ezopen 协议）           |
| accessToken       | string   | 是   | 访问令牌                      |
| handleSuccess     | Function | 否   | 播放成功回调                    |
| handleError       | Function | 否   | 播放失败回调                    |
| handleInitSuccess | Function | 否   | 初始化成功回调                   |
| stopSaveCallBack  | Function | 否   | 停止录制回调                    |

*更多参数详见：https://open.ys7.com/help/4294，【4、初始化参数说明】*

**返回值：** 无

**示例：**

```javascript
native.init({
    layout: {
        col: 4,
        row: 4
    },
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
            }
        }
    ]
});
```

---

### 4.3 play - 播放视频

#### `native.play(id, params)`

开始播放指定的视频或所有视频。

**参数：**

| 参数名    | 类型               | 必填  | 说明                 |
| ------ | ---------------- | --- | ------------------ |
| id     | string \| number | 否   | 播放器 ID 或下标，不传则播放所有 |
| params | any              | 否   | 播放参数               |

**返回值：** 无

**示例：**

```javascript
// 播放指定播放器（通过下标）
native.play(0);

// 播放指定播放器（通过 ID）
native.play('player0');

// 播放所有播放器
native.play();
```

---

### 4.4 stop - 停止播放

#### `native.stop(id, params)`

停止播放指定的视频或所有视频。

**参数：**

| 参数名    | 类型               | 必填  | 说明                 |
| ------ | ---------------- | --- | ------------------ |
| id     | string \| number | 否   | 播放器 ID 或下标，不传则停止所有 |
| params | any              | 否   | 停止参数               |

**返回值：** 无

**示例：**

```javascript
// 停止指定播放器
native.stop(0);

// 停止所有播放器
native.stop();
```

---

### 4.5 fullscreen - 全屏播放

#### `native.fullscreen()`

插件整体进入全屏模式

*可双击单个画面，让该画面进入全屏模式，按ESC退出单画面全屏*

**返回值：** 无

**示例：**

```javascript
// 整体全屏
native.fullscreen();
```

---

### 4.6 exitfullscreen - 退出全屏

#### `native.exitfullscreen()`

插件整体退出全屏模式

**返回值：** 无

**示例：**

```javascript
// 退出整体全屏
native.exitfullscreen();
```

---

### 4.7 destroy - 销毁播放器

#### `native.destroy(id, force)`

销毁播放器实例。

**参数：**

| 参数名   | 类型               | 必填  | 默认值   | 说明                 |
| ----- | ---------------- | --- | ----- | ------------------ |
| id    | string \| number | 否   | -     | 播放器 ID 或下标，不传则销毁所有 |
| force | boolean          | 否   | false | 是否强制销毁（关闭插件进程）     |

**返回值：** 无

**示例：**

```javascript
// 销毁指定播放器
native.destroy(0);

// 销毁所有播放器
native.destroy();

// 强制销毁并关闭插件
native.destroy(undefined, true);
```

---

### 4.8 reload - 重新加载

#### `native.reload()`

重置插件窗口

**参数：** 无

**返回值：** 无

**示例：**

```javascript
native.reload();
```

### 4.9 其他API调用

#### `native[api](id, params)`

EZUIKitNative实例支持携带参数并透传调用指定播放器的api

**示例：**

```javascript
// 调用id为"player2"的播放器的changePlayUrl方法，并携带参数
native.changePlayUrl("player2", { url :"ezopen://open.ys7.com/AZ3754171/1.live" })
```

更多API事件详见：https://open.ys7.com/help/4275

**完整示例**

```javascript
// 创建native实例
const native = new EZUIKit.EZUIKitNative({
    container: "players-container",
    mode: 2,
    autoPlay: true
});

//初始化播放
native.init({
    layout: {
        col: 4,
        row: 4
    },
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
            }
        }
    ]
});

// 调用指定播放器的API
native.changePlayUrl("player2", { url :"ezopen://open.ys7.com/设备序列号/1.live" })

// 销毁所有播放器
native.destroy();
```

---

## 五、EventEmitter 事件监听

### 5.1 播放器事件监听

和EZUIKitPlayer一样，EZUIKitNative也提供事件监听器，用于获取播放器的功能触发、状态变更、数据反馈，使用 `on` 方法注册事件监听器：

```javascript
// 注册事件监听器，示例：监听截图事件并下载回调的图片数据
// 当点击播放器中的截图按钮或调用capturePicture时会触发该回调
native.eventEmitter.on('capturePicture', (res) => {
    if (res.code == 0) {
        console.log(`截图回调，文件名称：${res.data.fileName}，文件数据：${res.data.base64}`);

        const link = document.createElement('a');
        link.download = res.data.fileName;
        link.href = res.data.base64;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})
```

更多监听事件名称详见：https://open.ys7.com/help/4275

### 5.2 事件列表

#### connect - 插件连接状态

EZUIKitNative除了包含EZUIKitPlayer的所有事件，还额外提供插件连接状态监听，帮助开发者在插件状态变更时更新上层UI。

**回调参数：**

```javascript
{
    eventType: 'connect',
    code: 0,        // 0-连接成功，-1-连接断开，-2-连接失败
    msg: '状态描述',
    data: {}        // 额外数据（仅错误时）
}
```

**示例：**

```javascript
native.eventEmitter.on('connect', (res) => {
    if (res.code !== 0) {
        console.log(`插件连接失败: ${JSON.stringify(res)}`, 'error');
    } else {
        console.log(`插件连接成功`, 'success');
    }
})
```

---

### 5.3 移除事件监听

使用 `off` 方法移除事件监听器：

```javascript
const handler = (data) => {
    console.log('事件触发', data);
};

// 注册监听
native.eventEmitter.on('connect', handler);

// 移除监听
native.eventEmitter.off('connect', handler);
```

### 5.4 完整事件监听示例

```javascript
const native = new EZUIKit.EZUIKitNative({
    container: "players-container"
});

// 监听插件连接状态
native.eventEmitter.on('connect', (res) => {
    if (res.code === 0) {
        console.log('插件连接成功');
    } else {
        console.error('插件连接失败', res);
    }
});

// 监听截图事件
native.eventEmitter.on('capturePicture', (res) => {
    if (res.code === 0) {
        console.log('截图完成：', res.data.fileName);
        // 自动下载截图
        const link = document.createElement('a');
        link.download = res.data.fileName;
        link.href = res.data.base64;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});

// 监听录制停止事件
native.eventEmitter.on('stopSave', (res) => {
    if (res.code === 0 && res.data) {
        console.log('录制完成：', res.data.url);
    }
});

// 初始化播放器
native.init({
    layout: { col: 4, row: 4 },
    deviceList: [/* 设备配置 */]
});
```

---

## 六、常见问题

### 6.1 插件连接失败怎么办？

1. 确认已安装本地插件并启动
2. 检查本地【18082】端口是否被其他进程占用
3. 查看浏览器控制台是否有错误信息
4. 尝试重启插件服务

### 6.2 支持的最大画面数量？

最多支持 25 路

### 6.3 如何处理播放失败？

在设备配置中添加 `handleError` 回调：

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

### 6.3 插件启动、展示异常？

1. 打开系统任务管理器 ---> 详细信息

2. 找到 cefsimple.exe 进程，并结束进程（可能有多个，需全部结束）

3. 或者找到插件安装目录下的 kill_cefsimple.bat 文件，并双击

4. 刷新WEB页面，EZUIKitNative会尝试拉起插件，或直接双击cefsimple.exe启动插件

---

## 七、注意事项

当前EZUIKitNative为实验室特性，请结合业务场景进行充分的系统测试

如有问题，请及时联系技术支持或查阅完整 API 文档
