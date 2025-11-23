// vue.config.js
module.exports = {
  // 该对象将会被 webpack-merge 合并入最终的 webpack 配置。
  // 文档：https://cli.vuejs.org/zh/guide/webpack.html
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json', '.mjs'],
    },
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        }
      ]
    }
  },
  chainWebpack: config => {
    config.module
      .rule('mjs')
      .test(/\.mjs$/)
      .include
        .add(/node_modules/)
        .end()
      .type('javascript/auto');
  }
}
