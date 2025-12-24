<template>
  <a-layout-content class="layout-content" :class="{ 'has-footer': appStore.showFooter }">
    <div class="content-wrapper">
      <router-view v-slot="{ Component, route }">
        <transition :name="appStore.transitionName" mode="out-in">
          <keep-alive :include="cachedViews">
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </a-layout-content>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";

interface Props {
  cachedViews?: string[];
}

withDefaults(defineProps<Props>(), {
  cachedViews: () => []
});

const appStore = useAppStore();
</script>

<style lang="scss" scoped>
.layout-content {
  padding: 20px;

  &.has-footer {
    padding: 20px 20px 0;
  }

  .content-wrapper {
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #ffffff;
    border-radius: 5px;
  }
}
</style>
