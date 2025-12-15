import type { ModuleNamespace } from "vite/types/hot.js";
import type { Locale, MessageFunction } from "vue-i18n";
import { createI18n } from "vue-i18n";

type ModuleMessage = Record<string, string | MessageFunction>;

/**
 * 同步加载语言包
 * @param {Locale} locale
 * @returns {ModuleMessage}
 */
const loadSyncMessage = (locale: Locale): ModuleMessage => {
  const zhCNModule = import.meta.glob<ModuleNamespace>("./lang/zh-CN/**/*.{js,ts}", { eager: true });
  const enUSModule = import.meta.glob<ModuleNamespace>("./lang/en-US/**/*.{js,ts}", { eager: true });
  const localeModuleMap: Record<string, Record<string, ModuleNamespace>> = {
    "zh-CN": zhCNModule,
    "en-US": enUSModule
  };
  const module = localeModuleMap[locale];
  return module ? Object.values(module).reduce((message, mod) => ({ ...message, ...mod.default }), {}) : {};
};

// 注册语言包
const zhCN: ModuleMessage = loadSyncMessage("zh-CN");
const enUS: ModuleMessage = loadSyncMessage("en-US");
const messages: Record<Locale, ModuleMessage> = { "zh-CN": zhCN, "en-US": enUS };

const i18n = createI18n({
  legacy: false,
  locale: "zh-CN",
  fallbackLocale: "en-US",
  messages
});

export default i18n;
