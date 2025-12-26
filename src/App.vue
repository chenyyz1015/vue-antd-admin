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

// 计算缩放比例（基于高度）
const calculateScale = () => {
  const scale = window.innerHeight / 1080;
  document.body.style.width = `${100 / scale}%`;
  document.body.style.height = `${100 / scale}%`;
  document.body.style.transform = `scale(${scale})`;
  document.body.style.transformOrigin = "left top";
  document.body.style.transition = "transform 0.3s ease";
};

const debouncedFn = useDebounceFn(calculateScale, 500);
useEventListener(window, "resize", debouncedFn);

onMounted(() => {
  calculateScale();
});
</script>

<template>
  <a-config-provider :locale="locale" :theme="theme">
    <RouterView />
  </a-config-provider>
</template>

<style lang="scss" scoped></style>
