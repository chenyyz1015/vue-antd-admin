## AdminLayout目录结构

```
src/layouts/
├── admin                           # 主布局组件
│   ├── SideLayout.vue              # 侧边布局
│   ├── MixLayout.vue               # 混合布局
│   ├── TopLayout.vue               # 顶部布局
│   └── components/
│       ├── LayoutHeader/
│       │   ├── index.vue           # 顶部栏主组件
│       │   ├── Breadcrumb.vue      # 面包屑导航
│       │   ├── HeaderActions.vue   # 顶部操作按钮
│       │   └── UserDropdown.vue    # 用户下拉菜单
│       ├── LayoutSider/
│       │   ├── index.vue           # 侧边栏主组件
│       │   ├── Logo.vue            # Logo组件
│       │   └── Menu.vue            # 菜单组件
│       ├── LayoutTabs/
│       │   ├── index.vue           # 标签页主组件
│       │   └── TabsDropdown.vue    # 标签下拉菜单
│       ├── LayoutSettings/
│       │   └── index.vue           # 设置抽屉
│       └── LayoutContent/
│           └── index.vue           # 内容区
├── AdminLayout.vue                 # 主布局
├── AuthLayout.vue                  # 认证布局
├── DefaultLayout.vue               # 默认布局
└── ...
```
