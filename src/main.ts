import Antd from "ant-design-vue";
import { createApp } from "vue";
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

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(Antd);
app.use(directives);

app.mount("#app");
