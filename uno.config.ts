import presetUno from "@unocss/preset-wind3";
import { defineConfig, presetAttributify, presetIcons } from "unocss";

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons()],
  shortcuts: {
    "flex-center": "flex items-center justify-center",
    "flex-between": "flex items-center justify-between"
  }
});
