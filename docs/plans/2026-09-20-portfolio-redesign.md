# Portfolio 情報更新 + デザイン刷新

> 作成: 2026-09-20 ／ 一次情報: Proxmox `pvesh get /cluster/resources --type vm` と `pvesh get /nodes` の実行結果（2026-09-20 取得）

## Context

`portfolio.warasugi.com` の掲載情報が実態から乖離している。最後のコンテンツ更新は 2026-08-01（`philosophy.json` は 2026-03-17）で、今日（2026-09-20）時点の Proxmox クラスタと比べると **CT の改名・移動・新設・廃止がサイトに反映されていない**。実データ（`pvesh get /cluster/resources`）で確認した差分:

| 実態 | サイトの記載 |
|---|---|
| CT104 `Discord-Pin-Service` (dell) | `pote-monitor`（BTC/ETH 価格通知） |
| CT108 `Pens-Uptime-kuma` (HP-2) | `homepage` (gethomepage) |
| CT1000 `Arb-bot`（停止中） | `secrets1`（非公開プロジェクト） |
| CT301 `Velocity` は **HP-1** | dell |
| CT109 `Uir-bot` / CT601 `tango` / CT701 `media-server` / VM1001 `mochi-OS`(停止) | 未掲載 |
| CT700 `Headroom-Proxy` は存在しない | 掲載中 |
| 20 guests（17 LXC + 3 VM / 稼働 18） | stats は `17+` |
| ベアメタル: RAM 15Gi / Kingston SQ500S37240G 240GB | `SSD 256GB` |
| Archer BE3600 (AP) / IX2105 (VPN) | ネットワーク図に不在 |

同時に、デザインは 2026-07 の「CLI / ターミナル風」から更新されておらず、**Web フォントを一切読み込んでいない**ため大半の閲覧者には Courier New が当たっている。これがデザインの上限を決めてしまっている。またデータの持ち方が壊れており、**同じ事実が 3 箇所で二重・三重管理**されている（`infrastructure.json` / コード内定数 `DGM_META` / `i18n-{ja,en}.json` に CT 番号と HW 諸元がベタ書き）。

**目的**: 掲載情報を実データから再構築し、二重管理を構造的に解消したうえで、ホームラボ運用者としての強みが一目で伝わるダッシュボード型のデザインへ刷新する。

## 確定事項（ユーザー回答）

- 情報ソース = **Proxmox 実データ**（取得済み、下記「実データ」）
- スコープ = **情報更新 + 全面デザイン刷新**（1 ブランチ・段階コミット）
- デザイン方向 = **ホームラボ / ダッシュボード風**
- 起動演出 = 全画面の疑似ターミナルログは廃止し、**ダッシュ式の演出に差し替え**
- フォント = **セルフホストで 2 書体**（外部 CDN なし）。計器面は本人常用の `HackGen Console NF`（latin サブセット + 別名リネーム）、散文は別のサンセリフ
- アイコン = 絵文字をやめ **Nerd Font グリフ**に置き換え
- 稼働状況 = `uptime.warasugi.com` は**リンクとバッジのみ**（API 連携はしない）
- README から取り込む = **公開サービスのリンク群 / 開発環境 / 趣味の機材**。年齢・学年は具体的に書かず「情報系の学生」に留める

## 実データ（一次情報）

ノード実測: `HP-1` 4 コア / 15.5 GiB ・ `HP-2` 8 コア / 15.4 GiB ・ `dell` 4 コア / 7.6 GiB（3 ノードすべて online）

| node | workloads（vmid 昇順） |
|---|---|
| HP-1 (6) | 101 Music-Bot / 301 Velocity / 304 Yomiage-Bot / **VM**600 Voicevox-Engine / 601 tango / **VM**1001 mochi-OS ⏸ |
| HP-2 (8) | 100 mc-backup / 105 twingate-1 / 106 adguard-1.x / 107 adguard-0.x / 108 Pens-Uptime-kuma / 109 Uir-bot / **VM**500 OPNsense / 1000 Arb-bot ⏸ |
| dell (6) | 102 twingate-0 / 103 portfolio / 104 Discord-Pin-Service / 302 MeTube / 400 Zabbix-Server / 701 media-server |

ベアメタル `warasugi-server`（クラスタ外 / hostname は今も `KASM-WS`）: 15 GiB / Kingston SQ500S37240G 240GB / Debian 13 / Purpur + Terraria。

