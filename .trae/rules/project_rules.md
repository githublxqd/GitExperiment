# React + TypeScript 项目开发规范

## 1. 核心原则
- **必须** 使用 TypeScript，并启用 `strict` 模式。
- **必须** 使用函数式组件 (Functional Components) 和 Hooks。
- **推荐** 使用 ESLint 和 Prettier 保持代码风格一致。
- **推荐** 每个代码块都应该有注释，注释应该清晰、简洁、准确。

## 2. 组件开发
- 组件文件名和组件名**必须**遵循帕斯卡命名法 (PascalCase)，例如 `UserProfile.tsx`。
- Props **必须**使用 `interface` 定义其 TypeScript 类型，且接口名以 `I` 作为前缀，例如 `interface IUserProfileProps`。
- 样式**必须**使用 CSS Modules (`.module.css`)，以确保样式的局部作用域。
- 组件的文件结构**推荐**采用目录式组织：`components/UserProfile/index.tsx`, `components/UserProfile/UserProfile.module.css`。

## 3. 数据请求
- 客户端数据请求**必须**使用 `SWR` 库进行处理，以实现高效的缓存和状态管理。
- **必须**妥善处理数据请求过程中的 `loading` 和 `error` 状态，并向用户提供清晰的反馈。

## 4. 状态管理
- 全局状态管理**推荐**使用 `Zustand`。
- Store 的创建和使用需遵循 `Zustand` 的最佳实践。

## 5. 代码风格
- 导入顺序**推荐**遵循以下分组：React 相关 -> 外部库 -> 内部绝对路径 (`@/`) -> 相对路径 (`./`, `../`)。
- 所有非简单、非自明的功能函数**必须**包含 JSDoc 注释，解释其功能、参数和返回值。