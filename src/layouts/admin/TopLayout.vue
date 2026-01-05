<template>
  <a-layout class="top-layout">
    <!-- 顶部栏 -->
    <a-layout-header class="layout-header">
      <div class="header-left">
        <!-- Logo -->
        <Logo :collapsible="false" :background="false" />

        <!-- 顶部菜单 -->
        <div class="header-menu">
          <Menu mode="horizontal" />
        </div>
      </div>

      <div class="header-right">
        <HeaderActions
          :is-fullscreen="isFullscreen"
          @toggle-fullscreen="$emit('toggle-fullscreen')"
          @open-settings="$emit('open-settings')"
        />
        <UserDropdown />
      </div>
    </a-layout-header>

    <a-layout>
      <!-- 标签页 -->
      <LayoutTabs />

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

<style lang="scss">
html[data-theme="dark"] {
  .top-layout {
    .layout-header {
      border: 0;
    }
  }
}
</style>

<style lang="scss" scoped>
.top-layout {
  width: 100%;
  height: 100%;

  .layout-header {
    padding: 0 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    border-bottom: 1px solid #eeeeee;

    .header-left {
      flex: 1 1 auto;
      width: 0;
      height: auto;
      display: flex;
      align-items: center;
      gap: 15px;

      .header-menu {
        flex: 1 1 auto;
        width: 0;
        height: auto;
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 15px;
    }
  }
}
</style>
