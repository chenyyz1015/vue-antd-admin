<template>
  <component
    :is="currentLayout"
    :is-fullscreen="isFullscreen"
    :is-mobile="isMobile"
    :cached-views="cachedViews"
    @toggle-fullscreen="toggleFullscreen"
    @open-settings="settingsVisible = true"
  />

  <!-- 设置抽屉 -->
  <LayoutSettings v-model:visible="settingsVisible" />
</template>

<script setup lang="ts">
import type { LayoutMode } from "@/stores";
import { useAppStore } from "@/stores";
import { MixLayout, SideLayout, TopLayout } from "./admin";

type AdminLayout = typeof SideLayout | typeof TopLayout | typeof MixLayout;

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
