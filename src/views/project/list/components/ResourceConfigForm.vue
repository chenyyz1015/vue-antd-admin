<template>
  <div class="resource-config-form">
    <a-form ref="formRef" :model="formData" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="物流柜授权" name="cabinetAuth">
        <a-input v-model:value="formData.cabinetAuth" type="number" placeholder="请输入台数" style="width: 200px" />
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

      <a-form-item v-if="showReminderRule" label="提醒规则" name="reminderRule">
        <a-radio-group v-model:value="formData.reminderRule">
          <a-radio value="not_limit">不提醒不限制</a-radio>
          <a-radio value="limit_not_remind">提醒不限制</a-radio>
          <a-radio value="remind_limit">提醒且限制</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="项目到期日" name="expiryType">
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
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from "ant-design-vue";
import dayjs, { Dayjs } from "dayjs";

interface ResourceFormData {
  cabinetAuth: number;
  droneAuth: number;
  storageLimit: number;
  smsLimit: number;
  reminderRule?: string;
  expiryType: "limited" | "unlimited";
  expiryDate: Dayjs;
}

interface Props {
  modelValue: ResourceFormData;
  labelCol?: { span: number };
  wrapperCol?: { span: number };
  showReminderRule?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  labelCol: () => ({ span: 6 }),
  wrapperCol: () => ({ span: 16 }),
  showReminderRule: true
});

const emit = defineEmits<{
  "update:modelValue": [value: ResourceFormData];
}>();

const formRef = ref<FormInstance>();
const formData = reactive<ResourceFormData>({ ...props.modelValue });

const rules = {
  cabinetAuth: [{ required: true, message: "请输入物流柜授权台数", trigger: "blur" }],
  droneAuth: [{ required: true, message: "请输入无人机授权台数", trigger: "blur" }],
  storageLimit: [{ required: true, message: "请输入存储上限", trigger: "blur" }],
  smsLimit: [{ required: true, message: "请输入短信上限", trigger: "blur" }]
};

// 监听表单数据变化，同步到父组件
watch(
  formData,
  (newVal) => {
    emit("update:modelValue", { ...newVal });
  },
  { deep: true }
);

// 监听父组件数据变化，同步到表单
watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(formData, newVal);
  },
  { deep: true }
);

const handleExpiryTypeChange = () => {
  if (formData.expiryType === "unlimited") {
    formData.expiryDate = dayjs("2099-12-31 23:59:59");
  } else {
    formData.expiryDate = dayjs();
  }
};

// 暴露验证方法给父组件
const validate = async () => {
  return await formRef.value?.validate();
};

const resetFields = () => {
  formRef.value?.resetFields();
};

defineExpose({
  validate,
  resetFields,
  formRef
});
</script>

<style lang="scss" scoped></style>
