<template>
  <div v-if="appStore.showTabs && !isMobile" class="layout-tabs">
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
          <svg-icon v-if="tab.icon" :name="tab.icon" :size="18" style="font-size: 18px" />
          <span>{{ tab.title }}</span>
        </template>
      </a-tab-pane>
    </a-tabs>
    <TabsDropdown
      :disabled="tabsStore.tabs.length === 1"
      @refresh="handleRefresh"
      @close-current="handleCloseCurrent"
      @close-other="handleCloseOther"
      @close-left="handleCloseLeft"
      @close-right="handleCloseRight"
      @close-all="handleCloseAll"
    />
  </div>
</template>

<script setup lang="ts">
import { useAppStore, useTabsStore } from "@/stores";
import type { Key } from "ant-design-vue/es/_util/type";
import TabsDropdown from "./TabsDropdown.vue";

interface Props {
  isMobile?: boolean;
}

withDefaults(defineProps<Props>(), {
  isMobile: false
});

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const tabsStore = useTabsStore();

// 监听路由变化，自动添加标签
watch(
  () => route.path,
  () => {
    if (appStore.showTabs) {
      tabsStore.addTab(route);
    }
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
</script>

<style lang="scss" scoped>
.layout-tabs {
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

:deep([data-theme="dark"]) {
  .layout-tabs {
    background: #141414;
    box-shadow: 0 1px 4px rgba(255, 255, 255, 0.08);

    .ant-tabs-tab {
      border-color: #303030;
      background: #1f1f1f;

      &.ant-tabs-tab-active {
        background: #141414;
      }
    }
  }
}

@media (max-width: 768px) {
  .layout-tabs {
    left: 0;
  }
}
</style>
