import { defineStore } from "pinia";
import { ref } from "vue";

export type LayoutMode = "side" | "top" | "mix";
export type ThemeMode = "light" | "dark";

export const useAppStore = defineStore(
  "app",
  () => {
    const layoutMode = ref<LayoutMode>("side");
    const themeMode = ref<ThemeMode>("light");
    const primaryColor = ref("#1890ff");
    const locale = ref("zh-CN");
    const collapsed = ref(false);

    const setLayoutMode = (mode: LayoutMode) => {
      layoutMode.value = mode;
    };

    const setThemeMode = (mode: ThemeMode) => {
      themeMode.value = mode;
      document.documentElement.setAttribute("data-theme", mode);
    };

    const setPrimaryColor = (color: string) => {
      primaryColor.value = color;
    };

    const setLocale = (lang: string) => {
      locale.value = lang;
    };

    const toggleCollapsed = () => {
      collapsed.value = !collapsed.value;
    };

    return {
      layoutMode,
      themeMode,
      primaryColor,
      locale,
      collapsed,
      setLayoutMode,
      setThemeMode,
      setPrimaryColor,
      setLocale,
      toggleCollapsed
    };
  },
  {
    persist: true
  }
);
