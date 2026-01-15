<template>
  <div class="auth-layout">
    <div class="layout-header">
      <img src="/vite.svg" alt="logo" class="logo" />
      <span class="title">{{ fullTitle }}</span>
    </div>
    <div class="layout-body">
      <router-view />
    </div>
    <div class="layout-footer" @click="handleCopyrightClick">Copyright© {{ copyright }} 版权所有 {{ icp }}</div>
  </div>
</template>

<script setup lang="ts">
const fullTitle = import.meta.env.VITE_APP_FULL_TITLE;
const copyright = import.meta.env.VITE_APP_COPYRIGHT;
const icp = import.meta.env.VITE_APP_ICP;

const handleCopyrightClick = () => {
  window.open("https://beian.miit.gov.cn");
};
</script>

<style lang="scss" scoped>
.auth-layout {
  width: 100%;
  height: 100%;
  background: url("@/assets/images/bg-login.svg") no-repeat center / cover;
  display: flex;
  flex-direction: column;

  .layout-header {
    width: 100%;
    height: 80px;
    padding: 0 30px;
    background: #ffffff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 15px;

    .logo {
      width: 50px;
      height: 50px;
      object-fit: contain;
    }

    .title {
      font-weight: bold;
      font-size: 24px;
      color: #2872f5;
    }
  }

  .layout-body {
    flex: 1 1 auto;
    width: 100%;
    height: 0;
  }

  .layout-footer {
    width: 100%;
    height: 76px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size);
    color: #474747;
    cursor: pointer;
  }
}
</style>
