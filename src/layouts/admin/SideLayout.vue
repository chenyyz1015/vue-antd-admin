<template>
  <a-layout class="side-layout">
    <!-- 侧边栏 -->
    <LayoutSider
      v-model:collapsed="appStore.collapsed"
      :title="appStore.title"
      :theme="appStore.themeMode"
      :is-mobile="isMobile"
    />

    <!-- 移动端遮罩 -->
    <div v-if="isMobile && !appStore.collapsed" class="layout-mask" @click="appStore.toggleCollapsed" />

    <a-layout>
      <!-- 顶部栏 -->
      <LayoutHeader
        :collapsed="appStore.collapsed"
        :theme-mode="appStore.themeMode"
        :is-fullscreen="isFullscreen"
        :is-mobile="isMobile"
        :show-breadcrumb="appStore.showBreadcrumb"
        @toggle-collapsed="appStore.toggleCollapsed"
        @toggle-theme="$emit('toggle-theme')"
        @toggle-fullscreen="$emit('toggle-fullscreen')"
        @locale-change="$emit('locale-change', $event)"
        @open-settings="$emit('open-settings')"
      />

      <!-- 标签页 -->
      <LayoutTabs :is-mobile="isMobile" />

      <!-- 内容区 -->
      <LayoutContent :cached-views="cachedViews" />

      <!-- 底部 -->
      <LayoutFooter v-if="appStore.showFooter" />
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";

interface Props {
  isFullscreen: boolean;
  isMobile: boolean;
  cachedViews: string[];
}

interface Emits {
  (e: "toggle-theme"): void;
  (e: "toggle-fullscreen"): void;
  (e: "locale-change", locale: string): void;
  (e: "open-settings"): void;
}

defineProps<Props>();
defineEmits<Emits>();

const appStore = useAppStore();
</script>

<style lang="scss" scoped>
.side-layout {
  width: 100%;
  height: 100%;
}
</style>
