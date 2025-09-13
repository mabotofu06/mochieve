"use client";
import React from "react";

type Props = {
  onClickCloseBtn: () => void;
  children: React.ReactNode;
}

export const MoleculesModal = (props: Props) => {
  return (
    <div className={`overlay`}>
      {/* モーダル */}
      <div className="flex flex-col max-h-4/5 overflow-y-auto">
        <div className="modal bg-white rounded-2xl p-5 min-w-[600px]">
          <div className="flex justify-end">
            <button
              className="text-center text-3xl font-semibold text-gray-600 hover:bg-gray-100 rounded-full w-[40px] h-[40px]"
              onClick={props.onClickCloseBtn}>
                ×
            </button>
          </div>
          {props.children}
        </div>
      </div>
    </div>
  );
};