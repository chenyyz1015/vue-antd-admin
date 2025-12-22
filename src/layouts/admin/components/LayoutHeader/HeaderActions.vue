<template>
  <div class="header-actions">
    <!-- 主题切换 -->
    <a-tooltip :title="themeMode === 'dark' ? '切换为亮色模式' : '切换为暗色模式'">
      <span class="header-action" @click="$emit('toggle-theme')">
        <bulb-outlined v-if="themeMode === 'light'" />
        <bulb-filled v-else />
      </span>
    </a-tooltip>

    <!-- 语言切换 -->
    <a-dropdown v-if="!isMobile">
      <span class="header-action">
        <global-outlined />
      </span>
      <template #overlay>
        <a-menu @click="handleLocaleChange">
          <a-menu-item key="zh-CN">
            <span>简体中文</span>
          </a-menu-item>
          <a-menu-item key="en-US">
            <span>English</span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>

    <!-- 全屏切换 -->
    <a-tooltip v-if="!isMobile" title="全屏">
      <span class="header-action" @click="$emit('toggle-fullscreen')">
        <fullscreen-outlined v-if="!isFullscreen" />
        <fullscreen-exit-outlined v-else />
      </span>
    </a-tooltip>

    <!-- 设置按钮 -->
    <a-tooltip title="布局设置">
      <span class="header-action" @click="$emit('open-settings')">
        <setting-outlined />
      </span>
    </a-tooltip>
  </div>
</template>

<script setup lang="ts">
import type { MenuInfo } from "ant-design-vue/es/menu/src/interface";

interface Props {
  themeMode: "light" | "dark";
  isFullscreen: boolean;
  isMobile?: boolean;
}

interface Emits {
  (e: "toggle-theme"): void;
  (e: "toggle-fullscreen"): void;
  (e: "locale-change", locale: string): void;
  (e: "open-settings"): void;
}

withDefaults(defineProps<Props>(), {
  isMobile: false
});

const emit = defineEmits<Emits>();

const handleLocaleChange = ({ key }: MenuInfo) => {
  emit("locale-change", key.toString());
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
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s;
    border-radius: 4px;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
}

:deep([data-theme="dark"]) {
  .header-action:hover {
    background: rgba(255, 255, 255, 0.08);
  }
}
</style>
