<template>
  <a-drawer v-model:open="visible" title="布局设置" placement="right" :width="320" :body-style="{ padding: '16px' }">
    <div class="settings-content">
      <!-- 布局模式 -->
      <a-divider orientation="left">
        <span class="divider-title">整体风格</span>
      </a-divider>

      <div class="setting-item">
        <div class="setting-title">导航模式</div>
        <div class="layout-mode-wrapper">
          <div
            v-for="mode in layoutModes"
            :key="mode.value"
            class="layout-mode-item"
            :class="{ active: appStore.layoutMode === mode.value }"
            @click="handleLayoutModeChange(mode.value)"
          >
            <div class="mode-preview" :class="mode.value">
              <div v-if="mode.value === 'side'" class="preview-content">
                <div class="preview-sider"></div>
                <div class="preview-main">
                  <div class="preview-header"></div>
                  <div class="preview-body"></div>
                </div>
              </div>
              <div v-else-if="mode.value === 'top'" class="preview-content">
                <div class="preview-header"></div>
                <div class="preview-body"></div>
              </div>
              <div v-else class="preview-content">
                <div class="preview-header"></div>
                <div class="preview-main">
                  <div class="preview-sider"></div>
                  <div class="preview-body"></div>
                </div>
              </div>
            </div>
            <div class="mode-label">{{ mode.label }}</div>
            <check-circle-filled v-if="appStore.layoutMode === mode.value" class="mode-check" />
          </div>
        </div>
      </div>

      <!-- 主题设置 -->
      <a-divider orientation="left">
        <span class="divider-title">主题设置</span>
      </a-divider>

      <div class="setting-item">
        <div class="setting-title">主题模式</div>
        <a-segmented
          :value="appStore.themeMode"
          :options="[
            { label: '亮色', value: 'light' },
            { label: '暗色', value: 'dark' }
          ]"
          block
          @change="handleThemeModeChange"
        />
      </div>

      <div class="setting-item">
        <div class="setting-title">主题色</div>
        <div class="color-picker-wrapper">
          <div
            v-for="color in presetColors"
            :key="color.value"
            class="color-block"
            :class="{ active: appStore.primaryColor === color.value }"
            :style="{ background: color.value }"
            @click="handlePrimaryColorChange(color.value)"
          >
            <check-outlined v-if="appStore.primaryColor === color.value" class="check-icon" />
          </div>
        </div>
      </div>

      <!-- 界面显示 -->
      <a-divider orientation="left">
        <span class="divider-title">界面显示</span>
      </a-divider>

      <div class="setting-item switch-item">
        <div class="switch-label">
          <span>显示标签页</span>
          <span class="switch-desc">开启后显示多标签页</span>
        </div>
        <a-switch v-model:checked="appStore.showTabs" />
      </div>

      <div class="setting-item switch-item">
        <div class="switch-label">
          <span>显示底栏</span>
          <span class="switch-desc">显示底部版权信息</span>
        </div>
        <a-switch v-model:checked="appStore.showCopyright" />
      </div>

      <div class="setting-item switch-item">
        <div class="switch-label">
          <span>显示面包屑</span>
          <span class="switch-desc">显示页面路径导航（仅侧边布局支持）</span>
        </div>
        <a-switch v-model:checked="appStore.showBreadcrumb" :disabled="appStore.layoutMode !== 'side'" />
      </div>

      <div class="setting-item switch-item">
        <div class="switch-label">
          <span>侧栏收起</span>
          <span class="switch-desc">默认展开侧边栏（顶部布局不支持）</span>
        </div>
        <a-switch v-model:checked="appStore.collapsed" :disabled="appStore.layoutMode === 'top'" />
      </div>

      <div class="setting-item switch-item">
        <div class="switch-label">
          <span>色弱模式</span>
          <span class="switch-desc">开启色弱模式</span>
        </div>
        <a-switch v-model:checked="appStore.colorWeak" />
      </div>

      <div class="setting-item switch-item">
        <div class="switch-label">
          <span>灰色模式</span>
          <span class="switch-desc">开启灰度模式</span>
        </div>
        <a-switch v-model:checked="appStore.grayMode" />
      </div>

      <!-- 其他设置 -->
      <a-divider orientation="left">
        <span class="divider-title">其他设置</span>
      </a-divider>

      <div class="setting-item">
        <div class="setting-title">语言设置</div>
        <a-select :value="appStore.locale" style="width: 100%" @change="handleLocaleChange">
          <a-select-option value="zh-CN">
            <span>简体中文</span>
          </a-select-option>
          <a-select-option value="en-US">
            <span>English</span>
          </a-select-option>
        </a-select>
      </div>

      <div class="setting-item">
        <div class="setting-title">字体大小</div>
        <a-slider
          v-model:value="appStore.fontSize"
          :marks="fontSizeMarks"
          :min="12"
          :max="20"
          :step="null"
          :tip-formatter="(value) => `${value}px`"
          style="margin: 20px"
        >
        </a-slider>
      </div>

      <div class="setting-item">
        <div class="setting-title">圆角大小</div>
        <a-slider
          v-model:value="appStore.borderRadius"
          :marks="borderRadiusMarks"
          :min="0"
          :max="10"
          :step="null"
          :tip-formatter="(value) => `${value}px`"
          style="margin: 20px"
        >
        </a-slider>
      </div>

      <div class="setting-item">
        <div class="setting-title">内容区域宽度</div>
        <a-segmented
          :value="appStore.contentWidthMode"
          :options="[
            { label: '流式', value: 'fluid' },
            { label: '定宽', value: 'fixed' }
          ]"
          block
          @change="handleContentWidthChange"
        />
        <a-slider
          v-if="appStore.contentWidthMode === 'fixed'"
          v-model:value="appStore.contentWidth"
          :marks="contentWidthMarks"
          :min="50"
          :max="100"
          :step="null"
          :tip-formatter="(value) => `${value}%`"
          style="margin: 20px"
        >
        </a-slider>
      </div>

      <!-- 操作按钮 -->
      <a-divider />

      <a-space direction="vertical" style="width: 100%">
        <a-button block @click="handleCopySettings">
          <template #icon>
            <copy-outlined />
          </template>
          拷贝设置
        </a-button>

        <a-button block danger @click="handleResetSettings">
          <template #icon>
            <redo-outlined />
          </template>
          重置设置
        </a-button>
      </a-space>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import type { ContentWidthMode, LayoutMode, ThemeMode } from "@/stores";