→ 導出されるスタッツ: **nodes 3 / guests 20（17 LXC + 3 VM）/ 稼働 18 / 受信ポート 0**

### 実装開始時に確認が必要（推測で書かない）

1. `CT104 Discord-Pin-Service` — 何をする CT か。BTC/ETH 価格通知（旧 pote-monitor）は廃止か併存か
2. `CT109 Uir-bot` — 用途
3. `CT601 tango` — サイト掲載時の説明（ZenNotes の「Tango Phase 1」= JST 基準の間隔反復学習アプリ、で合っているか）
4. `CT701 media-server` — 用途（Jellyfin 等か）
5. `CT1000 Arb-bot`（停止中）/ `VM1001 mochi-OS`（停止中）— 掲載するか、するなら説明。停止中である旨を出してよいか
6. `CT108 Pens-Uptime-kuma` — 「他者に貸しているインスタンス」という位置づけをサイトに書くか。自分用 Uptime Kuma は友人の Proxmox 上（`uptime.warasugi.com`）である旨をどう表現するか
7. `CT700 Headroom-Proxy` / `gethomepage` / `ZenNotes CT` / `Ai-radio` は廃止として削除してよいか

## デザイン方針

### コンセプト: 「系統図と計器盤」

題材は、第二種電気工事士の資格を持つ学生が運用する 3 ノードクラスタ。そこで**電気設備の単線結線図とネットワーク結線図の語彙**（細いハイライン罫・ハッチング・盤の見立て・銅と緑青）を土台にする。ライトは製図紙、ダークは夜間の監視盤。

意識的に避ける既存の型: 近黒地 + 単色の鮮やかな緑（現行サイトそのもの）、全要素モノスペース、同一角丸 + 同一影の均質カード群、字間を空けた大文字ラベル、`→` を付けたリンク文字列、中黒で連結したメタ文字列。

### トークン

**色**（名前付き 6 値 + 状態色。状態色はステータス表示専用でアクセントと役割を分ける）

| 役割 | dark | light |
|---|---|---|
| `bg` 地 | `#0D1A22`（青緑寄りの暗色。tinted near-black にしない） | `#EDF1F4`（冷たい紙。クリーム系にしない） |
| `surface` 盤面 | `#13242E` | `#FFFFFF` |
| `text` | `#E4EAEE` | `#16222A` |
| `text-muted` | `#8FA3AE` | `#5A6B76` |
| `hairline` 罫 | `#22373F` | `#C9D4DB` |
| `accent` 銅（操作・強調） | `#D9761F` | `#B05A10` |

状態色: `running` = 緑青 `#3F9E7C` / `stopped` = グラファイト（赤にしない。停止は異常ではない）/ `alert` = `#C4342C`（実アラート専用）。
`--color-*` の契約 7 トークン名は維持し、値とパレット拡張で刷新する（`infrastructure.css` の `color-mix()` 群がそのまま追従する）。`index.html` の `theme-color`（現 `#00ff88` = 旧残骸）も同期する。

**タイポ**: 2 書体。役割を明確に分ける。

- **計器面（数値・vmid・ノード名・アイコン・コード）= `HackGen Console NF`**（本人が常用している書体。WezTerm / Nushell / Starship の手元の顔と一致するため、題材と作者が直結する）
- **散文・見出し = `IBM Plex Sans`**（latin）。全面モノスペースは現行サイトの印象に戻るため、読み物部分は分離する
- **日本語**はシステムスタック（Hiragino Kaku Gothic ProN → Yu Gothic → Noto Sans JP）。JP 書体はダウンロードさせない

HackGen の扱い（**ライセンス上の必須手順**）: 配布物は `yuru7/HackGen` v2.10.0 の NF 版 zip（24MB、個別 ttf も数 MB）なので**サブセット必須**。SIL OFL 1.1 だが **Reserved Font Name（"白源" / "HackGen"）が宣言されている**ため、サブセット＝ Modified Version は HackGen 名を使えない。したがって:

1. `HackGenConsoleNF-Regular/Bold.ttf` を取得
2. `pyftsubset`（fonttools + brotli）で latin + 数字 + 記号 + **実際に使う Nerd Font グリフの PUA コードポイントのみ**を残し `--flavor=woff2` で出力（数十 KB 目安）
3. fonttools で name テーブルの family 名を別名（例 `Instrument Mono W`）へ変更
4. `public/fonts/` に置き、OFL 全文と「白源 / HackGen（Copyright 2019 Yuko OTAWARA）由来のサブセット改変版である」旨を `public/fonts/README.md` に明記。サイトのフッタにも出典を 1 行入れる

