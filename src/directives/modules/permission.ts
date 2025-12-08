import type { Directive } from "vue";
import { useUserStore } from "@/stores/modules/user";

export const permission: Directive = {
  mounted(el, binding) {
    const { value } = binding;
    const userStore = useUserStore();
    const permissions = userStore.permissions;

    if (value && value instanceof Array) {
      const hasPermission = permissions.some((p) => value.includes(p) || p === "*:*:*");
      if (!hasPermission) {
        el.style.display = "none";
      }
    }
  }
};
