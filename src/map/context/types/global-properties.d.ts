import { MapCore } from "@/map";
import "vue";

declare module "vue" {
  interface ComponentCustomProperties {
    $map: {
      viewer: MapCore;
      container: HTMLElement;
    };
  }
}

export {};
