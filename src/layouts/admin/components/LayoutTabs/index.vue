<template>
  <div v-if="appStore.showTabs" class="layout-tabs">
    <a-tabs
      :active-key="tabsStore.activeTab"
      type="editable-card"
      hide-add
      @edit="handleTabEdit"
      @change="handleTabChange"
    >
      <a-tab-pane
        v-for="tab in tabsStore.tabs"
        :key="tab.path"
        :closable="tab.closable !== false && tabsStore.tabs.length > 1"
      >
        <template #tab>
          <div class="tab-content" @contextmenu.prevent="handleContextMenu($event, tab)">
            <svg-icon v-if="tab.icon" :name="tab.icon" :size="18" style="font-size: var(--font-size-larger)" />
            <span>{{ t(tab.title) }}</span>
          </div>
        </template>
      </a-tab-pane>
    </a-tabs>

    <!-- 顶部操作按钮下拉菜单 -->
    <TabsDropdown
      :disabled="tabsStore.tabs.length === 1"
      @refresh="handleRefresh"
      @close-current="handleCloseCurrent"
      @close-other="handleCloseOther"
      @close-left="handleCloseLeft"
      @close-right="handleCloseRight"
      @close-all="handleCloseAll"
    />

    <!-- 右键菜单 -->
    <TabContextMenu
      v-model:visible="contextMenuVisible"
      :position="contextMenuPosition"
      :context-tab="contextTab"
      :tabs="tabsStore.tabs"
      @refresh="handleContextRefresh"
      @close-current="handleContextCloseCurrent"
      @close-other="handleContextCloseOther"
      @close-left="handleContextCloseLeft"
      @close-right="handleContextCloseRight"
      @close-all="handleContextCloseAll"
    />
  </div>
</template>

<script setup lang="ts">
import { useAppStore, useTabsStore } from "@/stores";
import type { TabItem } from "@/stores/modules/tabs";
import type { Key } from "ant-design-vue/es/_util/type";
import TabContextMenu from "./TabContextMenu.vue";
import TabsDropdown from "./TabsDropdown.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const tabsStore = useTabsStore();

// 监听路由变化，自动添加标签
watch(
  () => route.path,
  () => {
    tabsStore.addTab(route);
  },
  { immediate: true }
);

// 标签页切换
const handleTabChange = (targetKey: Key) => {
  router.push({ path: targetKey.toString() });
};

// 标签页编辑（关闭）
const handleTabEdit = (targetKey: Key | MouseEvent | KeyboardEvent, action: string) => {
  if (action === "remove" && typeof targetKey === "string") {
    const nextTab = tabsStore.removeTab(targetKey);
    if (nextTab) {
      router.push(nextTab.path);
    }
  }
};

// 刷新当前页
const handleRefresh = () => {
  router.go(0);
};

// 关闭当前标签
const handleCloseCurrent = () => {
  const nextTab = tabsStore.closeCurrent();
  if (nextTab) {
    router.push(nextTab.path);
  }
};

// 关闭其他标签
const handleCloseOther = () => {
  tabsStore.closeOther();
};

// 关闭左侧标签
const handleCloseLeft = () => {
  tabsStore.closeLeft();
};

// 关闭右侧标签
const handleCloseRight = () => {
  tabsStore.closeRight();
};

// 关闭所有标签
const handleCloseAll = () => {
  const firstTab = tabsStore.closeAll();
  if (firstTab) {
    router.push(firstTab.path);
  }
};

// 右键菜单相关状态
const contextMenuVisible = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const contextTab = ref<TabItem>();
// 处理右键菜单
const handleContextMenu = (event: MouseEvent, tab: TabItem) => {
  contextTab.value = tab;

  // 获取当前标签元素和容器
  const tabElement = (event.target as HTMLElement).closest(".ant-tabs-tab") as HTMLElement;
  const container = (event.target as HTMLElement).closest(".layout-tabs") as HTMLElement;

  if (tabElement && container) {
    const tabRect = tabElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const scale = appStore.scaleRatio || 1;

    // x坐标：标签元素正中间位置
    // y坐标：标签元素最底部位置
    contextMenuPosition.value = {
      x: (tabRect.left + tabRect.width / 2 - containerRect.left) / scale,
      y: (tabRect.bottom - containerRect.top) / scale
    };
  }

  contextMenuVisible.value = true;
};

// 右键菜单操作 - 刷新
const handleContextRefresh = (tab: TabItem) => {
  if (tab.path === route.path) {
    router.go(0);
  } else {
    router.push(tab.path);
  }
};

// 右键菜单操作 - 关闭当前
const handleContextCloseCurrent = (tab: TabItem) => {
  const nextTab = tabsStore.removeTab(tab.path);
  if (nextTab && tabsStore.activeTab === tab.path) {
    router.push(nextTab.path);
  }
};

// 右键菜单操作 - 关闭其他
const handleContextCloseOther = (tab: TabItem) => {
  tabsStore.tabs = tabsStore.tabs.filter((t) => t.path === tab.path);
  if (tabsStore.activeTab !== tab.path) {
    router.push(tab.path);
  }
};

// 右键菜单操作 - 关闭左侧
const handleContextCloseLeft = (tab: TabItem) => {
  const index = tabsStore.tabs.findIndex((t) => t.path === tab.path);
  if (index > 0) {
    const removedTabs = tabsStore.tabs.slice(0, index);
    tabsStore.tabs = tabsStore.tabs.slice(index);

    // 如果关闭的标签中包含当前激活的标签，跳转到右键点击的标签
    if (removedTabs.some((t) => t.path === tabsStore.activeTab)) {
      router.push(tab.path);
    }
  }
};

// 右键菜单操作 - 关闭右侧
const handleContextCloseRight = (tab: TabItem) => {
  const index = tabsStore.tabs.findIndex((t) => t.path === tab.path);
  if (index !== -1) {
    const removedTabs = tabsStore.tabs.slice(index + 1);
    tabsStore.tabs = tabsStore.tabs.slice(0, index + 1);

    // 如果关闭的标签中包含当前激活的标签，跳转到右键点击的标签
    if (removedTabs.some((t) => t.path === tabsStore.activeTab)) {
      router.push(tab.path);
    }
  }
};

// 右键菜单操作 - 关闭所有
const handleContextCloseAll = () => {
  const firstTab = tabsStore.closeAll();
  if (firstTab) {
    router.push(firstTab.path);
  }
};
</script>

<style lang="scss" scoped>
.layout-tabs {
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px 20px 0;
  background: #fff;

  :deep(.ant-tabs) {
    flex: 1;

    .ant-tabs-nav {
      margin: 0;
    }

    .ant-tabs-tab {
      border: 1px solid #f0f0f0;
      background: #fafafa;
      margin-right: 4px;

      &.ant-tabs-tab-active {
        background: #fff;
      }
    }
  }
}

.tab-content {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  user-select: none;
}
</style>
