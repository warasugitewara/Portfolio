# warasugi - ポートフォリオ

私のポートフォリオサイトです。

🌐 **公開サイト**: https://portfolio.warasugi.com
🔗 **GitHub**: https://github.com/warasugitewara

---

## 特徴

- **マルチページ構成**: React Router による複数ページ対応
- **自作鯖構成情報**: Proxmox VE ベースのホームラボについての詳細ページ
- **CLI 風デザイン**: 起動アニメーションとモノスペース中心の UI
- **高速ビルド**: React + TypeScript + Vite+（Rolldown/Oxc により ~272ms ビルド）
- **日英対応**: 日本語 / 英語をヘッダーから切り替え可能
- **テーマ切り替え**: ダーク / ライト両対応
- **GitHub 連携**: リポジトリ情報を API から取得して表示
- **レスポンシブ**: スマホから PC まで破綻しにくいレイアウト

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フレームワーク | React 19 + TypeScript (strict) |
| ビルドツール | Vite+ 0.1.19 (Vite 8 + Rolldown + Oxlint) |
| ルーティング | React Router DOM v7 |
| スタイル | CSS カスタムプロパティ（CSS-in-JS なし） |
| データ | `public/data/*.json` + GitHub API |
| i18n | カスタムフック（`localStorage` で言語保持） |
| サーバー | Bun + Hono（静的配信 + SPA フォールバック） |
| リバースプロキシ | Caddy（Anubis 経由のボット対策付き） |
| トンネル | Cloudflare Tunnel（TLS 終端・外部公開） |
| デプロイ | 自宅鯖セルフホスティング（systemd サービス） |

## 本番環境の構成

サイトは自宅サーバーの Proxmox VE 仮想環境上でセルフホスティングされています。

- **サービス**: `portfolio.service`（systemd）— `bun run start` で Hono サーバーを起動（port 3000）
- **リバースプロキシ**: Caddy がリクエストを受け、静的ファイルは直接 port 3000 へ、それ以外は Anubis（port 3001）経由で配信
  - `portfolio.warasugi.com`: Cloudflare Tunnel 経由（CF 側で TLS 終端、Caddy は HTTP のみ受信）
- **Snake SVG 更新**: cron（6 時間ごと）で `update-snake.sh` を実行し、GitHub contribution snake SVG を最新化
- **CI/CD**: GitHub Actions で snake SVG 生成（`snake.yml`）と GitHub Pages デプロイ（`deploy.yml`）も並行稼働

> **注**: `/opt/portfolio` にあるホスト上のファイルが正式な最新版です。GitHub リポジトリへの反映はホストから push します。

## セットアップ

```bash
# 依存関係をインストール
npm install

# 開発サーバー起動（port 3000）
npm run dev

# 本番ビルド（tsc + vite build → dist/）
npm run build

# ビルド結果をローカル確認
npm run preview

# 本番サーバー起動（Bun + Hono）
bun run start
```

## 運用メモ

- GitHub API の取得に失敗した場合、プロジェクト一覧が空になることがあります。
- 言語・テーマ設定は `localStorage` に保存されます。
- 静的な文言・プロフィール・インフラ情報は `public/data/` の JSON を編集すると更新できます。
- `public/diagrams/` には Mermaid ファイルが置かれていますが、現在ページ内では表示されていません（今後の拡張予定）。

## 変更履歴

- **2026-04-24**: Vite+ 移行 — Vite 8 + Rolldown + Oxlint に移行。ビルド時間 ~2.6s → 272ms（約 9.5x 高速化）
- **2026-04-23**: Cloudflare Tunnel 対応 — `portfolio.warasugi.com` をメインドメインに移行、Caddy に `http://` ブロック追加
- **2026-03-02**: GitHub Pages → 自宅鯖の仮想環境上にてセルフホスティング移行、Hono 導入

## ライセンス

MIT

---

## 著者 [貢献順]
- claude haiku 4.5
- warasugi
- GPT-5.3-Codex
- claude Opus 4.6
