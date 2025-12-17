<template>
  <a-menu
    v-model:selected-keys="selectedKeys"
    v-model:open-keys="openKeys"
    :mode="mode"
    :theme="menuTheme"
    :items="menuItems"
    @click="handleMenuClick"
  />
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/modules/app";
import { usePermissionStore } from "@/stores/modules/permission";
import * as Icons from "@ant-design/icons-vue";
import type { MenuProps } from "ant-design-vue";
import { computed, h, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

interface Props {
  mode?: "vertical" | "horizontal" | "inline";
  items?: any[];
  showChildren?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  mode: "inline",
  showChildren: true
});

const router = useRouter();
const route = useRoute();
const permissionStore = usePermissionStore();
const appStore = useAppStore();

const selectedKeys = ref<string[]>([]);
const openKeys = ref<string[]>([]);

const menuTheme = computed(() => {
  if (appStore.layoutMode === "mix" && props.mode === "horizontal") {
    return "dark";
  }
  return appStore.layoutMode === "side" ? "dark" : "light";
});

const menuItems = computed(() => {
  const routes = props.items || permissionStore.routes;
  return generateMenus(routes);
});

function generateMenus(routes: any[]): MenuProps["items"] {
  return routes
    .filter((route) => !route.meta?.hidden)
    .map((route) => {
      const icon = route.meta?.icon;
      const IconComponent = icon ? (Icons as any)[icon] : null;

      const menu: any = {
        key: route.path,
        label: route.meta?.title,
        icon: IconComponent ? () => h(IconComponent) : undefined
      };

      if (props.showChildren && route.children && route.children.length > 0) {
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
    // 自动展开父级菜单
    const pathArr = path.split("/").filter(Boolean);
    if (pathArr.length > 1) {
      openKeys.value = ["/" + pathArr[0]];
    }
  },
  { immediate: true }
);
</script>
