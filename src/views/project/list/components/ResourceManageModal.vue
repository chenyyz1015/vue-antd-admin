<template>
  <a-modal v-model:open="visible" title="资源配置" width="900px" :footer="null" @cancel="handleCancel">
    <div class="resource-manage-modal">
      <a-tabs v-model:active-key="activeTab">
        <a-tab-pane key="config" tab="资源配置">
          <a-form ref="formRef" :model="formData" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="物流柜授权" name="cabinetAuth">
              <a-input
                v-model:value="formData.cabinetAuth"
                type="number"
                placeholder="请输入台数"
                style="width: 200px"
              />
              <a-space style="margin-left: 10px">
                <a-button size="small" @click="formData.cabinetAuth = 1">一台</a-button>
                <a-button size="small" @click="formData.cabinetAuth = 3">三台</a-button>
                <a-button size="small" @click="formData.cabinetAuth = 5">五台</a-button>
                <a-button size="small" @click="formData.cabinetAuth = 10">十台</a-button>
                <a-button size="small" @click="formData.cabinetAuth = -1">不限制</a-button>
              </a-space>
            </a-form-item>

            <a-form-item label="无人机授权" name="droneAuth">
              <a-input v-model:value="formData.droneAuth" type="number" placeholder="请输入台数" style="width: 200px" />
              <a-space style="margin-left: 10px">
                <a-button size="small" @click="formData.droneAuth = 1">一台</a-button>
                <a-button size="small" @click="formData.droneAuth = 3">三台</a-button>
                <a-button size="small" @click="formData.droneAuth = 5">五台</a-button>
                <a-button size="small" @click="formData.droneAuth = 10">十台</a-button>
                <a-button size="small" @click="formData.droneAuth = -1">不限制</a-button>
              </a-space>
            </a-form-item>

            <a-form-item label="存储上限" name="storageLimit">
              <a-input
                v-model:value="formData.storageLimit"
                type="number"
                placeholder="请输入容量"
                style="width: 200px"
                addon-after="G"
              />
              <a-space style="margin-left: 10px">
                <a-button size="small" @click="formData.storageLimit = 200">200G</a-button>
                <a-button size="small" @click="formData.storageLimit = 400">400G</a-button>
                <a-button size="small" @click="formData.storageLimit = 600">600G</a-button>
                <a-button size="small" @click="formData.storageLimit = 1000">1000G</a-button>
                <a-button size="small" @click="formData.storageLimit = -1">不限制</a-button>
              </a-space>
            </a-form-item>

            <a-form-item label="短信上限" name="smsLimit">
              <a-input
                v-model:value="formData.smsLimit"
                type="number"
                placeholder="请输入条数"
                style="width: 200px"
                addon-after="条"
              />
              <a-space style="margin-left: 10px">
                <a-button size="small" @click="formData.smsLimit = 2000">2000</a-button>
                <a-button size="small" @click="formData.smsLimit = 5000">5000</a-button>
                <a-button size="small" @click="formData.smsLimit = 10000">10000</a-button>
                <a-button size="small" @click="formData.smsLimit = 20000">20000</a-button>
                <a-button size="small" @click="formData.smsLimit = -1">不限制</a-button>
              </a-space>
            </a-form-item>

            <a-form-item label="提醒规则" name="reminderRule">
              <a-radio-group v-model:value="formData.reminderRule">
                <a-radio value="not_limit">不提醒不限制</a-radio>
                <a-radio value="limit_not_remind">提醒不限制</a-radio>
                <a-radio value="remind_limit">提醒且限制</a-radio>
              </a-radio-group>
              <div class="tip-text">当用户使用资源达到80%时将入库提醒，达80%时进入警戒期；达100%如不允许继续使用</div>
            </a-form-item>

            <a-form-item label="项目到期日">
              <a-radio-group v-model:value="formData.expiryType" @change="handleExpiryTypeChange">
                <a-radio value="limited">限期</a-radio>
                <a-radio value="unlimited">不限制</a-radio>
              </a-radio-group>
              <a-date-picker
                v-model:value="formData.expiryDate"
                show-time
                format="YYYY.MM.DD HH:mm:ss"
                style="margin-left: 10px; width: 200px"
                :disabled="formData.expiryType === 'unlimited'"
              />
            </a-form-item>
          </a-form>

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
import type { FormInstance } from "ant-design-vue";
import { message } from "ant-design-vue";
import dayjs, { Dayjs } from "dayjs";
import { reactive, ref, watch } from "vue";

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
const formRef = ref<FormInstance>();

const formData = reactive({
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
    Object.assign(formData, {
      cabinetAuth: project.cabinetAuth,
      droneAuth: project.droneAuth,
      storageLimit: project.storageLimit,
      smsLimit: project.smsLimit,
      expiryType: project.expiryDate === "2099.12.31 23:59:59" ? "unlimited" : "limited",
      expiryDate: dayjs(project.expiryDate, "YYYY.MM.DD HH:mm:ss")
    });
  } catch (error) {
    console.error("error", error);
    message.error("加载项目信息失败");
  }
};

const handleExpiryTypeChange = () => {
  if (formData.expiryType === "unlimited") {
    formData.expiryDate = dayjs("2099-12-31 23:59:59");
  } else {
    formData.expiryDate = dayjs();
  }
};

const loadRecords = async () => {
  recordLoading.value = true;
  try {
    records.value = await getResourceRecords(props.projectId);
  } catch (error) {
    console.error("error", error);
    message.error("加载操作记录失败");
  } finally {
    recordLoading.value = false;
  }
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    const data = {
      ...formData,
      expiryDate:
        formData.expiryType === "unlimited"
          ? "2099.12.31 23:59:59"
          : (formData.expiryDate as Dayjs).format("YYYY.MM.DD HH:mm:ss")
    };
    await updateProjectResource(props.projectId, data);
    message.success("更新成功");
    emit("success");
    visible.value = false;
  } catch (error) {
    console.error("error", error);
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
  .tip-text {
    margin-top: 8px;
    font-size: 12px;
    color: #999;
    line-height: 1.5;
  }

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