IBM Plex Sans は `@fontsource-variable/ibm-plex-sans`（npm v5.3.0、OFL）を devDependency に入れる案が簡単だが、**依存追加は承認が必要**。増やしたくない場合は woff2 を `public/fonts/` に直置きして `@font-face` を手書きする（HackGen 側が手作業になるので、そちらに揃える方が一貫する）。`main.css` は `src/main.tsx:1` で import され Vite にバンドルされるため、いずれの方式でも相対パス参照が効く。

**アイコン**: `DGM_META` の絵文字（📦 🛡️ 等）を **Nerd Font グリフ**へ置き換える（Debian / FreeBSD / Docker / Proxmox / ネットワーク等）。OS 依存の見た目のぶれが消え、色をテーマトークンに揃えられる。グリフは workload ごとに `infrastructure.json` の `icon` フィールドで持ち、未指定時のフォールバックグリフを 1 つ決める。使用グリフはサブセットに含めるため、**アイコンを増やすときはサブセットの再生成が必要**である旨を README に残す。

font-size の直書き（main.css 約 40 箇所 + infrastructure.css 116 箇所）を `--fs-display / --fs-h2 / --fs-h3 / --fs-body / --fs-meta / --fs-data` + `--lh-*` に寄せる。大文字化ラベルは使わない。

**レイアウト**: `--content-max` を 900px → 1120px。左に sticky な細いセクション索引（罫 1 本 + テキスト、連番は付けない＝内容が手順ではないため）、本文のデータ節は 2 カラムの台帳（key–value）、散文は 66ch。角丸はデータパネル 3px / 図面ブロック 0px の 2 段だけ。影は使わず 1px 罫と背景段差で階層を作る。ブレークポイントを 768/480 に統一（現在 infrastructure.css だけ 640/480）。

**動きは 1 箇所だけ**: ページロード時にヒーローのクラスタボードのセルが左上から 12ms 間隔で点灯する 1 シーケンス（旧 BootAnimation の役割をここに移す）。カードの hover 浮きとスクロール連動は廃止。`prefers-reduced-motion` で即時表示。

### 画面構成

**Home**

1. **ヒーロー = 計器盤**（大胆さを使う唯一の場所）。左に名前と 1 文の立ち位置、右に**クラスタ実況ボード**: 3 ノード × 20 guests を正方セルのグリッドで描き、稼働は塗り・停止は図面のハッチ、ノードごとに色帯で識別。下に 4 つの数値（nodes / guests / running / inbound 0）を mono の tabular で大きく、ラベルは小さく（大文字化しない）。`minecraft-city.webp` の全画面背景と `background-attachment: fixed` は撤去し、画像は Minecraft 関連の作品カードへ移す（LCP 改善も兼ねる）。
2. About（散文 66ch。「情報系の学生」表現・年齢と学年は書かない）
3. **Setup / Gear**（新設）— 開発環境（WezTerm・Nushell・Starship・Neovim・ZenNotes）と機材（Mint60 / A75・Ender 3・Quest 2・DAC / IEM）を 2 段の台帳で。「CLI 志向」を具体名で裏付ける
4. Skills（`skills.json` を実態へ更新。Bun・OPNsense・Twingate・Zabbix・Caddy・Vitest 等の未収載を追加、`Vite` → `Vite+` に統一）
5. Featured projects（`ec2.warasugi.com` のライブデモ URL・`uptime.warasugi.com` のリンクを紐づけ。`paper-plugins` のリンク欠落を解消）
6. Projects（GitHub API。現行のロジックは維持）
7. Contributions（Snake。light テーマで dark SVG が出る不具合を修正）
8. Contact + フッタ（`© 2026` 固定を実行時の年に）

**Infrastructure**

- 11 個のアコーディオン積み上げをやめ、上部に sticky なセグメントナビ（Overview / Nodes / Network / Security / Ops / Stack / Roadmap）。本文は常時展開し、`CollapsibleSection` は各 workload の詳細のような長い一覧にのみ残す。
- ノードは**ラックユニット型パネル**: ヘッダに node 名と実測 CPU / RAM、本体に workloads の表（vmid・種別・名前・状態・cores・mem・disk・1 行説明）。実データが入ったことで密度の高い表が成立する。
- 構成図（図 1）を**可変高に計算式化**し、ネットワーク図（図 2）に Archer BE3600 (AP) と IX2105 (VPN) を追加。

