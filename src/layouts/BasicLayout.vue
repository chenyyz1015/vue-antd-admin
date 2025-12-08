<template>
  <a-layout class="basic-layout">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible :width="220">
      <div class="logo">
        <h1>{{ collapsed ? "VA" : "Vue Antd Admin" }}</h1>
      </div>
      <layout-menu />
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="layout-header">
        <menu-unfold-outlined v-if="collapsed" class="trigger" @click="toggleCollapsed" />
        <menu-fold-outlined v-else class="trigger" @click="toggleCollapsed" />
        <div class="header-right">
          <a-dropdown>
            <div class="user-info">
              <a-avatar :src="userStore.userInfo.avatar" />
              <span>{{ userStore.userInfo.nickname }}</span>
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="handleLogout">
                  <logout-outlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <a-layout-content class="layout-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined } from "@ant-design/icons-vue";
import { useAppStore } from "@/stores/modules/app";
import { useUserStore } from "@/stores/modules/user";
import LayoutMenu from "./components/Sidebar.vue";

const appStore = useAppStore();
const userStore = useUserStore();

const collapsed = computed({
  get: () => appStore.collapsed,
  set: (val) => appStore.toggleCollapsed()
});

const toggleCollapsed = () => {
  appStore.toggleCollapsed();
};

const handleLogout = () => {
  userStore.logout();
};
</script>

<style scoped lang="scss">
.basic-layout {
  min-height: 100vh;

  .logo {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
  }

  .layout-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    padding: 0 24px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .trigger {
      font-size: 18px;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .header-right {
      .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }
    }
  }

  .layout-content {
    margin: 16px;
    padding: 24px;
    background: #f0f2f5;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
