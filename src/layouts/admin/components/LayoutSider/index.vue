<template>
  <a-layout-sider
    v-model:collapsed="appStore.collapsed"
    :trigger="null"
    collapsible
    :width="220"
    class="layout-sider"
    :theme="appStore.themeMode"
    :collapsed-width="isMobile ? 0 : 80"
  >
    <Logo />
    <Menu mode="inline" />
  </a-layout-sider>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";

interface Props {
  isMobile?: boolean;
}

withDefaults(defineProps<Props>(), {
  isMobile: false
});

const appStore = useAppStore();
</script>

<style lang="scss">
html[data-theme="dark"] {
  .layout-sider {
    border: 0;
  }
}
</style>

<style lang="scss" scoped>
.layout-sider {
  border-right: 1px solid #eeeeee;
}
</style>
