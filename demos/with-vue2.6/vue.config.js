// vue.config.js
module.exports = {
  // 该对象将会被 webpack-merge 合并入最终的 webpack 配置。
  // 文档：https://cli.vuejs.org/zh/guide/webpack.html
  configureWebpack: {
    module: {
      rules: [
        // 支持 node_modules 下 mjs
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto",
        },
      ],
    },
  },
};
