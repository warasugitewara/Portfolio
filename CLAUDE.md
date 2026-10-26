# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **最優先ルール**: `~/.claude/CLAUDE.md`（ユーザーのグローバル指示）を**絶対**とする。本ファイルの内容と競合する場合は、常にグローバル指示を優先すること。

## コマンド

```bash
bun run dev          # 開発サーバー (vp dev, port 3000)
bun run build        # tsc + vp build → dist/
bun run preview      # ビルド成果物のプレビュー (vp preview)
bun run lint         # Lint (vp lint .)
bun run type-check   # tsc --noEmit
bun run start        # 本番サーバー (bun run server.ts, dist/ を配信)
```

- **ビルドツールは素の Vite ではなく `vite-plus`（`vp` コマンド）**。`package.json` の `overrides` で `vite` / `vitest` を `@voidzero-dev/vite-plus-*`（Vite 8 + Rolldown + Oxc）に差し替えている。CLI は `vp` を使う。
- **Lint は ESLint ではなく oxlint ベース**。ルールは `vite.config.ts` の `lint` セクションにインラインで定義（`.eslintrc` は無い）。ステージ時 `src/**/*.{ts,tsx,js,jsx}` に `vp check --fix` が走る。
- **パッケージマネージャは Bun**（`bun.lock` のみ。`package-lock.json` は廃止）。本番には Node.js を入れないので、Node 前提のスクリプトは `bun run --bun` で動くこと。テストは vitest（`bun run test` = `vp test`）。純関数は `src/utils/*.test.ts` にソースと併置する。

## アーキテクチャ

React 19 SPA を、**開発時は `vp dev`、本番時は Bun + Hono (`server.ts`) で配信**する構成。ビルド／実行時のサーバーが異なる点に注意。

### フロントエンド
- **ルーティング** (`src/App.tsx`): `BrowserRouter`。ルートは `/`（`HomePage`）と `/infrastructure`（`InfrastructurePage`）の 2 つ。
- **状態の持ち方**: i18n・テーマの状態は `App.tsx` で `useI18n` / `useTheme` フックが持ち、`Layout` と各ページへ props で流す（グローバルストア無し）。`Layout` が全ページ共通の Header / Footer をラップ。
- **データ駆動**: 静的コンテンツは全て `public/data/*.json` から `fetch`（`profile.json`, `skills.json`, `philosophy.json`, `infrastructure.json`, `i18n-{ja,en}.json`）。GitHub リポジトリ一覧のみ `api.github.com` から直接取得（`Projects.tsx`）。共有型は `src/types/index.ts` に集約。
- **i18n**: `useI18n` が `public/data/i18n-{lang}.json` を fetch、`localStorage` の `language` で保持。対応は `ja` / `en`。**UI 文言はハードコードせず、必ず両言語の JSON に追加する。**
- **テーマ**: `useTheme` が `<html>` の `data-theme` を切り替え、CSS カスタムプロパティ（`--color-*`）で表現。スタイルは `src/styles/main.css` に集約（CSS-in-JS / フレームワーク無し）。

### バックエンド（本番配信）
`server.ts` は Bun ランタイムの Hono サーバー（port 3000）。`dist/` の静的配信と SPA フォールバック（`notFound` → `dist/index.html`）を担当。OG 画像は個別ルートでキャッシュヘッダーを設定している。

## 規約・注意点

- **`public/data/` へのアクセスは必ず `getDataUrl()`（`src/utils/path.ts`）経由**。`BASE_URL` を前置してパスを解決するため、直書きしない。
- **コンポーネントは名前付きエクスポートの関数コンポーネント**。Props は各ファイルで interface / type 定義。
- TypeScript strict（`noUnusedLocals` / `noUnusedParameters` 有効）。CLAUDE 全体規約どおり `any` / `@ts-ignore` は使わない（リポジトリ全体で `any` は 0 件。oxlint が `no-explicit-any` をエラーにしている）。

## 既知の技術的負債（変更時に注意）

詳細は README の「🧰 既知の技術的負債（TODO）」を参照。要点:

- **インフラ構成図の行は JSON から導出**: `src/pages/InfrastructurePage.tsx` は `public/data/infrastructure.json` の `nodes[*].workloads` から図の行（名前・ID・並び）を自動生成する。CT/VM を増減・改名しても図は自動追従する。新規 CT は workload に `icon`（意味名）と `caption` / `caption_en` を持たせる。意味名→グリフの対応は `src/utils/infraIcons.ts`、使えるグリフはフォントサブセット（`public/fonts/subset-waras-console.py`）に含まれるものだけ（無いと豆腐になる）。凡例・構成メモは `infrastructure.json` の `diagram.legend` / `architecture_notes`、ネットワーク図の文言は i18n JSON（`net*` / `dgm*`）に別管理。
- `profile.json` の `stats` は `derive` 付きのものだけ `infrastructure.json` から自動算出し、それ以外はハードコード。**開放ポート数のようなセキュリティ上の手掛かりは載せない**。

## デプロイ運用（非自明）

**本番は自宅サーバーのみ**（GitHub Pages は不使用）:
- **自宅サーバー**: Proxmox VE 上の `/opt/portfolio` に配置し、systemd `portfolio.service` として稼働。Cloudflare Tunnel → Anubis → Hono（リバースプロキシは挟まない）の経路で **`portfolio.warasugi.com`**（メインドメイン）を配信。GitHub へは**このホストから push する**運用なので、リモートが常に最新とは限らない。本番反映は `git pull` → `bun install --frozen-lockfile` → `bun run --bun build` → `systemctl restart portfolio.service`。Hono は `127.0.0.1:3000` だけで待ち受ける。
- **snake SVG**: contribution snake はプロフィールリポジトリ（warasugitewara/warasugitewara）の raw URL を `Snake.tsx` が直接参照。本リポジトリでの生成・配信は廃止済み。