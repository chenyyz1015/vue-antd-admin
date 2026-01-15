<template>
  <div class="header-actions">
    <!-- 主题切换 -->
    <a-tooltip :title="appStore.themeMode === 'dark' ? '切换为亮色模式' : '切换为暗色模式'" placement="bottom">
      <span class="header-action" @click="appStore.toggleTheme">
        <bulb-outlined v-if="appStore.themeMode === 'light'" />
        <bulb-filled v-else />
      </span>
    </a-tooltip>

    <!-- 语言切换 -->
    <a-dropdown>
      <span class="header-action">
        <global-outlined />
      </span>
      <template #overlay>
        <a-menu @click="handleLocaleChange">
          <a-menu-item v-for="item in locales" :key="item.key"> {{ item.value }} </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>

    <!-- 全屏切换 -->
    <a-tooltip title="全屏" placement="bottom">
      <span class="header-action" @click="$emit('toggle-fullscreen')">
        <fullscreen-outlined v-if="!isFullscreen" />
        <fullscreen-exit-outlined v-else />
      </span>
    </a-tooltip>

    <!-- 设置按钮 -->
    <a-tooltip title="布局设置" placement="bottom">
      <span class="header-action" @click="$emit('open-settings')">
        <setting-outlined />
      </span>
    </a-tooltip>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";
import type { MenuInfo } from "ant-design-vue/es/menu/src/interface";
import type { Locale } from "vue-i18n";

interface LocaleItem {
  key: Locale;
  value: string;
}

interface Props {
  isFullscreen: boolean;
}

interface Emits {
  (e: "toggle-fullscreen"): void;
  (e: "open-settings"): void;
}

defineProps<Props>();
defineEmits<Emits>();

const { locale } = useI18n();
const appStore = useAppStore();

const locales: LocaleItem[] = [
  { key: "zh-CN", value: "简体中文" },
  { key: "en-US", value: "English" }
];

const handleLocaleChange = ({ key }: MenuInfo) => {
  appStore.setLocale(key.toString());
  locale.value = key.toString();
};
</script>

<style lang="scss" scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;

  .header-action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-size: var(--font-size-larger);
    cursor: pointer;
    transition: all 0.3s;
    border-radius: var(--border-radius);

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
}
</style>
