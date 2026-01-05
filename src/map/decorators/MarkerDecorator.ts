import { Marker } from "maptalks-gl";
import type { MarkerLayer } from "../layers";

const MarkerDecoratorType = {
  PROJECT: "project"
};

export type MarkerDecoratorType = (typeof MarkerDecoratorType)[keyof typeof MarkerDecoratorType];

export interface MarkerDecoratorOptions {
  type: MarkerDecoratorType;
  id: string;
  lng: number;
  lat: number;
}

export default class MarkerDecorator {
  protected opts: MarkerDecoratorOptions;
  protected layer: MarkerLayer;
  protected marker: Marker;

  constructor(opts: MarkerDecoratorOptions, layer: MarkerLayer) {
    const { id, lng, lat } = opts;
    this.opts = opts;
    this.layer = layer;
    this.marker = new Marker([lng, lat], { id });
  }

  addTo() {
    this.layer.addGeometry(this.marker);
  }

  remove() {
    this.layer.removeGeometry(this.marker);
  }

  getProperties() {
    return this.marker.getProperties();
  }
}
