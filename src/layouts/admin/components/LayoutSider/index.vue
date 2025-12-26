<template>
  <a-layout-sider
    v-model:collapsed="appStore.collapsed"
    collapsible
    :width="220"
    :theme="appStore.themeMode"
    :trigger="null"
    class="layout-sider"
  >
    <Logo />
    <Menu mode="inline" />
  </a-layout-sider>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";

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
