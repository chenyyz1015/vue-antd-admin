import router from "@/router";
import { useUserStore } from "@/stores";
import { message } from "ant-design-vue";
import { HTTP_STATUS_MAP } from "./constant";

/**
 * 获取错误消息
 * @param {string|number} status HTTP状态码
 * @param {string} customMsg 自定义消息
 * @returns 错误消息
 */
export const handleErrorMessage = (status: string | number, customMsg?: string): void => {
  const { t } = useI18n();
  if (customMsg) {
    message.error(customMsg);
  } else {
    const i18nKey = HTTP_STATUS_MAP[status] || HTTP_STATUS_MAP.unknown;
    message.error(t(i18nKey));
  }
};

/**
 * 处理未授权错误
 */
export const handleUnauthorized = (): void => {
  const { t } = useI18n();
  message.error(t(HTTP_STATUS_MAP[401]));
  const userStore = useUserStore();
  userStore.logout();
  router.push("/login");
};
