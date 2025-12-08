import type { App } from "vue";
import { permission } from "./modules/permission";
import { role } from "./modules/role";

export function setupDirectives(app: App) {
  app.directive("permission", permission);
  app.directive("role", role);
}
