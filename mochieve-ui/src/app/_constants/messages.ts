export const MESSAGES = {
  ERROR: {
    NETWORK: "ネットワークエラーが発生しました。時間をおいて再度お試しください。",
    UNEXPECTED: "予期せぬエラーが発生しました。時間をおいて再度お試しください。",
    AUTH: "認証に失敗しました。再度ログインしてください。",
    FORBIDDEN: "この操作を行うにはログインが必要です。",
    NOT_FOUND: "指定された投稿が見つかりません。",
    VALIDATION: "入力内容に誤りがあります。再度ご確認ください。",
    SERVER: "サーバーエラーが発生しました。時間をおいて再度お試しください。",
    TIMEOUT: "リクエストがタイムアウトしました。時間をおいて再度お試しください。",
    RATE_LIMIT: "リクエストが多すぎます。時間をおいて再度お試しください。",
  },
  SUCCESS: {
    LOGIN: "ログインに成功しました。",
    LOGOUT: "ログアウトに成功しました。",
    PROFILE_UPDATE: "プロフィールが更新されました。",
    POST_CREATE: "投稿が作成されました。",
    POST_UPDATE: "投稿が更新されました。",
    POST_DELETE: "投稿が削除されました。",
    POST_LIKE: "投稿にいいねしました。",
    POST_UNLIKE: "投稿のいいねを解除しました。",
    POST_COMMENT: "コメントが追加されました。",
    POST_SHARE: "投稿が共有されました。",
  },
  INFO: {
    LOADING: "読み込み中...",
    NO_DATA: "データがありません。",
    NO_MORE_DATA: "これ以上データはありません。",
  },
  WARN: {
    UNSAVED_CHANGES: "保存されていない変更があります。ページを離れますか？",
    SESSION_EXPIRED: "セッションが期限切れです。再度ログインしてください。",
  }
}