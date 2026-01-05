import { directiveMap } from "@/directives";
import type { App } from "vue";

export default function setupDirectives(app: App) {
  // 全局注册自定义指令
  for (const key in directiveMap) {
    app.directive(key, directiveMap[key] || {});
  }
}
