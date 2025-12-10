import type { ModuleNamespace } from "vite/types/hot.js";
import type { Locale, MessageFunction } from "vue-i18n";
import { createI18n } from "vue-i18n";

type ModuleMessage = Record<string, string | MessageFunction>;

type MessageMap = Record<string, ModuleMessage>;

/**
 * 同步加载语言包
 * @param {Locale} locale
 * @returns {MessageMap}
 */
const loadSyncMessage = (locale: Locale): MessageMap => {
  const zhCNModule = import.meta.glob<ModuleNamespace>("./lang/zh-CN/**/*.{js,ts}", { eager: true });
  const enUSModule = import.meta.glob<ModuleNamespace>("./lang/en-US/**/*.{js,ts}", { eager: true });
  const localeModuleMap: Record<string, Record<string, ModuleNamespace>> = {
    "zh-CN": zhCNModule,
    "en-US": enUSModule
  };
  const module = localeModuleMap[locale];
  const messageMap: MessageMap = {};
  if (module) {
    return Object.entries(module).reduce((map, [filePath, mod]) => {
      const fileName = filePath
        .split("/")
        .pop()!
        .replace(/\.(js|ts)$/, "");
      map[fileName] = mod.default;
      return map;
    }, messageMap);
  }
  return messageMap;
};

// zhCN
const zhCN: MessageMap = loadSyncMessage("zh-CN");
// enUS
const enUS: MessageMap = loadSyncMessage("en-US");
// 语言包
const messages: Record<Locale, MessageMap> = { "zh-CN": zhCN, "en-US": enUS };

const i18n = createI18n({
  legacy: false,
  locale: "zh-CN",
  fallbackLocale: "en-US",
  messages
});

export default i18n;
