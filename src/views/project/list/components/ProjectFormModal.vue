<template>
  <a-modal
    v-model:open="visible"
    :title="mode === 'add' ? '新增' : '编辑'"
    width="1000px"
    :footer="null"
    :mask-closable="false"
    @cancel="handleCancel"
  >
    <div class="project-form-modal">
      <!-- 步骤条 (仅新增时显示) -->
      <a-steps v-if="mode === 'add'" :current="current" class="steps">
        <a-step title="项目信息" />
        <a-step title="资源信息" />
        <a-step title="功能信息" />
        <a-step title="完成" />
      </a-steps>

      <!-- 步骤1: 项目基本信息 -->
      <div v-show="current === 0" class="step-content">
        <a-form
          ref="basicFormRef"
          :model="formData"
          :rules="basicRules"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-form-item label="项目名称" name="projectName">
            <a-input v-model:value="formData.projectName" placeholder="请输入项目名称" />
          </a-form-item>
          <a-form-item label="合同项目名称" name="contractProjectName">
            <a-input v-model:value="formData.contractProjectName" placeholder="请输入合同项目名称" />
          </a-form-item>
          <a-form-item label="甲方单位" name="partyA">
            <a-input v-model:value="formData.partyA" placeholder="请输入甲方单位" />
          </a-form-item>
          <a-form-item label="签约状态" name="signStatus">
            <a-select v-model:value="formData.signStatus" placeholder="请选择签约状态">
              <a-select-option value="未签约">未签约</a-select-option>
              <a-select-option value="已签约">已签约</a-select-option>
              <a-select-option value="执行中">执行中</a-select-option>
              <a-select-option value="已完成">已完成</a-select-option>
              <a-select-option value="已终止">已终止</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="项目类型" name="projectType">
            <a-select v-model:value="formData.projectType" placeholder="请选择项目类型">
              <a-select-option value="城市安全">城市安全</a-select-option>
              <a-select-option value="智慧社区">智慧社区</a-select-option>
              <a-select-option value="园区管理">园区管理</a-select-option>
              <a-select-option value="校园安防">校园安防</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="行政区域" name="region">
            <a-input v-model:value="formData.region" placeholder="请选择行政区域" />
          </a-form-item>
          <a-form-item label="项目负责人" name="responsible">
            <a-input v-model:value="formData.responsible" placeholder="请输入项目负责人" />
          </a-form-item>
          <a-form-item label="手机号" name="phone">
            <a-input v-model:value="formData.phone" placeholder="请输入手机号" />
          </a-form-item>
          <a-form-item label="相关管理员账号" name="adminAccounts">
            <a-select
              v-model:value="formData.adminAccounts"
              mode="multiple"
              placeholder="请选择管理员账号"
              :options="adminAccountOptions"
              :dropdown-render="dropdownRender"
            />
          </a-form-item>
          <a-form-item label="项目中心" name="projectCenter">
            <a-input v-model:value="formData.projectCenter" placeholder="请输入项目中心" />
          </a-form-item>
        </a-form>
      </div>

      <!-- 步骤2: 资源配置 (使用复用组件) -->
      <div v-show="current === 1 && mode === 'add'" class="step-content">
        <ResourceConfigForm ref="resourceFormRef" v-model="resourceData" />
      </div>

      <!-- 步骤3: 功能信息（应用管理，使用复用组件） -->
      <div v-show="current === 2 && mode === 'add'" class="step-content">
        <ApplicationManageTable v-model="formData.applications" />
      </div>

      <!-- 步骤4: 完成 -->
      <div v-show="current === 3 && mode === 'add'" class="step-content success-content">
        <div class="success-icon">
          <check-circle-outlined />
        </div>
        <h2>项目已创建成功</h2>
        <div class="project-info">
          <p><strong>系统地址：</strong>{{ createdProject.systemUrl }}</p>
          <p><strong>项目名称：</strong>{{ createdProject.projectName }}</p>
          <p><strong>合同项目名称：</strong>{{ createdProject.contractProjectName }}</p>
          <p><strong>甲方单位：</strong>{{ createdProject.partyA }}</p>
          <p><strong>签约状态：</strong>{{ createdProject.signStatus }}</p>
          <p><strong>行政区域：</strong>{{ createdProject.region }}</p>
          <p><strong>项目类型：</strong>{{ createdProject.projectType }}</p>
          <p><strong>项目负责人：</strong>{{ createdProject.responsible }}</p>
          <p><strong>手机号：</strong>{{ createdProject.phone }}</p>
          <p><strong>项目中心：</strong>{{ createdProject.projectCenter }}</p>
          <p><strong>开通功能：</strong>{{ createdProject.features }}</p>
          <p><strong>项目到期日：</strong>{{ createdProject.expiryDate }}</p>
          <p><strong>物流柜授权：</strong>{{ createdProject.cabinetAuth }}</p>
          <p><strong>无人机授权：</strong>{{ createdProject.droneAuth }}</p>
          <p><strong>存储上限：</strong>{{ createdProject.storageLimit }}</p>
          <p><strong>短信上限：</strong>{{ createdProject.smsLimit }}</p>
        </div>
        <a-button type="link" @click="handleCopyInfo">一键复制</a-button>
      </div>

      <!-- 底部按钮 -->
      <div class="modal-footer">
        <a-button v-if="current > 0 && current < 3 && mode === 'add'" @click="handlePrev">上一步</a-button>
        <a-button v-if="current < 3 || mode === 'edit'" type="primary" :loading="submitLoading" @click="handleNext">
          {{ mode === "edit" ? "确认" : current === 2 ? "确认" : "下一步" }}
        </a-button>
        <a-button v-if="current === 3" type="primary" @click="handleFinish">确认</a-button>
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </div>

    <!-- 新增管理员账号弹窗 -->
    <AdminAccountFormModal v-model:visible="accountModalVisible" @success="handleAccountSuccess" />
  </a-modal>