## データ構造の変更（二重管理の解消）

`public/data/infrastructure.json` のスキーマを構造化する:

```
nodes[]: { id, name, role, role_en,
           hardware: { model, cpu, cores, memGiB, storage[] },   // 現状は1本の文字列
           workloads[] }
workloads[]: { vmid, kind: "lxc"|"qemu"|"baremetal", name, status: "running"|"stopped",
               cores, memMiB, diskGiB, icon, variant,
               summary, summary_en,      // 一覧の1行説明
               caption, caption_en,      // 構成図内の短いキャプション（現 DGM_META の note）
               details[], details_en[] }
```

これにより:

- `InfrastructurePage.tsx` のコード内定数 `DGM_META`（約 36 行）を廃止し、アイコンとキャプションも JSON に集約
- `i18n-{ja,en}.json` から **CT 番号・HW 諸元・`GraalVM 17/21/25.1`・「深夜4時 / 40MB/s / 1週間分」のベタ書きを撤去**（`dgmLegend*` / `notes*` / `netSeg*` 等）。i18n には純粋な UI ラベルだけを残す
- `profile.json` の `stats`（`3` / `17+` / `0` / `4`）を **`infrastructure.json` からの導出に変更**（README の既知負債「Hero スタッツの自動算出」を解消）
- 死にキー（`nav.philosophy` / `skills.languages` / `skills.tools` / `skills.backend` / `skills.certifications`）を削除

導出とジオメトリ計算は**純関数として切り出し vitest でテストする**（既存 `server.test.ts` / `githubReposProxy.test.ts` と同じ流儀）:

- `src/utils/infraStats.ts` — ノード数・guests 数・LXC/VM 内訳・稼働数の導出
- `src/utils/dgmGeometry.ts` — 最大行数 `maxRows` を入力に、ノード枠の `height`・行 `y`・凡例とサマリ箱の `y`・viewBox 高さを算出（現状は `height="445"` と viewBox 1150 が固定リテラルで、実データの最大 8 行 + ベアメタル 2 行を描くと枠外にはみ出す）

実装前に読むもの: ヒーローのクラスタボードと数値タイル（stat tile / KPI 行）に着手する前に `dataviz` スキルを読み、配色とラベルの規約をそこに合わせる。

## 実装ステップ（コミット単位）

1. **`feat(data)`**: `infrastructure.json` を実データで再構築（新スキーマ）+ `src/types/index.ts` 更新。`profile.json` の `school` / `avatar` のキャッシュバスター / 未使用フィールドを整理
2. **`refactor(infra)`**: `DGM_META` 廃止・`infraStats.ts` / `dgmGeometry.ts` 切り出し + vitest 追加。i18n からベタ書きを撤去、死にキー削除（両言語同時）
3. **`feat(design)`**: フォントのセルフホスト（HackGen のサブセット生成 + 別名リネーム + OFL 同梱、IBM Plex Sans 導入）+ トークン刷新（色・タイポスケール・余白・ブレークポイント統一）。`index.html` の `theme-color` 同期。サブセット生成スクリプトは再現できる形で `scripts/` に残す
4. **`feat(home)`**: ヒーローを計器盤に差し替え、BootAnimation をダッシュ式の点灯シーケンスへ置換、`Setup / Gear` 新設、フッタの年を動的化、Snake の light 対応
5. **`feat(infra-page)`**: セグメントナビ化・ノードパネル化・図 1 の可変高化・図 2 に BE3600 / IX2105 追加
6. **`refactor(css)`**: `infrastructure.css` の生 px/rem 116 箇所をトークンへ寄せ、`main.css` と重複する `font-family` 定義を解消
7. **`fix`**: 未定義クラス（`.loading` / `.project-retry` / `.projects-warning`）にスタイルを与える。`skills.json` / `featured.json` / `philosophy.json` の内容更新
8. **`docs`**: README の既知負債リストとスタック表・変更履歴を実態へ更新

## 主に触るファイル

