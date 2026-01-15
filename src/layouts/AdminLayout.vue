<template>
  <component
    :is="currentLayout"
    :is-fullscreen="isFullscreen"
    :cached-views="cachedViews"
    @toggle-fullscreen="toggleFullscreen"
    @open-settings="settingsVisible = true"
  />

  <!-- 设置抽屉 -->
  <LayoutSettings v-model:visible="settingsVisible" />
</template>

<script setup lang="ts">
import { useFullscreen } from "@/composables";
import type { LayoutMode } from "@/stores";
import { useAppStore } from "@/stores";
import { MixLayout, SideLayout, TopLayout } from "./admin";

type AdminLayout = typeof SideLayout | typeof TopLayout | typeof MixLayout;

const appStore = useAppStore();
const { isFullscreen, toggleFullscreen } = useFullscreen();

// 状态
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

// 自动收起侧边栏
const autoCollapsedSider = () => {
  if (!appStore.collapsed && window.innerWidth < 768) {
    appStore.toggleCollapsed();
  }
};
useEventListener(window, "resize", autoCollapsedSider);

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
</script>

<style lang="scss" scoped></style>
