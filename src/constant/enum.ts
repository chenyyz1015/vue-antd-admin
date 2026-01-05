import type { DefaultOptionType } from "ant-design-vue/es/select";

// 用户状态
export const UserStatusMap: Record<string, string> = {
  0: "禁用",
  1: "启用"
};

// 用户状态下拉选项
export const UserStatusOptions: DefaultOptionType[] = Object.entries(UserStatusMap).map(([value, label]) => {
  return { label, value: Number(value) };
});
