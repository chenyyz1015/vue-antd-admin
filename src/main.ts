import Antd from "ant-design-vue";
import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./locales";
import { setupVuePlugins } from "./plugins";
import router from "./router";
import pinia from "./stores";

import "ant-design-vue/dist/reset.css";
import "maptalks-gl/dist/maptalks-gl.css";
import "virtual:uno.css";
import "./router/guard";
import "./styles/index.scss";

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(Antd);
app.use(setupVuePlugins);

app.mount("#app");
