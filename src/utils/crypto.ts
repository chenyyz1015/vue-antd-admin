import { sm4 } from "sm-crypto";

// 密码加密密钥 - 使用固定密钥用于密码加密
const PASSWORD_ENCRYPT_KEY = "VueAntdAdminPasswordKeySecretKey";

/**
 * 加密函数
 * @param {string} word 明文
 * @returns {string}
 */
export const encrypt = (word: string): string => {
  try {
    // 生成16位密钥
    // 确保密钥长度为32位
    const codeKey = PASSWORD_ENCRYPT_KEY.split("")
      .reduce((codeKey, k) => {
        return (codeKey += k.charCodeAt(0).toString(16).padStart(2, "0"));
      }, "")
      .substring(0, 32);
    return sm4.encrypt(word, codeKey);
  } catch (error) {
    console.error("加密失败:", error);
    return word; // 加密失败时返回原文本
  }
};

/**
 * 解密函数
 * @param {string} encryptedWord 密文
 * @returns {string}
 */
export const decrypt = (encryptedWord: string): string => {
  try {
    // 生成16位密钥
    // 确保密钥长度为32位
    const codeKey = PASSWORD_ENCRYPT_KEY.split("")
      .reduce((codeKey, k) => {
        return (codeKey += k.charCodeAt(0).toString(16).padStart(2, "0"));
      }, "")
      .substring(0, 32);
    return sm4.decrypt(encryptedWord, codeKey);
  } catch (error) {
    console.error("解密失败:", error);
    return encryptedWord; // 解密失败时返回原密文
  }
};
