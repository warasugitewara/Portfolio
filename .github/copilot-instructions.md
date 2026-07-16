# Copilot Instructions

## コマンド

```bash
npm run dev          # Vite 開発サーバー (port 3000)
npm run build        # tsc + vite build → dist/
npm run lint         # ESLint (TypeScript + React Hooks + React Refresh)
npm run type-check   # tsc --noEmit
npm run start        # Bun + Hono 本番サーバー (dist/ を配信)
```

## アーキテクチャ

React 19 SPA（Vite 7 ビルド）を、本番では Bun + Hono (`server.ts`) で配信する構成。
本番は自宅サーバー（Proxmox VE）上の `/opt/portfolio` にデプロイされ、systemd サービス (`portfolio.service`) として稼働。
Caddy がリバースプロキシとして `portfolio.warasugi.com`（Cloudflare Tunnel 経由）を受け、Anubis（port 3001）経由でボット対策を行う。

### フロントエンド

- **ルーティング**: `App.tsx` で BrowserRouter を使用。ルートは `/`（HomePage）と `/infrastructure`（InfrastructurePage）の 2 つ。
- **レイアウト**: `Layout` コンポーネントが全ページ共通の Header / Footer をラップ。i18n・テーマの状態は `App.tsx` で管理し、props で配下に渡す。
- **i18n**: `useI18n` フックが `public/data/i18n-{lang}.json` を fetch し、`localStorage` で言語設定を保持。対応言語は `ja` / `en`。
- **テーマ**: `useTheme` フックが `data-theme` 属性を `<html>` に設定。CSS カスタムプロパティ（`--color-*`）で切り替え。
- **データ取得**: 静的コンテンツは `public/data/*.json` から fetch。GitHub リポジトリ一覧は `api.github.com` から直接取得（`Projects.tsx`）。

### バックエンド（本番配信）

`server.ts` は Bun ランタイムで動く Hono サーバー（port 3000）。`dist/` の静的ファイル配信と SPA フォールバック（`notFound` → `dist/index.html`）を担当。大きい画像ファイルや OG 画像は個別ルートでキャッシュヘッダーを設定。

### CI/CD・運用

- contribution snake はプロフィールリポジトリ（warasugitewara/warasugitewara）側で生成し、本リポジトリはその raw URL を表示するのみ（生成 workflow・cron は廃止済み）
- **正式ソース**: `/opt/portfolio`（本番ホスト）が最新。GitHub へはホストから push する運用。

## コーディング規約

- **言語**: TypeScript strict モード（`noUnusedLocals`, `noUnusedParameters` 有効）
- **スタイル**: CSS カスタムプロパティのみ使用（CSS-in-JS やフレームワークなし）。`src/styles/main.css` に集約。
- **コンポーネント**: 名前付きエクスポートの関数コンポーネント。各コンポーネントが Props を interface で定義。
- **型定義**: 共有型は `src/types/index.ts` に集約。
- **データパス**: `public/data/` 内ファイルへのアクセスには `getDataUrl()` ユーティリティ（`src/utils/path.ts`）を使う。
- **テキスト管理**: UI 文言はハードコードせず `public/data/i18n-*.json` に記述。新しい文言は `ja` / `en` 両方に追加すること。
- **Git コミット**: 主著者は `warasugitewara`。
