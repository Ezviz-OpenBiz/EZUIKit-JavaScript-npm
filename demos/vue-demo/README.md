# vue-demo

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

## QA 

- 最近 vue2 的老版本在构建 `ezuikit-js` 时, 报错 `You may need an additional loader to handle the result of these loaders`. 
  
  报错原因是有一个三方库使用 可选链语法（?.）。

  解决方法：

  1. 升级 `vue-cli-service` 到最新版
  2. 配置babel 中添加 `@babel/plugin-transform-optional-chaining`
   
  问题已经记录， 后续会进行兼容

- 最近 vue2 的老版本在构建 `ezuikit-js` 时, 报错 `Can't import the named export 'ResizeObserver' from non EcmaScript module (only default export is available)`.

  解决方法：

  1. 升级 `vue-cli-service` 到最新版
  2. 配置`vue.config.js` 支持 .mjs， 如下图

     ![image](https://github.com/user-attachments/assets/b461a400-2a29-4814-b70e-f3b3cbef8ff6)

  [with-vue2.6](../with-vue2.6)

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
