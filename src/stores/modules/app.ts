export type LayoutMode = "side" | "top" | "mix";
export type ThemeMode = "light" | "dark";

export const useAppStore = defineStore(
  "app",
  () => {
    const title = ref("Vue Admin");
    const layoutMode = ref<LayoutMode>("side");
    const themeMode = ref<ThemeMode>("light");
    const primaryColor = ref("#1890ff");
    const locale = ref("zh-CN");
    const collapsed = ref(false);

    const setTitle = (value: string) => {
      title.value = value;
    };

    const setLayoutMode = (mode: LayoutMode) => {
      layoutMode.value = mode;
    };

    const setThemeMode = (mode: ThemeMode) => {
      themeMode.value = mode;
      document.documentElement.setAttribute("data-theme", mode);

      // 更新 Ant Design 主题
      if (mode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    const setPrimaryColor = (color: string) => {
      primaryColor.value = color;
      // 更新 CSS 变量
      document.documentElement.style.setProperty("--primary-color", color);
    };

    const setLocale = (lang: string) => {
      locale.value = lang;
    };

    const toggleCollapsed = () => {
      collapsed.value = !collapsed.value;
    };

    return {
      title,
      layoutMode,
      themeMode,
      primaryColor,
      locale,
      collapsed,
      setTitle,
      setLayoutMode,
      setThemeMode,
      setPrimaryColor,
      setLocale,
      toggleCollapsed
    };
  },
  {
    persist: {
      pick: ["layoutMode", "themeMode", "primaryColor", "locale"]
    }
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot));
}
