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

      <!-- 步骤2: 资源配置 -->
      <div v-show="current === 1 && mode === 'add'" class="step-content">
        <a-form
          ref="resourceFormRef"
          :model="formData"
          :rules="resourceRules"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-form-item label="物流柜授权" name="cabinetAuth">
            <a-input v-model:value="formData.cabinetAuth" type="number" placeholder="请输入台数" style="width: 200px" />
            <a-space style="margin-left: 10px">
              <a-button size="small" @click="formData.cabinetAuth = 1">一台</a-button>
              <a-button size="small" @click="formData.cabinetAuth = 3">三台</a-button>
              <a-button size="small" @click="formData.cabinetAuth = 5">五台</a-button>
              <a-button size="small" @click="formData.cabinetAuth = 10">十台</a-button>
              <a-button size="small" @click="formData.cabinetAuth = -1">不限制</a-button>
            </a-space>
          </a-form-item>
          <a-form-item label="无人机授权" name="droneAuth">
            <a-input v-model:value="formData.droneAuth" type="number" placeholder="请输入台数" style="width: 200px" />
            <a-space style="margin-left: 10px">
              <a-button size="small" @click="formData.droneAuth = 1">一台</a-button>
              <a-button size="small" @click="formData.droneAuth = 3">三台</a-button>
              <a-button size="small" @click="formData.droneAuth = 5">五台</a-button>
              <a-button size="small" @click="formData.droneAuth = 10">十台</a-button>
              <a-button size="small" @click="formData.droneAuth = -1">不限制</a-button>
            </a-space>
          </a-form-item>
          <a-form-item label="存储上限" name="storageLimit">
            <a-input
              v-model:value="formData.storageLimit"
              type="number"
              placeholder="请输入容量"
              style="width: 200px"
              addon-after="G"
            />
            <a-space style="margin-left: 10px">
              <a-button size="small" @click="formData.storageLimit = 200">200G</a-button>
              <a-button size="small" @click="formData.storageLimit = 400">400G</a-button>
              <a-button size="small" @click="formData.storageLimit = 600">600G</a-button>
              <a-button size="small" @click="formData.storageLimit = 1000">1000G</a-button>
              <a-button size="small" @click="formData.storageLimit = -1">不限制</a-button>
            </a-space>
          </a-form-item>
          <a-form-item label="短信上限" name="smsLimit">
            <a-input
              v-model:value="formData.smsLimit"
              type="number"
              placeholder="请输入条数"
              style="width: 200px"
              addon-after="条"
            />
            <a-space style="margin-left: 10px">
              <a-button size="small" @click="formData.smsLimit = 2000">2000</a-button>
              <a-button size="small" @click="formData.smsLimit = 5000">5000</a-button>
              <a-button size="small" @click="formData.smsLimit = 10000">10000</a-button>
              <a-button size="small" @click="formData.smsLimit = 20000">20000</a-button>
              <a-button size="small" @click="formData.smsLimit = -1">不限制</a-button>
            </a-space>
          </a-form-item>
          <a-form-item label="提醒规则" name="reminderRule">
            <a-radio-group v-model:value="formData.reminderRule">
              <a-radio value="not_limit">不提醒不限制</a-radio>
              <a-radio value="limit_not_remind">提醒不限制</a-radio>
              <a-radio value="remind_limit">提醒且限制</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="项目到期日" name="expiryType">
            <a-radio-group v-model:value="formData.expiryType" @change="handleExpiryTypeChange">
              <a-radio value="limited">限期</a-radio>
              <a-radio value="unlimited">不限制</a-radio>
            </a-radio-group>
            <a-date-picker
              v-model:value="formData.expiryDate"
              show-time
              format="YYYY.MM.DD HH:mm:ss"
              style="margin-left: 10px; width: 200px"
              :disabled="formData.expiryType === 'unlimited'"
            />
          </a-form-item>
        </a-form>
      </div>

      <!-- 步骤3: 功能信息（应用管理） -->
      <div v-show="current === 2 && mode === 'add'" class="step-content">
        <div class="application-content">
          <div class="toolbar">
            <a-button type="primary" @click="handleAddCustomApp">
              <template #icon><plus-outlined /></template>
              新增应用
            </a-button>
          </div>

          <a-table :columns="appColumns" :data-source="formData.applications" :pagination="false" row-key="id">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <a-switch v-model:checked="record.status" :checked-value="1" :unchecked-value="0" />
              </template>
              <template v-if="column.key === 'appIcon'">
                <span style="font-size: 24px">{{ record.appIcon }}</span>
              </template>
              <template v-if="column.key === 'source'">
                <a-tag :color="record.appType === 'system' ? 'blue' : 'green'">
                  {{ record.source }}
                </a-tag>
              </template>
              <template v-if="column.key === 'action'">
                <a-space>
                  <a-button type="link" size="small" @click="handleEditApp(record)">编辑</a-button>
                  <a-button
                    v-if="record.appType === 'custom'"
                    type="link"
                    size="small"
                    danger
                    @click="handleDeleteApp(record)"
                  >
                    删除
                  </a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </div>
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

    <!-- 应用编辑/新增弹窗 -->
    <a-modal
      v-model:open="appModalVisible"
      :title="appModalMode === 'add' ? '新增应用' : '编辑应用'"
      width="600px"
      @ok="handleAppModalOk"
      @cancel="handleAppModalCancel"
    >
      <a-form
        ref="appFormRef"
        :model="appFormData"
        :rules="appFormRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="应用名称" name="appName">
          <a-input v-model:value="appFormData.appName" placeholder="请输入应用名称" />
        </a-form-item>
        <a-form-item label="应用图标" name="appIcon">
          <a-input v-model:value="appFormData.appIcon" placeholder="请输入图标(emoji)" />
        </a-form-item>
        <a-form-item label="是否启用" name="status">
          <a-switch v-model:checked="appFormData.status" :checked-value="1" :unchecked-value="0" />
        </a-form-item>
        <a-form-item label="路由地址" name="routeUrl">
          <a-input
            v-model:value="appFormData.routeUrl"
            placeholder="请输入路由地址"
            :disabled="appModalMode === 'edit' && currentApp?.appType === 'system'"
          />
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="appFormData.remark" placeholder="请输入备注" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 新增管理员账号弹窗 -->
    <a-modal
      v-model:open="accountModalVisible"
      title="新增管理员账号"
      width="500px"
      @ok="handleAccountModalOk"
      @cancel="handleAccountModalCancel"
    >
      <a-form
        ref="accountFormRef"
        :model="accountFormData"
        :rules="accountFormRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="accountFormData.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="姓名" name="nickname">
          <a-input v-model:value="accountFormData.nickname" placeholder="请输入姓名" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-modal>
