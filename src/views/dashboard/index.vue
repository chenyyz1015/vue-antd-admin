<template>
  <page-container title="首页">
    <a-row :gutter="16">
      <a-col v-for="item in cardData" :key="item.title" :span="6">
        <a-card>
          <a-statistic :title="item.title" :value="item.value" :prefix="item.prefix" />
        </a-card>
      </a-col>
    </a-row>

    <a-card title="数据趋势" style="margin-top: 16px">
      <div style="height: 400px">图表区域</div>
    </a-card>
  </page-container>
</template>

<script setup lang="ts">
import { ref } from "vue";

const cardData = ref([
  { title: "总用户数", value: 1234, prefix: "👥" },
  { title: "今日访问", value: 567, prefix: "📊" },
  { title: "订单量", value: 890, prefix: "📦" },
  { title: "营收", value: 12345, prefix: "💰" }
]);
</script>
