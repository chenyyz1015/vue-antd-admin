<template>
  <a-layout-footer class="layout-footer">
    <div class="btn-copyright" @click="handleCopyrightClick">Copyright© {{ copyright }} 版权所有 {{ icp }}</div>
  </a-layout-footer>
</template>

<script setup lang="ts">
const copyright = import.meta.env.VITE_APP_COPYRIGHT;
const icp = import.meta.env.VITE_APP_ICP;

const handleCopyrightClick = () => {
  window.open("https://beian.miit.gov.cn");
};
</script>

<style lang="scss" scoped>
.layout-footer {
  display: flex;
  align-items: center;
  justify-content: center;

  .btn-copyright {
    cursor: pointer;
  }
}
</style>