</template>

<script setup lang="ts">
import { addProject, getAdminAccounts, getProjectDetail, updateProject } from "@/api/modules/project";
import type { AdminAccount, Application } from "@/api/types/project";
import { PlusOutlined } from "@ant-design/icons-vue";
import type { FormInstance } from "ant-design-vue";
import { message } from "ant-design-vue";
import dayjs, { Dayjs } from "dayjs";
import AdminAccountFormModal from "./AdminAccountFormModal.vue";
import ApplicationManageTable from "./ApplicationManageTable.vue";
import ResourceConfigForm from "./ResourceConfigForm.vue";

const props = defineProps<{
  visible: boolean;
  mode: "add" | "edit";
  projectId?: string;
}>();

const emit = defineEmits(["update:visible", "success"]);

const visible = computed({
  get: () => props.visible,
  set: (val) => emit("update:visible", val)
});

const current = ref(0);
const submitLoading = ref(false);
const basicFormRef = ref<FormInstance>();
const resourceFormRef = ref<InstanceType<typeof ResourceConfigForm>>();

// 基本信息表单数据
const formData = reactive({
  projectName: "",
  contractProjectName: "",
  partyA: "",
  signStatus: "",
  region: "",
  projectType: "",
  responsible: "",
  phone: "",
  adminAccounts: [] as string[],
  projectCenter: "",
  applications: [] as Application[]
});

// 资源配置数据（使用独立对象）
const resourceData = reactive({
  cabinetAuth: 2,
  droneAuth: 1,
  storageLimit: 200,
  smsLimit: 1000,
  reminderRule: "not_limit",
  expiryType: "limited" as "limited" | "unlimited",
  expiryDate: dayjs()
});

// 管理员账号选项
const adminAccountOptions = ref<{ label: string; value: string }[]>([]);

// 新增管理员账号相关
const accountModalVisible = ref(false);

// 创建成功后的项目信息
const createdProject = ref({
  systemUrl: "https://wuliu.lmyfhk.com",
  projectName: "",
  contractProjectName: "",
  partyA: "",
  signStatus: "",
  region: "",
  projectType: "",
  responsible: "",
  phone: "",
  projectCenter: "",
  features: "",
  expiryDate: "",
  cabinetAuth: "",
  droneAuth: "",
  storageLimit: "",
  smsLimit: ""
});

