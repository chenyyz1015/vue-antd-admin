import { MapPicker, MapViewer } from "@/map";
import * as AntdVueIcons from "@ant-design/icons-vue";
import type { App } from "vue";
import SvgIcon from "~virtual/svg-component";

export default function setupComponents(app: App) {
  // 全局注册SvgIcon图标组件
  app.component("SvgIcon", SvgIcon);

  // 全局注册ant-design-vue图标组件
  Object.entries(AntdVueIcons).forEach(([name, component]) => {
    app.component(name, component);
  });

  // 全局注册地图组件
  app.component("MapViewer", MapViewer);
  app.component("MapPicker", MapPicker);
}
