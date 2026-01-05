<template>
  <a-modal
    v-model:open="visible"
    centered
    :mask-closable="false"
    v-bind="$attrs"
    class="com-modal"
    @ok="$emit('ok')"
    @cancel="$emit('cancel')"
  >
    <slot></slot>
  </a-modal>
</template>

<script setup lang="ts">
interface Emits {
  (e: "ok"): void;
  (e: "cancel"): void;
}

defineEmits<Emits>();

const visible = defineModel<boolean>("visible", { required: true });
</script>

<style lang="scss">
.ant-modal.com-modal {
  .ant-modal-content {
    padding: 0;

    .ant-modal-header {
      width: 100%;
      height: 50px;
      padding: 0 20px;
      background: #eff4f8;
      display: flex;
      align-items: center;
    }

    .ant-modal-body {
      padding: 20px 20px 0;
    }

    .ant-modal-footer {
      padding: 20px;
    }
  }
}
</style>
