<script setup lang="ts">
import { ConfigProvider } from "ant-design-vue";
import enUS from "ant-design-vue/es/locale/en_US";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { watch } from "vue";
import { useAppStore } from "./stores/modules/app";

const appStore = useAppStore();

const locale = computed(() => {
  return appStore.locale === "zh-CN" ? zhCN : enUS;
});

const theme = computed(() => ({
  token: {
    colorPrimary: appStore.primaryColor
  },
  algorithm:
    appStore.themeMode === "dark" ? ConfigProvider.theme?.darkAlgorithm : ConfigProvider.theme?.defaultAlgorithm
}));

// 初始化主题
watch(
  () => appStore.themeMode,
  (mode) => {
    document.documentElement.setAttribute("data-theme", mode);
  },
  { immediate: true }
);

watch(
  () => appStore.primaryColor,
  (color) => {
    document.documentElement.style.setProperty("--primary-color", color);
  },
  { immediate: true }
);
</script>

<template>
  <a-config-provider :locale="locale" :theme="theme">
    <router-view />
  </a-config-provider>
</template>
