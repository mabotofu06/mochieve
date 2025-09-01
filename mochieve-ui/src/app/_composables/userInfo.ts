import { UserInfo } from "../_type/data";

export const setUserInfo = (userInfo: UserInfo) => {
  if(typeof window !== 'undefined'){
    window.localStorage.setItem('user_info', JSON.stringify(userInfo));
  }
}

export const getUserInfo = ():UserInfo|undefined => {
  if(typeof window !== 'undefined'){
    const userInfo = window.localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : undefined;
  }
  return undefined;
}