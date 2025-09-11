"use client"
import { useState } from "react";
import { AtomsIconFace } from "../atoms/icon/Face";
import { useEffect, useRef } from "react";

type Props = {
  className?: string;
}

export const OrganismsStampButton = (props: Props)=>{
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.body.addEventListener("mousedown", handleClick);
    return () => {
      document.body.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen]);

  return (
    <div className={props.className}>
      <button
        className="stamp flex items-center gap-1 text-gray-600 hover:text-green-500 transition"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="スタンプ"
      >
      <AtomsIconFace className="text-green-700" size={25} />
    </button>
    {isOpen && (
      <div className="stamp-popup fixed z-50 transform bg-white p-4 rounded shadow-lg">
        <p>スタンプしました！</p>
      </div>
    )}
  </div>
);

}
