<template>
  <a-layout class="side-layout">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible :width="220" class="layout-sider">
      <div class="logo">
        <img v-if="!collapsed" src="/vite.svg" alt="logo" />
        <h1>{{ collapsed ? "VA" : appStore.title }}</h1>
      </div>
      <layout-menu />
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="layout-header">
        <div class="header-left">
          <menu-unfold-outlined v-if="collapsed" class="trigger" @click="toggleCollapsed" />
          <menu-fold-outlined v-else class="trigger" @click="toggleCollapsed" />
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
  </a-layout>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/modules/app";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue";
import LayoutHeaderRight from "./components/LayoutHeaderRight.vue";
import LayoutMenu from "./components/LayoutMenu.vue";

const appStore = useAppStore();

const collapsed = computed({
  get: () => appStore.collapsed,
  set: () => appStore.toggleCollapsed()
});

const toggleCollapsed = () => {
  appStore.toggleCollapsed();
};
</script>

<style scoped lang="scss">
.side-layout {
  min-height: 100vh;

  .layout-sider {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  }

  .logo {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #fff;
    font-size: 18px;
    font-weight: bold;

    img {
      width: 32px;
      height: 32px;
    }
  }

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
      .trigger {
        font-size: 18px;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #1890ff;
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
  transform: translateX(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
