import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;

export * from "./modules/app";
export * from "./modules/download";
export * from "./modules/permission";
export * from "./modules/tabs";
export * from "./modules/user";
