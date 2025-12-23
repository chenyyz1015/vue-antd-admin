<template>
  <div class="layout-logo" @click="goHome">
    <svg-icon name="preserve-color/logo" :size="32" class="logo-icon" />
    <span v-if="!collapsible || !appStore.collapsed" class="logo-title">{{ appStore.title }}</span>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";

interface Props {
  collapsible?: boolean;
}

withDefaults(defineProps<Props>(), {
  collapsible: true
});

const router = useRouter();
const appStore = useAppStore();

const goHome = () => {
  router.push({ path: "/" });
};
</script>

<style lang="scss" scoped>
.layout-logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  cursor: pointer;

  .logo-icon {
    font-size: 20px;
  }

  .logo-title {
    font-size: 18px;
    font-weight: 600;
    color: #1890ff;
    white-space: nowrap;
  }
}
</style>
