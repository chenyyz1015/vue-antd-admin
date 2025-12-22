<template>
  <!-- 第一步：初始提示弹窗 -->
  <a-modal
    v-model:open="firstStepVisible"
    title="提示"
    width="500px"
    @ok="handleFirstStepOk"
    @cancel="handleFirstStepCancel"
  >
    <div class="first-step-content">
      <p class="warning-text">
        <exclamation-circle-outlined class="warning-icon" />
        删除后该项目所有数据无法保存，是否确认删除？
      </p>
    </div>
  </a-modal>

  <!-- 第二步：输入确认弹窗 -->
  <a-modal
    v-model:open="secondStepVisible"
    title="确认删除"
    width="500px"
    :confirm-loading="loading"
    @ok="handleSecondStepOk"
    @cancel="handleSecondStepCancel"
  >
    <div class="second-step-content">
      <p class="warning-text">
        <exclamation-circle-outlined class="warning-icon" />
        此操作不可恢复，请谨慎操作！
      </p>
      <div class="confirm-input">
        <p>请输入项目名称再次确认</p>
        <a-input
          v-model:value="confirmName"
          placeholder="请输入项目名称"
          @input="handleInputChange"
          @keyup.enter="handleSecondStepOk"
        />
      </div>
    </div>

    <template #footer>
      <a-button @click="handleSecondStepCancel">取消</a-button>
      <a-button type="primary" danger :disabled="!canConfirm" :loading="loading" @click="handleSecondStepOk">
        确认删除
      </a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { deleteProject } from "@/api/modules/project";
import type { Project } from "@/api/types/project";
import { message } from "ant-design-vue";

const props = defineProps<{
  visible: boolean;
  project: Project | null;
}>();

const emit = defineEmits(["update:visible", "success"]);

// 第一步弹窗
const firstStepVisible = ref(false);
// 第二步弹窗
const secondStepVisible = ref(false);
const loading = ref(false);
const confirmName = ref("");

const canConfirm = computed(() => {
  return confirmName.value === props.project?.projectName;
});

watch(
  () => props.visible,
  (val) => {
    if (val) {
      // 打开第一步弹窗
      firstStepVisible.value = true;
      secondStepVisible.value = false;
      confirmName.value = "";
    } else {
      // 关闭所有弹窗
      firstStepVisible.value = false;
      secondStepVisible.value = false;
      confirmName.value = "";
    }
  }
);

const handleInputChange = () => {
  // 实时验证输入
};

// 第一步：确认删除意图
const handleFirstStepOk = () => {
  // 关闭第一步，打开第二步
  firstStepVisible.value = false;
  secondStepVisible.value = true;
};

const handleFirstStepCancel = () => {
  firstStepVisible.value = false;
  emit("update:visible", false);
};

// 第二步：输入确认并执行删除
const handleSecondStepOk = async () => {
  if (!canConfirm.value) {
    message.warning("请输入正确的项目名称");
    return;
  }

  if (!props.project) return;

  loading.value = true;
  try {
    await deleteProject(props.project.id);
    message.success("删除成功");
    secondStepVisible.value = false;
    emit("update:visible", false);
    emit("success");
  } catch (error) {
    console.error("error", error);
    message.error("删除失败");
  } finally {
    loading.value = false;
  }
};

const handleSecondStepCancel = () => {
  secondStepVisible.value = false;
  emit("update:visible", false);
};
</script>

<style lang="scss" scoped>
.first-step-content,
.second-step-content {
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
}

.second-step-content {
  .confirm-input {
    p {
      margin-bottom: 8px;
      font-weight: 500;
    }
  }
}
</style>
