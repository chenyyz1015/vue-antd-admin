<template>
  <div ref="viewerRef" class="maptalks-container">
    <MapPicker v-model="location" />
  </div>
</template>

<script setup lang="ts">
import type { SelectValue } from "ant-design-vue/es/select";

const location = ref<SelectValue>();
</script>

<style lang="scss" scoped>
.maptalks-container {
  width: 100%;
  height: 100%;
}
</style>
