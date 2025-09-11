export const APP_NAME = 'Mochieve';
export const APP_VERSION = '0.0.1';
export const APP_HOST = process.env.NEXT_PUBLIC_APP_HOST!;

export const BL_INFO = {
  HOST: "https://localhost",
  PORT: 5000,
  API_ENDPOINT: {
    READINESS_HEALTH_CHECK: "/api/health",
    AUTH_CALLBACK: "/api/v1/callback/auth",
    LOGIN: "/api/v1/login",
    LOGOUT: "/api/v1/logout",
    GET_TIMELINE: "/api/v1/timeline/work",
    CACHE_USER_INFO: "/api/v1/cache/user/info",
    CACHE_USER_AUTH: "/api/v1/cache/user/auth",
    WORK_POST: "/api/v1/work/post",
    WORK_GROUP: "/api/v1/work/group",
    WORK_GROUP_CHECK: "/api/v1/work/group/check",
    // USER_REGISTER: "/api/user/register",
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

export const MAX_POST_NUM = 10;
export const MAX_WORKING_POST_NUM = 3;

export const APP_SERVICE = {
  TOP: {
    title: `トップ | ${APP_NAME}`,
    description: "アプリのトップページ",
    icon: "home",
    link: "/Top"
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
  }
}

export const MY_WORK_NAV_MENU = {
  ALL      : { label: "すべて", code: 0 },
  WORKING  : { label: "作業中", code: 1 },
  DONE     : { label: "完了", code: 2 },
}

export const TOP_NAV_MENU = {
  WORKING: { label: "作業中の投稿", code: 1 },
  TODAY  : { label: "本日更新"    , code: 0 },
  DONE   : { label: "完了した投稿", code: 2 },
}

export const CACHE_INFO = {
  USER_INFO    : { key: "user_info"    , MAX_SIZE: 20 , expires: 60 * 60 * 24 * 30 },// 1 month
  TIMELINE_DATA: { key: "timeline_data", MAX_SIZE: 100, expires: 60 * 30      },     // 30 minutes
  MY_WORKS_DATA: { key: "my_works_data", MAX_SIZE: 50 , expires: 60 * 60 * 24 }      // 1 day
}