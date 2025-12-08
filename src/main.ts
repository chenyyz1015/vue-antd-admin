import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./stores";
import i18n from "./locales";
import Antd from "ant-design-vue";
import { setupDirectives } from "./directives";

import "ant-design-vue/dist/reset.css";
import "virtual:uno.css";
import "./styles/index.scss";
import "./router/guard";

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(Antd);

setupDirectives(app);

app.mount("#app");
