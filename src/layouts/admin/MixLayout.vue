<template>
  <a-layout class="mix-layout">
    <!-- 顶部栏 -->
    <a-layout-header class="layout-header">
      <div class="header-left">
        <!-- Logo -->
        <Logo :collapsible="false" style="width: 220px" />

        <!-- 一级菜单 -->
        <div class="header-menu">
          <a-menu
            v-model:selected-keys="topMenuKeys"
            mode="horizontal"
            :theme="appStore.themeMode === 'dark' ? 'dark' : 'light'"
            @click="handleTopMenuClick"
          >
            <a-menu-item v-for="item in topMenuItems" :key="item.key">
              <svg-icon v-if="item.icon" :name="item.icon" :size="18" style="margin-right: 8px" />
              {{ item.label }}
            </a-menu-item>
          </a-menu>
        </div>
      </div>

      <div class="header-right">
        <HeaderActions
          :is-fullscreen="isFullscreen"
          :is-mobile="isMobile"
          @toggle-fullscreen="$emit('toggle-fullscreen')"
          @open-settings="$emit('open-settings')"
        />
        <UserDropdown :is-mobile="isMobile" />
      </div>
    </a-layout-header>

    <a-layout>
      <!-- 侧边栏（二级菜单） -->
      <a-layout-sider
        v-if="sideMenuItems.length > 0"
        v-model:collapsed="appStore.collapsed"
        :trigger="null"
        collapsible
        :width="220"
        :theme="appStore.themeMode"
        :collapsed-width="isMobile ? 0 : 80"
      >
        <a-menu
          v-model:selected-keys="selectedKeys"
          v-model:open-keys="openKeys"
          mode="inline"
          :theme="appStore.themeMode"
          :items="sideMenuItems"
          @click="handleSideMenuClick"
        />
      </a-layout-sider>

      <a-layout>
        <!-- 标签页 -->
        <LayoutTabs :is-mobile="isMobile" />

        <!-- 内容区 -->
        <LayoutContent :cached-views="cachedViews" />

        <!-- 底部 -->
        <LayoutFooter v-if="appStore.showFooter" />
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { useAppStore, usePermissionStore } from "@/stores";
import type { ItemType } from "ant-design-vue";
import type { MenuInfo, SubMenuType } from "ant-design-vue/es/menu/src/interface";
import type { RouteRecordRaw } from "vue-router";
import SvgIcon from "~virtual/svg-component";

interface Props {
  isFullscreen: boolean;
  isMobile: boolean;
  cachedViews: string[];
}

interface Emits {
  (e: "toggle-fullscreen"): void;
  (e: "open-settings"): void;
}

defineProps<Props>();
defineEmits<Emits>();

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const permissionStore = usePermissionStore();

const topMenuKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);
const openKeys = ref<string[]>([]);

// 生成顶部菜单（一级菜单）
const topMenuItems = computed(() => {
  return permissionStore.addRoutes
    .filter((route) => route.meta?.title && route.meta?.hidden !== true)
    .map((route) => ({
      key: route.path,
      label: route.meta?.title,
      icon: route.meta?.icon
    }));
});

// 生成侧边菜单（二级菜单）
const sideMenuItems = computed<ItemType[]>(() => {
  if (topMenuKeys.value.length === 0) return [];

  const currentTopRoute = permissionStore.addRoutes.find((route) => route.path === topMenuKeys.value[0]);

  if (!currentTopRoute?.children) return [];

  const generateMenuItems = (routes: RouteRecordRaw[]): ItemType[] => {
    return routes
      .filter((route) => route.meta?.title && route.meta?.hidden !== true)
      .map((route) => {
        const item: ItemType = {
          key: route.path,
          label: route.meta?.title,
          title: route.meta?.title,
          icon: route.meta?.icon ? h(SvgIcon, { name: route.meta.icon, size: 18 }) : undefined
        };

        if (route.children && route.children.length > 0) {
          const children = generateMenuItems(route.children);
          if (children.length > 0) {
            (item as SubMenuType).children = children;
          }
        }

        return item;
      });
  };

  return generateMenuItems(currentTopRoute.children);
});

// 监听路由变化
watch(
  () => route.path,
  (path) => {
    // 找到顶级路由
    const topRoute = permissionStore.addRoutes.find((r) => path.startsWith(r.path));
    if (topRoute) {
      topMenuKeys.value = [topRoute.path];
    }

    // 设置选中的侧边菜单
    selectedKeys.value = [path];

    // 自动展开父级菜单
    const matched = route.matched;
    openKeys.value = matched.slice(1, -1).map((item) => item.path);
  },
  { immediate: true }
);

// 顶部菜单点击
const handleTopMenuClick = ({ key }: MenuInfo) => {
  const topRoute = permissionStore.addRoutes.find((r) => r.path === key);
  if (topRoute?.children && topRoute.children.length > 0) {
    // 如果有子路由，跳转到第一个子路由
    const firstChild = topRoute.children.find((child) => child.meta?.hidden !== true);
    if (firstChild) {
      router.push(firstChild.path);
    }
  } else {
    router.push({ path: key.toString() });
  }
};

// 侧边菜单点击
const handleSideMenuClick = ({ key }: MenuInfo) => {
  router.push({ path: key.toString() });
};
</script>

<style lang="scss">
html[data-theme="dark"] {
  .mix-layout {
    .layout-header {
      border: 0;
    }
  }
}
</style>

<style lang="scss" scoped>
.mix-layout {
  width: 100%;
  height: 100%;

  .layout-header {
    padding: 0 20px 0 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eeeeee;

    .header-left {
      flex: 1 1 auto;
      width: 0;
      height: auto;
      display: flex;
      align-items: center;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 15px;
    }
  }
}
</style>
