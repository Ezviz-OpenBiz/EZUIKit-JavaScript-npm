## wasm streaming compile failed

解码资源加载错误提示
```
wasm streaming compile failed: TypeError: Failed to execute 'compile' on 'WebAssembly': Incorrect response MIME type. Expected 'application/wasm'.
falling back to ArrayBuffer instantiation
```

原因：响应服务不支持 `application/wasm` 响应类型

https://stackoverflow.com/questions/50589083/typeerror-failed-to-execute-compile-on-webassembly-incorrect-response-mime

解决方案：
1. 配置响应服务支持 `application/wasm` 响应类型。

## 对讲(talk)

在浏览器中使用麦克风是需要允许的，所以需要用户允许。 [获取麦克风权限](https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API/Build_a_phone_with_peerjs/Connect_peers/Get_microphone_permission)

在 iframe 中使用需要配置 `allow="microphone"`

## [iframe](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/iframe)

在 iframe 中，需要设置[同源策略](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Reference/Headers/Permissions-Policy#iframe)。

- [iframe 当全屏请求失败时](https://developer.mozilla.org/zh-CN/docs/Web/API/Fullscreen_API/Guide#%E5%BD%93%E5%85%A8%E5%B1%8F%E8%AF%B7%E6%B1%82%E5%A4%B1%E8%B4%A5%E6%97%B6)

`allowfullscreen` 设置为 true 时，可以通过调用 `<iframe>` 的 `requestFullscreen()` 方法激活全屏模式。

```html
<!-- 允许 iframe 激活全屏 -->
<iframe src="..." allowfullscreen="true"></iframe>
```

- [iframe 麦克风使用](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/iframe#allow)

设置 `allow="microphone;"` 时，可以通过调用 `<iframe>` 的 `navigator.mediaDevices.getUserMedia({ audio: true })` 获取用户麦克风权限。

```html
<!-- 允许 iframe 访问麦克风 -->
<iframe src="..." allow="microphone;"></iframe>
```

## Chrome 超过16个摄像头不播放

Chrome 浏览器单页面 WebGL 上下文数量有限（一般为 16 个），超过后无法再创建新上下文。开发时应注意合理复用和管理，避免超过限制。


## vue3 响应式及 Proxy

由于 vue3 响应式原理（Proxy），使用响应式存储实例可能导致 SDK 异常。请开发者使用 [vue markRaw](https://cn.vuejs.org/api/reactivity-advanced#markraw) 或 非响应式的变量进行存储实例


## 云录制

[云录制](./cloudRecord.md)的播放必须有 `spaceId`

## 音频自动播放
浏览器本身限制，防止意外地打扰到用户
https://developer.mozilla.org/zh-CN/docs/Web/Media/Guides/Autoplay
