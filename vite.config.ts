import Vue from "@vitejs/plugin-vue";
import path from "path";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import UnpluginSvgComponent from "unplugin-svg-component/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig, loadEnv } from "vite";
import { viteMockServe as MockServe } from "vite-plugin-mock";
import VueDevTools from "vite-plugin-vue-devtools";

export default defineConfig(({ mode }) => {
  // 读取 .env.* 文件中的变量
  const env = loadEnv(mode, process.cwd());
  console.log("env:", env);
  const {
    VITE_APP_BASE_URL,
    VITE_APP_BASE_API_URL,
    VITE_APP_USE_MOCK,
    VITE_DEV_PORT,
    VITE_DEV_OPEN,
    VITE_DROP_CONSOLE,
    VITE_DROP_DEBUGGER
  } = env;
  return {
    plugins: [
      Vue(),
      UnoCSS(),
      AutoImport({
        imports: ["vue", "vue-router", "pinia", "vue-i18n", "@vueuse/core"],
        dts: path.resolve(__dirname, "src/types/auto-imports.d.ts"),
        eslintrc: {
          enabled: true,
          filepath: path.resolve(__dirname, "./.eslintrc-auto-import.json")
        }
      }),
      Components({
        dirs: [path.resolve(__dirname, "src/components"), path.resolve(__dirname, "src/layouts")],
        resolvers: [AntDesignVueResolver({ importStyle: false })],
        dts: path.resolve(__dirname, "src/types/components.d.ts")
      }),
      UnpluginSvgComponent({
        iconDir: [path.resolve(__dirname, "src/assets/svgs")],
        preserveColor: path.resolve(__dirname, "src/assets/svgs/preserve-color"),
        dts: true,
        dtsDir: path.resolve(__dirname, "src/types")
      }),
      MockServe({
        mockPath: "src/mock",
        enable: VITE_APP_USE_MOCK === "true",
        logger: VITE_APP_USE_MOCK === "true"
      }),
      VueDevTools()
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
    base: VITE_APP_BASE_URL,
    build: {
      cssCodeSplit: true,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;

            // Vue 核心
            if (
              id.includes("vue") ||
              id.includes("vue-router") ||
              id.includes("pinia") ||
              id.includes("vue-i18n") ||
              id.includes("@vueuse")
            ) {
              return "core";
            }

            // UI 框架
            if (id.includes("ant-design-vue")) {
              return "ui";
            }

            // 常用工具库
            if (id.includes("axios") || id.includes("lodash-es") || id.includes("dayjs")) {
              return "libs";
            }

            // 第三方
            return "vendor";
          },
          minify: {
            compress: {
              dropConsole: VITE_DROP_CONSOLE === "true",
              dropDebugger: VITE_DROP_DEBUGGER === "true"
            }
          }
        }
      }
    },
    server: {
      port: Number(VITE_DEV_PORT),
      host: true,
      open: VITE_DEV_OPEN === "true",
      proxy: {
        [VITE_APP_BASE_API_URL]: {
          target: "http://localhost:9527",
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${VITE_APP_BASE_API_URL}`), "")
        }
      }
    }
  };
});
