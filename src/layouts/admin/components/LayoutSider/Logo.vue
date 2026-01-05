<template>
  <div class="layout-logo" :class="{ 'has-background': appStore.themeMode === 'light' && background }" @click="goHome">
    <svg-icon name="preserve-color/vite" :size="32" class="logo-icon" />
    <span v-if="!collapsible || !appStore.collapsed" class="logo-title">{{ appStore.title }}</span>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";

interface Props {
  collapsible?: boolean;
  background?: boolean;
}

withDefaults(defineProps<Props>(), {
  collapsible: true,
  background: true
});

const router = useRouter();
const appStore = useAppStore();

const goHome = () => {
  router.push({ path: "/" });
};
</script>

<style lang="scss" scoped>
.layout-logo {
  padding: 0 15px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  cursor: pointer;

  &.has-background {
    background: #f5f5f5;
  }

  .logo-icon {
    font-size: 20px;
  }

  .logo-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--primary-color);
    white-space: nowrap;
  }
}
</style>
