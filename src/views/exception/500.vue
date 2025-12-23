<template>
  <a-result status="500" title="500" sub-title="Sorry, the server is wrong.">
    <template #extra>
      <a-button type="primary" @click="goHome">Back Home</a-button>
    </template>
  </a-result>
</template>

<script setup lang="ts">
const router = useRouter();

const goHome = () => {
  router.push("/");
};
</script>

<style scoped lang="scss"></style>
