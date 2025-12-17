<template>
  <component :is="layoutComponent" />
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/modules/app";
import { computed } from "vue";
import MixLayout from "./MixLayout.vue";
import SideLayout from "./SideLayout.vue";
import TopLayout from "./TopLayout.vue";

const appStore = useAppStore();

const layoutComponent = computed(() => {
  const layoutMap = {
    side: SideLayout,
    top: TopLayout,
    mix: MixLayout
  };
  return layoutMap[appStore.layoutMode] || SideLayout;
});
</script>
