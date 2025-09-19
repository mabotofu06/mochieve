import { CACHE_INFO } from "../app";
import { StorageCache } from "./session";

const canNewPost
  = new StorageCache<boolean>(
    CACHE_INFO.CAN_NEW_POST.key,
    CACHE_INFO.CAN_NEW_POST.MAX_SIZE,
    CACHE_INFO.CAN_NEW_POST.expires
  );

export const setCanNewPost = (canPost :boolean) => {
  canNewPost.set(canPost)
};

export const getCanNewPost = (): boolean | undefined=> {
  return canNewPost.get();
};

export const clearCanNewPost = () =>{
  canNewPost.clear();
}