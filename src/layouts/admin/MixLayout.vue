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
            :items="topMenuItems"
            mode="horizontal"
            :theme="appStore.themeMode === 'dark' ? 'dark' : 'light'"
            @click="handleTopMenuClick"
          >
          </a-menu>
        </div>
      </div>

      <div class="header-right">
        <HeaderActions
          :is-fullscreen="isFullscreen"
          @toggle-fullscreen="$emit('toggle-fullscreen')"
          @open-settings="$emit('open-settings')"
        />
        <UserDropdown />
      </div>
    </a-layout-header>

    <a-layout>
      <!-- 侧边栏（二级菜单） -->
      <a-layout-sider
        v-if="sideMenuItems.length > 0"
        v-model:collapsed="appStore.collapsed"
        collapsible
        :width="220"
        :theme="appStore.themeMode"
      >
        <a-menu
          v-model:selected-keys="selectedKeys"
          v-model:open-keys="openKeys"
          :items="sideMenuItems"
          mode="inline"
          :theme="appStore.themeMode"
          @click="handleSideMenuClick"
        />
        <template #trigger>
          <!-- 收起/展开 -->
          <menu-unfold-outlined v-if="appStore.collapsed" class="trigger" @click.stop="appStore.toggleCollapsed" />
          <menu-fold-outlined v-else class="trigger" @click.stop="appStore.toggleCollapsed" />
        </template>
      </a-layout-sider>

      <a-layout>
        <!-- 标签页 -->
        <LayoutTabs />

        <!-- 内容区 -->
        <LayoutContent :cached-views="cachedViews" />

        <!-- 底部 -->
        <LayoutFooter v-if="appStore.showCopyright" />
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
    .sort((a, b) => (a.meta?.sort || 1) - (b.meta?.sort || 1))
    .map((route) => {
      return {
        key: route.path,
        label: route.meta?.title,
        title: route.meta?.title,
        icon: route.meta?.icon ? h(SvgIcon, { name: route.meta.icon, style: { fontSize: "18px" } }) : undefined
      };
    });
});

// 生成侧边菜单（二级菜单）
const sideMenuItems = computed<ItemType[]>(() => {
  if (topMenuKeys.value.length === 0) return [];

  const currentTopRoute = permissionStore.addRoutes.find((route) => route.path === topMenuKeys.value[0]);

  if (!currentTopRoute?.children) return [];

  const generateMenuItems = (routes: RouteRecordRaw[]): ItemType[] => {
    return routes
      .filter((route) => route.meta?.title && route.meta?.hidden !== true)
      .sort((a, b) => (a.meta?.sort || 1) - (b.meta?.sort || 1))
      .map((route) => {
        const item: ItemType = {
          key: route.path,
          label: route.meta?.title,
          title: route.meta?.title,
          icon: route.meta?.icon ? h(SvgIcon, { name: route.meta.icon, style: { fontSize: "18px" } }) : undefined
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
    gap: 15px;
    border-bottom: 1px solid #eeeeee;

    .header-left {
      flex: 1 1 auto;
      width: 0;
      height: auto;
      display: flex;
      align-items: center;

      .header-menu {
        flex: 1 1 auto;
        width: 0;
        height: auto;
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 15px;
    }
  }

  .trigger {
    font-size: 18px;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: var(--primary-color);
    }
  }
}
</style>
