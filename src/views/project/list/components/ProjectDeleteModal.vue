<template>
  <a-modal
    v-model:open="visible"
    title="提示"
    width="500px"
    :confirm-loading="loading"
    @ok="handleConfirm"
    @cancel="handleCancel"
  >
    <div class="delete-modal-content">
      <p class="warning-text">
        <exclamation-circle-outlined class="warning-icon" />
        删除后该项目所有数据无法保存，是否确认删除？
      </p>
      <div class="confirm-input">
        <p>请输入项目名称再次确认</p>
        <a-input v-model:value="confirmName" placeholder="请输入项目名称" @input="handleInputChange" />
      </div>
    </div>

    <template #footer>
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" danger :disabled="!canConfirm" :loading="loading" @click="handleConfirm">
        确认删除
      </a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { deleteProject } from "@/api/modules/project";
import type { Project } from "@/api/types/project";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { computed, ref, watch } from "vue";

const props = defineProps<{
  visible: boolean;
  project: Project | null;
}>();

const emit = defineEmits(["update:visible", "success"]);

const visible = computed({
  get: () => props.visible,
  set: (val) => emit("update:visible", val)
});

const loading = ref(false);
const confirmName = ref("");

const canConfirm = computed(() => {
  return confirmName.value === props.project?.projectName;
});

watch(
  () => props.visible,
  (val) => {
    if (!val) {
      confirmName.value = "";
    }
  }
);

const handleInputChange = () => {
  // 实时验证输入
};

const handleConfirm = async () => {
  if (!canConfirm.value) {
    message.warning("请输入正确的项目名称");
    return;
  }

  if (!props.project) return;

  loading.value = true;
  try {
    await deleteProject(props.project.id);
    message.success("删除成功");
    emit("success");
  } catch (error) {
    console.error("error", error);
    message.error("删除失败");
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  visible.value = false;
};
</script>

<style lang="scss" scoped>
.delete-modal-content {
  .warning-text {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    color: #ff4d4f;
    font-size: 14px;

    .warning-icon {
      font-size: 20px;
      margin-right: 8px;
    }
  }

  .confirm-input {
    p {
      margin-bottom: 8px;
      font-weight: 500;
    }
  }
}
</style>