import { useAppStore } from "@/stores";
import { Modal, message } from "ant-design-vue";
import type { SegmentedValue } from "ant-design-vue/es/segmented/src/segmented";
import type { SelectValue } from "ant-design-vue/es/select";
import type { SliderMarks } from "ant-design-vue/es/slider";

interface LayoutModeItem {
  label: string;
  value: LayoutMode;
}

interface PresetColorItem {
  label: string;
  value: string;
}

const visible = defineModel<boolean>("visible", { required: true });

const { locale } = useI18n();
const appStore = useAppStore();

// 布局模式选项
const layoutModes: LayoutModeItem[] = [
  { label: "侧边布局", value: "side" },
  { label: "顶部布局", value: "top" },
  { label: "混合布局", value: "mix" }
];

// 预设颜色
const presetColors: PresetColorItem[] = [
  { label: "极客蓝", value: "#2f54eb" },
  { label: "薄暮", value: "#f5222d" },
  { label: "火山", value: "#fa541c" },
  { label: "日暮", value: "#faad14" },
  { label: "明青", value: "#13c2c2" },
  { label: "极光绿", value: "#52c41a" },
  { label: "拂晓蓝", value: "#1890ff" },
  { label: "酱紫", value: "#722ed1" }
];

const fontSizeMarks: SliderMarks = { 12: "12", 14: "14", 16: "16", 18: "18", 20: "20" };

const borderRadiusMarks: SliderMarks = { 0: "0", 2: "2", 4: "4", 6: "6", 8: "8", 10: "10" };

const contentWidthMarks: SliderMarks = { 50: "50", 60: "60", 70: "70", 80: "80", 90: "90", 100: "100" };

// 布局模式切换
const handleLayoutModeChange = (mode: LayoutMode) => {
  appStore.setLayoutMode(mode);
};

// 主题模式
const handleThemeModeChange = (value: SegmentedValue) => {
  appStore.setThemeMode(value.toString() as ThemeMode);
};

// 主题色
const handlePrimaryColorChange = (value: string) => {
  appStore.setPrimaryColor(value);
};

// 语言切换
const handleLocaleChange = (value: SelectValue) => {
  appStore.setLocale(value?.toString() || "zh-CN");
};

