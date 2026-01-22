# Solidium

[![Work in Progress][badge-wip]][link-home-page] [![Code Style: Prettier][badge-prettier]][link-prettier] [![Code Linting: ESLint][badge-eslint]][link-eslint] [![License][badge-license]][link-license] [![PRs Welcome][badge-prs]][link-home-page] [![GitHub Issues][badge-issues]][link-issues]

## Core Philosophy

Solidium is built on **separation of concerns** architecture, designed to create clear, maintainable, and testable code.

### Functional Components for Pure Rendering

- Components focus only on UI display and event handling
- No business logic or state management
- Simple, easy to test, with business and UI components testable independently

### Service Layer Encapsulates Business Logic

- All business logic and state encapsulated in Service classes
- Services have reactive properties that automatically update when state changes
- Business logic can be reused across multiple components and services

### Hooks Consume State

- Use `useService` Hook to consume state from IoC container
- Components maintain pure function characteristics, receiving data through dependency injection
- Clear separation between data layer and presentation layer

### IoC Container Manages Dependencies

- Automatic service registration and instantiation
- Built-in lifecycle management (Singleton, Transient, ComponentTree scopes)
- Seamless integration with SolidJS reactive system

This architecture brings the following benefits:

- **Clearer Code** - Clear separation of concerns with single responsibility
- **Easier Testing** - Complete isolation between business logic and UI
- **Better Reusability** - Services can be shared across multiple components
- **Simpler Maintenance** - Clear structure, easy to understand and modify

## Features

- 🏗️ **IoC Container Integration** - Powerful dependency injection system based on `@vgerbot/ioc`
- 🔄 **Reactive Decorators** - `@Auto`, `@Signal`, `@Computed`, `@Observe`, etc.
- 🎣 **React-like Hooks** - Familiar APIs like `useService()`
- 🎯 **Full TypeScript Support** - Compile-time type checking and IntelliSense

## Installation

```bash
npm install @vgerbot/solidium
```

## Quick Start

### 1. Wrap Your App

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

### 2. Create a Service

```tsx
import { Auto } from '@vgerbot/solidium';

@Auto
export class CounterService {
    count: number = 0;
    
    increment() {
        this.count++;
    }
}
```

### 3. Use in Components

```tsx
import { useService } from '@vgerbot/solidium';
import { CounterService } from './CounterService';

function CounterDisplay() {
    const service = useService(CounterService);
    
    return (
        <p>Count: {service.count}</p>
    );
}

function Counter() {
    const service = useService(CounterService);
    return <button onClick={() => service.increment()}>+</button>
}
```

Simple and effective! The `@Auto` decorator automatically converts the `count` property into a reactive signal. When `count` changes, all components using this service will automatically update. You can completely encapsulate business logic in services, while components only handle rendering and event processing.

## More Features

- `@Signal()` - Manually convert properties to signals
- `@Computed` - Create computed properties with automatic caching and dependency tracking
- `@Observe()` - Watch state changes and execute side effects
- `@Store` - Convert classes to SolidJS Store
- `@Batch` - Batch updates for performance optimization

For detailed documentation, please refer to [Documentation][link-docs].

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue. For pull requests, please follow our [contribution guidelines][link-guidelines].

## License

This project is licensed under the [MIT License][link-license].

## Related Projects

- [@vgerbot/ioc](https://github.com/vgerbot-libraries/ioc) - The IoC container powering Solidium
- [SolidJS](https://solidjs.com/) - The reactive framework Solidium is built for

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
[link-docs]:TODO
[link-guidelines]:TODO