</template>

<script setup lang="ts">
import { addProject, getProjectDetail, updateProject } from "@/api/modules/project";
import type { Application } from "@/api/types/project";
import { CheckCircleOutlined, PlusOutlined } from "@ant-design/icons-vue";
import type { FormInstance } from "ant-design-vue";
import { message, Modal } from "ant-design-vue";
import dayjs, { Dayjs } from "dayjs";
import { h, reactive, ref, watch } from "vue";

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
const resourceFormRef = ref<FormInstance>();

// 表单数据
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
  cabinetAuth: 2,
  droneAuth: 1,
  storageLimit: 200,
  smsLimit: 1000,
  reminderRule: "not_limit",
  expiryType: "limited" as "limited" | "unlimited",
  expiryDate: dayjs(),
  features: [] as string[],
  applications: [] as Application[]
});

// 管理员账号选项
const adminAccountOptions = ref<{ label: string; value: string }[]>([
  { label: "张三 (zhangsan)", value: "zhangsan" },
  { label: "李四 (lisi)", value: "lisi" },
  { label: "王五 (wangwu)", value: "wangwu" }
]);

// 新增管理员账号相关
const accountModalVisible = ref(false);
const accountFormRef = ref<FormInstance>();
const accountFormData = reactive({
  username: "",
  nickname: ""
});

const accountFormRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  nickname: [{ required: true, message: "请输入姓名", trigger: "blur" }]
};

// 应用管理相关
const appModalVisible = ref(false);
const appModalMode = ref<"add" | "edit">("add");
const appFormRef = ref<FormInstance>();
const currentApp = ref<Application | null>(null);

const appFormData = reactive({
  appName: "",
  appIcon: "",
  status: 1,
  routeUrl: "",
  remark: ""
});

const appFormRules = {
  appName: [{ required: true, message: "请输入应用名称", trigger: "blur" }],
  routeUrl: [{ required: true, message: "请输入路由地址", trigger: "blur" }]
};

const appColumns = [
  { title: "状态", key: "status", dataIndex: "status", width: 80 },
  { title: "应用名称", dataIndex: "appName", width: 150 },
  { title: "应用图标", key: "appIcon", width: 100 },
  { title: "应用来源", key: "source", width: 120 },
  { title: "路由地址", dataIndex: "routeUrl", width: 200 },
  { title: "备注", dataIndex: "remark" },
  { title: "操作", key: "action", width: 150, fixed: "right" }
];

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

