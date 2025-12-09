import type { ModuleNamespace } from "vite/types/hot.js";
import type { Directive, Plugin } from "vue";

const plugin: Plugin = {
  install: (app) => {
    // 同步加载指令模块
    const modules = import.meta.glob<ModuleNamespace>("./modules/**/*.{js,ts}", { eager: true });
    const map: Record<string, Directive> = {};
    const directiveMap: Record<string, Directive> = Object.entries(modules).reduce((map, [filePath, mod]) => {
      const fileName = filePath
        .split("/")
        .pop()!
        .replace(/\.(js|ts)$/, "");
      map[fileName] = mod.default;
      return map;
    }, map);
    // 全局注册自定义指令
    for (const key in directiveMap) {
      app.directive(key, directiveMap[key] || {});
    }
  }
};

export default plugin;
