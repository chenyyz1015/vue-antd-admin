<template>
  <div class="exception-page">
    <div class="exception-content">
      <div class="exception-icon">
        <warning-outlined />
      </div>
      <h1 class="exception-title">500</h1>
      <p class="exception-desc">抱歉，服务器出错了</p>
      <a-space>
        <a-button @click="goBack">返回上一页</a-button>
        <a-button type="primary" @click="goHome">返回首页</a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const goBack = () => {
  router.back();
};

const goHome = () => {
  router.push("/");
};
</script>

<style scoped lang="scss">
.exception-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f0f2f5;

  .exception-content {
    text-align: center;

    .exception-icon {
      font-size: 120px;
      color: #ff4d4f;
      margin-bottom: 24px;
    }

    .exception-title {
      font-size: 72px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 16px;
    }

    .exception-desc {
      font-size: 18px;
      color: rgba(0, 0, 0, 0.45);
      margin-bottom: 32px;
    }
  }
}
</style>
