<template>
  <div class="application-manage-table">
    <div class="toolbar">
      <a-button type="primary" @click="handleAddCustomApp">
        <template #icon><plus-outlined /></template>
        新增应用
      </a-button>
    </div>

    <a-table :columns="columns" :data-source="applications" :pagination="false" :loading="loading" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-switch
            v-model:checked="record.status"
            :checked-value="1"
            :unchecked-value="0"
            @change="handleStatusChange(record)"
          />
        </template>
        <template v-if="column.key === 'appIcon'">
          <span style="font-size: 24px">{{ record.appIcon }}</span>
        </template>
        <template v-if="column.key === 'source'">
          <a-tag :color="record.appType === 'system' ? 'blue' : 'green'">
            {{ record.source }}
          </a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
            <a-button v-if="record.appType === 'custom'" type="link" size="small" danger @click="handleDelete(record)">
              删除
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 应用编辑/新增弹窗 -->
    <a-modal
      v-model:open="appModalVisible"
      :title="appModalMode === 'add' ? '新增应用' : '编辑应用'"
      width="600px"
      @ok="handleAppModalOk"
      @cancel="handleAppModalCancel"
    >
      <a-form
        ref="appFormRef"
        :model="appFormData"
        :rules="appFormRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="应用名称" name="appName">
          <a-input v-model:value="appFormData.appName" placeholder="请输入应用名称" />
        </a-form-item>
        <a-form-item label="应用图标" name="appIcon">
          <a-input v-model:value="appFormData.appIcon" placeholder="请输入图标(emoji)" />
        </a-form-item>
        <a-form-item label="是否启用" name="status">
          <a-switch v-model:checked="appFormData.status" :checked-value="1" :unchecked-value="0" />
        </a-form-item>
        <a-form-item label="路由地址" name="routeUrl">
          <a-input
            v-model:value="appFormData.routeUrl"
            placeholder="请输入路由地址"
            :disabled="appModalMode === 'edit' && currentApp?.appType === 'system'"
          />
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="appFormData.remark" placeholder="请输入备注" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import type { Application } from "@/api/types/project";
import type { FormInstance } from "ant-design-vue";
import { message, Modal } from "ant-design-vue";

interface Props {
  modelValue: Application[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits<{
  "update:modelValue": [value: Application[]];
}>();

const applications = ref<Application[]>([...props.modelValue]);

// 应用管理相关
const appModalVisible = ref(false);
const appModalMode = ref<"add" | "edit">("add");
const appFormRef = ref<FormInstance>();
const currentApp = ref<Application | null>(null);

const appFormData = reactive({
  appName: "",
  appIcon: "",
  status: 1,
  routeUrl: "",
  remark: ""
});

const appFormRules = {
  appName: [{ required: true, message: "请输入应用名称", trigger: "blur" }],
  routeUrl: [{ required: true, message: "请输入路由地址", trigger: "blur" }]
};

const columns = [
  { title: "状态", key: "status", dataIndex: "status", width: 80 },
  { title: "应用名称", dataIndex: "appName", width: 150 },
  { title: "应用图标", key: "appIcon", width: 100 },
  { title: "应用来源", key: "source", width: 120 },
  { title: "路由地址", dataIndex: "routeUrl", width: 200 },
  { title: "备注", dataIndex: "remark" },
  { title: "操作", key: "action", width: 150, fixed: "right" as const }
];

// 监听父组件数据变化
watch(
  () => props.modelValue,
  (newVal) => {
    applications.value = [...newVal];
  },
  { deep: true }
);

// 监听内部数据变化，同步到父组件
watch(
  applications,
  (newVal) => {
    emit("update:modelValue", [...newVal]);
  },
  { deep: true }
);

const handleAddCustomApp = () => {
  appModalMode.value = "add";
  currentApp.value = null;
  resetAppForm();
  appModalVisible.value = true;
};

const handleEdit = (record: Application) => {
  appModalMode.value = "edit";
  currentApp.value = record;
  Object.assign(appFormData, {
    appName: record.appName,
    appIcon: record.appIcon,
    status: record.status,
    routeUrl: record.routeUrl,
    remark: record.remark
  });
  appModalVisible.value = true;
};

const handleDelete = (record: Application) => {
  Modal.confirm({
    title: "确认删除",
    content: `确定要删除应用"${record.appName}"吗？`,
    onOk: () => {
      const index = applications.value.findIndex((app) => app.id === record.id);
      if (index > -1) {
        applications.value.splice(index, 1);
        message.success("删除成功");
      }
    }
  });
};

const handleStatusChange = (record: Application) => {
  message.success(record.status ? "已启用" : "已关闭");
};

const handleAppModalOk = async () => {
  try {
    await appFormRef.value?.validate();

    if (appModalMode.value === "add") {
      const newApp: Application = {
        id: String(Date.now()),
        appName: appFormData.appName,
        appCode: `custom_${Date.now()}`,
        appIcon: appFormData.appIcon,
        appType: "custom",
        status: appFormData.status,
        routeUrl: appFormData.routeUrl,
        remark: appFormData.remark,
        source: "自定义应用"
      };
      applications.value.push(newApp);
      message.success("添加成功");
    } else if (currentApp.value) {
      const index = applications.value.findIndex((app) => app.id === currentApp.value?.id);
      if (index > -1) {
        applications.value[index] = {
          ...applications.value[index],
          appName: appFormData.appName,
          appIcon: appFormData.appIcon,
          status: appFormData.status,
          routeUrl: currentApp.value.appType === "system" ? applications.value[index].routeUrl : appFormData.routeUrl,
          remark: appFormData.remark
        };
        message.success("更新成功");
      }
    }

    appModalVisible.value = false;
  } catch (error) {
    console.error("表单验证失败", error);
  }
};

const handleAppModalCancel = () => {
  appModalVisible.value = false;
  resetAppForm();
};

const resetAppForm = () => {
  Object.assign(appFormData, {
    appName: "",
    appIcon: "",
    status: 1,
    routeUrl: "",
    remark: ""
  });
  appFormRef.value?.resetFields();
};

// 暴露方法给父组件
defineExpose({
  applications
});
</script>

<style lang="scss" scoped>
.application-manage-table {
  .toolbar {
    margin-bottom: 16px;
  }
}
</style>
