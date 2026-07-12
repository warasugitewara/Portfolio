# warasugi — Portfolio

![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Vite+](https://img.shields.io/badge/Vite%2B-Vite%208%20%C2%B7%20Rolldown%20%C2%B7%20Oxc-646CFF?logo=vite&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-Hono-000000?logo=bun&logoColor=white)
![Self-hosted](https://img.shields.io/badge/Deploy-Self--hosted%20(Proxmox)-E57000?logo=proxmox&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

CLI / ターミナル風デザインの個人ポートフォリオ。React 19 + TypeScript を **Vite+（Rolldown / Oxc）** でビルドし、自宅サーバー上の **Bun + Hono** で配信しています。

🌐 **公開サイト**: https://portfolio.warasugi.com
🔗 **GitHub**: https://github.com/warasugitewara

---

## ✨ 特徴

- **CLI 風デザイン** — 起動アニメーションとモノスペース中心の UI
- **ダーク / ライト テーマ** ＆ **日本語 / 英語**（`localStorage` で保持）
- **モバイルファースト** — スマホ〜PC まで破綻しないレスポンシブ
- **データ駆動** — 静的コンテンツは `public/data/*.json`、リポジトリ一覧は GitHub API から動的取得
- **自作鯖（ホームラボ）ページ** — Proxmox VE 3ノードクラスター（OPNsense 中核）の構成を図付きで解説
- **高速ビルド** — Rolldown / Oxc によりサブ秒でビルド完了

## 🛠 技術スタック

| レイヤー | 技術 |
|---|---|
| フレームワーク | React 19 + TypeScript 6.0（strict） |
| ビルドツール | Vite+（Vite 8 + Rolldown + Oxc） |
| Lint | oxlint（`vite.config.ts` にインライン設定） |
| ルーティング | React Router DOM v7 |
| スタイル | CSS カスタムプロパティ（フレームワーク / CSS-in-JS なし） |
| データ | `public/data/*.json` + GitHub API |
| i18n | カスタムフック（`localStorage` で言語保持） |
| ランタイム | Bun |
| サーバー | Hono（静的配信 + SPA フォールバック） |
| リバースプロキシ | Caddy（Anubis 経由のボット対策付き） |
| 公開 | Cloudflare Tunnel（TLS 終端） |
| ホスティング | 自宅 Proxmox VE（systemd `portfolio.service`） |

## ⚡ コマンド

| コマンド | 説明 |
|---|---|
| `npm run dev` | 開発サーバー（Vite+, port 3000） |
| `npm run build` | 型チェック＋本番ビルド（`tsc -b && vp build` → `dist/`） |
| `npm run preview` | ビルド成果物のローカルプレビュー |
| `npm run type-check` | 型チェックのみ（`tsc -b --noEmit`） |
| `npm run lint` | Lint（`vp lint .`） |
| `npm run start` | 本番配信（Bun + Hono, `server.ts`） |

```bash
npm install      # 依存関係のインストール
npm run dev      # 開発開始
```

## 🏗 アーキテクチャ

- **フロントエンド** — React 19 SPA（`BrowserRouter`）。ルートは `/`（Home）と `/infrastructure`（自作鯖構成）。i18n・テーマの状態は `App.tsx` のフックが持ち、各ページへ props で流す（グローバルストアなし）。共有型は `src/types/index.ts` に集約。
- **バックエンド（本番配信）** — `server.ts` の Bun ランタイム Hono サーバー（port 3000）が `dist/` を静的配信し、SPA フォールバックを担当。
- **データ** — `public/data/*.json` を `fetch`（`getDataUrl()` 経由）。リポジトリ一覧のみ `api.github.com` から直接取得。

## 🚀 デプロイ

**本番は自宅サーバーのみ**（GitHub Pages は不使用）。

- **サービス**: `portfolio.service`（systemd）— `bun run start` で Hono サーバーを起動（port 3000）
- **リバースプロキシ**: Caddy がリクエストを受け、静的ファイルは直接 port 3000 へ、それ以外は Anubis（port 3001）経由で配信
  - `portfolio.warasugi.com` は Cloudflare Tunnel 経由（CF 側で TLS 終端、Caddy は HTTP のみ受信）
- **反映手順**: `git pull` → `npm ci` → `npm run build` → `systemctl restart portfolio.service`
- **Snake SVG**: `.github/workflows/snake.yml` が contribution snake を生成。本番では cron（6 時間ごと）の `update-snake.sh` が最新化。

## 📝 コンテンツ更新

静的な文言・プロフィール・スキル・インフラ情報は `public/data/` の JSON を編集して更新します。UI 文言は `i18n-{ja,en}.json` に **両言語** で追加してください。

## 🗒 変更履歴

- **2026-07-12**: Minecraft をベアメタル専用機へ移行（Kasm WS 廃止・ハード転用）— HP-2 CT100 に DriveBackupV2 バックアップサーバー + FileBrowser を新設し、インフラページへ反映。ZenNotes CT を廃止（メモ・ノートは Google Keep / Discord / GitHub / 物理へ移行）
- **2026-07**: 全面刷新 — TypeScript 6.0 化・CLI 風デザイン洗練・モバイル対応・自宅鯖構成を実態（OPNsense 中核 / 隔離 Kasm WS）へ更新・GitHub Pages 廃止
- **2026-04-24**: Vite+ 移行 — Vite 8 + Rolldown + Oxlint（ビルド ~2.6s → サブ秒）
- **2026-04-23**: Cloudflare Tunnel 対応 — `portfolio.warasugi.com` をメインドメインに移行
- **2026-03-02**: GitHub Pages → 自宅鯖セルフホスティング移行、Hono 導入

## 📄 ライセンス

MIT
