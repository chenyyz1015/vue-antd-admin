<template>
  <div class="layout-logo">
    <svg-icon name="vite" :size="32" />
    <span v-if="!collapsed" class="logo-title">{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  collapsed: boolean;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.layout-logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;

  .logo-title {
    margin-left: 12px;
    font-size: 18px;
    font-weight: 600;
    color: #1890ff;
    white-space: nowrap;
  }
}
</style>
