// import { Redis } from "@upstash/redis";

// export const redisClient: Redis = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL!,
//   token: process.env.UPSTASH_REDIS_REST_TOKEN!,//TODO:読込専用と分けるかは検討（現状R/Wともに可能）
// });

// export const writeRedis = async () => {
//   await redisClient.set("key", "value", { ex: 3600 });
// }