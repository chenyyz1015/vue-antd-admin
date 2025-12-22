<template>
  <a-layout-header class="layout-header">
    <div class="header-left">
      <menu-unfold-outlined v-if="collapsed" class="trigger" @click="$emit('toggle-collapsed')" />
      <menu-fold-outlined v-else class="trigger" @click="$emit('toggle-collapsed')" />
      <Breadcrumb v-if="!isMobile && showBreadcrumb" />
    </div>

    <div class="header-right">
      <HeaderActions
        :theme-mode="themeMode"
        :is-fullscreen="isFullscreen"
        :is-mobile="isMobile"
        @toggle-theme="$emit('toggle-theme')"
        @toggle-fullscreen="$emit('toggle-fullscreen')"
        @locale-change="$emit('locale-change', $event)"
        @open-settings="$emit('open-settings')"
      />
      <UserDropdown :is-mobile="isMobile" />
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import Breadcrumb from "./Breadcrumb.vue";
import HeaderActions from "./HeaderActions.vue";
import UserDropdown from "./UserDropdown.vue";

interface Props {
  collapsed: boolean;
  themeMode: "light" | "dark";
  isFullscreen: boolean;
  isMobile?: boolean;
  showBreadcrumb?: boolean;
}

interface Emits {
  (e: "toggle-collapsed"): void;
  (e: "toggle-theme"): void;
  (e: "toggle-fullscreen"): void;
  (e: "locale-change", locale: string): void;
  (e: "open-settings"): void;
}

withDefaults(defineProps<Props>(), {
  isMobile: false,
  showBreadcrumb: true
});

defineEmits<Emits>();
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
  justify-content: space-between;
  border-bottom: 1px solid #eeeeee;

  .header-left {
    display: flex;
    align-items: center;

    .trigger {
      font-size: 18px;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
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
