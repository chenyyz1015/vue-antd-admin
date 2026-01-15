<script setup lang="ts">
import { useMapGlobalState } from "@/map";
import { ConfigProvider } from "ant-design-vue";
import type { ThemeConfig } from "ant-design-vue/es/config-provider/context";
import enUS from "ant-design-vue/es/locale/en_US";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { useAppStore, useDownloadStore } from "./stores";

onMounted(() => {
  calculateScale();
  mapState.init();
});

const watermark = import.meta.env.VITE_APP_WATERMARK;
const watermarkEnable = import.meta.env.VITE_APP_WATERMARK_ENABLE === "true";
const watermarkContent = watermarkEnable ? (watermark ?? "").split(",").filter((i) => i) : [];

const { t } = useI18n();
const route = useRoute();
const appStore = useAppStore();
const mapState = useMapGlobalState();
const downloadStore = useDownloadStore();

const locale = computed(() => {
  return appStore.locale === "zh-CN" ? zhCN : enUS;
});

const theme = computed<ThemeConfig>(() => ({
  token: {
    colorPrimary: appStore.primaryColor,
    fontSize: appStore.fontSize,
    borderRadius: appStore.borderRadius
  },
  algorithm:
    appStore.themeMode === "dark" ? ConfigProvider.theme?.darkAlgorithm : ConfigProvider.theme?.defaultAlgorithm
}));

watch(
  () => appStore.locale,
  () => {
    const appTitle = import.meta.env.VITE_APP_TITLE;
    document.title = route.meta.title ? `${t(route.meta.title)} - ${appTitle}` : appTitle;
  },
  { immediate: true }
);

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

watch(
  () => appStore.fontSize,
  (size) => {
    document.documentElement.style.setProperty("--font-size", `${size}px`);
  },
  { immediate: true }
);

watch(
  () => appStore.borderRadius,
  (radius) => {
    document.documentElement.style.setProperty("--border-radius", `${radius}px`);
  },
  { immediate: true }
);

watch(
  () => appStore.contentWidth,
  (width) => {
    document.documentElement.style.setProperty("--content-width", `${width}%`);
  },
  { immediate: true }
);

const appStyle = computed<Record<string, string | number>>(() => {
  return {
    width: `${100 / appStore.scaleRatio}%`,
    height: `${100 / appStore.scaleRatio}%`,
    transform: `scale(${appStore.scaleRatio})`
  };
});
// 计算缩放比例（基于高度）
const calculateScale = () => {
  const currentScale = window.innerHeight / 1080;
  const minScale = Number(import.meta.env.VITE_APP_MIN_SCALE ?? 0.5);
  const maxScale = Number(import.meta.env.VITE_APP_MAX_SCALE ?? 2);

  appStore.scaleRatio = currentScale > 1 ? Math.min(currentScale, maxScale) : Math.max(currentScale, minScale);
  // 全局缩放document.body时会导致select、dropdown等组件下拉菜单位置偏移
  // 同步全局popup容器内容缩放比例
  document.documentElement.style.setProperty("--scale-ratio", appStore.scaleRatio.toString());
};

const debouncedFn = useDebounceFn(calculateScale, 500);
useEventListener(window, "resize", debouncedFn);
</script>

<template>
  <a-config-provider :locale="locale" :theme="theme">
    <div :style="appStyle" class="app-container">
      <a-watermark :content="watermarkContent" class="watermark-wrapper">
        <RouterView />
      </a-watermark>
      <ComSpin :loading="downloadStore.loading" :tip="downloadStore.tip" />
    </div>
  </a-config-provider>
</template>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  transform-origin: left top;
  transition: transform 0.3s ease;

  .watermark-wrapper {
    width: 100%;
    height: 100%;
  }
}
</style>