- データ: `public/data/infrastructure.json`（要再構築）/ `profile.json` / `skills.json` / `featured.json` / `philosophy.json` / `i18n-ja.json` / `i18n-en.json`
- スタイル: `src/styles/main.css`（1026 行・トークン層）/ `src/styles/infrastructure.css`（744 行）/ `public/fonts/`（新規）/ `index.html`
- コンポーネント: `src/components/Hero.tsx` / `BootAnimation.tsx` / `Layout.tsx` / `Skills.tsx` / `FeaturedProjects.tsx` / `Snake.tsx` / `About.tsx`（インライン `style` 4 箇所を撤去）、新規 `ClusterBoard.tsx` / `Setup.tsx`
- ページ: `src/pages/HomePage.tsx` / `src/pages/InfrastructurePage.tsx`（989 行・最大の改修）
- ユーティリティ: 新規 `src/utils/infraStats.ts` / `src/utils/dgmGeometry.ts`（既存 `src/utils/pickLang.ts` と `getDataUrl()` は再利用）

## 検証

1. `npm run type-check` → `npm run lint` → `npm run test`（新規の純関数テストが通ること）→ `npm run build`
2. `npm run dev` で起動し、Playwright MCP で **390 / 768 / 1440px × dark / light の 6 パターン**をスクリーンショット。ヒーローのボード・ノードパネル・構成図 2 枚がどの幅でも破綻しないことを目視
3. 構成図は**ワークロードを 1 件追加した状態でも**枠内に収まることを確認（可変高化の要件）。既存の `overflow-x: auto` + `min-width` のモバイル挙動も確認
4. i18n: ja / en を切り替え、**撤去したキーの参照漏れがない**こと（画面に生キーが出ないこと）を両ページで確認
5. アクセシビリティ: キーボードフォーカスの可視性、`prefers-reduced-motion` で点灯シーケンスが即時表示になること、本文と状態色のコントラスト比（WCAG AA）を dark / light 両方で確認
6. フォント: サブセット woff2 が実際に当たっているか（DevTools で font-family の解決を確認）、**日本語がシステムフォントに正しくフォールバックしているか**、Nerd Font グリフが全て描画され豆腐（□）にならないか。`public/fonts/` に OFL 全文と出典記載があることを確認
7. デプロイは `git pull` → `npm ci` → `npm run build` まで。**フロントのみの変更なので `systemctl restart` は不要**（`server.ts` を触った場合のみ再起動）

## この計画で意図的にやらないこと

- Uptime Kuma の API 連携・サイト内ライブ表示（リンクとバッジのみ）
- `server.ts` のキャッシュヘッダ・セキュリティヘッダ改善、`robots.txt` / `sitemap.xml`（2026-07 レビューの残課題だが、今回のスコープ外。必要なら別タスク）
- GitHub API 取得ロジックの変更（現行のプロキシ + フォールバックを維持）

---

## 検証結果による前提の修正（2026-09-20 追記）

既存コードを全数確認した結果、上記の計画に**4件の前提の誤り**が見つかった。実装時はこちらを優先する。

1. **`infrastructure.json` のノードは 3 つではなく 4 つ**。`minecraft-bm`（ベアメタル）が `nodes[]` に含まれており、「ノード構成」セクションは 4 件すべてを描画している。図に出ないのは `buildDgmRows` の `.filter(wl => wl.vmid !== undefined)` が**暗黙に**落としているだけ。→ スキーマに **`nodes[].kind: "pve" | "baremetal"` を必ず追加**する（これが無いと「Proxmox ノード数 3」も図の列数も導出できない）。
2. **現行 JSON の行数内訳は HP-1:4 / HP-2:7 / dell:6（vmid 付き 17 件）**。本文の「HP-1:6 / HP-2:8 / dell:6（20 件）」は**今回追加する新データ**であり、現状はまだ破綻していない。図の許容は**ちょうど 8 行**（9 行目で枠を 26px 突破）なので、新データで HP-2 が 8 行になると**余裕ゼロ**になる。可変高化は必須だが理由は「既に溢れている」ではなく「次の 1 件で溢れる」。
3. **`HomePageProps` の `i18n: any` は既に存在しない**（`src/pages/HomePage.tsx:14-17` は `i18n: I18n`。リポジトリ全体で `any` は 0 件、oxlint が `no-explicit-any: error`）。`CLAUDE.md:40` の記述が stale なので併せて削除する。
4. **テストは `src/utils/*.test.ts` 併置が既存パターン**（`i18n.test.ts` / `githubRepos.test.ts` が既にある）。`CLAUDE.md:22` の「テストランナーは未設定」も stale。

### スキーマ設計の修正

