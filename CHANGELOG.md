## v8.0.13-alpha.1 （20204-10-17）

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
