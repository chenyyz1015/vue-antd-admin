<template>
  <a-drawer v-model:open="visible" title="系统设置" placement="right" :width="300">
    <a-divider>布局模式</a-divider>
    <div class="setting-item">
      <div class="layout-modes">
        <div
          v-for="mode in layoutModes"
          :key="mode.value"
          class="layout-mode-item"
          :class="{ active: appStore.layoutMode === mode.value }"
          @click="handleLayoutChange(mode.value)"
        >
          <div class="mode-preview" :class="`mode-${mode.value}`">
            <div class="preview-header"></div>
            <div class="preview-body">
              <div v-if="mode.value === 'side'" class="preview-sider"></div>
              <div class="preview-content"></div>
            </div>
          </div>
          <span>{{ mode.label }}</span>
        </div>
      </div>
    </div>

    <a-divider>主题设置</a-divider>
    <div class="setting-item">
      <div class="setting-label">主题模式</div>
      <a-segmented v-model:value="appStore.themeMode" :options="themeModes" @change="handleThemeChange" />
    </div>

    <div class="setting-item">
      <div class="setting-label">主题色</div>
      <div class="color-picker">
        <div
          v-for="color in presetColors"
          :key="color"
          class="color-item"
          :class="{ active: appStore.primaryColor === color }"
          :style="{ backgroundColor: color }"
          @click="handleColorChange(color)"
        />
      </div>
    </div>

    <a-divider>其他设置</a-divider>
    <div class="setting-item">
      <div class="setting-label">语言</div>
      <a-select v-model:value="appStore.locale" style="width: 100%" @change="handleLocaleChange">
        <a-select-option value="zh-CN">简体中文</a-select-option>
        <a-select-option value="en-US">English</a-select-option>
      </a-select>
    </div>

    <template #footer>
      <a-button block @click="handleReset">恢复默认</a-button>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import type { LayoutMode, ThemeMode } from "@/stores/modules/app";
import { useAppStore } from "@/stores/modules/app";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

interface Props {
  visible: boolean;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const appStore = useAppStore();
const { locale } = useI18n();

const visible = computed({
  get: () => props.visible,
  set: (val) => emit("update:visible", val)
});

const layoutModes = [
  { label: "侧边栏", value: "side" as LayoutMode },
  { label: "顶部栏", value: "top" as LayoutMode },
  { label: "混合", value: "mix" as LayoutMode }
];

const themeModes = [
  { label: "浅色", value: "light" as ThemeMode },
  { label: "深色", value: "dark" as ThemeMode }
];

const presetColors = ["#1890ff", "#722ed1", "#eb2f96", "#f5222d", "#fa8c16", "#52c41a", "#13c2c2", "#2f54eb"];

const handleLayoutChange = (mode: LayoutMode) => {
  appStore.setLayoutMode(mode);
};

const handleThemeChange = (mode: ThemeMode) => {
  appStore.setThemeMode(mode);
};

const handleColorChange = (color: string) => {
  appStore.setPrimaryColor(color);
};

const handleLocaleChange = (lang: string) => {
  appStore.setLocale(lang);
  locale.value = lang;
};

const handleReset = () => {
  appStore.setLayoutMode("side");
  appStore.setThemeMode("light");
  appStore.setPrimaryColor("#1890ff");
  appStore.setLocale("zh-CN");
  locale.value = "zh-CN";
};
</script>

<style scoped lang="scss">
.setting-item {
  margin-bottom: 24px;

  .setting-label {
    margin-bottom: 12px;
    font-weight: 500;
  }
}

.layout-modes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  .layout-mode-item {
    cursor: pointer;
    text-align: center;

    &.active .mode-preview {
      border-color: #1890ff;
    }

    .mode-preview {
      width: 100%;
      height: 60px;
      border: 2px solid #e8e8e8;
      border-radius: 4px;
      overflow: hidden;
      transition: all 0.3s;
      margin-bottom: 8px;

      &:hover {
        border-color: #1890ff;
      }

      .preview-header {
        height: 12px;
        background: #001529;
      }

      .preview-body {
        display: flex;
        height: 48px;

        .preview-sider {
          width: 25%;
          background: #001529;
        }

        .preview-content {
          flex: 1;
          background: #f0f2f5;
        }
      }

      &.mode-top {
        .preview-body {
          .preview-content {
            width: 100%;
          }
        }
      }

      &.mode-mix {
        .preview-body {
          .preview-sider {
            width: 20%;
            background: #fff;
            border-right: 1px solid #e8e8e8;
          }
        }
      }
    }

    span {
      font-size: 12px;
      color: #666;
    }
  }
}

.color-picker {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  .color-item {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    transition: all 0.3s;

    &:hover {
      transform: scale(1.1);
    }

    &.active::after {
      content: "✓";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      font-size: 18px;
      font-weight: bold;
    }
  }
}
</style>
