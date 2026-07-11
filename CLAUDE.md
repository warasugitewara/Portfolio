# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **最優先ルール**: `~/.claude/CLAUDE.md`（ユーザーのグローバル指示）を**絶対**とする。本ファイルの内容と競合する場合は、常にグローバル指示を優先すること。

## コマンド

```bash
npm run dev          # 開発サーバー (vp dev, port 3000)
npm run build        # tsc + vp build → dist/
npm run preview      # ビルド成果物のプレビュー (vp preview)
npm run lint         # Lint (vp lint .)
npm run type-check   # tsc --noEmit
npm run start        # 本番サーバー (bun run server.ts, dist/ を配信)
```

- **ビルドツールは素の Vite ではなく `vite-plus`（`vp` コマンド）**。`package.json` の `overrides` で `vite` / `vitest` を `@voidzero-dev/vite-plus-*`（Vite 8 + Rolldown + Oxc）に差し替えている。CLI は `vp` を使う。
- **Lint は ESLint ではなく oxlint ベース**。ルールは `vite.config.ts` の `lint` セクションにインラインで定義（`.eslintrc` は無い）。ステージ時 `src/**/*.{ts,tsx,js,jsx}` に `vp check --fix` が走る。
- **パッケージマネージャは npm**（`package-lock.json`）だが、`bun.lock` も存在し本番起動は Bun。テストランナーは未設定。

## アーキテクチャ

React 19 SPA を、**開発時は `vp dev`、本番時は Bun + Hono (`server.ts`) で配信**する構成。ビルド／実行時のサーバーが異なる点に注意。

### フロントエンド
- **ルーティング** (`src/App.tsx`): `BrowserRouter`。ルートは `/`（`HomePage`）と `/infrastructure`（`InfrastructurePage`）の 2 つ。
- **状態の持ち方**: i18n・テーマの状態は `App.tsx` で `useI18n` / `useTheme` フックが持ち、`Layout` と各ページへ props で流す（グローバルストア無し）。`Layout` が全ページ共通の Header / Footer をラップ。
- **データ駆動**: 静的コンテンツは全て `public/data/*.json` から `fetch`（`profile.json`, `skills.json`, `philosophy.json`, `infrastructure.json`, `i18n-{ja,en}.json`）。GitHub リポジトリ一覧のみ `api.github.com` から直接取得（`Projects.tsx`）。共有型は `src/types/index.ts` に集約。
- **i18n**: `useI18n` が `public/data/i18n-{lang}.json` を fetch、`localStorage` の `language` で保持。対応は `ja` / `en`。**UI 文言はハードコードせず、必ず両言語の JSON に追加する。**
- **テーマ**: `useTheme` が `<html>` の `data-theme` を切り替え、CSS カスタムプロパティ（`--color-*`）で表現。スタイルは `src/styles/main.css` に集約（CSS-in-JS / フレームワーク無し）。

### バックエンド（本番配信）
`server.ts` は Bun ランタイムの Hono サーバー（port 3000）。`dist/` の静的配信と SPA フォールバック（`notFound` → `dist/index.html`）を担当。snake SVG・大きい画像（`minecraft-city.png`）は個別ルートでキャッシュヘッダーを設定している。

## 規約・注意点

- **`public/data/` へのアクセスは必ず `getDataUrl()`（`src/utils/path.ts`）経由**。`BASE_URL` を前置してパスを解決するため、直書きしない。
- **コンポーネントは名前付きエクスポートの関数コンポーネント**。Props は各ファイルで interface / type 定義。
- TypeScript strict（`noUnusedLocals` / `noUnusedParameters` 有効）。CLAUDE 全体規約どおり `any` / `@ts-ignore` は使わない（既存 `HomePageProps` の `i18n: any` は例外的な既存箇所）。

## デプロイ運用（非自明）

**本番は自宅サーバーのみ**（GitHub Pages は不使用）:
- **自宅サーバー**: Proxmox VE 上の `/opt/portfolio` に配置し、systemd `portfolio.service` として稼働。Caddy がリバースプロキシ、Cloudflare Tunnel 経由で **`portfolio.warasugi.com`**（メインドメイン）を配信。GitHub へは**このホストから push する**運用なので、リモートが常に最新とは限らない。本番反映は `git pull` → `npm ci` → `npm run build` → `systemctl restart portfolio.service`。
- **snake SVG**: `.github/workflows/snake.yml` が 24h ごと + main push で contribution snake を生成し `dist/` と `public/` にコミット。本番では 6 時間ごとに `update-snake.sh` が最新化。
- `.github/copilot-instructions.md` にも旧構成の記述があるが、ドメイン等は README / 本ファイルが優先。
