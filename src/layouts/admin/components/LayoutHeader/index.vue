<template>
  <a-layout-header class="layout-header">
    <div class="header-left">
      <menu-unfold-outlined v-if="appStore.collapsed" class="trigger" @click="appStore.toggleCollapsed" />
      <menu-fold-outlined v-else class="trigger" @click="appStore.toggleCollapsed" />
      <Breadcrumb v-if="!isMobile && appStore.showBreadcrumb" />
    </div>

    <div class="header-right">
      <HeaderActions
        :is-fullscreen="isFullscreen"
        :is-mobile="isMobile"
        @toggle-fullscreen="$emit('toggle-fullscreen')"
        @open-settings="$emit('open-settings')"
      />
      <UserDropdown :is-mobile="isMobile" />
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";

interface Props {
  isFullscreen: boolean;
  isMobile?: boolean;
}

interface Emits {
  (e: "toggle-fullscreen"): void;
  (e: "open-settings"): void;
}

withDefaults(defineProps<Props>(), {
  isMobile: false
});

defineEmits<Emits>();

const appStore = useAppStore();
</script>

<style lang="scss">
html[data-theme="light"] {
  .layout-header {
    background: #ffffff;
  }
}

html[data-theme="dark"] {
  .layout-header {
    .header-left,
    .header-right {
      color: #ffffff;
    }
  }
}
</style>

<style lang="scss" scoped>
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

    .trigger {
      font-size: 18px;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: var(--primary-color);
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}
</style>
