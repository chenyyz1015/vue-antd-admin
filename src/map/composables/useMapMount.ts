import type { ClassOptions } from "maptalks/dist/core/Class";
import { DEFAULT_CONFIG_OPTIONS } from "../context";
import { useMapGlobalState } from "./useMapGlobalState";
import { useMapInstance } from "./useMapInstance";

export const useMapMount = (
  options: ClassOptions = DEFAULT_CONFIG_OPTIONS,
  viewerRef?: Ref<HTMLElement | undefined> | null
) => {
  onMounted(() => {
    viewerRef?.value?.appendChild(container);
  });

  const mapState = useMapGlobalState();
  const { viewer, container } = useMapInstance();

  viewer.config(options);

  onUnmounted(() => {
    mapState.resetView();
    viewer.clear();
  });

  return { viewer };
};
