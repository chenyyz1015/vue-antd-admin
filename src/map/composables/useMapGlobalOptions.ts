export const useMapGlobalOptions = createGlobalState(() => {
  const tk = ref<string>("");
  const gk = ref<string>("");

  return { tk, gk };
});
