# 在线点餐系统（Vue 3 入门演示）

一个纯前端的餐饮点餐与管理系统演示项目，基于 Vue 3 + Vite + Element Plus。项目通过本地 `localStorage` 模拟后端数据，涵盖登录注册、点餐流程、订单管理、餐桌管理、用户管理等核心功能，适合 Vue 新手学习与展示。

## 功能概览

- 登录 / 注册（角色区分：管理员 / 顾客）
- 首页餐桌选择，点餐并生成订单
- 订单列表、订单状态流转、结算
- 餐桌信息管理、餐品信息管理
- 用户管理与个人资料维护
- 基于 Element Plus 的统一 UI 风格

## 在线演示

- 演示地址：https://jupiter-amor.github.io/vue-project-canteen

  点击上述链接即可在线预览

## 默认账号

| 角色               | 账号  | 密码     |
| ------------------ | ----- | -------- |
| 管理员（不能点餐） | admin | admin123 |
| 顾客               | user1 | user123  |
| 顾客               | user2 | user123  |

## 技术栈

- Vue 3
- Vite 4
- Vue Router 4
- Element Plus
- Sass
- Axios（仅做请求封装，实际使用本地模拟数据）

## 快速开始

### 1) 安装依赖

```bash
npm install
```

### 2) 本地启动

```bash
npm run dev
```

默认地址：`http://localhost:5173`

### 3) 打包构建

```bash
npm run build
```

### 4) 本地预览构建产物

```bash
npm run preview
```

## 数据说明（Mock）

项目使用本地 `localStorage` 模拟后端数据库：

- `canteen-mock-data`：系统模拟数据（用户、餐桌、餐品、订单）
- `canteen-user`：当前登录用户

如需重置数据，可在浏览器控制台执行：

```js
localStorage.clear()
```

## 目录结构（简版）

```
src/
  assets/
    css/
    imgs/
  router/
    index.js
  utils/
    request.js
  views/
    Login.vue
    Register.vue
    Welcome.vue
    Manager.vue
    manager/
      Home.vue
      Order.vue
      OrderManager.vue
      Foods.vue
      Tables.vue
      User.vue
      Admin.vue
      Person.vue
      ...
  App.vue
  main.js
```

## 亮点实现

- 使用 `localStorage` 完整模拟后端增删改查
- 基于角色的菜单权限展示
- 点餐流程：选桌 -> 加入菜品 -> 下单 -> 结算
- 订单状态的流转与可视化

## 常见问题

- **为什么刷新页面数据还在？**
  因为数据保存在 `localStorage` 中，可通过 `localStorage.clear()` 重置。

- **这个项目需要后端吗？**
  不需要，所有数据都是本地模拟。

## 如果想用本项目并计划改进，方向可为

- 增加真实后端接口版本
- 支持图片上传与菜品分类筛选
- 增加权限路由守卫