const basicRules = {
  projectName: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
  contractProjectName: [{ required: true, message: "请输入合同项目名称", trigger: "blur" }],
  partyA: [{ required: true, message: "请输入甲方单位", trigger: "blur" }],
  signStatus: [{ required: true, message: "请选择签约状态", trigger: "change" }],
  region: [{ required: true, message: "请选择行政区域", trigger: "change" }],
  projectType: [{ required: true, message: "请选择项目类型", trigger: "change" }],
  responsible: [{ required: true, message: "请输入项目负责人", trigger: "blur" }],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号", trigger: "blur" }
  ],
  projectCenter: [{ required: true, message: "请输入项目中心", trigger: "blur" }]
};

// 加载管理员账号列表
const loadAdminAccounts = async () => {
  try {
    const accounts = await getAdminAccounts();
    adminAccountOptions.value = accounts.map((account) => ({
      label: `${account.nickname} (${account.username})`,
      value: account.username
    }));
  } catch (error) {
    console.error("加载管理员账号失败:", error);
  }
};

watch(
  () => props.visible,
  async (val) => {
    if (val) {
      // 加载管理员账号列表
      await loadAdminAccounts();

      if (props.mode === "edit" && props.projectId) {
        await loadProjectDetail();
      } else {
        resetForm();
        // 新增时加载系统应用
        loadSystemApplications();
      }
    }
  }
);

const loadProjectDetail = async () => {
  if (!props.projectId) return;
  try {
    const res = await getProjectDetail(props.projectId);
    Object.assign(formData, {
      projectName: res.projectName,
      contractProjectName: res.contractProjectName,
      partyA: res.partyA,
      signStatus: res.signStatus,
      region: res.region,
      projectType: res.projectType,
      responsible: res.responsible,
      phone: res.phone,
      adminAccounts: res.adminAccounts || [],
      projectCenter: res.projectCenter
    });
  } catch (error) {
    message.error("加载项目详情失败");
  }
};

// 加载系统应用列表
const loadSystemApplications = () => {
  const systemApps: Application[] = [
    {
      id: "1",
      appName: "靓马空递",
      appCode: "lm_delivery",
      appIcon: "📦",
      appType: "system",
      status: 0,
      routeUrl: "/delivery",
      remark: "物流配送系统",
      source: "系统应用"
    },
    {
      id: "2",
      appName: "业务中台",
      appCode: "business_platform",
      appIcon: "🏢",
      appType: "system",
      status: 0,
      routeUrl: "/business",
      remark: "业务管理平台",
      source: "系统应用"
    },
    {
      id: "3",
      appName: "数据分析",
      appCode: "data_analysis",
      appIcon: "📊",
      appType: "system",
      status: 0,
      routeUrl: "/analysis",
      remark: "数据分析系统",
      source: "系统应用"
    }
  ];
  formData.applications = [...systemApps];
};

const handlePrev = () => {
  current.value--;
};

const handleNext = async () => {
  if (props.mode === "edit") {
    await handleSubmit();
    return;
  }

  if (current.value === 0) {
    try {
      await basicFormRef.value?.validate();
      current.value++;
    } catch (error) {
      console.error("表单验证失败", error);
    }
  } else if (current.value === 1) {
    try {
      await resourceFormRef.value?.validate();
      current.value++;
    } catch (error) {
      console.error("表单验证失败", error);
    }
  } else if (current.value === 2) {
    await handleSubmit();
  }
};

