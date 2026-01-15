import type { MapViewType } from "maptalks/dist/map/Map";
import { ref } from "vue";
import type { BaseLayerGroup, BaseLayerOptions } from "../context";
import {
  BASE_LAYER_GROUP,
  BaseLayerID,
  BaseLayerType,
  DEFAULT_OPTIONS,
  DEFAULT_VIEW,
  MapSearchEngine
} from "../context";
import type { CoreZoomType } from "../core";
import { useMapGlobalOptions } from "./useMapGlobalOptions";
import { useMapInstance } from "./useMapInstance";

export const useMapGlobalState = createGlobalState(() => {
  // 默认底图
  const defaultBaseLayer = import.meta.env.VITE_MAP_BASE_LAYER;
  // 默认搜索引擎
  const defaultSearchEngine = import.meta.env.VITE_MAP_SEARCH_ENGINE;
  // 是否自动切换搜索引擎
  const searchEngineAuto = import.meta.env.VITE_MAP_SEARCH_ENGINE_AUTO;

  const { tk, gk } = useMapGlobalOptions();
  const { viewer } = useMapInstance();

  const baseLayerId = ref<string>("");
  const baseLayerGroup = ref<BaseLayerGroup[]>([]);
  const searchEngine = ref<string>(defaultSearchEngine);
  const zoom = ref<number>(DEFAULT_OPTIONS.zoom ?? 0);
  const bearing = ref<number>(DEFAULT_OPTIONS.bearing ?? 0);
  const pitch = ref<number>(DEFAULT_OPTIONS.pitch ?? 0);

  const init = () => {
    // 注入内置地图底图
    const layers = BASE_LAYER_GROUP.map((g) => g.layers).flat();
    layers.forEach((l) => addBaseLayerWithOptions(l));
    baseLayerGroup.value = [...BASE_LAYER_GROUP];
    // 设置默认底图
    switch (defaultBaseLayer) {
      case "tdt":
        switchBaseLayer({ value: BaseLayerID.TDT_IMG, engine: MapSearchEngine.TDT });
        break;
      case "google":
        switchBaseLayer({ value: BaseLayerID.GOOGLE_IMG, engine: MapSearchEngine.GOOGLE });
        break;
      case "osm":
        switchBaseLayer({ value: BaseLayerID.OSM_STANDARD, engine: MapSearchEngine.OSM });
        break;
      default:
        switchBaseLayer({ value: BaseLayerID.TDT_IMG, engine: MapSearchEngine.TDT });
        break;
    }
  };

  const addBaseLayer = (layer: BaseLayerGroup | BaseLayerGroup[]) => {
    if (layer instanceof Array) {
      const layers = layer.map((g) => g.layers).flat();
      layers.forEach((l) => addBaseLayerWithOptions(l));
      baseLayerGroup.value = [...baseLayerGroup.value, ...layer];
    } else {
      layer.layers.forEach((l) => addBaseLayerWithOptions(l));
      baseLayerGroup.value = [...baseLayerGroup.value, layer];
    }
  };

  const addBaseLayerWithOptions = (layerOpts: BaseLayerOptions) => {
    if (typeof layerOpts.layer === "function") {
      if (layerOpts.type === BaseLayerType.TDT) {
        viewer.addGroupTileLayer(layerOpts.value, layerOpts.layer(tk.value), { urlTemplate: "" });
      } else if (layerOpts.type === BaseLayerType.GOOGLE) {
        viewer.addGroupTileLayer(layerOpts.value, layerOpts.layer(gk.value), { urlTemplate: "" });
      }
    } else {
      viewer.addGroupTileLayer(layerOpts.value, layerOpts.layer, { urlTemplate: "" });
    }
  };

  const switchBaseLayer = (layerOpts: Omit<BaseLayerOptions, "label" | "thumb" | "type" | "layer">) => {
    if (searchEngineAuto) {
      searchEngine.value = layerOpts.engine;
    }
    baseLayerId.value = layerOpts.value;
    viewer.setDefaultBaseLayer(layerOpts.value);
  };

  const switchSearchEngine = (engine: MapSearchEngine) => {
    searchEngine.value = engine;
  };

  const switchZoom = (type: CoreZoomType) => {
    zoom.value = viewer.zoomTo(type);
  };

  const switchBearing = (bear?: number) => {
    bearing.value = viewer.bearingTo(bear);
  };

  const switchPitch = (pit?: number) => {
    pitch.value = viewer.pitchTo(pit);
  };

  const resetView = (view: MapViewType = DEFAULT_VIEW) => {
    zoom.value = view.zoom ?? 11;
    bearing.value = view.bearing ?? 0;
    pitch.value = view.pitch ?? 0;
    view = { ...view, zoom: zoom.value, bearing: bearing.value, pitch: pitch.value };
    viewer.resetView(view);
  };

  return {
    baseLayerId,
    baseLayerGroup,
    searchEngine,
    zoom,
    bearing,
    pitch,
    init,
    addBaseLayer,
    switchBaseLayer,
    switchSearchEngine,
    switchZoom,
    switchBearing,
    switchPitch,
    resetView
  };
});
