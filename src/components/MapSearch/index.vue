<template>
  <div ref="viewerRef" class="map-viewer">
    <div v-if="props.search" class="location-filter">
      <a-select
        v-model:value="modelValue"
        show-search
        :show-arrow="false"
        :default-active-first-option="false"
        :filter-option="false"
        :not-found-content="null"
        :options="options"
        placeholder="请输入地点"
        @search="handleSearch"
      ></a-select>
      <a-button type="primary" @click="onResetSearchResult">重置</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppMap } from "@/composables";
import { MarkerLayer } from "@/map";
import { uuid } from "@/utils/utils";
import type { DefaultOptionType, SelectValue } from "ant-design-vue/es/select";
import { debounce, isNil } from "lodash-es";

interface Props {
  search?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  search: true
});

const modelValue = defineModel<SelectValue>("modelValue", { required: true });

const viewerRef = ref<HTMLElement>();
const { viewer } = useAppMap(viewerRef);
const markerLayer = new MarkerLayer(`layer_${uuid()}`, viewer);

const options = ref<DefaultOptionType[]>([]);
watch(
  modelValue,
  (value) => {
    markerLayer.removeViteMarker();
    if (!value) {
      return;
    }
    const [lng, lat] = value
      .toString()
      .split(",")
      .map((i) => Number(i));
    if (isNil(lng) || isNil(lat)) {
      return;
    }
    markerLayer.addViteMarker({ type: "project", id: uuid(), lng, lat });
    markerLayer.focusLayer();
  },
  { immediate: true }
);

const handleSearch = debounce(async (keyWord) => {
  if (!keyWord) {
    return;
  }
}, 500);

const onResetSearchResult = () => {
  modelValue.value = undefined;
  options.value = [];
};
</script>

<style lang="scss" scoped>
.map-viewer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  .location-filter {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 999;
    display: flex;
    align-items: center;

    :deep(.ant-select) {
      min-width: 200px;

      .ant-select-selector {
        border-radius: 0;
      }
    }

    .ant-btn {
      border-radius: 0;
    }
  }
}
</style>
