<template>
  <a-modal v-model:open="visible" title="应用管理" width="1000px" :footer="null" @cancel="handleCancel">
    <div class="application-manage-modal">
      <!-- 使用复用的应用管理表格组件 -->
      <ApplicationManageTable v-model="applications" :loading="loading" />

      <div class="modal-footer">
        <a-button type="primary" :loading="saving" @click="handleSave">确认</a-button>
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { getProjectApplications, updateProjectApplications } from "@/api/modules/project";
import type { Application } from "@/api/types/project";
import { message } from "ant-design-vue";
import ApplicationManageTable from "./ApplicationManageTable.vue";

const props = defineProps<{
  visible: boolean;
  projectId: string;
}>();

const emit = defineEmits(["update:visible", "success"]);

const visible = computed({
  get: () => props.visible,
  set: (val) => emit("update:visible", val)
});

const loading = ref(false);
const saving = ref(false);
const applications = ref<Application[]>([]);

watch(
  () => props.visible,
  async (val) => {
    if (val && props.projectId) {
      await loadApplications();
    }
  }
);

const loadApplications = async () => {
  loading.value = true;
  try {
    const res = await getProjectApplications(props.projectId);
    applications.value = res.applications;
  } catch (error) {
    message.error("加载应用列表失败");
  } finally {
    loading.value = false;
  }
};

const handleSave = async () => {
  saving.value = true;
  try {
    await updateProjectApplications(props.projectId, {
      applications: applications.value
    });
    message.success("保存成功");
    emit("success");
    visible.value = false;
  } catch (error) {
    message.error("保存失败");
  } finally {
    saving.value = false;
  }
};

const handleCancel = () => {
  visible.value = false;
};
</script>

<style lang="scss" scoped>
.application-manage-modal {
  .modal-footer {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
    text-align: right;

    .ant-btn {
      margin-left: 8px;
    }
  }
}
</style>
