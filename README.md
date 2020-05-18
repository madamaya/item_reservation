# 備品の利用予約をするWebサイト
誰かと共有している備品の利用予約をするためのサイトです．
herokuにデプロイしたもの → <https://mighty-crag-47595.herokuapp.com/>

利用にはユーザ認証が必要です．

# ユーザ認証
認証可能なユーザ名とパスワードの組は以下の通りです．

[ ユーザ名:パスワード ]
* admin:admin
* user1:password
* user2:password

ユーザadminには管理者権限があり，adminのみ実行可能な処理があります．

# 一般ユーザが実行可能な動作
* 予約一覧の表示
* 自分の予約の取り消し
* 備品の追加（備品名とコメントが設定可能）
* 備品名とコメントの編集（自分が追加した備品のみ）
* 備品の予約

# 管理者が実行可能な動作
管理者は一般ユーザが実行可能な動作に加えて，以下の動作を実行することができます．
* 全ての物品の削除
* 全ての物品の物品名とコメントの編集

# 今後の予定
* 予約ページの予約バーについて，指定した時間の予約バーを表示できるようにする．
