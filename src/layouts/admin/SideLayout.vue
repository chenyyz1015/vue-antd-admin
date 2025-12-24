<template>
  <a-layout class="side-layout">
    <!-- 侧边栏 -->
    <LayoutSider :is-mobile="isMobile" />

    <a-layout>
      <!-- 顶部栏 -->
      <LayoutHeader
        :is-fullscreen="isFullscreen"
        :is-mobile="isMobile"
        @toggle-fullscreen="$emit('toggle-fullscreen')"
        @open-settings="$emit('open-settings')"
      />

      <!-- 标签页 -->
      <LayoutTabs :is-mobile="isMobile" />

      <!-- 内容区 -->
      <LayoutContent :cached-views="cachedViews" />

      <!-- 底部 -->
      <LayoutFooter v-if="appStore.showCopyright" />
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
  (e: "toggle-fullscreen"): void;
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
