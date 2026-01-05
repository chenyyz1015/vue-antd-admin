import { PointLayer } from "maptalks-gl";
import type { MapCore } from "../core";
import type { MarkerDecorator, ViteMarkerDecoratorOptions } from "../decorators";
import { ViteMarkerDecorator } from "../decorators";

export default class MarkerLayer extends PointLayer {
  private viewer: MapCore;
  private decoratorMap = new Map<string, MarkerDecorator>([]);

  constructor(id: string, viewer: MapCore) {
    super(id);

    this.viewer = viewer;
    this.addTo(this.viewer);
  }

  addViteMarker(opts: ViteMarkerDecoratorOptions) {
    const decorator = new ViteMarkerDecorator(opts, this);
    decorator.addTo();
    this.decoratorMap.set(opts.id, decorator);
  }

  removeViteMarker(id?: string | string[]) {
    if (!id) {
      const decorators = Array.from(this.decoratorMap.values()).filter((d) => {
        const properties = d.getProperties();
        return properties?.type === "project";
      });
      decorators.forEach((d) => d.remove());
    } else if (typeof id === "string") {
      const decorator = this.decoratorMap.get(id);
      decorator?.remove();
    } else {
      const decorators = Array.from(this.decoratorMap.entries())
        .filter(([i, d]) => {
          const properties = d.getProperties();
          return id.includes(i) && properties?.type === "project";
        })
        .map(([, d]) => d);
      decorators.forEach((d) => d.remove());
    }
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
