# Solidium

[![Work in Progress][badge-wip]][link-home-page] [![Code Style: Prettier][badge-prettier]][link-prettier] [![Code Linting: ESLint][badge-eslint]][link-eslint] [![License][badge-license]][link-license] [![PRs Welcome][badge-prs]][link-home-page] [![GitHub Issues][badge-issues]][link-issues]

## コア思想

Solidiumは**関心の分離**アーキテクチャに基づいて構築され、明確で保守可能、テスト可能なコードを作成することを目的としています。

### 関数コンポーネントは純粋なレンダリングに専念

- コンポーネントはUI表示とイベント処理のみに焦点を当てる
- ビジネスロジックや状態管理を含まない
- シンプルでテストしやすく、ビジネスとUIコンポーネントを独立してテスト可能

### サービス層でビジネスロジックをカプセル化

- すべてのビジネスロジックと状態をServiceクラスにカプセル化
- サービスは反応性を持ち、状態変化時に自動的に更新される
- ビジネスロジックは複数のコンポーネントやサービス間で再利用可能

### Hookで状態を消費

- `useService` Hookを使用してIoCコンテナから状態を消費
- コンポーネントは純粋関数の特性を維持し、依存性注入を通じてデータを受け取る
- データ層とプレゼンテーション層の明確な分離

### IoCコンテナが依存関係を管理

- 自動サービス登録とインスタンス化
- 内蔵ライフサイクル管理（Singleton、Transient、ComponentTreeスコープ）
- SolidJS反応システムとのシームレスな統合

このアーキテクチャは以下の利点をもたらします：

- **より明確なコード** - 関心の分離が明確で単一責任
- **テストが容易** - ビジネスロジックとUIの完全な分離
- **再利用性が向上** - サービスは複数のコンポーネント間で共有可能
- **保守が簡単** - 構造が明確で理解しやすく修正しやすい

## 機能

- 🏗️ **IoCコンテナ統合** - `@vgerbot/ioc`ベースの強力な依存性注入システム
- 🔄 **反応性デコレータ** - `@Auto`、`@Signal`、`@Computed`、`@Observe`など
- 🎣 **React風Hooks** - `useService()`などの馴染みのあるAPI
- 🎯 **完全なTypeScriptサポート** - コンパイル時型チェックとIntelliSense

## インストール

```bash
npm install @vgerbot/solidium
```

## クイックスタート

### 1. アプリをラップ

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

### 2. サービスを作成

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

### 3. コンポーネントで使用

```tsx
import { useService } from '@vgerbot/solidium';
import { CounterService } from './CounterService';

function CounterDisplay() {
    const service = useService(CounterService);
    
    return (
        <p>カウント: {service.count}</p>
    );
}

function Counter() {
    const service = useService(CounterService);
    return <button onClick={() => service.increment()}>+</button>
}
```

シンプルで効果的！`@Auto`デコレータは`count`プロパティを自動的に反応性シグナルに変換します。`count`が変化すると、このサービスを使用するすべてのコンポーネントが自動的に更新されます。ビジネスロジックをサービスに完全にカプセル化し、コンポーネントはレンダリングとイベント処理のみを担当できます。

## その他の機能

- `@Signal()` - プロパティを手動でシグナルに変換
- `@Computed()` - 自動キャッシュと依存関係追跡を持つ計算プロパティを作成
- `@Observe()` - 状態変化を監視し、副作用を実行
- `@Store()` - クラスをSolidJS Storeに変換
- `@Batch()` - パフォーマンス最適化のためのバッチ更新

詳細なドキュメントについては、[ドキュメント][link-docs]を参照してください。

## 貢献

貢献を歓迎します！バグを発見したり、機能リクエストがある場合は、issueを作成してください。プルリクエストについては、[貢献ガイドライン][link-guidelines]に従ってください。

## ライセンス

このプロジェクトは[MITライセンス][link-license]の下でライセンスされています。

## 関連プロジェクト

- [@vgerbot/ioc](https://github.com/vgerbot-libraries/ioc) - Solidiumを支えるIoCコンテナ
- [SolidJS](https://solidjs.com/) - Solidiumが構築された反応性フレームワーク

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
[link-guidelines]:TODO
[link-docs]:./#TODO
