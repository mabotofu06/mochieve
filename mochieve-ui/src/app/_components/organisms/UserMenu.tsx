"use client";

import { createElement, useState } from "react";
import { AtomsIconVerticalArrow } from "../atoms/icon/VerticalArrow";
import { UserInfo } from "@/app/_type/data";
import { openLoginModal } from "@/app/_state/slice/modal";
import { store } from "@/app/_state/store";
import { getUserInfo } from "@/app/_composables/userInfo";
import { getFetch } from "@/app/_constants/fetch";
import { BL_INFO } from "@/app/_constants/app";
import { usePathname } from "next/navigation";


const guestMenuList = [
  {
    name: "ホーム",
    link: "/Top",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    )
  },{
    name: "ログイン",
    link: "/Login",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
      </svg>
    ),
    onClick: ()=>{ store.dispatch(openLoginModal()); }
  }
];

const userMenuList = () => {
  const userId = getUserInfo()?.id || undefined;
  return [
  {
    name: "ホーム",
    link: "/Top",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    )
  },{
    name: "自分の投稿",
    link: `/${userId}/Work`,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
    ),
    onClick: () => {
      const userId = getUserInfo()?.id
      location.href = `/${userId}/Work`
    }
  },{
    name: "ログアウト",
    link: "/Logout",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
      </svg>
    ),
    onClick: async ()=>{
      await getFetch(BL_INFO.API_ENDPOINT.LOGOUT);
      if(typeof window === 'undefined') return;
      localStorage.removeItem("user_info");
      window.location.href = "/";
    }
  }
];
}

function getMenuItems(pathName: string,  isGuest: boolean) {
  const navigateTo = (link: string) => {
    window.location.href = link;
  };

  const menuList = isGuest ? guestMenuList : userMenuList();

  return menuList.map((item, index) => {
    const isActive = pathName === item.link;

    return createElement(
      "button", {
        className: `flex items-center text-lg ps-10 py-3 w-full gap-2${isActive ? " font-extrabold text-green-500" : " hover:bg-green-50"}`,
        key: index,
        onClick: ()=>{
          if(isActive) return;
          item.onClick ? item.onClick() : navigateTo(item.link)
        }
      },
      [item.icon, item.name]
    )
  });
}

type Props = {
  userInfo?: UserInfo;
}

export const OrganismsUserMenu = (props: Props) => {
  const [open, setOpen] = useState(true);
  const iconSize = "w-10 h-10";

  const pathName = usePathname();
  const isGuest = !props.userInfo;
  const userInfo = getUserInfo() ?? { id: "guest", name: "ゲストユーザー", iconImg: "https://wzzpmyztchwnljdqzvkh.supabase.co/storage/v1/object/public/user-info-content/image.webp" };

  console.log(pathName, isGuest);

  return (
    <div>
      <div
        className="user-menu mt-5 p-3 flex items-center bg-white hover:opacity-80 hover:bg-green-100 justify-between"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center">
          <img className={"user-icon bg-green-800 rounded-full " + iconSize} src={userInfo.iconImg} alt="User Icon" />
          <div className="user-info ml-6 flex flex-col justify-center text-md">
            <h2 className="user-name font-semibold">{userInfo.name}</h2>
            <p className="user-id text-xs">{userInfo.id }</p>
          </div>
        </div>

        <AtomsIconVerticalArrow up={!open} />
      </div>
      <div className={`user-menu-content ${open ? "block" : "hidden"}`}>
        {getMenuItems(pathName, isGuest)}
      </div>
    </div>
  );
};
