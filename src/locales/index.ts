import { createI18n } from "vue-i18n";
import * as zhCN from "./lang/zh-CN";
import * as enUS from "./lang/en-US";

const i18n = createI18n({
  legacy: false,
  locale: "zh-CN",
  fallbackLocale: "en-US",
  messages: {
    "zh-CN": zhCN,
    "en-US": enUS
  }
});

export default i18n;
