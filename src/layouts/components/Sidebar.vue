<template>
  <a-menu
    v-model:selected-keys="selectedKeys"
    v-model:open-keys="openKeys"
    mode="inline"
    theme="dark"
    :items="menuItems"
    @click="handleMenuClick"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { usePermissionStore } from "@/stores/modules/permission";
import type { MenuProps } from "ant-design-vue";

const router = useRouter();
const route = useRoute();
const permissionStore = usePermissionStore();

const selectedKeys = ref<string[]>([]);
const openKeys = ref<string[]>([]);

const menuItems = computed(() => {
  return generateMenus(permissionStore.routes);
});

function generateMenus(routes: any[]): MenuProps["items"] {
  return routes
    .filter((route) => !route.meta?.hidden)
    .map((route) => {
      const menu: any = {
        key: route.path,
        label: route.meta?.title,
        icon: route.meta?.icon
      };

      if (route.children && route.children.length > 0) {
        menu.children = generateMenus(route.children);
      }

      return menu;
    });
}

const handleMenuClick = (e: any) => {
  router.push(e.key);
};

watch(
  () => route.path,
  (path) => {
    selectedKeys.value = [path];
  },
  { immediate: true }
);
</script>