- `workloads[]` は **判別可能ユニオン**にする（`{kind:"lxc"|"qemu"; vmid:number}` と `{kind:"baremetal"}`）。`vmid` 必須にすると `minecraft-bm` の 2 件が表現できない。
- 本文のスキーマ案から**欠落していた既存フィールドを残す**: `workloads[].os`、`nodes[].name_en`、`nodes[].purpose` / `purpose_en`（`purpose` → `summary` へのリネームは 19 workload × 2 言語の一括変更になる）。
- HW 諸元は `node.hardware` 文字列（1 箇所）だけでなく **`InfrastructurePage.tsx:298/315/332/342/345` に TSX 直書きでも存在**（三重管理）。構造化しただけでは追従しないので同時に置換する。

### スタッツ導出の修正

「全部 `infrastructure.json` から導出」は成立しない。**nodes / running guests の 2 件のみ導出**、`certifications` は `profile.credentials.length`、`open inbound ports: 0` は数えられる事実ではないのでリテラル維持。また `/` で 32KB の `infrastructure.json` を追加 fetch することになり、`App.tsx` が `InfrastructurePage` を lazy 化している設計思想と逆行するため、**`infra` が null の間は既存の `value` リテラルをフォールバック表示**する（チラつきなし）。

### i18n 撤去作業の危険性（最重要）

`t()` は `labels?.[key] ?? ""` で、`I18nInfrastructure` が index signature を持つため、**キーを消しても型チェック・lint・build は全て通り、画面が静かに空白になる**。撤去対象は 48 キー、保持は 51 キー（分類は検証結果に準拠）。必ず以下のテストを**先に**入れてから撤去する:

- ja / en のキー集合一致（現在 113 vs 113 で一致）
- `InfrastructurePage.tsx` の `t("...")` 参照キーが両 JSON に存在すること（index signature で失われた型安全性をテストで復元）
- `infrastructure` セクションの全値が `/CT\d{3,4}|VM\d{3}|192\.168\.\d\./` にマッチしないこと（撤去完了後に有効化し、再混入を恒久的に防ぐ）

なお図 2 には **i18n 化されておらず言語切替しない行が 3 つ**ある（`:592` / `:615` / `:624`。`netSeg0Row4` / `netSeg1Row1` / `netSeg1Row4` が JSON に存在しない）。これも JSON 由来に寄せて解消する。

### ジオメトリ計算式（検証済み）

現行のリテラル群は `maxRows = 8` / `legendRows = 8` で下式と**厳密に一致**する（近似ではない）。これが式化の正当性の根拠であり、ゴールデン回帰テストの基準になる。

```
nodeY    = 185 + 35
rowY0    = nodeY + 63
nodeH    = 63 + (n-1)*46 + 40 + 20      // = 46n + 77  → n=8 で 445 ✓
clusterH = 35 + nodeH + 10              // = 46n + 122 → n=8 で 490 ✓
summaryY = 185 + clusterH + 20          //             → n=8 で 695 ✓
legendY  = summaryY + 118 + 20          //             → n=8 で 833 ✓
legendH  = 67 + (L-1)*30 + 23           //             → L=8 で 300 ✓
vbHeight = legendY + legendH + 17       //             → 1150 ✓
```

置換対象の座標リテラルは縦方向で約 40 箇所（`viewBox` / cluster `y,height` / node `y,height` ×3 / ノード名 y ×3 / HW ラベル y ×3 / サマリ箱 y ×4 + 内部 17 個 / 凡例 y,height,title y + 行 y ×8）。`y ≤ 130` のネットワーク帯は行数に非依存なので据え置き可。

### モバイルと文字サイズ

可変高化は**モバイル表示に影響しない**（viewBox 幅 1200 は不変、フォントの実効サイズは 1px も変わらない）。ただし **デスクトップで既に読めない**問題が別に存在する: 図の実効倍率は 0.657（デスクトップ）/ 0.547（480px 幅）で、`.dgm-row-note` の 10px は実効 6.6px、`.net-*` の 8px は 5.3px。行数が増える前に **`.dgm-row-*` のフォント底上げ（10→12px / 12→14px）と、デスクトップ側にも横スクロールを許す `min-width` 設定**が必要。
また **SVG 内の `font-size` はトークン化しない**（SVG 座標系の px と CSS の rem は意味が異なり、倍率計算が壊れる）。トークン化は `.infra-*`（DOM 側）に限定する。

