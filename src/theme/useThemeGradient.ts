import { useAppStore } from "@/stores";
import { createPrimaryGradient, type ThemeGradient } from "./gradient";

export function useThemeGradient() {
  const appStore = useAppStore();

  const primaryGradient = computed<ThemeGradient>(() =>
    createPrimaryGradient(appStore.primaryColor, appStore.themeMode)
  );

  return { primary: primaryGradient };
}
