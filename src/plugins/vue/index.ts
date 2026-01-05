import type { Plugin } from "vue";
import setupComponents from "./components";
import setupDirectives from "./directives";
import setupGlobal from "./global";

const setupVuePlugins: Plugin = {
  install: (app) => {
    setupGlobal(app);
    setupComponents(app);
    setupDirectives(app);
  }
};

export default setupVuePlugins;
