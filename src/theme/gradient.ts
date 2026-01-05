import type { ThemeMode } from "@/stores";
import { generate } from "@ant-design/colors";

export interface ThemeGradient {
  base: string;
  hover: string;
  active: string;
  light: string;
  dark: string;
  palette: string[];
}

export function createPrimaryGradient(primary: string, mode: ThemeMode = "light"): ThemeGradient {
  const palette = generate(primary, { theme: mode === "dark" ? "dark" : "default" });

  return {
    palette,
    light: palette[0] ?? "",
    hover: palette[4] ?? "",
    base: palette[5] ?? "",
    active: palette[6] ?? "",
    dark: palette[7] ?? ""
  };
}
