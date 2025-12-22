<template>
  <a-modal v-model:open="visible" title="资源配置" width="900px" :footer="null" @cancel="handleCancel">
    <div class="resource-manage-modal">
      <a-tabs v-model:active-key="activeTab">
        <a-tab-pane key="config" tab="资源配置">
          <!-- 使用复用的资源配置表单组件 -->
          <ResourceConfigForm ref="resourceFormRef" v-model="resourceData" />

          <div class="form-actions">
            <a-button type="primary" :loading="loading" @click="handleSubmit">确认</a-button>
            <a-button @click="handleCancel">取消</a-button>
          </div>
        </a-tab-pane>

        <a-tab-pane key="records" tab="操作记录">
          <a-table
            :columns="recordColumns"
            :data-source="records"
            :loading="recordLoading"
            :pagination="false"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'operationType'">
                <a-tag :color="record.operationType === 'add' ? 'green' : 'red'">
                  {{ record.operationType === "add" ? "新增" : "删除" }}
                </a-tag>
              </template>
              <template v-if="column.key === 'change'">
                <span :class="record.operationType === 'add' ? 'increase' : 'decrease'">
                  {{ record.operationType === "add" ? "+" : "-" }}{{ record.changeCount }}
                </span>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { getProjectDetail, getResourceRecords, updateProjectResource } from "@/api/modules/project";
import type { ResourceRecord } from "@/api/types/project";
import { message } from "ant-design-vue";
import dayjs, { Dayjs } from "dayjs";
import ResourceConfigForm from "./ResourceConfigForm.vue";

const props = defineProps<{
  visible: boolean;
  projectId: string;
}>();

const emit = defineEmits(["update:visible", "success"]);

const visible = computed({
  get: () => props.visible,
  set: (val) => emit("update:visible", val)
});

const activeTab = ref("config");
const loading = ref(false);
const recordLoading = ref(false);

// 资源配置数据
const resourceData = reactive({
  cabinetAuth: 2,
  droneAuth: 1,
  storageLimit: 200,
  smsLimit: 1000,
  reminderRule: "not_limit",
  expiryType: "limited" as "limited" | "unlimited",
  expiryDate: dayjs()
});

const records = ref<ResourceRecord[]>([]);

const recordColumns = [
  { title: "时间", dataIndex: "time", width: 180 },
  { title: "操作人", dataIndex: "operator", width: 120 },
  { title: "操作项", dataIndex: "operation", width: 120 },
  { title: "操作", key: "operationType", width: 80 },
  { title: "变更前数量", dataIndex: "beforeCount", width: 120 },
  { title: "变更后数量", dataIndex: "afterCount", width: 120 },
  { title: "变更数量", key: "change", width: 100 }
];

watch(
  () => props.visible,
  async (val) => {
    if (val && props.projectId) {
      await loadProjectData();
      await loadRecords();
    }
  }
);

const loadProjectData = async () => {
  try {
    const project = await getProjectDetail(props.projectId);
    Object.assign(resourceData, {
      cabinetAuth: project.cabinetAuth,
      droneAuth: project.droneAuth,
      storageLimit: project.storageLimit,
      smsLimit: project.smsLimit,
      expiryType: project.expiryDate === "2099.12.31 23:59:59" ? "unlimited" : "limited",
      expiryDate: dayjs(project.expiryDate, "YYYY.MM.DD HH:mm:ss")
    });
  } catch (error) {
    message.error("加载项目信息失败");
  }
};

const loadRecords = async () => {
  recordLoading.value = true;
  try {
    records.value = await getResourceRecords(props.projectId);
  } catch (error) {
    message.error("加载操作记录失败");
  } finally {
    recordLoading.value = false;
  }
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    const data = {
      ...resourceData,
      expiryDate: (resourceData.expiryDate as Dayjs).format("YYYY.MM.DD HH:mm:ss")
    };
    await updateProjectResource(props.projectId, data);
    message.success("更新成功");
    emit("success");
    visible.value = false;
  } catch (error) {
    message.error("更新失败");
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  visible.value = false;
};
</script>

<style lang="scss" scoped>
.resource-manage-modal {
  .form-actions {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
    text-align: right;

    .ant-btn {
      margin-left: 8px;
    }
  }

  .increase {
    color: #52c41a;
  }

  .decrease {
    color: #ff4d4f;
  }
}
</style>
