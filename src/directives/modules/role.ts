import { usePermission } from "@/composables";
import type { Directive } from "vue";

const role: Directive = {
  mounted: (el, binding) => {
    const { value } = binding;
    const { hasRole } = usePermission();
    const flag = hasRole(value);

    if (!flag) {
      el.style.display = "none";
    }
  }
};

export default role;
