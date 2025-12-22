<template>
  <a-modal v-model:open="visible" title="项目详情" width="700px" :footer="null" @cancel="handleCancel">
    <a-spin :spinning="loading">
      <a-descriptions v-if="project" :column="2" bordered>
        <a-descriptions-item label="项目ID">{{ project.projectId }}</a-descriptions-item>
        <a-descriptions-item label="项目名称">{{ project.projectName }}</a-descriptions-item>
        <a-descriptions-item label="合同项目名称" :span="2">{{ project.contractProjectName }}</a-descriptions-item>
        <a-descriptions-item label="甲方单位" :span="2">{{ project.partyA }}</a-descriptions-item>
        <a-descriptions-item label="签约状态">{{ project.signStatus }}</a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="project.status ? 'green' : 'red'">
            {{ project.status ? "启用" : "禁用" }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="行政区域" :span="2">{{ project.region }}</a-descriptions-item>
        <a-descriptions-item label="项目类型">{{ project.projectType }}</a-descriptions-item>
        <a-descriptions-item label="项目中心">{{ project.projectCenter }}</a-descriptions-item>
        <a-descriptions-item label="项目负责人">{{ project.responsible }}</a-descriptions-item>
        <a-descriptions-item label="手机号">{{ project.phone }}</a-descriptions-item>
        <a-descriptions-item label="相关管理员账号" :span="2">
          <a-tag v-for="account in project.adminAccounts" :key="account" color="blue">
            {{ account }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="物流柜授权">
          {{ project.cabinetAuth === -1 ? "不限制" : `${project.cabinetAuth}台` }}
        </a-descriptions-item>
        <a-descriptions-item label="无人机授权">
          {{ project.droneAuth === -1 ? "不限制" : `${project.droneAuth}台` }}
        </a-descriptions-item>
        <a-descriptions-item label="存储上限">
          {{ project.storageLimit === -1 ? "不限制" : `${project.storageLimit}G` }}
        </a-descriptions-item>
        <a-descriptions-item label="短信上限">
          {{ project.smsLimit === -1 ? "不限制" : `${project.smsLimit}条` }}
        </a-descriptions-item>
        <a-descriptions-item label="项目到期日" :span="2">{{ project.expiryDate }}</a-descriptions-item>
        <a-descriptions-item label="开通功能" :span="2">
          <a-tag v-for="feature in project.features" :key="feature" color="blue">
            {{ feature }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="系统地址" :span="2">
          <a :href="project.systemUrl" target="_blank">{{ project.systemUrl }}</a>
        </a-descriptions-item>
        <a-descriptions-item label="创建时间" :span="2">{{ project.createTime }}</a-descriptions-item>
      </a-descriptions>
    </a-spin>

    <div class="modal-footer">
      <a-button type="primary" @click="handleCancel">关闭</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { getProjectDetail } from "@/api/modules/project";
import type { Project } from "@/api/types/project";
import { message } from "ant-design-vue";

const props = defineProps<{
  visible: boolean;
  projectId: string;
}>();

const emit = defineEmits(["update:visible"]);

const visible = computed({
  get: () => props.visible,
  set: (val) => emit("update:visible", val)
});

const loading = ref(false);
const project = ref<Project | null>(null);

watch(
  () => props.visible,
  async (val) => {
    if (val && props.projectId) {
      await loadDetail();
    }
  }
);

const loadDetail = async () => {
  loading.value = true;
  try {
    project.value = await getProjectDetail(props.projectId);
  } catch (error) {
    message.error("加载详情失败");
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  visible.value = false;
};
</script>

<style lang="scss" scoped>
.modal-footer {
  margin-top: 20px;
  text-align: right;
}
</style>
