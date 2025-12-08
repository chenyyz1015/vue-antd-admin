<template>
  <page-container title="用户管理">
    <template #extra>
      <a-button v-permission="['system:user:add']" type="primary" @click="handleAdd">
        <plus-outlined />
        新增
      </a-button>
    </template>

    <a-form layout="inline" style="margin-bottom: 16px">
      <a-form-item label="用户名">
        <a-input v-model:value="searchForm.username" placeholder="请输入" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleSearch">查询</a-button>
        <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
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
        <template v-if="column.key === 'action'">
          <a-space>
            <a v-permission="['system:user:edit']" @click="handleEdit(record)">编辑</a>
            <a-popconfirm title="确认删除?" @confirm="handleDelete(record.id)">
              <a v-permission="['system:user:delete']" class="text-red">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
  </page-container>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { getUserList, deleteUser } from "@/api/modules/system";
import { useTable } from "@/composables/useTable";
import { message } from "ant-design-vue";

const searchForm = reactive({
  username: ""
});

const columns = [
  { title: "ID", dataIndex: "id", key: "id" },
  { title: "用户名", dataIndex: "username", key: "username" },
  { title: "昵称", dataIndex: "nickname", key: "nickname" },
  { title: "状态", dataIndex: "status", key: "status" },
  { title: "创建时间", dataIndex: "createTime", key: "createTime" },
  { title: "操作", key: "action", width: 200 }
];

const { loading, dataSource, pagination, fetchData, handleTableChange, refresh } = useTable(getUserList);

const handleSearch = () => {
  refresh();
};

const handleReset = () => {
  searchForm.username = "";
  refresh();
};

const handleAdd = () => {
  // 打开新增弹窗
};

const handleEdit = (record: any) => {
  // 打开编辑弹窗
};

const handleDelete = async (id: string) => {
  try {
    await deleteUser(id);
    message.success("删除成功");
    refresh();
  } catch (error) {
    message.error("删除失败");
  }
};

fetchData();
</script>
