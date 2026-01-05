import { PolygonLayer } from "maptalks-gl";
import type { MapCore } from "../core";
import type { AreaDecorator } from "../decorators";

export default class AreaLayer extends PolygonLayer {
  private viewer: MapCore;
  private decoratorMap = new Map<string, AreaDecorator>([]);

  constructor(id: string, viewer: MapCore) {
    super(id);

    this.viewer = viewer;
    this.addTo(this.viewer);
  }

  /**
   * 聚焦点图层
   */
  focusLayer() {
    const extent = this.getExtent();
    this.viewer.fitExtent(extent);
  }

  /**
   * 销毁实例
   */
  destroy() {
    this.decoratorMap.clear();
    this.remove();
  }
}
