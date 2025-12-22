import type { RouteLocationNormalized } from "vue-router";
import type { SvgName } from "~virtual/svg-component";

export interface TabItem {
  path: string;
  title: string;
  icon?: SvgName;
  closable?: boolean;
}

export const useTabsStore = defineStore(
  "tabs",
  () => {
    const tabs = ref<TabItem[]>([]);
    const activeTab = ref("");

    /**
     * 添加标签页
     */
    const addTab = (route: RouteLocationNormalized) => {
      const { path, meta } = route;

      // 如果路由没有title或者hidden为true，不添加标签
      if (!meta?.title || meta?.hidden) {
        return;
      }

      // 检查是否已存在
      const existTab = tabs.value.find((tab) => tab.path === path);
      if (!existTab) {
        tabs.value.push({
          path,
          title: meta.title,
          icon: meta.icon,
          closable: meta.closable !== false // 默认可关闭
        });
      }

      activeTab.value = path;
    };

    /**
     * 移除标签页
     */
    const removeTab = (path: string) => {
      const index = tabs.value.findIndex((tab) => tab.path === path);
      if (index === -1) return null;

      tabs.value.splice(index, 1);

      // 如果关闭的是当前标签，返回下一个应该激活的标签
      if (activeTab.value === path && tabs.value.length > 0) {
        return tabs.value[index] || tabs.value[index - 1];
      }

      return null;
    };

    /**
     * 关闭当前标签
     */
    const closeCurrent = () => {
      return removeTab(activeTab.value);
    };

    /**
     * 关闭其他标签
     */
    const closeOther = () => {
      tabs.value = tabs.value.filter((tab) => tab.path === activeTab.value);
    };

    /**
     * 关闭所有标签
     */
    const closeAll = () => {
      const firstTab = tabs.value[0];
      if (firstTab) {
        tabs.value = [firstTab];
        return firstTab;
      }
      return null;
    };

    /**
     * 关闭左侧标签
     */
    const closeLeft = () => {
      const index = tabs.value.findIndex((tab) => tab.path === activeTab.value);
      if (index > 0) {
        tabs.value = tabs.value.slice(index);
      }
    };

    /**
     * 关闭右侧标签
     */
    const closeRight = () => {
      const index = tabs.value.findIndex((tab) => tab.path === activeTab.value);
      if (index !== -1) {
        tabs.value = tabs.value.slice(0, index + 1);
      }
    };

    /**
     * 设置活动标签
     */
    const setActiveTab = (path: string) => {
      activeTab.value = path;
    };

    /**
     * 清空所有标签
     */
    const clearTabs = () => {
      tabs.value = [];
      activeTab.value = "";
    };

    /**
     * 刷新标签页
     */
    const refreshTab = (path?: string) => {
      // 这个方法用于触发页面刷新，具体实现在组件中
      const targetPath = path || activeTab.value;
      return targetPath;
    };

    return {
      tabs,
      activeTab,
      addTab,
      removeTab,
      closeCurrent,
      closeOther,
      closeAll,
      closeLeft,
      closeRight,
      setActiveTab,
      clearTabs,
      refreshTab
    };
  },
  {
    persist: {
      pick: ["tabs", "activeTab"]
    }
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTabsStore, import.meta.hot));
}
