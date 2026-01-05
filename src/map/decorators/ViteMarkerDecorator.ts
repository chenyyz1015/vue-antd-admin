import { Marker } from "maptalks-gl";
import IconVite from "../assets/vite.svg";
import type { MarkerLayer } from "../layers";
import type { MarkerDecoratorOptions } from "./MarkerDecorator";
import MarkerDecorator from "./MarkerDecorator";

export interface ViteMarkerDecoratorOptions extends MarkerDecoratorOptions {
  type: "project";
}

export default class ViteMarkerDecorator extends MarkerDecorator {
  constructor(opts: ViteMarkerDecoratorOptions, layer: MarkerLayer) {
    super(opts, layer);

    const { id, lng, lat } = opts;
    this.marker = new Marker([lng, lat], {
      id,
      symbol: {
        markerFile: IconVite,
        markerWidth: 32,
        markerHeight: 32
      },
      properties: opts
    });
  }
}
