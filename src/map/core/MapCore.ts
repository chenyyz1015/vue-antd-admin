import type { TileLayerOptionsType } from "maptalks";
import { GroupTileLayer, Map as MaptalksGLMap, TileLayer, WMSTileLayer } from "maptalks-gl";
import type { GroupTileLayerOptionsType } from "maptalks/dist/layer/tile/GroupTileLayer";
import type { WMSTileLayerOptionsType } from "maptalks/dist/layer/tile/WMSTileLayer";
import type { MapContainerType, MapCreateOptionsType } from "maptalks/dist/map/Map";
import type { GeometryLayer } from "../layers";

type TileLayerMap = Map<string, TileLayer | WMSTileLayer | GroupTileLayer>;

export interface GroupTileLayerItem {
  id: string;
  type: "tile" | "wms";
  opts: TileLayerOptionsType | WMSTileLayerOptionsType;
}

export default class MapCore extends MaptalksGLMap {
  private tileLayerMap: TileLayerMap = new Map([]);

  constructor(container: MapContainerType, opts: MapCreateOptionsType) {
    super(container, { ...opts, attribution: false });
  }

  /**
   * 添加基础瓦片图层
   * @param {string} id
   * @param {TileLayerOptionsType} opts
   * @returns {TileLayer}
   */
  addTileLayer(id: string, opts: TileLayerOptionsType): TileLayer {
    const layer = new TileLayer(id, {
      urlTemplate: opts.urlTemplate,
      subdomains: opts.subdomains || [],
      maxAvailableZoom: opts.maxAvailableZoom,
      spatialReference: opts.spatialReference
    });
    this.tileLayerMap.set(id, layer);
    return layer;
  }

  /**
   * 添加WMS瓦片图层
   * @param {string} id
   * @param {WMSTileLayerOptionsType} opts
   * @returns {WMSTileLayer}
   */
  addWMSTileLayer(id: string, opts: WMSTileLayerOptionsType): WMSTileLayer {
    const layer = new WMSTileLayer(id, {
      urlTemplate: opts.urlTemplate,
      crs: opts.crs,
      layers: opts.layers,
      styles: opts.styles || "default",
      version: opts.version || "1.0.0",
      format: opts.format || "tiles",
      transparent: opts.transparent !== false,
      uppercase: true
    });
    this.tileLayerMap.set(id, layer);
    return layer;
  }

  /**
   * 添加组合瓦片图层
   * @param {string} id
   * @param {GroupTileLayerItem} layers
   * @param {GroupTileLayerOptionsType} groupOpts
   * @returns {GroupTileLayer}
   */
  addGroupTileLayer(id: string, layers: GroupTileLayerItem[], groupOpts: GroupTileLayerOptionsType): GroupTileLayer {
    const tileLayers: TileLayer[] | WMSTileLayer[] = layers.map((l) => {
      switch (l.type) {
        case "tile":
          return this.addTileLayer(l.id, l.opts);
        case "wms":
          return this.addWMSTileLayer(l.id, l.opts);
        default:
          return this.addTileLayer(l.id, l.opts);
      }
    });
    const groupLayer = new GroupTileLayer(id, tileLayers, groupOpts);
    this.tileLayerMap.set(id, groupLayer);
    return groupLayer;
  }

  /**
   * 设置默认底图
   * @param {string} id
   */
  setDefaultBaseLayer(id: string) {
    const baseLayer = this.tileLayerMap.get(id);
    if (!baseLayer) {
      throw new Error(`Layer ${id} 未加载`);
    }
    this.setBaseLayer(baseLayer);
  }

  /**
   * 清空标注
   */
  clear() {
    const layers = this.getLayers() as GeometryLayer[];
    layers.forEach((l) => l.destroy());
  }

  /**
   * 销毁实例
   */
  destroy() {
    this.tileLayerMap.clear();
    this.remove();
  }
}
