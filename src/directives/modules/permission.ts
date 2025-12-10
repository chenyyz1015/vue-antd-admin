import { usePermission } from "@/composables";
import type { Directive } from "vue";

const permission: Directive = {
  mounted: (el, binding) => {
    const { value } = binding;
    const { hasPermission } = usePermission();
    const flag = hasPermission(value);

    if (!flag) {
      el.style.display = "none";
    }
  }
};

export default permission;
