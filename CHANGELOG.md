### v8.2.6(2026-01-15)

#### Feat

- 轻应用本地插件EZUIKitNative重磅发布！(实验特性)

#### Fix

- 修复部分设备回放模式下录制没有声音的问题

### v8.2.5 (2026-01-14)

#### Feat

- 画面内容区增加 `ResizeObserver`  避免内容区域展示不全

#### Fix

- 修复Safari@13浏览器中日期兼容问题

- 修复 `More` 控件展示导致死循

### v8.2.4 (2025-12-30)

#### Feat

- 云存储和云录制支持8倍和16倍播放速度

#### Fix

- 兼容UI上一些小问题

- 修复Safari浏览器中日历显示问题

### v8.2.3 (2025-12-20)

#### Fix

- 修复对讲小权限问题

### v8.2.2 (2025-12-16)

#### Fix

- 更新依赖，修复安装问题

### v8.2.1 (2025-12-15)

#### Feat

- 国标设备支持seek

- 国标设备时间轴同步交互优化

- 备用机房地址缓存优化

- 重构日历组件，支持展示当前月份的日期是否有录像（仅播放所在月， 后续会支持展示月）

- 移动端时间轴支持图片懒加载和配置是否展示卡片 `timeLineOptions.showCoverFold`

- 支持canvas截图

#### Fix

- 修复一些已知问题

### v8.2.0 (2025-11-24)

#### Feat

- 新的 UI 交互优化

