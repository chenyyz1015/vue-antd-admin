<template>
  <a-layout class="mix-layout">
    <a-layout-header class="layout-header">
      <div class="header-left">
        <div class="logo">
          <img src="/vite.svg" alt="logo" />
          <h1>{{ appStore.title }}</h1>
        </div>
        <layout-menu mode="horizontal" :show-children="false" />
      </div>
      <layout-header-right />
    </a-layout-header>

    <a-layout>
      <a-layout-sider v-if="currentMenu?.children?.length" :width="200" class="layout-sider">
        <layout-menu :items="currentMenu.children" />
      </a-layout-sider>

      <a-layout-content class="layout-content">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/modules/app";
import { usePermissionStore } from "@/stores/modules/permission";
import { computed } from "vue";
import { useRoute } from "vue-router";
import LayoutHeaderRight from "./components/LayoutHeaderRight.vue";
import LayoutMenu from "./components/LayoutMenu.vue";

const appStore = useAppStore();
const route = useRoute();
const permissionStore = usePermissionStore();

const currentMenu = computed(() => {
  const path = "/" + route.path.split("/")[1];
  return permissionStore.routes.find((r) => r.path === path);
});
</script>

<style scoped lang="scss">
.mix-layout {
  min-height: 100vh;

  .layout-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #001529;
    color: #fff;
    padding: 0 24px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    position: sticky;
    top: 0;
    z-index: 100;

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
        color: #fff;

        img {
          width: 32px;
          height: 32px;
        }
      }
    }
  }

  .layout-sider {
    background: #fff;
    margin: 16px 0 16px 16px;
    padding: 16px 0;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
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
  transform: translateX(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
