<template>
  <a-dropdown>
    <div class="user-info">
      <a-avatar :src="userInfo.avatar || DefaultAvatar" :size="32">
        {{ userInfo.nickname?.charAt(0) }}
      </a-avatar>
      <span class="user-name">{{ userInfo.nickname }}</span>
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item key="profile" class="action-item" @click="goAccountProfile">
          <user-outlined />
          <span>个人中心</span>
        </a-menu-item>
        <a-menu-item key="settings" class="action-item" @click="goAccountSetting">
          <setting-outlined />
          <span>个人设置</span>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="logout" class="action-item" @click="handleLogout">
          <logout-outlined />
          <span>退出登录</span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import DefaultAvatar from "@/assets/images/avatar.svg";
import { useUserStore } from "@/stores";
import { Modal } from "ant-design-vue";

const router = useRouter();
const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo);

const goAccountProfile = () => {};

const goAccountSetting = () => {};

const handleLogout = () => {
  Modal.confirm({
    title: "提示",
    content: "确定要退出登录吗？",
    centered: true,
    onOk: async () => {
      await userStore.logout();
      router.push("/auth/login");
    }
  });
};
</script>

<style lang="scss" scoped>
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }

  .user-name {
    font-size: 14px;
  }
}

:deep(.action-item) {
  .ant-dropdown-menu-title-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

:deep([data-theme="dark"]) {
  .user-info:hover {
    background: rgba(255, 255, 255, 0.08);
  }
}
</style>
