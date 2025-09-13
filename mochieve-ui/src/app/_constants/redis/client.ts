import { UserInfo } from "@/app/_type/data";
import { Redis } from "@upstash/redis";

export const redisClient: Redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,//TODO:読込専用と分けるかは検討（現状R/Wともに可能）
});

const writeRedis = async (key: string, value: string, expireSec: number) => {
  await redisClient.set(key, value, { ex: expireSec });
}

/**
 * Redisにアクセストークンを元にユーザ情報をセットする
 * @param accessToken 
 * @param userInfo 
 */
export const setUserInfoByToken = async (accessToken: string, userInfo: UserInfo) => {
  await writeRedis(accessToken, JSON.stringify(userInfo), 60 * 90); // 1.5 hours
};

/**
 * Redisからアクセストークンを元にユーザ情報を取得する
 * @param accessToken 
 * @returns 
 */
export const getUserInfoByToken = async (accessToken: string): Promise<UserInfo | null> => {
  //redisからの返却はJson型であるのでそのままでOK
  const data = await redisClient.get<UserInfo>(accessToken);
  if (!data) return null;
  return data;
};

/**
 * Redisからアクセストークンを元にユーザ情報を削除する
 * @param accessToken 
 */
export const deleteUserInfoByToken = async (accessToken: string): Promise<void> => {
  await redisClient.del(accessToken);
};