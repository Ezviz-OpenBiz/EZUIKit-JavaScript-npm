import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: "terser",
    terserOptions: {
      // 清除console和debugger
      compress: {
        // drop_console 暂时不能用，会报错
        // https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/issues/138
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  plugins: [vue()],
});
