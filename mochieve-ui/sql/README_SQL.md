# Supabase SQL 実行手順と注意点

このフォルダには Supabase(Postgres) にテーブルを作成するための SQL スクリプト `supabase_create_tables.sql` が含まれます。

実行前の前提:
- Supabase プロジェクトが作成済みであること
- Supabase SQL エディタ、もしくは psql などの Postgres 接続手段があること
- このスクリプトは public スキーマにテーブルを作成します

実行方法（Supabase ダッシュボード）:
1. Supabase コンソールにログイン
2. 対象プロジェクトを選択
3. 左メニューの "SQL Editor" を開く
4. `supabase_create_tables.sql` の内容を貼り付けて実行

実行方法（psql を使用する場合）:
1. 環境変数または接続文字列を用いて psql に接続
   例: psql "postgres://postgres:password@dbhost:5432/postgres"
2. ファイルを実行
   psql -f ./sql/supabase_create_tables.sql

注意点:
- `pgcrypto` 拡張を有効化します（UUIDの生成に gen_random_uuid() を使っています）。Supabase ではデフォルトで利用可能ですが、権限によりCREATE EXTENSIONが失敗する場合は管理者に依頼してください。
- `images` カラムは text[] として扱っています。クライアント側で URL の配列を検証してください。
- 外部キーは ON DELETE CASCADE を設定しています。ユーザー／グループ削除時に関連データが消える点に注意してください。
- タイムゾーン付きタイムスタンプ（timestamptz）を使用しているため、時刻は UTC 基準で扱うのが安全です。
- 既存データがある場合はマイグレーション手順を検討してください（バックアップを必ず取得）。

カスタム化の提案:
- images に JSON 型や separate image table (work_group_images) を用いることで画像メタデータを保存できます。
- post の image カラムを複数画像対応にする場合は text[] へ変更または別テーブルを用意してください。

"Try it" コマンド例 (ローカル環境で psql を使う場合):
```powershell
# 接続してからファイル実行
psql "postgres://postgres:password@dbhost:5432/postgres" -f ./sql/supabase_create_tables.sql
```

完了後、Supabase ダッシュボードの Table Editor でテーブル構造を確認してください。
