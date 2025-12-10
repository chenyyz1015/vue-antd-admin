import type { TableProps } from "ant-design-vue";
import { reactive, ref } from "vue";

export const useTable = <T = any>(api: (params: any) => Promise<any>) => {
  const loading = ref(false);
  const dataSource = ref<T[]>([]);
  const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条`
  });

  const fetchData = async (params = {}) => {
    loading.value = true;
    try {
      const res = await api({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...params
      });
      dataSource.value = res.records;
      pagination.total = res.total;
    } catch (error) {
      console.error("获取数据失败:", error);
    } finally {
      loading.value = false;
    }
  };

  const handleTableChange: TableProps["onChange"] = (pag) => {
    pagination.current = pag.current!;
    pagination.pageSize = pag.pageSize!;
    fetchData();
  };

  const refresh = () => {
    pagination.current = 1;
    fetchData();
  };

  return {
    loading,
    dataSource,
    pagination,
    fetchData,
    handleTableChange,
    refresh
  };
};
