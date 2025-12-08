import type { RolldownOptions } from "rolldown";
import path from "path";

/** 从 node_modules 路径提取 package 名（用于动态 chunk 名） */
const extractPackageName = (id: string): string | null => {
  const m = id.match(/[\\/]node_modules[\\/](?:@([^\\/]+)[\\/])?([^\\/]+)([\\/]|$)/);
  if (!m) return null;
  // 保证 @scope/name -> scope_name
  return (m[1] ? `${m[1]}_${m[2]}` : m[2]).replace(/[^\w\-_.]/g, "_");
};

const rOpts: RolldownOptions = {
  output: {
    minify: {
      compress: {
        dropConsole: process.env.NODE_ENV === "production",
        dropDebugger: process.env.NODE_ENV === "production"
      }
    },
    advancedChunks: {
      // 是否把被匹配模块的依赖也一并包含在同一chunk
      includeDependenciesRecursively: true,
      // 全局最小 chunk 大小（bytes）
      // 对 SPA 可留 0 或小值；若想避免过多小文件可调高此值（如 5*1024）
      minSize: 0,
      // 分包策略
      groups: [
        /**
         * group: core
         * 目的：把 Vue 运行时、路由、状态管理、i18n、vueuse 等视为“框架核心”，单独缓存。
         * 适用场景：大多数页面都会共同依赖这些库，单独缓存可提升首屏缓存命中。
         */
        {
          name: "core",
          // 匹配 vue、vue-router、pinia、vue-i18n、@vueuse/core
          test: /node_modules[\\/](vue|vue-router|pinia|vue-i18n|@vueuse[\\/]|@vueuse-core)/,
          priority: 50,
          minSize: 0,
          maxSize: 300 * 1024, // 若超 300KB，可拆分
          minModuleSize: 0,
          minShareCount: 1 // SPA 单入口通常设 1，否则不会抽取
        },
        /**
         * group: ui
         * 目的：把 UI 库（ant-design-vue）单独拆出来——UI 框架常更新频率低，适合单独缓存
         */
        {
          name: "ui",
          test: /node_modules[\\/](ant-design-vue)([\\/]|$)/,
          priority: 45,
          minSize: 0,
          maxSize: 400 * 1024,
          minModuleSize: 0,
          minShareCount: 1
        },
        /**
         * group: libs
         * 目的：把大型 / 经常单独更新的库（lodash-es、axios、dayjs 等）分别抽包以便更细粒度缓存
         * 实现：通过动态 name 函数为指定包生成 pkg_xxx 的 chunk
         */
        {
          name: (id: string) => {
            const pkg = extractPackageName(id);
            if (!pkg) return null;
            // 为这些常见库生成单独包
            if (/^(lodash-es|axios|dayjs)$/.test(pkg)) return `pkg_${pkg}`;
            return null;
          },
          test: /node_modules[\\/]/,
          priority: 40,
          minSize: 0,
          maxSize: 300 * 1024,
          minModuleSize: 0,
          minShareCount: 1
        },
        /**
         * group: vendor-common
         * 目的：兜底第三方依赖（除了上面高优先级已捕获的）
         * - 只把被多个模块共享且达到一定体量的第三方依赖剥离出来
         */
        {
          name: "vendor",
          test: /node_modules[\\/]/,
          priority: 20,
          // 防止生成很多 tiny chunk：小于 10KB 的组内 chunk 不会单独输出
          minSize: 10 * 1024,
          maxSize: 600 * 1024,
          minModuleSize: 1 * 1024,
          // 如果你是单入口 SPA，并且希望尽量抽出第三方 lib，设为 1；
          // 若是多入口或想减少请求数可设为 2（仅当模块被>=2个 entry 引用才抽出）
          minShareCount: 1
        },
        /**
         * group: utils
         * 目的：把项目内的 utils / common 工具函数拆成单个 chunk，便于复用和缓存
         */
        {
          name: "utils",
          test: (id: string) =>
            id.includes(`${path.sep}src${path.sep}utils${path.sep}`) ||
            id.includes(`${path.sep}src${path.sep}common${path.sep}`),
          priority: 15,
          minSize: 2 * 1024,
          maxSize: 100 * 1024,
          minModuleSize: 0,
          minShareCount: 1
        }
        /**
         * 可选：按页面或按目录分包（示例）
         * 如果你有明显的 feature 目录并想对其做按需加载，可以写类似下面的规则。
         * 注意 priority 应低于 framework/ui/vendor 的优先级。
         */
        /*
            {
              name: 'feature-orders',
              test: id => id.includes(`${path.sep}src${path.sep}pages${path.sep}orders${path.sep}`),
              priority: 8,
              minSize: 5 * 1024,
              maxSize: 200 * 1024,
              minShareCount: 1
            }
            */
      ]
    }
  }
};

export default rOpts;