const resourceRules = {
  cabinetAuth: [{ required: true, message: "请输入物流柜授权台数", trigger: "blur" }],
  droneAuth: [{ required: true, message: "请输入无人机授权台数", trigger: "blur" }],
  storageLimit: [{ required: true, message: "请输入存储上限", trigger: "blur" }],
  smsLimit: [{ required: true, message: "请输入短信上限", trigger: "blur" }]
};

watch(
  () => props.visible,
  async (val) => {
    if (val) {
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
    console.error("error", error);
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

// 处理到期类型变化
const handleExpiryTypeChange = () => {
  if (formData.expiryType === "unlimited") {
    formData.expiryDate = dayjs("2099-12-31 23:59:59");
  } else {
    formData.expiryDate = dayjs();
  }
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
      expiryDate: (formData.expiryDate as Dayjs).format("YYYY.MM.DD HH:mm:ss"),
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

// 应用管理相关方法
const handleAddCustomApp = () => {
  appModalMode.value = "add";
  currentApp.value = null;
  resetAppForm();
  appModalVisible.value = true;
};

const handleEditApp = (record: Application) => {
  appModalMode.value = "edit";
  currentApp.value = record;
  Object.assign(appFormData, {
    appName: record.appName,
    appIcon: record.appIcon,
    status: record.status,
    routeUrl: record.routeUrl,
    remark: record.remark
  });
  appModalVisible.value = true;
};

const handleDeleteApp = (record: Application) => {
  Modal.confirm({
    title: "确认删除",
    content: `确定要删除应用"${record.appName}"吗？`,
    onOk: () => {
      const index = formData.applications.findIndex((app) => app.id === record.id);
      if (index > -1) {
        formData.applications.splice(index, 1);
        message.success("删除成功");
      }
    }
  });
};

const handleAppModalOk = async () => {
  try {
    await appFormRef.value?.validate();

    if (appModalMode.value === "add") {
      const newApp: Application = {
        id: String(Date.now()),
        appName: appFormData.appName,
        appCode: `custom_${Date.now()}`,
        appIcon: appFormData.appIcon,
        appType: "custom",
        status: appFormData.status,
        routeUrl: appFormData.routeUrl,
        remark: appFormData.remark,
        source: "自定义应用"
      };
      formData.applications.push(newApp);
      message.success("添加成功");
    } else if (currentApp.value) {
      const index = formData.applications.findIndex((app) => app.id === currentApp.value?.id);
      if (index > -1) {
        formData.applications[index] = {
          ...formData.applications[index],
          appName: appFormData.appName,
          appIcon: appFormData.appIcon,
          status: appFormData.status,
          routeUrl:
            currentApp.value.appType === "system" ? formData.applications[index].routeUrl : appFormData.routeUrl,
          remark: appFormData.remark
        };
        message.success("更新成功");
      }
    }

    appModalVisible.value = false;
  } catch (error) {
    console.error("表单验证失败", error);
  }
};

const handleAppModalCancel = () => {
  appModalVisible.value = false;
  resetAppForm();
};

const resetAppForm = () => {
  Object.assign(appFormData, {
    appName: "",
    appIcon: "",
    status: 1,
    routeUrl: "",
    remark: ""
  });
  appFormRef.value?.resetFields();
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

// 新增管理员账号相关方法
const handleAccountModalOk = async () => {
  try {
    await accountFormRef.value?.validate();

    const newAccount = {
      label: `${accountFormData.nickname} (${accountFormData.username})`,
      value: accountFormData.username
    };

    adminAccountOptions.value.push(newAccount);
    formData.adminAccounts.push(accountFormData.username);

    message.success("添加成功");
    accountModalVisible.value = false;
    resetAccountForm();
  } catch (error) {
    console.error("表单验证失败", error);
  }
};

const handleAccountModalCancel = () => {
  accountModalVisible.value = false;
  resetAccountForm();
};

const resetAccountForm = () => {
  Object.assign(accountFormData, {
    username: "",
    nickname: ""
  });
  accountFormRef.value?.resetFields();
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
    cabinetAuth: 2,
    droneAuth: 1,
    storageLimit: 200,
    smsLimit: 1000,
    reminderRule: "not_limit",
    expiryType: "limited",
    expiryDate: dayjs(),
    features: [],
    applications: []
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

  .application-content {
    .toolbar {
      margin-bottom: 16px;
    }
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
