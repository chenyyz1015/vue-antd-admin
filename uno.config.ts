import { defineConfig, presetAttributify, presetIcons } from "unocss";
import presetUno from "@unocss/preset-wind3";

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons()],
  shortcuts: {
    "flex-center": "flex items-center justify-center",
    "flex-between": "flex items-center justify-between"
  },
  theme: {
    colors: {
      primary: "#1890ff",
      success: "#52c41a",
      warning: "#faad14",
      danger: "#ff4d4f"
    }
  }
});
