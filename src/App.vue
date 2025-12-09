<script setup lang="ts">
import { useAppStore } from "./stores/modules/app";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import enUS from "ant-design-vue/es/locale/en_US";

const appStore = useAppStore();

const locale = computed(() => {
  return appStore.locale === "zh-CN" ? zhCN : enUS;
});
</script>

<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>
