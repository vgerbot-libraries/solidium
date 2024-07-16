# Solidium

[![Work in Progress][badge-wip]][link-home-page] [![Code Style: Prettier][badge-prettier]][link-prettier] [![Code Linting: ESLint][badge-eslint]][link-eslint] [![License][badge-license]][link-license] [![PRs Welcome][badge-prs]][link-home-page] [![GitHub Issues][badge-issues]][link-issues]

## Intruduction

**Solidum** is a powerful and comprehensive development toolkit designed specifically for SolidJS, aiming to enhance development efficiency and code maintainability. Inspired by Angular, Solidium integrates advanced features such as IoC (Inversion of Control), annotations, services, and AOP (Aspect-Oriented Programming) to help developers build and maintain complex applications.

### Core Concepts

Solidium's design philosophy is similar to Angular, particularly in the way it handles dependency injection, annotations, and service layers. These core features enable developers to create modular, maintainable, and testable applications:

1. **Inversion of Control (IoC) and Dependency Injection:**
    Solidium provides a robust dependency injection mechanism, making the dependencies between components and services clearer and more manageable. With decorator-based configuration, developers can easily define and inject dependencies, improving code testability and modularity.
1. **Decorator System**:
    Solidium's decorator system allows developers to implement features such as signals, storage, and HTTP requests using simple decorator syntax.
1. **Service Layer:**
    Solidium emphasizes a service-oriented architecture where business logic and data management are encapsulated within services. This is similar to Angular's approach, ensuring that business logic is separated from the UI components, promoting code reuse and modularity.
1. **Aspect-Oriented Programming (AOP):**
    Solidium offers comprehensive AOP support, allowing developers to define aspects and pointcuts through annotations. This enables the addition of features such as logging, performance monitoring, and security checks without altering the core business logic.

### Development Principles

Solidium emphasizes the development principle of separating view and business logic, bringing numerous benefits:

1. **Enhanced Maintainability:**
    The separation of view and business logic results in more modular code, making maintenance and extension easier while reducing the risk of introducing errors during modifications.

1. **Improved Testability:**
    Independent business logic can be tested separately, simplifying unit and integration testing, making them more reliable.

1. **Increased Development Efficiency:**
    Clear responsibility division enables developers to focus on specific tasks, improving development speed and efficiency. Frontend and backend development can proceed in parallel, further accelerating project progress.

1. **Better Code Reusability:**
    Independent business logic modules can be reused across multiple views, reducing code duplication and enhancing code reuse and consistency.

1. **Improved Project Structure:**
    A separated architecture results in a clearer project structure, facilitating team collaboration and code management, and lowering the learning curve for new team members.

## Features

1. **Simplicity and Strong Extensibility:**
   Solidium is designed with simplicity in mind, ensuring ease of use and strong extensibility. It provides a straightforward and intuitive API for managing state in your SolidJS applications.

2. **IoC Container and AOP Support:**
   Solidium goes beyond basic state management by offering an Inversion of Control (IoC) container. It supports Aspect-Oriented Programming (AOP) principles and features like `IntantiationAwareProcessor`. Dependency injection and decorators are seamlessly integrated for enhanced flexibility.

3. **Code Organization and Dependency Visualization:**
   With Solidium, organizing your code becomes a breeze. The library facilitates clear dependency relationships between different modules in your application. Additionally, Solidium can generate dependency diagrams or graphs, providing a visual representation of your application's architecture.

4. **Optimized for SolidJS Performance:**
   Leveraging the outstanding features of SolidJS, Solidium is able to achieve superior performance . You can benefit from SolidJS's reactivity model and efficient rendering to build high-performance user interfaces for your applications.

### Future Prospects

Solidium is committed to continually expanding and optimizing its features to meet the evolving needs of developers. In the future, Solidium will:

1. **Expand Decorator Features:**
Cover more application scenarios, such as form validation and cache management, further simplifying developers' work.

1. **Provide Rich Plugin Support:**
    Introduce a plugin mechanism allowing community developers to create and share plugins, enriching the ecosystem to meet customization needs.

1. **Strengthen Integration with Other Libraries and Frameworks:**
    Offer integration support with other popular libraries and frameworks, such as Redux and React Router, enabling developers to seamlessly incorporate Solidium's features into existing projects.

1. **Optimize Performance and Development Experience:**
    Continuously optimize the library's performance to ensure efficient operation in large projects. Provide detailed documentation and abundant examples to improve the learning curve and user experience for developers.


## Usage

```tsx
import { Solidium, useService, Signal, Computed } from '@vgerbot/solidium';


// Define a service using Solidium

class CounterService {
    @Signal
    public count: number = 0;

    @Computed
    public get double() {
        return this.count * 2;
    }
    public increment() {
        this.count ++;
    }
}

// Main Application Component
function App() {
    return <Solidium>
            <ShowCount />
            <IncrementCount/>
        </Solidium>
}

// Component displaying count and double from CounterService
function ShowCount() {
    const service = useService(CounterService);
    return <div>
        count: {service.count}
        double: {service.double}
    </div>
}

// Component incrementing count in CounterService
function IncrementCount() {
    const service = useService(CounterService);
    return <button onClick={() => service.increment()}></button>
}
```

Explanation:

- **Reactive State with @Signal:**
    Use the `@Signal` decorator to make the `count` property of `CounterService` reactive. Any changes to `count` will automatically trigger reactivity.
- **Computed Properties with @Computed:**
    Utilize the `@Computed` decorator for the `double` property in `CounterService`. This property is automatically cached, preventing unnecessary recomputation when dependent signals remain unchanged.
- **Shared CounterService Instance:**
    Both `ShowCount` and `IncrementCount` components share the same instance of `CounterService`, obtained from the Inversion of Control (IoC) container using the `useService` hook. This ensures they operate on the same reactive state.

For detailed usage instructions, check out our [Documentation][link-docs]

## Contributing

We welcome contributions! If you find a bug or have a feature request, please open an issue. For pull requests, please follow our [contribution guidelines][link-guidelines].

## License

This project is licensed under the [MIT License][link-license].

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
