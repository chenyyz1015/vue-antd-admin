<template>
  <div class="maptalks-gl-container">
    <MapSearch v-model="location" />
  </div>
</template>

<script setup lang="ts">
import type { SelectValue } from "ant-design-vue/es/select";

const location = ref<SelectValue>("118.5049,31.6864");
</script>

<style lang="scss" scoped>
.maptalks-gl-container {
  width: 100%;
  height: 100%;
}
</style>
