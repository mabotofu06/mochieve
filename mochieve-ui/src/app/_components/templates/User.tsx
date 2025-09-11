'use client'

import { OrganismsGroupCard } from "../organisms/GroupCard";
import { OrganismsTabMenu } from "../organisms/TabMenu";

const navigationMenu = [
  {label: "すべて"         , code: 0},
  {label: "作業中の投稿"    , code: 1},
  {label: "作業完了した投稿", code: 2},
]

const userInfo = {
  name     : "まーぼーどーふ",
  id       : "@mabotofu06",
  iconImage: "",
  info     : "説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文",
  links    : [
    { title: "リンク1", url: "https://example.com/1" },
    { title: "リンク2", url: "https://example.com/2" },
    { title: "リンク3", url: "https://example.com/3" },
  ]
};

export default function TemplatesUser() {
  const initialTab = navigationMenu[0].code;
  const iconSize = "w-25 h-25";

  return (<div></div>)

  // return (
  //   <div className="flex flex-col justify-between bg-white h-screen">
  //     <div className="h-[600px]">
  //       <div className="user-header w-full h-60 bg-green-500"></div>
  //       <div className="flex justify-between items-center">
  //         <div className="flex items-center p-4">
  //           <div className={`user-icon ${iconSize} bg-green-500 rounded-full`}></div>
  //           <div className='ml-4 text-3xl'>
  //             <h2 className="user-name font-semibold">{userInfo.name}</h2>
  //             <p className="user-id text-lg">{userInfo.id}</p>
  //           </div>
  //         </div>

  //         <button className="edit-button bg-green-500 text-white text-2xl py-2 px-4 rounded-3xl me-5">
  //           フォロー
  //         </button>
  //       </div>

  //       <div className="description mx-10 text-xl mb-5">
  //         <div className="mb-3">
  //           {userInfo.info}
  //         </div>

  //         <h3 className="text-lg font-semibold mb-2">外部サービス</h3>
  //         <div className="link flex flex-col text-base ms-5">
  //           {userInfo.links.map((link, index) => (
  //             <div key={index}>
  //               <span className="me-3">{link.title}:</span>
  //               <a key={index} href={link.url} className="">
  //                 {link.url}
  //               </a>
  //             </div>
  //           ))}
  //         </div>
  //       </div>

  //       {/* <div className="project-stats flex flex-col">
  //         <span className="font-semibold">作成したプロジェクト： 5</span>
  //         <span className="font-semibold">作業中のプロジェクト： 2</span>
  //         <span className="font-semibold">完了したプロジェクト： 3</span>
  //       </div> */}
  //     </div>

  //     <div className="flex flex-col" style={{height: "calc(100vh - 600px)"}}>
  //       <OrganismsTabMenu tabMenu={navigationMenu} activeTab={initialTab} onChange={()=>{}}>
  //         <div className="flex-1 overflow-y-auto">
  //           {/* {Array.from({ length: 5 }, (_, index) => (
  //             <OrganismsGroupCard className="mt-3" key={index} />
  //           ))} */}
  //         </div>
  //       </OrganismsTabMenu>
  //       {/* <NavigationTab activeTab={activeTab} onChange={setActiveTab} />
  //       <div className="flex-1 overflow-y-auto">
  //         {Array.from({ length: 5 }, (_, index) => (
  //           <OrganismsGroupCard className="mt-3" key={index} />
  //         ))}
  //       </div> */}
  //     </div>
  //   </div>
  // );
}