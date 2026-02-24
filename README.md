# warasugi - ポートフォリオ

私のポートフォリオです。


🌐 **公開サイト**: https://wc.f5.si  
🔗 **GitHub**: https://github.com/warasugitewara

---

## 特徴

- **マルチページ構成**: React Router による複数ページ対応
- **自作鯖構成情報**: Proxmox VEベースのホームラボについての詳細ページ
- **CLI風デザイン**: 起動アニメーションとモノスペース中心のUI
- **軽量構成**: React + TypeScript + Vite の最小構成
- **日英対応**: 日本語 / 英語をヘッダーから切り替え可能
- **テーマ切り替え**: ダーク / ライト両対応
- **GitHub連携**: リポジトリ情報をAPIから取得して表示
- **レスポンシブ**: スマホからPCまで破綻しにくいレイアウト

## 技術スタック

- **フレームワーク**: React 19 + TypeScript
- **ビルドツール**: Vite 7
- **ルーティング**: React Router DOM v6
- **スタイル**: CSS
- **データ**: `public/data/*.json` + GitHub API
- **i18n**: カスタムフック（`localStorage`で言語保持）
- **デプロイ**: GitHub Pages（GitHub Actions）

## ディレクトリ構成

```txt
src/
├── components/
│   ├── Layout.tsx                    # ページ共通レイアウト (Header + Footer)
│   ├── Hero.tsx                      # ヒーローセクション
│   ├── About.tsx                     # 自己紹介
│   ├── Skills.tsx                    # スキル表示
│   ├── Projects.tsx                  # GitHub連携プロジェクト一覧
│   ├── Contact.tsx                   # 連絡先リンク
│   ├── Snake.tsx                     # スネークゲーム
│   └── BootAnimation.tsx             # 起動アニメーション
├── pages/
│   ├── HomePage.tsx                  # ホームページ (/)
│   └── InfrastructurePage.tsx        # 自作鯖構成ページ (/infrastructure)
├── hooks/
│   ├── useI18n.ts                    # 多言語切り替え
│   └── useTheme.ts                   # テーマ切り替え
├── styles/
│   └── main.css                      # 全体スタイル
├── types/
│   └── index.ts                      # 型定義
├── utils/
│   └── path.ts                       # パスユーティリティ
├── App.tsx                           # ルートコンポーネント (Router設定)
└── main.tsx                          # エントリーポイント

public/data/
├── profile.json                      # プロフィール情報
├── skills.json                       # スキル情報
├── philosophy.json                   # 開発哲学
├── infrastructure.json               # 自作鯖構成情報
├── i18n-ja.json                      # 日本語文言
└── i18n-en.json                      # 英語文言

public/diagrams/
└── infra-architecture.mmd            # インフラアーキテクチャ図 (Mermaid)
```

## セットアップ

```bash
# 依存関係をインストール
npm install

# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# ビルド結果をローカル確認
npm run preview
```

## 運用メモ

- GitHub APIの取得に失敗した場合、プロジェクト一覧が空になることがあります。
- 言語・テーマ設定は `localStorage` に保存されます。
- 静的な文言・プロフィール・インフラ情報は `public/data/` のJSONを編集すると更新できます。
- ページ間のルーティングは React Router で管理されています。
- `public/diagrams/` には Mermaid ファイルが置かれていますが、現在ページ内では表示されていません（今後の拡張予定）


## GitHub 反映（ログインリンク方式）

このリポジトリを GitHub に反映する場合は、
**GitHub CLI + Device Login** を使う方法がシンプルです。

0. `gh` が未導入なら先にインストール（Ubuntu: `sudo apt-get install -y gh`）
1. 手元の端末で `gh auth login` を実行
2. 表示された案内に従って `https://github.com/login/device` を開く
3. ワンタイムコードを入力してログイン
4. 認証完了後に `git push -u origin <branch>` を実行

> 注: ブラウザを直接開けない実行環境では、この認証フローを完了できません。
> その場合はローカル端末側でログインを済ませてから push する運用にしてください。

## ライセンス

MIT

---

## 著者[貢献順]
- claude haiku 4.5
- warasugi
- GPT-5.3-Codex
- claude Opus 4.6
