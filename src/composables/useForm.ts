import type { FormInstance } from "ant-design-vue";
import { message } from "ant-design-vue";
import { ref } from "vue";

export const useForm = () => {
  const formRef = ref<FormInstance>();
  const loading = ref(false);
  const formData = ref<Record<string, any>>({});

  const handleSubmit = async (api: (data: any) => Promise<any>) => {
    try {
      await formRef.value?.validate();
      loading.value = true;
      await api(formData.value);
      message.success("操作成功");
    } catch (error) {
      console.error("提交失败:", error);
    } finally {
      loading.value = false;
    }
  };

  const handleReset = () => {
    formRef.value?.resetFields();
    formData.value = {};
  };

  return {
    formRef,
    loading,
    formData,
    handleSubmit,
    handleReset
  };
};
