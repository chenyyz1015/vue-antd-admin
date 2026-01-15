export const useDownloadStore = defineStore("download", () => {
  const loading = ref<boolean>(false);
  const tip = ref<string>("正在下载...");

  return { loading, tip };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDownloadStore, import.meta.hot));
}
