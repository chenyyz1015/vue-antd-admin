export const useFullscreen = (containerRef?: Ref<HTMLElement | undefined>) => {
  const isFullscreen = ref(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      (containerRef?.value ?? document.documentElement).requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleFullscreenChange = () => {
    isFullscreen.value = !!document.fullscreenElement;
  };

  useEventListener(document, "fullscreenchange", handleFullscreenChange);

  return { isFullscreen, toggleFullscreen };
};
