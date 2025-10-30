# Solidium

[![Work in Progress][badge-wip]][link-home-page] [![Code Style: Prettier][badge-prettier]][link-prettier] [![Code Linting: ESLint][badge-eslint]][link-eslint] [![License][badge-license]][link-license] [![PRs Welcome][badge-prs]][link-home-page] [![GitHub Issues][badge-issues]][link-issues]

## 核心思想

Solidium 基于**关注点分离**架构设计，旨在构建清晰、可维护、可测试的代码

### 函数组件专注纯渲染

- 组件只关注 UI 展示和事件输入
- 不包含业务逻辑和状态管理
- 简洁、易于测试，业务和UI组件可独立测试

### 服务层封装业务逻辑

- 所有业务逻辑和业务状态封装在 Service 类中
- 服务支持响应式特性，状态变化时自动更新视图
- 业务逻辑可以在多个组件以及服务间复用

### Hook 消费状态

- 使用 `useService` Hook 从 IoC 容器中消费状态
- 组件保持纯函数特性，通过依赖注入接收数据
- 数据层与展示层清晰分离

### IoC 容器管理依赖

- 自动服务注册和实例化
- 内置生命周期管理（单例、瞬态、组件树作用域）
- 与 SolidJS 响应式系统无缝集成

这种架构确保你的代码：

- **清晰** - 关注点分离明确
- **可测试** - 业务逻辑与 UI 隔离
- **可复用** - 服务可在组件间共享
- **可维护** - 易于理解和修改

## 特性

- 🏗️ **IoC 容器集成** - 基于 `@vgerbot/ioc` 的强大依赖注入系统
- 🔄 **响应式装饰器** - `@Auto`、`@Signal`、`@Computed`、`@Observe` 等
- 🎣 **React 风格 Hooks** - `useService()` 等熟悉的 API
- 🎯 **完整 TypeScript 支持** - 编译时类型检查和智能提示

## 安装

```bash
npm install @vgerbot/solidium
```

## 快速开始

### 1. 包装应用

```tsx
import { Solidium } from '@vgerbot/solidium';

function App() {
    return (
        <Solidium>
            <YourComponents />
        </Solidium>
    );
}
```

### 2. 创建服务

```ts
import { Auto } from '@vgerbot/solidium';

@Auto
export class CounterService {
    count: number = 0;
    
    increment() {
        this.count++;
    }
}
```

### 3. 在组件中使用

```tsx
import { useService } from '@vgerbot/solidium';
import { CounterService } from './CounterService';

function CounterDisplay() {
    const service = useService(CounterService);
    
    return (
        <p>计数: {service.count}</p>
    );
}

function Counter() {
    const service = useService(CounterService);
    return <button onClick={() => service.increment()}>+</button>
}
```

就这么简单！`@Auto` 装饰器会自动将 `count` 属性转换为响应式信号。当 `count` 变化时，所有使用该服务的组件都会自动更新。你可以将业务逻辑完全封装在服务中，组件只负责渲染和事件处理。

## 更多功能

- `@Signal()` - 手动将属性转换为信号
- `@Computed` - 创建计算属性，自动缓存和依赖追踪
- `@Observe()` - 监听状态变化，执行副作用
- `@Store` - 将类转换为 SolidJS Store
- `@Batch` - 批量更新，优化性能

详细文档请参考 [文档][link-docs]。

## 贡献

欢迎贡献！如果你发现了 bug 或有功能请求，请开启 issue。对于 pull request，请遵循我们的[贡献指南][link-guidelines]。

## 许可证

本项目采用 [MIT 许可证][link-license]。

## 相关项目

- [@vgerbot/ioc](https://github.com/vgerbot-libraries/ioc) - Solidium 的 IoC 容器
- [SolidJS](https://solidjs.com/) - Solidium 基于的响应式框架

[badge-wip]:https://img.shields.io/badge/Status-WIP-yellow?style=for-the-badge
[badge-prettier]:https://img.shields.io/badge/Code%20Style-Prettier-ff69b4?style=for-the-badge
[badge-eslint]:https://img.shields.io/badge/Code%20Linting-ESLint-4B32C3?style=for-the-badge
[badge-license]:https://img.shields.io/badge/License-MIT-green?style=for-the-badge
[badge-prs]:https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge
[badge-issues]:https://img.shields.io/github/issues/vgerbot-libraries/solidium?style=for-the-badge

[link-home-page]:https://github.com/vgerbot-libraries/solidium
[link-issues]:https://github.com/vgerbot-libraries/solidium/issues
[link-license]:./LICENSE
[link-eslint]:https://eslint.org/
[link-prettier]:https://prettier.io/
[link-guidelines]:/#TODO
[link-docs]:./#TODO
