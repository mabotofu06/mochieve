export const APP_NAME = 'Mochieve';
export const APP_VERSION = '0.0.1';
export const APP_HOST = process.env.NEXT_PUBLIC_APP_HOST!;

export const API_INFO = {
  // HOST: "https://localhost",
  // PORT: 5000,
  ENDPOINT: {
    READINESS_HEALTH_CHECK: "/api/health",
    AUTH_CALLBACK: "/api/v1/callback/auth",
    LOGIN: "/api/v1/login",
    LOGOUT: "/api/v1/logout",
    CACHE_USER_INFO: "/api/v1/cache/user/info",
    // CACHE_USER_AUTH: "/api/v1/cache/user/auth",
    WORK_POST: "/api/v1/work/post",
    WORK_GROUP: "/api/v1/work/group",
    WORK_GROUP_FIND: "/api/v1/work/group/find",
    WORK_GROUP_CHECK: "/api/v1/work/group/check",
    USER: "/api/v1/user",
    USER_VALIDATION: "/api/v1/user/check",
    // USER_PROFILE: "/api/user/profile",
    // USER_UPDATE: "/api/user/update",
    // POST_CREATE: "/api/post/create",
    // POST_UPDATE: "/api/post/update",
    // POST_DELETE: "/api/post/delete",
    // POST_LIKE: "/api/post/like",
    // POST_UNLIKE: "/api/post/unlike",
    // POST_COMMENT: "/api/post/comment",
    // POST_SHARE: "/api/post/share",
  }
}

/**
 * 各種入力値のバリデーション定数
 */
export const VALIDATION_LENGTH = {
  USER_ID: {MIN: 5, MAX: 25},     // ユーザーID
  USER_NAME: {MIN: 2, MAX: 50},   // ユーザー名
  WORK_GROUP:{
    TITLE: {MIN: 0, MAX: 100},    // 作業グループタイトル
    NOTE:  {MIN: 0, MAX: 2000},   // 作業グループ説明文
    ON_WORKING: {MIN: 0, MAX: 3}, // 同時作業中の作業グループ最大数
    POST_NUM: {MIN: 1, MAX: 12}   // 1つの作業グループ内の投稿最大数
  },
  WORK_POST:{
    NOTE:  {MIN: 1, MAX: 150}     // 作業ポスト説明文
  }
}

export const DEFAULT_USER_ICON = process.env.DEFAULT_USER_ICON;

export const APP_SERVICE = {
  TOP: {
    title: `トップ | ${APP_NAME}`,
    description: "アプリのトップページ",
    icon: "home",
    link: "/"
  },
  USER_INFO: {
    title: `ユーザー | ${APP_NAME}`,
    description: "ユーザー情報",
    icon: "user",
    link: "/User"
  },
  MY_WORKS: {
    title: "マイプロジェクト",
    description: "自分が関わっているプロジェクト",
    icon: "project",
    link: "/$userId/Work"
  },
  WORKS: {
    title: "作業内容",
    description: "新しい作業内容を作成",
    icon: "post",
    link: "/Work/Group/$workGroupId"
  },
  PRIVACY_POLICY: {
    title: `プライバシーポリシー | ${APP_NAME}`,
    description: "プライバシーポリシー",
    icon: "privacy",
    link: "/Info/Policy"
  },
  WELLCOME: {
    title: `ようこそ | ${APP_NAME}`,
    description: "Wellcomeページ",
    icon: "welcome",
    link: "/Welcome"
  }
}

//TODO:今後利用想定
export const MY_WORK_NAV_MENU = {
  WORKING  : { label: "作業中", code: 1 },
  ALL      : { label: "すべて", code: 0 },
  DONE     : { label: "完了", code: 2 },
}

export const TOP_NAV_MENU = {
  WORKING: { label: "作業中の投稿", code: 1 },
  TODAY  : { label: "本日更新"    , code: 0 },
  DONE   : { label: "完了している投稿", code: 2 },
}

export const CACHE_INFO = {
  USER_INFO    : { key: "user_info"    , MAX_SIZE: 20 , expires: 60 * 60 * 24 * 30 },// 1 month
  TIMELINE_DATA: { key: "timeline_data", MAX_SIZE: 20, expires: 60 * 30      },     // 30 minutes
  MY_WORKS_DATA: { key: "my_works_data", MAX_SIZE: 20 , expires: 0 },
  CAN_NEW_POST : { key: "can_new_post" , MAX_SIZE: 1  , expires: 0 }
}