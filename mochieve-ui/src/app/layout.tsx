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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  clearEditWorkGroupId();

  // Providerは最上位でラップ
  return (
    <html lang="jp">
      <body
        className={`flex justify-center ${geistSans.variable} ${geistMono.variable} antialiased h-screen text-green-800 bg-white`}
      >
        <Provider store={store}>
          <OrganismsHeader />
          <main className="w-[800px] px-5">
            <GlobalLoading>
              {children}
            </GlobalLoading>
          </main>
          <OrganismsLoginForm />
          <OrganismsPostFormModal />
          <OrganismsGroupFormModal />
          <OrganismsImageDetailModal />
          <OrganismsErrorModal />
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

  return (
    <div className="relative w-full h-full">
      {children}
      {loading && (
        <div className="absolute top-0 flex justify-center items-center h-full w-full z-50 bg-white">
          Loading...
        </div>
      )}
    </div>
  );
}
