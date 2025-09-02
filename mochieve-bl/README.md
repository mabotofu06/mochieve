## API一覧
論理名|リクエストメソッド|エンドポイント|備考
---|---|---|---
ログインAPI|POST|api/v1/login|
ログアウトAPI|GET|api/v1/logout|
タイムライン取得API|GET|api/v1/timeline|
以下、認証必須|---|---|---
マイ投稿取得API|GET|api/v1/mywork|
新規投稿API|POST|api/v1/work|
追加投稿API|PUT|api/v1/work|
投稿グループ編集API|PUT|api/v1/work/group|



## テーブル
supabaseのテーブルとストレージを使う

作業グループテーブル
物理名|型
---|---
group_id       | uuid
user_id        | varchar(25)
title          | varchar(50)
content        | string
images         | URL[]
close_flag     | boolean
create_datetime| timestanp
update_datetime| timestanp
delete_flag    | boolean
delete_datetime| timestanp

作業ポストテーブル
物理名|型
---|---
post_id        | uuid
group_id       | uuid
image          | URL
content        | string(varchar(200))
create_datetime| timestanp
update_datetime| timestanp
delete_flag    | boolean
delete_datetime| timestanp

ユーザ情報テーブル
物理名|型
---|---
user_id|string
user_name|string
icon_image|string
note|string


以下v0.1.xリリース======

リアクション情報テーブル
物理名|型
---|---
id
group_id
user_id
type

スタンプ情報テーブル(グループ)
物理名|型
---|---
id      | uuid
group_id| uuid
user_id | string
stamp_id| uuid

スタンプ情報テーブル(ポスト)
物理名|型
---|---
id      | uuid
post_id | uuid
user_id | string
stamp_id| uuid

スタンプ管理マスタ
物理名|型
---|---
id          | uuid 
stamp_image | string