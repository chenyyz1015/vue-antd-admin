import { useUserStore } from "@/stores/modules/user";
import type { Directive } from "vue";

const role: Directive = {
  mounted: (el, binding) => {
    const { value } = binding;
    const userStore = useUserStore();
    const roles = userStore.roles;

    if (value && value instanceof Array) {
      const hasRole = roles.some((r) => value.includes(r) || r === "admin");
      if (!hasRole) {
        el.style.display = "none";
      }
    }
  }
};

export default role;
