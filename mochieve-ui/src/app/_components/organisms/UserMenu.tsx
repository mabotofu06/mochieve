"use client";

import { useState } from "react";
import { AtomsIconVerticalArrow } from "../atoms/icon/VerticalArrow";
import { UserInfo } from "@/app/_type/data";
import { openLoginModal } from "@/app/_state/slice/modal";
import { store } from "@/app/_state/store";
import { getUserInfo } from "@/app/_composables/userInfo";


const guestMenuList = [
  {
    name: "ホーム",
    link: "/Top",
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 12l9-9 9 9M4 10v10h16V10" />
      </svg>
    )
  },{
    name: "ログイン",
    link: "/Top",
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 10.5a8.38 8.38 0 01-7.5 7.5A8.38 8.38 0 013 10.5V7a4 4 0 014-4h6a4 4 0 014 4v3.5z" />
        <path d="M8 15h8" />
      </svg>
    ),
    onClick: ()=>{ store.dispatch(openLoginModal()); }
  }
];

const userMenuList = [
  {
    name: "ホーム",
    link: "/Top",
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 12l9-9 9 9M4 10v10h16V10" />
      </svg>
    )
  },
  // {
  //   name: "プロフィール",
  //   link: "/User",
  //   icon: (
  //     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
  //       <path d="M12 8v4l3 3h-2l-3-3V8h2z" />
  //     </svg>
  //   )
  // },
  {
    name: "自分の投稿",
    link: "/Project/List",
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 10.5a8.38 8.38 0 01-7.5 7.5A8.38 8.38 0 013 10.5V7a4 4 0 014-4h6a4 4 0 014 4v3.5z" />
        <path d="M8 15h8" />
      </svg>),
    onClick: () => {
      const userId = getUserInfo()?.id
      location.href = `/${userId}/Work`
    }
  },
  // {
  //   name: "ブックマーク",
  //   link: "/Top",
  //   icon: (<AtomsIconBookmark />)
  // },
  // {
  //   name: "フォローしているユーザー",
  //   link: "/Top",
  //   icon: (
  //     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
  //       <path d="M21 10.5a8.38 8.38 0 01-7.5 7.5A8.38 8.38 0 013 10.5V7a4 4 0 014-4h6a4 4 0 014 4v3.5z" />
  //       <path d="M8 15h8" />
  //     </svg>
  //   )
  // },
  {
    name: "ログアウト",
    link: "/Top",
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 10.5a8.38 8.38 0 01-7.5 7.5A8.38 8.38 0 013 10.5V7a4 4 0 014-4h6a4 4 0 014 4v3.5z" />
        <path d="M8 15h8" />
      </svg>
    ),
    onClick: ()=>{
      if(typeof window === 'undefined') return;
      localStorage.removeItem("user_info");
      window.location.href = "/";
    }
  }
];

function getMenuItems(isGuest: boolean) {
  const navigateTo = (link: string) => {
    window.location.href = link;
  };

  return isGuest ? guestMenuList.map((item, index) => {
    return (
      <button
        className="flex items-center text-lg hover:bg-green-50 py-3 w-full"
        key={index}
        onClick={item.onClick ? item.onClick : () => navigateTo(item.link)}
      >
        {item.icon}
        {item.name}
      </button>
    );
  }) : userMenuList.map((item, index) => {
    return (
      <button
        className="flex items-center text-lg hover:bg-green-50 py-3 w-full"
        key={index}
        onClick={item.onClick ? item.onClick : () => navigateTo(item.link)}
      >
        {item.icon}
        {item.name}
      </button>
    );
  });
}

type Props = {
  userInfo?: UserInfo;
}

export const OrganismsUserMenu = (props: Props) => {
  const [open, setOpen] = useState(true);
  const iconSize = "w-10 h-10";

  return props.userInfo ? (
    <div>
      <div
        className="user-menu mt-5 p-3 flex items-center bg-white hover:opacity-80 hover:bg-green-100 justify-between"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center">
          <img className={"user-icon bg-green-800 rounded-full " + iconSize} src={props.userInfo?.iconImg} alt="User Icon" />
          <div className="user-info ml-6 flex flex-col justify-center text-md">
            <h2 className="user-name font-semibold">{props.userInfo?.name}</h2>
            <p className="user-id text-xs">{props.userInfo?.id }</p>
          </div>
        </div>

        <AtomsIconVerticalArrow up={!open} />
      </div>
      <div className={`user-menu-content ms-10 ${open ? "block" : "hidden"}`}>
        {getMenuItems(props.userInfo===undefined)}
      </div>
    </div>
  ):(
    <div>
      <div
        className="user-menu mt-5 p-3 flex items-center bg-white hover:opacity-80 hover:bg-green-100 justify-between"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center">
          <img className={"user-icon bg-green-800 rounded-full " + iconSize} />
          <div className="user-info ml-6 flex flex-col justify-center text-md">
            <h2 className="user-name font-semibold">{"ゲストユーザー"}</h2>
            <p className="user-id text-xs">{"@guest"}</p>
          </div>
        </div>

        <AtomsIconVerticalArrow up={!open} />
      </div>
      <div className={`user-menu-content ms-10 ${open ? "block" : "hidden"}`}>
        {getMenuItems(props.userInfo===undefined)}
      </div>
            {/* <AuthForm /> */}
    </div>
  );
};