const handleSubmit = async () => {
  submitLoading.value = true;
  try {
    // 获取开通的功能列表
    const enabledApps = formData.applications.filter((app) => app.status === 1);
    const features = enabledApps.map((app) => app.appName);

    const data = {
      ...formData,
      ...resourceData,
      expiryDate: (resourceData.expiryDate as Dayjs).format("YYYY.MM.DD HH:mm:ss"),
      features,
      applications: formData.applications
    };

    if (props.mode === "edit" && props.projectId) {
      await updateProject(props.projectId, data);
      message.success("更新成功");
      emit("success");
    } else {
      await addProject(data);
      message.success("创建成功");

      // 显示成功页面
      createdProject.value = {
        systemUrl: "https://wuliu.lmyfhk.com",
        projectName: data.projectName,
        contractProjectName: data.contractProjectName,
        partyA: data.partyA,
        signStatus: data.signStatus,
        region: data.region,
        projectType: data.projectType,
        responsible: data.responsible,
        phone: data.phone,
        projectCenter: data.projectCenter,
        features: features.join("、"),
        expiryDate: data.expiryDate,
        cabinetAuth: data.cabinetAuth === -1 ? "不限制" : `${data.cabinetAuth}台`,
        droneAuth: data.droneAuth === -1 ? "不限制" : `${data.droneAuth}台`,
        storageLimit: data.storageLimit === -1 ? "不限制" : `${data.storageLimit}G`,
        smsLimit: data.smsLimit === -1 ? "不限制" : `${data.smsLimit}条`
      };
      current.value = 3;
    }
  } catch (error) {
    console.error("提交失败:", error);
  } finally {
    submitLoading.value = false;
  }
};

const handleFinish = () => {
  emit("success");
  handleCancel();
};

const handleCopyInfo = () => {
  const info = createdProject.value;
  const text = `尊敬的客户您好，项目已开通
系统地址：${info.systemUrl}
项目名称：${info.projectName}
合同项目名称：${info.contractProjectName}
甲方单位：${info.partyA}
签约状态：${info.signStatus}
行政区域：${info.region}
项目类型：${info.projectType}
项目负责人：${info.responsible}
手机号：${info.phone}
项目中心：${info.projectCenter}
开通功能：${info.features}
项目到期日：${info.expiryDate}
物流柜授权：${info.cabinetAuth}
无人机授权：${info.droneAuth}
存储上限：${info.storageLimit}
短信上限：${info.smsLimit}`;

  navigator.clipboard.writeText(text).then(() => {
    message.success("复制成功");
  });
};

// 下拉框自定义渲染（添加新增账号按钮）
const dropdownRender = ({ menuNode }: any) => {
  return h("div", [
    menuNode,
    h(
      "div",
      {
        style: {
          padding: "8px",
          borderTop: "1px solid #f0f0f0",
          cursor: "pointer"
        },
        onClick: () => {
          accountModalVisible.value = true;
        }
      },
      [h(PlusOutlined, { style: { marginRight: "8px" } }), "新增管理员账号"]
    )
  ]);
};

// 新增管理员账号成功后的处理
const handleAccountSuccess = (newAccount: AdminAccount) => {
  // 添加到选项列表
  const newOption = {
    label: `${newAccount.nickname} (${newAccount.username})`,
    value: newAccount.username
  };
  adminAccountOptions.value.push(newOption);

  // 自动选中新添加的账号
  formData.adminAccounts.push(newAccount.username);
};

const handleCancel = () => {
  resetForm();
  visible.value = false;
};

const resetForm = () => {
  current.value = 0;
  Object.assign(formData, {
    projectName: "",
    contractProjectName: "",
    partyA: "",
    signStatus: "",
    region: "",
    projectType: "",
    responsible: "",
    phone: "",
    adminAccounts: [],
    projectCenter: "",
    applications: []
  });
  Object.assign(resourceData, {
    cabinetAuth: 2,
    droneAuth: 1,
    storageLimit: 200,
    smsLimit: 1000,
    reminderRule: "not_limit",
    expiryType: "limited",
    expiryDate: dayjs()
  });
  basicFormRef.value?.resetFields();
  resourceFormRef.value?.resetFields();
};
</script>

<style lang="scss" scoped>
.project-form-modal {
  .steps {
    margin-bottom: 24px;
  }

  .step-content {
    min-height: 400px;
    padding: 20px 0;
  }

  .success-content {
    text-align: center;

    .success-icon {
      font-size: 72px;
      color: #52c41a;
      margin-bottom: 16px;
    }

    h2 {
      margin-bottom: 24px;
    }

    .project-info {
      text-align: left;
      max-width: 600px;
      margin: 0 auto 20px;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 4px;

      p {
        margin-bottom: 8px;
        line-height: 1.8;
      }
    }
  }

  .modal-footer {
    margin-top: 24px;
    text-align: right;
    border-top: 1px solid #f0f0f0;
    padding-top: 16px;

    .ant-btn {
      margin-left: 8px;
    }
  }
}
</style>
