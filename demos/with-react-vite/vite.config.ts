import { defineConfig, type UserConfig, type ConfigEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
// import viteImagemin from 'vite-plugin-imagemin';
import legacy from "@vitejs/plugin-legacy";

// open sentry
const OPEN_SENTRY: boolean = false; // process.env.NODE_ENV === 'production'
// https://vitejs.dev/config/
export default defineConfig(((env: ConfigEnv) => {
  const isDev = env.mode === "development";

  return {
    server: {
      //   proxy: {
      //     '/api': {
      //       target: 'http://localhost:8080',
      //       changeOrigin: true,
      //       // rewrite: path => path.replace(/^\/api/, '')
      //     },
      //     // 图片上传
      //     '/images': {
      //       target: 'http://localhost:8080',
      //       changeOrigin: true,
      //       // rewrite: path => path.replace(/^\/api/, '')
      //     },
      //   },
    },
    // css: {
    //   postcss: {
    //     plugins: isDev ? [] : [postcssPreset()],
    //   },
    // },
    build: {
      minify: "terser",
      terserOptions: {
        // 清除console和debugger
        compress: {
          // drop_console 问题， terser 已修复
          // https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/issues/138
          // 使用 esbuild 移出 console， 注意会出问题。官方还未修复
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    plugins: [
      react(),
      // https://www.npmjs.com/package/@vitejs/plugin-legacy
      // Vite's default browser support baseline is Native ESM, native ESM dynamic import, and import.meta. This plugin provides support for legacy browsers that do not support those features when building for production.
      // 低版本浏览器兼容
      legacy({
        targets: ["chrome 52", "Android >= 39", "iOS >= 10.3", "IE >= 11"], // 需要兼容的目标列表，可以设置多个
        modernPolyfills: true,
        // additionalLegacyPolyfills: ['regenerator-runtime/runtime'], // 面向IE11时需要此插件
        // polyfills: ['es.promise', 'es.array.iterator']
      }),
    ].filter(Boolean),
  };
}) as UserConfig);
