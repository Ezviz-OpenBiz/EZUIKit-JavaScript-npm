## with-electron

### 资源

复制 `ezuikit_static` 和 `ezuikit.js` 复制到 `src` 目录下

## 运行

```bash
## 安装依赖
pnpm install

## 开发环境运行
pnpm run dev

## 构建app
pnpm run build
```

## 麦克风权限

- macOS 要在 `Info.plist` 里加麦克风声明。
- Electron 主进程可用 `setPermissionRequestHandler` 允许麦克风权限。
- 渲染进程用 `getUserMedia` 获取权限。

https://developer.apple.com/documentation/bundleresources/requesting-authorization-for-media-capture-on-macos?language=objc