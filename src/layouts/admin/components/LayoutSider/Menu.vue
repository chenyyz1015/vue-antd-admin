<template>
  <a-menu
    v-bind="$attrs"
    v-model:selected-keys="selectedKeys"
    v-model:open-keys="openKeys"
    :items="menuItems"
    :theme="appStore.themeMode"
    @click="handleMenuClick"
  />
</template>

<script setup lang="ts">
import { useAppStore, usePermissionStore } from "@/stores";
import type { ItemType } from "ant-design-vue";
import type { MenuInfo, SubMenuType } from "ant-design-vue/es/menu/src/interface";
import type { RouteRecordRaw } from "vue-router";
import SvgIcon from "~virtual/svg-component";

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const permissionStore = usePermissionStore();

const selectedKeys = ref<string[]>([]);
const openKeys = ref<string[]>([]);

/**
 * 生成菜单项
 * 只显示 meta.hidden 不为 true 的路由
 */
const generateMenuItems = (routes: RouteRecordRaw[]): ItemType[] => {
  return routes
    .filter((route) => {
      return route.meta?.title && route.meta?.hidden !== true;
    })
    .sort((a, b) => (a.meta?.sort || 1) - (b.meta?.sort || 1))
    .map((route) => {
      const item: ItemType = {
        key: route.path,
        label: route.meta?.title,
        title: route.meta?.title,
        icon: route.meta?.icon ? h(SvgIcon, { name: route.meta.icon, style: { fontSize: "18px" } }) : undefined
      };

      // 递归处理子路由
      if (route.children && route.children.length > 0) {
        const children = generateMenuItems(route.children);
        if (children.length > 0) {
          (item as SubMenuType).children = children;
        }
      }

      return item;
    });
};

// 菜单项
const menuItems = computed<ItemType[]>(() => {
  return generateMenuItems(permissionStore.addRoutes);
});

// 监听路由变化，更新选中和展开的菜单
watch(
  () => route.path,
  (path) => {
    selectedKeys.value = [path];
    if (appStore.collapsed || appStore.layoutMode === "top") {
      openKeys.value = [];
    } else {
      // 自动展开父级菜单
      const matched = route.matched;
      openKeys.value = matched.slice(0, -1).map((item) => item.path);
    }
  },
  { immediate: true }
);

// 菜单点击
const handleMenuClick = ({ key }: MenuInfo) => {
  router.push({ path: key.toString() });
};
</script>

<style lang="scss" scoped>
.ant-menu {
  border: 0;
  border-inline-end: 0 !important;
}
</style>
