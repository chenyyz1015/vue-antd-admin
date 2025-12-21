import "vue-router";
import type { SvgName } from "~virtual/svg-component";

declare module "vue-router" {
  interface RouteMeta {
    title: string;
    icon?: SvgName;
    keepAlive?: boolean;
    closable?: boolean;
    hidden?: boolean;
    roles?: string[];
    requiresAuth: boolean;
  }
}

export {};
