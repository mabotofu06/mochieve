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
  userInfo: UserInfo;
  note: string;
  image: string;
  createdAt: string;
}