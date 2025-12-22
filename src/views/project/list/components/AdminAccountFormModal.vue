<template>
  <a-modal
    v-model:open="visible"
    title="新增管理员账号"
    width="500px"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form ref="formRef" :model="formData" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
      <a-form-item label="用户名" name="username">
        <a-input v-model:value="formData.username" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item label="姓名" name="nickname">
        <a-input v-model:value="formData.nickname" placeholder="请输入姓名" />
      </a-form-item>
      <a-form-item label="密码" name="password">
        <a-input-password v-model:value="formData.password" placeholder="请输入密码" autocomplete="new-password" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { addAdminAccount } from "@/api/modules/project";
import type { AdminAccount } from "@/api/types/project";
import type { FormInstance } from "ant-design-vue";
import { message } from "ant-design-vue";

interface Props {
  visible: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:visible": [boolean];
  success: [AdminAccount];
}>();

const visible = computed({
  get: () => props.visible,
  set: (val) => emit("update:visible", val)
});

const loading = ref(false);
const formRef = ref<FormInstance>();

const formData = reactive({
  username: "",
  nickname: "",
  password: ""
});

const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "用户名长度在 3 到 20 个字符", trigger: "blur" },
    { pattern: /^[a-zA-Z0-9_]+$/, message: "用户名只能包含字母、数字和下划线", trigger: "blur" }
  ],
  nickname: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    { min: 2, max: 20, message: "姓名长度在 2 到 20 个字符", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur" },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
      message: "密码必须包含大小写字母和数字",
      trigger: "blur"
    }
  ]
};

// 监听弹窗关闭，重置表单
watch(
  () => props.visible,
  (val) => {
    if (!val) {
      resetForm();
    }
  }
);

const handleOk = async () => {
  try {
    await formRef.value?.validate();
    loading.value = true;

    // 调用API新增管理员账号
    const newAccount = await addAdminAccount({
      username: formData.username,
      nickname: formData.nickname,
      password: formData.password
    });

    message.success("添加成功");
    emit("success", newAccount);
    visible.value = false;
  } catch (error: any) {
    if (error.errorFields) {
      // 表单验证失败
      console.error("表单验证失败", error);
    } else {
      // API调用失败
      console.error("添加管理员账号失败:", error);
      message.error("添加失败");
    }
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  visible.value = false;
};

const resetForm = () => {
  Object.assign(formData, {
    username: "",
    nickname: "",
    password: "",
    confirmPassword: ""
  });
  formRef.value?.resetFields();
};
</script>

<style lang="scss" scoped></style>
