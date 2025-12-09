import { useUserStore } from "@/stores/modules/user";
import type { Directive } from "vue";

const permission: Directive = {
  mounted: (el, binding) => {
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

export default permission;