---

## workload の用途（本人確認済み・2026-09-20）

サイト掲載時の説明はこれを出典にする。

| id | 名前 | 用途 |
|---|---|---|
| CT104 | `Discord-Pin-Service` | 各種通知などの **webhook 向け処理を統合した CT**。旧名 `pote-monitor` はパッと見で用途が分からないため改名した |
| CT109 | `Uir-bot` | **友人の Discord サーバーの管理 bot** を期限付きで受託実行している |
| CT701 | `media-server` | **NAS 兼 backup-nfs のディスク領域をローカルへ SMB で流す Samba**。名前は Jellyfin 用途で作ったときの由来で、現在はバックアップ + 音楽ファイル置き場 + 共有フォルダ |
| CT1000 | `Arb-bot` | アービトラージ bot。**開発・運用とも停止中**（CT 自体を削除してもよい状態） |
| VM1001 | `mochi-OS` | 注目している **MochiOS project の応援として自分でも動かすため**に配置。進捗を手で触って確認したいときだけ起動する |
| CT601 | `tango` | **要確認**（下記） |

### 未解決: CT601 `tango` の説明

本人からの説明は「Voicevox engine の演算部分を bot と分けて、読み上げでも他のサービスでも使えるように立てた」という内容だが、これは **VM600 `Voicevox-Engine`**（HP-1・qemu・サイトに既掲載）の説明に見える。CT601 `tango` は HP-1 の LXC（2 core / 4GB / 67GB、tags `ct;db;debian`）で、ZenNotes の `Tango Phase 1 現況メモ` では **JST 基準の間隔反復学習アプリ**として記録されている。**番号の取り違えの可能性があるため、実装時に本人へ再確認する**（推測で書かない）。

### 掲載方針（要判断）

- CT1000 `Arb-bot` は停止・開発停止のため、**サイトからは省く**のが妥当（「停止中」として載せる選択も可）
- VM1001 `mochi-OS` は**オンデマンド起動**である旨を添えて掲載すると、停止中であることが誤解にならない
- CT108 `Pens-Uptime-kuma`（他者に貸しているインスタンス）と、自分用 Uptime Kuma が友人の Proxmox 上にある（`uptime.warasugi.com`）ことの表現は未確認
- 廃止済みの CT700 `Headroom-Proxy` / `gethomepage` / ZenNotes CT / `Ai-radio` の記載削除可否は未確認

---

## 掲載方針の確定（本人確認済み・2026-09-20 / Proxmox WebUI のスクリーンショットで全 20 件を突合）

- **CT1000 `Arb-bot` はサイトから除外**する（開発・運用とも停止）
- **CT108 `Pens-Uptime-kuma` は本人のものではない** — 友人と**相互監視**するための Uptime Kuma で、相手側のインスタンスを自分のクラスタでホストしている。自分用の Uptime Kuma は友人の Proxmox 上にあり `uptime.warasugi.com` で公開。「自分の監視基盤」として書かないこと
- **VM1001 `mochi-OS`** はオンデマンド起動である旨を添えて掲載
- **VM600 `Voicevox-Engine`**: 読み上げ bot から**演算部分を分離**し、読み上げ以外のサービスからも使えるようにするために VM として独立させた（掲載文の根拠。現行の「VOICEVOX 音声合成エンジン」だけでは設計意図が伝わらない）

### 廃止済み（記載を削除する）とその理由

理由そのものが判断の記録として価値があるため、**インフラページに「撤去したもの」節を新設して残す**ことを提案する（動いているものだけを並べるより、取捨選択の判断が伝わる）。

| 撤去したもの | 理由 |
|---|---|
| CT700 `Headroom-Proxy` | メイン PC 上で動かす方が効率的だった |
| CT108 旧 `gethomepage` | 運用が面倒になった |
| ZenNotes CT | ローカルで十分だった |
| `Ai-radio` | リソース的な都合。面白いプロジェクトだったので**リベンジしたい**（ロードマップ側に置く候補） |

### 未解決（実装前に要確認）

- **CT601 `tango` の用途**。VM600 と 601 は別物であることがスクリーンショットで確定したため、「Voicevox の演算分離」の説明は VM600 のものとして扱った。601 は ZenNotes の `Tango Phase 1 現況メモ` では **JST 基準の間隔反復学習アプリ**（tags `ct;db;debian`、2core / 4GB / 67GB）だが、本人の確認が取れていない
