import * as AntdVueIcons from "@ant-design/icons-vue";
import Antd from "ant-design-vue";
import { createApp } from "vue";
import SvgIcon from "~virtual/svg-component";
import App from "./App.vue";
import directives from "./directives";
import i18n from "./locales";
import router from "./router";
import pinia from "./stores";

import "ant-design-vue/dist/reset.css";
import "virtual:uno.css";
import "./router/guard";
import "./styles/index.scss";

const app = createApp(App);

// 全局注册SvgIcon图标组件
app.component("SvgIcon", SvgIcon);

// 全局注册ant-design-vue图标组件
Object.entries(AntdVueIcons).forEach(([name, component]) => {
  app.component(name, component);
});

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(Antd);
app.use(directives);

app.mount("#app");
