<template>
  <a-dropdown :trigger="['click']">
    <span class="tabs-action">
      <down-outlined />
    </span>
    <template #overlay>
      <a-menu>
        <a-menu-item key="refresh" class="action-item" @click="$emit('refresh')">
          <reload-outlined />
          <span>刷新当前</span>
        </a-menu-item>
        <a-menu-item key="close-current" :disabled="disabled" class="action-item" @click="$emit('close-current')">
          <close-outlined />
          <span>关闭当前</span>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="close-left" :disabled="disabled" class="action-item" @click="$emit('close-left')">
          <vertical-right-outlined />
          <span>关闭左侧</span>
        </a-menu-item>
        <a-menu-item key="close-right" :disabled="disabled" class="action-item" @click="$emit('close-right')">
          <vertical-left-outlined />
          <span>关闭右侧</span>
        </a-menu-item>
        <a-menu-item key="close-other" :disabled="disabled" class="action-item" @click="$emit('close-other')">
          <column-width-outlined />
          <span>关闭其他</span>
        </a-menu-item>
        <a-menu-item key="close-all" :disabled="disabled" class="action-item" @click="$emit('close-all')">
          <minus-outlined />
          <span>关闭所有</span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
interface Props {
  disabled?: boolean;
}

interface Emits {
  (e: "refresh"): void;
  (e: "close-current"): void;
  (e: "close-other"): void;
  (e: "close-left"): void;
  (e: "close-right"): void;
  (e: "close-all"): void;
}

withDefaults(defineProps<Props>(), {
  disabled: false
});

defineEmits<Emits>();
</script>

<style lang="scss" scoped>
.tabs-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-left: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}

:deep(.action-item) {
  .ant-dropdown-menu-title-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

:deep([data-theme="dark"]) {
  .tabs-action:hover {
    background: rgba(255, 255, 255, 0.08);
  }
}
</style>
