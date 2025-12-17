<template>
  <a-layout class="top-layout">
    <a-layout-header class="layout-header">
      <div class="header-left">
        <div class="logo">
          <img src="/vite.svg" alt="logo" />
          <h1>{{ appStore.title }}</h1>
        </div>
        <layout-menu mode="horizontal" />
      </div>
      <layout-header-right />
    </a-layout-header>

    <a-layout-content class="layout-content">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/modules/app";
import LayoutHeaderRight from "./components/LayoutHeaderRight.vue";
import LayoutMenu from "./components/LayoutMenu.vue";

const appStore = useAppStore();
</script>

<style scoped lang="scss">
.top-layout {
  min-height: 100vh;

  .layout-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    padding: 0 24px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    position: sticky;
    top: 0;
    z-index: 99;

    .header-left {
      display: flex;
      align-items: center;
      gap: 24px;
      flex: 1;

      .logo {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: bold;

        img {
          width: 32px;
          height: 32px;
        }
      }
    }
  }

  .layout-content {
    margin: 16px;
    padding: 24px;
    background: #f0f2f5;
    min-height: calc(100vh - 96px);
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
