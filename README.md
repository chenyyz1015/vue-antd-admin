## 技术栈说明

### 核心框架

- **Vite 5.x** - 下一代前端构建工具，快速的冷启动
- **Vue 3.4+** - 渐进式JavaScript框架（Composition API）
- **TypeScript 5.x** - JavaScript的超集，提供类型安全

### UI与样式

- **Ant Design Vue 4.x** - 企业级UI组件库
- **UnoCSS** - 即时按需的原子化CSS引擎
- **Sass** - CSS预处理器

### 状态与路由

- **Pinia 2.x** - 新一代状态管理库
- **Vue Router 4.x** - Vue官方路由
- **Pinia Plugin Persistedstate** - Pinia持久化插件

### 网络与工具

- **Axios 1.x** - HTTP客户端
- **Vue I18n 9.x** - 国际化插件
- **Day.js** - 轻量级日期处理
- **Lodash-es** - 工具函数库
- **NProgress** - 进度条

### 开发工具

- **ESLint 9.x** - 代码检查（扁平化配置）
- **Prettier** - 代码格式化
- **Husky** - Git钩子
- **Commitlint** - 提交信息规范
- **Lint-staged** - 暂存区文件检查

---

## 最佳实践

### 提交规范

```bash
# 新功能
git commit -m "feat: 添加用户管理模块"

# 修复bug
git commit -m "fix: 修复登录失败问题"

# 文档
git commit -m "docs: 更新README"

# 样式
git commit -m "style: 调整按钮样式"

# 重构
git commit -m "refactor: 重构权限模块"

# 性能优化
git commit -m "perf: 优化表格渲染"

# 测试
git commit -m "test: 添加单元测试"

# 构建
git commit -m "chore: 升级依赖版本"
```

### 开发规范

1. **组件命名**: PascalCase，至少两个单词
2. **文件命名**: kebab-case
3. **变量命名**: camelCase
4. **常量命名**: UPPER_SNAKE_CASE
5. **类型定义**: 使用TypeScript类型
6. **注释**: 复杂逻辑添加注释
7. **代码复用**: 使用Composables

---

## 项目完整结构

```
vue-antd-admin/
├── .husky/                             # Git hooks
│   ├── commit-msg
│   └── pre-commit
├── .vscode/                            # vscode项目配置
│   └── ...
├── build/                              # 打包配置
│   └── ...
├── public/
│   └── favicon.ico
├── src/
│   ├── api/                            # API接口
│   │   ├── modules/
│   │   │   ├── user.ts
│   │   │   ├── system.ts
│   │   │   └── ...
│   │   ├── types/
│   │   └── index.ts
│   ├── assets/                         # 静态资源
│   │   ├── svgs/                       # SVG图标
│   │   ├── fonts/                      # 字体
│   │   ├── images/                     # 图片
│   │   ├── videos/                     # 视频
│   │   ├── audios/                     # 音频
│   │   └── ...
│   ├── styles/
│   │   ├── index.scss
│   │   ├── reset.scss
│   │   ├── variables.scss
│   │   ├── mixins.scss
│   │   └── ...
│   ├── components/                     # 全局组件
│   │   └── ...
│   ├── composables/                    # 组合式函数
│   │   ├── usePermission.ts
│   │   └── ...
│   ├── directives/                     # 自定义指令
│   │   ├── modules/
│   │   │   ├── permission.ts
│   │   │   ├── role.ts
│   │   │   └── ...
│   │   └── index.ts
│   ├── layouts/                        # 布局
│   │   ├── AdminLayout.vue
│   │   ├── AuthLayout.vue
│   │   ├── DefaultLayout.vue
│   │   └── ...
│   ├── locales/                        # 国际化
│   │   ├── lang/
│   │   │   ├── zh-CN.ts
│   │   │   └── en-US.ts
│   │   │   └── ...
│   │   └── index.ts
│   ├── router/                         # 路由
│   │   ├── modules/
│   │   │   ├── dynamic                 # 动态路由
│   │   │   └── static                  # 静态路由
│   │   ├── guard.ts
│   │   └── index.ts
│   ├── stores/                         # 状态管理
│   │   ├── modules/
│   │   │   ├── user.ts
│   │   │   ├── app.ts
│   │   │   ├── permission.ts
│   │   │   └── ...
│   │   └── index.ts
│   ├── types/                          # 类型定义
│   │   ├── vite.env.d.ts
│   │   ├── router.d.ts
│   │   ├── svg-component-global.d.ts
│   │   ├── svg-component.d.ts
│   │   ├── auto-imports.d.ts
│   │   ├── components.d.ts
│   │   └── ...
│   ├── utils/                          # 工具函数
│   │   ├── storage.ts
│   │   ├── auth.ts
│   │   ├── permission.ts
│   │   └── ...
│   ├── views/                          # 页面
│   │   └── ...
│   ├── App.vue
│   ├── main.ts
│   └── ...
├── .editorconfig
├── .env.development
├── .env.production
├── .env.staging
├── .env.test
├── .gitignore
├── .prettierrc.json
├── .prettierignore
├── commitlint.config.ts
├── eslint.config.ts
├── index.html
├── package.json
├── README.md
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── uno.config.ts
└── vite.config.ts
```