- 初始化 `width` 支持 style 的[width](https://developer.mozilla.org/zh-CN/docs/Web/CSS/width)属性值和 `height` 支持 style 的
  [height](https://developer.mozilla.org/zh-CN/docs/Web/CSS/height)属性值

- 更新 `resize` 逻辑，宽高支持 style 相同属性值

- 移除 `browserFullscreen` 和 `exitBrowserFullscreen` api, 统一使用`fullscreen` 和 `exitFullscreen`

- 支持移动端（手机浏览器，pad 浏览器）全屏后旋转后保持全屏状态

- 支持双击全屏，可以初始化时使用`dblClickFullscreen: false` 禁用双击全屏

- 支持自定义回放倍速 

- 更新监听方式, `player.eventEmitter.on` -> `player.on`

- 新增主题控件的交互变化事件

- 更新 `changePlayUrl` api, 不再提供切换主题参数, 切换主题请使用 `player.changeTheme("themeId")`

- 移除 `Theme` 实例, 切换主题请使用 `player.changeTheme`

- 移除 `Zoom` 实例

- 更新消息提示 UI 交互

- 移动端时间轴支持展示片段封面和支持调节时间宽度

- 默认支持云录制播放

- 支持三种画面填充模式

#### Fixed

- 修复移动端浏览器调用 api 全屏样式问题。

### v8.1.16(2025-09-22)

#### Feat

- 支持显示码流信息
  
  - 分辨率
  
  - 丢包率
  
  - 码率
  
  - 帧率
  
  - 编码信息
  
  - 码流封装
  
  - 卡顿比

- 发起对讲回调结果优化

### v8.1.15(2025-09-10)

- 部分设备支持“自动”清晰度

- 修复了一些小 bug

### v8.1.14(2025-08-22)

#### Feat

- 支持初始化前单独获取必要参数，提高初始化速度

#### Fixed

- 修复 NVR 设备指定通道对讲没声音的问题

### v8.1.13(2025-07-29)

#### Feat

- 支持私有云环境使用

#### Fixed

- 修复云台在某些情况下一直转动的问题

- 优化部分场景下 UI 换行的问题

### v8.1.12 (2025-07-02)

#### Feat

- 优化对讲模块逻辑

- 修复了一些取流问题

### v8.1.10 (2025-04-27)

#### Feat

- 优化取流逻辑，

- 弃用 `host`, `host` 默认从播放地址中获取

- 新增初始化 `videoLevelList` 参数进行自定义清晰度列表

#### Fixed

- 修复 `autoplay` 为 false 时， 不能播放问题

- 修复多窗口下对讲回调只会触发最后初始化的播放器

### v8.1.9 (2025-04-16)

#### Feat

- 新增日志打印配置项 `loggerOptions` 和 `setLoggerOptions` api, 具体请参考[参数说明](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm?tab=readme-ov-file#%E9%99%84%E5%BD%95-%E5%88%9D%E5%A7%8B%E5%8C%96%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E), [issues #202](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/issues/202), [issues #176](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/issues/176), [issues #205](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/issues/205), [issues #81](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/issues/81)

- 新增一些事件， 如 `videoInfo` 、`audioInfo` 和 `firstFrameDisplay`等， 具体请参考[事件](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm?tab=readme-ov-file#%E4%BA%8B%E4%BB%B6)

#### Fixed

- 修复调用录制 api, ui 没有同步问题
- 修复调用对讲 api, ui 没有同步问题
- 修复了一些小 bug [issues #178](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/issues/178), [issues #199](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/issues/199), [issues #206](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/issues/206),

## v8.1.8（2025-03-19）

#### Feat

- 支持巡检模板

- 兼容音频采样率异常设备录制

#### Fixed

- 修复部分 AR 设备获取标签信息报错

## v8.1.7（2025-03-05）

#### Feat

- 电子放大模块重构，操作更丝滑~

- 移动端支持双指操作电子放大功能

## v8.1.6（2025-02-10）

#### Feat

- 初始化支持配置关闭结束录制的默认下载行为【downloadRecord: false】

- 支持初始化设置【stopSaveCallBack】回调事件，在结束录制后通过该回调获取下载地址及文件数据

#### Fixed

- 修复了 token 为空时本地缓存地址依然可以播放的问题

- 修复了一些小 bug

## v8.1.5（2025-01-15）

#### Feat

- 支持取流失败自动发起重试

- 支持初始化指定清晰度

#### Fixed

- 修复了多实例场景下，画面之间声音状态互相干扰的问题

- 修复了一些其他小 bug

## v8.1.4（2025-01-07）

#### Feat

- 支持获取 AR 设备私有标签信息

- 修复了一些回放时间轴的小 bug

## v8.1.3 (2024-12-31)

#### Feat

- 回放录像片段查询接口替换
- 多实例播放场景下，支持同时开启所有画面的声音

#### Fixed

- 修复 destroy 销毁实例后，部分 dom、样式残留的问题
- 修复了一些小 bug

## v8.1.2 (2024-12-13)

#### Feat

- 新增静态多语言变量 `LOCALES`, 可以使用 `EZUIKitPlayer.LOCALES` 访问
- 更新 header 的 默认样式和交互， 和 footer 保持一致
- 弃用 hls，请使用 [ezuikti-flv](https://www.npmjs.com/package/ezuikit-flv) 代替
- 弃用 flv，请使用 [@ezuikit/player-hls] https://www.npmjs.com/package/@ezuikit/player-hls 代替
- 弃用 EZWebRtc, 请使用 [ertc-web](https://www.npmjs.com/package/ertc-web)

#### Fixed

- 修复移动端回放主题退出全屏后，日历的位置不对的问题

## v8.1.1 (2024-11-18)

#### Feat

- 支持多实例
- 新增入参 debugDownloadData, 下载原始码流， 调试码流使用
- 新增入参 disableRenderPrivateData, 禁止渲染私有数据 (如智能分析， 移动侦测， 火点信息等)

### Fixed

- 优化全屏的逻辑， 修复已知的 bug, [issues #240](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/issues/240)
- 优化 resize 的逻辑， 修复已知的 bug [issues #120](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/issues/120)
- 修复初始化窗口抖动的 bug
- 修复一些已知 bug [issues #269](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/issues/269)

## v8.1.0 (2024-11-04)

#### Feat

- 完善取流埋点上报内容，错误上报

#### Fixed

- 修复偶现初始化成功后无法播放的问题

## v8.0.13-alpha.1 (2024-10-17)

#### Fixed

- 修复 webgl 上下文未丢弃问题
- 修复云录制播放问题

## v8.0.12(2024-10-14)

- 新增备用机房地址获取逻辑

- 取流失败、断流时使用备用机房发起取流请求，提高可用性保障

- 清晰度切换逻辑优化

## v8.0.11 (2024-08-23)

### Feat

- 获取播放 socket 地址接口失败，新增 `handleError` 回调

## v8.0.10 (2024-08-21)

### Fixed

- 修复 `v8.0.9` 构建产物使用 npm 错误的问题
- 修复海外设备 socket 播放拼接错误的问题

## v8.0.9 (2024-08-15)

### Feat

- 对讲新增 API：
  - setVolumeGain（麦克风增强）
  - getMicrophonePermission（获取麦克风权限）
  - getMicrophonesList（获取麦克风列表）
  - setProfile（切换麦克风）
- 对讲新增事件监听：
- volumeChange（音量变化通知）

## v8.0.8 (2024-07-26)

### Feat

- 支持设置多语言(zh/en)

### Fixed

- 修复 Mac PC 浏览器模拟移动端页面全屏问题 [#227](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/issues/227), [#208](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/issues/208), [#177](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/issues/177)
- 修复播放暂停后倍速重置问题
- 修复 fetch 被劫持的 bug [#212](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/issues/212), [#184](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/issues/184), [#139](https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/issues/139)

### Optimized

- 错误语提示文案优化

## v8.0.6 (2024-07-25)

[feat] 支持小权限 token

## v8.0.5

[feat] 清晰度切换逻辑优化

## v8.0.4

[feat] 云录制截图上传至云录制服务

## v8.0.3

[feat] 录制模块增加转封装逻辑

[feat] 支持设置 DPR

## v8.0.2

[feat] 错误提示文案抽取

[feat] 提示文案支持自定义配置

## v8.0.1

[feat] 回放支持 seek

[feat] 云台控制支持 8 个方向，支持物理缩放、变焦

## v8.0.0

[feat] 对底层播放器进行重构

[feat] 开始支持本地资源配置(staticPath)

[fix] 修复了一些已知问题

## v7.7.10

[feat] 新增云录制回放支持 （暂时仅对内使用）

[fix] 修复了一些已知问题

## v7.7.2 (2023-08-11)

[feat] 支持软解鱼眼矫正， 支持四分屏

[feat] 加密设备，秘钥错误添加错误回调

## v7.7.1 (2023-08-09)

[fix] 修复多屏回放日期选择器渲染问题

## v6.7.8 (2023-07-20)

[feat] `EZUIKit.FLV()` 支持硬解播放 H265

# v0.6.5

[feat] 播放暂停时播放窗口保留最后一帧画面

[feat] 切换地址方法增加参数 accesstoken 用于支持不同账号下设备切换

[fix] 开启录制时切换地址则录制自动完成

## v0.6.4

[fix]修复地址切换频繁多路流导致画面跳变问题

[fix]优化多线程版本单个页面创建多路视频播放性能及稳定性

[fix]修复多线程内存泄露问题

[fix]修复模板主题回放拖动声音被关闭，设备名称展示不全，全屏高度计算异常问题。

## v0.6.3

[feat]支持模板内回放时间轴自定义设置拖动防抖间隔

[feat]支持模板内网页全屏状态下调用日历切换日期

[fix]修复单线程模式下，设备断网视频未保留最后一帧问题

[fix]修复模板内使用电子放大开启中切换设备未重置问题

## v0.6.2

[feat] 支持用户通过开启谷歌实验室特性启动多线程解码

[feat] 支持用户在开放平台控制台（https://open.ys7.com/console/ezuikit/template.html）创建，修改，删除，查询多个模板

[feat] 优化模板内高清/标清切换缓慢问题。

[feat] 支持切换主题

[feat] 支持根据主题 ID 自定义主题

[feat] 新增 pc 端电子放大，移动端双指缩放功能

[feat] 新增倍速回放功能

## v0.6.1

[feat] 支持本地配置解码库，解决远程拉取缓慢问题。

## v0.6.0

[fix]兼容低版本火狐浏览器播放视频

[fix]修复网站全屏模式下，再次执行视频全屏冲突问题

## v0.5.9

[feat]支持用户通过开启谷歌实验室特性启动多线程解码

[feat]新增开启开启谷歌实验室特性引导说明

## v0.5.8

[feat-beta]支持多线程解码视频-beta

## v0.5.7

[feat]新增对讲成功回调，用于国标对讲成功，开启视频声音

[feat]新增对讲失败回调，返回对讲失败错误信息

[fix]修复无子账号对讲权限不足，错误未捕获问题

## v0.5.5

[fix]修复无子账号对讲权限不足，错误未捕获问题

[feat]增加设备能力探测，对讲前检测设备能力

[feat]增加 loading 状态文案字体大小样式

[fix]修复乾坤框架下，全局对象获取不到导致对讲失败问题

## v0.5.4

[fix]修复视频宽度小于 500，按钮过大问题

## v0.5.3

[feat]兼容部分浏览器 formData 格式

[feat]结束对讲释放麦克风

## v0.5.1

Date: 2022 年 3 月 31 日 19:39:49

[feat]支持切换主题

[fix]修复对讲结束问题问题

[feat]移动端主题支持隐藏回放时间轴
