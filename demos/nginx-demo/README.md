## 使用

1. 复制项目根目录下的 `ezuikit.js` 和 `ezuikit_static`到 当前目录的`html` 下

2. window 下启动当前目录下的`nginx.exe`

```bash

# 启动服务
./nginx.exe

```

3. 访问 `http://localhost`


## nginx 部署

该demo 默认开启同源策略， 配置在 `./conf/nginx.conf` 48 - 49行

备注： 同源仅支持 https

## 同源说明 

https://open.ys7.com/help/1772?h=Cross-Origin-Embedder-Policy


[Cross-Origin-Embedder-Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy)

[Cross-Origin-Opener-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy)


备注： 同源仅支持 https