<template>
  <a-breadcrumb class="layout-breadcrumb">
    <a-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
      <router-link v-if="item.path" :to="item.path">
        {{ item.meta?.title }}
      </router-link>
      <span v-else>{{ item.meta?.title }}</span>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script setup lang="ts">
const route = useRoute();

const breadcrumbs = computed(() => {
  const matched = route.matched.filter((item) => item.meta?.title);
  return matched;
});
</script>

<style lang="scss">
html[data-theme="dark"] {
  .layout-breadcrumb {
    .ant-breadcrumb-link a,
    .ant-breadcrumb-separator {
      color: #ffffff;
    }
  }
}
</style>

<style lang="scss" scoped>
.layout-breadcrumb {
  margin-left: 15px;
}
</style>
