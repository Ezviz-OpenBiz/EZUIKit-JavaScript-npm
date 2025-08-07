## 对讲(talk)

在浏览器中使用麦克风是需要允许的，所以需要用户允许。 [获取麦克风权限](https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API/Build_a_phone_with_peerjs/Connect_peers/Get_microphone_permission)

在 iframe 中使用需要配置 `allow="microphone"`


## [iframe](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/iframe)

在iframe中，需要设置[同源策略](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Reference/Headers/Permissions-Policy#iframe)。

- [iframe 当全屏请求失败时](https://developer.mozilla.org/zh-CN/docs/Web/API/Fullscreen_API/Guide#%E5%BD%93%E5%85%A8%E5%B1%8F%E8%AF%B7%E6%B1%82%E5%A4%B1%E8%B4%A5%E6%97%B6)

`allowfullscreen` 设置为 true 时，可以通过调用 `<iframe>` 的 `requestFullscreen()` 方法激活全屏模式。

```html
<!-- 允许 iframe 激活全屏 -->
<iframe src="..." allowfullscreen="tuue"></iframe>
```

- [iframe 麦克风使用](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/iframe#allow)

设置 `allow="microphone;"` 时，可以通过调用 `<iframe>` 的 `navigator.mediaDevices.getUserMedia({ audio: true })` 获取用户麦克风权限。

```html
<!-- 允许 iframe 访问麦克风 -->
<iframe src="..." allow="microphone;"></iframe>
```

## vue3 响应式及Proxy

由于vue3 响应式原理（Proxy），使用响应式存储实例可能导致SDK异常。请开发者使用 [vue markRaw](https://cn.vuejs.org/api/reactivity-advanced#markraw) 或 非响应式的变量进行存储实例
 