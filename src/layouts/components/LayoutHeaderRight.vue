<template>
  <div class="header-right">
    <a-space :size="16">
      <!-- 全屏 -->
      <a-tooltip :title="isFullscreen ? '退出全屏' : '全屏'">
        <fullscreen-outlined v-if="!isFullscreen" class="header-icon" @click="toggleFullscreen" />
        <fullscreen-exit-outlined v-else class="header-icon" @click="toggleFullscreen" />
      </a-tooltip>

      <!-- 设置 -->
      <a-tooltip title="设置">
        <setting-outlined class="header-icon" @click="showSettings = true" />
      </a-tooltip>

      <!-- 用户信息 -->
      <a-dropdown>
        <div class="user-info">
          <a-avatar :src="userStore.userInfo.avatar" />
          <span>{{ userStore.userInfo.nickname }}</span>
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item key="profile">
              <user-outlined />
              <span>个人中心</span>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="logout" @click="handleLogout">
              <logout-outlined />
              <span>退出登录</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </a-space>

    <!-- 设置抽屉 -->
    <settings-drawer v-model:visible="showSettings" />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/modules/user";
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons-vue";
import { useFullscreen } from "@vueuse/core";
import { ref } from "vue";
import SettingsDrawer from "./SettingsDrawer.vue";

const userStore = useUserStore();
const showSettings = ref(false);

const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();

const handleLogout = () => {
  userStore.logout();
};
</script>

<style scoped lang="scss">
.header-right {
  .header-icon {
    font-size: 18px;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: #1890ff;
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 0.3s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
}
</style>
