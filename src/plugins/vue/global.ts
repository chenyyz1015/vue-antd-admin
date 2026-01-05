import { MapCore, type GroupTileLayerItem } from "@/map";
import type { MapCreateOptionsType } from "maptalks/dist/map/Map";
import type { App } from "vue";

function setupGlobalMap(app: App) {
  const defaultOptions: MapCreateOptionsType = {
    center: [118.5546748, 31.6976106],
    zoom: 11,
    minZoom: 3,
    maxZoom: 16
  };

  const container = document.createElement("div");
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.overflow = "hidden";

  const layers: GroupTileLayerItem[] = [
    {
      id: "osm",
      type: "tile",
      opts: {
        urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        subdomains: ["a", "b", "c"],
        attribution: "&copy; OpenStreetMap contributors"
      }
    }
  ];

  // 创建地图实例
  const viewer = new MapCore(container, defaultOptions);
  viewer.addGroupTileLayer("base_layer_group", layers, { urlTemplate: "" });
  viewer.setDefaultBaseLayer("base_layer_group");

  app.config.globalProperties.$map = { viewer, container };
}

export default function setupGlobal(app: App) {
  setupGlobalMap(app);
}
