import type { MapViewType } from "maptalks/dist/map/Map";

const DEFAULT_VIEW: MapViewType = {
  center: [118.5546748, 31.6976106],
  zoom: 11
};

export const useAppMap = (viewerRef: Ref<HTMLElement | undefined>, view: MapViewType = DEFAULT_VIEW) => {
  onMounted(() => {
    viewerRef.value?.appendChild(container);
  });

  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error("useAppMap must be used in setup");
  }
  const { viewer, container } = instance.appContext.config.globalProperties.$map;
  viewer.setView(view);

  onUnmounted(() => {
    viewer.clear();
  });

  return { viewer };
};
