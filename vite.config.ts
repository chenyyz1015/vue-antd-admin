import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import UnoCSS from "unocss/vite";
import UnpluginSvgComponent from "unplugin-svg-component/vite";
import rolldownOptions from "./build/rolldown.config";

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    AutoImport({
      imports: ["vue", "vue-router", "pinia", "vue-i18n", "@vueuse/core"],
      dts: "src/types/auto-imports.d.ts",
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json"
      }
    }),
    Components({
      resolvers: [AntDesignVueResolver({ importStyle: false })],
      dts: "src/types/components.d.ts"
    }),
    UnpluginSvgComponent({
      iconDir: ["src/assets/svgs"],
      dts: true,
      dtsDir: "src/types"
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "#": path.resolve(__dirname, "src/types")
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 这里写入你想全局注入的变量、mixin、function 等
        // 注意：结尾必须加分号
        additionalData: `
          @use "@/styles/variables.scss" as *;
          @use "@/styles/mixins.scss" as *;
        `
      }
    }
  },
  build: {
    target: "es2015",
    cssCodeSplit: true,
    sourcemap: false,
    rolldownOptions
  },
  server: {
    port: 3000,
    host: true,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }
});
