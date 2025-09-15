"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import OrganismsHeader from "./_components/organisms/Header";
import { Provider, useSelector } from "react-redux";
import { store } from "./_state/store";
import { OrganismsPostFormModal } from "./_components/organisms/modal/PostFormModal";
import OrganismsLoginForm from "./_components/organisms/modal/LoginForm";
import { OrganismsWellcomeModal } from "./_components/organisms/modal/WellcomeModal";
import { clearEditWorkGroupId } from "./_state/storage";
import { OrganismsGroupFormModal } from "./_components/organisms/modal/GroupFormModal";
import { OrganismsImageDetailModal } from "./_components/organisms/modal/ImageDetailModal";
import { OrganismsErrorModal } from "./_components/organisms/modal/ErrorModal";
import { OrganismsLoadingModal } from "./_components/organisms/modal/LoadingModal";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const headerHidePathList = [
  '/Invite',
  '/Redirect/Invite',
  '/Wellcome'
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [hideHeader, setHideHeader] =  useState(false)
  const [fetching, setFetching] = useState(true);

  useEffect(()=>{
    const location = window.location
    let hide = false;
    headerHidePathList.forEach((path)=>{
      hide = location.pathname.startsWith(path) || hide
    })
    setHideHeader(hide);
    setFetching(false);
  },[])
  
  clearEditWorkGroupId();

  // Providerは最上位でラップ
  return (
    <html lang="jp">
      <body
        className={`flex justify-center ${geistSans.variable} ${geistMono.variable} antialiased h-screen text-green-800${hideHeader ? " bg-lime-50" : ""}`}
      >
        <Provider store={store}>
          {!hideHeader && <OrganismsHeader />}
          <main className="w-[800px]">
            <GlobalLoading>
              {children}
            </GlobalLoading>
          </main>
          <OrganismsLoginForm />
          <OrganismsPostFormModal />
          <OrganismsGroupFormModal />
          <OrganismsImageDetailModal />
          <OrganismsErrorModal />
          <OrganismsLoadingModal />
          {/* <OrganismsWellcomeModal /> */}
        </Provider>
      </body>
    </html>
  );
}

function GlobalLoading({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loading: boolean = useSelector((state: {modal: {loading: boolean}}) => state.modal.loading);
  const iconSize: number = 52;

  return (
    <div className="relative w-full h-full">
      {children}
      {loading && (
        <div className="absolute top-0 flex flex-col justify-center items-center h-full w-full z-50 bg-white">
          <img
            width={iconSize}
            height={iconSize}
            src="/loading-icon.png"
            alt="spinner-frame-2"
            className="animate-[spin_3.5s_linear_infinite]"
          />
          Loading...
        </div>
      )}
    </div>
  );
}
