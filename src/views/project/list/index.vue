<template>
  <div class="project-management">
    <a-card :bordered="false">
      <!-- 搜索区域 -->
      <a-form layout="inline" :model="searchForm" class="search-form">
        <a-form-item label="项目名称">
          <a-input v-model:value="searchForm.projectName" placeholder="请输入项目名称" allow-clear />
        </a-form-item>
        <a-form-item label="项目ID">
          <a-input v-model:value="searchForm.projectId" placeholder="请输入项目ID" allow-clear />
        </a-form-item>
        <a-form-item label="项目类型">
          <a-select v-model:value="searchForm.projectType" placeholder="请选择" style="width: 150px" allow-clear>
            <a-select-option value="城市安全">城市安全</a-select-option>
            <a-select-option value="智慧社区">智慧社区</a-select-option>
            <a-select-option value="园区管理">园区管理</a-select-option>
            <a-select-option value="校园安防">校园安防</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="项目状态">
          <a-select v-model:value="searchForm.status" placeholder="请选择" style="width: 120px" allow-clear>
            <a-select-option :value="1">启用</a-select-option>
            <a-select-option :value="0">禁用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">
              <template #icon><search-outlined /></template>
              查询
            </a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>

      <!-- 操作按钮 -->
      <div class="table-operations">
        <a-button type="primary" @click="handleAdd">
          <template #icon><plus-outlined /></template>
          新增项目
        </a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        :scroll="{ x: 1500 }"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            {{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
          </template>
          <template v-if="column.key === 'status'">
            <a-switch
              v-model:checked="record.status"
              :checked-value="1"
              :unchecked-value="0"
              @change="handleStatusChange(record)"
            />
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleDetail(record)">详情</a-button>
              <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-button type="link" size="small" @click="handleCopy(record)">复制</a-button>
              <a-button type="link" size="small" @click="handleResource(record)">资源管理</a-button>
              <a-button type="link" size="small" @click="handleApplication(record)">应用管理</a-button>
              <a-button type="link" size="small" danger @click="handleDelete(record)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 新增/编辑弹窗 -->
    <ProjectFormModal
      v-model:visible="formModalVisible"
      :mode="formMode"
      :project-id="currentProjectId"
      @success="handleFormSuccess"
    />

    <!-- 详情弹窗 -->
    <ProjectDetailModal v-model:visible="detailModalVisible" :project-id="currentProjectId" />

    <!-- 删除确认弹窗 -->
    <ProjectDeleteModal v-model:visible="deleteModalVisible" :project="currentProject" @success="handleDeleteSuccess" />

    <!-- 资源管理弹窗 -->
    <ResourceManageModal v-model:visible="resourceModalVisible" :project-id="currentProjectId" @success="refresh" />

    <!-- 应用管理弹窗 -->
    <ApplicationManageModal
      v-model:visible="applicationModalVisible"
      :project-id="currentProjectId"
      @success="refresh"
    />
  </div>
</template>

<script setup lang="ts">
import { getProjectList } from "@/api/modules/project";
import type { Project } from "@/api/types/project";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { reactive, ref } from "vue";
import ApplicationManageModal from "./components/ApplicationManageModal.vue";
import ProjectDeleteModal from "./components/ProjectDeleteModal.vue";
import ProjectDetailModal from "./components/ProjectDetailModal.vue";
import ProjectFormModal from "./components/ProjectFormModal.vue";
import ResourceManageModal from "./components/ResourceManageModal.vue";

const searchForm = reactive({
  projectName: "",
  projectId: "",
  projectType: undefined,
  status: undefined
});

const loading = ref(false);
const dataSource = ref<Project[]>([]);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`
});

const formModalVisible = ref(false);
const detailModalVisible = ref(false);
const deleteModalVisible = ref(false);
const resourceModalVisible = ref(false);
const applicationModalVisible = ref(false);

const formMode = ref<"add" | "edit">("add");
const currentProjectId = ref("");
const currentProject = ref<Project | null>(null);

const columns = [
  { title: "序号", key: "index", width: 70, fixed: "left" },
  { title: "状态", key: "status", dataIndex: "status", width: 80, fixed: "left" },
  { title: "项目ID", dataIndex: "projectId", width: 130 },
  { title: "项目名称", dataIndex: "projectName", width: 200 },
  { title: "项目区域", dataIndex: "region", width: 200 },
  { title: "项目类型", dataIndex: "projectType", width: 120 },
  { title: "项目负责人", dataIndex: "responsible", width: 120 },
  { title: "手机号", dataIndex: "phone", width: 130 },
  { title: "物流柜授权(台)", dataIndex: "cabinetAuth", width: 120 },
  { title: "无人机授权(台)", dataIndex: "droneAuth", width: 120 },
  { title: "操作", key: "action", width: 400, fixed: "right" }
];

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getProjectList({
      page: pagination.current,
      size: pagination.pageSize,
      ...searchForm
    });
    dataSource.value = res.records;
    pagination.total = res.total;
  } catch (error) {
    console.error("获取数据失败:", error);
  } finally {
    loading.value = false;
  }
};

const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchData();
};

const handleSearch = () => {
  pagination.current = 1;
  fetchData();
};

const handleReset = () => {
  Object.assign(searchForm, {
    projectName: "",
    projectId: "",
    projectType: undefined,
    status: undefined
  });
  handleSearch();
};

const handleAdd = () => {
  formMode.value = "add";
  currentProjectId.value = "";
  formModalVisible.value = true;
};

const handleEdit = (record: Project) => {
  formMode.value = "edit";
  currentProjectId.value = record.id;
  formModalVisible.value = true;
};

const handleDetail = (record: Project) => {
  currentProjectId.value = record.id;
  detailModalVisible.value = true;
};

const handleDelete = (record: Project) => {
  currentProject.value = record;
  deleteModalVisible.value = true;
};

const handleCopy = (record: Project) => {
  const formatValue = (value: number) => {
    return value === -1 ? "不限制" : value;
  };

  const text = `尊敬的客户您好，项目已开通
系统地址：${record.systemUrl}
项目名称：${record.projectName}
合同项目名称：${record.contractProjectName}
甲方单位：${record.partyA}
签约状态：${record.signStatus}
行政区域：${record.region}
项目类型：${record.projectType}
项目负责人：${record.responsible}
手机号：${record.phone}
项目中心：${record.projectCenter}
开通功能：${record.features.join("、")}
项目到期日：${record.expiryDate}
物流柜授权：${formatValue(record.cabinetAuth)}${record.cabinetAuth !== -1 ? "台" : ""}
无人机授权：${formatValue(record.droneAuth)}${record.droneAuth !== -1 ? "台" : ""}
存储上限：${formatValue(record.storageLimit)}${record.storageLimit !== -1 ? "G" : ""}
短信上限：${formatValue(record.smsLimit)}${record.smsLimit !== -1 ? "条" : ""}`;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      message.success("复制成功");
    })
    .catch(() => {
      message.error("复制失败");
    });
};

const handleResource = (record: Project) => {
  currentProjectId.value = record.id;
  resourceModalVisible.value = true;
};

const handleApplication = (record: Project) => {
  currentProjectId.value = record.id;
  applicationModalVisible.value = true;
};

const handleStatusChange = (record: Project) => {
  message.success(record.status ? "已启用" : "已禁用");
};

const handleFormSuccess = () => {
  formModalVisible.value = false;
  refresh();
};

const handleDeleteSuccess = () => {
  deleteModalVisible.value = false;
  refresh();
};

const refresh = () => {
  fetchData();
};

// 初始化加载数据
fetchData();
</script>

<style lang="scss" scoped>
.project-management {
  .search-form {
    margin-bottom: 16px;
  }

  .table-operations {
    margin-bottom: 16px;
  }
}
</style>
