# Solidium

[![npm version](https://badge.fury.io/js/%40vgerbot%2Fsolidium.svg)](https://www.npmjs.com/package/@vgerbot/solidium)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A state management library for SolidJS that leverages the power of Inversion of Control (IoC) to provide a robust and flexible solution. With a primary focus on promoting the separation of UI and logic, Solidium empowers SolidJS developers to achieve cleaner, more maintainable code.

## Features

- 🏗️ **IoC Container Integration**: Built on top of `@vgerbot/ioc` for powerful dependency injection
- 🔄 **Reactive Decorators**: Easy-to-use decorators for reactive state management
- 📊 **Signal Support**: Automatic signal creation with `@Signal()` and `@Auto` decorators
- 🧮 **Computed Properties**: Efficient computed values with `@Computed` decorator
- 👁️ **Observation**: Watch state changes with `@Observe()` decorator
- 🏪 **Store Integration**: Seamless SolidJS store integration with `@Store` decorator
- 🎯 **Batch Updates**: Optimize performance with `@Batch` decorator
- 🎣 **React-like Hooks**: Familiar hooks API for component integration

## Installation

```bash
npm install @vgerbot/solidium
# or
yarn add @vgerbot/solidium
# or
pnpm add @vgerbot/solidium
```

## Quick Start

### 1. Wrap your app with Solidium provider

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

### 2. Create a service with reactive state

```tsx
import { Auto, Signal, Computed, Observe } from '@vgerbot/solidium';

@Auto
export class CounterService {
    @Signal()
    count: number = 0;

    @Computed()
    get doubled() {
        return this.count * 2;
    }

    increment() {
        this.count++;
    }

    decrement() {
        this.count--;
    }

    @Observe()
    logChanges() {
        console.log('Count changed:', this.count);
    }
}
```

### 3. Use the service in your components

```tsx
import { useService } from '@vgerbot/solidium';
import { CounterService } from './CounterService';

function Counter() {
    const service = useService(CounterService);
    
    return (
        <div>
            <p>Count: {service.count}</p>
            <p>Doubled: {service.doubled}</p>
            <button onClick={() => service.increment()}>+</button>
            <button onClick={() => service.decrement()}>-</button>
        </div>
    );
}
```

## API Reference

### Core Components

#### `Solidium`

The root provider component that sets up the IoC container.

```tsx
interface SolidiumProps {
    init?: (appCtx: ApplicationContext) => void;
    autoRegisterClasses?: Array<Newable<unknown>>;
    children?: JSX.Element;
}

<Solidium 
    init={(ctx) => {
        // Initialize your services
    }}
    autoRegisterClasses={[MyService]}
>
    <App />
</Solidium>
```

### Decorators

#### `@Signal(options?: SignalOptions)`

Transforms a property into a SolidJS signal.

```tsx
class MyService {
    @Signal()
    count: number = 0;
}
```

#### `@Auto`

Automatically transforms all properties into signals when accessed.

```tsx
@Auto
class MyService {
    count: number = 0;  // Automatically becomes a signal
    name: string = '';  // Automatically becomes a signal
}
```

#### `@Computed`

Creates a computed property that automatically updates when dependencies change.

```tsx
class MyService {
    @Signal()
    count: number = 0;

    @Computed()
    get doubled() {
        return this.count * 2;
    }
}
```

#### `@Observe(options?: ObserveOptions)`

Watches for changes and executes the method when dependencies change.

```tsx
class MyService {
    @Signal()
    count: number = 0;

    @Observe()
    logChanges() {
        console.log('Count changed:', this.count);
    }

    @Observe({ deps: [() => this.count] })
    onCountChange() {
        // Only runs when count changes
    }
}
```

#### `@Store`

Creates a SolidJS store from the class instance.

```tsx
@Store()
class MyStore {
    private items: Item[] = [];
    private filter: string = '';
    
    addItem(item: Item) {
        this.items.push(item);
    }
}
```

#### `@Batch`

Batches multiple signal updates into a single update cycle.

```tsx
class MyService {
    @Signal()
    count: number = 0;

    @Batch()
    updateMultiple() {
        this.count++;
        this.count++;
        this.count++;
        // All updates are batched together
    }
}
```

### Hooks

#### `useService<T>(serviceClass: Newable<T>): T`

Retrieves a service instance from the IoC container.

```tsx
function MyComponent() {
    const service = useService(MyService);
    return <div>{service.count}</div>;
}
```

## Advanced Usage

### Custom Initialization

```tsx
function App() {
    return (
        <Solidium 
            init={(ctx) => {
                ctx.registerInstAwareProcessor(class CustomInstanceAwareProcessor {
                    afterInstantiation(instance: object) {
                        //
                    }
                })
            }}
        >
            <MyApp />
        </Solidium>
    );
}
```

### autoRegisterClasses

The `autoRegisterClasses` prop allows you to automatically register and initialize service classes or extensions when the Solidium provider starts up. This is particularly useful for loading extensions and plugins that need to be available throughout your application.

```tsx
import { Persistence } from '@vgerbot/persistence';

function App() {
    return (
        <Solidium 
            autoRegisterClasses={[
                // Register persistence extension
                Persistence.default({
                    driver: 'localStorage',
                    namespace: 'myapp'
                }),
                // Register other extensions or services
                MyGlobalService,
                AnotherExtension
            ]}
        >
            <MyApp />
        </Solidium>
    );
}
```

Common use cases for `autoRegisterClasses`:

- **Extensions**: Loading Solidium extensions like persistence, logging, or analytics
- **Global Services**: Services that need to be initialized early in the application lifecycle
- **Plugins**: Third-party or custom plugins that extend Solidium's functionality
- **Middleware**: Custom middleware that processes instances during creation

#### Example with Custom Extension

```tsx
import { createFactory } from '@vgerbot/ioc';
const DEFAULT_LOGGING_CONFIGURATION = 'DEFAULT-LOGGING-CONFIGURATION';
type LoggingLevel = 'debug' | 'info' | 'warn' | 'error';
enum LoggingLevel {
    debug,
    info,
    warn,
    error
}
class LoggingExtension {
    static config(config: {
        level: LoggingLevel
    }) {
        return createFactory(DEFAULT_LOGGING_CONFIGURATION, config, LoggingExtension);
    }
    constructor() {
        console.log('Logging extension initialized');
    }
    @Inject(DEFAULT_LOGGING_CONFIGURATION)
    private config!: { level: LoggingLevel };
    info(msg: string) {
        if(this.config.level < LoggingLevel.info) {
            return ;
        }
        // do log
    }
}

function App() {
    return (
        <Solidium 
            autoRegisterClasses={[
                LoggingExtension,
                // Other extensions...
            ]}
        >
            <MyApp />
        </Solidium>
    );
}
```

### Scoped Services

```tsx
import { ComponentTreeScope } from '@vgerbot/solidium';

@ComponentTreeScope
class LocalService {
    // This service is scoped to component tree
}
```

### Working with Stores

```tsx
@Store()
class TodoStore {
    private todos: Todo[] = [];
    private filter: 'all' | 'active' | 'completed' = 'all';

    get filteredTodos() {
        return this.todos.filter(todo => {
            switch (this.filter) {
                case 'active': return !todo.completed;
                case 'completed': return todo.completed;
                default: return true;
            }
        });
    }

    addTodo(text: string) {
        this.todos.push({ id: Date.now(), text, completed: false });
    }
}
```

## Examples

Check out the [examples directory](https://github.com/vgerbot-libraries/solidium/tree/main/packages/examples) for more comprehensive examples:

- **Counter**: Basic counter with reactive state
- **Todo List**: Complex state management with stores
- **Chat Application**: Real-time updates with observers

## TypeScript Support

Solidium is written in TypeScript and provides full type safety:

```tsx
interface User {
    id: number;
    name: string;
    email: string;
}

@Auto
class UserService {
    users: User[] = [];
    selectedUser: User | null = null;

    @Computed()
    get selectedUserName(): string {
        return this.selectedUser?.name ?? 'No user selected';
    }
}
```

## Performance Considerations

- Use `@Batch` for methods that update multiple signals
- Prefer `@Computed` over regular getters for expensive calculations
- Use `@Observe` with dependency arrays for targeted reactivity
- Consider using `@Store` for complex nested state

## Contributing

Contributions are welcome! Please read our [contributing guidelines](https://github.com/vgerbot-libraries/solidium/blob/main/CONTRIBUTING.md) and feel free to submit pull requests.

## License

MIT © [ChienHsin Yang](https://github.com/y1j2x34)

## Related Projects

- [@vgerbot/ioc](https://github.com/vgerbot-libraries/ioc) - The IoC container powering Solidium
- [SolidJS](https://solidjs.com/) - The reactive framework Solidium is built for
