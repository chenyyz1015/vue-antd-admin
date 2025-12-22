<template>
  <component
    :is="currentLayout"
    :is-fullscreen="isFullscreen"
    :is-mobile="isMobile"
    :cached-views="cachedViews"
    @toggle-theme="toggleTheme"
    @toggle-fullscreen="toggleFullscreen"
    @locale-change="handleLocaleChange"
    @open-settings="settingsVisible = true"
  />

  <!-- 设置抽屉 -->
  <LayoutSettings
    v-model:visible="settingsVisible"
    v-model:layout-mode="appStore.layoutMode"
    v-model:theme-mode="appStore.themeMode"
    v-model:primary-color="appStore.primaryColor"
    v-model:show-tabs="appStore.showTabs"
    v-model:fixed-header="appStore.fixedHeader"
    v-model:show-breadcrumb="appStore.showBreadcrumb"
    v-model:show-footer="appStore.showFooter"
    v-model:collapsed="appStore.collapsed"
    v-model:color-weak="appStore.colorWeak"
    v-model:gray-mode="appStore.grayMode"
    v-model:locale="appStore.locale"
    v-model:content-width="appStore.contentWidth"
    @reset="handleResetSettings"
    @copy-settings="handleCopySettings"
  />
</template>

<script setup lang="ts">
import type { LayoutMode } from "@/stores";
import { useAppStore } from "@/stores";
import { Modal, message } from "ant-design-vue";
import { MixLayout, SideLayout, TopLayout } from "./admin";

type AdminLayout = typeof SideLayout | typeof TopLayout | typeof MixLayout;

const { locale } = useI18n();
const appStore = useAppStore();

// 状态
const isFullscreen = ref(false);
const isMobile = ref(false);
const cachedViews = ref<string[]>([]);
const settingsVisible = ref(false);

// 根据 layoutMode 选择对应的布局组件
const currentLayout = computed<AdminLayout>(() => {
  const layouts: Record<LayoutMode, AdminLayout> = {
    side: SideLayout,
    top: TopLayout,
    mix: MixLayout
  };
  return layouts[appStore.layoutMode || "side"];
});

// 检测移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value && !appStore.collapsed) {
    appStore.toggleCollapsed();
  }
};

// 主题切换
const toggleTheme = () => {
  const newTheme = appStore.themeMode === "light" ? "dark" : "light";
  appStore.setThemeMode(newTheme);
};

// 全屏切换
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
};

// 监听全屏变化
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

// 语言切换
const handleLocaleChange = (lang: string) => {
  appStore.setLocale(lang);
  locale.value = lang;
};

// 重置设置
const handleResetSettings = () => {
  Modal.confirm({
    title: "提示",
    content: "确定要重置所有设置吗？",
    onOk: () => {
      appStore.setLayoutMode("side");
      appStore.setThemeMode("light");
      appStore.setPrimaryColor("#1890ff");
      appStore.setLocale("zh-CN");
      appStore.showTabs = true;
      appStore.fixedHeader = true;
      appStore.showBreadcrumb = true;
      appStore.contentWidth = "fluid";
      appStore.setColorWeak(false);
      appStore.setGrayMode(false);
      locale.value = "zh-CN";
      message.success("设置已重置");
    }
  });
};

// 拷贝设置
const handleCopySettings = () => {
  const settings = {
    layoutMode: appStore.layoutMode,
    themeMode: appStore.themeMode,
    primaryColor: appStore.primaryColor,
    locale: appStore.locale,
    showTabs: appStore.showTabs,
    fixedHeader: appStore.fixedHeader,
    showBreadcrumb: appStore.showBreadcrumb,
    contentWidth: appStore.contentWidth,
    colorWeak: appStore.colorWeak,
    grayMode: appStore.grayMode
  };

  navigator.clipboard
    .writeText(JSON.stringify(settings, null, 2))
    .then(() => {
      message.success("设置已复制到剪贴板");
    })
    .catch(() => {
      message.error("复制失败");
    });
};

// 监听色弱模式
watch(
  () => appStore.colorWeak,
  (weak) => {
    appStore.setColorWeak(weak);
  },
  { immediate: true }
);

// 监听灰色模式
watch(
  () => appStore.grayMode,
  (gray) => {
    appStore.setGrayMode(gray);
  },
  { immediate: true }
);

// 生命周期
onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
  document.addEventListener("fullscreenchange", handleFullscreenChange);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
});
</script>

<style lang="scss" scoped></style>
