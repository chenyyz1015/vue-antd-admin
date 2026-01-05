import type { ModuleNamespace } from "vite/types/hot.js";
import type { Directive } from "vue";

export type DirectiveMap = Record<string, Directive>;

// 同步加载指令模块
const modules = import.meta.glob<ModuleNamespace>("./modules/**/*.{js,ts}", { eager: true });

const map: DirectiveMap = {};
export const directiveMap: DirectiveMap = Object.entries(modules).reduce((map, [filePath, mod]) => {
  const fileName = filePath
    .split("/")
    .pop()!
    .replace(/\.(js|ts)$/, "");
  map[fileName] = mod.default;
  return map;
}, map);
