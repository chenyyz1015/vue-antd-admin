<template>
  <div class="role-page">
    <a-card>
      <template #extra>
        <a-button v-permission="['system:role:add']" type="primary" @click="handleAdd">
          <plus-outlined />
          新增
        </a-button>
      </template>

      <a-form layout="inline" style="margin-bottom: 16px">
        <a-form-item label="角色名称">
          <a-input v-model:value="searchForm.roleName" placeholder="请输入" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">
              <search-outlined />
              查询
            </a-button>
            <a-button @click="handleReset">
              <reload-outlined />
              重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>

      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 1 ? 'success' : 'error'">
              {{ record.status === 1 ? "正常" : "禁用" }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a v-permission="['system:role:edit']" @click="handleEdit(record)"> 编辑 </a>
              <a-popconfirm title="确认删除?" @confirm="handleDelete(record.id)">
                <a v-permission="['system:role:delete']" class="text-red"> 删除 </a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import request from "@/api/request";
import { useTable } from "@/composables/useTable";
import { PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { reactive } from "vue";

const searchForm = reactive({
  roleName: ""
});

const columns = [
  { title: "ID", dataIndex: "id", key: "id", width: 80 },
  { title: "角色名称", dataIndex: "roleName", key: "roleName" },
  { title: "角色编码", dataIndex: "roleCode", key: "roleCode" },
  { title: "状态", dataIndex: "status", key: "status", width: 100 },
  { title: "创建时间", dataIndex: "createTime", key: "createTime", width: 180 },
  { title: "操作", key: "action", width: 180, fixed: "right" }
];

const getRoleList = (params: any) => {
  return request({
    url: "/system/role/list",
    method: "get",
    params
  });
};

const { loading, dataSource, pagination, fetchData, handleTableChange, refresh } = useTable(getRoleList);

const handleSearch = () => {
  refresh();
};

const handleReset = () => {
  searchForm.roleName = "";
  refresh();
};

const handleAdd = () => {
  message.info("新增功能开发中...");
};

const handleEdit = (record: any) => {
  message.info("编辑功能开发中...");
  console.log("handleEdit", record);
};

const handleDelete = async (id: string) => {
  try {
    await request({
      url: `/system/role/delete/${id}`,
      method: "delete"
    });
    message.success("删除成功");
    refresh();
  } catch (error) {
    console.error("handleDelete error", error);
  }
};

fetchData();
</script>

<style scoped lang="scss">
.role-page {
  .text-red {
    color: #ff4d4f;
  }
}
</style>
