<template>
  <div class="login-container">
    <div class="body-content">
      <div class="body-left">
        <img src="@/assets/images/banner-login.png" alt="banner" class="banner" />
      </div>
      <div class="body-right">
        <div class="form-title">欢迎登录</div>
        <a-form
          :model="formData"
          :rules="formRules"
          layout="vertical"
          autocomplete="off"
          class="login-form"
          @finish="handleLogin"
        >
          <a-form-item name="username">
            <a-input v-model:value="formData.username" placeholder="账号">
              <template #prefix>
                <user-outlined />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item name="password">
            <a-input-password v-model:value="formData.password" placeholder="密码">
              <template #prefix>
                <lock-outlined />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item>
            <a-checkbox v-model:checked="formData.rememberPassword">记住密码</a-checkbox>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" :disabled="!canLogin" html-type="submit" class="btn-login"> 立即登录 </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoginParams } from "@/api";
import { useUserStore } from "@/stores";
import { getPassword, getUserName, removePassword, removeUserName, setPassword, setUserName } from "@/utils/auth";
import { decrypt, encrypt } from "@/utils/crypto";
import type { Rule } from "ant-design-vue/es/form";
import { Md5 } from "ts-md5";

onMounted(() => {
  const encryptPassword = getPassword();
  formData.value.username = getUserName() || "";
  formData.value.password = encryptPassword ? decrypt(encryptPassword) : "";
  formData.value.rememberPassword = !!formData.value.username && !!formData.value.password;
});

const userStore = useUserStore();

const loading = ref(false);
const formData = ref<LoginParams>({
  username: "",
  password: "",
  grantType: "password",
  rememberPassword: false
});
const formRules: Record<string, Rule[]> = {
  username: [{ required: true, message: "请输入账号", trigger: "change" }],
  password: [{ required: true, message: "请输入密码", trigger: "change" }]
};
const canLogin = computed<boolean>(() => !!formData.value.username && !!formData.value.password);

const handleLogin = async () => {
  try {
    loading.value = true;
    await userStore.login({
      ...formData.value,
      password: Md5.hashStr(formData.value.password ?? "")
    });
    if (formData.value.username && formData.value.rememberPassword) {
      setUserName(formData.value.username);
      setPassword(encrypt(formData.value.password ?? ""));
    } else {
      removeUserName();
      removePassword();
    }
  } catch (error) {
    console.error("error", error);
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
}

.login-container .body-content {
  width: 880px;
  height: 544px;
  background: #ffffff;
  box-shadow: 0px 4px 40px 0px rgba(73, 115, 150, 0.15);
  border-radius: 20px 20px 20px 20px;
  overflow: hidden;
  align-items: flex-start;
  display: flex;

  .body-left {
    width: 345px;
    height: 100%;
    background: rgba(233, 219, 237, 0.35);

    .banner {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .body-right {
    flex: 1 1 auto;
    width: 0;
    height: 100%;
    padding: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;

    .form-title {
      font-size: 28px;
      color: #000000;
      line-height: 60px;
    }

    .login-form {
      flex: 1 1 auto;
      width: 100%;
      height: 0;

      .ant-input-affix-wrapper {
        width: 100%;
        height: 60px;
      }

      .btn-login {
        width: 100%;
        height: 60px;
        font-size: var(--font-size-largest);

        &:disabled {
          background: #c6defd;
          color: #ffffff;
          border-color: transparent;
        }
      }
    }
  }
}
</style>
