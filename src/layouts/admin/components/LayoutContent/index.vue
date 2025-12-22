<template>
  <a-layout-content class="layout-content">
    <div class="content-wrapper">
      <router-view v-slot="{ Component, route }">
        <transition name="fade-slide" mode="out-in">
          <keep-alive :include="cachedViews">
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </a-layout-content>
</template>

<script setup lang="ts">
interface Props {
  cachedViews?: string[];
}

withDefaults(defineProps<Props>(), {
  cachedViews: () => []
});
</script>

<style lang="scss" scoped>
.layout-content {
  padding: 20px;

  .content-wrapper {
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #ffffff;
    border-radius: 5px;
  }
}

:deep([data-theme="dark"]) {
  .layout-content .content-wrapper {
    background: #141414;
  }
}
</style>
