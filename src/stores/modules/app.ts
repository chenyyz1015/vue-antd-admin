export type LayoutMode = "side" | "top" | "mix";
export type ThemeMode = "light" | "dark";
export type TransitionName = "fade" | "fade-slide";
export type ContentWidth = "fluid" | "fixed";

export const useAppStore = defineStore(
  "app",
  () => {
    // 基础配置
    const title = ref(import.meta.env.VITE_APP_TITLE);
    const layoutMode = ref<LayoutMode>("side");
    const themeMode = ref<ThemeMode>("light");
    const transitionName = ref<TransitionName>("fade-slide");
    const primaryColor = ref("#1890ff");
    const locale = ref("zh-CN");

    // 布局配置
    const collapsed = ref(false);
    const showTabs = ref(true);
    const showBreadcrumb = ref(true);
    const showFooter = ref(true);
    const contentWidth = ref<ContentWidth>("fluid");

    // 特殊模式
    const colorWeak = ref(false);
    const grayMode = ref(false);

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

    const toggleTheme = () => {
      const newTheme = themeMode.value === "light" ? "dark" : "light";
      setThemeMode(newTheme);
    };

    const setTransitionName = (name: TransitionName) => {
      transitionName.value = name;
    };

    const setPrimaryColor = (color: string) => {
      primaryColor.value = color;
      // 更新 CSS 变量
      document.documentElement.style.setProperty("--primary-color", color);
    };

    const setLocale = (lang: string) => {
      locale.value = lang;
    };

    const setCollapsed = (value: boolean) => {
      collapsed.value = value;
    };

    const toggleCollapsed = () => {
      collapsed.value = !collapsed.value;
    };

    const setContentWidth = (width: ContentWidth) => {
      contentWidth.value = width;
    };

    const setColorWeak = (weak: boolean) => {
      colorWeak.value = weak;
      if (weak) {
        document.documentElement.classList.add("color-weak");
      } else {
        document.documentElement.classList.remove("color-weak");
      }
    };

    const setGrayMode = (gray: boolean) => {
      grayMode.value = gray;
      if (gray) {
        document.documentElement.classList.add("gray-mode");
      } else {
        document.documentElement.classList.remove("gray-mode");
      }
    };

    return {
      title,
      layoutMode,
      themeMode,
      transitionName,
      primaryColor,
      locale,
      collapsed,
      showTabs,
      showBreadcrumb,
      showFooter,
      contentWidth,
      colorWeak,
      grayMode,
      setTitle,
      setLayoutMode,
      setThemeMode,
      toggleTheme,
      setTransitionName,
      setPrimaryColor,
      setLocale,
      setCollapsed,
      toggleCollapsed,
      setContentWidth,
      setColorWeak,
      setGrayMode
    };
  },
  {
    persist: {
      pick: [
        "layoutMode",
        "themeMode",
        "primaryColor",
        "locale",
        "showTabs",
        "showBreadcrumb",
        "contentWidth",
        "colorWeak",
        "grayMode"
      ]
    }
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot));
}
