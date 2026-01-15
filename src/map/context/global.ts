import { MapCore } from "@/map";
import type { App, Plugin } from "vue";
import { useMapGlobalOptions } from "../composables";
import { DEFAULT_OPTIONS } from "./config";

export function setupGlobalMap(app: App) {
  const container = document.createElement("div");
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.overflow = "hidden";
  container.style.position = "relative";

  // 创建地图实例
  const viewer = new MapCore(container, DEFAULT_OPTIONS);

  app.config.globalProperties.$map = { viewer, container };
}

export interface VueMapPluginOptions {
  /** 天地图API key */
  tk?: string;
  /** 谷歌地图API key */
  gk?: string;
}

export const VueMapPlugin: Plugin = {
  install: (app: App, options: VueMapPluginOptions) => {
    setupGlobalMap(app);

    // 注入API key
    const { tk, gk } = useMapGlobalOptions();
    tk.value = options.tk ?? "";
    gk.value = options.gk ?? "";
  }
};
