<template>
  <a-result status="403" title="403" sub-title="Sorry, you are not authorized to access this page.">
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
