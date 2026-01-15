<template>
  <div v-if="loading" class="com-spin">
    <a-spin size="large" :tip="tip"> </a-spin>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading: boolean;
  tip?: string;
}

withDefaults(defineProps<Props>(), {
  tip: "正在加载..."
});
</script>

<style lang="scss" scoped>
.com-spin {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  :deep(.ant-spin) {
    .ant-spin-text {
      margin-top: 8px;
      font-size: var(--font-size-larger);
    }
  }
}
</style>
