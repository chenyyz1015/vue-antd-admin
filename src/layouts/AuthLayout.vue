<template>
  <div class="auth-layout">
    <router-view />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.auth-layout {
  width: 100%;
  height: 100%;
  background: #f0f2f5 url("@/assets/images/bg-login.svg") no-repeat 50%;
  background-size: 100%;
}
</style>
