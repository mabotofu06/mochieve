export interface LinkItem {
  name: string;
  link: string;
}

export interface UserDataBase {
  id: string;
  name: string;
  iconImg: string;
  info: string;
}

export interface UserData extends UserDataBase {
  headerImg: string,
  links: Array<LinkItem>,
}

export interface UserInfo {
  id: string;
  name: string;
  iconImg: string;
}

export interface AuthUserInfo {
  token: string;
  uid: string;
  avatarUrl: string;
  userName: string;
}

export interface WorkGroup {
  id: string;
  userInfo: UserInfo;
  title: string;
  note : string;
  images: Array<string>;
  isClose: boolean;
  updatedAt: string;
}

export interface WorkPost {
  id: string;
  userId: string;
  note: string;
  image: string;
  createdAt: string;
}

export interface UserCreateData {
  token: string;
  inviteCode: string;
  uid: string;
  userId: string;
  userName: string;
  iconImgUrl: string;
}