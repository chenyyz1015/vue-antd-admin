<script setup lang="ts">
import { ConfigProvider } from "ant-design-vue";
import enUS from "ant-design-vue/es/locale/en_US";
import zhCN from "ant-design-vue/es/locale/zh_CN";
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

const appRef = ref<HTMLElement>();
// 计算缩放比例（基于高度）
const calculateScale = () => {
  const currentScale = window.innerHeight / 1080;
  const minScale = Number(import.meta.env.VITE_APP_MIN_SCALE ?? 0.7);
  const maxScale = Number(import.meta.env.VITE_APP_MAX_SCALE ?? 2);

  const scale = currentScale > 1 ? Math.min(currentScale, maxScale) : Math.max(currentScale, minScale);

  if (appRef.value) {
    // 全局缩放document.body时会导致select、dropdown等组件下拉菜单位置偏移
    appRef.value.style.width = `${100 / scale}%`;
    appRef.value.style.height = `${100 / scale}%`;
    appRef.value.style.transform = `scale(${scale})`;
    appRef.value.style.transformOrigin = "left top";
    appRef.value.style.transition = "transform 0.3s ease";
    // 同步全局popup容器内容缩放比例
    document.documentElement.style.setProperty("--scale-ratio", scale.toString());
  }
};

const debouncedFn = useDebounceFn(calculateScale, 500);
useEventListener(window, "resize", debouncedFn);

onMounted(() => {
  calculateScale();
});
</script>

<template>
  <a-config-provider :locale="locale" :theme="theme">
    <div ref="appRef" class="app-container">
      <RouterView />
    </div>
  </a-config-provider>
</template>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
