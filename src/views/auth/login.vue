<template>
  <div class="login-container">
    <div class="login-box">
      <h2>{{ appStore.title }}</h2>
      <a-form :model="formData" @finish="handleLogin">
        <a-form-item name="username" :rules="[{ required: true, message: '请输入用户名' }]">
          <a-input v-model:value="formData.username" placeholder="用户名">
            <template #prefix>
              <user-outlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item name="password" :rules="[{ required: true, message: '请输入密码' }]">
          <a-input-password v-model:value="formData.password" placeholder="密码">
            <template #prefix>
              <lock-outlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading" block> 登录 </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore, useUserStore } from "@/stores";
import { message } from "ant-design-vue";

const router = useRouter();
const appStore = useAppStore();
const userStore = useUserStore();

const loading = ref(false);
const formData = reactive({
  username: "admin",
  password: "123456"
});

const handleLogin = async () => {
  loading.value = true;
  try {
    await userStore.login(formData);
    message.success("登录成功");
    router.push("/");
  } catch (error) {
    console.error("error", error);
    message.error("登录失败");
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-box {
    width: 400px;
    padding: 40px;
    background: #fff;
    color: #313131;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    h2 {
      text-align: center;
      margin-bottom: 32px;
      font-size: 24px;
      font-weight: 600;
    }
  }
}
</style>
