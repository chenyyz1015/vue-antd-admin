<template>
  <a-layout-sider
    v-model:collapsed="localCollapsed"
    :trigger="null"
    collapsible
    :width="220"
    class="layout-sider"
    :theme="theme"
    :collapsed-width="isMobile ? 0 : 80"
  >
    <Logo :title="title" :collapsed="localCollapsed" />
    <Menu :theme="theme" />
  </a-layout-sider>
</template>

<script setup lang="ts">
import Logo from "./Logo.vue";
import Menu from "./Menu.vue";

interface Props {
  collapsed: boolean;
  title: string;
  theme?: "light" | "dark";
  isMobile?: boolean;
}

interface Emits {
  (e: "update:collapsed", value: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  theme: "light",
  isMobile: false
});

const emit = defineEmits<Emits>();

const localCollapsed = computed({
  get: () => props.collapsed,
  set: (value) => emit("update:collapsed", value)
});
</script>

<style lang="scss">
html[data-theme="dark"] {
  .layout-sider {
    border: 0;
  }
}
</style>

<style lang="scss" scoped>
.layout-sider {
  border-right: 1px solid #eeeeee;
}
</style>
