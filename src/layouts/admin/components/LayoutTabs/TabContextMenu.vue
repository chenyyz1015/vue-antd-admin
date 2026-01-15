<template>
  <a-dropdown v-model:open="visible" :trigger="['contextmenu']" placement="bottom">
    <div
      :style="{
        position: 'absolute',
        left: position.x + 'px',
        top: position.y + 'px',
        width: '1px',
        height: '1px',
        pointerEvents: 'none'
      }"
    />
    <template #overlay>
      <a-menu>
        <a-menu-item key="refresh" class="action-item" @click="handleRefresh">
          <reload-outlined />
          <span class="label">刷新此标签</span>
        </a-menu-item>
        <a-menu-item key="close-current" :disabled="!canClose" class="action-item" @click="handleCloseCurrent">
          <close-outlined />
          <span class="label">关闭此标签</span>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="close-left" :disabled="!canCloseLeft" class="action-item" @click="handleCloseLeft">
          <vertical-right-outlined />
          <span class="label">关闭左侧</span>
        </a-menu-item>
        <a-menu-item key="close-right" :disabled="!canCloseRight" class="action-item" @click="handleCloseRight">
          <vertical-left-outlined />
          <span class="label">关闭右侧</span>
        </a-menu-item>
        <a-menu-item key="close-other" :disabled="totalTabs === 1" class="action-item" @click="handleCloseOther">
          <column-width-outlined />
          <span class="label">关闭其他</span>
        </a-menu-item>
        <a-menu-item key="close-all" :disabled="totalTabs === 1" class="action-item" @click="handleCloseAll">
          <minus-outlined />
          <span class="label">关闭所有</span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import type { TabItem } from "@/stores/modules/tabs";

interface Props {
  position: { x: number; y: number };
  contextTab?: TabItem;
  tabs: TabItem[];
}

interface Emits {
  (e: "refresh", tab: TabItem): void;
  (e: "close-current", tab: TabItem): void;
  (e: "close-other", tab: TabItem): void;
  (e: "close-left", tab: TabItem): void;
  (e: "close-right", tab: TabItem): void;
  (e: "close-all"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const visible = defineModel<boolean>("visible", { required: true });

// 总标签数
const totalTabs = computed(() => props.tabs.length);

// 当前tab在列表中的索引
const currentIndex = computed(() => {
  if (!props.contextTab) return -1;
  return props.tabs.findIndex((tab) => tab.path === props.contextTab?.path);
});

// 是否可以关闭当前标签
const canClose = computed(() => {
  if (!props.contextTab || props.tabs.length === 1) return false;
  return props.contextTab.closable !== false;
});

// 是否可以关闭左侧
const canCloseLeft = computed(() => {
  if (!props.contextTab || props.tabs.length === 1) return false;
  return currentIndex.value > 0;
});

// 是否可以关闭右侧
const canCloseRight = computed(() => {
  if (!props.contextTab || props.tabs.length === 1) return false;
  return currentIndex.value !== -1 && currentIndex.value < props.tabs.length - 1;
});

// 菜单操作处理
const handleRefresh = () => {
  if (props.contextTab) {
    emit("refresh", props.contextTab);
  }
  visible.value = false;
};

const handleCloseCurrent = () => {
  if (props.contextTab) {
    emit("close-current", props.contextTab);
  }
  visible.value = false;
};

const handleCloseOther = () => {
  if (props.contextTab) {
    emit("close-other", props.contextTab);
  }
  visible.value = false;
};

const handleCloseLeft = () => {
  if (props.contextTab) {
    emit("close-left", props.contextTab);
  }
  visible.value = false;
};

const handleCloseRight = () => {
  if (props.contextTab) {
    emit("close-right", props.contextTab);
  }
  visible.value = false;
};

const handleCloseAll = () => {
  emit("close-all");
  visible.value = false;
};
</script>

<style lang="scss" scoped>
:deep(.action-item) {
  .ant-dropdown-menu-title-content {
    display: flex;
    align-items: center;
    gap: 10px;

    .label {
      flex-shrink: 0;
    }
  }
}
</style>