// 内容区域宽度
const handleContentWidthChange = (value: SegmentedValue) => {
  appStore.setContentWidthMode(value as ContentWidthMode);
};

// 重置设置
const handleResetSettings = () => {
  Modal.confirm({
    title: "提示",
    content: "确定要重置所有设置吗？",
    centered: true,
    onOk: () => {
      appStore.setLayoutMode("side");
      appStore.setThemeMode("light");
      appStore.setPrimaryColor("#2f54eb");
      appStore.setLocale("zh-CN");
      appStore.showTabs = true;
      appStore.showBreadcrumb = true;
      appStore.showCopyright = true;
      appStore.setFontSize(14);
      appStore.setBorderRadius(6);
      appStore.setContentWidth(100);
      appStore.setContentWidthMode("fluid");
      appStore.setColorWeak(false);
      appStore.setGrayMode(false);
      locale.value = "zh-CN";
      message.success("设置已重置");
    }
  });
};

// 拷贝设置
const handleCopySettings = () => {
  const settings = {
    layoutMode: appStore.layoutMode,
    themeMode: appStore.themeMode,
    transitionName: appStore.transitionName,
    primaryColor: appStore.primaryColor,
    locale: appStore.locale,
    collapsed: appStore.collapsed,
    showTabs: appStore.showTabs,
    showBreadcrumb: appStore.showBreadcrumb,
    showCopyright: appStore.showCopyright,
    fontSize: appStore.fontSize,
    borderRadius: appStore.borderRadius,
    contentWidth: appStore.contentWidth,
    contentWidthMode: appStore.contentWidthMode,
    colorWeak: appStore.colorWeak,
    grayMode: appStore.grayMode
  };

  navigator.clipboard
    .writeText(JSON.stringify(settings, null, 2))
    .then(() => {
      message.success("设置已复制到剪贴板");
    })
    .catch(() => {
      message.error("复制失败");
    });
};
</script>

<style lang="scss" scoped>
.settings-content {
  .divider-title {
    font-size: 14px;
    font-weight: 500;
  }

  .setting-item {
    margin-bottom: 24px;
    overflow: hidden;

    .setting-title {
      margin-bottom: 12px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
    }

    // 布局模式预览
    .layout-mode-wrapper {
      display: flex;
      gap: 16px;

      .layout-mode-item {
        position: relative;
        flex: 1;
        cursor: pointer;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        padding: 8px;
        transition: all 0.3s;

        &:hover {
          border-color: var(--primary-color);
        }

        &.active {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }

        .mode-preview {
          height: 60px;
          border-radius: 2px;
          overflow: hidden;
          background: #f0f2f5;

          .preview-content {
            display: flex;
            height: 100%;

            .preview-sider {
              width: 30%;
              background: #001529;
            }

            .preview-header {
              height: 20%;
              background: #fff;
              box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
            }

            .preview-main {
              flex: 1;
              display: flex;
              flex-direction: column;
            }

            .preview-body {
              flex: 1;
              background: #fff;
              margin: 4px;
              border-radius: 2px;
            }
          }

          &.top .preview-content {
            flex-direction: column;
          }

          &.mix .preview-content {
            flex-direction: column;

            .preview-main {
              flex-direction: row;
            }
          }
        }

        .mode-label {
          color: #313131;
          margin-top: 8px;
          text-align: center;
          font-size: 12px;
        }

        .mode-check {
          position: absolute;
          top: 4px;
          right: 4px;
          color: var(--primary-color);
          font-size: 16px;
        }
      }
    }

    // 颜色选择器
    .color-picker-wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 5px;

      .color-block {
        width: 44px;
        height: 44px;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #e8e8e8;

        &:hover {
          transform: scale(1.1);
        }

        &.active {
          box-shadow:
            0 0 0 2px #fff,
            0 0 0 4px currentColor;
        }

        &.custom {
          border: 1px dashed #d9d9d9;
          background: #fafafa;
          font-size: 20px;
          color: #999;

          &:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
          }
        }

        .check-icon {
          color: #fff;
          font-size: 20px;
          font-weight: bold;
        }
      }
    }

    // 开关项
    &.switch-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;

      .switch-label {
        display: flex;
        flex-direction: column;
        gap: 4px;
        color: #313131;

        .switch-desc {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.45);
        }
      }
    }
  }
}
</style>
